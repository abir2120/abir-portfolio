/**
 * ImageUploader Component
 * 
 * Drag-and-drop + browse image uploader with preview.
 * Converts images to base64 data URLs for localStorage storage.
 * 
 * Features:
 * - Drag & drop zone with visual feedback
 * - Click to browse from device
 * - Live preview thumbnail
 * - Remove / replace image
 * - Accepts: jpg, png, gif, webp, svg
 * - Max size: 2MB (configurable)
 */

import { useState, useRef, useCallback } from 'react'
import { ImagePlus, X, Upload, AlertTriangle } from 'lucide-react'

interface ImageUploaderProps {
  label: string
  value: string                     // current image URL or data URL
  onChange: (dataUrl: string) => void
  maxSizeMB?: number
}

export default function ImageUploader({ label, value, onChange, maxSizeMB = 2 }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    setError(null)

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed')
      return
    }

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError('Image must be under ' + maxSizeMB + 'MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      onChange(dataUrl)
    }
    reader.onerror = () => setError('Failed to read file')
    reader.readAsDataURL(file)
  }, [maxSizeMB, onChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [processFile])

  const handleRemove = useCallback(() => {
    onChange('')
    setError(null)
  }, [onChange])

  const hasImage = value && value.length > 0

  return (
    <div>
      <label className="block text-[10px] font-mono text-accent/80 tracking-widest uppercase mb-1.5">
        {label}
      </label>

      {hasImage ? (
        /* ── Preview Mode ── */
        <div className="relative group rounded-xl overflow-hidden border border-glass-border">
          <img
            src={value}
            alt="Preview"
            className="w-full h-32 object-cover"
            onError={() => setError('Failed to load image')}
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-accent/20 text-accent text-[10px] font-mono tracking-wider uppercase hover:bg-accent/30 transition-colors cursor-pointer"
            >
              <Upload size={11} className="inline mr-1" /> Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-[10px] font-mono tracking-wider uppercase hover:bg-red-500/30 transition-colors cursor-pointer"
            >
              <X size={11} className="inline mr-1" /> Remove
            </button>
          </div>
        </div>
      ) : (
        /* ── Drop Zone ── */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={
            "relative rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center py-6 px-4 " +
            (isDragging
              ? "border-accent bg-accent/10 scale-[1.01]"
              : "border-glass-border hover:border-accent/40 hover:bg-glass/30")
          }
        >
          <div className={
            "w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors " +
            (isDragging ? "bg-accent/20" : "bg-glass")
          }>
            <ImagePlus size={18} className={isDragging ? "text-accent" : "text-text-muted"} />
          </div>
          <p className="text-[11px] text-text-secondary text-center">
            {isDragging ? (
              <span className="text-accent font-medium">Drop image here</span>
            ) : (
              <>
                <span className="text-accent font-medium">Click to browse</span>
                {' '}or drag & drop
              </>
            )}
          </p>
          <p className="text-[9px] text-text-muted mt-1 font-mono">
            JPG, PNG, GIF, WEBP • Max {maxSizeMB}MB
          </p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <p className="text-[10px] text-red-400 mt-1.5 flex items-center gap-1">
          <AlertTriangle size={10} /> {error}
        </p>
      )}
    </div>
  )
}
