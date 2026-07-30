export type RentalBoatKind = 'gommone_piccolo' | 'gommone_grande' | 'barca'
export type PublicRentalSlot = 'MATTINA' | 'POMERIGGIO' | 'GIORNATA_INTERA'

const JULY_PRICES: Record<RentalBoatKind, { fullDay: number; halfDay: number }> = {
  gommone_piccolo: { fullDay: 180, halfDay: 100 },
  gommone_grande: { fullDay: 200, halfDay: 120 },
  barca: { fullDay: 230, halfDay: 150 },
}

const AUGUST_PRICES: Record<RentalBoatKind, { fullDay: number; halfDay: number }> = {
  gommone_piccolo: { fullDay: 200, halfDay: 200 },
  gommone_grande: { fullDay: 230, halfDay: 230 },
  barca: { fullDay: 250, halfDay: 250 },
}

export function rentalBoatKind(input: { name: string; category?: string | null }) {
  const name = input.name.toLowerCase()
  if (input.category === 'BARCA' || /barca|brava|mingolla/.test(name)) return 'barca'
  if (/piccolo|small|500/.test(name)) return 'gommone_piccolo'
  return 'gommone_grande'
}

export function rentalPriceForDate(kind: RentalBoatKind, slot: PublicRentalSlot, date: string) {
  const month = Number(date.slice(5, 7))
  const seasonal = month === 8 ? AUGUST_PRICES[kind] : JULY_PRICES[kind]
  return slot === 'GIORNATA_INTERA' ? seasonal.fullDay : seasonal.halfDay
}

export function rentalProductNameForDate(kind: RentalBoatKind, slot: PublicRentalSlot, date: string) {
  return {
    gommone_piccolo: 'Noleggio Gommone Piccolo',
    gommone_grande: 'Noleggio Gommone Grande',
    barca: 'Noleggio Barca',
  }[kind]
}

export function publicSlotFromForm(value: string | undefined | null): PublicRentalSlot | null {
  if (value === 'Mattina') return 'MATTINA'
  if (value === 'Pomeriggio') return 'POMERIGGIO'
  if (value === 'Giornata intera') return 'GIORNATA_INTERA'
  return null
}

export function slotLabel(slot: PublicRentalSlot) {
  if (slot === 'MATTINA') return 'Mattina'
  if (slot === 'POMERIGGIO') return 'Pomeriggio'
  return 'Giornata intera'
}
