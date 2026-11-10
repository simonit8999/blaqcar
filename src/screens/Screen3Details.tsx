import { motion } from 'framer-motion'
import { ArrowRight, Car, Hash, User, MessageSquare, Phone } from 'lucide-react'
import { IMaskInput } from 'react-imask'
import type { BookingData } from '../types'

interface Props {
  data: BookingData
  onChange: (patch: Partial<BookingData>) => void
  onNext: () => void
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function Screen3Details({ data, onChange, onNext }: Props) {
  const valid = data.carModel.trim().length > 0 && data.name.trim().length > 0 && data.phone.replace(/\D/g, '').length >= 11

  return (
    <div className="flex flex-col h-full bg-ink overflow-hidden">
      <div className="pt-2 pb-5 px-5 shrink-0">
        <h1 className="font-display font-black text-[28px] leading-tight tracking-tight uppercase">Детали вашего авто</h1>
        <p className="mt-1.5 text-zincsoft text-sm">Так мы подготовимся к вашему визиту</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <motion.form variants={container} initial="hidden" animate="show" className="flex flex-col gap-3.5" onSubmit={(e) => { e.preventDefault(); if (valid) onNext() }}>
          <Field variants={item} icon={<User className="w-4 h-4" />} label="Ваше имя *">
            <input value={data.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="Александр" className="w-full bg-transparent outline-none text-[15px] placeholder:text-white/25" />
          </Field>
          <Field variants={item} icon={<Phone className="w-4 h-4" />} label="Номер телефона *">
            <IMaskInput mask="+7 (000) 000-00-00" value={data.phone} unmask={false} onAccept={(value: string) => onChange({ phone: value })} placeholder="+7 (999) 000-00-00" className="w-full bg-transparent outline-none text-[15px] placeholder:text-white/25" />
          </Field>
          <Field variants={item} icon={<Car className="w-4 h-4" />} label="Марка и модель *">
            <input value={data.carModel} onChange={(e) => onChange({ carModel: e.target.value })} placeholder="BMW M5" className="w-full bg-transparent outline-none text-[15px] placeholder:text-white/25" />
          </Field>
          <Field variants={item} icon={<Hash className="w-4 h-4" />} label="Номер авто (опционально)">
            <input value={data.plate} onChange={(e) => onChange({ plate: e.target.value })} placeholder="А123ВС 77" className="w-full bg-transparent outline-none text-[15px] uppercase placeholder:text-white/25" />
          </Field>
          <motion.div variants={item} className="rounded-2xl bg-surface/60 border border-white/10 p-4 glow-focus transition-shadow">
            <div className="flex items-center gap-2 mb-2 text-[11px] uppercase tracking-[0.16em] text-zincsoft font-medium"><MessageSquare className="w-3.5 h-3.5" />Комментарий (опционально)</div>
            <textarea value={data.comment} onChange={(e) => onChange({ comment: e.target.value })} placeholder="Царапина на двери, нужна химчистка" rows={3} className="w-full bg-transparent outline-none text-[15px] resize-none placeholder:text-white/25" />
          </motion.div>
        </motion.form>
      </div>

      <div className="shrink-0 p-5 pb-safe bg-ink border-t border-white/5">
        <motion.button type="button" whileTap={{ scale: 0.96 }} disabled={!valid} onClick={onNext} className={`w-full h-14 rounded-full font-semibold text-[15px] flex items-center justify-center gap-2 transition-all ${valid ? 'bg-accent text-ink shadow-glow' : 'bg-white/[0.06] text-white/30 cursor-not-allowed'}`}>
          Выбрать время <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  )
}

function Field({ children, icon, label, variants }: { children: React.ReactNode; icon: React.ReactNode; label: string; variants: any }) {
  return (
    <motion.label variants={variants} className="rounded-2xl bg-surface/60 border border-white/10 p-4 glow-focus transition-shadow block">
      <div className="flex items-center gap-2 mb-2 text-[11px] uppercase tracking-[0.16em] text-zincsoft font-medium">{icon}{label}</div>
      {children}
    </motion.label>
  )
}
