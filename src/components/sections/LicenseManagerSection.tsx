import { useState } from 'react'
import type { CmsSection } from '../../types/cms'
import type { LicenseItem } from '../../types/sections'
import { emitToast } from '../../utils/toast'
import { playEagleSound } from '../../utils/sound'

interface LicenseManagerSectionProps {
  section: CmsSection
}

export default function LicenseManagerSection({ section }: LicenseManagerSectionProps) {
  const payload = section as unknown as { licenses?: LicenseItem[] }
  const initialLicenses = payload.licenses ?? []
  const [licenses, setLicenses] = useState<LicenseItem[]>(initialLicenses)
  const [notice, setNotice] = useState<string | null>(null)

  const resetHwid = (license: LicenseItem) => {
    playEagleSound('reset')
    const updated = licenses.map((item) => {
      if (item.key === license.key) {
        return {
          ...item,
          hwid: 'UNBOUND — Ready for new VPS / Machine',
          status: 'UNBOUND',
        }
      }
      return item
    })
    setLicenses(updated)

    const msg = `Hardware binding for ${license.name} has been released. Next MT5 launch will auto-bind to your active device.`
    setNotice(msg)
    emitToast({
      title: 'HWID Reset Confirmed',
      message: msg,
      type: 'success',
    })

    setTimeout(() => setNotice(null), 7000)
  }

  const downloadPackage = (license: LicenseItem) => {
    playEagleSound('success')
    const content = `EAGLE VIX SOLUTIONS — MT5 LICENSED PACKAGE
=====================================================
Indicator: ${license.name}
License Key: ${license.key}
Registered HWID: ${license.hwid}
Build: EAGLE VIX 2026.10-PRO (MetaTrader 5 Win64)
Server: auth.eaglevixsolutions.com:443

INSTRUCTIONS:
1. Place the included .ex5 file in:
   MetaTrader 5 / MQL5 / Indicators
2. Drag onto chart (M1 or M5 Boom/Crash or Weltrade).
3. Paste key "${license.key}" in the license parameters.

Support: support@eaglevixsolutions.com
=====================================================`

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${license.name.replace(/\s+/g, '_')}_MT5_Package.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    emitToast({
      title: 'Download Started',
      message: `${license.name} installer bundle package saved to your device.`,
      type: 'success',
    })
  }

  return (
    <section className="section section--spacious" id="licenses">
      <div className="shell">
        <div className="stack stack--lg">
          <div className="section__header section__header--left">
            <span className="eyebrow eyebrow--amber">
              <span className="eyebrow__dot" />
              EAGLE VIX SOLUTIONS · Authenticated Client Terminal
            </span>
            <h2>My active licences</h2>
            <p>
              Hardware-bound MT5 indicator licences bound to this workstation. Reset a device binding
              when you migrate to a new VPS.
            </p>
          </div>

          {notice && (
            <div className="support-form__success">
              <h4>Hardware ID reset</h4>
              <p>{notice}</p>
            </div>
          )}

          <div className="stack stack--sm">
            {licenses.map((license) => (
              <div key={license.key} className="license-card eagle-card-glow">
                <div>
                  <div className="license-card__name">{license.name}</div>
                  <div className="license-card__key">{license.key}</div>
                  <div className="license-card__hwid">{license.hwid}</div>
                </div>

                <div className="cluster" style={{ alignItems: 'center' }}>
                  <span className={`pill-status${license.status === 'UNBOUND' ? ' text-green' : ''}`}>
                    {license.status}
                  </span>
                  <button
                    type="button"
                    className="button button--ghost"
                    onClick={() => resetHwid(license)}
                  >
                    Reset HWID
                  </button>
                  <button
                    type="button"
                    className="button button--ghost"
                    onClick={() => downloadPackage(license)}
                  >
                    Download .EX5 Package (.ZIP)
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="guarantee">
            <div className="guarantee__item">
              <span className="guarantee__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <div>
                <div className="guarantee__title">Hardware-ID anti-tamper lock active</div>
                <p className="guarantee__text">
                  Each licence is bound to a single Win64 hardware identifier. A reset frees the
                  binding so you can install on a replacement machine.
                </p>
              </div>
            </div>

            <div className="guarantee__item">
              <span className="guarantee__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <div>
                <div className="guarantee__title">EAGLE VIX Build 2026.10-PRO</div>
                <p className="guarantee__text">
                  Every package ships with the current MT5 build, the installation manual and
                  pre-calibrated preset templates.
                </p>
              </div>
            </div>

            <div className="guarantee__item">
              <span className="guarantee__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M4 5h16v14H4z" />
                  <path d="M4 10h16" />
                </svg>
              </span>
              <div>
                <div className="guarantee__title">Instant cloud key validation</div>
                <p className="guarantee__text">
                  Sub-millisecond authentication ping against EAGLE VIX SOLUTIONS global licensing nodes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
