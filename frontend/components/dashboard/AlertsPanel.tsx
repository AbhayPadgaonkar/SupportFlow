import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const alerts = [
  {
    id: 1,
    type: "High Priority",
    message: "VPN outage affecting Marketing Dept",
    severity: "high",
  },
  {
    id: 2,
    type: "Low Confidence",
    message: "AI confidence < 0.55 on Identity ticket",
    severity: "medium",
  },
];

export default function AlertsPanel() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Critical Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between border rounded-lg p-3"
          >
            <div>
              <p className="font-medium">{alert.type}</p>
              <p className="text-sm text-muted-foreground">
                {alert.message}
              </p>
            </div>
            <Badge
              variant={
                alert.severity === "high"
                  ? "destructive"
                  : "secondary"
              }
            >
              {alert.severity.toUpperCase()}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
