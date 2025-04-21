# Generación de Pruebas Automáticas con IA

Este documento describe cómo utilizar modelos de IA como ChatGPT, Grok, Gemini o similares para generar pruebas automáticas para el proyecto InmoAdmin.

## Introducción

La generación de pruebas con IA puede acelerar significativamente el desarrollo y mejorar la calidad del código al:

1. Crear pruebas unitarias y de integración de forma rápida
2. Identificar casos de borde que los desarrolladores podrían pasar por alto
3. Mantener una alta cobertura de código con menos esfuerzo manual
4. Actualizar pruebas cuando cambia el código base

## Configuración del Entorno de Pruebas

Antes de generar pruebas con IA, debemos configurar nuestro entorno de pruebas:

### Jest para Pruebas Unitarias

1. **Instalar Jest y dependencias**:

```bash
npm install --save-dev jest @types/jest ts-jest jest-environment-jsdom
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

2. **Configuración básica de Jest** (`jest.config.js`):

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
};
```

3. **Configuración de setup** (`jest.setup.js`):

```javascript
import '@testing-library/jest-dom';
```

### Cypress para Pruebas E2E

1. **Instalar Cypress**:

```bash
npm install --save-dev cypress
```

2. **Inicializar Cypress**:

```bash
npx cypress open
```

## Generación de Pruebas con IA

### 1. Pruebas Unitarias de Componentes React

#### Ejemplo de Prompt para ChatGPT/Grok/Gemini

```
Por favor, genera pruebas unitarias con Jest y React Testing Library para el siguiente componente React:

```tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function PropertyCard({ property, onEdit, onDelete }: PropertyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleEdit = () => {
    if (onEdit) onEdit(property.id);
  };
  
  const handleDelete = () => {
    if (onDelete) onDelete(property.id);
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{property.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="relative h-40 mb-3 rounded-md overflow-hidden">
          {property.images && (property.images as string[])[0] ? (
            <img 
              src={(property.images as string[])[0]} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              Sin imagen
            </div>
          )}
        </div>
        
        <div className="mb-2">
          <p className="text-sm text-gray-500">{property.location}</p>
          <p className="text-lg font-semibold text-primary-700">
            {formatCurrency(property.price)}
          </p>
        </div>
        
        {isExpanded && (
          <div className="mt-3 text-sm">
            <p>{property.description}</p>
          </div>
        )}
        
        <div className="mt-3 flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Ver menos" : "Ver más"}
          </Button>
          
          <div className="flex items-center space-x-2">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={handleEdit}>
                Editar
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="destructive" onClick={handleDelete}>
                Eliminar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

Requisitos:
1. Probar que el componente se renderiza correctamente con los datos de propiedad
2. Probar que los botones de editar y eliminar llaman a sus respectivos callbacks
3. Probar que el botón de "Ver más"/"Ver menos" muestra/oculta la descripción
4. Probar el manejo de propiedades sin imágenes
5. Generar mocks adecuados para las dependencias
```

#### Resultado Esperado de la IA

La IA debería generar algo similar a esto:

```typescript
// __tests__/components/PropertyCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyCard } from '@/components/property/property-card';
import { formatCurrency } from '@/lib/utils';

// Mock para la utilidad formatCurrency
jest.mock('@/lib/utils', () => ({
  formatCurrency: jest.fn((value) => `€${value.toLocaleString()}`),
}));

describe('PropertyCard', () => {
  const mockProperty = {
    id: 1,
    title: 'Apartamento en el centro',
    location: 'Madrid Centro',
    price: 250000,
    description: 'Un bonito apartamento en el centro de Madrid',
    type: 'apartment',
    address: 'Calle Mayor 10',
    bedrooms: 2,
    bathrooms: 1,
    area: 80,
    features: ['Terraza', 'Ascensor'],
    images: ['https://example.com/image.jpg'],
    status: 'available',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPropertyWithoutImages = {
    ...mockProperty,
    images: []
  };

  it('renders the property information correctly', () => {
    render(<PropertyCard property={mockProperty} />);
    
    expect(screen.getByText(mockProperty.title)).toBeInTheDocument();
    expect(screen.getByText(mockProperty.location)).toBeInTheDocument();
    expect(formatCurrency).toHaveBeenCalledWith(mockProperty.price);
    
    // La descripción no debería estar visible inicialmente
    expect(screen.queryByText(mockProperty.description)).not.toBeInTheDocument();
  });

  it('displays image when available', () => {
    render(<PropertyCard property={mockProperty} />);
    
    const image = screen.getByAltText(mockProperty.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', (mockProperty.images as string[])[0]);
  });

  it('displays placeholder when no image is available', () => {
    render(<PropertyCard property={mockPropertyWithoutImages} />);
    
    expect(screen.getByText('Sin imagen')).toBeInTheDocument();
    expect(screen.queryByAltText(mockProperty.title)).not.toBeInTheDocument();
  });

  it('toggles description visibility when clicking "Ver más"/"Ver menos"', () => {
    render(<PropertyCard property={mockProperty} />);
    
    // Inicialmente no visible
    expect(screen.queryByText(mockProperty.description)).not.toBeInTheDocument();
    
    // Hacemos clic en "Ver más"
    fireEvent.click(screen.getByText('Ver más'));
    
    // Ahora debería ser visible
    expect(screen.getByText(mockProperty.description)).toBeInTheDocument();
    
    // Hacemos clic en "Ver menos"
    fireEvent.click(screen.getByText('Ver menos'));
    
    // Ya no debería ser visible
    expect(screen.queryByText(mockProperty.description)).not.toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const handleEdit = jest.fn();
    render(<PropertyCard property={mockProperty} onEdit={handleEdit} />);
    
    fireEvent.click(screen.getByText('Editar'));
    expect(handleEdit).toHaveBeenCalledWith(mockProperty.id);
  });

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = jest.fn();
    render(<PropertyCard property={mockProperty} onDelete={handleDelete} />);
    
    fireEvent.click(screen.getByText('Eliminar'));
    expect(handleDelete).toHaveBeenCalledWith(mockProperty.id);
  });

  it('does not render edit button when onEdit is not provided', () => {
    render(<PropertyCard property={mockProperty} />);
    
    expect(screen.queryByText('Editar')).not.toBeInTheDocument();
  });

  it('does not render delete button when onDelete is not provided', () => {
    render(<PropertyCard property={mockProperty} />);
    
    expect(screen.queryByText('Eliminar')).not.toBeInTheDocument();
  });
});
```

### 2. Pruebas Unitarias de Hooks Personalizados

#### Ejemplo de Prompt para la IA

```
Por favor, genera pruebas unitarias con Jest para el siguiente hook personalizado de React:

```tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { Property } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';

export function useProperties() {
  // Obtener todas las propiedades
  const usePropertiesList = () => 
    useQuery<Property[]>({ 
      queryKey: ['/api/properties'] 
    });
  
  // Obtener una propiedad por ID
  const useProperty = (id: number) =>
    useQuery<Property>({ 
      queryKey: ['/api/properties', id],
      enabled: !!id
    });
  
  // Crear una propiedad
  const createProperty = () =>
    useMutation({
      mutationFn: async (formData: FormData) => {
        const res = await apiRequest('POST', '/api/properties', formData);
        return await res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      }
    });
  
  // Actualizar una propiedad
  const updateProperty = () =>
    useMutation({
      mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
        const res = await apiRequest('PUT', `/api/properties/${id}`, formData);
        return await res.json();
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
        queryClient.invalidateQueries({ queryKey: ['/api/properties', variables.id] });
      }
    });
  
  // Eliminar una propiedad
  const deleteProperty = () =>
    useMutation({
      mutationFn: async (id: number) => {
        await apiRequest('DELETE', `/api/properties/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      }
    });
  
  return {
    usePropertiesList,
    useProperty,
    createProperty,
    updateProperty,
    deleteProperty
  };
}
```

Requisitos:
1. Mockear las dependencias de React Query
2. Probar cada función del hook (usePropertiesList, useProperty, etc.)
3. Verificar las llamadas a la API y los callbacks onSuccess
4. Probar los invalidateQueries para actualizar la caché
```

### 3. Pruebas de API y Backend

#### Ejemplo de Prompt para la IA

```
Por favor, genera pruebas para el siguiente endpoint API utilizando Supertest y Jest:

```typescript
// server/routes.ts (fragmento)

app.get("/api/properties", async (req: Request, res: Response) => {
  try {
    const properties = await storage.getProperties();
    res.json(properties);
  } catch (error) {
    console.error("Error getting properties:", error);
    res.status(500).json({ error: "Error getting properties" });
  }
});

app.post("/api/properties", upload.array("images", 10), async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const files = req.files as Express.Multer.File[];
    
    // Validar datos
    const result = insertPropertySchema.safeParse(body);
    if (!result.success) {
      return res.status(400).json({ 
        error: "Invalid property data",
        details: result.error.errors 
      });
    }
    
    // Procesar imágenes
    const imagePaths = files.map(file => `/uploads/${file.filename}`);
    
    // Crear propiedad con imágenes
    const property = await storage.createProperty({
      ...result.data,
      images: imagePaths,
      status: body.status || "available"
    });
    
    res.status(201).json(property);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Error creating property" });
  }
});
```

Requisitos:
1. Mockear el servicio de almacenamiento (storage)
2. Probar respuestas exitosas y casos de error
3. Verificar el manejo de validaciones con esquemas de Zod
4. Probar la carga de imágenes con Multer
```

### 4. Pruebas End-to-End con Cypress

#### Ejemplo de Prompt para la IA

```
Por favor, genera pruebas E2E con Cypress para el flujo de administración de propiedades de InmoAdmin:

1. Iniciar sesión en la aplicación
2. Navegar a la sección de propiedades
3. Crear una nueva propiedad
4. Verificar que la propiedad aparezca en la lista
5. Editar la propiedad creada
6. Eliminar la propiedad

Uso de datos y flujos de la aplicación:
- La ruta de inicio de sesión es /auth
- Las credenciales de prueba: usuario "admin@example.com", contraseña "password123"
- La ruta de propiedades es /properties
- El formulario de propiedad tiene campos: título, precio, ubicación, tipo, descripción, características y un botón para subir imágenes
- Se debe verificar elementos de UI y mensajes de confirmación
```

## Integración de Pruebas Generadas por IA en el Proceso de Desarrollo

### 1. Flujo de Trabajo Recomendado

1. **Desarrollar un Componente o Funcionalidad**:
   - Implementar la funcionalidad con un enfoque inicial en características clave
   - Documentar claramente los requisitos y comportamientos esperados

2. **Generar Pruebas con IA**:
   - Proporcionar el código a la IA junto con los requisitos de prueba
   - Ajustar el prompt según sea necesario para obtener pruebas más específicas
   - Revisar las pruebas generadas para asegurar su correctitud

3. **Refinamiento de Pruebas**:
   - Ajustar las pruebas generadas por la IA para adaptarlas a las convenciones del proyecto
   - Complementar con casos de prueba adicionales no identificados por la IA
   - Asegurar la cobertura adecuada del código

4. **Ejecución y Mantenimiento**:
   - Integrar las pruebas en el proceso de CI/CD
   - Actualizar las pruebas cuando cambie la funcionalidad

### 2. Buenas Prácticas para Obtener Mejores Resultados

1. **Proporcionar Contexto Completo**:
   - Incluir importaciones y tipos relacionados
   - Describir el propósito y uso esperado del componente/código
   - Mencionar dependencias y comportamientos específicos

2. **Especificar Casos de Prueba Concretos**:
   - Enumerar los casos de prueba importantes a cubrir
   - Incluir casos de borde y situaciones de error
   - Describir las interacciones de usuario esperadas

3. **Revisar Críticamente el Resultado**:
   - Verificar que las pruebas cubran la funcionalidad adecuadamente
   - Comprobar que los mocks y stubs estén configurados correctamente
   - Asegurar que no haya suposiciones incorrectas sobre el comportamiento del código

## Herramientas para Automatizar la Generación de Pruebas con IA

Además de los prompts manuales, existen herramientas que pueden automatizar el proceso:

### 1. Integraciones de IA para VSCode

- **GitHub Copilot**: Ofrece sugerencias de código de prueba mientras escribes
- **Mintlify Writer**: Ayuda a generar documentación y pruebas con comandos específicos

### 2. Herramientas Específicas para Pruebas

- **Autogeneración de pruebas con GPT4**: Herramientas como [GPT4-Tests](https://github.com/sobolevn/gpt4-tests) que automatizan la generación
- **Typechat**: Framework para integrar LLMs en aplicaciones TypeScript que puede utilizarse para generar pruebas

### 3. Scripts Personalizados

Es posible crear scripts que automaticen:
1. La extracción de componentes y funciones del proyecto
2. La generación de prompts para ChatGPT/Grok/Gemini
3. El procesamiento de las respuestas y la creación de archivos de prueba

## Aplicación a InmoAdmin

Para el proyecto InmoAdmin, recomendamos el siguiente plan para generar pruebas con IA:

### Fase 1: Cobertura Básica

1. **Componentes UI Críticos**:
   - PropertyCard, PropertyList, PropertyForm
   - DashboardLayout, Sidebar, Navigation
   - Modales y diálogos de confirmación

2. **Hooks Principales**:
   - useProperties, useLeads, useAppointments
   - useAuth, useToast, useWorkflows

3. **Endpoints API Esenciales**:
   - CRUD de propiedades
   - Autenticación
   - Análisis de mercado

### Fase 2: Cobertura Completa

1. **Pruebas de Integración**:
   - Flujos completos como creación de propiedad → asignación a lead → programación de cita
   - Validación de formularios y manejo de errores

2. **Pruebas E2E con Cypress**:
   - Flujos de usuario completos
   - Interacciones de UI complejas

3. **Pruebas de Rendimiento**:
   - Carga y renderizado de listas grandes
   - Tiempos de respuesta de la API

### Fase 3: Mantenimiento Continuo

1. **CI/CD Integration**:
   - Ejecución automática de pruebas en GitHub Actions
   - Informes de cobertura con CodeCov o similar

2. **Actualización de Pruebas**:
   - Re-generación de pruebas cuando cambien componentes
   - Ajuste de mocks y datos de prueba cuando evolucione el esquema

## Ejemplo de Configuración de GitHub Action para IA Testing

```yaml
name: AI Test Generation

on:
  push:
    paths:
      - 'src/**/*.tsx'
      - 'src/**/*.ts'
      - '!src/**/*.test.ts'
      - '!src/**/*.test.tsx'

jobs:
  generate-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Generate tests with OpenAI
        uses: openai/gpt-action@v1
        with:
          api-key: ${{ secrets.OPENAI_API_KEY }}
          files: "src/**/*.tsx,src/**/*.ts,!src/**/*.test.ts,!src/**/*.test.tsx"
          model: "gpt-4"
          template-file: ".github/test-template.md"
          output-dir: "__tests__/"
          
      - name: Run generated tests
        run: npm test
        
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v4
        with:
          title: "test: Add AI-generated tests"
          body: "This PR adds automatically generated tests using GPT-4."
          branch: "feature/ai-tests"
```

## Conclusión

La generación de pruebas con IA puede acelerar significativamente el desarrollo y mejorar la calidad del código en InmoAdmin. Al proporcionar prompts bien estructurados a modelos como ChatGPT, Grok o Gemini, es posible obtener pruebas completas y funcionales que pueden integrarse directamente en el flujo de trabajo de desarrollo.

Con este enfoque, podemos mantener una alta cobertura de pruebas con menos esfuerzo manual, permitiendo a los desarrolladores centrarse en la implementación de nuevas características y la mejora de la experiencia del usuario.