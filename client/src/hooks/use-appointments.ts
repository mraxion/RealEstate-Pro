import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Appointment } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useAppointments() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all appointments
  const appointmentsQuery = useQuery<Appointment[]>({
    queryKey: ['/api/appointments'],
  });

  // Fetch single appointment
  const useAppointment = (id: number) => {
    return useQuery<Appointment>({
      queryKey: ['/api/appointments', id],
      enabled: !!id,
    });
  };

  // Create appointment
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      const response = await apiRequest('POST', '/api/appointments', appointmentData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: "Cita creada",
        description: "La cita ha sido creada correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo crear la cita: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update appointment
  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, appointmentData }: { id: number; appointmentData: any }) => {
      const response = await apiRequest('PUT', `/api/appointments/${id}`, appointmentData);
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/appointments', variables.id] });
      toast({
        title: "Cita actualizada",
        description: "La cita ha sido actualizada correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo actualizar la cita: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete appointment
  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/appointments/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: "Cita eliminada",
        description: "La cita ha sido eliminada correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo eliminar la cita: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    appointments: appointmentsQuery.data || [],
    isLoading: appointmentsQuery.isLoading,
    error: appointmentsQuery.error,
    useAppointment,
    createAppointment: createAppointmentMutation.mutate,
    isCreating: createAppointmentMutation.isPending,
    updateAppointment: updateAppointmentMutation.mutate,
    isUpdating: updateAppointmentMutation.isPending,
    deleteAppointment: deleteAppointmentMutation.mutate,
    isDeleting: deleteAppointmentMutation.isPending,
  };
}

export default useAppointments;
