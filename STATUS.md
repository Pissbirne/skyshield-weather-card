# Stand & offene Punkte — Stand 15.11.2026, abends

Karte läuft zu Hause im Dashboard (Sektion „Wetter", Ansicht „Übersicht" von `dashboard-neu`).

## Wo was liegt

| Was | Wo |
|---|---|
| Karte (Quelle) | `C:\Users\dirkk\skyshield-weather-card.js` |
| Repo-Kopie | `C:\Users\dirkk\skyshield-weather-card-repo\` (JS, README, LICENSE, hacs.json) |
| Auf HA | `/config/www/community/skyshield-weather-card/skyshield-weather-card.js` |
| Ressource | `/local/community/skyshield-weather-card/skyshield-weather-card.js?cb=<ts>` |
| GitHub | https://github.com/Pissbirne/skyshield-weather-card (public, main, **kein** Release/Tag) |

Hash-Vergleich vor Änderungen: `sha256sum` lokal vs. `ssh ha 'sha256sum …'` muss gleich sein.

## Offen für morgen

1. **Repo-Stand glätten.** `git push` über HTTPS hängt auf diesem Rechner (Timeout, kein Fehler); die Dateien
   wurden per GitHub-API committet → Remote hat 4 Einzel-Commits, lokal einen anderen Commit.
   Lösung: SSH-Key für GitHub einrichten ODER frisch klonen und von dort pflegen.
   Danach README-Ergänzung (`show_rain_bars`) mit hochziehen — lokal schon drin, remote noch nicht.
2. **Testansicht löschen:** `/dashboard-neu/wettertest` (zwei Karten) ist redundant.
3. **Erst bei echtem Release:** `version` in `hacs.json`, Git-Tag/Release, README-Screenshots
   (Haustheme, englische Texte), Marketplace-/HACS-Eintrag.

## Fallen, die schon Geld gekostet haben

- Canvas nie per Inline-Pixelgröße aus dem eigenen Parent-Rect setzen (Rückkopplung → riesige Karte, hängender Renderer).
- Beim Löschen eines Blocks aus CSS/JS Vollständigkeit prüfen, nicht nur Abwesenheit (ein zu großer Schnitt
  hat einmal das halbe Basis-CSS erwischt → Karte 1161 px hoch).
- Zeichenschleife über `setInterval` + Watchdog (rAF stirbt beim Ansichtswechsel; `hass` kommt danach oft nicht mehr).
- Zoom-Erlaubnis über `visualViewport` prüfen, nicht `innerWidth` (Handy meldet sonst 980 px im Hochformat).
- In der Großansicht scrollt der Inhalt über dem stehenden Himmel, nicht die Karte selbst.

Ausführlich in der Skill-Doku `ha-minimal-custom-card` (Abschnitt „Lessons from a canvas card…").
