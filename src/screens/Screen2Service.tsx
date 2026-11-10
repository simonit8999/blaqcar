import { motion } from 'framer-motion'
import { Clock, Check, ArrowRight } from 'lucide-react'
import type { AppConfig, Service } from '../types'

interface Props {
  config: AppConfig
  selected: Service | null
  onSelect: (s: Service) => void
  onNext: () => void
}

const fmt = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽'

export default function Screen2Service({ config, selected, onSelect, onNext }: Props) {
  return (
    <div className="flex flex-col h-full bg-ink overflow-hidden">
      <div className="pt-2 pb-4 px-5 shrink-0">
        <h1 className="font-display font-black text-[28px] leading-tight tracking-tight uppercase">Выберите услугу</h1>
        <p className="mt-1.5 text-zincsoft text-sm">Всё, что нужно вашему авто — в одном месте</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="flex flex-col gap-3.5">
          {config.services.map((s) => {
            const active = selected?.id === s.id
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s)}
                className="relative overflow-hidden rounded-2xl border text-left"
                style={{
                  minHeight: 120,
                  borderColor: active ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                  boxShadow: active ? '0 0 20px rgba(229,229,229,0.3)' : 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
              >
                <div className="absolute inset-0 -z-10">
                  <img 
                    src={s.image} 
                    alt="" 
                    className="w-full h-full object-cover" 
                    style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }} 
                    draggable={false}
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/40" />
                </div>

                <div className="relative p-4 flex flex-col justify-between min-h-[120px]">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display font-bold text-lg uppercase tracking-tight leading-tight">{s.name}</h3>
                    <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        active ? 'bg-accent text-ink shadow-glow' : 'bg-white/10 border border-white/15 text-transparent'
                      }`}>
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    <div className="flex items-center gap-1.5 text-[12px] text-zincsoft">
                      <Clock className="w-3.5 h-3.5" />
                      {s.duration}
                    </div>
                    <div className="font-display font-extrabold text-xl tracking-tight text-white">{fmt(s.price)}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="shrink-0 p-5 pb-safe bg-ink border-t border-white/5">
        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={!selected}
          onClick={onNext}
          className={`w-full h-14 rounded-full font-semibold text-[15px] flex items-center justify-center gap-2 transition-all ${
            selected ? 'bg-accent text-ink shadow-glow' : 'bg-white/[0.06] text-white/30 cursor-not-allowed'
          }`}
        >
          Далее
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  )
}
