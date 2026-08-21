---
name: Niederschlagsmonitor
description: Radar-Zeitleisten-Monitor über der GeoSphere-10-Minuten-Messreihe — Beobachtungsschirm statt Adminpanel.
colors:
  # Tagschirm (:root, Standard)
  ground: "#e9edf2"
  screen: "#f4f6f9"
  seam: "rgba(16, 24, 34, 0.13)"
  ink: "#10151c"
  ink-2: "#45525f"
  ink-3: "#5f6c79"
  grid: "#dfe5eb"
  baseline: "#c2ccd6"
  r1: "#6da7ec"
  r2: "#3987e5"
  r3: "#1c5cab"
  r4: "#0d366b"
  line: "#1c5cab"
  good: "#006300"
  warn: "#8a5f00"
  crit: "#b32d2d"
  wash: "rgba(16, 24, 34, 0.035)"
  wash-we: "rgba(16, 24, 34, 0.06)"
  lift: "rgba(16, 24, 34, 0.05)"
  # Nachtschirm (prefers-color-scheme: dark bzw. [data-theme='dark'])
  ground-nacht: "#0e141b"
  screen-nacht: "#12181f"
  seam-nacht: "rgba(210, 228, 245, 0.1)"
  ink-nacht: "#dde5ee"
  ink-2-nacht: "#94a5b6"
  ink-3-nacht: "#728698"
  grid-nacht: "#1c242e"
  baseline-nacht: "#2c3947"
  r1-nacht: "#184f95"
  r2-nacht: "#2a78d6"
  r3-nacht: "#6da7ec"
  r4-nacht: "#b7d3f6"
  line-nacht: "#6da7ec"
  good-nacht: "#0ca30c"
  warn-nacht: "#fab219"
  crit-nacht: "#e66767"
  wash-nacht: "rgba(210, 228, 245, 0.03)"
  wash-we-nacht: "rgba(210, 228, 245, 0.05)"
  lift-nacht: "rgba(210, 228, 245, 0.055)"
typography:
  display:
    fontFamily: "'B612', system-ui, sans-serif"
    fontSize: "46px"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'B612', system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.02em"
  title:
    fontFamily: "'B612', system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: "'B612', system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  readout:
    fontFamily: "'B612 Mono', ui-monospace, 'Cascadia Mono', monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1
  label:
    fontFamily: "'B612 Mono', ui-monospace, 'Cascadia Mono', monospace"
    fontSize: "9.5px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0.14em"
rounded:
  focus: "2px"
  field: "5px"
  control: "6px"
  pop: "8px"
spacing:
  micro: "6px"
  control: "10px"
  panel: "14px"
  block: "16px"
  gutter: "20px"
components:
  segment:
    textColor: "{colors.ink-2}"
    padding: "10px 13px"
  segment-aktiv:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    padding: "10px 13px"
  apply:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.field}"
    padding: "9px"
  theme-btn:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    padding: "8px 11px"
  station:
    backgroundColor: "{colors.screen}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "7px 12px 7px 10px"
  input:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "9px 11px"
  popover:
    backgroundColor: "{colors.screen}"
    rounded: "{rounded.pop}"
    padding: "14px"
---

# Design System: Niederschlagsmonitor

## Overview

**Creative North Star: "Der Nowcast-Monitor"**

Die Oberfläche ist ein Beobachtungsschirm in Radarviewer-Grammatik: oben eine Kontrollleiste, in der Mitte das Messblatt (Nadel-Plot plus Kumulativ-Panel auf geteilter Zeitachse), rechts die Kennzahlen-Staffel, unten eine gedruckte Statuszeile. Verfolgung statt Verwaltung — der Monitor verweigert das Karten-Grid-Adminpanel seiner Kategorie. Chrome tritt zurück; die Messreihe ist der Held und darf laut sein.

Es gibt zwei gleichwertige Schirme, Tagschirm und Nachtschirm, plus Auto-Folge des Systems. Das Material ist eine flache Schirmfläche, die sich ausschließlich über Haarlinien-Nähte gliedert; echte Elevation existiert nur auf Popovers. Farbe ist streng rationiert: die klassifizierte Blau-Rampe gehört ausschließlich den Messdaten, Amber ausschließlich der Warnung — alles Übrige spricht in drei Tintenstufen auf Schirmgrund. B612 und B612 Mono (Cockpit-Schriften, selbst gehostet) tragen die Instrumenten-Anmutung; Zustände drucken sich selbst als Textzeilen, nie als Toast oder Overlay.

Provenienz: Richtungsvertrag als HTML-Kommentar am Kopf von `index.html` (Nowcast-Monitor, Kandidat 4, Seed 4c1dacdc R1); Finish-Review mit Disposition „ship“ am 2026-08-21. Dieses Dokument beschreibt den gebauten Stand.

**Key Characteristics:**
- Radarviewer-Grammatik: Leiste, Messblatt, Staffel, Statuszeile — keine Karten-Kacheln, keine Panels mit Schatten
- Nachtschirm und Tagschirm vollwertig; drei Theme-Scopes, Schalter AUTO → NACHT → TAG
- Blau nur auf Daten, Amber nur als Warnung; der „Akzent“ der Oberfläche ist die Tinte selbst
- Haarlinien-Nähte statt Schatten; ein einziger Schatten, nur auf Popovers
- Zwei Stimmen: B612 fett für Werte und Gegenstände, B612 Mono versal-gesperrt für alles Meta
- Ehrliche Buchhaltung: Messlücken, Anzeige-Bündelung, Datenstand, Zeitzone und Quelle stehen sichtbar im Blatt

## Colors

Eine nahezu monochrome Tinte-auf-Schirm-Palette, in der die einzige chromatische Stimme — die vierstufige Blau-Rampe — den Messdaten vorbehalten ist.

Theme-Mechanik (`src/index.css`, `src/lib/theme.ts`): drei Scopes — `:root` trägt den Tagschirm als Standard; `@media (prefers-color-scheme: dark)` überschreibt für `:root:not([data-theme='light'])`; `:root[data-theme='dark']` erzwingt den Nachtschirm. Der Schalter rotiert AUTO → NACHT → TAG (persistiert als `monitor.theme`), `?theme=dark|light` in der URL übersteuert (Screenshots, geteilte Links), `color-scheme` ist je Scope gesetzt. `--accent` ist ein Alias auf `--ink` — es gibt keine eigene Akzentfarbe. Jeder Token existiert in beiden Schirmen (Frontmatter: Suffix `-nacht`); neue Farben ohne Nacht-Gegenstück sind unzulässig.

### Primary

Die Datenrampe — vier ordinale Intensitätsstufen, beide Schirm-Varianten CVD-validiert (dataviz-Validator). Klassifiziert wird immer das stärkste 10-min-Intervall eines Anzeige-Bins (`max10`, `src/lib/bin.ts`); Grenzen abgeleitet aus den Stundenklassen des Warnwesens / 6:

- **r1 „leicht“** (#6da7ec Tag / #184f95 Nacht): < 0,5 mm je 10 min
- **r2 „mäßig“** (#3987e5 Tag / #2a78d6 Nacht): 0,5 – 1,7 mm; zugleich Farbkey des Readouts
- **r3 „stark“** (#1c5cab Tag / #6da7ec Nacht): 1,7 – 8,3 mm
- **r4 „sehr stark“** (#0d366b Tag / #b7d3f6 Nacht): ≥ 8,3 mm
- **line** (#1c5cab Tag / #6da7ec Nacht): die Kumulativ-Linie samt Endpunkt — die einzige Linienfarbe im Blatt

Die Rampe läuft im Tagschirm hell → dunkel, im Nachtschirm dunkel → hell; „mehr Intensität = mehr Kontrast zum Schirm“ bleibt in beiden Welten erhalten.

### Secondary

Statusfarben — sie erscheinen nur als Text, Punkt oder Lücken-Stummel, nie als Fläche oder Buttonfarbe:

- **good** (#006300 Tag / #0ca30c Nacht): Vollständigkeitsvermerk („VOLLSTÄNDIG — 0 MESSLÜCKEN“)
- **warn** (#8a5f00 Tag / #fab219 Nacht): Messlücken — Notizzeile, Warn-Dreieck, Lücken-Stummel im Plot, „Lücke“-Zelle der Tabelle, „LÜCKE“ im Readout
- **crit** (#b32d2d Tag / #e66767 Nacht): Abruf-/Netzfehler und Validierungsfehler als Textzeile

### Neutral

Schirm und Tinte:

- **ground** (#e9edf2 / #0e141b): der Grund hinter dem Schirm — Body, eingelassene Eingabefelder, invertierter Buttontext
- **screen** (#f4f6f9 / #12181f): die Schirmfläche — Popover, Stationstrigger, sticky Tabellen-/Gruppenköpfe, Halo des Kumulativ-Endpunkts
- **seam** (rgba-Haarlinie): jede Trennung — Leisten-, Deck-, Status-, Staffel- und Tabellennähte, Konturen aller Controls
- **ink / ink-2 / ink-3** (#10151c, #45525f, #5f6c79 / #dde5ee, #94a5b6, #728698): dreistufige Tinte — Werte und Emphase / Nebenwerte und Einheiten / Beschriftung und Micro-Labels
- **grid** (#dfe5eb / #1c242e): horizontale Gitterlinien, Tabellen-Zeilentrenner
- **baseline** (#c2ccd6 / #2c3947): Grundlinie, Mitternachtslinien, Hover-Konturen, Scrollbar-Daumen
- **wash / wash-we** (rgba-Lasuren): alternierende Tagesbänder; Wochenenden kräftiger als Anker
- **lift** (rgba-Lasur): Hover/aktive Listenzeile im Register

### Named Rules

**Die Datenblau-Regel.** Die Rampe r1–r4 und `line` sind ausschließlich für Messdaten reserviert. Kein Button, kein Link, kein aktiver Zustand, kein Icon trägt Blau; Fokus, Auswahl und Aktiv-Zustände sprechen in Tinte. Ein neuer Datenkanal darf die Rampe erben oder eine eigene validierte Ordinal-Rampe mitbringen — Chrome nie.

**Die Amber-Regel.** Amber (`warn`) heißt immer „Messlücke/Warnung“, sonst nichts. `good`/`crit` erscheinen nur als Text mit Punkt oder gezeichnetem Icon. Kein Wert wird nur über Farbe codiert — jede Farbaussage steht auch als Text oder Position im Blatt.

**Die Tinten-Akzent-Regel.** Der aktive Zustand ist invertierte Tinte (`ink` auf `ground`), Hover ist eine Tintenstufe dunkler plus `wash`/`lift` oder `baseline`-Kontur. `::selection` invertiert ebenso (ink auf ground).

## Typography

**Display Font:** B612 (400, 400 kursiv, 700; @fontsource, selbst gehostet) mit system-ui, sans-serif
**Body Font:** B612 — dieselbe Familie, eine Werkschrift für Werte wie Fließtext
**Label/Mono Font:** B612 Mono (400, 700; @fontsource, selbst gehostet) mit ui-monospace, 'Cascadia Mono', monospace

**Character:** B612 wurde für Cockpit-Displays gezeichnet — technisch-scharf, bei kleinen Graden robust. Das System spricht zweistimmig: die Sans fett für alles, was gemessen wurde; die Mono versal-gesperrt für alles, was es einordnet. Schriften werden nie von einem CDN geladen.

### Hierarchy

- **Display / Kennzahl v1** (700, 46px/1.02, −0.01em; mobil 34px): die führende Kennzahl (Summe); Einheit daneben klein (Mono 17px, ink-2)
- **Headline / Panelkopf** (700, 14.5px/1.2, 0.02em): `h2` im figure-head; „quiet“-Variante 12px in ink-2 für Sekundärpanels (Kumulativ)
- **Title / Kennzahl v2 und v3** (700, 21px/1.15 bzw. 700, 15px/1.3): absteigende Staffelwerte; Einheiten klein in Mono (12px / 11px, ink-2)
- **Body** (400, 14px Basis; Listen, Zeilen und Eingaben 13px): Stationsnamen 700 als Gegenstand
- **Readout** (Mono 400, 12px/1, tabular-nums): Fadenkreuz-Zeile, Datenstand; Emphase als `b` in ink 700
- **Label** (Mono 400, 9–9.5px/1.7, 0.12–0.14em, VERSAL): Micro-Labels über Werten, Gruppierköpfe, Summary-Zeilen; Statuszeile 11px/1.7 bei 0.04em
- **Chart-Beschriftung** (Mono im SVG): Ticks 10px, Legende 9.5px bei 1.4px Sperrung, Fußnote 8.5px, Annotation 11px (Wert 700) + 10px (Zeit)

### Named Rules

**Die Zwei-Stimmen-Regel.** B612 fett = das Gemessene (Werte, Stationsname, Panelkopf). B612 Mono = das Meta (Labels, Einheiten, Zeitstempel, Status, Achsen). Micro-Labels stehen VERSAL mit 0.12–0.14em Sperrung; Einheiten klein und unmittelbar am Wert. In der Statuszeile ist Emphase eine Tintenstufe (`b` = ink-2 bei Gewicht 400), kein Fett.

**Die Tabellenziffern-Regel.** Überall, wo Zahlen springen können (Readout, Datenstand, Status, Tabelle, Listen-Meta), gilt `font-variant-numeric: tabular-nums`. Zahlformate deutsch (Intl `de-AT`, Komma, eine Nachkommastelle für mm und °C), Datumsform „Do 20.08.“, Zeitstempel immer mit Zeitzonenkürzel (MESZ/MEZ), Zeitzone der Anzeige ist Europe/Vienna.

## Layout

Der Monitor ist eine zentrierte Spalte von maximal 1560px über voller Viewporthöhe: Kontrollleiste / Deck / Statuszeile. Das Seitenraster hält eine 20px-Gosse (Leiste 13px 20px; Plots 16px oben, 20px links; Status 10px 20px 12px); Blöcke atmen mit 16–18px, Controls mit 10px, Mikroabstände 6–7px, Popover-Innenraum 14px.

Das Deck teilt sich in flexible Plots und die feste Kennzahlen-Staffel (232px, Naht links, vertikaler Stapel mit 17px Abstand, `hr`-Nähte zwischen Themenblöcken). Die Chartbreite kommt vom Container (ResizeObserver, bewusst rückkopplungsfrei — sie hängt nie vom Chartinhalt ab), die Charthöhe vom Viewport: H = max(280, min(560, Viewporthöhe − 340)); das Kumulativ-Panel misst 110px. Plotgeometrie: PAD_L 46 / PAD_R 14 / Legendenspalte 150; Nadelbreite = clamp(1.6 … 24, Slot − max(1, 28 % Slot)).

Responsiv in drei Stufen: unter 1040px wandert die Staffel als umbrechende Zeile unters Blatt (Naht oben statt links); unter 760px wird die Leiste kompakt — Stationswähler volle Breite (order 3), Zeitraum-Segmente als randloser Scrollstreifen (order 4), Datenstand entfällt, v1 fällt auf 34px, Popover auf calc(100vw − 28px). Unter 700px Containerbreite schaltet das Blatt selbst auf schmal: Höhe 250/88, PAD_L 38, Legende wird zur Chip-Zeile unter dem Plot, Stunden-Ticks entfallen.

Zustand persistiert über Besuche (`localStorage`: `monitor.station`, `monitor.range`, `monitor.theme`).

## Elevation & Depth

Der Schirm ist flach. Tiefe entsteht ausschließlich über Haarlinien-Nähte (`seam`), Lasuren (`wash`, `lift`) und das Einlassen von Feldern in `ground`; sticky Köpfe decken mit `screen` ab statt mit Schatten. Die einzige echte Elevation gehört den Popovers, die über dem Schirm schweben.

### Shadow Vocabulary

- **Popover-Schweben** (`box-shadow: 0 14px 36px rgba(2, 6, 12, 0.35), 0 2px 8px rgba(2, 6, 12, 0.2)`): der einzige Schatten des Systems; identisch auf Stationsregister und Freier-Bereich-Popover, in beiden Schirmen.

### Named Rules

**Die Naht-Regel.** Flächen trennen sich durch 1px `seam`, niemals durch Schatten, Borders in Tintenfarbe oder Hintergrundwechsel großer Flächen. Wer eine neue Region anlegt, zieht eine Naht.

**Die Popover-Ausnahme.** Nur was über dem Schirm schwebt (Popover), trägt den einen Schatten — zusammen mit `screen`-Fläche, `seam`-Kontur und 8px Radius. Nichts, was im Schirm liegt, wirft Schatten.

## Shapes

Radienskala streng vierstufig: 2px (Fokusring, Legendenkästchen, Readout-Farbkeys 13×3), 5px (Felder, Listenzeilen, Apply-Taste, Scrollbar-Daumen), 6px (Controls: Segmente-Gruppe, Trigger, Themenschalter, Tabellenrahmen), 8px (Popover). Nichts darüber — keine Pillen, keine Kreisbuttons. Kreise existieren nur als Datenpunkte und Marken: Statuspunkt 7px, Kumulativ-Endpunkt 4px mit 6px-Halo in `screen`, Annotationsauge 2.4px.

Die Nadeln des Plots sind oben mit min(1.4, halbe Nadelbreite) verrundet und stehen unten bündig auf der Grundlinie — Messnadel, nicht Balkendiagramm.

Icons sind gezeichnete Strichzeichnungen in `currentColor`: Kernstrich 1.4 (optische Kompensation 1.3 für kleine Details bis 1.6 für das Häkchen, Hilfskreise 1.0), runde Kappen und Ecken; kleine gefüllte Marken sind erlaubt (Tri-Dreieck, Punkte, Radarkegel). Bestand: RadarMark 26 (Kegel rotiert nur während eines Abrufs), Cross 11, Warn 12, MapPin 15, Chevron 12 (dreht 180° offen), Check 14, Sun/Moon/AutoTheme 14, Tri 9. Keine Glyph-/Font-Icons, keine Emoji, alle `aria-hidden`.

## Components

### Kontrollleiste

Einzeilige Leiste mit Naht unten: Marke (RadarMark + zwei Zeilen: Name 700 13px bei 0.13em VERSAL, Sub Mono 9.5px ink-3), Stationswähler, Zeitraum-Segmente, Datenstand rechtsbündig (Label VERSAL-Mono 9px, Wert Mono 12px tabular mit fettem Zeitstempel; hält beim Abruf gedimmt), Themenschalter. Umbruchfähig (flex-wrap).

### Buttons

- **Segmente (Zeitraum):** Gruppe mit `seam`-Kontur und 6px, Segmente durch Nähte getrennt; Mono 11.5px, ink-2, 10px 13px. Hover: ink + `wash`. Aktiv (`aria-pressed`): invertierte Tinte, 700. Das Frei-Segment zeigt den gewählten Bereich als Label („14.08.2026 – 21.08.2026“).
- **Primärtaste (nur im Popover):** invertierte Tinte, 5px, Mono 700 11.5px bei 0.08em VERSAL, volle Breite; disabled opacity 0.45. Die Beschriftung nennt die Folge („7 TAGE ABRUFEN“, ungültig: „BEREICH PRÜFEN“).
- **Konturtaste (Themenschalter):** 1px `seam`, 6px, Mono 10.5px bei 0.08em, Icon 14 + VERSAL-Label; Hover: ink + `baseline`-Kontur.
- **Zeilenaktionen:** in Status- und Fehlerzeilen sind Aktionen unterstrichene VERSAL-Worte in ink (underline-offset 3px), keine Tasten — gedruckte Befehle im Protokoll.

### Stationswähler

Trigger: `screen`-Fläche, `seam`, 6px, min. 290px; MapPin in ink-3, Name 700 14px, Metazeile Mono 10px ink-2 („WIEN · 198 M · ID 105“), Chevron rechts. Popover: 380px, max. 480px hoch; Suchfeld oben eingelassen; Gruppen nach Bundesland mit sticky VERSAL-Mono-Köpfen; Zeilen mit fester Häkchenspalte (14px), Name 13px, rechtsbündigem Kürzel · Seehöhe (Mono 10px, tabular). Hover/aktiv: `lift`; gewählt: 700 + Check. Leere Suche erklärt und empfiehlt („Suchbegriff kürzen oder Bundesland probieren“). Vollständige Tastaturführung (Pfeile, Enter, Escape) mit combobox/listbox-ARIA.

### Inputs / Fields

Felder liegen eingelassen in `ground` auf `screen`-Popovers: 1px `seam`, 5px, Text 13px Sans (Suchfeld) bzw. 12px Mono (Datum), Placeholder ink-3. Fokus: 2px `accent`-Ring (im Feld offset 0, sonst offset 2). Validierungsfehler als crit-Mono-Zeile, die die Grenze begründet („Maximal 31 Tage — die 10-Minuten-Auflösung bleibt sonst nicht ablesbar.“).

### Kennzahlen-Staffel

232px-Rail rechts: je Kennzahl VERSAL-Label darüber, Wert in absteigender Kaskade v1 46 → v2 21 → v3 15, Einheiten klein in Mono; `hr`-Nähte trennen Themenblöcke (Niederschlag / Temperatur / Vollständigkeit); Notizzeilen (Mono 10.5px) mit 7px-Punkt in `good`/`warn`. Die Summe führt; alles andere steigt geordnet ab.

### Statuszeile

Fußzeile mit Naht oben, Mono 11px/1.7 ink-3 bei 0.04em, Segmente mit 18px Abstand, tabular-nums. Drei Druckzustände: Fehler (Cross, crit-Zeile, „ERNEUT ABRUFEN“ als Zeilenaktion, „LETZTER STAND BLEIBT ANGEZEIGT“), Laden (Tri, „ABRUF LÄUFT — STATION … · Zeitraum“), Normal (Messwertzahl, ggf. „ANZEIGE 30-MIN-SUMMEN“, Zeitraum mit Zeitzonenkürzel, Station mit ID, ggf. Messlücken mit Warn-Dreieck, Quelle „GEOSPHERE AUSTRIA · CC BY 4.0“ als unterstrichener Link).

### Messblatt (Signatur)

Das wiederverwendbare Herzstück — jeder künftige Kanal (z. B. Temperatur) ist ein weiteres Messblatt auf der geteilten Zeitachse:

- **figure-head:** `h2` + Einheit (Mono 10.5px, wechselt mit der Bündelung: „mm / 30 min“) + Readout rechtsbündig.
- **Fadenkreuz-Readout:** gestempelte Zeile statt Tooltip — Intervall fett („Do 20.08. · 16:20–16:30“) + Zeitzonenkürzel, Farbkey 13×3, Wert fett (oder „LÜCKE“ in warn), bei Bündelung „· max x/10min“, zweiter Key in ink-3 für tl, dann „Σ“. `role="status"`, `aria-live="off"`.
- **Interaktion:** Pointer scrubbt binweise, Hover dimmt fremde Nadeln auf 0.55; Fadenkreuz (1px ink-2) synchron über beide Panels; SVG fokussierbar (`tabIndex 0`, Fokusring innenliegend −2), Pfeiltasten steppen Frames, Home/End springen, Escape löscht; `touch-action: pan-y`.
- **Orientierung:** Tagesbänder in Wiener Kalendertagen (alternierend `wash`, Wochenende `wash-we`), Mitternachtslinien in `baseline`, Tageslabels „Fr 14.08.“ nur bei ≥ 58px Abstand, Stunden-Ticks Mono 10px (entfallen schmal).
- **Skalen (`src/lib/scale.ts`):** runde Obergrenzen über die 1-2-2.5-5-10er-Reihe (`niceCeil`); `axisTicks` beschriftet IMMER das Achsenmaximum selbst plus runde Zwischenwerte (Zwischentick entfällt unter 0,45 · Schritt vor dem Maximum) und „0“ an der Grundlinie — der höchste Balken ist stets gegen eine beschriftete Linie ablesbar. Haupt-Panel 3er-Teilung, Kumulativ 2er; Zeitschritte 3h/6h/24h/96h nach Spannweite.
- **Nadeln:** Füllung = Rampe nach `intensityClass(max10)`; Lücken als halbbreite warn-Stummel unter der Grundlinie; ganz trocken: zentrierte Zeile „0,0 mm IM ZEITRAUM — TROCKEN“.
- **Anker-Annotation:** das stärkste 10-min-Intervall bekommt Kreisauge (2.4px, ink-2), schräge Führungslinie (32px) und zweizeilige Beschriftung (Wert Mono 11px 700 ink, Zeit Mono 10px ink-2); bei gebündelter Anzeige lautet der Wert „x,x mm in 10 min“, ungebündelt „x,x mm“; klappt nach links, sobald der Anker jenseits von 72 % der Blattbreite liegt.
- **Legende:** Spalte rechts, „INTENSITÄT¹⁰“ VERSAL-Mono 9.5px, vier Kästchen 10×18 (rx 2) absteigend, je Klasse Name (Sans 11px) + Bereich (Mono 9.5px), Fußnote „¹⁰ je 10-min-Intervall“; schmal als Chip-Zeile unter dem Blatt.
- **Kumulativ-Panel:** Linie `line` 2px rund auf geteilter Achse, Endpunkt 4px mit `screen`-Halo, Endlabel „Σ 22,2 mm“ Mono 12px 700.
- **Anzeige-Bündelung (`src/lib/bin.ts`):** Faktoren 1/3/6/18/36 → „10-MIN-WERTE“ bis „6-H-SUMMEN“; gebündelt wird, sobald ein 10-min-Slot unter 2.6px fiele. Daten bleiben 10-min: Klassifizierung und `max10` kommen aus den Rohintervallen, die Statuszeile weist die Anzeige aus, die Einheit im Kopf wechselt mit.
- **Tabellen-Zwilling:** `details` unter dem Blatt, Summary VERSAL-Mono 10.5px mit Tri (dreht 90° offen, Binning im Titel), Scrollrahmen 6px/max. 300px mit sticky Kopf; Zahlen rechtsbündig tabular, Werte in ink, Lücken als warn-Zelle „Lücke“. Jeder Wert ist ohne Hover erreichbar.

### Leerlauf- und Fehlerflächen

Mono 12px/2 in ink-3 auf großzügigem Freiraum (48px 20px), gezeichnetes Icon + VERSAL-Zeile, immer mit nächster Handlung („ZEITRAUM ODER STATION WECHSELN“, „NETZWERK PRÜFEN, DANN NEU LADEN“); Fehlerzeilen in crit.

### Named Rules

**Die Ein-Zug-Regel.** Beim Nachladen dimmt der gesamte alte Stand — Charts, Staffel, Datenstand — als eine Fläche auf 45 % (opacity 0.2s ease-out) und bleibt ablesbar, bis der neue steht. Keine Spinner, keine Skeletons, keine Layoutsprünge; nur der Radarkegel der Marke rotiert (1.6s linear, unendlich). `prefers-reduced-motion` setzt sämtliche Übergänge und Animationen auf 0.01ms; die übrigen Übergänge des Systems sind 0.15s ease-out (Chevron/Tri-Rotation).

**Die Druckzeilen-Regel.** Zustände drucken sich selbst als Textzeilen in Statuszeile oder Fläche — VERSAL-Mono mit gezeichnetem Icon, Aktionen als unterstrichene Worte. Nie Toasts, Banner, Modals oder Overlay-Spinner.

**Die Buchhaltungs-Regel.** Jede Darstellungsentscheidung wird ausgewiesen: Messwertzahl, Anzeige-Bündelung, Zeitraum mit Zeitzone, Station mit ID, Messlückenzahl, Quelle mit Lizenz. Lücken werden gezeigt (Stummel, „Lücke“, Zähler), nie interpoliert oder glattgezogen.

## Do's and Don'ts

### Do:

- **Do** jeden neuen Datenkanal als weiteres Messblatt andocken: figure-head-Anatomie (h2 + Einheit + Readout), geteilte Zeitachse, synchrones Fadenkreuz, Tabellen-Zwilling, Ausweis in der Statuszeile.
- **Do** die Blau-Rampe (oder eine eigene validierte Ordinal-Rampe) ausschließlich auf Daten setzen; Klassifizierung immer am 10-min-Rohintervall (Grenzen 0,5 / 1,7 / 8,3 mm).
- **Do** jede Trennung als 1px `seam`-Naht ziehen; Felder in `ground` einlassen statt umranden.
- **Do** jeden Wert auch ohne Hover anbieten (Tabellen-Zwilling, direkte Labels, Anker-Annotation).
- **Do** deutsch formatieren: `de-AT`-Komma, tabular-nums, „Do 20.08.“, Zeitzonenkürzel an jedem Zeitstempel, Einheiten klein in Mono am Wert.
- **Do** Icons zeichnen: currentColor, Kernstrich 1.4, runde Kappen, `aria-hidden`; Fokus als 2px `accent`-Ring (offset 2, in Charts −2); volle Tastaturführung (Pfeile steppen, Escape schließt/löscht).
- **Do** beide Schirme pflegen: jeder neue Token braucht Tag- und Nacht-Wert, geprüft in beiden Welten.

### Don't:

- **Don't** Schatten auf dem Schirm — keine Cards, keine erhobenen Panels; der eine Schatten gehört den Popovers.
- **Don't** Blau auf Chrome: kein blauer Button, Link oder Aktiv-Zustand; aktiv = invertierte Tinte, Links = unterstrichene Tinte.
- **Don't** Glyph-/Font-Icons, Emoji oder Icon-Bibliotheken; keine Systemschriften als Zierde.
- **Don't** Spinner, Skeletons, Toasts oder Modals — Dimm-Hold und gedruckte Statuszeilen sind die Ladesprache.
- **Don't** Lücken interpolieren oder stumm bündeln; jede Aggregation wird beschriftet und ausgewiesen.
- **Don't** Information nur über Farbe codieren; jede Farbaussage hat ein Text- oder Positions-Double.
- **Don't** Radien über 8px, Pillen oder Kreisbuttons; keine neuen Grautöne außerhalb der Tinten- und Schirmskala.
