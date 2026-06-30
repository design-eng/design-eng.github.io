import { create } from 'zustand'
import type { AudioController, AudioStatus } from '../lib/audio/audioController'

type LandingStore = {
  audioStatus: AudioStatus
  muted: boolean
  activePosterId: string
  reducedMotion: boolean
  audioController: AudioController | null
  setAudioController: (controller: AudioController | null) => void
  setAudioStatus: (status: AudioStatus) => void
  setMuted: (muted: boolean) => void
  setActivePoster: (posterId: string) => void
  setReducedMotion: (enabled: boolean) => void
}

export const useLandingStore = create<LandingStore>((set) => ({
  audioStatus: 'stopped',
  muted: false,
  activePosterId: 'blue-cover',
  reducedMotion: false,
  audioController: null,
  setAudioController: (controller) => set({ audioController: controller }),
  setAudioStatus: (audioStatus) => set({ audioStatus }),
  setMuted: (muted) => set({ muted }),
  setActivePoster: (activePosterId) => set({ activePosterId }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}))
