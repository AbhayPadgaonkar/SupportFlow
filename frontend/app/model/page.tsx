import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ModelMonitorPage() {
  // ---------- DUMMY DATA ----------
  const modelStats = [
    { label: "Model Version", value: "SLM-IT-v1.3" },
    { label: "Avg Inference Time", value: "182 ms" },
    { label: "Requests / min", value: "96" },
    { label: "Error Rate", value: "0.8%" },
  ];

  const qualityMetrics = [
    { label: "Avg RAG Confidence", value: "0.74" },
    { label: "Auto-Resolution Rate", value: "64%" },
    { label: "Escalation Rate", value: "18%" },
  ];

  const recentDecisions = [
    {
      ticketId: "T-1021",
      confidence: 0.91,
      action: "Auto-Resolved",
    },
    {
      ticketId: "T-1020",
      confidence: 0.56,
      action: "Needs Review",
    },
    {
      ticketId: "T-1019",
      confidence: 0.42,
      action: "Escalated",
    },
  ];

  // ---------- UI ----------
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Model Monitor</h1>

      {/* MODEL HEALTH */}
      <div className="grid grid-cols-4 gap-6">
        {modelStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* QUALITY METRICS */}
      <Card>
        <CardHeader>
          <CardTitle>Model Quality Metrics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-6">
          {qualityMetrics.map((metric) => (
            <div key={metric.label}>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* RECENT MODEL DECISIONS */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Model Decisions</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left text-muted-foreground">
                <th className="pb-2">Ticket ID</th>
                <th className="pb-2">Confidence</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentDecisions.map((d) => (
                <tr key={d.ticketId} className="border-b last:border-0">
                  <td className="py-2">{d.ticketId}</td>
                  <td>{d.confidence}</td>
                  <td>
                    <Badge
                      variant={
                        d.action === "Auto-Resolved"
                          ? "secondary"
                          : d.action === "Needs Review"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {d.action}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
