import React, { useState } from 'react'
import { usePresetsStore, ClimbingPreset } from '../../stores/presetsStore'
import PresetsManager from './PresetsManager'

interface QuickPresetSelectorProps {
  onPresetSelect?: (preset: ClimbingPreset) => void
  selectedCategory?: 'boulder' | 'sport' | 'trad' | 'mixed'
  className?: string
}

const QuickPresetSelector: React.FC<QuickPresetSelectorProps> = ({
  onPresetSelect,
  selectedCategory,
  className = ''
}) => {
  const { presets, getPresetsByCategory } = usePresetsStore()
  const [showFullManager, setShowFullManager] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Get presets based on category or show defaults
  const relevantPresets = selectedCategory 
    ? getPresetsByCategory(selectedCategory)
    : presets.filter(p => p.metadata.isDefault).slice(0, 4)

  const handlePresetSelect = (preset: ClimbingPreset) => {
    if (onPresetSelect) {
      onPresetSelect(preset)
    }
    setIsExpanded(false)
  }

  return (
    <>
      <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <div>
              <h3 className="font-medium text-gray-800">Presets Rápidos</h3>
              <p className="text-xs text-gray-600">
                {selectedCategory 
                  ? `Presets para ${selectedCategory}`
                  : 'Configuraciones predefinidas'
                }
              </p>
            </div>
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 rounded-lg text-sm transition-colors ${
                isExpanded 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title={isExpanded ? 'Contraer' : 'Expandir'}
            >
              {isExpanded ? '▲' : '▼'}
            </button>
            
            <button
              onClick={() => setShowFullManager(true)}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg text-sm transition-colors"
              title="Abrir gestor completo"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Quick preset buttons */}
        <div className={`grid gap-2 transition-all ${
          isExpanded ? 'grid-cols-1' : 'grid-cols-2'
        }`}>
          {relevantPresets.map(preset => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className={`text-left p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group ${
                isExpanded ? 'min-h-[80px]' : ''
              }`}
              style={{ 
                borderLeftColor: preset.color,
                borderLeftWidth: '4px'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{preset.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 text-sm truncate">
                    {preset.name}
                  </div>
                  {isExpanded && (
                    <div className="text-xs text-gray-600 mt-1">
                      {preset.description}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{preset.difficultyRange.min}-{preset.difficultyRange.max}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  Aplicar →
                </span>
              </div>
              
              {isExpanded && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {preset.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Show more button */}
        {!isExpanded && relevantPresets.length === 0 && (
          <div className="text-center py-4">
            <div className="text-gray-400 text-sm mb-2">
              No hay presets para esta categoría
            </div>
            <button
              onClick={() => setShowFullManager(true)}
              className="text-purple-600 text-sm hover:underline"
            >
              Ver todos los presets
            </button>
          </div>
        )}

        {!isExpanded && relevantPresets.length > 4 && (
          <div className="mt-3 text-center">
            <button
              onClick={() => setShowFullManager(true)}
              className="text-purple-600 text-sm hover:underline"
            >
              Ver {relevantPresets.length - 4} presets más...
            </button>
          </div>
        )}

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => setShowFullManager(true)}
              className="w-full flex items-center justify-center gap-2 py-2 text-purple-600 hover:bg-purple-50 rounded-lg text-sm transition-colors"
            >
              <span>⚙️</span>
              <span>Abrir Gestor Completo</span>
            </button>
          </div>
        )}
      </div>

      {/* Full Presets Manager */}
      {showFullManager && (
        <PresetsManager
          isOpen={showFullManager}
          onClose={() => setShowFullManager(false)}
          onPresetApply={(preset) => {
            handlePresetSelect(preset)
            setShowFullManager(false)
          }}
        />
      )}
    </>
  )
}

export default QuickPresetSelector