import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import PanoramaScene from './PanoramaScene'
import NavigationControls from './NavigationControls'
import EditorToolbar from '../HotspotEditor/EditorToolbar'
import HotspotPropertiesPanel from '../HotspotEditor/HotspotPropertiesPanel'
import RouteCanvas from '../RouteDrawer/RouteCanvas'
import DrawingToolbar from '../RouteDrawer/DrawingToolbar'
import StylePanel from '../RouteDrawer/StylePanel'
import LayersPanel from '../RouteDrawer/LayersPanel'
import RouteEditPanel from '../RouteDrawer/RouteEditPanel'
import SidePanel from '../Layout/SidePanel'
import { useTourStore, useCurrentScene } from '../../stores/tourStore'
import { useEditorStore } from '../../stores/editorStore'
import { useRouteEditorStore } from '../../stores/routeEditorStore'
import { useSidePanels } from '../../hooks/useSidePanels'

const TourViewer: React.FC = () => {
  const { currentTour } = useTourStore()
  const currentScene = useCurrentScene()
  const { mode, showHotspotPanel } = useEditorStore()
  const { isDrawingMode } = useRouteEditorStore()
  const { panels, togglePanel, contentMargin } = useSidePanels()

  // Mostrar loading si no hay tour o escena
  if (!currentTour || !currentScene) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-2xl text-gray-600">🏔️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Cargando tour...
          </h3>
          <p className="text-gray-600">
            Preparando la experiencia inmersiva
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full relative overflow-hidden bg-black">
      {/* Main canvas - Inmersivo a pantalla completa */}
      <div 
        className="h-full transition-all duration-300 ease-in-out"
        style={{
          marginLeft: `${contentMargin.left}px`,
          marginRight: `${contentMargin.right}px`
        }}
      >
        <Canvas
          camera={{
            fov: 75,
            near: 0.1,
            far: 1000,
            position: [0, 0, 0]
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <PanoramaScene />
          </Suspense>
          <ambientLight intensity={1} />
        </Canvas>

        {/* Loading overlay para Suspense */}
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <Suspense fallback={
            <div className="text-white text-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm">Cargando panorama...</p>
            </div>
          }>
            <div className="hidden"></div>
          </Suspense>
        </div>

        {/* Route drawing overlay */}
        <RouteCanvas />
        
        {/* Overlays minimalistas - solo visibles cuando son necesarios */}
        
        {/* Scene info - Solo en modo preview y cuando no hay paneles */}
        {mode === 'preview' && !panels.right.isOpen && (
          <div className="absolute top-6 left-6 z-10">
            <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-xl px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div>
                  <div className="font-semibold">{currentScene.name}</div>
                  {currentScene.description && (
                    <div className="text-xs text-gray-300 max-w-xs truncate">
                      {currentScene.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick stats - Solo en modo edición */}
        {mode === 'edit' && !panels.right.isOpen && (
          <div className="absolute top-6 right-6 z-10">
            <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-xl px-4 py-3 text-white">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span>🔗</span>
                  <span>{currentScene.hotspots.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🧗</span>
                  <span>{currentScene.routes.length}</span>
                </div>
                {isDrawingMode && (
                  <div className="flex items-center gap-1 text-green-400">
                    <span>🎨</span>
                    <span>Dibujando</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation controls - Solo en preview sin panel */}
        {mode === 'preview' && !isDrawingMode && !panels.left.isOpen && (
          <NavigationControls />
        )}
        
        {/* Editor toolbar - Ahora más minimalista */}
        <EditorToolbar />
        
        {/* Hotspot properties panel */}
        {showHotspotPanel && <HotspotPropertiesPanel />}
        
        {/* Route drawing components - Solo cuando están en modo dibujo */}
        {isDrawingMode && (
          <>
            <DrawingToolbar />
            {!panels.left.isOpen && <StylePanel />}
            {!panels.right.isOpen && <LayersPanel />}
            <RouteEditPanel />
          </>
        )}

        {/* Help hint - Solo se muestra brevemente */}
        {mode === 'preview' && !panels.left.isOpen && !panels.right.isOpen && (
          <div className="absolute bottom-6 left-6 z-10">
            <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs animate-fade-in">
              <div className="flex items-center gap-2">
                <span>💡</span>
                <span>
                  <kbd className="px-1 py-0.5 bg-white bg-opacity-20 rounded text-xs">Ctrl</kbd>
                  <span className="mx-1">+</span>
                  <kbd className="px-1 py-0.5 bg-white bg-opacity-20 rounded text-xs">\</kbd>
                  <span className="ml-1">para abrir panel</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Side Panels */}
      <SidePanel
        isOpen={panels.left.isOpen}
        onToggle={() => togglePanel('left')}
        side="left"
        width={panels.left.width}
      />
      
      <SidePanel
        isOpen={panels.right.isOpen}
        onToggle={() => togglePanel('right')}
        side="right"
        width={panels.right.width}
      />

      {/* Global styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

export default TourViewer