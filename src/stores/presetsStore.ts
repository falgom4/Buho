import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ClimbingPreset {
  id: string
  name: string
  description: string
  category: 'boulder' | 'sport' | 'trad' | 'mixed'
  icon: string
  color: string
  difficultyRange: {
    min: string
    max: string
  }
  routeColors: {
    [grade: string]: string
  }
  equipment: string[]
  tags: string[]
  metadata: {
    author: string
    created: string
    version: string
    isDefault: boolean
    downloadCount?: number
  }
}

interface PresetsState {
  presets: ClimbingPreset[]
  selectedPresetId: string | null
  isLoading: boolean
  
  // Actions
  getPresets: () => ClimbingPreset[]
  getPresetById: (id: string) => ClimbingPreset | undefined
  getPresetsByCategory: (category: string) => ClimbingPreset[]
  setSelectedPreset: (presetId: string | null) => void
  createPreset: (preset: Omit<ClimbingPreset, 'id' | 'metadata'>) => ClimbingPreset
  updatePreset: (id: string, updates: Partial<ClimbingPreset>) => void
  deletePreset: (id: string) => void
  duplicatePreset: (id: string) => ClimbingPreset
  applyPresetToProject: (presetId: string, projectId: string) => void
  exportPreset: (id: string) => string
  importPreset: (data: string) => ClimbingPreset
  resetToDefaults: () => void
}

// Presets predefinidos para diferentes tipos de escalada
const defaultPresets: ClimbingPreset[] = [
  {
    id: 'boulder-beginner',
    name: 'Boulder Principiante',
    description: 'Configuración ideal para boulders de iniciación con grados V0-V3',
    category: 'boulder',
    icon: '🪨',
    color: '#4CAF50',
    difficultyRange: {
      min: 'V0',
      max: 'V3'
    },
    routeColors: {
      'V0': '#4CAF50',
      'V1': '#8BC34A',
      'V2': '#CDDC39',
      'V3': '#FFEB3B'
    },
    equipment: ['Magnesia', 'Pies de gato', 'Crash pad'],
    tags: ['principiante', 'boulder', 'iniciación'],
    metadata: {
      author: 'Buho Editor',
      created: '2025-08-26',
      version: '1.0',
      isDefault: true
    }
  },
  {
    id: 'boulder-intermediate',
    name: 'Boulder Intermedio',
    description: 'Para boulders con dificultades intermedias V4-V7',
    category: 'boulder',
    icon: '🧗',
    color: '#FF9800',
    difficultyRange: {
      min: 'V4',
      max: 'V7'
    },
    routeColors: {
      'V4': '#FFC107',
      'V5': '#FF9800',
      'V6': '#FF5722',
      'V7': '#F44336'
    },
    equipment: ['Magnesia', 'Pies de gato', 'Crash pad', 'Cepillo'],
    tags: ['intermedio', 'boulder', 'técnico'],
    metadata: {
      author: 'Buho Editor',
      created: '2025-08-26',
      version: '1.0',
      isDefault: true
    }
  },
  {
    id: 'boulder-advanced',
    name: 'Boulder Avanzado',
    description: 'Para boulders difíciles V8-V12+',
    category: 'boulder',
    icon: '💪',
    color: '#9C27B0',
    difficultyRange: {
      min: 'V8',
      max: 'V12'
    },
    routeColors: {
      'V8': '#E91E63',
      'V9': '#9C27B0',
      'V10': '#673AB7',
      'V11': '#3F51B5',
      'V12': '#2196F3'
    },
    equipment: ['Magnesia', 'Pies de gato especializados', 'Crash pad múltiple', 'Cepillo', 'Regleta'],
    tags: ['avanzado', 'boulder', 'extremo'],
    metadata: {
      author: 'Buho Editor',
      created: '2025-08-26',
      version: '1.0',
      isDefault: true
    }
  },
  {
    id: 'sport-single-pitch',
    name: 'Deportiva Un Largo',
    description: 'Configuración para vías deportivas de un largo',
    category: 'sport',
    icon: '🧗‍♀️',
    color: '#2196F3',
    difficultyRange: {
      min: '5.6',
      max: '5.12d'
    },
    routeColors: {
      '5.6': '#4CAF50',
      '5.7': '#8BC34A',
      '5.8': '#CDDC39',
      '5.9': '#FFEB3B',
      '5.10a': '#FFC107',
      '5.10b': '#FFC107',
      '5.10c': '#FF9800',
      '5.10d': '#FF9800',
      '5.11a': '#FF5722',
      '5.11b': '#FF5722',
      '5.11c': '#F44336',
      '5.11d': '#F44336',
      '5.12a': '#E91E63',
      '5.12b': '#E91E63',
      '5.12c': '#9C27B0',
      '5.12d': '#9C27B0'
    },
    equipment: ['Cuerda dinámica', 'Arnés', 'Casco', 'Pies de gato', 'Magnesia', 'Gri-gri'],
    tags: ['deportiva', 'un largo', 'chapas'],
    metadata: {
      author: 'Buho Editor',
      created: '2025-08-26',
      version: '1.0',
      isDefault: true
    }
  },
  {
    id: 'trad-classic',
    name: 'Tradicional Clásica',
    description: 'Configuración para escalada tradicional con protecciones propias',
    category: 'trad',
    icon: '⚙️',
    color: '#795548',
    difficultyRange: {
      min: '5.4',
      max: '5.11c'
    },
    routeColors: {
      '5.4': '#4CAF50',
      '5.5': '#4CAF50',
      '5.6': '#8BC34A',
      '5.7': '#CDDC39',
      '5.8': '#FFEB3B',
      '5.9': '#FFC107',
      '5.10a': '#FF9800',
      '5.10b': '#FF9800',
      '5.10c': '#FF5722',
      '5.10d': '#FF5722',
      '5.11a': '#F44336',
      '5.11b': '#F44336',
      '5.11c': '#E91E63'
    },
    equipment: ['Cuerda dinámica', 'Arnés', 'Casco', 'Friends', 'Nuts', 'Fisureros', 'Cintas express'],
    tags: ['tradicional', 'friends', 'nuts', 'classic'],
    metadata: {
      author: 'Buho Editor',
      created: '2025-08-26',
      version: '1.0',
      isDefault: true
    }
  },
  {
    id: 'mixed-alpine',
    name: 'Mixta Alpina',
    description: 'Para rutas mixtas de montaña con nieve y hielo',
    category: 'mixed',
    icon: '🏔️',
    color: '#607D8B',
    difficultyRange: {
      min: 'M1',
      max: 'M8'
    },
    routeColors: {
      'M1': '#4CAF50',
      'M2': '#8BC34A',
      'M3': '#CDDC39',
      'M4': '#FFEB3B',
      'M5': '#FFC107',
      'M6': '#FF9800',
      'M7': '#FF5722',
      'M8': '#F44336'
    },
    equipment: ['Cuerda dinámica', 'Arnés', 'Casco', 'Gatos', 'Piolet', 'Tornillos', 'Friends', 'Ropa técnica'],
    tags: ['mixta', 'alpina', 'hielo', 'montaña'],
    metadata: {
      author: 'Buho Editor',
      created: '2025-08-26',
      version: '1.0',
      isDefault: true
    }
  }
]

export const usePresetsStore = create<PresetsState>()(
  persist(
    (set, get) => ({
      presets: defaultPresets,
      selectedPresetId: null,
      isLoading: false,

      getPresets: () => get().presets,

      getPresetById: (id) => get().presets.find(p => p.id === id),

      getPresetsByCategory: (category) => 
        get().presets.filter(p => p.category === category),

      setSelectedPreset: (presetId) => set({ selectedPresetId: presetId }),

      createPreset: (presetData) => {
        const newPreset: ClimbingPreset = {
          ...presetData,
          id: `preset-${Date.now()}`,
          metadata: {
            author: 'Usuario',
            created: new Date().toISOString(),
            version: '1.0',
            isDefault: false
          }
        }

        set(state => ({
          presets: [...state.presets, newPreset]
        }))

        return newPreset
      },

      updatePreset: (id, updates) => {
        set(state => ({
          presets: state.presets.map(preset => 
            preset.id === id 
              ? { ...preset, ...updates }
              : preset
          )
        }))
      },

      deletePreset: (id) => {
        const preset = get().getPresetById(id)
        if (preset?.metadata.isDefault) {
          throw new Error('No se pueden eliminar presets predefinidos')
        }

        set(state => ({
          presets: state.presets.filter(p => p.id !== id),
          selectedPresetId: state.selectedPresetId === id ? null : state.selectedPresetId
        }))
      },

      duplicatePreset: (id) => {
        const original = get().getPresetById(id)
        if (!original) {
          throw new Error('Preset no encontrado')
        }

        const duplicate: ClimbingPreset = {
          ...original,
          id: `preset-${Date.now()}`,
          name: `${original.name} (Copia)`,
          metadata: {
            ...original.metadata,
            author: 'Usuario',
            created: new Date().toISOString(),
            isDefault: false
          }
        }

        set(state => ({
          presets: [...state.presets, duplicate]
        }))

        return duplicate
      },

      applyPresetToProject: (presetId, projectId) => {
        // Esta funcionalidad se implementará cuando se integre con projectStore
        console.log(`Applying preset ${presetId} to project ${projectId}`)
      },

      exportPreset: (id) => {
        const preset = get().getPresetById(id)
        if (!preset) {
          throw new Error('Preset no encontrado')
        }

        return JSON.stringify({
          ...preset,
          exportedAt: new Date().toISOString(),
          exportedBy: 'Buho Editor'
        }, null, 2)
      },

      importPreset: (data) => {
        try {
          const importedData = JSON.parse(data)
          
          const newPreset: ClimbingPreset = {
            ...importedData,
            id: `preset-${Date.now()}`,
            name: importedData.name ? `${importedData.name} (Importado)` : 'Preset Importado',
            metadata: {
              ...importedData.metadata,
              author: importedData.metadata?.author || 'Desconocido',
              created: new Date().toISOString(),
              isDefault: false
            }
          }

          set(state => ({
            presets: [...state.presets, newPreset]
          }))

          return newPreset
        } catch (error) {
          throw new Error('Datos de preset inválidos')
        }
      },

      resetToDefaults: () => {
        set({
          presets: defaultPresets,
          selectedPresetId: null
        })
      }
    }),
    {
      name: 'buho-presets-storage',
      partialize: (state) => ({
        presets: state.presets.filter(p => !p.metadata.isDefault), // Solo persistir presets personalizados
        selectedPresetId: state.selectedPresetId
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        presets: [
          ...defaultPresets, // Siempre incluir presets por defecto
          ...(persistedState as any)?.presets || []
        ]
      })
    }
  )
)