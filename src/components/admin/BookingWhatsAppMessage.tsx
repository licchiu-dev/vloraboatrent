'use client'

import { useEffect, useState } from 'react'
import { Check, Copy, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'

type Props = {
  date: Date
  totalPublic: number | null
}

function buildMessage({
  date,
  totalPublic,
  arrivalTime,
  numPeople,
  paymentLink,
}: {
  date: Date
  totalPublic: number | null
  arrivalTime: string
  numPeople: string
  paymentLink: string
}): string {
  const dateStr = format(date, 'EEEE, d MMMM yyyy')
  const amount = totalPublic != null
    ? totalPublic % 1 === 0 ? `€${totalPublic.toFixed(0)}` : `€${totalPublic.toFixed(2)}`
    : '[amount]'
  const timeStr = arrivalTime.trim() || '[arrival time]'
  const peopleStr = numPeople.trim() || '[number of people]'
  const linkStr = paymentLink.trim() || '[PAYMENT LINK]'

  return [
    `Hi 👋`,
    `your booking with Vlora Boat Rent is confirmed! 🚤🌊`,
    ``,
    `Booking recap 📌`,
    `Date: ${dateStr}`,
    `Number of people: ${peopleStr}`,
    `Total amount: ${amount}`,
    ``,
    `Arrival time at the pier: ${timeStr} ⏰`,
    `Please arrive on time so we can complete the check-in and prepare everything before departure.`,
    ``,
    `Pier location 📍`,
    `https://maps.app.goo.gl/qRm2MPYRHpiXyVDL7`,
    ``,
    `Before departure, our staff will show you how to drive the boat, explain the basic rules and answer any questions you may have. No stress — we'll guide you step by step 😎🚤`,
    ``,
    `Return to the pier: by 6:30 PM ⛵`,
    ``,
    `On board you will find:`,
    ``,
    `• sunshade canopy ☀️`,
    `• cushions 🛋️`,
    `• full fuel tank ⛽`,
    `• Bluetooth speakers 🎶`,
    ``,
    `At the pier, you can also rent:`,
    ``,
    `• Snorkeling kit: €15 per kit 🤿`,
    `• Action cam: €50 📸`,
    `• Sunset kit: €15 per person, minimum €50 🌅`,
    ``,
    `To complete your booking, please proceed with the full payment through the link below:`,
    ``,
    `${linkStr} 💳`,
    ``,
    `Once the payment is completed, please send us a screenshot of the confirmation ✅`,
    ``,
    `Thank you,`,
    `Vlora Boat Rent 🚤🌊`,
  ].join('\n')
}

const inputClass =
  'w-full rounded-lg border border-[#D0E8F7] bg-white px-3 py-2 text-sm text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-ocean-mid'

export default function BookingWhatsAppMessage({ date, totalPublic }: Props) {
  const [arrivalTime, setArrivalTime] = useState('')
  const [numPeople, setNumPeople] = useState('')
  const [paymentLink, setPaymentLink] = useState('')
  const [text, setText] = useState(() =>
    buildMessage({ date, totalPublic, arrivalTime: '', numPeople: '', paymentLink: '' })
  )
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setText(buildMessage({ date, totalPublic, arrivalTime, numPeople, paymentLink }))
  }, [arrivalTime, numPeople, paymentLink, date, totalPublic])

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-5 border-t border-[#D0E8F7] pt-5">
      <p className="mb-3 flex items-center gap-2 font-black text-ocean-deep">
        <MessageCircle size={16} />
        WhatsApp confirmation
      </p>

      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-bold text-ocean-deep">
          Arrival time ⏰
          <input
            className={inputClass}
            placeholder="e.g. 9:00 AM"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold text-ocean-deep">
          Number of people 👥
          <input
            type="number"
            min={1}
            className={inputClass}
            placeholder="e.g. 3"
            value={numPeople}
            onChange={(e) => setNumPeople(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold text-ocean-deep sm:col-span-2">
          Payment link 💳
          <input
            className={inputClass}
            placeholder="https://..."
            value={paymentLink}
            onChange={(e) => setPaymentLink(e.target.value)}
          />
        </label>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={16}
        className="w-full resize-y rounded-lg border border-[#D0E8F7] bg-white px-3 py-2.5 font-mono text-xs leading-relaxed text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-ocean-mid"
      />
      <button
        type="button"
        onClick={copy}
        className={`mt-2 flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-black transition ${
          copied ? 'bg-emerald-500 text-white' : 'bg-ocean-deep text-white hover:bg-ocean-mid'
        }`}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? 'Copied!' : 'Copy message'}
      </button>
    </div>
  )
}
