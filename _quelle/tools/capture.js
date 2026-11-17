// Rendert jede Ansicht der Vorschau und speichert das fertige HTML (für WordPress-Seiten und Theme-Rahmen).
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const [src, out] = process.argv.slice(2).map(x => require('path').resolve(x));
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + src + '#start'); await p.waitForTimeout(5000);
  await p.evaluate(() => {
    window.__clean = el => {
      const c = el.cloneNode(true);
      const all = [c, ...c.querySelectorAll('*')];
      for (const n of all) {
        if (n.classList) {
          const wasReveal = n.classList.contains('reveal');
          ['reveal', 'in', 'reveal-img', 'swap', 'has-img', 'done', 'scrolled'].forEach(k => n.classList.remove(k));
          if (n.getAttribute('class') === '') n.removeAttribute('class');
          if (wasReveal && n.style) { n.style.removeProperty('--d'); if (!n.getAttribute('style')) n.removeAttribute('style'); }
        }
        if (n.hasAttribute && n.hasAttribute('data-done')) {
          n.removeAttribute('data-done'); n.style.removeProperty('background-image');
          if (!n.getAttribute('style')) n.removeAttribute('style');
          if ((n.getAttribute('aria-label') || '').startsWith('Beispielfoto')) { n.removeAttribute('aria-label'); n.removeAttribute('role'); }
        }
      }
      c.querySelectorAll('#stars, #win').forEach(x => x.innerHTML = '');
      c.querySelectorAll('[data-ready]').forEach(x => x.removeAttribute('data-ready'));
      c.querySelectorAll('.tool-out').forEach(x => { x.innerHTML = ''; x.className = 'tool-out'; });
      c.querySelectorAll('[aria-current]').forEach(x => x.removeAttribute('aria-current'));
      return c.outerHTML;
    };
  });
  const chrome = await p.evaluate(() => ({
    sprite: __clean(document.querySelector('body > svg')),
    intro: __clean(document.getElementById('bsv-intro')),
    curtain: __clean(document.getElementById('curtain')),
    header: __clean(document.querySelector('header.site-header')),
    mnav: __clean(document.getElementById('mnav')),
    zoom: __clean(document.getElementById('zoom')),
    kontaktband: __clean(document.getElementById('kontaktband')),
    footer: __clean(document.querySelector('footer.site-footer')),
    callbar: __clean(document.querySelector('.callbar')),
    ldStatic: document.querySelector('script[type="application/ld+json"]:not(#ld-page)').textContent
  }));
  const keys = await p.evaluate(() => ['start', 'leistungen', ...LEISTUNGEN.map(l => l.slug), 'ueber-mich', 'kontakt', 'impressum', 'datenschutz', 'ratgeber', ...RATGEBER.map(a => a.slug), ...REGIONEN.map(r => r.slug)]);
  const routes = {};
  for (const k of keys) {
    await p.evaluate(k => { location.hash = k; }, k); await p.waitForTimeout(400);
    routes[k] = await p.evaluate(k => {
      const l = LEISTUNGEN.find(x => x.slug === k), rg = REGIONEN.find(x => x.slug === k), ar = RATGEBER.find(x => x.slug === k);
      const act = document.querySelector('[data-page].is-active');
      const key = l ? l.slug : (rg || ar) ? k : act.dataset.page;
      const ld = document.getElementById('ld-page');
      const kbh = document.getElementById('kontaktband').hidden;
      return {
        page: act.dataset.page, html: __clean(act).replace(/^<div[^>]*>/, '').replace(/<\/div>$/, ''),
        title: document.title, desc: document.querySelector('meta[name=description]').content,
        h1: (act.querySelector('h1') || {}).textContent || '',
        ld: ld ? ld.textContent : '{}',
        nav: l ? 'leistungen' : ar ? 'ratgeber' : act.dataset.page,
        kb: kbh ? null : { h: document.getElementById('kb-h').textContent, p: document.getElementById('kb-p').textContent, b: document.getElementById('kb-b').textContent, s: document.getElementById('kb-s').textContent, thema: document.getElementById('kb-cta').dataset.thema || '' },
        name: l ? l.title.replace(/­/g, '') : rg ? 'Bausachverständiger ' + rg.name : ar ? ar.h1 : (act.querySelector('h1') || {}).textContent || k
      };
    }, k);
  }
  fs.writeFileSync(out, JSON.stringify({ chrome, routes }));
  console.log(Object.keys(routes).length, 'Ansichten', errs.length ? errs : 'ohne Fehler');
  await b.close();
})();
