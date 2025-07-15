import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, Lightbulb, TrendingUp } from 'lucide-react';

const MissionVisionSection = () => {
  return (
    <section id="mission" className="py-24 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Mission & Vision
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            La nostra ragione d'essere e la visione del futuro che vogliamo creare insieme ai nostri clienti
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Mission */}
          <Card className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 bg-gradient-card">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-tech-blue/10 rounded-2xl flex items-center justify-center mr-4">
                  <Target className="w-8 h-8 text-tech-blue" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">Mission</h3>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                La nostra missione è <strong className="text-tech-blue">aiutare le aziende a sbloccare il potenziale dei loro dati</strong>, 
                fornendo soluzioni su misura, consulenza strategica e formazione personalizzata.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Con il nostro approccio integrato e il nostro team esperto, ci impegniamo a essere 
                il vostro <strong className="text-tech-blue">partner fidato nel viaggio verso il successo aziendale</strong>.
              </p>

              <div className="mt-8 p-4 bg-tech-blue/5 rounded-lg border border-tech-blue/20">
                <h4 className="font-semibold text-tech-blue mb-2">I nostri pilastri:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tech-blue rounded-full mr-3"></div>
                    Soluzioni personalizzate e su misura
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tech-blue rounded-full mr-3"></div>
                    Consulenza strategica orientata ai risultati
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tech-blue rounded-full mr-3"></div>
                    Formazione continua e trasferimento di conoscenze
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tech-blue rounded-full mr-3"></div>
                    Partnership a lungo termine
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 bg-gradient-card">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-data-purple/10 rounded-2xl flex items-center justify-center mr-4">
                  <Eye className="w-8 h-8 text-data-purple" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">Vision</h3>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                La visione di DataWisePartners è quella di <strong className="text-data-purple">creare un ecosistema aziendale</strong> 
                in cui i dati siano una risorsa strategica fondamentale per ogni decisione e azione.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Ci impegniamo a trasformare il modo in cui le aziende concepiscono, gestiscono e utilizzano 
                i loro dati, aprendo nuove possibilità di <strong className="text-data-purple">innovazione, crescita e successo</strong>.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Con il nostro approccio all'avanguardia e il nostro impegno per l'eccellenza, vogliamo essere 
                il motore trainante di una <strong className="text-data-purple">cultura aziendale basata sui dati</strong>.
              </p>

              <div className="mt-8 p-4 bg-data-purple/5 rounded-lg border border-data-purple/20">
                <h4 className="font-semibold text-data-purple mb-2">La nostra visione del futuro:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-data-purple rounded-full mr-3"></div>
                    Ecosistema aziendale data-driven
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-data-purple rounded-full mr-3"></div>
                    Decisioni basate su evidenze concrete
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-data-purple rounded-full mr-3"></div>
                    Leadership nel settore BI
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-data-purple rounded-full mr-3"></div>
                    Nuove vette di performance aziendale
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="bg-gradient-hero p-8 md:p-12 rounded-2xl shadow-elegant text-white">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12">I Nostri Valori Fondamentali</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Innovazione</h4>
                <p className="opacity-90 text-sm">
                  Ricerchiamo costantemente soluzioni innovative e all'avanguardia per rimanere leader nel settore
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Risultati</h4>
                <p className="opacity-90 text-sm">
                  Ci concentriamo su risultati tangibili e misurabili che portano valore reale ai nostri clienti
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Crescita</h4>
                <p className="opacity-90 text-sm">
                  Facilitiamo la crescita sostenibile e l'evoluzione continua delle aziende che serviamo
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Trasparenza</h4>
                <p className="opacity-90 text-sm">
                  Manteniamo sempre comunicazione aperta e trasparente con i nostri partner e clienti
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;