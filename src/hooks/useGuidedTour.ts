import { useState, useEffect } from 'react'

interface TourStep {
  id: string
  title: string
  content: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
  action?: () => void
  optional?: boolean
}

interface TourDefinition {
  id: string
  name: string
  description: string
  steps: TourStep[]
  trigger?: 'onMount' | 'manual' | 'firstVisit'
  category: 'basics' | 'advanced' | 'features'
}

const TOURS: TourDefinition[] = [
  {
    id: 'welcome-tour',
    name: 'Bienvenida a Buho Editor',
    description: 'Conoce las funciones básicas del editor',
    category: 'basics',
    trigger: 'firstVisit',
    steps: [
      {
        id: 'welcome',
        title: '¡Bienvenido a Buho Editor!',
        content: 'Te mostraremos las características principales para que puedas crear tours virtuales increíbles.',
        target: 'body',
        position: 'center'
      },
      {
        id: 'header',
        title: 'Barra de navegación',
        content: 'Aquí puedes ver el proyecto actual, cambiar entre modo edición y vista previa, y acceder a tus proyectos.',
        target: 'header',
        position: 'bottom'
      },
      {
        id: 'projects-button',
        title: 'Gestor de proyectos',
        content: 'Haz clic aquí o presiona Ctrl+P para abrir el gestor de proyectos donde puedes crear y organizar tus tours.',
        target: '[title*="proyectos"]',
        position: 'bottom'
      },
      {
        id: 'shortcuts',
        title: 'Atajos de teclado',
        content: 'Buho Editor tiene muchos atajos de teclado para ser más eficiente. Presiona F1 en cualquier momento para verlos.',
        target: 'body',
        position: 'center'
      }
    ]
  },
  {
    id: 'editor-tour',
    name: 'Modo de edición',
    description: 'Aprende a editar y crear contenido',
    category: 'features',
    trigger: 'manual',
    steps: [
      {
        id: 'editor-mode',
        title: 'Modo de edición',
        content: 'En el modo de edición puedes añadir hotspots, dibujar rutas y editar la información de las escenas.',
        target: '[data-mode="edit"]',
        position: 'bottom'
      },
      {
        id: 'toolbar',
        title: 'Barra de herramientas',
        content: 'Usa estas herramientas para añadir hotspots de navegación, información y rutas de escalada.',
        target: '.editor-toolbar',
        position: 'top'
      },
      {
        id: 'hotspot-tools',
        title: 'Herramientas de hotspots',
        content: 'Selecciona una herramienta y haz clic en la panorámica para añadir hotspots interactivos.',
        target: '[data-tool="hotspot"]',
        position: 'bottom',
        action: () => {
          // Focus on hotspot tool
          document.querySelector('[data-tool="hotspot"]')?.classList.add('active')
        }
      },
      {
        id: 'drawing-mode',
        title: 'Modo de dibujo',
        content: 'Presiona D para activar el modo de dibujo y crear rutas de escalada sobre la panorámica.',
        target: '[data-tool="draw"]',
        position: 'top',
        optional: true
      }
    ]
  },
  {
    id: 'preview-tour',
    name: 'Modo de vista previa',
    description: 'Navega y previsualiza tu tour',
    category: 'features',
    trigger: 'manual',
    steps: [
      {
        id: 'preview-mode',
        title: 'Modo de vista previa',
        content: 'En el modo vista previa puedes navegar por tu tour como lo verían los usuarios finales.',
        target: '[data-mode="preview"]',
        position: 'bottom'
      },
      {
        id: 'navigation',
        title: 'Navegación',
        content: 'Usa las flechas del teclado o los controles en pantalla para navegar entre escenas.',
        target: '.navigation-controls',
        position: 'top'
      },
      {
        id: 'hotspots-preview',
        title: 'Hotspots interactivos',
        content: 'Haz clic en los hotspots para obtener información o navegar a otras escenas.',
        target: '.hotspot',
        position: 'top',
        optional: true
      }
    ]
  },
  {
    id: 'panels-tour',
    name: 'Paneles laterales',
    description: 'Descubre los paneles de información y herramientas',
    category: 'features',
    trigger: 'manual',
    steps: [
      {
        id: 'panels-intro',
        title: 'Paneles inteligentes',
        content: 'Los paneles laterales te dan acceso rápido a información y herramientas sin distraerte del contenido principal.',
        target: 'body',
        position: 'center'
      },
      {
        id: 'toggle-panel',
        title: 'Abrir paneles',
        content: 'Presiona Ctrl+\\ para abrir/cerrar el panel derecho, o Ctrl+Shift+\\ para el panel izquierdo.',
        target: 'body',
        position: 'center',
        action: () => {
          // Show panel toggle hint
          console.log('Show panel toggle')
        }
      },
      {
        id: 'panel-content',
        title: 'Contenido del panel',
        content: 'Los paneles muestran información contextual: detalles de escenas, herramientas de edición, y estadísticas.',
        target: '.side-panel',
        position: 'left',
        optional: true
      },
      {
        id: 'panel-pin',
        title: 'Anclar paneles',
        content: 'Puedes anclar los paneles para que permanezcan abiertos, o dejar que se oculten automáticamente.',
        target: '[title*="Anclar"]',
        position: 'bottom',
        optional: true
      }
    ]
  }
]

interface UseGuidedTourReturn {
  // Current tour state
  currentTour: TourDefinition | null
  isActive: boolean
  isAvailable: boolean
  
  // Tour management
  startTour: (tourId: string) => void
  stopTour: () => void
  skipTour: () => void
  completeTour: () => void
  
  // Available tours
  availableTours: TourDefinition[]
  getToursForCategory: (category: 'basics' | 'advanced' | 'features') => TourDefinition[]
  
  // User preferences
  hasCompletedTour: (tourId: string) => boolean
  shouldShowTour: (tourId: string) => boolean
  setTourCompleted: (tourId: string) => void
  disableTour: (tourId: string) => void
  
  // Stats
  completedTours: string[]
  completionRate: number
}

export const useGuidedTour = (): UseGuidedTourReturn => {
  const [currentTour, setCurrentTour] = useState<TourDefinition | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [completedTours, setCompletedTours] = useState<string[]>([])
  const [disabledTours, setDisabledTours] = useState<string[]>([])

  // Load tour preferences from localStorage
  useEffect(() => {
    const completed = JSON.parse(localStorage.getItem('buho-tours-completed') || '[]')
    const disabled = JSON.parse(localStorage.getItem('buho-tours-disabled') || '[]')
    setCompletedTours(completed)
    setDisabledTours(disabled)

    // Auto-start welcome tour on first visit
    const hasVisited = localStorage.getItem('buho-has-visited')
    if (!hasVisited && !completed.includes('welcome-tour')) {
      setTimeout(() => {
        startTour('welcome-tour')
        localStorage.setItem('buho-has-visited', 'true')
      }, 1000)
    }
  }, [])

  const startTour = (tourId: string) => {
    const tour = TOURS.find(t => t.id === tourId)
    if (!tour) return

    setCurrentTour(tour)
    setIsActive(true)
  }

  const stopTour = () => {
    setIsActive(false)
    setCurrentTour(null)
  }

  const skipTour = () => {
    if (currentTour) {
      // Mark as disabled so it doesn't auto-start again
      const newDisabled = [...disabledTours, currentTour.id]
      setDisabledTours(newDisabled)
      localStorage.setItem('buho-tours-disabled', JSON.stringify(newDisabled))
    }
    stopTour()
  }

  const completeTour = () => {
    if (currentTour) {
      const newCompleted = [...completedTours, currentTour.id]
      setCompletedTours(newCompleted)
      localStorage.setItem('buho-tours-completed', JSON.stringify(newCompleted))
    }
    stopTour()
  }

  const hasCompletedTour = (tourId: string): boolean => {
    return completedTours.includes(tourId)
  }

  const shouldShowTour = (tourId: string): boolean => {
    return !hasCompletedTour(tourId) && !disabledTours.includes(tourId)
  }

  const setTourCompleted = (tourId: string) => {
    if (!completedTours.includes(tourId)) {
      const newCompleted = [...completedTours, tourId]
      setCompletedTours(newCompleted)
      localStorage.setItem('buho-tours-completed', JSON.stringify(newCompleted))
    }
  }

  const disableTour = (tourId: string) => {
    if (!disabledTours.includes(tourId)) {
      const newDisabled = [...disabledTours, tourId]
      setDisabledTours(newDisabled)
      localStorage.setItem('buho-tours-disabled', JSON.stringify(newDisabled))
    }
  }

  const getToursForCategory = (category: 'basics' | 'advanced' | 'features'): TourDefinition[] => {
    return TOURS.filter(tour => tour.category === category)
  }

  const completionRate = Math.round((completedTours.length / TOURS.length) * 100)

  const isAvailable = currentTour !== null

  return {
    // Current tour state
    currentTour,
    isActive,
    isAvailable,
    
    // Tour management
    startTour,
    stopTour,
    skipTour,
    completeTour,
    
    // Available tours
    availableTours: TOURS,
    getToursForCategory,
    
    // User preferences
    hasCompletedTour,
    shouldShowTour,
    setTourCompleted,
    disableTour,
    
    // Stats
    completedTours,
    completionRate
  }
}