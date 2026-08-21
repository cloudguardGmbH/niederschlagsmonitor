import type { RangeStats } from '../lib/stats'
import { fmtDayShort, fmtMm, fmtTemp, fmtTime } from '../lib/time'

interface Props {
  stats: RangeStats
  rangeLabel: string
}

/** Kennzahlen-Staffel: die Summe führt, alles andere steigt geordnet ab. */
export default function StatsRail({ stats, rangeLabel }: Props) {
  const wetHours = (stats.wetIntervals * 10) / 60
  return (
    <aside className="stats" aria-label="Kennzahlen">
      <div className="stat">
        <div className="lbl">SUMME {rangeLabel.toUpperCase()}</div>
        <div className="v1">
          {fmtMm.format(stats.rrSum)}
          <small> mm</small>
        </div>
      </div>
      <div className="stat">
        <div className="lbl">MAX 10-MIN-INTENSITÄT</div>
        <div className="v2">
          {fmtMm.format(stats.rrMax)}{' '}
          <small>{stats.rrMaxAt != null ? `mm · ${fmtDayShort(stats.rrMaxAt)} ${fmtTime.format(stats.rrMaxAt)}` : 'mm'}</small>
        </div>
      </div>
      <div className="stat">
        <div className="lbl">NIEDERSCHLAGSDAUER</div>
        <div className="v3">
          {fmtMm.format(wetHours)} <small>h · {stats.wetIntervals} Intervalle</small>
        </div>
      </div>
      <hr />
      <div className="stat">
        <div className="lbl">LUFTTEMPERATUR 2 M</div>
        <div className="v2">
          {stats.tlLast == null ? '—' : fmtTemp.format(stats.tlLast)} <small>°C zuletzt</small>
        </div>
        <div className="note">
          {stats.tlMin != null && stats.tlMax != null
            ? `MIN ${fmtTemp.format(stats.tlMin)}° · MAX ${fmtTemp.format(stats.tlMax)}°`
            : 'KEINE TEMPERATURDATEN'}
        </div>
      </div>
      <hr />
      <div className="stat">
        {stats.gapIntervals > 0 ? (
          <div className="note warn">
            <span className="dot" />
            {stats.gapIntervals} {stats.gapIntervals === 1 ? 'MESSLÜCKE' : 'MESSLÜCKEN'} IM ZEITRAUM
          </div>
        ) : (
          <div className="note good">
            <span className="dot" />
            VOLLSTÄNDIG — 0 MESSLÜCKEN
          </div>
        )}
      </div>
    </aside>
  )
}
