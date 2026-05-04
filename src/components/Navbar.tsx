'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const labels = {
  en: {
    rentals: 'Boat Rentals',
    fishing: 'Fishing Experience',
    book: 'Book',
    bookNow: 'Book now',
  },
  it: {
    rentals: 'Noleggio Gommoni',
    fishing: 'Esperienza di Pesca',
    book: 'Prenota',
    bookNow: 'Prenota ora',
  },
  sq: {
    rentals: 'Qira Gomonish',
    fishing: 'Eksperiencë Peshkimi',
    book: 'Rezervo',
    bookNow: 'Rezervo tani',
  },
  ar: {
    rentals: 'تأجير القوارب',
    fishing: 'تجربة صيد',
    book: 'احجز',
    bookNow: 'احجز الآن',
  },
  ru: {
    rentals: 'Аренда лодок',
    fishing: 'Рыболовный тур',
    book: 'Бронь',
    bookNow: 'Забронировать',
  },
  zh: {
    rentals: '船只租赁',
    fishing: '海钓体验',
    book: '预订',
    bookNow: '立即预订',
  },
}

type Lang = keyof typeof labels
const languages: Lang[] = ['en', 'it', 'sq', 'ar', 'ru', 'zh']

function getLang(pathname: string): Lang {
  if (pathname.startsWith('/it')) return 'it'
  if (pathname.startsWith('/sq')) return 'sq'
  if (pathname.startsWith('/ar')) return 'ar'
  if (pathname.startsWith('/ru')) return 'ru'
  if (pathname.startsWith('/zh')) return 'zh'
  return 'en'
}

function localizedPath(lang: Lang, section: 'home' | 'rental' | 'fishing') {
  const prefix = lang === 'en' ? '' : `/${lang}`
  if (section === 'rental') return `${prefix}/noleggio`
  if (section === 'fishing') return `${prefix}/esperienza`
  return prefix || '/'
}

function currentSection(pathname: string): 'home' | 'rental' | 'fishing' {
  if (pathname.includes('noleggio')) return 'rental'
  if (pathname.includes('esperienza')) return 'fishing'
  return 'home'
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const lang = getLang(pathname)
  const copy = labels[lang]
  const section = currentSection(pathname)
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: localizedPath(lang, 'home'), label: 'Home' },
    { href: localizedPath(lang, 'rental'), label: copy.rentals },
    { href: localizedPath(lang, 'fishing'), label: copy.fishing },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-ocean-deep/95 backdrop-blur-md py-3 shadow-lg shadow-black/20'
          : 'py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between" dir={dir}>

        {/* Logo */}
        {/* TODO: Sostituire il testo con un logo immagine reale */}
        <Link href={localizedPath(lang, 'home')} className="flex items-center gap-2 text-white font-black text-xl tracking-tight">
          <span className="text-2xl">⚓</span>
          <span>Valona <span className="text-sand">Fishing</span></span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-white/85 hover:text-white font-medium transition-colors duration-200 text-sm"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 rounded-full border border-white/20 px-2 py-1">
            {languages.map((item) => (
              <Link
                key={item}
                href={localizedPath(item, section)}
                className={`rounded-full px-2.5 py-1 text-xs font-black uppercase ${
                  item === lang ? 'bg-white text-ocean-deep' : 'text-white/75 hover:text-white'
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
          <a
            href="#prenota"
            className="bg-sand hover:bg-sand-dark text-ocean-deep font-bold px-6 py-2.5 rounded-full text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sand/30"
          >
            {copy.book}
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-white w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="bg-ocean-deep/98 backdrop-blur-md px-6 py-4 flex flex-col gap-1 border-t border-white/10" dir={dir}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-white/85 hover:text-white font-medium py-3 border-b border-white/10 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="#prenota"
            className="mt-3 bg-sand hover:bg-sand-dark text-ocean-deep font-bold px-6 py-3 rounded-full text-center transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {copy.bookNow}
          </a>
          <div className="mt-3 flex items-center justify-center gap-2">
            {languages.map((item) => (
              <Link
                key={item}
                href={localizedPath(item, section)}
                className={`rounded-full px-3 py-1.5 text-xs font-black uppercase ${
                  item === lang ? 'bg-white text-ocean-deep' : 'bg-white/10 text-white'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
