/**
 * Deploy Guide Component
 * Step-by-step instructions to host the portfolio online.
 * Accessible from the Data Editor panel as a new tab.
 */

import { useState } from 'react'
import {
  Globe, Github, Upload, Copy, Check,
  ExternalLink, ChevronDown, ChevronRight, Zap, Server, Cloud
} from 'lucide-react'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-accent/10 text-text-muted hover:text-accent transition-colors cursor-pointer shrink-0"
      title="Copy"
    >
      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
    </button>
  )
}

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  return (
    <div className="rounded-lg bg-[#0d1117] border border-glass-border overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-glass-border">
        <span className="text-[9px] font-mono text-text-muted">{language}</span>
        <CopyButton text={code} />
      </div>
      <pre className="px-3 py-2.5 text-[11px] font-mono text-green-300/80 overflow-x-auto leading-relaxed whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  )
}

function StepCard({ step, title, children, defaultOpen = false }: {
  step: number; title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-glass-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-glass-hover/30 hover:bg-glass-hover transition-colors cursor-pointer"
      >
        <span className="w-6 h-6 rounded-full bg-accent/15 text-accent text-[10px] font-mono flex items-center justify-center shrink-0">
          {step}
        </span>
        <span className="text-xs font-medium text-text-primary tracking-wide flex-1 text-left">{title}</span>
        {open ? <ChevronDown size={14} className="text-text-muted" /> : <ChevronRight size={14} className="text-text-muted" />}
      </button>
      {open && (
        <div className="px-4 py-3 border-t border-glass-border space-y-3 text-xs text-text-secondary leading-relaxed">
          {children}
        </div>
      )}
    </div>
  )
}

export default function DeployGuide() {
  const [activeMethod, setActiveMethod] = useState<'vercel' | 'netlify' | 'github'>('vercel')

  const handleDownloadProject = () => {
    // Export current portfolio data
    const dataStr = localStorage.getItem('ma-portfolio-data')
    const instructions = `
# M A Portfolio — Deployment Instructions
# ========================================
#
# Your portfolio is a static site built with Vite + React + Three.js.
# The built files in the "dist/" folder are all you need to host it.
#
# QUICK START:
# 1. Install Node.js (https://nodejs.org) — version 18+
# 2. Open terminal in this folder
# 3. Run: npm install
# 4. Run: npm run build
# 5. Upload the "dist/" folder to any hosting service
#
# YOUR SAVED DATA:
# If you edited content via the admin panel, your data is saved
# in your browser's localStorage. To transfer it:
# 1. Open the editor (Ctrl+Shift+E → login)
# 2. Click "Export" to download portfolio-data.json
# 3. On the new host, open the site → editor → "Import" the JSON
#
# HOSTING OPTIONS (all free):
# - Vercel: vercel.com (recommended, automatic HTTPS)
# - Netlify: netlify.com (drag & drop the dist folder)
# - GitHub Pages: pages.github.com (free with GitHub repo)
# - Cloudflare Pages: pages.cloudflare.com
`

    // Create a text file with instructions + data
    const content = instructions + (dataStr ? '\n\n# PORTFOLIO DATA BACKUP:\n# ' + dataStr : '')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'DEPLOY-INSTRUCTIONS.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const methods = [
    { id: 'vercel' as const, label: 'Vercel', icon: Zap, color: 'text-white' },
    { id: 'netlify' as const, label: 'Netlify', icon: Cloud, color: 'text-teal-400' },
    { id: 'github' as const, label: 'GitHub Pages', icon: Github, color: 'text-purple-400' },
  ]

  return (
    <div className="space-y-5">
      {/* Status Banner */}
      <div className="rounded-xl bg-green-500/8 border border-green-500/20 p-4">
        <div className="flex items-center gap-2 mb-1">
          <Globe size={14} className="text-green-400" />
          <p className="text-sm font-medium text-green-400">Your site is already live!</p>
        </div>
        <p className="text-[11px] text-green-300/60 leading-relaxed">
          This portfolio was deployed to Vercel automatically. You can visit it anytime from the URL shown in your browser.
          Below are instructions if you want to host it on your own domain or a different platform.
        </p>
      </div>

      {/* Download Instructions */}
      <button
        onClick={handleDownloadProject}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent/10 border border-accent/20 hover:bg-accent/15 transition-colors cursor-pointer"
      >
        <Upload size={14} className="text-accent" />
        <span className="text-xs font-medium text-accent tracking-wide">Download Deployment Instructions</span>
      </button>

      {/* Method Selector */}
      <div>
        <p className="text-[10px] font-mono text-accent tracking-widest uppercase mb-2">Choose Hosting Platform</p>
        <div className="flex gap-2">
          {methods.map((m) => {
            const isActive = activeMethod === m.id
            return (
              <button
                key={m.id}
                onClick={() => setActiveMethod(m.id)}
                className={
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-mono tracking-wider uppercase transition-all cursor-pointer border " +
                  (isActive
                    ? "bg-accent/10 border-accent/30 text-accent"
                    : "bg-glass border-glass-border text-text-muted hover:text-text-secondary hover:border-glass-hover")
                }
              >
                <m.icon size={12} />
                {m.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ═══ VERCEL ═══ */}
      {activeMethod === 'vercel' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-white" />
            <p className="text-sm font-medium text-text-primary">Deploy to Vercel</p>
            <span className="text-[8px] font-mono bg-green-500/15 text-green-400 px-1.5 py-0.5 rounded">RECOMMENDED</span>
          </div>

          <StepCard step={1} title="Create a GitHub repository" defaultOpen={true}>
            <p>Go to <strong className="text-text-primary">github.com</strong> and create a new repository.</p>
            <CodeBlock code={`# In your project folder, run:\ngit init\ngit add .\ngit commit -m "Initial commit"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git\ngit push -u origin main`} />
          </StepCard>

          <StepCard step={2} title="Connect to Vercel">
            <p>1. Go to <strong className="text-text-primary">vercel.com</strong> and sign up with GitHub</p>
            <p>2. Click <strong className="text-text-primary">"Add New Project"</strong></p>
            <p>3. Select your GitHub repository</p>
            <p>4. Vercel auto-detects Vite — just click <strong className="text-text-primary">"Deploy"</strong></p>
            <p className="text-accent/70">✓ That's it! Vercel gives you a free .vercel.app URL with HTTPS</p>
          </StepCard>

          <StepCard step={3} title="Add custom domain (optional)">
            <p>In your Vercel project dashboard:</p>
            <p>1. Go to <strong className="text-text-primary">Settings → Domains</strong></p>
            <p>2. Add your domain (e.g. <code className="text-accent bg-glass px-1 rounded">ma-engineer.com</code>)</p>
            <p>3. Update your domain's DNS records as shown by Vercel</p>
            <p className="text-accent/70">✓ Free SSL certificate included automatically</p>
          </StepCard>
        </div>
      )}

      {/* ═══ NETLIFY ═══ */}
      {activeMethod === 'netlify' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Cloud size={14} className="text-teal-400" />
            <p className="text-sm font-medium text-text-primary">Deploy to Netlify</p>
            <span className="text-[8px] font-mono bg-teal-500/15 text-teal-400 px-1.5 py-0.5 rounded">EASIEST</span>
          </div>

          <StepCard step={1} title="Build the project" defaultOpen={true}>
            <p>Open terminal in your project folder:</p>
            <CodeBlock code={`npm install\nnpm run build`} />
            <p>This creates a <code className="text-accent bg-glass px-1 rounded">dist/</code> folder with your site.</p>
          </StepCard>

          <StepCard step={2} title="Drag & drop to Netlify">
            <p>1. Go to <strong className="text-text-primary">app.netlify.com/drop</strong></p>
            <p>2. Simply <strong className="text-accent">drag the entire <code>dist</code> folder</strong> onto the page</p>
            <p>3. Done! Netlify gives you a live URL instantly</p>
            <p className="text-accent/70">✓ No account needed for the first deploy (but recommended)</p>
          </StepCard>

          <StepCard step={3} title="Or connect via GitHub">
            <p>1. Push your code to GitHub (same as Vercel step 1)</p>
            <p>2. In Netlify, click <strong className="text-text-primary">"Add new site → Import from Git"</strong></p>
            <p>3. Select your repo</p>
            <p>4. Set build command: <code className="text-accent bg-glass px-1 rounded">npm run build</code></p>
            <p>5. Set publish directory: <code className="text-accent bg-glass px-1 rounded">dist</code></p>
            <p>6. Click Deploy</p>
          </StepCard>
        </div>
      )}

      {/* ═══ GITHUB PAGES ═══ */}
      {activeMethod === 'github' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Github size={14} className="text-purple-400" />
            <p className="text-sm font-medium text-text-primary">Deploy to GitHub Pages</p>
            <span className="text-[8px] font-mono bg-purple-500/15 text-purple-400 px-1.5 py-0.5 rounded">FREE</span>
          </div>

          <StepCard step={1} title="Install gh-pages package" defaultOpen={true}>
            <CodeBlock code={`npm install --save-dev gh-pages`} />
          </StepCard>

          <StepCard step={2} title="Update vite.config.ts">
            <p>Add the <code className="text-accent bg-glass px-1 rounded">base</code> option:</p>
            <CodeBlock code={`// vite.config.ts\nimport { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({\n  plugins: [react()],\n  base: '/YOUR_REPO_NAME/',\n})`} language="typescript" />
          </StepCard>

          <StepCard step={3} title="Add deploy script to package.json">
            <CodeBlock code={`// In package.json → "scripts":\n"predeploy": "npm run build",\n"deploy": "gh-pages -d dist"`} language="json" />
          </StepCard>

          <StepCard step={4} title="Push & deploy">
            <CodeBlock code={`git add .\ngit commit -m "Setup GitHub Pages"\ngit push origin main\nnpm run deploy`} />
            <p>Your site will be live at:</p>
            <p className="text-accent font-mono">https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/</p>
          </StepCard>
        </div>
      )}

      {/* General Tips */}
      <div className="rounded-xl border border-glass-border p-4 space-y-2">
        <p className="text-[10px] font-mono text-accent tracking-widest uppercase flex items-center gap-1.5">
          <Server size={10} /> Important Notes
        </p>
        <ul className="space-y-1.5 text-[11px] text-text-secondary">
          <li className="flex gap-2">
            <span className="text-accent shrink-0">•</span>
            <span><strong className="text-text-primary">Transfer your edits:</strong> Open the editor → Export JSON → On the new site, Import the JSON file. This restores all your content, images, and documents.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent shrink-0">•</span>
            <span><strong className="text-text-primary">Custom domain:</strong> All three platforms support free custom domains. Buy a domain from Namecheap, Google Domains, or Cloudflare (~$10/year).</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent shrink-0">•</span>
            <span><strong className="text-text-primary">HTTPS:</strong> All platforms provide free SSL certificates automatically.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent shrink-0">•</span>
            <span><strong className="text-text-primary">Auto-deploy:</strong> Vercel & Netlify auto-redeploy when you push to GitHub. Edit code → push → live in ~60 seconds.</span>
          </li>
        </ul>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Vercel', url: 'https://vercel.com' },
          { label: 'Netlify', url: 'https://netlify.com' },
          { label: 'GitHub', url: 'https://github.com' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-glass border border-glass-border hover:border-accent/30 text-[10px] font-mono text-text-muted hover:text-accent tracking-wider transition-all"
          >
            {link.label} <ExternalLink size={9} />
          </a>
        ))}
      </div>
    </div>
  )
}
