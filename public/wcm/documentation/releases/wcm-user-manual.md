# WCM — Manuale Utente

**Versione:** 0.6  
**Data:** 2026-08-24  
**Stato:** ACTIVE / LIVING PROJECTION / FIELD VALIDATION  
**Pubblico:** utilizzatori WCM, owner, Board e persone senza background tecnico  
**Authority:** DEC-010 + DEC-014; human-facing projection, non source of truth

---

# 1. Prima di cominciare: non devi conoscere la tecnologia per usare WCM

WCM utilizza termini tecnici perché dietro l'interfaccia esistono workflow, automazioni, controlli e registri. Ma **non devi conoscere GitHub, Supabase, runtime o projector per capire se il sistema sta lavorando bene e se serve una tua decisione**.

Dal punto di vista dell'utente, WCM può essere descritto così:

> **È un sistema che permette all'intelligenza artificiale di lavorare su progetti che durano nel tempo, ricordando ciò che è stato deciso, continuando il lavoro da dove era arrivato, controllando la propria memoria e fermandosi quando una decisione deve essere presa da una persona.**

Le cinque domande fondamentali sono sempre le stesse:

1. Dove siamo?
2. Che cosa sta facendo WCM?
3. C'è qualcosa che richiede me?
4. Posso fidarmi dello stato e della memoria che vedo?
5. Che cosa ha imparato il sistema dall'esperienza?

Mission Control serve soprattutto a rispondere a queste domande.

---

# 2. Un'immagine semplice: WCM come una piccola organizzazione

Puoi immaginare WCM come un'organizzazione invisibile che lavora dietro Mission Control.

**Wise** è la parte che comprende: interpreta obiettivi, problemi, significato e priorità.

La **memoria persistente** è il luogo in cui vengono conservate le cose che non devono andare perse quando una conversazione termina.

Le **automazioni deterministiche** fanno i lavori meccanici: aggiornano stati, controllano regole, registrano dati, evitano duplicazioni.

**Mission Control** è la sala di controllo che ti mostra in modo leggibile ciò che sta succedendo.

**Tu**, nei punti previsti, mantieni l'ultima parola sulle decisioni che WCM non può prendere autonomamente.

```text
TU DAI DIREZIONE E AUTHORITY
            ↓
       WISE LAVORA
            ↓
 WCM CONSERVA E CONTROLLA
            ↓
AUTOMAZIONI SINCRONIZZANO
            ↓
MISSION CONTROL TI INFORMA
            ↓
SE SERVE UNA DECISIONE → TORNA A TE
```

---

# 3. Da dove si entra

Il punto principale è Mission Control:

`/wcm`

Dalla Home puoi entrare nei progetti, vedere se qualcosa richiede la tua attenzione, consultare documenti, controllare la salute del sistema, leggere i learning e aprire la documentazione.

Una regola utile:

> **Mission Control è il cruscotto, non il motore.**

Normalmente puoi fidarti di ciò che vedi. Se però una schermata dovesse essere in ritardo, non bisogna modificare il progetto per far coincidere la dashboard: è la dashboard che deve riallinearsi alla fonte corretta.

---

# 4. La Home: da dove partire senza guardare tutto

Quando entri non serve leggere ogni card.

## 4.1 Needs Stefano

Se il numero è maggiore di zero, aprilo per primo.

Un Need significa, in sostanza:

> **“WCM è arrivato a un punto in cui non può o non deve decidere da solo.”**

Potrebbe chiederti di approvare un documento, scegliere tra alternative, autorizzare un cambiamento oppure fornire un'informazione che soltanto tu possiedi.

Se non ci sono Need, non significa che WCM non stia lavorando. Significa semplicemente che in quel momento non richiede te.

## 4.2 Pending

Pending significa:

> **“Hai già deciso; WCM sta ancora applicando gli effetti.”**

È importante perché evita un comportamento molto umano: premere di nuovo pensando che il primo comando non sia stato ricevuto.

Se una decisione è Pending, normalmente non devi fare nulla.

## 4.3 Progetti

Qui trovi il portfolio WCM. Ogni progetto possiede la propria situazione, i propri workflow e, quando necessario, i propri manuali.

## 4.4 Documenti

Qui puoi trovare materiale da leggere, Candidate, documenti approvati, report o altri output.

**Il fatto che tu possa leggere o scaricare un file non significa che quel file sia approvato.**

## 4.5 WCM Learning

Questa pagina parla del metodo WCM, non del contenuto di un progetto. Mostra l'esperienza che il sistema sta trasformando in conoscenza metodologica.

## 4.6 Documentazione

Qui trovi i manuali generali e quelli specifici dei progetti, con indice cliccabile e release distribuibili quando verificate.

---

# 5. Come capire se WCM sta lavorando o aspetta te

Nella sezione Execution Health puoi incontrare termini tecnici. Ecco il loro significato umano.

## `ACTIVE`

**Il workflow ha ancora lavoro autorizzato da fare.**

Non devi necessariamente intervenire.

## `INTERRUPTED_RESUMABLE`

**Il lavoro non è finito, ma qualcosa di tecnico ha impedito di proseguire.**

WCM conserva il punto da cui ripartire. Non è necessario ricostruire a mano il lavoro già fatto.

## `WAITING_AUTHORITY`

**WCM ha fatto tutto ciò che poteva fare entro il proprio mandato e ora aspetta una decisione umana.**

È un arresto corretto, non un guasto.

## `BLOCKED`

**C'è un ostacolo reale.**

Può essere tecnico, informativo o semantico. Il dettaglio deve spiegare quale.

## `COMPLETED`

**Il workflow è realmente terminato**, non semplicemente la chat o l'heartbeat.

Prima di dichiarare `COMPLETED`, WCM deve verificare che output, stato, memoria e passaggi di chiusura siano coerenti.

## `CANCELLED`

Il workflow è stato annullato e non deve riprendere.

---

# 6. Perché WCM non dimentica il lavoro quando cambia sessione

Dietro ogni workflow importante esiste un checkpoint persistente.

Pensa a un **segnalibro intelligente** che dice:

> “Ho già fatto A, B e C. Il prossimo passaggio è D. Posso continuare senza ripetere ciò che è già stato completato.”

Per questo una regola centrale è:

```text
FINE SESSIONE ≠ FINE WORKFLOW
```

Una nuova sessione o un nuovo heartbeat devono leggere il checkpoint e riprendere dal punto corretto.

Questo è uno dei meccanismi che permettono a WCM di lavorare su attività lunghe senza dipendere dalla memoria della conversazione corrente.

---

# 7. Che cos'è un heartbeat

Un **heartbeat** è semplicemente una sveglia periodica.

Non dice a Wise: “scrivi il Capitolo 7” o “fai la prossima analisi”. Gli dice, più o meno:

> “Riattivati, guarda qual è lo stato reale e verifica se esiste lavoro autorizzato da continuare.”

A quel punto Wise ricostruisce il task dalla memoria persistente.

Questa distinzione è importante perché evita che una vecchia istruzione programmata continui a comandare un lavoro che nel frattempo è cambiato.

---

# 8. Ultimo heartbeat: cosa significa davvero

Mission Control può mostrarti quando il sistema si è svegliato l'ultima volta.

Questo dato indica **liveness**, cioè che il meccanismo si è attivato.

Non indica automaticamente che il progetto sia avanzato.

Esempio:

- il progetto è `WAITING_AUTHORITY`;
- l'heartbeat parte regolarmente;
- controlla lo stato;
- scopre correttamente che manca ancora la tua decisione;
- termina senza cambiare il progetto.

L'ultimo heartbeat sarà recente, ma il progetto resterà correttamente `WAITING_AUTHORITY`.

Dal 24 agosto questa telemetria viene registrata con un meccanismo deterministico separato: il cognitive heartbeat comunica l'esito, mentre una routine meccanica aggiorna il dato di liveness in modo ordinato e controllato.

In parole semplici:

> **“Il sistema è vivo” e “il progetto è avanzato” sono due informazioni diverse.**

---

# 9. Board Gate: quando il sistema deve fermarsi

Un **Board Gate** è un punto in cui WCM deve volontariamente smettere di avanzare.

Il flusso tipico è:

```text
WCM LAVORA
→ prepara il materiale
→ esegue i controlli previsti
→ arriva al gate
→ crea un Need
→ TU DECIDI
→ la decisione viene registrata
→ WCM applica gli effetti
→ il workflow riparte
```

Il Board Gate serve a evitare che l'autonomia operativa venga confusa con il diritto di decidere.

---

# 10. Cosa succede quando premi Approva

Questa è una distinzione importante e spesso invisibile all'utente.

Quando premi un comando, possono esserci tre momenti diversi:

1. **hai espresso la decisione**;
2. **il sistema ha registrato in modo verificabile la tua authority**;
3. **il workflow ha applicato tutti gli effetti della decisione**.

Non sono necessariamente istantanei.

Per questo puoi vedere Pending anche dopo aver approvato.

In termini tecnici il sistema crea un'**Authority Receipt**, cioè una ricevuta durevole della decisione. Ma per l'utente il concetto è più semplice:

> **WCM deve poter dimostrare che aveva il permesso di fare ciò che ha fatto.**

---

# 11. Il Change Gate del metodo WCM

Il WCM può anche imparare qualcosa che suggerisce di cambiare il proprio metodo.

In quel caso viene aperto un **WCM Change Gate**.

Qui la separazione è ancora più rigorosa:

```text
TU APPROVI IL CAMBIAMENTO
        ↓
AUTHORITY VIENE REGISTRATA
        ↓
IL CAMBIAMENTO VIENE APPLICATO
        ↓
IL RISULTATO VIENE VERIFICATO
        ↓
IL LEARNING PUÒ DIVENTARE PROMOTED
```

Un clic di approvazione **non modifica direttamente il metodo**.

Puoi quindi incontrare stati diversi:

- `AUTHORITY_APPROVED` — hai autorizzato;
- `EXECUTED` — la modifica è stata realmente applicata;
- `PROMOTED` — il learning è entrato nella baseline metodologica prevista.

Questa separazione rende il cambiamento più tracciabile e meno fragile.

---

# 12. Documenti: Draft, Candidate, Approved e Frozen

I nomi cambiano leggermente in base al progetto, ma il significato generale è questo.

**Draft / Working** — materiale di lavoro che può ancora cambiare.

**Candidate** — una versione proposta, abbastanza matura per essere valutata, ma non ancora approvata.

**Unapproved** — materiale esplicitamente non approvato.

**Approved / Frozen** — il documento è stato approvato nel perimetro previsto ed è diventato parte della baseline.

**Board material** — materiale preparato per aiutarti a decidere; non è necessariamente l'oggetto che stai approvando.

Una regola da ricordare:

> **download ≠ approval ≠ authority**

---

# 13. Activity, Roadmap, State e Need non sono la stessa cosa

Queste aree rispondono a domande diverse.

**Activity:** “Che cosa è successo?”

**Roadmap:** “Qual è il percorso previsto?”

**Execution / State:** “Dove siamo realmente adesso?”

**Need:** “Che cosa richiede me adesso?”

Se la Roadmap dice che dopo il Capitolo 7 viene il Capitolo 8 ma Execution mostra `WAITING_AUTHORITY` sul Capitolo 7, il Capitolo 8 non è ancora il lavoro corrente.

---

# 14. Knowledge Health: non è un voto al progetto

Knowledge Health misura la **salute della memoria organizzativa**, non la qualità artistica o commerciale di ciò che stai facendo.

## `HEALTHY`

I controlli previsti non stanno rilevando problemi strutturali rilevanti e il check è sufficientemente recente.

## `DEGRADED`

Esistono anomalie o debiti. Non significa automaticamente che il progetto sia bloccato.

La domanda utile è:

> “Questi problemi rendono insicuro il prossimo passaggio?”

## `STALE` / `CHECK REQUIRED`

Il controllo è precedente a un cambiamento importante. Va aggiornato prima di considerarlo corrente.

## `CRITICAL`

Esiste un problema incompatibile con un lavoro sensibile alla conoscenza.

---

# 15. Knowledge Assurance: il controllo può partire da solo

Knowledge Assurance è il sistema di controllo della memoria WCM.

Oggi può partire in tre modi:

- quando cambia qualcosa di rilevante;
- quando un workflow lo chiama perché necessita di un controllo fresh;
- periodicamente come safety net, ogni sei ore.

Il funzionamento semplificato è:

```text
CONTROLLA
→ TROVA UN PROBLEMA?
   ├─ NO → registra il risultato
   └─ SÌ
       → la correzione è meccanica e autorizzata?
          ├─ SÌ → ripara → ricontrolla
          └─ NO → non inventa → escalation
```

Quindi non devi avviare manualmente un controllo dopo ogni modifica.

---

# 16. Una nuova idea utile: il controllo come dipendenza interna

Un workflow può sapere in anticipo che, prima di un passaggio importante, gli serve un Knowledge Assurance aggiornato.

È come dire:

> “Non portarmi al Board Gate finché non hai verificato che la memoria usata per preparare il materiale sia abbastanza fresca e coerente.”

Il sistema può eseguire questo controllo automaticamente e registrare che la dipendenza è stata soddisfatta.

Se il risultato è `DEGRADED` ma non riguarda il lavoro corrente, il workflow può comunque avanzare. Se è realmente bloccante, si ferma.

Questo meccanismo è già stato usato nel workflow del Capitolo 7 di PRIMA DI NOI.

---

# 17. Knowledge Steward: manutentore, non autore

Il Knowledge Steward può sistemare solo problemi per i quali la soluzione è già determinata da regole autorizzate.

Non può decidere:

- quale strategia adottare;
- che cosa deve significare un requisito;
- quale versione narrativa è corretta;
- quale decisione dovrebbe prendere l'owner.

Una buona regola mentale è:

> **Knowledge Steward mantiene la memoria; Wise interpreta; l'owner decide ciò che è riservato all'owner.**

---

# 18. Perché WCM protegge le scritture persistenti

Nel lavoro reale abbiamo imparato che “la chiamata è riuscita” non significa sempre “il risultato è corretto”.

Una write può essere tecnicamente valida ma:

- puntare al file sbagliato;
- usare una versione vecchia;
- avere un payload incompleto;
- entrare in conflitto con un altro writer;
- superare il perimetro autorizzato.

Per questo esiste **Persistent Mutation Safety — PROT-017**.

Prima delle scritture più sensibili WCM deve controllare target, payload, versione attesa, ownership e risultato finale.

Per l'utente significa una cosa semplice:

> **le operazioni persistenti importanti non dovrebbero essere considerate riuscite soltanto perché un'API ha risposto “OK”.**

---

# 19. WCM Learning: come il sistema trasforma esperienza in metodo

WCM Learning raccoglie incidenti, successi e failure mode che potrebbero insegnare qualcosa al sistema.

Gli stati non sono tutti equivalenti.

**Evidence** — è successo qualcosa di osservabile.

**Candidate / Validated** — esiste un learning plausibile o sufficientemente sostenuto.

**Promoted** — il learning ha effettivamente prodotto una modifica alla baseline attraverso il processo previsto.

Un esempio reale è `WCM-LRN-004`: inizialmente era una lezione sulle scritture remote; dopo evidence, review, approvazione e propagazione è diventato il protocollo `PROT-017 Persistent Mutation Safety`.

Quindi:

> **WCM impara, ma non trasforma ogni osservazione in una nuova regola.**

---

# 20. Documentation Center

Percorso:

`/wcm/documentation`

La documentazione è organizzata in due livelli:

```text
WCM
├─ Technical Reference
├─ Executive / Client Guide
└─ User Manual

PROGETTI
└─ PRIMA DI NOI
   ├─ Technical Reference
   ├─ Executive / Editorial Partner Guide
   └─ User Manual
```

Nel reader trovi un indice cliccabile. Word/PDF vengono resi disponibili quando la release corrispondente è stata generata e verificata.

Il Markdown canonico resta il master.

---

# 21. Cosa succede automaticamente e quando servi tu

| Situazione | Cosa fa WCM | Cosa fai tu |
|---|---|---|
| workflow ha un next step autorizzato | continua | nulla |
| termina la sessione ma il workflow è aperto | conserva/riprende il checkpoint | nulla |
| cambia lo stato esecutivo | state/projector si riallineano | nulla |
| heartbeat si attiva | ricostruisce il lavoro reale | nulla salvo Need |
| serve un Knowledge check fresh | lo richiama/esegue | nulla se non bloccante |
| anomaly meccanica allowlisted | può riparare e ricontrollare | nulla |
| decisione riservata | crea Need/gate e si ferma | decidi |
| WCM Change Gate | registra la tua authority separatamente dall'esecuzione | approva/rifiuta/chiedi modifiche |
| learning evidence | raccoglie e rivede | nulla salvo Change Gate |
| persistent write sensibile | applica safety guard | normalmente nulla |

---

# 22. Come iniziare un nuovo progetto

Quando chiedi di inserire un nuovo progetto nel WCM, il sistema non dovrebbe improvvisare una procedura diversa ogni volta.

Il percorso generale prevede:

```text
INTENZIONE
→ CLASSIFICAZIONE
→ ADMISSION PREVIEW
→ ADMISSION GATE
→ ACQUISIZIONE FONTI OWNER
→ MEMORIA + GOAL + STATE + ROADMAP
→ READINESS
→ ACTIVATION GATE
→ WCM RUN
```

Quando il progetto raggiunge sufficiente complessità/maturità, viene valutata anche la creazione dei suoi manuali specifici.

---

# 23. Come parlare con Wise

Non devi trasformare ogni richiesta in un ticket tecnico perfettamente scritto.

Puoi dire:

- “Voglio inserire questo nuovo progetto nel WCM.”
- “Fammi capire perché siamo fermi.”
- “Vorrei cambiare questa regola.”
- “Porta avanti il lavoro fino a quando serve una mia decisione.”

Wise deve ricostruire il contesto dalle fonti canoniche, capire se la richiesta è RUN o CHANGE, verificare authority e capability e lavorare fino alla vera stop condition.

---

# 24. WCM RUN e WCM CHANGE spiegati senza gergo

**WCM RUN** significa: “fai ciò che il metodo e l'authority già consentono”.

**WCM CHANGE** significa: “cambiamo una regola, una responsabilità, un confine o un elemento materiale della baseline”.

Nel secondo caso WCM deve mostrarti prima l'impatto e ricevere authority esplicita.

Questo impedisce che un miglioramento apparentemente piccolo cambi silenziosamente il funzionamento del sistema.

---

# 25. Cosa fare quando…

## …vedo `WAITING_AUTHORITY`

Apri il Need. Il sistema aspetta te intenzionalmente.

## …vedo `INTERRUPTED_RESUMABLE`

Il lavoro non è perso. Non ricrearlo da zero: deve essere ripreso dal checkpoint.

## …vedo `DEGRADED`

Apri Knowledge Health e verifica se le issue sono pertinenti al lavoro corrente. `DEGRADED` non significa automaticamente stop.

## …vedo un heartbeat recente ma nessuna nuova Activity

Può essere perfettamente normale: il worker si è attivato ma non c'era una transizione autorizzata da eseguire.

## …ho già premuto Approva e vedo Pending

Non ripetere il comando. L'authority può essere già registrata mentre gli effetti sono ancora in elaborazione.

## …un Change Gate mostra `AUTHORITY_APPROVED`

Hai autorizzato il cambiamento; non significa ancora che la baseline sia stata modificata. Attendi `EXECUTED`/propagazione prevista.

## …il Control Panel sembra indietro

Non modificare il progetto per farlo coincidere. La projection va riallineata dalla source of truth.

## …un manuale racconta qualcosa di diverso dal sistema corrente

È Documentation Drift. Il manuale va aggiornato; non diventa authority per il solo fatto di essere pubblicato.

---

# 26. Glossario umano

| Termine | Traduzione pratica |
|---|---|
| Heartbeat | sveglia periodica del cognitive worker |
| Liveness | conferma che il meccanismo si è attivato |
| Workflow | lavoro organizzato in passaggi |
| Checkpoint | segnalibro persistente del workflow |
| Runtime | registro strutturato dello stato esecutivo |
| Derived State | sintesi deterministica del runtime |
| Projector | meccanismo che porta dati nella vista Mission Control |
| Need | qualcosa che richiede davvero l'utente |
| Pending | decisione già inviata, effetti ancora in corso |
| Board Gate | punto in cui WCM deve attendere authority umana |
| Authority Receipt | prova persistente di una decisione autorizzante |
| Knowledge Health | controllo qualità della memoria |
| Knowledge Assurance | processo che controlla e, quando possibile, ripara la memoria |
| Learning | lezione metodologica derivata dall'esperienza |
| Promoted | learning entrato nella baseline prevista |
| Persistent Mutation Safety | protezioni prima/dopo scritture persistenti sensibili |
| Source SHA | impronta della precisa versione sorgente di un artefatto |

---

# 27. La regola più importante per chi usa WCM

Non devi supervisionare ogni operazione.

Devi poter distinguere tre situazioni:

```text
WCM PUÒ CONTINUARE → lascialo lavorare
WCM STA CONTROLLANDO/SINCRONIZZANDO → osserva, normalmente non intervenire
WCM HA RAGGIUNTO UN GATE → decidi
```

Il valore del sistema sta proprio nel ridurre la micro-supervisione **senza ridurre la tua authority**.