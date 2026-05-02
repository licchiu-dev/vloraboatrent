import Link from 'next/link'

interface ServiceFeature {
  icon: React.ReactNode
  label: string
}

interface ServiceCardProps {
  icon?: React.ReactNode
  imageSrc?: string
  badge?: string
  title: string
  description: string
  features?: ServiceFeature[]
  ctaText: string
  ctaHref: string
}

export default function ServiceCard({
  icon,
  imageSrc,
  badge,
  title,
  description,
  features,
  ctaText,
  ctaHref,
}: ServiceCardProps) {
  return (
    <div className="bg-white rounded-3xl border-2 border-[#D0E8F7] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-ocean-bright/15 hover:border-ocean-bright flex flex-col">
      {/* Image / placeholder */}
      <div className="relative h-52 overflow-hidden">
        {imageSrc ? (
          <>
            <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-ocean-deep/30" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ocean-deep via-ocean-mid to-ocean-bright flex items-center justify-center">
            {icon && (
              <div className="text-6xl relative z-10 drop-shadow-xl">{icon}</div>
            )}
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col flex-1">
        {badge && (
          <span className="inline-block bg-ocean-light text-ocean-mid text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 w-fit">
            {badge}
          </span>
        )}

        <h3 className="text-2xl font-black text-ocean-deep mb-3 tracking-tight">{title}</h3>
        <p className="text-[#4A6580] leading-relaxed mb-6">{description}</p>

        {features && (
          <div className="grid grid-cols-3 gap-4 mb-8 p-5 bg-ocean-light/50 rounded-2xl">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-center">
                <div className="flex items-center justify-center w-7 h-7 text-ocean-mid">
                  {f.icon}
                </div>
                <span className="text-xs text-[#4A6580] font-semibold leading-tight">{f.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto">
          <Link
            href={ctaHref}
            className="block w-full bg-sand hover:bg-sand-dark text-ocean-deep font-bold text-center py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sand/30"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  )
}
