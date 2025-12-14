import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tickets = [
  {
    id: "T-1021",
    category: "Service Outage",
    priority: "High",
    status: "Escalated",
  },
  {
    id: "T-1020",
    category: "VPN / Network",
    priority: "Medium",
    status: "Auto-Resolved",
  },
  {
    id: "T-1019",
    category: "Identity & Access",
    priority: "Low",
    status: "Resolved",
  },
  {
    id: "T-1018",
    category: "Hardware",
    priority: "Medium",
    status: "Needs Review",
  },
];

export default function RecentTicketsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr className="text-left text-muted-foreground">
              <th className="pb-2">Ticket ID</th>
              <th className="pb-2">Category</th>
              <th className="pb-2">Priority</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="border-b last:border-0">
                <td className="py-2">{t.id}</td>
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
  );
}
