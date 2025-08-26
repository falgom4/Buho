import React, { useState, useEffect } from 'react'

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(0)

  const loadingMessages = [
    'Inicializando Buho Editor...',
    'Cargando componentes 3D...',
    'Preparando herramientas de dibujo...',
    'Configurando gestor de proyectos...',
    'Listo para crear tours virtuales!'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 2, 100)
        
        // Cambiar mensaje basado en progreso
        const messageIndex = Math.floor((newProgress / 100) * (loadingMessages.length - 1))
        setCurrentMessage(messageIndex)
        
        return newProgress
      })
    }, 50)

    return () => clearInterval(interval)
  }, [loadingMessages.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-200"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-400"></div>
      </div>

      {/* Loading content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo animado */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
            <span className="text-4xl">🏔️</span>
          </div>
          <div className="mt-4">
            <h1 className="text-4xl font-bold text-white mb-2">
              Buho Editor
            </h1>
            <p className="text-blue-200 text-lg">
              Editor de Tours Virtuales
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mb-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="w-full h-full bg-white bg-opacity-30 animate-pulse"></div>
            </div>
          </div>
          <div className="text-blue-200 text-sm font-medium">
            {progress}% completado
          </div>
        </div>

        {/* Loading message */}
        <div className="text-white text-center">
          <p className="text-lg font-medium mb-2 animate-fade-in">
            {loadingMessages[currentMessage]}
          </p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Features preview */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          <div className="text-white opacity-60">
            <div className="text-2xl mb-1">📷</div>
            <div className="text-xs">Panoramas 360°</div>
          </div>
          <div className="text-white opacity-80">
            <div className="text-2xl mb-1">🎨</div>
            <div className="text-xs">Dibujo de Rutas</div>
          </div>
          <div className="text-white opacity-60">
            <div className="text-2xl mb-1">🔗</div>
            <div className="text-xs">Hotspots</div>
          </div>
        </div>
      </div>

      <style>{`
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default LoadingScreen