'use client'

import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Badge } from './Ui'

type BoatOccupancy = {
  id: string
  name: string
  active: boolean
  count: number
}

function OccupancyDonut({
  count,
  max,
  size = 88,
  color = '#1678C2',
}: {
  count: number
  max: number
  size?: number
  color?: string
}) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0
  const filled = Math.min(count, max)
  const data = [
    { name: 'Prenotate', value: filled },
    { name: 'Libere', value: Math.max(max - filled, 0) },
  ]
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={size / 2 - 12}
            outerRadius={size / 2}
            startAngle={90}
            endAngle={-270}
            stroke="none"
            cornerRadius={5}
            isAnimationActive={false}
          >
            <Cell fill={color} />
            <Cell fill="#E0F7FF" />
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} giorni`, name]}
            contentStyle={{ borderRadius: 8, borderColor: '#D0E8F7', fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-black text-ocean-deep">{pct}%</span>
      </div>
    </div>
  )
}

export default function FleetOccupancyGrid({ boats, days }: { boats: BoatOccupancy[]; days: number }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(boats.map((boat) => [boat.id, true]))
  )

  function toggle(id: string) {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const includedBoats = boats.filter((boat) => enabled[boat.id])
  const totalCount = includedBoats.reduce((sum, boat) => sum + boat.count, 0)
  const totalMax = includedBoats.length * days

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 rounded-lg border-2 border-ocean-bright/30 bg-ocean-light/40 p-4">
        <OccupancyDonut count={totalCount} max={totalMax} size={96} color="#0A3D62" />
        <div>
          <p className="text-sm font-bold text-[#4A6580]">Occupazione totale flotta</p>
          <p className="mt-1 text-2xl font-black text-ocean-deep">
            {totalCount}/{totalMax}
          </p>
          <p className="text-xs text-[#4A6580]">
            prenotazioni su {days} giorni × {includedBoats.length} barche incluse
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {boats.map((boat) => {
          const isEnabled = enabled[boat.id]
          return (
            <div
              key={boat.id}
              className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition ${
                isEnabled ? 'border-[#D0E8F7]' : 'border-[#D0E8F7] opacity-40'
              }`}
            >
              <OccupancyDonut count={boat.count} max={days} />
              <p className="text-xs font-black leading-tight text-ocean-deep">{boat.name}</p>
              <p className="text-xs font-bold text-[#4A6580]">
                {boat.count}/{days}
              </p>
              {!boat.active && <Badge tone="dark">Non attiva</Badge>}
              <label className="mt-1 flex items-center gap-1.5 text-xs font-bold text-[#4A6580]">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => toggle(boat.id)}
                  className="h-3.5 w-3.5 accent-ocean-mid"
                />
                Includi nel totale
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
