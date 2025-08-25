import { create } from 'zustand'
import { Scene, Tour } from '../types'

interface TourState {
  currentTour: Tour | null
  currentSceneId: string | null
  scenes: Scene[]
  loading: boolean
  
  // Actions
  setCurrentTour: (tour: Tour) => void
  setCurrentScene: (sceneId: string) => void
  addScene: (scene: Scene) => void
  removeScene: (sceneId: string) => void
  updateScene: (sceneId: string, updates: Partial<Scene>) => void
  navigateToScene: (sceneId: string) => void
}

// Datos de ejemplo para desarrollo
const sampleScenes: Scene[] = [
  {
    id: 'scene-001',
    name: 'Boulder Principal',
    panoramaUrl: '/placeholder-panorama.svg',
    hotspots: [
      {
        id: 'hotspot-001',
        type: 'navigation',
        position: { x: 0.5, y: 0.2, z: 0.8 },
        title: 'Ir a Vista Lateral',
        target: 'scene-002',
        icon: 'arrow'
      }
    ],
    routes: []
  },
  {
    id: 'scene-002',
    name: 'Vista Lateral',
    panoramaUrl: '/placeholder-panorama.svg',
    hotspots: [
      {
        id: 'hotspot-002',
        type: 'navigation',
        position: { x: -0.5, y: 0.2, z: 0.8 },
        title: 'Volver al Boulder Principal',
        target: 'scene-001',
        icon: 'arrow'
      },
      {
        id: 'hotspot-003',
        type: 'info',
        position: { x: 0, y: 0.3, z: 0.9 },
        title: 'Información de Rutas',
        content: 'Grados disponibles: V2-V8',
        icon: 'info'
      }
    ],
    routes: []
  }
]

const sampleTour: Tour = {
  id: 'tour-demo',
  title: 'Demo Tour - Boulder El Mirador',
  description: 'Tour de ejemplo con rutas de boulder',
  scenes: sampleScenes,
  created: '2025-08-25',
  version: '1.0'
}

export const useTourStore = create<TourState>((set, get) => ({
  currentTour: sampleTour,
  currentSceneId: 'scene-001',
  scenes: sampleScenes,
  loading: false,

  setCurrentTour: (tour) => set({ 
    currentTour: tour, 
    scenes: tour.scenes,
    currentSceneId: tour.scenes[0]?.id || null 
  }),

  setCurrentScene: (sceneId) => set({ currentSceneId: sceneId }),

  addScene: (scene) => set((state) => ({
    scenes: [...state.scenes, scene]
  })),

  removeScene: (sceneId) => set((state) => ({
    scenes: state.scenes.filter(scene => scene.id !== sceneId),
    currentSceneId: state.currentSceneId === sceneId 
      ? state.scenes[0]?.id || null 
      : state.currentSceneId
  })),

  updateScene: (sceneId, updates) => set((state) => ({
    scenes: state.scenes.map(scene => 
      scene.id === sceneId ? { ...scene, ...updates } : scene
    )
  })),

  navigateToScene: (sceneId) => {
    const { scenes } = get()
    const targetScene = scenes.find(scene => scene.id === sceneId)
    
    if (targetScene) {
      set({ currentSceneId: sceneId, loading: true })
      
      // Simular carga de escena
      setTimeout(() => {
        set({ loading: false })
      }, 500)
    }
  }
}))

// Selector helpers
export const useCurrentScene = () => {
  const { scenes, currentSceneId } = useTourStore()
  return scenes.find(scene => scene.id === currentSceneId) || null
}

export const useSceneNavigation = () => {
  const { navigateToScene, currentSceneId, scenes } = useTourStore()
  
  const canNavigateNext = () => {
    const currentIndex = scenes.findIndex(scene => scene.id === currentSceneId)
    return currentIndex < scenes.length - 1
  }
  
  const canNavigatePrev = () => {
    const currentIndex = scenes.findIndex(scene => scene.id === currentSceneId)
    return currentIndex > 0
  }
  
  const navigateNext = () => {
    const currentIndex = scenes.findIndex(scene => scene.id === currentSceneId)
    if (currentIndex < scenes.length - 1) {
      navigateToScene(scenes[currentIndex + 1].id)
    }
  }
  
  const navigatePrev = () => {
    const currentIndex = scenes.findIndex(scene => scene.id === currentSceneId)
    if (currentIndex > 0) {
      navigateToScene(scenes[currentIndex - 1].id)
    }
  }
  
  return {
    navigateToScene,
    navigateNext,
    navigatePrev,
    canNavigateNext: canNavigateNext(),
    canNavigatePrev: canNavigatePrev()
  }
}