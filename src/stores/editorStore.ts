import { create } from 'zustand'

export type EditorMode = 'preview' | 'edit'
export type HotspotTool = 'navigation' | 'info' | 'route' | null

interface EditorState {
  mode: EditorMode
  selectedTool: HotspotTool
  selectedHotspotId: string | null
  isPlacingHotspot: boolean
  showHotspotPanel: boolean
  
  // Actions
  setMode: (mode: EditorMode) => void
  setSelectedTool: (tool: HotspotTool) => void
  setSelectedHotspot: (hotspotId: string | null) => void
  setIsPlacingHotspot: (placing: boolean) => void
  setShowHotspotPanel: (show: boolean) => void
  startPlacingHotspot: (tool: HotspotTool) => void
  cancelPlacingHotspot: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  mode: 'preview',
  selectedTool: null,
  selectedHotspotId: null,
  isPlacingHotspot: false,
  showHotspotPanel: false,

  setMode: (mode) => set({ mode }),
  
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  
  setSelectedHotspot: (hotspotId) => set({ 
    selectedHotspotId: hotspotId,
    showHotspotPanel: !!hotspotId 
  }),
  
  setIsPlacingHotspot: (placing) => set({ isPlacingHotspot: placing }),
  
  setShowHotspotPanel: (show) => set({ showHotspotPanel: show }),
  
  startPlacingHotspot: (tool) => set({ 
    selectedTool: tool,
    isPlacingHotspot: true,
    selectedHotspotId: null,
    showHotspotPanel: false 
  }),
  
  cancelPlacingHotspot: () => set({ 
    isPlacingHotspot: false,
    selectedTool: null 
  })
}))