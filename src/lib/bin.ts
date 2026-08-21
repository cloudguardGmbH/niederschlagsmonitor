import type { SeriesData } from './geosphere'

// Anzeige-Bündelung: unter ~2,6 px je 10-min-Slot werden Intervalle zu Summen
// gebündelt. Die Daten bleiben 10-min; die Statuszeile weist die Anzeige aus.

const FACTORS = [1, 3, 6, 18, 36] as const
export type BinFactor = (typeof FACTORS)[number]

export const BIN_LABEL: Record<BinFactor, string> = {
  1: '10-MIN-WERTE',
  3: '30-MIN-SUMMEN',
  6: '1-H-SUMMEN',
  18: '3-H-SUMMEN',
  36: '6-H-SUMMEN',
}

export function chooseBinFactor(points: number, plotWidth: number): BinFactor {
  for (const f of FACTORS) {
    if (plotWidth / (points / f) >= 2.6) return f
  }
  return 36
}

export interface BinnedView {
  factor: BinFactor
  /** Intervallstart je Bin (Epoch ms) */
  startMs: number[]
  /** Intervallende je Bin (Epoch ms) */
  endMs: number[]
  /** Niederschlagssumme im Bin; null = komplett Messlücke */
  rr: (number | null)[]
  /** stärkstes 10-min-Intervall im Bin (Klassifizierung + Readout) */
  rrMax10: (number | null)[]
  /** Temperatur-Mittel im Bin */
  tl: (number | null)[]
  /** Kumulative Summe am Bin-Ende */
  cum: (number | null)[]
  /** Bin enthält mindestens eine Messlücke */
  hasGap: boolean[]
}

const TEN_MIN = 10 * 60 * 1000

export function binSeries(s: SeriesData, factor: BinFactor): BinnedView {
  const n = Math.ceil(s.timestamps.length / factor)
  const view: BinnedView = {
    factor,
    startMs: new Array(n),
    endMs: new Array(n),
    rr: new Array(n),
    rrMax10: new Array(n),
    tl: new Array(n),
    cum: new Array(n),
    hasGap: new Array(n),
  }
  let cum = 0
  let seenAny = false
  for (let b = 0; b < n; b++) {
    const i0 = b * factor
    const i1 = Math.min(i0 + factor, s.timestamps.length)
    // API-Zeitstempel = Intervallende des 10-min-Fensters
    view.startMs[b] = s.timestamps[i0] - TEN_MIN
    view.endMs[b] = s.timestamps[i1 - 1]
    let sum = 0
    let any = false
    let gap = false
    let max10: number | null = null
    let tlSum = 0
    let tlN = 0
    for (let i = i0; i < i1; i++) {
      const v = s.rr[i]
      if (v == null) {
        gap = true
      } else {
        sum += v
        any = true
        if (max10 == null || v > max10) max10 = v
      }
      const t = s.tl[i]
      if (t != null) {
        tlSum += t
        tlN++
      }
    }
    if (any) {
      cum += sum
      seenAny = true
    }
    view.rr[b] = any ? sum : null
    view.rrMax10[b] = max10
    view.tl[b] = tlN ? tlSum / tlN : null
    view.cum[b] = seenAny ? cum : null
    view.hasGap[b] = gap
  }
  return view
}

/** Intensitätsklassen je 10-min-Summe (abgeleitet aus den Stundenklassen des Warnwesens / 6). */
export const INTENSITY = [
  { lim: 0.5, key: 'leicht', range: '< 0,5' },
  { lim: 1.7, key: 'mäßig', range: '0,5 – 1,7' },
  { lim: 8.3, key: 'stark', range: '1,7 – 8,3' },
  { lim: Infinity, key: 'sehr stark', range: '≥ 8,3' },
] as const

export function intensityClass(max10: number): 0 | 1 | 2 | 3 {
  for (let k = 0; k < INTENSITY.length; k++) {
    if (max10 < INTENSITY[k].lim) return k as 0 | 1 | 2 | 3
  }
  return 3
}
