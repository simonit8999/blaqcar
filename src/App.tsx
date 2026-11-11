import { useState } from 'react'
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

const HEADER_TITLES: Record<number, string> = { 0: '', 1: 'Услуга', 2: 'Данные', 3: 'Время', 4: 'Подтверждение' }

export default function App() {
  const { config, error } = useConfig()
  const [step, setStep] = useState<Step>(0)
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

  const go = (next: Step) => setStep(next)
  const update = (patch: Partial<BookingData>) => setBooking((b) => ({ ...b, ...patch }))
  const selectService = (s: Service) => update({ service: s })

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-ink text-white">
      
      {step === 0 && (
        <Screen1Hero config={config} onStart={() => go(1)} />
      )}

      {step !== 0 && (
        <div className="absolute inset-0 w-full h-full flex flex-col bg-ink">
          <Header title={HEADER_TITLES[step]} onBack={() => go((step - 1) as Step)} />
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
        </div>
      )}
    </div>
  )
}
