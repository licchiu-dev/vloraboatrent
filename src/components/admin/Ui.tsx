export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-ocean-deep">{title}</h1>
        {subtitle && <p className="mt-1 text-[#4A6580]">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-[#D0E8F7] bg-white p-5 shadow-sm ${className}`}>{children}</div>
}

export function Badge({ children, tone = 'blue' }: { children: React.ReactNode; tone?: 'blue' | 'green' | 'yellow' | 'red' | 'dark' }) {
  const tones = {
    blue: 'bg-ocean-light text-ocean-deep',
    green: 'bg-emerald-100 text-emerald-800',
    yellow: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-800',
    dark: 'bg-slate-200 text-slate-800',
  }
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>
}

export function Skeleton() {
  return <div className="h-24 animate-pulse rounded-lg bg-[#D0E8F7]" />
}
