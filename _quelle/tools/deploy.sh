#!/bin/bash
# Veröffentlicht Änderungen auf bsv-niewerth.de:
#   1. Ansichten erfassen, Theme + Seiten bauen   2. ins Repo pushen
#   3. Theme per Selbst-Update einspielen (mit Prüfsumme)   4. Seiteninhalte aktualisieren   5. Cache leeren
set -e
T=$(cd "$(dirname "$0")" && pwd); R=$(dirname "$(dirname "$T")"); B=${BUILD:-/tmp/bsv-build}
node "$T/capture.js" "$R/_quelle/startseite.html" "$R/_quelle/capture.json"
python3 -I "$T/build-theme.py" "$R/_quelle/startseite.html" "$R/_quelle/capture.json" "$B"
if [ "$1" = "--assets" ]; then   # Icons, Vorschaubilder und PDF-Checklisten neu erzeugen
  node "$T/icons.js" "$R/_quelle/capture.json" "$B/bsv-niewerth" "$T/generated"
  node "$T/pdfs.js" "$R/_quelle/startseite.html" "$B/bsv-niewerth" "$T/generated"
  python3 -I "$T/build-theme.py" "$R/_quelle/startseite.html" "$R/_quelle/capture.json" "$B"
fi
cp "$B"/wp/* "$R/wp/"
(cd "$R" && rm -rf img fonts && python3 -I _quelle/tools/build-pages.py _quelle/startseite.html index.html)
(cd "$R" && git add -A && git commit -q -m "Website aktualisiert" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_01Mx3ei1EwYhN1MS9w2UXGQr" && git push -q origin main) || true
sleep 5
curl -sS -m 300 -X POST https://bsv-niewerth.de/wp-json/bsv/v1/update -H "Content-Type: application/json" -d "{\"sha256\":\"$(cat "$R/wp/bsv-niewerth.sha256")\"}"; echo
python3 -I "$T/wp-pages.py" "$R/wp/pages.json" auto "$R/_quelle/wp-page-ids.json"
curl -sS -m 60 -X POST https://bsv-niewerth.de/wp-json/wp-super-cache/v1/cache -H "Content-Type: application/json" -d '{"all":true}'; echo
