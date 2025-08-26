import { useEffect, useCallback, useRef } from 'react'
import { useEditorStore } from '../stores/editorStore'
import { useRouteEditorStore } from '../stores/routeEditorStore'
import { useTourStore, useSceneNavigation } from '../stores/tourStore'
import { useProjectStore } from '../stores/projectStore'

interface ShortcutConfig {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  description: string
  category: string
  handler: () => void
  enabled?: () => boolean
  preventDefault?: boolean
}

export const useKeyboardShortcuts = (options: {
  onOpenProjects?: () => void
  onToggleLeftPanel?: () => void
  onToggleRightPanel?: () => void
  onOpenValidator?: () => void
  onOpenPreview?: () => void
}) => {
  const { mode, setMode, selectedTool, startPlacingHotspot, cancelPlacingHotspot } = useEditorStore()
  const { 
    isDrawingMode, 
    setDrawingMode, 
    selectedDrawTool, 
    setSelectedDrawTool,
    cancelDrawing,
    undo,
    redo,
    clearCanvas
  } = useRouteEditorStore()
  const { navigateNext, navigatePrev, canNavigateNext, canNavigatePrev } = useSceneNavigation()
  const { currentProject } = useProjectStore()
  const { currentTour } = useTourStore()

  const isInputFocused = useRef(false)

  // Tracking input focus to prevent shortcuts when typing
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      isInputFocused.current = target.tagName === 'INPUT' || 
                               target.tagName === 'TEXTAREA' || 
                               target.isContentEditable ||
                               target.closest('[data-no-shortcuts]') !== null
    }

    const handleFocusOut = () => {
      isInputFocused.current = false
    }

    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)

    return () => {
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
    }
  }, [])

  const shortcuts: ShortcutConfig[] = [
    // Navigation and Views
    {
      key: 'p',
      ctrlKey: true,
      description: 'Abrir gestor de proyectos',
      category: 'Navegación',
      handler: () => options.onOpenProjects?.(),
      enabled: () => !!options.onOpenProjects
    },
    {
      key: '\\',
      ctrlKey: true,
      description: 'Toggle panel derecho',
      category: 'Interfaz',
      handler: () => options.onToggleRightPanel?.(),
      enabled: () => !!options.onToggleRightPanel
    },
    {
      key: '\\',
      ctrlKey: true,
      shiftKey: true,
      description: 'Toggle panel izquierdo',
      category: 'Interfaz',
      handler: () => options.onToggleLeftPanel?.(),
      enabled: () => !!options.onToggleLeftPanel
    },
    {
      key: ' ',
      description: 'Toggle modo preview/edit',
      category: 'Navegación',
      handler: () => setMode(mode === 'preview' ? 'edit' : 'preview'),
      enabled: () => !!currentProject && !!currentTour,
      preventDefault: true
    },
    {
      key: 'F11',
      description: 'Preview pantalla completa',
      category: 'Vista',
      handler: () => options.onOpenPreview?.(),
      enabled: () => !!options.onOpenPreview && mode === 'preview'
    },

    // Scene Navigation
    {
      key: 'ArrowLeft',
      description: 'Escena anterior',
      category: 'Navegación',
      handler: () => navigatePrev(),
      enabled: () => canNavigatePrev && mode === 'preview'
    },
    {
      key: 'ArrowRight',
      description: 'Siguiente escena',
      category: 'Navegación',
      handler: () => navigateNext(),
      enabled: () => canNavigateNext && mode === 'preview'
    },
    {
      key: 'Home',
      description: 'Primera escena',
      category: 'Navegación',
      handler: () => {
        if (currentTour?.scenes.length) {
          // Navigate to first scene
          console.log('Navigate to first scene')
        }
      },
      enabled: () => !!currentTour?.scenes.length && mode === 'preview'
    },
    {
      key: 'End',
      description: 'Última escena',
      category: 'Navegación',
      handler: () => {
        if (currentTour?.scenes.length) {
          // Navigate to last scene
          console.log('Navigate to last scene')
        }
      },
      enabled: () => !!currentTour?.scenes.length && mode === 'preview'
    },

    // Editor Tools
    {
      key: 'h',
      description: 'Herramienta hotspot navegación',
      category: 'Edición',
      handler: () => startPlacingHotspot('navigation'),
      enabled: () => mode === 'edit'
    },
    {
      key: 'i',
      description: 'Herramienta hotspot información',
      category: 'Edición',
      handler: () => startPlacingHotspot('info'),
      enabled: () => mode === 'edit'
    },
    {
      key: 'r',
      description: 'Herramienta hotspot ruta',
      category: 'Edición',
      handler: () => startPlacingHotspot('route'),
      enabled: () => mode === 'edit'
    },
    {
      key: 'Escape',
      description: 'Cancelar acción actual',
      category: 'Edición',
      handler: () => {
        if (isDrawingMode) {
          cancelDrawing()
        } else {
          cancelPlacingHotspot()
        }
      },
      enabled: () => mode === 'edit'
    },

    // Drawing Tools
    {
      key: 'd',
      description: 'Toggle modo dibujo',
      category: 'Dibujo',
      handler: () => setDrawingMode(!isDrawingMode),
      enabled: () => mode === 'edit'
    },
    {
      key: 'l',
      description: 'Herramienta línea',
      category: 'Dibujo',
      handler: () => {
        if (!isDrawingMode) setDrawingMode(true)
        setSelectedDrawTool('line')
      },
      enabled: () => mode === 'edit'
    },
    {
      key: 'a',
      description: 'Herramienta flecha',
      category: 'Dibujo',
      handler: () => {
        if (!isDrawingMode) setDrawingMode(true)
        setSelectedDrawTool('arrow')
      },
      enabled: () => mode === 'edit'
    },
    {
      key: 'o',
      description: 'Herramienta punto',
      category: 'Dibujo',
      handler: () => {
        if (!isDrawingMode) setDrawingMode(true)
        setSelectedDrawTool('point')
      },
      enabled: () => mode === 'edit'
    },

    // Drawing Actions
    {
      key: 'z',
      ctrlKey: true,
      description: 'Deshacer dibujo',
      category: 'Dibujo',
      handler: () => undo(),
      enabled: () => isDrawingMode
    },
    {
      key: 'y',
      ctrlKey: true,
      description: 'Rehacer dibujo',
      category: 'Dibujo',
      handler: () => redo(),
      enabled: () => isDrawingMode
    },
    {
      key: 'z',
      ctrlKey: true,
      shiftKey: true,
      description: 'Rehacer dibujo',
      category: 'Dibujo',
      handler: () => redo(),
      enabled: () => isDrawingMode
    },
    {
      key: 'Delete',
      description: 'Limpiar canvas',
      category: 'Dibujo',
      handler: () => {
        if (confirm('¿Limpiar todos los dibujos de la escena actual?')) {
          clearCanvas()
        }
      },
      enabled: () => isDrawingMode
    },

    // Validation and Export
    {
      key: 'F5',
      description: 'Validar tour',
      category: 'Herramientas',
      handler: () => options.onOpenValidator?.(),
      enabled: () => !!options.onOpenValidator,
      preventDefault: true
    },

    // Quick Numbers for Scene Navigation
    ...Array.from({ length: 9 }, (_, i) => ({
      key: (i + 1).toString(),
      description: `Ir a escena ${i + 1}`,
      category: 'Navegación',
      handler: () => {
        if (currentTour?.scenes[i]) {
          // Navigate to specific scene
          console.log(`Navigate to scene ${i + 1}`)
        }
      },
      enabled: () => !!currentTour?.scenes[i] && mode === 'preview'
    }))
  ]

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't handle shortcuts when user is typing
    if (isInputFocused.current) return

    const activeShortcuts = shortcuts.filter(shortcut => {
      if (shortcut.enabled && !shortcut.enabled()) return false
      
      return (
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        !!shortcut.ctrlKey === event.ctrlKey &&
        !!shortcut.shiftKey === event.shiftKey &&
        !!shortcut.altKey === event.altKey &&
        !!shortcut.metaKey === event.metaKey
      )
    })

    if (activeShortcuts.length > 0) {
      const shortcut = activeShortcuts[0] // Take first match
      if (shortcut.preventDefault !== false) {
        event.preventDefault()
      }
      shortcut.handler()
    }
  }, [shortcuts])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Helper function to get shortcuts by category
  const getShortcutsByCategory = useCallback(() => {
    const categories: { [key: string]: ShortcutConfig[] } = {}
    
    shortcuts.forEach(shortcut => {
      if (!shortcut.enabled || shortcut.enabled()) {
        if (!categories[shortcut.category]) {
          categories[shortcut.category] = []
        }
        categories[shortcut.category].push(shortcut)
      }
    })
    
    return categories
  }, [shortcuts])

  // Helper function to format shortcut display
  const formatShortcut = useCallback((shortcut: ShortcutConfig) => {
    const keys: string[] = []
    
    if (shortcut.ctrlKey) keys.push('Ctrl')
    if (shortcut.shiftKey) keys.push('Shift')
    if (shortcut.altKey) keys.push('Alt')
    if (shortcut.metaKey) keys.push('Cmd')
    
    // Format special keys
    let keyName = shortcut.key
    switch (keyName.toLowerCase()) {
      case ' ':
        keyName = 'Space'
        break
      case 'arrowleft':
        keyName = '←'
        break
      case 'arrowright':
        keyName = '→'
        break
      case 'arrowup':
        keyName = '↑'
        break
      case 'arrowdown':
        keyName = '↓'
        break
      case 'escape':
        keyName = 'Esc'
        break
      case 'delete':
        keyName = 'Del'
        break
      case '\\':
        keyName = '\\'
        break
      default:
        keyName = keyName.toUpperCase()
    }
    
    keys.push(keyName)
    return keys.join(' + ')
  }, [])

  return {
    shortcuts,
    getShortcutsByCategory,
    formatShortcut,
    isInputFocused: isInputFocused.current
  }
}