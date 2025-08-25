import React from 'react'
import { useTourStore, useSceneNavigation, useCurrentScene } from '../../stores/tourStore'

const NavigationControls: React.FC = () => {
  const { 
    navigateNext, 
    navigatePrev, 
    canNavigateNext, 
    canNavigatePrev 
  } = useSceneNavigation()
  
  const currentScene = useCurrentScene()
  const { scenes, loading } = useTourStore()

  if (!currentScene) return null

  const currentIndex = scenes.findIndex(scene => scene.id === currentScene.id)

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <div className="bg-black bg-opacity-70 rounded-lg px-4 py-2 flex items-center gap-4">
        {/* Botón anterior */}
        <button
          onClick={navigatePrev}
          disabled={!canNavigatePrev || loading}
          className={`p-2 rounded-full transition-all ${
            canNavigatePrev && !loading
              ? 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white cursor-pointer'
              : 'bg-gray-600 bg-opacity-20 text-gray-500 cursor-not-allowed'
          }`}
          title="Escena anterior"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>

        {/* Información de escena */}
        <div className="text-center min-w-40">
          <div className="text-white font-medium text-sm">
            {currentScene.name}
          </div>
          <div className="text-gray-300 text-xs">
            {currentIndex + 1} de {scenes.length}
          </div>
          {loading && (
            <div className="text-blue-400 text-xs mt-1">
              Cargando...
            </div>
          )}
        </div>

        {/* Botón siguiente */}
        <button
          onClick={navigateNext}
          disabled={!canNavigateNext || loading}
          className={`p-2 rounded-full transition-all ${
            canNavigateNext && !loading
              ? 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white cursor-pointer'
              : 'bg-gray-600 bg-opacity-20 text-gray-500 cursor-not-allowed'
          }`}
          title="Escena siguiente"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
          </svg>
        </button>
      </div>

      {/* Indicador de progreso */}
      <div className="mt-2 bg-gray-600 bg-opacity-50 rounded-full h-1 overflow-hidden">
        <div 
          className="bg-white h-full transition-all duration-300"
          style={{ 
            width: `${((currentIndex + 1) / scenes.length) * 100}%` 
          }}
        />
      </div>
    </div>
  )
}

export default NavigationControls