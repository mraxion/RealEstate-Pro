# InmoAdmin - Proyecto Local

## Configuración y Puesta en Marcha (2025)

### Requisitos
- Node.js >= 16
- npm >= 9
- PostgreSQL (opcional, recomendado para producción)
- O bien, SQLite para pruebas rápidas

### Variables de Entorno (.env)
Ejemplo de archivo `.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/inmoadmin
PORT=5050
HOST=127.0.0.1
NODE_ENV=development
SESSION_SECRET=super_secreto_local
# Opcionales para integraciones externas:
# AUTOMA_SITE_API_KEY=tu_api_key_aqui
# IDEALISTA_API_KEY=tu_api_key_aqui
# FOTOCASA_API_KEY=tu_api_key_aqui
```

### Pasos para levantar el proyecto
1. Instala dependencias:
   ```bash
   npm install
   ```
2. (Opcional) Configura tu base de datos PostgreSQL y actualiza `DATABASE_URL` en `.env`.
3. Levanta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Accede a la app en [http://127.0.0.1:5050](http://127.0.0.1:5050)

### APIs principales
- `/api/properties` CRUD de propiedades
- `/api/leads` CRUD de clientes potenciales
- `/api/appointments` CRUD de citas
- `/api/auth` Autenticación
- `/api/market-analysis` Datos de mercado

### Claves y Seguridad
- Guarda las claves API externas en `.env` (no subas este archivo a repositorios públicos)
- Cambia `SESSION_SECRET` antes de ir a producción

### Notas para futuras versiones
- Si cambias el puerto, actualiza también el archivo `.env`.
- Si cambias de base de datos, revisa la configuración de Drizzle ORM y los scripts de migración.
- Para producción, configura correctamente CORS y HTTPS.

---

## Mantenimiento
- Si agregas nuevas APIs, documenta los endpoints aquí.
- Si cambias dependencias, ejecuta `npm install` nuevamente.

---

# ¡Proyecto listo para desarrollo y futuras versiones!
