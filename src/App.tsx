import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConfig } from './hooks/useConfig'
import { usePwaTheme } from './hooks/usePwa'
import Header from './components/Header'
import ProgressBar from './components/ProgressBar'

import Screen1Hero from './screens/Screen1Hero'
import Screen2Service from './screens/Screen2Service'
import Screen3Details from './screens/Screen3Details'
import Screen4Time from './screens/Screen4Time'
import Screen5Confirm from './screens/Screen5Confirm'

import type { BookingData, Service } from './types'

type Step = 0 | 1 | 2 | 3 | 4

const initialBooking: BookingData = {
  service: null,
  carModel: '',
  plate: '',
  name: '',
  phone: '',
  comment: '',
  date: null,
  time: null,
}

// ВАРИАНТЫ АНИМАЦИИ ДЛЯ СЛАЙДОВ
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-30%' : '100%',
    opacity: 0,
  }),
}

export default function App() {
  const { config, error } = useConfig()
  const [step, setStep] = useState<Step>(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [booking, setBooking] = useState<BookingData>(initialBooking)

  usePwaTheme('#050505')

  if (error) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-6 text-center">
        <div>
          <div className="font-display font-bold text-xl mb-2">Не удалось загрузить конфигурацию</div>
          <div className="text-zincsoft text-sm">{error}</div>
        </div>
      </div>
    )
  }
  if (!config) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-accent animate-spin" />
      </div>
    )
  }

  const go = (next: Step) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  const update = (patch: Partial<BookingData>) => setBooking((b) => ({ ...b, ...patch }))
  const selectService = (s: Service) => update({ service: s })

  const headerTitles = ['', 'Услуга', 'Данные', 'Время', 'Подтверждение']

  return (
    <div className="relative min-h-[100dvh] bg-ink text-white overflow-hidden">
      
      {/* Скрытый прелоадер */}
      <div className="hidden" aria-hidden="true">
        <img src={config.hero_image} alt="" fetchPriority="high" decoding="sync" />
        {config.services.map((s) => (
          <img key={s.id} src={s.image} alt="" decoding="async" />
        ))}
      </div>

      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        
        {/* ЭКРАН 0 (Hero) */}
        {step === 0 && (
          <motion.div
            key="hero"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.4 }}
            className="absolute inset-0 w-full bg-ink"
            style={{ minHeight: '100dvh' }}
          >
            <Screen1Hero config={config} onStart={() => go(1)} />
          </motion.div>
        )}

        {/* ЭКРАНЫ 1-4 (Wizard) */}
        {step !== 0 && (
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.4 }}
            className="absolute inset-0 w-full flex flex-col bg-ink"
            style={{ minHeight: '100dvh' }}
          >
            <Header title={headerTitles[step]} onBack={() => go((step - 1) as Step)} />
            <ProgressBar step={step} total={4} />

            <div className="relative flex-1 overflow-hidden">
              {step === 1 && (
                <Screen2Service
                  config={config}
                  selected={booking.service}
                  onSelect={selectService}
                  onNext={() => go(2)}
                />
              )}
              {step === 2 && (
                <Screen3Details
                  data={booking}
                  onChange={update}
                  onNext={() => go(3)}
                />
              )}
              {step === 3 && (
                <Screen4Time
                  config={config}
                  date={booking.date}
                  time={booking.time}
                  onDate={(d) => update({ date: d })}
                  onTime={(t) => update({ time: t })}
                  onNext={() => go(4)}
                />
              )}
              {step === 4 && <Screen5Confirm config={config} data={booking} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
