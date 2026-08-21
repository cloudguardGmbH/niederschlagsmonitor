---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Niederschlagsmonitor — Hauptansicht

**Scope & Modus:** Die gesamte App ist eine Ansicht (kein Routing): der Monitor. Modus: Operate.

**Audience & Job:** Tobi, wiederholte Kurz-Checks („wie viel hat es an Station X geregnet?"). Aufgabe: Station wählen (durchsuchbares Register, 305 deduplizierte aktive Stationen, COMBINED bevorzugt), Zeitraum ziehen (Presets 24 h/48 h/7 T/30 T + frei ≤ 31 T), Regenverlauf und Summe ablesen.

**Inhalt/Beweis:** Live-Abruf klima-v2-10min (rr + tl in einem Request), Anzeige-Bündelung ab < 2,6 px/Slot (30 min/1 h/3 h/6 h), in der Statuszeile ausgewiesen. Kennzahlen aus Rohdaten (nie aus Bins). Lücken werden gezeigt (Warn-Ticks + Tabellenzeile „Lücke"), nie interpoliert.

**Constraints:** Kein Backend, CORS-direkt; Rate Limit ≈ 240 req/h (Metadaten 24 h gecacht); Zeitstempel UTC → Europe/Vienna; freier Bereich hart auf 31 Tage begrenzt.

**Gewählte Richtung:** „Der Nowcast-Monitor" (Radarviewer-Grammatik; Reroll-Runde mit Steer „kühl/modern, keine Nostalgie"). Nacht-/Tagschirm gleichwertig, klassifizierte Blau-Nadeln (validierte Ordinal-Rampen), Intensitätslegende, Haarlinien-Nähte, B612/B612 Mono, Farbe nur auf Daten, Amber nur Warnung. Raises: Größen-Staffel, Etikettenraster, Anker-Annotation, „Zustände drucken sich selbst", „Ein Zug, ganze Fläche".

**Merkmoment:** Fadenkreuz-Scrubbing mit gestempelter Readout-Zeile (Zeitfenster + rr + tl + Σ), Pfeiltasten steppen 10-min-Frames.

**Offen:** Temperatur als eigener Kanal/Panel (v2); Auto-Refresh (10 min); Stationswahl nach Nähe/Geolocation; CSV-Export der Tabellenansicht.
