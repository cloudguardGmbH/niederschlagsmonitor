// GeoSphere Austria Dataset API – klima-v2-10min (10-Minuten-Messwerte, 1992 → heute)
// Docs: https://data.hub.geosphere.at/dataset/klima-v2-10min

const BASE = 'https://dataset.api.hub.geosphere.at/v1/station/historical/klima-v2-10min'

export interface StationMeta {
  type: string
  id: number
  name: string
  state: string
  lat: number
  lon: number
  altitude: number
  valid_from: string
  valid_to: string
  is_active: boolean
}

export interface DatasetMetadata {
  title: string
  start_time: string
  end_time: string
  stations: StationMeta[]
}

export interface SeriesData {
  /** Epoch ms (UTC) je Messpunkt; Intervallende des 10-min-Fensters */
  timestamps: number[]
  /** Niederschlagssumme mm je 10 min (null = Messlücke) */
  rr: (number | null)[]
  /** Lufttemperatur 2 m in °C (null = Messlücke) */
  tl: (number | null)[]
  station: StationMeta | undefined
}

const META_CACHE_KEY = 'geosphere.metadata.v1'
const META_TTL_MS = 24 * 60 * 60 * 1000

interface RawMetadata {
  title: string
  start_time: string
  end_time: string
  stations: StationMeta[]
}

/** Stationsliste + Datensatz-Zeitraum, 24 h im localStorage gecacht (API-Limit ~240 req/h). */
export async function fetchMetadata(signal?: AbortSignal): Promise<DatasetMetadata> {
  try {
    const cached = localStorage.getItem(META_CACHE_KEY)
    if (cached) {
      const { at, data } = JSON.parse(cached) as { at: number; data: RawMetadata }
      if (Date.now() - at < META_TTL_MS) return data
    }
  } catch {
    // defekter Cache wird unten überschrieben
  }

  const res = await fetch(`${BASE}/metadata`, { signal })
  if (!res.ok) throw new Error(`Metadaten-Abruf fehlgeschlagen (HTTP ${res.status})`)
  const raw = (await res.json()) as RawMetadata
  const data: RawMetadata = {
    title: raw.title,
    start_time: raw.start_time,
    end_time: raw.end_time,
    stations: raw.stations,
  }
  try {
    localStorage.setItem(META_CACHE_KEY, JSON.stringify({ at: Date.now(), data }))
  } catch {
    // Speicher voll → ohne Cache weiter
  }
  return data
}

/** UTC-Zeitformat der API: YYYY-MM-DDTHH:mm */
function toApiTime(epochMs: number): string {
  return new Date(epochMs).toISOString().slice(0, 16)
}

interface RawSeriesResponse {
  timestamps: string[]
  features: {
    properties: {
      station: string
      parameters: Record<string, { name: string; unit: string; data: (number | null)[] }>
    }
  }[]
}

/**
 * Niederschlag (rr) + Lufttemperatur (tl) einer Station als eine Anfrage.
 * start/end als Epoch ms; die API erwartet und liefert UTC.
 */
export async function fetchSeries(
  station: StationMeta,
  startMs: number,
  endMs: number,
  signal?: AbortSignal,
): Promise<SeriesData> {
  const url =
    `${BASE}?parameters=rr,tl&station_ids=${station.id}` +
    `&start=${toApiTime(startMs)}&end=${toApiTime(endMs)}`
  const res = await fetch(url, { signal })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Datenabruf fehlgeschlagen (HTTP ${res.status})${body ? ` – ${body.slice(0, 200)}` : ''}`)
  }
  const raw = (await res.json()) as RawSeriesResponse
  const feature = raw.features[0]
  if (!feature) throw new Error('Antwort ohne Stationsdaten')
  const params = feature.properties.parameters
  return {
    timestamps: raw.timestamps.map((t) => Date.parse(t)),
    rr: params.rr?.data ?? [],
    tl: params.tl?.data ?? [],
    station,
  }
}
