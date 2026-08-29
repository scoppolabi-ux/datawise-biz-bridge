# WCM — Executive / Client Guide

**Versione:** 0.5  
**Data:** 2026-08-24  
**Stato:** ACTIVE / LIVING PROJECTION / FIELD VALIDATION  
**Pubblico:** clienti, partner, management, investitori e interlocutori non tecnici  
**Authority:** DEC-010 + DEC-014; human-facing projection, non source of truth

---

# 1. WCM in una frase

**WCM è un modello operativo che trasforma l'intelligenza artificiale da strumento di singola sessione a capacità organizzativa continuativa, mantenendo memoria, stato, controlli, apprendimento e decisioni umane lungo il tempo.**

Il suo obiettivo non è rendere l'AI “libera di fare tutto”. È permetterle di lavorare molto **senza perdere controllo, coerenza e tracciabilità**.

---

# 2. Il problema che affronta

Un modello AI può essere molto bravo a rispondere a una domanda o produrre un documento. Quando però deve lavorare per giorni o settimane su un progetto reale emergono problemi diversi:

- una nuova sessione può non sapere cosa è già stato fatto;
- una decisione può essere dimenticata o contraddetta;
- un'attività può essere rieseguita per errore;
- una dashboard può rimanere indietro rispetto al lavoro;
- una knowledge base può contenere molte informazioni ma non essere coerente;
- un'automazione può scrivere nel posto sbagliato o su una versione non più corrente;
- l'esperienza fatta può andare persa invece di migliorare il metodo.

WCM tratta questi problemi come problemi di **organizzazione, memoria, governance e controllo**, non soltanto come limiti del modello linguistico.

---

# 3. Come funziona in parole semplici

```text
L'UTENTE DEFINISCE INTENZIONE E DECIDE AI GATE
                     ↓
              WISE COMPRENDE E LAVORA
                     ↓
         WCM CONSERVA WORKFLOW E MEMORIA
                     ↓
     AUTOMAZIONI MECCANICHE SINCRONIZZANO
                     ↓
          KNOWLEDGE ASSURANCE CONTROLLA
                     ↓
          MISSION CONTROL RENDE VISIBILE
                     ↓
              WCM IMPARA DALL'ESPERIENZA
```

La caratteristica centrale è la separazione delle responsabilità.

L'AI viene usata per ragionamento, sintesi, creatività e interpretazione. Le attività che hanno già una regola chiara vengono progressivamente trasformate in procedure deterministiche.

---

# 4. Cognizione dove serve, determinismo dove serve

Se dobbiamo decidere come rivedere un capitolo, interpretare un'anomalia o proporre una strategia, serve intelligenza.

Se dobbiamo invece aggiornare uno stato, verificare che una revisione sia ancora corrente, impedire una doppia scrittura o proiettare un dato strutturato in una dashboard, non serve “creatività”. Serve affidabilità.

Per questo WCM cerca il seguente equilibrio:

```text
DOMANDA APERTA / SIGNIFICATO → COGNIZIONE
REGOLA NOTA / MECCANICA       → DETERMINISMO
DECISIONE RISERVATA           → HUMAN AUTHORITY
```

Questo principio è diventato sempre più concreto nella field validation di PRIMA DI NOI.

---

# 5. Continuità: la fine della chat non è la fine del lavoro

WCM mantiene workflow persistenti con checkpoint.

Se il lavoro deve attraversare più sessioni, il sistema può ricordare:

- che cosa è già stato completato;
- che cosa viene dopo;
- qual è il vero punto di arresto;
- quale authority è valida;
- se un'interruzione è tecnica o sostanziale.

Quindi una sessione può terminare senza costringere il progetto a ripartire da zero.

---

# 6. Memoria che viene anche controllata

WCM non considera sufficiente archiviare file.

Con **Knowledge Assurance** verifica che la memoria resti coerente e sufficientemente aggiornata. Il controllo oggi è principalmente event-driven: quando cambia qualcosa di rilevante può partire automaticamente, con una safety net periodica ogni sei ore.

Quando la correzione è meccanica e già autorizzata, il Knowledge Steward può ripararla e ricontrollarla. Quando il problema richiede significato o una decisione, il sistema non “inventa” una risposta: effettua escalation.

Un workflow può anche richiedere esplicitamente un controllo Knowledge fresh prima di un passaggio delicato. Questo è già stato utilizzato in PRIMA DI NOI prima di un Board Gate.

---

# 7. Scritture persistenti più sicure

Una delle lezioni emerse sul campo è che una write tecnicamente riuscita può comunque essere sbagliata: target errato, dato stale, payload incompleto, writer concorrente.

Da questa esperienza WCM ha promosso il protocollo **Persistent Mutation Safety — PROT-017**.

Prima di una write critica il sistema deve verificare, in modo proporzionato al rischio:

- target e scope esatti;
- forma del payload;
- versione/stato atteso;
- ownership del writer;
- idempotenza;
- risultato realmente persistito;
- rispetto dell'authority.

In termini semplici:

> non basta sapere come recuperare da un errore; bisogna ridurre la probabilità di compierlo.

---

# 8. Heartbeat: lavorare periodicamente senza confondere attività e liveness

Un heartbeat è un meccanismo che riattiva periodicamente il cognitive core di un progetto.

Non contiene il task corrente: WCM lo ricostruisce dalla memoria persistente.

Una seconda evoluzione importante riguarda la telemetria. Il sistema ora distingue nettamente:

- **liveness** — “il worker si è attivato ed ha concluso una run”;
- **execution** — “il progetto è realmente passato da uno stato a un altro”.

La telemetria del heartbeat viene registrata con una procedura deterministica separata. Un nuovo timestamp non viene quindi scambiato per una nuova fase o una nuova decisione del progetto.

---

# 9. Human authority: decidere non significa ancora eseguire

Mission Control può raccogliere decisioni umane nei punti espressamente autorizzati.

WCM separa però tre cose che nei sistemi meno governati vengono spesso confuse:

```text
DECISIONE UMANA
≠ REGISTRAZIONE DELL'AUTHORITY
≠ ESECUZIONE DEGLI EFFETTI
```

Per esempio, nel Learning System un'approvazione di un Method Change Gate viene registrata deterministicamente con una receipt verificabile. Solo un processo successivo applica davvero la modifica alla baseline e ne verifica gli effetti.

Questo rende possibile sapere non solo “che cosa è cambiato”, ma **chi lo ha autorizzato e se la modifica è stata realmente applicata**.

---

# 10. WCM impara, ma non cambia le proprie regole da solo

L'esperienza operativa alimenta un Learning System:

```text
ESPERIENZA
→ EVIDENZA
→ REVIEW
→ LEARNING
→ EVENTUALE CHANGE GATE
→ BASELINE UPDATE VERIFICATO
```

Il collector automatico raccoglie evidence. La review cognitiva valuta se quella evidence contiene un learning riusabile. Se il learning richiede un cambiamento materiale del metodo, serve il Change Gate umano.

Un caso reale è `WCM-LRN-004`: nato da incidenti e hardening delle scritture persistenti, è stato validato, sottoposto a gate e infine promosso nel protocollo PROT-017.

---

# 11. Mission Control: osservabilità senza trasformare la dashboard nella verità

Mission Control è la sala di controllo human-facing.

Rende accessibili:

- portfolio dei progetti;
- Needs e Pending;
- documenti e Board Gate;
- Activity e Roadmap;
- Execution Health;
- Knowledge Health e Steward Activity;
- WCM Learning;
- documentazione generale e di progetto.

La dashboard non diventa source of truth: riflette fonti persistenti e read-model. Se una vista è in ritardo, si corregge la projection, non si modifica il progetto per “far tornare lo schermo”.

---

# 12. Automazioni spiegabili

WCM mantiene un Automation & Flow Block Catalog. Per ogni blocco materiale dovrebbe essere possibile rispondere a domande comprensibili:

- perché esiste?
- quando parte?
- cosa legge?
- cosa produce o modifica?
- cosa può fare senza chiedere permesso?
- cosa non può fare?
- quando si ferma?
- dove vedo il risultato?

Tra i blocchi correnti troviamo heartbeat cognitivi, state/projector deterministici, Knowledge Assurance, command consumers, Learning Collector/Review, telemetry materializer e Documentation Continuity.

---

# 13. Documentazione generale e specifica di progetto

WCM possiede tre manuali generali:

- Technical Reference;
- Executive / Client Guide;
- User Manual.

Ogni progetto sufficientemente maturo può avere la stessa terna adattata al proprio dominio.

PRIMA DI NOI è la prima field validation di questo modello e possiede:

- Technical Reference;
- Executive / Editorial Partner Guide;
- User Manual.

Questo evita due estremi: documentazione troppo generica per spiegare un progetto reale, oppure documentazione di progetto che duplica e contraddice il metodo generale.

---

# 14. PRIMA DI NOI: cosa rende interessante il caso

PRIMA DI NOI non viene usato per dimostrare semplicemente che “l'AI sa scrivere”.

Il progetto sta sperimentando un'organizzazione editoriale AI-native con:

- Author & Creative Director con authority finale;
- workflow del capitolo persistente;
- Writer e review professionali separate;
- Narrative Mass Control;
- continuity e reveal ledgers;
- Knowledge Assurance richiamabile prima dei gate;
- delivery verificata;
- Board Gate;
- state/projector deterministici;
- heartbeat telemetry separata;
- Learning derivato dall'esperienza reale.

È quindi un case study di **processo**, non soltanto di generazione di contenuti.

---

# 15. Punti di forza che la field validation sta esplorando

**Continuità.** Il lavoro può attraversare sessioni senza perdere il punto di esecuzione.

**Memoria organizzativa.** Decisioni, output, authority e conoscenza importante diventano persistenti.

**Determinismo selettivo.** Le routine meccaniche vengono progressivamente sottratte alla variabilità LLM.

**Controllo umano.** L'autonomia operativa termina ai gate riservati all'owner.

**Safety sulle write.** Le mutazioni persistenti critiche hanno guard espliciti e verifica post-write.

**Assurance.** La memoria viene controllata e alcune anomalie meccaniche possono essere auto-riparate.

**Learning governato.** L'esperienza può cambiare il metodo soltanto attraverso promotion e authority.

**Observability.** L'utente può vedere stato, health, needs e learning senza leggere il backend.

---

# 16. Cosa WCM non è

WCM non è un chatbot, una cartella di file, una semplice dashboard o un sinonimo di “sistema multi-agent”.

Non afferma che ogni errore sia auto-riparabile, che ogni decisione possa essere automatizzata o che lo stesso workflow funzioni identicamente per ogni dominio.

---

# 17. Stato di maturità

WCM è **FIELD VALIDATION**.

Alcune capacità sono già operative e hanno evidence significativa su PRIMA DI NOI. La generalizzazione cross-project, la scalabilità organizzativa più ampia e la productizzazione enterprise devono ancora essere validate su ulteriori casi reali.

Questa prudenza non è un limite narrativo del prodotto: è una regola di qualità del metodo stesso.

---

# 18. Beneficio atteso

Il passaggio cercato è:

```text
AI COME STRUMENTO DI SESSIONE
            ↓
AI COME CAPACITÀ ORGANIZZATIVA CONTINUA
```

con **memoria, sicurezza delle operazioni, controllo umano, apprendimento e spiegabilità**.