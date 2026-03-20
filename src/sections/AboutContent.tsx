/**
 * About Section Content
 * Biography and professional background
 * 
 * ✅ Now reads from portfolioData store
 */

import { motion } from 'framer-motion'
import { usePortfolioStore } from '../lib/usePortfolioStore'

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } }
}

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function AboutContent() {
  const about = usePortfolioStore((s) => s.data.about)

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeUp}>
        <p className="text-[10px] font-mono tracking-[0.4em] text-accent uppercase mb-3">
          {about.subtitle}
        </p>
        <h3 className="text-xl font-light text-text-primary leading-relaxed">
          {about.headline}<span className="text-accent font-semibold">{about.headlineAccent}</span>{about.headlineSuffix}
        </h3>
      </motion.div>

      <motion.div variants={fadeUp} className="w-12 h-px bg-accent/40" />

      <motion.p variants={fadeUp} className="text-sm text-text-secondary leading-relaxed">
        {about.bio1}
      </motion.p>

      <motion.p variants={fadeUp} className="text-sm text-text-secondary leading-relaxed">
        {about.bio2}
      </motion.p>

      {/* Timeline */}
      <motion.div variants={fadeUp} className="space-y-4 pt-2">
        <p className="text-[10px] font-mono text-accent tracking-widest uppercase">Career Timeline</p>
        {about.timeline.map((item, i) => (
          <div key={i} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-accent/60 group-hover:bg-accent transition-colors" />
              {i < about.timeline.length - 1 && <div className="w-px flex-1 bg-glass-border" />}
            </div>
            <div className="pb-4">
              <p className="text-[10px] font-mono text-accent tracking-wider">{item.year}</p>
              <p className="text-sm font-medium text-text-primary mt-0.5">{item.title}</p>
              <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Skills */}
      <motion.div variants={fadeUp} className="space-y-3 pt-2">
        <p className="text-[10px] font-mono text-accent tracking-widest uppercase">Core Skills</p>
        {about.skills.map((item) => (
          <div key={item.skill}>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-text-secondary">{item.skill}</span>
              <span className="text-[10px] font-mono text-text-muted">{item.level}%</span>
            </div>
            <div className="h-1 bg-glass rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-dark to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${item.level}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
