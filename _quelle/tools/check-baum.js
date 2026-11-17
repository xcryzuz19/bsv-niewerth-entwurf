/* ---------- Schadens-Check: Entscheidungsbaum (Bereich → Symptom → Unterscheidungsfrage) ----------
   Je Symptom: t = Titel, x = fachliche Einordnung, c = mögliche Ursachen, tun = selbst prüfen, to/art = Leistung/Ratgeber,
   q = Unterscheidungsfrage, o = Antworten [Wert, Text, Einordnung der Antwort, Dringlichkeit (hoch|mittel|niedrig), wahrscheinlichste Ursache, optional andere Leistung] */
const CHECK = [
  { v: "keller", l: "Im Keller", s: [
    { v: "feucht", l: "Feuchte Flecken an der Wand", t: "Feuchte Kellerwand", art: "ratgeber-feuchter-keller", to: "gebaeudeschaeden",
      x: "Feuchte im Keller hat fast immer eine von vier Ursachen. Welche es ist, entscheidet über die richtige Maßnahme, denn eine teure Abdichtung hilft nicht, wenn das Problem Kondensat ist.",
      c: ["Kondensat: warme Sommerluft schlägt sich an kühlen Wänden nieder", "Fehlende oder gealterte Abdichtung der Außenwand", "Aufsteigende Feuchte ohne funktionierende Horizontalsperre", "Undichte Wasser- oder Abwasserleitung"],
      tun: ["Folientest: Alufolie zwei bis drei Tage dicht auf die Wand kleben. Ist die Raumseite nass, ist es Kondensat", "Luftfeuchte mit einem Hygrometer messen, im Sommer nur in kühlen Stunden lüften", "Dachrinnen, Fallrohre und Gefälle am Haus prüfen"],
      q: "Wann ist es am schlimmsten?", o: [
      ["sommer", "Im Sommer, bei warmem Wetter", "Das spricht stark für Kondensat. Die Wand ist dann meist dicht, das Wasser kommt aus der Luft. Oft reicht es, anders zu lüften oder zu entfeuchten.", "niedrig", 0],
      ["regen", "Nach Regen oder Schneeschmelze", "Das deutet auf Wasser von außen hin: eine undichte Abdichtung, eine falsch geführte Dachentwässerung oder ein Gefälle zum Haus hin.", "mittel", 1],
      ["immer", "Das ganze Jahr, vor allem unten an der Wand", "Gleichbleibende Feuchte im unteren Wandbereich ist typisch für aufsteigende oder dauerhaft seitlich eindringende Feuchte.", "mittel", 2],
      ["ploetzlich", "Plötzlich neu, ohne erkennbaren Grund", "Tritt Feuchte plötzlich auf, sollte zuerst eine Leitung als Ursache ausgeschlossen werden. Beobachten Sie den Wasserzähler, während alle Hähne geschlossen sind.", "hoch", 3, "leckageortung"]] },
    { v: "salz", l: "Weiße Beläge oder bröckelnder Putz", t: "Salzausblühungen im Keller", art: "ratgeber-feuchter-keller", to: "gebaeudeschaeden",
      x: "Weiße, kristalline Beläge sind Salze, die mit Feuchte aus dem Mauerwerk an die Oberfläche wandern. Sie zerstören mit der Zeit Putz und Fugen und ziehen zusätzlich Feuchte aus der Luft an.",
      c: ["Aufsteigende Feuchte aus dem Fundament", "Seitlich eindringende Feuchte durch die erdberührte Wand", "Örtliche Wasserquelle wie Fallrohr, Lichtschacht oder Riss"],
      tun: ["Beläge trocken abkehren, nicht nass abwaschen, das bringt neue Feuchte in die Wand", "Betroffene Stellen fotografieren und mit Datum markieren", "Von außen prüfen: Fallrohre, Lichtschächte, Gelände am Haus"],
      q: "Wo genau zeigen sich die Beläge?", o: [
      ["unten", "Unten an der Wand, bis etwa einen Meter hoch", "Ein Band aus Salzen und Feuchte im unteren Wandbereich ist das typische Bild aufsteigender Feuchte. Die Ursache liegt meist an einer fehlenden oder unwirksamen Horizontalsperre.", "mittel", 0],
      ["gross", "Großflächig an den Außenwänden", "Großflächige Ausblühungen an erdberührten Wänden sprechen für Feuchte, die seitlich durch die Wand dringt.", "mittel", 1],
      ["stelle", "Nur an einzelnen Stellen", "Begrenzte Stellen haben meist eine örtliche Ursache, zum Beispiel ein Fallrohr, einen Lichtschacht, eine Rohrdurchführung oder einen Riss.", "niedrig", 2]] },
    { v: "geruch", l: "Muffiger Geruch", t: "Muffiger Keller", art: "ratgeber-feuchter-keller", to: "gebaeudeschaeden",
      x: "Muffiger Geruch entsteht fast immer durch Feuchte und mikrobielles Wachstum, oft an Stellen, die man nicht sieht, etwa hinter Regalen, Verkleidungen oder in Kartons.",
      c: ["Zu hohe Luftfeuchte durch Kondensat oder fehlende Lüftung", "Verdeckter Schimmel hinter Möbeln oder Verkleidungen", "Feuchtes Mauerwerk"],
      tun: ["Luftfeuchte über einige Tage messen, dauerhaft über 70 Prozent ist zu viel", "Regale und Kartons von den Außenwänden abrücken und dahinter nachsehen", "Gelagerte Textilien und Pappe auf Schimmel prüfen"],
      q: "Was sehen Sie zusätzlich?", o: [
      ["schimmel", "Sichtbaren Schimmel an Wänden oder Gegenständen", "Mit sichtbarem Schimmel ist klar, dass die Feuchte dauerhaft zu hoch ist. Gerade wenn der Keller mit Wohnräumen verbunden ist, sollte die Ursache zeitnah geklärt werden.", "hoch", 1],
      ["flecken", "Feuchte Flecken, aber keinen Schimmel", "Die Feuchte im Mauerwerk ist hier wahrscheinlich die Quelle des Geruchs. Es lohnt sich, die Ursache der Flecken zu klären.", "mittel", 2],
      ["nichts", "Nichts Sichtbares", "Ohne sichtbare Spuren ist meist die Luftfeuchte zu hoch. Eine Messung über einige Tage zeigt, ob Lüften oder Entfeuchten reicht.", "niedrig", 0]] },
    { v: "wasser", l: "Wasser steht auf dem Boden", t: "Wasser im Keller", to: "gebaeudeschaeden", cl: "BSV-Niewerth-Checkliste-Wasserschaden.pdf",
      x: "Stehendes Wasser ist ein akuter Schaden. Zuerst geht es um Sicherheit und darum, weiteren Schaden zu begrenzen, dann um die Ursache.",
      c: ["Rückstau aus dem Kanal bei Starkregen", "Oberflächenwasser über Lichtschächte oder die Kellertür", "Drückendes Grundwasser", "Leck an Leitung, Waschmaschine oder Heizung"],
      tun: ["Bei Wasser in der Nähe von Strom die Sicherung ausschalten", "Fotos machen und die Versicherung informieren", "Rückstausicherung und Lichtschächte prüfen"],
      q: "Wann tritt das Wasser auf?", o: [
      ["starkregen", "Nach Starkregen", "Nach Starkregen sind ein Rückstau aus dem Kanal oder Wasser über Lichtschächte und Kellertreppen die häufigsten Ursachen. Eine funktionierende Rückstausicherung ist hier entscheidend.", "hoch", 0],
      ["dauernd", "Dauerhaft oder es steigt langsam", "Kommt Wasser dauerhaft nach, drückt es entweder von außen durch die Bodenplatte oder Wand, oder eine Leitung ist undicht.", "hoch", 2],
      ["geraet", "Einmalig, zum Beispiel an Waschmaschine oder Heizung", "Ein einmaliger Wasseraustritt an einem Gerät hat meist eine örtliche Ursache am Gerät oder Anschluss. Prüfen Sie danach, ob Wand und Boden wieder trocknen.", "mittel", 3, "leckageortung"]] }
  ] },
  { v: "innen", l: "Wand oder Decke innen", s: [
    { v: "schimmel", l: "Schimmel", t: "Schimmel an Wand oder Decke", art: "ratgeber-schimmel-wohnung", to: "gebaeudeschaeden", cl: "BSV-Niewerth-Lueftungsprotokoll-Schimmel.pdf",
      x: "Schimmel wächst dort, wo eine Oberfläche über längere Zeit feucht ist. Das passiert an kühlen Stellen, an denen sich Raumfeuchte niederschlägt, oder dort, wo Wasser eindringt.",
      c: ["Wärmebrücke: eine kühle Stelle in der Außenwand oder Decke", "Zu hohe Raumfeuchte bei zu wenig Lüften oder Heizen", "Eindringende Feuchte von außen oder aus einer Leitung"],
      tun: ["Befall mit Datum fotografieren, bevor Sie ihn entfernen", "Zwei bis vier Wochen Temperatur und Luftfeuchte protokollieren", "Möbel einige Zentimeter von Außenwänden abrücken"],
      q: "Wo genau sitzt der Schimmel?", o: [
      ["ecke", "In Außenecken oder hinter Möbeln an Außenwänden", "Das ist das klassische Bild: In Außenecken und hinter Möbeln bleibt die Wand kühl, dort schlägt sich die Raumfeuchte nieder. Meist wirken eine Wärmebrücke und das Raumklima zusammen.", "mittel", 0],
      ["decke", "An der Decke, unter dem Dach oder unter einem Balkon", "Schimmel an der Decke deutet auf eine kühle Betondecke oder einen ungedämmten Anschluss hin. Auch Feuchte von oben sollte ausgeschlossen werden.", "mittel", 0],
      ["wand", "Großflächig an einer ganzen Wand", "Großflächiger Befall an einer Wand passt eher zu Feuchte, die von außen eindringt, zum Beispiel durch Schlagregen oder einen Riss in der Fassade.", "hoch", 2],
      ["kind", "Im Schlaf- oder Kinderzimmer", "Schlafräume sind oft kühl, und nachts entsteht viel Feuchte. Gerade dort sollte die Ursache schnell geklärt werden, weil man viel Zeit darin verbringt.", "hoch", 0]] },
    { v: "fleck", l: "Wasserfleck an der Decke", t: "Wasserfleck an der Decke", to: "leckageortung", cl: "BSV-Niewerth-Checkliste-Wasserschaden.pdf",
      x: "Ein Wasserfleck zeigt, wo Wasser sichtbar wird, aber nicht unbedingt, wo es herkommt. Wasser wandert entlang von Leitungen und Bauteilen oft mehrere Meter.",
      c: ["Undichte Leitung, Abfluss oder Abdichtung im Raum darüber", "Undichtes Dach oder undichter Dachanschluss", "Kondensat an kalten Bauteilen"],
      tun: ["Rand des Flecks mit Bleistift und Datum markieren, um Wachstum zu erkennen", "Wasserzähler beobachten, während alle Hähne geschlossen sind", "Bei Wasser nahe Leuchten die Sicherung ausschalten"],
      q: "Was liegt direkt darüber?", o: [
      ["bad", "Ein Bad oder eine Küche", "Liegt ein Bad oder eine Küche darüber, sind eine undichte Leitung, ein Abfluss oder die Abdichtung unter Dusche oder Wanne die wahrscheinlichsten Ursachen.", "hoch", 0],
      ["dach", "Das Dach oder ein Dachboden", "Unter dem Dach kommen eine undichte Eindeckung, ein schadhafter Anschluss an Kamin oder Dachfenster oder Kondensat in Frage.", "mittel", 1, "gebaeudeschaeden"],
      ["balkon", "Ein Balkon oder eine Terrasse", "Unter Balkonen und Terrassen ist meist die Abdichtung oder der Anschluss an die Hauswand die Ursache.", "mittel", 0, "gebaeudeschaeden"],
      ["raum", "Ein normaler Raum ohne Wasseranschluss", "Ohne Wasseranschluss darüber kommen Heizungsleitungen oder eine Fußbodenheizung in Betracht. Ein Druckverlust an der Heizung wäre ein deutlicher Hinweis.", "mittel", 0]] },
    { v: "riss", l: "Riss", t: "Riss in Wand oder Decke", art: "ratgeber-risse-wand", to: "gebaeudeschaeden", cl: "BSV-Niewerth-Rissprotokoll.pdf",
      x: "Viele Risse sind harmlos. Entscheidend sind Verlauf, Lage und ob sich der Riss verändert, weniger seine Breite.",
      c: ["Putz- oder Schwindriss ohne statische Bedeutung", "Setzung oder Verformung des Gebäudes", "Bewegung zwischen verschiedenen Baustoffen oder Bauteilen"],
      tun: ["Enden des Risses mit Bleistift und Datum markieren", "Breite messen und den Riss mit Lineal fotografieren", "Messung nach einigen Wochen wiederholen, zum Beispiel mit dem Riss-Tagebuch"],
      q: "Wie sieht der Riss aus?", o: [
      ["fein", "Fein, netzartig oder nur im Putz", "Feine, netzartige Risse im Putz sind fast immer Schwind- oder Putzrisse. Sie sind in der Regel ein optisches Problem.", "niedrig", 0],
      ["schraeg", "Schräg oder treppenförmig, oft von Fenster- oder Türecken aus", "Schräge oder treppenförmige Risse, besonders an Öffnungen, können auf Setzungen hindeuten. Das sollte fachlich beurteilt werden.", "mittel", 1],
      ["waagerecht", "Waagerecht an der Decke oder oben an der Wand", "Waagerechte Risse am Übergang zur Decke entstehen oft durch Bewegungen der Decke, etwa durch Temperatur oder Durchbiegung. Meist unkritisch, aber beobachten.", "niedrig", 2],
      ["waechst", "Er wird breiter, oder Türen klemmen", "Wird ein Riss breiter oder klemmen Türen, arbeitet etwas im Gebäude. Lassen Sie das zeitnah ansehen, bevor repariert wird.", "hoch", 1]] },
    { v: "kalt", l: "Kalte Stellen oder Zugluft", t: "Kalte Stellen und Zugluft", to: "thermografie",
      x: "Kalte Stellen und Zugluft zeigen, wo Wärme verloren geht. An kalten Stellen kann sich außerdem Feuchte niederschlagen und Schimmel entstehen.",
      c: ["Wärmebrücke an Ecken, Decken oder Rollladenkästen", "Undichte Anschlüsse an Fenstern und Türen", "Undichtheiten in der Gebäudehülle"],
      tun: ["Stellen notieren, an denen es zieht oder kalt ist", "Auf Kondenswasser und Schimmel an diesen Stellen achten", "Ein Wärmebild in der Heizperiode zeigt die Ursachen am deutlichsten"],
      q: "Wo spüren Sie es vor allem?", o: [
      ["fenster", "An Fenstern und Türen", "Zugluft an Fenstern und Türen kommt meist von verschlissenen Dichtungen, schlecht eingestellten Flügeln oder einem undichten Anschluss zur Wand.", "niedrig", 1],
      ["ecken", "In Außenecken oder an Decken", "Kalte Ecken und Deckenränder sind typische Wärmebrücken. Dort ist das Schimmelrisiko am größten.", "mittel", 0],
      ["steckdose", "An Steckdosen, Fußleisten oder Rollladenkästen", "Zug an Steckdosen, Fußleisten oder Rollladenkästen zeigt Undichtheiten in der Gebäudehülle.", "niedrig", 2]] }
  ] },
  { v: "aussen", l: "Fassade oder Außenwand", s: [
    { v: "riss", l: "Riss in der Fassade", t: "Riss in der Fassade", art: "ratgeber-risse-wand", to: "gebaeudeschaeden", cl: "BSV-Niewerth-Rissprotokoll.pdf",
      x: "Risse in der Fassade sind nicht nur ein optisches Thema: Durch sie kann Wasser in die Wand eindringen. Ob ein Riss bedenklich ist, zeigen Verlauf und Entwicklung.",
      c: ["Putzriss durch Schwinden oder Temperaturwechsel", "Setzung oder unterschiedliche Bewegung von Bauteilen", "Fehlende Bewegungsfuge, etwa an Anbauten"],
      tun: ["Riss markieren, messen und mit Lineal fotografieren", "Innen an derselben Stelle nach einem Riss suchen", "Nach Regen auf feuchte Stellen innen achten"],
      q: "Wie verläuft der Riss?", o: [
      ["fein", "Fein und netzartig im Putz", "Feine Netzrisse im Putz sind meist harmlos, sollten aber geschlossen werden, damit kein Wasser eindringt.", "niedrig", 0],
      ["schraeg", "Schräg oder treppenförmig im Mauerwerk oder Klinker", "Schräge oder treppenförmige Risse im Mauerwerk können auf Setzungen hindeuten. Besonders, wenn sie innen an derselben Stelle zu sehen sind.", "mittel", 1],
      ["anbau", "Senkrecht an einer Ecke oder einem Anbau", "Senkrechte Risse am Übergang zu Anbauten entstehen oft, weil sich beide Gebäudeteile unterschiedlich bewegen. Häufig fehlt eine Bewegungsfuge.", "mittel", 2],
      ["waechst", "Er wird breiter", "Ein wachsender Riss zeigt eine aktive Bewegung. Lassen Sie die Ursache zeitnah klären, bevor er geschlossen wird.", "hoch", 1]] },
    { v: "feucht", l: "Feuchte Stellen oder dunkle Verfärbungen", t: "Feuchte Fassade", to: "gebaeudeschaeden",
      x: "Eine Fassade darf nass werden, muss aber wieder abtrocknen. Bleiben Stellen dauerhaft dunkel oder feucht, nimmt die Wand mehr Wasser auf, als sie abgeben kann.",
      c: ["Schlagregen durch durchlässige Fugen, Putz oder Klinker", "Spritzwasser und fehlende Sockelabdichtung", "Undichte Fensterbänke, Abdeckungen oder Fallrohre"],
      tun: ["Beobachten, ob die Stellen nach Regen größer werden", "Fallrohre, Rinnen und Abdeckungen auf Schäden prüfen", "Innen an derselben Wand auf Feuchte und Schimmel achten"],
      q: "Wann und wo sieht man sie?", o: [
      ["wetter", "Nach Regen, vor allem auf der Wetterseite", "Feuchte auf der Wetterseite nach Regen spricht für Schlagregen. Bei Klinkerfassaden sind schadhafte Fugen oder eine durchfeuchtete Luftschicht dahinter häufige Ursachen.", "mittel", 0],
      ["sockel", "Unten am Sockel", "Feuchte am Sockel kommt meist von Spritzwasser, einem zu hohen Gelände oder einer fehlenden Sockelabdichtung.", "mittel", 1],
      ["stelle", "Unter Fensterbänken, an Rinnen oder Abdeckungen", "Feuchte unter Fensterbänken oder an Rinnen hat meist eine örtliche Ursache: ein undichter Anschluss oder eine Tropfkante, die fehlt.", "mittel", 2]] },
    { v: "ausbl", l: "Weiße Ausblühungen am Klinker", t: "Ausblühungen am Klinker", to: "gebaeudeschaeden",
      x: "Weiße Ausblühungen entstehen, wenn Wasser durch das Mauerwerk wandert und gelöste Salze oder Kalk an der Oberfläche zurücklässt.",
      c: ["Baufeuchte oder Kalk aus dem Mörtel", "Wasser, das über Abdeckungen, Rinnen oder Fensterbänke eindringt", "Schlagregen durch schadhafte Fugen"],
      tun: ["Trocken abbürsten und beobachten, ob die Ausblühungen wiederkommen", "Wasserführung über der Stelle prüfen: Abdeckung, Fensterbank, Rinne", "Fugen auf Risse und Auswaschungen ansehen"],
      q: "Seit wann gibt es die Ausblühungen?", o: [
      ["neu", "Am Neubau, in den ersten Jahren", "An neuen Fassaden sind Kalkausblühungen aus dem Mörtel häufig. Sie gehen oft von selbst zurück, wenn das Mauerwerk austrocknet.", "niedrig", 0],
      ["ploetzlich", "Plötzlich an einem älteren Haus", "Treten Ausblühungen an einem älteren Haus plötzlich auf, gelangt meist neu Wasser in die Wand. Das sollte gefunden werden, bevor Frost die Fassade schädigt.", "mittel", 1],
      ["stelle", "Immer an derselben Stelle", "Wiederkehrende Ausblühungen an einer Stelle haben fast immer eine örtliche Wasserquelle darüber.", "mittel", 1]] },
    { v: "putz", l: "Abplatzender Putz oder Farbe", t: "Abplatzender Putz", to: "gebaeudeschaeden",
      x: "Putz und Farbe platzen ab, wenn Feuchte und Salze dahinter arbeiten, wenn Frost das Wasser in der Wand sprengt oder wenn die Materialien nicht zueinander passen.",
      c: ["Feuchte und Salze im Mauerwerk", "Frostschäden durch durchfeuchtete Oberflächen", "Zu dichte Farbe oder ungeeigneter Putz auf altem Untergrund"],
      tun: ["Abgeplatzte Stellen fotografieren und markieren", "Prüfen, ob die Wand dahinter feucht ist", "Nicht einfach überstreichen, solange die Ursache unklar ist"],
      q: "Wo platzt es ab?", o: [
      ["sockel", "Am Sockel", "Am Sockel sind Feuchte und Salze aus dem Boden die häufigste Ursache. Eine dichte Farbe oder ein harter Putz verschärfen das oft noch.", "mittel", 0],
      ["gross", "Großflächig an der Fassade", "Großflächige Ablösungen deuten auf Feuchte in der Wand oder auf Materialien hin, die nicht zum Untergrund passen.", "mittel", 2],
      ["frost", "Vor allem nach Frost", "Schäden nach Frost zeigen, dass die Oberfläche durchfeuchtet ist. Gefrierendes Wasser sprengt Putz und Steine.", "mittel", 1]] }
  ] },
  { v: "fenster", l: "Am Fenster", s: [
    { v: "kondens", l: "Kondenswasser an der Scheibe", t: "Beschlagene Fenster", to: "gebaeudeschaeden", art: "ratgeber-schimmel-wohnung",
      x: "Wo Kondenswasser entsteht, sagt viel über die Ursache: Manchmal ist es ein Hinweis auf zu hohe Raumfeuchte, manchmal auf ein defektes Glas und manchmal sogar ein gutes Zeichen.",
      c: ["Hohe Raumfeuchte bei zu wenig Lüften", "Kühler Glasrand oder ältere Verglasung", "Defekter Randverbund der Scheibe"],
      tun: ["Luftfeuchte messen, ideal sind etwa 40 bis 60 Prozent", "Morgens kurz und kräftig lüften, Wasser vom Rahmen abwischen", "Auf Schimmel an Rahmen und Dichtungen achten"],
      q: "Wo bildet sich das Wasser?", o: [
      ["rand", "Innen, morgens am unteren Glasrand", "Am Glasrand ist die Scheibe am kühlsten. Etwas Kondensat dort ist bei hoher Raumfeuchte normal. Läuft es regelmäßig in den Rahmen, sollten Sie Lüften und Raumfeuchte anpassen.", "niedrig", 0],
      ["ganz", "Innen, über die ganze Scheibe", "Beschlägt die ganze Scheibe, ist die Raumfeuchte deutlich zu hoch oder die Verglasung alt. Dann steigt auch das Schimmelrisiko an Wänden und Laibungen.", "mittel", 0],
      ["zwischen", "Zwischen den Scheiben", "Feuchte zwischen den Scheiben bedeutet, dass der Randverbund undicht ist. Das ist kein Bauschaden, die Scheibe muss aber getauscht werden.", "niedrig", 2],
      ["aussen", "Außen auf der Scheibe, morgens", "Kondensat außen ist kein Mangel, sondern ein Zeichen guter Wärmedämmung: Die Scheibe lässt so wenig Wärme nach außen, dass sie draußen kalt bleibt.", "niedrig", 1]] },
    { v: "schimmel", l: "Schimmel an Rahmen oder Laibung", t: "Schimmel am Fenster", to: "gebaeudeschaeden", art: "ratgeber-schimmel-wohnung", cl: "BSV-Niewerth-Lueftungsprotokoll-Schimmel.pdf",
      x: "Die Fensterlaibung ist eine der kühlsten Stellen im Raum. Dort schlägt sich Feuchte zuerst nieder, besonders wenn der Anschluss zwischen Fenster und Wand nicht optimal ist.",
      c: ["Wärmebrücke an der Laibung oder am Fensteranschluss", "Zu hohe Raumfeuchte", "Undichter Anschluss, durch den Wasser eindringt"],
      tun: ["Befall fotografieren und kleine Flächen feucht entfernen", "Luftfeuchte zwei bis vier Wochen protokollieren", "Nach Regen prüfen, ob die Laibung nass wird"],
      q: "Seit wann tritt der Schimmel auf?", o: [
      ["neu", "Seit neue Fenster eingebaut wurden", "Ein sehr häufiger Fall: Neue Fenster sind dichter, die Feuchte bleibt im Raum, die Wand ist aber so kühl wie vorher. Oft kommt ein nicht fachgerechter Anschluss dazu.", "mittel", 0],
      ["winter", "Schon länger, vor allem im Winter", "Schimmel, der jeden Winter wiederkommt, spricht für eine Wärmebrücke an der Laibung im Zusammenspiel mit der Raumfeuchte.", "mittel", 0],
      ["regen", "Nach Regen ist die Stelle feucht", "Wird die Laibung nach Regen feucht, dringt Wasser durch einen undichten Anschluss ein. Das sollte zeitnah behoben werden, bevor die Wand durchfeuchtet.", "hoch", 2]] },
    { v: "bank", l: "Feuchte unter der Fensterbank", t: "Feuchte unter der Fensterbank", to: "gebaeudeschaeden",
      x: "Unter der Fensterbank treffen Fenster, Wand und Außenfensterbank zusammen. Dieser Anschluss ist besonders anfällig für Wasser von außen und für Kondensat.",
      c: ["Undichter Anschluss der Außenfensterbank", "Kondensat an einer Wärmebrücke unter dem Fenster", "Heizungsleitung unter der Fensterbank"],
      tun: ["Außenfensterbank auf Gefälle, Risse und dichte Anschlüsse prüfen", "Beobachten, ob die Feuchte nach Regen oder bei Kälte auftritt", "Heizkörperanschlüsse auf Tropfen prüfen"],
      q: "Wann ist es feucht?", o: [
      ["regen", "Nach Schlagregen", "Feuchte nach Regen deutet auf einen undichten Anschluss an der Außenfensterbank oder am Fenster hin. Das sollte zeitnah repariert werden.", "hoch", 0],
      ["winter", "Im Winter, auch ohne Regen", "Feuchte im Winter ohne Regen spricht für Kondensat an einer kalten Stelle unter dem Fenster.", "mittel", 1],
      ["immer", "Immer, unabhängig vom Wetter", "Bleibt es unabhängig vom Wetter feucht, sollte eine Heizungs- oder Wasserleitung ausgeschlossen werden.", "hoch", 2, "leckageortung"]] },
    { v: "zug", l: "Zugluft am Fenster", t: "Zugluft am Fenster", to: "thermografie",
      x: "Zugluft kostet Heizenergie und kann zu kalten Stellen führen, an denen sich Feuchte sammelt.",
      c: ["Verschlissene Dichtungen oder schlecht eingestellte Flügel", "Undichter Anschluss zwischen Fenster und Wand", "Undichter Rollladenkasten"],
      tun: ["Papiertest: Blatt einklemmen und Fenster schließen. Lässt es sich leicht herausziehen, schließt der Flügel nicht dicht", "Dichtungen auf Risse und Verformung ansehen", "Bei Wind mit der Hand die Anschlüsse abtasten"],
      q: "Wo zieht es?", o: [
      ["fluegel", "Am Flügel oder an der Dichtung", "Zug am Flügel lässt sich meist mit neuen Dichtungen oder einer Einstellung der Beschläge beheben.", "niedrig", 0],
      ["wand", "Zwischen Rahmen und Wand", "Zug zwischen Rahmen und Wand zeigt einen undichten Bauanschluss. Dort kann auch Feuchte in die Wand gelangen.", "mittel", 1],
      ["kasten", "Am Rollladenkasten darüber", "Alte Rollladenkästen sind oft weder gedämmt noch dicht. Das ist eine typische Schwachstelle, die sich gut nachbessern lässt.", "niedrig", 2]] }
  ] },
  { v: "dach", l: "Dach oder Dachboden", s: [
    { v: "fleck", l: "Wasserflecken am Holz oder an der Dämmung", t: "Feuchte unter dem Dach", to: "gebaeudeschaeden",
      x: "Feuchte unter dem Dach kann von außen kommen oder von innen. Warme, feuchte Raumluft, die in die Dachkonstruktion gelangt, kann dort genauso Schäden verursachen wie ein undichtes Dach.",
      c: ["Undichte Eindeckung oder Anschlüsse an Kamin, Gauben oder Dachfenstern", "Kondensat durch fehlende Luftdichtheit oder Dampfbremse", "Flugschnee oder Eisrückstau"],
      tun: ["Flecken markieren und nach Regen und bei Frost vergleichen", "Fotos vom Dachboden machen", "Nicht selbst aufs Dach steigen, Drohnenbilder zeigen viel ohne Risiko"],
      q: "Wann werden die Stellen feucht?", o: [
      ["regen", "Nach Regen oder Sturm", "Feuchte nach Regen spricht für eine Undichtigkeit in der Eindeckung oder an Anschlüssen wie Kamin, Gauben oder Dachfenstern.", "hoch", 0],
      ["frost", "Im Winter bei Frost, ohne Regen", "Feuchte bei Frost ohne Regen ist typisch für Kondensat: Warme Raumluft dringt durch Undichtheiten in die Dämmung und kühlt dort ab.", "mittel", 1],
      ["schnee", "Bei Schneeschmelze", "Feuchte bei Schneeschmelze kommt oft von Flugschnee, der unter die Ziegel geweht wurde, oder von Eis, das sich an der Traufe staut.", "mittel", 2]] },
    { v: "schimmel", l: "Schimmel am Dachstuhl oder an der Schalung", t: "Schimmel im Dachbereich", to: "gebaeudeschaeden",
      x: "Schimmel an Holz und Schalung im Dach entsteht fast immer durch Feuchte, die nicht abtrocknen kann. Bleibt das unbemerkt, kann das Holz Schaden nehmen.",
      c: ["Feuchte Raumluft dringt in die Dachkonstruktion ein", "Unzureichende Belüftung des Dachraums", "Undichtigkeit von außen"],
      tun: ["Befallene Stellen fotografieren", "Luke oder Treppe zum Dachboden auf Dichtheit prüfen", "Beobachten, ob die Stellen im Winter feuchter werden"],
      q: "Wie ist das Dach gedämmt?", o: [
      ["ausgebaut", "Die Dachschräge ist ausgebaut und gedämmt", "Bei ausgebauten Dächern ist eine undichte Dampfbremse oder Luftdichtheitsschicht die häufigste Ursache. Das sollte untersucht werden, bevor neu verkleidet wird.", "hoch", 0],
      ["decke", "Nur die oberste Geschossdecke ist gedämmt", "Ist nur die Geschossdecke gedämmt, kommt die Feuchte oft über eine undichte Bodenluke oder fehlende Belüftung in den kalten Dachraum.", "mittel", 1],
      ["unklar", "Weiß ich nicht", "Kein Problem. Bei einem Ortstermin lässt sich der Aufbau schnell klären, oft auch mit Wärmebild.", "mittel", 0]] },
    { v: "ziegel", l: "Verrutschte oder kaputte Ziegel", t: "Schaden an der Dacheindeckung", to: "gebaeudeschaeden",
      x: "Verrutschte oder gebrochene Ziegel lassen Wasser in die Dachkonstruktion. Der Schaden darunter bleibt oft lange unbemerkt.",
      c: ["Sturmschaden", "Alterung, Frost und Bewuchs", "Mangelhafte Befestigung"],
      tun: ["Schaden vom Boden aus fotografieren, nicht selbst aufs Dach steigen", "Dachboden nach Feuchte absuchen", "Bei Sturmschaden umgehend die Versicherung informieren"],
      q: "Wie ist der Schaden entstanden?", o: [
      ["sturm", "Nach einem Sturm", "Nach einem Sturm sollte das Dach schnell provisorisch gesichert werden. Melden Sie den Schaden umgehend Ihrer Versicherung, eine Dokumentation mit Drohnenbildern hilft dabei.", "hoch", 0],
      ["alt", "Schleichend, das Dach ist schon älter", "Bei älteren Dächern lohnt sich eine Bestandsaufnahme: Wie ist der Zustand von Eindeckung, Lattung und Anschlüssen, und wie lange hält das Dach noch?", "mittel", 1]] }
  ] },
  { v: "bad", l: "Bad, Küche oder Leitungen", s: [
    { v: "fleck", l: "Wasserfleck an Decke oder Wand daneben", t: "Wasserfleck in der Nähe von Bad oder Küche", to: "leckageortung", cl: "BSV-Niewerth-Checkliste-Wasserschaden.pdf",
      x: "Wasserflecken neben oder unter Bad und Küche haben meist eine von drei Ursachen. Wann der Fleck wächst, verrät viel darüber, welche es ist.",
      c: ["Undichte Abdichtung oder Fugen an Dusche und Wanne", "Undichte Druckleitung für Trink- oder Heizungswasser", "Undichter Abfluss oder Abwasseranschluss"],
      tun: ["Rand des Flecks mit Datum markieren", "Wasserzähler beobachten, während alle Hähne geschlossen sind", "Dusche oder Wanne ein paar Tage nicht nutzen und beobachten"],
      q: "Wann wird der Fleck größer?", o: [
      ["dusche", "Wenn geduscht oder gebadet wird", "Wächst der Fleck beim Duschen, ist meist die Abdichtung unter den Fliesen oder eine Fuge undicht. Wasser läuft hinter die Fliesen und sammelt sich.", "hoch", 0],
      ["immer", "Auch wenn nichts benutzt wird", "Wächst der Fleck auch ohne Nutzung, steht vermutlich eine Druckleitung unter Wasser. Das sollte schnell geortet werden.", "hoch", 1],
      ["abfluss", "Wenn ein Abfluss benutzt wird", "Tritt Wasser nur beim Ablaufen auf, ist ein Abwasseranschluss oder Abfluss die wahrscheinliche Ursache.", "mittel", 2]] },
    { v: "zaehler", l: "Wasserzähler läuft, obwohl alles zu ist", t: "Wasserzähler läuft weiter", to: "leckageortung", cl: "BSV-Niewerth-Checkliste-Wasserschaden.pdf",
      x: "Dreht sich der Wasserzähler, obwohl alle Entnahmestellen geschlossen sind, fließt irgendwo Wasser ab. Das ist ein klarer Hinweis auf eine Undichtigkeit.",
      c: ["Nachlaufende Toilettenspülung oder tropfende Armatur", "Verdecktes Leck in Wand oder Boden", "Undichte Leitung außerhalb des Hauses"],
      tun: ["Toilettenspülung prüfen: etwas Lebensmittelfarbe in den Spülkasten geben und eine Stunde nicht spülen", "Alle Armaturen auf Tropfen prüfen", "Zählerstand notieren und nach einigen Stunden ohne Nutzung vergleichen"],
      q: "Sehen Sie irgendwo Feuchte?", o: [
      ["nein", "Nein, nirgends", "Ohne sichtbare Feuchte sitzt das Leck oft verdeckt in Wand oder Boden oder an der Leitung im Erdreich. Prüfen Sie zuerst die Toilettenspülungen, dann lohnt eine Leckageortung.", "hoch", 1],
      ["ja", "Ja, eine feuchte Stelle", "Das Leck liegt dann wahrscheinlich in der Nähe, aber nicht zwingend direkt dahinter. Wasser wandert entlang der Leitungen.", "hoch", 1],
      ["wc", "Die Toilettenspülung läuft nach", "Eine nachlaufende Spülung ist die häufigste harmlose Ursache. Ein neues Spülventil löst das meist. Prüfen Sie danach den Zähler noch einmal.", "niedrig", 0]] },
    { v: "fugen", l: "Schimmel in Fugen oder an der Decke", t: "Schimmel im Bad", to: "gebaeudeschaeden", art: "ratgeber-schimmel-wohnung",
      x: "Im Bad entsteht viel Feuchte in kurzer Zeit. Etwas Schimmel in Silikonfugen ist häufig, wiederkehrender Befall an Decke oder hinter Fliesen dagegen ein Warnsignal.",
      c: ["Zu wenig Lüftung nach dem Duschen", "Wärmebrücke an Außenwand oder Decke", "Undichte Abdichtung hinter den Fliesen"],
      tun: ["Nach dem Duschen Wände abziehen und mindestens zehn Minuten lüften", "Lüfter auf Funktion prüfen, falls kein Fenster vorhanden ist", "Fliesen abklopfen: Hohl klingende Bereiche können auf Feuchte dahinter hinweisen"],
      q: "Wo sitzt der Schimmel?", o: [
      ["silikon", "In den Silikonfugen", "Schimmel in Silikonfugen ist meist ein Pflegethema. Die Fuge sollte erneuert werden. Prüfen Sie dabei, ob es dahinter feucht ist.", "niedrig", 0],
      ["decke", "An der Decke oder in den Ecken", "Schimmel an Decke und Ecken entsteht meist, wenn die Feuchte nach dem Duschen nicht schnell genug abgelüftet wird, oft verstärkt durch eine kühle Außenwand.", "mittel", 1],
      ["fliesen", "Hinter den Fliesen kommt Feuchte heraus oder Fliesen sind hohl", "Feuchte hinter den Fliesen deutet auf eine undichte Abdichtung hin. Dann wird die Wand dahinter nass, das sollte zeitnah untersucht werden.", "hoch", 2, "leckageortung"]] },
    { v: "heizung", l: "Heizung verliert Druck", t: "Druckverlust in der Heizung", to: "leckageortung",
      x: "Ein Heizungssystem ist geschlossen. Muss regelmäßig Wasser nachgefüllt werden, geht es irgendwo verloren, oft unsichtbar in Wand oder Boden.",
      c: ["Undichte Stelle im Heizkreis, zum Beispiel an der Fußbodenheizung", "Defektes Ausdehnungsgefäß oder Sicherheitsventil", "Undichte Heizkörperanschlüsse"],
      tun: ["Druck wöchentlich notieren", "Heizkörperanschlüsse und Ventile auf Feuchte prüfen", "Den Heizungsbauer Ausdehnungsgefäß und Sicherheitsventil prüfen lassen"],
      q: "Wie oft muss nachgefüllt werden?", o: [
      ["oft", "Mehrmals im Jahr oder öfter", "Regelmäßiger Druckverlust ist ein deutlicher Hinweis auf ein Leck. Ist die Technik in Ordnung, sollte die Leitung geortet werden, bevor Wasser in Estrich und Dämmung zieht.", "hoch", 0],
      ["selten", "Selten, etwa einmal im Jahr", "Ein geringer Druckverlust über das Jahr ist meist normal, zum Beispiel durch Entlüften. Behalten Sie ihn im Blick.", "niedrig", 1]] }
  ] },
  { v: "boden", l: "Am Boden", s: [
    { v: "feucht", l: "Boden feucht, Parkett oder Laminat wölbt sich", t: "Feuchter Fußboden", to: "leckageortung", cl: "BSV-Niewerth-Checkliste-Wasserschaden.pdf",
      x: "Wölbt sich ein Holzboden oder ist der Boden feucht, ist Wasser in den Fußbodenaufbau gelangt. Im Estrich und in der Dämmung darunter bleibt es oft lange unbemerkt.",
      c: ["Undichte Leitung oder Fußbodenheizung", "Feuchte von unten durch Bodenplatte oder Kellerdecke", "Restfeuchte nach einem früheren Wasserschaden"],
      tun: ["Fläche fotografieren und markieren", "Wasserzähler und Heizungsdruck beobachten", "Nichts verschließen oder neu verlegen, bevor die Ursache klar ist"],
      q: "Wo ist der Boden betroffen?", o: [
      ["heizung", "Über einer Fußbodenheizung", "Über einer Fußbodenheizung ist ein Leck im Heizkreis wahrscheinlich, besonders bei Druckverlust. Das sollte zeitnah geortet werden.", "hoch", 0],
      ["leitung", "In der Nähe von Bad, Küche oder Leitungen", "In der Nähe von Wasseranschlüssen ist eine undichte Leitung die wahrscheinlichste Ursache.", "hoch", 0],
      ["eg", "Im Erdgeschoss ohne Keller", "Im Erdgeschoss ohne Keller kann Feuchte auch von unten durch die Bodenplatte kommen, wenn die Abdichtung fehlt oder schadhaft ist.", "mittel", 1, "gebaeudeschaeden"],
      ["schaden", "Nach einem früheren Wasserschaden", "Nach einem Wasserschaden bleibt oft Restfeuchte in Estrich und Dämmung. Erst messen, dann neu belegen.", "mittel", 2, "gebaeudeschaeden"]] },
    { v: "riss", l: "Riss im Estrich oder in den Fliesen", t: "Riss im Boden", to: "gebaeudeschaeden",
      x: "Risse im Estrich oder in Fliesen entstehen durch Schwinden beim Trocknen, durch Bewegung im Untergrund oder weil Fugen fehlen.",
      c: ["Schwindrisse im Estrich beim Trocknen", "Fehlende oder falsch gesetzte Bewegungsfugen", "Bewegung im Untergrund"],
      tun: ["Risse markieren und messen", "Fliesen abklopfen und hohl klingende Bereiche notieren", "Bei einem Neubau den Estrich vor dem Belegen messen lassen"],
      q: "Wie ist die Situation?", o: [
      ["neubau", "Neubau oder neuer Estrich", "Bei neuem Estrich sind Schwindrisse häufig. Wichtig ist, dass der Estrich vor dem Belegen trocken genug ist. Das lässt sich mit der CM-Messung sicher feststellen.", "mittel", 0],
      ["waechst", "Älterer Boden, der Riss wird größer", "Wächst ein Riss im Boden, bewegt sich etwas im Untergrund. Das sollte untersucht werden.", "mittel", 2],
      ["hohl", "Fliesen klingen hohl oder lösen sich", "Hohl klingende Fliesen haben sich vom Untergrund gelöst. Oft fehlen Bewegungsfugen oder der Untergrund war beim Verlegen nicht geeignet.", "niedrig", 1]] },
    { v: "geruch", l: "Muffiger Geruch aus dem Boden", t: "Muffiger Geruch aus dem Fußboden", to: "gebaeudeschaeden",
      x: "Riecht es muffig aus dem Bodenbereich, kann Feuchte im Fußbodenaufbau stehen. In der Dämmschicht unter dem Estrich kann sich dann unbemerkt Schimmel bilden.",
      c: ["Restfeuchte nach einem Wasserschaden", "Feuchte von unten durch die Bodenplatte", "Verdecktes Leck"],
      tun: ["Fußleisten abnehmen und dahinter nachsehen", "Raumluftfeuchte messen", "Nach früheren Wasserschäden fragen, zum Beispiel beim Vorbesitzer"],
      q: "Gab es dort früher einen Wasserschaden?", o: [
      ["ja", "Ja", "Nach einem Wasserschaden ist Restfeuchte in Estrich und Dämmung eine sehr wahrscheinliche Ursache. Eine Feuchtemessung im Fußbodenaufbau bringt Klarheit.", "hoch", 0],
      ["nein", "Nein oder nicht bekannt", "Ohne bekannten Wasserschaden sollten Feuchte von unten und ein verdecktes Leck geprüft werden.", "mittel", 1]] }
  ] }
];
function initCheck(t) {
  let step = 0, a = [];
  const B = () => CHECK.find(b => b.v === a[0]), Sy = () => B().s.find(s => s.v === a[1]), O = () => Sy().o.find(o => o[0] === a[2]);
  const URG = { hoch: "Bitte zeitnah ansehen lassen", mittel: "Ursache klären lassen", niedrig: "Beobachten und selbst prüfen" };
  const render = () => {
    if (step < 3) {
      const q = step === 0 ? "Wo zeigt sich der Schaden?" : step === 1 ? `${B().l}: Was sehen oder bemerken Sie?` : Sy().q;
      const opts = step === 0 ? CHECK.map(b => [b.v, b.l]) : step === 1 ? B().s.map(s => [s.v, s.l]) : Sy().o.map(o => [o[0], o[1]]);
      t.innerHTML = `<div class="chk-top"><span class="kurz-k">Frage ${step + 1} von 3</span><div class="chk-bar"><i style="width:${(step + 1) / 3 * 100}%"></i></div></div>
        <h2>${q}</h2><div class="chk-opts">${opts.map(([v, l]) => `<button type="button" class="chk-opt" data-v="${v}">${l}</button>`).join("")}</div>
        ${step ? '<button type="button" class="chk-back" data-back>← Zurück</button>' : ""}`;
      return;
    }
    const b = B(), s = Sy(), o = O(), to = o[5] || s.to, l = LEISTUNGEN.find(x => x.slug === to), art = s.art && RATGEBER.find(x => x.slug === s.art), c = CTA[to];
    const cl = s.cl ? CHECKLISTEN.find(x => x.file === s.cl) : (art ? CHECKLISTEN.find(x => x.art === art.slug) : null);
    const causes = [s.c[o[4]], ...s.c.filter((_, i) => i !== o[4])];
    const sum = `${b.l} · ${s.l} · ${o[1]}`;
    const msg = `Schadens-Check: ${sum}.\n\n`;
    t.innerHTML = `<div class="chk-top"><span class="kurz-k">Meine erste Einschätzung</span><span class="chk-badge ${o[3]}">${URG[o[3]]}</span></div>
      <h2>${s.t}</h2><p class="chk-sum">${sum}</p>
      <p><b>${o[2]}</b></p><p>${s.x}</p>
      <h3>Mögliche Ursachen</h3><ol class="chk-causes">${causes.map((x, i) => `<li${i ? "" : ' class="top"'}>${x}${i ? "" : " <em>am wahrscheinlichsten</em>"}</li>`).join("")}</ol>
      <h3>Das können Sie selbst prüfen</h3><ul class="checks">${s.tun.map(x => `<li>${use("i-check")}<span>${x}</span></li>`).join("")}</ul>
      <div class="chk-act"><a class="btn btn--primary" href="#kontakt" data-thema="${to}" data-label="${c[0]}" data-msg="${msg.replace(/"/g, "&quot;")}">${c[0]}&nbsp;<span class="arrow">→</span></a>
      ${art ? `<a class="btn btn--outline" href="#${art.slug}">Ratgeber lesen</a>` : `<a class="btn btn--outline" href="#${l.slug}">Mehr zu ${l.title}</a>`}${cl ? clLink(cl, "btn btn--outline") : ""}</div>
      <p class="chk-note">Eine erste Einordnung nach Ihren Angaben, keine Ferndiagnose. Sicher beurteilen lässt sich ein Schaden erst vor Ort, oft mit Messungen. <button type="button" class="chk-back" data-restart>Neu starten</button></p>`;
  };
  t.addEventListener("click", e => {
    const o = e.target.closest(".chk-opt");
    if (o) { a[step] = o.dataset.v; a.length = step + 1; step++; render(); t.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    if (e.target.closest("[data-back]")) { step--; render(); }
    if (e.target.closest("[data-restart]")) { step = 0; a = []; render(); }
  });
  render();
}
