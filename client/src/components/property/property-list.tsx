import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Property } from '@shared/schema';
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
import { formatCurrency, getPropertyStatus } from "@/lib/utils";
import { PlusIcon, SearchIcon } from 'lucide-react';

export function PropertyList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  // Filter and sort properties
  const filteredProperties = properties?.filter(property => {
    const matchesSearch = search === "" || 
      property.title.toLowerCase().includes(search.toLowerCase()) ||
      property.location.toLowerCase().includes(search.toLowerCase());
      
    const matchesCategory = category === "all" || property.type === category;
    
    return matchesSearch && matchesCategory;
  }) || [];
  
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "price-high-low":
        return b.price - a.price;
      case "price-low-high":
        return a.price - b.price;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);
  const paginatedProperties = sortedProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="px-5 py-4 border-b border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CardTitle className="text-lg font-semibold text-neutral-900">
          Gestión de Propiedades
        </CardTitle>
        <Link href="/properties/create">
          <Button className="inline-flex items-center px-3 py-1.5 border border-primary-600 text-primary-600 bg-white hover:bg-primary-50 rounded-md text-sm font-medium">
            <PlusIcon className="h-4 w-4 mr-1.5" />
            Nueva Propiedad
          </Button>
        </Link>
      </CardHeader>
      
      <CardContent className="p-5">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative rounded-md w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-neutral-400" />
            </div>
            <Input
              type="text"
              placeholder="Buscar propiedades..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="apartment">Pisos</SelectItem>
                <SelectItem value="house">Casas</SelectItem>
                <SelectItem value="office">Oficinas</SelectItem>
                <SelectItem value="commercial">Locales</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-52">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Fecha: Más recientes</SelectItem>
                <SelectItem value="oldest">Fecha: Más antiguos</SelectItem>
                <SelectItem value="price-high-low">Precio: Mayor a menor</SelectItem>
                <SelectItem value="price-low-high">Precio: Menor a mayor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Desktop Property List (md and above) */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 bg-neutral-50 text-neutral-500 uppercase text-xs">ID</TableHead>
                <TableHead className="bg-neutral-50 text-neutral-500 uppercase text-xs">Propiedad</TableHead>
                <TableHead className="bg-neutral-50 text-neutral-500 uppercase text-xs">Ubicación</TableHead>
                <TableHead className="bg-neutral-50 text-neutral-500 uppercase text-xs">Precio</TableHead>
                <TableHead className="bg-neutral-50 text-neutral-500 uppercase text-xs">Estado</TableHead>
                <TableHead className="bg-neutral-50 text-neutral-500 uppercase text-xs">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton for desktop
                Array(4).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <div className="ml-3">
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                    Error al cargar las propiedades. Inténtalo de nuevo.
                  </TableCell>
                </TableRow>
              ) : sortedProperties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                    No se encontraron propiedades. {search && "Prueba con otra búsqueda."}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProperties.map((property) => {
                  const statusInfo = getPropertyStatus(property.status);
                  const propertyTypeDisplay = {
                    apartment: "Piso",
                    house: "Casa",
                    office: "Oficina",
                    commercial: "Local",
                    penthouse: "Ático",
                    loft: "Loft",
                  }[property.type as keyof typeof propertyTypeDisplay] || property.type;
                  
                  return (
                    <TableRow key={property.id} className="hover:bg-neutral-50">
                      <TableCell className="text-sm text-neutral-500">#{property.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-md bg-neutral-200 overflow-hidden">
                            {property.images && (property.images as string[])[0] ? (
                              <img 
                                src={(property.images as string[])[0]} 
                                alt={property.title} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-neutral-200 flex items-center justify-center text-neutral-400">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-neutral-900">{property.title}</p>
                            <p className="text-xs text-neutral-500">
                              {propertyTypeDisplay} · {property.bedrooms || 0} hab · {property.bathrooms || 0} baño{property.bathrooms !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-neutral-700">{property.location}</TableCell>
                      <TableCell className="text-sm text-neutral-700">{formatCurrency(property.price)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.colorClass}`}>
                          {statusInfo.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="text-blue-600 hover:text-blue-800 cursor-pointer"
                            onClick={() => window.location.href = `/properties/${property.id}`}
                          >
                            Ver
                          </div>
                          <div 
                            className="text-primary-600 hover:text-primary-900 cursor-pointer"
                            onClick={() => window.location.href = `/properties/${property.id}/edit`}
                          >
                            Editar
                          </div>
                          <button 
                            onClick={() => {
                              // Implement delete functionality here
                              if (confirm("¿Estás seguro de que deseas eliminar esta propiedad?")) {
                                // Delete property
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Mobile Property Cards (sm and below) */}
        <div className="md:hidden space-y-4">
          {isLoading ? (
            // Loading skeleton for mobile
            Array(4).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden border border-neutral-200">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="flex items-start space-x-3">
                    <Skeleton className="h-20 w-20 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 space-x-2">
                    <Skeleton className="h-8 w-16 rounded" />
                    <Skeleton className="h-8 w-16 rounded" />
                  </div>
                </div>
              </Card>
            ))
          ) : error ? (
            <div className="text-center py-8 text-neutral-500">
              Error al cargar las propiedades. Inténtalo de nuevo.
            </div>
          ) : sortedProperties.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              No se encontraron propiedades. {search && "Prueba con otra búsqueda."}
            </div>
          ) : (
            paginatedProperties.map((property) => {
              const statusInfo = getPropertyStatus(property.status);
              const propertyTypeDisplay = {
                apartment: "Piso",
                house: "Casa",
                office: "Oficina",
                commercial: "Local",
                penthouse: "Ático",
                loft: "Loft",
              }[property.type as keyof typeof propertyTypeDisplay] || property.type;
              
              return (
                <Card key={property.id} className="overflow-hidden border border-neutral-200 hover:shadow-md transition-shadow">
                  <Link href={`/properties/${property.id}`}>
                    <div className="p-4 cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-medium text-neutral-900 line-clamp-1">{property.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.colorClass}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="h-20 w-20 flex-shrink-0 rounded-md bg-neutral-200 overflow-hidden">
                          {property.images && (property.images as string[])[0] ? (
                            <img 
                              src={(property.images as string[])[0]} 
                              alt={property.title} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-neutral-200 flex items-center justify-center text-neutral-400">
                              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-sm text-neutral-500 mb-1">
                            {property.location}
                          </p>
                          <p className="text-xs text-neutral-500 mb-2">
                            {propertyTypeDisplay} · {property.bedrooms || 0} hab · {property.bathrooms || 0} baño{property.bathrooms !== 1 ? 's' : ''}
                          </p>
                          <p className="text-base font-semibold text-primary-700">
                            {formatCurrency(property.price)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-3 space-x-2">
                        <Link href={`/properties/${property.id}/edit`}>
                          <Button size="sm" variant="outline" className="text-xs h-8">
                            Editar
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs h-8 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (confirm("¿Estás seguro de que deseas eliminar esta propiedad?")) {
                              // Delete property
                            }
                          }}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>
              );
            })
          )}
        </div>
        
        {/* Pagination */}
        {!isLoading && !error && sortedProperties.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-neutral-700">
              Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-medium">{Math.min(currentPage * itemsPerPage, sortedProperties.length)}</span> de <span className="font-medium">{sortedProperties.length}</span> propiedades
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
  );
}

export default PropertyList;
