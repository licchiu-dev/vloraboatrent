interface FleetCardProps {
  imageSrc?: string
  name: string
  capacity: number
  motorization: string
  features: string[]
  price?: string
  capacityLabel?: string
  priceSuffix?: string
}

export default function FleetCard({
  imageSrc,
  name,
  capacity,
  motorization,
  features,
  price,
  capacityLabel = 'posti',
  priceSuffix = '/ giornata',
}: FleetCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#D0E8F7] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ocean-bright/10 hover:border-ocean-bright flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-ocean-deep to-ocean-bright flex items-center justify-center overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-5xl drop-shadow-xl">⛵</span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h4 className="text-xl font-black text-ocean-deep mb-1 tracking-tight">{name}</h4>

        <div className="flex items-center gap-4 mb-4 text-sm text-[#4A6580]">
          <span className="flex items-center gap-1">
            <span>👥</span>
            <span>{capacity} {capacityLabel}</span>
          </span>
          <span className="flex items-center gap-1">
            <span>⚙️</span>
            <span>{motorization}</span>
          </span>
        </div>

        <ul className="space-y-2 flex-1">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-[#0A1628]">
              <span className="text-ocean-bright font-bold text-base leading-none">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {price && (
          <div className="mt-5 pt-4 border-t border-[#D0E8F7]">
            {/* TODO: Sostituire con prezzo reale */}
            <span className="text-ocean-deep font-black text-lg">{price}</span>
            <span className="text-[#4A6580] text-sm ml-1">{priceSuffix}</span>
          </div>
        )}
      </div>
    </div>
  )
}
