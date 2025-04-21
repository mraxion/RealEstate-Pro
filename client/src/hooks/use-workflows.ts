import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Workflow } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useWorkflows() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all workflows
  const workflowsQuery = useQuery<Workflow[]>({
    queryKey: ['/api/workflows'],
  });

  // Fetch single workflow
  const useWorkflow = (id: number) => {
    return useQuery<Workflow>({
      queryKey: ['/api/workflows', id],
      enabled: !!id,
    });
  };

  // Create workflow
  const createWorkflowMutation = useMutation({
    mutationFn: async (workflowData: any) => {
      const response = await apiRequest('POST', '/api/workflows', workflowData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
      toast({
        title: "Flujo de trabajo creado",
        description: "El flujo de trabajo ha sido creado correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo crear el flujo de trabajo: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update workflow
  const updateWorkflowMutation = useMutation({
    mutationFn: async ({ id, workflowData }: { id: number; workflowData: any }) => {
      const response = await apiRequest('PUT', `/api/workflows/${id}`, workflowData);
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
      queryClient.invalidateQueries({ queryKey: ['/api/workflows', variables.id] });
      toast({
        title: "Flujo de trabajo actualizado",
        description: "El flujo de trabajo ha sido actualizado correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo actualizar el flujo de trabajo: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete workflow
  const deleteWorkflowMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/workflows/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
      toast({
        title: "Flujo de trabajo eliminado",
        description: "El flujo de trabajo ha sido eliminado correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo eliminar el flujo de trabajo: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    workflows: workflowsQuery.data || [],
    isLoading: workflowsQuery.isLoading,
    error: workflowsQuery.error,
    useWorkflow,
    createWorkflow: createWorkflowMutation.mutate,
    isCreating: createWorkflowMutation.isPending,
    updateWorkflow: updateWorkflowMutation.mutate,
    isUpdating: updateWorkflowMutation.isPending,
    deleteWorkflow: deleteWorkflowMutation.mutate,
    isDeleting: deleteWorkflowMutation.isPending,
  };
}

export default useWorkflows;
