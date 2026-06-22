import HeroVideo from '@/components/HeroVideo'
import FleetCard from '@/components/FleetCard'
import BookingForm from '@/components/BookingForm'
import { Anchor, Clock, Compass, FileText, Fuel, ShieldCheck, Smile } from 'lucide-react'

type Lang = 'en' | 'it' | 'sq' | 'ar' | 'ru' | 'zh'
// fleetData tuple: [name, capacity, motorization, features[], priceFallback, imageSrc, sitePriceKey]

const processIcons = [Clock, FileText, ShieldCheck, Compass, Smile, Anchor]

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
    fuelTitle: 'Fuel Policy',
    fuelText:
      'Fuel is not included in the rental. Every boat is delivered with a full tank and a reserve fuel can. On return, the tank is refilled and you only pay for the fuel actually used during your trip.',
    processTitle: 'How it works',
    processSub: 'From the pier to the return, our team follows every step.',
    bookTitle: 'Book your boat',
    bookSub: 'We will contact you within 24 hours to confirm availability',
    day: '/ day',
    capacityLabel: 'seats',
    fleetData: [
      ['Joker Boat 580', 8, 'Mercury 40/60 PRO (2026)', ['Length 5.80 m', 'Maximum speed: 30 mph (48 km/h)', 'Average fuel use: 12 liters/hour', 'Navigation style: Stable and comfortable', 'Best for: Families & groups'], 'from €XX', '/images/jokerboat.png', 'gommone'],
      ['Mingolla Brava 18', 6, 'Mercury 40/60 PRO (2026)', ['Length 5.20 m', 'Maximum speed: 35 mph (56 km/h)', 'Average fuel use: 10 liters/hour', 'Navigation style: Agile and sporty', 'Best for: Couples & small groups'], 'from €XX', '/images/brava16.png', 'barca'],
      ['Joker Boat 500', 5, 'Mercury 30 PRO (2026)', ['Length 5.00 m', 'Maximum speed: 28 mph (45 km/h)', 'Average fuel use: 8 liters/hour', 'Navigation style: Nimble and easy to drive', 'Best for: Couples'], 'from €XX', '/images/jokerboat.png', 'gommone_piccolo'],
    ],
    process: [
      ['09:00', 'Pier meeting', 'Arrive at the pier, meet the team and start check-in.'],
      ['Check-in', 'Contracts and documents', 'Sign the rental agreement and collect documents and insurance.'],
      ['Briefing', 'Safety information', 'Our team explains the basic safety rules before departure.'],
      ['Route', 'Sea-condition advice', 'We recommend a light tour based on the day’s sea conditions.'],
      ['Sea time', 'Enjoy the day', 'Head out, swim, relax and enjoy the coast.'],
      ['18:30', 'Return', 'Bring the boat back to the pier by 18:30.'],
    ],
    includedList: ['Shade canopy', 'Sun cushions', 'Bluetooth speakers', 'Pre-departure briefing', 'Insurance included'],
    extras: [
      ['Snorkeling kit', 'Mask, fins and snorkel set.', '€10'],
      ['Action cam', 'Camera rental for your day at sea.', '€50'],
      ['Sunset kit with cooler box', 'Sunset kit with cooler box, minimum €50.', '€15 per person'],
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
    fuelTitle: 'Fuel Policy',
    fuelText:
      'Il carburante non è incluso nel noleggio. Tutte le barche vengono consegnate con il pieno e con una tanica di riserva. Al rientro verrà rifatto il pieno e ti verrà chiesto di pagare solo la benzina effettivamente consumata durante il trip.',
    processTitle: 'Come funziona',
    processSub: 'Dal molo al rientro, il nostro team ti accompagna in ogni passaggio.',
    bookTitle: 'Prenota il tuo gommone',
    bookSub: 'Ti contatteremo entro 24 ore per confermare la disponibilità',
    day: '/ giornata',
    capacityLabel: 'posti',
    fleetData: [
      ['Joker Boat 580', 8, 'Mercury 40/60 PRO (2026)', ['Lunghezza 5,80 m', 'Velocità massima: 30 miglia orarie (48 km/h)', "Consumo medio: 12 litri l'ora", 'Stile di navigazione: stabile e confortevole', 'Ideale per: famiglie e gruppi'], 'da €XX', '/images/jokerboat.png', 'gommone'],
      ['Mingolla Brava 18', 6, 'Mercury 40/60 PRO (2026)', ['Lunghezza 5,20 m', 'Velocità massima: 35 miglia orarie (56 km/h)', "Consumo medio: 10 litri l'ora", 'Stile di navigazione: agile e sportivo', 'Ideale per: coppie e piccoli gruppi'], 'da €XX', '/images/brava16.png', 'barca'],
      ['Joker Boat 500', 5, 'Mercury 30 PRO (2026)', ['Lunghezza 5,00 m', 'Velocità massima: 28 miglia orarie (45 km/h)', "Consumo medio: 8 litri l'ora", 'Stile di navigazione: agile e facile da guidare', 'Ideale per: coppie'], 'da €XX', '/images/jokerboat.png', 'gommone_piccolo'],
    ],
    process: [
      ['09:00', 'Arrivo al molo', 'Ti presenti al molo, incontri il team e iniziamo il check-in.'],
      ['Check-in', 'Contratti e documenti', 'Firmi i contratti e ritiri documenti e assicurazioni.'],
      ['Briefing', 'Sicurezza a bordo', 'Il nostro team spiega le informazioni base di sicurezza prima della partenza.'],
      ['Rotta', 'Consiglio sul tour', 'Ti consigliamo un tour minimo in base alle condizioni del mare.'],
      ['Mare', 'Divertimento', 'Prendi il largo, ti godi la costa e vivi la tua giornata in libertà.'],
      ['18:30', 'Rientro', 'Rientro obbligatorio al molo entro le 18:30.'],
    ],
    includedList: ['Tendalino ombreggiante', 'Cuscini prendisole', 'Casse bluetooth', 'Briefing pre-partenza', 'Assicurazione inclusa'],
    extras: [
      ['Kit snorkeling', 'Set con maschera, pinne e boccaglio.', '10€'],
      ['Action cam', 'Noleggio action cam per la giornata.', '50€'],
      ['Sunset kit with cooler box', 'Kit tramonto con cooler box, minimo 50€.', '15€ a persona'],
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
    fuelTitle: 'Politika e karburantit',
    fuelText:
      'Karburanti nuk përfshihet në qira. Çdo varkë dorëzohet me depozitë të plotë dhe me një bidon rezervë. Në kthim depozita mbushet përsëri dhe paguan vetëm karburantin e përdorur gjatë udhëtimit.',
    processTitle: 'Si funksionon',
    processSub: 'Nga moli deri te kthimi, ekipi ynë të ndjek në çdo hap.',
    bookTitle: 'Rezervo gomonen',
    bookSub: 'Do të të kontaktojmë brenda 24 orësh për të konfirmuar disponueshmërinë',
    day: '/ ditë',
    capacityLabel: 'vende',
    fleetData: [
      ['Joker Boat 580', 8, 'Mercury 40/60 PRO (2026)', ['Gjatësia 5.80 m', 'Shpejtësia maksimale: 30 mph (48 km/h)', 'Konsumi mesatar: 12 litra/orë', 'Stili i lundrimit: i qëndrueshëm dhe komod', 'Më e mira për: familje dhe grupe'], 'nga €XX', '/images/jokerboat.png', 'gommone'],
      ['Mingolla Brava 18', 6, 'Mercury 40/60 PRO (2026)', ['Gjatësia 5.20 m', 'Shpejtësia maksimale: 35 mph (56 km/h)', 'Konsumi mesatar: 10 litra/orë', 'Stili i lundrimit: e shkathët dhe sportive', 'Më e mira për: çifte dhe grupe të vogla'], 'nga €XX', '/images/brava16.png', 'barca'],
      ['Joker Boat 500', 5, 'Mercury 30 PRO (2026)', ['Gjatësia 5.00 m', 'Shpejtësia maksimale: 28 mph (45 km/h)', 'Konsumi mesatar: 8 litra/orë', 'Stili i lundrimit: e shkathët dhe e lehtë', 'Më e mira për: çifte'], 'nga €XX', '/images/jokerboat.png', 'gommone_piccolo'],
    ],
    process: [
      ['09:00', 'Takim në mol', 'Mbërrin në mol, takon ekipin dhe nis check-in.'],
      ['Check-in', 'Kontrata dhe dokumente', 'Firmos kontratat dhe merr dokumentet dhe sigurimet.'],
      ['Briefing', 'Siguria në bord', 'Ekipi shpjegon rregullat bazë të sigurisë para nisjes.'],
      ['Itinerari', 'Këshilla për turin', 'Ne sugjerojmë një tur sipas kushteve të detit.'],
      ['Deti', 'Argëtim', 'Dil në det dhe shijo ditën në liri.'],
      ['18:30', 'Kthimi', 'Gomonia duhet të kthehet në mol brenda 18:30.'],
    ],
    includedList: ['Tendë dielli', 'Jastëkë për diell', 'Altoparlantë bluetooth', 'Briefing para nisjes', 'Sigurim i përfshirë'],
    extras: [
      ['Kit snorkeling', 'Set me maskë, pendë dhe snorkel.', '10€'],
      ['Action cam', 'Qira action cam për ditën.', '50€'],
      ['Sunset kit with cooler box', 'Kit perëndimi me cooler box, minimumi 50€.', '15€ për person'],
    ],
  },
  ar: {
    hero: ['انطلق بعيدا عن الشاطئ.', 'لا تحتاج إلى رخصة.'],
    subtitle: 'اصعد على متن القارب واكتشف خلجانا مخفية وقيعانا بحرية صافية وخلجانا بانورامية. لا تحتاج إلى خبرة.',
    cta: 'احجز الآن',
    freedom: 'حرية كاملة في البحر',
    p1: 'اصعد على متن القارب واكتشف الساحل كما يعرفه السكان المحليون فقط. بقاربك يمكنك الوصول إلى كالا ديلي أغولي وبايا ديلي سكولي نيري والقيعان الصافية في بونتا بيانكا، وهي أماكن سرية يعرفها المرشدون المحليون جيدا.',
    p2: 'لا رخصة، لا مشكلة: يقدم لك فريقنا شرحا كاملا للملاحة وخريطة لأفضل أماكن الرسو في المنطقة.',
    fleet: 'أسطولنا',
    fleetSub: 'اختر القارب المناسب لخططك',
    included: 'ما هو مشمول',
    includedSub: 'كل ما تحتاج إليه ليوم مثالي',
    includedTitle: 'مشمول في التأجير',
    extrasTitle: 'خدمات إضافية',
    fuelTitle: 'سياسة الوقود',
    fuelText:
      'الوقود غير مشمول في الإيجار. يتم تسليم كل قارب بخزان ممتلئ وعبوة احتياطية. عند العودة تتم إعادة تعبئة الخزان وتدفع فقط ثمن الوقود المستخدم فعليا خلال الرحلة.',
    processTitle: 'كيف تعمل التجربة',
    processSub: 'من الرصيف حتى العودة، فريقنا يرافقك في كل خطوة.',
    bookTitle: 'احجز قاربك',
    bookSub: 'سنتواصل معك خلال 24 ساعة لتأكيد التوفر',
    day: '/ يوم',
    capacityLabel: 'مقاعد',
    fleetData: [
      ['Joker Boat 580', 8, 'Mercury 40/60 PRO (2026)', ['الطول 5.80 م', 'السرعة القصوى: 30 ميل/س (48 كم/س)', 'متوسط الاستهلاك: 12 لتر/ساعة', 'أسلوب الملاحة: ثابت ومريح', 'الأفضل لـ: العائلات والمجموعات'], 'من €XX', '/images/jokerboat.png', 'gommone'],
      ['Mingolla Brava 18', 6, 'Mercury 40/60 PRO (2026)', ['الطول 5.20 م', 'السرعة القصوى: 35 ميل/س (56 كم/س)', 'متوسط الاستهلاك: 10 لتر/ساعة', 'أسلوب الملاحة: رشيق ورياضي', 'الأفضل لـ: الأزواج والمجموعات الصغيرة'], 'من €XX', '/images/brava16.png', 'barca'],
      ['Joker Boat 500', 5, 'Mercury 30 PRO (2026)', ['الطول 5.00 م', 'السرعة القصوى: 28 ميل/س (45 كم/س)', 'متوسط الاستهلاك: 8 لتر/ساعة', 'أسلوب الملاحة: رشيق وسهل القيادة', 'الأفضل لـ: الأزواج'], 'من €XX', '/images/jokerboat.png', 'gommone_piccolo'],
    ],
    process: [
      ['09:00', 'الوصول إلى الرصيف', 'تصل إلى الرصيف وتلتقي بالفريق ونبدأ تسجيل الدخول.'],
      ['Check-in', 'العقود والوثائق', 'توقّع العقود وتستلم الوثائق والتأمين.'],
      ['Briefing', 'معلومات السلامة', 'يشرح الفريق قواعد السلامة الأساسية قبل الانطلاق.'],
      ['المسار', 'نصيحة الجولة', 'نقترح جولة مناسبة حسب حالة البحر.'],
      ['البحر', 'الاستمتاع', 'تنطلق وتستمتع بالساحل واليوم.'],
      ['18:30', 'العودة', 'يجب إعادة القارب إلى الرصيف قبل 18:30.'],
    ],
    includedList: ['مظلة ظل', 'وسائد شمس', 'سماعات بلوتوث', 'شرح قبل الانطلاق', 'تأمين مشمول'],
    extras: [
      ['Kit snorkeling', 'قناع وزعانف وأنبوب تنفس.', '10€'],
      ['Action cam', 'استئجار كاميرا حركة لليوم.', '50€'],
      ['Sunset kit with cooler box', 'طقم غروب مع صندوق تبريد، الحد الأدنى 50€.', '15€ للشخص'],
    ],
  },
  ru: {
    hero: ['Выходите в море.', 'Права не нужны.'],
    subtitle: 'Поднимайтесь на борт и открывайте скрытые бухты, прозрачное дно и панорамные заливы. Опыт не требуется.',
    cta: 'Забронировать',
    freedom: 'Полная свобода на море',
    p1: 'Поднимайтесь на борт и откройте побережье так, как его знают только местные. На своей лодке вы сможете добраться до Cala delle Aguglie, Baia degli Scogli Neri и прозрачных глубин Punta Bianca, секретных мест, которые лучше всего знают местные гиды.',
    p2: 'Нет прав, нет проблем: наша команда проведет полный инструктаж по навигации и даст карту лучших мест для якорной стоянки.',
    fleet: 'Наш флот',
    fleetSub: 'Выберите лодку под свои планы',
    included: 'Что включено',
    includedSub: 'Все, что нужно для идеального дня',
    includedTitle: 'Включено в аренду',
    extrasTitle: 'Дополнительные услуги',
    fuelTitle: 'Топливная политика',
    fuelText:
      'Топливо не включено в аренду. Каждая лодка передается с полным баком и резервной канистрой. По возвращении бак снова заправляется, и вы оплачиваете только фактически израсходованное за поездку топливо.',
    processTitle: 'Как это работает',
    processSub: 'От причала до возвращения команда сопровождает каждый шаг.',
    bookTitle: 'Забронируйте лодку',
    bookSub: 'Мы свяжемся с вами в течение 24 часов, чтобы подтвердить наличие',
    day: '/ день',
    capacityLabel: 'мест',
    fleetData: [
      ['Joker Boat 580', 8, 'Mercury 40/60 PRO (2026)', ['Длина 5.80 м', 'Максимальная скорость: 30 миль/ч (48 км/ч)', 'Средний расход: 12 л/ч', 'Стиль хода: устойчивый и комфортный', 'Лучше всего для: семей и групп'], 'от €XX', '/images/jokerboat.png', 'gommone'],
      ['Mingolla Brava 18', 6, 'Mercury 40/60 PRO (2026)', ['Длина 5.20 м', 'Максимальная скорость: 35 миль/ч (56 км/ч)', 'Средний расход: 10 л/ч', 'Стиль хода: маневренный и спортивный', 'Лучше всего для: пар и небольших групп'], 'от €XX', '/images/brava16.png', 'barca'],
      ['Joker Boat 500', 5, 'Mercury 30 PRO (2026)', ['Длина 5.00 м', 'Максимальная скорость: 28 миль/ч (45 км/ч)', 'Средний расход: 8 л/ч', 'Стиль хода: маневренный и простой', 'Лучше всего для: пар'], 'от €XX', '/images/jokerboat.png', 'gommone_piccolo'],
    ],
    process: [
      ['09:00', 'Встреча у причала', 'Вы приходите к причалу, встречаете команду и проходите check-in.'],
      ['Check-in', 'Договоры и документы', 'Вы подписываете договоры и получаете документы и страховку.'],
      ['Briefing', 'Безопасность', 'Команда объясняет базовые правила безопасности перед выходом.'],
      ['Маршрут', 'Совет по туру', 'Мы рекомендуем маршрут с учетом состояния моря.'],
      ['Море', 'Отдых', 'Вы выходите в море и наслаждаетесь днем.'],
      ['18:30', 'Возвращение', 'Лодку нужно вернуть к причалу до 18:30.'],
    ],
    includedList: ['Тент', 'Солнечные подушки', 'Bluetooth-колонки', 'Инструктаж перед выходом', 'Страховка включена'],
    extras: [
      ['Kit snorkeling', 'Маска, ласты и трубка.', '10€'],
      ['Action cam', 'Аренда action cam на день.', '50€'],
      ['Sunset kit with cooler box', 'Закатный набор с cooler box, минимум 50€.', '15€ с человека'],
    ],
  },
  zh: {
    hero: ['驶向近海。', '无需驾照。'],
    subtitle: '登船探索隐秘海湾、清澈海底和壮丽湾景。无需任何经验。',
    cta: '立即预订',
    freedom: '海上完全自由',
    p1: '登上船，像本地人一样发现这片海岸。你可以驾驶自己的船前往 Cala delle Aguglie、Baia degli Scogli Neri 以及 Punta Bianca 的清澈海底，这些都是本地向导最熟悉的秘密地点。',
    p2: '没有驾照也没关系：我们的团队会提供完整航行讲解，并给你一张区域内最佳停泊点地图。',
    fleet: '我们的船队',
    fleetSub: '选择适合你计划的船',
    included: '包含内容',
    includedSub: '完美一天所需的一切',
    includedTitle: '租赁包含',
    extrasTitle: '额外服务',
    fuelTitle: '燃油政策',
    fuelText:
      '租赁价格不含燃油。每艘船交付时都配有满箱燃油和一桶备用燃油。返航后会重新加满油箱，你只需支付本次行程实际消耗的燃油。',
    processTitle: '流程',
    processSub: '从码头到返航，我们的团队会协助每一步。',
    bookTitle: '预订你的船',
    bookSub: '我们将在 24 小时内联系你确认可订情况',
    day: '/ 天',
    capacityLabel: '座位',
    fleetData: [
      ['Joker Boat 580', 8, 'Mercury 40/60 PRO (2026)', ['长度 5.80 m', '最高速度：30 mph（48 km/h）', '平均油耗：12 升/小时', '航行风格：稳定舒适', '适合：家庭和团体'], '起价 €XX', '/images/jokerboat.png', 'gommone'],
      ['Mingolla Brava 18', 6, 'Mercury 40/60 PRO (2026)', ['长度 5.20 m', '最高速度：35 mph（56 km/h）', '平均油耗：10 升/小时', '航行风格：灵活运动', '适合：情侣和小团体'], '起价 €XX', '/images/brava16.png', 'barca'],
      ['Joker Boat 500', 5, 'Mercury 30 PRO (2026)', ['长度 5.00 m', '最高速度：28 mph（45 km/h）', '平均油耗：8 升/小时', '航行风格：灵活易操控', '适合：情侣'], '起价 €XX', '/images/jokerboat.png', 'gommone_piccolo'],
    ],
    process: [
      ['09:00', '码头集合', '到达码头，与团队会合并开始 check-in。'],
      ['Check-in', '合同和文件', '签署合同并领取文件和保险。'],
      ['Briefing', '安全说明', '团队会在出发前说明基本安全信息。'],
      ['路线', '行程建议', '我们会根据海况建议基础路线。'],
      ['海上', '享受一天', '出海、放松并享受海岸。'],
      ['18:30', '返航', '必须在 18:30 前把船开回码头。'],
    ],
    includedList: ['遮阳篷', '日光垫', '蓝牙音箱', '出发前讲解', '含保险'],
    extras: [
      ['Kit snorkeling', '面镜、脚蹼和呼吸管。', '10€'],
      ['Action cam', '全天运动相机租赁。', '50€'],
      ['Sunset kit with cooler box', '含 cooler box 的日落套装，最低 50€。', '15€ / 人'],
    ],
  },
}

export default function PublicRental({ lang, sitePrices }: { lang: Lang; sitePrices?: Record<string, string> }) {
  const t = copy[lang]
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const fromWord = lang === 'it' ? 'da' : lang === 'sq' ? 'nga' : lang === 'ru' ? 'от' : lang === 'zh' ? '起价' : lang === 'ar' ? 'من' : 'from'

  return (
    <div dir={dir}>
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
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black text-ocean-deep tracking-tight mb-3">{t.processTitle}</h2>
            <p className="text-[#4A6580] text-xl">{t.processSub}</p>
          </div>

          <div className="relative overflow-x-auto pb-4">
            <div className="relative min-w-[68rem] md:min-w-0">
              <svg
                aria-hidden="true"
                viewBox="0 0 1000 220"
                preserveAspectRatio="none"
                className="absolute left-0 right-0 top-16 z-0 h-40 w-full"
              >
                <path
                  d="M0 116 C120 50 220 50 340 116 S560 182 680 116 S885 50 1000 116"
                  fill="none"
                  stroke="#A8E9F8"
                  strokeWidth="42"
                  strokeLinecap="round"
                  opacity="0.65"
                />
                <path
                  d="M0 116 C120 50 220 50 340 116 S560 182 680 116 S885 50 1000 116"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="12"
                  strokeLinecap="round"
                  opacity="0.72"
                />
              </svg>

              <div className="relative z-10 grid grid-cols-6 gap-4">
                {t.process.map(([time, title, description], index) => {
                  const Icon = processIcons[index]
                  return (
                    <div
                      key={`${time}-${title}`}
                      className={`relative flex min-h-[22rem] flex-col items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`w-full ${index % 2 === 0 ? 'pb-24' : 'pt-24'}`}>
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-ocean-deep text-white shadow-xl shadow-ocean-deep/20 ring-4 ring-white">
                          <Icon size={26} strokeWidth={2.3} />
                        </div>
                        <div className="rounded-2xl border border-[#D0E8F7] bg-white/95 p-4 shadow-lg shadow-ocean-bright/5">
                          <span className="inline-flex rounded-full bg-sand px-3 py-1 text-xs font-black text-ocean-deep">{time}</span>
                          <h3 className="mt-3 text-base font-black leading-tight text-ocean-deep">{title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-[#4A6580]">{description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-ocean-deep tracking-tight mb-3">{t.fleet}</h2>
            <p className="text-[#4A6580] text-xl">{t.fleetSub}</p>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
            {t.fleetData.map(([name, capacity, motorization, features, , imageSrc, siteKey]) => {
              const sitePrice = sitePrices?.[siteKey as string]
              const displayPrice = sitePrice ? `${fromWord} ${sitePrice}` : undefined
              return (
              <FleetCard
                key={name as string}
                imageSrc={imageSrc as string}
                name={name as string}
                capacity={capacity as number}
                motorization={motorization as string}
                features={features as string[]}
                price={displayPrice}
                capacityLabel={t.capacityLabel}
                priceSuffix={t.day}
              />
            )})}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-ocean-light">
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

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-5 rounded-3xl border-2 border-[#D0E8F7] bg-white p-8 shadow-sm md:flex-row md:items-start">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-sand text-ocean-deep">
              <Fuel size={28} strokeWidth={2.3} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-ocean-deep">{t.fuelTitle}</h2>
              <p className="mt-3 text-lg leading-relaxed text-[#4A6580]">{t.fuelText}</p>
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
    </div>
  )
}
