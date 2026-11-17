// Erzeugt Browser-/App-Icons und je Seite ein Vorschaubild (WhatsApp, Facebook, LinkedIn …).
// Aufruf: node icons.js <capture.json> <theme-ordner (für Schriften/CSS)> <ausgabe>
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const [CAP, THEME, OUT] = process.argv.slice(2);
const cap = JSON.parse(fs.readFileSync(CAP, 'utf8'));
const app = fs.readFileSync(path.join(__dirname, 'app-icon.svg'), 'utf8');
fs.mkdirSync(path.join(OUT, 'icons'), { recursive: true }); fs.mkdirSync(path.join(OUT, 'og'), { recursive: true });
const square = app.replace('rx="96"', 'rx="0"');
const maskable = square.replace('translate(59.2 59.2) scale(0.8)', 'translate(92 92) scale(0.66)');
fs.writeFileSync(path.join(OUT, 'icons', 'favicon.svg'), app);

(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const shot = async (svg, size, file) => {
    await p.setViewportSize({ width: size, height: size });
    await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
    await p.screenshot({ path: path.join(OUT, 'icons', file), omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  };
  for (const s of [16, 32, 48]) await shot(app, s, `favicon-${s}.png`);
  await shot(square, 180, 'apple-touch-icon.png');
  await shot(app, 192, 'icon-192.png');
  await shot(app, 512, 'icon-512.png');
  await shot(maskable, 512, 'icon-maskable-512.png');

  // Vorschaubilder je Seite
  const brand = cap.chrome.header.match(/<a class="brand"[\s\S]*?<\/a>/)[0];
  const css = 'file://' + path.join(THEME, 'assets', 'site.css');
  await p.setViewportSize({ width: 1200, height: 630 });
  const kick = { leistung: 'Leistung', artikel: 'Ratgeber', region: 'Einsatzgebiet', ratgeber: 'Ratgeber' };
  for (const [k, v] of Object.entries(cap.routes)) {
    let title = (v.h1 || '').trim();
    if (k === 'start') title = 'Der Sache auf den Grund. <span>Für Sie auf den Punkt.</span>';
    const kicker = kick[v.page] || (k === 'start' ? 'Bausachverständiger für Münsterland und Ruhrgebiet' : '');
    const tpl = path.join(THEME, '_og.html');
    fs.writeFileSync(tpl, `<html><head><meta charset="utf-8"><link rel="stylesheet" href="${css}"><style>
      :root { --logo-ink:#fff; --logo-accent:#5aa2ea; --logo-accent-2:#3f86d2; }
      body { margin:0; width:1200px; height:630px; background:#0f1d2e; color:#fff; font-family:var(--font-head); overflow:hidden; position:relative; }
      .roof { position:absolute; right:-80px; bottom:-120px; width:760px; opacity:.07; } .roof path { fill:none; stroke:#fff; stroke-width:16; }
      .top { position:absolute; left:72px; top:64px; } .top .brand { gap:20px; } .top .brand-mark { height:78px; } .top .brand-text { padding-left:20px; } .top .brand-name { font-size:1.6rem; } .top .brand-sub { font-size:.95rem; }
      .main { position:absolute; left:72px; right:110px; top:220px; display:grid; gap:22px; }
      .k { font-weight:700; font-size:20px; letter-spacing:.18em; text-transform:uppercase; color:#5aa2ea; display:flex; align-items:center; gap:16px; }
      .k::before { content:""; width:40px; height:3px; background:#5aa2ea; }
      h1 { margin:0; font-size:${title.length > 60 ? 50 : 60}px; line-height:1.12; font-weight:800; letter-spacing:-.015em; text-wrap:balance; hyphens:manual; }
      h1 span { color:#5aa2ea; display:block; }
      .foot { position:absolute; left:72px; right:72px; bottom:52px; display:flex; justify-content:space-between; font-size:21px; color:#b6c4d5; font-weight:600; border-top:1px solid rgb(255 255 255 / .15); padding-top:22px; }
      .foot b { color:#fff; }
    </style></head><body>
      <svg class="roof" viewBox="0 0 600 300"><path d="M20 290 L300 40 L580 290"/></svg>
      <div class="top">${brand}</div>
      <div class="main">${kicker ? `<div class="k">${kicker}</div>` : ''}<h1>${title}</h1></div>
      <div class="foot"><span><b>bsv-niewerth.de</b> · Borken</span><span>TÜV-zertifizierter Sachverständiger für Schäden an Gebäuden</span></div>
    </body></html>`);
    await p.goto('file://' + tpl); await p.evaluate(() => document.fonts.ready); fs.unlinkSync(tpl);
    await p.screenshot({ path: path.join(OUT, 'og', k + '.jpg'), type: 'jpeg', quality: 86 });
  }
  await b.close();
  console.log('Icons und', Object.keys(cap.routes).length, 'Vorschaubilder erzeugt');
})();
