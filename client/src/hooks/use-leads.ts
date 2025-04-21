import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Lead } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useLeads() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all leads
  const leadsQuery = useQuery<Lead[]>({
    queryKey: ['/api/leads'],
  });

  // Fetch single lead
  const useLead = (id: number) => {
    return useQuery<Lead>({
      queryKey: ['/api/leads', id],
      enabled: !!id,
    });
  };

  // Create lead
  const createLeadMutation = useMutation({
    mutationFn: async (leadData: any) => {
      const response = await apiRequest('POST', '/api/leads', leadData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      toast({
        title: "Lead creado",
        description: "El lead ha sido creado correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo crear el lead: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update lead
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, leadData }: { id: number; leadData: any }) => {
      const response = await apiRequest('PUT', `/api/leads/${id}`, leadData);
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/leads', variables.id] });
      toast({
        title: "Lead actualizado",
        description: "El lead ha sido actualizado correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo actualizar el lead: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete lead
  const deleteLeadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/leads/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      toast({
        title: "Lead eliminado",
        description: "El lead ha sido eliminado correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo eliminar el lead: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    leads: leadsQuery.data || [],
    isLoading: leadsQuery.isLoading,
    error: leadsQuery.error,
    useLead,
    createLead: createLeadMutation.mutate,
    isCreating: createLeadMutation.isPending,
    updateLead: updateLeadMutation.mutate,
    isUpdating: updateLeadMutation.isPending,
    deleteLead: deleteLeadMutation.mutate,
    isDeleting: deleteLeadMutation.isPending,
  };
}

export default useLeads;
