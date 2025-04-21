# Migración a Next.js

Este documento proporciona una guía paso a paso para migrar la aplicación InmoAdmin actual (Vite + Express) a Next.js.

## Beneficios de la Migración

1. **Unificación del Frontend y Backend**: Next.js permite alojar tanto el frontend como las API en un solo proyecto.
2. **Renderizado Híbrido**: Opciones de SSR, SSG y CSR para diferentes partes de la aplicación.
3. **Optimización de Imágenes**: Componente `next/image` para optimización automática.
4. **API Routes**: Creación simplificada de endpoints sin necesidad de un servidor Express separado.
5. **Mejoras de SEO**: Gracias al renderizado del lado del servidor.
6. **Mejoras de Rendimiento**: Mediante la carga parcial de código y optimizaciones automáticas.

## Pasos para la Migración

### 1. Crear un Nuevo Proyecto Next.js

```bash
npx create-next-app@latest inmoadmin-next
cd inmoadmin-next
```

Configuración recomendada durante la creación:
- TypeScript: Sí
- ESLint: Sí
- Tailwind CSS: Sí
- `src/` directory: Sí
- App Router: Sí (para aprovechar las últimas características)
- Importar alias: Sí (configurar `@/*` para simplificar importaciones)

### 2. Instalar Dependencias Necesarias

```bash
# Drizzle ORM y PostgreSQL
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit

# Componentes UI y Utilidades
npm install @radix-ui/react-* lucide-react class-variance-authority clsx tailwind-merge
npm install @tanstack/react-query zod @hookform/resolvers react-hook-form

# Autenticación
npm install next-auth
```

### 3. Configurar la Base de Datos

1. **Crear archivo `drizzle.config.ts`**:

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
  },
} satisfies Config;
```

2. **Migrar esquema de base de datos**:

Copiar el esquema existente desde `shared/schema.ts` a `src/db/schema.ts` con las adaptaciones necesarias.

3. **Crear cliente de base de datos**:

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from './schema';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
```

### 4. Migrar Componentes UI

1. Recrear los componentes Shadcn/UI necesarios:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input select toast
# Añadir otros componentes según sea necesario
```

2. Copiar y adaptar los componentes personalizados:
   - Mover componentes desde `client/src/components` a `src/components`
   - Actualizar importaciones para usar la estructura de Next.js
   - Adaptar los componentes que usan React Router para usar Next.js Router

### 5. Convertir Rutas de Cliente

1. **Migrar páginas**:
   
   De `client/src/pages/properties.tsx` a `src/app/properties/page.tsx`:

   ```typescript
   import { PropertyList } from "@/components/property/property-list";
   
   export const metadata = {
     title: 'Propiedades - InmoAdmin',
   };
   
   export default function PropertiesPage() {
     return <PropertyList />;
   }
   ```

2. **Crear layouts**:

   ```typescript
   // src/app/layout.tsx
   import { Inter } from "next/font/google";
   import { Providers } from "@/components/providers";
   import "@/styles/globals.css";
   
   const inter = Inter({ subsets: ["latin"] });
   
   export const metadata = {
     title: "InmoAdmin",
     description: "Sistema de Gestión Inmobiliaria",
   };
   
   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <html lang="es">
         <body className={inter.className}>
           <Providers>{children}</Providers>
         </body>
       </html>
     );
   }
   ```

   ```typescript
   // src/app/(dashboard)/layout.tsx
   import { DashboardLayout } from "@/components/layouts/dashboard-layout";
   
   export default function DashboardRootLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return <DashboardLayout>{children}</DashboardLayout>;
   }
   ```

### 6. Convertir API Routes

De `server/routes.ts` a rutas API de Next.js:

```typescript
// src/app/api/properties/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { properties } from "@/db/schema";

export async function GET() {
  try {
    const data = await db.select().from(properties);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener propiedades" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validación y procesamiento...
    const [newProperty] = await db.insert(properties).values(body).returning();
    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear propiedad" },
      { status: 500 }
    );
  }
}
```

### 7. Configurar Autenticación

1. **Instalar NextAuth.js**:

```bash
npm install next-auth
```

2. **Configurar proveedor de autenticación de credenciales**:

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { comparePasswords } from "@/lib/auth";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, credentials.username));

        if (!user || !(await comparePasswords(credentials.password, user.password))) {
          return null;
        }

        return {
          id: String(user.id),
          username: user.username,
          name: user.fullName,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
```

### 8. Migrar Hooks Personalizados

1. Adaptar React Query para Next.js:

```typescript
// src/lib/tanstack-query.ts
import { 
  QueryClient, 
  QueryClientProvider 
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

2. Actualizar hooks para usar fetch de Next.js:

```typescript
// src/hooks/use-properties.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Property } from '@/db/schema';

export function useProperties() {
  const queryClient = useQueryClient();

  const usePropertiesList = () => 
    useQuery<Property[]>({
      queryKey: ['properties'],
      queryFn: async () => {
        const res = await fetch('/api/properties');
        if (!res.ok) throw new Error('Error fetching properties');
        return res.json();
      }
    });
  
  // Otras funciones...
  
  return {
    usePropertiesList,
    // ...
  };
}
```

### 9. Actualizar Estilos y Assets

1. Migrar configuración de Tailwind CSS
2. Mover assets a `public/` o `src/assets/`
3. Actualizar referencias a imágenes con `next/image`

### 10. Configurar Pruebas

1. Configurar Jest/Testing Library para Next.js
2. Migrar pruebas existentes
3. Configurar Cypress para pruebas e2e

### 11. Consideraciones finales

- Actualizar el README.md con las nuevas instrucciones
- Configurar variables de entorno para Next.js
- Configurar middleware para rutas protegidas
- Configurar la compresión de imágenes y optimizaciones
- Configurar despliegue en Vercel

## Estructura Final del Proyecto

```
inmoadmin-next/
├── drizzle/              # Migraciones generadas por Drizzle
├── public/               # Archivos estáticos
├── src/
│   ├── app/              # Rutas de Next.js App Router
│   │   ├── api/          # API Routes
│   │   ├── (dashboard)/  # Rutas protegidas con layout dashboard
│   │   ├── auth/         # Rutas de autenticación
│   │   └── layout.tsx    # Layout principal
│   ├── components/       # Componentes React
│   ├── db/               # Configuración de base de datos
│   │   ├── schema.ts     # Esquema de Drizzle
│   │   └── index.ts      # Cliente de base de datos
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilidades y funciones compartidas
│   └── styles/           # Estilos globales
├── cypress/              # Tests e2e con Cypress
├── tests/                # Tests unitarios con Jest
├── .env.example          # Ejemplo de variables de entorno
├── drizzle.config.ts     # Configuración de Drizzle
├── next.config.js        # Configuración de Next.js
└── tsconfig.json         # Configuración de TypeScript
```

## Comparación de Estructura de Archivos

### Estructura Actual
```
inmoadmin/
├── client/              # Frontend React con Vite
├── server/              # Backend Express
├── shared/              # Código compartido
└── scripts/             # Scripts de utilidad
```

### Estructura Propuesta con Next.js
```
inmoadmin-next/
├── src/
│   ├── app/             # Rutas y API Routes
│   ├── components/      # Componentes React
│   ├── db/              # Base de datos
│   ├── hooks/           # Custom hooks
│   └── lib/             # Utilidades
└── public/              # Archivos estáticos
```

## Beneficios de la Migración a Next.js

1. **Estructura Unificada**: Todo el código en un solo proyecto
2. **Simplificación del Despliegue**: Un solo servicio en lugar de frontend y backend separados
3. **Mejora del SEO**: Gracias al servidor rendering
4. **Optimización Automática**: De código, imágenes y recursos
5. **Soporte para Autenticación**: Integración sencilla con NextAuth.js
6. **Escalabilidad**: Mejora en la organización del código creciente