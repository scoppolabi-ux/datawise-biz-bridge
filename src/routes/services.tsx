import { ArrowRight, Bot, Boxes, Database, MessageSquareText, ScanLine } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [
    { title: "Soluzioni AI-ready — DataWisePartners" },
    { name: "description", content: "Fondamenta dati, intelligence conversazionale, organizzativa, spaziale e agentica per rendere l'azienda AI-ready." },
    { property: "og:title", content: "Soluzioni AI-ready — DataWisePartners" },
    { property: "og:description", content: "Dati, processi e conoscenza diventano fondamenta concrete per integrare l'AI nel lavoro." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ServicesPage,
});

const stages = [
  { number: "00", title: "Fondamenta AI-ready", text: "Dati, KPI, processi, sistemi e conoscenza diventano leggibili, collegabili e governati.", icon: Database },
  { number: "01", title: "Conversational Intelligence", text: "Le persone interrogano informazioni e metriche aziendali in linguaggio naturale, senza cercare la risposta tra sistemi separati.", icon: MessageSquareText },
  { number: "02", title: "Organizational Intelligence", text: "L'AI comprende progressivamente documenti, regole, ruoli, processi e conoscenza operativa.", icon: Boxes },
  { number: "03", title: "Spatial Intelligence", text: "Dati e processi si visualizzano e si interrogano nello spazio, offrendo nuove prospettive sulla realtà aziendale.", icon: ScanLine },
  { number: "04", title: "Agentic / Autonomous Intelligence", text: "Su fondamenta solide, l'AI può passare dalla risposta all'azione, entro regole e permessi espliciti.", icon: Bot },
];

const capabilities = [
  ["Business Intelligence", "Semantic model, KPI e dashboard che rendono il business leggibile."],
  ["Data integration", "Fonti e sistemi collegati in una struttura coerente e affidabile."],
  ["Conversational BI", "Un accesso naturale all'intelligence aziendale, fondato sui dati governati."],
  ["Context / Knowledge", "Documenti, regole e conoscenza organizzati perché l'AI comprenda il contesto."],
  ["AI & Automation", "Interazioni e azioni progettate con controlli, responsabilità e governance."],
  ["Soluzioni custom", "Architetture costruite intorno al lavoro reale e ai sistemi già presenti."],
];

function ServicesPage() {
  return <div className="overflow-hidden">
    <section className="page-hero"><div className="site-container page-hero__layout"><div><p className="ai-kicker">Soluzioni / AI-ready</p><h1>Dalle fondamenta all'intelligence operativa.</h1></div><p>Non partiamo da una tecnologia da applicare. Partiamo da dati, processi, sistemi e conoscenza per costruire ciò che rende l'azienda continuamente innovabile.</p></div></section>

    <section className="section-pad"><div className="site-container"><div className="page-intro"><div><p className="section-label"><span>01</span><span>Il percorso</span></p><h2 className="section-title">AI-ready è il punto di partenza.</h2></div><p className="ai-lead">Prima rendiamo l'azienda comprensibile e collegabile. Poi costruiamo modi sempre più naturali, contestuali e autonomi di lavorare con la sua intelligence.</p></div><div className="journey-rail page-journey">{stages.map(({ number, title, text, icon: Icon }) => <article className="journey-step" key={title}><div className="journey-step__top"><span>{number}</span><Icon aria-hidden="true" /></div><p className="journey-step__short">Evoluzione</p><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="section-pad capability-section"><div className="site-container"><div className="page-intro"><div><p className="section-label"><span>02</span><span>Capability DWP</span></p><h2 className="section-title">La complessità resta dietro. Il risultato diventa utilizzabile.</h2></div><p className="ai-lead">Competenze diverse lavorano come un unico sistema: BI e dati danno solidità; contesto, conversazione e automazione aprono nuove possibilità.</p></div><div className="capability-grid">{capabilities.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="section-pad delivery-section"><div className="site-container delivery-layout"><div><p className="section-label"><span>03</span><span>Come prende forma</span></p><h2 className="section-title">Plug&Play dove accelera. Custom dove fa la differenza.</h2></div><div className="delivery-modes"><article><span>PLUG&PLAY</span><h3>Partire da componenti già pronti.</h3><p>Quando il contesto lo consente, integriamo capacità già disponibili per ridurre il tempo tra esigenza e utilizzo.</p></article><article><span>CUSTOM</span><h3>Progettare intorno all'azienda.</h3><p>Quando processi, dati o obiettivi sono specifici, costruiamo una soluzione aderente al lavoro reale e all'architettura esistente.</p></article></div></div></section>

    <section className="page-cta"><div className="site-container"><p>AI-ready è il punto di partenza.</p><h2>Quale capacità deve diventare possibile nella tua azienda?</h2><Button asChild size="lg"><Link to="/contact">Parliamone <ArrowRight /></Link></Button></div></section>
  </div>;
}