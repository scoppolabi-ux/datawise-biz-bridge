import { BarChart3, Mail, Phone, MapPin, LinkedinIcon } from 'lucide-react';
interface FooterProps {
  onNavigate: (section: string) => void;
}
const Footer = ({
  onNavigate
}: FooterProps) => {
  const navigationLinks = [{
    id: 'home',
    label: 'Home'
  }, {
    id: 'about',
    label: 'Chi Siamo'
  }, {
    id: 'services',
    label: 'Cosa Facciamo'
  }, {
    id: 'approach',
    label: 'Approccio'
  }, {
    id: 'team',
    label: 'Il Team'
  }];
  const serviceLinks = [{
    id: 'detailed-services',
    label: 'Servizi Dettagliati'
  }, {
    id: 'mission',
    label: 'Mission & Vision'
  }, {
    id: 'rd',
    label: 'Ricerca & Sviluppo'
  }, {
    id: 'contact',
    label: 'Contatti'
  }];
  return <footer className="bg-gradient-to-br from-tech-blue-dark to-data-purple text-white">
      <div className="container mx-auto px-4 py-16 bg-[#080808]">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">DataWisePartners</span>
            </div>
            
            <p className="text-white/80 leading-relaxed">
              Trasformiamo i dati aziendali in decisioni strategiche vincenti attraverso 
              soluzioni innovative di Business Intelligence.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-white/80">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Milano, Italia</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">+39 02 1234 5678</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">info@datawisepartners.it</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Navigazione</h3>
            <ul className="space-y-3">
              {navigationLinks.map(link => <li key={link.id}>
                  <button onClick={() => onNavigate(link.id)} className="text-white/80 hover:text-white transition-colors text-sm">
                    {link.label}
                  </button>
                </li>)}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Servizi</h3>
            <ul className="space-y-3">
              {serviceLinks.map(link => <li key={link.id}>
                  <button onClick={() => onNavigate(link.id)} className="text-white/80 hover:text-white transition-colors text-sm">
                    {link.label}
                  </button>
                </li>)}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Rimani in Contatto</h3>
            <p className="text-white/80 text-sm mb-6">
              Seguici per aggiornamenti sui nostri servizi e le ultime novità nel mondo della Business Intelligence.
            </p>
            
            <div className="flex space-x-4">
              <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors">
                <LinkedinIcon className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 p-4 bg-white/10 rounded-lg">
              <h4 className="font-semibold mb-2 text-sm">Newsletter</h4>
              <p className="text-white/80 text-xs mb-3">
                Iscriviti per ricevere insights e novità BI
              </p>
              <div className="flex">
                <input type="email" placeholder="La tua email" className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-l-md text-white placeholder-white/60 text-sm focus:outline-none focus:bg-white/30" />
                <button className="px-4 py-2 bg-white text-tech-blue rounded-r-md hover:bg-white/90 transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/60 text-sm">
              © 2024 DataWisePartners. Tutti i diritti riservati.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <button 
                onClick={() => window.location.href = '/privacy-policy'}
                className="text-white/60 hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => window.location.href = '/cookie-policy'}
                className="text-white/60 hover:text-white transition-colors"
              >
                Cookie Policy
              </button>
              <button className="text-white/60 hover:text-white transition-colors">
                Termini di Servizio
              </button>
            </div>
          </div>
          
          <div className="text-center mt-6 text-white/40 text-xs">
            Made with ❤️ for transforming data into decisions
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;