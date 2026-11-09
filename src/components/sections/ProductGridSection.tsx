import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CmsSection } from '../../types/cms'
import type { ProductItem } from '../../types/sections'
import SectionHeader from './SectionHeader'
import { SearchIcon } from '../Icons'
import CheckoutModal from '../CheckoutModal'
import { playEagleSound } from '../../utils/sound'

interface ProductGridSectionProps {
  section: CmsSection
}

const CATEGORIES = [
  'All Tools',
  'Spike Detectors',
  'Trend Reversals',
  'Weltrade Synthetics',
  'Automated Bots (EA)',
]

const BADGE_TONE: Record<string, string> = {
  accent: 'product-card__badge--accent',
  green: 'product-card__badge--green',
  amber: 'product-card__badge--amber',
  violet: 'product-card__badge--violet',
  blue: 'product-card__badge--blue',
}

export default function ProductGridSection({ section }: ProductGridSectionProps) {
  const payload = section as unknown as {
    eyebrow?: string
    heading?: string
    text?: string
    note?: string
    products?: ProductItem[]
  }

  const products = useMemo(() => payload.products ?? [], [payload.products])
  const [category, setCategory] = useState('All Tools')
  const [query, setQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null)

  const categories = useMemo(() => {
    const found = products.map((product) => product.category)
    return ['All Tools', ...CATEGORIES.filter((item) => found.includes(item))]
  }, [products])

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory = category === 'All Tools' || product.category === category
      const matchesQuery =
        term.length === 0 ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.platform.toLowerCase().includes(term)

      return matchesCategory && matchesQuery
    })
  }, [products, category, query])

  return (
    <section className="section section--spacious">
      <div className="shell">
        <SectionHeader eyebrow={payload.eyebrow} heading={payload.heading} text={payload.text} />

        {products.length > 3 && (
          <div className="filter-bar">
            <div className="chip-row">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`chip${category === item ? ' is-active' : ''}`}
                  onClick={() => {
                    playEagleSound('click')
                    setCategory(item)
                  }}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="filter-bar__search">
              <SearchIcon />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search indicators & systems..."
                aria-label="Search indicators"
              />
            </div>
          </div>
        )}

        <div className="grid grid--3">
          {visible.map((product) => (
            <article key={product.id} className="product-card eagle-card-glow">
              <div className="product-card__media">
                <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
                <span className={`product-card__badge ${BADGE_TONE[product.badgeTone ?? 'accent'] ?? ''}`}>
                  {product.badge}
                </span>
                <span className="product-card__platform">{product.platform}</span>
              </div>

              <div className="product-card__body">
                <div>
                  <h3 className="product-card__title">{product.name}</h3>
                  <div className="product-card__meta">
                    <span className="product-card__winrate">★ Win Rate: {product.winRate}</span>
                    <span className="product-card__timeframe">{product.timeframe}</span>
                  </div>
                </div>

                <p className="product-card__description">{product.description}</p>

                <ul className="spec-list">
                  {product.specs.map((spec) => (
                    <li key={spec} className="spec-list__item">
                      <span className="spec-list__marker" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="product-card__footer">
                <div>
                  <div className="product-card__price-label">One-time licence</div>
                  <div className="product-card__price">${product.price.toFixed(2)}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <Link
                    className="button button--ghost"
                    style={{ padding: '0.6rem 1rem', fontSize: '1.2rem' }}
                    to={`/terminal?tool=${product.id}`}
                    onClick={() => playEagleSound('click')}
                    title="Live Test Demo"
                  >
                    Demo
                  </Link>
                  <button
                    type="button"
                    className="button"
                    style={{ padding: '0.6rem 1.4rem' }}
                    onClick={() => {
                      playEagleSound('click')
                      setSelectedProduct(product)
                    }}
                  >
                    Get Access
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="lede" style={{ textAlign: 'center' }}>
            No tools match that filter yet. Clear the search or pick another category.
          </p>
        )}

        {payload.note && (
          <p className="text-dim fs-mono" style={{ marginTop: '3rem', textAlign: 'center' }}>
            {payload.note}
          </p>
        )}
      </div>

      <CheckoutModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  )
}
