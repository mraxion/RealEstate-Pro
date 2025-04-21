import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { WorkflowAutomasite } from "@/components/workflows/workflow-automasite";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon } from "lucide-react";

export default function WorkflowIntegrations() {
  return (
    <DashboardLayout title="Integraciones de automatización">
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-primary-50 to-blue-50 border-primary-100">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-full">
                <InfoIcon className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-primary-900 mb-1">
                  Automatización con Automa.site
                </h2>
                <p className="text-primary-800">
                  Conecta tu panel inmobiliario con Automa.site para automatizar procesos como 
                  la sincronización con portales (Fotocasa, Idealista), respuesta a leads, 
                  y análisis de mercado. Optimiza tu tiempo y mejora la eficiencia de tu negocio.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="automa">
          <TabsList className="w-full border-b mb-0 rounded-b-none">
            <TabsTrigger value="automa" className="flex-1">Automa.site</TabsTrigger>
            <TabsTrigger value="api" className="flex-1">API</TabsTrigger>
            <TabsTrigger value="webhooks" className="flex-1">Webhooks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="automa" className="border rounded-t-none p-6 pt-4">
            <WorkflowAutomasite />
          </TabsContent>
          
          <TabsContent value="api" className="border rounded-t-none p-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">API REST</h2>
              <p className="text-gray-700">
                Utiliza nuestra API REST para interactuar con tu portal inmobiliario programáticamente.
                Ideal para desarrolladores y sistemas personalizados.
              </p>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Documentación de la API</CardTitle>
                  <CardDescription>
                    Endpoints disponibles para gestionar propiedades, leads y citas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 text-sm border-b pb-2">
                      <div className="font-medium">Endpoint</div>
                      <div className="font-medium">Método</div>
                      <div className="font-medium">Descripción</div>
                    </div>
                    
                    <div className="grid grid-cols-3 text-sm">
                      <div className="text-primary-600">/api/properties</div>
                      <div>GET, POST</div>
                      <div>Listar y crear propiedades</div>
                    </div>
                    
                    <div className="grid grid-cols-3 text-sm">
                      <div className="text-primary-600">/api/properties/:id</div>
                      <div>GET, PUT, DELETE</div>
                      <div>Gestionar una propiedad específica</div>
                    </div>
                    
                    <div className="grid grid-cols-3 text-sm">
                      <div className="text-primary-600">/api/leads</div>
                      <div>GET, POST</div>
                      <div>Listar y crear leads</div>
                    </div>
                    
                    <div className="grid grid-cols-3 text-sm">
                      <div className="text-primary-600">/api/appointments</div>
                      <div>GET, POST</div>
                      <div>Listar y crear citas</div>
                    </div>
                    
                    <div className="grid grid-cols-3 text-sm">
                      <div className="text-primary-600">/api/workflows</div>
                      <div>GET, POST</div>
                      <div>Gestionar flujos de trabajo</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="webhooks" className="border rounded-t-none p-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Webhooks</h2>
              <p className="text-gray-700">
                Configura webhooks para recibir notificaciones en tiempo real cuando 
                ocurran eventos en tu portal inmobiliario.
              </p>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Eventos disponibles</CardTitle>
                  <CardDescription>
                    Configura URLs para recibir notificaciones cuando ocurran estos eventos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 text-sm border-b pb-2">
                      <div className="font-medium">Evento</div>
                      <div className="font-medium">Descripción</div>
                    </div>
                    
                    <div className="grid grid-cols-2 text-sm">
                      <div className="text-primary-600">property.created</div>
                      <div>Cuando se crea una nueva propiedad</div>
                    </div>
                    
                    <div className="grid grid-cols-2 text-sm">
                      <div className="text-primary-600">property.updated</div>
                      <div>Cuando se actualiza una propiedad</div>
                    </div>
                    
                    <div className="grid grid-cols-2 text-sm">
                      <div className="text-primary-600">lead.created</div>
                      <div>Cuando se registra un nuevo lead</div>
                    </div>
                    
                    <div className="grid grid-cols-2 text-sm">
                      <div className="text-primary-600">appointment.scheduled</div>
                      <div>Cuando se programa una cita</div>
                    </div>
                    
                    <div className="grid grid-cols-2 text-sm">
                      <div className="text-primary-600">portal.sync.completed</div>
                      <div>Cuando se completa una sincronización con portales</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}