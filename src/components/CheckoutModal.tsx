import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ProductItem } from '../types/sections'
import { emitToast } from '../utils/toast'
import { playEagleSound } from '../utils/sound'

interface CheckoutModalProps {
  product: ProductItem | null
  isOpen: boolean
  onClose: () => void
}

export default function CheckoutModal({ product, isOpen, onClose }: CheckoutModalProps) {
  const [method, setMethod] = useState<'crypto' | 'deriv' | 'card'>('crypto')
  const [isProcessing, setIsProcessing] = useState(false)
  const [activated, setActivated] = useState(false)
  const [licenseKey, setLicenseKey] = useState('')

  if (!isOpen || !product) return null

  const handleSimulateActivation = () => {
    setIsProcessing(true)
    playEagleSound('click')

    setTimeout(() => {
      const generated = `EVIX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-MT5`
      setLicenseKey(generated)
      setIsProcessing(false)
      setActivated(true)
      playEagleSound('success')

      emitToast({
        title: 'License Activated!',
        message: `${product.name} license key generated: ${generated}`,
        type: 'success',
      })
    }, 1200)
  }

  const handleDownloadPackage = () => {
    playEagleSound('click')
    const fileContent = `EAGLE VIX SOLUTIONS — MT5 INDICATOR PACKAGE
==================================================
Product: ${product.name}
Platform: MetaTrader 5 (Win64)
License Key: ${licenseKey || 'EVIX-EVALUATION-KEY-9942-MT5'}
Hardware ID: AUTO-BIND-FIRST-RUN
Win Rate Rating: ${product.winRate}
Timeframe: ${product.timeframe}

INSTALLATION INSTRUCTIONS:
1. Copy the .ex5 indicator file into MT5:
   File -> Open Data Folder -> MQL5 -> Indicators
2. Copy presets into:
   MQL5 -> Presets
3. Restart MT5, attach to your Boom/Crash chart.
4. Input your License Key in the indicator Inputs tab.

EAGLE VIX SOLUTIONS 24/7 Desk: support@eaglevixsolutions.com
==================================================`

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${product.name.replace(/\s+/g, '_')}_EagleVix_Package.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    emitToast({
      title: 'Download Started',
      message: `${product.name} MT5 bundle package downloaded successfully.`,
      type: 'success',
    })
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal eagle-checkout-modal" role="dialog" aria-modal="true">
        <button
          type="button"
          className="modal__close"
          aria-label="Close modal"
          onClick={onClose}
        >
          ✕
        </button>

        <span className="eyebrow eyebrow--amber">
          <span className="eyebrow__dot" />
          EAGLE VIX SOLUTIONS · Secure Checkout
        </span>

        <h2 className="modal__title" style={{ marginTop: '0.4rem' }}>{product.name}</h2>
        <p className="modal__text">
          {product.description} Includes lifetime MT5 updates, zero repaint guarantee, and instant hardware activation.
        </p>

        <div className="eagle-checkout-details">
          <div className="eagle-checkout-spec">
            <span className="text-dim">Win Rate:</span>
            <span className="text-green">{product.winRate}</span>
          </div>
          <div className="eagle-checkout-spec">
            <span className="text-dim">Timeframe:</span>
            <span>{product.timeframe}</span>
          </div>
          <div className="eagle-checkout-spec">
            <span className="text-dim">Target Broker:</span>
            <span>{product.platform}</span>
          </div>
          <div className="eagle-checkout-spec">
            <span className="text-dim">Price:</span>
            <span className="text-amber" style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
              ${product.price.toFixed(2)} USD
            </span>
          </div>
        </div>

        {activated ? (
          <div className="support-form__success" style={{ marginTop: '1.8rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span>✓</span> License Generated &amp; Activated!
            </h4>
            <p>Your hardware license has been registered to the EAGLE VIX SOLUTIONS auth server.</p>

            <div className="license-card__key" style={{ marginTop: '1rem', fontSize: '1.3rem' }}>
              {licenseKey}
            </div>

            <div className="cluster" style={{ marginTop: '1.6rem' }}>
              <button type="button" className="button" onClick={handleDownloadPackage}>
                Download .EX5 Package (.ZIP)
              </button>
              <Link
                className="button button--ghost"
                to={`/terminal?tool=${product.id}`}
                onClick={onClose}
              >
                Test in Live Terminal
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '1.6rem' }}>
            <div className="panel__group-label" style={{ marginBottom: '0.8rem' }}>
              Select Payment / Activation Gateway:
            </div>
            <div className="chip-row">
              <button
                type="button"
                className={`chip${method === 'crypto' ? ' is-active' : ''}`}
                onClick={() => setMethod('crypto')}
              >
                🪙 USDT / Crypto (Instant)
              </button>
              <button
                type="button"
                className={`chip${method === 'deriv' ? ' is-active' : ''}`}
                onClick={() => setMethod('deriv')}
              >
                🏦 Deriv P2P / Weltrade
              </button>
              <button
                type="button"
                className={`chip${method === 'card' ? ' is-active' : ''}`}
                onClick={() => setMethod('card')}
              >
                💳 Credit Card / Visa
              </button>
            </div>

            <div className="eagle-checkout-box" style={{ marginTop: '1.2rem' }}>
              {method === 'crypto' && (
                <div>
                  <div className="fs-sm text-dim">USDT TRC20 Payment Address (Auto-Confirm):</div>
                  <div className="license-card__hwid" style={{ wordBreak: 'break-all', marginTop: '0.4rem' }}>
                    TL9vEViXsolutionsSpikeQuantNode784x2m99
                  </div>
                </div>
              )}
              {method === 'deriv' && (
                <div className="fs-sm text-dim">
                  Internal Deriv Transfer Account: <strong>CR-9120482</strong> (EAGLE VIX DESK)
                </div>
              )}
              {method === 'card' && (
                <div className="fs-sm text-dim">
                  Processed via Stripe 256-bit Institutional TLS Gateway.
                </div>
              )}
            </div>

            <div className="modal__actions" style={{ marginTop: '1.8rem' }}>
              <button
                type="button"
                className="button"
                disabled={isProcessing}
                onClick={handleSimulateActivation}
              >
                {isProcessing ? 'Verifying & Generating...' : `Confirm & Activate ($${product.price.toFixed(2)})`}
              </button>
              <Link
                className="button button--ghost"
                to={`/terminal?tool=${product.id}`}
                onClick={onClose}
              >
                Live Test Demo First
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
