/* ---------- Kostenlose Checklisten (PDF) ---------- */
const PDF_URL = "https://bsv-niewerth.de/wp-content/themes/bsv-niewerth/assets/pdf/";
const rgLists = (slug, re) => RATGEBER.find(a => a.slug === slug).secs.filter(([h, it]) => it.some(Array.isArray) && (!re || re.test(h))).map(([h, it]) => [h, it.filter(Array.isArray).flat()]);
const CHECKLISTEN = [
  { file: "BSV-Niewerth-Checkliste-Hausbesichtigung.pdf", art: "ratgeber-hauskauf-besichtigung", to: "hauskaufberatung", btn: "Checkliste als PDF", pages: 2, extra: "notes",
    title: "Checkliste Hausbesichtigung", text: "Keller, Dach, Fassade, Heizung, Unterlagen und die richtigen Fragen an den Verkäufer: zum Abhaken bei der Besichtigung.",
    fields: ["Objekt / Adresse", "Datum der Besichtigung", "Baujahr"], secs: () => rgLists("ratgeber-hauskauf-besichtigung") },
  { file: "BSV-Niewerth-Checkliste-Bauabnahme.pdf", art: "ratgeber-bauabnahme", to: "bauueberwachung", btn: "Checkliste als PDF", pages: 1, extra: "maengel",
    title: "Checkliste Bauabnahme", text: "Vorbereitung, die wichtigsten Prüfpunkte bei der Begehung und eine Mängeltabelle für das Abnahmeprotokoll.",
    fields: ["Bauvorhaben", "Datum der Abnahme", "Teilnehmer"], secs: () => rgLists("ratgeber-bauabnahme", /^(So bereiten|Checkliste)/) },
  { file: "BSV-Niewerth-Checkliste-Neubau-Prueftermine.pdf", art: "ratgeber-baubegleitung-neubau", to: "bauueberwachung", btn: "Prüftermine als PDF", pages: 1, extra: "neubau",
    title: "Prüftermine beim Neubau", text: "Die Bauabschnitte, die Sie prüfen lassen sollten, bevor sie verdeckt werden, mit Tabelle zum Eintragen der Termine.",
    fields: ["Bauvorhaben", "Bauunternehmen", "Baubeginn"], secs: () => rgLists("ratgeber-baubegleitung-neubau") },
  { file: "BSV-Niewerth-Rissprotokoll.pdf", art: "ratgeber-risse-wand", to: "gebaeudeschaeden", btn: "Rissprotokoll als PDF", pages: 1, extra: "riss",
    title: "Rissprotokoll zum Ausdrucken", text: "Risse richtig beobachten: Anleitung, Warnzeichen und eine Tabelle für Datum, Stelle und Rissbreite.",
    fields: ["Gebäude / Adresse", "Begonnen am", "Messmittel (z. B. Rissbreitenkarte)"], secs: () => rgLists("ratgeber-risse-wand", /^(So beobachten|Warnzeichen)/) },
  { file: "BSV-Niewerth-Lueftungsprotokoll-Schimmel.pdf", art: "ratgeber-schimmel-wohnung", to: "gebaeudeschaeden", btn: "Lüftungsprotokoll als PDF", pages: 2, extra: "klima",
    title: "Lüftungs- und Raumklima-Protokoll", text: "Bei Schimmel zwei bis vier Wochen Temperatur, Luftfeuchte und Lüften notieren: eine sachliche Grundlage für Vermieter, Mieter und Sachverständige.",
    fields: ["Wohnung / Raum", "Begonnen am", "Hygrometer (Modell)"],
    secs: () => [["So messen Sie richtig", ["Hygrometer in Raummitte aufstellen, nicht direkt an der Außenwand oder an der Heizung", "Möglichst morgens und abends zur gleichen Uhrzeit ablesen", "Vor dem Lüften messen und notieren, wie lange gelüftet wurde", "Besondere Ereignisse festhalten, zum Beispiel Wäschetrocknen, Kochen oder Duschen", "Den Schimmelbefall zu Beginn und am Ende mit Datum fotografieren"]],
                 ["Sofortmaßnahmen bei Schimmel", ["Mehrmals täglich kurz und kräftig lüften statt Fenster dauerhaft zu kippen", "Alle Räume gleichmäßig heizen, auch wenig genutzte", "Möbel einige Zentimeter von Außenwänden abrücken", "Kleine Flächen feucht entfernen, größere fachgerecht sanieren lassen", "Als Mieter: Schimmel dem Vermieter unverzüglich schriftlich melden"]]] },
  { file: "BSV-Niewerth-Checkliste-Wasserschaden.pdf", art: null, to: "leckageortung", btn: "Checkliste als PDF", pages: 1, extra: "wasser",
    title: "Wasserschaden: Checkliste für die ersten Stunden", text: "Was nach einem Wasserschaden zu tun ist: Sicherheit, Dokumentation für die Versicherung, Meldung und Trocknung.",
    fields: ["Gebäude / Adresse", "Schaden entdeckt am", "Betroffene Räume"],
    secs: () => [["Sofort: Sicherheit", ["Bei Wasser in der Nähe von Steckdosen oder Geräten die Sicherung des Bereichs ausschalten", "Haupthahn oder den betroffenen Absperrhahn schließen", "Stehendes Wasser aufnehmen, Möbel und Wertsachen in Sicherheit bringen", "Bei Gefahr für das Gebäude oder Personen Hilfe holen"]],
                 ["Dokumentieren", ["Fotos und Videos vom Schaden machen, bevor aufgeräumt wird", "Beschädigte Gegenstände auflisten und nicht vorschnell entsorgen", "Rechnungen und Belege von Notmaßnahmen aufbewahren"]],
                 ["Melden", ["Versicherung unverzüglich informieren (Wohngebäude- oder Hausratversicherung)", "Als Mieter: Vermieter oder Hausverwaltung benachrichtigen", "Im Mehrfamilienhaus die Nachbarn darunter informieren"]],
                 ["Ursache finden und richtig trocknen", ["Die Leckstelle orten lassen, bevor großflächig geöffnet wird", "Trocknung mit Feuchtemessungen begleiten lassen", "Erst nach nachgewiesener Trocknung Boden, Putz oder Tapete erneuern"]]] }
];
SEO.checklisten = ["Kostenlose Checklisten zum Bauen und Kaufen (PDF)", "Checklisten zum Ausdrucken vom Bausachverständigen: Hausbesichtigung, Bauabnahme, Neubau, Rissprotokoll, Lüftungsprotokoll und Wasserschaden."];
SEO["schadens-check"] = ["Schadens-Check: Feuchte, Riss oder Schimmel einordnen", "Drei Fragen, eine erste Einordnung: Was hinter Feuchte, Rissen, Schimmel oder Wasserflecken stecken kann und was jetzt sinnvoll ist."];
const clFor = (key, val) => CHECKLISTEN.filter(c => c[key] === val);
const clLink = (c, cls = "btn btn--primary") => `<a class="${cls}" href="${PDF_URL}${c.file}" download>${use("i-doc")}${c.btn}</a>`;
function renderChecklisten() {
  const el = document.getElementById("cl-list"); if (!el) return;
  el.innerHTML = CHECKLISTEN.map(c => {
    const a = c.art && RATGEBER.find(x => x.slug === c.art), l = LEISTUNGEN.find(x => x.slug === c.to);
    return `<article class="clcard"><span class="acard-k">PDF · ${c.pages} ${c.pages > 1 ? "Seiten" : "Seite"} · kostenlos</span><h3>${c.title}</h3><p>${c.text}</p><div class="clcard-act">${clLink(c)}${a ? `<a class="need-more" href="#${a.slug}">Zum Ratgeber →</a>` : `<a class="need-more" href="#${l.slug}">Mehr zu ${l.title} →</a>`}</div></article>`;
  }).join("");
}

/* ---------- Schadens-Check: drei Fragen, erste Einordnung ---------- */
const CHECK_Q = [
  ["Wo zeigt sich der Schaden?", [["keller", "Im Keller"], ["innen", "Wand oder Decke innen"], ["aussen", "Fassade oder Außenwand"], ["fenster", "Am Fenster"], ["dach", "Dach oder Dachboden"], ["bad", "Bad, Küche oder Leitungen"], ["boden", "Am Boden"]]],
  ["Was sehen oder bemerken Sie?", [["feucht", "Feuchte Stelle oder Wasserfleck"], ["wasser", "Wasser tropft oder läuft"], ["schimmel", "Schimmel"], ["riss", "Riss"], ["salz", "Weiße Beläge oder bröckelnder Putz"], ["geruch", "Muffiger Geruch"], ["kalt", "Kalte Stellen oder Zugluft"]]],
  ["Wie entwickelt es sich?", [["neu", "Gerade erst entdeckt"], ["schlimmer", "Seit Wochen, es wird schlimmer"], ["gleich", "Schon länger, unverändert"], ["wieder", "Kommt immer wieder, z. B. nach Regen oder im Winter"]]]
];
function checkResult([wo, was, wie]) {
  let r;
  if (was === "wasser" || (wo === "bad" && was === "feucht") || (wo === "boden" && was === "feucht"))
    r = { t: "Möglicher Leitungs- oder Wasserschaden", x: "Läuft oder tropft Wasser, oder zeigt sich ein Fleck in der Nähe von Leitungen, steckt oft eine Undichtigkeit dahinter. Je früher sie gefunden wird, desto kleiner bleibt der Schaden.", to: "leckageortung", art: null, urgent: true,
      tun: ["Betroffenen Absperrhahn schließen, bei Wasser nahe Strom die Sicherung ausschalten", "Alles fotografieren und die Versicherung informieren", "Leckstelle orten lassen, bevor großflächig geöffnet wird"] };
  else if (was === "riss")
    r = { t: wie === "schlimmer" ? "Ein Riss, der sich bewegt" : "Riss im Bauteil", x: wie === "schlimmer" ? "Wird ein Riss breiter oder länger, arbeitet etwas im Gebäude. Das sollte fachlich beurteilt werden, bevor repariert wird." : "Viele Risse sind harmlose Putz- oder Schwindrisse. Ob Ihrer dazugehört, zeigen Verlauf, Lage und ob er sich verändert.", to: "gebaeudeschaeden", art: "ratgeber-risse-wand", urgent: wie === "schlimmer",
      tun: ["Rissenden mit Bleistift und Datum markieren", "Breite messen und den Riss mit Lineal fotografieren", "Messung nach einigen Wochen wiederholen, zum Beispiel mit dem Riss-Tagebuch"] };
  else if (was === "schimmel")
    r = { t: "Schimmel: Ursache klären", x: (wo === "fenster" || wo === "innen") ? "Schimmel an Fenstern, in Ecken oder hinter Möbeln entsteht oft an kühlen Stellen, an denen sich Raumfeuchte niederschlägt. Ob eine Wärmebrücke, das Lüften oder eindringende Feuchte die Ursache ist, lässt sich mit Messungen klären." : "Schimmel braucht dauerhafte Feuchte. Woher sie kommt, entscheidet über die richtige Sanierung.", to: "gebaeudeschaeden", art: "ratgeber-schimmel-wohnung", urgent: wie === "schlimmer",
      tun: ["Befall mit Datum fotografieren", "Luftfeuchte zwei bis vier Wochen protokollieren", "Kleine Flächen feucht entfernen, größere fachgerecht sanieren lassen"] };
  else if (wo === "keller" || was === "salz" || was === "geruch")
    r = { t: "Feuchte im Mauerwerk", x: "Feuchte Flecken, weiße Salzbeläge oder muffiger Geruch deuten auf Feuchte in der Wand hin. Typische Ursachen sind eine alte Abdichtung, aufsteigende Feuchte, Kondensat im Sommer oder eine Leckage.", to: "gebaeudeschaeden", art: "ratgeber-feuchter-keller", urgent: wie === "schlimmer",
      tun: ["Folientest machen: Alufolie zwei bis drei Tage auf die Wand kleben", "Im Sommer nur in kühlen Stunden lüften (Lüftungsrechner im Ratgeber)", "Vor einer Sanierung die Ursache messen lassen"] };
  else if (wo === "dach")
    r = { t: "Feuchte unter dem Dach", x: "Feuchte unter dem Dach kann von einer undichten Eindeckung, schadhaften Anschlüssen oder von Kondensat durch fehlende Luftdichtheit kommen. Mit Drohne und Wärmebild lässt sich das oft ohne Gerüst eingrenzen.", to: "gebaeudeschaeden", art: null, urgent: wie === "schlimmer",
      tun: ["Feuchte Stellen nach Regen und bei Frost beobachten", "Fotos vom Dachboden machen", "Keine Dämmung erneuern, bevor die Ursache klar ist"] };
  else if (was === "kalt")
    r = { t: "Wärmebrücke oder Undichtigkeit", x: "Kalte Stellen und Zugluft zeigen, wo Wärme verloren geht. Ein Wärmebild macht Wärmebrücken, Dämmlücken und undichte Anschlüsse sichtbar, am besten in der Heizperiode.", to: "thermografie", art: null, urgent: false,
      tun: ["Stellen notieren, an denen es zieht oder kalt ist", "Auf Kondenswasser und Schimmel an diesen Stellen achten", "Wärmebild in der Heizperiode aufnehmen lassen"] };
  else
    r = { t: "Feuchte an der Gebäudehülle", x: "Feuchte Stellen an Fassade, Fenstern oder Wänden können viele Ursachen haben, von Schlagregen über undichte Anschlüsse bis zu Kondensat. Eine Untersuchung vor Ort schafft Klarheit.", to: "gebaeudeschaeden", art: null, urgent: wie === "schlimmer",
      tun: ["Fotos mit Datum machen", "Beobachten, ob es nach Regen schlimmer wird", "Ursache klären lassen, bevor saniert wird"] };
  r.badge = r.urgent ? ["hoch", "Bitte nicht lange warten"] : wie === "wieder" ? ["mittel", "Ursache klären lassen"] : wie === "neu" ? ["niedrig", "Beobachten und dokumentieren"] : ["mittel", "Zeitnah ansehen lassen"];
  return r;
}
function initCheck(t) {
  let step = 0, ans = [];
  const label = (i, v) => CHECK_Q[i][1].find(o => o[0] === v)[1];
  const render = () => {
    if (step < 3) {
      const [q, opts] = CHECK_Q[step];
      t.innerHTML = `<div class="chk-top"><span class="kurz-k">Frage ${step + 1} von 3</span><div class="chk-bar"><i style="width:${(step + 1) / 3 * 100}%"></i></div></div>
        <h2>${q}</h2><div class="chk-opts">${opts.map(([v, l]) => `<button type="button" class="chk-opt" data-v="${v}">${l}</button>`).join("")}</div>
        ${step ? '<button type="button" class="chk-back" data-back>← Zurück</button>' : ""}`;
    } else {
      const r = checkResult(ans), l = LEISTUNGEN.find(x => x.slug === r.to), a = r.art && RATGEBER.find(x => x.slug === r.art), c = CTA[r.to], cl = CHECKLISTEN.find(x => x.to === r.to && (!r.art || x.art === r.art)) || null;
      const msg = `Schadens-Check: ${label(0, ans[0])} · ${label(1, ans[1])} · ${label(2, ans[2])}.\n\n`;
      t.innerHTML = `<div class="chk-top"><span class="kurz-k">Ihre erste Einordnung</span><span class="chk-badge ${r.badge[0]}">${r.badge[1]}</span></div>
        <h2>${r.t}</h2><p class="chk-sum">${label(0, ans[0])} · ${label(1, ans[1])} · ${label(2, ans[2])}</p><p>${r.x}</p>
        <h3>Was Sie jetzt tun können</h3><ul class="checks">${r.tun.map(x => `<li>${use("i-check")}<span>${x}</span></li>`).join("")}</ul>
        <div class="chk-act"><a class="btn btn--primary" href="#kontakt" data-thema="${r.to}" data-label="${c[0]}" data-msg="${msg.replace(/"/g, "&quot;")}">${c[0]} <span class="arrow">→</span></a>
        ${a ? `<a class="btn btn--outline" href="#${a.slug}">Ratgeber lesen</a>` : `<a class="btn btn--outline" href="#${l.slug}">Mehr zu ${l.title}</a>`}${cl ? clLink(cl, "btn btn--outline") : ""}</div>
        <p class="chk-note">Eine erste Orientierung, keine Ferndiagnose. Sicher beurteilen lässt sich ein Schaden erst vor Ort. <button type="button" class="chk-back" data-restart>Neu starten</button></p>`;
    }
  };
  t.addEventListener("click", e => {
    const o = e.target.closest(".chk-opt");
    if (o) { ans[step] = o.dataset.v; step++; render(); t.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    if (e.target.closest("[data-back]")) { step--; render(); }
    if (e.target.closest("[data-restart]")) { step = 0; ans = []; render(); }
  });
  render();
}
