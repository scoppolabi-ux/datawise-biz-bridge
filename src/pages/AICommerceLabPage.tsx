import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  TestTube2, 
  TrendingUp, 
  Target, 
  Brain,
  Zap,
  BarChart3,
  ExternalLink,
  Lightbulb,
  ShoppingCart,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const AICommerceLabPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (section: string) => {
    if (section === 'home') {
      navigate('/');
    }
  };

  const labFeatures = [
    {
      icon: TestTube2,
      title: "Sperimentazione controllata",
      description: "Prototipi concreti con metriche reali."
    },
    {
      icon: Target,
      title: "Vertical AI",
      description: "Agenti specializzati su domini precisi, non chatbot generici."
    },
    {
      icon: TrendingUp,
      title: "Dal test al prodotto",
      description: "Ciò che funziona nel Lab può diventare un servizio per i nostri clienti."
    }
  ];

  const mateFeatures = [
    "SAA Engine proprietario (ruleset + ranking)",
    "Risposte strutturate e coerenti",
    "Compatibile con Shopping Assistant",
    "Test su logiche di affiliazione (Amazon Partner)"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI Commerce Lab – DataWisePartners</title>
        <meta name="description" content="Il laboratorio DataWisePartners dedicato agli esperimenti di AI applicata al commercio e ai prodotti digitali." />
        
        {/* Open Graph / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.datawisepartners.it/ai-commerce-lab" />
        <meta property="og:title" content="AI Commerce Lab – DataWisePartners" />
        <meta property="og:description" content="Il laboratorio DataWisePartners dedicato agli esperimenti di AI applicata al commercio e ai prodotti digitali." />
        <meta property="og:image" content="https://www.datawisepartners.it/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Commerce Lab – DataWisePartners" />
        <meta name="twitter:description" content="Il laboratorio DataWisePartners dedicato agli esperimenti di AI applicata al commercio e ai prodotti digitali." />
        <meta name="twitter:image" content="https://www.datawisepartners.it/og-image.png" />
      </Helmet>
      
      <Header onNavigate={handleNavigate} activeSection="" />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-gradient-primary text-white border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                Innovazione & Ricerca
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
                AI Commerce Lab
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Il laboratorio DataWisePartners dedicato agli esperimenti di AI applicata al commercio e ai prodotti digitali.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <Brain className="w-16 h-16 text-brand-red animate-float opacity-70" />
                <ShoppingCart className="w-16 h-16 text-brand-red animate-float opacity-70" style={{ animationDelay: '0.2s' }} />
                <BarChart3 className="w-16 h-16 text-brand-red animate-float opacity-70" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Why AI Commerce Lab */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Perché nasce l'AI Commerce Lab
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                  AI Commerce Lab è l'area R&D di DataWisePartners dedicata alla sperimentazione di agenti verticali, 
                  shopping assistant, sistemi di ranking intelligenti e modelli di business basati su AI. 
                  È un ambiente di ricerca in cui trasformiamo idee in prototipi reali che poi possono diventare 
                  prodotti o servizi per aziende e brand.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-12">
                {labFeatures.map((feature, index) => (
                  <Card 
                    key={index} 
                    className="border-border hover:shadow-elegant transition-all duration-300 bg-card"
                  >
                    <CardHeader>
                      <feature.icon className="w-10 h-10 text-brand-red mb-3" />
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-0" />

        {/* MATE Project */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Card className="border-2 border-brand-red/20 shadow-glow bg-card">
                <CardHeader className="text-center pb-8">
                  <Badge className="mb-4 w-fit mx-auto bg-brand-red text-white">
                    Progetto #1
                  </Badge>
                  <CardTitle className="text-3xl md:text-4xl font-bold mb-2">
                    MATE – Nutraceutical & Supplements AI Assistant
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Il primo prototipo del nostro AI Commerce Lab
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-8">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      MATE è un agente AI verticale dedicato alla nutraceutica. Interpreta le richieste degli utenti, 
                      applica criteri tecnici basati su ingredienti e categorie di prodotto, e quando attivato con lo 
                      Shopping Assistant di ChatGPT può generare short-list reali di prodotti (es. Amazon).
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      È uno strumento sperimentale, costruito sul nostro SAA Engine (ruleset, ranking, ActiveMatrix), 
                      utile per esplorare le potenzialità dello shopping intelligente basato sui dati.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {mateFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button 
                      variant="gradient" 
                      size="lg"
                      className="gap-2"
                      asChild
                    >
                      <a 
                        href="https://chatgpt.com/g/g-6929c35ffc948191bbeac6e2ef874a97-nutraceutical-supplements-mate-gaite-nutra"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Apri MATE su GPT Store
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-border bg-card">
                <CardHeader className="text-center">
                  <Lightbulb className="w-12 h-12 text-brand-red mx-auto mb-4" />
                  <CardTitle className="text-2xl md:text-3xl">Altri prototipi in arrivo</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Stiamo già lavorando a nuovi esperimenti verticali (food, fitness, retail). 
                    AI Commerce Lab è uno spazio vivo: ciò che oggi è un prototipo, domani può diventare 
                    una soluzione reale per i nostri clienti.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator className="my-0" />

        {/* Transparency Disclaimer */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-l-4 border-l-brand-red bg-muted/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-brand-red" />
                    <CardTitle className="text-xl">Trasparenza</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    AI Commerce Lab contiene progetti sperimentali. Alcuni agenti possono usare programmi di 
                    affiliazione (es. Amazon). Se l'utente acquista tramite link generati dagli agenti, 
                    DataWisePartners può ricevere una commissione senza costi aggiuntivi per l'utente. 
                    Le informazioni hanno scopo informativo e non sostituiscono il parere di un professionista.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default AICommerceLabPage;