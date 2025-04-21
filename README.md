# InmoAdmin - Sistema de Gestión Inmobiliaria

![InmoAdmin Logo](generated-icon.png)

## Descripción

InmoAdmin es una aplicación web completa para la gestión de propiedades inmobiliarias. Diseñada para administradores de propiedades, agentes inmobiliarios y gestores de carteras de bienes raíces, esta plataforma ofrece un conjunto completo de herramientas para administrar propiedades, clientes potenciales, citas y automatización de procesos.

## Características Principales

- **Gestión de Propiedades**: Registro detallado, edición y seguimiento de propiedades inmobiliarias con múltiples imágenes, características y detalles técnicos.
- **Análisis de Mercado**: Visualización de precios de referencia por zona basados en datos reales de Idealista.com/data.
- **CRM Integrado**: Gestión de leads y seguimiento de clientes potenciales.
- **Gestión de Citas**: Programación y seguimiento de visitas a propiedades.
- **Automatización de Procesos**: Integración con Automa.site para automatizar tareas repetitivas.
- **Sincronización con Portales**: Capacidad para sincronizar con Fotocasa.es e Idealista.com.
- **Base de Datos PostgreSQL**: Almacenamiento seguro y escalable.
- **Diseño Responsivo**: Optimizado para experiencia móvil y escritorio.

## Tecnologías Utilizadas

- **Frontend**: 
  - React.js
  - TailwindCSS 
  - Shadcn UI (componentes)
  - React Query para gestión de estado
  - Wouter para enrutamiento

- **Backend**:
  - Node.js con Express
  - PostgreSQL (Neon Serverless)
  - Drizzle ORM para interacción con la base de datos
  - Autenticación con Passport.js

- **Herramientas de Desarrollo**:
  - TypeScript
  - Vite
  - ESLint
  - Prettier

## Arquitectura del Sistema

El proyecto sigue una arquitectura modular cliente-servidor:

- **Módulo de Propiedades**: Gestión completa del ciclo de vida de propiedades.
- **Módulo de Clientes (Leads)**: CRM para seguimiento de potenciales compradores/inquilinos.
- **Módulo de Citas**: Programación y gestión de visitas.
- **Módulo de Flujos de Trabajo**: Automatización de procesos inmobiliarios.
- **Módulo de Análisis de Mercado**: Datos comparativos por zona para mejor toma de decisiones.

## Instalación y Configuración

### Requisitos previos

- Node.js (v16 o superior)
- PostgreSQL (o una cuenta en Neon.tech para PostgreSQL serverless)
- Git

### Pasos para instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/inmoadmin.git
   cd inmoadmin
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   - Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`
   - Configura la URL de tu base de datos PostgreSQL
   - Añade las claves API necesarias para integraciones (opcional)

4. Configurar la base de datos:
   ```bash
   npm run db:push
   ```

5. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Estructura del Proyecto

```
inmoadmin/
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes React reutilizables
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # Utilidades y funciones compartidas
│   │   ├── pages/       # Páginas de la aplicación
│   │   └── App.tsx      # Componente principal
├── server/              # Backend Express
│   ├── routes.ts        # Definición de rutas API
│   ├── storage.ts       # Capa de acceso a datos
│   ├── auth.ts          # Autenticación y seguridad
│   └── index.ts         # Punto de entrada del servidor
├── shared/              # Código compartido entre cliente y servidor
│   └── schema.ts        # Esquemas de la base de datos (Drizzle ORM)
├── scripts/             # Scripts de utilidad
└── README.md            # Este archivo
```

## API REST

El sistema proporciona una API RESTful con los siguientes endpoints principales:

- `/api/properties` - CRUD de propiedades
- `/api/leads` - CRUD de clientes potenciales
- `/api/appointments` - CRUD de citas y visitas
- `/api/workflows` - CRUD de flujos de trabajo automatizados
- `/api/auth` - Endpoints de autenticación
- `/api/market-analysis` - Datos de análisis de mercado

## Funcionalidades Implementadas

- ✅ Base de datos PostgreSQL con Drizzle ORM para persistencia de datos
- ✅ CRUD completo de propiedades con soporte para múltiples imágenes
- ✅ CRUD de leads y citas
- ✅ Análisis de mercado con datos reales por zona
- ✅ Interfaz responsiva optimizada para móviles
- ✅ Despliegue en la nube con Vercel

## Próximas Mejoras (Roadmap)

- 🚀 Implementar sincronización bidireccional con portales inmobiliarios
- 🚀 Integración completa con Automa.site para automatización
- 🚀 Añadir módulo de informes y dashboards con KPIs avanzados
- 🚀 Implementar aplicación móvil nativa con React Native
- 🚀 Añadir módulo de comunicación con clientes (emails, SMS)
- 🚀 Implementar sistema de notificaciones en tiempo real

## Contribución

Si deseas contribuir al proyecto:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Documentación Técnica

Para documentación técnica más detallada, consulta los siguientes documentos:

- [Documentación de la API](docs/API.md)
- [Arquitectura del Sistema](docs/ARCHITECTURE.md)
- [Guía de Desarrollo](docs/DEVELOPMENT.md)

## Licencia

Este proyecto está licenciado bajo la licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Si tienes preguntas o necesitas ayuda, no dudes en contactarnos en:

- Email: tu-email@example.com
- Website: [www.inmoadmin.com](https://www.inmoadmin.com)