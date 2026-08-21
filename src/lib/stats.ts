import type { SeriesData } from './geosphere'

export interface RangeStats {
  /** Niederschlagssumme im Zeitraum (mm) */
  rrSum: number
  /** Maximale 10-min-Summe (mm) und ihr Zeitstempel */
  rrMax: number
  rrMaxAt: number | null
  /** Anzahl 10-min-Intervalle mit Niederschlag > 0 */
  wetIntervals: number
  /** Temperatur: letzter Messwert, Min, Max */
  tlLast: number | null
  tlMin: number | null
  tlMax: number | null
  /** Zeitstempel des jüngsten realen Messwerts (Datenstand) */
  lastMeasuredAt: number | null
  /** Anzahl Intervalle mit Messlücke (rr null) innerhalb des gemessenen Bereichs */
  gapIntervals: number
  points: number
}

/** Führende Anzeige-Reihe: hinten abschneiden, wo noch gar nichts gemessen wurde. */
export function trimTrailingUnmeasured(series: SeriesData): SeriesData {
  let last = series.timestamps.length - 1
  while (last >= 0 && series.rr[last] == null && series.tl[last] == null) last--
  const end = last + 1
  return {
    ...series,
    timestamps: series.timestamps.slice(0, end),
    rr: series.rr.slice(0, end),
    tl: series.tl.slice(0, end),
  }
}

export function computeStats(series: SeriesData): RangeStats {
  let rrSum = 0
  let rrMax = 0
  let rrMaxAt: number | null = null
  let wetIntervals = 0
  let gapIntervals = 0
  let tlMin: number | null = null
  let tlMax: number | null = null
  let tlLast: number | null = null
  let lastMeasuredAt: number | null = null

  for (let i = 0; i < series.timestamps.length; i++) {
    const rr = series.rr[i]
    const tl = series.tl[i]
    if (rr != null) {
      rrSum += rr
      if (rr > 0) wetIntervals++
      if (rr > rrMax) {
        rrMax = rr
        rrMaxAt = series.timestamps[i]
      }
    } else {
      gapIntervals++
    }
    if (tl != null) {
      tlLast = tl
      if (tlMin == null || tl < tlMin) tlMin = tl
      if (tlMax == null || tl > tlMax) tlMax = tl
    }
    if (rr != null || tl != null) lastMeasuredAt = series.timestamps[i]
  }

  return {
    rrSum, rrMax, rrMaxAt, wetIntervals,
    tlLast, tlMin, tlMax,
    lastMeasuredAt, gapIntervals,
    points: series.timestamps.length,
  }
}

/**
 * Kumulative Niederschlagslinie: hält den Stand durch Messlücken,
 * null nur solange noch gar kein Messwert kam.
 */
export function cumulative(rr: (number | null)[]): (number | null)[] {
  const out: (number | null)[] = new Array(rr.length)
  let sum = 0
  let seen = false
  for (let i = 0; i < rr.length; i++) {
    const v = rr[i]
    if (v != null) {
      sum += v
      seen = true
    }
    out[i] = seen ? sum : null
  }
  return out
}
