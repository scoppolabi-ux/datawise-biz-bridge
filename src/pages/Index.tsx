import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import BIStepsSection from '@/components/sections/BIStepsSection';
import ServicesSection from '@/components/sections/ServicesSection';
import TeamSection from '@/components/sections/TeamSection';
import MissionVisionSection from '@/components/sections/MissionVisionSection';
import DetailedServicesSection from '@/components/sections/DetailedServicesSection';
import RDSection from '@/components/sections/RDSection';
import ContactSection from '@/components/sections/ContactSection';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    
    // Smooth scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const sections = [
      'home', 'about', 'services', 'approach', 'business-model', 
      'team', 'mission', 'detailed-services', 'rd', 'contact'
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }

      // Special case for home section (hero)
      if (window.scrollY < 100) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <Header onNavigate={handleNavigate} activeSection={activeSection} />
      
      <main>
        <div id="home">
          <HeroSection onNavigate={handleNavigate} />
        </div>
        
        <AboutSection />
        <BIStepsSection onNavigate={handleNavigate} />
        <ServicesSection onNavigate={handleNavigate} />
        <TeamSection />
        <MissionVisionSection />
        <DetailedServicesSection />
        <RDSection />
        <ContactSection />
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default Index;
