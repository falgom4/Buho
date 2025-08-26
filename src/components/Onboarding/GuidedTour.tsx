import React, { useState, useEffect, useCallback } from 'react'
import { useResponsive } from '../../hooks/useResponsive'

interface TourStep {
  id: string
  title: string
  content: string
  target: string // CSS selector o ID del elemento
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
  action?: () => void
  optional?: boolean
}

interface GuidedTourProps {
  isActive: boolean
  onComplete: () => void
  onSkip: () => void
  steps: TourStep[]
  tourId: string
}

const GuidedTour: React.FC<GuidedTourProps> = ({
  isActive,
  onComplete,
  onSkip,
  steps,
  tourId
}) => {
  const { isMobile } = useResponsive()
  const [currentStep, setCurrentStep] = useState(0)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Update target element and position when step changes
  useEffect(() => {
    if (!isActive || currentStep >= steps.length) return

    const step = steps[currentStep]
    const element = document.querySelector(step.target) as HTMLElement
    
    if (element) {
      setTargetElement(element)
      
      // Calculate tooltip position
      const rect = element.getBoundingClientRect()
      let x = rect.left + rect.width / 2
      let y = rect.top
      
      switch (step.position) {
        case 'bottom':
          y = rect.bottom + 10
          break
        case 'top':
          y = rect.top - 10
          break
        case 'left':
          x = rect.left - 10
          y = rect.top + rect.height / 2
          break
        case 'right':
          x = rect.right + 10
          y = rect.top + rect.height / 2
          break
        case 'center':
          x = window.innerWidth / 2
          y = window.innerHeight / 2
          break
      }
      
      setTooltipPosition({ x, y })
      
      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      
      // Add highlight class
      element.classList.add('tour-highlight')
    }
  }, [currentStep, isActive, steps])

  // Cleanup highlight when tour ends
  useEffect(() => {
    return () => {
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight')
      })
    }
  }, [])

  const nextStep = useCallback(() => {
    const step = steps[currentStep]
    
    // Execute step action if exists
    if (step.action) {
      step.action()
    }
    
    // Remove highlight from current element
    if (targetElement) {
      targetElement.classList.remove('tour-highlight')
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }, [currentStep, steps, targetElement, onComplete])

  const prevStep = useCallback(() => {
    if (targetElement) {
      targetElement.classList.remove('tour-highlight')
    }
    
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep, targetElement])

  const skipTour = useCallback(() => {
    if (targetElement) {
      targetElement.classList.remove('tour-highlight')
    }
    onSkip()
  }, [targetElement, onSkip])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isActive) return

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'Enter':
        case ' ':
          e.preventDefault()
          nextStep()
          break
        case 'ArrowLeft':
          e.preventDefault()
          prevStep()
          break
        case 'Escape':
          e.preventDefault()
          skipTour()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isActive, nextStep, prevStep, skipTour])

  if (!isActive || currentStep >= steps.length) {
    return null
  }

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <>
      {/* Dark overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-40"
        onClick={skipTour}
      />
      
      {/* Tour tooltip */}
      <div
        className={`fixed z-50 ${
          step.position === 'center' ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : ''
        }`}
        style={
          step.position !== 'center' ? {
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: step.position === 'top' || step.position === 'bottom' 
              ? 'translateX(-50%)' 
              : step.position === 'left' || step.position === 'right'
              ? 'translateY(-50%)'
              : 'none'
          } : {}
        }
      >
        <div className={`bg-white rounded-xl shadow-2xl border border-gray-200 ${
          isMobile ? 'max-w-sm mx-4' : 'max-w-md'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🏔️</span>
              </div>
              <div>
                <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-sm' : ''}`}>
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500">
                  Paso {currentStep + 1} de {steps.length}
                </p>
              </div>
            </div>
            
            <button
              onClick={skipTour}
              className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className={`text-gray-700 mb-4 ${isMobile ? 'text-sm' : ''}`}>
              {step.content}
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Anterior
                </button>
                
                {step.optional && (
                  <button
                    onClick={skipTour}
                    className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                  >
                    Omitir paso
                  </button>
                )}
              </div>

              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
              >
                {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                {currentStep !== steps.length - 1 && <span>→</span>}
              </button>
            </div>
          </div>

          {/* Keyboard shortcuts hint */}
          {!isMobile && (
            <div className="px-4 pb-4 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-1 bg-gray-100 rounded text-xs">←</kbd>
                  <span>Anterior</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-1 bg-gray-100 rounded text-xs">→</kbd>
                  <span>Siguiente</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-1 bg-gray-100 rounded text-xs">Esc</kbd>
                  <span>Salir</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Arrow pointer */}
        {step.position !== 'center' && (
          <div className={`absolute w-0 h-0 ${
            step.position === 'top' ? 'top-full left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-transparent border-t-white' :
            step.position === 'bottom' ? 'bottom-full left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-transparent border-b-white' :
            step.position === 'left' ? 'left-full top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-transparent border-l-white' :
            step.position === 'right' ? 'right-full top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-transparent border-r-white' :
            ''
          }`} />
        )}
      </div>

      {/* Global styles for tour highlighting */}
      <style>{`
        .tour-highlight {
          position: relative;
          z-index: 45;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3) !important;
          border-radius: 8px;
        }
        
        .tour-highlight::after {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border: 2px solid #3B82F6;
          border-radius: 12px;
          pointer-events: none;
          animation: tourPulse 2s infinite;
        }
        
        @keyframes tourPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.02);
          }
        }
      `}</style>
    </>
  )
}

export default GuidedTour