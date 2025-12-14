"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from "@/components/ui/chart";

type CategoryKey =
  | "Service Outages"
  | "VPN / Network"
  | "Identity & Access"
  | "Hardware";

export default function AnalyticsPage() {
  const ticketsByCategory: { name: CategoryKey; value: number }[] = [
    { name: "Service Outages", value: 42 },
    { name: "VPN / Network", value: 28 },
    { name: "Identity & Access", value: 18 },
    { name: "Hardware", value: 12 },
  ];

  const ticketsByPriority = [
    { priority: "Low", count: 35 },
    { priority: "Medium", count: 45 },
    { priority: "High", count: 20 },
  ];

 const categoryConfig: Record<
  CategoryKey | "value",
  { label: string; color?: string }
> = {
  value: { label: "Tickets" },
  "Service Outages": {
    label: "Service Outages",
    color: "var(--chart-1)",
  },
  "VPN / Network": {
    label: "VPN / Network",
    color: "var(--chart-2)",
  },
  "Identity & Access": {
    label: "Identity & Access",
    color: "var(--chart-3)",
  },
  Hardware: {
    label: "Hardware",
    color: "var(--chart-4)",
  },
}


  const priorityConfig = {
    count: {
      label: "Tickets",
      color: "var(--chart-1)",
    },
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Tickets by Category */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h3 className="font-semibold mb-4 text-foreground">
          Tickets by Category
        </h3>

        <ChartContainer config={categoryConfig} className="h-64">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={ticketsByCategory}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              stroke="none"
            >
              {ticketsByCategory.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={categoryConfig[entry.name].color}
                />
              ))}
            </Pie>

            <ChartLegend />
          </PieChart>
        </ChartContainer>
      </div>

      {/* Tickets by Priority */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h3 className="font-semibold mb-4 text-foreground">
          Tickets by Priority
        </h3>

        <ChartContainer config={priorityConfig} className="h-64">
          <BarChart data={ticketsByPriority}>
            <XAxis dataKey="priority" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              fill="var(--chart-1)"
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
