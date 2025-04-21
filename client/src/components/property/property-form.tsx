import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertPropertySchema, InsertProperty } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Trash2, Upload, X, Plus, Image as ImageIcon } from "lucide-react";

// Extend the property schema with some validation
const extendedPropertySchema = insertPropertySchema.extend({
  title: z.string().min(5, { message: "El título debe tener al menos 5 caracteres" }),
  description: z.string().min(20, { message: "La descripción debe tener al menos 20 caracteres" }),
  price: z.number().min(1, { message: "El precio debe ser mayor que 0" }),
  location: z.string().min(3, { message: "La ubicación es requerida" }),
  address: z.string().min(5, { message: "La dirección es requerida" }),
  // Make these fields optional but validate them if they're present
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  area: z.number().min(1).optional(),
});

// Create a type for our form values that matches the schema
type PropertyFormValues = z.infer<typeof extendedPropertySchema>;

interface PropertyFormProps {
  initialData?: InsertProperty;
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
}

export function PropertyForm({ initialData, onSubmit, isSubmitting }: PropertyFormProps) {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.images ? (initialData.images as string[]) : []
  );
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>(
    initialData?.images ? (initialData.images as string[]) : []
  );
  
  // Initialize form with initialData or default values
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(extendedPropertySchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      type: "apartment",
      price: 0,
      location: "",
      address: "",
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      features: [],
      images: [],
      status: "available",
    },
  });
  
  // Common property features
  const propertyFeatures = [
    { id: "parking", label: "Parking" },
    { id: "elevator", label: "Ascensor" },
    { id: "pool", label: "Piscina" },
    { id: "garden", label: "Jardín" },
    { id: "terrace", label: "Terraza" },
    { id: "airConditioning", label: "Aire acondicionado" },
    { id: "heating", label: "Calefacción" },
    { id: "security", label: "Seguridad" },
    { id: "storage", label: "Trastero" },
    { id: "furnished", label: "Amueblado" },
  ];
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUploadedImages(prev => [...prev, ...filesArray]);
      
      // Create object URLs for previews
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };
  
  // Remove an uploaded image
  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviewUrls[existingImages.length + index]);
    
    setImagePreviewUrls(prev => {
      const newPreviews = [...prev];
      newPreviews.splice(existingImages.length + index, 1);
      return newPreviews;
    });
  };
  
  // Remove an existing image
  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };
  
  // Handle form submission
  const handleSubmit = (values: PropertyFormValues) => {
    const formData = new FormData();
    
    // Add property data
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'features' && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null && key !== 'images') {
        formData.append(key, String(value));
      }
    });
    
    // Add the uploaded images
    uploadedImages.forEach(file => {
      formData.append('images', file);
    });
    
    // Add references to existing images that should be kept
    existingImages.forEach(imagePath => {
      formData.append('keepImages', imagePath);
    });
    
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Información Básica</h3>
              <p className="text-sm text-gray-500">
                Ingrese la información principal de la propiedad.
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Apartamento Moderno en Eixample" {...field} />
                  </FormControl>
                  <FormDescription>
                    Un título descriptivo para la propiedad.
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
                      placeholder="Describa las características y ventajas de la propiedad..."
                      className="resize-y min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Una descripción detallada para atraer a potenciales compradores.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Propiedad</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="apartment">Piso / Apartamento</SelectItem>
                        <SelectItem value="house">Casa</SelectItem>
                        <SelectItem value="office">Oficina</SelectItem>
                        <SelectItem value="commercial">Local Comercial</SelectItem>
                        <SelectItem value="land">Terreno</SelectItem>
                        <SelectItem value="parking">Parking</SelectItem>
                        <SelectItem value="storage">Trastero</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="250000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <FormControl>
                      <Input placeholder="Barcelona, Eixample" {...field} />
                    </FormControl>
                    <FormDescription>
                      Ciudad y zona (ej. Barcelona, Eixample)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Calle Example, 123" {...field} />
                    </FormControl>
                    <FormDescription>
                      Dirección completa de la propiedad
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Características</h3>
              <p className="text-sm text-gray-500">
                Detalles adicionales sobre la propiedad.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dormitorios</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="2"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Baños</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Superficie (m²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="85"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />
            
            <div>
              <FormLabel>Características adicionales</FormLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {propertyFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature.id}
                      checked={(form.watch("features") as string[])?.includes(feature.id)}
                      onCheckedChange={(checked) => {
                        const currentFeatures = form.watch("features") as string[] || [];
                        const updatedFeatures = checked
                          ? [...currentFeatures, feature.id]
                          : currentFeatures.filter((f) => f !== feature.id);
                        form.setValue("features", updatedFeatures);
                      }}
                    />
                    <label
                      htmlFor={feature.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {feature.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="reserved">Reservado</SelectItem>
                      <SelectItem value="sold">Vendido</SelectItem>
                      <SelectItem value="rented">Alquilado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Imágenes</h3>
              <p className="text-sm text-gray-500">
                Sube fotos de alta calidad de la propiedad. Máximo 10 imágenes.
              </p>
            </div>
            
            {/* Image upload area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Upload className="h-10 w-10 text-gray-400" />
                </div>
                <div className="text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer text-primary-600 hover:text-primary-700">
                    <span>Subir imágenes</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploadedImages.length + existingImages.length >= 10}
                    />
                  </label>
                  <p>o arrastra y suelta</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WEBP hasta 5MB
                </p>
              </div>
            </div>
            
            {/* Image previews */}
            {imagePreviewUrls.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Imágenes ({imagePreviewUrls.length}/10)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imagePreviewUrls.map((url, index) => {
                    const isExisting = index < existingImages.length;
                    
                    return (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            if (isExisting) {
                              removeExistingImage(index);
                            } else {
                              removeUploadedImage(index - existingImages.length);
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                  
                  {imagePreviewUrls.length < 10 && (
                    <div className="aspect-square rounded-md border border-dashed border-gray-300 flex items-center justify-center">
                      <label htmlFor="add-more-images" className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-gray-600">
                        <Plus className="h-6 w-6 mb-1" />
                        <span className="text-xs">Añadir</span>
                        <input
                          id="add-more-images"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : initialData ? "Actualizar Propiedad" : "Crear Propiedad"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default PropertyForm;
