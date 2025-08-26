import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Tour, Scene } from '../types'

export interface Project {
  id: string
  name: string
  description: string
  category: 'boulder' | 'sport' | 'trad' | 'mixed'
  location: string
  difficulty: {
    min: string
    max: string
  }
  tours: Tour[]
  thumbnail?: string
  created: string
  modified: string
  tags: string[]
  isPublic: boolean
  metadata: {
    author: string
    version: string
    totalScenes: number
    totalRoutes: number
  }
}

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  searchQuery: string
  filterCategory: string
  sortBy: 'name' | 'created' | 'modified'
  sortOrder: 'asc' | 'desc'

  // CRUD Actions
  createProject: (data: Omit<Project, 'id' | 'created' | 'modified' | 'metadata'>) => Promise<Project>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  duplicateProject: (id: string) => Promise<Project>
  
  // Project management
  setCurrentProject: (project: Project | null) => void
  loadProject: (id: string) => Promise<void>
  saveProject: (project: Project) => Promise<void>
  
  // Import/Export
  exportProject: (id: string) => Promise<string>
  importProject: (data: string) => Promise<Project>
  
  // Search and filter
  setSearchQuery: (query: string) => void
  setFilterCategory: (category: string) => void
  setSortBy: (sortBy: 'name' | 'created' | 'modified') => void
  setSortOrder: (order: 'asc' | 'desc') => void
  
  // Computed
  getFilteredProjects: () => Project[]
  getProjectById: (id: string) => Project | undefined
}

const defaultProject: Omit<Project, 'id' | 'created' | 'modified'> = {
  name: 'Nuevo Proyecto',
  description: '',
  category: 'boulder',
  location: '',
  difficulty: { min: 'V0', max: 'V3' },
  tours: [],
  tags: [],
  isPublic: false,
  metadata: {
    author: '',
    version: '1.0.0',
    totalScenes: 0,
    totalRoutes: 0
  }
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      isLoading: false,
      searchQuery: '',
      filterCategory: '',
      sortBy: 'modified',
      sortOrder: 'desc',

      createProject: async (data) => {
        set({ isLoading: true })
        
        const newProject: Project = {
          ...defaultProject,
          ...data,
          id: `project-${Date.now()}`,
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          metadata: {
            ...defaultProject.metadata,
            ...data.metadata,
            totalScenes: data.tours.reduce((acc, tour) => acc + tour.scenes.length, 0),
            totalRoutes: data.tours.reduce((acc, tour) => 
              acc + tour.scenes.reduce((sceneAcc, scene) => sceneAcc + scene.routes.length, 0), 0
            )
          }
        }

        set(state => ({
          projects: [...state.projects, newProject],
          currentProject: newProject,
          isLoading: false
        }))

        return newProject
      },

      updateProject: async (id, updates) => {
        set({ isLoading: true })
        
        const updatedProject = {
          ...updates,
          id,
          modified: new Date().toISOString()
        }

        set(state => ({
          projects: state.projects.map(p => 
            p.id === id ? { ...p, ...updatedProject } : p
          ),
          currentProject: state.currentProject?.id === id 
            ? { ...state.currentProject, ...updatedProject }
            : state.currentProject,
          isLoading: false
        }))
      },

      deleteProject: async (id) => {
        set({ isLoading: true })
        
        set(state => ({
          projects: state.projects.filter(p => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
          isLoading: false
        }))
      },

      duplicateProject: async (id) => {
        set({ isLoading: true })
        
        const original = get().getProjectById(id)
        if (!original) {
          set({ isLoading: false })
          throw new Error('Project not found')
        }

        const duplicate: Project = {
          ...original,
          id: `project-${Date.now()}`,
          name: `${original.name} (Copia)`,
          created: new Date().toISOString(),
          modified: new Date().toISOString()
        }

        set(state => ({
          projects: [...state.projects, duplicate],
          isLoading: false
        }))

        return duplicate
      },

      setCurrentProject: (project) => set({ currentProject: project }),

      loadProject: async (id) => {
        set({ isLoading: true })
        const project = get().getProjectById(id)
        set({ 
          currentProject: project || null,
          isLoading: false 
        })
      },

      saveProject: async (project) => {
        set({ isLoading: true })
        await get().updateProject(project.id, project)
        set({ isLoading: false })
      },

      exportProject: async (id) => {
        const project = get().getProjectById(id)
        if (!project) throw new Error('Project not found')
        
        return JSON.stringify(project, null, 2)
      },

      importProject: async (data) => {
        try {
          const project: Project = JSON.parse(data)
          
          // Generate new ID to avoid conflicts
          const importedProject: Project = {
            ...project,
            id: `project-${Date.now()}`,
            name: `${project.name} (Importado)`,
            created: new Date().toISOString(),
            modified: new Date().toISOString()
          }

          set(state => ({
            projects: [...state.projects, importedProject]
          }))

          return importedProject
        } catch (error) {
          throw new Error('Invalid project data')
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterCategory: (category) => set({ filterCategory: category }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (order) => set({ sortOrder: order }),

      getFilteredProjects: () => {
        const { projects, searchQuery, filterCategory, sortBy, sortOrder } = get()
        
        let filtered = projects

        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.location.toLowerCase().includes(query) ||
            p.tags.some(tag => tag.toLowerCase().includes(query))
          )
        }

        // Apply category filter
        if (filterCategory && filterCategory !== 'all') {
          filtered = filtered.filter(p => p.category === filterCategory)
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let aValue: string | number
          let bValue: string | number

          switch (sortBy) {
            case 'name':
              aValue = a.name.toLowerCase()
              bValue = b.name.toLowerCase()
              break
            case 'created':
              aValue = new Date(a.created).getTime()
              bValue = new Date(b.created).getTime()
              break
            case 'modified':
              aValue = new Date(a.modified).getTime()
              bValue = new Date(b.modified).getTime()
              break
            default:
              aValue = a.name.toLowerCase()
              bValue = b.name.toLowerCase()
          }

          if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
          if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
          return 0
        })

        return filtered
      },

      getProjectById: (id) => {
        return get().projects.find(p => p.id === id)
      }
    }),
    {
      name: 'buho-projects-storage',
      partialize: (state) => ({ 
        projects: state.projects,
        currentProject: state.currentProject 
      })
    }
  )
)