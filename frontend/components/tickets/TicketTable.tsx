import { SLMTicket } from "@/lib/types";
import ConfidenceBadge from "./ConfidenceBadge"

export default function TicketTable({ tickets }: { tickets: SLMTicket[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <table className="w-full text-sm">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="p-3 text-left">Ticket</th>
            <th className="p-3">Category</th>
            <th className="p-3">Priority</th>
            <th className="p-3">Confidence</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id} className="border-b hover:bg-slate-50">
              <td className="p-3 font-medium">{t.summary}</td>
              <td className="p-3">{t.category}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${
                    t.priority === "high"
                      ? "bg-red-500"
                      : t.priority === "medium"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                >
                  {t.priority.toUpperCase()}
                </span>
              </td>
              <td className="p-3">
                <ConfidenceBadge value={t.rag_confidence} />
              </td>
              <td className="p-3">{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
