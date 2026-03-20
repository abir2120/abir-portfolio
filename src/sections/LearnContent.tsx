/**
 * Learn Section Content
 * Certifications, education, and professional documents
 * Now shows downloadable documents for certs, courses, and publications
 */

import { motion } from 'framer-motion'
import { Award, BookOpen, FileText, ExternalLink, Download, Paperclip } from 'lucide-react'
import { usePortfolioStore } from '../lib/usePortfolioStore'
import type { UploadedFile } from '../data/portfolioData'

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } }
}

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

function handleDownload(file: UploadedFile) {
  const a = document.createElement('a')
  a.href = file.dataUrl
  a.download = file.name
  a.click()
}

function DocBadge({ file }: { file: UploadedFile }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); handleDownload(file) }}
      className="mt-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-accent/8 border border-accent/15 hover:border-accent/30 hover:bg-accent/12 transition-all cursor-pointer group/doc"
    >
      <Paperclip size={10} className="text-accent/60" />
      <span className="text-[10px] text-text-secondary truncate max-w-[140px]">{file.name}</span>
      <Download size={10} className="text-text-muted group-hover/doc:text-accent transition-colors shrink-0" />
    </button>
  )
}

export default function LearnContent() {
  const learn = usePortfolioStore((s) => s.data.learn)

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeUp}>
        <p className="text-[10px] font-mono tracking-[0.4em] text-accent uppercase mb-3">
          {learn.subtitle}
        </p>
        <h3 className="text-xl font-light text-text-primary leading-relaxed">
          {learn.headline}<span className="text-accent font-semibold">{learn.headlineAccent}</span>
        </h3>
      </motion.div>

      <motion.div variants={fadeUp} className="w-12 h-px bg-accent/40" />

      {/* Certifications */}
      <motion.div variants={fadeUp} className="space-y-3">
        <p className="text-[10px] font-mono text-accent tracking-widest uppercase flex items-center gap-2">
          <Award size={12} /> Professional Certifications
        </p>
        {learn.certifications.map((cert, i) => (
          <div key={i} className="glass-light rounded-xl p-4 group hover:border-accent/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                <Award size={16} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{cert.name}</p>
                <p className="text-xs text-text-muted mt-0.5">{cert.issuer}</p>
                {cert.document && <DocBadge file={cert.document} />}
              </div>
              <span className="text-[10px] font-mono text-text-muted shrink-0">{cert.year}</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Courses */}
      <motion.div variants={fadeUp} className="space-y-3">
        <p className="text-[10px] font-mono text-accent tracking-widest uppercase flex items-center gap-2">
          <BookOpen size={12} /> Continuing Education
        </p>
        {learn.courses.map((course, i) => (
          <div key={i} className="glass-light rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-primary">{course.name}</p>
                <p className="text-xs text-text-muted mt-0.5">{course.provider}</p>
                {course.document && <DocBadge file={course.document} />}
              </div>
              <span className={
                "text-[10px] font-mono px-2 py-1 rounded-full shrink-0 ml-2 " +
                (course.status === 'Completed'
                  ? 'bg-accent/10 text-accent'
                  : 'bg-blue-500/10 text-blue-400')
              }>
                {course.status}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Publications */}
      <motion.div variants={fadeUp} className="space-y-3">
        <p className="text-[10px] font-mono text-accent tracking-widest uppercase flex items-center gap-2">
          <FileText size={12} /> Publications
        </p>
        {learn.publications.map((pub, i) => (
          <div key={i} className="glass-light rounded-xl p-4 group hover:border-accent/30 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary leading-snug">{pub.title}</p>
                <p className="text-xs text-text-muted mt-1">{pub.journal} · {pub.year}</p>
                {pub.document && <DocBadge file={pub.document} />}
              </div>
              {pub.document ? (
                <button
                  onClick={() => handleDownload(pub.document!)}
                  className="shrink-0 mt-1 p-1.5 rounded-lg hover:bg-accent/10 text-text-muted hover:text-accent transition-colors cursor-pointer"
                >
                  <Download size={14} />
                </button>
              ) : (
                <ExternalLink size={14} className="text-text-muted group-hover:text-accent transition-colors shrink-0 mt-1" />
              )}
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
