// Web Audio API Synthesizer for EAGLE VIX SOLUTIONS
// Zero external dependencies, pure native browser audio

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export type SoundEffect = 'spike' | 'click' | 'success' | 'order' | 'reset'

export function playEagleSound(effect: SoundEffect = 'click', enabled: boolean = true) {
  if (!enabled) return

  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    if (effect === 'click') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(900, now)
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04)

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.05)
    } else if (effect === 'spike') {
      // High-energy spike radar ping
      const osc = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc2.type = 'sine'

      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(1480, now + 0.18)

      osc2.frequency.setValueAtTime(880, now)
      osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.18)

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

      osc.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc2.start(now)
      osc.stop(now + 0.36)
      osc2.stop(now + 0.36)
    } else if (effect === 'success') {
      // Two-tone chord
      const freqs = [523.25, 659.25, 783.99] // C5, E5, G5
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(f, now + idx * 0.06)

        gain.gain.setValueAtTime(0.08, now + idx * 0.06)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + idx * 0.06)
        osc.stop(now + idx * 0.06 + 0.26)
      })
    } else if (effect === 'order') {
      // Rapid institutional fill double-click
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1200, now)
      osc.frequency.setValueAtTime(1600, now + 0.05)

      gain.gain.setValueAtTime(0.1, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.13)
    } else if (effect === 'reset') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(400, now)
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.15)

      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.19)
    }
  } catch {
    // Audio context may be restricted by autoplay policy until user gesture
  }
}
