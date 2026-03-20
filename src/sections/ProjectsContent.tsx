/**
 * Projects Section Content
 * Portfolio gallery with project cards
 * Now shows gallery images + downloadable project documents
 */

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Download, FileText, Image as ImageIcon } from 'lucide-react'
import { usePortfolioStore } from '../lib/usePortfolioStore'
import type { UploadedFile } from '../data/portfolioData'

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
}

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function handleDownload(file: UploadedFile) {
  const a = document.createElement('a')
  a.href = file.dataUrl
  a.download = file.name
  a.click()
}

export default function ProjectsContent() {
  const projects = usePortfolioStore((s) => s.data.projects)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeUp}>
        <p className="text-[10px] font-mono tracking-[0.4em] text-accent uppercase mb-3">
          {projects.subtitle}
        </p>
        <h3 className="text-xl font-light text-text-primary leading-relaxed">
          {projects.headline}<span className="text-accent font-semibold">{projects.headlineAccent}</span>
        </h3>
      </motion.div>

      <motion.div variants={fadeUp} className="w-12 h-px bg-accent/40" />

      {/* Project Cards */}
      <div className="space-y-4">
        {projects.projects.map((project, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="glass-light rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
          >
            {/* Cover Image */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{project.title}</p>
                  <p className="text-[10px] font-mono text-accent tracking-wider">{project.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  {project.gallery && project.gallery.length > 0 && (
                    <span className="flex items-center gap-1 text-[9px] font-mono text-text-muted bg-black/40 rounded px-1.5 py-0.5">
                      <ImageIcon size={9} /> {project.gallery.length}
                    </span>
                  )}
                  {project.documents && project.documents.length > 0 && (
                    <span className="flex items-center gap-1 text-[9px] font-mono text-text-muted bg-black/40 rounded px-1.5 py-0.5">
                      <FileText size={9} /> {project.documents.length}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-text-muted">{project.year}</span>
                </div>
              </div>
            </div>

            {/* Expanded content */}
            {expandedIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="px-4 pb-4"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-xs text-text-secondary leading-relaxed mt-3 mb-3">
                  {project.description}
                </p>

                {/* Stats */}
                <div className="flex gap-3 mb-3">
                  {Object.entries(project.stats).map(([key, value]) => (
                    <div key={key} className="flex-1 bg-glass rounded-lg p-2 text-center">
                      <p className="text-xs font-medium text-accent">{value}</p>
                      <p className="text-[9px] font-mono text-text-muted uppercase tracking-wider">{key}</p>
                    </div>
                  ))}
                </div>

                {/* Gallery */}
                {project.gallery && project.gallery.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[10px] font-mono text-accent tracking-widest uppercase mb-2 flex items-center gap-1.5">
                      <ImageIcon size={10} /> Gallery
                    </p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {project.gallery.map((img, gi) => (
                        <button
                          key={gi}
                          onClick={() => setLightboxImg(img)}
                          className="aspect-square rounded-lg overflow-hidden border border-glass-border hover:border-accent/40 transition-colors cursor-pointer"
                        >
                          <img src={img} alt={'Gallery ' + (gi + 1)} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {project.documents && project.documents.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono text-accent tracking-widest uppercase mb-2 flex items-center gap-1.5">
                      <FileText size={10} /> Documents
                    </p>
                    <div className="space-y-1.5">
                      {project.documents.map((doc, di) => (
                        <button
                          key={di}
                          onClick={() => handleDownload(doc)}
                          className="w-full flex items-center gap-2 rounded-lg bg-glass/50 border border-glass-border hover:border-accent/30 px-3 py-2 transition-colors cursor-pointer text-left"
                        >
                          <FileText size={13} className="text-red-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-text-primary truncate">{doc.name}</p>
                            <p className="text-[8px] font-mono text-text-muted">{formatFileSize(doc.size)}</p>
                          </div>
                          <Download size={12} className="text-text-muted shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.p variants={fadeUp} className="text-[10px] font-mono text-text-muted text-center tracking-wider pt-2">
        Click a project card to expand details
      </motion.p>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImg(null)}
        >
          <img
            src={lightboxImg}
            alt="Gallery preview"
            className="max-w-full max-h-full rounded-xl object-contain"
          />
        </div>
      )}
    </motion.div>
  )
}
