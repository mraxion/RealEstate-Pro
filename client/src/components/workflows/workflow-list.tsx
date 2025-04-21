import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWorkflows } from "@/hooks/use-workflows";
import { Workflow } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getWorkflowStatus } from "@/lib/utils";
import { PlusIcon, SearchIcon, Trash2, Edit, AlertCircle, Settings, Zap } from "lucide-react";
import { WorkflowForm } from "./workflow-form";

export function WorkflowList() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const itemsPerPage = 6;
  
  const { workflows, isLoading, error, createWorkflow, updateWorkflow, deleteWorkflow, isCreating, isUpdating, isDeleting } = useWorkflows();
  const { toast } = useToast();
  
  // Filter workflows
  const filteredWorkflows = workflows?.filter(workflow => {
    const matchesSearch = search === "" || 
      workflow.name.toLowerCase().includes(search.toLowerCase()) ||
      workflow.description?.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  }) || [];
  
  // Sort workflows by status: active first, then paused, then error
  const sortedWorkflows = [...filteredWorkflows].sort((a, b) => {
    const statusOrder = { active: 0, paused: 1, error: 2 };
    return (statusOrder[a.status as keyof typeof statusOrder] || 99) - (statusOrder[b.status as keyof typeof statusOrder] || 99);
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedWorkflows.length / itemsPerPage);
  const paginatedWorkflows = sortedWorkflows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle form submission
  const handleSubmit = (data: any) => {
    if (selectedWorkflow) {
      // Update existing workflow
      updateWorkflow({
        id: selectedWorkflow.id,
        workflowData: data
      }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setSelectedWorkflow(null);
          toast({
            title: "Flujo de trabajo actualizado",
            description: "El flujo de trabajo ha sido actualizado correctamente.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `No se pudo actualizar el flujo de trabajo: ${error.message}`,
            variant: "destructive",
          });
        }
      });
    } else {
      // Create new workflow
      createWorkflow(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast({
            title: "Flujo de trabajo creado",
            description: "El flujo de trabajo ha sido creado correctamente.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `No se pudo crear el flujo de trabajo: ${error.message}`,
            variant: "destructive",
          });
        }
      });
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (selectedWorkflow) {
      deleteWorkflow(selectedWorkflow.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedWorkflow(null);
          toast({
            title: "Flujo de trabajo eliminado",
            description: "El flujo de trabajo ha sido eliminado correctamente.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `No se pudo eliminar el flujo de trabajo: ${error.message}`,
            variant: "destructive",
          });
        }
      });
    }
  };

  // Get workflow type display name
  const getWorkflowTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      'lead-response': 'Respuesta a leads',
      'notification': 'Notificaciones',
      'price-update': 'Actualización de precios',
      'fotocasa-sync': 'Sincronización con Fotocasa',
      'idealista-sync': 'Sincronización con Idealista',
      'market-analysis': 'Análisis de mercado',
    };
    return typeMap[type] || type;
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="px-5 py-4 border-b border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-lg font-semibold text-neutral-900">
            Flujos de Trabajo
          </CardTitle>
          <Button 
            onClick={() => {
              setSelectedWorkflow(null);
              setIsDialogOpen(true);
            }}
            className="inline-flex items-center px-3 py-1.5 border border-primary-600 text-primary-600 bg-white hover:bg-primary-50 rounded-md text-sm font-medium"
          >
            <PlusIcon className="h-4 w-4 mr-1.5" />
            Nuevo Flujo de Trabajo
          </Button>
        </CardHeader>
        
        <CardContent className="p-5">
          <div className="mb-6">
            <div className="relative rounded-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-neutral-400" />
              </div>
              <Input
                type="text"
                placeholder="Buscar flujos de trabajo..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-6">
              {Array(3).fill(0).map((_, index) => (
                <Card key={index} className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <Skeleton className="h-6 w-48 mb-1" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Error al cargar los flujos de trabajo</h3>
              <p className="text-gray-500">Ha ocurrido un error al cargar la información. Inténtalo de nuevo.</p>
            </div>
          ) : sortedWorkflows.length === 0 ? (
            <div className="text-center py-10">
              <Zap className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No hay flujos de trabajo</h3>
              <p className="text-gray-500 mb-4">
                {search 
                  ? "No se encontraron flujos de trabajo con tu búsqueda."
                  : "Crea tu primer flujo de trabajo para automatizar procesos."}
              </p>
              <Button 
                onClick={() => {
                  setSelectedWorkflow(null);
                  setIsDialogOpen(true);
                }}
              >
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Crear Flujo de Trabajo
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {paginatedWorkflows.map((workflow) => {
                const statusInfo = getWorkflowStatus(workflow.status);
                
                return (
                  <Card key={workflow.id} className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{workflow.name}</h3>
                        <p className="text-sm text-gray-500">{workflow.description || "Sin descripción"}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                            {getWorkflowTypeDisplay(workflow.type)}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedWorkflow(workflow);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          onClick={() => {
                            setSelectedWorkflow(workflow);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-medium text-gray-700">Estado</h4>
                        <span className={`text-xs font-medium ${statusInfo.colorClass}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <Progress value={workflow.progress} className="h-2 bg-gray-200" />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
          
          {/* Pagination */}
          {!isLoading && !error && sortedWorkflows.length > 0 && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      aria-disabled={currentPage === 1}
                      className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                    />
                  </PaginationItem>
                  
                  {pageNumbers.map(number => (
                    <PaginationItem key={number}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(number);
                        }}
                        isActive={currentPage === number}
                      >
                        {number}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      aria-disabled={currentPage === totalPages}
                      className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workflow Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedWorkflow ? "Editar Flujo de Trabajo" : "Crear Nuevo Flujo de Trabajo"}</DialogTitle>
            <DialogDescription>
              {selectedWorkflow 
                ? "Actualiza la configuración del flujo de trabajo" 
                : "Configura un nuevo flujo de trabajo automatizado"}
            </DialogDescription>
          </DialogHeader>
          
          <WorkflowForm 
            initialData={selectedWorkflow || undefined} 
            onSubmit={handleSubmit} 
            isSubmitting={isCreating || isUpdating}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este flujo de trabajo? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default WorkflowList;
