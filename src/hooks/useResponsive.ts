import { useState, useEffect, useCallback } from 'react'

interface BreakpointConfig {
  xs: number  // phones
  sm: number  // tablets
  md: number  // small desktops
  lg: number  // desktops
  xl: number  // large desktops
}

const defaultBreakpoints: BreakpointConfig = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
}

type BreakpointKey = keyof BreakpointConfig

interface UseResponsiveReturn {
  // Current screen info
  width: number
  height: number
  currentBreakpoint: BreakpointKey
  
  // Breakpoint checkers
  isXs: boolean
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
  
  // Responsive utilities
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isSmallScreen: boolean
  canShowSidePanels: boolean
  maxPanelsAllowed: number
  
  // Layout helpers
  getOptimalPanelWidth: () => number
  shouldAutoHidePanels: boolean
  recommendedColumns: number
  
  // Device orientation
  isLandscape: boolean
  isPortrait: boolean
  
  // Touch device detection
  isTouchDevice: boolean
}

export const useResponsive = (
  breakpoints: Partial<BreakpointConfig> = {}
): UseResponsiveReturn => {
  const config = { ...defaultBreakpoints, ...breakpoints }
  
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 720
  })
  
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Update window size
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Initial call
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      )
    }
    
    checkTouchDevice()
  }, [])

  // Get current breakpoint
  const getCurrentBreakpoint = useCallback((width: number): BreakpointKey => {
    if (width >= config.xl) return 'xl'
    if (width >= config.lg) return 'lg'
    if (width >= config.md) return 'md'
    if (width >= config.sm) return 'sm'
    return 'xs'
  }, [config])

  const currentBreakpoint = getCurrentBreakpoint(windowSize.width)

  // Breakpoint booleans
  const isXs = currentBreakpoint === 'xs'
  const isSm = currentBreakpoint === 'sm'
  const isMd = currentBreakpoint === 'md'
  const isLg = currentBreakpoint === 'lg'
  const isXl = currentBreakpoint === 'xl'

  // Device categories
  const isMobile = windowSize.width < config.md
  const isTablet = windowSize.width >= config.md && windowSize.width < config.lg
  const isDesktop = windowSize.width >= config.lg
  const isSmallScreen = windowSize.width < config.lg

  // Orientation
  const isLandscape = windowSize.width > windowSize.height
  const isPortrait = windowSize.width <= windowSize.height

  // Side panels logic
  const canShowSidePanels = windowSize.width >= config.md
  const maxPanelsAllowed = isSmallScreen ? 1 : 2
  const shouldAutoHidePanels = isMobile

  // Optimal panel width based on screen size
  const getOptimalPanelWidth = useCallback((): number => {
    if (windowSize.width < config.sm) {
      return Math.min(280, windowSize.width - 40) // Mobile: casi toda la pantalla
    } else if (windowSize.width < config.md) {
      return 300 // Tablet pequeño
    } else if (windowSize.width < config.lg) {
      return 320 // Tablet grande
    } else if (windowSize.width < config.xl) {
      return 350 // Desktop pequeño
    } else {
      return 400 // Desktop grande
    }
  }, [windowSize.width, config])

  // Recommended columns for grid layouts
  const recommendedColumns = (() => {
    if (isXs) return 1
    if (isSm) return 2
    if (isMd) return 2
    if (isLg) return 3
    return 4 // xl
  })()

  return {
    // Current screen info
    width: windowSize.width,
    height: windowSize.height,
    currentBreakpoint,
    
    // Breakpoint checkers
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    
    // Responsive utilities
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    canShowSidePanels,
    maxPanelsAllowed,
    
    // Layout helpers
    getOptimalPanelWidth,
    shouldAutoHidePanels,
    recommendedColumns,
    
    // Device orientation
    isLandscape,
    isPortrait,
    
    // Touch device detection
    isTouchDevice
  }
}

// Hook for responsive values - allows different values per breakpoint
export const useResponsiveValue = <T>(values: {
  xs?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
  default: T
}): T => {
  const { currentBreakpoint } = useResponsive()
  
  return values[currentBreakpoint] ?? values.default
}

// Hook for responsive classes
export const useResponsiveClasses = (classes: {
  xs?: string
  sm?: string
  md?: string
  lg?: string
  xl?: string
  default?: string
}): string => {
  const { currentBreakpoint } = useResponsive()
  
  const currentClass = classes[currentBreakpoint] || classes.default || ''
  return currentClass
}