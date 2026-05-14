'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AtSign, MapPin, Phone } from 'lucide-react'

const footerCopy = {
  en: {
    tagline: 'Authentic sea experiences in the heart of the Mediterranean.',
    navigation: 'Navigation',
    contacts: 'Contacts',
    rights: 'All rights reserved.',
    rentals: 'Boat Rentals',
    fishing: 'Fishing Experience',
    place: 'ISMAIL QEMALI STREET VLORA - ALBANIA',
  },
  it: {
    tagline: 'Esperienze di mare autentiche nel cuore del Mediterraneo.',
    navigation: 'Navigazione',
    contacts: 'Contatti',
    rights: 'Tutti i diritti riservati.',
    rentals: 'Noleggio Gommoni',
    fishing: 'Esperienza di Pesca',
    place: 'ISMAIL QEMALI STREET VLORA - ALBANIA',
  },
  sq: {
    tagline: 'Eksperienca autentike në det, në zemër të Mesdheut.',
    navigation: 'Navigimi',
    contacts: 'Kontaktet',
    rights: 'Të gjitha të drejtat e rezervuara.',
    rentals: 'Qira Gomonish',
    fishing: 'Eksperiencë Peshkimi',
    place: 'ISMAIL QEMALI STREET VLORA - ALBANIA',
  },
  ar: {
    tagline: 'تجارب بحرية أصيلة في قلب المتوسط.',
    navigation: 'التنقل',
    contacts: 'جهات الاتصال',
    rights: 'جميع الحقوق محفوظة.',
    rentals: 'تأجير القوارب',
    fishing: 'تجربة صيد',
    place: 'ISMAIL QEMALI STREET VLORA - ALBANIA',
  },
  ru: {
    tagline: 'Настоящие морские впечатления в сердце Средиземноморья.',
    navigation: 'Навигация',
    contacts: 'Контакты',
    rights: 'Все права защищены.',
    rentals: 'Аренда лодок',
    fishing: 'Рыболовный тур',
    place: 'ISMAIL QEMALI STREET VLORA - ALBANIA',
  },
  zh: {
    tagline: '地中海中心的真实海上体验。',
    navigation: '导航',
    contacts: '联系方式',
    rights: '保留所有权利。',
    rentals: '船只租赁',
    fishing: '海钓体验',
    place: 'ISMAIL QEMALI STREET VLORA - ALBANIA',
  },
}

const instagramUrl = 'https://www.instagram.com/newrentboatvlora'
const mapsUrl = 'https://maps.app.goo.gl/JZc1iYkMxDWnPVdp9'

type Lang = keyof typeof footerCopy

function getLang(pathname: string): Lang {
  if (pathname.startsWith('/it')) return 'it'
  if (pathname.startsWith('/sq')) return 'sq'
  if (pathname.startsWith('/ar')) return 'ar'
  if (pathname.startsWith('/ru')) return 'ru'
  if (pathname.startsWith('/zh')) return 'zh'
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
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <footer className="bg-[#060E1A] text-white" dir={dir}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/images/nuovafoto-fronte.ai_4.png"
                alt="VLORA RENT A BOAT"
                className="h-10 w-10 rounded-full object-cover brightness-0 invert"
              />
              <span className="text-xl font-black tracking-tight">VLORA RENT A BOAT</span>
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
                <a href={instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-sand transition-colors">
                  <AtSign size={17} strokeWidth={2.2} />
                  <span>@newrentboatvlora</span>
                </a>
              </li>
              <li>
                <a href="tel:+355692098978" className="flex items-center gap-3 hover:text-sand transition-colors">
                  <Phone size={17} strokeWidth={2.2} />
                  <span>+355 69 209 8978</span>
                </a>
              </li>
              <li>
                <a href={mapsUrl} target="_blank" rel="noreferrer" className="flex items-start gap-3 hover:text-sand transition-colors">
                  <MapPin size={17} strokeWidth={2.2} className="mt-0.5 flex-shrink-0" />
                  <span>{copy.place}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} VLORA RENT A BOAT. {copy.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
