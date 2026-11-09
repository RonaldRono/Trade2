import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { CmsSection } from '../../types/cms'
import type { CalculatorAsset } from '../../types/sections'
import { CalculatorIcon, ZapIcon } from '../Icons'
import { playEagleSound } from '../../utils/sound'
import { emitToast } from '../../utils/toast'

interface CalculatorSectionProps {
  section: CmsSection
}

const LOT_PRESETS = [0.5, 1.0, 2.0, 5.0, 10.0]

export default function CalculatorSection({ section }: CalculatorSectionProps) {
  const payload = section as unknown as { assets?: CalculatorAsset[] }
  const assets = payload.assets ?? []

  const [assetName, setAssetName] = useState(assets[0]?.name ?? 'BOOM 1000')
  const [lotSize, setLotSize] = useState(1.0)
  const [pointsCaptured, setPointsCaptured] = useState(assets[0]?.typicalSpike ?? 120)
  const [stopLossTicks, setStopLossTicks] = useState(12)

  const asset = assets.find((item) => item.name === assetName) ?? assets[0]

  if (!asset) return null

  const grossProfit = Number((lotSize * pointsCaptured * asset.multiplier).toFixed(2))
  const estimatedRisk = Number((lotSize * stopLossTicks * asset.multiplier).toFixed(2))
  const riskReward = (pointsCaptured / Math.max(1, stopLossTicks)).toFixed(1)
  const marginEstimated = Number((lotSize * 25).toFixed(2))

  const selectAsset = (name: string, typicalSpike: number) => {
    setAssetName(name)
    setPointsCaptured(typicalSpike)
  }

  return (
    <section className="section section--spacious">
      <div className="shell">
        <div className="calculator">
          <div className="panel">
            <div className="stack stack--md">
              <h2 className="panel__title" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ZapIcon size={20} />
                Position parameters
              </h2>

              <div className="panel__group">
                <div className="panel__group-label">Select synthetic index</div>
                <div className="chip-row">
                  {assets.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      className={`chip${assetName === item.name ? ' is-active' : ''}`}
                      onClick={() => selectAsset(item.name, item.typicalSpike)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="panel__group">
                <div className="panel__group-label">
                  <span>Trading lot size</span>
                  <span className="panel__group-value">{lotSize.toFixed(2)} lots</span>
                </div>
                <input
                  className="range"
                  type="range"
                  min={asset.minLot}
                  max={10}
                  step={0.1}
                  value={lotSize}
                  onChange={(event) => setLotSize(Number(event.target.value))}
                  aria-label="Trading lot size"
                />
                <div className="chip-row" style={{ marginTop: '1.2rem' }}>
                  {LOT_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className="chip"
                      onClick={() => setLotSize(preset)}
                    >
                      {preset.toFixed(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="panel__group">
                <div className="panel__group-label">
                  <span>Spike points captured</span>
                  <span className="panel__group-value" style={{ color: 'var(--color-accent-green)' }}>
                    +{pointsCaptured} points
                  </span>
                </div>
                <input
                  className="range"
                  type="range"
                  min={30}
                  max={300}
                  step={5}
                  value={pointsCaptured}
                  onChange={(event) => setPointsCaptured(Number(event.target.value))}
                  aria-label="Spike points captured"
                />
              </div>

              <div className="panel__group">
                <div className="panel__group-label">
                  <span>Stop loss (ticks)</span>
                  <span className="panel__group-value" style={{ color: 'var(--color-accent-rose)' }}>
                    -{stopLossTicks} ticks
                  </span>
                </div>
                <input
                  className="range"
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={stopLossTicks}
                  onChange={(event) => setStopLossTicks(Number(event.target.value))}
                  aria-label="Stop loss in ticks"
                />
              </div>
            </div>
          </div>

          <div className="stack stack--lg">
            <div className="panel panel--dark">
              <div className="stack stack--md">
                <div>
                  <div className="price-summary__label">Projected spike outcome</div>
                  <h3 className="panel__title" style={{ marginTop: '0.6rem' }}>
                    Calculated trade return
                  </h3>
                </div>

                <div className="result-profit">
                  <div className="result-profit__label">Estimated spike profit</div>
                  <div className="result-profit__value">
                    +${grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                  </div>
                </div>

                <div className="result-grid">
                  <div className="result-cell">
                    <div className="result-cell__label">Maximum risk (SL)</div>
                    <div className="result-cell__value result-cell__value--loss">
                      -${estimatedRisk.toFixed(2)}
                    </div>
                  </div>
                  <div className="result-cell">
                    <div className="result-cell__label">Risk-to-reward</div>
                    <div className="result-cell__value result-cell__value--accent">1 : {riskReward}</div>
                  </div>
                  <div className="result-cell">
                    <div className="result-cell__label">Est. margin needed</div>
                    <div className="result-cell__value">${marginEstimated.toFixed(2)}</div>
                  </div>
                  <div className="result-cell">
                    <div className="result-cell__label">Index weight</div>
                    <div className="result-cell__value result-cell__value--amber">
                      {asset.multiplier}x rate
                    </div>
                  </div>
                </div>

                <div className="cluster" style={{ flexDirection: 'column', gap: '0.8rem' }}>
                  <Link
                    className="button button--block"
                    to="/terminal"
                    onClick={() => playEagleSound('click')}
                  >
                    <CalculatorIcon size={16} />
                    <span style={{ marginLeft: '0.8rem' }}>Test this setup on the live terminal</span>
                  </Link>

                  <button
                    type="button"
                    className="button button--ghost button--block"
                    onClick={() => {
                      playEagleSound('success')
                      const copyText = `EAGLE VIX SOLUTIONS — SPIKE RISK CONFIG
Asset: ${asset.name}
Lot Size: ${lotSize.toFixed(2)} Lots
Spike Target: +${pointsCaptured} Points (Est. Return: +$${grossProfit.toFixed(2)} USD)
Stop Loss: -${stopLossTicks} Ticks (Max Risk: -$${estimatedRisk.toFixed(2)} USD)
Risk to Reward: 1 : ${riskReward}
Margin Requirement: $${marginEstimated.toFixed(2)} USD`

                      navigator.clipboard?.writeText(copyText)
                      emitToast({
                        title: 'Strategy Setup Copied',
                        message: `${asset.name} risk-reward configuration copied to clipboard.`,
                        type: 'success',
                      })
                    }}
                  >
                    📋 Copy Strategy Parameters
                  </button>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="stack stack--md">
                <div className="media-figure" style={{ height: '16rem' }}>
                  <img className="media-figure__image" src="/images/risk-engine.jpg" alt="Quantitative risk engine" loading="lazy" />
                  <span className="media-figure__overlay" />
                  <div className="media-figure__caption">
                    <span className="media-figure__tag">Golden rule</span>
                    <span className="media-figure__title">Never risk over 3% per spike signal</span>
                  </div>
                </div>
                <p className="text-muted fs-sm">
                  By entering with Prime Spike v3.2 AI signals, our traders consistently hit minimum
                  1:4 risk-reward ratios with 10 to 14 tick maximum stop-losses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
