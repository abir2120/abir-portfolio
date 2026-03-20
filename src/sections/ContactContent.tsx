/**
 * Contact Section Content
 * Contact form with fields for name, email, and message
 * 
 * ✅ Now reads from portfolioData store
 */

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Send, MapPin, Mail, Phone } from 'lucide-react'
import { usePortfolioStore } from '../lib/usePortfolioStore'

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } }
}

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const iconMap = {
  MapPin,
  Mail,
  Phone,
} as const

export default function ContactContent() {
  const contact = usePortfolioStore((s) => s.data.contact)
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormState({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeUp}>
        <p className="text-[10px] font-mono tracking-[0.4em] text-accent uppercase mb-3">
          {contact.subtitle}
        </p>
        <h3 className="text-xl font-light text-text-primary leading-relaxed">
          {contact.headline}<span className="text-accent font-semibold">{contact.headlineAccent}</span>{contact.headlineSuffix}
        </h3>
      </motion.div>

      <motion.div variants={fadeUp} className="w-12 h-px bg-accent/40" />

      {/* Contact Info Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {contact.contactInfo.map((item) => {
          const IconComponent = iconMap[item.icon] || Mail
          return (
            <div key={item.label} className="glass-light rounded-xl p-3 text-center">
              <IconComponent size={16} className="text-accent mx-auto mb-1.5" />
              <p className="text-[10px] font-mono text-text-muted tracking-wider uppercase">{item.label}</p>
              <p className="text-xs text-text-secondary mt-0.5">{item.value}</p>
            </div>
          )
        })}
      </motion.div>

      {/* Contact Form */}
      <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-mono text-text-muted tracking-wider uppercase block mb-1.5">Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={formState.name}
              onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-text-muted tracking-wider uppercase block mb-1.5">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={formState.email}
              onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-text-muted tracking-wider uppercase block mb-1.5">Subject</label>
          <input
            type="text"
            placeholder="Project inquiry"
            value={formState.subject}
            onChange={(e) => setFormState(prev => ({ ...prev, subject: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-text-muted tracking-wider uppercase block mb-1.5">Message</label>
          <textarea
            placeholder="Tell me about your project..."
            value={formState.message}
            onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
            required
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-accent-dark via-accent to-accent-light text-bg-dark font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/20 transition-all cursor-pointer active:scale-[0.98]"
        >
          <Send size={14} />
          Send Message
        </button>

        {/* Success message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-3 rounded-xl bg-green-500/10 border border-green-500/20"
          >
            <p className="text-sm text-green-400">Message sent successfully! ✓</p>
            <p className="text-[10px] text-green-400/60 mt-0.5">I'll get back to you within 24 hours.</p>
          </motion.div>
        )}
      </motion.form>

      {/* Availability */}
      <motion.div variants={fadeUp} className="glass-light rounded-xl p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <p className="text-xs text-text-secondary">{contact.availabilityText}</p>
        </div>
        <p className="text-[10px] font-mono text-text-muted tracking-wider">
          {contact.responseTime}
        </p>
      </motion.div>
    </motion.div>
  )
}
