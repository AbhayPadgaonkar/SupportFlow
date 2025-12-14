import KPISection from "@/components/dashboard/KPISection";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import AIPerformanceCard from "@/components/dashboard/AIPerformanceCard";
import RecentTicketsTable from "@/components/dashboard/RecentTicketsTable";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <KPISection />

      <div className="grid grid-cols-3 gap-6">
        <AlertsPanel />
        <AIPerformanceCard />
      </div>

      <RecentTicketsTable />
    </div>
  );
}
