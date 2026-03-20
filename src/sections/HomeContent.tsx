/**
 * Home Section Content
 * Welcome message and introduction
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

export default function HomeContent() {
  const home = usePortfolioStore((s) => s.data.home)
  const profile = usePortfolioStore((s) => s.data.profile)

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeUp}>
        <p className="text-[10px] font-mono tracking-[0.4em] text-accent uppercase mb-3">
          {home.subtitle}
        </p>
        <h3 className="text-2xl font-light text-text-primary leading-relaxed">
          {home.headline}<span className="text-accent font-semibold">{home.headlineAccent}</span>
          {home.headlineSuffix.split('\\n').map((line, i) => (
            <span key={i}>{i > 0 && <br />}{line}</span>
          ))}
        </h3>
      </motion.div>

      <motion.div variants={fadeUp} className="w-12 h-px bg-accent/40" />

      <motion.p variants={fadeUp} className="text-sm text-text-secondary leading-relaxed">
        I'm <strong className="text-text-primary">{profile.fullName}</strong>, {home.introParagraph.replace(/^I'm M A, /, '')}
      </motion.p>

      <motion.p variants={fadeUp} className="text-sm text-text-secondary leading-relaxed">
        {home.descriptionParagraph}
      </motion.p>

      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 pt-4">
        {home.stats.map((stat) => (
          <div key={stat.label} className="glass-light rounded-xl p-4 text-center">
            <p className="text-xl font-semibold text-accent">{stat.value}</p>
            <p className="text-[10px] font-mono text-text-muted tracking-wider uppercase mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="pt-2">
        <div className="glass-light rounded-xl p-4">
          <p className="text-[10px] font-mono text-accent tracking-widest uppercase mb-2">Specializations</p>
          <div className="flex flex-wrap gap-2">
            {home.specializations.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full text-[11px] text-text-secondary bg-glass border border-glass-border">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
