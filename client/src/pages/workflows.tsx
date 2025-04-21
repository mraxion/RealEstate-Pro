import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { WorkflowList } from "@/components/workflows/workflow-list";

export default function Workflows() {
  return (
    <DashboardLayout title="Flujos de Trabajo">
      <WorkflowList />
    </DashboardLayout>
  );
}
