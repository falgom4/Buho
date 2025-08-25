import React from 'react'
import { useRouteEditorStore, DrawTool, EditTool } from '../../stores/routeEditorStore'

const DrawingToolbar: React.FC = () => {
  const {
    isDrawingMode,
    selectedDrawTool,
    selectedEditTool,
    isDrawing,
    setDrawingMode,
    setSelectedDrawTool,
    setSelectedEditTool,
    cancelDrawing
  } = useRouteEditorStore()

  if (!isDrawingMode) return null

  const handleDrawToolSelect = (tool: DrawTool) => {
    if (isDrawing) {
      cancelDrawing()
    }
    setSelectedDrawTool(tool)
  }

  const handleEditToolSelect = (tool: EditTool) => {
    if (isDrawing) {
      cancelDrawing()
    }
    setSelectedEditTool(tool)
  }

  const getToolIcon = (tool: string) => {
    switch (tool) {
      case 'line': return '📏'
      case 'arrow': return '↗️'
      case 'point': return '📍'
      case 'select': return '👆'
      case 'move': return '✋'
      case 'delete': return '🗑️'
      default: return '●'
    }
  }

  const getToolName = (tool: string) => {
    switch (tool) {
      case 'line': return 'Línea'
      case 'arrow': return 'Flecha'
      case 'point': return 'Punto'
      case 'select': return 'Seleccionar'
      case 'move': return 'Mover'
      case 'delete': return 'Eliminar'
      default: return tool
    }
  }

  const isToolActive = (tool: string) => {
    return selectedDrawTool === tool || selectedEditTool === tool
  }

  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3">
        <div className="flex items-center gap-2">
          {/* Toggle drawing mode */}
          <button
            onClick={() => setDrawingMode(!isDrawingMode)}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
            title="Salir del modo dibujo"
          >
            ❌
          </button>

          <div className="w-px h-8 bg-gray-300 mx-1" />

          {/* Drawing tools */}
          <div className="flex gap-1">
            {(['line', 'arrow', 'point'] as DrawTool[]).map(tool => (
              <button
                key={tool}
                onClick={() => handleDrawToolSelect(tool)}
                className={`flex flex-col items-center p-2 rounded-lg text-sm transition-all ${
                  isToolActive(tool)
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
                title={getToolName(tool)}
              >
                <span className="text-lg mb-1">{getToolIcon(tool)}</span>
                <span className="text-xs font-medium">{getToolName(tool)}</span>
              </button>
            ))}
          </div>

          <div className="w-px h-8 bg-gray-300 mx-1" />

          {/* Edit tools */}
          <div className="flex gap-1">
            {(['select', 'move', 'delete'] as EditTool[]).map(tool => (
              <button
                key={tool}
                onClick={() => handleEditToolSelect(tool)}
                className={`flex flex-col items-center p-2 rounded-lg text-sm transition-all ${
                  isToolActive(tool)
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
                title={getToolName(tool)}
              >
                <span className="text-lg mb-1">{getToolIcon(tool)}</span>
                <span className="text-xs font-medium">{getToolName(tool)}</span>
              </button>
            ))}
          </div>

          {/* Current drawing status */}
          {isDrawing && (
            <>
              <div className="w-px h-8 bg-gray-300 mx-1" />
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-yellow-700 font-medium">
                  Dibujando... (doble click para terminar)
                </span>
                <button
                  onClick={cancelDrawing}
                  className="text-yellow-600 hover:text-yellow-800 text-xs"
                >
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DrawingToolbar