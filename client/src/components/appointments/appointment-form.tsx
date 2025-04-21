import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertAppointmentSchema, Appointment, Lead, Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Extend the appointment schema with some validation
const extendedAppointmentSchema = insertAppointmentSchema.extend({
  date: z.date({
    required_error: "La fecha y hora son requeridas",
  }),
  notes: z.string().optional(),
});

// Create a type for our form values that matches the schema
type AppointmentFormValues = z.infer<typeof extendedAppointmentSchema>;

interface AppointmentFormProps {
  initialData?: Appointment;
  onSubmit: (data: AppointmentFormValues) => void;
  isSubmitting: boolean;
  leads: Lead[];
  properties: Property[];
}

export function AppointmentForm({ 
  initialData, 
  onSubmit, 
  isSubmitting,
  leads,
  properties 
}: AppointmentFormProps) {
  // Initialize form with initialData or default values
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(extendedAppointmentSchema),
    defaultValues: initialData ? {
      ...initialData,
      date: new Date(initialData.date),
    } : {
      leadId: 0,
      propertyId: 0,
      date: new Date(),
      status: "scheduled",
      notes: "",
    },
  });

  const handleSubmit = (values: AppointmentFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="leadId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(Number(value))} 
                  defaultValue={field.value ? String(field.value) : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {leads.length === 0 ? (
                      <SelectItem value="no-leads" disabled>
                        No hay clientes disponibles
                      </SelectItem>
                    ) : (
                      leads.map((lead) => (
                        <SelectItem key={lead.id} value={String(lead.id)}>
                          {lead.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  El cliente que asistirá a la cita
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Propiedad</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(Number(value))} 
                  defaultValue={field.value ? String(field.value) : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una propiedad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {properties.length === 0 ? (
                      <SelectItem value="no-properties" disabled>
                        No hay propiedades disponibles
                      </SelectItem>
                    ) : (
                      properties.map((property) => (
                        <SelectItem key={property.id} value={String(property.id)}>
                          {property.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  La propiedad que se visitará
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha y Hora</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP HH:mm", { locale: es })
                        ) : (
                          <span>Seleccione fecha y hora</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) {
                          // Preserve the time from the existing date or set a default time
                          const currentDate = field.value || new Date();
                          date.setHours(currentDate.getHours());
                          date.setMinutes(currentDate.getMinutes());
                          field.onChange(date);
                        }
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                    <div className="p-3 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <label htmlFor="appointment-time" className="text-sm font-medium">
                          Hora:
                        </label>
                        <input
                          id="appointment-time"
                          type="time"
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                          value={field.value ? format(field.value, "HH:mm") : ""}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':').map(Number);
                            const newDate = new Date(field.value || new Date());
                            newDate.setHours(hours);
                            newDate.setMinutes(minutes);
                            field.onChange(newDate);
                          }}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Fecha y hora de la cita
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="scheduled">Programada</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Estado actual de la cita
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detalles adicionales sobre la cita..." 
                  className="resize-y min-h-[80px]"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Información relevante para la cita
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => form.reset()} className="mr-2">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting 
              ? "Guardando..." 
              : initialData 
                ? "Actualizar Cita" 
                : "Crear Cita"
            }
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default AppointmentForm;
