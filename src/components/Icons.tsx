// Icon-Satz des Monitors: eine Strichstärke (1.4), ein Duktus, alles gezeichnet.

export function RadarMark({ size = 26, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="13" cy="13" r="11" stroke="var(--ink-3)" strokeWidth="1.4" />
      <circle cx="13" cy="13" r="6.5" stroke="var(--baseline)" strokeWidth="1" />
      <path
        className={active ? 'sweep-on' : undefined}
        d="M13 13 L21.5 8.5 A9.6 9.6 0 0 0 13 3.4 Z"
        fill="var(--ink-2)"
        fillOpacity="0.75"
      />
      <circle cx="13" cy="13" r="1.6" fill="var(--ink)" />
    </svg>
  )
}

export function Cross() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <path d="M2 2 L9 9 M9 2 L2 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function Warn() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 1.6 L11 10.4 L1 10.4 Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <line x1="6" y1="4.6" x2="6" y2="7.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="6" cy="8.9" r="0.7" fill="currentColor" />
    </svg>
  )
}

export function MapPin() {
  return (
    <svg className="geo" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M7.5 1.5 a4.6 4.6 0 0 1 4.6 4.6 c0 3.2-4.6 7.4-4.6 7.4 s-4.6-4.2-4.6-7.4 A4.6 4.6 0 0 1 7.5 1.5 Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="7.5" cy="6" r="1.7" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

export function Chevron({ open = false }: { open?: boolean }) {
  return (
    <svg
      className="chev"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.15s ease-out' }}
    >
      <path d="M2.5 4.5 L6 8 L9.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Check() {
  return (
    <svg className="check" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7.5 L5.5 10.5 L11.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Sun() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line
          key={a}
          x1="7"
          y1="1"
          x2="7"
          y2="2.6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          transform={`rotate(${a} 7 7)`}
        />
      ))}
    </svg>
  )
}

export function Moon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M11.5 8.6 A5.2 5.2 0 1 1 5.4 2.5 A4.2 4.2 0 0 0 11.5 8.6 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AutoTheme() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 1.6 A5.4 5.4 0 0 1 7 12.4 Z" fill="currentColor" />
    </svg>
  )
}

export function Tri() {
  return (
    <svg className="tri" width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
      <path d="M2.5 1.5 L7 4.5 L2.5 7.5 Z" fill="currentColor" />
    </svg>
  )
}
