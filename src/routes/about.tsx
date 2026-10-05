import { ArrowRight, Check } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "Chi siamo — DataWisePartners" },
    { name: "description", content: "Professionisti dei dati, maturati con la Business Intelligence e cresciuti con l'Artificial Intelligence." },
    { property: "og:title", content: "Chi siamo — DataWisePartners" },
    { property: "og:description", content: "Esperienza concreta su dati, KPI e processi al servizio di aziende che vogliono diventare AI-ready." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AboutPage,
});

function AboutPage() {
  return <div className="overflow-hidden">
    <section className="page-hero page-hero--identity"><div className="site-container page-hero__layout"><div><p className="ai-kicker">Chi siamo / DWP</p><h1>Esperienza nei dati. Curiosità per ciò che viene dopo.</h1></div><p>Conosciamo ciò che c'era prima dell'AI. E sappiamo dove l'AI può portare il business oggi.</p></div></section>

    <section className="section-pad identity-page"><div className="site-container identity-page__layout"><p className="identity-code">BI<br />↓<br />AI</p><div><p className="section-label"><span>01</span><span>La nostra prospettiva</span></p><h2>Siamo maturati con la Business Intelligence.<br />Siamo cresciuti con l’Artificial Intelligence.<br />Oggi mettiamo ciò che abbiamo imparato al servizio della tua azienda.</h2><div className="identity-page__copy"><p>Le nostre radici sono nei modelli, nei KPI, nei semantic model, nei processi, nelle dashboard e nell'integrazione dei dati. È il lavoro necessario per rendere un'azienda leggibile e governabile.</p><p>Abbiamo seguito l'evoluzione dell'AI sperimentando nuovi modelli, interfacce e modi di interagire con l'intelligence aziendale. Continuiamo a fare ricerca e sviluppo perché ciò che è possibile cambia rapidamente.</p><p>Questa doppia prospettiva ci permette di progettare soluzioni all'avanguardia senza perdere solidità, contesto e governance.</p></div></div></div></section>

    <section className="section-pad credibility-section"><div className="site-container"><div className="page-intro"><div><p className="section-label"><span>02</span><span>Il nostro contributo</span></p><h2 className="section-title">Prima comprendere. Poi innovare.</h2></div><p className="ai-lead">L'AI diventa utile quando incontra una comprensione reale dell'azienda: del lavoro, dei dati, delle responsabilità e delle decisioni.</p></div><div className="credibility-grid"><article><Check /><h3>Fondamenta concrete</h3><p>Esperienza su dati, processi, KPI e sistemi che devono funzionare nel quotidiano.</p></article><article><Check /><h3>Evoluzione continua</h3><p>Ricerca applicata su LLM, agenti, Spatial Intelligence e nuove interfacce.</p></article><article><Check /><h3>Un'unica direzione</h3><p>Rendere l'azienda leggibile, collegabile e pronta a integrare ciò che verrà.</p></article></div></div></section>

    <section className="page-cta"><div className="site-container"><p>Non una AI agency generica. Non solo una software house o BI boutique.</p><h2>Parliamo del lavoro reale della tua azienda.</h2><Button asChild size="lg"><Link to="/contact">Parliamone <ArrowRight /></Link></Button></div></section>
  </div>;
}