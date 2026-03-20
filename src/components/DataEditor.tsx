/**
 * Data Editor Panel — OWNER-ONLY ACCESS
 * 
 * The ⚙ gear button is HIDDEN by default. Only revealed by a secret
 * keyboard shortcut: Ctrl+Shift+E (or Cmd+Shift+E on Mac).
 * 
 * Once revealed, clicking the gear opens a login prompt.
 * After authentication, the full editor panel is accessible.
 * 
 * Security:
 * - Secret shortcut to reveal the button (invisible to visitors)
 * - Password login with SHA-256 hashing
 * - Lockout after 5 failed attempts
 * - Session expires when browser tab closes
 * - Change password from within the editor
 * - Logout button to end session
 * 
 * Default password: "admin123" — change it immediately after first login!
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, X, Download, Upload, RotateCcw, User, Home,
  Briefcase, FolderOpen, GraduationCap, Phone, Plus, Trash2,
  ChevronDown, ChevronRight, Check, AlertTriangle, Lock,
  Eye, EyeOff, LogOut, KeyRound, ShieldCheck
} from 'lucide-react'
import { usePortfolioStore } from '../lib/usePortfolioStore'
import { useAuthStore } from '../lib/useAuthStore'
import { defaultPortfolioData } from '../data/portfolioData'
import type {
  TimelineItem, SkillItem, StatItem, ProjectItem,
  CertificationItem, CourseItem, PublicationItem, ContactInfoItem,
  UploadedFile
} from '../data/portfolioData'
import ImageUploader from './ImageUploader'
import FileUploader from './FileUploader'
import GalleryUploader from './GalleryUploader'
import MultiFileUploader from './MultiFileUploader'
import DeployGuide from './DeployGuide'

/* ═══════════════════════════════════════════
   LOGIN SCREEN
   ═══════════════════════════════════════════ */

function LoginScreen({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, errorMessage, failedAttempts, lockoutUntil } = useAuthStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [lockoutTimer, setLockoutTimer] = useState(0)

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutUntil) { setLockoutTimer(0); return }
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000))
      setLockoutTimer(remaining)
      if (remaining <= 0) clearInterval(interval)
    }, 1000)
    return () => clearInterval(interval)
  }, [lockoutUntil])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim() || isLoading) return
    setIsLoading(true)
    await login(password)
    setIsLoading(false)
    setPassword('')
  }

  const isLocked = lockoutTimer > 0

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Login Card */}
      <motion.div
        className="fixed z-[70] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] max-w-[calc(100%-2rem)]"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="glass rounded-2xl glow-accent overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-accent" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary tracking-wide">Admin Access</h2>
            <p className="text-[10px] font-mono text-text-muted tracking-wider mt-1">
              Enter password to edit portfolio
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={isLocked}
                className="w-full pr-10 text-sm disabled:opacity-40"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* Error / Lockout Message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2"
                >
                  <p className="text-[11px] text-red-400 flex items-center gap-1.5">
                    <AlertTriangle size={12} />
                    {errorMessage}
                    {isLocked && <span className="font-mono ml-1">({lockoutTimer}s)</span>}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLocked || isLoading || !password.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-dark via-accent to-accent-light text-bg-dark font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/20 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoading ? (
                <motion.div
                  className="w-4 h-4 border-2 border-bg-dark/30 border-t-bg-dark rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              ) : isLocked ? (
                <>Locked ({lockoutTimer}s)</>
              ) : (
                <><ShieldCheck size={14} /> Authenticate</>
              )}
            </button>

            {/* Attempts indicator */}
            {failedAttempts > 0 && !isLocked && (
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i < failedAttempts ? 'bg-red-400' : 'bg-glass-border'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Cancel */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-[10px] font-mono text-text-muted hover:text-text-secondary tracking-wider uppercase transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </form>
        </div>
      </motion.div>
    </>
  )
}

/* ═══════════════════════════════════════════
   CHANGE PASSWORD MODAL
   ═══════════════════════════════════════════ */

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { changePassword } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPw !== confirmPw) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }
    setIsLoading(true)
    const result = await changePassword(currentPw, newPw)
    setIsLoading(false)
    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    if (result.success) {
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
      setTimeout(onClose, 1500)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        className="relative z-10 w-[380px] max-w-[calc(100%-2rem)] glass rounded-2xl glow-accent overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-glass-border">
          <div className="flex items-center gap-2">
            <KeyRound size={16} className="text-accent" />
            <h3 className="text-sm font-semibold text-text-primary">Change Password</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-glass-hover flex items-center justify-center hover:bg-accent/20 transition-colors cursor-pointer">
            <X size={12} className="text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-3">
          <div className="relative">
            <label className="block text-[10px] font-mono text-accent/80 tracking-widest uppercase mb-1.5">Current Password</label>
            <input type={showPw ? 'text' : 'password'} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} required className="w-full text-xs" autoComplete="current-password" />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-accent/80 tracking-widest uppercase mb-1.5">New Password</label>
            <input type={showPw ? 'text' : 'password'} value={newPw} onChange={(e) => setNewPw(e.target.value)} required minLength={6} className="w-full text-xs" autoComplete="new-password" />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-accent/80 tracking-widest uppercase mb-1.5">Confirm New Password</label>
            <input type={showPw ? 'text' : 'password'} value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required minLength={6} className="w-full text-xs" autoComplete="new-password" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={showPw} onChange={(e) => setShowPw(e.target.checked)} className="accent-[#c9a96e]" />
            <span className="text-[10px] font-mono text-text-muted tracking-wider">Show passwords</span>
          </label>

          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-lg px-3 py-2 text-[11px] ${
                message.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}
            >
              {message.type === 'success' ? <Check size={11} className="inline mr-1" /> : <AlertTriangle size={11} className="inline mr-1" />}
              {message.text}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-accent-dark via-accent to-accent-light text-bg-dark font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/20 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   SHARED UI COMPONENTS
   ═══════════════════════════════════════════ */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-mono text-accent/80 tracking-widest uppercase mb-1.5">
      {children}
    </label>
  )
}

function TextField({ label, value, onChange, multiline = false, placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full text-xs"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full text-xs"
        />
      )}
    </div>
  )
}

function NumberField({ label, value, onChange, min = 0, max = 100 }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value))))}
        min={min}
        max={max}
        className="w-full text-xs"
      />
    </div>
  )
}

function SectionCard({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-glass-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-glass-hover/50 hover:bg-glass-hover transition-colors cursor-pointer"
      >
        <span className="text-xs font-semibold text-text-primary tracking-wide">{title}</span>
        {open ? <ChevronDown size={14} className="text-text-muted" /> : <ChevronRight size={14} className="text-text-muted" />}
      </button>
      {open && <div className="p-4 space-y-3 border-t border-glass-border">{children}</div>}
    </div>
  )
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-[10px] font-mono text-accent/70 hover:text-accent tracking-wider uppercase transition-colors cursor-pointer"
    >
      <Plus size={12} /> {label}
    </button>
  )
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-1 rounded hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors cursor-pointer"
      title="Remove item"
    >
      <Trash2 size={12} />
    </button>
  )
}

/* ═══════════════════════════════════════════
   TAB DEFINITIONS
   ═══════════════════════════════════════════ */

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'learn', label: 'Learn', icon: GraduationCap },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'deploy', label: 'Deploy', icon: Upload },
] as const

type TabId = typeof TABS[number]['id']

/* ═══════════════════════════════════════════
   SECTION EDITORS
   ═══════════════════════════════════════════ */

function ProfileEditor() {
  const { data, updateProfile } = usePortfolioStore()
  const p = data.profile
  return (
    <div className="space-y-4">
      <SectionCard title="Identity">
        <TextField label="Initials" value={p.initials} onChange={(v) => updateProfile({ initials: v })} placeholder="M A" />
        <TextField label="Full Name" value={p.fullName} onChange={(v) => updateProfile({ fullName: v })} placeholder="M A" />
        <TextField label="Title" value={p.title} onChange={(v) => updateProfile({ title: v })} placeholder="Building Engineer" />
      </SectionCard>
      <SectionCard title="Logo Image">
        <ImageUploader
          label="Logo (drag & drop or browse)"
          value={p.logoUrl}
          onChange={(v) => updateProfile({ logoUrl: v })}
          maxSizeMB={1}
        />
        <TextField label="Or enter URL manually" value={p.logoUrl} onChange={(v) => updateProfile({ logoUrl: v })} placeholder="/logo-ma.png" />
      </SectionCard>
      <SectionCard title="Header Taglines">
        <TextField label="Tagline 1" value={p.headerTagline1} onChange={(v) => updateProfile({ headerTagline1: v })} />
        <TextField label="Tagline 2" value={p.headerTagline2} onChange={(v) => updateProfile({ headerTagline2: v })} />
      </SectionCard>
    </div>
  )
}

function HomeEditor() {
  const { data, updateHome } = usePortfolioStore()
  const h = data.home
  return (
    <div className="space-y-4">
      <SectionCard title="Headlines">
        <TextField label="Subtitle" value={h.subtitle} onChange={(v) => updateHome({ subtitle: v })} />
        <TextField label="Headline (before accent)" value={h.headline} onChange={(v) => updateHome({ headline: v })} />
        <TextField label="Accent Word" value={h.headlineAccent} onChange={(v) => updateHome({ headlineAccent: v })} />
        <TextField label="Headline (after accent)" value={h.headlineSuffix} onChange={(v) => updateHome({ headlineSuffix: v })} />
      </SectionCard>
      <SectionCard title="Paragraphs">
        <TextField label="Intro Paragraph" value={h.introParagraph} onChange={(v) => updateHome({ introParagraph: v })} multiline />
        <TextField label="Description Paragraph" value={h.descriptionParagraph} onChange={(v) => updateHome({ descriptionParagraph: v })} multiline />
      </SectionCard>
      <SectionCard title="Statistics">
        {h.stats.map((stat: StatItem, i: number) => (
          <div key={i} className="flex items-end gap-2">
            <div className="flex-1"><TextField label={`Stat ${i + 1} Value`} value={stat.value} onChange={(v) => {
              const newStats = [...h.stats]; newStats[i] = { ...newStats[i], value: v }; updateHome({ stats: newStats })
            }} /></div>
            <div className="flex-1"><TextField label="Label" value={stat.label} onChange={(v) => {
              const newStats = [...h.stats]; newStats[i] = { ...newStats[i], label: v }; updateHome({ stats: newStats })
            }} /></div>
            <RemoveButton onClick={() => { const newStats = h.stats.filter((_: StatItem, j: number) => j !== i); updateHome({ stats: newStats }) }} />
          </div>
        ))}
        <AddButton label="Add Stat" onClick={() => updateHome({ stats: [...h.stats, { value: '0', label: 'New Stat' }] })} />
      </SectionCard>
      <SectionCard title="Specializations">
        {h.specializations.map((tag: string, i: number) => (
          <div key={i} className="flex items-end gap-2">
            <div className="flex-1"><TextField label={`Tag ${i + 1}`} value={tag} onChange={(v) => {
              const newTags = [...h.specializations]; newTags[i] = v; updateHome({ specializations: newTags })
            }} /></div>
            <RemoveButton onClick={() => updateHome({ specializations: h.specializations.filter((_: string, j: number) => j !== i) })} />
          </div>
        ))}
        <AddButton label="Add Specialization" onClick={() => updateHome({ specializations: [...h.specializations, 'New Skill'] })} />
      </SectionCard>
    </div>
  )
}

function AboutEditor() {
  const { data, updateAbout } = usePortfolioStore()
  const a = data.about
  return (
    <div className="space-y-4">
      <SectionCard title="Headlines">
        <TextField label="Subtitle" value={a.subtitle} onChange={(v) => updateAbout({ subtitle: v })} />
        <TextField label="Headline (before accent)" value={a.headline} onChange={(v) => updateAbout({ headline: v })} />
        <TextField label="Accent Word" value={a.headlineAccent} onChange={(v) => updateAbout({ headlineAccent: v })} />
        <TextField label="Headline (after accent)" value={a.headlineSuffix} onChange={(v) => updateAbout({ headlineSuffix: v })} />
      </SectionCard>
      <SectionCard title="Biography">
        <TextField label="Paragraph 1" value={a.bio1} onChange={(v) => updateAbout({ bio1: v })} multiline />
        <TextField label="Paragraph 2" value={a.bio2} onChange={(v) => updateAbout({ bio2: v })} multiline />
      </SectionCard>
      <SectionCard title="Career Timeline">
        {a.timeline.map((item: TimelineItem, i: number) => (
          <div key={i} className="p-3 rounded-lg bg-glass/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-accent">Entry {i + 1}</span>
              <RemoveButton onClick={() => updateAbout({ timeline: a.timeline.filter((_: TimelineItem, j: number) => j !== i) })} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <TextField label="Year" value={item.year} onChange={(v) => {
                const t = [...a.timeline]; t[i] = { ...t[i], year: v }; updateAbout({ timeline: t })
              }} />
              <div className="col-span-2"><TextField label="Title" value={item.title} onChange={(v) => {
                const t = [...a.timeline]; t[i] = { ...t[i], title: v }; updateAbout({ timeline: t })
              }} /></div>
            </div>
            <TextField label="Description" value={item.desc} onChange={(v) => {
              const t = [...a.timeline]; t[i] = { ...t[i], desc: v }; updateAbout({ timeline: t })
            }} />
          </div>
        ))}
        <AddButton label="Add Timeline Entry" onClick={() => updateAbout({ timeline: [...a.timeline, { year: '2025', title: 'New Entry', desc: 'Description' }] })} />
      </SectionCard>
      <SectionCard title="Skills">
        {a.skills.map((item: SkillItem, i: number) => (
          <div key={i} className="flex items-end gap-2">
            <div className="flex-1"><TextField label={`Skill ${i + 1}`} value={item.skill} onChange={(v) => {
              const s = [...a.skills]; s[i] = { ...s[i], skill: v }; updateAbout({ skills: s })
            }} /></div>
            <div className="w-20"><NumberField label="Level %" value={item.level} onChange={(v) => {
              const s = [...a.skills]; s[i] = { ...s[i], level: v }; updateAbout({ skills: s })
            }} /></div>
            <RemoveButton onClick={() => updateAbout({ skills: a.skills.filter((_: SkillItem, j: number) => j !== i) })} />
          </div>
        ))}
        <AddButton label="Add Skill" onClick={() => updateAbout({ skills: [...a.skills, { skill: 'New Skill', level: 80 }] })} />
      </SectionCard>
    </div>
  )
}

function ProjectsEditor() {
  const { data, updateProjects } = usePortfolioStore()
  const p = data.projects
  return (
    <div className="space-y-4">
      <SectionCard title="Section Header">
        <TextField label="Subtitle" value={p.subtitle} onChange={(v) => updateProjects({ subtitle: v })} />
        <TextField label="Headline (before accent)" value={p.headline} onChange={(v) => updateProjects({ headline: v })} />
        <TextField label="Accent Word" value={p.headlineAccent} onChange={(v) => updateProjects({ headlineAccent: v })} />
      </SectionCard>
      {p.projects.map((project: ProjectItem, i: number) => (
        <SectionCard key={i} title={'Project: ' + (project.title || '#' + (i + 1))} defaultOpen={false}>
          <div className="flex justify-end">
            <RemoveButton onClick={() => updateProjects({ projects: p.projects.filter((_: ProjectItem, j: number) => j !== i) })} />
          </div>
          <TextField label="Title" value={project.title} onChange={(v) => {
            const pr = [...p.projects]; pr[i] = { ...pr[i], title: v }; updateProjects({ projects: pr })
          }} />
          <div className="grid grid-cols-2 gap-2">
            <TextField label="Category" value={project.category} onChange={(v) => {
              const pr = [...p.projects]; pr[i] = { ...pr[i], category: v }; updateProjects({ projects: pr })
            }} />
            <TextField label="Year" value={project.year} onChange={(v) => {
              const pr = [...p.projects]; pr[i] = { ...pr[i], year: v }; updateProjects({ projects: pr })
            }} />
          </div>

          {/* Cover Image Upload */}
          <ImageUploader
            label="Cover Image (drag & drop or browse)"
            value={project.image}
            onChange={(v) => {
              const pr = [...p.projects]; pr[i] = { ...pr[i], image: v }; updateProjects({ projects: pr })
            }}
          />
          <TextField label="Or enter image URL" value={project.image} onChange={(v) => {
            const pr = [...p.projects]; pr[i] = { ...pr[i], image: v }; updateProjects({ projects: pr })
          }} placeholder="/images/project1.jpg" />

          {/* Gallery Images */}
          <GalleryUploader
            label="Gallery Images"
            images={project.gallery || []}
            onChange={(imgs) => {
              const pr = [...p.projects]; pr[i] = { ...pr[i], gallery: imgs }; updateProjects({ projects: pr })
            }}
            maxImages={8}
          />

          <TextField label="Description" value={project.description} onChange={(v) => {
            const pr = [...p.projects]; pr[i] = { ...pr[i], description: v }; updateProjects({ projects: pr })
          }} multiline />
          <div className="grid grid-cols-3 gap-2">
            <TextField label="Floors" value={String(project.stats.floors)} onChange={(v) => {
              const pr = [...p.projects]; pr[i] = { ...pr[i], stats: { ...pr[i].stats, floors: v } }; updateProjects({ projects: pr })
            }} />
            <TextField label="Area" value={project.stats.area} onChange={(v) => {
              const pr = [...p.projects]; pr[i] = { ...pr[i], stats: { ...pr[i].stats, area: v } }; updateProjects({ projects: pr })
            }} />
            <TextField label="Status" value={project.stats.status} onChange={(v) => {
              const pr = [...p.projects]; pr[i] = { ...pr[i], stats: { ...pr[i].stats, status: v } }; updateProjects({ projects: pr })
            }} />
          </div>

          {/* Project Documents */}
          <MultiFileUploader
            label="Project Documents (blueprints, PDFs, specs)"
            files={project.documents || []}
            onChange={(docs) => {
              const pr = [...p.projects]; pr[i] = { ...pr[i], documents: docs }; updateProjects({ projects: pr })
            }}
            maxFiles={10}
          />
        </SectionCard>
      ))}
      <AddButton label="Add Project" onClick={() => updateProjects({
        projects: [...p.projects, {
          title: 'New Project', category: 'Category', year: '2025',
          image: '/images/project1.jpg', description: 'Project description.',
          stats: { floors: 10, area: '50,000 sqft', status: 'In Progress' },
          gallery: [],
          documents: [],
        }]
      })} />
    </div>
  )
}

function LearnEditor() {
  const { data, updateLearn } = usePortfolioStore()
  const l = data.learn
  return (
    <div className="space-y-4">
      <SectionCard title="Section Header">
        <TextField label="Subtitle" value={l.subtitle} onChange={(v) => updateLearn({ subtitle: v })} />
        <TextField label="Headline (before accent)" value={l.headline} onChange={(v) => updateLearn({ headline: v })} />
        <TextField label="Accent Word" value={l.headlineAccent} onChange={(v) => updateLearn({ headlineAccent: v })} />
      </SectionCard>
      <SectionCard title="Certifications">
        {l.certifications.map((cert: CertificationItem, i: number) => (
          <div key={i} className="p-3 rounded-lg bg-glass/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-accent">Cert {i + 1}</span>
              <RemoveButton onClick={() => updateLearn({ certifications: l.certifications.filter((_: CertificationItem, j: number) => j !== i) })} />
            </div>
            <TextField label="Name" value={cert.name} onChange={(v) => {
              const c = [...l.certifications]; c[i] = { ...c[i], name: v }; updateLearn({ certifications: c })
            }} />
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2"><TextField label="Issuer" value={cert.issuer} onChange={(v) => {
                const c = [...l.certifications]; c[i] = { ...c[i], issuer: v }; updateLearn({ certifications: c })
              }} /></div>
              <TextField label="Year" value={cert.year} onChange={(v) => {
                const c = [...l.certifications]; c[i] = { ...c[i], year: v }; updateLearn({ certifications: c })
              }} />
            </div>
            <FileUploader
              label="Upload Certificate"
              value={cert.document}
              onChange={(doc: UploadedFile | undefined) => {
                const c = [...l.certifications]; c[i] = { ...c[i], document: doc }; updateLearn({ certifications: c })
              }}
            />
          </div>
        ))}
        <AddButton label="Add Certification" onClick={() => updateLearn({ certifications: [...l.certifications, { name: 'New Certification', issuer: 'Issuer', year: '2025' }] })} />
      </SectionCard>
      <SectionCard title="Courses">
        {l.courses.map((course: CourseItem, i: number) => (
          <div key={i} className="p-3 rounded-lg bg-glass/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-accent">Course {i + 1}</span>
              <RemoveButton onClick={() => updateLearn({ courses: l.courses.filter((_: CourseItem, j: number) => j !== i) })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <TextField label="Course Name" value={course.name} onChange={(v) => {
                const c = [...l.courses]; c[i] = { ...c[i], name: v }; updateLearn({ courses: c })
              }} />
              <TextField label="Provider" value={course.provider} onChange={(v) => {
                const c = [...l.courses]; c[i] = { ...c[i], provider: v }; updateLearn({ courses: c })
              }} />
            </div>
            <div>
              <FieldLabel>Status</FieldLabel>
              <select
                value={course.status}
                onChange={(e) => {
                  const c = [...l.courses]; c[i] = { ...c[i], status: e.target.value as 'Completed' | 'In Progress' }; updateLearn({ courses: c })
                }}
                className="w-full text-xs bg-[rgba(255,255,255,0.04)] border border-[rgba(201,169,110,0.15)] rounded-lg px-2 py-[11px] text-[#f0ece4] outline-none"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
            <FileUploader
              label="Upload Course Certificate"
              value={course.document}
              onChange={(doc: UploadedFile | undefined) => {
                const c = [...l.courses]; c[i] = { ...c[i], document: doc }; updateLearn({ courses: c })
              }}
            />
          </div>
        ))}
        <AddButton label="Add Course" onClick={() => updateLearn({ courses: [...l.courses, { name: 'New Course', provider: 'Provider', status: 'In Progress' }] })} />
      </SectionCard>
      <SectionCard title="Publications">
        {l.publications.map((pub: PublicationItem, i: number) => (
          <div key={i} className="p-3 rounded-lg bg-glass/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-accent">Publication {i + 1}</span>
              <RemoveButton onClick={() => updateLearn({ publications: l.publications.filter((_: PublicationItem, j: number) => j !== i) })} />
            </div>
            <TextField label="Title" value={pub.title} onChange={(v) => {
              const pubs = [...l.publications]; pubs[i] = { ...pubs[i], title: v }; updateLearn({ publications: pubs })
            }} multiline />
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2"><TextField label="Journal" value={pub.journal} onChange={(v) => {
                const pubs = [...l.publications]; pubs[i] = { ...pubs[i], journal: v }; updateLearn({ publications: pubs })
              }} /></div>
              <TextField label="Year" value={pub.year} onChange={(v) => {
                const pubs = [...l.publications]; pubs[i] = { ...pubs[i], year: v }; updateLearn({ publications: pubs })
              }} />
            </div>
            <FileUploader
              label="Upload Publication PDF"
              value={pub.document}
              onChange={(doc: UploadedFile | undefined) => {
                const pubs = [...l.publications]; pubs[i] = { ...pubs[i], document: doc }; updateLearn({ publications: pubs })
              }}
            />
          </div>
        ))}
        <AddButton label="Add Publication" onClick={() => updateLearn({ publications: [...l.publications, { title: 'New Publication', journal: 'Journal', year: '2025' }] })} />
      </SectionCard>
    </div>
  )
}

function ContactEditor() {
  const { data, updateContact } = usePortfolioStore()
  const c = data.contact
  return (
    <div className="space-y-4">
      <SectionCard title="Section Header">
        <TextField label="Subtitle" value={c.subtitle} onChange={(v) => updateContact({ subtitle: v })} />
        <TextField label="Headline (before accent)" value={c.headline} onChange={(v) => updateContact({ headline: v })} />
        <TextField label="Accent Word" value={c.headlineAccent} onChange={(v) => updateContact({ headlineAccent: v })} />
        <TextField label="Headline (after accent)" value={c.headlineSuffix} onChange={(v) => updateContact({ headlineSuffix: v })} />
      </SectionCard>
      <SectionCard title="Contact Information">
        {c.contactInfo.map((info: ContactInfoItem, i: number) => (
          <div key={i} className="flex items-end gap-2">
            <div className="w-24">
              <FieldLabel>Icon</FieldLabel>
              <select
                value={info.icon}
                onChange={(e) => {
                  const ci = [...c.contactInfo]; ci[i] = { ...ci[i], icon: e.target.value as ContactInfoItem['icon'] }; updateContact({ contactInfo: ci })
                }}
                className="w-full text-xs bg-[rgba(255,255,255,0.04)] border border-[rgba(201,169,110,0.15)] rounded-lg px-2 py-[11px] text-[#f0ece4] outline-none"
              >
                <option value="MapPin">📍 Location</option>
                <option value="Mail">✉️ Email</option>
                <option value="Phone">📞 Phone</option>
              </select>
            </div>
            <div className="flex-1"><TextField label="Label" value={info.label} onChange={(v) => {
              const ci = [...c.contactInfo]; ci[i] = { ...ci[i], label: v }; updateContact({ contactInfo: ci })
            }} /></div>
            <div className="flex-1"><TextField label="Value" value={info.value} onChange={(v) => {
              const ci = [...c.contactInfo]; ci[i] = { ...ci[i], value: v }; updateContact({ contactInfo: ci })
            }} /></div>
            <RemoveButton onClick={() => updateContact({ contactInfo: c.contactInfo.filter((_: ContactInfoItem, j: number) => j !== i) })} />
          </div>
        ))}
        <AddButton label="Add Contact Info" onClick={() => updateContact({ contactInfo: [...c.contactInfo, { icon: 'Mail', label: 'New', value: 'value' }] })} />
      </SectionCard>
      <SectionCard title="Availability">
        <TextField label="Availability Text" value={c.availabilityText} onChange={(v) => updateContact({ availabilityText: v })} />
        <TextField label="Response Time" value={c.responseTime} onChange={(v) => updateContact({ responseTime: v })} />
      </SectionCard>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN EDITOR PANEL (with Auth)
   ═══════════════════════════════════════════ */

export default function DataEditor() {
  // Visibility: gear button is hidden until secret shortcut is pressed
  const [isRevealed, setIsRevealed] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('profile')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data, setFullData, resetToDefaults } = usePortfolioStore()
  const { isAuthenticated, logout } = useAuthStore()

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  // Secret keyboard shortcut: Ctrl+Shift+E to reveal the gear button
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
      e.preventDefault()
      setIsRevealed(true)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // If already authenticated from a previous session, auto-reveal
  useEffect(() => {
    if (isAuthenticated) setIsRevealed(true)
  }, [isAuthenticated])

  // Handle gear click
  const handleGearClick = () => {
    if (isAuthenticated) {
      setIsOpen(true)
    } else {
      setShowLogin(true)
    }
  }

  // After successful login, open the editor
  useEffect(() => {
    if (isAuthenticated && showLogin) {
      setShowLogin(false)
      setIsOpen(true)
    }
  }, [isAuthenticated, showLogin])

  // Handle logout
  const handleLogout = () => {
    logout()
    setIsOpen(false)
    setIsRevealed(false)
    showToast('Logged out')
  }

  // Export JSON
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'portfolio-data.json'
    a.click()
    URL.revokeObjectURL(url)
    showToast('Data exported!')
  }

  // Import JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string)
        const merged = {
          profile: { ...defaultPortfolioData.profile, ...imported.profile },
          home: { ...defaultPortfolioData.home, ...imported.home },
          about: { ...defaultPortfolioData.about, ...imported.about },
          projects: { ...defaultPortfolioData.projects, ...imported.projects },
          learn: { ...defaultPortfolioData.learn, ...imported.learn },
          contact: { ...defaultPortfolioData.contact, ...imported.contact },
        }
        setFullData(merged)
        showToast('Data imported successfully!')
      } catch {
        showToast('Error: Invalid JSON file')
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleReset = () => {
    resetToDefaults()
    setShowResetConfirm(false)
    showToast('Reset to defaults!')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileEditor />
      case 'home': return <HomeEditor />
      case 'about': return <AboutEditor />
      case 'projects': return <ProjectsEditor />
      case 'learn': return <LearnEditor />
      case 'contact': return <ContactEditor />
      case 'deploy': return <DeployGuide />
    }
  }

  return (
    <>
      {/* Toggle Button — HIDDEN until Ctrl+Shift+E is pressed */}
      <AnimatePresence>
        {isRevealed && (
          <motion.button
            onClick={handleGearClick}
            className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full glass glow-accent flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group lg:bottom-6"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            title={isAuthenticated ? 'Open Editor' : 'Admin Login'}
          >
            {isAuthenticated ? (
              <Settings size={18} className="text-accent" />
            ) : (
              <Lock size={18} className="text-accent" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Login Screen */}
      <AnimatePresence>
        {showLogin && !isAuthenticated && (
          <LoginScreen onClose={() => setShowLogin(false)} />
        )}
      </AnimatePresence>

      {/* Editor Panel — only renders when authenticated */}
      <AnimatePresence>
        {isOpen && isAuthenticated && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed z-[70] top-0 bottom-0 left-0 w-full sm:w-[520px] lg:w-[580px] bg-bg-dark/95 backdrop-blur-xl border-r border-glass-border flex flex-col"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-glass-border shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <ShieldCheck size={15} className="text-accent" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-text-primary tracking-wide">Data Editor</h2>
                    <p className="text-[9px] font-mono text-green-400/70 tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Authenticated
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-[10px] font-mono text-red-400/70 tracking-wider uppercase transition-colors cursor-pointer"
                    title="Log out"
                  >
                    <LogOut size={11} /> Logout
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-lg bg-glass-hover flex items-center justify-center hover:bg-accent/20 transition-colors cursor-pointer"
                  >
                    <X size={14} className="text-text-secondary" />
                  </button>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-glass-border shrink-0 flex-wrap">
                <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-glass hover:bg-glass-hover text-[10px] font-mono text-text-secondary tracking-wider uppercase transition-colors cursor-pointer">
                  <Download size={11} /> Export
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-glass hover:bg-glass-hover text-[10px] font-mono text-text-secondary tracking-wider uppercase transition-colors cursor-pointer">
                  <Upload size={11} /> Import
                </button>
                <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
                <button onClick={() => setShowChangePassword(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-glass hover:bg-glass-hover text-[10px] font-mono text-text-secondary tracking-wider uppercase transition-colors cursor-pointer">
                  <KeyRound size={11} /> Password
                </button>
                <div className="flex-1" />
                {!showResetConfirm ? (
                  <button onClick={() => setShowResetConfirm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-[10px] font-mono text-red-400/70 tracking-wider uppercase transition-colors cursor-pointer">
                    <RotateCcw size={11} /> Reset
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-red-400 mr-1"><AlertTriangle size={10} className="inline" /> Sure?</span>
                    <button onClick={handleReset} className="px-2 py-1 rounded bg-red-500/20 text-[10px] text-red-400 cursor-pointer hover:bg-red-500/30 transition-colors">
                      <Check size={10} className="inline" /> Yes
                    </button>
                    <button onClick={() => setShowResetConfirm(false)} className="px-2 py-1 rounded bg-glass text-[10px] text-text-muted cursor-pointer hover:bg-glass-hover transition-colors">
                      <X size={10} className="inline" /> No
                    </button>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-0 px-5 pt-3 border-b border-glass-border shrink-0 overflow-x-auto">
                {TABS.map((tab) => {
                  const tabClass = activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-muted hover:text-text-secondary'
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={"flex items-center gap-1.5 px-3 py-2.5 text-[10px] font-mono tracking-wider uppercase transition-all cursor-pointer border-b-2 shrink-0 " + tabClass}
                    >
                      <tab.icon size={12} />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {renderTabContent()}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-glass-border shrink-0">
                <p className="text-[9px] font-mono text-text-muted text-center tracking-wider">
                  🔒 Owner-only access • Changes auto-save • Export JSON for backup
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showChangePassword && (
          <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-20 left-1/2 z-[80] -translate-x-1/2 px-5 py-2.5 rounded-xl glass glow-accent"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
          >
            <p className="text-xs font-medium text-accent flex items-center gap-2">
              <Check size={14} /> {toast}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
