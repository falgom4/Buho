import { useState, useCallback, useEffect } from 'react'

interface SidePanelState {
  left: {
    isOpen: boolean
    width: number
    isPinned: boolean
  }
  right: {
    isOpen: boolean
    width: number
    isPinned: boolean
  }
}

const STORAGE_KEY = 'buho-side-panels'

const defaultState: SidePanelState = {
  left: {
    isOpen: false,
    width: 320,
    isPinned: false
  },
  right: {
    isOpen: false,
    width: 320,
    isPinned: false
  }
}

export const useSidePanels = () => {
  const [panels, setPanels] = useState<SidePanelState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState
    } catch {
      return defaultState
    }
  })

  // Persistir cambios en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(panels))
    } catch (error) {
      console.warn('Failed to save side panels state:', error)
    }
  }, [panels])

  // Toggle panel
  const togglePanel = useCallback((side: 'left' | 'right') => {
    setPanels(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        isOpen: !prev[side].isOpen
      }
    }))
  }, [])

  // Open panel
  const openPanel = useCallback((side: 'left' | 'right') => {
    setPanels(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        isOpen: true
      }
    }))
  }, [])

  // Close panel
  const closePanel = useCallback((side: 'left' | 'right') => {
    setPanels(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        isOpen: false
      }
    }))
  }, [])

  // Close all panels
  const closeAllPanels = useCallback(() => {
    setPanels(prev => ({
      left: { ...prev.left, isOpen: false },
      right: { ...prev.right, isOpen: false }
    }))
  }, [])

  // Pin/unpin panel
  const togglePin = useCallback((side: 'left' | 'right') => {
    setPanels(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        isPinned: !prev[side].isPinned
      }
    }))
  }, [])

  // Set panel width
  const setPanelWidth = useCallback((side: 'left' | 'right', width: number) => {
    setPanels(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        width: Math.max(200, Math.min(600, width)) // Limitar entre 200px y 600px
      }
    }))
  }, [])

  // Get responsive behavior
  const getResponsiveBehavior = useCallback(() => {
    const isSmall = window.innerWidth < 768
    const isMedium = window.innerWidth < 1024
    
    return {
      isSmall,
      isMedium,
      shouldAutoHide: isSmall,
      maxPanels: isSmall ? 1 : 2,
      defaultWidth: isSmall ? Math.min(280, window.innerWidth - 40) : 320
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + \ para toggle panel derecho
      if (event.ctrlKey && event.key === '\\') {
        event.preventDefault()
        togglePanel('right')
      }
      
      // Ctrl + Shift + \ para toggle panel izquierdo
      if (event.ctrlKey && event.shiftKey && event.key === '\\') {
        event.preventDefault()
        togglePanel('left')
      }
      
      // Escape para cerrar todos los paneles
      if (event.key === 'Escape' && (panels.left.isOpen || panels.right.isOpen)) {
        event.preventDefault()
        closeAllPanels()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePanel, closeAllPanels, panels.left.isOpen, panels.right.isOpen])

  // Responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      const behavior = getResponsiveBehavior()
      
      if (behavior.isSmall && panels.left.isOpen && panels.right.isOpen) {
        // En pantallas pequeñas, solo mantener el panel derecho abierto
        closePanel('left')
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [panels.left.isOpen, panels.right.isOpen, getResponsiveBehavior, closePanel])

  return {
    panels,
    togglePanel,
    openPanel,
    closePanel,
    closeAllPanels,
    togglePin,
    setPanelWidth,
    getResponsiveBehavior,
    
    // Computed properties
    hasOpenPanels: panels.left.isOpen || panels.right.isOpen,
    contentMargin: {
      left: panels.left.isOpen && panels.left.isPinned ? panels.left.width : 0,
      right: panels.right.isOpen && panels.right.isPinned ? panels.right.width : 0
    }
  }
}