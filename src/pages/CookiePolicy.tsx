import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, Shield, Settings, Eye, FileText, Clock } from 'lucide-react';

const CookiePolicy = () => {
  const [activeSection, setActiveSection] = useState('cookie-policy');

  const handleNavigate = (section: string) => {
    if (section === 'home') {
      window.location.href = '/';
    } else {
      window.location.href = `/#${section}`;
    }
  };

  useEffect(() => {
    document.title = 'Cookie Policy - DataWisePartners';
  }, []);

  const cookieTypes = [
    {
      icon: Shield,
      title: "Cookie Essenziali",
      description: "Necessari per il funzionamento base del sito web",
      examples: ["Autenticazione utente", "Sicurezza", "Preferenze di base"],
      required: true
    },
    {
      icon: Eye,
      title: "Cookie di Analisi",
      description: "Ci aiutano a capire come i visitatori utilizzano il sito",
      examples: ["Google Analytics", "Statistiche di utilizzo", "Performance del sito"],
      required: false
    },
    {
      icon: Settings,
      title: "Cookie di Funzionalità",
      description: "Migliorano l'esperienza utente e personalizzano il contenuto",
      examples: ["Lingua preferita", "Preferenze di visualizzazione", "Contenuto personalizzato"],
      required: false
    }
  ];

  return (
    <div className="min-h-screen">
      <Header onNavigate={handleNavigate} activeSection={activeSection} />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-6">
              <Cookie className="w-12 h-12 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">Cookie Policy</h1>
            </div>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Trasparenza completa su come utilizziamo i cookie per migliorare la tua esperienza su DataWisePartners
            </p>
            <div className="flex items-center justify-center mt-6 text-sm opacity-80">
              <Clock className="w-4 h-4 mr-2" />
              <span>Ultimo aggiornamento: 22 Agosto 2024</span>
            </div>
          </div>
        </section>

        {/* Cookie Types */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Tipologie di Cookie Utilizzati
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {cookieTypes.map((type, index) => (
                <Card key={index} className="border-0 shadow-card hover:shadow-elegant transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <type.icon className="w-8 h-8 text-brand-red" />
                    </div>
                    <CardTitle className="text-xl text-foreground flex items-center justify-center">
                      {type.title}
                      {type.required && (
                        <span className="ml-2 text-xs bg-brand-red text-white px-2 py-1 rounded-full">
                          RICHIESTI
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 text-center">
                      {type.description}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-foreground">Esempi:</h4>
                      <ul className="space-y-1">
                        {type.examples.map((example, idx) => (
                          <li key={idx} className="flex items-center text-sm text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-brand-red mr-2 flex-shrink-0"></div>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Policy */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-12">
              
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-foreground">
                    <FileText className="w-6 h-6 mr-3 text-brand-red" />
                    Cosa Sono i Cookie
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti un sito web. 
                    Questi file contengono informazioni che possono essere lette dal sito web nelle visite successive.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Su DataWisePartners utilizziamo i cookie per offrirti un'esperienza personalizzata e per migliorare 
                    continuamente i nostri servizi di Business Intelligence.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-foreground">
                    <Shield className="w-6 h-6 mr-3 text-brand-red" />
                    Come Utilizziamo i Cookie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-3">Finalità Principali</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground"><strong>Funzionalità del sito:</strong> Garantire il corretto funzionamento delle pagine e dei servizi</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground"><strong>Analisi e statistiche:</strong> Comprendere come i visitatori utilizzano il nostro sito</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground"><strong>Personalizzazione:</strong> Ricordare le tue preferenze e migliorare l'esperienza utente</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground"><strong>Sicurezza:</strong> Proteggere il sito da attacchi e garantire la sicurezza dei dati</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-foreground">
                    <Settings className="w-6 h-6 mr-3 text-brand-red" />
                    Gestione delle Preferenze Cookie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      Hai il pieno controllo sui cookie utilizzati sul nostro sito. Puoi gestire le tue preferenze in diversi modi:
                    </p>
                    
                    <div className="bg-muted/50 p-6 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-4">Opzioni Disponibili:</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h5 className="font-medium text-foreground">Browser</h5>
                          <p className="text-sm text-muted-foreground">Configura le impostazioni direttamente nel tuo browser</p>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium text-foreground">Banner Cookie</h5>
                          <p className="text-sm text-muted-foreground">Utilizza il banner presente sul sito per personalizzare</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Nota:</strong> Disabilitare alcuni tipi di cookie potrebbe influenzare la funzionalità del sito 
                        e l'esperienza di navigazione.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-foreground">
                    <Eye className="w-6 h-6 mr-3 text-brand-red" />
                    Cookie di Terze Parti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Il nostro sito può utilizzare cookie di terze parti per servizi esterni come:
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground"><strong>Google Analytics:</strong> Per analizzare il traffico del sito</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground"><strong>Social Media:</strong> Per integrazioni con LinkedIn e altri social</span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    Questi servizi hanno le proprie policy sui cookie che ti invitiamo a consultare sui rispettivi siti web.
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Hai Domande sulla Nostra Cookie Policy?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Il nostro team è a disposizione per chiarire qualsiasi dubbio riguardo all'utilizzo dei cookie 
              e alla protezione dei tuoi dati.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => handleNavigate('contact')}
                className="bg-white text-brand-red px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Contattaci
              </button>
              <button 
                onClick={() => window.location.href = '/privacy-policy'}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Leggi la Privacy Policy
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default CookiePolicy;