import React, { useState } from 'react'
import { useRouteEditorStore } from '../../stores/routeEditorStore'

const StylePanel: React.FC = () => {
  const {
    isDrawingMode,
    strokeColor,
    strokeWidth,
    setStrokeColor,
    setStrokeWidth
  } = useRouteEditorStore()

  const [showColorPicker, setShowColorPicker] = useState(false)

  // Colores predefinidos para rutas de escalada
  const predefinedColors = [
    { name: 'Rojo', value: '#FF6B6B', description: 'Clásico para V4-V6' },
    { name: 'Azul', value: '#4ECDC4', description: 'Ideal para V1-V3' },
    { name: 'Verde', value: '#45B7D1', description: 'Perfecto para V7-V9' },
    { name: 'Naranja', value: '#FFA726', description: 'Destacado para V10+' },
    { name: 'Morado', value: '#AB47BC', description: 'Especiales y travesías' },
    { name: 'Amarillo', value: '#FFEE58', description: 'Rutas principiantes' },
    { name: 'Rosa', value: '#EC407A', description: 'Rutas técnicas' },
    { name: 'Cian', value: '#26C6DA', description: 'Rutas de resistencia' }
  ]

  // Grosores predefinidos
  const strokeWidths = [
    { value: 2, label: 'Fino', description: 'Para detalles precisos' },
    { value: 3, label: 'Normal', description: 'Estándar para la mayoría' },
    { value: 4, label: 'Grueso', description: 'Para rutas destacadas' },
    { value: 5, label: 'Extra', description: 'Para rutas principales' }
  ]

  if (!isDrawingMode) return null

  return (
    <div className="absolute top-20 left-4 z-20">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-80">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          🎨 Estilo de Ruta
        </h3>
        
        {/* Color selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color de línea
          </label>
          
          <div className="flex items-center gap-3 mb-3">
            {/* Current color display */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm transition-transform hover:scale-105"
                style={{ backgroundColor: strokeColor }}
                title="Click para seleccionar color personalizado"
              />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow">
                <span className="text-xs">🎨</span>
              </div>
            </div>
            
            {/* Custom color picker */}
            {showColorPicker && (
              <div className="absolute top-16 left-0 bg-white border rounded-lg shadow-lg p-2 z-30">
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="w-20 h-8 border rounded cursor-pointer"
                />
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="block mt-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  Cerrar
                </button>
              </div>
            )}
            
            <div>
              <div className="text-sm font-medium text-gray-800">
                Color actual
              </div>
              <div className="text-xs text-gray-500">
                {strokeColor.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Predefined colors grid */}
          <div className="grid grid-cols-4 gap-2">
            {predefinedColors.map((color) => (
              <button
                key={color.value}
                onClick={() => setStrokeColor(color.value)}
                className={`group relative w-full h-10 rounded-lg border-2 transition-all hover:scale-105 ${
                  strokeColor === color.value
                    ? 'border-gray-800 shadow-md'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color.value }}
                title={`${color.name} - ${color.description}`}
              >
                {strokeColor === color.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg drop-shadow">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stroke width selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grosor de línea: {strokeWidth}px
          </label>
          
          {/* Visual width selector */}
          <div className="space-y-2 mb-3">
            {strokeWidths.map((width) => (
              <button
                key={width.value}
                onClick={() => setStrokeWidth(width.value)}
                className={`w-full p-3 rounded-lg border transition-all hover:bg-gray-50 ${
                  strokeWidth === width.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-800">
                      {width.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {width.description}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="rounded-full"
                      style={{
                        backgroundColor: strokeColor,
                        height: `${width.value * 2}px`,
                        width: '40px'
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {width.value}px
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Custom width slider */}
          <div className="mt-3">
            <input
              type="range"
              min="1"
              max="8"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1px</span>
              <span>4px</span>
              <span>8px</span>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="border-t pt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vista previa
          </label>
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-16">
            <svg width="120" height="20" className="overflow-visible">
              <line
                x1="10"
                y1="10"
                x2="110"
                y2="10"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              <circle
                cx="10"
                cy="10"
                r="3"
                fill={strokeColor}
              />
              <circle
                cx="110"
                cy="10"
                r="3"
                fill={strokeColor}
              />
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: ${strokeColor};
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: ${strokeColor};
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}

export default StylePanel