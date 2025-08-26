import React from 'react'
import { useResponsive } from '../../hooks/useResponsive'

interface ResponsiveWrapperProps {
  children: React.ReactNode
  className?: string
  
  // Grid configuration
  gridCols?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  
  // Gap configuration
  gap?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    default?: number
  }
  
  // Padding configuration
  padding?: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
    default?: string
  }
  
  // Show/hide at specific breakpoints
  showOnly?: ('xs' | 'sm' | 'md' | 'lg' | 'xl')[]
  hideOnly?: ('xs' | 'sm' | 'md' | 'lg' | 'xl')[]
  
  // Mobile-first responsive behavior
  mobileFirst?: boolean
}

const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  className = '',
  gridCols,
  gap,
  padding,
  showOnly,
  hideOnly,
  mobileFirst = true
}) => {
  const { currentBreakpoint, recommendedColumns } = useResponsive()

  // Determine if component should be visible
  const shouldShow = (() => {
    if (showOnly && !showOnly.includes(currentBreakpoint)) return false
    if (hideOnly && hideOnly.includes(currentBreakpoint)) return false
    return true
  })()

  // Get responsive grid columns
  const getGridCols = () => {
    if (!gridCols) return recommendedColumns
    return gridCols[currentBreakpoint] ?? gridCols.xl ?? gridCols.lg ?? gridCols.md ?? gridCols.sm ?? gridCols.xs ?? recommendedColumns
  }

  // Get responsive gap
  const getGap = () => {
    if (!gap) return 4
    return gap[currentBreakpoint] ?? gap.default ?? 4
  }

  // Get responsive padding
  const getPadding = () => {
    if (!padding) return 'p-4'
    return padding[currentBreakpoint] ?? padding.default ?? 'p-4'
  }

  if (!shouldShow) return null

  const cols = getGridCols()
  const gapSize = getGap()
  const paddingClass = getPadding()

  // Generate grid classes
  const gridClass = `grid grid-cols-${cols} gap-${gapSize}`

  return (
    <div className={`${gridClass} ${paddingClass} ${className}`}>
      {children}
    </div>
  )
}

// Responsive Text Component
interface ResponsiveTextProps {
  children: React.ReactNode
  size?: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
    default?: string
  }
  weight?: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
    default?: string
  }
  className?: string
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  size,
  weight,
  className = ''
}) => {
  const { currentBreakpoint } = useResponsive()

  const getTextSize = () => {
    if (!size) return 'text-base'
    return size[currentBreakpoint] ?? size.default ?? 'text-base'
  }

  const getTextWeight = () => {
    if (!weight) return 'font-normal'
    return weight[currentBreakpoint] ?? weight.default ?? 'font-normal'
  }

  const sizeClass = getTextSize()
  const weightClass = getTextWeight()

  return (
    <span className={`${sizeClass} ${weightClass} ${className}`}>
      {children}
    </span>
  )
}

// Responsive Container
interface ResponsiveContainerProps {
  children: React.ReactNode
  maxWidth?: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
    default?: string
  }
  className?: string
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth,
  className = ''
}) => {
  const { currentBreakpoint } = useResponsive()

  const getMaxWidth = () => {
    if (!maxWidth) return 'max-w-7xl'
    return maxWidth[currentBreakpoint] ?? maxWidth.default ?? 'max-w-7xl'
  }

  const maxWidthClass = getMaxWidth()

  return (
    <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

// Responsive Stack (Flex direction changes based on screen size)
interface ResponsiveStackProps {
  children: React.ReactNode
  direction?: {
    xs?: 'row' | 'col'
    sm?: 'row' | 'col'
    md?: 'row' | 'col'
    lg?: 'row' | 'col'
    xl?: 'row' | 'col'
    default?: 'row' | 'col'
  }
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  gap?: number
  className?: string
}

export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  direction,
  align = 'start',
  justify = 'start',
  gap = 4,
  className = ''
}) => {
  const { currentBreakpoint } = useResponsive()

  const getDirection = () => {
    if (!direction) return 'flex-col'
    const dir = direction[currentBreakpoint] ?? direction.default ?? 'col'
    return `flex-${dir}`
  }

  const getAlignClass = () => {
    switch (align) {
      case 'center': return 'items-center'
      case 'end': return 'items-end'
      case 'stretch': return 'items-stretch'
      default: return 'items-start'
    }
  }

  const getJustifyClass = () => {
    switch (justify) {
      case 'center': return 'justify-center'
      case 'end': return 'justify-end'
      case 'between': return 'justify-between'
      case 'around': return 'justify-around'
      default: return 'justify-start'
    }
  }

  const directionClass = getDirection()
  const alignClass = getAlignClass()
  const justifyClass = getJustifyClass()
  const gapClass = `gap-${gap}`

  return (
    <div className={`flex ${directionClass} ${alignClass} ${justifyClass} ${gapClass} ${className}`}>
      {children}
    </div>
  )
}

export default ResponsiveWrapper