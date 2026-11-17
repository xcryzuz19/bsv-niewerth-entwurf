"""Erzeugt aus _quelle/startseite.html die eigenständige index.html für GitHub Pages."""
import base64, hashlib, io, os, re, sys, urllib.request
from PIL import Image

src_path, out_path = sys.argv[1], sys.argv[2]
src = open(src_path, encoding="utf-8").read()
src = src.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', "")
a = src.index("<style>")
b = src.index("</style>") + len("</style>")
head_bits, style, body = src[:a], src[a:b], src[b:]

html = f"""<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#0f1d2e">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:site_name" content="BSV Niewerth">
<meta property="og:title" content="BSV Niewerth – Bausachverständiger für Münsterland und Ruhrgebiet">
<meta property="og:description" content="Der Sache auf den Grund. Für Sie auf den Punkt. TÜV-zertifizierter Sachverständiger für Schäden an Gebäuden aus Borken.">
<meta property="og:image" content="https://xcryzuz19.github.io/bsv-niewerth-entwurf/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
{head_bits.strip()}
<style>
/* Grundeinstellungen, die in der Claude-Vorschau automatisch gesetzt werden */
html {{ background: #0f1d2e; -webkit-text-size-adjust: 100%; }}
body {{ margin: 0; }}
img {{ max-width: 100%; }}
[hidden] {{ display: none !important; }}
</style>
{style}
</head>
<body>
{body.strip()}
</body>
</html>
"""
out_dir = os.path.dirname(os.path.abspath(out_path))
img_dir = os.path.join(out_dir, "img"); os.makedirs(img_dir, exist_ok=True)

def to_webp(m):
    data = base64.b64decode(m.group(2))
    name = hashlib.sha1(data).hexdigest()[:12] + ".webp"
    path = os.path.join(img_dir, name)
    if not os.path.exists(path):
        Image.open(io.BytesIO(data)).save(path, "WEBP", quality=78 if m.group(1) == "jpeg" else 80, method=6)
    return "img/" + name
html = re.sub(r"data:image/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)", to_webp, html)

font_dir = os.path.join(out_dir, "fonts"); os.makedirs(font_dir, exist_ok=True)
cache = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts-cache"); os.makedirs(cache, exist_ok=True)
m = re.search(r'<link rel="stylesheet" href="(https://fonts\.googleapis\.com/css2[^"]+)">', html)
if m:
    css_cache = os.path.join(cache, "fonts.css")
    if not os.path.exists(css_cache):
        req = urllib.request.Request(m.group(1).replace("&amp;", "&"), headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"})
        open(css_cache, "w").write(urllib.request.urlopen(req).read().decode())
    css = open(css_cache).read()
    keep = []
    for subset, block in re.findall(r"/\* ([a-z-]+) \*/\s*(@font-face \{.*?\})", css, re.S):
        if subset not in ("latin", "latin-ext"): continue
        url = re.search(r"url\((https://[^)]+)\)", block).group(1)
        fn = hashlib.sha1(url.encode()).hexdigest()[:12] + ".woff2"
        cp = os.path.join(cache, fn)
        if not os.path.exists(cp):
            open(cp, "wb").write(urllib.request.urlopen(url).read())
        open(os.path.join(font_dir, fn), "wb").write(open(cp, "rb").read())
        keep.append(block.replace(url, "fonts/" + fn))
    html = html.replace('<link rel="preconnect" href="https://fonts.googleapis.com">\n', "")
    html = re.sub(r'<link rel="preconnect" href="https://fonts\.gstatic\.com"[^>]*>\n?', "", html)
    html = html.replace(m.group(0), "<style>\n" + "\n".join(keep) + "\n</style>")
hm = re.search(r'"hero": \{"src": "(img/[0-9a-f]{12}\.webp)"', html)
if hm:
    html = html.replace('<link rel="apple-touch-icon"', f'<link rel="preload" as="image" href="{hm.group(1)}" fetchpriority="high">\n<link rel="apple-touch-icon"', 1)
open(out_path, "w", encoding="utf-8").write(html)
