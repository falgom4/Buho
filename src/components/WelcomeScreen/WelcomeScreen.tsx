import React, { useState, useEffect } from 'react'

interface WelcomeScreenProps {
  onGetStarted: () => void
  onSkip: () => void
}

interface FeatureStep {
  id: string
  title: string
  description: string
  icon: string
  image: string
  tips: string[]
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const features: FeatureStep[] = [
    {
      id: 'projects',
      title: 'Gestiona tus Proyectos',
      description: 'Organiza múltiples tours virtuales de escalada con categorías, dificultades y metadatos.',
      icon: '📁',
      image: 'placeholder-projects.svg',
      tips: [
        'Categoriza por tipo: Boulder, Deportiva, Tradicional',
        'Filtra y busca proyectos fácilmente',
        'Exporta e importa proyectos'
      ]
    },
    {
      id: 'scenes',
      title: 'Crea Escenas Inmersivas',
      description: 'Sube imágenes panorámicas 360° y crea escenas navegables con hotspots interactivos.',
      icon: '🏔️',
      image: 'placeholder-scenes.svg',
      tips: [
        'Arrastra y suelta imágenes panorámicas',
        'Reordena escenas fácilmente',
        'Optimización automática de imágenes'
      ]
    },
    {
      id: 'routes',
      title: 'Dibuja Rutas de Escalada',
      description: 'Herramientas precisas para trazar rutas sobre las imágenes con colores por dificultad.',
      icon: '🎨',
      image: 'placeholder-routes.svg',
      tips: [
        'Líneas, flechas y puntos de referencia',
        'Colores automáticos por grado V0-V12',
        'Capas organizadas por dificultad'
      ]
    },
    {
      id: 'hotspots',
      title: 'Agrega Interactividad',
      description: 'Crea puntos de navegación e información para guiar a los usuarios por el tour.',
      icon: '🔗',
      image: 'placeholder-hotspots.svg',
      tips: [
        'Hotspots de navegación entre escenas',
        'Información detallada de rutas',
        'Colocación visual intuitiva'
      ]
    },
    {
      id: 'preview',
      title: 'Previsualiza y Publica',
      description: 'Valida tu tour, previsualizalo en pantalla completa y expórtalo para aplicaciones móviles.',
      icon: '🚀',
      image: 'placeholder-preview.svg',
      tips: [
        'Validación automática de errores',
        'Preview inmersivo en pantalla completa',
        'Exportación para Expo/React Native'
      ]
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentStep < features.length - 1) {
        handleNextStep()
      }
    }, 8000) // Auto-avance cada 8 segundos

    return () => clearInterval(timer)
  }, [currentStep, features.length])

  const handleNextStep = () => {
    if (currentStep < features.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleStepClick = (index: number) => {
    if (index !== currentStep) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(index)
        setIsAnimating(false)
      }, 300)
    }
  }

  const currentFeature = features[currentStep]
  const progress = ((currentStep + 1) / features.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        ></div>
      </div>

      {/* Skip button */}
      <button
        onClick={onSkip}
        className="absolute top-6 right-6 z-20 text-white text-sm hover:text-blue-300 transition-colors"
      >
        Saltar introducción →
      </button>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-white">
            {/* Logo y título principal */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-3xl">🏔️</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Buho Editor</h1>
                  <p className="text-blue-200">Tours Virtuales de Escalada</p>
                </div>
              </div>
              
              <div className="text-lg text-blue-100 leading-relaxed">
                Crea experiencias inmersivas de escalada con panoramas 360°, 
                rutas trazadas y navegación interactiva.
              </div>
            </div>

            {/* Feature actual */}
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100'}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{currentFeature.icon}</span>
                <h2 className="text-2xl font-bold">{currentFeature.title}</h2>
              </div>
              
              <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                {currentFeature.description}
              </p>

              {/* Tips */}
              <div className="space-y-2 mb-8">
                {currentFeature.tips.map((tip, index) => (
                  <div key={index} className="flex items-center gap-3 text-blue-200">
                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                    <span className="text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className="p-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ← Anterior
                </button>
                
                <div className="flex items-center gap-2">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleStepClick(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentStep
                          ? 'bg-blue-400'
                          : index < currentStep
                          ? 'bg-blue-600'
                          : 'bg-white bg-opacity-30 hover:bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={handleNextStep}
                  disabled={currentStep === features.length - 1}
                  className="p-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Siguiente →
                </button>
              </div>

              {/* Progress */}
              <div className="text-sm text-blue-300">
                {currentStep + 1} de {features.length}
              </div>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative">
            <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 scale-100'}`}>
              {/* Mockup container */}
              <div className="relative bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl overflow-hidden">
                {/* Browser bar mockup */}
                <div className="bg-gray-200 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded px-3 py-1 ml-4">
                    <div className="text-xs text-gray-500">buho-editor.app</div>
                  </div>
                </div>

                {/* Content mockup */}
                <div className="p-8 h-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{currentFeature.icon}</div>
                    <div className="text-lg font-semibold text-gray-800 mb-2">
                      {currentFeature.title}
                    </div>
                    <div className="text-sm text-gray-600 max-w-xs">
                      {currentFeature.description}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-500"
                     style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 bg-opacity-20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500 bg-opacity-20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Bottom action */}
        <div className="text-center mt-12">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl"
          >
            <span className="text-lg">🚀</span>
            <span className="font-semibold">Comenzar a Crear</span>
          </button>
          
          <p className="text-blue-200 text-sm mt-4">
            ¿Ya conoces Buho Editor? <button onClick={onSkip} className="text-blue-300 hover:text-white underline">Saltar introducción</button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen