# Capitolo 48 — PROT-019 — WCM Change Closure Standard

**PARTE VII — Il Libro dei Protocolli WCM**  
**Stato:** FROZEN  
**Data:** 2026-09-02  
**Scope:** WCM generale, domain-agnostic

---

# 48.0 Finire una modifica non significa averla chiusa

Quando si cambia una parte importante di un sistema organizzativo, è facile confondere due momenti diversi.

Il primo è il momento in cui la modifica principale è stata realizzata. Il secondo è quello in cui tutte le conseguenze della modifica sono state propagate, controllate e rese coerenti con il resto del sistema.

Nel WCM questi due momenti non coincidono.

Il principio centrale di PROT-019 è infatti molto semplice:

> **IMPLEMENTED ≠ CLOSED.**

Una modifica può funzionare nel punto in cui è stata applicata e, nello stesso tempo, lasciare indici, documentazione, registri, automazioni o altre rappresentazioni ancora allineati alla situazione precedente.

PROT-019 — **WCM Change Closure Standard** — esiste per impedire che una modifica materiale del WCM venga dichiarata chiusa troppo presto.

---

# 48.1 Il problema: una modifica produce conseguenze

Immaginiamo un'organizzazione che cambi una regola interna importante.

La nuova regola viene scritta correttamente. Chi la applica direttamente la vede e può usarla. Sembrerebbe quindi naturale dire: «modifica completata».

Ma quella regola potrebbe essere citata anche da un indice, un manuale, una mappa dell'architettura, un registro, un'automazione, un controllo di coerenza o una vista derivata.

Se anche uno solo degli elementi rilevanti rimane indietro, la modifica è stata **implementata**, ma il sistema non è ancora interamente coerente.

Questo è il problema che il protocollo affronta: non verificare soltanto *che cosa è stato cambiato*, ma anche *dove quel cambiamento deve arrivare*.

---

# 48.2 Che cos'è una WCM CHANGE

PROT-019 si applica alle modifiche materiali del WCM: cambiamenti che incidono sul metodo, sui processi, sui protocolli, sull'architettura, sulla governance o su altri elementi autorevoli del sistema.

Non decide però se una modifica debba essere approvata. L'authority viene prima.

```text
PROPOSTA DI CAMBIAMENTO
        ↓
IMPACT PREVIEW
        ↓
AUTHORITY ESPLICITA
        ↓
IMPLEMENTAZIONE CONTROLLATA
        ↓
PROPAGAZIONE
        ↓
VERIFICA DI CHIUSURA
        ↓
CLOSED
```

Il closure gate non concede quindi il permesso di cambiare il WCM. Controlla che una modifica **già autorizzata** sia stata portata a compimento in modo coerente.

---

# 48.3 Il Change Impact Manifest: la mappa delle conseguenze

Per poter verificare la propagazione serve prima sapere quali aree sono state toccate.

Il WCM usa per questo un **Change Impact Manifest**. Il nome può sembrare tecnico, ma il concetto è semplice: è la distinta degli impatti della modifica.

Per ogni categoria rilevante il manifest dichiara, in sostanza:

1. questa area è coinvolta oppure no?
2. se è coinvolta, perché?
3. quali elementi devono essere aggiornati o verificati?
4. quale intervallo di cambiamento stiamo controllando?

Non è una lista decorativa. È il contratto che permette al controllo di closure di confrontare ciò che *doveva* essere propagato con ciò che *è stato realmente* propagato.

Se una modifica incide sui protocolli, il registro dei processi e protocolli deve essere compreso nell'impatto. Se incide sull'architettura, deve essere considerato l'indice architetturale. Se cambia una fonte della Method KB, devono essere coperti l'indice della Method KB e, quando necessario, il registro delle fonti canoniche. Lo stesso principio vale per documentazione, automazioni e entry point.

---

# 48.4 Perché il controllo deve guardare l'intera modifica

Una modifica materiale può richiedere più passaggi successivi. Il primo intervento può cambiare una regola, il secondo un indice, il terzo la documentazione, il quarto il manifest.

Controllare soltanto l'ultimo passaggio sarebbe pericoloso: si vedrebbe una frazione della modifica e non il suo effetto complessivo.

Per questo la baseline corrente di PROT-019 richiede un confine iniziale esatto, chiamato `base_sha`, e un punto finale esatto della verifica, il `closure_head_sha`.

Non è necessario conoscere Git per comprenderne il significato. Possiamo pensarli come due sigilli:

> «La modifica comincia subito dopo questa fotografia certificata e termina, ai fini di questo controllo, con quest'altra fotografia certificata.»

Il checker deve esaminare **tutto ciò che è cambiato tra i due confini**. Questo evita che un elemento modificato in un passaggio intermedio scompaia dal radar soltanto perché l'ultimo passaggio non lo tocca più.

---

# 48.5 Lo stato di una modifica

PROT-019 distingue le principali fasi del cambiamento:

```text
PROPOSED
→ AUTHORIZED
→ IMPLEMENTING
→ READY_FOR_CLOSURE
→ PROPAGATION_PASS
→ CLOSED
```

`AUTHORIZED` significa che esiste authority per procedere. `IMPLEMENTING` significa che la modifica è in lavorazione. `READY_FOR_CLOSURE` significa che implementazione e propagazione dichiarata sono pronte per essere verificate. `PROPAGATION_PASS` significa che il controllo previsto ha dato esito positivo. `CLOSED` richiede anche la persistenza dell'evidenza di closure prevista dalla baseline corrente.

Quindi nemmeno un controllo tecnico verde, da solo, è sufficiente a rendere durevole la chiusura.

---

# 48.6 Fail closed: se manca una prova, non inventarla

Il protocollo applica un principio ricorrente nel WCM: **fail closed**.

Quando una condizione obbligatoria non può essere verificata, il sistema non completa il passaggio per ottimismo.

Il closure check deve fallire, per esempio, se manca il manifest richiesto, una categoria impattata non è dichiarata correttamente, un percorso dichiarato non esiste, un elemento canonico modificato non è coperto, un indice obbligatorio non è incluso, una modifica di automazione non è riflessa dove previsto o la salute della conoscenza richiesta non è verificata.

Il risultato non è «la modifica è sbagliata». È più preciso:

> **non esistono ancora le condizioni per dichiararla CLOSED.**

Un gate di closure verifica condizioni di chiusura; non sostituisce il giudizio sul significato della modifica.

---

# 48.7 Il checker non deve riscrivere la realtà

Un controllo automatico potrebbe essere tentato di «aggiustare» ciò che trova per riuscire a passare. PROT-019 lo vieta sul piano semantico.

Il checker può verificare presenza, copertura, percorsi, relazioni strutturali e condizioni dichiarate. Non può cambiare il significato dei documenti per produrre artificialmente un PASS.

```text
COGNIZIONE / AUTHORITY
→ decide significato e impatto

CHECKER DETERMINISTICO
→ verifica condizioni già determinate
```

In altre parole, il termometro può misurare la temperatura; non può modificarla per far risultare sano il paziente.

---

# 48.8 Knowledge Health come condizione di closure

Una modifica può essere formalmente propagata e lasciare comunque la memoria metodologica incoerente.

Per questo il closure check corrente richiede anche che il **Method Knowledge Health** sia `HEALTHY` e, nella baseline attuale di closure, con il livello previsto dal contratto applicabile.

Knowledge Health non afferma che il metodo sia perfetto. Verifica che la memoria metodologica interessata sia strutturalmente coerente, raggiungibile e sufficientemente corrente rispetto ai controlli previsti.

```text
HEALTHY
≠ metodo universalmente corretto

HEALTHY
= condizioni di integrità della conoscenza verificate
```

PROT-019 usa quindi la salute della conoscenza come parte della prova di chiusura, non come certificazione assoluta della bontà del WCM.

---

# 48.9 La Closure Receipt: rendere durevole il PASS

Un risultato positivo che esiste soltanto durante l'esecuzione di un controllo può andare perso o diventare ambiguo.

La baseline corrente introduce quindi una **Closure Receipt**: una ricevuta di chiusura persistente, immutabile e idempotente.

La ricevuta lega tra loro identità della modifica, manifest controllato, confine iniziale, confine finale, risultato PASS, condizione di Method Knowledge Health e provenienza del controllo.

Il manifest resta `READY_FOR_CLOSURE`: descrive ciò che entra nel gate. La Closure Receipt descrive invece ciò che il gate ha effettivamente attestato.

Questa separazione evita di riscrivere retroattivamente l'oggetto che chiedeva la verifica per fargli rappresentare anche il risultato della verifica stessa.

---

# 48.10 Perché la ricevuta deve essere idempotente

Idempotenza significa che ripetere la stessa operazione con gli stessi elementi essenziali non deve creare effetti diversi o duplicati.

Se una Closure Receipt valida esiste già per la stessa identità di change e gli stessi confini, un replay non deve generare una seconda verità concorrente. Se invece esiste una ricevuta con elementi fondamentali differenti, il sistema deve fermarsi.

La chiusura diventa così una proprietà verificabile della storia del cambiamento, non una semplice etichetta aggiornata nell'ultima vista disponibile.

---

# 48.11 Perché un PASS locale non basta sempre

Durante lo sviluppo di una modifica è utile eseguire controlli locali. Ma un PASS locale non equivale necessariamente alla closure finale.

Il controllo finale può richiedere condizioni che esistono soltanto sullo stato integrato effettivo: l'intero intervallo di cambiamento, gli indici correnti, la salute della conoscenza e la persistenza della ricevuta.

> **Test riuscito ≠ propagazione completa ≠ closure persistita.**

---

# 48.12 Il recovery storico non è una scorciatoia

La baseline prevede anche il caso di modifiche storiche realizzate prima che tutte le regole di closure attuali fossero disponibili.

È possibile ricostruire la verifica, ma non inventando i confini mancanti. Il recovery deve dichiarare riferimenti esatti e produrre evidenza sufficiente. Le versioni più recenti del manifest usano il confine iniziale canonico; i manifest legacy richiedono una ricostruzione esplicita del confine previsto dal percorso di backfill.

Se l'evidenza non basta, il sistema non dichiara la modifica chiusa. Il backfill è uno strumento di recupero controllato, non un modo per aggirare le regole correnti.

---

# 48.13 Un esempio astratto

Supponiamo che un'organizzazione introduca una nuova regola per approvare documenti sensibili.

La regola viene implementata correttamente nel protocollo principale. Il Change Impact Manifest dichiara però che la modifica incide anche su registro dei protocolli, manuale operativo, indice della conoscenza e automazione di controllo.

Il protocollo principale è corretto, ma il manuale descrive ancora la regola precedente.

```text
REGOLA IMPLEMENTATA
        ↓
MANIFEST: DOCUMENTAZIONE IMPATTATA
        ↓
MANUALE NON ALLINEATO
        ↓
PROPAGATION_GATE_FAIL
        ↓
NOT CLOSED
```

Dopo l'aggiornamento autorizzato degli elementi dichiarati, il controllo può essere ripetuto. Se l'intero intervallo è coperto, gli indici richiesti sono coerenti, la salute della conoscenza soddisfa il contratto e il PASS viene materializzato nella ricevuta prevista, allora la modifica può risultare effettivamente `CLOSED`.

---

# 48.14 Relazione con PROC-012

PROT-019 e PROC-012 descrivono lo stesso problema da due prospettive diverse.

**PROC-012 — WCM Change Propagation & Closure** descrive il processo completo: dalla modifica autorizzata fino alla propagazione, ai controlli e alla chiusura.

**PROT-019** stabilisce invece le regole trasversali che quel processo deve rispettare per poter dichiarare la closure.

```text
PROC-012
= COME attraversare il ciclo di propagazione e chiusura

PROT-019
= QUALI condizioni rendono valida la chiusura
```

Il protocollo dipende inoltre dai meccanismi di consolidamento della memoria, assurance della conoscenza e continuità documentale. È collegato anche agli standard sulle sinapsi, sulla pubblicazione documentale e sulla sicurezza delle mutazioni persistenti.

---

# 48.15 Cosa PROT-019 non fa

PROT-019 non approva una WCM CHANGE, non inventa l'Impact Set, non decide il significato di una modifica, non amplia l'authority di chi la esegue, non promuove automaticamente learning, non autorizza un checker a correggere semanticamente il canone e non rende vero ciò che non è verificabile.

Il suo compito è più ristretto e, proprio per questo, più controllabile: **impedire una falsa closure**.

---

# 48.16 Failure mode principali

I failure mode principali sono: falsa equivalenza tra implementazione e closure; manifest incompleto; verifica su un intervallo troppo piccolo; indice o registro stale; health non verificata; PASS volatile non materializzato nella ricevuta; auto-correzione semantica del checker; recovery storico ambiguo.

In tutti questi casi la risposta corretta è conservativa: la modifica può essere implementata, ma non deve essere dichiarata `CLOSED`.

---

# 48.17 Deterministic Core e Cognitive Core

PROT-019 mostra bene una separazione fondamentale del WCM.

Il **Cognitive Core** è utile per comprendere il significato della modifica, individuare gli impatti, spiegare le conseguenze e preparare una proposta di propagazione.

Il **Deterministic Core** è adatto a verificare condizioni che non devono dipendere da interpretazioni variabili: esistenza dei file, copertura dell'intervallo, presenza degli indici obbligatori, coerenza dei riferimenti strutturati, risultato del gate, persistenza idempotente della ricevuta.

L'authority resta separata da entrambi: una verifica automatica non può trasformarsi in autorizzazione.

---

# 48.18 Maturità e limiti

PROT-019 è una baseline **ACTIVE / FIRST FIELD VALIDATION**.

Questo significa che il protocollo è attivo e dispone di una prima evidenza operativa, ma non implica che ogni variante di change, ogni ambiente o ogni combinazione di dipendenze sia stata validata universalmente.

La baseline corrente comprende già estensioni importanti rispetto al nucleo iniziale: verifica dell'intero intervallo multi-passaggio, Closure Receipt durevole e recovery controllato per casi storici.

Resta comunque necessario trattare la maturità per ciò che è: evidenza crescente, non prova assoluta.

---

# 48.19 La regola da ricordare

Se dovessimo ridurre PROT-019 a una sola domanda, sarebbe questa:

> **Abbiamo soltanto realizzato la modifica, oppure abbiamo anche verificato che tutte le sue conseguenze dichiarate siano arrivate dove dovevano arrivare?**

Nel WCM la risposta non viene dedotta da una sensazione di completezza. Viene costruita attraverso impact manifest, propagazione, controllo dell'intero intervallo, assurance della conoscenza e una prova persistente dell'esito.

```text
IMPLEMENTED
≠
PROPAGATED
≠
CLOSED
```

La chiusura non è l'ultimo gesto della modifica. È **l'evidenza verificabile che la modifica autorizzata non ha lasciato il sistema a metà strada**.

---

## Source Map

Fonti canoniche utilizzate per il Technical Truth Pass:

- `WCM_AGENT_START.md` — authority boundary, WCM CHANGE e closure gate;
- `wcm/kb/index.md` — INDEX-FIRST e riferimenti correnti;
- `wcm/process-book/protocols/PROT-019_WCM_CHANGE_CLOSURE_STANDARD.md` — baseline canonica del protocollo;
- `wcm/process-book/processes/PROC-012_WCM_CHANGE_PROPAGATION_CLOSURE.md` — processo collegato e sequenza di propagazione/closure;
- `wcm/documentation/process-memory-book/BOOK_INDEX.md` — mapping editoriale CH48 → PROT-019.
