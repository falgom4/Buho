# Buho Editor

Editor minimalista de tours virtuales con rutas de escalada para aplicaciones móviles Expo.

## 🚀 Estado del Proyecto

### ✅ Completado (Prompt 1)
- ✅ Inicializado proyecto React con TypeScript
- ✅ Creada estructura de carpetas modular
- ✅ Configurado TypeScript y Vite
- ✅ Agregados componentes base TourViewer y App
- 🔄 **Pendiente**: Instalación de dependencias (requiere arreglar permisos npm)

### 📋 Siguiente (Prompt 2)
- Motor de tours virtuales con Three.js
- Controles de cámara panorámica
- Sistema de navegación entre escenas

## 📁 Estructura del Proyecto

```
buho-editor/
├── src/
│   ├── components/
│   │   ├── TourViewer/        # Visor principal de tours
│   │   ├── HotspotEditor/     # Editor de hotspots
│   │   ├── RouteDrawer/       # Herramientas de dibujo
│   │   └── ProjectManager/    # Gestión de proyectos
│   ├── hooks/                 # React hooks personalizados
│   ├── utils/                 # Utilidades generales
│   ├── types/                 # Definiciones TypeScript
│   └── stores/                # Estado global (Zustand)
├── public/                    # Assets públicos
├── docs/                      # Documentación
└── expo-integration/          # Componentes para Expo
```

## 🛠️ Tecnologías

- **Frontend**: React + TypeScript + Vite
- **3D**: Three.js + React Three Fiber (pendiente instalación)
- **Drawing**: HTML5 Canvas + Fabric.js (pendiente instalación)
- **State**: Zustand (pendiente instalación)
- **Styling**: Tailwind CSS (configuración pendiente)

## ⚠️ Problema Actual

Hay un problema de permisos con npm que impide instalar las dependencias. 
Se requiere ejecutar: `sudo chown -R 501:20 "/Users/fa/.npm"` para solucionarlo.

## 🚀 Desarrollo

```bash
# Una vez solucionado el problema de npm:
npm install
npm run dev
```

## 📈 Roadmap

1. **Prompt 2**: Motor de tours virtuales core
2. **Prompt 3**: Sistema de hotspots
3. **Prompt 4**: Editor de rutas de escalada  
4. **Prompt 5**: Gestión de proyectos
5. **Prompt 6**: UI/UX minimalista
6. **Prompt 7**: Exportación para Expo
7. **Prompt 8**: Optimización y testing
