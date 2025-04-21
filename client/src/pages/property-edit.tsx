import { useParams, useLocation } from "wouter";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PropertyForm } from "@/components/property/property-form";
import { useProperties } from "@/hooks/use-properties";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function PropertyEdit() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { useProperty, updateProperty, isUpdating } = useProperties();
  const { data: property, isLoading, error } = useProperty(parseInt(id));

  const handleSubmit = (formData: FormData) => {
    updateProperty({ id: parseInt(id), formData }, {
      onSuccess: () => {
        navigate(`/properties/${id}`);
      }
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Editar Propiedad">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Cargando información de la propiedad...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !property) {
    return (
      <DashboardLayout title="Error">
        <Card className="w-full max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">Error al cargar la propiedad</h1>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              No se ha podido cargar la información de la propiedad. Por favor, inténtelo de nuevo.
            </p>
            
            <div className="mt-6">
              <Button onClick={() => navigate("/properties")}>
                Volver a Propiedades
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Editar Propiedad">
      <PropertyForm
        initialData={property}
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
      />
    </DashboardLayout>
  );
}
