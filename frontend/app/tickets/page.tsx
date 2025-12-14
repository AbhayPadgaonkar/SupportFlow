import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tickets = [
  {
    id: "T-1021",
    title: "VPN connectivity issue",
    category: "VPN / Network",
    priority: "High",
    status: "Escalated",
  },
  {
    id: "T-1020",
    title: "Email login not working",
    category: "Identity & Access",
    priority: "Medium",
    status: "Needs Review",
  },
  {
    id: "T-1019",
    title: "Printer not responding",
    category: "Hardware",
    priority: "Low",
    status: "Auto-Resolved",
  },
];

export default function TicketsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tickets</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left text-muted-foreground">
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-b last:border-0">
                  <td className="py-2">
                    <Link
                      href={`/tickets/${t.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {t.id}
                    </Link>
                  </td>
                  <td>{t.title}</td>
                  <td>{t.category}</td>
                  <td>
                    <Badge
                      variant={
                        t.priority === "High"
                          ? "destructive"
                          : t.priority === "Medium"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {t.priority}
                    </Badge>
                  </td>
                  <td>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
