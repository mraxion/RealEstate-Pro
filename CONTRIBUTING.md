# Guía para Contribuir a InmoAdmin

¡Gracias por tu interés en contribuir a InmoAdmin! Este documento proporciona las pautas para contribuir al proyecto de manera efectiva.

## Código de Conducta

Este proyecto y todos sus participantes se rigen por nuestro [Código de Conducta](CODE_OF_CONDUCT.md). Al participar, se espera que respetes este código.

## Proceso de Contribución

### 1. Configura tu Entorno de Desarrollo

Para configurar tu entorno de desarrollo, sigue estos pasos:

1. **Fork y Clone**:
   - Haz un fork del repositorio en GitHub
   - Clona tu fork localmente:
     ```bash
     git clone https://github.com/TU-USUARIO/inmoadmin.git
     cd inmoadmin
     ```

2. **Instalar Dependencias**:
   ```bash
   npm install
   ```

3. **Configurar Base de Datos**:
   - Crea un archivo `.env` basado en `.env.example`
   - Configura tu base de datos PostgreSQL local o utiliza una instancia en la nube

4. **Inicializar Base de Datos**:
   ```bash
   npm run db:push
   ```

5. **Iniciar el Servidor de Desarrollo**:
   ```bash
   npm run dev
   ```

### 2. Trabajar en un Issue

Si quieres contribuir con una nueva característica o corrección:

1. **Revisar Issues Existentes**:
   - Revisa los issues existentes para evitar duplicados
   - Si no existe un issue para tu contribución, crea uno nuevo

2. **Crear Rama de Características**:
   - Crea una rama desde `main` para tu trabajo:
     ```bash
     git checkout -b feature/nombre-descriptivo
     ```
   - Para correcciones de errores, usa el prefijo `fix/`:
     ```bash
     git checkout -b fix/descripcion-del-error
     ```

3. **Realizar Cambios**:
   - Mantén tus cambios enfocados y coherentes
   - Sigue las [convenciones de codificación](#convenciones-de-codificación)
   - Asegúrate de que tus cambios pasen todas las pruebas

4. **Pruebas**:
   - Añade pruebas para las nuevas características o correcciones
   - Asegúrate de que todas las pruebas existentes pasen:
     ```bash
     npm test
     ```

5. **Actualizar Documentación**:
   - Actualiza la documentación relevante
   - Añade comentarios claros al código cuando sea necesario

### 3. Envío de Pull Requests

1. **Preparar tu Envío**:
   - Haz commit de tus cambios con mensajes descriptivos:
     ```bash
     git commit -m "Añade funcionalidad X que resuelve el issue #123"
     ```
   - Asegúrate de que tu rama está actualizada con `main`:
     ```bash
     git fetch origin
     git rebase origin/main
     ```

2. **Crear Pull Request**:
   - Sube tu rama a tu fork:
     ```bash
     git push origin feature/nombre-descriptivo
     ```
   - Ve a GitHub y crea un nuevo PR hacia el repositorio original
   - Proporciona un título claro y una descripción detallada

3. **Revisión de Código**:
   - Los mantenedores revisarán tu PR
   - Responde a preguntas o realiza cambios solicitados
   - Si se requieren cambios, realízalos en la misma rama

### 4. Después del Merge

Una vez que tu PR sea fusionado:

1. Actualiza tu fork con los cambios del repositorio principal:
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

2. Elimina tu rama de característica:
   ```bash
   git branch -d feature/nombre-descriptivo
   git push origin --delete feature/nombre-descriptivo
   ```

## Convenciones de Codificación

### Estilo de Código

- Seguimos una variante de [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) con algunas modificaciones
- Usamos TypeScript estricto con el modo `strict` activado
- Usamos ESLint y Prettier para el formato de código

### Estructura de Archivos

- Nombres de archivos en `kebab-case.ts` para archivos de utilidad
- Nombres de archivos en `PascalCase.tsx` para componentes React
- Organiza los componentes por característica, no por tipo

### Convenciones de Nombrado

- **Interfaces/Types**: Nombres descriptivos en PascalCase
  ```typescript
  interface PropertyDetails { ... }
  ```

- **Funciones**: Nombres descriptivos en camelCase, verbos para acciones
  ```typescript
  function fetchPropertyData() { ... }
  ```

- **Componentes React**: PascalCase
  ```typescript
  export function PropertyCard() { ... }
  ```

- **Variables**: Nombres descriptivos en camelCase
  ```typescript
  const propertyCount = properties.length;
  ```

### Convenciones de Comentarios

- Usa JSDoc para funciones y tipos públicos:
  ```typescript
  /**
   * Formatea un valor numérico como moneda.
   * @param value - El valor a formatear
   * @param locale - El locale a usar para el formato (por defecto: 'es-ES')
   * @returns La cadena formateada
   */
  export function formatCurrency(value: number, locale = 'es-ES'): string {
    // Implementación
  }
  ```

### Convenciones de Commit

Seguimos la convención de [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva característica
- `fix:` Corrección de error
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan al código)
- `refactor:` Refactorización de código
- `test:` Añadir o corregir pruebas
- `chore:` Tareas de mantenimiento

## Solicitudes de Características

Para solicitar una nueva característica:

1. Verifica si la característica ya ha sido solicitada o está en desarrollo
2. Crea un nuevo issue con el template de "Feature Request"
3. Describe claramente la característica y su valor
4. Proporciona ejemplos o mockups si es posible

## Informes de Errores

Para informar de un error:

1. Verifica si el error ya ha sido reportado
2. Crea un nuevo issue con el template de "Bug Report"
3. Incluye pasos de reproducción detallados
4. Indica el comportamiento esperado y el actual
5. Proporciona información sobre tu entorno

## Licencia

Al contribuir a este proyecto, aceptas que tus contribuciones serán licenciadas bajo la misma licencia que el proyecto (MIT).