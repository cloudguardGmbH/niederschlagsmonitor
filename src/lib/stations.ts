import type { StationMeta } from './geosphere'

/**
 * Dropdown-Liste: aktive Stationen, je Name+Bundesland die COMBINED-Variante
 * bevorzugt (zusammengeführte, längste Messreihe), alphabetisch sortiert.
 */
export function selectableStations(all: StationMeta[]): StationMeta[] {
  const byKey = new Map<string, StationMeta>()
  for (const s of all) {
    if (!s.is_active) continue
    const key = `${s.name}|${s.state}`
    const existing = byKey.get(key)
    if (!existing || (existing.type !== 'COMBINED' && s.type === 'COMBINED')) {
      byKey.set(key, s)
    }
  }
  return [...byKey.values()].sort((a, b) => a.name.localeCompare(b.name, 'de-AT'))
}

export const DEFAULT_STATION_ID = 105 // Wien Hohe Warte (COMBINED)

/** Bundesland-Kürzel für kompakte Anzeige im Dropdown */
export const STATE_ABBR: Record<string, string> = {
  Wien: 'W',
  Niederösterreich: 'NÖ',
  Oberösterreich: 'OÖ',
  Salzburg: 'S',
  Tirol: 'T',
  Vorarlberg: 'V',
  Kärnten: 'K',
  Steiermark: 'ST',
  Burgenland: 'B',
}
