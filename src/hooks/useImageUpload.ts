import { useState, useCallback } from 'react'

interface UploadedImage {
  id: string
  file: File
  url: string
  thumbnail: string
  name: string
  size: number
  type: string
  dimensions?: {
    width: number
    height: number
  }
}

interface UseImageUploadReturn {
  uploadedImages: UploadedImage[]
  isUploading: boolean
  uploadProgress: number
  error: string | null
  uploadImage: (file: File) => Promise<UploadedImage>
  uploadImages: (files: FileList | File[]) => Promise<UploadedImage[]>
  removeImage: (id: string) => void
  clearImages: () => void
  getImageUrl: (id: string) => string | null
  getThumbnailUrl: (id: string) => string | null
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const createThumbnail = useCallback((file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Thumbnail size
        const maxWidth = 200
        const maxHeight = 150
        
        let { width, height } = img
        
        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      
      img.src = URL.createObjectURL(file)
    })
  }, [])

  const getImageDimensions = useCallback((file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        })
      }
      img.src = URL.createObjectURL(file)
    })
  }, [])

  const validateImage = useCallback((file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'El archivo debe ser una imagen'
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return 'La imagen es demasiado grande (máximo 50MB)'
    }

    // Check supported formats
    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!supportedFormats.includes(file.type)) {
      return 'Formato no soportado. Use JPEG, PNG o WebP'
    }

    return null
  }, [])

  const uploadImage = useCallback(async (file: File): Promise<UploadedImage> => {
    const validationError = validateImage(file)
    if (validationError) {
      throw new Error(validationError)
    }

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Create object URL for the image
      const url = URL.createObjectURL(file)
      
      // Generate thumbnail
      setUploadProgress(30)
      const thumbnail = await createThumbnail(file)
      
      // Get dimensions
      setUploadProgress(60)
      const dimensions = await getImageDimensions(file)
      
      // Create uploaded image object
      const uploadedImage: UploadedImage = {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        url,
        thumbnail,
        name: file.name,
        size: file.size,
        type: file.type,
        dimensions
      }

      setUploadProgress(100)
      setUploadedImages(prev => [...prev, uploadedImage])
      
      return uploadedImage
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar la imagen'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [validateImage, createThumbnail, getImageDimensions])

  const uploadImages = useCallback(async (files: FileList | File[]): Promise<UploadedImage[]> => {
    const fileArray = Array.from(files)
    const uploadedResults: UploadedImage[] = []
    
    setIsUploading(true)
    setError(null)

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        setUploadProgress((i / fileArray.length) * 100)
        
        try {
          const result = await uploadImage(file)
          uploadedResults.push(result)
        } catch (err) {
          console.error(`Error uploading ${file.name}:`, err)
          // Continue with other files
        }
      }

      return uploadedResults
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [uploadImage])

  const removeImage = useCallback((id: string) => {
    setUploadedImages(prev => {
      const imageToRemove = prev.find(img => img.id === id)
      if (imageToRemove) {
        // Revoke object URL to free memory
        URL.revokeObjectURL(imageToRemove.url)
        URL.revokeObjectURL(imageToRemove.thumbnail)
      }
      return prev.filter(img => img.id !== id)
    })
  }, [])

  const clearImages = useCallback(() => {
    // Revoke all object URLs
    uploadedImages.forEach(img => {
      URL.revokeObjectURL(img.url)
      URL.revokeObjectURL(img.thumbnail)
    })
    setUploadedImages([])
    setError(null)
  }, [uploadedImages])

  const getImageUrl = useCallback((id: string): string | null => {
    const image = uploadedImages.find(img => img.id === id)
    return image?.url || null
  }, [uploadedImages])

  const getThumbnailUrl = useCallback((id: string): string | null => {
    const image = uploadedImages.find(img => img.id === id)
    return image?.thumbnail || null
  }, [uploadedImages])

  return {
    uploadedImages,
    isUploading,
    uploadProgress,
    error,
    uploadImage,
    uploadImages,
    removeImage,
    clearImages,
    getImageUrl,
    getThumbnailUrl
  }
}