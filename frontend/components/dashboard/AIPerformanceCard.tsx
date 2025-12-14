import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { label: "Avg RAG Confidence", value: "0.74" },
  { label: "Auto-Resolution Rate", value: "64%" },
  { label: "Escalation Rate", value: "18%" },
];

export default function AIPerformanceCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((m) => (
          <div key={m.label}>
            <p className="text-sm text-muted-foreground">{m.label}</p>
            <p className="text-xl font-semibold">{m.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
