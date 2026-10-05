import { ArrowRight } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/come-lavoriamo")({
  head: () => ({ meta: [
    { title: "Come lavoriamo — DataWisePartners" },
    { name: "description", content: "Partiamo dal lavoro reale, non dalla tecnologia da vendere: ascoltare, analizzare, strutturare, costruire, validare, evolvere." },
    { property: "og:title", content: "Come lavoriamo — DataWisePartners" },
    { property: "og:description", content: "Un metodo concreto per costruire fondamenta solide e capacità AI che evolvono con l'azienda." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MethodPage,
});

const phases = [
  ["01", "Ascoltare", "Persone, obiettivi, vincoli e problemi così come si presentano nel lavoro quotidiano."],
  ["02", "Analizzare", "Dati, sistemi, processi e conoscenza che determinano ciò che oggi è possibile."],
  ["03", "Strutturare", "Fondamenta, priorità e regole che rendono il contesto leggibile e governabile."],
  ["04", "Costruire", "La soluzione utile, combinando componenti pronti e sviluppo custom dove serve."],
  ["05", "Validare", "Risultati, comprensibilità e aderenza al lavoro reale insieme a chi userà la soluzione."],
  ["06", "Evolvere", "Nuove capacità innestate su fondamenta che restano solide e disponibili."],
];

function MethodPage() {
  return <div className="overflow-hidden">
    <section className="page-hero method-hero"><div className="site-container page-hero__layout"><div><p className="ai-kicker">Come lavoriamo / Metodo</p><h1>Partiamo dal lavoro reale, non dalla tecnologia da vendere.</h1></div><p>Sappiamo capire il lavoro. E sappiamo riprogettarlo con gli strumenti di oggi.</p></div></section>

    <section className="section-pad"><div className="site-container"><div className="page-intro"><div><p className="section-label"><span>01</span><span>Il processo</span></p><h2 className="section-title">Dalla comprensione all'evoluzione.</h2></div><p className="ai-lead">Ogni fase riduce l'incertezza e prepara la successiva. Non imponiamo una tecnologia: costruiamo il percorso adatto al contesto.</p></div><ol className="method-timeline">{phases.map(([number, title, text]) => <li key={title}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowRight aria-hidden="true" /></li>)}</ol></div></section>

    <section className="section-pad method-principles"><div className="site-container"><p className="section-label"><span>02</span><span>Principi di lavoro</span></p><div className="principles-grid"><article><span>CONCRETEZZA</span><h2>Un problema riconoscibile prima di una soluzione.</h2><p>Il valore si misura nella capacità di migliorare il lavoro, non nella quantità di tecnologia impiegata.</p></article><article><span>GOVERNANCE</span><h2>Controllo e contesto fin dall'inizio.</h2><p>Dati, regole, responsabilità e permessi fanno parte della soluzione, non vengono aggiunti dopo.</p></article><article><span>EVOLUZIONE</span><h2>Costruire oggi senza chiudere il domani.</h2><p>Ogni passo deve creare una base che possa accogliere nuove possibilità e nuovi modi di lavorare.</p></article></div></div></section>

    <section className="page-cta"><div className="site-container"><p>Ascoltare → Analizzare → Strutturare → Costruire → Validare → Evolvere</p><h2>Iniziamo da ciò che oggi rallenta il lavoro.</h2><Button asChild size="lg"><Link to="/contact">Parliamone <ArrowRight /></Link></Button></div></section>
  </div>;
}