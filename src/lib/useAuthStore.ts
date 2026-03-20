/**
 * Authentication Store
 * 
 * Protects the Data Editor so only the owner can access it.
 * 
 * Security features:
 * - Password hashed with SHA-256 (never stored in plaintext)
 * - Session persisted to sessionStorage (cleared on tab close)
 * - Lockout after 5 failed attempts (60-second cooldown)
 * - Change password from within the editor
 * - Default password: "admin123" (change it on first login!)
 * 
 * The hash is stored in localStorage so it persists across deploys.
 * To reset password: clear localStorage key "ma-admin-hash"
 */

import { create } from 'zustand'

const HASH_KEY = 'ma-admin-hash'
const SESSION_KEY = 'ma-admin-session'
const MAX_ATTEMPTS = 5
const LOCKOUT_SECONDS = 60

// SHA-256 hash using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Default password hash for "admin123"
const DEFAULT_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'

function getStoredHash(): string {
  return localStorage.getItem(HASH_KEY) || DEFAULT_HASH
}

function isSessionActive(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'true'
}

interface AuthStore {
  isAuthenticated: boolean
  failedAttempts: number
  lockoutUntil: number | null
  errorMessage: string | null

  login: (password: string) => Promise<boolean>
  logout: () => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>
  getRemainingLockout: () => number
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: isSessionActive(),
  failedAttempts: 0,
  lockoutUntil: null,
  errorMessage: null,

  login: async (password: string) => {
    const state = get()

    // Check lockout
    if (state.lockoutUntil && Date.now() < state.lockoutUntil) {
      const remaining = Math.ceil((state.lockoutUntil - Date.now()) / 1000)
      set({ errorMessage: `Too many attempts. Try again in ${remaining}s` })
      return false
    }

    const inputHash = await hashPassword(password)
    const storedHash = getStoredHash()

    if (inputHash === storedHash) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      set({ isAuthenticated: true, failedAttempts: 0, lockoutUntil: null, errorMessage: null })
      return true
    } else {
      const newAttempts = state.failedAttempts + 1
      const isLocked = newAttempts >= MAX_ATTEMPTS
      set({
        failedAttempts: newAttempts,
        lockoutUntil: isLocked ? Date.now() + LOCKOUT_SECONDS * 1000 : null,
        errorMessage: isLocked
          ? `Account locked for ${LOCKOUT_SECONDS}s after ${MAX_ATTEMPTS} failed attempts`
          : `Incorrect password (${newAttempts}/${MAX_ATTEMPTS} attempts)`,
      })
      return false
    }
  },

  logout: () => {
    sessionStorage.removeItem(SESSION_KEY)
    set({ isAuthenticated: false, errorMessage: null })
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    if (newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters' }
    }

    const currentHash = await hashPassword(currentPassword)
    const storedHash = getStoredHash()

    if (currentHash !== storedHash) {
      return { success: false, message: 'Current password is incorrect' }
    }

    const newHash = await hashPassword(newPassword)
    localStorage.setItem(HASH_KEY, newHash)
    return { success: true, message: 'Password changed successfully!' }
  },

  getRemainingLockout: () => {
    const state = get()
    if (!state.lockoutUntil) return 0
    return Math.max(0, Math.ceil((state.lockoutUntil - Date.now()) / 1000))
  },
}))
