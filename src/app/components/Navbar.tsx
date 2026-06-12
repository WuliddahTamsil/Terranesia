import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Moon, Sun, Globe, Bell, VolumeX } from 'lucide-react';
import { Logo } from './Logo';
import { SubscribeModal } from './SubscribeModal';
import { useAudio } from '../audio/AudioContext';

interface NavbarProps {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  lang: 'id' | 'en';
  setLang: (v: 'id' | 'en') => void;
}

const t = {
  id: { home: 'Beranda', explore: 'Jelajah', history: 'Sejarah & Budaya', lab: 'Lab', edu: 'Edukasi', donate: 'Donasi' },
  en: { home: 'Home', explore: 'Explore', history: 'History & Culture', lab: 'Lab', edu: 'Education', donate: 'Donate' },
};

const smoothScroll = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export function Navbar({ isDark, setIsDark, lang, setLang }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const tx = t[lang];
  const location = useLocation();
  const navigate = useNavigate();
  const { isPlaying, togglePlay } = useAudio();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      if (location.pathname === '/') {
        const sectionIds = ['beranda', 'jelajah', 'sejarah-budaya', 'edukasi', 'donasi'];
        let currentActive = 'beranda';

        // Check if we are near the bottom of the page
        const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
        if (isAtBottom) {
          currentActive = 'donasi';
        } else {
          for (const id of sectionIds) {
            const element = document.getElementById(id);
            if (element) {
              const rect = element.getBoundingClientRect();
              // A section is active if its top is above the upper-middle viewport threshold (e.g. 200px)
              // and its bottom is below that threshold.
              if (rect.top <= 200 && rect.bottom >= 200) {
                currentActive = id;
                break;
              }
            }
          }
        }
        setActiveSection(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once initially

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const links = [
    { label: tx.home, href: '#beranda', id: 'beranda' },
    { label: tx.explore, href: '#jelajah', id: 'jelajah' },
    { label: tx.history, href: '#sejarah-budaya', id: 'sejarah-budaya' },
    { label: tx.edu, href: '#edukasi', id: 'edukasi' },
    { label: tx.donate, href: '#donasi', id: 'donasi' },
    { label: tx.lab, href: '/lab', id: 'lab' },
  ];

  const handleNavClick = (link: (typeof links)[0]) => {
    setMenuOpen(false);
    
    if (link.href.startsWith('#')) {
      // If we're not on home page, navigate to home first
      if (location.pathname !== '/') {
        navigate('/');
        // Scroll after a short delay to ensure page is loaded
        setTimeout(() => smoothScroll(link.id), 100);
      } else {
        // Already on home page, just scroll
        smoothScroll(link.id);
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/85 backdrop-blur-2xl border-b border-border shadow-xl shadow-primary/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => {
              navigate('/');
              setTimeout(() => smoothScroll('beranda'), 100);
            }}
            className="flex items-center gap-1.5 group cursor-pointer"
          >
            <Logo 
              variant={isDark ? 'alternative-white' : 'main'} 
              size="md" 
              showTypeface={true}
              className="group-hover:scale-105 transition-transform"
            />
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = link.href === '/lab' 
                ? location.pathname === '/lab'
                : location.pathname === '/' && activeSection === link.id;
              
              return (
                <button
                  key={link.href}
                  onClick={() => {
                    if (link.href === '/lab') {
                      navigate('/lab');
                    } else {
                      handleNavClick(link);
                    }
                  }}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                    isActive
                      ? 'text-primary bg-primary/8'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/8'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Subscribe button */}
            <button
              onClick={() => setIsSubscribeOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/25 hover:bg-primary hover:text-primary-foreground font-bold text-xs transition-all shadow-sm cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 animate-bounce" style={{ animationDuration: '3s' }} />
              <span className="hidden md:inline">{lang === 'id' ? 'Langganan' : 'Subscribe'}</span>
            </button>

            {/* Music Player Control */}
            <button
              onClick={togglePlay}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-primary/10 border-primary/30 text-primary shadow-[0_0_8px_rgba(var(--color-primary),0.25)]'
                  : 'bg-transparent border-border text-muted-foreground hover:text-primary hover:border-primary/60 hover:bg-primary/8'
              }`}
              title={isPlaying ? (lang === 'id' ? 'Senyapkan Musik' : 'Mute Music') : (lang === 'id' ? 'Putar Musik' : 'Play Music')}
            >
              {isPlaying ? (
                <div className="flex items-end gap-[2px] h-3 w-3.5 justify-center">
                  <div className="w-[2px] bg-primary rounded-full animate-eq-bar-1" />
                  <div className="w-[2px] bg-primary rounded-full animate-eq-bar-2" />
                  <div className="w-[2px] bg-primary rounded-full animate-eq-bar-3" />
                </div>
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/60 hover:bg-primary/8 transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="font-semibold">{lang.toUpperCase()}</span>
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/60 hover:bg-primary/8 transition-all"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-border"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {links.map((link) => {
                const isActive = link.href === '/lab' 
                  ? location.pathname === '/lab'
                  : location.pathname === '/' && activeSection === link.id;
                
                return (
                  <button
                    key={link.href}
                    onClick={() => {
                      if (link.href === '/lab') {
                        navigate('/lab');
                      } else {
                        handleNavClick(link);
                      }
                    }}
                    className={`px-4 py-3 text-sm font-medium rounded-lg transition-all text-left w-full ${
                      isActive
                        ? 'text-primary bg-primary/8'
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/8'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setIsSubscribeOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-3 text-sm text-primary hover:bg-primary/8 rounded-lg transition-all text-left w-full font-semibold border-t border-border mt-2 pt-3"
              >
                <Bell className="w-4 h-4" />
                {lang === 'id' ? 'Langganan Kabar Terranesia' : 'Subscribe to Terranesia'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subscribe Modal */}
      <SubscribeModal 
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
        lang={lang}
      />
    </motion.nav>
  );
}
