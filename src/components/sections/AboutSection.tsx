import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, TrendingUp, Lightbulb } from 'lucide-react';

const AboutSection = () => {
  const highlights = [
    {
      icon: Target,
      title: "Missione Chiara",
      description: "Trasformare dati complessi in decisioni strategiche vincenti"
    },
    {
      icon: Users,
      title: "Team Esperto",
      description: "Business Translator con oltre 20 anni di esperienza"
    },
    {
      icon: TrendingUp,
      title: "Risultati Concreti",
      description: "Miglioriamo efficienza, efficacia e competitività aziendale"
    },
    {
      icon: Lightbulb,
      title: "Innovazione",
      description: "Soluzioni all'avanguardia con AI e Machine Learning"
    }
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Chi Siamo
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-8 rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">
              I Vostri Business Translator
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Molte aziende si trovano di fronte a una sfida crescente nell'interpretare e utilizzare 
              efficacemente i propri dati aziendali per prendere decisioni strategiche.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Spesso, i dati sono dispersi in varie fonti e formati, non strutturati, difficili da 
              analizzare in modo significativo. Questo porta a decisioni basate sull'intuizione 
              anziché su evidenze concrete, limitando il potenziale di crescita e innovazione delle aziende.
            </p>
            <p className="text-lg text-tech-blue font-semibold">
              DataWisePartners si impegna a risolvere quotidianamente questo problema offrendo 
              soluzioni complete o su esigenze specifiche per la gestione dei dati aziendali.
            </p>
          </div>

          <div className="bg-gradient-card p-8 rounded-2xl shadow-card">
            <h4 className="text-xl font-bold mb-4 text-tech-blue">
              La Nostra Promessa
            </h4>
            <p className="text-muted-foreground mb-6">
              Ci impegniamo a tradurre i dati complessi in informazioni chiare e azioni strategiche. 
              Guidiamo imprenditori e "Decision maker" attraverso il labirinto dei numeri, aiutandoli 
              a scoprire insight significativi che li guideranno verso il successo.
            </p>
            <div className="bg-tech-blue/10 p-4 rounded-lg">
              <p className="text-tech-blue font-semibold italic">
                "Trasformare la ricchezza di dati in un tesoro di intuizioni di valore inestimabile"
              </p>
            </div>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <Card key={index} className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 bg-gradient-card">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Market Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold mb-8 text-foreground">
            Il Mercato BI in Italia
          </h3>
          <div className="max-w-4xl mx-auto space-y-6 text-muted-foreground">
            <p className="text-lg leading-relaxed">
              I dati e la loro scienza stanno proliferando, ma l'alfabetizzazione dei dati tra dirigenti no. 
              Ecco perché, secondo la <strong className="text-tech-blue">Harvard Business Review</strong>, 
              i Business Translators sono diventati un "ruolo di analisi indispensabile".
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="bg-gradient-card p-6 rounded-xl shadow-card">
                <div className="text-3xl font-bold text-tech-blue mb-2">$100B+</div>
                <p className="text-sm">Il mercato dei Big Data Analytics entro il 2027</p>
              </div>
              <div className="bg-gradient-card p-6 rounded-xl shadow-card">
                <div className="text-3xl font-bold text-data-purple mb-2">85%</div>
                <p className="text-sm">Delle aziende vuole adottare il "precision marketing"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;