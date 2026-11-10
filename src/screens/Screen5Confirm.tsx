import { motion } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'
import type { AppConfig, BookingData } from '../types'

// ... (функции fmt и fmtDateLong остаются без изменений)

export default function Screen5Confirm({ config, data }: Props) {
  const total = data.service?.price ?? 0
  const handleSend = () => { /* ... без изменений ... */ }

  return (
    // Главный контейнер фиксированной высоты
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-ink">
      
      {/* Шапка */}
      <div className="pt-2 pb-5 px-5 shrink-0">
        <h1 className="font-display font-black text-[28px] leading-tight tracking-tight uppercase">
          Всё верно?
        </h1>
        <p className="mt-1.5 text-zincsoft text-sm">Проверьте детали перед отправкой</p>
      </div>

      {/* Скроллируемая карточка */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <motion.div ... >
           {/* ... Код карточки ... */}
        </motion.div>
      </div>

      {/* Фиксированная кнопка внизу */}
      <div className="shrink-0 p-5 pb-safe bg-ink border-t border-white/5">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleSend}
          className="w-full h-14 rounded-full bg-accent text-ink font-semibold text-[15px] flex items-center justify-center gap-2 shadow-glow active:shadow-glowlg transition-shadow"
        >
          <Send className="w-4 h-4" strokeWidth={2.4} />
          Отправить заявку в Telegram
        </motion.button>
        <p className="mt-3 text-center text-[11px] text-zincsoft leading-relaxed">
          Нажимая кнопку, вы перейдёте в Telegram
        </p>
      </div>
    </div>
  )
}
