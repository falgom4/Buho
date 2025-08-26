import React, { useState } from 'react'
import { useEditorStore, HotspotTool } from '../../stores/editorStore'
import { useRouteEditorStore } from '../../stores/routeEditorStore'
import TourValidator from '../TourValidator/TourValidator'
import TourPreview from '../TourPreview/TourPreview'

const EditorToolbar: React.FC = () => {
  const { 
    mode, 
    selectedTool, 
    isPlacingHotspot, 
    setMode, 
    startPlacingHotspot, 
    cancelPlacingHotspot 
  } = useEditorStore()
  
  const { isDrawingMode, setDrawingMode } = useRouteEditorStore()
  const [showValidator, setShowValidator] = useState(false)
  const [showFullPreview, setShowFullPreview] = useState(false)

  const toggleMode = () => {
    setMode(mode === 'preview' ? 'edit' : 'preview')
    if (mode === 'edit') {
      cancelPlacingHotspot()
    }
  }

  const handleToolSelect = (tool: HotspotTool) => {
    if (isPlacingHotspot && selectedTool === tool) {
      cancelPlacingHotspot()
    } else {
      startPlacingHotspot(tool)
    }
  }

  const getToolIcon = (tool: HotspotTool) => {
    switch (tool) {
      case 'navigation': return '🔗'
      case 'info': return 'ℹ️'
      case 'route': return '⛰️'
      default: return '●'
    }
  }

  const getToolLabel = (tool: HotspotTool) => {
    switch (tool) {
      case 'navigation': return 'Navegación'
      case 'info': return 'Información'
      case 'route': return 'Ruta'
      default: return ''
    }
  }

  if (mode === 'preview') {
    return (
      <>
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={() => setShowValidator(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            🔍 Validar
          </button>
          <button
            onClick={() => setShowFullPreview(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            👁️ Preview
          </button>
          <button
            onClick={toggleMode}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            ✏️ Editar
          </button>
        </div>
        
        <TourValidator 
          isOpen={showValidator}
          onClose={() => setShowValidator(false)}
        />
        
        <TourPreview
          isOpen={showFullPreview}
          onClose={() => setShowFullPreview(false)}
          onEdit={() => {
            setShowFullPreview(false)
            toggleMode()
          }}
        />
      </>
    )
  }

  return (
    <>
      <div className="absolute top-4 right-4 z-10 bg-black bg-opacity-80 rounded-lg p-3">
        <div className="flex flex-col gap-2">
          {/* Quick actions */}
          <div className="flex gap-1">
            <button
              onClick={() => setShowValidator(true)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-2 py-2 rounded text-xs font-medium transition-colors"
              title="Validar tour"
            >
              🔍
            </button>
            <button
              onClick={toggleMode}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              👁️ Vista Previa
            </button>
          </div>
          
          <div className="border-t border-gray-600 pt-2">
            <div className="text-white text-xs mb-2 font-medium">Agregar Hotspot:</div>
            
            {/* Hotspot tools */}
            {(['navigation', 'info', 'route'] as HotspotTool[]).map((tool) => (
              <button
                key={tool}
                onClick={() => handleToolSelect(tool)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                  selectedTool === tool && isPlacingHotspot
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                }`}
                title={`Agregar hotspot de ${getToolLabel(tool)}`}
              >
                <span>{getToolIcon(tool)}</span>
                <span>{getToolLabel(tool)}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-600 pt-2">
            <div className="text-white text-xs mb-2 font-medium">Editor de Rutas:</div>
            
            <button
              onClick={() => setDrawingMode(!isDrawingMode)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                isDrawingMode
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              }`}
              title="Activar editor de rutas de escalada"
            >
              <span>🎨</span>
              <span>Dibujar Rutas</span>
            </button>
          </div>

          {isPlacingHotspot && (
            <div className="border-t border-gray-600 pt-2 text-xs text-yellow-300">
              💡 Click en el panorama para colocar hotspot
            </div>
          )}

          {/* Cancel button when placing */}
          {isPlacingHotspot && (
            <button
              onClick={cancelPlacingHotspot}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
            >
              ❌ Cancelar
            </button>
          )}
        </div>
      </div>
      
      <TourValidator 
        isOpen={showValidator}
        onClose={() => setShowValidator(false)}
      />
      
      <TourPreview
        isOpen={showFullPreview}
        onClose={() => setShowFullPreview(false)}
        onEdit={() => {
          setShowFullPreview(false)
          setMode('edit')
        }}
      />
    </>
  )
}

export default EditorToolbar