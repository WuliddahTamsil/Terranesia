import { motion } from 'motion/react';
import { MapPin, Brain, Headphones, ChevronDown, Play, Sparkles } from 'lucide-react';

const HERO_BG = 'https://images.unsplash.com/photo-1672128558402-8e03471c8779?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80';
const VILLAGE_IMG = 'https://images.unsplash.com/photo-1776442564181-fd60b00b9afc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80';
const PERSON_IMG = 'https://images.unsplash.com/photo-1655966976173-4d3822ff9cda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80';

interface Props { lang: 'id' | 'en' }

const t = {
  id: {
    badge: '',
    title1: 'Jelajahi Warisan',
    title2: 'Indonesia',
    sub: 'Jelajahi kekayaan budaya Nusantara melalui teknologi Web GIS, Kecerdasan Buatan, dan pengalaman AR/VR yang imersif untuk generasi yang mencintai alam.',
    cta1: 'Mulai Jelajah',
    cta2: 'Tonton Demo',
    stat1: '340+', l1: 'Budaya Terpetakan',
    stat2: '15K+', l2: 'Pengguna Aktif',
    stat3: '98%',  l3: 'Kepuasan Pelajar',
    stat4: '50+',  l4: 'Wilayah Indonesia',
    feat1: 'Web GIS Interaktif',
    feat2: 'AI Powered',
    feat3: 'AR / VR Experience',
  },
  en: {
    badge: '',
    title1: 'Discover',
    title2: 'Indonesian Heritage',
    sub: 'Explore Nusantara cultural heritage through immersive Web GIS, Artificial Intelligence, and AR/VR technology for a generation that loves nature.',
    cta1: 'Start Exploring',
    cta2: 'Watch Demo',
    stat1: '340+', l1: 'Mapped Cultures',
    stat2: '15K+', l2: 'Active Users',
    stat3: '98%',  l3: 'Student Satisfaction',
    stat4: '50+',  l4: 'Indonesian Regions',
    feat1: 'Interactive Web GIS',
    feat2: 'AI Powered',
    feat3: 'AR / VR Experience',
  },
};

const FloatingParticle = ({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-primary/20 pointer-events-none"
    style={{ left: x, top: y, width: size, height: size }}
    animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
    transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
);

export function HeroSection({ lang }: Props) {
  const tx = t[lang];

  const stats = [
    { value: tx.stat1, label: tx.l1 },
    { value: tx.stat2, label: tx.l2 },
    { value: tx.stat3, label: tx.l3 },
    { value: tx.stat4, label: tx.l4 },
  ];

  const features = [
    { icon: MapPin, label: tx.feat1, color: 'text-emerald-400' },
    { icon: Brain, label: tx.feat2, color: 'text-amber-400' },
    { icon: Headphones, label: tx.feat3, color: 'text-sky-400' },
  ];

  return (
    <section id="beranda" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt="Terranesia cultural landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* Floating Particles */}
      {[
        { delay: 0, x: '10%', y: '20%', size: 8 },
        { delay: 1, x: '25%', y: '60%', size: 5 },
        { delay: 2, x: '70%', y: '30%', size: 10 },
        { delay: 0.5, x: '85%', y: '70%', size: 6 },
        { delay: 1.5, x: '50%', y: '15%', size: 7 },
      ].map((p, i) => <FloatingParticle key={i} {...p} />)}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <div className="text-white">
            {/* Badge */}
            {tx.badge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-white/90">{tx.badge}</span>
            </motion.div>
            )}

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <h1
                style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.1 }}
                className="text-white mb-2"
              >
                {tx.title1}
                <br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #52B788, #F4A261)' }}>
                  {tx.title2}
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/75 text-base sm:text-lg max-w-lg mt-4 mb-8 leading-relaxed"
            >
              {tx.sub}
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {features.map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-sm text-white/80"
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                  {label}
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#jelajah"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #2D6A4F, #52B788)', color: '#fff', boxShadow: '0 8px 32px rgba(45,106,79,0.4)' }}
              >
                <MapPin className="w-4 h-4" />
                {tx.cta1}
              </a>
              <button className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                <Play className="w-4 h-4 fill-current" />
                {tx.cta2}
              </button>
            </motion.div>
          </div>

          {/* Right — Visual Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative w-full h-[500px]">
              {/* Main card */}
              <div className="absolute top-0 right-0 w-72 h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <img src={VILLAGE_IMG} alt="Traditional village" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/15 backdrop-blur rounded-xl p-3 border border-white/20">
                    <p className="text-white text-xs font-semibold">Desa Budaya Nusantara</p>
                    <p className="text-white/70 text-xs">Indonesia - Wilayah Adat</p>
                  </div>
                </div>
              </div>

              {/* Secondary card */}
              <div className="absolute bottom-0 left-0 w-60 h-72 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <img src={PERSON_IMG} alt="Terranesia culture guide" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white text-xs">Live Virtual Tour</span>
                  </div>
                </div>
              </div>

              {/* Floating info badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/25 shadow-2xl text-center min-w-[140px]">
                  <div className="text-2xl font-bold text-white">97%</div>
                  <div className="text-white/70 text-xs mt-1">Kearifan Terjaga</div>
                  <div className="mt-2 h-1 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-300" style={{ width: '97%' }} />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {stats.map(({ value, label }, i) => (
            <div
              key={i}
              className="text-center p-4 rounded-2xl bg-white/8 backdrop-blur border border-white/12 hover:bg-white/12 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                {value}
              </div>
              <div className="text-white/60 text-xs mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <a href="#jelajah" className="flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </a>
      </motion.div>
    </section>
  );
}
