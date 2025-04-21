import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { WorkflowStatus } from "@/components/dashboard/workflow-status";
import { PropertyList } from "@/components/property/property-list";
import { Property, Lead, Appointment, Workflow } from "@shared/schema";
import { Building, Users, Calendar, CheckCircle } from "lucide-react";

export default function Dashboard() {
  // Fetch all properties, leads, appointments
  const { data: properties } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  const { data: leads } = useQuery<Lead[]>({
    queryKey: ['/api/leads'],
  });
  
  const { data: appointments } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments'],
  });
  
  const { data: workflows } = useQuery<Workflow[]>({
    queryKey: ['/api/workflows'],
  });
  
  // Calculate the number of properties that have been sold/rented
  const conversions = properties?.filter(
    (property) => property.status === "sold" || property.status === "rented"
  ).length || 0;

  return (
    <DashboardLayout title="Dashboard">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Propiedades"
          value={properties?.length || 0}
          icon={<Building className="h-6 w-6 text-primary-600" />}
          changeValue={12.5}
        />
        
        <StatCard
          title="Leads activos"
          value={leads?.length || 0}
          icon={<Users className="h-6 w-6 text-primary-600" />}
          changeValue={8.3}
        />
        
        <StatCard
          title="Citas Agendadas"
          value={appointments?.length || 0}
          icon={<Calendar className="h-6 w-6 text-primary-600" />}
          changeValue={-4.2}
        />
        
        <StatCard
          title="Conversiones"
          value={conversions}
          icon={<CheckCircle className="h-6 w-6 text-primary-600" />}
          changeValue={24.5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Properties List */}
        <div className="lg:col-span-2">
          <PropertyList />
        </div>
        
        {/* Activity Feed and Workflow Status */}
        <div className="lg:col-span-1 space-y-6">
          <ActivityFeed />
          <WorkflowStatus />
        </div>
      </div>
    </DashboardLayout>
  );
}
