# 🏔️ Buho Editor

**Editor minimalista de tours virtuales con rutas de escalada**

Buho Editor es una aplicación web profesional para crear tours virtuales interactivos con rutas de escalada, diseñada específicamente para aplicaciones móviles Expo. Con una interfaz minimalista y herramientas poderosas, permite a los usuarios crear experiencias inmersivas para sitios de escalada.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Características Principales

### 🎨 **Interfaz Minimalista**
- Diseño limpio que elimina distracciones
- Paneles laterales colapsables y auto-ocultables
- Modo compacto para maximizar área de trabajo
- Responsive design para móvil, tablet y desktop

### 🗺️ **Tours Virtuales Interactivos**
- Navegación panorámica inmersiva
- Sistema de hotspots para navegación e información
- Soporte para múltiples escenas por tour
- Vista previa en tiempo real

### 🧗 **Editor de Rutas de Escalada**
- Herramientas de dibujo para marcar rutas
- Capas organizadas por dificultad
- Puntos, líneas y flechas personalizables
- Sistema de deshacer/rehacer

### ⌨️ **Atajos de Teclado Avanzados**
- Más de 30 atajos para máxima productividad
- Ayuda contextual con buscador integrado
- Navegación rápida entre modos y herramientas

### 🎯 **Sistema de Onboarding**
- Tours guiados interactivos paso a paso
- Centro de ayuda completo con documentación
- Progreso de aprendizaje persistente
- Soporte integrado

## 🚀 Inicio Rápido

### Prerrequisitos

```bash
Node.js >= 18.0.0
npm >= 9.0.0
Git
```

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/falgom4/Buho.git
cd buho-editor

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:5173`

### Comandos Disponibles

```bash
npm run dev        # Inicia servidor de desarrollo con hot-reload
npm run build      # Compila para producción
npm run preview    # Vista previa del build de producción
npm run lint       # Ejecuta ESLint para revisión de código
```

## 📘 Guía de Uso

### 🎬 **Primera Vez**
1. **Bienvenida**: Al abrir por primera vez, verás una pantalla de bienvenida
2. **Tour Guiado**: Se iniciará automáticamente un tour interactivo
3. **Crear Proyecto**: Haz clic en "Comenzar" o usa `Ctrl+P`

### 🎯 **Creando tu Primer Tour**

#### Paso 1: Crear Proyecto
```
1. Presiona Ctrl+P o haz clic en "Proyectos" 
2. Clic en "➕ Nuevo Proyecto"
3. Completa la información básica
4. Selecciona categoría (Boulder, Sport, Trad, Mixed)
```

#### Paso 2: Añadir Escenas
```
1. En el panel lateral, ve a "Scenes"
2. Clic en "Add Scene"  
3. Sube tu imagen panorámica (360°)
4. Configura nombre y descripción
```

#### Paso 3: Agregar Hotspots
```
1. Cambia a modo "Edit" (Spacebar)
2. Selecciona herramienta de hotspot (H, I, R)
3. Haz clic en la panorámica donde quieras el hotspot
4. Configura la información en el panel
```

#### Paso 4: Dibujar Rutas
```
1. Activa modo dibujo (D)
2. Selecciona herramienta (L=línea, A=flecha, O=punto)
3. Dibuja directamente sobre la panorámica
4. Organiza por capas de dificultad
```

### ⌨️ **Atajos de Teclado Esenciales**

| Atajo | Función |
|-------|---------|
| `F1` | Abrir centro de ayuda |
| `Ctrl+P` | Abrir gestor de proyectos |
| `Space` | Cambiar entre Edit/Preview |
| `Ctrl+\` | Toggle panel derecho |
| `Ctrl+Shift+\` | Toggle panel izquierdo |
| `H` | Herramienta hotspot navegación |
| `I` | Herramienta hotspot información |
| `R` | Herramienta hotspot ruta |
| `D` | Toggle modo dibujo |
| `L` | Herramienta línea |
| `A` | Herramienta flecha |
| `O` | Herramienta punto |
| `Ctrl+Z` | Deshacer (en modo dibujo) |
| `Ctrl+Y` | Rehacer (en modo dibujo) |
| `←/→` | Navegar escenas (en preview) |
| `Esc` | Cancelar acción actual |

### 🎨 **Modos de Trabajo**

#### 🖼️ **Modo Preview**
- Navega por el tour como usuario final
- Usa flechas del teclado o clicks en hotspots
- Perfecto para probar la experiencia
- Panel de información de escena visible

#### ✏️ **Modo Edit**
- Añade y configura hotspots
- Activa herramientas de dibujo
- Edita propiedades de elementos
- Paneles de herramientas disponibles

### 📱 **Diseño Responsive**

Buho Editor se adapta perfectamente a cualquier dispositivo:

- **💻 Desktop**: Experiencia completa con todos los paneles
- **📱 Móvil**: Interfaz compacta con navegación optimizada  
- **🖥️ Tablet**: Balance entre funcionalidad y espacio

## 🏗️ Arquitectura del Proyecto

### 📁 **Estructura de Carpetas**
```
src/
├── components/
│   ├── Layout/              # AppHeader, SidePanel, ResponsiveWrapper
│   ├── TourViewer/          # Visor principal con Three.js
│   ├── HotspotEditor/       # Editor de puntos de interés  
│   ├── RouteDrawer/         # Herramientas para dibujar rutas
│   ├── ProjectManager/      # Gestión de proyectos de tours
│   ├── WelcomeScreen/       # Pantalla de bienvenida
│   ├── Help/                # Centro de ayuda y atajos
│   └── Onboarding/          # Tours guiados interactivos
├── hooks/                   # React hooks personalizados
│   ├── useResponsive.ts     # Detección de dispositivos y breakpoints
│   ├── useKeyboardShortcuts.ts # Sistema de atajos de teclado
│   ├── useSidePanels.ts     # Gestión de paneles laterales
│   └── useGuidedTour.ts     # Tours guiados y onboarding
├── stores/                  # Estado global con Zustand
│   ├── projectStore.ts      # Proyectos y configuración
│   ├── tourStore.ts         # Tours y escenas
│   ├── editorStore.ts       # Estado del editor
│   └── routeEditorStore.ts  # Estado del dibujado de rutas
└── types/                   # Definiciones TypeScript
    └── index.ts             # Tour, Scene, Hotspot, Route
```

### 🛠️ **Stack Tecnológico**

- **Frontend**: React 18 + TypeScript + Vite
- **3D/Panorámicas**: Three.js + React Three Fiber
- **Dibujo**: HTML5 Canvas + Fabric.js  
- **Estado Global**: Zustand con persistencia
- **Estilos**: Tailwind CSS
- **Linting**: ESLint con configuración TypeScript
- **Responsive**: Hook personalizado con breakpoints

### 🎯 **Tipos de Datos Principales**

```typescript
interface Tour {
  id: string
  name: string
  description: string
  scenes: Scene[]
  metadata: TourMetadata
}

interface Scene {
  id: string
  name: string
  panoramaUrl: string
  hotspots: Hotspot[]
  routes: Route[]
}

interface Hotspot {
  id: string
  type: 'navigation' | 'info' | 'route'
  position: { x: number; y: number; z: number }
  content: HotspotContent
}

interface Route {
  id: string
  name: string
  difficulty: string
  coordinates: Point[]
  style: DrawStyle
}
```

## 🎮 Funcionalidades Avanzadas

### 🔧 **Paneles Inteligentes**
- **Auto-hide**: Se ocultan automáticamente tras 5 segundos
- **Pinning**: Ancla paneles para mantenerlos visibles
- **Contextuales**: Contenido cambia según el modo actual
- **Responsive**: Ancho adaptativo según dispositivo

### 🎨 **Sistema de Dibujo**
- **Capas por Dificultad**: Organiza rutas por grados
- **Estilos Personalizables**: Colores, grosor, opacidad
- **Herramientas Múltiples**: Puntos, líneas, flechas, formas
- **Historial Completo**: Deshacer/rehacer ilimitado

### 🚀 **Optimizaciones**
- **Lazy Loading**: Componentes se cargan bajo demanda
- **Responsive Images**: Imágenes adaptativas según dispositivo
- **State Persistence**: Estado guardado automáticamente
- **Keyboard Navigation**: Navegación completa sin mouse

## 🆘 Solución de Problemas

### 🚨 **Problemas Comunes**

#### No se pueden instalar dependencias
```bash
# Problema de permisos npm
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Limpiar cache npm
npm cache clean --force

# Reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### Aplicación no carga
```bash
# Verificar versión de Node
node --version  # Debe ser >= 18.0.0

# Verificar puerto disponible
lsof -i :5173

# Iniciar en puerto diferente
npm run dev -- --port 3000
```

#### Problemas de rendimiento
```bash
# Habilitar modo desarrollo optimizado
npm run dev -- --mode development

# Limpiar build anterior
rm -rf dist
npm run build
```

### 📞 **Obtener Ayuda**

1. **Centro de Ayuda**: Presiona `F1` dentro de la aplicación
2. **Tours Guiados**: Disponibles en el centro de ayuda
3. **Documentación**: Consulta los componentes en `src/`
4. **Issues**: [GitHub Issues](https://github.com/falgom4/Buho/issues)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### 📋 **Guidelines de Desarrollo**

- Usa TypeScript para tipado fuerte
- Sigue las convenciones de ESLint
- Añade tests para nuevas funcionalidades
- Documenta componentes complejos
- Mantén consistencia con el diseño existente

## 🎯 Roadmap

### ✅ **Completado**
- [x] **Prompt 1**: Inicialización y estructura base
- [x] **Prompt 2**: Motor de tours virtuales con Three.js
- [x] **Prompt 3**: Sistema de hotspots interactivos
- [x] **Prompt 4**: Editor de rutas de escalada
- [x] **Prompt 5**: Gestión completa de proyectos
- [x] **Prompt 6**: Interfaz minimalista y sistema de onboarding

### 🔄 **En Desarrollo**
- [ ] **Prompt 7**: Exportación para aplicaciones Expo
- [ ] **Prompt 8**: Optimización, testing y documentación final

### 🎯 **Futuras Funcionalidades**
- [ ] Colaboración en tiempo real
- [ ] Templates de proyectos
- [ ] Integración con APIs de escalada
- [ ] Modo offline completo
- [ ] Plugin system para extensiones

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- **Three.js** por el motor 3D
- **React Three Fiber** por la integración con React  
- **Tailwind CSS** por el sistema de estilos
- **Zustand** por la gestión de estado simple y efectiva

---

<div align="center">

**¡Crea tours virtuales increíbles con Buho Editor! 🏔️**

[Demo](https://buho-editor.demo) • [Documentación](https://docs.buho-editor.com) • [Reportar Bug](https://github.com/falgom4/Buho/issues)

</div>