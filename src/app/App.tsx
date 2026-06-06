import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { JelajahSection } from './components/JelajahSection';
import { HistoryCultureSection } from './components/HistoryCultureSection';
import { LabPage } from './components/LabPage';
import { EdukasiSection } from './components/EdukasiSection';
import { DonasiSection } from './components/DonasiSection';
import { Footer } from './components/Footer';
import { AudioProvider, useAudio } from './audio/AudioContext';

function HomePage({ lang, isDark }: { lang: 'id' | 'en'; isDark: boolean }) {
  return (
    <main>
      <div id="beranda">
        <HeroSection lang={lang} />
      </div>
      <div id="jelajah">
        <JelajahSection lang={lang} isDark={isDark} />
      </div>
      <div id="sejarah-budaya">
        <HistoryCultureSection lang={lang} />
      </div>
      <div id="edukasi">
        <EdukasiSection lang={lang} />
      </div>
      <div id="donasi">
        <DonasiSection lang={lang} />
      </div>
    </main>
  );
}

function AppContent() {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const { unlockAudio } = useAudio();

  // Unlock audio on first user gesture (click or keypress)
  useEffect(() => {
    const handleGesture = () => {
      unlockAudio();
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };

    window.addEventListener('click', handleGesture);
    window.addEventListener('keydown', handleGesture);
    window.addEventListener('touchstart', handleGesture);

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, [unlockAudio]);

  return (
    <Router>
      <div className={isDark ? 'dark' : ''}>
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
          <Navbar isDark={isDark} setIsDark={setIsDark} lang={lang} setLang={setLang} />
          <Routes>
            <Route path="/" element={<HomePage lang={lang} isDark={isDark} />} />
            <Route path="/lab" element={<LabPage lang={lang} isDark={isDark} />} />
          </Routes>
          <Footer lang={lang} />
        </div>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
}

