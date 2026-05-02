import HeroVideo from '@/components/HeroVideo'
import FleetCard from '@/components/FleetCard'
import BookingForm from '@/components/BookingForm'

type Lang = 'en' | 'it' | 'sq'

const copy = {
  en: {
    hero: ['Head offshore.', 'No license needed.'],
    subtitle: 'Step aboard and discover hidden coves, crystal-clear seabeds and panoramic bays. No experience required.',
    cta: 'Book now',
    freedom: 'Total freedom at sea',
    p1: 'Come aboard and discover the coast the way only locals know it. With your boat you can reach Cala delle Aguglie, Baia degli Scogli Neri and the crystal-clear seabeds of Punta Bianca, secret spots that local guides know best.',
    p2: 'No license, no problem: our team gives you a complete navigation briefing and a map of the best anchorages in the area.',
    fleet: 'Our fleet',
    fleetSub: 'Choose the boat that fits your plans',
    included: 'What is included',
    includedSub: 'Everything you need for a perfect day',
    includedTitle: 'Included in the rental',
    extrasTitle: 'Extra services',
    bookTitle: 'Book your boat',
    bookSub: 'We will contact you within 24 hours to confirm availability',
    day: '/ day',
    capacityLabel: 'seats',
    fleetData: [
      ['Joker Boat Clubman 22', 6, '60 HP Yamaha', ['Shade canopy', 'Sun cushions', 'Bluetooth speaker', 'Snorkeling kit included'], 'from €XX'],
      ['Lomac 630 In', 8, '100 HP Mercury', ['Central console', 'XXL cooler box', 'GoPro action cam', 'Rear storage'], 'from €XX'],
      ['BWA 550 Sport', 5, '40 HP Honda', ['Compact and agile', 'Ideal for families', 'Easy to handle', 'Perfect for narrow coves'], 'from €XX'],
    ],
    includedList: ['Shade canopy', 'Sun cushions', 'Bluetooth speakers', 'Snorkeling kit', 'Action cam', 'Cooler box', 'Pre-departure briefing', 'Insurance included'],
    extras: [
      ['Sunset set', 'Placeholder description for the sunset set, for example an evening cruise with aperitif.', 'from €XX'],
      ['Extra snorkeling kit', 'Additional mask, fins and snorkel set.', 'from €XX'],
      ['Extra action cam', 'A second GoPro to capture every moment from your favorite angle.', 'from €XX'],
    ],
  },
  it: {
    hero: ['Prendi il largo.', 'Senza patente.'],
    subtitle: 'Sali a bordo e scopri calette nascoste, fondali cristallini e baie panoramiche. Nessuna esperienza richiesta.',
    cta: 'Prenota ora',
    freedom: 'Libertà totale sul mare',
    p1: 'Imbarcati e scopri la costa come solo chi vive il mare la conosce. A bordo del tuo gommone potrai raggiungere Cala delle Aguglie, Baia degli Scogli Neri e i fondali cristallini di Punta Bianca, spot segreti che le guide locali conoscono meglio di tutti.',
    p2: 'Nessuna patente, nessun problema: il nostro staff ti fornisce un briefing completo sulla navigazione e la mappa dei migliori ancoraggi della zona.',
    fleet: 'La nostra flotta',
    fleetSub: 'Scegli il gommone più adatto alle tue esigenze',
    included: 'Cosa è incluso',
    includedSub: 'Tutto quello che ti serve per una giornata perfetta',
    includedTitle: 'Inclusi nel noleggio',
    extrasTitle: 'Servizi aggiuntivi',
    bookTitle: 'Prenota il tuo gommone',
    bookSub: 'Ti contatteremo entro 24 ore per confermare la disponibilità',
    day: '/ giornata',
    capacityLabel: 'posti',
    fleetData: [
      ['Joker Boat Clubman 22', 6, '60 CV Yamaha', ['Tendalino ombreggiante', 'Cuscini prendisole', 'Bluetooth speaker', 'Kit snorkeling incluso'], 'da €XX'],
      ['Lomac 630 In', 8, '100 CV Mercury', ['Consolle centrale', 'Box ghiaccio XXL', 'Action cam GoPro', 'Gavone poppiero'], 'da €XX'],
      ['BWA 550 Sport', 5, '40 CV Honda', ['Compatta e agile', 'Ideale per famiglie', 'Facile da manovrare', 'Perfetta per calette strette'], 'da €XX'],
    ],
    includedList: ['Tendalino ombreggiante', 'Cuscini prendisole', 'Casse bluetooth', 'Kit snorkeling', 'Action cam', 'Box ghiaccio', 'Briefing pre-partenza', 'Assicurazione inclusa'],
    extras: [
      ['Set tramonto', 'Descrizione placeholder del set tramonto, per esempio uscita serale con aperitivo.', 'da €XX'],
      ['Kit snorkeling extra', 'Set aggiuntivo con maschera, pinne e boccaglio.', 'da €XX'],
      ['Action cam extra', 'Seconda GoPro per riprendere ogni momento dalla prospettiva che preferisci.', 'da €XX'],
    ],
  },
  sq: {
    hero: ['Dil në det.', 'Pa patentë.'],
    subtitle: 'Hipu në bord dhe zbulo gjire të fshehura, funde deti të kristalta dhe panorama të bukura. Nuk kërkohet eksperiencë.',
    cta: 'Rezervo tani',
    freedom: 'Liri e plotë në det',
    p1: 'Hipu në bord dhe zbulo bregdetin siç e njohin vetëm vendasit. Me gomonen tënde mund të arrish Cala delle Aguglie, Baia degli Scogli Neri dhe fundet e kristalta të Punta Bianca, pika sekrete që guidat lokale i njohin më mirë.',
    p2: 'Pa patentë, pa problem: ekipi ynë të jep një briefing të plotë për lundrimin dhe hartën e ankorimeve më të mira të zonës.',
    fleet: 'Flota jonë',
    fleetSub: 'Zgjidh gomonen që i përshtatet planeve të tua',
    included: 'Çfarë përfshihet',
    includedSub: 'Gjithçka që të duhet për një ditë perfekte',
    includedTitle: 'Të përfshira në qira',
    extrasTitle: 'Shërbime shtesë',
    bookTitle: 'Rezervo gomonen',
    bookSub: 'Do të të kontaktojmë brenda 24 orësh për të konfirmuar disponueshmërinë',
    day: '/ ditë',
    capacityLabel: 'vende',
    fleetData: [
      ['Joker Boat Clubman 22', 6, '60 HP Yamaha', ['Tendë dielli', 'Jastëkë për diell', 'Bluetooth speaker', 'Kit snorkeling i përfshirë'], 'nga €XX'],
      ['Lomac 630 In', 8, '100 HP Mercury', ['Konsolë qendrore', 'Frigorifer XXL', 'GoPro action cam', 'Hapësirë magazinimi'], 'nga €XX'],
      ['BWA 550 Sport', 5, '40 HP Honda', ['Kompakte dhe e shkathët', 'Ideale për familje', 'E lehtë për manovrim', 'Perfekte për gjire të ngushta'], 'nga €XX'],
    ],
    includedList: ['Tendë dielli', 'Jastëkë për diell', 'Altoparlantë bluetooth', 'Kit snorkeling', 'Action cam', 'Frigorifer', 'Briefing para nisjes', 'Sigurim i përfshirë'],
    extras: [
      ['Set perëndimi', 'Përshkrim placeholder për setin e perëndimit, për shembull dalje në mbrëmje me aperitiv.', 'nga €XX'],
      ['Kit snorkeling shtesë', 'Set shtesë me maskë, pendë dhe snorkel.', 'nga €XX'],
      ['Action cam shtesë', 'GoPro e dytë për të regjistruar çdo moment nga këndi që preferon.', 'nga €XX'],
    ],
  },
}

export default function PublicRental({ lang }: { lang: Lang }) {
  const t = copy[lang]

  return (
    <>
      <HeroVideo title={<>{t.hero[0]}<br /><span className="text-sand">{t.hero[1]}</span></>} subtitle={t.subtitle} ctaText={t.cta} ctaScrollTo="prenota" />

      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-ocean-deep mb-6 tracking-tight">{t.freedom}</h2>
          <p className="text-[#4A6580] text-xl leading-relaxed">{t.p1}</p>
          <p className="text-[#4A6580] text-xl leading-relaxed mt-6">{t.p2}</p>
        </div>
      </section>

      <section className="py-20 px-6 bg-ocean-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-ocean-deep tracking-tight mb-3">{t.fleet}</h2>
            <p className="text-[#4A6580] text-xl">{t.fleetSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.fleetData.map(([name, capacity, motorization, features, price]) => (
              <FleetCard
                key={name as string}
                name={name as string}
                capacity={capacity as number}
                motorization={motorization as string}
                features={features as string[]}
                price={price as string}
                capacityLabel={t.capacityLabel}
                priceSuffix={t.day}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-ocean-deep tracking-tight mb-3">{t.included}</h2>
            <p className="text-[#4A6580] text-xl">{t.includedSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-ocean-light rounded-3xl p-8">
              <h3 className="font-black text-xl text-ocean-deep mb-6 flex items-center gap-3"><span className="text-2xl">✅</span> {t.includedTitle}</h3>
              <ul className="space-y-3">
                {t.includedList.map((item) => <li key={item} className="flex items-center gap-3 text-[#0A1628] font-medium"><span className="text-ocean-bright font-bold text-lg leading-none">✓</span>{item}</li>)}
              </ul>
            </div>
            <div className="bg-white rounded-3xl p-8 border-2 border-[#D0E8F7]">
              <h3 className="font-black text-xl text-ocean-deep mb-6 flex items-center gap-3"><span className="text-2xl">➕</span> {t.extrasTitle}</h3>
              <ul className="space-y-5">
                {t.extras.map(([name, description, price]) => (
                  <li key={name} className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2"><span className="font-bold text-ocean-deep">{name}</span><span className="text-[#4A6580] text-sm">— {price}</span></div>
                    <span className="text-[#4A6580] text-sm">{description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="prenota" className="py-24 px-6" style={{ background: 'linear-gradient(135deg, #0A3D62 0%, #1678C2 50%, #0096C7 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">{t.bookTitle}</h2>
            <p className="text-white/70 text-lg">{t.bookSub}</p>
          </div>
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/25">
            <BookingForm tipo="noleggio" lang={lang} />
          </div>
        </div>
      </section>
    </>
  )
}
