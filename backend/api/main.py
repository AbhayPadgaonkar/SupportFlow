import torch
import torch.nn as nn
import pandas as pd
import os
import sys
import re
from tokenizers import Tokenizer
from sentence_transformers import SentenceTransformer
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from typing import Optional

CHECKPOINT_PATH = "../model/checkpoints_inst/inst_tune_final.pt"
TOKENIZER_FILE = "../tokens/tokenizer.json"
KB_FILE = "../prepared/kb_chunks.jsonl"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

CMD_CHAT = "Respond as an IT support assistant."
CMD_CLASSIFY = "Categorize the IT support ticket."
CMD_PRIORITY = "Determine if the ticket is high, medium, or low priority."

class RMSNorm(nn.Module):
    def __init__(self, dim, eps=1e-5):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(dim))
    def forward(self, x):
        x = x.float()
        norm = x.pow(2).mean(-1, keepdim=True)
        return x * torch.rsqrt(norm + self.eps).type_as(x) * self.weight

class MultiHeadSelfAttention(nn.Module):
    def __init__(self, dim, num_heads):
        super().__init__()
        self.num_heads = num_heads
        self.head_dim = dim // num_heads
        self.qkv = nn.Linear(dim, dim * 3)
        self.proj = nn.Linear(dim, dim)
    def forward(self, x, mask, rope_sin, rope_cos):
        B, T, C = x.shape
        qkv = self.qkv(x)
        q, k, v = qkv.chunk(3, dim=-1)
        q = q.view(B, T, self.num_heads, self.head_dim).transpose(1, 2)
        k = k.view(B, T, self.num_heads, self.head_dim).transpose(1, 2)
        v = v.view(B, T, self.num_heads, self.head_dim).transpose(1, 2)
        def apply_rope(x, sin, cos):
            def rotate_half(x):
                x1 = x[..., :x.shape[-1]//2]
                x2 = x[..., x.shape[-1]//2:]
                return torch.cat([-x2, x1], dim=-1)
            return (x * cos) + (rotate_half(x) * sin)
        rope_sin = rope_sin[:, :, :T, :]
        rope_cos = rope_cos[:, :, :T, :]
        q = apply_rope(q, rope_sin, rope_cos)
        k = apply_rope(k, rope_sin, rope_cos)
        att = (q @ k.transpose(-2, -1)) / (self.head_dim ** 0.5)
        att = att.masked_fill(mask == 0, float('-inf'))
        att = torch.softmax(att, dim=-1)
        y = att @ v
        return self.proj(y.transpose(1, 2).contiguous().view(B, T, C))

class SwiGLU(nn.Module):
    def __init__(self, dim, hidden_dim):
        super().__init__()
        self.w1 = nn.Linear(dim, hidden_dim)
        self.w2 = nn.Linear(dim, hidden_dim)
        self.w3 = nn.Linear(hidden_dim, dim)
    def forward(self, x):
        return self.w3(torch.nn.functional.silu(self.w1(x)) * self.w2(x))

class TransformerBlock(nn.Module):
    def __init__(self, dim, num_heads, ffn_dim):
        super().__init__()
        self.norm1 = RMSNorm(dim)
        self.attn = MultiHeadSelfAttention(dim, num_heads)
        self.norm2 = RMSNorm(dim)
        self.ffn = SwiGLU(dim, ffn_dim)
    def forward(self, x, mask, rope_sin, rope_cos):
        x = x + self.attn(self.norm1(x), mask, rope_sin, rope_cos)
        x = x + self.ffn(self.norm2(x))
        return x

class TransformerLM(nn.Module):
    def __init__(self, vocab_size=16000, dim=256, num_layers=6, num_heads=8, ffn_dim=1024, max_seq_len=512):
        super().__init__()
        self.token_emb = nn.Embedding(vocab_size, dim)
        self.blocks = nn.ModuleList([TransformerBlock(dim, num_heads, ffn_dim) for _ in range(num_layers)])
        self.norm = RMSNorm(dim)
        self.lm_head = nn.Linear(dim, vocab_size, bias=False)
        self.lm_head.weight = self.token_emb.weight
        self.head_dim = dim // num_heads
        pos = torch.arange(max_seq_len)
        freqs = 1.0 / (10000 ** (torch.arange(0, self.head_dim, 2) / self.head_dim))
        sinusoid = torch.einsum("i,j->ij", pos, freqs)
        rope_sin = torch.cat([sinusoid.sin(), sinusoid.sin()], dim=-1)
        rope_cos = torch.cat([sinusoid.cos(), sinusoid.cos()], dim=-1)
        self.register_buffer("rope_sin", rope_sin.unsqueeze(0).unsqueeze(0))
        self.register_buffer("rope_cos", rope_cos.unsqueeze(0).unsqueeze(0))
    def forward(self, idx):
        B, T = idx.shape
        x = self.token_emb(idx)
        mask = torch.tril(torch.ones((1, 1, T, T), device=idx.device))
        rope_sin = self.rope_sin[:, :, :T, :]
        rope_cos = self.rope_cos[:, :, :T, :]
        for blk in self.blocks:
            x = blk(x, mask, rope_sin, rope_cos)
        return self.lm_head(self.norm(x))

class SupportBot:
    def __init__(self):
        self.tokenizer = Tokenizer.from_file(TOKENIZER_FILE)
        self.model = TransformerLM().to(DEVICE)
        ckpt = torch.load(CHECKPOINT_PATH, map_location=DEVICE)
        self.model.load_state_dict(ckpt["model_state_dict"])
        self.model.eval()
        if os.path.exists(KB_FILE):
            df = pd.read_json(KB_FILE, lines=True)
            self.kb_docs = df["text"].tolist()
            self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
            self.kb_embeddings = self.embedder.encode(self.kb_docs, convert_to_tensor=True)
        else:
            self.kb_docs = []
    def search_rag(self, query, threshold=0.60):
        if not self.kb_docs:
            return None, 0.0
        q = self.embedder.encode(query, convert_to_tensor=True)
        scores = torch.mm(q.unsqueeze(0), self.kb_embeddings.transpose(0, 1))[0]
        top = torch.topk(scores, k=1)
        score = top.values[0].item()
        idx = top.indices[0].item()
        if score > threshold:
            return self.kb_docs[idx], score
        return None, score
    def clean_text(self, text):
        text = re.sub(r"http\S+", "", text)
        return text.replace("\r", " ").replace("\n", " ").strip()
    def predict(self, user_input, mode="chat"):
        clean_in = self.clean_text(user_input)
        rag_context = ""
        rag_text_out = None
        rag_score_out = 0.0
        primer = ""
        if mode == "classify":
            instruction = CMD_CLASSIFY
            max_tokens = 15
            temperature = 0.1
        elif mode == "priority":
            instruction = CMD_PRIORITY
            max_tokens = 10
            temperature = 0.1
        else:
            instruction = CMD_CHAT
            max_tokens = 200
            temperature = 0.2
            primer = "Dear"
            hit_text, hit_score = self.search_rag(clean_in, threshold=0.60)
            if hit_text:
                rag_text_out = hit_text
                rag_score_out = hit_score
                clean_hit = hit_text.replace("User:", "").replace("Assistant:", "")
                rag_context = f"{clean_hit[:120]}"
        final_input = ""
        if rag_context:
            final_input += f"Additional context (use only if relevant): {rag_context}\n\n"
        final_input += f"Ticket: {clean_in}"
        prompt = (
            f"{instruction}\n"
            f"{final_input}\n\n"
            f"### Response:\n"
            f"{primer}"
        )
        ids = self.tokenizer.encode(prompt).ids
        idx = torch.tensor(ids, dtype=torch.long, device=DEVICE).unsqueeze(0)
        out_text = primer
        eos_id = self.tokenizer.token_to_id("</s>")
        for _ in range(max_tokens):
            with torch.no_grad():
                logits = self.model(idx)
            logits = logits[:, -1, :]
            probs = torch.softmax(logits / temperature, dim=-1)
            idx_next = torch.multinomial(probs, num_samples=1)
            if eos_id is not None and idx_next.item() == eos_id:
                break
            token = self.tokenizer.decode([idx_next.item()])
            out_text += token
            idx = torch.cat((idx, idx_next), dim=1)
            if idx.shape[1] >= 512:
                break
        return out_text.strip(), rag_text_out, rag_score_out

bot = SupportBot()
app = FastAPI(title="SupportFlow API")

class TicketRequest(BaseModel):
    ticket_text: str

class TicketResponse(BaseModel):
    category: str
    priority: str
    reply: str
    rag_context: Optional[str] = None
    rag_confidence: float = 0.0

@app.post("/predict", response_model=TicketResponse)
async def predict_ticket(request: TicketRequest):
    try:
        user_in = request.ticket_text
        cat, _, _ = bot.predict(user_in, "classify")
        prio, _, _ = bot.predict(user_in, "priority")
        reply, rag_text, rag_score = bot.predict(user_in, "chat")
        return {
            "category": cat,
            "priority": prio,
            "reply": reply,
            "rag_context": rag_text,
            "rag_confidence": round(rag_score, 4)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
