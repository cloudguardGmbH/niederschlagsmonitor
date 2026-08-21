// Zeitraum-Logik. Die API spricht UTC; angezeigt wird Europe/Vienna.

export type PresetId = '24h' | '48h' | '7t' | '30t'

export interface TimeRange {
  startMs: number
  endMs: number
  preset: PresetId | 'frei'
}

export const PRESETS: { id: PresetId; label: string; hours: number }[] = [
  { id: '24h', label: '24 h', hours: 24 },
  { id: '48h', label: '48 h', hours: 48 },
  { id: '7t', label: '7 Tage', hours: 7 * 24 },
  { id: '30t', label: '30 Tage', hours: 30 * 24 },
]

const TEN_MIN = 10 * 60 * 1000

/** Auf volle 10 Minuten aufgerundetes Jetzt – das jüngste mögliche Intervallende. */
export function nowCeil10min(): number {
  return Math.ceil(Date.now() / TEN_MIN) * TEN_MIN
}

export function presetRange(id: PresetId): TimeRange {
  const end = nowCeil10min()
  const hours = PRESETS.find((p) => p.id === id)!.hours
  return { startMs: end - hours * 3600_000, endMs: end, preset: id }
}

/** Freier Bereich aus zwei Datums-Strings (YYYY-MM-DD, lokale Zeit); Ende inklusive. */
export function customRange(fromDate: string, toDate: string): TimeRange | null {
  const start = Date.parse(`${fromDate}T00:00:00`)
  const end = Date.parse(`${toDate}T00:00:00`) + 24 * 3600_000
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null
  // PRODUCT.md: freier Bereich ≤ 31 Tage (10-min-Auflösung bleibt handhabbar)
  if (end - start > 31 * 24 * 3600_000) return null
  return { startMs: start, endMs: Math.min(end, nowCeil10min()), preset: 'frei' }
}

const VIENNA = 'Europe/Vienna'

export const fmtTime = new Intl.DateTimeFormat('de-AT', {
  timeZone: VIENNA, hour: '2-digit', minute: '2-digit',
})
export const fmtDay = new Intl.DateTimeFormat('de-AT', {
  timeZone: VIENNA, weekday: 'short', day: '2-digit', month: '2-digit',
})
export const fmtDayLong = new Intl.DateTimeFormat('de-AT', {
  timeZone: VIENNA, weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric',
})
export const fmtStamp = new Intl.DateTimeFormat('de-AT', {
  timeZone: VIENNA, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
})
export const fmtDateInput = new Intl.DateTimeFormat('sv-SE', { timeZone: VIENNA, dateStyle: 'short' }) // YYYY-MM-DD

/** Wochentag (0 = So … 6 = Sa) und Tagesschlüssel in Wiener Zeit. */
const fmtWeekday = new Intl.DateTimeFormat('en-US', { timeZone: VIENNA, weekday: 'short' })
const WD: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
export function viennaWeekday(ms: number): number {
  return WD[fmtWeekday.format(ms)] ?? 1
}
export function viennaDayKey(ms: number): string {
  return fmtDateInput.format(ms)
}

const fmtWdShort = new Intl.DateTimeFormat('de-AT', { timeZone: VIENNA, weekday: 'short' })
const fmtDm = new Intl.DateTimeFormat('de-AT', { timeZone: VIENNA, day: '2-digit', month: '2-digit' })
/** „Sa 14.09.“ — Wochentag ohne Punkt + Tag.Monat. */
export function fmtDayShort(ms: number): string {
  return `${fmtWdShort.format(ms).replace('.', '')} ${fmtDm.format(ms)}`
}

const fmtStampParts = new Intl.DateTimeFormat('de-AT', {
  timeZone: VIENNA, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
})
/** „21.08.2026 12:10“ — kompakt, ohne Komma und Leerzeichen-Streuung. */
export function fmtStampCompact(ms: number): string {
  const p = Object.fromEntries(fmtStampParts.formatToParts(ms).map((x) => [x.type, x.value]))
  return `${p.day}.${p.month}.${p.year} ${p.hour}:${p.minute}`
}

const fmtTzName = new Intl.DateTimeFormat('de-AT', { timeZone: VIENNA, timeZoneName: 'short' })
/** „MESZ“ / „MEZ“ zum Zeitpunkt. */
export function tzAbbr(ms: number): string {
  return fmtTzName.formatToParts(ms).find((p) => p.type === 'timeZoneName')?.value ?? 'MEZ'
}

/** Deutsche Zahlformate */
export const fmtMm = new Intl.NumberFormat('de-AT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
export const fmtMm2 = new Intl.NumberFormat('de-AT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const fmtTemp = new Intl.NumberFormat('de-AT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
export const fmtInt = new Intl.NumberFormat('de-AT', { maximumFractionDigits: 0 })
