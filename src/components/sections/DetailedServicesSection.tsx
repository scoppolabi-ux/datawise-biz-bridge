import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Database, 
  Users, 
  Wrench, 
  GraduationCap, 
  BarChart3,
  FileText,
  Settings,
  Trash2,
  Cloud,
  Shield,
  Zap,
  Package
} from 'lucide-react';

const DetailedServicesSection = () => {
  const services = [
    {
      icon: Zap,
      title: "Business Intelligence Plug&Play",
      description: "Modelli di BI pronti all'uso, professionali e personalizzabili per implementazioni rapide. Suite completa per tutte le aree aziendali: Vendite, Finance, Operations, HR, Marketing e molto altro.",
      features: ["Implementazione rapida", "Modelli pre-configurati", "Copertura completa", "Prodotti verticali"],
      isPlugPlay: true
    },
    {
      icon: Database,
      title: "Raccolta, Analisi e Interpretazione dei Dati Aziendali",
      description: "Utilizziamo metodologie avanzate per raccogliere e analizzare dati provenienti da varie fonti, fornendo insight approfonditi per guidare le decisioni strategiche aziendali.",
      features: ["Metodologie avanzate", "Analisi multi-source", "Insight strategici", "Decision support"]
    },
    {
      icon: Users,
      title: "Consulenza Strategica Basata sull'Analisi dei Dati",
      description: "Il nostro team di esperti offre consulenza personalizzata per aiutare i decision maker aziendali a comprendere e sfruttare appieno il potenziale dei loro dati.",
      features: ["Consulenza personalizzata", "Team di esperti", "Ottimizzazione performance", "Guida all'innovazione"]
    },
    {
      icon: Wrench,
      title: "Progettazione e Implementazione di Sistemi di Business Intelligence",
      description: "Specializzati nella progettazione, implementazione e personalizzazione di sistemi e strumenti avanzati di business intelligence.",
      features: ["Progettazione su misura", "Implementazione completa", "Personalizzazione avanzata", "Gestione efficace dati"]
    },
    {
      icon: GraduationCap,
      title: "Programmi Formativi e Servizi di Consulenza Personalizzata",
      description: "Programmi formativi su misura e servizi di consulenza personalizzata per garantire l'utilizzo ottimale degli strumenti di business intelligence.",
      features: ["Formazione su misura", "Consulenza personalizzata", "Efficienza operativa", "Crescita professionale"]
    },
    {
      icon: Settings,
      title: "Servizio di Coordinamento - Business Translator",
      description: "Il nostro team agisce come ponte tra i team tecnici e quelli aziendali, traducendo i risultati dell'analisi in informazioni comprensibili per i decision maker.",
      features: ["Coordinamento efficace", "Ponte tecnico-business", "Comunicazione chiara", "Risultati comprensibili"]
    },
    {
      icon: BarChart3,
      title: "Analisi, Interpretazione e Lettura dei Dati su Dashboard Esistenti",
      description: "Servizi specialistici di analisi e interpretazione dei dati su dashboard già esistenti, per ottenere insight approfonditi dai dati aziendali.",
      features: ["Analisi specialistica", "Interpretazione avanzata", "Dashboard esistenti", "Insight significativi"]
    },
    {
      icon: FileText,
      title: "Revisione, Ristrutturazione e Produzione di Dashboard e Reportistica",
      description: "Ristrutturiamo e produciamo nuove dashboard e reportistica, fornendo strumenti chiari e intuitivi per la visualizzazione dei dati.",
      features: ["Ristrutturazione completa", "Produzione su misura", "Strumenti intuitivi", "Visualizzazione efficace"]
    },
    {
      icon: Trash2,
      title: "Mantenimento e Rottamazione di Dashboard Esistenti",
      description: "Servizi di mantenimento delle dashboard esistenti e rottamazione con creazione ex novo di sistemi di business intelligence.",
      features: ["Mantenimento continuo", "Aggiornamenti regolari", "Rottamazione professionale", "Creazione ex novo"]
    },
    {
      icon: Shield,
      title: "Data Cleaning",
      description: "Il nostro servizio di Data Cleaning si concentra sulla pulizia e il mantenimento delle basi di dati aziendali, assicurando qualità e integrità dei dati.",
      features: ["Pulizia professionale", "Mantenimento qualità", "Integrità dei dati", "Basi dati aziendali"]
    },
    {
      icon: Cloud,
      title: "Business Intelligence Outsourcing (BI OUT)",
      description: "Servizi completi di business intelligence in outsourcing per aziende che desiderano esternalizzare la gestione e l'analisi dei loro dati aziendali.",
      features: ["Outsourcing completo", "Competenze esperte", "Decisioni informate", "Adattamento rapido"]
    }
  ];

  return (
    <section id="detailed-services" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            I Nostri Servizi Dettagliati
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Una gamma completa di servizi specializzati per rispondere a ogni esigenza 
            di Business Intelligence della vostra azienda
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`border-0 shadow-card hover:shadow-elegant transition-all duration-300 bg-gradient-card group ${
                service.isPlugPlay ? 'ring-2 ring-brand-red/30 bg-gradient-to-br from-brand-red/5 to-white' : ''
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${
                    service.isPlugPlay 
                      ? 'bg-brand-red/10 group-hover:bg-brand-red/20' 
                      : 'bg-brand-red/10 group-hover:bg-brand-red/20'
                  } rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300`}>
                    <service.icon className={`w-6 h-6 ${
                      service.isPlugPlay ? 'text-brand-red' : 'text-brand-red'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className={`text-lg font-bold leading-tight ${
                      service.isPlugPlay ? 'text-brand-red' : 'text-foreground'
                    }`}>
                      {service.title}
                      {service.isPlugPlay && (
                        <span className="ml-2 text-xs bg-brand-red text-white px-2 py-1 rounded-full font-normal">
                          NUOVO
                        </span>
                      )}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full ${
                        service.isPlugPlay ? 'bg-brand-red' : 'bg-brand-red'
                      } mr-2 flex-shrink-0`}></div>
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Plug&Play Highlight Section */}
        <div className="mt-16 mb-16 bg-gradient-to-br from-brand-red/10 to-brand-red/5 p-8 md:p-12 rounded-2xl shadow-elegant border border-brand-red/20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-brand-red mr-3" />
              <h3 className="text-3xl font-bold text-brand-red">BI Plug&Play - La Novità DataWisePartners</h3>
            </div>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
              Implementazione rapida in pochi giorni, prezzo accessibile, modularità per crescere nel tempo. 
              I nostri modelli coprono tutte le aree aziendali con prodotti sia orizzontali che verticali per settori specifici.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-brand-red" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Prodotti Orizzontali</h4>
                <p className="text-sm text-muted-foreground">Vendite, Finance, HR, Marketing, Operations per qualsiasi azienda</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-brand-red" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Prodotti Verticali</h4>
                <p className="text-sm text-muted-foreground">Food & Beverage, Banking, Sanità, Meccanica, Telecomunicazioni</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-brand-red" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Implementazione Rapida</h4>
                <p className="text-sm text-muted-foreground">Attivazione in pochi giorni con demo e PoC disponibili</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-hero p-8 md:p-12 rounded-2xl shadow-elegant text-white text-center">
          <h3 className="text-3xl font-bold mb-6">
            Pronto a Trasformare i Tuoi Dati in Vantaggio Competitivo?
          </h3>
          <p className="text-lg mb-8 opacity-90 max-w-3xl mx-auto">
            I nostri servizi sono progettati per essere modulari e personalizzabili. 
            Possiamo supportarti con servizi specifici o diventare la tua Business Intelligence completa in outsourcing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-brand-red px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
              Richiedi una Consulenza Gratuita
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
              Scopri il BI Plug&Play
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedServicesSection;