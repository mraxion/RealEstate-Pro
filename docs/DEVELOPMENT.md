# Guía de Desarrollo de InmoAdmin

Esta guía proporciona instrucciones detalladas para desarrolladores que deseen contribuir o extender la aplicación InmoAdmin.

## Entorno de Desarrollo

### Configuración Inicial

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/inmoadmin.git
   cd inmoadmin
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env` en la raíz del proyecto:
   ```
   # Base de datos
   DATABASE_URL=postgresql://user:password@host:port/database
   
   # Configuración del servidor
   PORT=5000
   NODE_ENV=development
   
   # Sesiones
   SESSION_SECRET=tu_secreto_seguro
   
   # APIs externas (opcional)
   AUTOMA_SITE_API_KEY=tu_clave_api
   IDEALISTA_API_KEY=tu_clave_api
   FOTOCASA_API_KEY=tu_clave_api
   ```

4. **Inicializar la base de datos**:
   ```bash
   npm run db:push
   ```

### Estructura del Proyecto

```
inmoadmin/
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # Utilidades
│   │   ├── pages/       # Páginas
│   │   ├── App.tsx      # Componente principal
│   │   └── main.tsx     # Punto de entrada
├── server/              # Backend Express
│   ├── db.ts            # Configuración de la base de datos
│   ├── index.ts         # Punto de entrada del servidor
│   ├── storage.ts       # Acceso a datos
│   ├── routes.ts        # Rutas de la API
│   └── auth.ts          # Autenticación
├── shared/              # Código compartido
│   └── schema.ts        # Esquemas Drizzle
└── scripts/             # Scripts de utilidad
```

### Comandos Disponibles

- `npm run dev`: Inicia el servidor de desarrollo (cliente + servidor)
- `npm run build`: Compila la aplicación para producción
- `npm run start`: Inicia la aplicación compilada
- `npm run db:push`: Actualiza la base de datos según el esquema
- `npm run db:studio`: Inicia una interfaz de gestión de base de datos

## Guías de Desarrollo

### 1. Añadir un Nuevo Modelo de Datos

Para añadir un nuevo modelo (entidad) a la aplicación:

1. **Definir el esquema en `shared/schema.ts`**:
   ```typescript
   // Ejemplo para una tabla 'documents'
   export const documents = pgTable("documents", {
     id: serial("id").primaryKey(),
     title: text("title").notNull(),
     content: text("content"),
     propertyId: integer("property_id").references(() => properties.id),
     createdAt: timestamp("created_at").defaultNow().notNull(),
     updatedAt: timestamp("updated_at").defaultNow().notNull(),
   });
   
   // Esquema de inserción
   export const insertDocumentSchema = createInsertSchema(documents).pick({
     title: true,
     content: true,
     propertyId: true,
   });
   
   // Tipos
   export type InsertDocument = z.infer<typeof insertDocumentSchema>;
   export type Document = typeof documents.$inferSelect;
   ```

2. **Actualizar la interfaz `IStorage` en `server/storage.ts`**:
   ```typescript
   export interface IStorage {
     // ... métodos existentes
     
     // Métodos para documentos
     getDocuments(): Promise<Document[]>;
     getDocument(id: number): Promise<Document | undefined>;
     createDocument(document: InsertDocument): Promise<Document>;
     updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
     deleteDocument(id: number): Promise<boolean>;
   }
   ```

3. **Implementar los métodos en la clase `DatabaseStorage`**:
   ```typescript
   async getDocuments(): Promise<Document[]> {
     return await db.select().from(documents).orderBy(desc(documents.createdAt));
   }
   
   async getDocument(id: number): Promise<Document | undefined> {
     const [document] = await db.select().from(documents).where(eq(documents.id, id));
     return document;
   }
   
   async createDocument(insertDocument: InsertDocument): Promise<Document> {
     const [document] = await db.insert(documents).values(insertDocument).returning();
     return document;
   }
   
   async updateDocument(id: number, updateData: Partial<InsertDocument>): Promise<Document | undefined> {
     const [document] = await db
       .update(documents)
       .set({ ...updateData, updatedAt: new Date() })
       .where(eq(documents.id, id))
       .returning();
     return document;
   }
   
   async deleteDocument(id: number): Promise<boolean> {
     const result = await db.delete(documents).where(eq(documents.id, id));
     return result.rowCount > 0;
   }
   ```

4. **Crear las rutas de API en `server/routes.ts`**:
   ```typescript
   app.get("/api/documents", async (req, res) => {
     try {
       const documents = await storage.getDocuments();
       res.json(documents);
     } catch (error) {
       res.status(500).json({ error: "Error al obtener documentos" });
     }
   });
   
   app.get("/api/documents/:id", async (req, res) => {
     try {
       const id = parseInt(req.params.id);
       const document = await storage.getDocument(id);
       if (!document) {
         return res.status(404).json({ error: "Documento no encontrado" });
       }
       res.json(document);
     } catch (error) {
       res.status(500).json({ error: "Error al obtener documento" });
     }
   });
   
   // Implementar POST, PUT, DELETE endpoints...
   ```

5. **Actualizar la base de datos**:
   ```bash
   npm run db:push
   ```

6. **Crear componentes React para la nueva entidad**:
   - Lista de documentos
   - Formulario de documento
   - Página de detalles
   - Custom hooks para acceso a datos

### 2. Añadir una Nueva Página

Para añadir una nueva página a la aplicación:

1. **Crear el componente de página en `client/src/pages/`**:
   ```tsx
   // client/src/pages/documents.tsx
   import { DashboardLayout } from "@/components/layouts/dashboard-layout";
   import { DocumentList } from "@/components/document/document-list";
   
   export default function Documents() {
     return (
       <DashboardLayout title="Documentos">
         <DocumentList />
       </DashboardLayout>
     );
   }
   ```

2. **Añadir la ruta en `client/src/App.tsx`**:
   ```tsx
   // En la función Router
   <Switch>
     <ProtectedRoute path="/" component={HomePage} />
     <ProtectedRoute path="/properties" component={Properties} />
     <ProtectedRoute path="/documents" component={Documents} /> {/* Nueva ruta */}
     <Route path="/auth" component={AuthPage} />
     <Route component={NotFound} />
   </Switch>
   ```

3. **Actualizar la navegación en `client/src/components/layouts/dashboard-layout.tsx`**:
   ```tsx
   // Añadir un nuevo elemento al menú
   <NavItem 
     icon={<FileText />} 
     label="Documentos" 
     href="/documents"
     isActive={pathname === "/documents"}
   />
   ```

### 3. Implementar un Custom Hook para Datos

Para crear un nuevo hook para acceder a los datos:

```tsx
// client/src/hooks/use-documents.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { Document } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function useDocuments() {
  // Obtener todos los documentos
  const useDocumentsList = () => 
    useQuery<Document[]>({ 
      queryKey: ["/api/documents"] 
    });
  
  // Obtener un documento por ID
  const useDocument = (id: number) =>
    useQuery<Document>({ 
      queryKey: ["/api/documents", id],
      enabled: !!id
    });
  
  // Crear un documento
  const createDocument = (formData: FormData) =>
    useMutation({
      mutationFn: async (formData) => {
        const res = await apiRequest("POST", "/api/documents", formData);
        return await res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      }
    });
  
  // Actualizar un documento
  const updateDocument = () =>
    useMutation({
      mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
        const res = await apiRequest("PUT", `/api/documents/${id}`, formData);
        return await res.json();
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
        queryClient.invalidateQueries({ queryKey: ["/api/documents", variables.id] });
      }
    });
  
  // Eliminar un documento
  const deleteDocument = () =>
    useMutation({
      mutationFn: async (id: number) => {
        await apiRequest("DELETE", `/api/documents/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      }
    });
  
  return {
    useDocumentsList,
    useDocument,
    createDocument,
    updateDocument,
    deleteDocument
  };
}
```

### 4. Agregar una Integración con Servicio Externo

Para integrar un servicio externo (por ejemplo, Automa.site):

1. **Instalar dependencias necesarias**:
   ```bash
   npm install axios
   ```

2. **Crear un cliente para la API externa**:
   ```typescript
   // server/integrations/automa-site.ts
   import axios from "axios";
   
   const AUTOMA_SITE_API_KEY = process.env.AUTOMA_SITE_API_KEY;
   const AUTOMA_SITE_BASE_URL = "https://api.automa.site/v1";
   
   const client = axios.create({
     baseURL: AUTOMA_SITE_BASE_URL,
     headers: {
       Authorization: `Bearer ${AUTOMA_SITE_API_KEY}`,
       "Content-Type": "application/json"
     }
   });
   
   export async function createWorkflow(name: string, steps: any[]) {
     try {
       const response = await client.post("/workflows", {
         name,
         steps
       });
       return response.data;
     } catch (error) {
       console.error("Error creating workflow:", error);
       throw error;
     }
   }
   
   export async function executeWorkflow(workflowId: string, data: any) {
     try {
       const response = await client.post(`/workflows/${workflowId}/execute`, {
         data
       });
       return response.data;
     } catch (error) {
       console.error("Error executing workflow:", error);
       throw error;
     }
   }
   ```

3. **Crear un endpoint para la integración**:
   ```typescript
   // server/routes.ts (añadir a las rutas existentes)
   import { createWorkflow, executeWorkflow } from "./integrations/automa-site";
   
   app.post("/api/workflows/automa/create", async (req, res) => {
     try {
       const { name, steps } = req.body;
       const workflow = await createWorkflow(name, steps);
       res.status(201).json(workflow);
     } catch (error) {
       res.status(500).json({ error: "Error creating workflow" });
     }
   });
   
   app.post("/api/workflows/automa/execute/:id", async (req, res) => {
     try {
       const { id } = req.params;
       const { data } = req.body;
       const result = await executeWorkflow(id, data);
       res.json(result);
     } catch (error) {
       res.status(500).json({ error: "Error executing workflow" });
     }
   });
   ```

### 5. Implementar una Función de Utilidad Frontend

Ejemplo para crear una función de utilidad para formatear datos:

```typescript
// client/src/lib/utils.ts (añadir a las utilidades existentes)

// Función para generar un color basado en un valor numérico (por ejemplo, para gráficos)
export function generateColorGradient(value: number, min: number, max: number): string {
  // Normalizar el valor entre 0 y 1
  const normalized = (value - min) / (max - min);
  
  // Generar componentes RGB basados en un degradado de azul a rojo
  const r = Math.round(normalized * 255);
  const g = Math.round(100 - normalized * 100);
  const b = Math.round(255 - normalized * 255);
  
  return `rgb(${r}, ${g}, ${b})`;
}

// Función para agrupar propiedades por zona
export function groupPropertiesByLocation(properties: Property[]): Record<string, Property[]> {
  return properties.reduce((acc, property) => {
    const location = property.location;
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(property);
    return acc;
  }, {} as Record<string, Property[]>);
}
```

### 6. Añadir un Nuevo Componente UI

Ejemplo para crear un componente de tarjeta de estadísticas:

```tsx
// client/src/components/ui/stat-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  changeValue?: number;
  changeText?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  changeValue,
  changeText,
  className
}: StatCardProps) {
  // Determinar si el cambio es positivo, negativo o neutro
  const isPositive = changeValue !== undefined && changeValue > 0;
  const isNegative = changeValue !== undefined && changeValue < 0;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
            {icon}
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-2xl font-semibold">{value}</p>
          
          {changeValue !== undefined && (
            <div className="flex items-center">
              <div
                className={cn(
                  "text-xs font-medium rounded-full px-2 py-0.5 flex items-center",
                  isPositive && "bg-green-50 text-green-600",
                  isNegative && "bg-red-50 text-red-600",
                  !isPositive && !isNegative && "bg-gray-50 text-gray-600"
                )}
              >
                {isPositive && <span>↑</span>}
                {isNegative && <span>↓</span>}
                <span className="ml-1">
                  {Math.abs(changeValue)}%
                </span>
              </div>
              
              {changeText && (
                <span className="text-gray-500 text-xs ml-2">{changeText}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

## Mejores Prácticas

### Estructura de Componentes React

Sigue estas prácticas al crear componentes:

1. **Componentes Pequeños y Reutilizables**:
   - Cada componente debe hacer una sola cosa bien
   - Extraer lógica común en componentes separados

2. **Estructura por Característica**:
   - Organizar componentes por funcionalidad, no por tipo
   - Agrupar componentes relacionados en carpetas

3. **Patrón de Componentes**:
   ```tsx
   // 1. Importaciones
   import { useState } from 'react';
   import { useQuery } from '@tanstack/react-query';
   
   // 2. Tipos
   interface MyComponentProps {
     title: string;
     onAction: () => void;
   }
   
   // 3. Componente
   export function MyComponent({ title, onAction }: MyComponentProps) {
     // 3.1 Hooks y estado
     const [isActive, setIsActive] = useState(false);
     const { data, isLoading } = useQuery({ queryKey: ['data'] });
     
     // 3.2 Funciones y handlers
     const handleClick = () => {
       setIsActive(!isActive);
       onAction();
     };
     
     // 3.3 Renderizado condicional
     if (isLoading) {
       return <div>Cargando...</div>;
     }
     
     // 3.4 Renderizado principal
     return (
       <div>
         <h2>{title}</h2>
         <button onClick={handleClick}>
           {isActive ? 'Activo' : 'Inactivo'}
         </button>
       </div>
     );
   }
   ```

### Tipado con TypeScript

1. **Evitar `any`**:
   - Usar tipos específicos siempre que sea posible
   - Usar `unknown` en lugar de `any` cuando el tipo es incierto

2. **Utilizar tipos de Drizzle**:
   - Aprovechar los tipos generados por Drizzle para el esquema
   - Usar `typeof table.$inferSelect` para tipos de selección

3. **Extensión de Interfaces**:
   - Extender interfaces en lugar de duplicar código
   ```typescript
   interface BaseEntity {
     id: number;
     createdAt: Date;
     updatedAt: Date;
   }
   
   interface PropertyEntity extends BaseEntity {
     title: string;
     price: number;
     // ...
   }
   ```

### Patrones de Estado

1. **React Query para Estado del Servidor**:
   - Usar React Query para toda la comunicación con la API
   - Aprovechar el caché y la revalidación automática

2. **Estado Local para UI**:
   - Usar `useState` para estado de componentes específicos
   - Mantener el estado lo más cerca posible de donde se usa

3. **Formularios con React Hook Form**:
   - Utilizar React Hook Form para todos los formularios
   - Validar con Zod y esquemas compartidos

## Testing

### Tests Unitarios

Utiliza Jest para tests unitarios de funciones y componentes:

```typescript
// __tests__/utils.test.ts
import { formatCurrency } from '@/lib/utils';

describe('formatCurrency', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1000)).toBe('1.000 €');
    expect(formatCurrency(1500.5)).toBe('1.500,50 €');
  });
});
```

### Tests de Componentes

Utiliza React Testing Library para tests de componentes:

```tsx
// __tests__/components/StatCard.test.tsx
import { render, screen } from '@testing-library/react';
import { StatCard } from '@/components/ui/stat-card';
import { Building } from 'lucide-react';

describe('StatCard', () => {
  it('renders correctly', () => {
    render(
      <StatCard
        title="Propiedades"
        value={120}
        icon={<Building size={18} />}
        changeValue={5.2}
        changeText="vs último mes"
      />
    );
    
    expect(screen.getByText('Propiedades')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('5.2%')).toBeInTheDocument();
    expect(screen.getByText('vs último mes')).toBeInTheDocument();
  });
});
```

### Tests de API

Utiliza Supertest para tests de API:

```typescript
// __tests__/api/properties.test.ts
import request from 'supertest';
import { app } from '../../server';

describe('Properties API', () => {
  it('GET /api/properties returns properties', async () => {
    const response = await request(app).get('/api/properties');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

## Depuración

### Frontend

1. **React DevTools**:
   - Instalar la extensión para Chrome/Firefox
   - Analizar la jerarquía de componentes y props

2. **TanStack Query DevTools**:
   - Activados en desarrollo automáticamente
   - Monitorear estado de caché y peticiones

### Backend

1. **Logs**:
   - Usar `console.log` estratégicamente (para desarrollo)
   - Implementar un sistema de logging estructurado (para producción)

2. **Inspección de Base de Datos**:
   - Usar `npm run db:studio` para explorar la base de datos
   - Verificar modelos y relaciones

## Despliegue

### Frontend + Backend (Vercel)

1. **Configuración de Vercel**:
   - Configurar las variables de entorno
   - Especificar comandos de build: `npm run build`
   - Especificar directorio de salida: `dist`

2. **API Serverless**:
   - Configurar API routes en Vercel
   - Ajustar `vercel.json` si es necesario

### Base de Datos (Neon)

1. **Configuración de PostgreSQL Serverless**:
   - Crear proyecto en Neon.tech
   - Obtener string de conexión
   - Configurar variable de entorno DATABASE_URL

2. **Migración Inicial**:
   - Ejecutar `npx drizzle-kit push:pg`
   - Verificar tablas creadas

## Recursos Adicionales

- [Documentación de React](https://reactjs.org/docs/getting-started.html)
- [Documentación de Express](https://expressjs.com/)
- [Documentación de Drizzle ORM](https://orm.drizzle.team/)
- [Documentación de TanStack Query](https://tanstack.com/query/latest)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Shadcn/UI](https://ui.shadcn.com/)

---

Esta guía está en continuo desarrollo. Si encuentras problemas o tienes sugerencias, por favor abre un issue en el repositorio.