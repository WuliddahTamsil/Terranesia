import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Moon, Sun, Globe, Bell } from 'lucide-react';
import { Logo } from './Logo';
import { SubscribeModal } from './SubscribeModal';

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

export function Navbar({ isDark, setIsDark, lang, setLang }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const tx = t[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: tx.home, href: '#beranda' },
    { label: tx.explore, href: '#jelajah' },
    { label: tx.history, href: '#historyculture' },
    { label: tx.lab, href: '#lab' },
    { label: tx.edu, href: '#edukasi' },
    { label: tx.donate, href: '#donasi' },
  ];

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
          <a href="#beranda" className="flex items-center gap-1.5 group">
            <Logo 
              variant={isDark ? 'alternative-white' : 'main'} 
              size="sm" 
              showTypeface={true}
              className="group-hover:scale-105 transition-transform h-8"
            />
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/8 rounded-lg transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
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
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-sm text-muted-foreground hover:text-primary hover:bg-primary/8 rounded-lg transition-all"
                >
                  {link.label}
                </a>
              ))}
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
