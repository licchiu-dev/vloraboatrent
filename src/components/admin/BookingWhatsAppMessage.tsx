'use client'

import { useEffect, useState } from 'react'
import { Check, Copy, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'

type Message = { id: string; text: string; sentAt: string }

type Props = {
  bookingId: string
  date: Date
  totalPublic: number | null
  boatName: string | null
  initialMessages: Message[]
}

function buildMessage({
  date,
  totalPublic,
  boatName,
  arrivalTime,
  numPeople,
}: {
  date: Date
  totalPublic: number | null
  boatName: string | null
  arrivalTime: string
  numPeople: string
}): string {
  const dateStr = format(date, 'EEEE, d MMMM yyyy')
  const amount = totalPublic != null
    ? totalPublic % 1 === 0 ? `€${totalPublic.toFixed(0)}` : `€${totalPublic.toFixed(2)}`
    : '[amount]'
  const timeStr = arrivalTime.trim() || '[arrival time]'
  const peopleStr = numPeople.trim() || '[number of people]'

  return [
    `Hi 👋`,
    `your booking with Vlora Boat Rent is confirmed! 🚤🌊`,
    ``,
    `Booking recap 📌`,
    `Date: ${dateStr}`,
    `Number of people: ${peopleStr}`,
    `Total amount: ${amount}+fuel`,
    `Boat: ${boatName || '[boat name]'}`,
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
    `• Cooler bag with frozen drinks (+20€)`,
    ``,
    `Thank you,`,
    `Vlora Boat Rent 🚤🌊`,
  ].join('\n')
}

const inputClass =
  'w-full rounded-lg border border-[#D0E8F7] bg-white px-3 py-2 text-sm text-[#1a2e3b] focus:outline-none focus:ring-2 focus:ring-ocean-mid'

export default function BookingWhatsAppMessage({ bookingId, date, totalPublic, boatName, initialMessages }: Props) {
  const [arrivalTime, setArrivalTime] = useState('')
  const [numPeople, setNumPeople] = useState('')
  const [text, setText] = useState(() =>
    buildMessage({ date, totalPublic, boatName, arrivalTime: '', numPeople: '' })
  )
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<Message[]>(initialMessages)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null)

  useEffect(() => {
    setText(buildMessage({ date, totalPublic, boatName, arrivalTime, numPeople }))
  }, [arrivalTime, numPeople, date, totalPublic, boatName])

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    const res = await fetch(`/api/bookings/${bookingId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    if (res.ok) {
      const saved: Message = await res.json()
      setHistory((prev) => [saved, ...prev])
    }
  }

  async function copyFromHistory(msg: Message) {
    await navigator.clipboard.writeText(msg.text)
    setCopiedHistoryId(msg.id)
    setTimeout(() => setCopiedHistoryId(null), 2000)
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

      {history.length > 0 && (
        <div className="mt-5 border-t border-[#D0E8F7] pt-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#8AACCC]">
            Sent messages ({history.length})
          </p>
          <div className="space-y-2">
            {history.map((msg) => {
              const isExpanded = expandedId === msg.id
              const preview = msg.text.split('\n').slice(0, 2).join(' ').slice(0, 80)
              const sentAt = new Date(msg.sentAt)
              return (
                <div key={msg.id} className="rounded-lg border border-[#D0E8F7] bg-white p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#4A6580]">
                        {format(sentAt, 'dd/MM/yyyy HH:mm')}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[#1a2e3b]">{preview}…</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => copyFromHistory(msg)}
                        title="Copy this message"
                        className={`rounded-full px-2.5 py-1 text-xs font-black transition ${
                          copiedHistoryId === msg.id
                            ? 'bg-emerald-500 text-white'
                            : 'bg-ocean-light text-ocean-deep hover:bg-ocean-mid hover:text-white'
                        }`}
                      >
                        {copiedHistoryId === msg.id ? '✓' : 'Copy'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                        className="rounded-full bg-ocean-light px-2.5 py-1 text-xs font-black text-ocean-deep hover:bg-ocean-mid hover:text-white"
                      >
                        {isExpanded ? 'Hide' : 'View'}
                      </button>
                    </div>
                  </div>
                  {isExpanded && (
                    <pre className="mt-2 whitespace-pre-wrap rounded border border-[#D0E8F7] bg-[#f6fbff] p-2 text-xs leading-relaxed text-[#1a2e3b]">
                      {msg.text}
                    </pre>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
