import React, { useState } from 'react'
import { useTourStore, useCurrentScene } from '../../stores/tourStore'
import { Scene } from '../../types'
import ImageUploader from '../ImageUploader/ImageUploader'

interface SceneImageEditorProps {
  scene: Scene
  isOpen: boolean
  onClose: () => void
}

const SceneImageEditor: React.FC<SceneImageEditorProps> = ({ scene, isOpen, onClose }) => {
  const { updateScene } = useTourStore()
  const [localScene, setLocalScene] = useState<Scene>(scene)
  const [hasChanges, setHasChanges] = useState(false)

  if (!isOpen) return null

  const handleImageSelect = (imageUrl: string, imageId: string) => {
    const updatedScene = {
      ...localScene,
      panoramaUrl: imageUrl,
      thumbnail: imageUrl // Use the same image as thumbnail for now
    }
    setLocalScene(updatedScene)
    setHasChanges(true)
  }

  const handleSave = () => {
    updateScene(scene.id, {
      panoramaUrl: localScene.panoramaUrl,
      thumbnail: localScene.thumbnail,
      description: localScene.description,
      metadata: localScene.metadata
    })
    setHasChanges(false)
    onClose()
  }

  const handleCancel = () => {
    setLocalScene(scene)
    setHasChanges(false)
    onClose()
  }

  const updateDescription = (description: string) => {
    setLocalScene(prev => ({ ...prev, description }))
    setHasChanges(true)
  }

  const updateMetadata = (key: keyof Scene['metadata'], value: any) => {
    setLocalScene(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [key]: value
      }
    }))
    setHasChanges(true)
  }

  const isValidImage = (url: string) => {
    return url && (url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('http'))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Editar Escena: {scene.name}</h2>
              <p className="text-green-100 text-sm">
                Configura la imagen panorámica y detalles de la escena
              </p>
            </div>
            <div className="flex gap-2">
              {hasChanges && (
                <span className="px-3 py-1 bg-yellow-500 text-yellow-900 rounded-full text-sm font-medium">
                  Sin guardar
                </span>
              )}
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Imagen Panorámica</h3>
              
              {/* Current image preview */}
              {localScene.panoramaUrl && isValidImage(localScene.panoramaUrl) && (
                <div className="relative">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={localScene.panoramaUrl}
                      alt={localScene.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                    ✓ Imagen actual
                  </div>
                  <button
                    onClick={() => {
                      setLocalScene(prev => ({ 
                        ...prev, 
                        panoramaUrl: '', 
                        thumbnail: '' 
                      }))
                      setHasChanges(true)
                    }}
                    className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg text-sm transition-colors"
                  >
                    🗑️ Quitar
                  </button>
                </div>
              )}

              {/* Image uploader */}
              <ImageUploader
                onImageSelect={handleImageSelect}
                maxFiles={1}
                showThumbnails={!isValidImage(localScene.panoramaUrl)}
                acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
              >
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🏔️</div>
                  <p className="text-gray-600 mb-2">
                    {localScene.panoramaUrl ? 'Cambiar imagen panorámica' : 'Subir imagen panorámica'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Ideal: Imágenes 360° o panorámicas • JPEG, PNG, WebP
                  </p>
                </div>
              </ImageUploader>

              {/* Image requirements */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">💡 Mejores prácticas</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Imágenes panorámicas 360° funcionan mejor</li>
                  <li>• Relación de aspecto 2:1 es ideal</li>
                  <li>• Resolución mínima: 2048×1024px</li>
                  <li>• Evita movimiento o personas en la imagen</li>
                </ul>
              </div>
            </div>

            {/* Scene Details Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Detalles de la Escena</h3>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={localScene.description}
                  onChange={(e) => updateDescription(e.target.value)}
                  placeholder="Describe esta escena del tour..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación específica
                </label>
                <input
                  type="text"
                  value={localScene.metadata.location}
                  onChange={(e) => updateMetadata('location', e.target.value)}
                  placeholder="Ej: Cara norte del boulder"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Weather */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condiciones climáticas
                </label>
                <select
                  value={localScene.metadata.weather}
                  onChange={(e) => updateMetadata('weather', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="soleado">☀️ Soleado</option>
                  <option value="parcialmente-nublado">⛅ Parcialmente nublado</option>
                  <option value="nublado">☁️ Nublado</option>
                  <option value="lluvia">🌧️ Lluvia</option>
                  <option value="nieve">❄️ Nieve</option>
                  <option value="viento">💨 Viento</option>
                </select>
              </div>

              {/* Equipment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipo recomendado
                </label>
                <div className="space-y-2">
                  {['Casco', 'Arnés', 'Cuerda', 'Gatos', 'Piolet', 'Magnesia'].map((item) => {
                    const isSelected = localScene.metadata.equipment.includes(item)
                    return (
                      <label key={item} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const newEquipment = e.target.checked
                              ? [...localScene.metadata.equipment, item]
                              : localScene.metadata.equipment.filter(eq => eq !== item)
                            updateMetadata('equipment', newEquipment)
                          }}
                          className="mr-2 rounded"
                        />
                        <span className="text-sm text-gray-700">{item}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Scene Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Estadísticas de la escena</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Hotspots</div>
                    <div className="font-medium text-gray-900">{scene.hotspots.length}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Rutas</div>
                    <div className="font-medium text-gray-900">{scene.routes.length}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Creada</div>
                    <div className="font-medium text-gray-900">
                      {new Date(scene.metadata.capturedAt).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">ID</div>
                    <div className="font-medium text-gray-900 text-xs">{scene.id}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {hasChanges && (
                <>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Tienes cambios sin guardar</span>
                </>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  hasChanges
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SceneImageEditor