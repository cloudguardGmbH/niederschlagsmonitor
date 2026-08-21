// Skalen- und Tick-Geometrie für die SVG-Messblätter (reine Mathematik, kein DOM).
import { viennaDayKey, viennaWeekday } from './time'

export interface LinearScale {
  (v: number): number
  domain: [number, number]
  range: [number, number]
}

export function linearScale(domain: [number, number], range: [number, number]): LinearScale {
  const [d0, d1] = domain
  const [r0, r1] = range
  const k = d1 === d0 ? 0 : (r1 - r0) / (d1 - d0)
  const fn = ((v: number) => r0 + (v - d0) * k) as LinearScale
  fn.domain = domain
  fn.range = range
  return fn
}

/** Runde Obergrenze für eine mm/°C-Achse: 1-2-2.5-5-10er-Reihe. */
export function niceCeil(v: number): number {
  if (v <= 0) return 1
  const exp = Math.floor(Math.log10(v))
  const base = Math.pow(10, exp)
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (v <= m * base + 1e-9) return m * base
  }
  return 10 * base
}

/**
 * Achsen-Ticks: runde Zwischenwerte plus IMMER das Achsenmaximum selbst,
 * damit der höchste Balken gegen eine beschriftete Linie ablesbar ist.
 * Ein Zwischentick, der dem Maximum zu nahe käme (< 0,45 · Schritt), entfällt.
 */
export function axisTicks(max: number, count = 3): number[] {
  const step = niceCeil(max / count)
  const out: number[] = []
  for (let v = step; v < max - step * 0.45 + 1e-9; v += step) {
    out.push(Math.round(v * 100) / 100)
  }
  out.push(Math.round(max * 100) / 100)
  return out
}

const HOUR = 3600_000
const VIENNA = 'Europe/Vienna'
const partsFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: VIENNA, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
})

/** Wiener Mitternacht vor (oder auf) dem Zeitpunkt. */
export function viennaMidnightBefore(ms: number): number {
  const parts = partsFmt.formatToParts(ms)
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0)
  const wallMs = ((get('hour') % 24) * 3600 + get('minute') * 60 + get('second')) * 1000 + (ms % 1000)
  return ms - wallMs
}

export interface DayBand {
  startMs: number
  endMs: number
  key: string
  weekend: boolean
}

/** Tagesbänder (Wiener Kalendertage) über den Bereich, für Bänderung + Tageslabels. */
export function dayBands(startMs: number, endMs: number): DayBand[] {
  const bands: DayBand[] = []
  let cur = viennaMidnightBefore(startMs)
  let guard = 0
  while (cur < endMs && guard++ < 400) {
    const next = viennaMidnightBefore(cur + 26 * HOUR)
    const wd = viennaWeekday(cur + 12 * HOUR)
    bands.push({
      startMs: Math.max(cur, startMs),
      endMs: Math.min(next, endMs),
      key: viennaDayKey(cur + 12 * HOUR),
      weekend: wd === 0 || wd === 6,
    })
    cur = next
  }
  return bands
}

export interface TimeTick {
  ms: number
  /** true = Mitternacht (Tagesgrenze) */
  midnight: boolean
}

/** Zeit-Ticks an Wiener Wanduhr ausgerichtet; Schrittweite nach Bereichslänge. */
export function timeTicks(startMs: number, endMs: number): { ticks: TimeTick[]; stepHours: number } {
  const spanH = (endMs - startMs) / HOUR
  const stepHours = spanH <= 26 ? 3 : spanH <= 50 ? 6 : spanH <= 8 * 24 ? 24 : 96
  const ticks: TimeTick[] = []
  if (stepHours >= 24) {
    const stepDays = stepHours / 24
    const bands = dayBands(startMs, endMs)
    for (let i = 0; i < bands.length; i += stepDays) {
      const b = bands[i]
      if (b.startMs >= startMs) ticks.push({ ms: b.startMs, midnight: true })
    }
  } else {
    let day = viennaMidnightBefore(startMs)
    let guard = 0
    while (day < endMs && guard++ < 60) {
      for (let h = 0; h < 24; h += stepHours) {
        const t = day + h * HOUR
        if (t >= startMs && t <= endMs) ticks.push({ ms: t, midnight: h === 0 })
      }
      day = viennaMidnightBefore(day + 26 * HOUR)
    }
  }
  return { ticks, stepHours }
}
