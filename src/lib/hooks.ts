import { useEffect, useRef, useState } from 'react'
import { fetchMetadata, fetchSeries, type DatasetMetadata, type SeriesData, type StationMeta } from './geosphere'
import { trimTrailingUnmeasured } from './stats'
import type { TimeRange } from './time'

/** Persistenter Zustand (Station, Zeitraum) über Besuche hinweg. */
export function usePersisted<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw != null) return JSON.parse(raw) as T
    } catch {
      // ignorieren, Initialwert verwenden
    }
    return initial
  })
  const set = (v: T) => {
    setValue(v)
    try {
      localStorage.setItem(key, JSON.stringify(v))
    } catch {
      // Speicher voll – Zustand gilt nur für diese Sitzung
    }
  }
  return [value, set]
}

export interface MetadataState {
  metadata: DatasetMetadata | null
  error: string | null
}

export function useMetadata(): MetadataState {
  const [state, setState] = useState<MetadataState>({ metadata: null, error: null })
  useEffect(() => {
    const ctrl = new AbortController()
    fetchMetadata(ctrl.signal)
      .then((metadata) => setState({ metadata, error: null }))
      .catch((e: unknown) => {
        if (ctrl.signal.aborted) return
        setState({ metadata: null, error: e instanceof Error ? e.message : String(e) })
      })
    return () => ctrl.abort()
  }, [])
  return state
}

export interface SeriesState {
  /** Zuletzt erfolgreich geladene Reihe – bleibt beim Nachladen stehen (gedimmt). */
  data: SeriesData | null
  loading: boolean
  error: string | null
}

/** Lädt rr+tl bei jedem Wechsel von Station oder Zeitraum; hält den alten Stand während des Ladens. */
export function useSeries(station: StationMeta | null, range: TimeRange | null): SeriesState {
  const [state, setState] = useState<SeriesState>({ data: null, loading: false, error: null })
  const runRef = useRef(0)

  useEffect(() => {
    if (!station || !range) return
    const run = ++runRef.current
    const ctrl = new AbortController()
    setState((s) => ({ ...s, loading: true, error: null }))
    fetchSeries(station, range.startMs, range.endMs, ctrl.signal)
      .then((raw) => {
        if (runRef.current !== run) return
        setState({ data: trimTrailingUnmeasured(raw), loading: false, error: null })
      })
      .catch((e: unknown) => {
        if (runRef.current !== run || ctrl.signal.aborted) return
        setState((s) => ({ data: s.data, loading: false, error: e instanceof Error ? e.message : String(e) }))
      })
    return () => ctrl.abort()
  }, [station, range])

  return state
}
