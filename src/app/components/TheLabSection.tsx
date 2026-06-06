import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, Upload, Headphones, Glasses, Cpu, Zap, Image, Mic, ChevronRight, X, Sparkles, AlertCircle, Volume2, VolumeX, Music, Play } from 'lucide-react';
import * as THREE from 'three';
import { useAudio } from '../audio/AudioContext';

interface Props { lang: 'id' | 'en' }

interface Message { role: 'user' | 'bot'; text: string; id: number }

const BOT_FOREST = 'https://images.unsplash.com/photo-1668086381578-241354528f87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80';

const mockAnswers: Record<string, { id: string; en: string }> = {
  baduy: {
    id: 'Suku Baduy di Banten memegang teguh pikukuh adat untuk hidup harmonis dengan alam, menolak listrik, semen, bahan kimia, dan kendaraan bermotor.',
    en: 'The Baduy Tribe in Banten strictly upholds customary rules to live in harmony with nature, rejecting electricity, cement, chemicals, and motor vehicles.',
  },
  toraja: {
    id: 'Masyarakat Toraja terkenal dengan upacara Rambu Solo (pemakaman sakral) dan arsitektur Tongkonan yang dihiasi ukiran sarat makna filosofis gotong royong.',
    en: 'The Toraja people are famous for their Rambu Solo (sacred funeral) ceremonies and Tongkonan architectures adorned with carvings full of communal solidarity values.',
  },
  dayak: {
    id: 'Suku Dayak Kenyah di Kalimantan menerapkan hukum adat Tana\' Ulen untuk menetapkan kawasan hutan lindung tradisional bebas dari eksploitasi.',
    en: 'The Dayak Kenyah Tribe in Borneo applies Tana\' Ulen customary law to declare traditional protected forest zones free from exploitation.',
  },
  minang: {
    id: 'Masyarakat Minangkabau menganut sistem kekerabatan matrilineal terbesar di dunia, memegang prinsip hidup belajar dari alam: "Alam takambang jadi guru".',
    en: 'The Minangkabau people follow the largest matrilineal kinship system in the world, holding the life principle of learning from nature: "Alam takambang jadi guru".',
  },
  bali: {
    id: 'Subak di Bali adalah sistem irigasi demokratis berbasis filosofi Tri Hita Karana, menyelaraskan hubungan manusia dengan Tuhan, sesama, dan alam sekitar.',
    en: 'Subak in Bali is a democratic irrigation system based on the Tri Hita Karana philosophy, harmonizing relationships with God, people, and nature.',
  },
  asmat: {
    id: 'Suku Asmat di Papua merupakan penjaga rawa bakau tropis, terkenal dengan seni ukir kayu sakral yang didedikasikan untuk menghormati arwah leluhur.',
    en: 'The Asmat Tribe in Papua guards tropical mangrove swamps, globally renowned for sacred wood carving art dedicated to honoring ancestor spirits.',
  },
  naga: {
    id: 'Kampung Naga di Tasikmalaya melestarikan adat Sunda kuno, melarang listrik di kawasan adat, dan melindungi hutan larangan di sepanjang sungai Ciwulan.',
    en: 'Kampung Naga in Tasikmalaya preserves ancient Sundanese customs, prohibiting electricity in customary zones and protecting forbidden forests along the Ciwulan river.',
  },
  sasak: {
    id: 'Suku Sasak Sade di Lombok melestarikan arsitektur rumah berbahan tanah liat & kotoran kerbau, serta kerajinan tenun songket khas Sade.',
    en: 'The Sasak Sade Tribe in Lombok preserves house architectures built from clay & buffalo dung, as well as the unique Sade songket weaving craft.',
  },
  kajang: {
    id: 'Suku Kajang Ammatoa di Bulukumba berpakaian hitam sebagai simbol kesederhanaan (Kamase-masea), melarang alas kaki di hutan adat Karamaka.',
    en: 'The Kajang Ammatoa Tribe in Bulukumba wears black as a symbol of simplicity (Kamase-masea), prohibiting footwear in the Karamaka sacred forest.',
  },
  mentawai: {
    id: 'Suku Mentawai memegang kepercayaan Arat Sabulungan, melakukan ritual meminta izin roh alam dipimpin Sikerei sebelum menebang pohon.',
    en: 'The Mentawai Tribe holds Arat Sabulungan beliefs, performing rituals led by Sikerei to ask nature spirits\' permission before cutting trees.',
  },
  waerebo: {
    id: 'Wae Rebo di Flores melestarikan 7 rumah kerucut Mbaru Niang, merawat hutan pegunungan sekeliling desa, dan menerapkan musyawarah "Lonto Leok".',
    en: 'Wae Rebo in Flores preserves 7 conical Mbaru Niang houses, cares for the surrounding mountain forests, and applies "Lonto Leok" consensus style.',
  },
  sumba: {
    id: 'Kampung Tarung Sumba melestarikan kepercayaan Marapu, rumah adat beratap menara jerami tinggi, dan teknik tenun ikat pewarna tanaman organik.',
    en: 'Sumba Tarung Village preserves Marapu beliefs, customary thatched tower houses, and ikat weaving colored with organic plant dyes.',
  },
  dani: {
    id: 'Suku Dani di Lembah Baliem Papua mengolah kebun ubi jalar secara berkelanjutan dengan parit irigasi kuno di lereng curam untuk mencegah longsor.',
    en: 'The Dani Tribe in Papua\'s Baliem Valley cultivates sweet potato gardens sustainably with ancient irrigation ditches on steep slopes to prevent landslides.',
  },
  listrik: {
    id: 'Terranesia memetakan ragam komunitas adat Nusantara yang menjaga keseimbangan alam, spiritualitas, dan teknologi secara bijak sesuai nilai lokal masing-masing.',
    en: 'Terranesia maps diverse Nusantara indigenous communities that balance nature, spirituality, and technology through their own local values.',
  },
  hutan: {
    id: 'Banyak komunitas Nusantara menjaga hutan melalui zona adat, hutan larangan, atau aturan konservasi lokal sebagai sumber kehidupan yang harus dilindungi.',
    en: 'Many Nusantara communities protect forests through customary zones, sacred forests, or local conservation rules as life sources that must be preserved.',
  },
  default: {
    id: 'Pertanyaan menarik! Komunitas adat Nusantara memiliki filosofi hidup yang sangat dalam. Prinsip utama mereka adalah "Rawatan hidup" — menjaga keseimbangan antara manusia, alam, dan roh leluhur. Mereka percaya bahwa modernisasi berlebihan akan merusak harmoni ini.',
    en: 'Great question! Nusantara indigenous communities have very deep life philosophies. Their main principle is "Rawatan hidup" — maintaining the balance between humans, nature, and ancestral spirits. They believe that excessive modernization will disrupt this harmony.',
  },
};

const mockDetections = [
  {
    id: 'Terdeteksi: Kain Tenun Songket Sade (Suku Sasak) — Motif serat alami menggunakan pewarna organik kuno.',
    en: 'Detected: Sade Songket Weaving (Sasak Tribe) — Natural fibers using ancient organic dyes.'
  },
  {
    id: 'Terdeteksi: Rumah Adat Mbaru Niang (Wae Rebo Flores) — Struktur kerucut 5 tingkat dengan atap daun lontar.',
    en: 'Detected: Mbaru Niang Customary House (Wae Rebo Flores) — 5-level conical structure with lontar thatch roof.'
  },
  {
    id: 'Terdeteksi: Seni Ukir Bisj (Suku Asmat Papua) — Struktur tiang leluhur sakral dari kayu hutan utuh.',
    en: 'Detected: Bisj Wood Carving (Asmat Tribe Papua) — Sacred ancestor pole structure from solid forest logs.'
  },
  {
    id: 'Terdeteksi: Tenun Ikat Marapu (Sumba) — Pewarna organik akar mengkudu dan nila asli.',
    en: 'Detected: Marapu Ikat Weaving (Sumba) — Organic dye from noni root and natural indigo.'
  },
  {
    id: 'Terdeteksi: Rumah Tongkonan (Toraja) — Arsitektur atap perahu dengan hiasan tanduk kerbau.',
    en: 'Detected: Tongkonan House (Toraja) — Boat-shaped roof architecture decorated with buffalo horns.'
  }
];

const vrCultureOptions = [
  { id: 'baduy', name: 'Suku Baduy', nameEn: 'Baduy Tribe' },
  { id: 'toraja', name: 'Masyarakat Toraja', nameEn: 'Toraja People' },
  { id: 'dayak', name: 'Suku Dayak Kenyah', nameEn: 'Dayak Kenyah Tribe' },
  { id: 'kajang', name: 'Suku Kajang Ammatoa', nameEn: 'Kajang Ammatoa Tribe' },
  { id: 'waerebo', name: 'Masyarakat Wae Rebo', nameEn: 'Wae Rebo Community' },
  { id: 'sasak', name: 'Suku Sasak Sade', nameEn: 'Sasak Sade Tribe' },
  { id: 'dani', name: 'Suku Dani', nameEn: 'Dani Tribe' },
  { id: 'bali', name: 'Subak Ubud Bali', nameEn: 'Subak Ubud Bali' },
];

const vrScenesByCulture: Record<string, {
  id: string;
  name: string;
  nameEn: string;
  desc: string;
  descEn: string;
  color: string;
  icon: string;
  image: string;
}[]> = {
  baduy: [
    { id: 'baduy_hutan', name: 'Hutan Larangan Baduy', nameEn: 'Baduy Sacred Forest', desc: 'Jelajahi hutan adat larangan yang dijaga ketat oleh aturan Pikukuh.', descEn: 'Explore the sacred forbidden forest strictly guarded by Pikukuh custom rules.', color: 'from-green-800 to-green-600', icon: '🌳', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80' },
    { id: 'baduy_kampung', name: 'Kampung Dalam Kanekes', nameEn: 'Kanekes Inner Village', desc: 'Kunjungi pemukiman tradisional rumah panggung kayu tanpa paku.', descEn: 'Visit the traditional wooden stilt house settlement without nails.', color: 'from-amber-800 to-amber-600', icon: '🏡', image: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80' },
  ],
  toraja: [
    { id: 'toraja_ritual', name: 'Upacara Rambu Solo', nameEn: 'Rambu Solo Ceremony', desc: 'Saksikan kemegahan upacara sakral pemakaman leluhur adat Toraja.', descEn: 'Witness the grandeur of the sacred Toraja ancestral funeral ceremony.', color: 'from-purple-800 to-purple-600', icon: '🙏', image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80' },
    { id: 'toraja_kampung', name: 'Kompleks Rumah Tongkonan', nameEn: 'Tongkonan House Complex', desc: 'Jelajahi keindahan arsitektur rumah adat beratap perahu khas Toraja.', descEn: 'Explore the beautiful boat-roofed customary house architecture of Toraja.', color: 'from-amber-800 to-amber-600', icon: '🏡', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80' },
  ],
  dayak: [
    { id: 'dayak_hutan', name: 'Hutan Lindung Tana Ulen', nameEn: 'Tana Ulen Protected Forest', desc: 'Jelajahi hutan adat Kalimantan yang dilindungi dengan denda adat ketat.', descEn: 'Explore Borneo customary forest protected by strict customary fines.', color: 'from-green-800 to-green-600', icon: '🌳', image: 'https://images.unsplash.com/photo-1606585808259-420ce50f1917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80' },
  ],
  kajang: [
    { id: 'kajang_hutan', name: 'Hutan Adat Karamaka', nameEn: 'Karamaka Sacred Forest', desc: 'Jelajahi hutan keramat Suku Kajang yang dilarang menggunakan alas kaki.', descEn: 'Explore the sacred forest of Kajang where footwear is prohibited.', color: 'from-green-800 to-green-600', icon: '🌳', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80' },
  ],
  waerebo: [
    { id: 'waerebo_kampung', name: 'Kampung Mbaru Niang', nameEn: 'Mbaru Niang Village', desc: 'Saksikan keindahan 7 rumah adat berbentuk kerucut di atas awan Flores.', descEn: 'Witness the beauty of 7 conical customary houses above the clouds in Flores.', color: 'from-amber-800 to-amber-600', icon: '🏡', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80' },
  ],
  sasak: [
    { id: 'sasak_kampung', name: 'Desa Tradisional Sade', nameEn: 'Sade Traditional Village', desc: 'Kunjungi pemukiman tanah liat organik Suku Sasak Sade di Lombok.', descEn: 'Visit the organic clay settlement of Sasak Sade Tribe in Lombok.', color: 'from-amber-800 to-amber-600', icon: '🏡', image: 'https://images.unsplash.com/photo-1626028986575-f7eb42dfd8ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80' },
  ],
  dani: [
    { id: 'dani_kampung', name: 'Pemukiman Rumah Honai', nameEn: 'Honai House Settlement', desc: 'Jelajahi pekarangan berkelompok rumah bulat Honai tradisional di Papua.', descEn: 'Explore clustered circular Honai customary house yards in Papua.', color: 'from-amber-800 to-amber-600', icon: '🏡', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80' },
  ],
  bali: [
    { id: 'bali_hutan', name: 'Terasering Sawah Ubud', nameEn: 'Ubud Rice Terrace', desc: 'Jelajahi sawah bertingkat Subak yang menyelaraskan alam dan manusia.', descEn: 'Explore Subak terraced fields harmonizing nature and human labor.', color: 'from-green-800 to-green-600', icon: '🌾', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80' },
  ],
};

function getSceneImage(sceneId: string): string {
  for (const cultureKey of Object.keys(vrScenesByCulture)) {
    const scene = vrScenesByCulture[cultureKey].find(s => s.id === sceneId);
    if (scene) return scene.image;
  }
  return 'https://images.unsplash.com/photo-1511497584788-876760111969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80';
}

const t = {
  id: {
    title: 'The Lab',
    sub: 'Teknologi canggih untuk pengalaman belajar yang lebih dalam',
    chatTitle: 'AI Chatbot Budaya',
    chatSub: 'Tanya apa saja tentang budaya Nusantara',
    chatPlaceholder: 'Contoh: Bagaimana adat menjaga hutan?',
    chatSend: 'Kirim',
    vrTitle: 'Virtual Reality Tour',
    vrSub: 'Masuk ke dunia budaya Nusantara tanpa meninggalkan tempat duduk',
    arTitle: 'AR Experience',
    arSub: 'Scan lingkungan sekitar dan temukan prinsip Terranesia di dunia nyata',
    arDesc: 'Arahkan kamera ke lingkungan sekitar Anda. AI akan menganalisis dan memberikan insight tentang cara menerapkan prinsip Terranesia.',
    imgTitle: 'AI Image Recognition',
    imgSub: 'Upload foto untuk identifikasi budaya dan asal daerah',
    imgBtn: 'Upload Foto',
    imgDesc: 'AI akan menganalisis foto Anda dan mengidentifikasi budaya, tradisi, dan asal daerah dari objek atau pakaian yang terdeteksi.',
    enter: 'Masuk ke VR',
    active: 'Aktifkan AR',
    analyzing: 'Menganalisis...',
    detected: 'Terdeteksi: Kain Tenun Nusantara — Motif Poleng, simbol keseimbangan alam',
    arHint: '💡 Klik tombol di bawah untuk mengaktifkan webcam asli kamu untuk simulasi pemindaian AR.',
    arStop: 'Matikan AR',
    arCamError: '⚠️ Kamera tidak dapat diakses (Akses ditolak atau perangkat tidak ada). Berjalan dalam mode simulasi.'
  },
  en: {
    title: 'The Lab',
    sub: 'Advanced technology for a deeper learning experience',
    chatTitle: 'Cultural AI Chatbot',
    chatSub: 'Ask anything about Nusantara culture',
    chatPlaceholder: 'Example: How do customs protect forests?',
    chatSend: 'Send',
    vrTitle: 'Virtual Reality Tour',
    vrSub: 'Enter the world of Nusantara culture without leaving your seat',
    arTitle: 'AR Experience',
    arSub: 'Scan your surroundings and discover Terranesia principles in the real world',
    arDesc: 'Point your camera at your surroundings. AI will analyze and provide insights on how to apply Terranesia principles.',
    imgTitle: 'AI Image Recognition',
    imgSub: 'Upload a photo to identify culture and region of origin',
    imgBtn: 'Upload Photo',
    imgDesc: 'AI will analyze your photo and identify culture, traditions, and regional origins from detected objects or clothing.',
    enter: 'Enter VR',
    active: 'Activate AR',
    analyzing: 'Analyzing...',
    detected: 'Detected: Nusantara Woven Fabric — Poleng motif, symbol of natural balance',
    arHint: '💡 Click the button below to turn on your actual webcam for the AR scanning simulation.',
    arStop: 'Deactivate AR',
    arCamError: '⚠️ Camera cannot be accessed (Access denied or device missing). Running in simulated mode.'
  },
};

let msgId = 0;

const soundParams: Record<string, { windIntensity: number; cricketIntensity: number }> = {
  baduy_hutan: { windIntensity: 0.6, cricketIntensity: 1.0 },
  dayak_hutan: { windIntensity: 0.7, cricketIntensity: 1.0 },
  kajang_hutan: { windIntensity: 0.5, cricketIntensity: 1.2 },
  bali_hutan: { windIntensity: 0.4, cricketIntensity: 0.8 },
  baduy_kampung: { windIntensity: 0.4, cricketIntensity: 0.4 },
  toraja_kampung: { windIntensity: 0.5, cricketIntensity: 0.3 },
  waerebo_kampung: { windIntensity: 0.8, cricketIntensity: 0.2 },
  sasak_kampung: { windIntensity: 0.5, cricketIntensity: 0.3 },
  dani_kampung: { windIntensity: 0.6, cricketIntensity: 0.3 },
  toraja_ritual: { windIntensity: 0.4, cricketIntensity: 0.5 },
};

// Three.js VR 360 Viewer Modal Component
interface VRModalProps {
  sceneId: string;
  onClose: () => void;
  lang: 'id' | 'en';
}

function VRModal({ sceneId, onClose, lang }: VRModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const [soundMuted, setSoundMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Soundscape Synthesis Effect
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const audioCtx = new AudioContextClass();
    audioCtxRef.current = audioCtx;

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(soundMuted ? 0 : 0.25, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
    masterGainRef.current = masterGain;

    const params = soundParams[sceneId] || { windIntensity: 0.5, cricketIntensity: 0.5 };

    // --- WIND SYNTHESIS ---
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const outputData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      outputData[i] = Math.random() * 2 - 1;
    }

    const whiteNoiseSource = audioCtx.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;
    whiteNoiseSource.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, audioCtx.currentTime);
    filter.Q.setValueAtTime(2.5, audioCtx.currentTime);

    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, audioCtx.currentTime);

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(120 * params.windIntensity, audioCtx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const windGain = audioCtx.createGain();
    windGain.gain.setValueAtTime(0.03 * params.windIntensity, audioCtx.currentTime);

    whiteNoiseSource.connect(filter);
    filter.connect(windGain);
    windGain.connect(masterGain);

    whiteNoiseSource.start();
    lfo.start();

    // --- CRICKETS SYNTHESIS ---
    let cricketInterval: any = null;
    if (params.cricketIntensity > 0) {
      const playCricketChirp = () => {
        if (audioCtx.state === 'closed') return;
        
        const now = audioCtx.currentTime;
        const baseFreq = 3700 + Math.random() * 300;
        
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, now);

        const bandpass = audioCtx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(baseFreq, now);
        bandpass.Q.setValueAtTime(15, now);

        const cGain = audioCtx.createGain();
        cGain.gain.setValueAtTime(0, now);

        const pulseDuration = 0.03;
        const pulseInterval = 0.05;
        const numPulses = 3 + Math.floor(Math.random() * 3);
        const maxGain = 0.04 * params.cricketIntensity;

        for (let i = 0; i < numPulses; i++) {
          const pStart = now + i * pulseInterval;
          cGain.gain.setValueAtTime(0, pStart);
          cGain.gain.linearRampToValueAtTime(maxGain, pStart + 0.005);
          cGain.gain.linearRampToValueAtTime(maxGain, pStart + pulseDuration - 0.005);
          cGain.gain.linearRampToValueAtTime(0, pStart + pulseDuration);
        }

        osc.connect(bandpass);
        bandpass.connect(cGain);
        cGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + numPulses * pulseInterval + 0.1);
      };

      playCricketChirp();

      cricketInterval = setInterval(() => {
        playCricketChirp();
      }, 1800 + Math.random() * 1500);
    }

    const resumeContext = () => {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    };
    window.addEventListener('click', resumeContext);
    window.addEventListener('keydown', resumeContext);

    return () => {
      if (cricketInterval) clearInterval(cricketInterval);
      window.removeEventListener('click', resumeContext);
      window.removeEventListener('keydown', resumeContext);
      
      try {
        whiteNoiseSource.stop();
        lfo.stop();
      } catch (e) {}
      
      try {
        audioCtx.close();
      } catch (e) {}
    };
  }, [sceneId]);

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const targetGain = soundMuted ? 0 : 0.25;
      masterGainRef.current.gain.setTargetAtTime(targetGain, audioCtxRef.current.currentTime, 0.1);
    }
  }, [soundMuted]);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Setup Scene
    const scene = new THREE.Scene();

    // 2. Setup Camera
    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    camera.position.set(0, 0, 0);

    // 3. Setup Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Create Sphere Geometry
    const geometry = new THREE.SphereGeometry(500, 60, 40);

    // 5. Load Texture
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    
    const texture = loader.load(
      getSceneImage(sceneId),
      () => {
        setIsLoading(false);
      },
      undefined,
      (err: any) => {
        console.error("Three.js VR texture load error:", err);
        setHasError(true);
        setIsLoading(false);
      }
    );
    
    // Render the inside of the sphere safely using DoubleSide
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Variables for drag controls
    let isUserInteracting = false;
    let onPointerDownPointerX = 0;
    let onPointerDownPointerY = 0;
    let onPointerDownLon = 0;
    let onPointerDownLat = 0;
    let lon = 0;
    let lat = 0;
    let phi = 0;
    let theta = 0;

    const onPointerDown = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      isUserInteracting = true;
      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      if (isUserInteracting === true) {
        lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
        lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      isUserInteracting = false;
    };

    const container = containerRef.current;
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isUserInteracting === false) {
        lon += 0.05; // Auto rotate slowly
      }

      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      const x = 500 * Math.sin(phi) * Math.cos(theta);
      const y = 500 * Math.cos(phi);
      const z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(x, y, z);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('pointerdown', onPointerDown);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerup', onPointerUp);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [sceneId, retryKey]);

  return (
    <div className="fixed inset-0 z-[2000] bg-black flex flex-col justify-between">
      {/* Top Bar Overlay */}
      <div className="absolute top-0 left-0 right-0 p-5 bg-gradient-to-b from-black/80 to-transparent z-[2001] flex items-center justify-between">
        <div>
          <h4 className="text-white text-base font-bold flex items-center gap-2">
            <Headphones className="w-5 h-5 text-emerald-400" />
            360° Virtual Reality Experience
          </h4>
          <p className="text-white/60 text-xs mt-0.5">
            {lang === 'id' 
              ? 'Tarik/Drag mouse untuk melihat sekeliling 360 derajat. Nikmati visualisasi imersif.' 
              : 'Drag mouse to look around in 360 degrees. Enjoy the immersive visualization.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSoundMuted(!soundMuted)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              soundMuted 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30' 
                : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
            }`}
            title={soundMuted ? (lang === 'id' ? 'Aktifkan Suara' : 'Unmute Sound') : (lang === 'id' ? 'Matikan Suara' : 'Mute Sound')}
          >
            {soundMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
          
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* 3D Canvas wrapper */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[2002] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin mb-4" />
          <p className="text-white text-sm font-bold tracking-wide animate-pulse">
            {lang === 'id' ? 'Memuat Pengalaman 360°...' : 'Loading 360° Experience...'}
          </p>
          <p className="text-white/50 text-[11px] mt-2 max-w-xs leading-normal">
            {lang === 'id' 
              ? 'Menyiapkan panorama resolusi tinggi untuk suku pilihan Anda.' 
              : 'Preparing high-resolution panorama for your selected tribe.'}
          </p>
        </div>
      )}

      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 z-[2002] bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h5 className="text-white text-base font-bold">
            {lang === 'id' ? 'Gagal Memuat Panorama' : 'Failed to Load Panorama'}
          </h5>
          <p className="text-white/60 text-xs mt-2 max-w-md leading-relaxed">
            {lang === 'id' 
              ? 'Visualisasi gagal diunduh. Hal ini dapat disebabkan oleh masalah jaringan atau pembatasan CORS eksternal.'
              : 'The visualization failed to download. This can be caused by network issues or external CORS restrictions.'}
          </p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
                setRetryKey(prev => prev + 1);
              }}
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-primary/20"
            >
              {lang === 'id' ? 'Coba Lagi' : 'Retry'}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer border border-white/10"
            >
              {lang === 'id' ? 'Tutup' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[2001] bg-black/60 backdrop-blur border border-white/10 px-4 py-2 rounded-xl text-white/80 text-[10px] uppercase tracking-widest font-bold font-mono">
        🖱️ Drag mouse to look around
      </div>
    </div>
  );
}

const gamelanNotes = [
  { note: 'C4', key: '1', name: 'Ji' },
  { note: 'D4', key: '2', name: 'Ro' },
  { note: 'E4', key: '3', name: 'Lu' },
  { note: 'G4', key: '5', name: 'Ma' },
  { note: 'A4', key: '6', name: 'Nem' },
  { note: 'C5', key: 'i', name: 'Ji (H)' },
  { note: 'D5', key: 'ii', name: 'Ro (H)' },
  { note: 'E5', key: 'iii', name: 'Lu (H)' }
];

const angklungNotes = [
  { note: 'C4', name: 'Do' },
  { note: 'D4', name: 'Re' },
  { note: 'E4', name: 'Mi' },
  { note: 'F4', name: 'Fa' },
  { note: 'G4', name: 'Sol' },
  { note: 'A4', name: 'La' },
  { note: 'B4', name: 'Si' },
  { note: 'C5', name: 'Do (H)' }
];

const sulingNotes = [
  { note: 'C4', name: 'L' },
  { note: 'D4', name: 'ML' },
  { note: 'E4', name: 'M' },
  { note: 'G4', name: 'MH' },
  { note: 'A4', name: 'H' },
  { note: 'C5', name: 'H2' },
  { note: 'D5', name: 'P' }
];

export function TheLabSection({ lang }: Props) {
  const { playSynthNote } = useAudio();
  const [activeInstTab, setActiveInstTab] = useState<'gamelan' | 'angklung' | 'suling'>('gamelan');
  const [shakingKey, setShakingKey] = useState<string | null>(null);
  const [activeFluteHole, setActiveFluteHole] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: lang === 'id' ? 'Halo! Saya AI Asisten Budaya Terranesia. Silakan tanyakan apa saja tentang kearifan lokal Nusantara.' : 'Hello! I\'m the Terranesia Cultural AI Assistant. Feel free to ask anything about Nusantara local wisdom.', id: ++msgId },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeVr, setActiveVr] = useState<string | null>(null);
  const [imgState, setImgState] = useState<'idle' | 'analyzing' | 'done'>('idle');
  const [detectionResult, setDetectionResult] = useState<{ id: string; en: string } | null>(null);
  const [selectedVrCulture, setSelectedVrCulture] = useState<string>('baduy');
  
  // AR states and refs
  const [arActive, setArActive] = useState(false);
  const [arCamError, setArCamError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const tx = t[lang];

  // Voice Chat States
  const [isListening, setIsListening] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognitionAPI = typeof window !== 'undefined' ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
    if (SpeechRecognitionAPI) {
      const rec = new SpeechRecognitionAPI();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === 'id' ? 'id-ID' : 'en-US';
      
      rec.onstart = () => {
        setIsListening(true);
      };
      
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      
      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
      
      rec.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = rec;
    }
  }, [lang]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(lang === 'id' ? 'Speech recognition tidak didukung di browser ini.' : 'Speech recognition not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Request/Stop webcam feed dynamically for AR Experience
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    if (arActive) {
      setArCamError(false);
      const constraints = { 
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .then(mediaStream => {
          activeStream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play().catch(e => {
              console.warn("Video playback was interrupted or not allowed:", e);
            });
          }
        })
        .catch(err => {
          console.error("Camera stream access failed:", err);
          setArCamError(true);
        });
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => {
          try {
            track.stop();
          } catch (e) {
            console.error("Error stopping video track:", e);
          }
        });
      }
    };
  }, [arActive]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg, id: ++msgId }]);
    setIsTyping(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setTimeout(() => {
      const lowerMsg = userMsg.toLowerCase();
      let answer: string;
      
      if (lowerMsg.includes('baduy') || lowerMsg.includes('kanekes')) {
        answer = mockAnswers.baduy[lang];
      } else if (lowerMsg.includes('toraja') || lowerMsg.includes('rambu') || lowerMsg.includes('solo')) {
        answer = mockAnswers.toraja[lang];
      } else if (lowerMsg.includes('dayak') || lowerMsg.includes('kenyah') || lowerMsg.includes('ulen')) {
        answer = mockAnswers.dayak[lang];
      } else if (lowerMsg.includes('minang') || lowerMsg.includes('matrilineal') || lowerMsg.includes('gadang')) {
        answer = mockAnswers.minang[lang];
      } else if (lowerMsg.includes('bali') || lowerMsg.includes('subak') || lowerMsg.includes('ubud')) {
        answer = mockAnswers.bali[lang];
      } else if (lowerMsg.includes('asmat') || lowerMsg.includes('jew') || lowerMsg.includes('bisj')) {
        answer = mockAnswers.asmat[lang];
      } else if (lowerMsg.includes('naga')) {
        answer = mockAnswers.naga[lang];
      } else if (lowerMsg.includes('sasak') || lowerMsg.includes('sade') || lowerMsg.includes('songket')) {
        answer = mockAnswers.sasak[lang];
      } else if (lowerMsg.includes('kajang') || lowerMsg.includes('ammatoa') || lowerMsg.includes('bulukumba')) {
        answer = mockAnswers.kajang[lang];
      } else if (lowerMsg.includes('mentawai') || lowerMsg.includes('sibulungan') || lowerMsg.includes('sikerei')) {
        answer = mockAnswers.mentawai[lang];
      } else if (lowerMsg.includes('wae rebo') || lowerMsg.includes('waerebo') || lowerMsg.includes('niang')) {
        answer = mockAnswers.waerebo[lang];
      } else if (lowerMsg.includes('sumba') || lowerMsg.includes('marapu') || lowerMsg.includes('pasola')) {
        answer = mockAnswers.sumba[lang];
      } else if (lowerMsg.includes('dani') || lowerMsg.includes('honai') || lowerMsg.includes('baliem')) {
        answer = mockAnswers.dani[lang];
      } else if (lowerMsg.includes('listrik') || lowerMsg.includes('electricity') || lowerMsg.includes('teknologi') || lowerMsg.includes('technology')) {
        answer = mockAnswers.listrik[lang];
      } else if (lowerMsg.includes('hutan') || lowerMsg.includes('forest') || lowerMsg.includes('alam') || lowerMsg.includes('nature')) {
        answer = mockAnswers.hutan[lang];
      } else {
        answer = mockAnswers.default[lang];
      }
      
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: answer, id: ++msgId }]);

      if (voiceOutputEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(answer);
        utterance.lang = lang === 'id' ? 'id-ID' : 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    }, 1500);
  };

  const handleImgUpload = () => {
    setImgState('analyzing');
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * mockDetections.length);
      setDetectionResult(mockDetections[randomIdx]);
      setImgState('done');
    }, 2500);
  };

  return (
    <section id="lab" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs uppercase tracking-widest mb-4 font-bold">
            <Cpu className="w-3.5 h-3.5" />
            {lang === 'id' ? 'Teknologi Budaya' : 'Cultural Tech'}
          </div>
          <h2 className="text-foreground text-3xl font-extrabold tracking-tight mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{tx.title}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">{tx.sub}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* AI Chatbot */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border-[0.5px] border-border/40 rounded-3xl overflow-hidden shadow-sm flex flex-col"
            style={{ height: 520 }}
          >
            {/* Chat header */}
            <div className="flex items-center gap-3 p-5 border-b border-border bg-primary/5">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <img src={BOT_FOREST} alt="AI" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm">{tx.chatTitle}</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {tx.chatSub}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => {
                    const nextVal = !voiceOutputEnabled;
                    setVoiceOutputEnabled(nextVal);
                    if (!nextVal && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  className={`p-2 rounded-xl transition-all border-[0.5px] cursor-pointer ${
                    voiceOutputEnabled 
                      ? 'bg-primary/20 border-primary/30 text-primary' 
                      : 'bg-muted border-border/60 text-muted-foreground hover:text-foreground'
                  }`}
                  title={voiceOutputEnabled ? (lang === 'id' ? 'Matikan Suara Asisten' : 'Mute Assistant Voice') : (lang === 'id' ? 'Bunyikan Suara Asisten' : 'Unmute Assistant Voice')}
                >
                  {voiceOutputEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <Bot className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-muted text-foreground rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2 mt-1">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder={isListening ? (lang === 'id' ? 'Mendengarkan...' : 'Listening...') : tx.chatPlaceholder}
                  disabled={isListening}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border disabled:opacity-80"
                />
                <button
                  onClick={toggleListening}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border-[0.5px] ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse border-rose-600 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border-border/60'
                  }`}
                  title={isListening ? (lang === 'id' ? 'Selesai Mendengarkan' : 'Stop Listening') : (lang === 'id' ? 'Mulai Mendengarkan' : 'Start Speech Input')}
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isListening}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* VR Tour */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 animate-fade-in"
          >
            <div className="bg-card border-[0.5px] border-border/40 rounded-3xl p-6 shadow-sm flex-1 flex flex-col justify-between min-h-[460px]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Headphones className="w-5 h-5 text-primary" />
                  <h3 className="text-foreground text-base">{tx.vrTitle}</h3>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm mb-4 leading-normal">{tx.vrSub}</p>
                
                {/* Selector for Tribe */}
                <div className="mb-4 bg-muted/30 border border-border/60 p-3.5 rounded-2xl">
                  <label className="text-[11px] font-bold text-muted-foreground mb-1.5 block uppercase tracking-wider">
                    {lang === 'id' ? 'Pilih Suku / Kebudayaan:' : 'Select Tribe / Culture:'}
                  </label>
                  <select
                    value={selectedVrCulture}
                    onChange={(e) => {
                      setSelectedVrCulture(e.target.value);
                      setActiveVr(null); // Reset active VR scene when culture changes
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold cursor-pointer transition-all"
                  >
                    {vrCultureOptions.map(c => (
                      <option key={c.id} value={c.id}>
                        {lang === 'id' ? c.name : c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* List of VR Scenes for selected tribe */}
                <div className="grid gap-3">
                  {vrScenesByCulture[selectedVrCulture]?.map(scene => {
                    const isActive = activeVr === scene.id;
                    return (
                      <motion.div
                        key={scene.id}
                        whileHover={{ scale: 1.01 }}
                        className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all border-[0.5px] ${
                          isActive ? 'border-primary ring-2 ring-primary/10 bg-primary/5' : 'border-border/60 bg-card'
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${scene.color} opacity-[0.03]`} />
                        <div className="relative flex items-center gap-3">
                          <div className="text-2xl">{scene.icon}</div>
                          <div className="flex-1">
                            <div className="font-semibold text-foreground text-sm">{lang === 'id' ? scene.name : scene.nameEn}</div>
                            <div className="text-muted-foreground text-xs mt-0.5">{lang === 'id' ? scene.desc : scene.descEn}</div>
                          </div>
                          <button
                            onClick={() => setActiveVr(isActive ? null : scene.id)}
                            className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground flex items-center justify-center transition-all cursor-pointer border-[0.5px] border-primary/20"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Sub-activation to trigger Fullscreen VR Modal */}
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="relative mt-3 pt-3 border-t border-border/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                                <motion.div
                                  initial={{ width: '0%' }}
                                  animate={{ width: '100%' }}
                                  transition={{ duration: 1.5, ease: 'linear' }}
                                  className="h-full bg-primary rounded-full"
                                />
                              </div>
                              <button 
                                onClick={() => {}} // ActiveVr state keeps it mounted, VRModal is triggered by separate rendering below
                                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold cursor-pointer shadow active:scale-95 transition-transform"
                              >
                                {tx.enter}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AR + Image Recognition */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* AR Experience with actual Camera Feed */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <Glasses className="w-5 h-5 text-sky-500" />
              <h3 className="text-foreground text-base">{tx.arTitle}</h3>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed mb-4">{tx.arDesc}</p>
            <div className="text-[11px] font-medium text-muted-foreground mb-4 bg-muted border border-border/40 p-2.5 rounded-xl">
              {tx.arHint}
            </div>

            <div
              className="relative rounded-2xl overflow-hidden aspect-video flex items-center justify-center group border border-border bg-black"
            >
              {/* Actual Camera Stream background */}
              {arActive && !arCamError && (
                <video 
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
              )}

              {/* Grid scanning effect overlay */}
              <div className="absolute inset-0 opacity-20 z-10 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="absolute border-t border-green-400/30" style={{ top: `${20 * (i + 1)}%`, left: 0, right: 0 }} />
                ))}
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="absolute border-l border-green-400/30" style={{ left: `${20 * (i + 1)}%`, top: 0, bottom: 0 }} />
                ))}
              </div>

              {/* Scanning lines */}
              {arActive && (
                <motion.div
                  className="absolute left-0 right-0 h-px bg-green-400 shadow-[0_0_10px_2px_rgba(74,222,128,0.6)] z-10"
                  animate={{ top: ['10%', '90%', '10%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              )}

              {/* Corner brackets */}
              {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-6 h-6 z-10`}>
                  <div className={`absolute border-green-400 ${i < 2 ? 'top-0 border-t-2' : 'bottom-0 border-b-2'} ${i % 2 === 0 ? 'left-0 border-l-2' : 'right-0 border-r-2'} w-4 h-4`} />
                </div>
              ))}

              {/* Camera Fallback simulated background */}
              {arActive && arCamError && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B14] to-[#1B3A2C] flex items-center justify-center p-6 text-center z-0">
                  <div className="text-[10px] text-rose-400 leading-normal flex flex-col items-center gap-1.5 font-semibold">
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                    <span>{tx.arCamError}</span>
                  </div>
                </div>
              )}

              <div className="relative z-20 text-center bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/10 max-w-[80%]">
                <Glasses className={`w-10 h-10 mx-auto mb-2 ${arActive ? 'text-green-400' : 'text-green-400/50'}`} />
                <div className={`text-xs font-extrabold ${arActive ? 'text-green-400' : 'text-green-400/50'}`}>
                  {arActive ? (lang === 'id' ? '📍 Mendeteksi lingkungan...' : '📍 Detecting environment...') : tx.active}
                </div>
                
                {arActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-3 px-3 py-2 rounded-lg bg-green-400/20 border border-green-400/30 text-green-400 text-[10px] leading-normal font-mono"
                  >
                    💡 {lang === 'id' ? 'Terapkan prinsip Terranesia: Kurangi penggunaan plastik — gunakan bahan alami' : 'Apply Terranesia principle: Reduce plastic use — use natural materials'}
                  </motion.div>
                )}
              </div>
            </div>
            
            <button
              onClick={() => setArActive(!arActive)}
              className={`w-full mt-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer text-center ${
                arActive ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-primary text-primary-foreground hover:opacity-90'
              }`}
            >
              {arActive ? tx.arStop : tx.active}
            </button>
          </motion.div>

          {/* AI Image Recognition */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-card border-[0.5px] border-border/40 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <Image className="w-5 h-5 text-amber-500" />
              <h3 className="text-foreground text-base">{tx.imgTitle}</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-5">{tx.imgDesc}</p>

            <div
              onClick={() => imgState === 'idle' && handleImgUpload()}
              className={`relative rounded-2xl border-2 border-dashed aspect-video flex flex-col items-center justify-center cursor-pointer transition-all ${
                imgState !== 'idle' ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-primary/3'
              }`}
            >
              {imgState === 'idle' && (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <div className="text-sm font-semibold text-foreground">{tx.imgBtn}</div>
                  <div className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP</div>
                </div>
              )}

              {imgState === 'analyzing' && (
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary mx-auto mb-3"
                  />
                  <div className="text-sm text-primary font-semibold">{tx.analyzing}</div>
                  <div className="text-xs text-muted-foreground mt-1">AI Processing...</div>
                </div>
              )}

              {imgState === 'done' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-4"
                >
                  <div className="text-3xl mb-2">✅</div>
                  <div className="text-sm font-semibold text-foreground mb-2">
                    {lang === 'id' ? 'Analisis Selesai!' : 'Analysis Complete!'}
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs leading-relaxed font-semibold">
                    {detectionResult ? (lang === 'id' ? detectionResult.id : detectionResult.en) : tx.detected}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setImgState('idle'); setDetectionResult(null); }}
                    className="mt-3 text-xs text-muted-foreground hover:text-primary transition-colors underline cursor-pointer"
                  >
                    {lang === 'id' ? 'Upload foto lain' : 'Upload another'}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Nusantara Synth Pad (Virtual Playroom) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-card border-[0.5px] border-border/40 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden"
        >
          {/* Decorative glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Title and Intro */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-5 mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Music className="w-5 h-5 text-primary animate-pulse" />
                <h3 className="text-foreground text-lg font-bold leading-tight">
                  {lang === 'id' ? 'Nusantara Synth Pad (Alat Musik Virtual)' : 'Nusantara Synth Pad (Virtual Instruments)'}
                </h3>
              </div>
              <p className="text-muted-foreground text-xs md:text-sm">
                {lang === 'id' 
                  ? 'Mainkan alat musik tradisional Indonesia secara interaktif. Klik atau layangkan kursor untuk memicu osilator sintesis.' 
                  : 'Play traditional Indonesian instruments interactively. Click or hover to trigger synthesized oscillators.'}
              </p>
            </div>

            {/* Tab controls */}
            <div className="flex bg-muted/40 border-[0.5px] border-border/50 p-1 rounded-xl shrink-0 self-start md:self-auto">
              {[
                { key: 'gamelan', label: 'Gamelan' },
                { key: 'angklung', label: 'Angklung' },
                { key: 'suling', label: 'Suling' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveInstTab(tab.key as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeInstTab === tab.key
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Instrument Play Panel */}
          <div className="py-4 flex justify-center items-center min-h-[200px]">
            {activeInstTab === 'gamelan' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-end justify-center gap-2 md:gap-3 w-full max-w-2xl bg-amber-950/10 border border-amber-900/10 p-6 rounded-3xl"
              >
                {/* Gamelan Saron framework styling */}
                {gamelanNotes.map((g, idx) => {
                  const keyHeight = 120 + idx * 8; // Keys get larger for lower frequencies
                  return (
                    <motion.button
                      key={g.note}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ y: 8, scale: 0.98 }}
                      onClick={() => playSynthNote('gamelan', g.note)}
                      style={{ height: `${keyHeight}px` }}
                      className="flex-1 rounded-lg border-2 border-amber-900/30 bg-gradient-to-b from-yellow-100 to-yellow-600 dark:from-yellow-600/40 dark:to-yellow-800/90 text-amber-950 dark:text-yellow-100 font-extrabold text-xs shadow-md flex flex-col justify-between items-center py-4 cursor-pointer relative group overflow-hidden"
                    >
                      {/* Metal bar reflex glow */}
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {/* Key notes */}
                      <span className="text-[10px] opacity-70 tracking-tighter">{g.note}</span>
                      <span className="text-sm font-bold">{g.name}</span>
                      <span className="w-5 h-5 rounded-full bg-amber-950/20 dark:bg-yellow-100/10 flex items-center justify-center text-[9px]">{idx + 1}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}

            {activeInstTab === 'angklung' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 md:gap-5 w-full max-w-2xl bg-emerald-950/5 border border-emerald-900/10 p-6 rounded-3xl overflow-x-auto"
              >
                {angklungNotes.map((a) => {
                  const isShaking = shakingKey === a.note;
                  return (
                    <motion.div
                      key={a.note}
                      animate={isShaking ? { rotate: [0, -6, 6, -6, 6, 0], x: [0, -3, 3, -3, 3, 0] } : {}}
                      transition={{ duration: 0.25 }}
                      onClick={() => {
                        playSynthNote('angklung', a.note);
                        setShakingKey(a.note);
                        setTimeout(() => setShakingKey(null), 250);
                      }}
                      className="w-12 h-48 bg-gradient-to-b from-stone-200 to-stone-400 dark:from-stone-700 dark:to-stone-900 border border-stone-400 dark:border-stone-800 rounded-xl flex flex-col justify-between items-center py-4 text-stone-800 dark:text-stone-300 font-bold text-xs cursor-pointer shadow-md select-none relative group"
                    >
                      {/* Angklung bamboo double tubes representation */}
                      <div className="absolute inset-y-0 left-2 w-2 bg-stone-500/20 rounded" />
                      <div className="absolute inset-y-0 right-2 w-3 bg-stone-500/30 rounded" />
                      
                      <span className="text-[9px] font-mono opacity-60 rotate-90 mt-1">{a.note}</span>
                      <span className="text-[10px] uppercase tracking-wider">{a.name}</span>
                      <span className="text-[11px] mb-1 font-mono text-stone-500">🎋</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {activeInstTab === 'suling' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 w-full max-w-xl bg-muted/40 border border-border/80 p-6 rounded-3xl"
              >
                {/* Bamboo pipe wrapper */}
                <div className="relative w-full h-12 bg-gradient-to-r from-amber-800 to-amber-600 dark:from-amber-900 dark:to-amber-700 rounded-full border border-amber-950 shadow-inner flex items-center justify-around px-8">
                  {/* Flute embouchure / mouth hole */}
                  <div className="w-5 h-5 rounded-full bg-black/90 border border-amber-950 flex-shrink-0 absolute left-4 shadow-inner" />

                  {/* Playable finger holes */}
                  {sulingNotes.map((s) => {
                    const isActive = activeFluteHole === s.note;
                    return (
                      <motion.button
                        key={s.note}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => {
                          playSynthNote('suling', s.note);
                          setActiveFluteHole(s.note);
                          setTimeout(() => setActiveFluteHole(null), 350);
                        }}
                        className={`w-6 h-6 rounded-full border transition-all cursor-pointer shadow-inner relative ${
                          isActive
                            ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.7)] scale-90'
                            : 'bg-black/85 border-amber-950 hover:bg-black/60'
                        }`}
                        title={`Play Note ${s.note}`}
                      >
                        {/* Note label tooltip on hover */}
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                          {s.note}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5">
                  <span>💨</span>
                  {lang === 'id' ? 'Klik lubang tiup suling untuk memicu nada tiup bambu.' : 'Click the flute holes to trigger soft wind bamboo notes.'}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Render immersive WebGL 360° VR Modal sphere if active */}
      <AnimatePresence>
        {activeVr && (
          <VRModal 
            sceneId={activeVr} 
            onClose={() => setActiveVr(null)}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </section>
  );
}



