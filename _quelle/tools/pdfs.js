// Erzeugt alle Checklisten (CHECKLISTEN in startseite.html) als PDF (A4).
// Aufruf: node pdfs.js <startseite.html> <theme-ordner (Schriften/CSS)> <ausgabe>
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const [SRC, THEME, OUT] = process.argv.slice(2).map(x => path.resolve(x));
fs.mkdirSync(path.join(OUT, 'pdf'), { recursive: true });
const plain = h => h.replace(/<[^>]+>/g, '');
const table = (cols, rows, widths = []) => `<table><tr>${cols.map((c, i) => `<th${widths[i] ? ` style="width:${widths[i]}"` : ''}>${c}</th>`).join('')}</tr>${rows.map(r => `<tr>${cols.map((_, i) => `<td>${r[i] || ''}</td>`).join('')}</tr>`).join('')}</table>`;
const empty = n => Array.from({ length: n }, () => []);
const EXTRA = {
  notes: () => `<section class="tab"><h2>Notizen</h2><div class="lines">${'<i></i>'.repeat(9)}</div></section>`,
  maengel: () => `<section class="tab"><h2>Mängel für das Protokoll</h2>${table(['Nr.', 'Ort', 'Beschreibung des Mangels', 'Frist'], empty(9), ['30px', '110px', '', '70px'])}</section>`,
  neubau: () => `<section class="tab"><h2>Meine Prüftermine</h2>${table(['Prüftermin', 'geplant am', 'geprüft am', 'Ergebnis / Auffälligkeiten'], ['Bodenplatte und Abdichtung', 'Rohbau', 'Dach', 'Vor dem Verputzen', 'Vor dem Estrich', 'Abnahme'].map(x => [x]).concat(empty(2)), ['150px', '72px', '72px', ''])}</section>`,
  riss: () => `<section class="tab"><h2>Messungen</h2>${table(['Datum', 'Stelle', 'Breite (mm)', 'Länge (cm)', 'Foto-Nr.', 'Bemerkung'], empty(14), ['62px', '150px', '62px', '62px', '50px', ''])}</section>`,
  klima: () => `<section class="tab"><h2>Protokoll</h2>${table(['Datum', 'Uhrzeit', 'Raum', 'Temp. °C', 'Feuchte %', 'gelüftet (Min.)', 'Bemerkung'], empty(30), ['58px', '46px', '82px', '48px', '52px', '56px', ''])}</section>`,
  wasser: () => `<section class="tab"><h2>Wichtige Kontakte</h2><div class="contacts"><div><b>Versicherung</b><span>Telefon</span><span>Versicherungsnummer</span><span>Schadennummer</span></div><div><b>Vermieter / Hausverwaltung</b><span>Name</span><span>Telefon</span></div><div><b>Installateur</b><span>Name</span><span>Telefon</span></div><div><b>Sachverständiger / Leckageortung</b><em>André Niewerth · 0179 6933684</em><em>info@bsv-niewerth.de</em></div></div></section>`
};
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + SRC + '#start'); await p.waitForTimeout(3000);
  const list = await p.evaluate(() => CHECKLISTEN.map(c => ({ ...c, secs: c.secs() })));
  const brand = await p.evaluate(() => document.querySelector('header .brand').outerHTML);
  for (const c of list) {
    const blocks = c.secs.map(([h, items]) => `<section><h2>${plain(h)}</h2><ul>${items.map(i => `<li><span class="box"></span><span>${i}</span></li>`).join('')}</ul></section>`).join('');
    const html = `<html><head><meta charset="utf-8"><title>${c.title} – BSV Niewerth</title><link rel="stylesheet" href="file://${THEME}/assets/site.css"><style>
      html { background:#fff !important; }
      :root { --logo-ink:#12305b; --logo-accent:#2f78c4; --logo-accent-2:#1f5ea6; }
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
      section.tab { break-inside:auto; }
      h2 { font-size:11.5pt; color:#12305b; margin:0 0 6px; padding-bottom:3px; border-bottom:1px solid #d9e0e8; }
      ul { list-style:none; padding:0; margin:0; display:grid; gap:4px; }
      li { display:grid; grid-template-columns:14px 1fr; gap:8px; align-items:start; }
      .box { width:11px; height:11px; border:1.4px solid #12305b; border-radius:2px; margin-top:2px; }
      .lines i { display:block; border-bottom:1px solid #c9d3de; height:22px; }
      table { width:100%; border-collapse:collapse; font-size:9pt; } th { text-align:left; background:#eef2f6; font-family:var(--font-head); font-size:7.5pt; }
      th, td { border:1px solid #c9d3de; padding:4px 6px; height:21px; } tr { break-inside:avoid; }
      .contacts { display:grid; grid-template-columns:1fr 1fr; gap:10px 18px; }
      .contacts div { display:grid; gap:2px; border:1px solid #d9e0e8; border-radius:4px; padding:8px 10px; }
      .contacts b { font-family:var(--font-head); color:#12305b; font-size:9pt; }
      .contacts span { border-bottom:1px solid #9aa6b5; padding-top:14px; font-size:7pt; color:#586579; }
      .contacts em { font-style:normal; font-weight:600; font-size:9.5pt; }
      .cta { margin-top:14px; border:1px solid #d9e0e8; border-radius:4px; padding:10px 12px; display:flex; justify-content:space-between; gap:16px; break-inside:avoid; font-size:9.5pt; }
      .cta b { font-family:var(--font-head); color:#12305b; display:block; }
    </style></head><body>
      <div class="top">${brand}<small>Checkliste zum Ausdrucken</small></div>
      <h1>${c.title}</h1>
      <div class="kurz">${c.text}</div>
      <div class="fields">${c.fields.map(f => `<span>${f}</span>`).join('')}</div>
      ${blocks}${EXTRA[c.extra]()}
      ${c.extra === 'wasser' ? '' : `<div class="cta"><div><b>Fragen dazu? Ich helfe Ihnen gern.</b>André Niewerth, Sachverständiger für Schäden an Gebäuden (persCert TÜV Rheinland), Maurer- und Stahlbetonbauermeister</div><div style="text-align:right;white-space:nowrap"><b>0179 6933684</b>info@bsv-niewerth.de<br>bsv-niewerth.de</div></div>`}
    </body></html>`;
    const tpl = path.join(THEME, '_pdf.html'); fs.writeFileSync(tpl, html);
    await p.goto('file://' + tpl); await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: path.join(OUT, 'pdf', c.file), format: 'A4', printBackground: true, margin: { top: '16mm', bottom: '18mm', left: '15mm', right: '15mm' },
      displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="font-size:7pt;color:#8a96a6;width:100%;padding:0 15mm;display:flex;justify-content:space-between;font-family:sans-serif"><span>BSV Niewerth · Bau-Sachverständigenbüro · Propst-Pricking-Str. 16 · 46325 Borken · bsv-niewerth.de</span><span>Seite <span class="pageNumber"></span> von <span class="totalPages"></span></span></div>' });
    fs.unlinkSync(tpl);
  }
  await b.close(); console.log(list.length, 'PDFs erzeugt');
})();
