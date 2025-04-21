# Módulo de Propiedades

El módulo de Propiedades es el componente central de InmoAdmin, permitiendo la gestión completa de propiedades inmobiliarias incluyendo listado, creación, edición y visualización detallada.

## Visión General

El módulo de Propiedades permite a los usuarios:

1. **Listar propiedades** con filtrado y ordenación
2. **Crear nuevas propiedades** con detalles completos e imágenes
3. **Editar propiedades existentes**
4. **Ver información detallada** de cada propiedad
5. **Eliminar propiedades**
6. **Gestionar el estado** de las propiedades (disponible, reservada, vendida, etc.)

## Modelo de Datos

El esquema de datos para propiedades se define en `shared/schema.ts`:

```typescript
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // apartment, house, office, commercial, etc.
  price: integer("price").notNull(),
  location: text("location").notNull(),
  address: text("address").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  area: integer("area"),
  features: jsonb("features").$type<string[]>(),
  images: jsonb("images").$type<string[]>(),
  status: text("status").default("available").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### Tipos de Propiedades

El sistema soporta los siguientes tipos de propiedades (`type`):
- `apartment`: Pisos o apartamentos
- `house`: Casas o chalets
- `office`: Oficinas
- `commercial`: Locales comerciales
- `land`: Terrenos
- `parking`: Plazas de garaje
- `storage`: Trasteros

### Estados de Propiedades

El sistema usa los siguientes estados (`status`):
- `available`: Disponible para venta/alquiler
- `reserved`: Reservada
- `sold`: Vendida
- `rented`: Alquilada
- `hidden`: Oculta (no visible en listados públicos)

### Validación de Datos

El esquema de validación para propiedades se define con Zod:

```typescript
export const insertPropertySchema = createInsertSchema(properties).pick({
  title: true,
  description: true,
  type: true,
  price: true,
  location: true,
  address: true,
  bedrooms: true,
  bathrooms: true,
  area: true,
  features: true,
  images: true,
  status: true,
});
```

## Componentes de UI

### 1. PropertyList

El componente `PropertyList` muestra una lista paginada de propiedades con opciones de filtrado y ordenación.

**Ubicación**: `client/src/components/property/property-list.tsx`

**Características**:
- Vista en tabla para pantallas grandes
- Vista en tarjetas para móviles
- Filtrado por tipo y búsqueda
- Ordenación por precio o fecha
- Paginación

**Uso**:
```tsx
import { PropertyList } from "@/components/property/property-list";

export default function PropertiesPage() {
  return <PropertyList />;
}
```

### 2. PropertyCard

El componente `PropertyCard` muestra una propiedad individual en formato tarjeta.

**Ubicación**: `client/src/components/property/property-card.tsx`

**Características**:
- Muestra imagen, título, precio y ubicación
- Botones de acción (editar, eliminar)
- Indicador de estado
- Expansible para mostrar más información

### 3. PropertyForm

El componente `PropertyForm` proporciona un formulario para crear o editar propiedades.

**Ubicación**: `client/src/components/property/property-form.tsx`

**Características**:
- Validación de campos con Zod
- Carga de imágenes múltiples
- Campos para características, precio, ubicación, etc.
- Soporte para crear o actualizar propiedades existentes

### 4. PropertyDetail

El componente `PropertyDetail` muestra información completa de una propiedad.

**Ubicación**: `client/src/pages/property-detail.tsx`

**Características**:
- Galería de imágenes
- Detalles completos (habitaciones, baños, superficie)
- Características especiales
- Estado y precio
- Acciones disponibles (editar, eliminar)

## Hooks Personalizados

### useProperties

Este hook proporciona funciones para acceder y manipular datos de propiedades.

**Ubicación**: `client/src/hooks/use-properties.ts`

**Funciones**:
- `usePropertiesList()`: Obtiene lista de propiedades
- `useProperty(id)`: Obtiene una propiedad por ID
- `createProperty()`: Crea una nueva propiedad
- `updateProperty()`: Actualiza una propiedad existente
- `deleteProperty()`: Elimina una propiedad

**Ejemplo de uso**:
```tsx
import { useProperties } from "@/hooks/use-properties";

function PropertySection() {
  const { usePropertiesList, deleteProperty } = useProperties();
  const { data: properties, isLoading } = usePropertiesList();
  
  const handleDelete = async (id) => {
    await deleteProperty(id);
    // Manejar actualización de UI...
  };
  
  if (isLoading) return <div>Cargando...</div>;
  
  return (
    <div>
      {properties?.map(property => (
        <div key={property.id}>
          {property.title}
          <button onClick={() => handleDelete(property.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}
```

## Rutas de API

### Obtener Todas las Propiedades

```
GET /api/properties
```

**Parámetros de consulta**:
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `type`: Filtrar por tipo
- `status`: Filtrar por estado
- `sortBy`: Campo para ordenar (ej: "price", "-createdAt")

**Respuesta exitosa**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Ático con terraza en la Puerta del Sol",
      "description": "...",
      "price": 450000,
      "location": "Madrid Centro",
      // otros campos...
    },
    // más propiedades...
  ],
  "total": 45,
  "page": 1,
  "limit": 10,
  "pages": 5
}
```

### Obtener una Propiedad por ID

```
GET /api/properties/:id
```

**Respuesta exitosa**:
```json
{
  "id": 1,
  "title": "Ático con terraza en la Puerta del Sol",
  "description": "...",
  "price": 450000,
  "location": "Madrid Centro",
  "address": "Calle Mayor 10",
  "bedrooms": 3,
  "bathrooms": 2,
  "area": 120,
  "features": ["Terraza", "Ascensor", "Aire acondicionado"],
  "images": ["url/imagen1.jpg", "url/imagen2.jpg"],
  "status": "available",
  "createdAt": "2023-01-15T14:30:00Z",
  "updatedAt": "2023-01-15T14:30:00Z"
}
```

### Crear una Nueva Propiedad

```
POST /api/properties
```

**Tipo de contenido**: `multipart/form-data`

**Cuerpo de la petición**:
- `title`: Título de la propiedad
- `description`: Descripción detallada
- `type`: Tipo de propiedad
- `price`: Precio
- `location`: Ubicación general
- `address`: Dirección exacta
- `bedrooms`: Número de dormitorios (opcional)
- `bathrooms`: Número de baños (opcional)
- `area`: Superficie en m² (opcional)
- `features`: Características como JSON o array (opcional)
- `status`: Estado (opcional, por defecto "available")
- `images`: Archivos de imagen (opcional, máximo 10)

**Respuesta exitosa (201 Created)**:
```json
{
  "id": 1,
  "title": "Ático con terraza en la Puerta del Sol",
  // otros campos...
  "images": ["url/imagen1.jpg", "url/imagen2.jpg"],
  "createdAt": "2023-01-15T14:30:00Z",
  "updatedAt": "2023-01-15T14:30:00Z"
}
```

### Actualizar una Propiedad

```
PUT /api/properties/:id
```

**Tipo de contenido**: `multipart/form-data`

**Cuerpo de la petición**: Campos a actualizar (similar a la creación)

**Respuesta exitosa**:
```json
{
  "id": 1,
  "title": "Ático con terraza en la Puerta del Sol (Actualizado)",
  // campos actualizados...
  "updatedAt": "2023-01-20T10:15:00Z"
}
```

### Eliminar una Propiedad

```
DELETE /api/properties/:id
```

**Respuesta exitosa**:
```json
{
  "success": true,
  "message": "Propiedad eliminada correctamente"
}
```

## Integración con Otros Módulos

### Citas (Appointments)

Las propiedades están vinculadas con citas a través de `propertyId` en la tabla `appointments`.

```typescript
export const appointments = pgTable("appointments", {
  // ...otros campos
  propertyId: integer("property_id").references(() => properties.id),
  // ...
});
```

Esto permite:
- Programar visitas a propiedades
- Seguimiento del interés en las propiedades
- Análisis de qué propiedades generan más interés

### Leads (Clientes Potenciales)

Aunque no hay una relación directa en la base de datos, los leads se relacionan con propiedades a través de:
- Citas programadas para visitar propiedades
- Preferencias de búsqueda (coincidiendo con características de propiedades)
- Histórico de propiedades mostradas/recomendadas

### Análisis de Mercado

El módulo de análisis de mercado utiliza datos de las propiedades para:
- Comparar precios con referencias de mercado por zona
- Analizar tiempos de venta/alquiler
- Identificar tendencias en tipos de propiedades
- Recomendar precios basados en propiedades similares

## Flujos de Trabajo Comunes

### 1. Creación de una Propiedad

1. Usuario navega a `/properties`
2. Hace clic en "Nueva Propiedad"
3. Completa el formulario con los detalles de la propiedad
4. Sube imágenes de la propiedad
5. Envía el formulario
6. El sistema crea la propiedad en la base de datos
7. El usuario es redirigido a la página de detalle de la propiedad

### 2. Actualización del Estado de una Propiedad

1. Usuario navega a la página de detalle de la propiedad
2. Hace clic en "Editar"
3. Actualiza el campo "Estado" a "Reservada", "Vendida", etc.
4. Guarda los cambios
5. El sistema actualiza la propiedad
6. El usuario es redirigido a la página de detalle con el nuevo estado

### 3. Sincronización con Portales Externos

1. Usuario edita o crea una propiedad
2. Configura la opción de "Publicar en portales externos"
3. El sistema, mediante Automa.site, sincroniza los datos con:
   - Idealista.com
   - Fotocasa.es
4. El usuario puede ver el estado de sincronización y enlaces a los anuncios

## Mejores Prácticas

### Rendimiento

1. **Optimización de Imágenes**:
   - Utilizar tamaños adecuados para diferentes vistas
   - Comprimir imágenes para reducir tiempos de carga
   - Usar carga progresiva para mejorar UX

2. **Paginación y Filtrado**:
   - Implementar paginación del lado del servidor
   - Usar índices de BD para optimizar consultas frecuentes
   - Cachear resultados de búsquedas comunes

### Experiencia de Usuario

1. **Formularios**:
   - Validación instantánea para mejorar UX
   - Persistencia de datos parciales para evitar pérdidas
   - Previsualización de imágenes antes de subir

2. **Navegación**:
   - Proporcionar breadcrumbs para navegación clara
   - Implementar vistas "Volver a resultados"
   - Historial de propiedades vistas recientemente

### Seguridad

1. **Validación**:
   - Validar todos los inputs tanto en cliente como servidor
   - Sanitizar contenido HTML en descripciones
   - Verificar permisos antes de modificar propiedades

2. **Subida de Imágenes**:
   - Limitar tamaño y cantidad de imágenes
   - Escanear imágenes por contenido inapropiado
   - Almacenar en ubicaciones seguras con acceso controlado

## Extensiones y Mejoras Futuras

1. **Geolocalización**:
   - Integración con Google Maps/Mapbox
   - Búsqueda de propiedades por mapa
   - Cálculo automático de puntos de interés cercanos

2. **Tours Virtuales**:
   - Soporte para imágenes 360º
   - Integración con servicios de tour virtual
   - Visitas virtuales guiadas

3. **Análisis Avanzado**:
   - Predicción de precios con ML
   - Recomendaciones personalizadas para compradores
   - Análisis de rendimiento de propiedades

4. **Integración con IoT**:
   - Cerraduras inteligentes para gestión de visitas
   - Sensores para monitoreo de condiciones
   - Automatización de demostraciones

## Solución de Problemas Comunes

### Problemas con la Carga de Imágenes

**Síntoma**: Las imágenes no se cargan o se muestran rotas.

**Soluciones**:
1. Verificar permisos en directorio de uploads
2. Comprobar límites de tamaño en configuración
3. Revisar rutas relativas vs absolutas
4. Verificar CORS si las imágenes están en otro dominio

### Problemas de Rendimiento en Listados

**Síntoma**: La página de listado de propiedades carga lentamente.

**Soluciones**:
1. Implementar paginación si no existe
2. Reducir número de propiedades por página
3. Optimizar consultas a la base de datos
4. Implementar caché para resultados frecuentes

### Errores en Sincronización con Portales

**Síntoma**: La propiedad no aparece en los portales externos.

**Soluciones**:
1. Verificar credenciales de API
2. Comprobar logs de sincronización
3. Validar formato de datos para requisitos específicos
4. Revisar límites de API de los portales

## Recursos

- [Documentación de la API](../API.md#propiedades)
- [Guía de UI de Propiedades](PROPERTIES_UI.md)
- [Integración con Portales](../IDEALISTA_INTEGRATION.md)

## Soporte

Si encuentras problemas con el módulo de Propiedades, revisa primero esta documentación y la [sección de solución de problemas](#solución-de-problemas-comunes). Si el problema persiste, por favor abre un issue en GitHub con los siguientes detalles:

- Descripción detallada del problema
- Pasos para reproducirlo
- Comportamiento esperado vs comportamiento actual
- Capturas de pantalla (si aplicable)
- Versión del sistema

## Historial de Versiones

### v1.0.0 (Inicial)
- CRUD básico de propiedades
- Soporte para imágenes
- Listado y filtrado

### v1.1.0
- Integración con análisis de mercado
- Mejoras en UI móvil
- Optimización de rendimiento

### v1.2.0 (Actual)
- Sincronización con portales externos
- Mejoras en formularios
- Soporte para más tipos de propiedades