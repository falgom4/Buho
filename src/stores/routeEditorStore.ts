import { create } from 'zustand'
import { Route, Position2D } from '../types'

export type DrawTool = 'line' | 'arrow' | 'point' | null
export type EditTool = 'select' | 'move' | 'delete' | null

interface DrawingState {
  // Mode
  isDrawingMode: boolean
  selectedDrawTool: DrawTool
  selectedEditTool: EditTool
  
  // Drawing properties
  strokeColor: string
  strokeWidth: number
  fillColor: string
  
  // Current drawing
  currentRoute: Partial<Route> | null
  currentPoints: Position2D[]
  isDrawing: boolean
  
  // Selection and editing
  selectedRouteId: string | null
  selectedPointIndex: number | null
  showRoutePanel: boolean
  
  // Layer visibility by difficulty
  visibleLayers: Record<string, boolean>
  
  // Actions
  setDrawingMode: (enabled: boolean) => void
  setSelectedDrawTool: (tool: DrawTool) => void
  setSelectedEditTool: (tool: EditTool) => void
  setStrokeColor: (color: string) => void
  setStrokeWidth: (width: number) => void
  setFillColor: (color: string) => void
  
  startDrawing: () => void
  addPoint: (point: Position2D) => void
  finishDrawing: () => void
  cancelDrawing: () => void
  
  selectRoute: (routeId: string | null) => void
  selectPoint: (index: number | null) => void
  setShowRoutePanel: (show: boolean) => void
  
  setLayerVisible: (difficulty: string, visible: boolean) => void
  toggleLayerVisible: (difficulty: string) => void
}

const defaultVisibleLayers = {
  'V0': true,
  'V1': true, 
  'V2': true,
  'V3': true,
  'V4': true,
  'V5': true,
  'V6': true,
  'V7': true,
  'V8': true,
  'V9': true,
  'V10': true
}

export const useRouteEditorStore = create<DrawingState>((set, get) => ({
  // Initial state
  isDrawingMode: false,
  selectedDrawTool: null,
  selectedEditTool: null,
  
  strokeColor: '#FF6B6B',
  strokeWidth: 3,
  fillColor: '#FF6B6B',
  
  currentRoute: null,
  currentPoints: [],
  isDrawing: false,
  
  selectedRouteId: null,
  selectedPointIndex: null,
  showRoutePanel: false,
  
  visibleLayers: { ...defaultVisibleLayers },

  // Mode actions
  setDrawingMode: (enabled) => set({ 
    isDrawingMode: enabled,
    selectedDrawTool: enabled ? 'line' : null,
    selectedEditTool: null 
  }),
  
  setSelectedDrawTool: (tool) => set({ 
    selectedDrawTool: tool,
    selectedEditTool: null,
    isDrawing: false,
    currentPoints: [] 
  }),
  
  setSelectedEditTool: (tool) => set({ 
    selectedEditTool: tool,
    selectedDrawTool: null 
  }),
  
  // Style actions
  setStrokeColor: (color) => set({ strokeColor: color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  setFillColor: (color) => set({ fillColor: color }),
  
  // Drawing actions
  startDrawing: () => {
    const { strokeColor, strokeWidth, selectedDrawTool } = get()
    set({ 
      isDrawing: true,
      currentPoints: [],
      currentRoute: {
        id: `route-${Date.now()}`,
        name: `Ruta ${Date.now()}`,
        difficulty: 'V3',
        color: strokeColor,
        strokeWidth: strokeWidth,
        points: [],
        type: selectedDrawTool === 'line' ? 'route' : 'boulder'
      }
    })
  },
  
  addPoint: (point) => set((state) => ({
    currentPoints: [...state.currentPoints, point]
  })),
  
  finishDrawing: () => {
    const { currentRoute, currentPoints } = get()
    if (currentRoute && currentPoints.length >= 2) {
      // Esta función se completará cuando integremos con tourStore
      set({ 
        isDrawing: false, 
        currentPoints: [], 
        currentRoute: null 
      })
    }
  },
  
  cancelDrawing: () => set({ 
    isDrawing: false, 
    currentPoints: [], 
    currentRoute: null 
  }),
  
  // Selection actions
  selectRoute: (routeId) => set({ 
    selectedRouteId: routeId,
    showRoutePanel: !!routeId,
    selectedPointIndex: null 
  }),
  
  selectPoint: (index) => set({ selectedPointIndex: index }),
  
  setShowRoutePanel: (show) => set({ showRoutePanel: show }),
  
  // Layer actions
  setLayerVisible: (difficulty, visible) => set((state) => ({
    visibleLayers: { ...state.visibleLayers, [difficulty]: visible }
  })),
  
  toggleLayerVisible: (difficulty) => set((state) => ({
    visibleLayers: { 
      ...state.visibleLayers, 
      [difficulty]: !state.visibleLayers[difficulty] 
    }
  }))
}))