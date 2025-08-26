import React, { useState } from 'react'
import { useProjectStore } from '../../stores/projectStore'
import { useTourStore } from '../../stores/tourStore'
import { Project } from '../../stores/projectStore'

interface ProjectListProps {
  onProjectSelect: (project: Project) => void
}

const ProjectList: React.FC<ProjectListProps> = ({ onProjectSelect }) => {
  const {
    projects,
    searchQuery,
    filterCategory,
    sortBy,
    sortOrder,
    setSearchQuery,
    setFilterCategory,
    setSortBy,
    setSortOrder,
    getFilteredProjects,
    createProject,
    deleteProject,
    duplicateProject,
    isLoading
  } = useProjectStore()

  const { setCurrentTour } = useTourStore()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredProjects = getFilteredProjects()

  const categories = [
    { value: 'all', label: 'Todas las categorías', icon: '🏔️' },
    { value: 'boulder', label: 'Boulder', icon: '🪨' },
    { value: 'sport', label: 'Deportiva', icon: '🧗' },
    { value: 'trad', label: 'Tradicional', icon: '⚙️' },
    { value: 'mixed', label: 'Mixta', icon: '🏔️' }
  ]

  const sortOptions = [
    { value: 'modified', label: 'Modificado' },
    { value: 'created', label: 'Creado' },
    { value: 'name', label: 'Nombre' }
  ]

  const handleCreateProject = async () => {
    try {
      const newProject = await createProject({
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
      })
      onProjectSelect(newProject)
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const handleDeleteProject = async (project: Project) => {
    if (window.confirm(`¿Estás seguro de eliminar "${project.name}"? Esta acción no se puede deshacer.`)) {
      try {
        await deleteProject(project.id)
      } catch (error) {
        console.error('Error deleting project:', error)
      }
    }
  }

  const handleDuplicateProject = async (project: Project) => {
    try {
      const duplicate = await duplicateProject(project.id)
      onProjectSelect(duplicate)
    } catch (error) {
      console.error('Error duplicating project:', error)
    }
  }

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category)
    return cat?.icon || '🏔️'
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Proyectos</h1>
            <p className="text-gray-600">{filteredProjects.length} proyectos encontrados</p>
          </div>
          <button
            onClick={handleCreateProject}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            ➕ Nuevo Proyecto
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Buscar proyectos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title={`Orden: ${sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ⊞
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            {projects.length === 0 ? (
              <>
                <div className="text-6xl mb-4">🏔️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Bienvenido a Buho Editor
                </h3>
                <p className="text-gray-600 mb-6">
                  Crea tu primer proyecto de tour virtual con rutas de escalada
                </p>
                <button
                  onClick={handleCreateProject}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear mi primer proyecto
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No se encontraron proyectos
                </h3>
                <p className="text-gray-600">
                  Intenta ajustar los filtros de búsqueda
                </p>
              </>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className={`bg-white border border-gray-200 rounded-xl transition-all hover:shadow-md ${
                  viewMode === 'list' ? 'flex items-center p-4' : 'overflow-hidden'
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    {/* Thumbnail */}
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      {project.thumbnail ? (
                        <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <div className="text-4xl mb-2">{getCategoryIcon(project.category)}</div>
                          <div className="text-sm text-gray-600">{project.category}</div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 truncate flex-1">
                          {project.name}
                        </h3>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => handleDuplicateProject(project)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Duplicar proyecto"
                          >
                            📋
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Eliminar proyecto"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {project.description || 'Sin descripción'}
                      </p>

                      <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                        <span>📍 {project.location || 'Sin ubicación'}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-3 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {project.difficulty.min} - {project.difficulty.max}
                        </span>
                        <span className="text-gray-500">
                          {project.metadata.totalScenes} escenas
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {formatDate(project.modified)}
                        </div>
                        <button
                          onClick={() => {
                            onProjectSelect(project)
                            if (project.tours.length > 0) {
                              setCurrentTour(project.tours[0])
                            }
                          }}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          Abrir
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* List view */
                  <>
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <div className="text-2xl">{getCategoryIcon(project.category)}</div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {project.name}
                        </h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {project.difficulty.min}-{project.difficulty.max}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {project.description || 'Sin descripción'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>📍 {project.location || 'Sin ubicación'}</span>
                        <span>{project.metadata.totalScenes} escenas</span>
                        <span>{formatDate(project.modified)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDuplicateProject(project)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Duplicar"
                      >
                        📋
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                      <button
                        onClick={() => {
                          onProjectSelect(project)
                          if (project.tours.length > 0) {
                            setCurrentTour(project.tours[0])
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Abrir
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectList