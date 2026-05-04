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

type Lang = 'en' | 'it' | 'sq' | 'ar' | 'ru' | 'zh'

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
  ar: {
    hero: ['اصعد على متن القارب.', 'والبحر', 'يتكفل بالباقي.'],
    subtitle: 'تأجير قوارب بدون رخصة وتجارب صيد لا تنسى في مياه فلوره الصافية.',
    cta: 'استكشف التجارب',
    experiences: 'تجاربنا',
    experiencesSub: 'اختر المغامرة التي تناسب يومك',
    boatBadge: 'لا تحتاج إلى رخصة',
    boatTitle: 'تأجير القوارب',
    boatDescription:
      'استكشف البحر بحرية كاملة. قواربنا آمنة وسهلة القيادة ولا تحتاج إلى رخصة بحرية، وهي مثالية للعائلات ومجموعات الأصدقاء.',
    fishingTitle: 'تجربة صيد',
    fishingDescription:
      'وصل إلى أماكن الصيد السرية مع مرشدين محليين خبراء. تتوفر معدات الصيد للإيجار، والتجربة مناسبة لكل المستويات.',
    learnMore: 'اعرف المزيد',
    faqTitle: 'الأسئلة الشائعة',
    faqSub: 'كل ما تحتاج إلى معرفته قبل الحجز',
    ready: 'جاهز للإبحار؟',
    readySub: 'اختر تجربتك وتحقق من التواريخ المتاحة',
    availability: 'تحقق من التوفر ->',
    boatFeatures: ['مظلة شمس', 'وسائد', 'بلوتوث', 'سنوركلينغ', 'كاميرا حركة', 'صندوق تبريد'],
    experienceFeatures: ['مرشد محلي', 'أماكن سرية', 'صيد بالصنارة', 'غوص حر', 'معدات', 'كل المستويات'],
    faqs: [
      ['هل أحتاج إلى رخصة بحرية؟', 'لا. قواربنا لا تحتاج إلى رخصة، ونقدم لك كل التعليمات قبل الانطلاق.'],
      ['كم مدة التأجير؟', 'نوفر خيارين: يوم كامل أو نصف يوم.'],
      ['هل يمكنني استئجار معدات سنوركلينغ أو صيد؟', 'نعم. يمكنك إضافة معدات السنوركلينغ وكاميرات الحركة ومعدات الصيد مباشرة أثناء الحجز.'],
      ['هل سأحصل على تعليمات قبل قيادة القارب؟', 'بالتأكيد. قبل الانطلاق يقدم لك فريقنا شرحا كاملا للقيادة ويشير إلى أفضل الأماكن المحلية.'],
    ],
  },
  ru: {
    hero: ['Поднимайтесь на борт.', 'А море', 'сделает остальное.'],
    subtitle: 'Аренда лодок без прав и незабываемая рыбалка в кристально чистых водах Влёры.',
    cta: 'Посмотреть впечатления',
    experiences: 'Наши впечатления',
    experiencesSub: 'Выберите приключение для своего дня',
    boatBadge: 'Права не требуются',
    boatTitle: 'Аренда лодки',
    boatDescription:
      'Исследуйте море в полной свободе. Наши лодки безопасны, просты в управлении и не требуют судоводительских прав, идеально для семей и компаний друзей.',
    fishingTitle: 'Рыболовный тур',
    fishingDescription:
      'Доберитесь до секретных мест для рыбалки с опытными местными гидами. Снаряжение можно взять напрокат, а тур подходит для любого уровня.',
    learnMore: 'Подробнее',
    faqTitle: 'Частые вопросы',
    faqSub: 'Все, что нужно знать перед бронированием',
    ready: 'Готовы выйти в море?',
    readySub: 'Выберите впечатление и проверьте доступные даты',
    availability: 'Проверить наличие ->',
    boatFeatures: ['Тент от солнца', 'Подушки', 'Bluetooth', 'Сноркелинг', 'Экшн-камера', 'Холодильник'],
    experienceFeatures: ['Местный гид', 'Секретные места', 'Ловля удочкой', 'Фридайвинг', 'Снаряжение', 'Любой уровень'],
    faqs: [
      ['Нужны ли права на лодку?', 'Нет. Для наших лодок права не нужны, а перед выходом мы даем все инструкции.'],
      ['Сколько длится аренда?', 'Мы предлагаем два варианта: полный день или полдня.'],
      ['Можно ли взять напрокат снаряжение для сноркелинга или рыбалки?', 'Да. Комплекты для сноркелинга, экшн-камеры и рыболовное снаряжение можно добавить прямо при бронировании.'],
      ['Будет ли инструктаж перед управлением лодкой?', 'Конечно. Перед отправлением наша команда проводит полный инструктаж и показывает лучшие места поблизости.'],
    ],
  },
  zh: {
    hero: ['登上船吧。', '大海', '会完成其余一切。'],
    subtitle: '在发罗拉清澈海域体验无需执照的船只租赁和难忘的海钓之旅。',
    cta: '探索体验',
    experiences: '我们的体验',
    experiencesSub: '选择适合你这一天的海上冒险',
    boatBadge: '无需驾照',
    boatTitle: '船只租赁',
    boatDescription:
      '自由探索大海。我们的船安全、易驾驶，无需船舶驾照，非常适合家庭和朋友出游。',
    fishingTitle: '海钓体验',
    fishingDescription:
      '跟随经验丰富的本地向导前往秘密钓点。可租用钓鱼装备，适合各种水平的客人。',
    learnMore: '了解更多',
    faqTitle: '常见问题',
    faqSub: '预订前你需要知道的一切',
    ready: '准备出海了吗？',
    readySub: '选择你的体验并查看可预订日期',
    availability: '查看可订 ->',
    boatFeatures: ['遮阳篷', '坐垫', '蓝牙', '浮潜', '运动相机', '冷藏箱'],
    experienceFeatures: ['本地向导', '秘密钓点', '竿钓', '自由潜', '装备', '适合所有水平'],
    faqs: [
      ['我需要船舶驾照吗？', '不需要。我们的船无需驾照，出发前会提供全部操作说明。'],
      ['租赁时长多久？', '我们提供两种选择：全天或半天。'],
      ['可以租浮潜或钓鱼装备吗？', '可以。你可以在预订时直接添加浮潜套装、运动相机和钓鱼装备。'],
      ['开船前会有指导吗？', '当然。出发前，我们的团队会进行完整驾驶讲解，并指出附近最值得去的地点。'],
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
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const boatFeatures = t.boatFeatures.map((label, index) => {
    const Icon = featureIcons[index]
    return { icon: <Icon size={22} />, label }
  })
  const experienceFeatures = t.experienceFeatures.map((label, index) => {
    const Icon = experienceIcons[index]
    return { icon: <Icon size={22} />, label }
  })

  return (
    <div dir={dir}>
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
    </div>
  )
}
