'use client'

import { useEffect, useMemo, useState } from 'react'

type Lang = 'en' | 'it' | 'sq' | 'ar' | 'ru' | 'zh'
type Slot = 'Giornata intera'

type Asset = {
  id: string
  name: string
  category: string
  booked: Record<string, string[]>
  prices: { fullDay: number; halfDay: number }
}

type Selection = {
  date: string
  fascia: Slot
  assetId: string
}

const labels: Record<Lang, {
  title: string
  loading: string
  noFleet: string
  date: string
  full: string
  booked: string
  available: string
  selected: string
}> = {
  en: {
    title: 'Choose boat and date',
    loading: 'Loading availability...',
    noFleet: 'No boats available online right now.',
    date: 'Date',
    full: 'Full day',
    booked: 'Booked',
    available: 'Available',
    selected: 'Selected',
  },
  it: {
    title: 'Scegli barca e data',
    loading: 'Caricamento disponibilita...',
    noFleet: 'Nessuna barca disponibile online al momento.',
    date: 'Data',
    full: 'Giornata',
    booked: 'Prenotato',
    available: 'Disponibile',
    selected: 'Selezionato',
  },
  sq: {
    title: 'Zgjidh barken dhe daten',
    loading: 'Duke ngarkuar disponueshmerine...',
    noFleet: 'Nuk ka barka te disponueshme online tani.',
    date: 'Data',
    full: 'Dite',
    booked: 'Rezervuar',
    available: 'I lire',
    selected: 'Zgjedhur',
  },
  ar: {
    title: 'اختر القارب والتاريخ',
    loading: 'جاري تحميل التوفر...',
    noFleet: 'لا توجد قوارب متاحة الآن.',
    date: 'التاريخ',
    full: 'يوم كامل',
    booked: 'محجوز',
    available: 'متاح',
    selected: 'محدد',
  },
  ru: {
    title: 'Выберите лодку и дату',
    loading: 'Загрузка доступности...',
    noFleet: 'Сейчас нет лодок, доступных онлайн.',
    date: 'Дата',
    full: 'День',
    booked: 'Занято',
    available: 'Свободно',
    selected: 'Выбрано',
  },
  zh: {
    title: '选择船和日期',
    loading: '正在加载可订情况...',
    noFleet: '当前没有可在线预订的船。',
    date: '日期',
    full: '全天',
    booked: '已订',
    available: '可订',
    selected: '已选',
  },
}

function isoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function monthDays(monthStart: Date, minDate?: string) {
  const days: Date[] = []
  const cursor = new Date(monthStart)
  while (cursor.getMonth() === monthStart.getMonth()) {
    if (!minDate || isoDate(cursor) >= minDate) days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

function monthLabel(date: Date, lang: Lang) {
  const locale = lang === 'it' ? 'it-IT' : lang === 'sq' ? 'sq-AL' : lang === 'ru' ? 'ru-RU' : lang === 'zh' ? 'zh-CN' : lang === 'ar' ? 'ar' : 'en-GB'
  return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
}

function fullDayBlocked(asset: Asset, date: string) {
  const booked = asset.booked[date] ?? []
  return booked.length > 0
}

export default function RentalAvailabilityCalendar({
  lang,
  value,
  onSelect,
  hasError,
}: {
  lang: Lang
  value: Selection | null
  onSelect: (selection: Selection) => void
  hasError?: boolean
}) {
  const t = labels[lang]
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const today = useMemo(() => new Date(), [])
  const todayKey = isoDate(today)
  const months = useMemo(() => [new Date(today.getFullYear(), today.getMonth(), 1), addMonths(today, 1)], [today])
  const from = isoDate(months[0])
  const to = isoDate(new Date(months[1].getFullYear(), months[1].getMonth() + 1, 0))

  useEffect(() => {
    let active = true
    setLoading(true)
    fetch(`/api/public-availability?from=${from}&to=${to}`)
      .then((response) => response.json())
      .then((data) => {
        if (!active) return
        setAssets(Array.isArray(data.assets) ? data.assets : [])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [from, to])

  return (
    <div className={`rounded-2xl border-2 bg-white ${hasError ? 'border-red-400' : 'border-[#D0E8F7]'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D0E8F7] px-4 py-3">
        <p className="font-black text-ocean-deep">{t.title}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#4A6580]">
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />{t.selected}</span>
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-white ring-1 ring-[#A8D7EC]" />{t.available}</span>
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-red-500" />{t.booked}</span>
        </div>
      </div>

      {loading ? (
        <p className="px-4 py-8 text-center text-sm font-bold text-[#4A6580]">{t.loading}</p>
      ) : assets.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm font-bold text-[#4A6580]">{t.noFleet}</p>
      ) : (
        <div className="space-y-5 p-4">
          {months.map((month) => (
            <div key={month.toISOString()} className="overflow-x-auto">
              <h3 className="mb-3 text-lg font-black capitalize text-ocean-deep">{monthLabel(month, lang)}</h3>
              <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 w-28 rounded-tl-xl bg-ocean-light p-2 text-left text-xs font-black uppercase text-[#4A6580]">
                      {t.date}
                    </th>
                    {assets.map((asset) => (
                      <th key={asset.id} className="min-w-44 bg-ocean-light p-2 text-left text-xs font-black uppercase text-[#4A6580] last:rounded-tr-xl">
                        {asset.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthDays(month, month.getMonth() === today.getMonth() && month.getFullYear() === today.getFullYear() ? todayKey : undefined).map((day) => {
                    const date = isoDate(day)
                    const past = date < todayKey
                    return (
                      <tr key={date} className="align-top">
                        <th className="sticky left-0 z-10 border-t border-[#E8F3FA] bg-white p-2 text-left">
                          <span className="block font-black text-ocean-deep">{day.toLocaleDateString('en-GB', { day: '2-digit' })}</span>
                          <span className="text-xs font-bold text-[#4A6580]">{day.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                        </th>
                        {assets.map((asset) => (
                          <td key={asset.id} className="border-t border-[#E8F3FA] p-2">
                            {(() => {
                              const selected = value?.assetId === asset.id && value.date === date
                              const blocked = past || fullDayBlocked(asset, date)
                              return (
                                <button
                                  type="button"
                                  disabled={blocked}
                                  onClick={() => onSelect({ assetId: asset.id, date, fascia: 'Giornata intera' })}
                                  className={`min-h-16 w-full rounded-lg border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-sand disabled:cursor-not-allowed ${
                                    selected
                                      ? 'border-emerald-600 bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                      : blocked
                                        ? 'border-red-200 bg-red-500/90 text-white opacity-80'
                                        : 'border-[#A8D7EC] bg-white text-ocean-deep hover:border-ocean-bright hover:bg-ocean-light'
                                  }`}
                                >
                                  <span className="block text-xs font-black leading-tight">{t.full}</span>
                                  <span className={`mt-1 block text-sm font-bold ${selected || blocked ? 'text-white/85' : 'text-[#4A6580]'}`}>
                                    EUR {asset.prices.fullDay}
                                  </span>
                                </button>
                              )
                            })()}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
