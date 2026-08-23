# WCM — Executive / Client Guide

**Versione:** 0.4  
**Data:** 2026-08-23  
**Stato:** ACTIVE / LIVING PROJECTION / FIELD VALIDATION  
**Pubblico:** clienti, partner, management, investitori e interlocutori non tecnici  
**Authority:** DEC-010 + DEC-014; human-facing projection, non source of truth

---

# 1. WCM in una frase

**WCM è un modello operativo che permette di lavorare con l'intelligenza artificiale in modo continuativo, organizzato, tracciabile e governato, mantenendo memoria, stato, decisioni e apprendimento anche quando il lavoro attraversa più sessioni, strumenti e progetti.**

Obiettivo:

> aumentare l'autonomia operativa dell'AI senza perdere controllo umano, memoria e coerenza.

---

# 2. Il problema

Un'AI è molto efficace nel produrre una risposta. È più difficile trasformarla in una capacità organizzativa affidabile che lavori per giorni, settimane o mesi su progetti complessi.

I problemi tipici sono:

- perdita di contesto tra sessioni;
- decisioni dimenticate o contraddette;
- attività duplicate;
- confusione tra proposta, approvazione e stato corrente;
- automazioni che eseguono senza essere spiegabili;
- agenti che lavorano su memorie o authority non chiare;
- dashboard che non riflettono più il lavoro reale;
- knowledge base ricche ma incoerenti;
- esperienza che non diventa apprendimento del metodo.

WCM affronta il problema come un problema **organizzativo**, non soltanto di qualità del modello AI.

---

# 3. Che cos'è

WCM coordina:

- un nucleo cognitivo;
- memoria organizzativa persistente;
- workflow durevoli;
- processi e protocolli;
- automazioni deterministiche;
- controlli di integrità;
- learning dall'esperienza;
- gate umani;
- una superficie di osservazione: Mission Control.

```text
WCM RICORDA
    ↓
WCM LAVORA
    ↓
WCM REGISTRA LO STATO
    ↓
WCM CONTROLLA LA MEMORIA
    ↓
WCM IMPARA
    ↓
WCM MOSTRA COSA STA SUCCEDENDO
```

---

# 4. Non tutta l'AI deve "pensare"

Uno dei principi più importanti di WCM è distinguere ciò che richiede intelligenza da ciò che richiede semplicemente una regola affidabile.

Quando la domanda è aperta, semantica o strategica, serve cognizione.

Quando invece la regola è già nota, il sistema cerca di usare automazioni deterministiche:

```text
STESSO INPUT STRUTTURATO
→ STESSA REGOLA
→ STESSO RISULTATO
```

Questo principio riduce variabilità, costi inutili e rischio che una routine di sincronizzazione "interpreti" liberamente qualcosa che dovrebbe soltanto registrare.

---

# 5. Memoria persistente

WCM non affida il progetto alla memoria di una singola chat.

Mantiene nel tempo:

- obiettivi;
- decisioni;
- stato;
- roadmap;
- documenti;
- workflow;
- evidenze;
- relazioni tra informazioni;
- regole operative;
- learning del metodo.

La memoria non viene soltanto accumulata: viene anche controllata.

---

# 6. Continuità tra sessioni

Un workflow autorizzato può richiedere più sessioni o heartbeat.

WCM distingue la fine della sessione dalla fine del lavoro.

Se un'attività viene interrotta tecnicamente ma non ha raggiunto il proprio vero gate, conserva checkpoint e prossima transizione e viene ripresa.

Questo riduce:

- ripartenze da zero;
- duplicazioni;
- richieste di approvazione ripetute;
- falsi "completato".

---

# 7. Il sistema immunitario della conoscenza

WCM include Knowledge Assurance.

Il sistema può controllare, con regole meccaniche quando possibile:

- coerenza dello stato;
- propagazione delle decisioni;
- relazioni tra informazioni;
- freschezza dei registri;
- elementi orfani;
- allineamento rispetto all'ultimo cambiamento materiale.

Se un problema è meccanico e appartiene a una classe esplicitamente autorizzata, può essere riparato automaticamente e ricontrollato.

Se richiede interpretazione, **non inventa una risposta**: effettua escalation.

---

# 8. WCM impara dall'esperienza

L'esperienza non diventa automaticamente una nuova regola.

WCM separa:

1. raccolta automatica dell'evidenza;
2. revisione cognitiva dell'evidenza;
3. eventuale proposta di cambiamento;
4. Change Gate umano per modifiche materiali.

```text
ESPERIENZA
→ EVIDENZA
→ REVIEW
→ CANDIDATE LEARNING
→ VALIDAZIONE
→ EVENTUALE CHANGE GATE
```

Quindi "sistema che impara" non significa "sistema che cambia le proprie regole senza controllo".

---

# 9. Le automazioni: perché esistono

WCM non usa un'unica automazione indistinta. Usa blocchi con responsabilità diverse.

## Heartbeat

Sveglia il nucleo cognitivo e gli fa ricostruire il lavoro corrente dalla memoria persistente. Il trigger non contiene il task del momento.

## Deterministic State

Trasforma i checkpoint del workflow in una rappresentazione esecutiva coerente e riproducibile.

## Deterministic Projector

Porta i fatti strutturati del progetto nel Control Panel senza reinterpretarli liberamente.

## Command Executor

Trasporta una decisione umana autenticata verso un durable authority receipt verificabile.

## Knowledge Assurance

Controlla la salute della memoria e può eseguire solo riparazioni meccaniche autorizzate.

## Learning Evidence Collector

Raccoglie evidenza dal lavoro reale, ma non decide cosa WCM debba imparare.

## Learning Review

Interpreta l'evidenza e valuta se esiste un learning utile; le modifiche materiali restano soggette al Change Gate.

## Documentation Continuity

Mantiene allineati manuali e sistema reale mentre WCM evolve.

Questa separazione rende l'automazione più spiegabile e controllabile.

---

# 10. Automazione non significa perdita di controllo

Il modello separa **esecuzione** e **authority**.

```text
AUTOMATION / AI
→ esegue entro il mandato
→ arriva al gate
→ STOP

UMANO
→ decide
→ conferisce authority
→ workflow riparte
```

Un sistema può quindi essere più autonomo nel lavoro operativo senza diventare autonomo nel prendere ogni decisione.

---

# 11. Mission Control

Mission Control evita che l'utente debba leggere repository, log o file tecnici per capire cosa sta succedendo.

Può rendere visibili:

- portfolio progetti;
- stato e focus;
- Needs;
- Board Gate;
- documenti;
- Activity e Roadmap;
- Execution Health;
- Knowledge Health;
- Steward Activity;
- WCM Learning;
- documentazione ufficiale.

Mission Control è read-model/observability; solo dove esplicitamente previsto può raccogliere authority autenticata e vincolata.

---

# 12. Documentazione a due livelli

Da DEC-014 WCM mantiene:

## Documentazione generale

- Technical Reference;
- Executive / Client Guide;
- User Manual.

## Documentazione di progetto

Ogni progetto sufficientemente maturo può avere:

- Project Technical Reference;
- Project Executive / Commercial Guide;
- Project User Manual.

Questo permette di distinguere **come funziona WCM in generale** da **come viene applicato in uno specifico dominio**.

---

# 13. Perché la documentazione delle automazioni conta

Una organizzazione AI-native non dovrebbe dire soltanto "c'è un agente che fa questa cosa".

Dovrebbe poter spiegare:

- perché il blocco esiste;
- quando parte;
- cosa legge;
- cosa modifica;
- cosa non può fare;
- quando si ferma;
- chi ha authority;
- dove l'utente vede il risultato.

Per questo WCM mantiene un **Automation & Flow Block Catalog** vivente.

---

# 14. Multi-project

Il metodo generale è domain-agnostic, ma i workflow di progetto non sono universali.

Lo stesso WCM può, in linea di principio, supportare:

- venture e prodotti;
- progetti aziendali;
- software;
- ricerca;
- attività commerciali;
- progetti creativi/editoriali.

Il metodo comune governa memoria, authority, assurance, execution e learning; il progetto definisce workflow e knowledge specifici.

---

# 15. PRIMA DI NOI: field validation reale

PRIMA DI NOI è la principale field validation corrente.

Il progetto combina:

- scrittura e revisione editoriale;
- memoria narrativa persistente;
- continuity e reveal control;
- Chapter Workflow durevole;
- Narrative Mass Control;
- Author/Board Gate;
- Knowledge Assurance;
- state/projector deterministici;
- Mission Control;
- evidence verso WCM Learning.

Il valore del caso non è "un libro scritto da AI".

È la sperimentazione di un **processo editoriale AI-native governato**, nel quale produzione, memoria, quality control, decisioni dell'autore e tracciabilità fanno parte dello stesso sistema.

---

# 16. Punti di forza

## Continuità

Il lavoro può attraversare sessioni senza perdere il workflow.

## Memoria organizzativa

Le informazioni importanti diventano persistenti e versionate.

## Determinismo dove serve

Le routine meccaniche non vengono affidate per default a interpretazioni LLM.

## Human authority

L'AI può lavorare molto senza acquisire automaticamente il diritto di cambiare regole o decisioni riservate.

## Knowledge Assurance

La memoria viene verificata, non soltanto archiviata.

## Learning governato

L'esperienza può migliorare il metodo senza promozioni automatiche incontrollate.

## Observability

L'utente vede stato, gate, health e learning.

## Explainable automation

Le automazioni sono descritte come blocchi con responsabilità e boundary espliciti.

---

# 17. Cosa WCM non è

WCM non è:

- un chatbot;
- una cartella di file;
- un project manager tradizionale;
- un sinonimo di multi-agent;
- un sistema che consente all'AI di cambiare tutto autonomamente;
- una promessa che ogni errore sia auto-riparabile;
- un prodotto dichiarato già universalmente scale-ready.

---

# 18. Stato di maturità

WCM è **FIELD VALIDATION**.

Alcuni componenti sono operativi e field-validated su PRIMA DI NOI; la generalizzazione cross-project deve essere provata su ulteriori casi reali.

Questa distinzione è parte del metodo: non presentare come consolidato ciò che non ha ancora sufficiente evidence.

---

# 19. Automation map sintetica

```text
USER / EVENT
   ↓
COGNITIVE HEARTBEAT / WISE
   ↓
PERSISTENT WORKFLOW
   ↓
DETERMINISTIC STATE
   ↓
DETERMINISTIC PROJECTOR
   ↓
MISSION CONTROL
   ↓
HUMAN GATE quando necessario

In parallelo:
KNOWLEDGE ASSURANCE
LEARNING COLLECTOR → LEARNING REVIEW
DOCUMENTATION CONTINUITY
```

La lista completa e lo stato di ciascun blocco sono nel catalogo WCM corrente.

---

# 20. Beneficio atteso

Il passaggio ricercato è:

```text
AI COME STRUMENTO DI SESSIONE
            ↓
AI COME CAPACITÀ ORGANIZZATIVA CONTINUA
```

mantenendo **memoria, controllo, coerenza e spiegabilità**.

---

## Nota finale

Questo documento è una human-facing projection della baseline corrente. I manuali di progetto spiegano come questa architettura viene applicata a un dominio concreto. Word/PDF/web sono derivati del master Markdown e non acquisiscono authority autonoma.
