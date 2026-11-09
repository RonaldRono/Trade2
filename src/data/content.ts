import type { TickerItem } from '../types/sections'

export interface NavLink {
  label: string
  href: string
  badge?: string
  badgeTone?: 'live' | 'accent' | 'amber'
}

export const NAV_LINKS: NavLink[] = [
  { label: 'TERMINAL', href: '/terminal', badge: 'LIVE', badgeTone: 'live' },
  { label: 'SPIKE DETECTORS', href: '/indicators' },
  { label: 'VIP SIGNALS', href: '/signals', badge: '95.2%', badgeTone: 'accent' },
  { label: '100K CHALLENGE', href: '/challenge', badge: 'PRO', badgeTone: 'amber' },
  { label: 'CALCULATOR', href: '/calculator' },
  { label: 'VIP DESK', href: '/contact' },
]

export const FOOTER_LINKS: NavLink[] = [
  { label: 'LIVE TERMINAL', href: '/terminal' },
  { label: 'SPIKE DETECTORS', href: '/indicators' },
  { label: 'VIP SIGNALS', href: '/signals' },
  { label: '100K CHALLENGE', href: '/challenge' },
  { label: 'PROFIT CALCULATOR', href: '/calculator' },
  { label: 'MY ACCOUNT', href: '/account' },
  { label: 'VIP TRADING DESK', href: '/contact' },
  { label: 'RISK DISCLOSURE', href: '/risk-disclosure' },
]

export const FOOTER_EXTENSION_BG = '/images/global-desk.jpg'

export const FOOTER_LOGO = '/tread-wordmark.svg'

export const TICKER_ITEMS: TickerItem[] = [
  { symbol: 'BOOM 1000', price: 14284.5, change: '+2.84%', up: true },
  { symbol: 'CRASH 1000', price: 8912.3, change: '-1.15%', up: false },
  { symbol: 'BOOM 500', price: 4120.8, change: '+4.12%', up: true },
  { symbol: 'CRASH 500', price: 3840.1, change: '-0.89%', up: false },
  { symbol: 'STEP INDEX', price: 10230.0, change: '+0.45%', up: true },
  { symbol: 'VOLATILITY 75', price: 492104.2, change: '+3.91%', up: true },
  { symbol: 'JUMP 25', price: 741920.0, change: '-0.42%', up: false },
  { symbol: 'PAIN X (Weltrade)', price: 1842.1, change: '+6.40%', up: true },
  { symbol: 'GAIN X (Weltrade)', price: 2190.5, change: '+1.25%', up: true },
]

export type HeroLayout =
  | 'text aligned to left / cta aligned to right'
  | 'text aligned to right / cta aligned to left'
  | 'text aligned to left / cta aligned to left'

export interface HeroSectionData {
  anchorId: string
  layout: HeroLayout
  hasGradient?: boolean
  size?: 'cover' | 'half'
  heading: string
  text: string
  image: string
  imageAlt: string
  meta?: { value: string; label: string }[]
  cta: {
    label: string
    href: string
    external?: boolean
  }
}

export const HERO_SECTIONS: HeroSectionData[] = [
  {
    anchorId: 'precision-spike-detection',
    layout: 'text aligned to left / cta aligned to right',
    hasGradient: true,
    heading: 'Precision spike detection for Boom & Crash',
    text: 'EAGLE VIX SOLUTIONS builds non-repainting MT5 indicators, real-time sniper signals and automated copy trading for Deriv and Weltrade synthetics — delivered the second your payment confirms.',
    image: '/images/hero-terminal.jpg',
    imageAlt: 'Algorithmic trading charts running on a MetaTrader 5 terminal',
    meta: [
      { value: '95.2%', label: 'Spike Accuracy' },
      { value: '< 0.2s', label: 'Tick Execution' },
      { value: '0.08ms', label: 'Bridge Latency' },
    ],
    cta: { label: 'Browse Spike Detectors', href: '/indicators' },
  },
  {
    anchorId: 'watch-the-algorithm-work',
    layout: 'text aligned to left / cta aligned to right',
    heading: 'Watch the algorithm work in real time',
    text: 'The live MT5 bridge terminal simulates micro-tick liquidity clusters exactly as they print on Deriv, so you can see every entry arrow before it ever reaches your chart.',
    image: '/images/market-chart.jpg',
    imageAlt: 'Market price chart on a professional trading monitor',
    cta: { label: 'Open Live Terminal', href: '/terminal' },
  },
  {
    anchorId: 'from-100-to-100k',
    layout: 'text aligned to left / cta aligned to right',
    hasGradient: true,
    heading: 'Grow from $100 to $100,000',
    text: 'Join the high-frequency copy trading network. Our master quantitative bots trade your connected MT5 account synchronously across Boom, Crash and synthetic indices.',
    image: '/images/capital-growth.jpg',
    imageAlt: 'Institutional trading capital desk at night',
    meta: [
      { value: '3 Days', label: 'Challenge Duration' },
      { value: '$85', label: 'Copy Trade Fee' },
      { value: '14 / 100', label: 'Slots Remaining' },
    ],
    cta: { label: '$100k Challenge', href: '/challenge' },
  },
]

export const FOOTER_EXTENSION: HeroSectionData = {
  anchorId: 'footerextension',
  layout: 'text aligned to left / cta aligned to left',
  heading: 'The trading desk behind every spike',
  text: 'EAGLE VIX SOLUTIONS pairs quantitative research engineers with low-latency VPS infrastructure across Deriv and Weltrade — and answers on the VIP desk in under 15 minutes.',
  image: '/images/global-desk.jpg',
  imageAlt: 'Global trading support desk',
  cta: { label: 'Contact VIP Desk', href: '/contact' },
}
