# Capitolo 43 — PROT-014 — Method Experience Memory Standard

**PARTE VII — Il Libro dei Protocolli WCM**  
**Stato:** FROZEN  
**Data:** 2026-08-31  
**Scope:** WCM generale, domain-agnostic

---

# 43.0 Un metodo che lavora deve poter imparare senza riscriversi da solo

Un'organizzazione può accumulare esperienza senza imparare davvero. Può ricordare che qualcosa ha funzionato, dimenticare perché un tentativo è fallito, ripetere esperimenti già smentiti oppure trasformare troppo in fretta un singolo episodio in una nuova regola generale.

Nel WCM questo problema è particolarmente delicato: il metodo stesso viene usato, osservato e messo alla prova mentre opera. Se ogni esperienza diventasse automaticamente una regola, il metodo cambierebbe continuamente. Se invece nessuna esperienza venisse conservata, il sistema sarebbe condannato a riscoprire gli stessi problemi.

`PROT-014 — Method Experience Memory Standard` definisce la disciplina intermedia: **conservare l'esperienza del metodo, distinguerla dalle regole già valide e permettere che un apprendimento maturi senza auto-promuoversi a baseline**.

Il principio può essere espresso in modo semplice:

> **Imparare da un'esperienza non significa ancora cambiare il metodo.**

---

# 43.1 Il problema che il protocollo risolve

Ogni metodo operativo incontra casi riusciti, anomalie, failure, correzioni, intuizioni e risultati inattesi. Questi eventi possono contenere informazioni preziose, ma hanno pesi molto diversi.

Un singolo episodio può suggerire un'ipotesi. Una sequenza coerente di evidenze può rafforzarla. Una verifica può dimostrare che vale in un perimetro preciso. Solo un passaggio ulteriore, sottoposto alla governance appropriata, può trasformarla in modifica della baseline.

Senza questa separazione emergono due errori opposti.

Il primo è la **perdita di esperienza**: ciò che è stato scoperto resta nella memoria temporanea, in una conversazione o in un output isolato e viene poi dimenticato.

Il secondo è la **sovra-promozione**: un caso interessante viene trattato subito come verità generale e finisce per modificare il metodo senza evidenza e authority sufficienti.

PROT-014 protegge il WCM da entrambi.

---

# 43.2 Che cosa entra nella Method Experience Memory

Il protocollo non registra automaticamente ogni evento come apprendimento.

La prima cosa che può essere raccolta è l'**evidence event**: un fatto osservato che potrebbe essere rilevante. In questa fase non è ancora stato deciso che cosa quel fatto insegni.

È una distinzione importante. Se, per esempio, una procedura produce un risultato inatteso, l'evento può essere conservato come evidenza. Dire invece “questa procedura va sempre cambiata in questo modo” è già un'interpretazione.

Per questo la memoria metodologica separa:

```text
EVIDENZA OSSERVATA
        ↓
REVISIONE COGNITIVA
        ↓
POSSIBILE LEARNING
        ↓
VALIDAZIONE NEL PERIMETRO DICHIARATO
        ↓
EVENTUALE CHANGE GATE
        ↓
SOLO CON AUTHORITY: PROMOTION
```

Questa separazione permette di conservare il fatto prima di decidere che cosa significhi.

---

# 43.3 Gli stati di un learning

Quando un'evidenza viene interpretata come possibile apprendimento, nasce un Learning Record con un'identità stabile.

PROT-014 usa sei stati:

- `CANDIDATE`: apprendimento candidato, ancora da osservare o verificare;
- `OBSERVING`: il fenomeno è sotto osservazione e si cercano ulteriori evidenze;
- `VALIDATED`: l'apprendimento ha evidenza sufficiente nel perimetro dichiarato;
- `REJECTED`: l'ipotesi di apprendimento non ha retto alla verifica;
- `SUPERSEDED`: il learning è stato superato da conoscenza successiva;
- `PROMOTED`: il learning è stato effettivamente recepito in uno o più target autorevoli secondo governance.

La sequenza tipica è:

```text
CANDIDATE → OBSERVING → VALIDATED → PROMOTED
                    └→ REJECTED
```

Ma la cosa più importante non è la freccia: è la conservazione della storia. Una transizione non deve cancellare da dove proveniva il learning, quali evidenze lo sostenevano e perché il suo stato è cambiato.

---

# 43.4 VALIDATED non significa PROMOTED

Questo è il gate concettuale centrale del protocollo.

Un learning `VALIDATED` può essere ben sostenuto dalle evidenze e tuttavia **non essere ancora una regola del metodo**.

La validazione risponde alla domanda:

> “Abbiamo ragioni sufficienti per considerare questo apprendimento valido nel perimetro dichiarato?”

La promotion risponde invece a una domanda diversa:

> “Questo apprendimento è stato autorizzato e incorporato nella baseline o in un altro target autorevole?”

Confondere le due domande significherebbe concedere al meccanismo di apprendimento il potere di modificare autonomamente il metodo.

PROT-014 lo vieta.

Quando la conseguenza di un learning richiede una modifica materiale del WCM, entra in gioco un **Method Change Gate** separato. Il gate deve esistere come oggetto persistente e strutturato. Non viene dedotto dal semplice fatto che il learning sia `VALIDATED`.

La parte cognitiva può proporre un cambiamento e prepararne l'analisi d'impatto. Non può auto-consumare il gate.

---

# 43.5 Il trigger: quando nasce lavoro di memoria metodologica

Il protocollo si attiva quando l'esperienza operativa produce un evento potenzialmente significativo per il metodo.

Può trattarsi di una failure ricorrente, di un comportamento inatteso, di un risultato che contraddice un'ipotesi precedente, di una soluzione che sembra ripetersi con successo o di nuova evidenza relativa a un learning già esistente.

L'input utile non è quindi una generica impressione, ma un insieme ricostruibile di elementi: provenienza, momento dell'osservazione, fonte, sintesi dell'evento, parti coinvolte e collegamenti con eventuali learning già noti.

Il collector può raccogliere l'evidenza e marcarla come da revisionare. Non decide da solo che cosa essa significhi.

---

# 43.6 Evidence Inbox: prima i fatti, poi l'interpretazione

PROT-014 prevede una Evidence Inbox per gli eventi ancora da revisionare.

Uno stato `PENDING` in questa inbox significa soltanto **evidenza da esaminare**. Non significa che un learning sia in attesa di promotion e non equivale a una richiesta di authority.

Dopo la review, un evento può essere collegato a uno o più learning, classificato come non rilevante ai fini dell'apprendimento, riconosciuto come duplicato oppure lasciato in attesa di ulteriori evidenze.

Questa disciplina evita un errore sottile: trasformare automaticamente ogni anomalia in una teoria sul metodo.

---

# 43.7 Learning Ledger e provenance

Perché la memoria sia realmente organizzativa, ogni learning deve poter essere ritrovato e ricostruito.

Il Learning Ledger conserva per ogni record almeno l'identità, il titolo, lo stato, il percorso del record, le date di creazione e revisione, confidence, generalizzabilità, riferimenti di origine, eventuali target di promotion e condizioni che suggeriscono una futura revisita.

Il contenuto interpretativo completo resta nel record dedicato; il ledger serve come mappa machine-readable.

Un dettaglio particolarmente importante riguarda `promoted_at`: non è semplicemente la data dell'ultima modifica di un file o di una schermata. È il momento semantico in cui la promotion è diventata valida secondo governance e deve provenire da evidenza canonica verificabile.

In questo modo il sistema distingue **quando qualcosa è stato modificato tecnicamente** da **quando è diventato valido metodologicamente**.

---

# 43.8 Failure memory: ricordare anche ciò che non ha funzionato

Una memoria dell'apprendimento sarebbe incompleta se conservasse soltanto i successi.

PROT-014 mantiene recuperabili anche learning `REJECTED` e `SUPERSEDED`.

La ragione è pratica. Un approccio già falsificato può sembrare nuovamente promettente mesi dopo, soprattutto se chi lo incontra non conosce la storia precedente. Conservare il fallimento permette di chiedere: “questa strada è davvero nuova oppure l'abbiamo già provata?”

La failure memory non serve a impedire per sempre una revisita. Un contesto può cambiare e nuove evidenze possono giustificarla. Serve però a evitare la **riscoperta ciclica inconsapevole** degli stessi errori.

---

# 43.9 Anti-overpromotion: un caso non diventa automaticamente una legge

Il protocollo impone prudenza sulla generalizzabilità.

Un singolo caso può generare un `CANDIDATE`. Se l'evidenza è particolarmente forte, può anche sostenere una validazione in un perimetro ristretto e dichiarato. Non dimostra però automaticamente che la stessa conclusione valga in ogni dominio, organizzazione o situazione.

Questa distinzione è fondamentale per un metodo ancora sottoposto a field validation.

La memoria deve quindi conservare non soltanto **quanto siamo confidenti**, ma anche **quanto lontano possiamo ragionevolmente estendere ciò che abbiamo osservato**.

Confidence e generalizzabilità non sono sinonimi.

---

# 43.10 Le relazioni del metodo

I learning non vivono isolati.

Possono derivare da evidenze, essere collegati a esperimenti, decisioni, processi, protocolli, capability o elementi architetturali. PROT-014 usa per queste relazioni il vocabolario generale delle sinapsi definito da PROT-013.

Questo rende possibile ricostruire non soltanto “che cosa abbiamo imparato”, ma anche:

- da dove proviene;
- che cosa sostiene;
- da quali elementi dipende;
- che cosa potrebbe essere influenzato se cambia;
- dove è stato eventualmente promosso.

Anche qui una relazione non deve essere inventata per completare una mappa. Se il legame richiede interpretazione, deve essere trattato come tale e non come fatto deterministico.

---

# 43.11 INDEX-FIRST applicato all'esperienza

Una memoria metodologica può diventare molto grande. Aprire ogni record a ogni revisione sarebbe inefficiente e aumenterebbe il rischio di confondere materiale storico con ciò che richiede attenzione adesso.

Per questo PROT-014 applica INDEX-FIRST anche all'apprendimento.

L'indice deve rendere visibili almeno i learning per stato, quelli da rivedere, le promotion recenti, gli eventuali Method Change Gate aperti, failure e rejected learning rilevanti e i riferimenti ai ledger di relazione e health.

La review parte quindi dalla mappa e dal delta. I record completi vengono aperti quando servono davvero.

È la stessa disciplina già incontrata nel retrieval generale: **non leggere tutto; leggere ciò che serve per decidere correttamente il passo successivo**.

---

# 43.12 Method Knowledge Health

Anche la memoria del metodo può degradarsi.

PROT-014 ne controlla almeno alcuni aspetti: integrità dei record, copertura dell'indice, validità delle relazioni, lineage delle promotion, freschezza delle review, learning orfani e anzianità delle evidenze ancora pendenti.

Gli stati di health sono:

`HEALTHY / DEGRADED / STALE / CRITICAL / UNKNOWN`.

Questa misura non dice se il WCM sia “un buon metodo” in assoluto. Dice una cosa più circoscritta e verificabile: **se la sua memoria dell'esperienza è coerente, raggiungibile e sufficientemente corrente**.

Esiste inoltre un freshness invariant: se evidenze `PENDING` superano la finestra di review dichiarata, oppure una modifica materiale del metodo non è ancora coperta da un controllo di health, lo stato non può restare `HEALTHY`.

---

# 43.13 Confine tra determinismo e cognizione

PROT-014 separa esplicitamente due tipi di lavoro.

Sono adatti a controlli deterministici gli aspetti che devono produrre sempre lo stesso risultato a parità di input: identità stabili, vocabolario degli stati, persistenza, timestamp semantici già determinati dalla fonte, projection, convergenza degli snapshot, routing dei gate e confini di authority.

Sono invece cognitivi o probabilistici, quando necessari, l'interpretazione delle evidenze, il clustering semantico, la formulazione di un learning, la valutazione di confidence e generalizzabilità e la proposta di un Impact Preview.

La distinzione protegge entrambe le parti.

Il determinismo non viene usato per fingere che il significato sia meccanico. La cognizione non viene usata per aggirare gate e authority che devono restare verificabili.

---

# 43.14 Gate e decision point

Il flusso può essere sintetizzato così:

```text
EVIDENCE EVENT
      ↓
È GIÀ NOTO / DUPLICATO?
      ↓
REVIEW COGNITIVA
      ↓
ESISTE UN LEARNING?
 ├─ NO → NO_LEARNING / conserva provenance
 └─ SÌ
      ↓
CANDIDATE / OBSERVING
      ↓
EVIDENZA SUFFICIENTE NEL PERIMETRO?
 ├─ NO → continua osservazione o REJECTED
 └─ SÌ → VALIDATED
               ↓
RICHIEDE MODIFICA MATERIALE DEL METODO?
 ├─ NO → resta conoscenza validata nel suo scope
 └─ SÌ → WCM_CHANGE_GATE
              ↓
          AUTHORITY?
        ├─ NO → nessuna promotion
        └─ SÌ → promotion controllata + lineage
```

Il gate più importante è quello tra `VALIDATED` e modifica della baseline. L'esperienza può maturare autonomamente entro il processo di learning autorizzato; il metodo non può riscrivere autonomamente le proprie regole materiali.

---

# 43.15 Output del protocollo

A seconda del punto del ciclo, PROT-014 può produrre o aggiornare:

- evidence event con provenance;
- Learning Record con ID stabile;
- stato e metadata nel Learning Ledger;
- relazioni metodologiche;
- stato di Method Knowledge Health;
- proposta di Impact Preview;
- Method Change Gate strutturato quando realmente richiesto;
- promotion lineage dopo authority e promotion effettiva.

L'output non è quindi “una nuova regola”. È una **memoria metodologica tracciabile**, capace di distinguere osservazione, apprendimento, validazione e cambiamento autorizzato.

---

# 43.16 Failure mode principali

**Ogni evento diventa learning.** Il sistema confonde raccolta di evidenza e interpretazione, producendo rumore metodologico.

**VALIDATED trattato come PROMOTED.** Un apprendimento verificato viene applicato alla baseline senza il gate e l'authority richiesti.

**Generalizzazione eccessiva.** Un caso locale viene presentato come legge universale.

**Failure cancellata.** Learning rejected o superseded vengono rimossi e il sistema perde la capacità di riconoscere strade già falsificate.

**Timestamp tecnico scambiato per promotion.** Una data di aggiornamento o projection viene usata come prova del momento in cui il learning è diventato autorevole.

**Gate implicito.** Una richiesta di authority viene inferita da uno stato del learning invece di essere rappresentata da un oggetto strutturato persistente.

**Interpretazione automatica mascherata da determinismo.** Un collector o projector decide il significato di un'evidenza invece di limitarsi al proprio compito meccanico.

**Memoria metodologica stale.** Evidenze pendenti o modifiche materiali restano fuori dalla finestra di review mentre il sistema continua a dichiararsi `HEALTHY`.

---

# 43.17 Relazioni con gli altri elementi WCM

PROT-014 lavora soprattutto con:

- **PROC-009 — WCM Learning Loop**, che governa il ciclo di apprendimento;
- **PROC-004 — Evidence → Baseline Promotion**, quando un risultato deve diventare baseline secondo governance;
- **PROT-005 — Index-First Progressive Retrieval**, per navigare la memoria senza full reload;
- **PROT-013 — Knowledge Synapse & Health Standard**, per relazioni e health;
- la decisione autorevole che definisce il Learning System corrente.

Il protocollo non sostituisce questi elementi. Definisce lo standard con cui l'esperienza del metodo viene registrata e resa governabile.

---

# 43.18 Maturity e limiti

La baseline canonica di PROT-014 è **ACTIVE / FIELD VALIDATION**.

Questo significa che lo standard è attivo nel WCM corrente, ma la sua efficacia non deve essere presentata come universalmente dimostrata. La validazione sul campo continua e la capacità di generalizzare i learning deve essere valutata caso per caso.

Il protocollo non elimina il giudizio umano o cognitivo. Non garantisce che ogni evidenza venga interpretata correttamente e non rende automatico il passaggio da esperienza a regola.

Il suo valore è più preciso: rende esplicito **dove l'esperienza si trova nel percorso che va dall'osservazione alla possibile modifica del metodo**, conservando provenance, failure e authority boundary.

---

# 43.19 Source map

Fonte tecnica primaria:

- `wcm/process-book/protocols/PROT-014_METHOD_EXPERIENCE_MEMORY_STANDARD.md` — v1.1, `ACTIVE / FIELD VALIDATION`, authority `DEC-009`.

Fonti correlate richiamate dalla baseline primaria e usate solo per collocare il protocollo nel sistema:

- `DEC-009 WCM Learning System V1`;
- `PROC-009 WCM Learning Loop`;
- `PROC-004 Evidence → Baseline Promotion`;
- `PROT-005 Index-First Progressive Retrieval`;
- `PROT-013 Knowledge Synapse & Health Standard`.

Il capitolo non introduce nuove regole rispetto alla baseline tecnica: traduce il protocollo in forma editoriale e pedagogica.

---

# 43.20 Regola finale da ricordare

> **L'esperienza può diventare memoria prima di diventare regola. Una regola cambia solo quando evidenza, governance e authority hanno completato il loro percorso.**
