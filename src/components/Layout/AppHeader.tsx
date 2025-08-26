import React, { useState } from 'react'
import { Project } from '../../stores/projectStore'
import { Tour } from '../../types'
import { useResponsive } from '../../hooks/useResponsive'

interface AppHeaderProps {
  currentProject: Project | null
  currentTour: Tour | null
  editorMode: 'preview' | 'edit'
  onOpenProjects: () => void
}

const AppHeader: React.FC<AppHeaderProps> = ({
  currentProject,
  currentTour,
  editorMode,
  onOpenProjects
}) => {
  const { isMobile, isTablet } = useResponsive()
  const [isCompact, setIsCompact] = useState(isMobile)

  const getModeColor = () => {
    return editorMode === 'edit' 
      ? 'bg-orange-100 text-orange-700 border-orange-200'
      : 'bg-green-100 text-green-700 border-green-200'
  }

  const getModeIcon = () => {
    return editorMode === 'edit' ? '✏️' : '👁️'
  }

  return (
    <header className={`bg-white border-b border-gray-200 transition-all duration-200 ${
      isCompact ? 'py-2' : 'py-4'
    }`}>
      <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-6'}`}>
        <div className="flex items-center justify-between">
          {/* Logo y proyecto actual */}
          <div className={`flex items-center ${isMobile ? 'gap-3' : 'gap-6'}`}>
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setIsCompact(!isCompact)}
            >
              <div className={`bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center ${
                isMobile ? 'w-7 h-7' : 'w-8 h-8'
              }`}>
                <span className={`text-white ${isMobile ? 'text-base' : 'text-lg'}`}>🏔️</span>
              </div>
              {!isCompact && (
                <div>
                  <h1 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors ${
                    isMobile ? 'text-lg' : 'text-xl'
                  }`}>
                    Buho Editor
                  </h1>
                  {!isMobile && <p className="text-xs text-gray-500">Tours Virtuales</p>}
                </div>
              )}
            </div>

            {/* Separador */}
            {currentProject && (
              <div className="h-8 w-px bg-gray-200" />
            )}

            {/* Información del proyecto actual */}
            {currentProject && (
              <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'}`}>
                <button
                  onClick={onOpenProjects}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className={isMobile ? 'text-base' : 'text-lg'}>{
                      currentProject.category === 'boulder' ? '🪨' :
                      currentProject.category === 'sport' ? '🧗‍♀️' :
                      currentProject.category === 'trad' ? '⚙️' : '🏔️'
                    }</span>
                    {!isCompact && (
                      <div>
                        <div className={`font-semibold group-hover:text-blue-600 transition-colors ${
                          isMobile ? 'text-xs' : 'text-sm'
                        }`}>
                          {isMobile ? 
                            (currentProject.name.length > 15 ? currentProject.name.substring(0, 15) + '...' : currentProject.name) :
                            currentProject.name
                          }
                        </div>
                        {currentTour && !isMobile && (
                          <div className="text-xs text-gray-500">
                            {currentTour.scenes.length} escena{currentTour.scenes.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {!isMobile && (
                    <span className="text-gray-400 group-hover:text-blue-400 transition-colors">
                      ▼
                    </span>
                  )}
                </button>

                {/* Modo actual */}
                <div className={`rounded-full border font-medium ${getModeColor()} ${
                  isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'
                }`}>
                  <span className="mr-1">{getModeIcon()}</span>
                  {isMobile ? 
                    (editorMode === 'edit' ? 'Edit' : 'View') :
                    (editorMode === 'edit' ? 'Editando' : 'Previsualización')
                  }
                </div>
              </div>
            )}
          </div>

          {/* Controles de la derecha */}
          <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'}`}>
            {/* Indicador de guardado */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Guardado</span>
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-1">
              {/* Shortcuts hint */}
              {!isCompact && (
                <div className="hidden lg:flex items-center gap-1 mr-3 text-xs text-gray-400">
                  <kbd className="px-1.5 py-1 bg-gray-100 rounded text-xs">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-1.5 py-1 bg-gray-100 rounded text-xs">P</kbd>
                </div>
              )}

              {/* Compact toggle - Hide on mobile */}
              {!isMobile && (
                <button
                  onClick={() => setIsCompact(!isCompact)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  title={isCompact ? 'Expandir header' : 'Compactar header'}
                >
                  {isCompact ? '⬇️' : '⬆️'}
                </button>
              )}

              {/* Projects button */}
              <button
                onClick={onOpenProjects}
                className={`flex items-center gap-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors ${
                  isMobile ? 'p-2' : 'px-3 py-2'
                }`}
                title="Abrir gestor de proyectos (Ctrl+P)"
              >
                <span>📂</span>
                {!isCompact && !isMobile && <span className="hidden sm:inline text-sm font-medium">Proyectos</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar para operaciones */}
        <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden opacity-0 transition-opacity">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300" 
               style={{ width: '0%' }} />
        </div>
      </div>
    </header>
  )
}

export default AppHeader