import type { StationMeta } from '../lib/geosphere'
import type { RangeStats } from '../lib/stats'
import { fmtDayShort, fmtTime, tzAbbr } from '../lib/time'
import { Cross, Tri, Warn } from './Icons'

interface Props {
  station: StationMeta | null
  stats: RangeStats | null
  binLabel: string | null
  startMs: number
  endMs: number
  loading: boolean
  error: string | null
  onRetry: () => void
}

/** Zustände drucken sich selbst: die Statuszeile ist das Sprachrohr des Monitors. */
export default function StatusLine({ station, stats, binLabel, startMs, endMs, loading, error, onRetry }: Props) {
  return (
    <footer className="status">
      {error ? (
        <>
          <span className="crit with-ic">
            <Cross /> ABRUF FEHLGESCHLAGEN — {error}
          </span>
          <button type="button" className="retry" onClick={onRetry}>
            ERNEUT ABRUFEN
          </button>
          {stats && <span>LETZTER STAND BLEIBT ANGEZEIGT</span>}
        </>
      ) : loading ? (
        <span className="with-ic">
          <Tri /> ABRUF LÄUFT — STATION {station ? `${station.id} ${station.name.toUpperCase()}` : '…'} ·{' '}
          {fmtDayShort(startMs)} – {fmtDayShort(endMs)}
        </span>
      ) : stats ? (
        <>
          <span className="with-ic">
            <Tri /> <b>{stats.points} MESSWERTE</b>
            {binLabel && binLabel !== '10-MIN-WERTE' && <b>· ANZEIGE {binLabel}</b>}
          </span>
          <span>
            {fmtDayShort(startMs)} {fmtTime.format(startMs)} — {fmtDayShort(endMs)} {fmtTime.format(endMs)}{' '}
            {tzAbbr(endMs)}
          </span>
          {station && (
            <span>
              STATION <b>{station.id} {station.name.toUpperCase()}</b>
            </span>
          )}
          {stats.gapIntervals > 0 && (
            <span className="warn-t with-ic">
              <Warn /> {stats.gapIntervals} {stats.gapIntervals === 1 ? 'MESSLÜCKE' : 'MESSLÜCKEN'}
            </span>
          )}
          <span>
            QUELLE{' '}
            <a href="https://data.hub.geosphere.at/dataset/klima-v2-10min" target="_blank" rel="noreferrer">
              GEOSPHERE AUSTRIA
            </a>{' '}
            · CC BY 4.0
          </span>
        </>
      ) : (
        <span className="with-ic">
          <Tri /> MONITOR STARTET …
        </span>
      )}
    </footer>
  )
}
