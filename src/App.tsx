import { useCallback, useMemo, useState } from 'react'
import ChartDeck from './components/ChartDeck'
import { AutoTheme, Cross, Moon, RadarMark, Sun, Tri } from './components/Icons'
import RangeControl, { type RangeSpec } from './components/RangeControl'
import StationSelect from './components/StationSelect'
import StatsRail from './components/StatsRail'
import StatusLine from './components/StatusLine'
import { useMetadata, usePersisted, useSeries } from './lib/hooks'
import { computeStats } from './lib/stats'
import { DEFAULT_STATION_ID, selectableStations } from './lib/stations'
import { useTheme, type ThemeMode } from './lib/theme'
import { customRange, fmtDateInput, fmtStampCompact, presetRange, PRESETS, tzAbbr, type TimeRange } from './lib/time'

const THEME_ORDER: ThemeMode[] = ['auto', 'nacht', 'tag']
const THEME_LABEL: Record<ThemeMode, string> = { auto: 'AUTO', nacht: 'NACHT', tag: 'TAG' }

function ThemeToggle() {
  const [mode, setMode] = useTheme()
  const next = THEME_ORDER[(THEME_ORDER.indexOf(mode) + 1) % THEME_ORDER.length]
  return (
    <button
      type="button"
      className="theme-btn"
      onClick={() => setMode(next)}
      aria-label={`Darstellung: ${THEME_LABEL[mode]} — wechseln zu ${THEME_LABEL[next]}`}
      title={`Darstellung wechseln (${THEME_LABEL[next]})`}
    >
      {mode === 'auto' ? <AutoTheme /> : mode === 'nacht' ? <Moon /> : <Sun />}
      {THEME_LABEL[mode]}
    </button>
  )
}

export default function App() {
  const { metadata, error: metaError } = useMetadata()
  const stations = useMemo(() => (metadata ? selectableStations(metadata.stations) : []), [metadata])

  const [stationId, setStationId] = usePersisted<number>('monitor.station', DEFAULT_STATION_ID)
  const [spec, setSpec] = usePersisted<RangeSpec>('monitor.range', { kind: 'preset', id: '7t' })
  const [reload, setReload] = useState(0)
  const [binLabel, setBinLabel] = useState<string | null>(null)

  const station = useMemo(
    () => stations.find((s) => s.id === stationId) ?? stations.find((s) => s.id === DEFAULT_STATION_ID) ?? stations[0] ?? null,
    [stations, stationId],
  )

  const range: TimeRange = useMemo(() => {
    void reload
    if (spec.kind === 'frei') {
      const r = customRange(spec.from, spec.to)
      if (r) return r
    }
    return presetRange(spec.kind === 'preset' ? spec.id : '7t')
  }, [spec, reload])

  const { data, loading, error } = useSeries(station, range)
  const stats = useMemo(() => (data ? computeStats(data) : null), [data])

  const rangeLabel =
    spec.kind === 'preset' ? PRESETS.find((p) => p.id === spec.id)?.label ?? 'Zeitraum' : 'im Zeitraum'

  const onBinChange = useCallback((l: string | null) => setBinLabel(l), [])

  const shownStart = data?.timestamps.length ? data.timestamps[0] - 600_000 : range.startMs
  const shownEnd = data?.timestamps.length ? data.timestamps[data.timestamps.length - 1] : range.endMs

  return (
    <div className="monitor">
      <header className="bar">
        <div className="mark">
          <RadarMark active={loading || (!data && !metaError && !error)} />
          <div>
            <div className="name">NIEDERSCHLAGSMONITOR</div>
            <div className="sub">GEOSPHERE · KLIMA-V2-10MIN</div>
          </div>
        </div>

        <StationSelect stations={stations} value={station} onChange={(s) => setStationId(s.id)} />

        <RangeControl
          spec={spec}
          onChange={setSpec}
          minDate={metadata ? metadata.start_time.slice(0, 10) : '1992-05-20'}
          maxDate={fmtDateInput.format(Date.now())}
        />

        <div className={loading ? 'stand holding' : 'stand'}>
          <div className="lbl">DATENSTAND</div>
          <div className="val">
            {stats?.lastMeasuredAt != null ? (
              <>
                <b>{fmtStampCompact(stats.lastMeasuredAt)}</b> {tzAbbr(stats.lastMeasuredAt)}
              </>
            ) : (
              '—'
            )}
          </div>
        </div>

        <ThemeToggle />
      </header>

      {metaError ? (
        <div className="deck">
          <div className="plots">
            <div style={{ padding: '48px 20px', font: '400 12px/2 var(--mono)', color: 'var(--ink-3)' }}>
              <p className="with-ic" style={{ color: 'var(--crit)' }}>
                <Cross /> STATIONSLISTE NICHT ERREICHBAR — {metaError}
              </p>
              <p className="with-ic">
                <Tri /> NETZWERK PRÜFEN, DANN{' '}
                <button type="button" className="retry" style={{ font: 'inherit', color: 'var(--ink)', textDecoration: 'underline' }} onClick={() => window.location.reload()}>
                  NEU LADEN
                </button>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={`deck${loading ? ' dimmed' : ''}`}>
          <div className="plots">
            {data ? (
              <ChartDeck series={data} rrMax={stats?.rrMax ?? 0} rrMaxAt={stats?.rrMaxAt ?? null} onBinChange={onBinChange} />
            ) : (
              <div style={{ padding: '48px 20px', font: '400 12px/2 var(--mono)', color: 'var(--ink-3)' }}>
                {error ? (
                  <p className="with-ic">
                    <Cross /> KEINE DATEN — DETAILS IN DER STATUSZEILE
                  </p>
                ) : (
                  <p className="with-ic">
                    <Tri /> ERSTER ABRUF LÄUFT — STATION {station?.name.toUpperCase() ?? '…'}
                  </p>
                )}
              </div>
            )}
          </div>
          {stats && <StatsRail stats={stats} rangeLabel={rangeLabel} />}
        </div>
      )}

      <StatusLine
        station={station}
        stats={stats}
        binLabel={binLabel}
        startMs={shownStart}
        endMs={shownEnd}
        loading={loading}
        error={error}
        onRetry={() => setReload((r) => r + 1)}
      />
    </div>
  )
}
