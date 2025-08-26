import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useImageUpload } from '../../hooks/useImageUpload'

interface ImageUploaderProps {
  onImageSelect?: (imageUrl: string, imageId: string) => void
  onImagesSelect?: (images: Array<{ url: string; id: string }>) => void
  maxFiles?: number
  acceptedTypes?: string[]
  showThumbnails?: boolean
  className?: string
  children?: React.ReactNode
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  onImagesSelect,
  maxFiles = 1,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  showThumbnails = true,
  className = '',
  children
}) => {
  const {
    uploadedImages,
    isUploading,
    uploadProgress,
    error,
    uploadImages,
    removeImage,
    clearImages
  } = useImageUpload()

  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const results = await uploadImages(acceptedFiles.slice(0, maxFiles))
      
      if (maxFiles === 1 && results.length > 0 && onImageSelect) {
        onImageSelect(results[0].url, results[0].id)
      } else if (onImagesSelect && results.length > 0) {
        onImagesSelect(results.map(img => ({ url: img.url, id: img.id })))
      }
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }, [uploadImages, maxFiles, onImageSelect, onImagesSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': acceptedTypes.map(type => `.${type.split('/')[1]}`)
    },
    maxFiles,
    multiple: maxFiles > 1
  })

  const handleImageSelect = (imageId: string) => {
    if (maxFiles === 1) {
      const image = uploadedImages.find(img => img.id === imageId)
      if (image && onImageSelect) {
        onImageSelect(image.url, image.id)
      }
    } else {
      const newSelection = selectedImages.includes(imageId)
        ? selectedImages.filter(id => id !== imageId)
        : [...selectedImages, imageId].slice(0, maxFiles)
      
      setSelectedImages(newSelection)
      
      if (onImagesSelect) {
        const selectedImagesData = newSelection.map(id => {
          const img = uploadedImages.find(img => img.id === id)
          return { url: img!.url, id: img!.id }
        })
        onImagesSelect(selectedImagesData)
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const defaultDropzoneContent = (
    <div className="text-center py-8">
      {isDragActive ? (
        <>
          <div className="text-4xl mb-2">📤</div>
          <p className="text-blue-600 font-medium">Suelta las imágenes aquí</p>
        </>
      ) : (
        <>
          <div className="text-4xl mb-2">📷</div>
          <p className="text-gray-600 mb-2">
            Arrastra imágenes aquí o <span className="text-blue-600 font-medium">haz click para seleccionar</span>
          </p>
          <p className="text-sm text-gray-500">
            {maxFiles === 1 ? 'Una imagen' : `Hasta ${maxFiles} imágenes`} • JPEG, PNG, WebP • Máx. 50MB
          </p>
        </>
      )}
    </div>
  )

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        {children || defaultDropzoneContent}
      </div>

      {/* Progress bar */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subiendo imágenes...</span>
            <span className="text-gray-600">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Uploaded images */}
      {showThumbnails && uploadedImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Imágenes cargadas ({uploadedImages.length})
            </h4>
            <button
              onClick={clearImages}
              className="text-xs text-red-600 hover:text-red-700 transition-colors"
            >
              Limpiar todo
            </button>
          </div>

          <div className={`grid gap-3 ${
            maxFiles === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}>
            {uploadedImages.map((image) => {
              const isSelected = maxFiles === 1 ? false : selectedImages.includes(image.id)
              
              return (
                <div
                  key={image.id}
                  className={`relative group border-2 rounded-lg overflow-hidden transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleImageSelect(image.id)}
                >
                  {/* Image thumbnail */}
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <img
                      src={image.thumbnail}
                      alt={image.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  {/* Selection indicator */}
                  {maxFiles > 1 && (
                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300'
                    }`}>
                      {isSelected && <span className="text-xs">✓</span>}
                    </div>
                  )}

                  {/* Image info */}
                  <div className="p-2 bg-white">
                    <div className="text-xs text-gray-600 truncate mb-1">
                      {image.name}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatFileSize(image.size)}</span>
                      {image.dimensions && (
                        <span>
                          {image.dimensions.width} × {image.dimensions.height}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage(image.id)
                      setSelectedImages(prev => prev.filter(id => id !== image.id))
                    }}
                    className="absolute top-1 left-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    ×
                  </button>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all pointer-events-none" />
                </div>
              )
            })}
          </div>

          {/* Selection summary for multi-select */}
          {maxFiles > 1 && selectedImages.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-700">
                  {selectedImages.length} imagen{selectedImages.length !== 1 ? 'es' : ''} seleccionada{selectedImages.length !== 1 ? 's' : ''}
                </div>
                <button
                  onClick={() => setSelectedImages([])}
                  className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Limpiar selección
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ImageUploader