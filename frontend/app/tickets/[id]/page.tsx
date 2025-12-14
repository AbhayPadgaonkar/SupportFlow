import { SLMTicket } from "@/lib/types";

const mockTicket: SLMTicket = {
  id: "1",
  summary: "VPN connectivity issue",
  category: "Service Outages and Maintenance",
  priority: "medium",
  reply: "Dear user, please share router model...",
  rag_context: "VPN router issues after config change...",
  rag_confidence: 0.67,
  status: "needs-review",
  created_at: "",
};

export default function TicketDetailPage() {
  const t = mockTicket;

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left */}
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold mb-2">User Issue</h3>
        <p className="text-sm text-slate-600">{t.summary}</p>

        <h4 className="mt-6 font-semibold">RAG Context Used</h4>
        <pre className="mt-2 p-3 bg-slate-100 rounded text-xs">
          {t.rag_context}
        </pre>
      </div>

      {/* Right */}
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold mb-2">AI Decision</h3>

        <p><b>Category:</b> {t.category}</p>
        <p><b>Priority:</b> {t.priority}</p>

        <h4 className="mt-4 font-semibold">Generated Reply</h4>
        <textarea
          defaultValue={t.reply}
          className="w-full h-32 mt-2 p-3 border rounded"
        />

        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded">
            Approve & Send
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded">
            Escalate
          </button>
        </div>
      </div>
    </div>
  );
}
