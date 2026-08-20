# WCM — Executive / Client Guide

**Versione:** 0.2  
**Data:** 2026-08-20  
**Stato:** ACTIVE / LIVING PROJECTION / FIELD VALIDATION  
**Pubblico:** clienti, partner, management, investitori e interlocutori non tecnici  
**Authority:** human-facing projection governata da `DEC-010`; non sostituisce la baseline tecnica WCM

---

# 1. WCM in una frase

**WCM è un modello operativo che permette di lavorare con l'intelligenza artificiale in modo continuativo, organizzato, tracciabile e governato, mantenendo memoria, stato, decisioni e apprendimento anche quando il lavoro attraversa più sessioni, strumenti e progetti.**

L'obiettivo può essere sintetizzato così:

> aumentare l'autonomia operativa dell'AI senza perdere controllo umano, memoria e coerenza.

---

# 2. Il problema che WCM affronta

Usare un'AI per rispondere a una domanda è relativamente semplice.

Usarla per portare avanti un progetto nel tempo è molto più difficile.

Quando il lavoro cresce, emergono problemi ricorrenti:

- il contesto si disperde tra conversazioni, file e strumenti;
- decisioni importanti possono essere dimenticate o contraddette;
- l'AI può ripetere attività già svolte;
- non è sempre chiaro cosa sia approvato e cosa sia soltanto una proposta;
- più progetti contemporanei aumentano rapidamente la complessità;
- automazione e agenti possono lavorare senza che sia facile capire su quale memoria o authority stiano agendo;
- quando cambia una decisione, il cambiamento può non propagarsi a tutto ciò che ne dipende;
- una knowledge base può diventare ricca ma internamente incoerente;
- l'esperienza accumulata rischia di non trasformarsi in miglioramento del metodo.

WCM nasce per affrontare questa dimensione **organizzativa e cognitiva** del lavoro con l'AI.

---

# 3. Che cos'è WCM

WCM non è un singolo software e non coincide con un singolo modello AI.

È un **modello operativo** che coordina:

- un nucleo cognitivo;
- memoria organizzativa persistente;
- stato e roadmap dei progetti;
- processi e protocolli;
- capability dirette o delegabili;
- controlli di integrità della conoscenza;
- cicli di apprendimento dall'esperienza;
- una superficie umana di osservazione e governance.

In termini semplici:

```text
WCM RICORDA
    ↓
WCM LAVORA
    ↓
WCM CONTROLLA CIÒ CHE HA FATTO
    ↓
WCM PROTEGGE LA PROPRIA MEMORIA
    ↓
WCM IMPARA DALL'ESPERIENZA
    ↓
WCM PROPONE COME EVOLVERE
```

L'essere umano mantiene l'authority sulle decisioni che il metodo considera riservate o materiali.

---

# 4. Perché è diverso da un chatbot

Un chatbot lavora soprattutto nella conversazione corrente.

WCM aggiunge una **memoria organizzativa persistente** capace di mantenere nel tempo:

- obiettivi;
- decisioni;
- stato corrente;
- roadmap;
- documenti;
- evidenze;
- relazioni tra informazioni;
- regole operative;
- learning del metodo.

Questo permette di riprendere il lavoro senza affidarsi soltanto a ciò che una singola chat ricorda.

---

# 5. Perché è diverso da un semplice sistema multi-agent

Aggiungere agenti non risolve automaticamente i problemi di continuità, governance e memoria.

WCM non parte dal principio “più agenti = più capacità”.

Il principio è:

> usare la minima complessità organizzativa necessaria e attivare capacità aggiuntive soltanto quando il lavoro lo richiede.

Il nucleo cognitivo può operare direttamente quando possiede la capability necessaria e delegare soltanto la parte che richiede strumenti, ambienti o service differenti.

---

# 6. La memoria del WCM

WCM combina due livelli complementari.

## Memoria di lavoro

È il contesto vivo: conversazione, intenzioni recenti, ragionamento situazionale, nuove informazioni.

## Memoria organizzativa persistente

È la memoria durevole e versionata: stato, decisioni, processi, roadmap, knowledge, evidence e learning.

Il valore non sta soltanto nel conservare file, ma nel mantenere **coerenti le relazioni** tra ciò che il sistema sa.

---

# 7. Il sistema immunitario della conoscenza

Una knowledge base può essere piena di informazioni e comunque contenere incoerenze.

Per questo WCM include un **Knowledge Assurance / Immune Loop**.

Il sistema verifica, per quanto possibile in modo deterministico:

- coerenza dello stato;
- propagazione delle decisioni;
- validità delle relazioni;
- freschezza dei registri;
- presenza di informazioni orfane;
- età del controllo rispetto all'ultimo cambiamento materiale.

Quando il problema è puramente meccanico e rientra in classi di riparazione esplicitamente autorizzate, può essere corretto automaticamente e ricontrollato.

Quando invece il problema richiede interpretazione o decisione, il sistema **non inventa la risposta**: effettua escalation.

---

# 8. WCM impara dall'esperienza

WCM possiede anche un **Learning Loop**.

Un evento non diventa automaticamente una nuova regola.

Il percorso è governato:

```text
ESPERIENZA
   ↓
EVIDENZA
   ↓
CANDIDATE LEARNING
   ↓
ACCUMULO / REVISIONE
   ↓
VALIDAZIONE O RIGETTO
   ↓
EVENTUALE PROMOZIONE DEL METODO
```

Un learning può essere osservato e maturare senza conferire automaticamente l'autorità per modificare WCM.

Le modifiche materiali al metodo restano soggette alla governance prevista.

---

# 9. Mission Control: la superficie umana

L'utente non deve leggere repository, log tecnici o decine di file per capire cosa sta succedendo.

Mission Control rende visibili le informazioni rilevanti.

Oggi può mostrare, tra le altre cose:

- portfolio dei progetti;
- stato e fase corrente;
- Needs che richiedono una decisione umana;
- documenti da leggere;
- Board Gate;
- attività e roadmap;
- Knowledge Health;
- attività del Knowledge Steward;
- WCM Learning;
- documentazione ufficiale del metodo.

Mission Control è una superficie di osservazione e, solo dove esplicitamente previsto, di authority autenticata e vincolata.

---

# 10. Documentation Center V0.9

WCM mantiene tre documenti human-facing viventi:

1. **Technical Reference** — per chi vuole capire come WCM è costruito;
2. **Executive / Client Guide** — per capire cosa fa, perché serve e quali benefici offre;
3. **User Manual** — per capire come utilizzarlo concretamente.

Mission Control V0.9 introduce una sezione globale **Documentazione WCM**.

L'utente può:

- consultare i documenti direttamente nel browser;
- vedere versione, data e stato;
- verificare la provenienza dal master GitHub;
- scaricare una release Word;
- scaricare una release PDF.

La release mantiene il collegamento al preciso master da cui deriva tramite source path e source SHA.

Principio:

> scaricare un documento non significa approvarlo e non modifica alcuna authority WCM.

---

# 11. Cosa fa l'utente e cosa fa WCM

```text
UTENTE                         WCM
────────────────────────────────────────────────
definisce intenzione        → struttura il lavoro
prende decisioni riservate  ← prepara Need e opzioni
approva cambi materiali     ← prepara Change Gate
legge output                ← produce e organizza
mantiene authority          ← opera nel mandato
                             ← ricorda
                             ← controlla la memoria
                             ← apprende dall'esperienza
                             ← segnala anomalie
```

L'obiettivo non è sostituire la responsabilità umana, ma aumentare la quantità di lavoro che può essere svolta in modo continuativo senza perdere governo e tracciabilità.

---

# 12. Multi-project

WCM è progettato per non essere legato a un singolo dominio.

La stessa architettura può essere utilizzata, con processi specifici differenti, per esempio per:

- sviluppo di un prodotto o venture;
- progetto operativo aziendale;
- sviluppo software;
- progetto creativo complesso;
- ricerca e analisi;
- attività commerciali ricorrenti;
- iniziative con più strumenti e service.

Il metodo generale resta comune, mentre workflow e knowledge structure devono essere proporzionati al dominio.

---

# 13. Un esempio reale di field validation

**PRIMA DI NOI**, progetto editoriale complesso, è la principale field validation corrente del WCM.

Il progetto ha permesso di osservare problemi reali di:

- continuità tra documenti e capitoli;
- propagazione delle decisioni;
- knowledge drift;
- relazioni tra informazioni;
- gestione dei gate umani;
- osservabilità dei cicli autonomi;
- apprendimento metodologico.

Queste evidenze vengono utilizzate per migliorare WCM senza trasformare automaticamente ogni esperienza locale in una regola generale.

---

# 14. Punti di forza del modello

## Continuità

Il lavoro non dipende dalla memoria di una singola conversazione.

## Memoria organizzativa

Stato, decisioni e conoscenza importante sono persistenti e versionati.

## Tracciabilità

È possibile ricostruire perché una decisione esiste e quali elementi ne dipendono.

## Human authority

Autonomia operativa e authority decisionale sono separate.

## Controlled automation

L'automazione viene limitata da processi, capability e guardrail espliciti.

## Knowledge assurance

La memoria viene controllata, non soltanto accumulata.

## Organizational learning

L'esperienza può trasformarsi progressivamente in miglioramento del metodo.

## Observability

Mission Control rende visibile ciò che il sistema sta facendo, ricordando e imparando.

## Multi-project orientation

Il modello è pensato per gestire più iniziative mantenendo contesti separati e governance comune.

---

# 15. Cosa WCM non è

WCM non è:

- un semplice chatbot;
- una cartella di documenti;
- un project manager tradizionale;
- un sinonimo di sistema multi-agent;
- un meccanismo che autorizza l'AI a modificare autonomamente ogni cosa;
- una promessa che ogni errore possa essere auto-riparato;
- un prodotto dichiarato già definitivo o universalmente scale-ready.

---

# 16. Stato di maturità

WCM è in **FIELD VALIDATION**.

Alcune capability sono già operative e vengono utilizzate nel lavoro reale; altre sono ancora in sperimentazione o richiedono maggiore evidenza cross-domain.

Questa distinzione è intenzionale: il metodo vuole evolvere sulla base dell'esperienza, senza presentare come consolidato ciò che non lo è ancora.

---

# 17. Il beneficio atteso

In sintesi, WCM cerca di rendere possibile questo passaggio:

```text
AI COME STRUMENTO DI SESSIONE
            ↓
AI COME CAPACITÀ ORGANIZZATIVA CONTINUA
```

mantenendo tre invarianti:

**memoria**, **controllo**, **coerenza**.

Il risultato atteso è poter gestire **più progetti, più complessità e più autonomia operativa dell'AI senza perdere la capacità umana di capire, verificare e decidere**.

---

## Nota finale

Questo documento è una proiezione human-facing della baseline WCM corrente. GitHub `main` e le fonti metodologiche autorevoli rimangono la source of truth. Le release Word/PDF distribuite tramite Mission Control sono derivate dal master e ne conservano la provenance.
