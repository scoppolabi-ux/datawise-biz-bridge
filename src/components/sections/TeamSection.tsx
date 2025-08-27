import { Card, CardContent } from '@/components/ui/card';
import { LinkedinIcon, Mail, User } from 'lucide-react';

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Stefano Coppola",
      role: "CEO e Founder",
      description: "Con oltre 20 anni di esperienza nel creare e guidare start-up e aziende attraverso strategie innovative e un approccio centrato sui dati. Esperto nell'implementazione di soluzioni di business intelligence e nell'ottimizzazione dei processi aziendali per massimizzare l'efficienza e la crescita.",
      expertise: ["Business Intelligence", "Leadership Innovativa", "Strategie Data-Driven", "Ottimizzazione Processi"],
      image: "/api/placeholder/200/200"
    },
    {
      name: "Direttore Tecnico",
      role: "CTO",
      description: "Esperto ingegnere software specializzato nella progettazione e implementazione di sistemi avanzati di business intelligence e ERP. Con la sua vasta esperienza nel campo, garantisce che le soluzioni tecnologiche offerte da DataWisePartners siano sempre all'avanguardia.",
      expertise: ["Sistemi BI Avanzati", "Architettura Software", "ERP", "Innovazione Tecnologica"],
      image: "/api/placeholder/200/200"
    },
    {
      name: "Responsabile della Formazione",
      role: "Head of Training",
      description: "Trainer e consulente di alto livello con una passione per l'educazione aziendale. Con il suo approccio coinvolgente e personalizzato, guida i nostri clienti attraverso programmi formativi su misura per massimizzare il loro utilizzo dei dati aziendali.",
      expertise: ["Formazione Aziendale", "Consulenza Personalizzata", "Educazione BI", "Change Management"],
      image: "/api/placeholder/200/200"
    },
    {
      name: "Analista Senior",
      role: "Senior Data Analyst",
      description: "Analista esperto con una profonda comprensione dei processi aziendali e una capacità straordinaria di estrarre insight significativi dai dati. Con la sua analisi dettagliata, fornisce ai nostri clienti informazioni preziose per prendere decisioni informate e strategiche.",
      expertise: ["Data Analysis", "Business Processes", "Insight Generation", "Decision Support"],
      image: "/api/placeholder/200/200"
    },
    {
      name: "Consulente Strategico",
      role: "Strategic Consultant",
      description: "Consulente strategica con una vasta esperienza nell'interpretazione dei dati e nell'identificazione di opportunità di crescita per le aziende. Con il suo approccio basato sui dati, supporta i nostri clienti nel definire e attuare strategie vincenti.",
      expertise: ["Strategic Planning", "Data Interpretation", "Growth Opportunities", "Business Strategy"],
      image: "/api/placeholder/200/200"
    },
    {
      name: "R&D Team",
      role: "Research & Development",
      description: "Il motore dell'innovazione di DataWisePartners. Pioniere della realtà aumentata, machine learning e nell'intelligenza artificiale, guida il nostro team nello sviluppo di soluzioni all'avanguardia. Il suo impegno per l'eccellenza e la sua passione per l'innovazione assicurano che restiamo al passo con le ultime tendenze.",
      expertise: ["Machine Learning", "AI", "Realtà Aumentata", "Innovazione Tecnologica"],
      image: "/api/placeholder/200/200"
    }
  ];

  return (
    <section id="team" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Il Nostro Team
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Un team multidisciplinare di esperti dedicati a trasformare i vostri dati in vantaggio competitivo
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 bg-gradient-card group"
            >
              <CardContent className="p-6">
                {/* Profile Image */}
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden">
                  <User className="w-12 h-12 text-white" />
                </div>

                {/* Name and Role */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                  <p className="text-tech-blue font-semibold text-sm">{member.role}</p>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {member.description}
                </p>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {member.expertise.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex}
                      className="px-2 py-1 bg-tech-blue/10 text-tech-blue text-xs rounded-full border border-tech-blue/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Contact Options */}
                <div className="flex justify-center space-x-3">
                  <button className="w-8 h-8 bg-tech-blue/10 hover:bg-tech-blue/20 rounded-full flex items-center justify-center transition-colors">
                    <LinkedinIcon className="w-4 h-4 text-tech-blue" />
                  </button>
                  <button className="w-8 h-8 bg-tech-blue/10 hover:bg-tech-blue/20 rounded-full flex items-center justify-center transition-colors">
                    <Mail className="w-4 h-4 text-tech-blue" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Philosophy */}
        <div className="mt-20 bg-gradient-hero p-8 md:p-12 rounded-2xl shadow-elegant text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6">La Nostra Filosofia di Team</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-xl font-semibold mb-3">Collaborazione</h4>
                <p className="opacity-90">
                  Lavoriamo insieme per unire competenze multidisciplinari e offrire 
                  soluzioni complete e integrate
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-3">Eccellenza</h4>
                <p className="opacity-90">
                  Ci impegniamo costantemente per l'eccellenza in ogni progetto, 
                  garantendo risultati di alta qualità
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-3">Innovazione</h4>
                <p className="opacity-90">
                  Rimaniamo sempre al passo con le ultime tendenze tecnologiche 
                  per offrire soluzioni all'avanguardia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
