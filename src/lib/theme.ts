import { useEffect, useState } from 'react'

export type ThemeMode = 'auto' | 'nacht' | 'tag'

const KEY = 'monitor.theme'

function apply(mode: ThemeMode) {
  const root = document.documentElement
  if (mode === 'auto') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', mode === 'nacht' ? 'dark' : 'light')
}

export function useTheme(): [ThemeMode, (m: ThemeMode) => void] {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // ?theme=dark|light übersteuert (Screenshots, geteilte Links)
    const q = new URLSearchParams(location.search).get('theme')
    if (q === 'dark') return 'nacht'
    if (q === 'light') return 'tag'
    const raw = localStorage.getItem(KEY)
    return raw === 'nacht' || raw === 'tag' || raw === 'auto' ? raw : 'auto'
  })
  useEffect(() => apply(mode), [mode])
  const set = (m: ThemeMode) => {
    setMode(m)
    try {
      localStorage.setItem(KEY, m)
    } catch {
      // ohne Persistenz weiter
    }
  }
  return [mode, set]
}

/** true, wenn aktuell dunkel gerendert wird (für SVG-Farben, die nicht über CSS laufen). */
export function useIsDark(mode: ThemeMode): boolean {
  const [sysDark, setSysDark] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches)
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const on = (e: MediaQueryListEvent) => setSysDark(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return mode === 'nacht' || (mode === 'auto' && sysDark)
}
