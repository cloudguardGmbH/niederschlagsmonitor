import { useEffect, useRef, useState } from 'react'
import { PRESETS, customRange, fmtDateInput, type PresetId } from '../lib/time'

export type RangeSpec = { kind: 'preset'; id: PresetId } | { kind: 'frei'; from: string; to: string }

interface Props {
  spec: RangeSpec
  onChange: (spec: RangeSpec) => void
  /** Datensatz-Grenzen (Datum-Strings für die Inputs) */
  minDate: string
  maxDate: string
}

const fmtShort = (d: string) => {
  const [y, m, day] = d.split('-')
  return `${day}.${m}.${y}`
}

/** Zeitraum: Presets als Segmente, freier Bereich (≤ 31 Tage) hinter „Frei“. */
export default function RangeControl({ spec, onChange, minDate, maxDate }: Props) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const today = fmtDateInput.format(Date.now())
  const [from, setFrom] = useState(spec.kind === 'frei' ? spec.from : today)
  const [to, setTo] = useState(spec.kind === 'frei' ? spec.to : today)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  const probe = customRange(from, to)
  const spanDays = probe ? Math.round((probe.endMs - probe.startMs) / 86_400_000) : 0
  const error =
    from && to && !probe
      ? Date.parse(to) < Date.parse(from)
        ? 'Ende liegt vor dem Beginn.'
        : 'Maximal 31 Tage — die 10-Minuten-Auflösung bleibt sonst nicht ablesbar.'
      : null

  const freiLabel = spec.kind === 'frei' ? `${fmtShort(spec.from)} – ${fmtShort(spec.to)}` : 'Frei'

  return (
    <div className="presets-wrap" ref={wrapRef}>
      <div className="presets" role="group" aria-label="Zeitraum">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={spec.kind === 'preset' && spec.id === p.id}
            onClick={() => onChange({ kind: 'preset', id: p.id })}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={spec.kind === 'frei'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {freiLabel}
        </button>
      </div>

      {open && (
        <div className="range-pop">
          <div className="t">FREIER BEREICH · MAX 31 TAGE · AB {fmtShort(minDate)}</div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <label htmlFor="range-from">
                VON
                <input
                  id="range-from"
                  type="date"
                  value={from}
                  min={minDate}
                  max={maxDate}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </label>
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="range-to">
                BIS (INKL.)
                <input
                  id="range-to"
                  type="date"
                  value={to}
                  min={minDate}
                  max={maxDate}
                  onChange={(e) => setTo(e.target.value)}
                />
              </label>
            </div>
          </div>
          {error && <div className="err">{error}</div>}
          <button
            type="button"
            className="apply"
            disabled={!probe}
            onClick={() => {
              onChange({ kind: 'frei', from, to })
              setOpen(false)
            }}
          >
            {probe ? `${spanDays} TAG${spanDays === 1 ? '' : 'E'} ABRUFEN` : 'BEREICH PRÜFEN'}
          </button>
        </div>
      )}
    </div>
  )
}
