import { useEffect, useMemo, useRef, useState } from 'react'
import type { StationMeta } from '../lib/geosphere'
import { STATE_ABBR } from '../lib/stations'
import { Check, Chevron, MapPin } from './Icons'

interface Props {
  stations: StationMeta[]
  value: StationMeta | null
  onChange: (s: StationMeta) => void
}

/** Stationswähler: durchsuchbares Register, je Zeile das fixe Etikett Name · Land · Seehöhe. */
export default function StationSelect({ stations, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? stations.filter((s) => `${s.name} ${s.state}`.toLowerCase().includes(q)) : stations
  }, [stations, query])

  const groups = useMemo(() => {
    const by = new Map<string, StationMeta[]>()
    for (const s of filtered) {
      const g = by.get(s.state)
      if (g) g.push(s)
      else by.set(s.state, [s])
    }
    return [...by.entries()].sort((a, b) => a[0].localeCompare(b[0], 'de-AT'))
  }, [filtered])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    inputRef.current?.focus()
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  useEffect(() => setActiveIdx(0), [query])

  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx, open])

  const pick = (s: StationMeta) => {
    onChange(s)
    setOpen(false)
    setQuery('')
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(filtered.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter' && filtered[activeIdx]) {
      e.preventDefault()
      pick(filtered[activeIdx])
    }
  }

  let flatIdx = -1

  return (
    <div className="station-wrap" ref={wrapRef}>
      <button
        type="button"
        className="station"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <MapPin />
        <span>
          <span className="s-name" style={{ display: 'block' }}>
            {value ? value.name : 'Station wählen'}
          </span>
          <span className="s-meta" style={{ display: 'block' }}>
            {value ? `${value.state.toUpperCase()} · ${Math.round(value.altitude)} M · ID ${value.id}` : '—'}
          </span>
        </span>
        <Chevron open={open} />
      </button>

      {open && (
        <div className="station-pop" onKeyDown={onKey}>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="station-listbox"
            aria-activedescendant={filtered[activeIdx] ? `station-opt-${filtered[activeIdx].id}` : undefined}
            aria-label="Station suchen"
            placeholder={`${stations.length} Stationen durchsuchen …`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="station-list" ref={listRef} id="station-listbox" role="listbox" aria-label="Stationen">
            {groups.map(([state, list]) => (
              <div key={state} role="group" aria-label={state}>
                <div className="station-group">{state.toUpperCase()}</div>
                {list.map((s) => {
                  flatIdx++
                  const idx = flatIdx
                  const selected = value?.id === s.id
                  return (
                    <button
                      key={s.id}
                      id={`station-opt-${s.id}`}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      data-active={idx === activeIdx}
                      className="station-row"
                      onPointerEnter={() => setActiveIdx(idx)}
                      onClick={() => pick(s)}
                    >
                      <span style={{ width: 14, flex: 'none' }}>{selected && <Check />}</span>
                      <span className="n">{s.name}</span>
                      <span className="m">
                        {STATE_ABBR[s.state] ?? s.state.toUpperCase().slice(0, 2)} · {Math.round(s.altitude)} M
                      </span>
                    </button>
                  )
                })}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="station-empty">
                Keine Station passt auf „{query}“ —<br />
                Suchbegriff kürzen oder Bundesland probieren.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
