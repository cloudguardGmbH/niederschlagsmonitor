# Niederschlagsmonitor

Kompaktes Dashboard über der offenen [GeoSphere Austria Dataset API](https://data.hub.geosphere.at/dataset/klima-v2-10min) (klima-v2-10min): Niederschlag und Lufttemperatur aller aktiven österreichischen Wetterstationen in 10-Minuten-Auflösung, 1992 bis heute.

- **Station per Dropdown** — 303 aktive Stationen, nach Bundesland gruppiert, durchsuchbar, tastaturbedienbar
- **Niederschlags-Graph** — 10-min-Nadeln nach meteorologischen Intensitätsklassen, Anker-Annotation am Spitzenereignis, Kumulativ-Panel auf geteilter Zeitachse, Fadenkreuz-Ablesung (Maus + ←/→)
- **Zeiträume** — 24 h / 48 h / 7 Tage / 30 Tage plus freier Datumsbereich (≤ 31 Tage); lange Zeiträume werden ehrlich gebündelt angezeigt (Ausweis in der Statuszeile), Kennzahlen rechnen immer aus den Rohdaten
- **Tag-/Nacht-/Auto-Theme** (`?theme=light|dark` übersteuert), Zustand bleibt im localStorage erhalten
- Kein Backend: der Browser spricht direkt mit der GeoSphere-API (CORS offen)

Designsystem und Produktkontext sind im Repo dokumentiert: [DESIGN.md](DESIGN.md), [PRODUCT.md](PRODUCT.md).

## Entwicklung

```bash
npm install
npm run dev        # http://localhost:5180
npm run build      # Produktions-Build nach dist/
```

Stack: Vite 7 · React 19 · TypeScript · Tailwind CSS 4 · eigene SVG-Charts (keine Chart-Library) · B612 / B612 Mono (selbst gehostet).

## Hosting (Cloudflare Pages)

Reiner statischer Build, keine Umgebungsvariablen nötig:

| Einstellung | Wert |
|---|---|
| Framework-Preset | Vite |
| Build-Befehl | `npm run build` |
| Build-Ausgabeverzeichnis | `dist` |
| Node-Version | ≥ 20 (Standard passt) |

## Datenquelle

Messdaten: [GeoSphere Austria Data Hub](https://data.hub.geosphere.at/), Datensatz `klima-v2-10min`, Lizenz **CC BY 4.0** — die Quellenangabe ist in der Statuszeile der App eingebaut und bei Weiterverwendung beizubehalten. Intensitätsklassen (leicht/mäßig/stark/sehr stark) abgeleitet aus den Stundenklassen des Warnwesens (÷ 6 je 10-min-Intervall).
