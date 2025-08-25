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
import { useTourStore, useCurrentScene } from '../../stores/tourStore'
import { useEditorStore } from '../../stores/editorStore'
import { useRouteEditorStore } from '../../stores/routeEditorStore'

const TourViewer: React.FC = () => {
  const { currentTour } = useTourStore()
  const currentScene = useCurrentScene()
  const { mode, showHotspotPanel } = useEditorStore()
  const { isDrawingMode } = useRouteEditorStore()

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <h2 className="text-xl font-semibold mb-4">
        {currentTour?.title || 'Tour Viewer'}
      </h2>
      <div className="bg-gray-700 rounded-lg h-96 overflow-hidden relative">
        <Canvas
          camera={{
            fov: 75,
            near: 0.1,
            far: 1000,
            position: [0, 0, 0]
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color="gray" />
            </mesh>
          }>
            <PanoramaScene />
          </Suspense>
          <ambientLight intensity={1} />
        </Canvas>
        
        {/* Info overlay */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded px-3 py-2 text-sm">
          <div className="text-white">
            🦉 {currentScene?.name || 'Buho Tour Viewer'}
            {mode === 'edit' && (
              <span className="ml-2 bg-orange-600 px-2 py-1 rounded text-xs">
                MODO EDICIÓN
              </span>
            )}
          </div>
          <div className="text-gray-300 text-xs">
            {mode === 'edit' 
              ? 'Click para editar hotspots • Selecciona herramientas' 
              : 'Arrastra para explorar • Rueda para zoom • Click hotspots'
            }
          </div>
        </div>

        {/* Controls overlay */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded px-3 py-2 text-xs">
          <div className="text-gray-300">
            🖱️ Arrastra: Rotar cámara
          </div>
          <div className="text-gray-300">
            🖳 Scroll: Zoom
          </div>
          <div className="text-gray-300">
            👆 Click: Interactuar
          </div>
        </div>

        {/* Route drawing overlay */}
        <RouteCanvas />
        
        {/* Navigation controls - solo en modo preview sin dibujo */}
        {mode === 'preview' && !isDrawingMode && <NavigationControls />}
        
        {/* Editor toolbar */}
        <EditorToolbar />
        
        {/* Hotspot properties panel */}
        {showHotspotPanel && <HotspotPropertiesPanel />}
        
        {/* Route drawing components */}
        <DrawingToolbar />
        <StylePanel />
        <LayersPanel />
        <RouteEditPanel />
      </div>
    </div>
  )
}

export default TourViewer