import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [
    { title: "Privacy Policy — DataWisePartners" },
    { name: "description", content: "Informativa sul trattamento dei dati personali del sito DataWisePartners." },
    { property: "og:title", content: "Privacy Policy — DataWisePartners" },
    { property: "og:description", content: "Come trattiamo i dati di navigazione e quelli inviati tramite il form contatti." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return <div className="overflow-hidden">
    <section className="page-hero legal-hero"><div className="site-container page-hero__layout"><div><p className="ai-kicker">Legale / Privacy</p><h1>Privacy Policy</h1></div><p>Informativa sul trattamento dei dati personali ai sensi del Regolamento (UE) 2016/679 (GDPR).</p></div></section>

    <section className="section-pad legal-section"><div className="site-container legal-content">
      <h2>1. Titolare del trattamento</h2>
      <address className="legal-owner">
        DataWisePartners S.R.L.<br />
        J23/2136/2025<br />
        CIF/VAT RO51133532<br />
        Sede Rappresentanza: via Cadore - Cernusco sul Naviglio (MI)<br />
        <a href="mailto:info@datawisepartners.it">info@datawisepartners.it</a>
      </address>

      <h2>2. Dati trattati</h2>
      <h3>Dati tecnici di navigazione</h3>
      <p>I sistemi informatici che gestiscono questo sito acquisiscono, nel normale esercizio, alcuni dati tecnici (ad esempio indirizzo IP, data e ora della richiesta, pagine visitate) strettamente necessari al funzionamento e alla sicurezza del servizio. Questi dati non vengono utilizzati per analisi statistiche o di profilazione.</p>
      <h3>Dati forniti volontariamente tramite WhatsApp</h3>
      <p>Questo sito non raccoglie dati personali tramite form interni. Se scegli di contattarci dalla pagina <Link to="/contact">Contatti</Link>, vieni reindirizzato a WhatsApp, un servizio esterno che applica i propri termini e la propria informativa privacy. Dei dati che ci invii tramite quel messaggio (ad esempio nome, recapiti e contenuto della richiesta), il Titolare tratta solo quanto necessario per risponderti.</p>

      <h2>3. Finalità e base giuridica</h2>
      <p>I dati ricevuti tramite il contatto WhatsApp sono trattati esclusivamente per rispondere alla tua richiesta e gestire il contatto, incluse eventuali attività precontrattuali da te richieste (art. 6, par. 1, lett. b GDPR). I dati tecnici di navigazione sono trattati per il legittimo interesse a garantire funzionamento e sicurezza del sito (art. 6, par. 1, lett. f GDPR).</p>

      <h2>4. Cosa non facciamo</h2>
      <p>In questa versione del sito:</p>
      <ul>
        <li>non inviamo newsletter né comunicazioni di marketing automatiche;</li>
        <li>non svolgiamo attività di profilazione;</li>
        <li>non utilizziamo strumenti di analytics (ad esempio Google Analytics) né cookie pubblicitari o di tracciamento.</li>
      </ul>

      <h2>5. Conservazione</h2>
      <p>I dati ricevuti tramite il contatto sono conservati per il tempo necessario a gestire la tua richiesta e, in caso di successivo rapporto, secondo i termini previsti dagli obblighi di legge applicabili.</p>

      <h2>6. Comunicazione e trasferimento dei dati</h2>
      <p>I dati non sono ceduti a terzi né diffusi. Possono essere trattati, per conto del Titolare, dai fornitori tecnici che erogano l'infrastruttura di hosting del sito, nel rispetto delle garanzie previste dal GDPR. Se ci contatti tramite WhatsApp, i dati scambiati sulla piattaforma sono trattati da WhatsApp secondo la propria informativa.</p>

      <h2>7. Diritti dell'interessato</h2>
      <p>Puoi esercitare in qualsiasi momento i diritti previsti dagli artt. 15-22 GDPR (accesso, rettifica, cancellazione, limitazione, portabilità, opposizione) scrivendo a <a href="mailto:info@datawisepartners.it">info@datawisepartners.it</a>. Hai inoltre diritto di proporre reclamo all'autorità di controllo competente.</p>

      <h2>8. Aggiornamenti</h2>
      <p>Questa informativa può essere aggiornata in caso di modifiche del sito o dei trattamenti. Ultimo aggiornamento: ottobre 2026.</p>
    </div></section>
  </div>;
}
