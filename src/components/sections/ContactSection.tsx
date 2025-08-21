import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageCircle,
  Calendar,
  LinkedinIcon
} from 'lucide-react';

const ContactSection = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Sede Principale",
      details: ["Via Business Intelligence 123", "Milano, 20100", "Italia"],
      color: "tech-blue"
    },
    {
      icon: Phone,
      title: "Telefono",
      details: ["+39 3287048437", "Lun-Ven 9:00-18:00"],
      color: "data-purple"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@datawisepartners.it", "stefano.coppola@datawisepartners.it", "Risposta entro 24h"],
      color: "insight-orange"
    },
    {
      icon: Clock,
      title: "Orari di Lavoro",
      details: ["Lunedì - Venerdì: 9:00 - 18:00", "Sabato: 9:00 - 13:00", "Domenica: Chiuso"],
      color: "tech-blue"
    }
  ];

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Consulenza Gratuita",
      description: "Prenota una call di 30 minuti per valutare le tue esigenze",
      action: "Prenota Ora",
      color: "tech-blue"
    },
    {
      icon: Calendar,
      title: "Demo Personalizzata",
      description: "Vedi i nostri strumenti BI in azione con i tuoi dati",
      action: "Richiedi Demo",
      color: "data-purple"
    },
    {
      icon: Send,
      title: "Proposta Progetto",
      description: "Ricevi una proposta dettagliata per il tuo progetto BI",
      action: "Richiedi Proposta",
      color: "insight-orange"
    }
  ];

  return (
    <section id="contact" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Contattaci
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Siamo pronti a trasformare i vostri dati in decisioni vincenti. 
            Contattateci per una consulenza personalizzata
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Informazioni di Contatto
            </h3>
            
            <div className="grid gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 bg-gradient-card">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-${info.color}/10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <info.icon className={`w-6 h-6 text-${info.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-foreground mb-2">{info.title}</h4>
                        <div className="space-y-1">
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-muted-foreground text-sm">{detail}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-12">
              <h4 className="text-xl font-bold text-foreground mb-6">Azioni Rapide</h4>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-card rounded-lg shadow-card hover:shadow-elegant transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-${action.color}/10 rounded-lg flex items-center justify-center`}>
                        <action.icon className={`w-5 h-5 text-${action.color}`} />
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground">{action.title}</h5>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                    <Button variant="tech" size="sm">
                      {action.action}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-foreground mb-4">Seguici sui Social</h4>
              <div className="flex space-x-4">
                <button className="w-12 h-12 bg-tech-blue/10 hover:bg-tech-blue/20 rounded-lg flex items-center justify-center transition-colors">
                  <LinkedinIcon className="w-6 h-6 text-tech-blue" />
                </button>
                <button className="w-12 h-12 bg-tech-blue/10 hover:bg-tech-blue/20 rounded-lg flex items-center justify-center transition-colors">
                  <Mail className="w-6 h-6 text-tech-blue" />
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-0 shadow-card bg-gradient-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Invia un Messaggio
              </h3>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nome *
                    </label>
                    <Input 
                      placeholder="Il tuo nome"
                      className="border-border focus:border-tech-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Cognome *
                    </label>
                    <Input 
                      placeholder="Il tuo cognome"
                      className="border-border focus:border-tech-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <Input 
                    type="email"
                    placeholder="la-tua-email@esempio.it"
                    className="border-border focus:border-tech-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Azienda
                  </label>
                  <Input 
                    placeholder="Nome della tua azienda"
                    className="border-border focus:border-tech-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tipo di Richiesta
                  </label>
                  <select className="w-full p-3 border border-border rounded-md focus:border-tech-blue focus:outline-none bg-background">
                    <option>Consulenza generale</option>
                    <option>Demo prodotto</option>
                    <option>Preventivo servizi</option>
                    <option>Partnership</option>
                    <option>Supporto tecnico</option>
                    <option>Altro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Messaggio *
                  </label>
                  <Textarea 
                    placeholder="Descrivi la tua richiesta o le tue esigenze di Business Intelligence..."
                    rows={5}
                    className="border-border focus:border-tech-blue resize-none"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="privacy" className="rounded border-border" />
                  <label htmlFor="privacy" className="text-sm text-muted-foreground">
                    Accetto il trattamento dei dati personali secondo la{' '}
                    <span className="text-tech-blue underline cursor-pointer">Privacy Policy</span>
                  </label>
                </div>

                <Button 
                  variant="gradient" 
                  size="lg" 
                  className="w-full"
                  type="submit"
                >
                  <Send className="mr-2 w-5 h-5" />
                  Invia Messaggio
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-hero p-8 md:p-12 rounded-2xl shadow-elegant text-white text-center">
          <h3 className="text-3xl font-bold mb-6">
            Pronto a Iniziare il Tuo Viaggio nei Dati?
          </h3>
          <p className="text-lg mb-8 opacity-90 max-w-3xl mx-auto">
            Non lasciare che i tuoi dati rimangano inutilizzati. Contattaci oggi per scoprire 
            come possiamo trasformare le tue informazioni in vantaggio competitivo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              <Phone className="mr-2 w-5 h-5" />
              Chiamaci Ora
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              <Calendar className="mr-2 w-5 h-5" />
              Prenota una Call
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;