import { useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PropertyForm } from "@/components/property/property-form";
import { useProperties } from "@/hooks/use-properties";

export default function PropertyCreate() {
  const [, navigate] = useLocation();
  const { createProperty, isCreating } = useProperties();

  const handleSubmit = (formData: FormData) => {
    createProperty(formData, {
      onSuccess: () => {
        navigate("/properties");
      }
    });
  };

  return (
    <DashboardLayout title="Crear Propiedad">
      <PropertyForm
        onSubmit={handleSubmit}
        isSubmitting={isCreating}
      />
    </DashboardLayout>
  );
}
