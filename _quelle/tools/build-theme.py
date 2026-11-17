"""Baut aus der Vorschau (startseite.html + capture.json) das WordPress-Theme „bsv-niewerth“
und die Seiteninhalte für WordPress (wp/pages.json).

Aufruf: python3 -I build-theme.py <startseite.html> <capture.json> <ausgabe-ordner>
"""
import base64, hashlib, io, json, os, re, shutil, sys, zipfile
from PIL import Image

SRC, CAP, OUT = sys.argv[1:4]
VERSION = "1.0." + __import__("time").strftime("%y%m%d%H%M")
THEME = "bsv-niewerth"
TDIR = os.path.join(OUT, THEME)
ASSET_URL = f"/wp-content/themes/{THEME}/assets/"
shutil.rmtree(TDIR, ignore_errors=True)
for d in ("assets/img", "assets/fonts", "inc"):
    os.makedirs(os.path.join(TDIR, d), exist_ok=True)

src = open(SRC, encoding="utf-8").read()
cap = json.load(open(CAP, encoding="utf-8"))
R = cap["routes"]
LEISTUNG_KEYS = [k for k, v in R.items() if v["page"] == "leistung"]

def url(k):
    if k == "start": return "/"
    if k in LEISTUNG_KEYS: return f"/leistungen/{k}/"
    if k.startswith("ratgeber-"): return f"/ratgeber/{k[len('ratgeber-'):]}/"
    return f"/{k}/"
URLS = {k: url(k) for k in R}

# ---------- Bilder: eingebettete Daten -> WebP-Dateien im Theme ----------
def data_to_file(m):
    data = base64.b64decode(m.group(2))
    name = hashlib.sha1(data).hexdigest()[:12] + ".webp"
    path = os.path.join(TDIR, "assets/img", name)
    if not os.path.exists(path):
        Image.open(io.BytesIO(data)).save(path, "WEBP", quality=80, method=6)
    return ASSET_URL + "img/" + name
DATA_RE = re.compile(r"data:image/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)")

def links(html, here=None):
    def rep(m):
        k = m.group(2)
        if k in URLS: return f'{m.group(1)}href="{URLS[k]}"'
        return m.group(0)
    html = re.sub(r'(<a\b[^>]*?\s)href="#([a-z0-9-]+)"', rep, html)
    return html

def fix(html):
    return links(DATA_RE.sub(data_to_file, html))

# ---------- CSS ----------
css = src[src.index("<style>") + 7: src.index("</style>")]
fonts_css = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts-cache", "fonts.css")).read()
faces = []
for subset, block in re.findall(r"/\* ([a-z-]+) \*/\s*(@font-face \{.*?\})", fonts_css, re.S):
    if subset not in ("latin", "latin-ext"): continue
    u = re.search(r"url\((https://[^)]+)\)", block).group(1)
    fn = hashlib.sha1(u.encode()).hexdigest()[:12] + ".woff2"
    shutil.copy(os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts-cache", fn), os.path.join(TDIR, "assets/fonts", fn))
    faces.append(block.replace(u, "fonts/" + fn))
extra_css = """
/* WordPress */
html { background: #0f1d2e; -webkit-text-size-adjust: 100%; }
body { margin: 0; }
img { max-width: 100%; }
body.admin-bar .site-header { top: var(--wp-admin--admin-bar--height, 0px); }
.cu-arrive .curtain { transform: none; }
.cu-arrive .curtain svg { opacity: 1; }
.cu-arrive .curtain path { stroke-dashoffset: 0; }
.hp { position: absolute !important; left: -9999px !important; width: 1px; height: 1px; overflow: hidden; }
.form-msg.ok { color: #1b6b3a; font-weight: 600; }
.form-msg.err { color: #a12a2a; font-weight: 600; }
button[disabled] { opacity: .7; cursor: wait; }
.wp-prose { max-width: 48rem; display: grid; gap: 16px; }
.wp-prose h2 { font-size: 1.5rem; margin-top: 18px; }
.wp-prose h3 { font-size: 1.2rem; margin-top: 10px; }
.wp-prose p, .wp-prose li { color: #2c3a4f; font-size: 1.08rem; }
.wp-prose img { height: auto; border-radius: var(--r); }
.wp-prose ul, .wp-prose ol { padding-left: 1.2em; display: grid; gap: 6px; }
"""
open(os.path.join(TDIR, "assets/site.css"), "w", encoding="utf-8").write("\n".join(faces) + "\n" + DATA_RE.sub(data_to_file, css) + extra_css)

# ---------- JavaScript ----------
a = src.index("<script>", src.index('<script type="application/ld+json">')) + 8
js = src[a: src.index("</script>", a)]
js = DATA_RE.sub(lambda m: data_to_file(m), js)
# Bildpfade im Fotoverzeichnis (PHOTOS) bleiben absolute Theme-Pfade
def cut(s, start, end, new):
    i = s.index(start); j = s.index(end, i)
    return s[:i] + new + s[j:]
# Router der Vorschau entfernen (WordPress liefert echte Seiten)
js = cut(js, "/* Seitenwechsel (in WordPress echte Seiten) */", "/* Situationsbezogene Schaltflächen", "")
js = cut(js, "/* Link auf die gerade offene Seite", 'document.getElementById("f-file")', "/*__NAV__*/\n\n")
js = js.replace('if ((location.hash.slice(1) || "start") === "kontakt") {', 'try { sessionStorage.setItem("bsvAnliegen", JSON.stringify(pendingAnliegen)); } catch (_) {}\n  if (BSV.route === "kontakt") {')
js = js.replace("""if (e.target.closest('a[href="#kontakt"]')) pendingAnliegen = null; return; }""",
                """if (e.target.closest('a[href="#kontakt"], a[href$="/kontakt/"]')) { pendingAnliegen = null; try { sessionStorage.removeItem("bsvAnliegen"); } catch (_) {} } return; }""")
js = cut(js, 'document.getElementById("kontaktformular").addEventListener("submit"', "/* ---------- Hero:", r'''(function () {
  const form = document.getElementById("kontaktformular"); if (!form) return;
  const ts = form.querySelector('[name="ts"]'); if (ts) ts.value = Math.floor(Date.now() / 1000);
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const msg = document.getElementById("form-msg"), btn = form.querySelector('button[type="submit"]');
    msg.classList.remove("ok", "err");
    if (!form.reportValidity()) return;
    const old = btn.innerHTML; btn.disabled = true; btn.textContent = "Wird gesendet …";
    try {
      const r = await fetch(BSV.rest, { method: "POST", body: new FormData(form), credentials: "same-origin" });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.message || "");
      form.reset(); if (ts) ts.value = Math.floor(Date.now() / 1000);
      document.getElementById("f-file-txt").textContent = "Fotos auswählen";
      msg.textContent = "Vielen Dank, Ihre Anfrage ist angekommen. Ich melde mich kurzfristig bei Ihnen."; msg.classList.add("ok");
    } catch (err) {
      msg.textContent = (err.message ? err.message + " " : "Das hat leider nicht geklappt. ") + "Sie erreichen mich auch telefonisch unter 0179 6933684."; msg.classList.add("err");
    }
    btn.disabled = false; btn.innerHTML = old;
  });
})();

''')
NAV = r'''/* Seitenwechsel in WordPress: Vorhang, dann echte Seite laden */
(function () {
  const c = document.getElementById("curtain"), root = document.documentElement, U = BSV.urls;
  const fix = scope => scope.querySelectorAll && scope.querySelectorAll('a[href^="#"]').forEach(a => {
    const k = a.getAttribute("href").slice(1); if (U[k]) a.setAttribute("href", U[k]);
  });
  fix(document);
  new MutationObserver(ms => ms.forEach(m => fix(m.target))).observe(document.body, { childList: true, subtree: true });
  if (root.classList.contains("cu-arrive")) requestAnimationFrame(() => requestAnimationFrame(() => {
    root.classList.remove("cu-arrive"); c.classList.add("leave"); setTimeout(() => c.classList.remove("leave"), 1100);
  }));
  document.addEventListener("click", e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest("a[href]"); if (!a || a.target || a.hasAttribute("download")) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || /^\/wp-(admin|login|content|json)/.test(u.pathname)) return;
    if (u.pathname === location.pathname) {
      if (u.hash && u.hash.length > 1) return;
      e.preventDefault(); scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" }); return;
    }
    if (REDUCED) return;
    e.preventDefault();
    try { sessionStorage.setItem("bsvNav", "1"); } catch (_) {}
    c.classList.remove("leave"); c.classList.add("cover");
    setTimeout(() => { location.href = u.href; }, 950);
  });
  addEventListener("pageshow", e => { if (e.persisted) { c.classList.remove("cover", "leave"); root.classList.remove("cu-arrive"); } });
  document.querySelectorAll("[data-nav]").forEach(a => { if (a.dataset.nav === BSV.nav) a.setAttribute("aria-current", "page"); });
  if (BSV.route === "kontakt") {
    try {
      const s = sessionStorage.getItem("bsvAnliegen"); sessionStorage.removeItem("bsvAnliegen");
      if (s) { pendingAnliegen = JSON.parse(s); if (applyAnliegen()) setTimeout(() => document.getElementById("kontaktformular").scrollIntoView(), 60); }
    } catch (_) {}
  }
  applyReveal(document);
})();
'''
js = js.replace("/*__NAV__*/", NAV)
# Elemente, die es nur auf einzelnen Seiten gibt: fehlende Elemente ersetzt ein leerer Platzhalter
js = js.replace("document.getElementById(", "$id(")
js = 'const $id = id => document.getElementById(id) || document.createElement("div");\n' + js
js = js.replace('const h1 = document.querySelector(".hero h1");', 'const h1 = document.querySelector(".hero h1"); if (!h1) return;')
# Startseite: Intro nur dort, sonst sofort Hero/Seite aufbauen
open(os.path.join(TDIR, "assets/site.js"), "w", encoding="utf-8").write(js)

# ---------- Seiteninhalte ----------
pages = {}
for k, v in R.items():
    html = fix(v["html"])
    if k == "kontakt":
        html = html.replace('name="fotos" type="file"', 'name="fotos[]" type="file"')
        html = html.replace('<input id="f-ds" type="checkbox" required="">', '<input id="f-ds" name="einwilligung" value="ja" type="checkbox" required="">')
        html = html.replace('<form id="kontaktformular" novalidate="">', '<form id="kontaktformular" novalidate="" enctype="multipart/form-data"><div class="hp" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><input type="hidden" name="ts" value="">')
        assert 'name="fotos[]"' in html and 'name="einwilligung"' in html and 'name="website"' in html
    pages[k] = {"url": URLS[k], "title": v["name"].strip(), "content": "<!-- wp:html -->\n" + html.strip() + "\n<!-- /wp:html -->"}
os.makedirs(os.path.join(OUT, "wp"), exist_ok=True)
json.dump(pages, open(os.path.join(OUT, "wp", "pages.json"), "w", encoding="utf-8"), ensure_ascii=False)

# ---------- Routen-Daten fürs Theme ----------
routes = {}
for k, v in R.items():
    routes[k] = {"page": v["page"], "title": v["title"], "desc": v["desc"], "ld": v["ld"], "nav": v["nav"], "kb": v["kb"], "url": URLS[k]}
hero = re.search(r'"hero": \{"src": "([^"]+)"', js)
json.dump({"routes": routes, "ld": cap["chrome"]["ldStatic"].strip(), "urls": URLS, "hero": hero.group(1) if hero else ""}, open(os.path.join(TDIR, "inc/routes.json"), "w", encoding="utf-8"), ensure_ascii=False)

# ---------- Rahmen (Kopf/Fuß) ----------
ch = {k: fix(v) for k, v in cap["chrome"].items() if k != "ldStatic"}
favicon = re.search(r'<link rel="icon"[^>]*>', src).group(0)
kb = ch["kontaktband"]
kb = kb.replace('<h2 id="kb-h">Klarheit beginnt mit einem Gespräch.</h2>', '<h2 id="kb-h"><?php echo esc_html($kb["h"]); ?></h2>')
kb = kb.replace('<p id="kb-p">Schildern Sie mir Ihr Anliegen. Ich freue mich auf Ihre Anfrage.</p>', '<p id="kb-p"><?php echo esc_html($kb["p"]); ?></p>')
kb = kb.replace('id="kb-cta"', 'id="kb-cta"<?php if (!empty($kb["thema"])) echo \' data-thema="\' . esc_attr($kb["thema"]) . \'"\'; ?>')
kb = kb.replace('<b id="kb-b">Anfrage senden</b>', '<b id="kb-b"><?php echo esc_html($kb["b"]); ?></b>')
kb = kb.replace('<small id="kb-s">info@bsv-niewerth.de</small>', '<small id="kb-s"><?php echo esc_html($kb["s"]); ?></small>')
assert kb.count("<?php") == 5, kb[:400]

header = f'''<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0f1d2e">
{favicon}
<link rel="apple-touch-icon" href="<?php echo esc_url(get_template_directory_uri() . '/assets/apple-touch-icon.png'); ?>">
<script>(function(){{var r=document.documentElement,n=null;try{{n=sessionStorage.getItem("bsvNav");sessionStorage.removeItem("bsvNav")}}catch(e){{}}if(n&&!matchMedia("(prefers-reduced-motion: reduce)").matches)r.classList.add("cu-arrive");<?php if (bsv_route_key() === 'start') : ?>if(!n)r.classList.add("intro-on");<?php endif; ?>}})();</script>
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?> data-route="<?php echo esc_attr(bsv_route_key() ?: 'seite'); ?>">
<?php wp_body_open(); ?>
{ch["sprite"]}
<?php if (bsv_route_key() === 'start') : ?>
{ch["intro"]}
<?php endif; ?>
{ch["curtain"]}
{ch["header"]}
{ch["mnav"]}
<main id="inhalt">
'''
footer = f'''</main>
{ch["zoom"]}
<?php $kb = bsv_kontaktband(); if ($kb) : ?>
{kb}
<?php endif; ?>
{ch["footer"]}
{ch["callbar"]}
<?php wp_footer(); ?>
</body>
</html>
'''
open(os.path.join(TDIR, "header.php"), "w", encoding="utf-8").write(header)
open(os.path.join(TDIR, "footer.php"), "w", encoding="utf-8").write(footer)

# Statische Dateien
here = os.path.dirname(os.path.abspath(__file__))
pages_root = os.path.dirname(os.path.dirname(here))
for f in ("apple-touch-icon.png", "og-image.jpg"):
    shutil.copy(os.path.join(pages_root, f), os.path.join(TDIR, "assets", f))
for f in os.listdir(os.path.join(here, "theme-php")):
    t = open(os.path.join(here, "theme-php", f), encoding="utf-8").read().replace("{{VERSION}}", VERSION)
    open(os.path.join(TDIR, f), "w", encoding="utf-8").write(t)
Image.open(os.path.join(pages_root, "og-image.jpg")).convert("RGB").resize((1200, 900)).save(os.path.join(TDIR, "screenshot.png"))

zp = os.path.join(OUT, "wp", THEME + ".zip")
with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED) as z:
    for root, _, files in os.walk(TDIR):
        for f in files:
            p = os.path.join(root, f)
            z.write(p, os.path.relpath(p, OUT))
print("Theme", VERSION, "->", zp, os.path.getsize(zp) // 1024, "KB;", len(pages), "Seiten")
