import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Play, Pause, Volume2, VolumeX, BookOpen, Leaf, ArrowRight, Sparkles, Film } from 'lucide-react';
import { useNavigate } from 'react-router';

interface Props {
  lang: 'id' | 'en';
  isDark: boolean;
}

// ─────────────────────────────────────────────
// Archive data
// ─────────────────────────────────────────────
interface ArchiveLesson {
  titleId: string;
  titleEn: string;
  contentId: string;
  contentEn: string;
  sdg: string;
}

interface ArchiveEntry {
  id: string;
  era: string;
  titleId: string;
  titleEn: string;
  locationId: string;
  locationEn: string;
  descId: string;
  descEn: string;
  archivePhoto: string;
  vibesVideo: string; // Unsplash-based video or looping image
  vibesImage: string; // color image version for "AI Vibes" state
  accentColor: string;
  tag: string;
  lessons: ArchiveLesson[];
}

const ARCHIVES: ArchiveEntry[] = [
  {
    id: 'subak',
    era: 'Abad XI',
    titleId: 'Subak — Harmoni Sawah Bali',
    titleEn: "Subak — Harmony of Bali's Rice Fields",
    locationId: 'Ubud, Bali',
    locationEn: 'Ubud, Bali',
    descId:
      'Foto arsip yang memperlihatkan pura (Pura Bedugul) di kawasan sawah Subak. Subak adalah sistem organisasi masyarakat petani Bali yang mengatur irigasi secara adil.',
    descEn:
      "Archive photo showing a temple (Pura Bedugul) in the Subak rice terraces. Subak is a Balinese farmers' cooperative organization that manages irrigation fairly.",
    archivePhoto: '/Pura-di-kawasan-subak.jpeg',
    vibesImage:
      '/subak_ai_vibes.png',
    vibesVideo:
      '/subak_ai_vibes.png',
    accentColor: '#22c55e',
    tag: 'Alam & Tradisi',
    lessons: [
      {
        titleId: 'Organisasi Kemasyarakatan',
        titleEn: 'Community Organization',
        contentId:
          'Menurut Pia Agung Bali, Subak bukan sekadar sistem pengairan fisik, melainkan organisasi kemasyarakatan khas Bali yang secara khusus mengatur manajemen irigasi sawah secara tradisional, adil, dan merata.',
        contentEn:
          'According to Pia Agung Bali, Subak is not just a physical irrigation system, but a unique Balinese community organization that specifically manages rice field irrigation in a traditional, fair, and equitable manner.',
        sdg: 'SDGs 6 — Air Bersih',
      },
      {
        titleId: 'Filosofi Tri Hita Karana',
        titleEn: 'Tri Hita Karana Philosophy',
        contentId:
          'Sistem Subak adalah manifestasi dari filosofi Tri Hita Karana yang bermakna tiga penyebab kebahagiaan: keharmonisan hubungan manusia dengan Tuhan (Parahyangan), sesama manusia (Pawongan), dan alam lingkungan (Palemahan).',
        contentEn:
          'The Subak system is a manifestation of the Tri Hita Karana philosophy, which means the three causes of happiness: harmonious relations between humans and God (Parahyangan), fellow humans (Pawongan), and the natural environment (Palemahan).',
        sdg: 'SDGs 15 — Ekosistem Darat',
      },
      {
        titleId: 'Warisan Budaya Dunia',
        titleEn: 'World Cultural Heritage',
        contentId:
          'Subak melibatkan kegiatan ritual keagamaan yang rutin sesuai dengan tahapan pertumbuhan padi. Karena keunikannya dan fungsi vitalnya menjaga ekosistem, Subak resmi diakui oleh UNESCO sebagai warisan budaya dunia.',
        contentEn:
          'Subak involves routine religious rituals according to the stages of rice growth. Due to its uniqueness and vital function in maintaining the ecosystem, Subak is officially recognized by UNESCO as a world cultural heritage.',
        sdg: 'SDGs 12 — Konsumsi Bertanggung Jawab',
      },
    ],
  },
  {
    id: 'dayak',
    era: 'Abad XIX',
    titleId: 'Tana Ulen — Hutan Adat Dayak',
    titleEn: 'Tana Ulen — Dayak Sacred Forest',
    locationId: 'Malinau, Kalimantan Utara',
    locationEn: 'Malinau, North Kalimantan',
    descId:
      'Foto arsip masyarakat Dayak Kenyah di pedalaman Kalimantan — penjaga hutan konservasi tertua di Nusantara yang dikenal dengan sistem hukum adat Tana Ulen.',
    descEn:
      "Archival photo of the Dayak Kenyah community in the Borneo interior — guardians of Nusantara's oldest conservation forest known through the Tana Ulen customary law system.",
    archivePhoto: '/tana-ulen-foto-asli.png',
    vibesImage:
      '/tana-ulen-ai-vibes.png',
    vibesVideo:
      '/tana-ulen-ai-vibes.png',
    accentColor: '#f59e0b',
    tag: 'Warisan & Konservasi',
    lessons: [
      {
        titleId: 'Hukum Adat Tana Ulen',
        titleEn: 'Tana Ulen Customary Law',
        contentId:
          'Tana Ulen adalah kawasan hutan lindung adat Dayak Kenyah yang dilarang ditebang dan diburu secara sembarangan. Pelanggaran terhadap aturan ini dikenai sanksi adat berat. Sistem ini telah menjaga keanekaragaman hayati Kalimantan selama berabad-abad.',
        contentEn:
          "Tana Ulen is a Dayak Kenyah customary protected forest zone where logging and hunting are strictly prohibited. Violations are subject to heavy customary sanctions. This system has preserved Borneo's biodiversity for centuries.",
        sdg: 'SDGs 15 — Ekosistem Darat',
      },
      {
        titleId: 'Harmoni Tanpa Eksploitasi',
        titleEn: 'Harmony Without Exploitation',
        contentId:
          'Masyarakat Dayak mengambil hasil hutan hanya sesuai kebutuhan — buah, rotan, dan kayu secukupnya tanpa menebang pohon induk. Prinsip ini, yang dikenal sebagai "hanya ambil yang dibutuhkan", adalah contoh nyata ekonomi sirkular jauh sebelum konsep itu dikenal di Barat.',
        contentEn:
          'Dayak communities harvest forest products only as needed — fruit, rattan, and timber in moderation without cutting mother trees. This principle, known as "take only what you need", is a concrete example of circular economy long before the concept was recognized in the West.',
        sdg: 'SDGs 12 — Konsumsi Bertanggung Jawab',
      },
      {
        titleId: 'Relevansi Global Deforestasi',
        titleEn: 'Global Deforestation Relevance',
        contentId:
          'Kalimantan kehilangan 1,87 juta hektar hutan antara 2001–2019 akibat perkebunan sawit dan tambang. Kearifan Tana Ulen menawarkan model resolusi konkret yang telah terbukti efektif selama ratusan tahun.',
        contentEn:
          'Borneo lost 1.87 million hectares of forest between 2001–2019 due to palm oil plantations and mining. Tana Ulen wisdom offers a concrete resolution model proven effective for hundreds of years.',
        sdg: 'SDGs 13 — Aksi Iklim',
      },
    ],
  },
  {
    id: 'noken',
    era: 'Tradisi Abadi',
    titleId: 'Noken — Tas Kehidupan Papua',
    titleEn: "Noken — Papua's Bag of Life",
    locationId: 'Pegunungan Tengah, Papua',
    locationEn: 'Central Highlands, Papua',
    descId:
      'Foto arsip ibu-ibu Papua merajut noken — tas multifungsi dari serat pohon kayu dan kulit kayu yang telah menjadi simbol kehidupan berkelanjutan masyarakat pegunungan Papua.',
    descEn:
      "Archival photo of Papuan women knitting noken — a multi-functional bag from tree fiber and bark that has become a symbol of sustainable living for Papua's mountain communities.",
    archivePhoto: '/noken-foto-asli.png',
    vibesImage:
      '/noken-ai-vibes.png',
    vibesVideo:
      '/noken-ai-vibes.png',
    accentColor: '#8b5cf6',
    tag: 'Gaya Hidup Berkelanjutan',
    lessons: [
      {
        titleId: 'Noken — Warisan UNESCO',
        titleEn: 'Noken — UNESCO Heritage',
        contentId:
          'Noken diakui UNESCO sebagai Warisan Budaya Tak Benda pada 2012. Tas rajutan dari serat pohon Genemo (Gnetum gnemon) atau anggrek hutan ini dapat membawa bayi, hasil panen, hingga barang bawaan sehari-hari — semuanya biodegradable.',
        contentEn:
          'Noken was recognized by UNESCO as Intangible Cultural Heritage in 2012. This bag knitted from Genemo tree fiber (Gnetum gnemon) or forest orchid can carry babies, harvest, and daily goods — all completely biodegradable.',
        sdg: 'SDGs 12 — Konsumsi Bertanggung Jawab',
      },
      {
        titleId: 'Solusi Anti Fast-Fashion',
        titleEn: 'Anti Fast-Fashion Solution',
        contentId:
          'Industri fast-fashion menghasilkan 92 juta ton limbah tekstil setiap tahun. Noken, yang dibuat dari bahan alami dan terurai secara biologis, adalah contoh nyata bahwa produksi pakaian/aksesori bisa nol limbah dan tahan puluhan tahun.',
        contentEn:
          'The fast-fashion industry generates 92 million tons of textile waste annually. Noken, made from natural and biodegradable materials, is a concrete example that clothing/accessory production can be zero-waste and last for decades.',
        sdg: 'SDGs 14 & 15 — Ekosistem Laut & Darat',
      },
      {
        titleId: 'Kekuatan Perempuan Adat',
        titleEn: "Indigenous Women's Strength",
        contentId:
          'Pembuatan noken adalah domain perempuan Papua — menjadi simbol status sosial, kreativitas, dan pengetahuan alam. Perempuan adat adalah pemimpin ekologi terdepan yang sering terlupakan dalam narasi pembangunan modern.',
        contentEn:
          'Noken making is the domain of Papuan women — becoming a symbol of social status, creativity, and ecological knowledge. Indigenous women are frontline ecological leaders often forgotten in modern development narratives.',
        sdg: 'SDGs 5 — Kesetaraan Gender',
      },
    ],
  },
];

// ─────────────────────────────────────────────
// Sub-component: Archive Card (landing grid)
// ─────────────────────────────────────────────
function ArchiveCard({
  entry,
  lang,
  onClick,
}: {
  entry: ArchiveEntry;
  lang: 'id' | 'en';
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group cursor-pointer relative rounded-2xl overflow-hidden border border-border/40 hover:border-white/30 bg-card shadow-sm hover:shadow-xl transition-all duration-500"
      style={{ '--accent': entry.accentColor } as React.CSSProperties}
    >
      {/* Photo container */}
      <div className="relative h-64 overflow-hidden">
        {/* Archive photo (greyscale by default) */}
        <img
          src={entry.archivePhoto}
          alt={lang === 'id' ? entry.titleId : entry.titleEn}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            hovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
          style={{ filter: 'grayscale(100%) sepia(30%) contrast(1.1)' }}
        />

        {/* Color "Vibes" image on hover */}
        <img
          src={entry.vibesImage}
          alt="AI Vibes"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            hovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />

        {/* Era badge */}
        <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur border border-white/10 text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase font-mono">
          {entry.era}
        </div>

        {/* Vibes indicator */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur border border-white/20 px-3 py-1 rounded-full"
            >
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span className="text-white text-[10px] font-bold">AI Vibes</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Location */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5">
          <Leaf className="w-3 h-3 text-green-400" />
          <span className="text-white/80 text-[10px] font-semibold tracking-wide">
            {lang === 'id' ? entry.locationId : entry.locationEn}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5">
        <span
          className="text-[9px] font-bold tracking-[0.2em] uppercase mb-2 block"
          style={{ color: entry.accentColor }}
        >
          {entry.tag}
        </span>
        <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
          {lang === 'id' ? entry.titleId : entry.titleEn}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {lang === 'id' ? entry.descId : entry.descEn}
        </p>

        <div className="flex items-center gap-1.5 mt-4 text-primary text-xs font-bold">
          <span>{lang === 'id' ? 'Hidupkan Arsip' : 'Animate Archive'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Sub-component: Full Viewer
// ─────────────────────────────────────────────
function ArchiveViewer({
  entry,
  lang,
  onBack,
}: {
  entry: ArchiveEntry;
  lang: 'id' | 'en';
  onBack: () => void;
}) {
  const [mode, setMode] = useState<'photo' | 'vibes'>('photo');
  const [activeLessonIdx, setActiveLessonIdx] = useState<number | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  // ── Ambient audio synthesis ──
  useEffect(() => {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    audioCtxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = isMuted ? 0 : 0.18;
    master.connect(ctx.destination);
    masterGainRef.current = master;

    // Wind noise
    const bufSize = 2 * ctx.sampleRate;
    const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = true;
    sourceRef.current = src;

    const lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 300;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 100;
    lfo.connect(lfoGain);
    lfoGain.connect(lpf.frequency);

    const wGain = ctx.createGain();
    wGain.gain.value = 0.025;

    src.connect(lpf);
    lpf.connect(wGain);
    wGain.connect(master);
    src.start();
    lfo.start();

    setIsAudioPlaying(true);

    const resume = () => ctx.state === 'suspended' && ctx.resume();
    window.addEventListener('click', resume);

    return () => {
      window.removeEventListener('click', resume);
      try { src.stop(); } catch (e) { /* noop */ }
      try { ctx.close(); } catch (e) { /* noop */ }
    };
  }, [entry.id]);

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        isMuted ? 0 : 0.18,
        audioCtxRef.current.currentTime,
        0.1
      );
    }
  }, [isMuted]);

  const handleModeToggle = (newMode: 'photo' | 'vibes') => {
    if (newMode === mode) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setMode(newMode);
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen"
    >
      {/* Back + era breadcrumb */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{lang === 'id' ? 'Kembali ke Arsip' : 'Back to Archives'}</span>
        </button>
        <span className="text-border/60">·</span>
        <span className="text-[11px] font-mono text-primary/80 uppercase tracking-wider font-bold">{entry.era}</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* ── LEFT: Image/Video area ── */}
        <div>
          {/* Title */}
          <div className="mb-4">
            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2 block"
              style={{ color: entry.accentColor }}
            >
              {entry.tag} · {lang === 'id' ? entry.locationId : entry.locationEn}
            </span>
            <h2
              className="text-2xl md:text-3xl font-bold text-foreground"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {lang === 'id' ? entry.titleId : entry.titleEn}
            </h2>
          </div>

          {/* Main visual area */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-border/30 shadow-2xl">
            {/* Photo layer */}
            <motion.img
              src={entry.archivePhoto}
              alt="Archive"
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ opacity: mode === 'photo' && !isTransitioning ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              style={{ filter: 'grayscale(100%) sepia(25%) contrast(1.15)' }}
            />

            {/* Vibes/Color layer */}
            <motion.img
              src={entry.vibesImage}
              alt="AI Vibes"
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ opacity: mode === 'vibes' && !isTransitioning ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            />

            {/* Vibes overlay shimmer */}
            {mode === 'vibes' && !isTransitioning && (
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)',
                  backgroundSize: '200% 200%',
                }}
                animate={{ backgroundPosition: ['0% 0%', '200% 200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Transition overlay */}
            <AnimatePresence>
              {isTransitioning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center"
                >
                  <div className="flex items-center gap-3 text-white">
                    <Sparkles className="w-5 h-5 animate-spin text-yellow-400" />
                    <span className="text-sm font-bold">
                      {mode === 'photo' ? (lang === 'id' ? 'Menghidupkan arsip...' : 'Animating archive...') : (lang === 'id' ? 'Kembali ke foto asli...' : 'Restoring original photo...')}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20 pointer-events-none" />

            {/* Toggle control — bottom right, like Google Arts & Culture */}
            <div className="absolute bottom-4 right-4 z-40 flex items-center bg-black/70 backdrop-blur-sm border border-white/20 rounded-full p-1 gap-0.5 shadow-lg">
              <button
                onClick={() => handleModeToggle('photo')}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  mode === 'photo'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {lang === 'id' ? 'Foto Asli' : 'Original Photo'}
              </button>
              <button
                onClick={() => handleModeToggle('vibes')}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mode === 'vibes'
                    ? 'text-black shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
                style={mode === 'vibes' ? { backgroundColor: entry.accentColor } : {}}
              >
                <Film className="w-3 h-3" />
                AI Vibes
              </button>
            </div>

            {/* Audio button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-4 left-4 z-40 w-9 h-9 rounded-full bg-black/60 backdrop-blur border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-white/60" /> : <Volume2 className="w-4 h-4 text-green-400" />}
            </button>

            {/* Audio indicator */}
            {isAudioPlaying && !isMuted && (
              <div className="absolute top-4 left-4 z-40 flex items-center gap-1.5 bg-black/60 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                <div className="flex gap-0.5 items-end h-3">
                  {[0.4, 0.8, 0.5, 1.0, 0.6].map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 rounded-full bg-green-400"
                      animate={{ scaleY: [h, 1.0, h * 0.5, h] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                      style={{ height: '12px', transformOrigin: 'bottom' }}
                    />
                  ))}
                </div>
                <span className="text-white/70 text-[9px] font-bold tracking-widest uppercase">Ambient</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mt-4 border-l-2 pl-4" style={{ borderColor: entry.accentColor + '60' }}>
            {lang === 'id' ? entry.descId : entry.descEn}
          </p>

          {/* Mode explainer */}
          <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border/30">
            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: entry.accentColor }} />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {mode === 'photo'
                ? (lang === 'id'
                    ? 'Ini adalah foto arsip hitam-putih dari era tersebut. Geser ke "AI Vibes" untuk merasakan suasana yang dihidupkan kembali.'
                    : 'This is a black-and-white archival photo from that era. Switch to "AI Vibes" to experience the atmosphere brought back to life.')
                : (lang === 'id'
                    ? 'Mode AI Vibes menghidupkan suasana arsip melalui visual berwarna dan audio ambient — merasakan "vibes" hidup dari zaman tersebut.'
                    : 'AI Vibes mode brings the archive atmosphere to life through colorized visuals and ambient audio — feeling the living "vibes" of that era.')}
            </p>
          </div>
        </div>

        {/* ── RIGHT: Listen & Learn panel ── */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border/40 bg-card shadow-sm overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center gap-2.5 p-5 border-b border-border/30" style={{ background: `${entry.accentColor}10` }}>
              <BookOpen className="w-4 h-4" style={{ color: entry.accentColor }} />
              <h3 className="font-bold text-sm text-foreground tracking-wide">
                {lang === 'id' ? 'LISTEN & LEARN' : 'LISTEN & LEARN'}
              </h3>
            </div>

            {/* Lessons list */}
            <div className="divide-y divide-border/20">
              {entry.lessons.map((lesson, idx) => {
                const isActive = activeLessonIdx === idx;
                return (
                  <div key={idx}>
                    {/* Accordion trigger */}
                    <button
                      onClick={() => setActiveLessonIdx(isActive ? null : idx)}
                      className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <motion.div
                        animate={{ rotate: isActive ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      </motion.div>
                      <span className="text-sm font-semibold text-foreground">
                        {lang === 'id' ? lesson.titleId : lesson.titleEn}
                      </span>
                    </button>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5">
                            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                              {lang === 'id' ? lesson.contentId : lesson.contentEn}
                            </p>
                            <div
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider"
                              style={{
                                backgroundColor: entry.accentColor + '20',
                                color: entry.accentColor,
                                border: `1px solid ${entry.accentColor}30`,
                              }}
                            >
                              <Leaf className="w-2.5 h-2.5" />
                              {lesson.sdg}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Footer note */}
            <div className="px-5 py-4 bg-muted/20 border-t border-border/20">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {lang === 'id'
                  ? 'Teks dan visualisasi bersifat edukatif berdasarkan riset budaya Nusantara. Dibuat untuk tujuan pembelajaran.'
                  : 'Text and visuals are educational based on Nusantara cultural research. Created for learning purposes.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────
export function ArsipHidupPage({ lang, isDark }: Props) {
  const navigate = useNavigate();
  const [selectedEntry, setSelectedEntry] = useState<ArchiveEntry | null>(null);

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground">
        {/* ─ Hero ─ */}
        <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background atmospheric grid */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            {/* Breadcrumb */}
            <button
              onClick={() => navigate('/lab')}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {lang === 'id' ? 'Kembali ke Lab' : 'Back to Lab'}
            </button>

            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs uppercase tracking-widest mb-5 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              {lang === 'id' ? 'Eksperimen Lab · Arsip Hidup' : 'Lab Experiment · Living Archives'}
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 max-w-4xl"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {lang === 'id' ? (
                <>
                  Arsip Hidup{' '}
                  <span className="bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Nusantara
                  </span>
                </>
              ) : (
                <>
                  Living Archives of{' '}
                  <span className="bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Nusantara
                  </span>
                </>
              )}
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
              {lang === 'id'
                ? 'Foto-foto arsip dari era lalu dihidupkan kembali dengan teknologi AI visual dan audio ambient — merasakan "vibes" nyata kehidupan harmonis masyarakat adat Nusantara sebelum modernisasi.'
                : 'Archival photos from past eras are brought back to life with AI visual technology and ambient audio — experiencing the real "vibes" of harmonious indigenous Nusantara life before modernization.'}
            </p>

            {/* How it works strip */}
            <div className="flex flex-wrap gap-6 items-center text-xs text-muted-foreground border-t border-border/30 pt-6">
              {[
                {
                  icon: '📷',
                  id: 'Pilih arsip foto bersejarah',
                  en: 'Choose a historical photo archive',
                },
                {
                  icon: '✨',
                  id: 'Toggle ke mode AI Vibes',
                  en: 'Toggle to AI Vibes mode',
                },
                {
                  icon: '📖',
                  id: 'Buka panel Listen & Learn',
                  en: 'Open Listen & Learn panel',
                },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-base">{step.icon}</span>
                  <span>{lang === 'id' ? step.id : step.en}</span>
                  {i < 2 && <ArrowRight className="w-3 h-3 text-border" />}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ─ Main Content ─ */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {selectedEntry ? (
                <ArchiveViewer
                  key={selectedEntry.id}
                  entry={selectedEntry}
                  lang={lang}
                  onBack={() => setSelectedEntry(null)}
                />
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Archive grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {ARCHIVES.map((entry) => (
                      <ArchiveCard
                        key={entry.id}
                        entry={entry}
                        lang={lang}
                        onClick={() => setSelectedEntry(entry)}
                      />
                    ))}
                  </div>

                  {/* Educational context banner */}
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col md:flex-row items-start md:items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-1">
                        {lang === 'id' ? 'Mengapa Arsip Hidup?' : 'Why Living Archives?'}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
                        {lang === 'id'
                          ? 'Generasi muda membutuhkan koneksi emosional dengan sejarah untuk memahami pentingnya menjaga alam dan budaya. Arsip Hidup Nusantara menggunakan teknologi AI visual untuk menjembatani foto hitam-putih masa lalu dengan pengalaman multiindra yang terasa nyata — agar pelajaran ekologi dari leluhur tidak sekadar dibaca, tapi dirasakan.'
                          : 'Young generations need an emotional connection to history to understand the importance of preserving nature and culture. Nusantara Living Archives uses AI visual technology to bridge black-and-white photos of the past with a multi-sensory experience that feels real — so that ancestral ecological lessons are not just read, but felt.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
