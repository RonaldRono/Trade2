import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CmsSection } from '../../types/cms'
import type { TerminalAsset } from '../../types/sections'
import { emitToast } from '../../utils/toast'
import { playEagleSound } from '../../utils/sound'

interface TerminalSectionProps {
  section: CmsSection
}

const TIMEFRAMES = ['M1', 'M5', 'M15']
const SERIES_LENGTH = 90

interface SpikeEvent {
  id: number
  index: number
  direction: 'up' | 'down'
  points: number
}

interface SimulationProps {
  asset: TerminalAsset
  timeframe: string
  showPrimeSpike: boolean
  showRadar: boolean
  soundEnabled: boolean
  registerTrigger: (trigger: (() => void) | null) => void
  onPriceUpdate?: (price: number) => void
}

function buildSeries(asset: TerminalAsset): number[] {
  const next: number[] = []
  let price = asset.base

  for (let i = 0; i < SERIES_LENGTH; i += 1) {
    price += (Math.random() - 0.5) * asset.volatility * 0.6
    next.push(price)
  }

  return next
}

function TerminalSimulation({
  asset,
  timeframe,
  showPrimeSpike,
  showRadar,
  soundEnabled,
  registerTrigger,
  onPriceUpdate,
}: SimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const spikeCounter = useRef(0)
  const spikeId = useRef(0)

  const [series, setSeries] = useState<number[]>(() => buildSeries(asset))
  const [spikes, setSpikes] = useState<SpikeEvent[]>([])
  const [banner, setBanner] = useState<string | null>(null)
  const [velocity, setVelocity] = useState(18.2)
  const [probability, setProbability] = useState(94.8)

  const fireSpike = useCallback(
    (direction: 'up' | 'down') => {
      const points = Math.round(asset.volatility * (2.6 + Math.random() * 1.8))
      const magnitude = direction === 'up' ? points : -points

      setSeries((prev) => {
        const last = prev[prev.length - 1] ?? asset.base
        const nextPrice = last + magnitude
        onPriceUpdate?.(nextPrice)
        return [...prev.slice(1), nextPrice]
      })

      spikeId.current += 1
      setSpikes((prev) => [
        ...prev.slice(-6),
        { id: spikeId.current, index: SERIES_LENGTH - 1, direction, points },
      ])

      playEagleSound('spike', soundEnabled)

      setBanner(
        `EAGLE VIX SPIKE DETECTED ON ${asset.label} · ${direction === 'up' ? '+' : '-'}${points} POINTS CAPTURED`,
      )
      setProbability(Math.min(99.9, 94 + Math.random() * 5))

      setTimeout(() => setBanner(null), 4200)
    },
    [asset, soundEnabled, onPriceUpdate],
  )

  useEffect(() => {
    registerTrigger(() => fireSpike(asset.drift >= 0 ? 'up' : 'down'))
    return () => registerTrigger(null)
  }, [asset, fireSpike, registerTrigger])

  useEffect(() => {
    const interval = setInterval(() => {
      if (spikeCounter.current <= 0) {
        spikeCounter.current = 14 + Math.floor(Math.random() * 10)
        fireSpike(asset.drift >= 0 ? 'up' : 'down')
        return
      }

      spikeCounter.current -= 1

      setSeries((prev) => {
        if (prev.length === 0) return prev
        const last = prev[prev.length - 1]
        const next = last + (Math.random() - 0.49) * asset.volatility * 0.7 + asset.drift * 0.2
        onPriceUpdate?.(next)
        return [...prev.slice(1), next]
      })

      setVelocity(12 + Math.random() * 12)
      setProbability(Math.max(78, Math.min(99.9, 88 + Math.random() * 10)))
    }, 260)

    return () => clearInterval(interval)
  }, [asset, fireSpike, onPriceUpdate])

  const price = series.length ? series[series.length - 1] : asset.base

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const ratio = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    canvas.width = width * ratio
    canvas.height = height * ratio
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.clearRect(0, 0, width, height)

    const padding = { top: 24, right: 24, bottom: 30, left: 24 }
    const plotWidth = width - padding.left - padding.right
    const plotHeight = height - padding.top - padding.bottom

    const min = Math.min(...series)
    const max = Math.max(...series)
    const span = Math.max(1, max - min)

    // Background Subtle Grid Lines
    context.strokeStyle = 'rgba(233, 238, 246, 0.05)'
    context.lineWidth = 1

    for (let i = 0; i < 5; i += 1) {
      const y = padding.top + (plotHeight / 4) * i
      context.beginPath()
      context.moveTo(padding.left, y)
      context.lineTo(width - padding.right, y)
      context.stroke()

      const levelPrice = max - (span / 4) * i
      context.fillStyle = 'rgba(139, 152, 171, 0.5)'
      context.font = '10px jetbrains-mono, monospace'
      context.fillText(levelPrice.toFixed(1), width - padding.right - 54, y - 4)
    }

    // Chart Gradient Fill
    const gradient = context.createLinearGradient(0, padding.top, 0, height - padding.bottom)
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.22)')
    gradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.08)')
    gradient.addColorStop(1, 'rgba(14, 165, 233, 0)')

    context.beginPath()
    series.forEach((val, index) => {
      const x = padding.left + (plotWidth / (series.length - 1)) * index
      const y = padding.top + plotHeight - ((val - min) / span) * plotHeight
      if (index === 0) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y)
      }
    })

    context.lineTo(padding.left + plotWidth, padding.top + plotHeight)
    context.lineTo(padding.left, padding.top + plotHeight)
    context.closePath()
    context.fillStyle = gradient
    context.fill()

    // Price Line
    context.beginPath()
    series.forEach((val, index) => {
      const x = padding.left + (plotWidth / (series.length - 1)) * index
      const y = padding.top + plotHeight - ((val - min) / span) * plotHeight
      if (index === 0) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y)
      }
    })
    context.strokeStyle = '#00F0FF'
    context.lineWidth = 2
    context.stroke()

    // Current Price Pulsing Dot
    if (series.length > 0) {
      const lastX = padding.left + plotWidth
      const lastY = padding.top + plotHeight - ((series[series.length - 1] - min) / span) * plotHeight

      context.fillStyle = '#00F0FF'
      context.beginPath()
      context.arc(lastX, lastY, 4, 0, Math.PI * 2)
      context.fill()

      context.strokeStyle = 'rgba(0, 240, 255, 0.5)'
      context.lineWidth = 1.5
      context.beginPath()
      context.arc(lastX, lastY, 8, 0, Math.PI * 2)
      context.stroke()
    }

    // Eagle Vix Spike Indicators
    if (showPrimeSpike) {
      spikes.forEach((spike) => {
        const x = padding.left + (plotWidth / (series.length - 1)) * spike.index
        const val = series[spike.index] ?? min
        const y = padding.top + plotHeight - ((val - min) / span) * plotHeight

        context.fillStyle = spike.direction === 'up' ? '#34d399' : '#fb7185'
        context.beginPath()
        if (spike.direction === 'up') {
          context.moveTo(x, y - 20)
          context.lineTo(x - 7, y - 8)
          context.lineTo(x + 7, y - 8)
        } else {
          context.moveTo(x, y + 20)
          context.lineTo(x - 7, y + 8)
          context.lineTo(x + 7, y + 8)
        }
        context.closePath()
        context.fill()

        context.strokeStyle = spike.direction === 'up' ? '#34d399' : '#fb7185'
        context.lineWidth = 1.5
        context.beginPath()
        context.moveTo(x, y - 24)
        context.lineTo(x, y - 36)
        context.stroke()

        context.fillStyle = 'rgba(233, 238, 246, 0.95)'
        context.font = 'bold 10px jetbrains-mono, monospace'
        context.fillText('EVIX SPIKE', x - 24, y - 42)
      })
    }

    // Radar Gauge
    if (showRadar) {
      const cx = width - padding.right - 62
      const cy = padding.top + 62
      const radius = 44

      context.strokeStyle = 'rgba(233, 238, 246, 0.12)'
      context.lineWidth = 8
      context.beginPath()
      context.arc(cx, cy, radius, Math.PI * 0.75, Math.PI * 2.25)
      context.stroke()

      context.strokeStyle = '#34d399'
      context.lineWidth = 8
      context.beginPath()
      context.arc(cx, cy, radius, Math.PI * 0.75, Math.PI * 0.75 + Math.PI * 1.5 * (probability / 100))
      context.stroke()

      context.fillStyle = '#e9eef6'
      context.font = 'bold 13px jetbrains-mono, monospace'
      context.textAlign = 'center'
      context.fillText(`${probability.toFixed(1)}%`, cx, cy + 4)
      context.font = '9px jetbrains-mono, monospace'
      context.fillStyle = '#8b98ab'
      context.fillText('SPIKE PROB.', cx, cy + 18)
      context.textAlign = 'left'
    }
  }, [series, spikes, showPrimeSpike, showRadar, probability])

  const hudRows = useMemo(
    () => [
      { key: 'Cluster Accum', value: `HIGH (${(probability - 0.6).toFixed(1)}%)`, tone: 'green' },
      { key: 'Tick Velocity', value: `${velocity.toFixed(1)} ticks/s`, tone: 'accent' },
      { key: 'Suggested SL', value: '-14 ticks', tone: 'accent' },
      { key: 'Target Spike', value: `+${Math.round(asset.volatility * 1.6)} Pts`, tone: 'green' },
    ],
    [probability, velocity, asset],
  )

  return (
    <>
      <div className="terminal__canvas-wrap">
        <canvas ref={canvasRef} className="terminal__canvas" />

        {banner && <div className="terminal__banner">{banner}</div>}

        <div className="terminal__hud">
          <div className="terminal__hud-title">EAGLE VIX Radar HUD</div>
          {hudRows.map((row) => (
            <div key={row.key} className="terminal__hud-row">
              <span className="terminal__hud-key">{row.key}</span>
              <span
                className={`terminal__hud-value${row.tone === 'green' ? ' terminal__hud-value--green' : ''}`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="terminal__footer">
        <span>
          {asset.label} Index · Tick: {price.toFixed(2)} · Spread: 0.05 Pts · Spike Probability:{' '}
          {probability.toFixed(1)}% · VPS Bridge 12ms · {timeframe}
        </span>
        <span className="text-dim">Simulating real-time micro-tick liquidity clusters</span>
      </div>
    </>
  )
}

export default function TerminalSection({ section }: TerminalSectionProps) {
  const payload = section as unknown as { assets?: TerminalAsset[] }
  const assets = payload.assets ?? []

  const [assetIndex, setAssetIndex] = useState(0)
  const [timeframe, setTimeframe] = useState('M1')
  const [showPrimeSpike, setShowPrimeSpike] = useState(true)
  const [showRadar, setShowRadar] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [livePrice, setLivePrice] = useState(0)
  const [simPosition, setSimPosition] = useState<{
    type: 'BUY' | 'SELL'
    entry: number
    lot: number
    assetLabel: string
  } | null>(null)

  const triggerRef = useRef<(() => void) | null>(null)

  const asset = assets[assetIndex] ?? assets[0]
  const registerTrigger = useCallback((trigger: (() => void) | null) => {
    triggerRef.current = trigger
  }, [])

  if (!asset) return null

  const livePnL = simPosition
    ? (simPosition.type === 'BUY'
        ? (livePrice - simPosition.entry)
        : (simPosition.entry - livePrice)) * simPosition.lot * 1.5
    : 0

  const handleOpenPosition = (type: 'BUY' | 'SELL') => {
    playEagleSound('order', soundEnabled)
    const entry = livePrice || asset.base
    setSimPosition({
      type,
      entry,
      lot: 2.0,
      assetLabel: asset.label,
    })
    emitToast({
      title: `${type} Position Executed`,
      message: `Opened 2.0 Lots on ${asset.label} @ ${entry.toFixed(2)}`,
      type: 'info',
    })
  }

  const handleClosePosition = () => {
    if (!simPosition) return
    playEagleSound(livePnL >= 0 ? 'success' : 'click', soundEnabled)
    const pnlFormatted = livePnL >= 0 ? `+$${livePnL.toFixed(2)}` : `-$${Math.abs(livePnL).toFixed(2)}`
    emitToast({
      title: 'Position Closed',
      message: `Final Result: ${pnlFormatted} USD on ${simPosition.assetLabel}`,
      type: livePnL >= 0 ? 'success' : 'amber',
    })
    setSimPosition(null)
  }

  const handleTakeSnapshot = () => {
    playEagleSound('click', soundEnabled)
    const textLog = `EAGLE VIX SOLUTIONS — TERMINAL SNAPSHOT
Asset: ${asset.label}
Timeframe: ${timeframe}
Current Price: ${(livePrice || asset.base).toFixed(2)}
Spike AI: ${showPrimeSpike ? 'Active' : 'Disabled'}
Latency: 12ms VPS Bridge
Simulated PnL: $${livePnL.toFixed(2)} USD
Timestamp: ${new Date().toISOString()}`

    navigator.clipboard?.writeText(textLog)
    emitToast({
      title: 'Snapshot Log Copied',
      message: 'Terminal telemetry copied to clipboard. Ready to export.',
      type: 'success',
    })
  }

  return (
    <section className="section section--spacious">
      <div className="shell">
        <div className="terminal">
          <div className="terminal__toolbar">
            <div className="terminal__toolbar-group">
              {assets.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={`chip${assetIndex === index ? ' is-active' : ''}`}
                  onClick={() => {
                    playEagleSound('click', soundEnabled)
                    setAssetIndex(index)
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="terminal__toolbar-group">
              {TIMEFRAMES.map((frame) => (
                <button
                  key={frame}
                  type="button"
                  className={`chip${timeframe === frame ? ' is-active' : ''}`}
                  onClick={() => {
                    playEagleSound('click', soundEnabled)
                    setTimeframe(frame)
                  }}
                >
                  {frame}
                </button>
              ))}
            </div>

            <div className="terminal__toolbar-group">
              <button
                type="button"
                className={`chip${showPrimeSpike ? ' is-active' : ''}`}
                onClick={() => {
                  playEagleSound('click', soundEnabled)
                  setShowPrimeSpike((value) => !value)
                }}
              >
                Prime Spike AI
              </button>
              <button
                type="button"
                className={`chip${showRadar ? ' is-active' : ''}`}
                onClick={() => {
                  playEagleSound('click', soundEnabled)
                  setShowRadar((value) => !value)
                }}
              >
                Radar HUD
              </button>
              <button
                type="button"
                className={`chip${soundEnabled ? ' is-active' : ''}`}
                onClick={() => {
                  setSoundEnabled((v) => !v)
                  playEagleSound('click', !soundEnabled)
                }}
                title="Toggle Web Audio Sound"
              >
                {soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF'}
              </button>
            </div>
          </div>

          <TerminalSimulation
            key={asset.id}
            asset={asset}
            timeframe={timeframe}
            showPrimeSpike={showPrimeSpike}
            showRadar={showRadar}
            soundEnabled={soundEnabled}
            registerTrigger={registerTrigger}
            onPriceUpdate={setLivePrice}
          />

          {/* Interactive Live Paper Trading Bar */}
          <div className="terminal__trade-bar">
            <div className="terminal__trade-info">
              <span className="fs-mono text-dim">Virtual Execution Desk:</span>
              {simPosition ? (
                <span
                  className={`terminal__pnl-badge ${livePnL >= 0 ? 'text-green' : 'text-amber'}`}
                  style={{ fontWeight: 'bold' }}
                >
                  {simPosition.type} 2.0 Lots @ {simPosition.entry.toFixed(2)} | PnL: {livePnL >= 0 ? '+' : ''}${livePnL.toFixed(2)} USD
                </span>
              ) : (
                <span className="text-dim">No open orders. Select direction to paper test:</span>
              )}
            </div>

            <div className="terminal__trade-actions">
              {!simPosition ? (
                <>
                  <button
                    type="button"
                    className="button"
                    style={{ background: '#059669', borderColor: '#10B981', padding: '0.5rem 1.2rem' }}
                    onClick={() => handleOpenPosition('BUY')}
                  >
                    ▲ BUY SPIKE (2.0)
                  </button>
                  <button
                    type="button"
                    className="button"
                    style={{ background: '#DC2626', borderColor: '#EF4444', padding: '0.5rem 1.2rem' }}
                    onClick={() => handleOpenPosition('SELL')}
                  >
                    ▼ SELL SPIKE (2.0)
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="button button--ghost"
                  style={{ borderColor: '#F59E0B', color: '#FCD34D' }}
                  onClick={handleClosePosition}
                >
                  ✕ Close Position ({livePnL >= 0 ? '+' : ''}${livePnL.toFixed(2)})
                </button>
              )}
            </div>
          </div>

          <div className="terminal__footer">
            <span className="text-dim">
              EAGLE VIX SOLUTIONS micro-tick algorithm stream. Ready for deployment on live MT5 terminals.
            </span>
            <div className="terminal__toolbar-group">
              <button
                type="button"
                className="button button--ghost"
                onClick={handleTakeSnapshot}
              >
                📷 Snapshot Log
              </button>
              <button
                type="button"
                className="button"
                onClick={() => {
                  triggerRef.current?.()
                }}
              >
                ⚡ Force Test Spike
              </button>
              <Link
                className="button button--ghost"
                to="/indicators"
                onClick={() => playEagleSound('click', soundEnabled)}
              >
                Install on your MT5
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
