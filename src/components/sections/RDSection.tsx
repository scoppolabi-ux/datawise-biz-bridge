import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Users, Zap, Cpu, Brain, Eye, ArrowRight, Sparkles } from 'lucide-react';
const RDSection = () => {
  const innovations = [{
    icon: Brain,
    title: "Machine Learning & AI",
    description: "Sviluppiamo algoritmi avanzati di machine learning per predire tendenze e automatizzare l'analisi dei dati",
    color: "tech-blue"
  }, {
    icon: Eye,
    title: "Realtà Aumentata",
    description: "Pionieri nell'applicazione della realtà aumentata per la visualizzazione immersiva dei dati aziendali",
    color: "data-purple"
  }, {
    icon: Cpu,
    title: "Edge Computing",
    description: "Soluzioni di elaborazione dati in tempo reale per decisioni istantanee e performanti",
    color: "insight-orange"
  }, {
    icon: Sparkles,
    title: "Data Visualization 3D",
    description: "Nuove metodologie di visualizzazione tridimensionale per rappresentare dati complessi",
    color: "tech-blue-light"
  }];
  const collaborations = [{
    type: "Università",
    description: "Partnership con atenei per ricerca applicata in Data Science",
    icon: "🎓"
  }, {
    type: "Tech Companies",
    description: "Collaborazioni con aziende tecnologiche per sviluppo congiunto",
    icon: "🚀"
  }, {
    type: "Research Centers",
    description: "Progetti di ricerca con centri specializzati in AI e ML",
    icon: "🔬"
  }];
  return <section id="rd" className="py-24 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Ricerca e Sviluppo
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            L'innovazione è il motore del nostro successo. Investiamo costantemente in ricerca e sviluppo 
            per rimanere all'avanguardia nel settore della Business Intelligence
          </p>
        </div>

        {/* Innovation Philosophy */}
        <div className="bg-gradient-hero p-8 md:p-12 rounded-2xl shadow-elegant text-white mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-8">La Nostra Filosofia di Innovazione</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <Lightbulb className="w-12 h-12 mb-4" />
                <h4 className="text-xl font-semibold mb-3">Innovazione Continua</h4>
                <p className="opacity-90 text-center">
                  Siamo costantemente alla ricerca di nuovi approcci, metodologie e tecnologie 
                  per migliorare le nostre soluzioni
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-12 h-12 mb-4" />
                <h4 className="text-xl font-semibold mb-3">Collaborazioni</h4>
                <p className="opacity-90 text-center">
                  Collaboriamo attivamente con partner, istituzioni accademiche e organizzazioni 
                  del settore per stimolare l'innovazione
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Zap className="w-12 h-12 mb-4" />
                <h4 className="text-xl font-semibold mb-3">Agilità</h4>
                <p className="opacity-90 text-center">
                  L'innovazione ci consente di adattarci rapidamente ai cambiamenti del mercato 
                  e alle esigenze dei clienti
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Innovations */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">Le Nostre  Sfide Attuali</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {innovations.map((innovation, index) => <Card key={index} className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 bg-gradient-card group">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 bg-${innovation.color}/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-${innovation.color}/20 transition-all duration-300`}>
                      <innovation.icon className={`w-8 h-8 text-${innovation.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-foreground mb-3">{innovation.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{innovation.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* Collaborations */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
            Le Nostre Collaborazioni
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {collaborations.map((collab, index) => <div key={index} className="text-center p-6 bg-gradient-card rounded-xl shadow-card hover:shadow-elegant transition-all duration-300">
                <div className="text-4xl mb-4">{collab.icon}</div>
                <h4 className="text-xl font-bold text-foreground mb-3">{collab.type}</h4>
                <p className="text-muted-foreground">{collab.description}</p>
              </div>)}
          </div>
        </div>

        {/* Future Vision */}
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-8 text-foreground">
            Il Futuro della Business Intelligence
          </h3>
          <div className="max-w-4xl mx-auto space-y-6 text-muted-foreground mb-12">
            <p className="text-lg leading-relaxed">
              Con il nostro impegno continuo nella ricerca e nello sviluppo, DataWisePartners 
              si pone come punto di riferimento nel campo della gestione dei dati aziendali.
            </p>
            <p className="text-lg leading-relaxed">
              Offriamo soluzioni innovative e all'avanguardia che consentono alle aziende di 
              raggiungere il successo a lungo termine, anticipando le tendenze future del mercato.
            </p>
          </div>

          {/* R&D Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-card p-6 rounded-xl shadow-card">
              <div className="text-3xl font-bold text-tech-blue mb-2">15+</div>
              <div className="text-sm text-muted-foreground">Progetti di Ricerca Attivi</div>
            </div>
            <div className="bg-gradient-card p-6 rounded-xl shadow-card">
              <div className="text-3xl font-bold text-data-purple mb-2">5</div>
              <div className="text-sm text-muted-foreground">Partnership Accademiche</div>
            </div>
            <div className="bg-gradient-card p-6 rounded-xl shadow-card">
              <div className="text-3xl font-bold text-insight-orange mb-2">25%</div>
              <div className="text-sm text-muted-foreground">Budget per R&D</div>
            </div>
            <div className="bg-gradient-card p-6 rounded-xl shadow-card">
              <div className="text-3xl font-bold text-tech-blue mb-2">3</div>
              <div className="text-sm text-muted-foreground">Brevetti in Corso</div>
            </div>
          </div>

          <button className="bg-gradient-primary text-white px-8 py-4 rounded-lg font-semibold hover:shadow-glow transition-all duration-300 inline-flex items-center">
            Scopri le Nostre Innovazioni
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </section>;
};
export default RDSection;