import Link from 'next/link'
import {
  Archive,
  Armchair,
  Bluetooth,
  Camera,
  Fish,
  MapPin,
  Package,
  Umbrella,
  UserCheck,
  Users,
  Waves,
} from 'lucide-react'
import HeroVideo from '@/components/HeroVideo'
import ServiceCard from '@/components/ServiceCard'
import FAQ from '@/components/FAQ'

type Lang = 'en' | 'it' | 'sq'

const copy = {
  en: {
    hero: ['Step aboard.', 'The sea', 'does the rest.'],
    subtitle: 'License-free boat rentals and unforgettable fishing experiences in the crystal-clear waters of Vlore.',
    cta: 'Explore experiences',
    experiences: 'Our Experiences',
    experiencesSub: 'Choose the adventure that fits your day',
    boatBadge: 'No license required',
    boatTitle: 'Boat Rental',
    boatDescription:
      'Explore the sea in total freedom. Our boats are safe, easy to drive and require no boating license, perfect for families and groups of friends.',
    fishingTitle: 'Fishing Experience',
    fishingDescription:
      'Reach secret fishing spots with expert local guides. Fishing gear is available to rent, and the experience is suitable for every level.',
    learnMore: 'Learn more',
    faqTitle: 'Frequently Asked Questions',
    faqSub: 'Everything you need to know before booking',
    ready: 'Ready to cast off?',
    readySub: 'Choose your experience and check available dates',
    availability: 'Check availability ->',
    boatFeatures: ['Sun canopy', 'Cushions', 'Bluetooth', 'Snorkeling', 'Action cam', 'Cooler box'],
    experienceFeatures: ['Local guide', 'Secret spots', 'Rod fishing', 'Freediving', 'Equipment', 'All levels'],
    faqs: [
      ['Do I need a boating license?', 'No. Our boats do not require a license, and we provide all the instructions before departure.'],
      ['How long is the rental?', 'We offer two options: full day or half day.'],
      ['Can I rent snorkeling or fishing equipment?', 'Yes. You can add snorkeling kits, action cams and fishing equipment directly while booking.'],
      ['Will I get instructions before driving the boat?', 'Absolutely. Before departure our team gives you a full driving briefing and points out the best local spots.'],
    ],
  },
  it: {
    hero: ['Sali a bordo.', 'Il resto', 'lo fa il mare.'],
    subtitle: 'Noleggio gommoni senza patente ed esperienze di pesca indimenticabili nelle acque cristalline di Valona.',
    cta: 'Scopri le esperienze',
    experiences: 'Le nostre esperienze',
    experiencesSub: "Scegli l'avventura che fa per te",
    boatBadge: 'Nessuna patente richiesta',
    boatTitle: 'Noleggio Gommone',
    boatDescription:
      'Esplora il mare in totale libertà. I nostri gommoni sono sicuri, facili da guidare e non richiedono patente nautica, perfetti per famiglie e gruppi di amici.',
    fishingTitle: 'Esperienza di Pesca',
    fishingDescription:
      "Accompagnati da guide esperte locali, raggiungerete gli spot segreti più pescosi. È possibile noleggiare l'attrezzatura da pesca ed è adatto a tutti i livelli.",
    learnMore: 'Scopri di più',
    faqTitle: 'Domande frequenti',
    faqSub: 'Tutto quello che devi sapere prima di prenotare',
    ready: 'Pronto a salpare?',
    readySub: 'Scegli la tua esperienza e controlla le date disponibili',
    availability: 'Verifica disponibilità ->',
    boatFeatures: ['Tendalino', 'Cuscini', 'Bluetooth', 'Snorkeling', 'Action cam', 'Box ghiaccio'],
    experienceFeatures: ['Guida locale', 'Spot segreti', 'Pesca con canna', 'Apnea', 'Attrezzatura', 'Tutti i livelli'],
    faqs: [
      ['È necessaria la patente nautica?', 'No, le nostre barche non richiedono patente. Forniamo tutte le istruzioni necessarie prima della partenza.'],
      ['Quanto dura il noleggio?', 'Offriamo due opzioni: giornata intera o mezza giornata.'],
      ["Posso noleggiare l'attrezzatura da snorkeling o da pesca?", 'Sì, puoi aggiungere kit snorkeling, action cam e attrezzatura da pesca direttamente al momento della prenotazione.'],
      ['Ricevo istruzioni su come guidare la barca?', 'Assolutamente sì. Prima della partenza il nostro staff fornisce un briefing completo sulla guida e ti indica i migliori spot della zona.'],
    ],
  },
  sq: {
    hero: ['Hipu në bord.', 'Deti', 'bën pjesën tjetër.'],
    subtitle: 'Qira gomonesh pa patentë dhe eksperienca peshkimi të paharrueshme në ujërat e kristalta të Vlorës.',
    cta: 'Shiko eksperiencat',
    experiences: 'Eksperiencat tona',
    experiencesSub: 'Zgjidh aventurën që i përshtatet ditës tënde',
    boatBadge: 'Nuk kërkohet patentë',
    boatTitle: 'Qira Gomonish',
    boatDescription:
      'Eksploro detin në liri të plotë. Gomonet tona janë të sigurta, të lehta për t’u drejtuar dhe nuk kërkojnë patentë, perfekte për familje dhe grupe miqsh.',
    fishingTitle: 'Eksperiencë Peshkimi',
    fishingDescription:
      'Me guida lokale me përvojë, arrin në pikat sekrete më të mira të peshkimit. Pajisjet mund të merren me qira dhe eksperienca është për çdo nivel.',
    learnMore: 'Më shumë',
    faqTitle: 'Pyetje të shpeshta',
    faqSub: 'Gjithçka që duhet të dish para rezervimit',
    ready: 'Gati për nisje?',
    readySub: 'Zgjidh eksperiencën dhe kontrollo datat e disponueshme',
    availability: 'Kontrollo disponueshmërinë ->',
    boatFeatures: ['Tendë dielli', 'Jastëkë', 'Bluetooth', 'Snorkeling', 'Action cam', 'Frigorifer'],
    experienceFeatures: ['Guidë lokale', 'Pika sekrete', 'Peshkim me kallam', 'Apnea', 'Pajisje', 'Çdo nivel'],
    faqs: [
      ['A më duhet patentë detare?', 'Jo, gomonet tona nuk kërkojnë patentë. Ne japim të gjitha udhëzimet e nevojshme para nisjes.'],
      ['Sa zgjat qiraja?', 'Ofrojmë dy opsione: ditë e plotë ose gjysmë dite.'],
      ['A mund të marr me qira pajisje snorkeling ose peshkimi?', 'Po, mund të shtosh kit snorkeling, action cam dhe pajisje peshkimi direkt gjatë rezervimit.'],
      ['A marr udhëzime për drejtimin e gomones?', 'Po. Para nisjes stafi ynë jep një briefing të plotë dhe të tregon pikat më të mira të zonës.'],
    ],
  },
}

const featureIcons = [Umbrella, Armchair, Bluetooth, Waves, Camera, Archive]
const experienceIcons = [UserCheck, MapPin, Fish, Waves, Package, Users]

function href(lang: Lang, page: 'rental' | 'fishing') {
  const prefix = lang === 'en' ? '' : `/${lang}`
  return `${prefix}/${page === 'rental' ? 'noleggio' : 'esperienza'}`
}

export default function PublicHome({ lang }: { lang: Lang }) {
  const t = copy[lang]
  const boatFeatures = t.boatFeatures.map((label, index) => {
    const Icon = featureIcons[index]
    return { icon: <Icon size={22} />, label }
  })
  const experienceFeatures = t.experienceFeatures.map((label, index) => {
    const Icon = experienceIcons[index]
    return { icon: <Icon size={22} />, label }
  })

  return (
    <>
      <HeroVideo
        title={<>{t.hero[0]}<br /><span className="text-sand">{t.hero[1]}</span><br />{t.hero[2]}</>}
        subtitle={t.subtitle}
        ctaText={t.cta}
        ctaScrollTo="esperienze"
      />

      <section id="esperienze" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-ocean-deep tracking-tight mb-3">{t.experiences}</h2>
            <p className="text-[#4A6580] text-xl">{t.experiencesSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ServiceCard icon="⛵" badge={t.boatBadge} title={t.boatTitle} description={t.boatDescription} features={boatFeatures} ctaText={t.learnMore} ctaHref={href(lang, 'rental')} />
            <ServiceCard icon="🎣" title={t.fishingTitle} description={t.fishingDescription} features={experienceFeatures} ctaText={t.learnMore} ctaHref={href(lang, 'fishing')} />
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-ocean-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-ocean-deep tracking-tight mb-3">{t.faqTitle}</h2>
            <p className="text-[#4A6580] text-xl">{t.faqSub}</p>
          </div>
          <FAQ items={t.faqs.map(([question, answer]) => ({ question, answer }))} />
        </div>
      </section>

      <section className="py-24 px-6" style={{ background: 'linear-gradient(135deg, #0A3D62 0%, #1678C2 50%, #0096C7 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">{t.ready}</h2>
          <p className="text-white/70 text-xl mb-12">{t.readySub}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link href={href(lang, 'rental')} className="flex items-center gap-4 bg-sand hover:bg-sand-dark text-ocean-deep font-bold px-8 py-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sand/30">
              <span className="text-3xl flex-shrink-0">⛵</span>
              <div className="text-left">
                <div className="font-black text-lg leading-tight">{t.boatTitle}</div>
                <div className="text-sm font-medium opacity-60 mt-0.5">{t.availability}</div>
              </div>
            </Link>
            <Link href={href(lang, 'fishing')} className="flex items-center gap-4 bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/60 text-white font-bold px-8 py-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <span className="text-3xl flex-shrink-0">🎣</span>
              <div className="text-left">
                <div className="font-black text-lg leading-tight">{t.fishingTitle}</div>
                <div className="text-sm font-medium opacity-60 mt-0.5">{t.availability}</div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
