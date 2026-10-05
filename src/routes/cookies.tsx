import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/cookies")({
  head: () => ({ meta: [
    { title: "Cookie Policy — DataWisePartners" },
    { name: "description", content: "Informativa sui cookie del sito DataWisePartners: solo strumenti tecnici strettamente necessari." },
    { property: "og:title", content: "Cookie Policy — DataWisePartners" },
    { property: "og:description", content: "Nessun cookie di analytics, advertising o profilazione attivo su questo sito." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: CookiesPage,
});

function CookiesPage() {
  return <div className="overflow-hidden">
    <section className="page-hero legal-hero"><div className="site-container page-hero__layout"><div><p className="ai-kicker">Legale / Cookie</p><h1>Cookie Policy</h1></div><p>Come questo sito utilizza — e non utilizza — cookie e strumenti di tracciamento.</p></div></section>

    <section className="section-pad legal-section"><div className="site-container legal-content">
      <h2>1. Stato attuale del sito</h2>
      <p>Questo sito non utilizza cookie di analytics, advertising, profilazione o tracciamento di terze parti. Non sono attivi strumenti come Google Analytics, pixel pubblicitari o sistemi di remarketing.</p>

      <h2>2. Cookie tecnici</h2>
      <p>Possono essere presenti esclusivamente cookie o strumenti tecnici strettamente necessari al funzionamento e alla sicurezza del sito (ad esempio quelli gestiti dall'infrastruttura di hosting). Questi strumenti non richiedono il consenso dell'utente e non vengono utilizzati per analizzare il comportamento di navigazione.</p>

      <h2>3. Perché non vedi un banner del consenso</h2>
      <p>Poiché non sono attivi cookie o strumenti diversi da quelli tecnici strettamente necessari, non è richiesto un banner per il consenso. Se in futuro verranno introdotti strumenti di analytics, advertising o tracciamento, questa policy sarà aggiornata e sarà raccolto il consenso preventivo dove richiesto dalla normativa.</p>

      <h2>4. Gestione dei cookie dal browser</h2>
      <p>Puoi comunque gestire o eliminare i cookie attraverso le impostazioni del tuo browser. La disattivazione dei cookie tecnici può compromettere il corretto funzionamento del sito.</p>

      <h2>5. Contatti</h2>
      <p>Per qualsiasi domanda su questa policy puoi scrivere a <a href="mailto:info@datawisepartners.it">info@datawisepartners.it</a>. Per il trattamento dei dati personali consulta la <Link to="/privacy">Privacy Policy</Link>.</p>

      <p className="legal-updated">Ultimo aggiornamento: ottobre 2026.</p>
    </div></section>
  </div>;
}
