import { useState } from 'react'
import type { CmsSection } from '../../types/cms'
import type { SignalItem } from '../../types/sections'
import { resolveCta } from '../../utils/cta'
import Action from '../Action'
import { emitToast } from '../../utils/toast'
import { playEagleSound } from '../../utils/sound'

interface SignalFeedSectionProps {
  section: CmsSection
}

export default function SignalFeedSection({ section }: SignalFeedSectionProps) {
  const payload = section as unknown as {
    signals?: SignalItem[]
    membership?: {
      heading: string
      text: string
      image: string
      imageAlt: string
      bullets: string[]
      price: string
      period: string
      cta?: { label?: string | null; url?: string | null; fragmentAndQueryString?: string | null }
      footnote?: string
    }
  }

  const signals = payload.signals ?? []
  const membership = payload.membership
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [broker, setBroker] = useState<'all' | 'Deriv' | 'Weltrade'>('all')

  const visible = signals.filter((signal) => broker === 'all' || signal.broker === broker)

  const handleCopy = async (signal: SignalItem) => {
    playEagleSound('order')
    const text = [
      'EAGLE VIX SOLUTIONS VIP SIGNAL',
      `Asset: ${signal.asset} (${signal.broker})`,
      `Action: ${signal.type}`,
      `Entry: ${signal.entry}`,
      `SL: ${signal.sl}`,
      `TP1: ${signal.tp1}`,
      `TP2: ${signal.tp2}`,
      `Confidence: ${signal.confidence}`,
    ].join('\n')

    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Clipboard access fallback
    }

    setCopiedId(signal.id)
    emitToast({
      title: 'Order Copied to Clipboard',
      message: `${signal.asset} ${signal.type} entry @ ${signal.entry} ready for MT5.`,
      type: 'success',
    })
    setTimeout(() => setCopiedId(null), 2500)
  }

  const membershipCta = resolveCta(membership?.cta)

  return (
    <section className="section section--spacious" id="membership">
      <div className="shell">
        <div className="split" style={{ alignItems: 'start' }}>
          <div className="stack stack--lg">
            <div className="cluster">
              {(['all', 'Deriv', 'Weltrade'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`chip${broker === option ? ' is-active' : ''}`}
                  onClick={() => setBroker(option)}
                >
                  {option === 'all' ? 'All Brokers' : `${option} Only`}
                </button>
              ))}
            </div>

            <div className="stack stack--sm">
              {visible.map((signal) => {
                const isBuy = signal.type.includes('BUY')

                return (
                  <article key={signal.id} className="signal-card">
                    <div className="signal-card__head">
                      <div className="signal-card__asset">
                        <span className="signal-card__symbol">{signal.asset}</span>
                        <span className="signal-card__chip">{signal.broker}</span>
                        <span
                          className={`signal-card__chip ${isBuy ? 'signal-card__chip--buy' : 'signal-card__chip--sell'}`}
                        >
                          {signal.type}
                        </span>
                      </div>
                      <span className="signal-card__status">{signal.status}</span>
                    </div>

                    <div className="signal-card__levels">
                      <div>
                        <span className="signal-card__level-label">Entry</span>
                        <span className="signal-card__level-value">{signal.entry.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="signal-card__level-label">Stop Loss</span>
                        <span className="signal-card__level-value signal-card__level-value--loss">
                          {signal.sl.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="signal-card__level-label">Target 1</span>
                        <span className="signal-card__level-value signal-card__level-value--target">
                          {signal.tp1.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="signal-card__level-label">Confidence</span>
                        <span className="signal-card__level-value signal-card__level-value--confidence">
                          {signal.confidence}
                        </span>
                      </div>
                    </div>

                    <div className="signal-card__foot">
                      <span>Calculated via Prime Spike v3.2 Cluster Accumulator · {signal.time}</span>
                      <button
                        type="button"
                        className="signal-card__copy"
                        onClick={() => handleCopy(signal)}
                      >
                        {copiedId === signal.id ? 'Copied Order!' : 'Copy MT5 Order'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          {membership && (
            <div className="stack stack--lg">
              <div className="panel">
                <div className="stack stack--md">
                  <span className="eyebrow">Private Telegram VIP</span>
                  <h3 className="panel__title">{membership.heading}</h3>
                  <p className="text-muted fs-sm">{membership.text}</p>

                  <div className="media-figure" style={{ height: '18rem' }}>
                    <img className="media-figure__image" src={membership.image} alt={membership.imageAlt} loading="lazy" />
                    <span className="media-figure__overlay" />
                    {membership.footnote && (
                      <div className="media-figure__caption">
                        <span className="media-figure__tag">{membership.footnote}</span>
                      </div>
                    )}
                  </div>

                  <ul className="spec-list">
                    {membership.bullets.map((bullet) => (
                      <li key={bullet} className="spec-list__item">
                        <span className="spec-list__marker" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="price-summary">
                    <div>
                      <div className="price-summary__label">Monthly VIP access</div>
                      <div className="price-summary__value">
                        {membership.price} <span className="text-dim">{membership.period}</span>
                      </div>
                    </div>
                    {membershipCta && (
                      <Action
                        label={membershipCta.label}
                        href={membershipCta.href}
                        external={membershipCta.external}
                        variant="accent"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
