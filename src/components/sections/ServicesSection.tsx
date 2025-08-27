import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Cog, 
  Users, 
  Wrench, 
  GraduationCap,
  ArrowRight,
  Lightbulb,
  Target,
  Settings
} from 'lucide-react';

interface ServicesSectionProps {
  onNavigate: (section: string) => void;
}

const ServicesSection = ({ onNavigate }: ServicesSectionProps) => {
  const mainServices = [
    {
      icon: Cog,
      title: "Cosa Facciamo",
      subtitle: "Soluzioni Complete di BI",
      description: "Gamma completa di servizi personalizzati e modulabili di Business Intelligence su misura per le esigenze uniche di ogni azienda.",
      features: [
        "Progettazione soluzioni ad hoc",
        "Realizzazione su misura", 
        "Innovazione e crescita aziendale",
        "Affiancamento continuo"
      ],
      color: "tech-blue"
    },
    {
      icon: Target,
      title: "Approccio",
      subtitle: "Metodologia Orientata ai Risultati", 
      description: "Un approccio unico e orientato ai risultati per soluzioni innovative e su misura in ambito di gestione dei dati aziendali.",
      features: [
        "Comprensione del Cliente",
        "Integrazione delle Competenze",
        "Approccio Olistico",
        "Business Translator"
      ],
      color: "data-purple"
    },
    {
      icon: Settings,
      title: "Business Model",
      subtitle: "Risultati Tangibili e Misurabili",
      description: "Non solo strumenti o servizi isolati, ma un approccio integrato che garantisce risultati concreti per l'azienda.",
      features: [
        "Soluzioni integrate",
        "Orientamento ai risultati", 
        "Miglioramento prestazioni",
        "Efficienza e redditività"
      ],
      color: "insight-orange"
    }
  ];

  return (
    <section id="services" className="py-24 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            I Nostri Servizi Principali
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Dalla strategia all'implementazione, offriamo soluzioni complete per trasformare 
            i vostri dati in vantaggio competitivo
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {mainServices.map((service, index) => (
            <Card 
              key={index} 
              id={service.title === "Approccio" ? "approccio-card" : service.title === "Business Model" ? "business-model-card" : undefined}
              className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 bg-gradient-card group cursor-pointer"
              onClick={() => onNavigate(service.title.toLowerCase().replace(' ', '-'))}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-${service.color}/10 border border-${service.color}/20 group-hover:bg-${service.color}/20 transition-all duration-300`}>
                  <service.icon className={`w-8 h-8 text-${service.color}`} />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">{service.title}</CardTitle>
                <p className={`text-sm font-semibold text-${service.color}`}>{service.subtitle}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full bg-${service.color} mr-3 flex-shrink-0`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="ghost" 
                  className={`w-full group-hover:bg-${service.color}/10 group-hover:text-${service.color} transition-all duration-300`}
                >
                  Scopri di più
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Differentiators */}
        <div className="bg-gradient-hero p-8 md:p-12 rounded-2xl shadow-elegant text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-8">
              Perché Scegliere DataWisePartners?
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <Lightbulb className="w-8 h-8 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-2">Innovazione Continua</h4>
                  <p className="opacity-90">
                    Utilizziamo le tecnologie più avanzate inclusi AI e Machine Learning 
                    per soluzioni all'avanguardia
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Users className="w-8 h-8 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-2">Team Multidisciplinare</h4>
                  <p className="opacity-90">
                    Competenze integrate in analisi dati, consulenza strategica, 
                    formazione aziendale e sviluppo tecnologico
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button 
                variant="outline"
                size="lg" 
                onClick={() => onNavigate('detailed-services')}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Vedi Tutti i Servizi Dettagliati
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;