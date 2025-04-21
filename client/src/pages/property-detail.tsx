import { useParams, useLocation } from "wouter";
import { useProperties } from "@/hooks/use-properties";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Building, 
  MapPin, 
  Euro, 
  Home, 
  Bath, 
  LandPlot, 
  Calendar, 
  Check, 
  X,
  Edit, 
  Trash2 
} from "lucide-react";
import { cn, formatCurrency, formatDate, getPropertyStatus } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { useProperty, deleteProperty, isDeleting } = useProperties();
  const { data: property, isLoading, error } = useProperty(parseInt(id));

  const handleDelete = () => {
    deleteProperty(parseInt(id), {
      onSuccess: () => {
        navigate("/properties");
      }
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Detalle de Propiedad">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="relative h-64 mb-4">
                <Skeleton className="h-full w-full rounded-md" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !property) {
    return (
      <DashboardLayout title="Error">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Error al cargar la propiedad</h2>
              <p className="text-gray-600 mb-4">
                No se ha podido cargar la información de la propiedad. Por favor, inténtelo de nuevo.
              </p>
              <Button onClick={() => navigate("/properties")}>
                Volver a Propiedades
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const statusInfo = getPropertyStatus(property.status);
  const propertyTypeDisplay = {
    apartment: "Piso",
    house: "Casa",
    office: "Oficina",
    commercial: "Local Comercial",
    land: "Terreno",
    parking: "Parking",
    storage: "Trastero"
  }[property.type as keyof typeof propertyTypeDisplay] || property.type;

  const features = property.features as string[] || [];

  return (
    <DashboardLayout title="Detalle de Propiedad">
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center mt-1">
              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-gray-600 text-sm">{property.location}</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate(`/properties/${id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará permanentemente esta propiedad
                    y no se podrá recuperar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-red-600 text-white hover:bg-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Eliminando..." : "Eliminar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Property images */}
        <Card>
          <CardContent className="p-6">
            {(property.images as string[])?.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {(property.images as string[]).map((image, index) => (
                    <CarouselItem key={index}>
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={image}
                          alt={`${property.title} - Imagen ${index + 1}`}
                          className="rounded-md object-cover w-full h-full"
                        />
                      </AspectRatio>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            ) : (
              <div className="w-full rounded-md bg-gray-100 flex items-center justify-center" style={{ height: '300px' }}>
                <Building className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Property details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Propiedad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Descripción</h3>
                  <p className="text-gray-700">{property.description}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Detalles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-primary-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Tipo</p>
                        <p className="font-medium">{propertyTypeDisplay}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Euro className="h-5 w-5 text-primary-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Precio</p>
                        <p className="font-medium">{formatCurrency(property.price)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={cn(
                        "h-5 w-5 rounded-full flex items-center justify-center mr-2",
                        statusInfo.colorClass.includes("green") ? "bg-green-100" :
                        statusInfo.colorClass.includes("yellow") ? "bg-yellow-100" :
                        statusInfo.colorClass.includes("red") ? "bg-red-100" : "bg-blue-100"
                      )}>
                        <div className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          statusInfo.colorClass.includes("green") ? "bg-green-500" :
                          statusInfo.colorClass.includes("yellow") ? "bg-yellow-500" :
                          statusInfo.colorClass.includes("red") ? "bg-red-500" : "bg-blue-500"
                        )} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <p className="font-medium">{statusInfo.label}</p>
                      </div>
                    </div>
                    
                    {property.bedrooms !== undefined && property.bedrooms !== null && (
                      <div className="flex items-center">
                        <Home className="h-5 w-5 text-primary-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Dormitorios</p>
                          <p className="font-medium">{property.bedrooms}</p>
                        </div>
                      </div>
                    )}
                    
                    {property.bathrooms !== undefined && property.bathrooms !== null && (
                      <div className="flex items-center">
                        <Bath className="h-5 w-5 text-primary-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Baños</p>
                          <p className="font-medium">{property.bathrooms}</p>
                        </div>
                      </div>
                    )}
                    
                    {property.area !== undefined && property.area !== null && (
                      <div className="flex items-center">
                        <LandPlot className="h-5 w-5 text-primary-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Superficie</p>
                          <p className="font-medium">{property.area} m²</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-primary-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Fecha de creación</p>
                        <p className="font-medium">{formatDate(property.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {features.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-medium mb-4">Características</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Dirección</h3>
                  <p className="text-gray-700">{property.address}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Programar Visita
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Añadir Lead Interesado
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar por Email
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Share className="mr-2 h-4 w-4" />
                  Compartir Propiedad
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Adding these imports at the end to prevent TypeScript errors since they weren't included at the top
import { Users, Mail, Share } from "lucide-react";
