import KPICard from "./KPICard";

const kpis = [
  { title: "Total Tickets (24h)", value: 128 },
  { title: "Auto-Resolved", value: 82 },
  { title: "Needs Review", value: 31 },
  { title: "SLA Breaches", value: 5 },
];

export default function KPISection() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <KPICard
          key={kpi.title}
          title={kpi.title}
          value={kpi.value}
        />
      ))}
    </div>
  );
}
