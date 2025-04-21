import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useProperties() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all properties
  const propertiesQuery = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  // Fetch single property
  const useProperty = (id: number) => {
    return useQuery<Property>({
      queryKey: ['/api/properties', id],
      enabled: !!id,
    });
  };

  // Create property
  const createPropertyMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest('POST', '/api/properties', formData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({
        title: "Propiedad creada",
        description: "La propiedad ha sido creada correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo crear la propiedad: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update property
  const updatePropertyMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const response = await apiRequest('PUT', `/api/properties/${id}`, formData);
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/properties', variables.id] });
      toast({
        title: "Propiedad actualizada",
        description: "La propiedad ha sido actualizada correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo actualizar la propiedad: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete property
  const deletePropertyMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/properties/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({
        title: "Propiedad eliminada",
        description: "La propiedad ha sido eliminada correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo eliminar la propiedad: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    properties: propertiesQuery.data || [],
    isLoading: propertiesQuery.isLoading,
    error: propertiesQuery.error,
    useProperty,
    createProperty: createPropertyMutation.mutate,
    isCreating: createPropertyMutation.isPending,
    updateProperty: updatePropertyMutation.mutate,
    isUpdating: updatePropertyMutation.isPending,
    deleteProperty: deletePropertyMutation.mutate,
    isDeleting: deletePropertyMutation.isPending,
  };
}

export default useProperties;
