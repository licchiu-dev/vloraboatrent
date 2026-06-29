'use client'

import { useEffect, useRef, useState } from 'react'
import RentalAvailabilityCalendar from './RentalAvailabilityCalendar'

export type FormTipo = 'noleggio' | 'esperienza' | 'generico'

interface BookingFormProps {
  tipo?: FormTipo
  lang?: 'en' | 'it' | 'sq' | 'ar' | 'ru' | 'zh'
}

interface FormData {
  nome: string
  email: string
  phonePrefix: string
  phoneNumber: string
  data: string
  fascia: string
  assetId: string
  note: string
  discountCode: string
  adulti: number
  bambini: number
  snorkeling: number
  actionCam: number
  setTramonto: number
  esperienzaPesca: string
  partecipanti: number
  cannaMulinello: number
  esca: number
  artificiale: number
  mascheraBoccaglio: number
  pinne: number
  muta3mm: number
  calzari: number
  cinturaPesi: number
  fucileSub: number
  torciaSub: number
}

interface FormErrors {
  nome?: string
  email?: string
  telefono?: string
  data?: string
  fascia?: string
  assetId?: string
  esperienzaPesca?: string
}

const initialData: FormData = {
  nome: '',
  email: '',
  phonePrefix: '+39',
  phoneNumber: '',
  data: '',
  fascia: '',
  assetId: '',
  note: '',
  discountCode: '',
  adulti: 1,
  bambini: 0,
  snorkeling: 0,
  actionCam: 0,
  setTramonto: 0,
  esperienzaPesca: '',
  partecipanti: 1,
  cannaMulinello: 0,
  esca: 0,
  artificiale: 0,
  mascheraBoccaglio: 0,
  pinne: 0,
  muta3mm: 0,
  calzari: 0,
  cinturaPesi: 0,
  fucileSub: 0,
  torciaSub: 0,
}

const DIAL_CODES = [
  { code: '+355', country: 'Albania' },
  { code: '+39', country: 'Italy' },
  { code: '+383', country: 'Kosovo' },
  { code: '+382', country: 'Montenegro' },
  { code: '+389', country: 'N. Macedonia' },
  { code: '+381', country: 'Serbia' },
  { code: '+387', country: 'Bosnia' },
  { code: '+385', country: 'Croatia' },
  { code: '+386', country: 'Slovenia' },
  { code: '+30', country: 'Greece' },
  { code: '+40', country: 'Romania' },
  { code: '+359', country: 'Bulgaria' },
  { code: '+43', country: 'Austria' },
  { code: '+41', country: 'Switzerland' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+44', country: 'UK' },
  { code: '+34', country: 'Spain' },
  { code: '+31', country: 'Netherlands' },
  { code: '+32', country: 'Belgium' },
  { code: '+351', country: 'Portugal' },
  { code: '+352', country: 'Luxembourg' },
  { code: '+45', country: 'Denmark' },
  { code: '+46', country: 'Sweden' },
  { code: '+47', country: 'Norway' },
  { code: '+358', country: 'Finland' },
  { code: '+48', country: 'Poland' },
  { code: '+420', country: 'Czech Rep.' },
  { code: '+421', country: 'Slovakia' },
  { code: '+36', country: 'Hungary' },
  { code: '+7', country: 'Russia' },
  { code: '+380', country: 'Ukraine' },
  { code: '+90', country: 'Turkey' },
  { code: '+1', country: 'USA / Canada' },
  { code: '+52', country: 'Mexico' },
  { code: '+55', country: 'Brazil' },
  { code: '+54', country: 'Argentina' },
  { code: '+971', country: 'UAE' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+964', country: 'Iraq' },
  { code: '+963', country: 'Syria' },
  { code: '+961', country: 'Lebanon' },
  { code: '+972', country: 'Israel' },
  { code: '+20', country: 'Egypt' },
  { code: '+212', country: 'Morocco' },
  { code: '+213', country: 'Algeria' },
  { code: '+216', country: 'Tunisia' },
  { code: '+218', country: 'Libya' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
  { code: '+82', country: 'S. Korea' },
  { code: '+91', country: 'India' },
  { code: '+61', country: 'Australia' },
  { code: '+64', country: 'New Zealand' },
]

const labelClass = 'block text-sm font-semibold text-ocean-deep mb-2'
const baseInputClass =
  'w-full px-4 py-3.5 rounded-xl border-2 font-[inherit] text-base text-[#0A1628] bg-white transition-all duration-200 outline-none focus:border-ocean-bright focus:ring-4 focus:ring-ocean-bright/10 placeholder-[#8AACCC]'
const validInputClass = `${baseInputClass} border-[#D0E8F7]`
const errorInputClass = `${baseInputClass} border-red-400 bg-red-50/50`

function PhonePrefixCombobox({
  value,
  onChange,
  error,
}: {
  value: string
  onChange: (v: string) => void
  error?: boolean
}) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery(value) // revert to last valid
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [value])

  const filtered = DIAL_CODES.filter(
    (d) =>
      d.code.startsWith(query.startsWith('+') ? query : `+${query}`) ||
      d.country.toLowerCase().includes(query.toLowerCase()),
  ).slice(0, 8)

  function select(code: string) {
    setQuery(code)
    onChange(code)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-28 shrink-0">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder="+39"
        className={`w-full px-3 py-3.5 rounded-xl border-2 font-[inherit] text-base text-center text-[#0A1628] bg-white outline-none focus:border-ocean-bright focus:ring-4 focus:ring-ocean-bright/10 placeholder-[#8AACCC] transition-all duration-200 ${
          error ? 'border-red-400 bg-red-50/50' : 'border-[#D0E8F7]'
        }`}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 left-0 mt-1 w-64 max-h-52 overflow-y-auto rounded-xl border border-[#D0E8F7] bg-white shadow-xl">
          {filtered.map((d) => (
            <li
              key={d.code}
              onMouseDown={() => select(d.code)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer hover:bg-ocean-light"
            >
              <span className="w-12 shrink-0 font-bold text-ocean-deep">{d.code}</span>
              <span className="text-[#4A6580]">{d.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const copy = {
  en: {
    required: 'Required field',
    dateRequired: 'Select a date',
    slotRequired: 'Select a time slot',
    experienceRequired: 'Select an experience',
    sentTitle: 'Request sent!',
    sentText: 'Thank you. We received your request and will contact you shortly.',
    fullName: 'Full name *',
    phone: 'Phone *',
    phoneNumber: 'Number',
    date: 'Preferred date *',
    slot: 'Time slot *',
    fullDay: 'Full day',
    halfDay: 'Half day',
    adults: 'Adults',
    children: 'Children',
    snorkeling: 'Snorkeling kit',
    sunset: 'Cooler box',
    sunsetHint: 'for drinks and ice',
    participants: 'Participants',
    fishingStyle: 'Experience *',
    rodFishing: 'Rod fishing',
    spearfishing: 'Spearfishing',
    rentableExtras: 'Rentable extras',
    extras: {
      cannaMulinello: 'Rod + reel',
      esca: 'Bait',
      artificiale: 'Lure',
      actionCam: 'Action cam',
      mascheraBoccaglio: 'Mask + snorkel',
      pinne: 'Fins',
      muta3mm: '3 mm wetsuit',
      calzari: 'Booties',
      cinturaPesi: 'Weight belt + weights',
      fucileSub: 'Speargun',
      torciaSub: 'Dive torch',
    },
    notes: 'Additional notes',
    notesPlaceholder: 'Special requests, allergies, accessibility needs...',
    promo: 'Do you have a promotional code?',
    check: 'Check',
    codeApplied: 'Code applied',
    codeMissing: 'Code not found',
    submit: 'Send booking request',
    requiredFooter: '* Required fields. We reply within 24 hours.',
  },
  it: {
    required: 'Campo obbligatorio',
    dateRequired: 'Seleziona una data',
    slotRequired: 'Seleziona una fascia oraria',
    experienceRequired: "Seleziona un'esperienza",
    sentTitle: 'Richiesta inviata!',
    sentText: 'Grazie! Abbiamo ricevuto la tua richiesta e ti contatteremo a breve.',
    fullName: 'Nome e cognome *',
    phone: 'Telefono *',
    phoneNumber: 'Numero',
    date: 'Data desiderata *',
    slot: 'Fascia oraria *',
    fullDay: 'Giornata intera',
    halfDay: 'Mezza giornata',
    adults: 'Adulti',
    children: 'Bambini',
    snorkeling: 'Kit snorkeling',
    sunset: 'Cooler box',
    sunsetHint: 'per bevande e ghiaccio',
    participants: 'Numero partecipanti',
    fishingStyle: 'Esperienza *',
    rodFishing: 'Pesca con le canne',
    spearfishing: 'Pesca in apnea',
    rentableExtras: 'Extra noleggiabili',
    extras: {
      cannaMulinello: 'Canna + mulinello',
      esca: 'Esca',
      artificiale: 'Artificiale',
      actionCam: 'Action cam',
      mascheraBoccaglio: 'Maschera + boccaglio',
      pinne: 'Pinne',
      muta3mm: 'Muta 3 mm',
      calzari: 'Calzari',
      cinturaPesi: 'Cintura + pesi',
      fucileSub: 'Fucile sub',
      torciaSub: 'Torcia sub',
    },
    notes: 'Note aggiuntive',
    notesPlaceholder: 'Eventuali richieste speciali, allergie, esigenze particolari...',
    promo: 'Hai un codice promozionale?',
    check: 'Verifica',
    codeApplied: 'Codice applicato',
    codeMissing: 'Codice non trovato',
    submit: 'Invia richiesta di prenotazione',
    requiredFooter: '* Campi obbligatori. Risponderemo entro 24 ore.',
  },
  sq: {
    required: 'Fushë e detyrueshme',
    dateRequired: 'Zgjidh një datë',
    slotRequired: 'Zgjidh orarin',
    experienceRequired: 'Zgjidh eksperiencën',
    sentTitle: 'Kërkesa u dërgua!',
    sentText: 'Faleminderit. E morëm kërkesën dhe do të të kontaktojmë së shpejti.',
    fullName: 'Emër dhe mbiemër *',
    phone: 'Telefon *',
    phoneNumber: 'Numri',
    date: 'Data e dëshiruar *',
    slot: 'Orari *',
    fullDay: 'Ditë e plotë',
    halfDay: 'Gjysmë dite',
    adults: 'Të rritur',
    children: 'Fëmijë',
    snorkeling: 'Kit snorkeling',
    sunset: 'Cooler box',
    sunsetHint: 'per pije dhe akull',
    participants: 'Pjesëmarrës',
    fishingStyle: 'Eksperienca *',
    rodFishing: 'Peshkim me kallama',
    spearfishing: 'Peshkim në apnea',
    rentableExtras: 'Ekstra me qira',
    extras: {
      cannaMulinello: 'Kallam + mulinel',
      esca: 'Karrem',
      artificiale: 'Artificial',
      actionCam: 'Action cam',
      mascheraBoccaglio: 'Maskë + tub frymëmarrjeje',
      pinne: 'Penda',
      muta3mm: 'Kostum 3 mm',
      calzari: 'Çorape uji',
      cinturaPesi: 'Rrip + pesha',
      fucileSub: 'Pushkë nënujore',
      torciaSub: 'Dritë nënujore',
    },
    notes: 'Shënime shtesë',
    notesPlaceholder: 'Kërkesa të veçanta, alergji, nevoja specifike...',
    promo: 'Ke një kod promocional?',
    check: 'Kontrollo',
    codeApplied: 'Kodi u aplikua',
    codeMissing: 'Kodi nuk u gjet',
    submit: 'Dërgo kërkesën',
    requiredFooter: '* Fushat e detyrueshme. Përgjigjemi brenda 24 orësh.',
  },
  ar: {
    required: 'حقل مطلوب',
    dateRequired: 'اختر تاريخا',
    slotRequired: 'اختر فترة زمنية',
    experienceRequired: 'اختر التجربة',
    sentTitle: 'تم إرسال الطلب!',
    sentText: 'شكرا لك. استلمنا طلبك وسنتواصل معك قريبا.',
    fullName: 'الاسم الكامل *',
    phone: 'الهاتف *',
    phoneNumber: 'الرقم',
    date: 'التاريخ المفضل *',
    slot: 'الفترة الزمنية *',
    fullDay: 'يوم كامل',
    halfDay: 'نصف يوم',
    adults: 'بالغون',
    children: 'أطفال',
    snorkeling: 'عدة سنوركلينغ',
    sunset: 'Cooler box',
    sunsetHint: 'للمشروبات والثلج',
    participants: 'المشاركون',
    fishingStyle: 'التجربة *',
    rodFishing: 'الصيد بالقصبة',
    spearfishing: 'الصيد بالرمح',
    rentableExtras: 'إضافات قابلة للإيجار',
    extras: {
      cannaMulinello: 'قصبة + بكرة',
      esca: 'طعم',
      artificiale: 'طعم صناعي',
      actionCam: 'كاميرا أكشن',
      mascheraBoccaglio: 'قناع + أنبوب تنفس',
      pinne: 'زعانف',
      muta3mm: 'بدلة 3 مم',
      calzari: 'حذاء مائي',
      cinturaPesi: 'حزام + أوزان',
      fucileSub: 'بندقية صيد',
      torciaSub: 'مصباح غوص',
    },
    notes: 'ملاحظات إضافية',
    notesPlaceholder: 'طلبات خاصة، حساسية، احتياجات وصول...',
    promo: 'هل لديك رمز ترويجي؟',
    check: 'تحقق',
    codeApplied: 'تم تطبيق الرمز',
    codeMissing: 'الرمز غير موجود',
    submit: 'إرسال طلب الحجز',
    requiredFooter: '* حقول مطلوبة. نرد خلال 24 ساعة.',
  },
  ru: {
    required: 'Обязательное поле',
    dateRequired: 'Выберите дату',
    slotRequired: 'Выберите временной слот',
    experienceRequired: 'Выберите формат',
    sentTitle: 'Заявка отправлена!',
    sentText: 'Спасибо. Мы получили вашу заявку и скоро свяжемся с вами.',
    fullName: 'Имя и фамилия *',
    phone: 'Телефон *',
    phoneNumber: 'Номер',
    date: 'Желаемая дата *',
    slot: 'Временной слот *',
    fullDay: 'Полный день',
    halfDay: 'Полдня',
    adults: 'Взрослые',
    children: 'Дети',
    snorkeling: 'Комплект для сноркелинга',
    sunset: 'Cooler box',
    sunsetHint: 'для напитков и льда',
    participants: 'Участники',
    fishingStyle: 'Формат *',
    rodFishing: 'Рыбалка с удочками',
    spearfishing: 'Подводная охота',
    rentableExtras: 'Дополнения в аренду',
    extras: {
      cannaMulinello: 'Удочка + катушка',
      esca: 'Наживка',
      artificiale: 'Приманка',
      actionCam: 'Экшн-камера',
      mascheraBoccaglio: 'Маска + трубка',
      pinne: 'Ласты',
      muta3mm: 'Гидрокостюм 3 мм',
      calzari: 'Боты',
      cinturaPesi: 'Пояс + грузы',
      fucileSub: 'Подводное ружье',
      torciaSub: 'Подводный фонарь',
    },
    notes: 'Дополнительные заметки',
    notesPlaceholder: 'Особые запросы, аллергии, потребности доступности...',
    promo: 'У вас есть промокод?',
    check: 'Проверить',
    codeApplied: 'Код применен',
    codeMissing: 'Код не найден',
    submit: 'Отправить заявку на бронирование',
    requiredFooter: '* Обязательные поля. Мы отвечаем в течение 24 часов.',
  },
  zh: {
    required: '必填项',
    dateRequired: '请选择日期',
    slotRequired: '请选择时间段',
    experienceRequired: '请选择体验',
    sentTitle: '请求已发送！',
    sentText: '谢谢。我们已收到你的请求，并会尽快联系你。',
    fullName: '姓名 *',
    phone: '电话 *',
    phoneNumber: '号码',
    date: '首选日期 *',
    slot: '时间段 *',
    fullDay: '全天',
    halfDay: '半天',
    adults: '成人',
    children: '儿童',
    snorkeling: '浮潜套装',
    sunset: 'Cooler box',
    sunsetHint: '用于饮品和冰块',
    participants: '参与人数',
    fishingStyle: '体验 *',
    rodFishing: '竿钓',
    spearfishing: '自由潜渔猎',
    rentableExtras: '可租赁附加项',
    extras: {
      cannaMulinello: '鱼竿 + 渔轮',
      esca: '鱼饵',
      artificiale: '拟饵',
      actionCam: '运动相机',
      mascheraBoccaglio: '面镜 + 呼吸管',
      pinne: '脚蹼',
      muta3mm: '3 mm 潜水服',
      calzari: '潜水袜',
      cinturaPesi: '配重带 + 配重',
      fucileSub: '鱼枪',
      torciaSub: '潜水灯',
    },
    notes: '附加备注',
    notesPlaceholder: '特殊要求、过敏、无障碍需求...',
    promo: '你有优惠码吗？',
    check: '验证',
    codeApplied: '优惠码已应用',
    codeMissing: '未找到优惠码',
    submit: '发送预订请求',
    requiredFooter: '* 必填项。我们会在 24 小时内回复。',
  },
}

export default function BookingForm({ tipo = 'generico', lang = 'en' }: BookingFormProps) {
  const t = copy[lang]
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const [data, setData] = useState<FormData>(initialData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [discountFeedback, setDiscountFeedback] = useState('')

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!data.nome.trim()) e.nome = t.required
    if (!data.email.trim()) e.email = t.required
    if (!data.phoneNumber.trim()) e.telefono = t.required
    if (!data.data) e.data = t.dateRequired
    if (tipo !== 'esperienza' && !data.fascia) e.fascia = t.slotRequired
    if (tipo === 'noleggio' && !data.assetId) e.assetId = t.slotRequired
    if (tipo === 'esperienza' && !data.esperienzaPesca) e.esperienzaPesca = t.experienceRequired
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    await fetch('/api/public-bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, ...data, telefono: `${data.phonePrefix}${data.phoneNumber}` }),
    })
    setSubmitted(true)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const newValue =
      type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
        ? Number(value)
        : value
    setData((prev) => ({ ...prev, [name]: newValue }))
    if (name === 'phoneNumber') {
      setErrors((prev) => ({ ...prev, telefono: undefined }))
    } else if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const today = new Date().toISOString().split('T')[0]

  const ic = (field: keyof FormErrors) => (errors[field] ? errorInputClass : validInputClass)

  if (submitted) {
    return (
      <div className="text-center py-16 px-6">
        <div className="w-20 h-20 bg-gradient-to-br from-ocean-bright to-ocean-mid rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-xl shadow-ocean-bright/30">
          ✓
        </div>
        <h3 className="text-3xl font-black text-ocean-deep tracking-tight mb-3">{t.sentTitle}</h3>
        <p className="text-[#4A6580] text-lg">
          {t.sentText}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5" dir={dir}>
      {/* Nome + Telefono */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>{t.fullName}</label>
          <input type="text" name="nome" value={data.nome} onChange={handleChange}
            placeholder="Mario Rossi" className={ic('nome')} />
          {errors.nome && <p className="text-red-500 text-xs mt-1.5">{errors.nome}</p>}
        </div>
        <div>
          <label className={labelClass}>{t.phone}</label>
          <div className="flex gap-2">
            <PhonePrefixCombobox
              value={data.phonePrefix}
              onChange={(v) => setData((prev) => ({ ...prev, phonePrefix: v }))}
              error={!!errors.telefono}
            />
            <input
              type="tel"
              name="phoneNumber"
              value={data.phoneNumber}
              onChange={handleChange}
              placeholder="333 123 4567"
              className={`${errors.telefono ? errorInputClass : validInputClass} flex-1`}
            />
          </div>
          {errors.telefono && <p className="text-red-500 text-xs mt-1.5">{errors.telefono}</p>}
        </div>
      </div>

      {/* Email + Data */}
      <div className={`grid grid-cols-1 gap-5 ${tipo === 'noleggio' ? '' : 'sm:grid-cols-2'}`}>
        <div>
          <label className={labelClass}>Email *</label>
          <input type="email" name="email" value={data.email} onChange={handleChange}
            placeholder="mario@esempio.com" className={ic('email')} />
          {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
        </div>
        {tipo !== 'noleggio' && (
          <div>
            <label className={labelClass}>{t.date}</label>
            <input type="date" name="data" value={data.data} onChange={handleChange}
              min={today} className={ic('data')} />
            {errors.data && <p className="text-red-500 text-xs mt-1.5">{errors.data}</p>}
          </div>
        )}
      </div>

      {tipo === 'noleggio' && (
        <div>
          <RentalAvailabilityCalendar
            lang={lang}
            value={data.assetId && data.data && data.fascia ? { assetId: data.assetId, date: data.data, fascia: 'Giornata intera' } : null}
            onSelect={(selection) => {
              setData((prev) => ({
                ...prev,
                assetId: selection.assetId,
                data: selection.date,
                fascia: 'Giornata intera',
              }))
              setErrors((prev) => ({ ...prev, data: undefined, fascia: undefined, assetId: undefined }))
            }}
            hasError={!!(errors.data || errors.fascia || errors.assetId)}
          />
          {(errors.data || errors.fascia || errors.assetId) && (
            <p className="text-red-500 text-xs mt-1.5">{errors.data ?? errors.fascia ?? errors.assetId}</p>
          )}
        </div>
      )}

      {tipo !== 'esperienza' && tipo !== 'noleggio' && (
        <div>
          <label className={labelClass}>{t.slot}</label>
          <div className="flex gap-6 flex-wrap">
            {['Giornata intera', 'Mezza giornata'].map((opt) => (
              <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio" name="fascia" value={opt}
                  checked={data.fascia === opt} onChange={handleChange}
                  className="w-4 h-4 accent-ocean-bright"
                />
                <span className="font-medium text-[#0A1628] group-hover:text-ocean-deep transition-colors">
                  {opt === 'Giornata intera' ? t.fullDay : t.halfDay}
                </span>
              </label>
            ))}
          </div>
          {errors.fascia && <p className="text-red-500 text-xs mt-1.5">{errors.fascia}</p>}
        </div>
      )}

      {/* Campi aggiuntivi: noleggio + generico */}
      {(tipo === 'noleggio' || tipo === 'generico') && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'adulti', label: t.adults, min: 1 },
              { name: 'bambini', label: t.children, min: 0 },
            ].map((f) => (
              <div key={f.name}>
                <label className={labelClass}>{f.label}</label>
                <input
                  type="number" name={f.name}
                  value={data[f.name as keyof FormData] as number}
                  onChange={handleChange} min={f.min}
                  className={validInputClass}
                />
              </div>
            ))}
          </div>

          {tipo === 'generico' && (
            <div>
            <label className={labelClass}>
              {t.sunset}
              <span className="ml-2 text-[#8AACCC] font-normal text-xs">
                — {t.sunsetHint}
              </span>
            </label>
            <input
              type="number" name="setTramonto" value={data.setTramonto}
              onChange={handleChange} min={0}
              className={`${validInputClass} max-w-[10rem]`}
            />
            </div>
          )}
        </div>
      )}

      {/* Campi aggiuntivi: esperienza */}
      {tipo === 'esperienza' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>{t.fishingStyle}</label>
              <select
                name="esperienzaPesca"
                value={data.esperienzaPesca}
                onChange={handleChange}
                className={errors.esperienzaPesca ? errorInputClass : validInputClass}
              >
                <option value="">-</option>
                <option value="pesca-canne">{t.rodFishing}</option>
                <option value="pesca-apnea">{t.spearfishing}</option>
              </select>
              {errors.esperienzaPesca && <p className="text-red-500 text-xs mt-1.5">{errors.esperienzaPesca}</p>}
            </div>
            <div>
              <label className={labelClass}>{t.participants}</label>
              <input
                type="number" name="partecipanti" value={data.partecipanti}
                onChange={handleChange} min={1} max={4}
                className={validInputClass}
              />
            </div>
          </div>

          {data.esperienzaPesca && (
            <div>
              <label className={labelClass}>{t.rentableExtras}</label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {(data.esperienzaPesca === 'pesca-canne'
                  ? [
                      { name: 'cannaMulinello', label: t.extras.cannaMulinello },
                      { name: 'esca', label: t.extras.esca },
                      { name: 'artificiale', label: t.extras.artificiale },
                      { name: 'actionCam', label: t.extras.actionCam },
                    ]
                  : [
                      { name: 'mascheraBoccaglio', label: t.extras.mascheraBoccaglio },
                      { name: 'pinne', label: t.extras.pinne },
                      { name: 'muta3mm', label: t.extras.muta3mm },
                      { name: 'calzari', label: t.extras.calzari },
                      { name: 'cinturaPesi', label: t.extras.cinturaPesi },
                      { name: 'fucileSub', label: t.extras.fucileSub },
                      { name: 'torciaSub', label: t.extras.torciaSub },
                      { name: 'actionCam', label: t.extras.actionCam },
                    ]
                ).map((field) => (
                  <div key={field.name}>
                    <label className={labelClass}>{field.label}</label>
                    <input
                      type="number"
                      name={field.name}
                      value={data[field.name as keyof FormData] as number}
                      onChange={handleChange}
                      min={0}
                      className={validInputClass}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Note */}
      <div>
        <label className={labelClass}>{t.notes}</label>
        <textarea
          name="note" value={data.note} onChange={handleChange}
          rows={4} placeholder={t.notesPlaceholder}
          className={`${validInputClass} resize-y min-h-[7rem]`}
        />
      </div>

      <div>
        <label className={labelClass}>{t.promo}</label>
        <div className="flex gap-3">
          <input
            name="discountCode"
            value={data.discountCode}
            onChange={handleChange}
            placeholder="SEARENT-MARIO26"
            className={validInputClass}
          />
          <button
            type="button"
            onClick={async () => {
              const response = await fetch('/api/discount-codes/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: data.discountCode }),
              })
              const result = await response.json()
              setDiscountFeedback(result.valid ? `${t.codeApplied}: ${result.partnerName}` : t.codeMissing)
            }}
            className="rounded-xl bg-ocean-deep px-4 font-bold text-white"
          >
            {t.check}
          </button>
        </div>
        {discountFeedback && <p className="mt-2 text-sm font-bold text-ocean-mid">{discountFeedback}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-sand hover:bg-sand-dark text-ocean-deep font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sand/35 mt-2"
      >
        {t.submit}
      </button>

      <p className="text-center text-[#8AACCC] text-sm">
        {t.requiredFooter}
      </p>
    </form>
  )
}
