import React, { useState, useEffect } from 'react'
import { useProjectStore } from './stores/projectStore'
import { useTourStore } from './stores/tourStore'
import { useEditorStore } from './stores/editorStore'
import TourViewer from './components/TourViewer/TourViewer'
import ProjectManager from './components/ProjectManager/ProjectManager'
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen'
import AppHeader from './components/Layout/AppHeader'
import LoadingScreen from './components/Layout/LoadingScreen'

function App() {
  const { currentProject, projects } = useProjectStore()
  const { currentTour } = useTourStore()
  const { mode } = useEditorStore()
  const [showProjectManager, setShowProjectManager] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)

  // Determinar qué mostrar basado en el estado
  useEffect(() => {
    const hasProjects = projects.length > 0
    const hasCurrentProject = !!currentProject
    const hasCurrentTour = !!currentTour

    // Simular carga inicial
    setTimeout(() => {
      setIsLoading(false)
      // Mostrar welcome si no hay proyectos o es primera visita
      if (!hasProjects || (!hasCurrentProject && !localStorage.getItem('buho-has-visited'))) {
        setShowWelcome(true)
        localStorage.setItem('buho-has-visited', 'true')
      }
    }, 1000)
  }, [projects, currentProject, currentTour])

  const handleWelcomeComplete = () => {
    setShowWelcome(false)
    setShowProjectManager(true)
  }

  const getAppState = () => {
    if (isLoading) return 'loading'
    if (showWelcome) return 'welcome'
    if (!currentProject || !currentTour) return 'no-project'
    return 'editor'
  }

  const appState = getAppState()

  // Loading screen
  if (appState === 'loading') {
    return <LoadingScreen />
  }

  // Welcome screen para nuevos usuarios
  if (appState === 'welcome') {
    return (
      <WelcomeScreen 
        onGetStarted={handleWelcomeComplete}
        onSkip={() => setShowWelcome(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header minimalista */}
      <AppHeader 
        currentProject={currentProject}
        currentTour={currentTour}
        editorMode={mode}
        onOpenProjects={() => setShowProjectManager(true)}
      />

      {/* Main content */}
      <main className="flex-1 relative overflow-hidden">
        {appState === 'no-project' ? (
          // Estado sin proyecto - llamada a acción elegante
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-4xl text-white">🏔️</span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Bienvenido a Buho Editor
              </h2>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Crea tours virtuales inmersivos con rutas de escalada. 
                Comienza seleccionando un proyecto o crea uno nuevo.
              </p>
              
              <button
                onClick={() => setShowProjectManager(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <span>🚀</span>
                <span className="font-medium">Comenzar</span>
              </button>
              
              <div className="mt-8 text-sm text-gray-500">
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl</kbd> + 
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs mx-1">P</kbd> 
                para abrir proyectos
              </div>
            </div>
          </div>
        ) : (
          // Editor principal
          <div className="h-full">
            <TourViewer />
          </div>
        )}
      </main>

      {/* Project Manager Modal */}
      <ProjectManager
        isOpen={showProjectManager}
        onClose={() => setShowProjectManager(false)}
      />
    </div>
  )
}

export default App