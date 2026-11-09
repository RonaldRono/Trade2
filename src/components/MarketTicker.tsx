import { useEffect, useState } from 'react'
import { TICKER_ITEMS } from '../data/content'

export default function MarketTicker() {
  const [items, setItems] = useState(
    TICKER_ITEMS.map((item) => ({ ...item })),
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) =>
        prev.map((item) => {
          const delta = (Math.random() - 0.49) * (item.price * 0.001)
          return { ...item, price: Number((item.price + delta).toFixed(2)) }
        }),
      )
    }, 2400)

    return () => clearInterval(interval)
  }, [])

  const loop = [...items, ...items]

  return (
    <div className="ticker" aria-label="EAGLE VIX SOLUTIONS Live synthetic index prices">
      <div className="ticker__track">
        {loop.map((item, index) => (
          <span className="ticker__item" key={`${item.symbol}-${index}`}>
            {index % 4 === 0 && (
              <span
                style={{
                  color: '#00F0FF',
                  fontWeight: 'bold',
                  marginRight: '0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>🦅 EVIX</span>
              </span>
            )}
            <span className="ticker__symbol">{item.symbol}</span>
            <span className="ticker__price">
              {item.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span
              className={item.up ? 'ticker__change ticker__change--up' : 'ticker__change ticker__change--down'}
            >
              {item.change}
            </span>
            <span className="ticker__divider">|</span>
          </span>
        ))}
      </div>
    </div>
  )
}
