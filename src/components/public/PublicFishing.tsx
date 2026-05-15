import HeroVideo from '@/components/HeroVideo'
import BookingForm from '@/components/BookingForm'
import { formatEuroPrice, getProductPricesByName } from '@/lib/public-pricing'
import {
  Anchor,
  Fish,
  FishingRod,
  UtensilsCrossed,
  Waves,
} from 'lucide-react'

type Lang = 'en' | 'it' | 'sq' | 'ar' | 'ru' | 'zh'

const fishingPriceProducts = [
  'Esperienza di Pesca - Giornata intera',
  'Canna + Mulinello',
  'Esca',
  'Artificiale',
  'Action Cam',
  'Maschera + Boccaglio',
  'Pinne',
  'Muta 3 mm',
  'Calzari',
  'Cintura + Pesi',
  'Fucile Sub',
  'Torcia Sub',
] as const

const fallbackFishingPrices: Record<(typeof fishingPriceProducts)[number], number> = {
  'Esperienza di Pesca - Giornata intera': 100,
  'Canna + Mulinello': 15,
  Esca: 10,
  Artificiale: 5,
  'Action Cam': 50,
  'Maschera + Boccaglio': 10,
  Pinne: 10,
  'Muta 3 mm': 20,
  Calzari: 5,
  'Cintura + Pesi': 10,
  'Fucile Sub': 25,
  'Torcia Sub': 15,
}

const copy = {
  en: {
    hero: ['The sea is waiting', 'at sunrise.'],
    subtitle: 'An authentic day among secret spots, local fishing techniques and the quiet of the morning sea.',
    cta: 'Book the experience',
    dayTitle: 'Your Day at Sea',
    daySub: 'An experience you will remember',
    timeline: [
      ['09:00', 'Departure', 'Meet the crew, board the boat and leave the harbor for the fishing grounds.'],
      ['09:30-12:00', 'First fishing session', 'The morning starts with the first active fishing session guided by the local crew.'],
      ['12:00-13:00', 'Lunch break', 'Time to relax, eat on board and enjoy the sea before the afternoon session.'],
      ['13:00-17:00', 'Second fishing session', 'Back to the rods for a longer afternoon session in selected fishing spots.'],
      ['17:00', 'Return to harbor', 'We head back with photos, stories and the memories of a full day at sea.'],
    ],
    priceTitle: 'Session price',
    priceValue: '€100 per person',
    priceUnit: 'per person',
    priceMeta: 'Maximum 4 people per session',
    includedTitle: 'All inclusive',
    priceIncluded: ['Fuel', 'Boat with fish finder and professional equipment', 'Fish storage box', 'Lunch'],
    priceExcluded: 'Excluded: fishing equipment rental',
    gearTitle: 'What is included',
    gearSub: 'Choose the style of fishing and see what is already on board or available as an extra.',
    rodTitle: 'Rod fishing',
    spearTitle: 'Spearfishing',
    includedLabel: 'Included in the experience',
    extrasLabel: 'Rentable / paid extras',
    rodIncluded: ['Expert guide support', 'Landing net', 'Pliers / scissors', 'Cooler box', 'Rod holders / supports', 'Small technical kit included: hooks, sinkers and basic swivels'],
    rodExtras: [
      ['Canna + Mulinello', 'Rod + reel'],
      ['Esca', 'Bait'],
      ['Artificiale', 'Lure'],
      ['Action Cam', 'Action cam'],
    ],
    spearIncluded: [
      ['Safety briefing', 'Equipment use, depth, distances and speargun handling'],
      ['Guide support', 'Required, especially for non-local guests'],
      ['Diver-down buoy', 'Always provided'],
      ['Safety knife', 'Included in the guided kit'],
      ['First-aid kit on board', 'Included on the boat'],
      ['Cooler box', 'Included on board'],
      ['Boat support', 'Recovery, assistance and group control'],
    ],
    spearExtras: [
      ['Maschera + Boccaglio', 'Mask + snorkel'],
      ['Pinne', 'Fins'],
      ['Muta 3 mm', '3 mm wetsuit'],
      ['Calzari', 'Booties'],
      ['Cintura + Pesi', 'Weight belt + weights'],
      ['Fucile Sub', 'Speargun'],
      ['Torcia Sub', 'Dive torch'],
      ['Action Cam', 'Action cam'],
    ],
    partnership: 'In partnership with Seagang',
    certified: 'Seagang certified equipment',
    partnershipText: 'All our fishing equipment is supplied and certified by Seagang, a sport fishing specialist. Placeholder partnership description to replace with final copy.',
    bookTitle: 'Book the experience',
    bookSub: 'We will contact you within 24 hours to confirm availability',
  },
  it: {
    hero: ['Il mare ti aspetta', "all'alba."],
    subtitle: 'Una giornata autentica tra spot segreti, tecniche di pesca locali e il silenzio del mare al mattino.',
    cta: "Prenota l'esperienza",
    dayTitle: 'Com’è la tua giornata',
    daySub: 'Un’esperienza che non dimenticherai',
    timeline: [
      ['09:00', 'Partenza', 'Incontri l’equipaggio, sali a bordo e lasci il porto verso gli spot di pesca.'],
      ['09:30-12:00', 'Prima sessione di pesca', 'La mattina entra nel vivo con la prima sessione di pesca guidata dallo staff locale.'],
      ['12:00-13:00', 'Pausa pranzo', 'Un momento per rilassarsi, mangiare a bordo e godersi il mare prima del pomeriggio.'],
      ['13:00-17:00', 'Seconda sessione di pesca', 'Si torna alle canne per una sessione pomeridiana più lunga negli spot selezionati.'],
      ['17:00', 'Rientro in porto', 'Rientriamo con foto, racconti e il ricordo di una giornata completa in mare.'],
    ],
    priceTitle: 'Costo sessione',
    priceValue: '100€ a persona',
    priceUnit: 'a persona',
    priceMeta: 'Massimo 4 persone per sessione',
    includedTitle: 'All inclusive',
    priceIncluded: ['Carburante', 'Barca con ecoscandaglio e strumentazione professionale', 'Box per raccogliere il pesce', 'Pranzo'],
    priceExcluded: "Escluso: noleggio dell'attrezzatura",
    gearTitle: 'Cosa è incluso',
    gearSub: 'Due modi di vivere la pesca, con ciò che è già compreso e ciò che puoi aggiungere a pagamento.',
    rodTitle: 'Pesca con le canne',
    spearTitle: 'Pesca in apnea',
    includedLabel: 'Incluso nell’esperienza',
    extrasLabel: 'Noleggiabile / extra a pagamento',
    rodIncluded: ['Supporto guida esperta', 'Retino', 'Pinza / forbici', 'Ghiacciaia', 'Porta canna / supporti', 'Piccola dotazione tecnica inclusa: ami, piombi e girelle base'],
    rodExtras: [
      ['Canna + Mulinello', 'Canna + mulinello'],
      ['Esca', 'Esca'],
      ['Artificiale', 'Artificiale'],
      ['Action Cam', 'Action cam'],
    ],
    spearIncluded: [
      ['Briefing sicurezza', 'Uso attrezzatura, profondità, distanze, gestione fucile'],
      ['Accompagnamento / guida', 'Obbligatorio, soprattutto per clienti non locali'],
      ['Boa segnasub', 'Da prevedere sempre'],
      ['Coltello di sicurezza', 'Incluso nel kit guidato'],
      ['Kit primo soccorso a bordo', 'Incluso nella barca'],
      ['Ghiacciaia', 'Inclusa a bordo'],
      ['Supporto barca', 'Recupero, assistenza e controllo gruppo'],
    ],
    spearExtras: [
      ['Maschera + Boccaglio', 'Maschera + boccaglio'],
      ['Pinne', 'Pinne'],
      ['Muta 3 mm', 'Muta 3 mm'],
      ['Calzari', 'Calzari'],
      ['Cintura + Pesi', 'Cintura + pesi'],
      ['Fucile Sub', 'Fucile sub'],
      ['Torcia Sub', 'Torcia sub'],
      ['Action Cam', 'Action cam'],
    ],
    partnership: 'In partnership con Seagang',
    certified: 'Attrezzatura certificata Seagang',
    partnershipText: 'Tutta la nostra attrezzatura da pesca è fornita e certificata da Seagang, specialista della pesca sportiva. Descrizione placeholder della partnership da sostituire con il testo finale.',
    bookTitle: "Prenota l'esperienza",
    bookSub: 'Ti contatteremo entro 24 ore per confermare la disponibilità',
  },
  sq: {
    hero: ['Deti të pret', 'në agim.'],
    subtitle: 'Një ditë autentike mes pikave sekrete, teknikave lokale të peshkimit dhe qetësisë së detit në mëngjes.',
    cta: 'Rezervo eksperiencën',
    dayTitle: 'Dita jote në det',
    daySub: 'Një eksperiencë që do ta mbash mend',
    timeline: [
      ['09:00', 'Nisja', 'Takohesh me ekuipazhin, hipën në bord dhe largohesh nga porti drejt pikave të peshkimit.'],
      ['09:30-12:00', 'Sesioni i parë i peshkimit', 'Mëngjesi nis me sesionin e parë aktiv të peshkimit, të udhëhequr nga stafi lokal.'],
      ['12:00-13:00', 'Pushim dreke', 'Kohë për relaks, drekë në bord dhe për të shijuar detin para sesionit të pasdites.'],
      ['13:00-17:00', 'Sesioni i dytë i peshkimit', 'Rikthehemi te kallamat për një sesion më të gjatë pasdite në pika të zgjedhura.'],
      ['17:00', 'Kthim në port', 'Kthehemi me foto, histori dhe kujtime nga një ditë e plotë në det.'],
    ],
    priceTitle: 'Çmimi i sesionit',
    priceValue: '100€ për person',
    priceUnit: 'për person',
    priceMeta: 'Maksimumi 4 persona për sesion',
    includedTitle: 'Gjithçka e përfshirë',
    priceIncluded: ['Karburanti', 'Varkë me fish finder dhe pajisje profesionale', 'Kuti për ruajtjen e peshkut', 'Dreka'],
    priceExcluded: 'Nuk përfshihet: qiraja e pajisjeve të peshkimit',
    gearTitle: 'Çfarë përfshihet',
    gearSub: 'Dy mënyra peshkimi, me atë që përfshihet dhe me ekstra që mund të shtosh.',
    rodTitle: 'Peshkim me kallama',
    spearTitle: 'Peshkim në apnea',
    includedLabel: 'Përfshirë në eksperiencë',
    extrasLabel: 'Me qira / ekstra me pagesë',
    rodIncluded: ['Mbështetje nga guidë eksperte', 'Rrjetë', 'Pinca / gërshërë', 'Kuti ftohëse', 'Mbajtëse kallami', 'Set teknik bazë: grepa, plumba dhe rrotulluese'],
    rodExtras: [
      ['Canna + Mulinello', 'Kallam + mulinel'],
      ['Esca', 'Karrem'],
      ['Artificiale', 'Artificial'],
      ['Action Cam', 'Action cam'],
    ],
    spearIncluded: [
      ['Briefing sigurie', 'Përdorimi i pajisjeve, thellësia, distancat dhe menaxhimi i armës'],
      ['Shoqërim / guidë', 'I detyrueshëm, sidomos për klientët jo lokalë'],
      ['Bojë sinjalizuese', 'Gjithmonë e përfshirë'],
      ['Thikë sigurie', 'Përfshirë në kitin e guiduar'],
      ['Kit i ndihmës së parë në bord', 'Përfshirë në varkë'],
      ['Kuti ftohëse', 'E përfshirë në bord'],
      ['Mbështetje nga varka', 'Rikuperim, asistencë dhe kontroll i grupit'],
    ],
    spearExtras: [
      ['Maschera + Boccaglio', 'Maskë + tub frymëmarrjeje'],
      ['Pinne', 'Penda'],
      ['Muta 3 mm', 'Kostum 3 mm'],
      ['Calzari', 'Çorape uji'],
      ['Cintura + Pesi', 'Rrip + pesha'],
      ['Fucile Sub', 'Pushkë nënujore'],
      ['Torcia Sub', 'Dritë nënujore'],
      ['Action Cam', 'Action cam'],
    ],
    partnership: 'Në partneritet me Seagang',
    certified: 'Pajisje të certifikuara Seagang',
    partnershipText: 'Të gjitha pajisjet tona të peshkimit furnizohen dhe certifikohen nga Seagang, specialist i peshkimit sportiv. Përshkrim placeholder i partneritetit për t’u zëvendësuar me tekstin final.',
    bookTitle: 'Rezervo eksperiencën',
    bookSub: 'Do të të kontaktojmë brenda 24 orësh për të konfirmuar disponueshmërinë',
  },
  ar: {
    hero: ['البحر ينتظرك', 'عند الشروق.'],
    subtitle: 'يوم أصيل بين أماكن سرية وتقنيات صيد محلية وهدوء البحر في الصباح.',
    cta: 'احجز التجربة',
    dayTitle: 'يومك في البحر',
    daySub: 'تجربة ستتذكرها',
    timeline: [
      ['09:00', 'الانطلاق', 'تلتقي بالطاقم، تصعد على متن القارب وتغادر الميناء نحو أماكن الصيد.'],
      ['09:30-12:00', 'جلسة الصيد الأولى', 'يبدأ الصباح بجلسة الصيد الأولى بإرشاد الطاقم المحلي.'],
      ['12:00-13:00', 'استراحة الغداء', 'وقت للاسترخاء وتناول الطعام على متن القارب والاستمتاع بالبحر قبل جلسة بعد الظهر.'],
      ['13:00-17:00', 'جلسة الصيد الثانية', 'نعود إلى الصنارات لجلسة أطول بعد الظهر في أماكن صيد مختارة.'],
      ['17:00', 'العودة إلى الميناء', 'نعود بالصور والقصص وذكريات يوم كامل في البحر.'],
    ],
    priceTitle: 'سعر الجلسة',
    priceValue: '100€ للشخص',
    priceUnit: 'للشخص',
    priceMeta: 'بحد أقصى 4 أشخاص لكل جلسة',
    includedTitle: 'شامل كلياً',
    priceIncluded: ['الوقود', 'قارب مزود بجهاز كشف الأسماك ومعدات احترافية', 'صندوق لحفظ الأسماك', 'الغداء'],
    priceExcluded: 'غير مشمول: استئجار معدات الصيد',
    gearTitle: 'ما هو مشمول',
    gearSub: 'طريقتان للصيد، مع ما هو مشمول وما يمكن إضافته مقابل رسوم.',
    rodTitle: 'الصيد بالقصبة',
    spearTitle: 'الصيد بالرمح',
    includedLabel: 'مشمول في التجربة',
    extrasLabel: 'إضافات للإيجار / مدفوعة',
    rodIncluded: ['دعم مرشد خبير', 'شبكة', 'كماشة / مقص', 'صندوق تبريد', 'حوامل القصبات', 'عدة تقنية أساسية: خطافات وأثقال ودوارات'],
    rodExtras: [
      ['Canna + Mulinello', 'قصبة + بكرة'],
      ['Esca', 'طُعم'],
      ['Artificiale', 'طُعم صناعي'],
      ['Action Cam', 'كاميرا أكشن'],
    ],
    spearIncluded: [
      ['إحاطة السلامة', 'استخدام المعدات والعمق والمسافات والتعامل مع البندقية'],
      ['مرافقة / إرشاد', 'إلزامي خصوصاً للضيوف غير المحليين'],
      ['عوامة الغواص', 'متوفرة دائماً'],
      ['سكين أمان', 'مشمول في العدة المرافقة'],
      ['عدة إسعاف أولي على القارب', 'مشمولة في القارب'],
      ['صندوق تبريد', 'مشمول على متن القارب'],
      ['دعم القارب', 'استرجاع ومساعدة ومراقبة المجموعة'],
    ],
    spearExtras: [
      ['Maschera + Boccaglio', 'قناع + أنبوب تنفس'],
      ['Pinne', 'زعانف'],
      ['Muta 3 mm', 'بدلة 3 مم'],
      ['Calzari', 'حذاء مائي'],
      ['Cintura + Pesi', 'حزام + أوزان'],
      ['Fucile Sub', 'بندقية صيد'],
      ['Torcia Sub', 'مصباح غوص'],
      ['Action Cam', 'كاميرا أكشن'],
    ],
    partnership: 'بالشراكة مع Seagang',
    certified: 'معدات معتمدة من Seagang',
    partnershipText: 'كل معدات الصيد لدينا مقدمة ومعتمدة من Seagang، المتخصصة في الصيد الرياضي. وصف مؤقت للشراكة يتم استبداله بالنص النهائي.',
    bookTitle: 'احجز التجربة',
    bookSub: 'سنتواصل معك خلال 24 ساعة لتأكيد التوفر',
  },
  ru: {
    hero: ['Море ждет вас', 'на рассвете.'],
    subtitle: 'Настоящий день среди секретных мест, местных техник рыбалки и утренней тишины моря.',
    cta: 'Забронировать тур',
    dayTitle: 'Ваш день на море',
    daySub: 'Впечатление, которое вы запомните',
    timeline: [
      ['09:00', 'Отправление', 'Вы встречаете команду, поднимаетесь на борт и выходите из гавани к местам рыбалки.'],
      ['09:30-12:00', 'Первая рыболовная сессия', 'Утро начинается с первой активной рыбалки под руководством местной команды.'],
      ['12:00-13:00', 'Обеденный перерыв', 'Время отдохнуть, поесть на борту и насладиться морем перед дневной сессией.'],
      ['13:00-17:00', 'Вторая рыболовная сессия', 'Возвращаемся к удочкам для более долгой дневной рыбалки в выбранных местах.'],
      ['17:00', 'Возвращение в гавань', 'Мы возвращаемся с фотографиями, историями и воспоминаниями о полном дне на море.'],
    ],
    priceTitle: 'Стоимость сессии',
    priceValue: '100€ с человека',
    priceUnit: 'с человека',
    priceMeta: 'Максимум 4 человека за сессию',
    includedTitle: 'Все включено',
    priceIncluded: ['Топливо', 'Лодка с эхолотом и профессиональным оборудованием', 'Ящик для улова', 'Обед'],
    priceExcluded: 'Не включено: аренда рыболовного снаряжения',
    gearTitle: 'Что включено',
    gearSub: 'Два формата рыбалки: что уже входит и что можно добавить за доплату.',
    rodTitle: 'Рыбалка с удочками',
    spearTitle: 'Подводная охота',
    includedLabel: 'Включено в опыт',
    extrasLabel: 'Аренда / платные дополнения',
    rodIncluded: ['Поддержка опытного гида', 'Подсак', 'Плоскогубцы / ножницы', 'Холодильный бокс', 'Держатели удилищ', 'Базовый технический набор: крючки, грузила и вертлюги'],
    rodExtras: [
      ['Canna + Mulinello', 'Удочка + катушка'],
      ['Esca', 'Наживка'],
      ['Artificiale', 'Приманка'],
      ['Action Cam', 'Экшн-камера'],
    ],
    spearIncluded: [
      ['Инструктаж по безопасности', 'Использование снаряжения, глубина, дистанции и обращение с ружьем'],
      ['Сопровождение / гид', 'Обязательно, особенно для гостей не из региона'],
      ['Сигнальный буй', 'Предоставляется всегда'],
      ['Нож безопасности', 'Входит в комплект с гидом'],
      ['Аптечка на борту', 'Входит в оснащение лодки'],
      ['Холодильный бокс', 'Есть на борту'],
      ['Поддержка лодки', 'Подбор, помощь и контроль группы'],
    ],
    spearExtras: [
      ['Maschera + Boccaglio', 'Маска + трубка'],
      ['Pinne', 'Ласты'],
      ['Muta 3 mm', 'Гидрокостюм 3 мм'],
      ['Calzari', 'Боты'],
      ['Cintura + Pesi', 'Пояс + грузы'],
      ['Fucile Sub', 'Подводное ружье'],
      ['Torcia Sub', 'Подводный фонарь'],
      ['Action Cam', 'Экшн-камера'],
    ],
    partnership: 'В партнерстве с Seagang',
    certified: 'Снаряжение, сертифицированное Seagang',
    partnershipText: 'Все наше рыболовное снаряжение поставляется и сертифицируется Seagang, специалистом по спортивной рыбалке. Временное описание партнерства для замены финальным текстом.',
    bookTitle: 'Забронировать тур',
    bookSub: 'Мы свяжемся с вами в течение 24 часов, чтобы подтвердить наличие',
  },
  zh: {
    hero: ['大海在等待', '日出时分。'],
    subtitle: '在秘密钓点、本地钓法和清晨海面的宁静中，度过真实的一天。',
    cta: '预订体验',
    dayTitle: '你的海上一天',
    daySub: '一段值得记住的体验',
    timeline: [
      ['09:00', '出发', '与船员会合，登船并从港口驶向钓点。'],
      ['09:30-12:00', '第一段钓鱼', '上午由本地团队带领，开始第一段海钓活动。'],
      ['12:00-13:00', '午餐休息', '在船上放松用餐，享受海景，然后进入下午行程。'],
      ['13:00-17:00', '第二段钓鱼', '回到钓竿旁，在精选钓点进行更长的下午钓鱼。'],
      ['17:00', '返回港口', '带着照片、故事和一整天的海上回忆返航。'],
    ],
    priceTitle: '单次价格',
    priceValue: '每人 100€',
    priceUnit: '每人',
    priceMeta: '每场最多 4 人',
    includedTitle: '全包',
    priceIncluded: ['燃油', '配备探鱼器和专业设备的船只', '鱼获收纳箱', '午餐'],
    priceExcluded: '不包含：钓鱼装备租赁',
    gearTitle: '包含内容',
    gearSub: '两种钓鱼方式，清楚列出已包含内容和可付费增加的项目。',
    rodTitle: '竿钓',
    spearTitle: '自由潜渔猎',
    includedLabel: '体验已包含',
    extrasLabel: '可租赁 / 付费附加项',
    rodIncluded: ['专业向导支持', '抄网', '钳子 / 剪刀', '冷藏箱', '竿架 / 支架', '基础技术小套件：鱼钩、铅坠和基础转环'],
    rodExtras: [
      ['Canna + Mulinello', '鱼竿 + 渔轮'],
      ['Esca', '鱼饵'],
      ['Artificiale', '拟饵'],
      ['Action Cam', '运动相机'],
    ],
    spearIncluded: [
      ['安全说明', '装备使用、深度、距离和鱼枪管理'],
      ['陪同 / 向导', '尤其对非本地客人是必需的'],
      ['潜水员信号浮标', '始终提供'],
      ['安全刀', '包含在带向导套件中'],
      ['船上急救包', '船只已包含'],
      ['冷藏箱', '船上已包含'],
      ['船只支持', '接应、协助和团队控制'],
    ],
    spearExtras: [
      ['Maschera + Boccaglio', '面镜 + 呼吸管'],
      ['Pinne', '脚蹼'],
      ['Muta 3 mm', '3 mm 潜水服'],
      ['Calzari', '潜水袜'],
      ['Cintura + Pesi', '配重带 + 配重'],
      ['Fucile Sub', '鱼枪'],
      ['Torcia Sub', '潜水灯'],
      ['Action Cam', '运动相机'],
    ],
    partnership: '与 Seagang 合作',
    certified: 'Seagang 认证装备',
    partnershipText: '我们的所有钓鱼装备均由运动钓鱼专家 Seagang 提供并认证。此处为合作说明占位文案，之后可替换为最终内容。',
    bookTitle: '预订体验',
    bookSub: '我们将在 24 小时内联系你确认可订情况',
  },
}

const timelineIcons = [Anchor, FishingRod, UtensilsCrossed, Fish, Waves]

export default async function PublicFishing({ lang }: { lang: Lang }) {
  const t = copy[lang]
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const prices = await getProductPricesByName([...fishingPriceProducts])
  const resolvedExperiencePrice = prices['Esperienza di Pesca - Giornata intera'] ?? fallbackFishingPrices['Esperienza di Pesca - Giornata intera']
  const experiencePrice = lang === 'zh'
    ? `${t.priceUnit} ${formatEuroPrice(resolvedExperiencePrice)}`
    : `${formatEuroPrice(resolvedExperiencePrice)} ${t.priceUnit}`

  return (
    <div dir={dir}>
      <HeroVideo
        title={<>{t.hero[0]}<br /><span className="text-sand">{t.hero[1]}</span></>}
        subtitle={t.subtitle}
        ctaText={t.cta}
        ctaScrollTo="prenota"
        videoSrc="/videos/Spearfishibg.mp4"
      />

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
              {t.timeline.map(([time, title, description], index) => {
                const Icon = timelineIcons[index]

                return (
                <div
                  key={time}
                  className={`relative flex min-h-[24rem] flex-col items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-full ${index % 2 === 0 ? 'pb-28' : 'pt-28'}`}>
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-ocean-deep text-white shadow-xl shadow-ocean-deep/20 ring-4 ring-ocean-light">
                      <Icon className="h-7 w-7" strokeWidth={2.2} />
                    </div>
                    <div className="rounded-2xl border border-[#D0E8F7] bg-white/95 p-5 shadow-lg shadow-ocean-bright/5 transition duration-300 hover:-translate-y-1 hover:border-ocean-bright hover:shadow-xl hover:shadow-ocean-bright/10">
                    <span className="inline-flex rounded-full bg-sand px-3 py-1 text-xs font-black text-ocean-deep">{time}</span>
                    <h3 className="mt-3 text-lg font-black leading-tight text-ocean-deep">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#4A6580]">{description}</p>
                    </div>
                  </div>
                </div>
                )
              })}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-[#D0E8F7] bg-ocean-light/55 p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-ocean-mid">{t.priceTitle}</p>
                <p className="mt-2 text-3xl font-black text-ocean-deep">{experiencePrice}</p>
                <p className="mt-1 text-[#4A6580]">{t.priceMeta}</p>
              </div>
              <div className="md:max-w-md">
                <p className="font-black text-ocean-deep">{t.includedTitle}</p>
                <ul className="mt-3 grid gap-2 text-sm text-[#4A6580] sm:grid-cols-2">
                  {t.priceIncluded.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-ocean-bright" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm font-bold text-ocean-deep">{t.priceExcluded}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-ocean-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-ocean-deep tracking-tight mb-3">{t.gearTitle}</h2>
            <p className="text-[#4A6580] text-xl">{t.gearSub}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { title: t.rodTitle, included: t.rodIncluded, extras: t.rodExtras },
              { title: t.spearTitle, included: t.spearIncluded, extras: t.spearExtras },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl border border-[#D0E8F7] bg-white p-6 md:p-8">
                <h3 className="text-2xl font-black text-ocean-deep">{card.title}</h3>

                <div className="mt-6">
                  <p className="text-sm font-bold uppercase tracking-wider text-ocean-mid">{t.includedLabel}</p>
                  <ul className="mt-4 space-y-3">
                    {card.included.map((item) => {
                      const [label, note] = Array.isArray(item) ? item : [item]

                      return (
                        <li key={label} className="flex gap-3 text-sm leading-relaxed text-[#4A6580]">
                          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-ocean-bright" />
                          <span>
                            <strong className="font-bold text-ocean-deep">{label}</strong>
                            {note ? ` - ${note}` : ''}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div className="mt-8">
                  <p className="text-sm font-bold uppercase tracking-wider text-ocean-mid">{t.extrasLabel}</p>
                  <div className="mt-4 divide-y divide-[#D0E8F7] rounded-xl border border-[#D0E8F7]">
                    {card.extras.map(([productName, label]) => (
                      <div key={productName} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                        <span className="font-bold text-ocean-deep">{label}</span>
                        <span className="font-black text-ocean-mid">
                          {formatEuroPrice(prices[productName] ?? fallbackFishingPrices[productName as keyof typeof fallbackFishingPrices], '€XX')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 bg-white rounded-3xl border-2 border-ocean-bright p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-white">
                <img src="/images/seagang.png" alt="Seagang" className="h-full w-full object-contain" />
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
