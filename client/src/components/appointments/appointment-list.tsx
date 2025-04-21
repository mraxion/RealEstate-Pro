import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppointments } from "@/hooks/use-appointments";
import { useLeads } from "@/hooks/use-leads";
import { useProperties } from "@/hooks/use-properties";
import { Appointment, Lead, Property } from "@shared/schema";
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
import { formatDateTime } from "@/lib/utils";
import { PlusIcon, SearchIcon, Calendar, Trash2, Edit, AlertCircle, User, Building, Clock } from "lucide-react";
import { AppointmentForm } from "./appointment-form";

export function AppointmentList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const itemsPerPage = 8;
  
  const { appointments, isLoading, error, createAppointment, updateAppointment, deleteAppointment, isCreating, isUpdating, isDeleting } = useAppointments();
  const { leads } = useLeads();
  const { properties } = useProperties();
  const { toast } = useToast();
  
  // Filter and sort appointments
  const filteredAppointments = appointments?.filter(appointment => {
    // Get the lead and property for this appointment
    const lead = leads?.find(l => l.id === appointment.leadId);
    const property = properties?.find(p => p.id === appointment.propertyId);
    
    const matchesSearch = search === "" || 
      (lead && lead.name.toLowerCase().includes(search.toLowerCase())) ||
      (property && property.title.toLowerCase().includes(search.toLowerCase())) ||
      (appointment.notes && appointment.notes.toLowerCase().includes(search.toLowerCase()));
      
    const matchesStatus = status === "all" || appointment.status === status;
    
    return matchesSearch && matchesStatus;
  }) || [];
  
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const paginatedAppointments = sortedAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Get lead and property names
  const getLeadName = (leadId: number) => {
    const lead = leads?.find(l => l.id === leadId);
    return lead ? lead.name : "Lead no encontrado";
  };

  const getPropertyTitle = (propertyId: number) => {
    const property = properties?.find(p => p.id === propertyId);
    return property ? property.title : "Propiedad no encontrada";
  };

  // Handle form submission
  const handleSubmit = (data: any) => {
    if (selectedAppointment) {
      // Update existing appointment
      updateAppointment({
        id: selectedAppointment.id,
        appointmentData: data
      }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setSelectedAppointment(null);
          toast({
            title: "Cita actualizada",
            description: "La cita ha sido actualizada correctamente.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `No se pudo actualizar la cita: ${error.message}`,
            variant: "destructive",
          });
        }
      });
    } else {
      // Create new appointment
      createAppointment(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast({
            title: "Cita creada",
            description: "La cita ha sido creada correctamente.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `No se pudo crear la cita: ${error.message}`,
            variant: "destructive",
          });
        }
      });
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (selectedAppointment) {
      deleteAppointment(selectedAppointment.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedAppointment(null);
          toast({
            title: "Cita eliminada",
            description: "La cita ha sido eliminada correctamente.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `No se pudo eliminar la cita: ${error.message}`,
            variant: "destructive",
          });
        }
      });
    }
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Programada</span>;
      case "completed":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completada</span>;
      case "cancelled":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelada</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  // Check if appointment date is in the past
  const isDatePassed = (date: Date) => {
    return new Date(date) < new Date();
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="px-5 py-4 border-b border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-lg font-semibold text-neutral-900">
            Gestión de Citas
          </CardTitle>
          <Button 
            onClick={() => {
              setSelectedAppointment(null);
              setIsDialogOpen(true);
            }}
            className="inline-flex items-center px-3 py-1.5 border border-primary-600 text-primary-600 bg-white hover:bg-primary-50 rounded-md text-sm font-medium"
          >
            <PlusIcon className="h-4 w-4 mr-1.5" />
            Nueva Cita
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
                placeholder="Buscar citas..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="scheduled">Programadas</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-52">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-asc">Fecha: Más cercanas</SelectItem>
                  <SelectItem value="date-desc">Fecha: Más lejanas</SelectItem>
                  <SelectItem value="newest">Creación: Más recientes</SelectItem>
                  <SelectItem value="oldest">Creación: Más antiguas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Appointment list */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-neutral-50 text-neutral-500 uppercase text-xs">Fecha y Hora</TableHead>
                  <TableHead className="bg-neutral-50 text-neutral-500 uppercase text-xs">Cliente</TableHead>
                  <TableHead className="bg-neutral-50 text-neutral-500 uppercase text-xs">Propiedad</TableHead>
                  <TableHead className="bg-neutral-50 text-neutral-500 uppercase text-xs">Estado</TableHead>
                  <TableHead className="bg-neutral-50 text-neutral-500 uppercase text-xs">Notas</TableHead>
                  <TableHead className="bg-neutral-50 text-neutral-500 uppercase text-xs">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeleton
                  Array(4).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      Error al cargar las citas. Inténtalo de nuevo.
                    </TableCell>
                  </TableRow>
                ) : sortedAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                      No se encontraron citas. {search && "Prueba con otra búsqueda."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAppointments.map((appointment) => {
                    const isPastDate = isDatePassed(appointment.date);
                    
                    return (
                      <TableRow key={appointment.id} className={`hover:bg-neutral-50 ${isPastDate && appointment.status === 'scheduled' ? 'bg-red-50' : ''}`}>
                        <TableCell className="font-medium">
                          <div className="flex items-start">
                            <Calendar className={`h-4 w-4 mr-2 mt-0.5 ${isPastDate && appointment.status === 'scheduled' ? 'text-red-500' : 'text-neutral-500'}`} />
                            <div>
                              {formatDateTime(appointment.date)}
                              {isPastDate && appointment.status === 'scheduled' && (
                                <p className="text-xs text-red-500 font-medium">Fecha pasada</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1.5 text-neutral-500" />
                            <span className="text-sm">{getLeadName(appointment.leadId)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1.5 text-neutral-500" />
                            <span className="text-sm">{getPropertyTitle(appointment.propertyId)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate text-sm text-neutral-600">
                            {appointment.notes || "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedAppointment(appointment);
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
                                setSelectedAppointment(appointment);
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
          {!isLoading && !error && sortedAppointments.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-neutral-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-medium">{Math.min(currentPage * itemsPerPage, sortedAppointments.length)}</span> de <span className="font-medium">{sortedAppointments.length}</span> citas
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

      {/* Appointment Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedAppointment ? "Editar Cita" : "Crear Nueva Cita"}</DialogTitle>
            <DialogDescription>
              {selectedAppointment 
                ? "Actualiza la información de la cita existente" 
                : "Programa una nueva cita con un cliente"}
            </DialogDescription>
          </DialogHeader>
          
          <AppointmentForm 
            initialData={selectedAppointment || undefined} 
            onSubmit={handleSubmit} 
            isSubmitting={isCreating || isUpdating}
            leads={leads || []}
            properties={properties || []}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer.
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

export default AppointmentList;
