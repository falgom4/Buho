import React, { useState } from 'react'
import { usePresetsStore, ClimbingPreset } from '../../stores/presetsStore'
import { useProjectStore } from '../../stores/projectStore'

interface PresetsManagerProps {
  isOpen: boolean
  onClose: () => void
  onPresetApply?: (preset: ClimbingPreset) => void
}

const PresetsManager: React.FC<PresetsManagerProps> = ({ isOpen, onClose, onPresetApply }) => {
  const {
    presets,
    selectedPresetId,
    setSelectedPreset,
    deletePreset,
    duplicatePreset,
    exportPreset,
    importPreset,
    resetToDefaults
  } = usePresetsStore()

  const { currentProject, updateProject } = useProjectStore()
  const [activeCategory, setActiveCategory] = useState<'all' | 'boulder' | 'sport' | 'trad' | 'mixed'>('all')
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importData, setImportData] = useState('')
  const [importError, setImportError] = useState('')

  if (!isOpen) return null

  const categories = [
    { id: 'all', name: 'Todos', icon: '🏔️', count: presets.length },
    { id: 'boulder', name: 'Boulder', icon: '🪨', count: presets.filter(p => p.category === 'boulder').length },
    { id: 'sport', name: 'Deportiva', icon: '🧗‍♀️', count: presets.filter(p => p.category === 'sport').length },
    { id: 'trad', name: 'Tradicional', icon: '⚙️', count: presets.filter(p => p.category === 'trad').length },
    { id: 'mixed', name: 'Mixta', icon: '🏔️', count: presets.filter(p => p.category === 'mixed').length }
  ]

  const filteredPresets = activeCategory === 'all' 
    ? presets 
    : presets.filter(p => p.category === activeCategory)

  const handleApplyPreset = (preset: ClimbingPreset) => {
    if (onPresetApply) {
      onPresetApply(preset)
    } else if (currentProject) {
      // Aplicar preset al proyecto actual
      updateProject(currentProject.id, {
        category: preset.category,
        difficulty: preset.difficultyRange,
        tags: [...new Set([...currentProject.tags, ...preset.tags])]
      })
    }
    setSelectedPreset(preset.id)
  }

  const handleExportPreset = (preset: ClimbingPreset) => {
    try {
      const exportData = exportPreset(preset.id)
      const blob = new Blob([exportData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${preset.name.toLowerCase().replace(/\s+/g, '-')}.buho-preset.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting preset:', error)
    }
  }

  const handleImportPreset = () => {
    try {
      setImportError('')
      const newPreset = importPreset(importData)
      setShowImportDialog(false)
      setImportData('')
      console.log('Preset importado:', newPreset.name)
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Error al importar preset')
    }
  }

  const handleDeletePreset = (preset: ClimbingPreset) => {
    if (preset.metadata.isDefault) {
      alert('No se pueden eliminar presets predefinidos')
      return
    }
    
    if (window.confirm(`¿Estás seguro de eliminar el preset "${preset.name}"?`)) {
      try {
        deletePreset(preset.id)
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Error al eliminar preset')
      }
    }
  }

  const getDifficultyRange = (preset: ClimbingPreset) => {
    return `${preset.difficultyRange.min} - ${preset.difficultyRange.max}`
  }

  const getGradeColor = (preset: ClimbingPreset, grade: string) => {
    return preset.routeColors[grade] || '#666666'
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Presets de Escalada</h2>
              <p className="text-purple-100">
                Configuraciones predefinidas para diferentes tipos de escalada
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar - Categories */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Categorías</h3>
            <div className="space-y-1">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as any)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                    activeCategory === category.id
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2">
              <button
                onClick={() => setShowImportDialog(true)}
                className="w-full flex items-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                📥 Importar Preset
              </button>
              <button
                onClick={resetToDefaults}
                className="w-full flex items-center gap-2 p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                🔄 Restaurar Defaults
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {filteredPresets.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No hay presets en esta categoría
                </h3>
                <p className="text-gray-600">
                  Cambia de categoría o importa nuevos presets
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPresets.map(preset => (
                  <div
                    key={preset.id}
                    className={`border-2 rounded-xl overflow-hidden transition-all hover:shadow-lg ${
                      selectedPresetId === preset.id
                        ? 'border-purple-500 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Preset Header */}
                    <div 
                      className="p-4 text-white"
                      style={{ backgroundColor: preset.color }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{preset.icon}</span>
                          <div>
                            <h3 className="font-bold text-lg">{preset.name}</h3>
                            <p className="text-sm opacity-90">{preset.description}</p>
                          </div>
                        </div>
                        {preset.metadata.isDefault && (
                          <span className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">
                            Default
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Preset Content */}
                    <div className="p-4 bg-white">
                      {/* Difficulty Range */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Rango de dificultad
                          </span>
                          <span className="font-bold text-gray-900">
                            {getDifficultyRange(preset)}
                          </span>
                        </div>

                        {/* Color palette */}
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(preset.routeColors).slice(0, 8).map(([grade, color]) => (
                            <div
                              key={grade}
                              className="flex flex-col items-center"
                              title={grade}
                            >
                              <div
                                className="w-6 h-6 rounded border border-gray-300"
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-xs text-gray-600 mt-1">{grade}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Equipment */}
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-700 mb-2 block">
                          Equipo recomendado
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {preset.equipment.slice(0, 4).map((item, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {item}
                            </span>
                          ))}
                          {preset.equipment.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                              +{preset.equipment.length - 4} más
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {preset.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApplyPreset(preset)}
                          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                          Aplicar
                        </button>
                        <button
                          onClick={() => duplicatePreset(preset.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Duplicar"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => handleExportPreset(preset)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Exportar"
                        >
                          📤
                        </button>
                        {!preset.metadata.isDefault && (
                          <button
                            onClick={() => handleDeletePreset(preset)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Import Dialog */}
        {showImportDialog && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Importar Preset</h3>
                
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Pega aquí el JSON del preset..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
                
                {importError && (
                  <div className="mt-2 text-red-600 text-sm">
                    {importError}
                  </div>
                )}
                
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setShowImportDialog(false)
                      setImportData('')
                      setImportError('')
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleImportPreset}
                    disabled={!importData.trim()}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Importar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PresetsManager