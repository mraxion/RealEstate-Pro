# Integración con Automa.site para Automatización

Este documento describe cómo integrar InmoAdmin con Automa.site para automatizar flujos de trabajo inmobiliarios y procesos de gestión de clientes.

## Introducción a Automa.site

[Automa.site](https://automa.site) es una plataforma de automatización no-code/low-code que permite crear flujos de trabajo personalizados y automatizados sin necesidad de extenso desarrollo. Es ideal para:

- Automatizar tareas repetitivas
- Crear flujos de trabajo personalizados
- Conectar diferentes sistemas y aplicaciones
- Responder automáticamente a eventos y triggers

## Casos de Uso para InmoAdmin

### 1. Automatización de Respuestas a Clientes Potenciales

Cuando un cliente potencial solicita información a través del formulario de contacto, podemos automatizar:

- Envío de correo electrónico de bienvenida
- Asignación automática a un agente
- Programación de seguimiento
- Envío de propiedades recomendadas basadas en sus preferencias

### 2. Notificaciones de Visitas

Automatizar el proceso de programación de visitas:

- Envío de confirmación de visita al cliente
- Notificación al agente inmobiliario
- Recordatorios antes de la visita
- Solicitud de feedback después de la visita

### 3. Actualización de Portales Inmobiliarios

Sincronizar automáticamente las propiedades de InmoAdmin con portales externos:

- Publicación automática en Idealista y Fotocasa
- Actualización de precios y disponibilidad
- Sincronización de imágenes y descripciones
- Gestión de caducidad de anuncios

### 4. Generación de Documentos

Automatizar la creación de documentos necesarios:

- Contratos de arrendamiento
- Hojas de visita
- Informes de valoración
- Dossiers de propiedades

## Configuración de la Integración

### Requisitos Previos

1. **Cuenta en Automa.site**:
   - Registrarse en [automa.site](https://automa.site)
   - Obtener las credenciales de API

2. **API Key de InmoAdmin**:
   - Generar una API key en la configuración de InmoAdmin
   - Esta key se utilizará para autenticar las solicitudes desde Automa.site

### Pasos para la Integración

#### 1. Configurar Webhook en InmoAdmin

Añadir soporte para webhooks en InmoAdmin para que pueda comunicarse con Automa.site:

```typescript
// server/routes.ts - Añadir este endpoint

app.post("/api/webhooks/automa", async (req: Request, res: Response) => {
  try {
    const { event, data, signature } = req.body;
    
    // Verificar la firma para seguridad
    const isValid = verifyWebhookSignature(signature, JSON.stringify(data), process.env.WEBHOOK_SECRET);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid signature" });
    }
    
    // Procesar el evento
    switch (event) {
      case "lead.created":
        await handleLeadCreated(data);
        break;
      case "appointment.scheduled":
        await handleAppointmentScheduled(data);
        break;
      case "property.updated":
        await handlePropertyUpdated(data);
        break;
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Error processing webhook" });
  }
});

// Función de verificación
function verifyWebhookSignature(signature: string, payload: string, secret: string): boolean {
  const hmac = createHmac("sha256", secret);
  const expectedSignature = hmac.update(payload).digest("hex");
  return signature === expectedSignature;
}

// Funciones handler para cada evento
async function handleLeadCreated(data: any) {
  // Lógica para manejar nuevo lead
  // Por ejemplo, enviar email de bienvenida
}

async function handleAppointmentScheduled(data: any) {
  // Lógica para manejar nueva cita
  // Por ejemplo, añadir al calendario y enviar notificaciones
}

async function handlePropertyUpdated(data: any) {
  // Lógica para manejar actualización de propiedad
  // Por ejemplo, sincronizar con portales externos
}
```

#### 2. Crear Cliente API para Automa.site

Desarrollar un cliente para la API de Automa.site:

```typescript
// server/integrations/automa-site.ts

import axios from 'axios';

export class AutomaSiteClient {
  private apiKey: string;
  private baseUrl: string;
  
  constructor(apiKey: string, baseUrl = 'https://api.automa.site/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }
  
  private get headers() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }
  
  // Crear un nuevo flujo de trabajo
  async createWorkflow(name: string, description: string, triggers: any[] = []) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/workflows`,
        { name, description, triggers },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw error;
    }
  }
  
  // Añadir pasos a un flujo de trabajo
  async addWorkflowSteps(workflowId: string, steps: any[]) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/workflows/${workflowId}/steps`,
        { steps },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding workflow steps:', error);
      throw error;
    }
  }
  
  // Activar un flujo de trabajo manualmente
  async triggerWorkflow(workflowId: string, data: any = {}) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/workflows/${workflowId}/trigger`,
        { data },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error triggering workflow:', error);
      throw error;
    }
  }
  
  // Obtener el estado de una ejecución de flujo de trabajo
  async getWorkflowExecutionStatus(executionId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/executions/${executionId}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting execution status:', error);
      throw error;
    }
  }
}

// Exportar una instancia configurada
export const automaClient = new AutomaSiteClient(process.env.AUTOMA_SITE_API_KEY || '');
```

#### 3. Configurar Endpoints para Disparar Flujos de Trabajo

Añadir endpoints en el servidor para que la aplicación pueda iniciar flujos de trabajo:

```typescript
// server/routes.ts - Añadir estos endpoints

import { automaClient } from './integrations/automa-site';

// Trigger flujo de trabajo para nuevo lead
app.post("/api/workflows/lead-welcome", async (req: Request, res: Response) => {
  try {
    const { leadId } = req.body;
    
    // Obtener datos del lead
    const lead = await storage.getLead(leadId);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    
    // Disparar el flujo de trabajo en Automa.site
    const result = await automaClient.triggerWorkflow(
      process.env.AUTOMA_LEAD_WELCOME_WORKFLOW_ID || '',
      { lead }
    );
    
    // Registrar actividad
    await storage.createActivity({
      type: "workflow_triggered",
      description: `Flujo de bienvenida iniciado para ${lead.name}`,
      entityId: lead.id,
      entityType: "lead"
    });
    
    res.status(200).json({ success: true, executionId: result.executionId });
  } catch (error) {
    console.error("Error triggering workflow:", error);
    res.status(500).json({ error: "Error triggering workflow" });
  }
});

// Trigger flujo de trabajo para programación de visita
app.post("/api/workflows/appointment-notification", async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.body;
    
    // Obtener datos de la cita con información de propiedad y lead
    const appointment = await storage.getAppointment(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    const property = await storage.getProperty(appointment.propertyId);
    const lead = await storage.getLead(appointment.leadId);
    
    // Disparar el flujo de trabajo
    const result = await automaClient.triggerWorkflow(
      process.env.AUTOMA_APPOINTMENT_NOTIFICATION_WORKFLOW_ID || '',
      { appointment, property, lead }
    );
    
    // Registrar actividad
    await storage.createActivity({
      type: "workflow_triggered",
      description: `Notificaciones de cita enviadas para ${lead?.name || 'cliente'}`,
      entityId: appointment.id,
      entityType: "appointment"
    });
    
    res.status(200).json({ success: true, executionId: result.executionId });
  } catch (error) {
    console.error("Error triggering workflow:", error);
    res.status(500).json({ error: "Error triggering workflow" });
  }
});
```

#### 4. Crear hooks en el frontend para interactuar con los flujos de trabajo

```typescript
// client/src/hooks/use-workflows.ts

import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function useWorkflowAutomations() {
  // Ejecutar flujo de bienvenida para un lead
  const triggerLeadWelcome = useMutation({
    mutationFn: async (leadId: number) => {
      const res = await apiRequest('POST', '/api/workflows/lead-welcome', { leadId });
      return await res.json();
    }
  });
  
  // Ejecutar flujo de notificación de cita
  const triggerAppointmentNotification = useMutation({
    mutationFn: async (appointmentId: number) => {
      const res = await apiRequest('POST', '/api/workflows/appointment-notification', { appointmentId });
      return await res.json();
    }
  });
  
  // Ejecutar flujo de sincronización con portales externos
  const triggerPortalSync = useMutation({
    mutationFn: async (propertyId: number) => {
      const res = await apiRequest('POST', '/api/workflows/portal-sync', { propertyId });
      return await res.json();
    }
  });
  
  // Verificar estado de ejecución de un flujo
  const checkWorkflowStatus = useMutation({
    mutationFn: async (executionId: string) => {
      const res = await apiRequest('GET', `/api/workflows/status/${executionId}`);
      return await res.json();
    }
  });
  
  return {
    triggerLeadWelcome,
    triggerAppointmentNotification,
    triggerPortalSync,
    checkWorkflowStatus
  };
}
```

#### 5. Integrar los flujos de trabajo en la interfaz de usuario

```tsx
// client/src/pages/leads-detail.tsx (ejemplo parcial)

import { useWorkflowAutomations } from '@/hooks/use-workflows';
import { useToast } from '@/hooks/use-toast';

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: lead } = useLead(parseInt(id));
  const { triggerLeadWelcome } = useWorkflowAutomations();
  const { toast } = useToast();
  
  const handleSendWelcome = async () => {
    try {
      await triggerLeadWelcome.mutateAsync(parseInt(id));
      toast({
        title: "Flujo de trabajo iniciado",
        description: "El email de bienvenida será enviado automáticamente",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar el flujo de trabajo",
        variant: "destructive"
      });
    }
  };
  
  return (
    <DashboardLayout title="Detalle de Cliente">
      {/* Resto del componente... */}
      
      <Card>
        <CardHeader>
          <CardTitle>Automatizaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email de Bienvenida</h3>
                <p className="text-sm text-neutral-500">
                  Envía un email de bienvenida con propiedades recomendadas
                </p>
              </div>
              <Button 
                onClick={handleSendWelcome}
                disabled={triggerLeadWelcome.isPending}
              >
                {triggerLeadWelcome.isPending ? "Enviando..." : "Enviar"}
              </Button>
            </div>
            
            {/* Más automatizaciones... */}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
```

## Ejemplos de Flujos de Trabajo en Automa.site

### 1. Flujo de Bienvenida para Leads

Este flujo se dispara cuando se crea un nuevo lead o manualmente:

1. **Trigger**: Nuevo lead creado o botón manual
2. **Paso 1**: Obtener datos del lead desde InmoAdmin API
3. **Paso 2**: Buscar propiedades que coincidan con sus preferencias
4. **Paso 3**: Generar contenido personalizado para el email
5. **Paso 4**: Enviar email de bienvenida con propiedades recomendadas
6. **Paso 5**: Programar una tarea de seguimiento para el agente
7. **Paso 6**: Actualizar el estado del lead en InmoAdmin

Configuración visual en Automa.site:
```
Trigger: Webhook o Manual
↓
API Request: GET /api/leads/{id}
↓
API Request: GET /api/properties?location={lead.preferredLocation}&priceMax={lead.budget}
↓
Text Generator: Personalizar plantilla de email
↓
Email Sender: Enviar email al lead
↓
Task Creator: Crear tarea de seguimiento
↓
API Request: PUT /api/leads/{id} (actualizar estado)
```

### 2. Flujo de Notificación de Visitas

Este flujo se dispara cuando se programa una visita:

1. **Trigger**: Nueva cita programada
2. **Paso 1**: Obtener detalles de la cita, propiedad y lead
3. **Paso 2**: Enviar confirmación por email al cliente
4. **Paso 3**: Enviar notificación al agente inmobiliario
5. **Paso 4**: Añadir evento al calendario
6. **Paso 5**: Programar recordatorio para 24h antes
7. **Paso 6**: Programar solicitud de feedback para después de la visita

Configuración visual en Automa.site:
```
Trigger: Webhook (appointment.scheduled)
↓
API Request: GET /api/appointments/{id}?include=property,lead
↓
Condition: Check appointment data
↓
Email Sender: Send confirmation to client
↓
Email/SMS Sender: Send notification to agent
↓
Calendar: Add appointment to calendar
↓
Scheduler: Set reminder for 24h before
↓
Scheduler: Set feedback request for after visit
```

### 3. Flujo de Sincronización con Portales

Este flujo sincroniza una propiedad con portales externos cuando se actualiza:

1. **Trigger**: Propiedad creada o actualizada
2. **Paso 1**: Obtener detalles completos de la propiedad
3. **Paso 2**: Formatear datos para Idealista
4. **Paso 3**: Enviar/actualizar en API de Idealista
5. **Paso 4**: Formatear datos para Fotocasa
6. **Paso 5**: Enviar/actualizar en API de Fotocasa
7. **Paso 6**: Registrar resultado en InmoAdmin

Configuración visual en Automa.site:
```
Trigger: Webhook (property.updated) o Manual
↓
API Request: GET /api/properties/{id}
↓
Data Transformer: Format for Idealista
↓
API Request: POST to Idealista API
↓
Data Transformer: Format for Fotocasa
↓
API Request: POST to Fotocasa API
↓
API Request: POST /api/activities (log result)
```

## Mejores Prácticas

### Seguridad

1. **Autenticación**: Utiliza tokens seguros para todas las API calls
2. **Verificación de Webhooks**: Valida las firmas en las solicitudes de webhook
3. **Datos Sensibles**: No almacenes información sensible en los flujos de trabajo
4. **Permisos**: Limita los permisos de las integraciones al mínimo necesario

### Rendimiento

1. **Throttling**: Implementa limitación de tasa para evitar sobrecarga
2. **Procesamiento Asíncrono**: Utiliza colas para tareas pesadas
3. **Caché**: Almacena en caché datos que no cambian frecuentemente
4. **Monitorización**: Supervisa el rendimiento y los errores de los flujos

### Gestión de Errores

1. **Reintentos**: Configura reintentos automáticos para fallos temporales
2. **Fallbacks**: Implementa comportamientos alternativos cuando los servicios fallan
3. **Notificaciones**: Configura alertas para fallos críticos
4. **Logging**: Mantén registros detallados para diagnóstico

## Despliegue y Configuración

### Variables de Entorno Necesarias

```
# Automa.site
AUTOMA_SITE_API_KEY=tu_api_key
AUTOMA_LEAD_WELCOME_WORKFLOW_ID=id_del_flujo
AUTOMA_APPOINTMENT_NOTIFICATION_WORKFLOW_ID=id_del_flujo
AUTOMA_PORTAL_SYNC_WORKFLOW_ID=id_del_flujo

# Seguridad Webhook
WEBHOOK_SECRET=secreto_para_firmar_webhooks

# Portales inmobiliarios (para sincronización directa)
IDEALISTA_API_KEY=tu_api_key
FOTOCASA_API_KEY=tu_api_key
```

### Configuración Recomendada

1. **Entorno de Desarrollo**:
   - Utiliza webhooks de prueba (servicios como Webhook.site)
   - Configura flujos de trabajo de prueba separados
   - Utiliza datos de muestra para evitar envíos accidentales

2. **Entorno de Producción**:
   - Implementa monitorización y alertas
   - Configura webhooks seguros con HTTPS
   - Utiliza credenciales de producción limitadas por IP

## Conclusión

La integración con Automa.site proporciona a InmoAdmin potentes capacidades de automatización sin necesidad de desarrollar toda la lógica desde cero. Los flujos de trabajo automatizados pueden mejorar significativamente la eficiencia operativa, la experiencia del cliente y la capacidad de respuesta del negocio.

Esta integración es especialmente valiosa para:

1. Reducir tareas manuales repetitivas
2. Asegurar comunicaciones oportunas con clientes
3. Mantener datos sincronizados entre sistemas
4. Crear procesos de negocio consistentes y escalables

Al seguir las prácticas recomendadas y utilizar las herramientas proporcionadas en este documento, puedes implementar una integración robusta y eficiente entre InmoAdmin y Automa.site.