'use client'

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Point = { day: number; count: number }

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: number }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[#D0E8F7] bg-white px-3 py-2 shadow-md">
      <p className="text-xs font-bold text-[#4A6580]">Giorno {label}</p>
      <p className="text-sm font-black text-ocean-deep">{payload[0].value} click</p>
    </div>
  )
}

export default function WhatsappClicksChart({ data }: { data: Point[] }) {
  return (
    <div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D0E8F7" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: '#4A6580' }}
              axisLine={{ stroke: '#D0E8F7' }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: '#4A6580' }}
              axisLine={{ stroke: '#D0E8F7' }}
              tickLine={false}
              width={28}
            />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#1678C2"
              strokeWidth={2}
              dot={{ r: 4, fill: '#1678C2', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-bold text-[#4A6580]">Vedi tabella</summary>
        <table className="mt-2 w-full text-xs">
          <thead>
            <tr className="border-b border-[#D0E8F7] text-left text-[#4A6580]">
              <th className="py-1 font-bold">Giorno</th>
              <th className="py-1 font-bold">Click</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D0E8F7]">
            {data.map((point) => (
              <tr key={point.day}>
                <td className="py-1 text-[#4A6580]">{point.day}</td>
                <td className="py-1 font-bold text-ocean-deep">{point.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  )
}
