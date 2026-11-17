// Erzeugt die Checklisten als PDF (A4) aus den Ratgeber-Inhalten der Vorschau.
// Aufruf: node pdfs.js <startseite.html> <theme-ordner (Schriften/CSS)> <ausgabe>
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const [SRC, THEME, OUT] = process.argv.slice(2).map(x => path.resolve(x));
fs.mkdirSync(path.join(OUT, 'pdf'), { recursive: true });
const plain = h => h.replace(/<[^>]+>/g, '');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + SRC + '#start'); await p.waitForTimeout(3000);
  const arts = await p.evaluate(() => RATGEBER.filter(a => a.pdf).map(a => ({ pdf: a.pdf, h1: a.h1, kurz: a.kurz, slug: a.slug, secs: a.secs })));
  const brand = await p.evaluate(() => document.querySelector('header .brand').outerHTML);
  for (const a of arts) {
    const isAbn = a.slug.includes('abnahme');
    const blocks = a.secs.map(([h, items]) => {
      const lists = items.filter(Array.isArray);
      if (!lists.length || /^Was bedeutet/.test(h)) return '';
      return `<section><h2>${plain(h)}</h2><ul>${lists.flat().map(i => `<li><span class="box"></span><span>${i}</span></li>`).join('')}</ul></section>`;
    }).join('');
    const head = isAbn
      ? `<div class="fields"><span>Bauvorhaben</span><span>Datum der Abnahme</span><span>Teilnehmer</span></div>`
      : `<div class="fields"><span>Objekt / Adresse</span><span>Datum der Besichtigung</span><span>Baujahr</span></div>`;
    const extra = isAbn
      ? `<section class="tab"><h2>Mängel für das Protokoll</h2><table><tr><th>Nr.</th><th>Ort</th><th>Beschreibung des Mangels</th><th>Frist</th></tr>${'<tr><td></td><td></td><td></td><td></td></tr>'.repeat(9)}</table></section>`
      : `<section class="tab"><h2>Notizen</h2><div class="lines">${'<i></i>'.repeat(9)}</div></section>`;
    const html = `<html><head><meta charset="utf-8"><link rel="stylesheet" href="file://${THEME}/assets/site.css"><style>
      @page { size: A4; margin: 16mm 15mm 18mm; }
      :root { --logo-ink:#12305b; --logo-accent:#2f78c4; --logo-accent-2:#1f5ea6; }
      html { background:#fff !important; }
      body { margin:0; background:#fff; color:#14233a; font-family:var(--font-body); font-size:10.5pt; line-height:1.4; padding:0 !important; }
      body::before { display:none; }
      .top { display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #12305b; padding-bottom:10px; }
      .top .brand { color:#12305b; } .top .brand-mark { height:44px; } .top .brand-name { color:#454e58; } .top .brand-sub { color:#586579; } .top .brand-text { border-left-color:#c9d3de; }
      .top small { font-family:var(--font-head); font-weight:700; font-size:8pt; letter-spacing:.14em; text-transform:uppercase; color:#1f5ea6; }
      h1 { font-size:21pt; margin:14px 0 6px; color:#12305b; letter-spacing:-.01em; }
      .kurz { background:#e6eff9; border-left:4px solid #1f5ea6; padding:8px 12px; font-size:9.5pt; margin-bottom:10px; }
      .fields { display:grid; grid-template-columns:1.6fr 1fr 1fr; gap:14px; margin:12px 0 4px; }
      .fields span { border-bottom:1px solid #9aa6b5; padding-top:18px; font-size:7.5pt; color:#586579; }
      section { break-inside:avoid; margin-top:12px; }
      h2 { font-size:11.5pt; color:#12305b; margin:0 0 6px; padding-bottom:3px; border-bottom:1px solid #d9e0e8; }
      ul { list-style:none; padding:0; margin:0; display:grid; gap:4px; }
      li { display:grid; grid-template-columns:14px 1fr; gap:8px; align-items:start; }
      .box { width:11px; height:11px; border:1.4px solid #12305b; border-radius:2px; margin-top:2px; }
      .lines i { display:block; border-bottom:1px solid #c9d3de; height:22px; }
      table { width:100%; border-collapse:collapse; font-size:9pt; } th { text-align:left; background:#eef2f6; font-family:var(--font-head); font-size:8pt; }
      th, td { border:1px solid #c9d3de; padding:5px 6px; height:22px; } th:first-child { width:30px; } th:last-child { width:70px; } th:nth-child(2) { width:110px; }
      .cta { margin-top:14px; border:1px solid #d9e0e8; border-radius:4px; padding:10px 12px; display:flex; justify-content:space-between; gap:16px; break-inside:avoid; font-size:9.5pt; }
      .cta b { font-family:var(--font-head); color:#12305b; display:block; }
    </style></head><body>
      <div class="top">${brand}<small>Checkliste zum Ausdrucken</small></div>
      <h1>${a.h1}</h1>
      <div class="kurz">${a.kurz}</div>
      ${head}${blocks}${extra}
      <div class="cta"><div><b>Unsicher? Ich komme mit.</b>André Niewerth, Sachverständiger für Schäden an Gebäuden (persCert TÜV Rheinland), Maurer- und Stahlbetonbauermeister</div><div style="text-align:right;white-space:nowrap"><b>0179 6933684</b>info@bsv-niewerth.de<br>bsv-niewerth.de</div></div>
    </body></html>`;
    const tpl = path.join(THEME, '_pdf.html'); fs.writeFileSync(tpl, html);
    await p.goto('file://' + tpl); await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: path.join(OUT, 'pdf', a.pdf), format: 'A4', printBackground: true, margin: { top: '16mm', bottom: '18mm', left: '15mm', right: '15mm' },
      displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="font-size:7pt;color:#8a96a6;width:100%;padding:0 15mm;display:flex;justify-content:space-between;font-family:sans-serif"><span>BSV Niewerth · Bau-Sachverständigenbüro · Propst-Pricking-Str. 16 · 46325 Borken</span><span>Seite <span class="pageNumber"></span> von <span class="totalPages"></span></span></div>' });
    fs.unlinkSync(tpl);
  }
  await b.close(); console.log(arts.length, 'PDFs erzeugt');
})();
