import {
  ArrowDown,
  ArrowRight,
  Bot,
  Boxes,
  BrainCircuit,
  Check,
  Database,
  FileText,
  Gauge,
  KeyRound,
  MessageSquareText,
  Network,
  ScanLine,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import dwpLogo from "@/assets/dwp-logo-white-lockup.svg";
import sharedIntelligenceImageSrc from "@/assets/dwp-contesto-aziendale-llm.png";
const sharedIntelligenceImage = { url: sharedIntelligenceImageSrc };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DataWisePartners — Rendiamo la tua azienda AI-ready" },
      {
        name: "description",
        content: "Prepariamo dati, KPI, processi, conoscenza e sistemi perché l'AI possa capire davvero il business e diventare operativa.",
      },
      { property: "og:title", content: "DataWisePartners — Rendiamo la tua azienda AI-ready" },
      {
        property: "og:description",
        content: "Costruiamo le fondamenta che rendono l'azienda continuamente innovabile, con solidità, contesto e governance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const readinessBlocks = [
  { icon: Database, title: "Dati affidabili e accessibili", code: "DATA" },
  { icon: Gauge, title: "KPI e metriche condivise", code: "KPI" },
  { icon: Workflow, title: "Processi leggibili", code: "FLOW" },
  { icon: FileText, title: "Documenti e knowledge organizzati", code: "KNOW" },
  { icon: BrainCircuit, title: "Regole e contesto espliciti", code: "CTX" },
  { icon: Network, title: "Sistemi collegabili in modo sicuro", code: "API" },
  { icon: ShieldCheck, title: "Governance e permessi chiari", code: "GOV" },
];

const intelligenceJourney = [
  {
    number: "00",
    short: "AI-ready",
    title: "Fondamenta AI-ready",
    text: "Dati, sistemi, processi e conoscenza diventano leggibili, collegabili e governati.",
    icon: KeyRound,
  },
  {
    number: "01",
    short: "Conversational",
    title: "Conversational Intelligence",
    text: "Non cerchi più la risposta dentro report, dashboard e sistemi. La chiedi.",
    detail: "Le persone interrogano dati, KPI e informazioni aziendali in linguaggio naturale con il proprio LLM.",
    icon: MessageSquareText,
  },
  {
    number: "02",
    short: "Organizational",
    title: "Organizational Intelligence",
    text: "L'AI conosce progressivamente processi, documenti, regole, decisioni, ruoli e conoscenza aziendale.",
    icon: Boxes,
  },
  {
    number: "03",
    short: "Spatial",
    title: "Spatial Intelligence",
    text: "Dati, processi e intelligence si visualizzano e si interrogano nello spazio, aprendo nuovi modi di comprendere e governare la realtà aziendale.",
    icon: ScanLine,
  },
  {
    number: "04",
    short: "Agentic",
    title: "Agentic / Autonomous Intelligence",
    text: "Quando dati, contesto, regole e governance sono solidi, l'AI può non solo rispondere, ma anche agire.",
    icon: Bot,
  },
];

const buildingBlocks = [
  ["01", "Business Intelligence", "Semantic model, KPI e dashboard"],
  ["02", "Conversational BI", "Domande naturali, risposte fondate sui dati"],
  ["03", "Data integration", "Fonti e sistemi resi coerenti e collegabili"],
  ["04", "Context / Knowledge", "Documenti, regole e conoscenza organizzati"],
  ["05", "AI & Automation", "Intelligenza e azioni su fondamenta governate"],
  ["06", "Soluzioni custom", "Architetture costruite sul contesto reale"],
];

const businessAreas = ["Vendite & Margini", "Operations & Logistica", "Direzione & Controllo", "Finance & Custom"];
const method = ["Ascoltare", "Analizzare", "Strutturare", "Costruire", "Validare", "Evolvere"];

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="section-label"><span>{number}</span><span>{children}</span></div>;
}

function HeroSystemVisual() {
  return (
    <div className="ai-system" role="img" aria-label="Dati, processi, KPI, sistemi e conoscenza convergono in fondamenta AI-ready governate">
      <div className="ai-system__grid" aria-hidden="true" />
      <div className="ai-system__head"><span><i /> READINESS SYSTEM</span><span>DWP / 01</span></div>
      <div className="ai-system__sources" aria-hidden="true">
        {[
          ["DATI", "01"], ["KPI", "02"], ["PROCESSI", "03"], ["SISTEMI", "04"], ["KNOWLEDGE", "05"],
        ].map(([label, number]) => <div key={label}><span>{number}</span><strong>{label}</strong><i /></div>)}
      </div>
      <div className="ai-system__core" aria-hidden="true">
        <div className="ai-system__rings"><i /><i /><i /></div>
        <div><span>FOUNDATION STATUS</span><strong>AI-READY</strong><small>LEGGIBILE · COLLEGABILE · GOVERNATA</small></div>
      </div>
      <div className="ai-system__output" aria-hidden="true"><span>CAPACITÀ</span><strong>INNOVAZIONE CONTINUA</strong><ArrowRight /></div>
    </div>
  );
}

function SharedIntelligenceVisual() {
  return (
    <figure className="shared-intelligence-figure">
      <img
        src={sharedIntelligenceImage.url}
        alt="Ogni professionista usa il proprio LLM e tutti si collegano allo stesso contesto aziendale di dati, KPI, processi, documenti, regole e knowledge"
        className="shared-intelligence-image"
        width={1672}
        height={941}
        loading="lazy"
      />
    </figure>
  );
}

function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="hero-section ai-hero" aria-labelledby="hero-title">
        <div className="site-container ai-hero__layout">
          <div className="ai-hero__content">
            <div className="hero-brand"><img src={dwpLogo} alt="DataWisePartners — Dati intelligenti per decisioni sagge" className="hero-logo" /></div>
            <p className="ai-kicker">Business Intelligence × Artificial Intelligence</p>
            <h1 id="hero-title">Rendiamo la tua azienda <em>AI-ready.</em></h1>
            <p className="ai-hero__sub">Partiamo da quello che hai — dati, processi, KPI, sistemi e conoscenza aziendale — per costruire le fondamenta che permettono all'AI di capire davvero il tuo business e diventare uno strumento operativo.</p>
            <p className="ai-manifesto">Partiamo da quello che hai, per portarti dove oggi non puoi ancora immaginare.</p>
            <div className="ai-hero__actions">
              <Button asChild size="lg" className="h-12 bg-accent px-6 text-accent-foreground hover:bg-accent/90"><Link to="/contact">Parliamone <ArrowRight /></Link></Button>
              <Button asChild variant="outline" size="lg" className="h-12 border-primary-foreground/35 bg-transparent px-6 text-primary-foreground shadow-none hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/" hash="ai-ready">Scopri cosa significa essere AI-ready <ArrowDown /></Link></Button>
            </div>
          </div>
          <HeroSystemVisual />
        </div>
      </section>

      <section id="ai-ready" className="section-pad scroll-mt-20 ai-ready-section" aria-labelledby="ready-title">
        <div className="site-container">
          <SectionLabel number="01">Le fondamenta</SectionLabel>
          <div className="ai-section-intro">
            <h2 id="ready-title" className="section-title">Cosa significa essere AI-ready?</h2>
            <p className="ai-lead">Essere AI-ready significa avere un'azienda che può essere realmente compresa, interrogata e utilizzata dall'AI.</p>
          </div>
          <div className="readiness-grid" aria-label="Gli elementi di un'azienda AI-ready">
            {readinessBlocks.map(({ icon: Icon, title, code }, index) => (
              <article key={title} className="readiness-node">
                <div><span>0{index + 1}</span><code>{code}</code></div>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
              </article>
            ))}
          </div>
          <p className="readiness-outcome"><span>AI-ready</span> significa essere pronti a innovare. Sempre.</p>
        </div>
      </section>

      <section className="section-pad urgency-section" aria-labelledby="why-title">
        <div className="site-container urgency-layout">
          <SectionLabel number="02">Perché conta</SectionLabel>
          <div>
            <h2 id="why-title" className="section-title">Il mercato non aspetta che la tua azienda sia pronta.</h2>
            <div className="urgency-copy">
              <p>Il mercato cambia velocemente. Modelli, strumenti e possibilità evolvono di continuo.</p>
              <p>Non basta adottare una singola soluzione AI: serve costruire un'azienda che possa integrare rapidamente nuove tecnologie, nuovi modi di lavorare e nuove opportunità.</p>
            </div>
            <blockquote>Essere AI-ready significa trovarsi ai blocchi di partenza ogni volta che emerge una nuova opportunità.</blockquote>
            <p className="evergreen-line">Essere AI-ready non passa di moda.</p>
          </div>
        </div>
      </section>

      <section id="soluzioni" className="section-pad journey-section scroll-mt-20" aria-labelledby="journey-title">
        <div className="site-container">
          <SectionLabel number="03">L'evoluzione</SectionLabel>
          <div className="ai-section-intro">
            <div><h2 id="journey-title" className="section-title">Dove vogliamo portarti</h2><p className="ai-lead mt-7">Una volta costruite le fondamenta, cambia il modo in cui persone, dati e intelligenza lavorano insieme.</p></div>
            <p className="journey-note">AI-ready non è la destinazione.<br /><strong>È il punto di partenza.</strong></p>
          </div>
          <div className="journey-rail" aria-label="AI-ready, Conversational Intelligence, Organizational Intelligence, Spatial Intelligence, Agentic e Autonomous Intelligence">
            {intelligenceJourney.map(({ number, short, title, text, detail, icon: Icon }, index) => (
              <article key={title} className="journey-step">
                <div className="journey-step__top"><span>{number}</span><Icon aria-hidden="true" />{index < intelligenceJourney.length - 1 && <ArrowRight aria-hidden="true" />}</div>
                <p className="journey-step__short">{short}</p>
                <h3>{title}</h3>
                <p>{text}</p>
                {detail && <small>{detail}</small>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad shared-section" aria-labelledby="shared-title">
        <div className="site-container">
          <div className="shared-heading">
            <SectionLabel number="04">Intelligence condivisa</SectionLabel>
            <div><h2 id="shared-title" className="section-title">Ogni professionista usa il proprio LLM. Tutti si collegano allo stesso contesto aziendale.</h2><p className="section-copy mt-7">Interfacce diverse, un unico patrimonio governato di dati, KPI, processi, documenti, regole e conoscenza. È così che l'AI personale diventa intelligence aziendale condivisa.</p></div>
          </div>
          <SharedIntelligenceVisual />
        </div>
      </section>

      <section className="section-pad path-section" aria-labelledby="path-title">
        <div className="site-container">
          <SectionLabel number="05">Come ci arriviamo</SectionLabel>
          <div className="ai-section-intro">
            <h2 id="path-title" className="section-title">Prima rendiamo l'azienda leggibile, poi la rendiamo progressivamente più intelligente.</h2>
            <p className="ai-lead">La complessità resta dietro. Davanti, persone e decisioni trovano un accesso più naturale all'intelligence aziendale.</p>
          </div>
          <div className="decision-flow" aria-label="Dati, Modello e BI, Conversazione, Contesto, Decisione e Azione">
            {[["01", "Dati"], ["02", "Modello / BI"], ["03", "Conversazione"], ["04", "Contesto"], ["05", "Decisione / Azione"]].map(([number, label], index) => <div key={label} className="decision-flow__item"><span>{number}</span><strong>{label}</strong>{index < 4 && <ArrowRight aria-hidden="true" />}</div>)}
          </div>
          <div className="path-principles">
            <p>“La BI non deve più essere soltanto uno strumento da imparare a usare. Deve diventare un interlocutore con cui lavorare.”</p>
            <p>“L'AI non trasforma il caos in intelligenza. Spesso trasforma il caos in caos più veloce.”</p>
          </div>
        </div>
      </section>

      <section id="cosa-costruire" className="section-pad building-section scroll-mt-20" aria-labelledby="building-title">
        <div className="site-container">
          <SectionLabel number="06">Cosa facciamo concretamente</SectionLabel>
          <div className="ai-section-intro">
            <h2 id="building-title" className="section-title">I mattoni per rendere l'azienda AI-ready. E poi evolverla.</h2>
            <p className="ai-lead">Non un listino di tecnologie, ma capacità da combinare in base a ciò che esiste già, al problema da risolvere e al livello di maturità dell'azienda.</p>
          </div>
          <div className="building-grid">
            {buildingBlocks.map(([number, title, text]) => <article key={title}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
          </div>
          <div className="business-band"><span>Ambiti di applicazione</span>{businessAreas.map((area) => <strong key={area}>{area}</strong>)}</div>
        </div>
      </section>

      <section id="chi-siamo" className="section-pad identity-section scroll-mt-20" aria-labelledby="identity-title">
        <div className="site-container identity-layout">
          <div><SectionLabel number="07">Chi siamo</SectionLabel><p className="identity-code">BI<br />↓<br />AI</p></div>
          <div>
            <h2 id="identity-title" className="section-title">Professionisti dei dati, cresciuti con la Business Intelligence e con l'evoluzione dell'AI.</h2>
            <p className="identity-statement">Siamo maturati con la Business Intelligence.<br />Siamo cresciuti con l’Artificial Intelligence.<br />Oggi mettiamo ciò che abbiamo imparato al servizio della tua azienda.</p>
            <div className="identity-copy">
              <p>Conosciamo ciò che c'era prima dell'AI: modelli, KPI, semantic model, processi, dashboard, integrazione dei dati e i problemi reali che le aziende affrontano ogni giorno.</p>
              <p>Abbiamo seguito e sperimentato l'evoluzione dell'AI fin dall'inizio. Continuiamo a fare ricerca e sviluppo perché modelli, interfacce e possibilità cambiano molto velocemente.</p>
              <p>È questa doppia prospettiva che ci permette di progettare soluzioni fortemente all'avanguardia senza perdere solidità, contesto e governance.</p>
            </div>
            <div className="identity-distinction"><Check aria-hidden="true" /><span>Non una AI agency generica.</span><Check aria-hidden="true" /><span>Non solo una software house o BI boutique.</span></div>
            <p className="identity-close">Conosciamo ciò che c'era prima dell'AI. E sappiamo dove l'AI può portare il business oggi.</p>
          </div>
        </div>
      </section>

      <section id="come-lavoriamo" className="section-pad method-section scroll-mt-20" aria-labelledby="method-title">
        <div className="site-container">
          <SectionLabel number="08">Metodo</SectionLabel>
          <h2 id="method-title" className="section-title mt-10 max-w-4xl">Partiamo dal lavoro reale, non dalla tecnologia da vendere.</h2>
          <ol className="process-list mt-14" aria-label="Il processo DataWisePartners">
            {method.map((step, index) => <li key={step}><span>0{index + 1}</span><strong>{step}</strong>{index < method.length - 1 && <ArrowRight aria-hidden="true" />}</li>)}
          </ol>
          <p className="statement mt-14 max-w-4xl">Sappiamo capire il lavoro. E sappiamo riprogettarlo con gli strumenti di oggi.</p>
        </div>
      </section>

      <section id="contatti" className="final-section scroll-mt-20" aria-labelledby="final-title">
        <div className="site-container final-layout">
          <div><SectionLabel number="09">Il prossimo passo</SectionLabel><h2 id="final-title">Non sappiamo quale sarà la prossima grande tecnologia. Possiamo però fare in modo che la tua azienda sia pronta quando arriverà.</h2></div>
          <div><p>AI-ready non è la destinazione. È la capacità di partire prima, ogni volta.</p><Button asChild size="lg" className="mt-8 h-12 bg-background px-7 text-foreground hover:bg-background/90"><Link to="/contact">Rendiamo la tua azienda AI-ready <ArrowRight /></Link></Button></div>
        </div>
      </section>
    </div>
  );
}
