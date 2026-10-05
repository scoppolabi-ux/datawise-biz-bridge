import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contatti — DataWisePartners" },
    { name: "description", content: "Confrontiamoci su un problema concreto e sulle fondamenta necessarie per rendere la tua azienda AI-ready." },
    { property: "og:title", content: "Contatti — DataWisePartners" },
    { property: "og:description", content: "Un primo confronto su dati, processi, sistemi, conoscenza e opportunità AI." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ContactPage,
});

const WHATSAPP_MESSAGE = "Ciao DataWisePartners, vorrei confrontarmi su un problema o un'opportunità per rendere la mia azienda più AI-ready.";
const WHATSAPP_URL = `https://wa.me/393287048437?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

function ContactPage() {
  return <div className="overflow-hidden">
    <section className="page-hero contact-hero"><div className="site-container page-hero__layout"><div><p className="ai-kicker">Contatti / Parliamone</p><h1>Partiamo da un problema concreto.</h1></div><p>Raccontaci cosa vuoi rendere più leggibile, interrogabile o intelligente. Il primo passo è capire insieme il lavoro reale.</p></div></section>

    <section className="section-pad contact-section"><div className="site-container contact-layout"><div><p className="section-label"><span>01</span><span>Il primo confronto</span></p><h2 className="section-title">Da quello che hai, verso ciò che può diventare possibile.</h2><p className="ai-lead mt-7">Dati frammentati, KPI difficili da condividere, processi poco leggibili o una nuova opportunità AI: possiamo iniziare da qui.</p><div className="contact-line"><span>01</span><strong>Problema o opportunità</strong></div><div className="contact-line"><span>02</span><strong>Contesto attuale</strong></div><div className="contact-line"><span>03</span><strong>Primo obiettivo concreto</strong></div></div>

      <div className="contact-panel contact-panel--form"><span>IL PRIMO PASSO</span><h2>Parliamone.</h2>
        <div className="contact-whatsapp">
          <p>Il canale diretto per un primo confronto è WhatsApp: un messaggio è sufficiente per iniziare, ti risponderemo al più presto.</p>
          <Button asChild className="contact-submit contact-whatsapp__cta">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Scrivici su WhatsApp: si apre una nuova scheda con una chat verso DataWisePartners">
              <MessageCircle aria-hidden="true" />Scrivici su WhatsApp
            </a>
          </Button>
          <p className="contact-whatsapp__note">Si apre WhatsApp con un messaggio già pronto: puoi modificarlo prima di inviarlo. Continuando, passerai al servizio WhatsApp, che applica i propri termini e la propria informativa privacy.</p>
        </div>
      </div>
    </div></section>
  </div>;
}
