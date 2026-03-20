/**
 * GalleryUploader Component
 * 
 * Multi-image uploader for project galleries.
 * Supports drag-drop, browse, reorder, and remove.
 * Stores images as base64 data URLs.
 */

import { useState, useRef, useCallback } from 'react'
import { ImagePlus, X, AlertTriangle, GripVertical } from 'lucide-react'

interface GalleryUploaderProps {
  label: string
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  maxSizeMB?: number
}

export default function GalleryUploader({ label, images, onChange, maxImages = 10, maxSizeMB = 2 }: GalleryUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback((files: FileList) => {
    setError(null)
    const remaining = maxImages - images.length
    if (remaining <= 0) {
      setError('Maximum ' + maxImages + ' images reached')
      return
    }

    const toProcess = Array.from(files).slice(0, remaining)
    const newImages: string[] = []
    let processed = 0

    toProcess.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed')
        return
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError('Each image must be under ' + maxSizeMB + 'MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        newImages.push(e.target?.result as string)
        processed++
        if (processed === toProcess.length) {
          onChange([...images, ...newImages])
        }
      }
      reader.readAsDataURL(file)
    })
  }, [images, maxImages, maxSizeMB, onChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }, [processFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [processFiles])

  const removeImage = useCallback((index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }, [images, onChange])

  const moveImage = useCallback((from: number, to: number) => {
    if (to < 0 || to >= images.length) return
    const arr = [...images]
    const [moved] = arr.splice(from, 1)
    arr.splice(to, 0, moved)
    onChange(arr)
  }, [images, onChange])

  return (
    <div>
      <label className="block text-[10px] font-mono text-accent/80 tracking-widest uppercase mb-1.5">
        {label}
        <span className="text-text-muted ml-2">({images.length}/{maxImages})</span>
      </label>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-2">
          {images.map((img, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-glass-border aspect-square">
              <img src={img} alt={'Gallery ' + (i + 1)} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i - 1)}
                    className="p-1 rounded bg-glass/50 text-text-secondary hover:text-accent cursor-pointer"
                    title="Move left"
                  >
                    <GripVertical size={10} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="p-1 rounded bg-red-500/30 text-red-300 hover:text-red-200 cursor-pointer"
                  title="Remove"
                >
                  <X size={10} />
                </button>
              </div>
              {i === 0 && (
                <span className="absolute top-1 left-1 text-[7px] font-mono bg-accent/80 text-bg-dark px-1 rounded">
                  COVER
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      {images.length < maxImages && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={
            "rounded-xl border-2 border-dashed transition-all cursor-pointer flex items-center justify-center gap-2 py-4 px-4 " +
            (isDragging
              ? "border-accent bg-accent/10"
              : "border-glass-border hover:border-accent/40 hover:bg-glass/30")
          }
        >
          <ImagePlus size={14} className={isDragging ? "text-accent" : "text-text-muted"} />
          <p className="text-[10px] text-text-secondary">
            {isDragging ? (
              <span className="text-accent font-medium">Drop images here</span>
            ) : (
              <>
                <span className="text-accent font-medium">Add images</span>
                {' '}— click or drag
              </>
            )}
          </p>
        </div>
      )}

      {/* Hidden file input (multiple) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-[10px] text-red-400 mt-1.5 flex items-center gap-1">
          <AlertTriangle size={10} /> {error}
        </p>
      )}
    </div>
  )
}
