/**
 * FileUploader Component
 * 
 * Drag-and-drop + browse document uploader.
 * Converts files to base64 data URLs for localStorage storage.
 * Shows file info, type icon, and download/remove actions.
 * 
 * Features:
 * - Drag & drop zone with visual feedback
 * - Click to browse from device
 * - File type icon (PDF, DOC, image, etc.)
 * - File name, size, upload date display
 * - Download uploaded file
 * - Remove file
 * - Accepts: PDF, DOC, DOCX, XLS, XLSX, PPT, images, DWG, etc.
 * - Max size: 5MB (configurable)
 */

import { useState, useRef, useCallback } from 'react'
import {
  FileUp, X, Download, AlertTriangle,
  FileText, FileImage, FileSpreadsheet, Presentation, File
} from 'lucide-react'
import type { UploadedFile } from '../data/portfolioData'

interface FileUploaderProps {
  label: string
  value?: UploadedFile
  onChange: (file: UploadedFile | undefined) => void
  maxSizeMB?: number
  accept?: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function getFileIcon(type: string) {
  if (type.includes('pdf')) return FileText
  if (type.startsWith('image/')) return FileImage
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) return FileSpreadsheet
  if (type.includes('presentation') || type.includes('powerpoint')) return Presentation
  return File
}

function getFileColor(type: string): string {
  if (type.includes('pdf')) return 'text-red-400'
  if (type.startsWith('image/')) return 'text-blue-400'
  if (type.includes('spreadsheet') || type.includes('excel')) return 'text-green-400'
  if (type.includes('presentation') || type.includes('powerpoint')) return 'text-orange-400'
  if (type.includes('word') || type.includes('document')) return 'text-blue-300'
  return 'text-text-muted'
}

export default function FileUploader({ label, value, onChange, maxSizeMB = 5, accept }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    setError(null)

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError('File must be under ' + maxSizeMB + 'MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      const uploaded: UploadedFile = {
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        dataUrl,
        uploadedAt: new Date().toISOString(),
      }
      onChange(uploaded)
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

  const handleDownload = useCallback(() => {
    if (!value) return
    const a = document.createElement('a')
    a.href = value.dataUrl
    a.download = value.name
    a.click()
  }, [value])

  const handleRemove = useCallback(() => {
    onChange(undefined)
    setError(null)
  }, [onChange])

  const acceptTypes = accept || '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.dwg,.dxf,.txt,.csv,image/*'

  return (
    <div>
      <label className="block text-[10px] font-mono text-accent/80 tracking-widest uppercase mb-1.5">
        {label}
      </label>

      {value ? (
        /* ── File Preview ── */
        <div className="rounded-xl border border-glass-border bg-glass/30 p-3">
          <div className="flex items-center gap-3">
            {/* File type icon */}
            <div className="w-10 h-10 rounded-lg bg-glass flex items-center justify-center shrink-0">
              {(() => {
                const IconComp = getFileIcon(value.type)
                const colorClass = getFileColor(value.type)
                return <IconComp size={18} className={colorClass} />
              })()}
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-primary truncate" title={value.name}>
                {value.name}
              </p>
              <p className="text-[9px] font-mono text-text-muted mt-0.5">
                {formatFileSize(value.size)} • {new Date(value.uploadedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleDownload}
                className="p-1.5 rounded-lg hover:bg-accent/10 text-text-muted hover:text-accent transition-colors cursor-pointer"
                title="Download"
              >
                <Download size={13} />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors cursor-pointer"
                title="Remove"
              >
                <X size={13} />
              </button>
            </div>
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
            "relative rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center py-5 px-4 " +
            (isDragging
              ? "border-accent bg-accent/10 scale-[1.01]"
              : "border-glass-border hover:border-accent/40 hover:bg-glass/30")
          }
        >
          <div className={
            "w-9 h-9 rounded-xl flex items-center justify-center mb-2 transition-colors " +
            (isDragging ? "bg-accent/20" : "bg-glass")
          }>
            <FileUp size={16} className={isDragging ? "text-accent" : "text-text-muted"} />
          </div>
          <p className="text-[11px] text-text-secondary text-center">
            {isDragging ? (
              <span className="text-accent font-medium">Drop file here</span>
            ) : (
              <>
                <span className="text-accent font-medium">Click to browse</span>
                {' '}or drag & drop
              </>
            )}
          </p>
          <p className="text-[9px] text-text-muted mt-1 font-mono">
            PDF, DOC, XLS, DWG, Images • Max {maxSizeMB}MB
          </p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptTypes}
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
