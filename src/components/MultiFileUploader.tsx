/**
 * MultiFileUploader Component
 * 
 * Upload multiple documents (PDFs, blueprints, etc.) for a project.
 * Each file shows name, type icon, size, and download/remove actions.
 */

import { useState, useRef, useCallback } from 'react'
import {
  FileUp, X, Download, AlertTriangle,
  FileText, FileImage, FileSpreadsheet, Presentation, File
} from 'lucide-react'
import type { UploadedFile } from '../data/portfolioData'

interface MultiFileUploaderProps {
  label: string
  files: UploadedFile[]
  onChange: (files: UploadedFile[]) => void
  maxFiles?: number
  maxSizeMB?: number
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
  return 'text-text-muted'
}

export default function MultiFileUploader({ label, files, onChange, maxFiles = 10, maxSizeMB = 5 }: MultiFileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback((fileList: FileList) => {
    setError(null)
    const remaining = maxFiles - files.length
    if (remaining <= 0) {
      setError('Maximum ' + maxFiles + ' files reached')
      return
    }

    const toProcess = Array.from(fileList).slice(0, remaining)
    const newFiles: UploadedFile[] = []
    let processed = 0

    toProcess.forEach((file) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError('Each file must be under ' + maxSizeMB + 'MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        newFiles.push({
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          dataUrl: e.target?.result as string,
          uploadedAt: new Date().toISOString(),
        })
        processed++
        if (processed === toProcess.length) {
          onChange([...files, ...newFiles])
        }
      }
      reader.readAsDataURL(file)
    })
  }, [files, maxFiles, maxSizeMB, onChange])

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }, [])
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false) }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files)
  }, [processFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFiles(e.target.files)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [processFiles])

  const handleDownload = useCallback((file: UploadedFile) => {
    const a = document.createElement('a')
    a.href = file.dataUrl
    a.download = file.name
    a.click()
  }, [])

  const removeFile = useCallback((index: number) => {
    onChange(files.filter((_, i) => i !== index))
  }, [files, onChange])

  return (
    <div>
      <label className="block text-[10px] font-mono text-accent/80 tracking-widest uppercase mb-1.5">
        {label}
        <span className="text-text-muted ml-2">({files.length}/{maxFiles})</span>
      </label>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-1.5 mb-2">
          {files.map((file, i) => {
            const IconComp = getFileIcon(file.type)
            const colorClass = getFileColor(file.type)
            return (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-glass-border bg-glass/30 px-3 py-2">
                <IconComp size={14} className={colorClass + " shrink-0"} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-text-primary truncate">{file.name}</p>
                  <p className="text-[8px] font-mono text-text-muted">{formatFileSize(file.size)}</p>
                </div>
                <button type="button" onClick={() => handleDownload(file)} className="p-1 rounded hover:bg-accent/10 text-text-muted hover:text-accent transition-colors cursor-pointer" title="Download">
                  <Download size={11} />
                </button>
                <button type="button" onClick={() => removeFile(i)} className="p-1 rounded hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors cursor-pointer" title="Remove">
                  <X size={11} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Drop zone */}
      {files.length < maxFiles && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={
            "rounded-xl border-2 border-dashed transition-all cursor-pointer flex items-center justify-center gap-2 py-3 px-4 " +
            (isDragging
              ? "border-accent bg-accent/10"
              : "border-glass-border hover:border-accent/40 hover:bg-glass/30")
          }
        >
          <FileUp size={13} className={isDragging ? "text-accent" : "text-text-muted"} />
          <p className="text-[10px] text-text-secondary">
            {isDragging ? (
              <span className="text-accent font-medium">Drop files here</span>
            ) : (
              <>
                <span className="text-accent font-medium">Add documents</span>
                {' '}— click or drag
              </>
            )}
          </p>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.dwg,.dxf,.txt,.csv,image/*" multiple onChange={handleFileSelect} className="hidden" />

      {error && (
        <p className="text-[10px] text-red-400 mt-1.5 flex items-center gap-1">
          <AlertTriangle size={10} /> {error}
        </p>
      )}
    </div>
  )
}
