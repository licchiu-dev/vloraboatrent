'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  BarChart3,
  CalendarDays,
  DatabaseBackup,
  LogOut,
  Package,
  ShipWheel,
  Users,
  WalletCards,
} from 'lucide-react'

type AdminLang = 'en' | 'it' | 'sq'

const shellCopy = {
  en: {
    dashboard: 'Dashboard',
    bookings: 'Bookings',
    customers: 'Customers',
    partners: 'Partners',
    products: 'Products',
    suppliers: 'Suppliers',
    analytics: 'Analytics',
    settings: 'Settings',
    myBookings: 'My bookings',
    newBooking: 'New booking',
    adminArea: 'Admin area',
    partnerArea: 'Partner area',
    logout: 'Logout',
    language: 'Language',
  },
  it: {
    dashboard: 'Dashboard',
    bookings: 'Prenotazioni',
    customers: 'Clienti',
    partners: 'Partner',
    products: 'Prodotti',
    suppliers: 'Fornitori',
    analytics: 'Statistiche',
    settings: 'Impostazioni',
    myBookings: 'Le mie prenotazioni',
    newBooking: 'Nuova prenotazione',
    adminArea: 'Area admin',
    partnerArea: 'Area partner',
    logout: 'Esci',
    language: 'Lingua',
  },
  sq: {
    dashboard: 'Dashboard',
    bookings: 'Rezervime',
    customers: 'Klientë',
    partners: 'Partnerë',
    products: 'Produkte',
    suppliers: 'Furnitorë',
    analytics: 'Statistika',
    settings: 'Cilësime',
    myBookings: 'Rezervimet e mia',
    newBooking: 'Rezervim i ri',
    adminArea: 'Zona admin',
    partnerArea: 'Zona partner',
    logout: 'Dil',
    language: 'Gjuha',
  },
}

function adminLinks(t: typeof shellCopy.en) {
  return [
    { href: '/admin', label: t.dashboard, icon: BarChart3 },
    { href: '/admin/prenotazioni', label: t.bookings, icon: CalendarDays },
    { href: '/admin/clienti', label: t.customers, icon: Users },
    { href: '/admin/partner', label: t.partners, icon: WalletCards },
    { href: '/admin/prodotti', label: t.products, icon: Package },
    { href: '/admin/fornitori', label: t.suppliers, icon: ShipWheel },
    { href: '/admin/statistiche', label: t.analytics, icon: BarChart3 },
    { href: '/admin/impostazioni', label: t.settings, icon: DatabaseBackup },
  ]
}

function partnerLinks(t: typeof shellCopy.en) {
  return [
    { href: '/partner', label: t.dashboard, icon: BarChart3 },
    { href: '/partner/prenotazioni', label: t.myBookings, icon: CalendarDays },
    { href: '/partner/prenotazioni/nuova', label: t.newBooking, icon: Package },
  ]
}

export default function AdminShell({
  children,
  mode = 'admin',
}: {
  children: React.ReactNode
  mode?: 'admin' | 'partner'
}) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [lang, setLang] = useState<AdminLang>('en')
  const t = shellCopy[lang]
  const links = mode === 'partner' ? partnerLinks(t) : adminLinks(t)

  useEffect(() => {
    const saved = window.localStorage.getItem('valona-admin-lang') as AdminLang | null
    if (saved && saved in shellCopy) setLang(saved)
  }, [])

  function updateLang(value: AdminLang) {
    setLang(value)
    window.localStorage.setItem('valona-admin-lang', value)
  }

  return (
    <div className="min-h-screen bg-[#F4FAFD] text-[#0A1628]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-[#D0E8F7] bg-white lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-[#D0E8F7] px-6 font-black text-ocean-deep">
          <span className="text-2xl">⚓</span>
          Valona <span className="text-ocean-bright">Control</span>
        </div>
        <nav className="space-y-1 p-4">
          {links.map((link) => {
            const Icon = link.icon
            const active = pathname === link.href || (link.href !== `/${mode}` && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition ${
                  active ? 'bg-ocean-deep text-white shadow-lg shadow-ocean-deep/15' : 'text-[#4A6580] hover:bg-ocean-light'
                }`}
              >
                <Icon size={18} />
                {link.label}
                {link.href.endsWith('prenotazioni') && mode === 'admin' && (
                  <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">!</span>
                )}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-[#D0E8F7] bg-white/90 px-5 backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#8AACCC]">{mode === 'partner' ? t.partnerArea : t.adminArea}</p>
            <p className="font-black text-ocean-deep">{session?.user?.name ?? 'Valona Fishing'}</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="hidden items-center gap-2 text-xs font-bold text-[#4A6580] sm:flex">
              {t.language}
              <select
                value={lang}
                onChange={(event) => updateLang(event.target.value as AdminLang)}
                className="rounded-full border border-[#D0E8F7] bg-white px-3 py-1.5 text-ocean-deep outline-none"
              >
                <option value="en">EN</option>
                <option value="it">IT</option>
                <option value="sq">SQ</option>
              </select>
            </label>
            <span className="rounded-full bg-ocean-light px-3 py-1 text-xs font-bold text-ocean-deep">{session?.user?.role}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="inline-flex items-center gap-2 rounded-full bg-ocean-deep px-4 py-2 text-sm font-bold text-white transition hover:bg-ocean-mid"
            >
              <LogOut size={16} />
              {t.logout}
            </button>
          </div>
        </header>
        <div className="p-5 md:p-8">{children}</div>
      </div>
    </div>
  )
}
