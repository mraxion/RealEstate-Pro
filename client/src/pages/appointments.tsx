import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { AppointmentList } from "@/components/appointments/appointment-list";

export default function Appointments() {
  return (
    <DashboardLayout title="Citas">
      <AppointmentList />
    </DashboardLayout>
  );
}
