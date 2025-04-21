# Documentación de la API de InmoAdmin

Esta documentación detalla los endpoints disponibles en la API RESTful de InmoAdmin, sus parámetros, respuestas y códigos de estado.

## Información General

- Base URL: `https://api.inmoadmin.com` (producción)
- Formato de datos: JSON
- Autenticación: Basada en sesiones (cookies)

## Autenticación

### Registro de Usuario

```
POST /api/register
```

Registra un nuevo usuario en el sistema.

**Cuerpo de la Petición:**
```json
{
  "username": "usuario@ejemplo.com",
  "password": "contraseña_segura",
  "fullName": "Nombre Completo",
  "role": "admin"
}
```

**Respuesta Exitosa (201 Created):**
```json
{
  "id": 1,
  "username": "usuario@ejemplo.com",
  "fullName": "Nombre Completo",
  "role": "admin",
  "avatar": null
}
```

**Respuesta de Error (400 Bad Request):**
```json
{
  "error": "El nombre de usuario ya existe"
}
```

### Inicio de Sesión

```
POST /api/login
```

Autentica a un usuario y crea una sesión.

**Cuerpo de la Petición:**
```json
{
  "username": "usuario@ejemplo.com",
  "password": "contraseña_segura"
}
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": 1,
  "username": "usuario@ejemplo.com",
  "fullName": "Nombre Completo",
  "role": "admin",
  "avatar": null
}
```

**Respuesta de Error (401 Unauthorized):**
```json
{
  "error": "Credenciales inválidas"
}
```

### Cierre de Sesión

```
POST /api/logout
```

Cierra la sesión actual del usuario.

**Respuesta Exitosa (200 OK):**
```json
{
  "message": "Sesión cerrada correctamente"
}
```

### Usuario Actual

```
GET /api/user
```

Obtiene información del usuario actualmente autenticado.

**Respuesta Exitosa (200 OK):**
```json
{
  "id": 1,
  "username": "usuario@ejemplo.com",
  "fullName": "Nombre Completo",
  "role": "admin",
  "avatar": null
}
```

**Respuesta de Error (401 Unauthorized):**
```json
{
  "error": "No autenticado"
}
```

## Gestión de Propiedades

### Listar Propiedades

```
GET /api/properties
```

Obtiene un listado de todas las propiedades.

**Parámetros de Consulta:**
- `page` (opcional): Número de página (por defecto: 1)
- `limit` (opcional): Número de resultados por página (por defecto: 10)
- `type` (opcional): Filtrar por tipo de propiedad
- `status` (opcional): Filtrar por estado
- `sort` (opcional): Campo para ordenar (ej: 'price', '-price' para descendente)

**Respuesta Exitosa (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Ático con terraza en la Puerta del Sol",
      "description": "Hermoso ático reformado...",
      "type": "apartment",
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
      "updatedAt": "2023-01-20T10:45:00Z"
    }
    // más propiedades...
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "pages": 5
}
```

### Obtener Propiedad por ID

```
GET /api/properties/:id
```

Obtiene los detalles de una propiedad específica.

**Respuesta Exitosa (200 OK):**
```json
{
  "id": 1,
  "title": "Ático con terraza en la Puerta del Sol",
  "description": "Hermoso ático reformado...",
  "type": "apartment",
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
  "updatedAt": "2023-01-20T10:45:00Z"
}
```

**Respuesta de Error (404 Not Found):**
```json
{
  "error": "Propiedad no encontrada"
}
```

### Crear Propiedad

```
POST /api/properties
```

Crea una nueva propiedad.

**Cuerpo de la Petición (multipart/form-data):**
```
title: "Ático con terraza en la Puerta del Sol"
description: "Hermoso ático reformado..."
type: "apartment"
price: 450000
location: "Madrid Centro"
address: "Calle Mayor 10"
bedrooms: 3
bathrooms: 2
area: 120
features: ["Terraza", "Ascensor", "Aire acondicionado"]
status: "available"
images: [archivo1.jpg, archivo2.jpg]
```

**Respuesta Exitosa (201 Created):**
```json
{
  "id": 1,
  "title": "Ático con terraza en la Puerta del Sol",
  "description": "Hermoso ático reformado...",
  "type": "apartment",
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

### Actualizar Propiedad

```
PUT /api/properties/:id
```

Actualiza una propiedad existente.

**Cuerpo de la Petición (multipart/form-data):**
```
title: "Ático con terraza reformado en la Puerta del Sol"
price: 475000
status: "reserved"
newImages: [archivo3.jpg]
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": 1,
  "title": "Ático con terraza reformado en la Puerta del Sol",
  "description": "Hermoso ático reformado...",
  "type": "apartment",
  "price": 475000,
  "location": "Madrid Centro",
  "address": "Calle Mayor 10",
  "bedrooms": 3,
  "bathrooms": 2,
  "area": 120,
  "features": ["Terraza", "Ascensor", "Aire acondicionado"],
  "images": ["url/imagen1.jpg", "url/imagen2.jpg", "url/imagen3.jpg"],
  "status": "reserved",
  "createdAt": "2023-01-15T14:30:00Z",
  "updatedAt": "2023-01-20T10:45:00Z"
}
```

### Eliminar Propiedad

```
DELETE /api/properties/:id
```

Elimina una propiedad.

**Respuesta Exitosa (200 OK):**
```json
{
  "message": "Propiedad eliminada correctamente"
}
```

## Gestión de Leads (Clientes Potenciales)

### Listar Leads

```
GET /api/leads
```

Obtiene un listado de todos los leads.

**Parámetros de Consulta:**
- `page` (opcional): Número de página
- `limit` (opcional): Número de resultados por página
- `stage` (opcional): Filtrar por etapa del cliente
- `sort` (opcional): Campo para ordenar

**Respuesta Exitosa (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "phone": "+34600123456",
      "interest": "buy",
      "budget": 400000,
      "preferredLocation": "Madrid Centro",
      "stage": "qualified",
      "notes": "Busca propiedad con terraza",
      "lastContactDate": "2023-02-10T09:15:00Z",
      "createdAt": "2023-02-01T11:20:00Z",
      "updatedAt": "2023-02-10T09:15:00Z"
    }
    // más leads...
  ],
  "total": 20,
  "page": 1,
  "limit": 10,
  "pages": 2
}
```

### Obtener Lead por ID

```
GET /api/leads/:id
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "phone": "+34600123456",
  "interest": "buy",
  "budget": 400000,
  "preferredLocation": "Madrid Centro",
  "stage": "qualified",
  "notes": "Busca propiedad con terraza",
  "lastContactDate": "2023-02-10T09:15:00Z",
  "createdAt": "2023-02-01T11:20:00Z",
  "updatedAt": "2023-02-10T09:15:00Z"
}
```

### Crear Lead

```
POST /api/leads
```

**Cuerpo de la Petición:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "phone": "+34600123456",
  "interest": "buy",
  "budget": 400000,
  "preferredLocation": "Madrid Centro",
  "stage": "new",
  "notes": "Busca propiedad con terraza"
}
```

**Respuesta Exitosa (201 Created):**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "phone": "+34600123456",
  "interest": "buy",
  "budget": 400000,
  "preferredLocation": "Madrid Centro",
  "stage": "new",
  "notes": "Busca propiedad con terraza",
  "lastContactDate": null,
  "createdAt": "2023-02-01T11:20:00Z",
  "updatedAt": "2023-02-01T11:20:00Z"
}
```

### Actualizar Lead

```
PUT /api/leads/:id
```

**Cuerpo de la Petición:**
```json
{
  "stage": "qualified",
  "notes": "Busca propiedad con terraza. Presupuesto flexible.",
  "lastContactDate": "2023-02-10T09:15:00Z"
}
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "phone": "+34600123456",
  "interest": "buy",
  "budget": 400000,
  "preferredLocation": "Madrid Centro",
  "stage": "qualified",
  "notes": "Busca propiedad con terraza. Presupuesto flexible.",
  "lastContactDate": "2023-02-10T09:15:00Z",
  "createdAt": "2023-02-01T11:20:00Z",
  "updatedAt": "2023-02-10T09:15:00Z"
}
```

### Eliminar Lead

```
DELETE /api/leads/:id
```

**Respuesta Exitosa (200 OK):**
```json
{
  "message": "Lead eliminado correctamente"
}
```

## Gestión de Citas

### Listar Citas

```
GET /api/appointments
```

**Parámetros de Consulta:**
- `page` (opcional): Número de página
- `limit` (opcional): Número de resultados por página
- `date` (opcional): Filtrar por fecha (formato: YYYY-MM-DD)
- `leadId` (opcional): Filtrar por ID de lead
- `propertyId` (opcional): Filtrar por ID de propiedad

**Respuesta Exitosa (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "date": "2023-02-15T16:00:00Z",
      "status": "scheduled",
      "notes": "Visita para ver el ático",
      "leadId": 1,
      "propertyId": 1,
      "createdAt": "2023-02-10T09:30:00Z",
      "lead": {
        "id": 1,
        "name": "Juan Pérez",
        "email": "juan@ejemplo.com"
      },
      "property": {
        "id": 1,
        "title": "Ático con terraza en la Puerta del Sol"
      }
    }
    // más citas...
  ],
  "total": 15,
  "page": 1,
  "limit": 10,
  "pages": 2
}
```

### Obtener Cita por ID

```
GET /api/appointments/:id
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": 1,
  "date": "2023-02-15T16:00:00Z",
  "status": "scheduled",
  "notes": "Visita para ver el ático",
  "leadId": 1,
  "propertyId": 1,
  "createdAt": "2023-02-10T09:30:00Z",
  "lead": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "phone": "+34600123456"
  },
  "property": {
    "id": 1,
    "title": "Ático con terraza en la Puerta del Sol",
    "address": "Calle Mayor 10",
    "location": "Madrid Centro"
  }
}
```

### Crear Cita

```
POST /api/appointments
```

**Cuerpo de la Petición:**
```json
{
  "date": "2023-02-15T16:00:00Z",
  "status": "scheduled",
  "notes": "Visita para ver el ático",
  "leadId": 1,
  "propertyId": 1
}
```

**Respuesta Exitosa (201 Created):**
```json
{
  "id": 1,
  "date": "2023-02-15T16:00:00Z",
  "status": "scheduled",
  "notes": "Visita para ver el ático",
  "leadId": 1,
  "propertyId": 1,
  "createdAt": "2023-02-10T09:30:00Z"
}
```

### Actualizar Cita

```
PUT /api/appointments/:id
```

**Cuerpo de la Petición:**
```json
{
  "date": "2023-02-16T10:00:00Z",
  "status": "rescheduled",
  "notes": "Visita para ver el ático. Reprogramada a petición del cliente."
}
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": 1,
  "date": "2023-02-16T10:00:00Z",
  "status": "rescheduled",
  "notes": "Visita para ver el ático. Reprogramada a petición del cliente.",
  "leadId": 1,
  "propertyId": 1,
  "createdAt": "2023-02-10T09:30:00Z"
}
```

### Eliminar Cita

```
DELETE /api/appointments/:id
```

**Respuesta Exitosa (200 OK):**
```json
{
  "message": "Cita eliminada correctamente"
}
```

## Gestión de Flujos de Trabajo

### Listar Flujos de Trabajo

```
GET /api/workflows
```

**Parámetros de Consulta:**
- `page` (opcional): Número de página
- `limit` (opcional): Número de resultados por página
- `type` (opcional): Filtrar por tipo de flujo
- `status` (opcional): Filtrar por estado

**Respuesta Exitosa (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Proceso de compra - Juan Pérez",
      "type": "sale",
      "progress": 25,
      "description": "Seguimiento del proceso de compra",
      "status": "active",
      "createdAt": "2023-02-20T10:00:00Z",
      "updatedAt": "2023-02-25T14:30:00Z"
    }
    // más flujos...
  ],
  "total": 8,
  "page": 1,
  "limit": 10,
  "pages": 1
}
```

### Obtener Flujo de Trabajo por ID

```
GET /api/workflows/:id
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": 1,
  "name": "Proceso de compra - Juan Pérez",
  "type": "sale",
  "progress": 25,
  "description": "Seguimiento del proceso de compra",
  "status": "active",
  "createdAt": "2023-02-20T10:00:00Z",
  "updatedAt": "2023-02-25T14:30:00Z"
}
```

### Crear Flujo de Trabajo

```
POST /api/workflows
```

**Cuerpo de la Petición:**
```json
{
  "name": "Proceso de compra - Juan Pérez",
  "type": "sale",
  "progress": 0,
  "description": "Seguimiento del proceso de compra",
  "status": "active"
}
```

**Respuesta Exitosa (201 Created):**
```json
{
  "id": 1,
  "name": "Proceso de compra - Juan Pérez",
  "type": "sale",
  "progress": 0,
  "description": "Seguimiento del proceso de compra",
  "status": "active",
  "createdAt": "2023-02-20T10:00:00Z",
  "updatedAt": "2023-02-20T10:00:00Z"
}
```

### Actualizar Flujo de Trabajo

```
PUT /api/workflows/:id
```

**Cuerpo de la Petición:**
```json
{
  "progress": 25,
  "status": "active"
}
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": 1,
  "name": "Proceso de compra - Juan Pérez",
  "type": "sale",
  "progress": 25,
  "description": "Seguimiento del proceso de compra",
  "status": "active",
  "createdAt": "2023-02-20T10:00:00Z",
  "updatedAt": "2023-02-25T14:30:00Z"
}
```

### Eliminar Flujo de Trabajo

```
DELETE /api/workflows/:id
```

**Respuesta Exitosa (200 OK):**
```json
{
  "message": "Flujo de trabajo eliminado correctamente"
}
```

## Análisis de Mercado

### Obtener Precios por Zona

```
GET /api/market-analysis/prices
```

**Parámetros de Consulta:**
- `location` (opcional): Filtrar por ubicación
- `propertyType` (opcional): Filtrar por tipo de propiedad

**Respuesta Exitosa (200 OK):**
```json
{
  "data": [
    {
      "location": "Madrid Centro",
      "propertyType": "apartment",
      "avgPrice": 4200,
      "minPrice": 3500,
      "maxPrice": 6000,
      "pricePerM2": 18.5,
      "numberOfProperties": 120,
      "lastUpdated": "2023-02-01T00:00:00Z"
    },
    {
      "location": "Madrid Centro",
      "propertyType": "house",
      "avgPrice": 3800,
      "minPrice": 3200,
      "maxPrice": 5500,
      "pricePerM2": 16.2,
      "numberOfProperties": 45,
      "lastUpdated": "2023-02-01T00:00:00Z"
    }
    // más datos...
  ]
}
```

### Obtener Tendencias de Mercado

```
GET /api/market-analysis/trends
```

**Parámetros de Consulta:**
- `location` (obligatorio): Ubicación para analizar tendencias
- `period` (opcional): Período de tiempo (default: "6months")

**Respuesta Exitosa (200 OK):**
```json
{
  "location": "Madrid Centro",
  "trends": [
    {
      "date": "2022-09-01",
      "avgPrice": 4050,
      "percentageChange": 0
    },
    {
      "date": "2022-10-01",
      "avgPrice": 4080,
      "percentageChange": 0.74
    },
    // más meses...
    {
      "date": "2023-02-01",
      "avgPrice": 4200, 
      "percentageChange": 0.95
    }
  ],
  "summary": {
    "totalChange": 3.7,
    "averageMonthlyChange": 0.62
  }
}
```

## Actividades

### Listar Actividades

```
GET /api/activities
```

**Parámetros de Consulta:**
- `limit` (opcional): Número de resultados (por defecto: 20)
- `entityType` (opcional): Filtrar por tipo de entidad
- `entityId` (opcional): Filtrar por ID de entidad

**Respuesta Exitosa (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "type": "property_created",
      "description": "Nueva propiedad creada: Ático con terraza en la Puerta del Sol",
      "createdAt": "2023-01-15T14:30:00Z",
      "entityId": 1,
      "entityType": "property"
    },
    {
      "id": 2,
      "type": "lead_created",
      "description": "Nuevo lead registrado: Juan Pérez",
      "createdAt": "2023-02-01T11:20:00Z",
      "entityId": 1,
      "entityType": "lead"
    }
    // más actividades...
  ]
}
```

## Códigos de Estado HTTP

- `200 OK`: Solicitud exitosa
- `201 Created`: Recurso creado correctamente
- `400 Bad Request`: Solicitud inválida o datos incorrectos
- `401 Unauthorized`: Usuario no autenticado
- `403 Forbidden`: Permiso denegado
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

## Paginación

La mayoría de los endpoints que devuelven listas soportan paginación con los siguientes parámetros:

- `page`: Número de página (comenzando desde 1)
- `limit`: Número de elementos por página

La respuesta incluye:
- `data`: Array de elementos
- `total`: Número total de elementos
- `page`: Página actual
- `limit`: Límite por página
- `pages`: Número total de páginas

## Consideraciones para Desarrollo

1. **Autenticación**: Asegúrese de que todas las peticiones (excepto login/register) incluyan la cookie de sesión.
2. **Validación**: Todos los datos enviados se validan con Zod. Asegúrese de enviar datos que cumplan con los esquemas definidos.
3. **CORS**: En entorno de desarrollo, CORS está configurado para permitir peticiones desde `http://localhost:3000`.
4. **Rate Limiting**: Para prevenir abusos, existe un límite de 100 peticiones por minuto por IP.

---

Esta API está en continuo desarrollo y puede sufrir cambios. Consulte regularmente la documentación más actualizada.