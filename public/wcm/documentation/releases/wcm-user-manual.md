# WCM — User Manual

**Versione:** 0.2  
**Data:** 2026-08-20  
**Stato:** ACTIVE / LIVING PROJECTION / FIELD VALIDATION  
**Pubblico:** utilizzatori WCM / owner / Board  
**Authority:** human-facing projection governata da `DEC-010`; non sostituisce Governance, Process Book o Project State

---

# 1. A cosa serve questo manuale

Questo manuale spiega **come usare WCM concretamente**.

Non descrive in dettaglio l'implementazione tecnica e non sostituisce le regole di governance. Serve a capire:

- dove guardare;
- cosa significa ciò che si vede;
- quando è richiesta un'azione umana;
- cosa può fare WCM autonomamente;
- come leggere stato, documenti, Knowledge Health e Learning;
- come consultare la documentazione ufficiale WCM.

---

# 2. Entrare in Mission Control

Mission Control è la principale superficie umana del WCM.

Percorso corrente:

`/wcm`

Dopo l'accesso autenticato si apre la Home del portfolio.

La Home permette di capire rapidamente:

- quanti progetti sono attivi;
- quanti Need richiedono l'attenzione dell'owner;
- quante decisioni sono già in elaborazione;
- quanti documenti devono essere letti;
- lo stato del WCM Learning;
- l'accesso alla Documentazione WCM;
- lo stato sintetico dei singoli progetti.

---

# 3. Home: cosa guardare per prima cosa

## Progetti
Apre l'elenco dei progetti WCM.

## Needs Stefano
Mostra le decisioni o azioni che richiedono realmente l'intervento dell'owner. Se il numero è maggiore di zero, è normalmente il primo punto da controllare.

## Pending
Mostra decisioni già effettuate ma ancora in elaborazione dal sistema. `Pending` non significa necessariamente che devi intervenire di nuovo.

## Documenti da leggere
Mostra i documenti collegati a un Need o a un passaggio che richiede lettura umana.

## WCM Learning
Apre la vista globale di ciò che WCM sta imparando dall'esperienza.

## Documentazione WCM
Apre il Documentation Center con Technical Reference, Executive / Client Guide e User Manual.

---

# 4. Progetti

Aprendo un progetto puoi trovare, in funzione della configurazione applicabile:

- Overview;
- stato/fase;
- focus corrente;
- next action;
- Board;
- Documents;
- Activity;
- Roadmap;
- Knowledge;
- Steward Activity.

Non tutti i progetti devono avere la stessa struttura interna: WCM è domain-agnostic e i workflow specifici dipendono dal progetto.

---

# 5. Needs Stefano

Un **Need** rappresenta qualcosa che richiede attenzione umana.

Può trattarsi, per esempio, di una scelta autoriale o strategica, una Board decision, una richiesta di approvazione, una modifica da valutare o un problema semantico che il sistema non può risolvere meccanicamente.

## Come usarlo
1. apri `Needs Stefano`;
2. identifica il progetto;
3. leggi titolo e azione richiesta;
4. apri gli eventuali documenti collegati;
5. prendi la decisione richiesta attraverso il canale previsto.

Un Need `OPEN` non va considerato risolto soltanto perché hai letto il documento.

---

# 6. Decisioni in elaborazione / Pending

Quando hai già inviato una decisione, il sistema può mostrare il relativo elemento tra le decisioni in elaborazione.

Questo significa che l'authority è stata inviata o registrata, ma il workflow può dover ancora completare gli effetti previsti.

> Se il sistema dichiara che la decisione è in elaborazione e non presenta una nuova azione richiesta, non ripetere inutilmente lo stesso comando.

---

# 7. Documents

La sezione Documents permette di consultare gli artefatti human-facing di un progetto.

Un documento può essere approved/frozen, candidate, unapproved, Board package o working document.

## Distribuzione ≠ approvazione

Un documento può essere scaricabile o condivisibile anche se non è approvato. Quando è non approvato, Mission Control deve renderlo visibile chiaramente.

Scaricare o condividere un documento non lo approva, non lo congela, non modifica il progetto e non conferisce authority.

---

# 8. Board

La sezione Board raccoglie le informazioni necessarie alle decisioni riservate quando il workflow del progetto prevede un Board Gate.

Un comando umano valido viene autenticato, registrato in modo durevole, conferisce l'authority specifica dichiarata e deve poi essere consumato dal workflow.

**Authority Receipt ≠ execution**: la registrazione della tua decisione non significa che tutti gli effetti siano già stati completati nello stesso istante.

---

# 9. Activity e Roadmap

Activity serve a ricostruire cosa è successo nel progetto. Roadmap mostra il percorso pianificato.

Leggile così:

- State = dove siamo ora;
- Roadmap = dove stiamo andando;
- Need = cosa richiede una decisione umana;
- Activity = cosa è successo.

---

# 10. Knowledge Health

WCM non si limita a conservare documenti: controlla anche la coerenza della memoria organizzativa.

## HEALTHY
La memoria è strutturalmente coerente rispetto ai controlli applicabili e il check è sufficientemente recente. Non significa che il progetto sia perfetto.

## DEGRADED
Esistono anomalie o debiti che riducono la qualità della memoria ma non necessariamente bloccano ogni attività.

## STALE / CHECK REQUIRED
L'ultimo controllo è precedente a un cambiamento materiale o non è più sufficiente per dichiarare la memoria corrente.

## CRITICAL
Esiste un problema incompatibile con una transizione knowledge-sensitive sicura.

---

# 11. Synapses, drift e orphan

Le Knowledge Synapses sono relazioni esplicite tra elementi della memoria. Aiutano a comprendere dipendenze, impatti e continuità.

- `ACTIVE` — relazione corrente;
- `AT_RISK` — relazione da verificare;
- `BROKEN` — relazione non più valida;
- `orphan` — elemento non sufficientemente collegato;
- `drift` — disallineamento tra rappresentazioni che dovrebbero essere coerenti.

Più sinapsi non significa automaticamente migliore qualità.

---

# 12. Knowledge Steward

Principio:

> Wise governa il significato. Knowledge Steward governa la memoria.

Il Knowledge Steward può correggere automaticamente soltanto anomalie appartenenti a repair class autorizzate e deterministiche. Se il problema richiede interpretazione, strategia, canone o altra decisione semantica, deve fermarsi e fare escalation.

Steward Activity permette di vedere cosa ha controllato, tentato, corretto o escalato.

---

# 13. WCM Learning

La pagina `/wcm/learning` mostra Method Knowledge Health, learning `PROMOTED`, `CANDIDATE`, eventuali learning in osservazione/validazione, evidence, review, sinapsi del metodo, confidence, generalizzabilità e provenance.

Un Candidate è un learning in maturazione, non una nuova regola. La pagina è read-only: osservare un learning non equivale ad approvarlo o promuoverlo.

---

# 14. Documentazione WCM — Documentation Center V0.9

Dalla Home trovi la card globale **Documentazione WCM**.

Percorso:

`/wcm/documentation`

La sezione contiene:

1. **WCM Technical Reference** — come è costruito WCM;
2. **WCM Executive / Client Guide** — cos'è WCM, a cosa serve e quali benefici offre;
3. **WCM User Manual** — come si usa WCM.

## Informazioni visibili
Per ciascun documento puoi vedere versione, data del master, stato, pubblico, source SHA e stato QA della release.

## Consulta
Il pulsante **Consulta** apre il documento nel reader Mission Control. Il reader usa lo snapshot Markdown appartenente alla stessa release dei file scaricabili.

## Scarica Word
Scarica la release `.docx` quando realmente disponibile e verificata.

## Scarica PDF
Scarica la release `.pdf` quando realmente disponibile e verificata.

## Source of truth

> GitHub `main` è la source of truth. Word e PDF sono release derivate.

Il download non modifica WCM, non approva il documento, non cambia governance e non genera authority.

Se un formato non è realmente prodotto o non supera QA, Mission Control non deve mostrare un download fittizio.

---

# 15. Come iniziare un nuovo progetto

In forma semplificata:

```text
INTENZIONE DI PROGETTO
        ↓
CLASSIFICAZIONE
        ↓
ADMISSION PREVIEW
        ↓
BOARD ADMISSION
        ↓
OWNER SOURCE INTAKE
        ↓
MEMORIA + GOAL + STATE + ROADMAP + GOVERNANCE
        ↓
READINESS REVIEW
        ↓
BOARD ACTIVATION
        ↓
WCM RUN
```

Non è sufficiente creare una cartella per dichiarare un progetto operativo.

---

# 16. Come interagire con Wise

Non è necessario impartire sempre istruzioni atomiche. Puoi esprimere un obiettivo, un problema o un'intenzione.

Wise deve ricostruire il contesto necessario, verificare state e authority, capire la prossima azione utile, eseguire direttamente quando possibile, delegare soltanto quando serve, proseguire attraverso le transizioni WCM RUN contigue e fermarsi a una vera stop condition o gate umano.

---

# 17. WCM RUN e WCM CHANGE per l'utente

## WCM RUN
È normale esecuzione di regole e workflow già autorizzati: report previsto, avanzamento di fase previsto, aggiornamento fedele dello State, release Word/PDF da un master corrente.

## WCM CHANGE
Modifica il metodo, governance, authority, architettura, goal/scope o altra decisione materiale.

Quando serve un Change Gate, Wise deve mostrare l'Impact Preview e fermarsi prima della modifica materiale finché non riceve l'authority richiesta.

---

# 18. Cosa fare quando…

## …vedo `BLOCKED_BOARD`
Apri il Need e il materiale Board collegato. Il workflow è fermo in attesa dell'authority o scelta prevista.

## …vedo `DEGRADED`
Apri Knowledge e verifica quali componenti sono degradate. Non assumere automaticamente che tutto il progetto sia bloccato.

## …vedo `STALE`
Il Knowledge Health deve essere aggiornato prima di considerarlo rappresentativo dello stato corrente.

## …un documento è `UNAPPROVED`
Puoi leggerlo e, se distribution-ready, anche scaricarlo. Non trattarlo come frozen/approved.

## …compare un nuovo Need
Aprilo, leggi l'azione richiesta e gli eventuali documenti collegati.

## …una mia decisione è Pending
Normalmente attendi che il workflow la consumi. Ripeti la decisione solo se il sistema segnala un errore o una nuova richiesta.

## …WCM Learning mostra un Candidate
È un learning in maturazione, non una nuova regola già approvata.

## …nel Documentation Center manca Word o PDF
La release non ha un artefatto verificato per quel formato e deve essere rigenerata.

## …voglio cambiare una regola WCM
Descrivi il cambiamento desiderato. Wise deve classificarlo e, se materiale, applicare il WCM Change Gate.

---

# 19. Glossario minimo

| Termine | Significato pratico |
|---|---|
| WCM | Wise Centric Model |
| Wise | nucleo cognitivo/orchestratore |
| Mission Control | superficie umana di osservazione e governance |
| Need | richiesta di attenzione/decisione umana |
| Board Gate | punto in cui il workflow richiede authority del Board/owner |
| State | stato corrente autorevole del progetto |
| Knowledge Health | misura strutturale dell'integrità della memoria |
| Knowledge Steward | manutentore dell'integrità meccanica della memoria |
| Synapse | relazione tipizzata tra elementi di conoscenza |
| Learning | proposizione metodologica derivata dall'esperienza |
| Candidate | learning non ancora promosso a baseline |
| WCM RUN | esecuzione conforme alla baseline vigente |
| WCM CHANGE | modifica materiale del metodo/authority/baseline |
| Source of truth | fonte autorevole che prevale sulle proiezioni |
| Release | artefatto derivato e distribuibile di un master corrente |

---

# 20. Regola finale

Quando non sai dove guardare:

```text
MISSION CONTROL HOME
   ↓
NEEDS STEFANO?
   ├─ SÌ → gestisci il Need
   └─ NO
        ↓
PROGETTO / STATO
        ↓
DOCUMENTI / ROADMAP / KNOWLEDGE se necessari
```

Per capire WCM come sistema, usa **Documentazione WCM**. Per capire cosa richiede la tua attenzione adesso, usa **Needs Stefano**.

---

## Nota di authority

Questo manuale descrive l'esperienza utente corrente. Se una UI e una fonte WCM autorevole entrano in conflitto, la fonte autorevole prevale e il manuale deve essere riallineato. GitHub `main` resta la source of truth; Word e PDF sono release derivate con provenance verificabile.
