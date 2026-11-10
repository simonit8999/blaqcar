import { useEffect, memo } from 'react'
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

// Мемоизированная карточка для оптимизации рендеринга
const ServiceCard = memo(function ServiceCard({
  service, active, onSelect,
}: { service: Service; active: boolean; onSelect: (s: Service) => void }) {
  return (
    <button
      type="button"
      data-active={active || undefined}
      onClick={() => onSelect(service)}
      className="service-card group relative w-full overflow-hidden rounded-[20px] border border-white/[0.08] text-left bg-ink/40 transition-[border-color,box-shadow] duration-300 data-[active]:border-accent/70 data-[active]:shadow-[0_0_24px_rgba(229,229,229,0.15)]"
    >
      <div className="absolute inset-0">
        <img
          src={service.image}
          alt=""
          className="h-full w-full object-cover opacity-55 transition-transform duration-700 ease-out will-change-transform group-data-[active]:scale-[1.04]"
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
          draggable={false}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-[144px] flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-bold text-[17px] uppercase tracking-[-0.01em] leading-tight">
            {service.name}
          </h3>
          <span
            className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
              active
                ? 'bg-accent text-ink shadow-[0_0_0_4px_rgba(229,229,229,0.12)]'
                : 'ring-1 ring-white/20 text-transparent'
            }`}
          >
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div className="flex items-center gap-1.5 text-[12px] text-white/50">
            <Clock className="w-3.5 h-3.5" />
            {service.duration}
          </div>
          <div className="font-display font-black text-[22px] tracking-[-0.02em] text-white">
            {fmt(service.price)}
          </div>
        </div>
      </div>
    </button>
  )
})

export default function Screen2Service({ config, selected, onSelect, onNext }: Props) {
  useEffect(() => {
    const imgs = config.services.map((s) => {
      const img = new Image()
      img.decoding = 'async'
      img.src = s.image
      return img
    })
    window.__serviceImages = imgs
  }, [config.services])

  // Берем картинку для фона (например, третью услугу с BMW)
  const bgImage = config.services[2]?.image || config.hero_image

  return (
    <div className="flex flex-col h-full overflow-hidden relative bg-ink">
      
      {/* ФОН ДЛЯ ЭТОГО ЭКРАНА */}
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/90 to-ink" />
      </div>

      {/* Контент поверх фона */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="pt-2 pb-4 px-5 shrink-0">
          <h1 className="font-display font-black text-[28px] leading-tight tracking-tight uppercase">Выберите услугу</h1>
          <p className="mt-1.5 text-white/45 text-sm">Всё, что нужно вашему авто — в одном месте</p>
        </div>

        {/* Контейнер с fade-маской для красивого скролла */}
        <div className="flex-1 overflow-y-auto px-5 pb-4 [mask-image:linear-gradient(to_bottom,transparent,black_16px,black_calc(100%-16px),transparent)]">
          <div className="flex flex-col gap-4 pb-2">
            {config.services.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                active={selected?.id === s.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>

        {/* Футер с кнопкой */}
        <div className="shrink-0 p-5 pb-safe bg-ink/80 backdrop-blur-md border-t border-white/5">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            disabled={!selected}
            onClick={onNext}
            className={`relative w-full h-14 rounded-full font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-300 ${
              selected
                ? 'bg-accent text-ink shadow-[0_8px_24px_-8px_rgba(229,229,229,0.5),inset_0_1px_0_rgba(255,255,255,0.5)]'
                : 'bg-white/[0.06] text-white/30 cursor-not-allowed'
            }`}
          >
            Далее <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
