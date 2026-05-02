'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

export default function FAQ({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {items.map((item, i) => (
        <div
          key={i}
          className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${
            openIndex === i
              ? 'border-ocean-bright shadow-lg shadow-ocean-bright/10'
              : 'border-[#D0E8F7] shadow-sm'
          }`}
        >
          <button
            className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left font-semibold text-ocean-deep hover:text-ocean-bright transition-colors duration-200"
            onClick={() => toggle(i)}
            aria-expanded={openIndex === i}
          >
            <span className="text-base">{item.question}</span>
            <span
              className={`text-2xl text-ocean-bright font-light leading-none flex-shrink-0 transition-transform duration-300 ${
                openIndex === i ? 'rotate-45' : ''
              }`}
            >
              +
            </span>
          </button>

          <div
            className={`transition-all duration-300 ${
              openIndex === i ? 'max-h-64' : 'max-h-0'
            } overflow-hidden`}
          >
            <p className="px-7 pb-6 text-[#4A6580] leading-relaxed text-[0.95rem]">
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
