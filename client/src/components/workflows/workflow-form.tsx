import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertWorkflowSchema, Workflow } from "@shared/schema";
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
import { Slider } from "@/components/ui/slider";

// Extend the workflow schema with some validation
const extendedWorkflowSchema = insertWorkflowSchema.extend({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  description: z.string().optional(),
  type: z.string(),
  status: z.string(),
  progress: z.number().min(0).max(100),
});

// Create a type for our form values that matches the schema
type WorkflowFormValues = z.infer<typeof extendedWorkflowSchema>;

interface WorkflowFormProps {
  initialData?: Workflow;
  onSubmit: (data: WorkflowFormValues) => void;
  isSubmitting: boolean;
}

export function WorkflowForm({ initialData, onSubmit, isSubmitting }: WorkflowFormProps) {
  // Initialize form with initialData or default values
  const form = useForm<WorkflowFormValues>({
    resolver: zodResolver(extendedWorkflowSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      type: "lead-response",
      status: "active",
      progress: 100,
    },
  });

  const handleSubmit = (values: WorkflowFormValues) => {
    onSubmit(values);
  };

  // Watch the status field to conditionally show progress slider
  const status = form.watch("status");
  const showProgress = status !== "active";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Respuesta automática a leads" {...field} />
              </FormControl>
              <FormDescription>
                Un nombre descriptivo para identificar el flujo de trabajo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe qué hace este flujo de trabajo..." 
                  className="resize-y min-h-[80px]"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Una descripción detallada de las funciones y propósito
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="lead-response">Respuesta a leads</SelectItem>
                    <SelectItem value="notification">Notificaciones</SelectItem>
                    <SelectItem value="price-update">Actualización de precios</SelectItem>
                    <SelectItem value="portal-sync">Sincronización con portales</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  La categoría o función principal del flujo
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
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="paused">En pausa</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Estado actual de ejecución
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {showProgress && (
          <FormField
            control={form.control}
            name="progress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Progreso ({field.value}%)</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    defaultValue={[field.value]}
                    onValueChange={(values) => field.onChange(values[0])}
                    className="py-4"
                  />
                </FormControl>
                <FormDescription>
                  Porcentaje de progreso o completitud
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => form.reset()} className="mr-2">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting 
              ? "Guardando..." 
              : initialData 
                ? "Actualizar Flujo" 
                : "Crear Flujo"
            }
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default WorkflowForm;
