import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLeads } from "@/hooks/use-leads";
import { Lead } from "@shared/schema";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { formatCurrency, getLeadStage } from "@/lib/utils";
import { PlusIcon, SearchIcon, Mail, Phone, Trash2, Edit, AlertCircle } from "lucide-react";
import { LeadForm } from "./lead-form";

export function LeadList() {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const itemsPerPage = 8;
  
  const { leads, isLoading, error, createLead, updateLead, deleteLead, isCreating, isUpdating, isDeleting } = useLeads();
  const { toast } = useToast();
  
  // Filter and sort leads
  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = search === "" || 
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      (lead.phone && lead.phone.includes(search));
      
    const matchesStage = stage === "all" || lead.stage === stage;
    
    return matchesSearch && matchesStage;
  }) || [];
  
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);
  const paginatedLeads = sortedLeads.slice(
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
    if (selectedLead) {
      // Update existing lead
      updateLead({
        id: selectedLead.id,
        leadData: data
      }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setSelectedLead(null);
          toast({
            title: "Lead actualizado",
            description: "El lead ha sido actualizado correctamente.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `No se pudo actualizar el lead: ${error.message}`,
            variant: "destructive",
          });
        }
      });
    } else {
      // Create new lead
      createLead(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast({
            title: "Lead creado",
            description: "El lead ha sido creado correctamente.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `No se pudo crear el lead: ${error.message}`,
            variant: "destructive",
          });
        }
      });
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (selectedLead) {
      deleteLead(selectedLead.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedLead(null);
          toast({
            title: "Lead eliminado",
            description: "El lead ha sido eliminado correctamente.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `No se pudo eliminar el lead: ${error.message}`,
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="px-5 py-4 border-b border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-lg font-semibold text-neutral-900">
            Gestión de Leads
          </CardTitle>
          <Button 
            onClick={() => {
              setSelectedLead(null);
              setIsDialogOpen(true);
            }}
            className="inline-flex items-center px-3 py-1.5 border border-primary-600 text-primary-600 bg-white hover:bg-primary-50 rounded-md text-sm font-medium"
          >
            <PlusIcon className="h-4 w-4 mr-1.5" />
            Nuevo Lead
          </Button>
        </CardHeader>
        
        <CardContent className="p-5">
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative rounded-md w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-neutral-400" />
              </div>
              <Input
                type="text"
                placeholder="Buscar leads..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Todas las etapas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las etapas</SelectItem>
                  <SelectItem value="new">Nuevos</SelectItem>
                  <SelectItem value="qualified">Calificados</SelectItem>
                  <SelectItem value="interested">Interesados</SelectItem>
                  <SelectItem value="scheduled">Agendados</SelectItem>
                  <SelectItem value="closed">Cerrados</SelectItem>
                  <SelectItem value="lost">Perdidos</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-52">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Fecha: Más recientes</SelectItem>
                  <SelectItem value="oldest">Fecha: Más antiguos</SelectItem>
                  <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
                  <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Lead list */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-neutral-50 text-neutral-500 uppercase text-xs">Nombre</TableHead>
                  <TableHead className="bg-neutral-50 text-neutral-500 uppercase text-xs">Contacto</TableHead>
                  <TableHead className="bg-neutral-50 text-neutral-500 uppercase text-xs">Interés</TableHead>
                  <TableHead className="bg-neutral-50 text-neutral-500 uppercase text-xs">Presupuesto</TableHead>
                  <TableHead className="bg-neutral-50 text-neutral-500 uppercase text-xs">Etapa</TableHead>
                  <TableHead className="bg-neutral-50 text-neutral-500 uppercase text-xs">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeleton
                  Array(4).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-36" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      Error al cargar los leads. Inténtalo de nuevo.
                    </TableCell>
                  </TableRow>
                ) : sortedLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                      No se encontraron leads. {search && "Prueba con otra búsqueda."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLeads.map((lead) => {
                    const stageInfo = getLeadStage(lead.stage);
                    
                    return (
                      <TableRow key={lead.id} className="hover:bg-neutral-50">
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-neutral-700">
                              <Mail className="h-3.5 w-3.5 text-neutral-500 mr-1.5" />
                              {lead.email}
                            </div>
                            {lead.phone && (
                              <div className="flex items-center text-sm text-neutral-700">
                                <Phone className="h-3.5 w-3.5 text-neutral-500 mr-1.5" />
                                {lead.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-neutral-700">{lead.interest}</TableCell>
                        <TableCell className="text-sm text-neutral-700">
                          {lead.budget ? formatCurrency(lead.budget) : "-"}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stageInfo.colorClass}`}>
                            {stageInfo.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedLead(lead);
                                setIsDialogOpen(true);
                              }}
                            >
                              <span className="sr-only">Editar</span>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                setSelectedLead(lead);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <span className="sr-only">Eliminar</span>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {!isLoading && !error && sortedLeads.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-neutral-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-medium">{Math.min(currentPage * itemsPerPage, sortedLeads.length)}</span> de <span className="font-medium">{sortedLeads.length}</span> leads
              </div>
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

      {/* Lead Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedLead ? "Editar Lead" : "Crear Nuevo Lead"}</DialogTitle>
            <DialogDescription>
              {selectedLead 
                ? "Actualiza la información del lead existente" 
                : "Introduce la información del nuevo lead"}
            </DialogDescription>
          </DialogHeader>
          
          <LeadForm 
            initialData={selectedLead || undefined} 
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
              ¿Estás seguro de que deseas eliminar a este lead? Esta acción no se puede deshacer.
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

export default LeadList;
