'use client'

import { useState } from 'react'

export type FormTipo = 'noleggio' | 'esperienza' | 'generico'

interface BookingFormProps {
  tipo?: FormTipo
  lang?: 'en' | 'it' | 'sq' | 'ar' | 'ru' | 'zh'
}

interface FormData {
  nome: string
  email: string
  telefono: string
  data: string
  fascia: string
  note: string
  discountCode: string
  // Campi noleggio / generico
  adulti: number
  bambini: number
  snorkeling: number
  actionCam: number
  setTramonto: number
  // Campi esperienza
  partecipanti: number
  noleggioAttrezzatura: boolean
  setAttrezzatura: number
}

interface FormErrors {
  nome?: string
  email?: string
  telefono?: string
  data?: string
  fascia?: string
}

const initialData: FormData = {
  nome: '',
  email: '',
  telefono: '',
  data: '',
  fascia: '',
  note: '',
  discountCode: '',
  adulti: 1,
  bambini: 0,
  snorkeling: 0,
  actionCam: 0,
  setTramonto: 0,
  partecipanti: 1,
  noleggioAttrezzatura: false,
  setAttrezzatura: 0,
}

const labelClass = 'block text-sm font-semibold text-ocean-deep mb-2'
const baseInputClass =
  'w-full px-4 py-3.5 rounded-xl border-2 font-[inherit] text-base text-[#0A1628] bg-white transition-all duration-200 outline-none focus:border-ocean-bright focus:ring-4 focus:ring-ocean-bright/10 placeholder-[#8AACCC]'
const validInputClass = `${baseInputClass} border-[#D0E8F7]`
const errorInputClass = `${baseInputClass} border-red-400 bg-red-50/50`

const copy = {
  en: {
    required: 'Required field',
    dateRequired: 'Select a date',
    slotRequired: 'Select a time slot',
    sentTitle: 'Request sent!',
    sentText: 'Thank you. We received your request and will contact you shortly.',
    fullName: 'Full name *',
    phone: 'Phone *',
    date: 'Preferred date *',
    slot: 'Time slot *',
    fullDay: 'Full day',
    halfDay: 'Half day',
    adults: 'Adults',
    children: 'Children',
    snorkeling: 'Snorkeling kit',
    sunset: 'Sunset set',
    sunsetHint: 'placeholder description',
    participants: 'Participants',
    rentGear: 'Rent fishing equipment?',
    gearSets: 'How many equipment sets?',
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
    sentTitle: 'Richiesta inviata!',
    sentText: 'Grazie! Abbiamo ricevuto la tua richiesta e ti contatteremo a breve.',
    fullName: 'Nome e cognome *',
    phone: 'Telefono *',
    date: 'Data desiderata *',
    slot: 'Fascia oraria *',
    fullDay: 'Giornata intera',
    halfDay: 'Mezza giornata',
    adults: 'Adulti',
    children: 'Bambini',
    snorkeling: 'Kit snorkeling',
    sunset: 'Set tramonto',
    sunsetHint: 'descrizione placeholder',
    participants: 'Numero partecipanti',
    rentGear: 'Noleggio attrezzatura da pesca?',
    gearSets: 'Quanti set attrezzatura?',
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
    sentTitle: 'Kërkesa u dërgua!',
    sentText: 'Faleminderit. E morëm kërkesën dhe do të të kontaktojmë së shpejti.',
    fullName: 'Emër dhe mbiemër *',
    phone: 'Telefon *',
    date: 'Data e dëshiruar *',
    slot: 'Orari *',
    fullDay: 'Ditë e plotë',
    halfDay: 'Gjysmë dite',
    adults: 'Të rritur',
    children: 'Fëmijë',
    snorkeling: 'Kit snorkeling',
    sunset: 'Set perëndimi',
    sunsetHint: 'përshkrim placeholder',
    participants: 'Pjesëmarrës',
    rentGear: 'Qira pajisjesh peshkimi?',
    gearSets: 'Sa sete pajisjesh?',
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
    sentTitle: 'تم إرسال الطلب!',
    sentText: 'شكرا لك. استلمنا طلبك وسنتواصل معك قريبا.',
    fullName: 'الاسم الكامل *',
    phone: 'الهاتف *',
    date: 'التاريخ المفضل *',
    slot: 'الفترة الزمنية *',
    fullDay: 'يوم كامل',
    halfDay: 'نصف يوم',
    adults: 'بالغون',
    children: 'أطفال',
    snorkeling: 'عدة سنوركلينغ',
    sunset: 'طقم الغروب',
    sunsetHint: 'وصف مؤقت',
    participants: 'المشاركون',
    rentGear: 'استئجار معدات الصيد؟',
    gearSets: 'كم عدد مجموعات المعدات؟',
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
    sentTitle: 'Заявка отправлена!',
    sentText: 'Спасибо. Мы получили вашу заявку и скоро свяжемся с вами.',
    fullName: 'Имя и фамилия *',
    phone: 'Телефон *',
    date: 'Желаемая дата *',
    slot: 'Временной слот *',
    fullDay: 'Полный день',
    halfDay: 'Полдня',
    adults: 'Взрослые',
    children: 'Дети',
    snorkeling: 'Комплект для сноркелинга',
    sunset: 'Закатный сет',
    sunsetHint: 'временное описание',
    participants: 'Участники',
    rentGear: 'Взять рыболовное снаряжение напрокат?',
    gearSets: 'Сколько комплектов снаряжения?',
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
    sentTitle: '请求已发送！',
    sentText: '谢谢。我们已收到你的请求，并会尽快联系你。',
    fullName: '姓名 *',
    phone: '电话 *',
    date: '首选日期 *',
    slot: '时间段 *',
    fullDay: '全天',
    halfDay: '半天',
    adults: '成人',
    children: '儿童',
    snorkeling: '浮潜套装',
    sunset: '日落套装',
    sunsetHint: '占位描述',
    participants: '参与人数',
    rentGear: '租用钓鱼装备？',
    gearSets: '需要几套装备？',
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
    if (!data.telefono.trim()) e.telefono = t.required
    if (!data.data) e.data = t.dateRequired
    if (!data.fascia) e.fascia = t.slotRequired
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
      body: JSON.stringify({ tipo, ...data }),
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
    if (name in errors) setErrors((prev) => ({ ...prev, [name]: undefined }))
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
          <input type="tel" name="telefono" value={data.telefono} onChange={handleChange}
            placeholder="+39 333 123 4567" className={ic('telefono')} />
          {errors.telefono && <p className="text-red-500 text-xs mt-1.5">{errors.telefono}</p>}
        </div>
      </div>

      {/* Email + Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Email *</label>
          <input type="email" name="email" value={data.email} onChange={handleChange}
            placeholder="mario@esempio.com" className={ic('email')} />
          {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
        </div>
        <div>
          <label className={labelClass}>{t.date}</label>
          <input type="date" name="data" value={data.data} onChange={handleChange}
            min={today} className={ic('data')} />
          {errors.data && <p className="text-red-500 text-xs mt-1.5">{errors.data}</p>}
        </div>
      </div>

      {/* Fascia oraria */}
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

      {/* Campi aggiuntivi: noleggio + generico */}
      {(tipo === 'noleggio' || tipo === 'generico') && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'adulti', label: t.adults, min: 1 },
              { name: 'bambini', label: t.children, min: 0 },
              { name: 'snorkeling', label: t.snorkeling, min: 0 },
              { name: 'actionCam', label: 'Action cam', min: 0 },
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
        </div>
      )}

      {/* Campi aggiuntivi: esperienza */}
      {tipo === 'esperienza' && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>{t.participants}</label>
            <input
              type="number" name="partecipanti" value={data.partecipanti}
              onChange={handleChange} min={1}
              className={`${validInputClass} max-w-[10rem]`}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox" name="noleggioAttrezzatura"
              checked={data.noleggioAttrezzatura} onChange={handleChange}
              className="w-5 h-5 rounded accent-ocean-bright"
            />
            <span className="font-semibold text-ocean-deep group-hover:text-ocean-bright transition-colors">
              {t.rentGear}
            </span>
          </label>

          {data.noleggioAttrezzatura && (
            <div>
              <label className={labelClass}>{t.gearSets}</label>
              <input
                type="number" name="setAttrezzatura" value={data.setAttrezzatura}
                onChange={handleChange} min={1}
                className={`${validInputClass} max-w-[10rem]`}
              />
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
