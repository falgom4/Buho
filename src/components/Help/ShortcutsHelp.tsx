import React, { useState, useEffect } from 'react'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'

interface ShortcutsHelpProps {
  isOpen: boolean
  onClose: () => void
  trigger?: 'manual' | 'f1' | 'tooltip'
}

const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({ isOpen, onClose, trigger = 'manual' }) => {
  const { getShortcutsByCategory, formatShortcut } = useKeyboardShortcuts({})
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = getShortcutsByCategory()
  const categoryList = Object.keys(categories).sort()

  // Filter shortcuts based on search
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery) return categories

    const filtered: { [key: string]: any[] } = {}
    Object.entries(categories).forEach(([category, shortcuts]) => {
      const matchingShortcuts = shortcuts.filter(shortcut =>
        shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatShortcut(shortcut).toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (matchingShortcuts.length > 0) {
        filtered[category] = matchingShortcuts
      }
    })
    return filtered
  }, [categories, searchQuery, formatShortcut])

  // Handle F1 key for help
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault()
        if (!isOpen) {
          // Open help
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Navegación': return '🧭'
      case 'Interfaz': return '🖥️'
      case 'Vista': return '👁️'
      case 'Edición': return '✏️'
      case 'Dibujo': return '🎨'
      case 'Herramientas': return '🛠️'
      default: return '📋'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Navegación': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Interfaz': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'Vista': return 'bg-green-50 text-green-700 border-green-200'
      case 'Edición': return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'Dibujo': return 'bg-pink-50 text-pink-700 border-pink-200'
      case 'Herramientas': return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Atajos de Teclado</h2>
              <p className="text-indigo-100">Controla Buho Editor como un profesional</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Search */}
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar atajo..."
                className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
              <div className="absolute right-3 top-2 text-indigo-200">
                🔍
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Sidebar - Categories */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory(null)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeCategory === null
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>📚</span>
                  <span className="font-medium">Todos los atajos</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Object.values(categories).reduce((total, shortcuts) => total + shortcuts.length, 0)} atajos
                </div>
              </button>

              {Object.entries(filteredCategories).map(([category, shortcuts]) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeCategory === category
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{getCategoryIcon(category)}</span>
                    <span className="font-medium">{category}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {shortcuts.length} atajo{shortcuts.length !== 1 ? 's' : ''}
                  </div>
                </button>
              ))}
            </div>

            {/* Tips */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span>💡</span>
                  <span className="font-medium text-blue-800">Consejo</span>
                </div>
                <p className="text-sm text-blue-700">
                  Presiona <kbd className="px-1.5 py-1 bg-blue-100 rounded text-xs">F1</kbd> en cualquier momento para abrir esta ayuda.
                </p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {Object.entries(filteredCategories)
              .filter(([category]) => !activeCategory || category === activeCategory)
              .map(([category, shortcuts]) => (
                <div key={category} className="mb-8">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${getCategoryColor(category)}`}>
                    <span>{getCategoryIcon(category)}</span>
                    <span>{category}</span>
                    <span className="bg-white bg-opacity-70 px-2 py-0.5 rounded-full text-xs">
                      {shortcuts.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {shortcuts.map((shortcut, index) => (
                      <div
                        key={`${category}-${index}`}
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 mb-1">
                            {shortcut.description}
                          </div>
                          {shortcut.enabled && !shortcut.enabled() && (
                            <div className="text-xs text-gray-500">
                              No disponible en el contexto actual
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {formatShortcut(shortcut).split(' + ').map((key, i, arr) => (
                            <React.Fragment key={i}>
                              <kbd className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded text-sm font-medium text-gray-800 shadow-sm">
                                {key}
                              </kbd>
                              {i < arr.length - 1 && (
                                <span className="text-gray-400 text-sm mx-1">+</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            {Object.keys(filteredCategories).length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No se encontraron atajos
                </h3>
                <p className="text-gray-600">
                  Intenta con una búsqueda diferente
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              <span className="font-medium">Tip:</span> Los atajos no funcionan mientras escribes en campos de texto
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Esc</kbd>
              <span>para cerrar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShortcutsHelp