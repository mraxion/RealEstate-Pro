import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLink, AlertCircle, InfoIcon, Zap, Code, PlusIcon } from "lucide-react";

export function WorkflowAutomasite() {
  const [apiKey, setApiKey] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  
  // Esta función simularía una conexión real con Automa.site
  const handleConnect = () => {
    if (apiKey.trim() !== "") {
      setConnected(true);
    }
  };
  
  // Esta función simularía la desconexión
  const handleDisconnect = () => {
    setConnected(false);
    setApiKey("");
  };
  
  // Información sobre los tipos de flujos disponibles
  const workflowTemplates = [
    {
      id: "lead-response",
      name: "Respuesta automática a leads",
      description: "Envía emails automáticos cuando un nuevo lead es registrado en el sistema.",
      difficulty: "Fácil"
    },
    {
      id: "fotocasa-sync",
      name: "Sincronización con Fotocasa",
      description: "Publica y actualiza propiedades automáticamente en Fotocasa.es",
      difficulty: "Media"
    },
    {
      id: "idealista-sync",
      name: "Sincronización con Idealista",
      description: "Publica y actualiza propiedades automáticamente en Idealista.com",
      difficulty: "Media"
    },
    {
      id: "price-update",
      name: "Actualización de precios",
      description: "Ajusta los precios de las propiedades basándose en datos del mercado inmobiliario",
      difficulty: "Avanzada"
    },
    {
      id: "market-analysis",
      name: "Análisis de mercado",
      description: "Genera informes de mercado para zonas específicas con datos de portales inmobiliarios",
      difficulty: "Avanzada"
    }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Integración con Automa.site</CardTitle>
              <CardDescription>
                Conecta tu cuenta de Automa.site para automatizar procesos inmobiliarios
              </CardDescription>
            </div>
            <a 
              href="https://www.automa.site" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              Visitar Automa.site
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </CardHeader>
        <CardContent>
          {connected ? (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-md flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Zap className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800">Conectado correctamente</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Tu cuenta de Automa.site está conectada y lista para automatizar procesos
                  </p>
                </div>
              </div>
              
              <Button variant="outline" onClick={handleDisconnect} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                Desconectar
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>¿Qué es Automa.site?</AlertTitle>
                <AlertDescription>
                  Automa.site es una plataforma de automatización que te permite crear flujos de trabajo 
                  sin código para automatizar tareas repetitivas como publicar en portales inmobiliarios, 
                  enviar emails, generar informes y más.
                </AlertDescription>
              </Alert>
              
              <div className="flex space-x-3">
                <Input
                  placeholder="Ingresa tu API key de Automa.site"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  type="password"
                  className="flex-1"
                />
                <Button onClick={handleConnect} disabled={apiKey.trim() === ""}>
                  Conectar
                </Button>
              </div>
              
              <div className="text-xs text-gray-500">
                Puedes encontrar tu API key en tu panel de Automa.site en Configuración &gt; API Keys
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="templates">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="examples">Ejemplos</TabsTrigger>
          <TabsTrigger value="documentation">Documentación</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-4 mt-4">
          <h2 className="text-lg font-medium">Plantillas de flujos de trabajo</h2>
          <p className="text-gray-600 mb-4">
            Estas plantillas te ayudarán a comenzar rápidamente con flujos de trabajo predefinidos.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflowTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-md">{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      Dificultad: {template.difficulty}
                    </span>
                    <Button variant="outline" size="sm" className="h-8">
                      <PlusIcon className="h-3.5 w-3.5 mr-1" />
                      Usar plantilla
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="examples" className="space-y-4 mt-4">
          <h2 className="text-lg font-medium">Ejemplos de integración</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="fotocasa">
              <AccordionTrigger>Sincronización con Fotocasa.es</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  <p>
                    La integración con Fotocasa.es permite publicar y actualizar propiedades automáticamente.
                    Para ello necesitarás:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Una cuenta profesional en Fotocasa.es</li>
                    <li>Las credenciales de API de Fotocasa</li>
                    <li>Configurar el flujo de trabajo en Automa.site</li>
                  </ul>
                  <Alert className="bg-blue-50 border-blue-100 text-xs">
                    <InfoIcon className="h-3 w-3" />
                    <AlertDescription className="text-blue-800">
                      Las propiedades sincronizadas mantendrán sus fotos, descripciones y características.
                    </AlertDescription>
                  </Alert>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="idealista">
              <AccordionTrigger>Sincronización con Idealista.com</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  <p>
                    La integración con Idealista.com te permite mantener tu cartera de propiedades
                    actualizada en uno de los portales inmobiliarios más importantes de España.
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Requiere una cuenta profesional en Idealista</li>
                    <li>Acceso a la API Professional de Idealista</li>
                    <li>Configuración del webhook en Automa.site</li>
                  </ul>
                  <div className="rounded bg-gray-100 p-3 text-xs font-mono overflow-x-auto">
                    <Code className="h-3 w-3 inline mr-1" />
                    <span className="text-gray-800">
                      URL del webhook: https://api.automa.site/webhook/inmobiliaria/idealista
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="price-analysis">
              <AccordionTrigger>Análisis de precios de mercado</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  <p>
                    Este flujo de trabajo recopila datos de precios de propiedades similares
                    en la misma zona para ayudarte a establecer precios competitivos.
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Analiza propiedades de varios portales inmobiliarios</li>
                    <li>Genera informes semanales de tendencias de precios</li>
                    <li>Sugiere ajustes de precios basados en datos del mercado</li>
                  </ul>
                  <Alert className="bg-amber-50 border-amber-100 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    <AlertDescription className="text-amber-800">
                      Este flujo requiere conexión a fuentes de datos externas y configuración avanzada.
                    </AlertDescription>
                  </Alert>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        
        <TabsContent value="documentation" className="space-y-4 mt-4">
          <h2 className="text-lg font-medium">Documentación y recursos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-md">API de Automa.site</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-600 mb-3">
                  Documentación completa de la API para desarrolladores que quieran crear
                  integraciones personalizadas.
                </p>
                <a 
                  href="https://docs.automa.site/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  Ver documentación
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-md">Tutoriales en video</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-600 mb-3">
                  Aprende a configurar flujos de trabajo inmobiliarios con nuestros
                  tutoriales paso a paso.
                </p>
                <a 
                  href="https://www.automa.site/tutoriales" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  Ver tutoriales
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-md">Foro de la comunidad</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-600 mb-3">
                  Conecta con otros profesionales inmobiliarios y comparte tus flujos
                  de trabajo y experiencias.
                </p>
                <a 
                  href="https://community.automa.site" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  Unirse a la comunidad
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-md">Soporte técnico</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-600 mb-3">
                  ¿Necesitas ayuda? Contacta con nuestro equipo de soporte técnico
                  para resolver cualquier duda.
                </p>
                <a 
                  href="https://www.automa.site/soporte" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  Contactar soporte
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default WorkflowAutomasite;