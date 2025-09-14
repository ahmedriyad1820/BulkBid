import React, { useState, useRef } from 'react'
import Button from './ui/Button.jsx'
import { ImagePlus, Trash2, Upload } from 'lucide-react'

export default function Uploader({ onImagesChange, maxImages = 5 }) {
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files)
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
      return isValidType && isValidSize
    })

    if (validFiles.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    if (validFiles.length === 0) {
      alert('Please select valid image files (max 5MB each)')
      return
    }

    setIsProcessing(true)

    try {
      const newFiles = [...files, ...validFiles]
      setFiles(newFiles)

      // Create previews
      const newPreviews = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }))
      setPreviews([...previews, ...newPreviews])

      // Notify parent component
      if (onImagesChange) {
        onImagesChange(newFiles)
      }

      console.log(`Successfully added ${validFiles.length} image(s)`)
    } catch (error) {
      console.error('Error processing images:', error)
      alert('Error processing images. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    
    // Revoke object URL to prevent memory leaks
    if (previews[index]) {
      URL.revokeObjectURL(previews[index].preview)
    }
    
    setFiles(newFiles)
    setPreviews(newPreviews)
    
    if (onImagesChange) {
      onImagesChange(newFiles)
    }
  }

  const openFileDialog = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Opening file dialog...')
    fileInputRef.current?.click()
  }

  return (
    <div className="rounded-xl border p-3">
      <div className="mb-2 text-sm font-medium">
        Images <span className="text-red-500">*</span>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          type="button"
          variant="outline" 
          icon={isProcessing ? Upload : ImagePlus} 
          onClick={openFileDialog}
          disabled={files.length >= maxImages || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Add Image'}
        </Button>
        <div className="text-xs text-gray-500">
          {files.length}/{maxImages} images (max 5MB each)
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {previews.map((preview, i) => (
            <div key={i} className="relative group">
              <img
                src={preview.preview}
                alt={`Preview ${i + 1}`}
                className="w-full h-20 object-cover rounded-lg border"
              />
              <button
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
              <div className="text-xs text-gray-500 mt-1 truncate">
                {preview.file.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && (
        <div className="mt-3 text-center text-red-500 text-sm font-medium">
          ⚠️ No images selected - At least 1 image required
        </div>
      )}
    </div>
  )
}
