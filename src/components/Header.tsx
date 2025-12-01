import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

const Header = ({ onNavigate, activeSection }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'Chi Siamo' },
    { id: 'services', label: 'Cosa Facciamo' },
    { id: 'approccio-card', label: 'Approccio' },
    { id: 'business-model-card', label: 'Business Model' },
    { id: 'team', label: 'Il Team' },
    { id: 'mission', label: 'Mission & Vision' },
    { id: 'detailed-services', label: 'Servizi' },
    { id: 'rd', label: 'R&D' },
    { id: 'contact', label: 'Contatti' }
  ];

  const isOnHomePage = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <img 
              src="/lovable-uploads/1eabf32b-5b7b-4f4f-a577-b132f69da638.png" 
              alt="DataWisePartners Logo"
              className="h-8 w-auto opacity-90"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {isOnHomePage && menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "tech" : "ghost"}
                size="sm"
                onClick={() => onNavigate(item.id)}
                className="text-sm"
              >
                {item.label}
              </Button>
            ))}
            {!isOnHomePage && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-sm"
              >
                <Link to="/">Home</Link>
              </Button>
            )}
            <Button
              variant={location.pathname === '/ai-commerce-lab' ? "tech" : "ghost"}
              size="sm"
              asChild
              className="text-sm"
            >
              <Link to="/ai-commerce-lab">AI Commerce Lab</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-2">
              {isOnHomePage && menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "tech" : "ghost"}
                  className="justify-start text-sm"
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMenuOpen(false);
                  }}
                >
                  {item.label}
                </Button>
              ))}
              {!isOnHomePage && (
                <Button
                  variant="ghost"
                  className="justify-start text-sm"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/">Home</Link>
                </Button>
              )}
              <Button
                variant={location.pathname === '/ai-commerce-lab' ? "tech" : "ghost"}
                className="justify-start text-sm"
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/ai-commerce-lab">AI Commerce Lab</Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;