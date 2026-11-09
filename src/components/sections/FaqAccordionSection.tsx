import { useState } from 'react'
import type { CmsSection } from '../../types/cms'
import type { FaqItem } from '../../types/sections'
import SectionHeader from './SectionHeader'
import { playEagleSound } from '../../utils/sound'

interface FaqAccordionSectionProps {
  section: CmsSection
}

export default function FaqAccordionSection({ section }: FaqAccordionSectionProps) {
  const payload = section as unknown as {
    eyebrow?: string
    heading?: string
    items?: FaqItem[]
  }

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="section section--spacious">
      <div className="shell">
        <SectionHeader eyebrow={payload.eyebrow} heading={payload.heading} />

        <div className="faq">
          {(payload.items ?? []).map((item, index) => {
            const isOpen = openIndex === index

            return (
              <div key={item.question} className={`faq__item${isOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="faq__question"
                  aria-expanded={isOpen}
                  onClick={() => {
                    playEagleSound('click')
                    setOpenIndex(isOpen ? null : index)
                  }}
                >
                  <span>{item.question}</span>
                  <span className="faq__icon" aria-hidden="true">
                    +
                  </span>
                </button>
                {isOpen && <div className="faq__answer">{item.answer}</div>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
