# Arquitectura del Sistema InmoAdmin

Este documento describe la arquitectura general del sistema InmoAdmin, sus componentes principales y cómo interactúan entre sí.

## Visión General

InmoAdmin está construido siguiendo una arquitectura modular cliente-servidor con una clara separación de responsabilidades:

## Componentes Principales

### 1. Frontend (Cliente)

El frontend está implementado como una Single Page Application (SPA) utilizando React y sigue un enfoque de diseño basado en componentes.

#### Tecnologías Clave:
- **React**: Biblioteca para construcción de interfaces de usuario
- **TailwindCSS**: Framework de CSS utilitario para estilos
- **ShadCN UI**: Componentes UI reutilizables basados en Radix UI
- **React Query**: Gestión de estado y caché para datos del servidor
- **Wouter**: Enrutamiento ligero para navegación
- **TypeScript**: Tipado estático para mayor robustez del código

#### Estructura de Carpetas:
```
client/
├── src/
│   ├── components/     # Componentes reutilizables organizados por funcionalidad
│   ├── hooks/          # Custom hooks React
│   ├── lib/            # Utilidades y configuraciones 
│   ├── pages/          # Componentes de página principal
│   ├── App.tsx         # Componente raíz y configuración de rutas
│   └── main.tsx        # Punto de entrada
```

#### Arquitectura de Componentes:

- **Componentes de Página**: Representan rutas completas (pages/*)
- **Componentes de Diseño**: Definen estructura y maquetación (layouts/*)
- **Componentes de UI**: Componentes reutilizables de interfaz (ui/*)
- **Componentes de Características**: Específicos para una funcionalidad (property/*, leads/*, etc.)

### 2. Backend (Servidor)

El backend está construido con Node.js y Express, proporcionando una API RESTful para el cliente.

#### Tecnologías Clave:
- **Node.js**: Entorno de ejecución JavaScript del lado del servidor
- **Express**: Framework web para Node.js
- **PostgreSQL**: Base de datos relacional
- **Drizzle ORM**: ORM (Object-Relational Mapping) para interactuar con la base de datos
- **Passport.js**: Middleware de autenticación

#### Estructura de Carpetas:
```
server/
├── index.ts           # Punto de entrada del servidor
├── routes.ts          # Definición de rutas API
├── storage.ts         # Capa de acceso a datos
├── auth.ts            # Lógica de autenticación
├── db.ts              # Configuración de conexión a base de datos
└── vite.ts            # Configuración de desarrollo con Vite
```

#### Patrones de Diseño:
- **Repository Pattern**: Encapsula la lógica para acceder a la base de datos
- **Dependency Injection**: Las dependencias se inyectan a través de la capa de servicios
- **Middleware Pattern**: Funcionalidades compartidas como manejo de errores, autenticación, etc.

### 3. Base de Datos

PostgreSQL es la base de datos principal, gestionada a través de Drizzle ORM.

#### Estructura:
- **Tablas Principales**: users, properties, leads, appointments, workflows, activities
- **Relaciones**: Definidas a través de claves foráneas en Drizzle ORM

#### Esquema:
El esquema completo se define en `shared/schema.ts` usando Drizzle ORM, que proporciona:
- Definición de tablas y columnas
- Relaciones entre entidades
- Tipos TypeScript derivados para uso en el cliente y servidor

## Flujo de Datos

1. **Solicitud del Cliente**: El cliente React solicita datos a través de React Query
2. **API Backend**: Las rutas Express manejan la solicitud y la dirigen al controlador adecuado
3. **Capa de Servicios**: Implementa la lógica de negocio
4. **Capa de Repositorio**: Accede a la base de datos a través de Drizzle ORM
5. **Base de Datos**: Almacena y recupera los datos solicitados
6. **Respuesta**: Los datos se devuelven al cliente para su visualización

## Autenticación y Seguridad

- Autenticación basada en sesiones mediante Passport.js
- Sesiones almacenadas en PostgreSQL mediante connect-pg-simple
- Contraseñas hasheadas usando scrypt con sal
- Rutas protegidas en el frontend mediante HOC (Higher-Order Components)

## Integración con Servicios Externos

La aplicación se integra con los siguientes servicios externos:

1. **Automa.site**: Para automatización de flujos de trabajo
   - Conexión mediante API REST
   - Webhooks para eventos en tiempo real

2. **Portales Inmobiliarios** (Fotocasa e Idealista):
   - Sincronización de propiedades mediante APIs propietarias
   - Exportación e importación de listados

3. **Servicios de Análisis de Mercado**:
   - Datos de precios por zona de Idealista.com/data
   - Actualización periódica mediante programación de tareas

## Escalabilidad y Rendimiento

- **Optimización de Consultas**: Índices en la base de datos para consultas frecuentes
- **Caché del Cliente**: React Query para cachear y revalidar datos
- **Carga Diferida**: Carga de componentes bajo demanda con React.lazy()
- **Paginación**: Para manejar grandes volúmenes de datos
- **PostgreSQL Serverless**: Escalado automático de la base de datos

## Despliegue

El sistema está configurado para despliegue en:

- **Frontend**: Vercel (producción), Replit (desarrollo)
- **Backend**: Vercel Serverless Functions, Replit
- **Base de datos**: Neon.tech (PostgreSQL Serverless)

## Diagrama de Componentes

```
┌─────────────────────────────────────┐
│             Cliente React            │
├─────────────────────────────────────┤
│ ┌─────────┐ ┌────────┐ ┌──────────┐ │
│ │  Pages  │ │  Hooks │ │Components│ │
│ └─────────┘ └────────┘ └──────────┘ │
└───────────────────┬─────────────────┘
                    │ HTTP/JSON
                    ▼
┌─────────────────────────────────────┐
│           Express Server             │
├─────────────────────────────────────┤
│ ┌─────────┐ ┌────────┐ ┌──────────┐ │
│ │  Routes │ │  Auth  │ │ Storage  │ │
│ └─────────┘ └────────┘ └──────────┘ │
└───────────────────┬─────────────────┘
                    │ SQL
                    ▼
┌─────────────────────────────────────┐
│            PostgreSQL                │
└─────────────────────────────────────┘
```

## Decisiones de Arquitectura y Tradeoffs

### ¿Por qué React y Express?
- Ecosistema maduro con amplia adopción
- Buena interoperabilidad con TypeScript
- Excelente soporte de la comunidad

### ¿Por qué PostgreSQL?
- Soporte transaccional completo
- Potentes características para datos relacionales
- Opciones de despliegue serverless

### ¿Por qué Drizzle ORM?
- Rendimiento optimizado
- Excelente integración con TypeScript
- Esquemas compartibles entre cliente y servidor

### ¿Por qué ShadCN UI?
- Componentes accesibles y personalizables
- Buena integración con TailwindCSS
- Enfoque de utilidad sobre abstracción

## Áreas de Mejora Futura

1. **Servicios en tiempo real**:
   - Implementar WebSockets para notificaciones
   - Añadir Socket.io para actualizaciones en tiempo real

2. **Microservicios**:
   - Dividir el backend en servicios más pequeños a medida que crece
   - Implementar comunicación basada en mensajes entre servicios

3. **Testing automatizado**:
   - Aumentar la cobertura de pruebas unitarias
   - Implementar pruebas e2e con Cypress

4. **Internacionalización (i18n)**:
   - Soporte para múltiples idiomas
   - Formateo localizado de fechas, monedas, etc.

---

Este documento es un trabajo en progreso y se actualizará a medida que evolucione la arquitectura del sistema.