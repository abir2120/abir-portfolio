/**
 * Portfolio Data Store (Zustand)
 * 
 * Centralized state management for all portfolio data.
 * - Loads from localStorage on init (if user has edited via the panel)
 * - Falls back to defaults from portfolioData.ts
 * - Provides update methods for each section
 * - Auto-persists to localStorage on every change
 */

import { create } from 'zustand'
import {
  defaultPortfolioData,
} from '../data/portfolioData'
import type {
  PortfolioData,
  ProfileData,
  HomeData,
  AboutData,
  ProjectsData,
  LearnData,
  ContactData,
} from '../data/portfolioData'

const STORAGE_KEY = 'ma-portfolio-data'

function loadFromStorage(): PortfolioData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Deep merge with defaults so new fields are always present
      return {
        profile: { ...defaultPortfolioData.profile, ...parsed.profile },
        home: { ...defaultPortfolioData.home, ...parsed.home },
        about: { ...defaultPortfolioData.about, ...parsed.about },
        projects: { ...defaultPortfolioData.projects, ...parsed.projects },
        learn: { ...defaultPortfolioData.learn, ...parsed.learn },
        contact: { ...defaultPortfolioData.contact, ...parsed.contact },
      }
    }
  } catch {
    // Ignore parse errors
  }
  return { ...defaultPortfolioData }
}

function saveToStorage(data: PortfolioData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore quota errors
  }
}

interface PortfolioStore {
  data: PortfolioData
  updateProfile: (profile: Partial<ProfileData>) => void
  updateHome: (home: Partial<HomeData>) => void
  updateAbout: (about: Partial<AboutData>) => void
  updateProjects: (projects: Partial<ProjectsData>) => void
  updateLearn: (learn: Partial<LearnData>) => void
  updateContact: (contact: Partial<ContactData>) => void
  setFullData: (data: PortfolioData) => void
  resetToDefaults: () => void
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  data: loadFromStorage(),

  updateProfile: (profile) =>
    set((state) => {
      const newData = { ...state.data, profile: { ...state.data.profile, ...profile } }
      saveToStorage(newData)
      return { data: newData }
    }),

  updateHome: (home) =>
    set((state) => {
      const newData = { ...state.data, home: { ...state.data.home, ...home } }
      saveToStorage(newData)
      return { data: newData }
    }),

  updateAbout: (about) =>
    set((state) => {
      const newData = { ...state.data, about: { ...state.data.about, ...about } }
      saveToStorage(newData)
      return { data: newData }
    }),

  updateProjects: (projects) =>
    set((state) => {
      const newData = { ...state.data, projects: { ...state.data.projects, ...projects } }
      saveToStorage(newData)
      return { data: newData }
    }),

  updateLearn: (learn) =>
    set((state) => {
      const newData = { ...state.data, learn: { ...state.data.learn, ...learn } }
      saveToStorage(newData)
      return { data: newData }
    }),

  updateContact: (contact) =>
    set((state) => {
      const newData = { ...state.data, contact: { ...state.data.contact, ...contact } }
      saveToStorage(newData)
      return { data: newData }
    }),

  setFullData: (data) =>
    set(() => {
      saveToStorage(data)
      return { data }
    }),

  resetToDefaults: () =>
    set(() => {
      localStorage.removeItem(STORAGE_KEY)
      return { data: { ...defaultPortfolioData } }
    }),
}))
