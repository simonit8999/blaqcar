import { useEffect, useState } from 'react'
import type { AppConfig } from '../types'

import heroImg from '../assets/hero.jpg'
import srv1 from '../assets/srv1.jpg'
import srv2 from '../assets/srv2.jpg'
import srv3 from '../assets/srv3.jpg'
import srv4 from '../assets/srv4.jpg'
import srv5 from '../assets/srv5.jpg'
import srv6 from '../assets/srv6.jpg'
import srv7 from '../assets/srv7.jpg'
import srv8 from '../assets/srv8.jpg'
import srv9 from '../assets/srv9.jpg'
import srv10 from '../assets/srv10.jpg'

const serviceImages = [srv1, srv2, srv3, srv4, srv5, srv6, srv7, srv8, srv9, srv10]

export function useConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}config.json`, { cache: 'no-store' })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((data: AppConfig) => {
        data.hero_image = heroImg
        data.services = data.services.map((s, i) => ({
          ...s,
          image: serviceImages[i] || heroImg
        }))
        setConfig(data)
        
        // Устанавливаем приглушенный белый цвет (E5E5E5)
        document.documentElement.style.setProperty('--accent', `229 229 229`)
      })
      .catch((e) => setError(e.message))
  }, [])

  return { config, error }
}
