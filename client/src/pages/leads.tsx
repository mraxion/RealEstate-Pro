import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { LeadList } from "@/components/leads/lead-list";

export default function Leads() {
  return (
    <DashboardLayout title="Leads">
      <LeadList />
    </DashboardLayout>
  );
}
