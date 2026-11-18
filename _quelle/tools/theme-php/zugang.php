<?php defined('ABSPATH') || exit; $u = get_template_directory_uri() . '/assets/'; ?><!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#0f1d2e">
<title>BSV Niewerth – Website im Aufbau</title>
<meta name="description" content="Die neue Website von BSV Niewerth – Bau-Sachverständigenbüro ist im Aufbau. Kontakt: 0179 6933684, info@bsv-niewerth.de">
<meta property="og:title" content="BSV Niewerth – Bau-Sachverständigenbüro">
<meta property="og:description" content="Die neue Website ist im Aufbau. Sie erreichen mich schon jetzt unter 0179 6933684.">
<meta property="og:image" content="<?php echo esc_url($u . 'og/start.jpg'); ?>"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<link rel="icon" href="<?php echo esc_url($u . 'icons/favicon.ico'); ?>" sizes="48x48">
<link rel="icon" href="<?php echo esc_url($u . 'icons/favicon.svg'); ?>" type="image/svg+xml">
<link rel="apple-touch-icon" href="<?php echo esc_url($u . 'icons/apple-touch-icon.png'); ?>">
<link rel="stylesheet" href="<?php echo esc_url($u . 'site.css?ver=' . BSV_VERSION); ?>">
<style>
  html, body { background: var(--navy); }
  body { margin: 0; min-height: 100svh; display: grid; place-items: center; color: #fff; padding: max(28px, env(safe-area-inset-top)) 20px max(28px, env(safe-area-inset-bottom)); position: relative; overflow-x: hidden; }
  body::before { display: none; }
  .gate-roof { position: fixed; left: 50%; bottom: -12vh; width: min(1100px, 130vw); transform: translateX(-50%); opacity: .06; pointer-events: none; }
  .gate-roof path { fill: none; stroke: #fff; stroke-width: 14; }
  .gate { position: relative; width: 100%; max-width: 560px; display: grid; gap: 26px; justify-items: center; text-align: center; }
  .gate .brand { flex-direction: column; gap: 16px; pointer-events: none; }
  .gate .brand-mark { height: clamp(84px, 16vw, 120px); }
  .gate .brand-text { display: grid !important; border-left: 0; padding-left: 0; justify-items: center; }
  .gate .brand-name { font-size: clamp(1.15rem, 3vw, 1.5rem); }
  .gate .brand-sub { font-size: clamp(.62rem, 1.6vw, .78rem); }
  .gate-k { display: inline-flex; align-items: center; gap: 12px; font-family: var(--font-head); font-weight: 700; font-size: .78rem; letter-spacing: .2em; text-transform: uppercase; color: var(--blue-light); }
  .gate-k::before, .gate-k::after { content: ""; width: 28px; height: 2px; background: currentColor; }
  .gate h1 { font-size: clamp(1.6rem, 5vw, 2.3rem); line-height: 1.2; }
  .gate p { color: var(--on-navy-muted); font-size: 1.08rem; max-width: 30rem; }
  .gate-bar { width: min(260px, 70vw); height: 4px; border-radius: 2px; background: rgb(255 255 255 / .12); overflow: hidden; }
  .gate-bar i { display: block; width: 40%; height: 100%; background: var(--blue-light); border-radius: 2px; animation: gate-bar 2.4s cubic-bezier(.6,.1,.3,1) infinite; }
  @keyframes gate-bar { 0% { transform: translateX(-110%); } 100% { transform: translateX(260%); } }
  @media (prefers-reduced-motion: reduce) { .gate-bar i { animation: none; transform: translateX(75%); } }
  .gate-contact { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
  .gate-contact .btn { padding: .85em 1.3em; }
  .gate form { all: unset; width: 100%; max-width: 380px; display: grid; gap: 10px; margin-top: 8px; padding-top: 26px; border-top: 1px solid rgb(255 255 255 / .14); }
  .gate label { font-family: var(--font-head); font-weight: 600; font-size: .85rem; color: var(--on-navy-muted); }
  .gate .row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; }
  .gate input { background: rgb(255 255 255 / .08); color: #fff; border: 1px solid rgb(255 255 255 / .2); border-radius: var(--r); padding: 12px 14px; font-size: 1rem; }
  .gate input:focus { outline: 2px solid var(--blue-light); outline-offset: 1px; background: rgb(255 255 255 / .12); }
  .gate .err { color: #ffb4a6; font-size: .92rem; font-weight: 600; }
  .gate small { color: #8fa2b8; font-size: .82rem; }
</style>
</head>
<body>
<svg class="gate-roof" viewBox="0 0 600 300" aria-hidden="true"><path d="M20 290 L300 40 L580 290"/></svg>
<main class="gate">
  <div>{{BRAND}}</div>
  <span class="gate-k">Im Aufbau</span>
  <h1>Hier entsteht die neue Website</h1>
  <div class="gate-bar" aria-hidden="true"><i></i></div>
  <p>Die Website von BSV Niewerth – Bau-Sachverständigenbüro wird gerade fertiggestellt. Sie erreichen mich schon jetzt persönlich.</p>
  <div class="gate-contact">
    <a class="btn btn--primary" href="tel:+491796933684">0179 6933684</a>
    <a class="btn btn--outline-light" href="mailto:info@bsv-niewerth.de">info@bsv-niewerth.de</a>
  </div>
  <form method="post" action="">
    <label for="bsv-pw">Zugang zur Vorschau</label>
    <div class="row"><input id="bsv-pw" name="bsv_zugang_pw" type="password" autocomplete="current-password" required placeholder="Passwort"><button class="btn btn--light" type="submit">Öffnen</button></div>
    <?php if (!empty($fehler)) : ?><span class="err" role="alert"><?php echo esc_html($fehler); ?></span><?php endif; ?>
  </form>
  <small>André Niewerth · Propst-Pricking-Str. 16 · 46325 Borken</small>
</main>
</body>
</html>
