import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PropertyList } from "@/components/property/property-list";

export default function Properties() {
  return (
    <DashboardLayout title="Propiedades">
      <PropertyList />
    </DashboardLayout>
  );
}
