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

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
  }),
  center: {
    x: 0,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
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
    <div className="relative w-full h-[100dvh] overflow-hidden bg-ink text-white">
      
      {/* 1. HERO ЭКРАН (Audi) - Всегда на заднем плане (z-0) */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ pointerEvents: step === 0 ? 'auto' : 'none' }}
      >
        <Screen1Hero config={config} onStart={() => go(1)} />
      </div>

      {/* 2. ЭКРАНЫ УСЛУГ (поверх Hero, z-10) */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          {step !== 0 && (
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.4 }}
              /* bg-ink делает фон экрана непрозрачным, чтобы Audi не просвечивала */
              className="absolute inset-0 w-full h-full flex flex-col bg-ink pointer-events-auto overflow-hidden"
            >
              <Header title={headerTitles[step]} onBack={() => go((step - 1) as Step)} />
              <ProgressBar step={step} total={4} />

              <div className="relative flex-1 overflow-hidden">
                {step === 1 && (
                  <Screen2Service config={config} selected={booking.service} onSelect={selectService} onNext={() => go(2)} />
                )}
                {step === 2 && (
                  <Screen3Details data={booking} onChange={update} onNext={() => go(3)} />
                )}
                {step === 3 && (
                  <Screen4Time config={config} date={booking.date} time={booking.time} onDate={(d) => update({ date: d })} onTime={(t) => update({ time: t })} onNext={() => go(4)} />
                )}
                {step === 4 && <Screen5Confirm config={config} data={booking} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
