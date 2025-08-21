import { Card, CardContent } from '@/components/ui/card';
import { Database, Warehouse, BarChart3, Target, Activity, Eye, FileText, Search, Shield, GraduationCap } from 'lucide-react';
const BIStepsSection = () => {
  const steps = [{
    number: "01",
    title: "Raccolta e Integrazione dei Dati",
    icon: Database,
    description: "Il primo passo per sviluppare una strategia di BI di successo è raccogliere dati da varie fonti, garantendo che siano completi e rilevanti per le esigenze aziendali."
  }, {
    number: "02",
    title: "Data Warehousing - Archiviazione dei Dati",
    icon: Warehouse,
    description: "Data Warehouse e Data Lake rappresentano una risorsa cruciale, offrendo un deposito centralizzato per i dati consolidati e un'infrastruttura essenziale per l'analisi."
  }, {
    number: "03",
    title: "Business Analytics - Analisi dei Dati",
    icon: BarChart3,
    description: "Attraverso l'analisi i dati vengono studiati per individuarne pattern, tendenze e insights significative utilizzando strumenti avanzati di BI e machine learning."
  }, {
    number: "04",
    title: "Performance Management",
    icon: Target,
    description: "La gestione delle prestazioni si concentra sull'impostazione e osservazione degli indicatori chiave di performance (KPI) per valutare il raggiungimento degli obiettivi."
  }, {
    number: "05",
    title: "Elaborazione Analitica Online (OLAP)",
    icon: Activity,
    description: "OLAP consente di analizzare interattivamente dati multidimensionali da diverse prospettive, come avere una visione tridimensionale dei propri dati."
  }, {
    number: "06",
    title: "Data Visualization - Visualizzazione dei Dati",
    icon: Eye,
    description: "La trasformazione dei dati in rappresentazioni visuali come grafici o mappe facilita ai decision-maker la comprensione di informazioni complesse."
  }, {
    number: "07",
    title: "Data Reporting - Consultazione dei dati",
    icon: FileText,
    description: "Il reporting consiste nella raccolta di informazioni necessarie riorganizzandole in un formato facile da leggere e immediato da comprendere."
  }, {
    number: "08",
    title: "Data Mining - Indagini Logiche",
    icon: Search,
    description: "Il data mining è il processo di scoperta di pattern, un viaggio alla ricerca di correlazioni e tendenze all'interno dei dati utilizzando tecniche avanzate."
  }, {
    number: "09",
    title: "Data Quality Management",
    icon: Shield,
    description: "La gestione della qualità garantisce che le informazioni siano accurate, coerenti e affidabili, pulendo, standardizzando e convalidando i dataset."
  }, {
    number: "10",
    title: "Formazione e Trasferimento di Conoscenze",
    icon: GraduationCap,
    description: "La formazione garantisce che i decision maker possano comprendere e utilizzare efficacemente gli strumenti di Business Intelligence implementati."
  }];
  return <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            La Business Intelligence in 10 Steps
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Il nostro approccio metodologico per trasformare dati grezzi in decisioni strategiche vincenti
          </p>
        </div>

        <div className="grid gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => <Card key={index} className={`border-0 shadow-card hover:shadow-elegant transition-all duration-300 bg-gradient-card overflow-hidden ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
              <CardContent className="p-0">
                <div className={`flex flex-col lg:flex-row ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                  {/* Number and Icon */}
                  <div className="lg:w-1/4 bg-gradient-primary p-8 flex flex-col items-center justify-center text-white">
                    <div className="text-4xl font-bold mb-4 opacity-80">{step.number}</div>
                    <step.icon className="w-12 h-12" />
                  </div>
                  
                  {/* Content */}
                  <div className="lg:w-3/4 p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-hero p-8 rounded-2xl shadow-elegant text-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Pronto a Trasformare i Tuoi Dati in Vantaggio Competitivo?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              La nostra metodologia in 10 step garantisce risultati misurabili e duraturi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">Richiedi una Consulenza GRATUITA</button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default BIStepsSection;