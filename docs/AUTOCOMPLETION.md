# Configuración de Autocompletado en InmoAdmin

Este documento describe cómo configurar y aprovechar el autocompletado inteligente para componentes, rutas y otras partes del proyecto InmoAdmin.

## Autocompletado en VS Code

### 1. Configuración del Editor

Para obtener la mejor experiencia de autocompletado, recomendamos instalar VS Code con las siguientes extensiones:

- **TypeScript + JavaScript Language Features** (integrado)
- **ESLint**
- **Tailwind CSS IntelliSense**
- **Path Intellisense**
- **Prettier - Code formatter**

### 2. Configuración de Proyecto

#### Para Next.js (Migración propuesta)

El sistema de rutas de Next.js (App Router) proporciona autocompletado automático para rutas y componentes, siempre que esté correctamente configurado.

1. **Asegúrate de tener un `tsconfig.json` adecuado**:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

2. **Incluir el plugin Next.js para TypeScript**:

```bash
npm install --save-dev @types/react @types/node
```

#### Para Proyecto Actual (Vite + Express)

1. **Actualizar `tsconfig.json` para habilitar autocompletado de rutas**:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"],
      "@server/*": ["./server/*"]
    }
  }
}
```

2. **Crear archivo de declaración para Vite**:

```typescript
// vite-env.d.ts
/// <reference types="vite/client" />
```

## Autocompletado para Componentes Personalizados

### 1. Definir Cuidadosamente las Props

```typescript
// Mala práctica
interface Props {
  items: any[];
  onSelect: any;
}

// Buena práctica
interface Property {
  id: number;
  title: string;
  price: number;
}

interface PropertyListProps {
  items: Property[];
  onSelect: (property: Property) => void;
  isLoading?: boolean;
}
```

### 2. Usar Enums o Unions para Valores Fijos

```typescript
// Usando type union
type PropertyStatus = 'available' | 'reserved' | 'sold' | 'hidden';

// O usando enum
enum PropertyStatusEnum {
  Available = 'available',
  Reserved = 'reserved',
  Sold = 'sold',
  Hidden = 'hidden'
}

interface PropertyCardProps {
  status: PropertyStatus;
  // Resto de props...
}
```

### 3. Documentación JSDoc para Mejor Autocompletado

```typescript
/**
 * Componente que muestra una propiedad inmobiliaria en formato tarjeta
 * @param props - Propiedades del componente
 * @param props.property - Datos de la propiedad a mostrar
 * @param props.onEdit - Callback que se dispara al hacer clic en editar
 * @param props.showPrice - Indica si se debe mostrar el precio
 * @returns Componente React
 */
export function PropertyCard({
  property,
  onEdit,
  showPrice = true
}: PropertyCardProps) {
  // Implementación...
}
```

## Autocompletado para Rutas

### En Next.js (Migración propuesta)

Next.js genera automáticamente tipos para rutas basadas en la estructura de archivos.

```typescript
// Ejemplo de uso con autocompletado
import { useRouter } from 'next/navigation';

export function NavigationButton() {
  const router = useRouter();
  
  return (
    <button onClick={() => router.push('/properties')}>
      Ver Propiedades
    </button>
  );
}
```

### En Proyecto Actual (Vite + React Router)

Para mejorar el autocompletado de rutas en React Router:

1. **Definir las rutas como constantes**:

```typescript
// src/lib/routes.ts
export const ROUTES = {
  HOME: '/',
  PROPERTIES: '/properties',
  PROPERTY_DETAIL: (id: number) => `/properties/${id}`,
  PROPERTY_EDIT: (id: number) => `/properties/${id}/edit`,
  PROPERTY_CREATE: '/properties/create',
  LEADS: '/leads',
  APPOINTMENTS: '/appointments',
  WORKFLOWS: '/workflows',
  AUTH: '/auth'
} as const;
```

2. **Usar estas constantes en vez de strings literales**:

```typescript
import { ROUTES } from '@/lib/routes';
import { Link } from 'wouter';

export function NavigationMenu() {
  return (
    <nav>
      <Link href={ROUTES.HOME}>Inicio</Link>
      <Link href={ROUTES.PROPERTIES}>Propiedades</Link>
      <Link href={ROUTES.PROPERTY_DETAIL(123)}>Ver Propiedad</Link>
    </nav>
  );
}
```

## Autocompletado para Consultas a la API

### 1. Definir Tipos para Respuestas API

```typescript
// src/lib/api-types.ts
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
```

### 2. Usar Tipos Específicos para Cada Endpoint

```typescript
// src/hooks/use-properties.ts
import { Property } from '@shared/schema';
import { PaginatedResponse } from '@/lib/api-types';

export function useProperties() {
  const fetchProperties = async (): Promise<PaginatedResponse<Property>> => {
    const res = await fetch('/api/properties');
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  };
  
  // Resto del hook...
}
```

## Autocompletado para Entidades de la Base de Datos

Drizzle ORM genera automáticamente tipos a partir del esquema, lo que proporciona autocompletado para:

- Nombres de columnas
- Tipos de datos
- Relaciones
- Operaciones de consulta

```typescript
// Ejemplo de autocompletado con Drizzle
import { db } from '@/db';
import { properties, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function getPropertyWithOwner(propertyId: number) {
  // Autocompletado para nombres de tablas, columnas y operadores
  const result = await db
    .select({
      id: properties.id,
      title: properties.title,
      price: properties.price,
      ownerName: users.fullName
    })
    .from(properties)
    .innerJoin(users, eq(properties.userId, users.id))
    .where(eq(properties.id, propertyId));
  
  return result[0];
}
```

## Configuración para Facilitar la Navegación

### Definir Alias Consistentes

En `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@lib/*": ["./src/lib/*"],
      "@styles/*": ["./src/styles/*"],
      "@api/*": ["./src/app/api/*"]
    }
  }
}
```

### Mejorar la Estructura de Componentes

Organizar componentes para facilitar la importación automática:

```
src/
├── components/
│   ├── ui/              # Componentes base
│   ├── property/        # Componentes específicos de propiedades
│   ├── lead/            # Componentes específicos de leads
│   ├── layout/          # Layouts y contenedores
│   └── index.ts         # Re-exportaciones para facilitar importaciones
```

Archivo `index.ts` para exportaciones:

```typescript
// src/components/index.ts

// Re-exportar componentes principales para facilitar importaciones
export * from './ui/button';
export * from './ui/card';
export * from './ui/input';
export * from './property/property-card';
export * from './property/property-list';
// ...
```

Esto permite:

```typescript
// En lugar de:
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PropertyCard } from '@/components/property/property-card';

// Puedes usar:
import { Button, Card, PropertyCard } from '@/components';
```

## Beneficios del Autocompletado

1. **Desarrollo más rápido**: Menos tiempo escribiendo nombres de propiedades y métodos.
2. **Menos errores**: El autocompletado identifica errores de tipado mientras escribes.
3. **Mejor documentación**: Las sugerencias muestran información sobre tipos y parámetros.
4. **Refactorización más segura**: Las herramientas de refactorización pueden rastrear todas las referencias.

## Herramientas Adicionales para Mejorar el Autocompletado

1. **TypeScript Language Server**
   - Ya viene integrado con VS Code
   - Proporciona análisis de tipos y sugerencias inteligentes

2. **ESLint con TypeScript Plugin**
   - Instalar con `npm install eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser`
   - Configurar para identificar errores y sugerir correcciones

3. **TypeScript Playground**
   - Herramienta web para experimentar con tipos TypeScript
   - Útil para probar tipos complejos antes de implementarlos

---

Al aplicar estas configuraciones y prácticas, el desarrollo se vuelve más eficiente con un excelente soporte de autocompletado para todo el proyecto InmoAdmin.