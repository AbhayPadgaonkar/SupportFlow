export type Priority = "low" | "medium" | "high";

export interface SLMTicket {
  id: string;
  summary: string;
  category: string;
  priority: Priority;
  reply: string;
  rag_context: string;
  rag_confidence: number;
  status: "auto-resolved" | "needs-review" | "escalated";
  created_at: string;
}
