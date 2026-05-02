export function isDemoMode() {
  return !process.env.DATABASE_URL
}

export const demoAdminUser = {
  id: 'demo-superadmin',
  email: 'admin@example.com',
  name: 'Demo Superadmin',
  role: 'SUPERADMIN' as const,
}

export const demoBookings = [
  {
    id: 'demo-1',
    customer: { name: 'Alex Johnson', email: 'alex@example.com', phone: '+39 333 000 001' },
    date: new Date(),
    timeSlot: 'GIORNATA_INTERA',
    status: 'CONFIRMED',
    totalPublic: 230,
    totalPartner: 202.4,
    commission: 27.6,
    createdBy: 'WEBSITE',
    partner: { companyName: 'Mario Travels Vlore' },
    items: [{ product: { name: 'Noleggio Gommone - Giornata intera' }, quantity: 1 }],
  },
  {
    id: 'demo-2',
    customer: { name: 'Emma Brown', email: 'emma@example.com', phone: '+39 333 000 002' },
    date: new Date(Date.now() + 86400000),
    timeSlot: 'MEZZA_GIORNATA',
    status: 'PENDING',
    totalPublic: 150,
    totalPartner: 132,
    commission: 18,
    createdBy: 'PARTNER',
    partner: { companyName: 'Arben Sea Guide' },
    items: [{ product: { name: 'Noleggio Gommone - Mezza giornata' }, quantity: 1 }],
  },
  {
    id: 'demo-3',
    customer: { name: 'Luca Smith', email: 'luca@example.com', phone: '+39 333 000 003' },
    date: new Date(Date.now() + 172800000),
    timeSlot: 'GIORNATA_INTERA',
    status: 'COMPLETED',
    totalPublic: 140,
    totalPartner: null,
    commission: null,
    createdBy: 'ADMIN',
    partner: null,
    items: [{ product: { name: 'Esperienza di Pesca - Giornata intera' }, quantity: 1 }],
  },
]
