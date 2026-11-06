import { create } from 'zustand'

interface ScrollState {
  progress: number
  section: number
  setProgress: (p: number) => void
  setSection: (s: number) => void
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  section: 0,
  setProgress: (progress) => set({ progress }),
  setSection: (section) => set({ section }),
}))
