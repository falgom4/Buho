# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos de Desarrollo

```bash
# Desarrollo
npm run dev        # Inicia servidor de desarrollo Vite
npm run build      # Compila TypeScript y construye aplicación
npm run preview    # Vista previa de build de producción
npm run lint       # Ejecuta ESLint con configuración TypeScript
```

## Arquitectura del Proyecto

Buho Editor es un editor minimalista de tours virtuales con rutas de escalada para aplicaciones móviles Expo. La arquitectura se basa en React + TypeScript con Vite como bundler.

### Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **3D**: Three.js (planeado para visualización panorámica)
- **Estado**: Zustand para gestión de estado global
- **Styling**: Tailwind CSS (configuración pendiente)
- **Linting**: ESLint con configuración Next.js

### Estructura Modular de Componentes

```
src/
├── components/
│   ├── TourViewer/      # Visor principal con Three.js
│   ├── HotspotEditor/   # Editor de puntos de interés
│   ├── RouteDrawer/     # Herramientas para dibujar rutas
│   └── ProjectManager/  # Gestión de proyectos de tours
├── hooks/               # React hooks personalizados
├── utils/               # Utilidades compartidas
├── types/               # Definiciones TypeScript centralizadas
└── stores/              # Estado global con Zustand
```

### Tipos de Datos Principales

El sistema maneja cuatro entidades principales definidas en `src/types/index.ts`:

- **Tour**: Contenedor principal con metadata y escenas
- **Scene**: Escena panorámica individual con hotspots y rutas
- **Hotspot**: Puntos interactivos (navegación, información, rutas)
- **Route**: Rutas de escalada con coordenadas 2D y metadata

### Configuración Vite

- Usa alias `@` que apunta a `/src`
- Plugin React configurado
- Build con TypeScript + Vite optimizado

### Estado del Proyecto

Este proyecto está en desarrollo temprano. Las dependencias Three.js, React Three Fiber, Fabric.js y Tailwind están planeadas pero no instaladas. El componente TourViewer actual es un placeholder.