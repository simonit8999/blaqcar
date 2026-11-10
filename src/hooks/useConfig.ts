import { useEffect, useState } from 'react'
import type { AppConfig } from '../types'

export function useConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Определяем клиента по адресу сайта
    const host = window.location.hostname;
    let clientName = host.split('.')[0]; 
    
    // Для локальной разработки (если запускаешь на компьютере)
    if (clientName === 'localhost' || clientName === '127') {
      clientName = 'blaqcar';
    }

    fetch(`/clients/${clientName}.json`, { cache: 'no-store' })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((data: AppConfig) => {
        setConfig(data)
        const rgb = hexToRgb(data.accent_color)
        if (rgb) document.documentElement.style.setProperty('--accent', `${rgb.r} ${rgb.g} ${rgb.b}`)
      })
      .catch((e) => setError(e.message))
  }, [])

  return { config, error }
}

function hexToRgb(hex: string) {
  const m = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  if (!m) return null
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}