# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + TypeScript + Tailwind CSS v4 (user-confirmed 2026-08-21). Charts als eigenes SVG, keine Chart-Library. Kein Backend — reine Browser-App gegen die offene GeoSphere-API.

## Users

Tobi (IT-Consultant, Österreich) — persönliches Werkzeug. Situation: kurze, wiederholte Checks am Desktop, hell wie dunkel („wie viel hat es an Station X geregnet — gestern, letzte Woche, bei dem Unwetter?"). [Inferred aus Brief + Arbeitskontext: Einzelnutzer, kein Team, keine Mobile-Priorität — Desktop zuerst, responsive als Pflicht, nicht als Fokus.]

## Product Purpose

Kompaktes Dashboard über der GeoSphere Austria Dataset API (klima-v2-10min): Wetterstation per Dropdown wählbar, Zeitraum-Presets (24 h / 48 h / 7 Tage / 30 Tage) plus freier Datumsbereich für historische Ereignisse, Niederschlags-Graph in voller 10-Minuten-Auflösung als Zentrum, dazu Kompakt-Kennzahlen (Niederschlagssumme, maximale 10-min-Intensität, Temperatur) aus demselben Datenabruf. Erfolg: von Stationswahl zu ablesbarem Regenverlauf in unter fünf Sekunden. (Alle drei Scope-Entscheidungen user-confirmed 2026-08-21.)

## Positioning

Direkter Draht zu den amtlichen österreichischen 10-Minuten-Messdaten (1992 → heute, 475 aktive Stationen des GeoSphere-Messnetzes) — ohne Registrierung, ohne Backend, ohne Wetter-App-Beiwerk. Zeigt das Messnetz, nicht eine Prognose.

## Operating Context

- API: `https://dataset.api.hub.geosphere.at/v1/station/historical/klima-v2-10min` (+ `/metadata`). CORS offen (`Access-Control-Allow-Origin: *`), Antwortformat GeoJSON: `timestamps[]` + `features[0].properties.parameters.<p>.data[]`.
- Kernparameter: `rr` Niederschlagssumme (mm je 10 min), `tl` Lufttemperatur 2 m (°C); weitere verfügbar (`ffx`, `p`, `rf`, `sh`, `so`, …) samt Qualitätsflags (`*_flag`).
- Metadaten: 529 Stationen (475 aktiv) mit Name, Bundesland, Koordinaten, Seehöhe, Gültigkeitszeitraum.
- Zeitstempel UTC → Anzeige Europe/Vienna. Datenlatenz ca. 1–2 h hinter Echtzeit.
- Rate Limit der API ≈ 240 Requests/h: Abrufe bündeln (rr+tl in einem Request), Metadaten cachen.

## Capabilities and Constraints

- Zeitraum-Presets in voller 10-min-Auflösung; 30 Tage ≈ 4 320 Punkte pro Parameter — obere Grenze der v1-Darstellung. Längere Zeiträume sind bewusst nicht im Scope (user-confirmed); freier Datumsbereich ist auf ≤ 31 Tage begrenzt.
- v1 zeigt Messwerte ungefiltert (keine Qualitätsflag-Auswertung); Lücken/NULL-Werte werden als Lücken gezeigt, nie interpoliert.
- UI-Sprache Deutsch. Fachbegriffe der Meteorologie sind erwünscht (Niederschlagssumme, Spitzenböe), keine Verniedlichung.
- Erweiterbar: weitere Parameter-Ansichten sollen ohne Layout-Umbau andocken können.

## Brand Commitments

Kein Name, kein Logo vorgegeben; Arbeitstitel darf die Anwendung selbst setzen. [Inferred aus dokumentierten Nutzer-Präferenzen (doxlane): technisch-scharfe, präzise Anmutung; Light- und Dark-Mode gleichwertig; keine verspielte Consumer-Wetter-App-Optik.]

## Evidence on Hand

- Verifizierte API-Responses (Metadaten + Datenabruf Wien Hohe Warte, 2026-08-20/21) — Struktur und Einheiten bestätigt, nichts erfunden.
- Vollständige Stationsliste aus `/metadata` (wird zur Laufzeit geladen, nicht eingefroren).
- Es existieren keine Kunden, Zitate oder Benchmarks — Oberfläche macht keine derartigen Behauptungen.

## Product Principles

1. Die Messreihe ist der Held — Chrome tritt zurück, Daten dürfen laut sein.
2. Amtliche Präzision sichtbar machen: Einheiten, Zeitzone, Stationsmetadaten und Datenstand ehrlich ausweisen.
3. Jeder Wert ist auch ohne Hover erreichbar (Tabellen-Zwilling, direkte Labels).
4. Schnelle wiederholte Nutzung schlägt Feature-Fülle; Zustand bleibt zwischen Besuchen erhalten.
5. Lücken sind Information: fehlende Messwerte werden gezeigt, nie glattgezogen.

## Accessibility & Inclusion

Light + Dark vollwertig; Chartfarben CVD-validiert (dataviz-Validator); Controls tastaturbedienbar; Werte nie nur über Farbe codiert.
