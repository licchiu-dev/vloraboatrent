import HeroVideo from '@/components/HeroVideo'
import BookingForm from '@/components/BookingForm'

type Lang = 'en' | 'it' | 'sq' | 'ar' | 'ru' | 'zh'

const copy = {
  en: {
    hero: ['The sea is waiting', 'at sunrise.'],
    subtitle: 'An authentic day among secret spots, local fishing techniques and the quiet of the morning sea.',
    cta: 'Book the experience',
    dayTitle: 'Your Day at Sea',
    daySub: 'An experience you will remember',
    timeline: [
      ['09:00', 'Departure', 'Meet the crew, board the boat and leave the harbor for the fishing grounds.', '⚓'],
      ['09:30-12:00', 'First fishing session', 'The morning starts with the first active fishing session guided by the local crew.', '🎣'],
      ['12:00-13:00', 'Lunch break', 'Time to relax, eat on board and enjoy the sea before the afternoon session.', '🍽️'],
      ['13:00-17:00', 'Second fishing session', 'Back to the rods for a longer afternoon session in selected fishing spots.', '🐟'],
      ['17:00', 'Return to harbor', 'We head back with photos, stories and the memories of a full day at sea.', '🌊'],
    ],
    equipmentTitle: 'Rental equipment',
    equipmentSub: 'Come hands-free. We take care of the gear',
    partnership: 'In partnership with Seagang',
    certified: 'Seagang certified equipment',
    partnershipText: 'All our fishing equipment is supplied and certified by Seagang, a sport fishing specialist. Placeholder partnership description to replace with final copy.',
    bookTitle: 'Book the experience',
    bookSub: 'We will contact you within 24 hours to confirm availability',
    equipment: [
      ['🎣', 'Fishing rod', 'Telescopic or casting rod', 'from €XX'],
      ['🔄', 'Reel', 'Spinning reel with line', 'from €XX'],
      ['🐟', 'Bait and lures', 'Complete live bait and lure set', 'from €XX'],
      ['🦺', 'Life jacket', 'CE certified, adults and children', 'included'],
    ],
  },
  it: {
    hero: ['Il mare ti aspetta', "all'alba."],
    subtitle: 'Una giornata autentica tra spot segreti, tecniche di pesca locali e il silenzio del mare al mattino.',
    cta: "Prenota l'esperienza",
    dayTitle: 'Com’è la tua giornata',
    daySub: 'Un’esperienza che non dimenticherai',
    timeline: [
      ['09:00', 'Partenza', 'Incontri l’equipaggio, sali a bordo e lasci il porto verso gli spot di pesca.', '⚓'],
      ['09:30-12:00', 'Prima sessione di pesca', 'La mattina entra nel vivo con la prima sessione di pesca guidata dallo staff locale.', '🎣'],
      ['12:00-13:00', 'Pausa pranzo', 'Un momento per rilassarsi, mangiare a bordo e godersi il mare prima del pomeriggio.', '🍽️'],
      ['13:00-17:00', 'Seconda sessione di pesca', 'Si torna alle canne per una sessione pomeridiana più lunga negli spot selezionati.', '🐟'],
      ['17:00', 'Rientro in porto', 'Rientriamo con foto, racconti e il ricordo di una giornata completa in mare.', '🌊'],
    ],
    equipmentTitle: 'Attrezzatura in noleggio',
    equipmentSub: 'Vieni a mani vuote, pensiamo noi a tutto',
    partnership: 'In partnership con Seagang',
    certified: 'Attrezzatura certificata Seagang',
    partnershipText: 'Tutta la nostra attrezzatura da pesca è fornita e certificata da Seagang, specialista della pesca sportiva. Descrizione placeholder della partnership da sostituire con il testo finale.',
    bookTitle: "Prenota l'esperienza",
    bookSub: 'Ti contatteremo entro 24 ore per confermare la disponibilità',
    equipment: [
      ['🎣', 'Canna da pesca', 'Canna telescopica o da lancio', 'da €XX'],
      ['🔄', 'Mulinello', 'Mulinello spinning con filo', 'da €XX'],
      ['🐟', 'Esche e artificiali', 'Set completo di esche vive e artificiali', 'da €XX'],
      ['🦺', 'Giubbotto salvagente', 'Omologato CE, adulti e bambini', 'incluso'],
    ],
  },
  sq: {
    hero: ['Deti të pret', 'në agim.'],
    subtitle: 'Një ditë autentike mes pikave sekrete, teknikave lokale të peshkimit dhe qetësisë së detit në mëngjes.',
    cta: 'Rezervo eksperiencën',
    dayTitle: 'Dita jote në det',
    daySub: 'Një eksperiencë që do ta mbash mend',
    timeline: [
      ['09:00', 'Nisja', 'Takohesh me ekuipazhin, hipën në bord dhe largohesh nga porti drejt pikave të peshkimit.', '⚓'],
      ['09:30-12:00', 'Sesioni i parë i peshkimit', 'Mëngjesi nis me sesionin e parë aktiv të peshkimit, të udhëhequr nga stafi lokal.', '🎣'],
      ['12:00-13:00', 'Pushim dreke', 'Kohë për relaks, drekë në bord dhe për të shijuar detin para sesionit të pasdites.', '🍽️'],
      ['13:00-17:00', 'Sesioni i dytë i peshkimit', 'Rikthehemi te kallamat për një sesion më të gjatë pasdite në pika të zgjedhura.', '🐟'],
      ['17:00', 'Kthim në port', 'Kthehemi me foto, histori dhe kujtime nga një ditë e plotë në det.', '🌊'],
    ],
    equipmentTitle: 'Pajisje me qira',
    equipmentSub: 'Eja pa pajisje, për to mendojmë ne',
    partnership: 'Në partneritet me Seagang',
    certified: 'Pajisje të certifikuara Seagang',
    partnershipText: 'Të gjitha pajisjet tona të peshkimit furnizohen dhe certifikohen nga Seagang, specialist i peshkimit sportiv. Përshkrim placeholder i partneritetit për t’u zëvendësuar me tekstin final.',
    bookTitle: 'Rezervo eksperiencën',
    bookSub: 'Do të të kontaktojmë brenda 24 orësh për të konfirmuar disponueshmërinë',
    equipment: [
      ['🎣', 'Kallam peshkimi', 'Kallam teleskopik ose për hedhje', 'nga €XX'],
      ['🔄', 'Mulinel', 'Mulinel spinning me fije', 'nga €XX'],
      ['🐟', 'Karrem dhe artificialë', 'Set i plotë karremi dhe artificialësh', 'nga €XX'],
      ['🦺', 'Jelek shpëtimi', 'I certifikuar CE, për të rritur dhe fëmijë', 'i përfshirë'],
    ],
  },
  ar: {
    hero: ['البحر ينتظرك', 'عند الشروق.'],
    subtitle: 'يوم أصيل بين أماكن سرية وتقنيات صيد محلية وهدوء البحر في الصباح.',
    cta: 'احجز التجربة',
    dayTitle: 'يومك في البحر',
    daySub: 'تجربة ستتذكرها',
    timeline: [
      ['09:00', 'الانطلاق', 'تلتقي بالطاقم، تصعد على متن القارب وتغادر الميناء نحو أماكن الصيد.', '⚓'],
      ['09:30-12:00', 'جلسة الصيد الأولى', 'يبدأ الصباح بجلسة الصيد الأولى بإرشاد الطاقم المحلي.', '🎣'],
      ['12:00-13:00', 'استراحة الغداء', 'وقت للاسترخاء وتناول الطعام على متن القارب والاستمتاع بالبحر قبل جلسة بعد الظهر.', '🍽️'],
      ['13:00-17:00', 'جلسة الصيد الثانية', 'نعود إلى الصنارات لجلسة أطول بعد الظهر في أماكن صيد مختارة.', '🐟'],
      ['17:00', 'العودة إلى الميناء', 'نعود بالصور والقصص وذكريات يوم كامل في البحر.', '🌊'],
    ],
    equipmentTitle: 'معدات للإيجار',
    equipmentSub: 'تعال بلا معدات. نحن نهتم بكل شيء',
    partnership: 'بالشراكة مع Seagang',
    certified: 'معدات معتمدة من Seagang',
    partnershipText: 'كل معدات الصيد لدينا مقدمة ومعتمدة من Seagang، المتخصصة في الصيد الرياضي. وصف مؤقت للشراكة يتم استبداله بالنص النهائي.',
    bookTitle: 'احجز التجربة',
    bookSub: 'سنتواصل معك خلال 24 ساعة لتأكيد التوفر',
    equipment: [
      ['🎣', 'صنارة صيد', 'صنارة تلسكوبية أو للرمي', 'من €XX'],
      ['🔄', 'بكرة', 'بكرة سبينينغ مع خيط', 'من €XX'],
      ['🐟', 'طعم وطعوم صناعية', 'مجموعة كاملة من الطعم الحي والصناعي', 'من €XX'],
      ['🦺', 'سترة نجاة', 'معتمدة CE للبالغين والأطفال', 'مشمول'],
    ],
  },
  ru: {
    hero: ['Море ждет вас', 'на рассвете.'],
    subtitle: 'Настоящий день среди секретных мест, местных техник рыбалки и утренней тишины моря.',
    cta: 'Забронировать тур',
    dayTitle: 'Ваш день на море',
    daySub: 'Впечатление, которое вы запомните',
    timeline: [
      ['09:00', 'Отправление', 'Вы встречаете команду, поднимаетесь на борт и выходите из гавани к местам рыбалки.', '⚓'],
      ['09:30-12:00', 'Первая рыболовная сессия', 'Утро начинается с первой активной рыбалки под руководством местной команды.', '🎣'],
      ['12:00-13:00', 'Обеденный перерыв', 'Время отдохнуть, поесть на борту и насладиться морем перед дневной сессией.', '🍽️'],
      ['13:00-17:00', 'Вторая рыболовная сессия', 'Возвращаемся к удочкам для более долгой дневной рыбалки в выбранных местах.', '🐟'],
      ['17:00', 'Возвращение в гавань', 'Мы возвращаемся с фотографиями, историями и воспоминаниями о полном дне на море.', '🌊'],
    ],
    equipmentTitle: 'Снаряжение напрокат',
    equipmentSub: 'Приезжайте налегке. О снаряжении позаботимся мы',
    partnership: 'В партнерстве с Seagang',
    certified: 'Снаряжение, сертифицированное Seagang',
    partnershipText: 'Все наше рыболовное снаряжение поставляется и сертифицируется Seagang, специалистом по спортивной рыбалке. Временное описание партнерства для замены финальным текстом.',
    bookTitle: 'Забронировать тур',
    bookSub: 'Мы свяжемся с вами в течение 24 часов, чтобы подтвердить наличие',
    equipment: [
      ['🎣', 'Удочка', 'Телескопическая или кастинговая удочка', 'от €XX'],
      ['🔄', 'Катушка', 'Спиннинговая катушка с леской', 'от €XX'],
      ['🐟', 'Наживка и приманки', 'Полный набор живой наживки и искусственных приманок', 'от €XX'],
      ['🦺', 'Спасательный жилет', 'Сертификация CE, для взрослых и детей', 'включено'],
    ],
  },
  zh: {
    hero: ['大海在等待', '日出时分。'],
    subtitle: '在秘密钓点、本地钓法和清晨海面的宁静中，度过真实的一天。',
    cta: '预订体验',
    dayTitle: '你的海上一天',
    daySub: '一段值得记住的体验',
    timeline: [
      ['09:00', '出发', '与船员会合，登船并从港口驶向钓点。', '⚓'],
      ['09:30-12:00', '第一段钓鱼', '上午由本地团队带领，开始第一段海钓活动。', '🎣'],
      ['12:00-13:00', '午餐休息', '在船上放松用餐，享受海景，然后进入下午行程。', '🍽️'],
      ['13:00-17:00', '第二段钓鱼', '回到钓竿旁，在精选钓点进行更长的下午钓鱼。', '🐟'],
      ['17:00', '返回港口', '带着照片、故事和一整天的海上回忆返航。', '🌊'],
    ],
    equipmentTitle: '租赁装备',
    equipmentSub: '空手来即可，装备由我们准备',
    partnership: '与 Seagang 合作',
    certified: 'Seagang 认证装备',
    partnershipText: '我们的所有钓鱼装备均由运动钓鱼专家 Seagang 提供并认证。此处为合作说明占位文案，之后可替换为最终内容。',
    bookTitle: '预订体验',
    bookSub: '我们将在 24 小时内联系你确认可订情况',
    equipment: [
      ['🎣', '钓竿', '伸缩竿或抛投竿', '起价 €XX'],
      ['🔄', '渔轮', '带鱼线的纺车轮', '起价 €XX'],
      ['🐟', '鱼饵和拟饵', '完整活饵和拟饵套装', '起价 €XX'],
      ['🦺', '救生衣', 'CE 认证，成人和儿童可用', '包含'],
    ],
  },
}

export default function PublicFishing({ lang }: { lang: Lang }) {
  const t = copy[lang]
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <div dir={dir}>
      <HeroVideo title={<>{t.hero[0]}<br /><span className="text-sand">{t.hero[1]}</span></>} subtitle={t.subtitle} ctaText={t.cta} ctaScrollTo="prenota" />

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black text-ocean-deep tracking-tight mb-3">{t.dayTitle}</h2>
            <p className="text-[#4A6580] text-xl">{t.daySub}</p>
          </div>

          <div className="relative overflow-x-auto pb-4">
            <div className="relative min-w-[62rem] md:min-w-0">
              <svg
                aria-hidden="true"
                viewBox="0 0 1000 260"
                preserveAspectRatio="none"
                className="absolute left-0 right-0 top-20 z-0 h-44 w-full"
              >
                <defs>
                  <linearGradient id="timelineSea" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#D8F7FF" />
                    <stop offset="45%" stopColor="#A8E9F8" />
                    <stop offset="100%" stopColor="#D8F7FF" />
                  </linearGradient>
                  <linearGradient id="timelineFoam" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#EAFBFF" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 142 C110 70 205 70 315 142 S535 214 645 142 S865 70 1000 142 L1000 260 L0 260 Z"
                  fill="url(#timelineSea)"
                  opacity="0.72"
                />
                <path
                  d="M0 128 C110 56 205 56 315 128 S535 200 645 128 S865 56 1000 128"
                  fill="none"
                  stroke="url(#timelineFoam)"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M25 154 C130 96 215 96 320 154 S535 212 640 154 S850 96 975 154"
                  fill="none"
                  stroke="#00B4D8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.65"
                />
                <path
                  d="M70 190 C145 154 210 154 285 190 M430 94 C500 60 560 60 630 94 M730 190 C805 154 870 154 945 190"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity="0.72"
                />
              </svg>

              <div className="relative z-10 grid grid-cols-5 gap-5">
              {t.timeline.map(([time, title, description, icon], index) => (
                <div
                  key={time}
                  className={`relative flex min-h-[24rem] flex-col items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-full ${index % 2 === 0 ? 'pb-28' : 'pt-28'}`}>
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-ocean-deep text-3xl text-white shadow-xl shadow-ocean-deep/20 ring-4 ring-ocean-light">
                      {icon}
                    </div>
                    <div className="rounded-2xl border border-[#D0E8F7] bg-white/95 p-5 shadow-lg shadow-ocean-bright/5 transition duration-300 hover:-translate-y-1 hover:border-ocean-bright hover:shadow-xl hover:shadow-ocean-bright/10">
                    <span className="inline-flex rounded-full bg-sand px-3 py-1 text-xs font-black text-ocean-deep">{time}</span>
                    <h3 className="mt-3 text-lg font-black leading-tight text-ocean-deep">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#4A6580]">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-ocean-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-ocean-deep tracking-tight mb-3">{t.equipmentTitle}</h2>
            <p className="text-[#4A6580] text-xl">{t.equipmentSub}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {t.equipment.map(([icon, name, description, price]) => (
              <div key={name} className="bg-white rounded-2xl p-6 text-center border border-[#D0E8F7] hover:border-ocean-bright hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <span className="text-4xl mb-4 block">{icon}</span>
                <h4 className="font-black text-ocean-deep mb-1">{name}</h4>
                <p className="text-[#4A6580] text-xs mb-3 leading-snug">{description}</p>
                <span className="inline-block bg-ocean-light text-ocean-mid text-xs font-bold px-3 py-1 rounded-full">{price}</span>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-3xl border-2 border-ocean-bright p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-ocean-mid to-ocean-bright rounded-2xl flex items-center justify-center">
                <span className="text-white font-black text-sm text-center leading-tight px-2">SEAGANG<br />LOGO</span>
              </div>
            </div>
            <div>
              <span className="inline-block bg-ocean-bright/15 text-ocean-bright text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">{t.partnership}</span>
              <h3 className="text-xl font-black text-ocean-deep mb-2">{t.certified}</h3>
              <p className="text-[#4A6580] leading-relaxed">{t.partnershipText}</p>
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
            <BookingForm tipo="esperienza" lang={lang} />
          </div>
        </div>
      </section>
    </div>
  )
}
