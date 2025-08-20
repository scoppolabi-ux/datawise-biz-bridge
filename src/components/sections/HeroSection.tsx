import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, BarChart3, Database } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-red/90 via-brand-red-dark/80 to-brand-black/90"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 animate-float">
          <BarChart3 className="w-12 h-12 text-white/20" />
        </div>
        <div className="absolute top-40 right-20 animate-float delay-300">
          <TrendingUp className="w-16 h-16 text-white/15" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-float delay-700">
          <Database className="w-10 h-10 text-white/25" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Logo - Grande e Prominente */}
          <div className="mb-12">
            <img 
              src="/lovable-uploads/8f8705f5-8bb2-4eb2-901c-af0bd8d1e7ac.png" 
              alt="DataWisePartners Logo"
              className="h-48 md:h-64 lg:h-72 w-auto mx-auto mb-8 drop-shadow-2xl"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Trasformiamo i{' '}
            <span className="bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
              Dati
            </span>{' '}
            in{' '}
            <span className="bg-gradient-to-r from-brand-red-light to-white bg-clip-text text-transparent">
              Decisioni
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
            Sblocchiamo il potenziale dei vostri dati aziendali con soluzioni di{' '}
            <strong className="text-primary-glow">Business Intelligence</strong> su misura, 
            consulenza strategica e formazione personalizzata.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => onNavigate('services')}
              className="text-lg px-8 py-4 h-auto"
            >
              Scopri i Nostri Servizi
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => onNavigate('contact')}
              className="text-lg px-8 py-4 h-auto border-white/30 text-white hover:bg-white/10"
            >
              Contattaci
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold text-primary-glow mb-2">20+</div>
              <div className="text-white/80">Anni di Esperienza</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold text-brand-red-light mb-2">100+</div>
              <div className="text-white/80">Progetti Completati</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold text-primary-glow mb-2">10</div>
              <div className="text-white/80">Metodologie BI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;