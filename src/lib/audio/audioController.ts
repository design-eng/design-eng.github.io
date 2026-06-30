export type AudioStatus = 'idle' | 'playing' | 'paused' | 'stopped'

export type AudioController = {
  play: () => Promise<void>
  pause: () => void
  stop: () => void
  setMuted: (muted: boolean) => void
  dispose: () => void
}

type CreateAudioControllerArgs = {
  src: string
  onStateChange?: (status: AudioStatus) => void
  onMuteChange?: (muted: boolean) => void
}

export function createAudioController({
  src,
  onStateChange,
  onMuteChange,
}: CreateAudioControllerArgs): AudioController {
  const audio = new Audio(src)
  audio.preload = 'auto'

  const updateState = (status: AudioStatus) => onStateChange?.(status)

  audio.addEventListener('play', () => updateState('playing'))
  audio.addEventListener('pause', () => {
    updateState(audio.currentTime === 0 || audio.ended ? 'stopped' : 'paused')
  })
  audio.addEventListener('ended', () => updateState('stopped'))
  audio.addEventListener('volumechange', () => onMuteChange?.(audio.muted))

  return {
    async play() {
      await audio.play()
      updateState('playing')
    },
    pause() {
      audio.pause()
      updateState('paused')
    },
    stop() {
      audio.pause()
      audio.currentTime = 0
      updateState('stopped')
    },
    setMuted(muted: boolean) {
      audio.muted = muted
      onMuteChange?.(muted)
    },
    dispose() {
      audio.pause()
      audio.src = ''
    },
  }
}
