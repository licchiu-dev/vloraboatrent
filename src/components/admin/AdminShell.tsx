'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  BarChart3,
  CalendarDays,
  DatabaseBackup,
  LogOut,
  Menu,
  Package,
  ShipWheel,
  Users,
  WalletCards,
  X,
} from 'lucide-react'

type AdminLang = 'en' | 'it' | 'sq' | 'ar' | 'ru' | 'zh'

type ShellUser = {
  name?: string | null
  role?: string | null
}

const shellCopy = {
  en: {
    dashboard: 'Dashboard',
    bookings: 'Bookings',
    fleet: 'Fleet planning',
    customers: 'Customers',
    partners: 'Partners',
    products: 'Products',
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
    fleet: 'Programmazione flotta',
    customers: 'Clienti',
    partners: 'Partner',
    products: 'Prodotti',
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
    fleet: 'Planifikimi i flotës',
    customers: 'Klientë',
    partners: 'Partnerë',
    products: 'Produkte',
    settings: 'Cilësime',
    myBookings: 'Rezervimet e mia',
    newBooking: 'Rezervim i ri',
    adminArea: 'Zona admin',
    partnerArea: 'Zona partner',
    logout: 'Dil',
    language: 'Gjuha',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    bookings: 'الحجوزات',
    fleet: 'تخطيط الأسطول',
    customers: 'العملاء',
    partners: 'الشركاء',
    products: 'المنتجات',
    settings: 'الإعدادات',
    myBookings: 'حجوزاتي',
    newBooking: 'حجز جديد',
    adminArea: 'منطقة الإدارة',
    partnerArea: 'منطقة الشريك',
    logout: 'تسجيل الخروج',
    language: 'اللغة',
  },
  ru: {
    dashboard: 'Панель',
    bookings: 'Бронирования',
    fleet: 'План флота',
    customers: 'Клиенты',
    partners: 'Партнеры',
    products: 'Продукты',
    settings: 'Настройки',
    myBookings: 'Мои бронирования',
    newBooking: 'Новое бронирование',
    adminArea: 'Админ-зона',
    partnerArea: 'Партнерская зона',
    logout: 'Выйти',
    language: 'Язык',
  },
  zh: {
    dashboard: '仪表盘',
    bookings: '预订',
    fleet: '船队排期',
    customers: '客户',
    partners: '合作伙伴',
    products: '产品',
    settings: '设置',
    myBookings: '我的预订',
    newBooking: '新预订',
    adminArea: '管理区',
    partnerArea: '合作伙伴区',
    logout: '退出',
    language: '语言',
  },
}

function adminLinks(t: typeof shellCopy.en, role?: string) {
  const all = [
    { href: '/admin', label: t.dashboard, icon: BarChart3 },
    { href: '/admin/prenotazioni', label: t.bookings, icon: CalendarDays },
    { href: '/admin/flotta', label: t.fleet, icon: ShipWheel },
    { href: '/admin/clienti', label: t.customers, icon: Users },
    { href: '/admin/partner', label: t.partners, icon: WalletCards },
    { href: '/admin/prodotti', label: t.products, icon: Package },
    { href: '/admin/impostazioni', label: t.settings, icon: DatabaseBackup },
  ]
  if (role === 'ADMIN') {
    return all.filter((l) => l.href !== '/admin/prodotti' && l.href !== '/admin/impostazioni')
  }
  return all
}

function partnerLinks(t: typeof shellCopy.en) {
  return [
    { href: '/partner', label: t.dashboard, icon: BarChart3 },
    { href: '/partner/prenotazioni', label: t.myBookings, icon: CalendarDays },
    { href: '/partner/flotta', label: t.fleet, icon: ShipWheel },
    { href: '/partner/prenotazioni/nuova', label: t.newBooking, icon: Package },
  ]
}

function SidebarContent({
  links,
  mode,
  pathname,
  navigatingHref,
  onLinkClick,
}: {
  links: ReturnType<typeof adminLinks>
  mode: string
  pathname: string
  navigatingHref?: string
  onLinkClick?: (href: string) => void
}) {
  return (
    <nav className="space-y-1 p-4">
      {links.map((link) => {
        const Icon = link.icon
        const active = pathname === link.href || (link.href !== `/${mode}` && pathname.startsWith(link.href))
        const navigating = navigatingHref === link.href && !active
        return (
          <Link
            key={link.href}
            href={link.href}
            prefetch
            aria-current={active ? 'page' : undefined}
            onClick={() => onLinkClick?.(link.href)}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition ${
              active ? 'bg-ocean-deep text-white shadow-lg shadow-ocean-deep/15' : 'text-[#4A6580] hover:bg-ocean-light'
            }`}
          >
            <Icon size={18} />
            {link.label}
            {navigating && (
              <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-ocean-mid" aria-hidden />
            )}
            {link.href.endsWith('prenotazioni') && mode === 'admin' && (
              <span className={`${navigating ? '' : 'ml-auto'} rounded-full bg-red-500 px-2 py-0.5 text-xs text-white`}>!</span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

export default function AdminShell({
  children,
  mode = 'admin',
  user,
}: {
  children: React.ReactNode
  mode?: 'admin' | 'partner'
  user?: ShellUser
}) {
  const pathname = usePathname()
  const [lang, setLang] = useState<AdminLang>('en')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [navigatingHref, setNavigatingHref] = useState('')
  const t = shellCopy[lang]
  const role = user?.role ?? undefined
  const links = mode === 'partner' ? partnerLinks(t) : adminLinks(t, role)

  useEffect(() => {
    const saved = window.localStorage.getItem('valona-admin-lang') as AdminLang | null
    if (saved && saved in shellCopy) setLang(saved)
  }, [])

  // Close drawer on navigation
  useEffect(() => {
    setMobileOpen(false)
    setNavigatingHref('')
  }, [pathname])

  function updateLang(value: AdminLang) {
    setLang(value)
    window.localStorage.setItem('valona-admin-lang', value)
  }

  const sidebarHeader = (
    <div className="flex h-16 items-center gap-2 border-b border-[#D0E8F7] px-6 font-black text-ocean-deep">
      <img
        src="/images/nuovafoto-fronte.ai_4.png"
        alt="VLORA RENT A BOAT"
        className="h-9 w-9 rounded-full object-cover ring-1 ring-[#D0E8F7]"
      />
      <span className="text-sm leading-tight">VLORA RENT A BOAT</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F4FAFD] text-[#0A1628]">

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-[#D0E8F7] bg-white lg:flex lg:flex-col">
        {sidebarHeader}
        <SidebarContent
          links={links}
          mode={mode}
          pathname={pathname}
          navigatingHref={navigatingHref}
          onLinkClick={(href) => {
            if (href !== pathname) setNavigatingHref(href)
          }}
        />
      </aside>

      {/* Mobile drawer — slides in from left */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[#D0E8F7] bg-white transition-transform duration-200 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#D0E8F7] px-6">
          <div className="flex items-center gap-2 font-black text-ocean-deep">
            <img
              src="/images/nuovafoto-fronte.ai_4.png"
              alt="VLORA RENT A BOAT"
              className="h-9 w-9 rounded-full object-cover ring-1 ring-[#D0E8F7]"
            />
            <span className="text-sm leading-tight">VLORA RENT A BOAT</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-[#4A6580] hover:bg-ocean-light"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarContent
            links={links}
            mode={mode}
            pathname={pathname}
            navigatingHref={navigatingHref}
            onLinkClick={(href) => {
              setMobileOpen(false)
              if (href !== pathname) setNavigatingHref(href)
            }}
          />
        </div>
        {/* Language selector at bottom of mobile drawer */}
        <div className="border-t border-[#D0E8F7] p-4">
          <label className="flex items-center justify-between text-xs font-bold text-[#4A6580]">
            {t.language}
            <select
              value={lang}
              onChange={(e) => updateLang(e.target.value as AdminLang)}
              className="rounded-full border border-[#D0E8F7] bg-white px-3 py-1.5 text-ocean-deep outline-none"
            >
              <option value="en">EN</option>
              <option value="it">IT</option>
              <option value="sq">SQ</option>
              <option value="ar">AR</option>
              <option value="ru">RU</option>
              <option value="zh">ZH</option>
            </select>
          </label>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-[#D0E8F7] bg-white/90 px-4 backdrop-blur md:px-5">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-[#4A6580] hover:bg-ocean-light lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#8AACCC]">
                {mode === 'partner' ? t.partnerArea : t.adminArea}
              </p>
              <p className="font-black text-ocean-deep">{user?.name ?? 'VLORA RENT A BOAT'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
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
                <option value="ar">AR</option>
                <option value="ru">RU</option>
                <option value="zh">ZH</option>
              </select>
            </label>
            <span className="hidden rounded-full bg-ocean-light px-3 py-1 text-xs font-bold text-ocean-deep sm:inline">
              {user?.role}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="inline-flex items-center gap-2 rounded-full bg-ocean-deep px-3 py-2 text-sm font-bold text-white transition hover:bg-ocean-mid md:px-4"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  )
}
