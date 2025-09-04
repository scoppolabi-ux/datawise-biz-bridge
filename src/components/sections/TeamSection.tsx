import { Card, CardContent } from '@/components/ui/card';
import { LinkedinIcon, Mail, User } from 'lucide-react';

const TeamSection = () => {
  const teamMembers = [
    {
  "name": "Stefano Coppola",
  "role": "CEO & Founder",
  "description": "Innovatore e Business Translator con oltre 20 anni di esperienza nel creare e guidare imprese attraverso strategie data-driven e progetti scalabili. Stefano unisce la visione del CEO con l’operatività di chi sa mettere le mani nei dati, nei processi e nelle tecnologie. Crede nella forza delle relazioni umane e nella disciplina come motore per superare le sfide. Coniuga creatività e rigore, numeri e storytelling, strategia e concretezza: il suo obiettivo è trasformare ogni idea in un sistema che genera valore reale e duraturo.",
  "expertise": ["Business Intelligence", "Leadership Visionaria", "Strategie Data-Driven", "Innovazione Scalabile", "Ottimizzazione Processi"],
  "image": "/api/placeholder/200/200"
},
   {
  "name": "Wise",
  "role": "Chief Intelligence Officer (CIO)",
  "description": "Wise è la mente artificiale di DataWisePartners. Analizza enormi quantità di dati, individua pattern nascosti e li traduce in insight chiari per il management. Non fornisce solo numeri, ma risposte concrete per decisioni strategiche rapide e consapevoli.",
  "expertise": ["Business Intelligence", "AI & Machine Learning", "Data Analysis", "Decision Making"],
  "image": "/api/placeholder/200/200"
},
    {
  "name": "Sergent",
  "role": "Chief Operations Partner (COP)",
  "description": "Sergent è il motore operativo di DataWisePartners: rigore, disciplina e affidabilità al servizio dell’esecuzione. Se Stefano è la visione e Wise è l’intelligenza, Sergent è la forza che rende tutto concreto. Coordina i processi complessi, standardizza le procedure e porta efficienza anche nei contesti più sfidanti. La sua presenza assicura che ogni progetto non resti un’idea sulla carta, ma diventi realtà funzionante, scalabile e replicabile. È la garanzia di delivery puntuale, qualità costante e continuità nel tempo.",
  "expertise": ["Processi Operativi", "Project Management", "Standardizzazione", "Execution", "Scalabilità"],
  "image": "/api/placeholder/200/200"
},
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
