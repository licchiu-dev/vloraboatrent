'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const footerCopy = {
  en: {
    tagline: 'Authentic sea experiences in the heart of the Mediterranean.',
    navigation: 'Navigation',
    contacts: 'Contacts',
    rights: 'All rights reserved.',
    rentals: 'Boat Rentals',
    fishing: 'Fishing Experience',
    place: 'Via del Mare, 1 — Vlore',
  },
  it: {
    tagline: 'Esperienze di mare autentiche nel cuore del Mediterraneo.',
    navigation: 'Navigazione',
    contacts: 'Contatti',
    rights: 'Tutti i diritti riservati.',
    rentals: 'Noleggio Gommoni',
    fishing: 'Esperienza di Pesca',
    place: 'Via del Mare, 1 — Valona',
  },
  sq: {
    tagline: 'Eksperienca autentike në det, në zemër të Mesdheut.',
    navigation: 'Navigimi',
    contacts: 'Kontaktet',
    rights: 'Të gjitha të drejtat e rezervuara.',
    rentals: 'Qira Gomonish',
    fishing: 'Eksperiencë Peshkimi',
    place: 'Via del Mare, 1 — Vlorë',
  },
}

type Lang = keyof typeof footerCopy

function getLang(pathname: string): Lang {
  if (pathname.startsWith('/it')) return 'it'
  if (pathname.startsWith('/sq')) return 'sq'
  return 'en'
}

function path(lang: Lang, page: 'home' | 'rental' | 'fishing') {
  const prefix = lang === 'en' ? '' : `/${lang}`
  if (page === 'rental') return `${prefix}/noleggio`
  if (page === 'fishing') return `${prefix}/esperienza`
  return prefix || '/'
}

export default function Footer() {
  const lang = getLang(usePathname())
  const copy = footerCopy[lang]

  return (
    <footer className="bg-[#060E1A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚓</span>
              <span className="text-xl font-black tracking-tight">
                Valona <span className="text-ocean-bright">Fishing</span>
              </span>
            </div>
            <p className="text-white/45 text-sm leading-relaxed">{copy.tagline}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/35 mb-5">{copy.navigation}</h4>
            <ul className="space-y-3">
              {[
                { href: path(lang, 'home'), label: 'Home' },
                { href: path(lang, 'rental'), label: copy.rentals },
                { href: path(lang, 'fishing'), label: copy.fishing },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/65 hover:text-sand font-medium transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/35 mb-5">{copy.contacts}</h4>
            <ul className="space-y-3 text-white/65 text-sm">
              <li>
                <a href="mailto:info@valonafishing.com" className="hover:text-sand transition-colors">
                  ✉️ info@valonafishing.com
                </a>
              </li>
              <li>
                <a href="tel:+39000000000" className="hover:text-sand transition-colors">
                  📞 +39 000 000 0000
                </a>
              </li>
              <li>📍 {copy.place}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Valona Fishing. {copy.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
