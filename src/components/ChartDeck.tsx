import { useEffect, useMemo, useRef, useState } from 'react'
import type { SeriesData } from '../lib/geosphere'
import { BIN_LABEL, INTENSITY, binSeries, chooseBinFactor, intensityClass } from '../lib/bin'
import { axisTicks, dayBands, niceCeil, timeTicks } from '../lib/scale'
import { fmtDayShort, fmtMm, fmtTemp, fmtTime, tzAbbr } from '../lib/time'
import { Tri } from './Icons'

const RAMP = ['var(--r1)', 'var(--r2)', 'var(--r3)', 'var(--r4)']

interface Props {
  series: SeriesData
  rrMax: number
  rrMaxAt: number | null
  onBinChange?: (label: string | null) => void
}

/**
 * Breite kommt vom Container (rückkopplungsfrei: sie hängt nie vom Chart-Inhalt ab),
 * Höhe vom Viewport — so gibt es keine Layout-Schleife und keine rAF-Abhängigkeit,
 * die in versteckten Tabs nie feuert.
 */
function useSize(): [React.RefObject<HTMLDivElement | null>, number, number] {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)
  const [vh, setVh] = useState(() => window.innerHeight)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setW(el.clientWidth))
    ro.observe(el)
    setW(el.clientWidth)
    const onResize = () => setVh(window.innerHeight)
    addEventListener('resize', onResize)
    return () => {
      ro.disconnect()
      removeEventListener('resize', onResize)
    }
  }, [])
  return [ref, w, vh]
}

/** Haupt- und Kumulativ-Panel auf geteilter Zeitachse, Fadenkreuz synchron. */
export default function ChartDeck({ series, rrMax, rrMaxAt, onBinChange }: Props) {
  const [wrapRef, width, viewportH] = useSize()
  const [hoverB, setHoverB] = useState<number | null>(null)

  const narrow = width > 0 && width < 700
  const LEG_W = narrow ? 0 : 150
  const PAD_L = narrow ? 38 : 46
  const PAD_R = 14
  // Der Schirm füllt das Viewport: Kopf + Kumulativ + Tabellenzeile + Statuszeile ≈ 340 px
  const H = narrow ? 250 : Math.max(280, Math.min(560, viewportH - 340))
  const PAD_T = 16
  const PAD_B = 26
  const CH = narrow ? 88 : 110
  const CPAD_T = 10
  const CPAD_B = 22

  const plotW = Math.max(0, width - PAD_L - PAD_R - LEG_W)

  const view = useMemo(() => {
    if (!series.timestamps.length || plotW <= 0) return null
    return binSeries(series, chooseBinFactor(series.timestamps.length, plotW))
  }, [series, plotW])

  useEffect(() => setHoverB(null), [series])

  const factor = view?.factor ?? null
  useEffect(() => {
    onBinChange?.(factor != null ? BIN_LABEL[factor] : null)
  }, [factor, onBinChange])

  if (width === 0 || plotW < 120) {
    return <div ref={wrapRef} className="plots-inner" />
  }
  if (!view || view.startMs.length === 0) {
    return (
      <div ref={wrapRef} className="plots-inner">
        <div
          style={{
            height: H,
            display: 'grid',
            placeItems: 'center',
            font: '400 12px/1.8 var(--mono)',
            color: 'var(--ink-3)',
            textAlign: 'center',
          }}
        >
          <p className="with-ic" style={{ justifyContent: 'center' }}>
            <Tri />
            <span>
              FÜR DIESEN ZEITRAUM LIEGEN NOCH KEINE MESSWERTE VOR —<br />
              ZEITRAUM ODER STATION WECHSELN.
            </span>
          </p>
        </div>
      </div>
    )
  }

  const n = view.startMs.length
  const t0 = view.startMs[0]
  const t1 = view.endMs[n - 1]
  const xMs = (ms: number) => PAD_L + ((ms - t0) / (t1 - t0)) * plotW
  const slot = plotW / n
  const xB = (b: number) => PAD_L + b * slot
  const bw = Math.max(1.6, Math.min(24, slot - Math.max(1, slot * 0.28)))

  // Kopffreiheit: trifft das Datenmaximum exakt die Skalenobergrenze (z. B. 5,0 auf
  // einer 5er-Achse), endet der Balken an der beschrifteten Maximallinie — nie an der
  // Blattkante. Der Bereich darüber gehört Annotation und Luft, die Skala bleibt ehrlich.
  const HEADROOM = narrow ? 14 : 20
  const yMax = niceCeil(Math.max(1, ...view.rr.map((v) => v ?? 0)))
  const y = (v: number) => PAD_T + HEADROOM + (1 - v / yMax) * (H - PAD_T - HEADROOM - PAD_B)
  const yTicks = axisTicks(yMax, 3)

  const CHEADROOM = 10
  const cumEnd = view.cum[n - 1] ?? 0
  const cumMax = niceCeil(Math.max(1, cumEnd))
  const cy = (v: number) => CPAD_T + CHEADROOM + (1 - v / cumMax) * (CH - CPAD_T - CHEADROOM - CPAD_B)
  const cumTicks = axisTicks(cumMax, 2)

  const bands = dayBands(t0, t1)
  const { ticks } = timeTicks(t0, t1)
  // Tageslabels nur, wo sie Platz haben (min. 58 px Abstand)
  const labeledMidnights = new Set<number>()
  {
    let lastX = -Infinity
    for (const t of ticks) {
      if (!t.midnight) continue
      const px = xMs(t.ms)
      if (px - lastX >= 58 && px < PAD_L + plotW - 40) {
        labeledMidnights.add(t.ms)
        lastX = px
      }
    }
  }

  const totalDry = view.rr.every((v) => !v)

  // Anker-Annotation: das stärkste 10-min-Intervall (aus den Rohdaten)
  let annot: { x: number; y: number; left: boolean } | null = null
  if (rrMax > 0 && rrMaxAt != null) {
    const b = view.startMs.findIndex((s, i) => rrMaxAt > s && rrMaxAt <= view.endMs[i])
    if (b >= 0 && view.rr[b] != null) {
      const ax = xB(b) + slot / 2
      annot = { x: ax, y: y(view.rr[b]!), left: ax > PAD_L + plotW * 0.72 }
    }
  }

  const hover = hoverB != null && hoverB >= 0 && hoverB < n ? hoverB : null
  const hoverX = hover != null ? xB(hover) + slot / 2 : 0

  const pointToBin = (clientX: number, el: SVGSVGElement) => {
    const rect = el.getBoundingClientRect()
    const px = clientX - rect.left
    return Math.max(0, Math.min(n - 1, Math.floor((px - PAD_L) / slot)))
  }

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => setHoverB(pointToBin(e.clientX, e.currentTarget))
  const onLeave = () => setHoverB(null)
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      setHoverB((b) => Math.min(n - 1, (b ?? -1) + 1))
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setHoverB((b) => Math.max(0, (b ?? n) - 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setHoverB(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setHoverB(n - 1)
    } else if (e.key === 'Escape') {
      setHoverB(null)
    }
  }

  const binMinutes = view.factor * 10

  return (
    <div ref={wrapRef} className="plots-inner">
      <div className="figure-head">
        <h2>Niederschlag</h2>
        <span className="unit">mm / {binMinutes === 10 ? '10 min' : binMinutes < 60 ? `${binMinutes} min` : `${binMinutes / 60} h`}</span>
        <div className="readout" role="status" aria-live="off">
          {hover != null && (
            <>
              <b>
                {fmtDayShort(view.startMs[hover])} · {fmtTime.format(view.startMs[hover])}–{fmtTime.format(view.endMs[hover])}
              </b>{' '}
              {tzAbbr(view.endMs[hover])}
              <span className="k" style={{ background: 'var(--r2)' }} />
              {view.rr[hover] == null ? (
                <b className="warn-t">LÜCKE</b>
              ) : (
                <>
                  <b>{fmtMm.format(view.rr[hover]!)} mm</b>
                  {view.factor > 1 && view.rrMax10[hover] != null && (
                    <span> · max {fmtMm.format(view.rrMax10[hover]!)}/10min</span>
                  )}
                </>
              )}
              <span className="k" style={{ background: 'var(--ink-3)' }} />
              tl <b>{view.tl[hover] == null ? '—' : `${fmtTemp.format(view.tl[hover]!)} °C`}</b>
              {' · '}Σ <b>{view.cum[hover] == null ? '0,0' : fmtMm.format(view.cum[hover]!)} mm</b>
            </>
          )}
        </div>
      </div>

      <svg
        className="chart-svg"
        width={width}
        height={H}
        role="img"
        aria-label={`Niederschlag je ${binMinutes} Minuten; Werte auch in der Tabellenansicht`}
        tabIndex={0}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onKeyDown={onKey}
      >
        {/* Tagesbänder: Alternierung zur Orientierung, Wochenenden als Anker kräftiger */}
        {bands.map((b, i) =>
          b.weekend || i % 2 === 1 ? (
            <rect
              key={b.key}
              x={xMs(b.startMs)}
              y={PAD_T}
              width={Math.max(0, xMs(b.endMs) - xMs(b.startMs))}
              height={H - PAD_T - PAD_B}
              fill={b.weekend ? 'var(--wash-we)' : 'var(--wash)'}
            />
          ) : null,
        )}
        {/* Gitter + y-Ticks */}
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={PAD_L} y1={y(t)} x2={PAD_L + plotW} y2={y(t)} stroke="var(--grid)" strokeWidth={1} />
            <text x={PAD_L - 8} y={y(t) + 3.5} textAnchor="end" fill="var(--ink-3)" fontFamily="var(--mono)" fontSize={10}>
              {fmtMm.format(t)}
            </text>
          </g>
        ))}
        {/* Zeit-Ticks */}
        {ticks.map((t) => (
          <g key={t.ms}>
            {t.midnight && t.ms > t0 && (
              <line x1={xMs(t.ms)} y1={PAD_T} x2={xMs(t.ms)} y2={H - PAD_B + 4} stroke="var(--baseline)" strokeWidth={1} />
            )}
            {t.midnight
              ? labeledMidnights.has(t.ms) && (
                  <text x={xMs(t.ms) + 5} y={H - PAD_B + 16} fill="var(--ink-3)" fontFamily="var(--mono)" fontSize={10}>
                    {fmtDayShort(t.ms)}
                  </text>
                )
              : !narrow && (
                  <text
                    x={xMs(t.ms)}
                    y={H - PAD_B + 16}
                    textAnchor="middle"
                    fill="var(--ink-3)"
                    fontFamily="var(--mono)"
                    fontSize={10}
                    opacity={0.8}
                  >
                    {fmtTime.format(t.ms)}
                  </text>
                )}
          </g>
        ))}
        {/* Grundlinie */}
        <line x1={PAD_L} y1={y(0)} x2={PAD_L + plotW} y2={y(0)} stroke="var(--baseline)" strokeWidth={1} />
        <text x={PAD_L - 8} y={y(0) + 3.5} textAnchor="end" fill="var(--ink-3)" fontFamily="var(--mono)" fontSize={10}>
          0
        </text>

        {/* Nadeln, klassifiziert nach stärkstem 10-min-Intervall */}
        {view.rr.map((v, b) => {
          if (v == null)
            return (
              <line
                key={b}
                x1={xB(b) + slot / 2}
                y1={y(0) - 3}
                x2={xB(b) + slot / 2}
                y2={y(0)}
                stroke="var(--warn)"
                strokeWidth={Math.max(1, bw * 0.5)}
              />
            )
          if (v <= 0) return null
          const bx = xB(b) + (slot - bw) / 2
          const by = y(v)
          const r = Math.min(1.4, bw / 2)
          const cls = intensityClass(view.rrMax10[b] ?? v)
          return (
            <path
              key={b}
              d={`M${bx},${y(0)} L${bx},${by + r} Q${bx},${by} ${bx + r},${by} L${bx + bw - r},${by} Q${bx + bw},${by} ${bx + bw},${by + r} L${bx + bw},${y(0)} Z`}
              fill={RAMP[cls]}
              opacity={hover == null || hover === b ? 1 : 0.55}
            />
          )
        })}

        {/* Trocken-Hinweis */}
        {totalDry && (
          <text
            x={PAD_L + plotW / 2}
            y={(PAD_T + H - PAD_B) / 2}
            textAnchor="middle"
            fill="var(--ink-3)"
            fontFamily="var(--mono)"
            fontSize={12}
          >
            0,0 mm IM ZEITRAUM — TROCKEN
          </text>
        )}

        {/* Anker-Annotation */}
        {annot && (
          <g>
            <circle cx={annot.x} cy={annot.y - 3} r={2.4} fill="none" stroke="var(--ink-2)" strokeWidth={1} />
            <line
              x1={annot.x}
              y1={annot.y - 5}
              x2={annot.x + (annot.left ? -32 : 32)}
              y2={Math.max(PAD_T + 12, annot.y - 32)}
              stroke="var(--ink-2)"
              strokeWidth={1}
            />
            <text
              x={annot.x + (annot.left ? -37 : 37)}
              y={Math.max(PAD_T + 10, annot.y - 34)}
              textAnchor={annot.left ? 'end' : 'start'}
              fill="var(--ink)"
              fontFamily="var(--mono)"
              fontSize={11}
              fontWeight={700}
            >
              {view.factor > 1 ? `${fmtMm.format(rrMax)} mm in 10 min` : `${fmtMm.format(rrMax)} mm`}
            </text>
            <text
              x={annot.x + (annot.left ? -37 : 37)}
              y={Math.max(PAD_T + 22, annot.y - 22)}
              textAnchor={annot.left ? 'end' : 'start'}
              fill="var(--ink-2)"
              fontFamily="var(--mono)"
              fontSize={10}
            >
              {rrMaxAt != null && `${fmtDayShort(rrMaxAt)} ${fmtTime.format(rrMaxAt)}`}
            </text>
          </g>
        )}

        {/* Intensitätslegende */}
        {!narrow && (
          <g>
            <text
              x={PAD_L + plotW + 26}
              y={PAD_T + 10}
              fill="var(--ink-3)"
              fontFamily="var(--mono)"
              fontSize={9.5}
              letterSpacing={1.4}
            >
              INTENSITÄT¹⁰
            </text>
            {[...INTENSITY].reverse().map((k, i) => {
              const ry = PAD_T + 26 + i * 30
              const ci = INTENSITY.length - 1 - i
              return (
                <g key={k.key}>
                  <rect x={PAD_L + plotW + 26} y={ry} width={10} height={18} rx={2} fill={RAMP[ci]} />
                  <text x={PAD_L + plotW + 44} y={ry + 8} fill="var(--ink-2)" fontFamily="var(--sans)" fontSize={11}>
                    {k.key}
                  </text>
                  <text x={PAD_L + plotW + 44} y={ry + 20} fill="var(--ink-3)" fontFamily="var(--mono)" fontSize={9.5}>
                    {k.range} mm
                  </text>
                </g>
              )
            })}
            <text
              x={PAD_L + plotW + 26}
              y={PAD_T + 26 + 4 * 30 + 12}
              fill="var(--ink-3)"
              fontFamily="var(--mono)"
              fontSize={8.5}
            >
              ¹⁰ je 10-min-Intervall
            </text>
          </g>
        )}

        {/* Fadenkreuz */}
        {hover != null && (
          <line x1={hoverX} y1={PAD_T} x2={hoverX} y2={H - PAD_B} stroke="var(--ink-2)" strokeWidth={1} />
        )}
      </svg>

      {narrow && (
        <div
          style={{
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
            padding: '6px 2px 2px',
            font: '400 10px/1.4 var(--mono)',
            color: 'var(--ink-2)',
          }}
        >
          {INTENSITY.map((k, i) => (
            <span key={k.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: RAMP[i] }} />
              {k.key} {k.range}
            </span>
          ))}
        </div>
      )}

      <div className="figure-head" style={{ marginTop: 8 }}>
        <h2 className="quiet">Kumulativ</h2>
        <span className="unit">mm</span>
      </div>
      <svg
        className="chart-svg"
        width={width}
        height={CH}
        role="img"
        aria-label="Kumulativer Niederschlag im Zeitraum"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        {bands.map(
          (b, i) =>
            (b.weekend || i % 2 === 1) && (
              <rect
                key={b.key}
                x={xMs(b.startMs)}
                y={CPAD_T}
                width={Math.max(0, xMs(b.endMs) - xMs(b.startMs))}
                height={CH - CPAD_T - CPAD_B}
                fill={b.weekend ? 'var(--wash-we)' : 'var(--wash)'}
              />
            ),
        )}
        {cumTicks.map((t) => (
          <g key={t}>
            <line x1={PAD_L} y1={cy(t)} x2={PAD_L + plotW} y2={cy(t)} stroke="var(--grid)" strokeWidth={1} />
            <text x={PAD_L - 8} y={cy(t) + 3.5} textAnchor="end" fill="var(--ink-3)" fontFamily="var(--mono)" fontSize={10}>
              {t}
            </text>
          </g>
        ))}
        <line x1={PAD_L} y1={cy(0)} x2={PAD_L + plotW} y2={cy(0)} stroke="var(--baseline)" strokeWidth={1} />
        <path
          d={view.cum.reduce((acc, v, b) => (v == null ? acc : `${acc}${acc ? 'L' : 'M'}${xB(b) + slot / 2},${cy(v)}`), '')}
          fill="none"
          stroke="var(--line)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {cumEnd >= 0 && (
          <g>
            <circle cx={xB(n - 1) + slot / 2} cy={cy(cumEnd)} r={6} fill="var(--screen)" />
            <circle cx={xB(n - 1) + slot / 2} cy={cy(cumEnd)} r={4} fill="var(--line)" />
            <text
              x={Math.max(PAD_L + 78, xB(n - 1) + slot / 2 - 10)}
              y={Math.max(CPAD_T + 10, cy(cumEnd) - 9)}
              textAnchor="end"
              fill="var(--ink)"
              fontFamily="var(--mono)"
              fontSize={12}
              fontWeight={700}
            >
              Σ {fmtMm.format(cumEnd)} mm
            </text>
          </g>
        )}
        {hover != null && (
          <line x1={hoverX} y1={CPAD_T} x2={hoverX} y2={CH - CPAD_B} stroke="var(--ink-2)" strokeWidth={1} />
        )}
      </svg>

      <details className="table-twin">
        <summary>
          <Tri /> TABELLENANSICHT ({BIN_LABEL[view.factor]})
        </summary>
        <div className="table-scroll" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">INTERVALL ({tzAbbr(t1)})</th>
                <th scope="col">NIEDERSCHLAG MM</th>
                <th scope="col">KUMULATIV MM</th>
                <th scope="col">TEMP °C</th>
              </tr>
            </thead>
            <tbody>
              {view.startMs.map((s, b) => (
                <tr key={s}>
                  <td>
                    {fmtDayShort(s)} {fmtTime.format(s)}–{fmtTime.format(view.endMs[b])}
                  </td>
                  {view.rr[b] == null ? (
                    <td className="gap">Lücke</td>
                  ) : (
                    <td className="v">{fmtMm.format(view.rr[b]!)}</td>
                  )}
                  <td>{view.cum[b] == null ? '—' : fmtMm.format(view.cum[b]!)}</td>
                  <td>{view.tl[b] == null ? '—' : fmtTemp.format(view.tl[b]!)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
