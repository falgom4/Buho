import React, { useState } from 'react'
import { useGuidedTour } from '../../hooks/useGuidedTour'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { useResponsive } from '../../hooks/useResponsive'

interface HelpCenterProps {
  isOpen: boolean
  onClose: () => void
}

const HelpCenter: React.FC<HelpCenterProps> = ({ isOpen, onClose }) => {
  const { isMobile } = useResponsive()
  const [activeTab, setActiveTab] = useState<'tours' | 'shortcuts' | 'docs' | 'support'>('tours')
  
  const {
    availableTours,
    getToursForCategory,
    hasCompletedTour,
    shouldShowTour,
    completedTours,
    completionRate,
    startTour
  } = useGuidedTour()
  
  const { getShortcutsByCategory, formatShortcut } = useKeyboardShortcuts({})

  if (!isOpen) return null

  const tabs = [
    { id: 'tours', label: 'Tours Guiados', icon: '🗺️' },
    { id: 'shortcuts', label: 'Atajos', icon: '⌨️' },
    { id: 'docs', label: 'Documentación', icon: '📚' },
    { id: 'support', label: 'Soporte', icon: '🎧' }
  ] as const

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basics': return '🚀'
      case 'features': return '⭐'
      case 'advanced': return '🎯'
      default: return '📋'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'basics': return 'Conceptos básicos'
      case 'features': return 'Características'
      case 'advanced': return 'Avanzado'
      default: return 'General'
    }
  }

  const tourCategories = ['basics', 'features', 'advanced'] as const

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-xl shadow-2xl ${
        isMobile ? 'w-full h-full max-w-sm' : 'w-full max-w-5xl h-[90vh]'
      } overflow-hidden`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Centro de Ayuda</h2>
              <p className="text-blue-100">Todo lo que necesitas saber sobre Buho Editor</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{completedTours.length}</div>
              <div className="text-xs text-blue-100">Tours completados</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{completionRate}%</div>
              <div className="text-xs text-blue-100">Progreso</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{availableTours.length}</div>
              <div className="text-xs text-blue-100">Tours disponibles</div>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Sidebar - Tabs */}
          {!isMobile && (
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
              <div className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mobile tabs */}
          {isMobile && (
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 p-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            
            {/* Tours Guiados Tab */}
            {activeTab === 'tours' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tours Guiados Interactivos</h3>
                  <p className="text-gray-600 mb-6">
                    Aprende a usar Buho Editor paso a paso con nuestros tours interactivos.
                  </p>
                </div>

                {tourCategories.map(category => {
                  const categoryTours = getToursForCategory(category)
                  if (categoryTours.length === 0) return null

                  return (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">{getCategoryIcon(category)}</span>
                        <h4 className="text-lg font-medium text-gray-800">{getCategoryName(category)}</h4>
                        <span className="text-sm text-gray-500">
                          ({categoryTours.filter(t => hasCompletedTour(t.id)).length}/{categoryTours.length})
                        </span>
                      </div>

                      <div className="grid gap-4 mb-6">
                        {categoryTours.map(tour => (
                          <div
                            key={tour.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-semibold text-gray-900">{tour.name}</h5>
                                  {hasCompletedTour(tour.id) && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                      ✓ Completado
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{tour.description}</p>
                                <div className="mt-2 text-xs text-gray-500">
                                  {tour.steps.length} pasos • ~{Math.ceil(tour.steps.length * 0.5)} min
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  startTour(tour.id)
                                  onClose()
                                }}
                                className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  hasCompletedTour(tour.id)
                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                              >
                                {hasCompletedTour(tour.id) ? 'Repetir' : 'Iniciar'}
                              </button>
                            </div>

                            {/* Progress bar for incomplete tours */}
                            {!hasCompletedTour(tour.id) && (
                              <div className="w-full bg-gray-200 rounded-full h-1">
                                <div
                                  className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                  style={{ width: '0%' }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Shortcuts Tab */}
            {activeTab === 'shortcuts' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Atajos de Teclado</h3>
                <p className="text-gray-600 mb-6">
                  Mejora tu productividad con estos atajos de teclado.
                </p>

                {Object.entries(getShortcutsByCategory()).map(([category, shortcuts]) => (
                  <div key={category} className="mb-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-3">{category}</h4>
                    <div className="space-y-2">
                      {shortcuts.map((shortcut, index) => (
                        <div
                          key={`${category}-${index}`}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-gray-800">{shortcut.description}</span>
                          <div className="flex items-center gap-1">
                            {formatShortcut(shortcut).split(' + ').map((key, i, arr) => (
                              <React.Fragment key={i}>
                                <kbd className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium text-gray-800 shadow-sm">
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
              </div>
            )}

            {/* Documentation Tab */}
            {activeTab === 'docs' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Documentación</h3>
                <p className="text-gray-600 mb-6">
                  Guías detalladas y documentación técnica.
                </p>

                <div className="grid gap-4">
                  {[
                    {
                      title: 'Guía de inicio rápido',
                      description: 'Crea tu primer tour virtual en minutos',
                      icon: '🚀',
                      link: '#'
                    },
                    {
                      title: 'Trabajar con hotspots',
                      description: 'Añade interactividad a tus panorámicas',
                      icon: '🔗',
                      link: '#'
                    },
                    {
                      title: 'Dibujar rutas de escalada',
                      description: 'Guía completa del modo de dibujo',
                      icon: '🎨',
                      link: '#'
                    },
                    {
                      title: 'Exportar y compartir',
                      description: 'Publica tus tours para la web y móvil',
                      icon: '📤',
                      link: '#'
                    },
                    {
                      title: 'API y integración',
                      description: 'Integra Buho Editor en tus proyectos',
                      icon: '🔧',
                      link: '#'
                    }
                  ].map((doc, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{doc.icon}</span>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">{doc.title}</h5>
                          <p className="text-sm text-gray-600">{doc.description}</p>
                        </div>
                        <span className="text-gray-400">→</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Support Tab */}
            {activeTab === 'support' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Soporte y Comunidad</h3>
                <p className="text-gray-600 mb-6">
                  Obtén ayuda y conecta con otros usuarios de Buho Editor.
                </p>

                <div className="grid gap-4">
                  {[
                    {
                      title: 'Chat en vivo',
                      description: 'Habla directamente con nuestro equipo de soporte',
                      icon: '💬',
                      action: 'Iniciar chat',
                      color: 'bg-green-600 hover:bg-green-700'
                    },
                    {
                      title: 'Foro de la comunidad',
                      description: 'Comparte tips y obtén ayuda de otros usuarios',
                      icon: '👥',
                      action: 'Ir al foro',
                      color: 'bg-blue-600 hover:bg-blue-700'
                    },
                    {
                      title: 'Base de conocimientos',
                      description: 'Busca respuestas en nuestra base de conocimientos',
                      icon: '📖',
                      action: 'Buscar',
                      color: 'bg-purple-600 hover:bg-purple-700'
                    },
                    {
                      title: 'Reportar un bug',
                      description: 'Ayúdanos a mejorar reportando errores',
                      icon: '🐛',
                      action: 'Reportar',
                      color: 'bg-red-600 hover:bg-red-700'
                    },
                    {
                      title: 'Solicitar característica',
                      description: 'Sugiere nuevas funciones para Buho Editor',
                      icon: '💡',
                      action: 'Sugerir',
                      color: 'bg-yellow-600 hover:bg-yellow-700'
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <span className="text-3xl">{item.icon}</span>
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2">{item.title}</h5>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </div>
                        <button className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${item.color}`}>
                          {item.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              <span className="font-medium">¿Necesitas más ayuda?</span> Estamos aquí para ti.
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">F1</kbd>
              <span>para abrir ayuda rápida</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpCenter