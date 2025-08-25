# Buho - Editor de Tours Virtuales con Rutas de Escalada

## Visión General
Editor minimalista para crear tours virtuales con hotspots interactivos y capacidad de marcar rutas de escalada en fotos de boulders. Integrado para aplicaciones móviles Expo.

## Características Esenciales

### Core Features
- **Tours Virtuales**: Navegación inmersiva entre escenas
- **Hotspots Interactivos**: Puntos de información y navegación
- **Editor de Rutas**: Dibujar líneas sobre imágenes para marcar rutas de escalada
- **Interfaz Minimalista**: UX simple para creadores de contenido
- **Optimizado para Móvil**: Compatible con Expo y React Native

### Funcionalidades Específicas
- Carga y gestión de imágenes panorámicas/360°
- Herramientas de dibujo para trazar rutas de escalada
- Sistema de capas para diferentes dificultades de ruta
- Previsualización en tiempo real
- Exportación para aplicación móvil

## Metodología de Control de Versiones

### Formato de Commits
Cada cambio debe guardarse en un commit con el formato:
```
YYYY-MM-DD Descripción del cambio
```

**Ejemplos:**
- `2025-08-25 Configuración inicial del proyecto React`
- `2025-08-25 Agregado componente TourViewer básico`
- `2025-08-25 Implementado sistema de hotspots`
- `2025-08-25 Agregadas herramientas de dibujo de rutas`

### Flujo de Commits por Prompt
Cada prompt debe generar múltiples commits pequeños y descriptivos:

1. **Commits de setup**: Configuración inicial, instalación de dependencias
2. **Commits de feature**: Cada funcionalidad nueva
3. **Commits de refinamiento**: Mejoras, optimizaciones, fixes
4. **Commits de documentación**: README, comentarios, documentación

## Plan de Desarrollo por Prompts

### Prompt 1: Configuración Base del Proyecto
```
Crear la estructura base del proyecto Buho:
- Configurar proyecto React/Next.js
- Instalar dependencias esenciales (Three.js, React Three Fiber, Canvas API)
- Crear estructura de carpetas modular
- Configurar TypeScript y herramientas de desarrollo
- Setup básico de componentes principales

COMMITS SUGERIDOS:
- "2025-XX-XX Inicializado proyecto React con TypeScript"
- "2025-XX-XX Instaladas dependencias Three.js y React Three Fiber"
- "2025-XX-XX Creada estructura de carpetas modular"
- "2025-XX-XX Configurado TypeScript y ESLint"
- "2025-XX-XX Agregados componentes base TourViewer y App"
```

### Prompt 2: Visor de Tours Virtuales Core
```
Implementar el motor de tours virtuales:
- Componente para cargar y mostrar imágenes panorámicas/360°
- Sistema de navegación entre escenas
- Controles básicos de cámara (pan, zoom, tilt)
- Componente de hotspots clickeables
- Interfaz de navegación minimalista

COMMITS SUGERIDOS:
- "2025-XX-XX Agregado componente PanoramaViewer básico"
- "2025-XX-XX Implementados controles de cámara (pan, zoom, tilt)"
- "2025-XX-XX Creado sistema de navegación entre escenas"
- "2025-XX-XX Agregados hotspots clickeables básicos"
- "2025-XX-XX Implementada interfaz de navegación minimalista"
```

### Prompt 3: Sistema de Hotspots
```
Desarrollar sistema completo de hotspots:
- Editor visual para colocar hotspots en escenas
- Diferentes tipos de hotspots (navegación, información, ruta)
- Panel de propiedades para configurar hotspots
- Persistencia de datos de hotspots
- Preview mode vs edit mode

COMMITS SUGERIDOS:
- "2025-XX-XX Creado editor visual de hotspots"
- "2025-XX-XX Implementados tipos de hotspots (nav, info, ruta)"
- "2025-XX-XX Agregado panel de propiedades de hotspots"
- "2025-XX-XX Implementada persistencia de datos hotspots"
- "2025-XX-XX Agregados modos preview y edición"
```

### Prompt 4: Editor de Rutas de Escalada
```
Crear herramientas de dibujo para rutas:
- Canvas overlay sobre imágenes
- Herramientas de dibujo (líneas, flechas, puntos)
- Selector de colores y grosor de línea
- Sistema de capas por dificultad de ruta
- Herramientas de edición (borrar, mover, escalar)

COMMITS SUGERIDOS:
- "2025-XX-XX Implementado canvas overlay para dibujo"
- "2025-XX-XX Agregadas herramientas básicas de dibujo"
- "2025-XX-XX Creado selector de colores y grosor"
- "2025-XX-XX Implementado sistema de capas por dificultad"
- "2025-XX-XX Agregadas herramientas de edición (borrar, mover)"
```

### Prompt 5: Gestión de Proyectos y Escenas
```
Sistema de gestión de contenido:
- CRUD de proyectos de tours
- Gestión de escenas y su orden
- Carga y optimización de imágenes
- Sistema de presets para diferentes tipos de escalada
- Validación y preview completo del tour

COMMITS SUGERIDOS:
- "2025-XX-XX Implementado CRUD de proyectos de tours"
- "2025-XX-XX Creada gestión de escenas y ordenamiento"
- "2025-XX-XX Agregado sistema de carga y optimización de imágenes"
- "2025-XX-XX Implementados presets para tipos de escalada"
- "2025-XX-XX Agregada validación y preview completo"
```

### Prompt 6: Interfaz de Usuario Minimalista
```
Diseño de UI/UX optimizado:
- Interface limpia y intuitiva
- Panel lateral colapsable para herramientas
- Shortcuts de teclado para acciones frecuentes
- Responsive design para diferentes pantallas
- Onboarding y guías visuales

COMMITS SUGERIDOS:
- "2025-XX-XX Diseñada interfaz principal limpia"
- "2025-XX-XX Implementado panel lateral colapsable"
- "2025-XX-XX Agregados shortcuts de teclado"
- "2025-XX-XX Implementado diseño responsive"
- "2025-XX-XX Creado sistema de onboarding y guías"
```

### Prompt 7: Exportación e Integración Expo
```
Sistema de exportación para móviles:
- Exportar tours como JSON estructurado
- Optimización de assets para móvil
- Viewer component para Expo/React Native
- Documentación de integración
- Testing en dispositivos móviles

COMMITS SUGERIDOS:
- "2025-XX-XX Implementado exportador de tours a JSON"
- "2025-XX-XX Agregada optimización de assets para móvil"
- "2025-XX-XX Creado componente BuhoViewer para Expo"
- "2025-XX-XX Agregada documentación de integración"
- "2025-XX-XX Implementados tests para dispositivos móviles"
```

### Prompt 8: Optimización y Testing
```
Refinamiento y testing:
- Optimización de rendimiento
- Testing automatizado de componentes clave
- Manejo de errores y edge cases
- Documentación de usuario
- Deploy y configuración de producción

COMMITS SUGERIDOS:
- "2025-XX-XX Optimizado rendimiento de componentes principales"
- "2025-XX-XX Implementados tests automatizados"
- "2025-XX-XX Agregado manejo robusto de errores"
- "2025-XX-XX Creada documentación completa de usuario"
- "2025-XX-XX Configurado deploy y producción"
```

## Estructura de Archivos Sugerida

```
buho-editor/
├── src/
│   ├── components/
│   │   ├── TourViewer/
│   │   ├── HotspotEditor/
│   │   ├── RouteDrawer/
│   │   └── ProjectManager/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── stores/
├── public/
├── docs/
└── expo-integration/
    └── BuhoViewer.tsx
```

## Tecnologías Principales
- **Frontend**: React/Next.js + TypeScript
- **3D/Canvas**: Three.js + React Three Fiber
- **Drawing**: HTML5 Canvas + Fabric.js
- **State**: Zustand o Context API
- **Mobile**: Expo SDK compatible components
- **Storage**: LocalStorage/IndexedDB para desarrollo

## Consideraciones de Desarrollo
- Mantener components modulares para fácil integración en Expo
- Optimizar assets e imágenes para móviles
- Implementar lazy loading para tours grandes
- Considerar modo offline básico
- Testing en dispositivos móviles reales

## Estructura de Archivos del Tour Exportado

### Tour Package (.buho)
Cada tour se exporta como un paquete comprimido que contiene:

```
tour-nombre.buho/
├── manifest.json           # Metadatos del tour
├── scenes/                 # Escenas del tour
│   ├── scene-001/
│   │   ├── panorama.jpg    # Imagen panorámica optimizada
│   │   ├── routes.json     # Datos de rutas de escalada
│   │   └── hotspots.json   # Configuración de hotspots
│   ├── scene-002/
│   └── ...
├── assets/                 # Assets adicionales
│   ├── icons/              # Iconos de hotspots
│   ├── audio/              # Audio opcional
│   └── thumbnails/         # Miniaturas para navegación
└── offline-data.json       # Índice para sistema offline
```

### Formato de Datos JSON

#### manifest.json
```json
{
  "id": "tour-uuid",
  "title": "Nombre del Tour",
  "description": "Descripción del tour",
  "version": "1.0.0",
  "created": "2024-01-01T00:00:00Z",
  "scenes": ["scene-001", "scene-002"],
  "totalSize": 15728640,
  "offline": {
    "downloadable": true,
    "priority": "high",
    "cacheDuration": 2592000
  }
}
```

#### routes.json (por escena)
```json
{
  "routes": [
    {
      "id": "route-001",
      "name": "La Traversa",
      "difficulty": "V4",
      "color": "#FF6B6B",
      "strokeWidth": 3,
      "points": [
        {"x": 120, "y": 300},
        {"x": 180, "y": 250},
        {"x": 240, "y": 200}
      ],
      "type": "boulder",
      "description": "Ruta técnica con buenos agarres"
    }
  ]
}
```

#### hotspots.json (por escena)
```json
{
  "hotspots": [
    {
      "id": "hotspot-001",
      "type": "navigation",
      "position": {"x": 0.3, "y": 0.5, "z": 0.8},
      "target": "scene-002",
      "title": "Ir a Boulder Principal",
      "icon": "arrow"
    },
    {
      "id": "hotspot-002", 
      "type": "info",
      "position": {"x": -0.2, "y": 0.1, "z": 0.9},
      "content": "Grado: V3-V7",
      "title": "Información de Rutas",
      "icon": "info"
    }
  ]
}
```

## Sistema Offline para Expo

### Descarga y Almacenamiento
- **Descarga en background**: Tours se descargan automáticamente cuando hay WiFi
- **Almacenamiento local**: Usando `expo-file-system` y `expo-sqlite`
- **Gestión de caché**: Sistema inteligente de limpieza por antigüedad/uso
- **Compresión**: Imágenes optimizadas y datos comprimidos

### Implementación en Expo
```typescript
// Ejemplo de integración
import { TourManager } from './BuhoViewer';

// Descargar tour para offline
await TourManager.downloadTour('tour-uuid');

// Verificar disponibilidad offline
const isAvailable = await TourManager.isOfflineAvailable('tour-uuid');

// Cargar tour (online/offline automático)
const tour = await TourManager.loadTour('tour-uuid');
```

### Base de Datos Offline
```sql
-- SQLite schema para tours offline
CREATE TABLE tours (
  id TEXT PRIMARY KEY,
  title TEXT,
  downloaded_at INTEGER,
  last_accessed INTEGER,
  size_bytes INTEGER,
  file_path TEXT
);

CREATE TABLE scenes (
  id TEXT PRIMARY KEY,
  tour_id TEXT,
  panorama_path TEXT,
  routes_data TEXT,
  hotspots_data TEXT
);
```

## Consideraciones para Sistema Offline

### Optimizaciones
- **Imágenes progresivas**: Diferentes calidades según conexión
- **Lazy loading**: Cargar escenas bajo demanda
- **Preload inteligente**: Precargar escenas adyacentes
- **Gestión de memoria**: Liberar recursos de escenas no visitadas

### Sincronización
- **Estado de descarga**: Progress indicators en tiempo real
- **Actualizaciones**: Detectar y descargar versiones nuevas
- **Gestión de espacio**: Límites configurables de almacenamiento
- **Prioridades**: Tours favoritos se mantienen siempre disponibles

### Experiencia de Usuario
- **Indicadores visuales**: Mostrar qué tours están disponibles offline
- **Modo avión**: Funcionalidad completa sin conexión
- **Gestión manual**: Usuario puede elegir qué descargar/eliminar
- **Estadísticas**: Mostrar espacio usado por tours offline

## Entregables por Fase
1. **MVP**: Visor básico + hotspots simples
2. **V1**: Editor completo de rutas de escalada + exportación básica
3. **V2**: Sistema completo offline + gestión avanzada de tours
4. **V3**: Optimizaciones, sync inteligente y features avanzadas