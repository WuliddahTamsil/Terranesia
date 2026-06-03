import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Search, Filter, ArrowLeftRight, BookOpen, Eye, X, 
  ChevronRight, TrendingDown, Sparkles, Compass, AlertCircle, 
  RotateCcw, Sliders, CheckCircle2, Award, Info, Navigation, ShieldAlert, Thermometer, Trees
} from 'lucide-react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet';
import * as L from 'leaflet';
interface Props { 
  lang: 'id' | 'en';
  isDark?: boolean;
}

const VILLAGE_IMG = 'https://images.unsplash.com/photo-1771766995256-1618791109d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80';
const TEXTILE_IMG = 'https://images.unsplash.com/photo-1774679840947-f73b5275393c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80';
const WEAVING_IMG = 'https://images.unsplash.com/photo-1593671186131-d58817e7dee0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80';
const FOREST_IMG = 'https://images.unsplash.com/photo-1606585808259-420ce50f1917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80';
const BALI_IMG = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80';
const PAPUA_IMG = 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80';
const NAGA_IMG = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80';
const SASAK_IMG = 'https://images.unsplash.com/photo-1626028986575-f7eb42dfd8ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80';

interface CulturePoint {
  id: string;
  name: string;
  nameEn: string;
  location: string;
  region: 'jawa' | 'sulawesi' | 'kalimantan' | 'sumatera' | 'bali' | 'papua' | 'nusatenggara';
  regionLabel: string;
  regionLabelEn: string;
  type: 'tradisi' | 'ritual' | 'lingkungan';
  sustainability: number;
  desc: string;
  descEn: string;
  image: string;
  lat: number;
  lng: number;
  radarData: { subject: string; value: number }[];
  envPractice: string;
  envPracticeEn: string;
  wayOfLife: string;
  wayOfLifeEn: string;
  philosophy: string;
  philosophyEn: string;
}

const cultures: CulturePoint[] = [
  {
    id: 'baduy',
    name: 'Suku Baduy',
    nameEn: 'Baduy Tribe',
    location: 'Lebak, Banten',
    region: 'jawa',
    regionLabel: 'Jawa',
    regionLabelEn: 'Java',
    type: 'lingkungan',
    sustainability: 95,
    desc: 'Suku yang hidup harmonis dengan alam, menolak teknologi modern dan listrik untuk menjaga keseimbangan ekosistem hutan leluhur mereka.',
    descEn: 'A tribe living in harmony with nature, rejecting modern technology and electricity to preserve the balance of their ancestral forest ecosystem.',
    image: VILLAGE_IMG,
    lat: -6.6119,
    lng: 106.2625,
    radarData: [
      { subject: 'Lingkungan', value: 98 }, { subject: 'Tradisi', value: 92 }, { subject: 'Sosial', value: 85 },
      { subject: 'Spiritual', value: 97 }, { subject: 'Ekonomi', value: 65 },
    ],
    envPractice: 'Pikukuh adat melarang penggunaan bahan kimia, semen, kendaraan, dan sabun komersial untuk menjaga kemurnian tanah dan air sungai.',
    envPracticeEn: 'Customary law prohibits chemical use, cement, vehicles, and commercial soap to preserve the purity of soil and river water.',
    wayOfLife: 'Tinggal di rumah panggung kayu/bambu tanpa paku, bertani padi huma secara tradisional, dan bepergian dengan berjalan kaki tanpa alas kaki.',
    wayOfLifeEn: 'Living in wooden/bamboo stilt houses without nails, farming dry-field rice traditionally, and traveling on foot barefoot.',
    philosophy: '"Lojor teu meunang dipotong, pondok teu meunang disambung" (Panjang tidak boleh dipotong, pendek tidak boleh disambung) — menerima apa adanya pemberian alam.',
    philosophyEn: '"Lojor teu meunang dipotong, pondok teu meunang disambung" (Long must not be cut, short must not be joined) — accepting nature\'s gifts as they are.',
  },
  {
    id: 'toraja',
    name: 'Masyarakat Toraja',
    nameEn: 'Toraja People',
    location: 'Tana Toraja, Sulawesi Selatan',
    region: 'sulawesi',
    regionLabel: 'Sulawesi',
    regionLabelEn: 'Sulawesi',
    type: 'ritual',
    sustainability: 80,
    desc: 'Budaya upacara kematian Rambu Solo yang sangat megah dan sakral, menghubungkan dunia manusia dengan leluhur (Puya) melalui pengorbanan suci.',
    descEn: 'The grand and sacred funeral ceremony of Rambu Solo, connecting the human world with ancestors (Puya) through sacred sacrifices.',
    image: TEXTILE_IMG,
    lat: -2.9896,
    lng: 119.8972,
    radarData: [
      { subject: 'Lingkungan', value: 70 }, { subject: 'Tradisi', value: 95 }, { subject: 'Sosial', value: 90 },
      { subject: 'Spiritual', value: 98 }, { subject: 'Ekonomi', value: 75 },
    ],
    envPractice: 'Pelestarian pohon bambu adat untuk kebutuhan upacara adat dan pengelolaan tata ruang bukit melalui zonasi kompleks rumah Tongkonan.',
    envPracticeEn: 'Conservation of customary bamboo trees for ritual needs and hillside land management through the zoning of Tongkonan house complexes.',
    wayOfLife: 'Sistem kemasyarakatan berbasis strata sosial adat yang kuat, pertanian padi terasering pegunungan, dan ukiran kayu bermakna filosofis tinggi.',
    wayOfLifeEn: 'Strong custom-based social stratification, mountainous terraced rice farming, and wood carvings loaded with philosophical meanings.',
    philosophy: '"Misa\' kada dipotuo, pantan kada dipomate" (Bersatu kita hidup, bercerai kita mati) — menekankan solidaritas komunal luar biasa.',
    philosophyEn: '"Misa\' kada dipotuo, pantan kada dipomate" (United we live, divided we die) — emphasizing extraordinary communal solidarity.',
  },
  {
    id: 'dayak',
    name: 'Suku Dayak Kenyah',
    nameEn: 'Dayak Kenyah Tribe',
    location: 'Apo Kayan, Kalimantan Utara',
    region: 'kalimantan',
    regionLabel: 'Kalimantan',
    regionLabelEn: 'Borneo',
    type: 'tradisi',
    sustainability: 92,
    desc: 'Penjaga paru-paru dunia di hutan Kalimantan yang menerapkan sistem hukum adat Tana\' Ulen untuk menjaga kawasan hutan lindung tradisional.',
    descEn: 'Guardians of the lungs of the world in Borneo forests, implementing the Tana\' Ulen customary law to preserve traditional protected forest zones.',
    image: FOREST_IMG,
    lat: 1.6212,
    lng: 114.9315,
    radarData: [
      { subject: 'Lingkungan', value: 95 }, { subject: 'Tradisi', value: 88 }, { subject: 'Sosial', value: 78 },
      { subject: 'Spiritual', value: 85 }, { subject: 'Ekonomi', value: 60 },
    ],
    envPractice: 'Sistem Tana\' Ulen yang menetapkan hutan larangan komunal di mana penebangan pohon dan perburuan diatur ketat dengan denda adat berat.',
    envPracticeEn: 'The Tana\' Ulen system designating communal forbidden forests where logging and hunting are strictly regulated under heavy customary fines.',
    wayOfLife: 'Hidup guyub di dalam Rumah Betang (Rumah Panjang), bertani padi gunung, menyumpit, dan menggunakan sungai sebagai nadi transportasi utama.',
    wayOfLifeEn: 'Living communally in a Rumah Betang (Longhouse), upland rice farming, blowpipe hunting, and using rivers as primary transport arteries.',
    philosophy: '"Belom Bahadat" (Hidup Beradat) — tuntunan hidup untuk menghormati alam, sesama manusia, makhluk gaib, dan Sang Pencipta.',
    philosophyEn: '"Belom Bahadat" (Living with Custom) — guidance for respecting nature, fellow humans, spirits, and the Creator.',
  },
  {
    id: 'minang',
    name: 'Minangkabau',
    nameEn: 'Minangkabau People',
    location: 'Padang, Sumatera Barat',
    region: 'sumatera',
    regionLabel: 'Sumatera',
    regionLabelEn: 'Sumatra',
    type: 'tradisi',
    sustainability: 78,
    desc: 'Masyarakat penganut sistem kekerabatan matrilineal terbesar di dunia, memadukan hukum adat yang demokratis dengan nilai spiritual Islam.',
    descEn: 'The largest matrilineal society in the world, harmoniously integrating democratic customary law with Islamic spiritual values.',
    image: WEAVING_IMG,
    lat: -0.9471,
    lng: 100.4172,
    radarData: [
      { subject: 'Lingkungan', value: 75 }, { subject: 'Tradisi', value: 95 }, { subject: 'Sosial', value: 92 },
      { subject: 'Spiritual', value: 80 }, { subject: 'Ekonomi', value: 85 },
    ],
    envPractice: 'Konsep kepemilikan komunal "Tanah Ulayat" yang mencegah penjualan tanah waris ke pihak luar untuk menjamin keberlanjutan pertanian keluarga.',
    envPracticeEn: 'The communal ownership concept of "Tanah Ulayat" preventing sale of inherited land to outsiders to guarantee agricultural sustainability.',
    wayOfLife: 'Musyawarah mufakat di Balai Adat / Rumah Gadang, kewajiban pemuda untuk merantau mencari ilmu/pengalaman, serta kerajinan tenun Songket.',
    wayOfLifeEn: 'Consensus decision making in Balai Adat / Rumah Gadang, custom of young men migration (merantau), and traditional Songket weaving.',
    philosophy: '"Alam takambang jadi guru" (Alam yang terbentang dijadikan sebagai guru) — belajar kearifan hidup dari hukum dan keindahan alam.',
    philosophyEn: '"Alam takambang jadi guru" (The wide open nature is our teacher) — learning life wisdom from natural laws and beauty.',
  },
  {
    id: 'bali',
    name: 'Subak Ubud Bali',
    nameEn: 'Subak Ubud Bali',
    location: 'Ubud, Gianyar, Bali',
    region: 'bali',
    regionLabel: 'Bali',
    regionLabelEn: 'Bali',
    type: 'lingkungan',
    sustainability: 90,
    desc: 'Sistem tata kelola air dan pertanian padi tradisional Bali yang menggabungkan kemitraan tani, teknologi hidrolik sederhana, dan ritual keagamaan pura.',
    descEn: 'Traditional Balinese water management and rice farming system combining agricultural cooperation, simple hydraulics, and temple rituals.',
    image: BALI_IMG,
    lat: -8.5069,
    lng: 115.2625,
    radarData: [
      { subject: 'Lingkungan', value: 92 }, { subject: 'Tradisi', value: 96 }, { subject: 'Sosial', value: 94 },
      { subject: 'Spiritual', value: 95 }, { subject: 'Ekonomi', value: 70 },
    ],
    envPractice: 'Pembagian air irigasi yang adil secara berkala demi mencegah perebutan sumber daya, dikontrol secara spiritual melalui Pura Subak.',
    envPracticeEn: 'Fair and periodic distribution of irrigation water to prevent resource conflicts, spiritually managed through Subak Temples.',
    wayOfLife: 'Gotong royong membangun terasering sawah, pelaksanaan upacara sesaji di sawah pada setiap siklus pertumbuhan padi, dan seni musik gamelan tani.',
    wayOfLifeEn: 'Cooperative construction of rice terraces, offering rituals in fields during growth cycles, and agricultural gamelan music.',
    philosophy: '"Tri Hita Karana" (Tiga Hubungan Penyebab Keharmonisan) — keharmonisan hubungan manusia dengan Tuhan, sesama manusia, dan alam sekitar.',
    philosophyEn: '"Tri Hita Karana" (Three Causes of Harmony) — harmonious relationships of humans with God, fellow humans, and nature.',
  },
  {
    id: 'asmat',
    name: 'Suku Asmat',
    nameEn: 'Asmat Tribe',
    location: 'Agats, Papua Selatan',
    region: 'papua',
    regionLabel: 'Papua',
    regionLabelEn: 'Papua',
    type: 'ritual',
    sustainability: 88,
    desc: 'Suku penjaga rawa dan hutan bakau tropis terluas di Papua, terkenal di dunia karena seni ukir kayu spiritualnya yang sakral.',
    descEn: 'Guardians of the largest tropical swamps and mangrove forests in Papua, globally renowned for their sacred spiritual wood carvings.',
    image: PAPUA_IMG,
    lat: -5.5126,
    lng: 138.1254,
    radarData: [
      { subject: 'Lingkungan', value: 90 }, { subject: 'Tradisi', value: 94 }, { subject: 'Sosial', value: 85 },
      { subject: 'Spiritual', value: 95 }, { subject: 'Ekonomi', value: 50 },
    ],
    envPractice: 'Pelestarian pohon sagu adat dan ekosistem mangrove sebagai filter pesisir pantai alami secara turun-temurun melalui tabu adat.',
    envPracticeEn: 'Generational preservation of customary sago trees and mangrove ecosystems as natural coastal filters through customary taboos.',
    wayOfLife: 'Tinggal di Rumah Jew (Rumah Bujang), mendayung perahu kayu tanpa alas kaki menyusuri sungai berlumpur, serta mengukir patung leluhur Bisj.',
    wayOfLifeEn: 'Living in Rumah Jew (Bachelor House), paddling wooden boats barefoot along muddy rivers, and carving Bisj ancestor poles.',
    philosophy: 'Kepercayaan bahwa manusia adalah bagian tak terpisahkan dari roh hutan dan leluhur; merusak alam berarti merusak jiwa leluhur.',
    philosophyEn: 'The belief that humans are inseparable from forest and ancestral spirits; destroying nature means destroying ancestral souls.',
  },
  {
    id: 'naga',
    name: 'Kampung Naga',
    nameEn: 'Kampung Naga',
    location: 'Tasikmalaya, Jawa Barat',
    region: 'jawa',
    regionLabel: 'Jawa',
    regionLabelEn: 'Java',
    type: 'lingkungan',
    sustainability: 94,
    desc: 'Komunitas adat Sunda yang menolak modernisasi dan listrik, memelihara hutan larangan di sepanjang sungai Ciwulan secara murni.',
    descEn: 'A Sundanese customary community rejecting modernization and electricity, purely preserving the forbidden forest along the Ciwulan river.',
    image: NAGA_IMG,
    lat: -7.3622,
    lng: 107.9942,
    radarData: [
      { subject: 'Lingkungan', value: 96 }, { subject: 'Tradisi', value: 94 }, { subject: 'Sosial', value: 90 },
      { subject: 'Spiritual', value: 92 }, { subject: 'Ekonomi', value: 60 },
    ],
    envPractice: 'Zonasi ketat "Leuweung Larangan" (hutan yang tidak boleh disentuh manusia) dan "Leuweung Titipan" (hutan yang dimanfaatkan secara terbatas).',
    envPracticeEn: 'Strict zoning of "Leuweung Larangan" (untouched forest) and "Leuweung Titipan" (forest for limited communal use).',
    wayOfLife: 'Membangun rumah panggung seragam berbahan bambu/ijuk yang tahan gempa, memasak dengan kayu bakar, dan bertani padi organik.',
    wayOfLifeEn: 'Building uniform earthquake-resistant stilt houses of bamboo and thatch, cooking with firewood, and organic rice farming.',
    philosophy: '"Kudu sa-uyunan, ulah pagirang-girang tampian" (Harus hidup rukun berdampingan, jangan saling berebut/iri hati dalam hidup).',
    philosophyEn: '"Kudu sa-uyunan, ulah pagirang-girang tampian" (Must live in harmony together, do not compete or envy each other).',
  },
  {
    id: 'sasak',
    name: 'Suku Sasak Sade',
    nameEn: 'Sasak Sade Tribe',
    location: 'Pujut, Lombok Tengah',
    region: 'nusatenggara',
    regionLabel: 'Nusa Tenggara',
    regionLabelEn: 'Lesser Sunda',
    type: 'tradisi',
    sustainability: 82,
    desc: 'Masyarakat adat Sasak yang mempertahankan gaya hidup tradisional di tengah pariwisata modern Lombok, menjaga tenun khas Sade.',
    descEn: 'Sasak customary community maintaining their traditional lifestyle amidst modern Lombok tourism, preserving unique Sade weaving.',
    image: SASAK_IMG,
    lat: -8.7072,
    lng: 116.2736,
    radarData: [
      { subject: 'Lingkungan', value: 80 }, { subject: 'Tradisi', value: 92 }, { subject: 'Sosial', value: 88 },
      { subject: 'Spiritual', value: 85 }, { subject: 'Ekonomi', value: 72 },
    ],
    envPractice: 'Pembangunan rumah menggunakan material organik lokal (tanah liat, kotoran kerbau untuk perekat lantai, bambu, jerami) yang biodegradable.',
    envPracticeEn: 'House construction using local organic biodegradable materials (clay, buffalo dung floor plaster, bamboo, thatch).',
    wayOfLife: 'Menyusun benang tenun songket khas Sade secara manual, ritual Tari Peresean (pertarungan persaudaraan), dan arsitektur rumah Bale Tani.',
    wayOfLifeEn: 'Weaving Sade songket fabrics manually, performing the Peresean dance (brotherhood duel), and building Bale Tani architecture.',
    philosophy: '"Belomba-lomba membaik" — menjaga keharmonisan bertetangga serta kepatuhan penuh pada tetua adat (Krama Desa).',
    philosophyEn: '"Belomba-lomba membaik" (Strive to improve) — maintaining neighborhood harmony and complete obedience to customary elders.',
  },
  {
    id: 'kajang',
    name: 'Suku Kajang Ammatoa',
    nameEn: 'Kajang Ammatoa Tribe',
    location: 'Bulukumba, Sulawesi Selatan',
    region: 'sulawesi',
    regionLabel: 'Sulawesi',
    regionLabelEn: 'Sulawesi',
    type: 'lingkungan',
    sustainability: 96,
    desc: 'Suku adat Ammatoa Kajang yang hidup sederhana dengan pakaian serba hitam, menolak teknologi modern, dan melestarikan hutan adat "Karamaka" secara murni.',
    descEn: 'Kajang Ammatoa tribe living in simplicity with all-black attire, rejecting modern technology, and purely preserving the sacred "Karamaka" forest.',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    lat: -5.3188,
    lng: 120.1472,
    radarData: [
      { subject: 'Lingkungan', value: 98 }, { subject: 'Tradisi', value: 95 }, { subject: 'Sosial', value: 92 },
      { subject: 'Spiritual', value: 97 }, { subject: 'Ekonomi', value: 60 },
    ],
    envPractice: 'Larangan menggunakan alas kaki di hutan adat untuk mencegah pencemaran tanah, pembatasan ketat pengambilan hasil hutan, serta larangan membabat pohon.',
    envPracticeEn: 'Ban on footwear in the sacred forest to prevent soil pollution, strict quotas on forest harvesting, and complete ban on tree cutting.',
    wayOfLife: 'Masyarakat berpakaian hitam sebagai simbol kesederhanaan, tinggal di rumah panggung dengan orientasi seragam, dan hidup tanpa aliran listrik.',
    wayOfLifeEn: 'The community wears black as a symbol of simplicity, living in stilt houses with uniform orientation, and living without electricity.',
    philosophy: '"Kamase-masea" (Hidup sederhana/bersahaja) — mengedukasi keselarasan hidup dengan alam tanpa keserakahan materialistis.',
    philosophyEn: '"Kamase-masea" (Living in simplicity) — teaching harmony with nature without materialistic greed.',
  },
  {
    id: 'mentawai',
    name: 'Suku Mentawai',
    nameEn: 'Mentawai Tribe',
    location: 'Siberut, Sumatera Barat',
    region: 'sumatera',
    regionLabel: 'Sumatera',
    regionLabelEn: 'Sumatra',
    type: 'ritual',
    sustainability: 89,
    desc: 'Suku asli kepulauan Mentawai yang memegang teguh kepercayaan animisme Arat Sabulungan, terkenal dengan seni rajah tubuh tertua di dunia.',
    descEn: 'Indigenous Mentawai island tribe upholding the Arat Sabulungan animism beliefs, famous for the world\'s oldest body tattoo art.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    lat: -1.3857,
    lng: 98.9221,
    radarData: [
      { subject: 'Lingkungan', value: 92 }, { subject: 'Tradisi', value: 94 }, { subject: 'Sosial', value: 88 },
      { subject: 'Spiritual', value: 96 }, { subject: 'Ekonomi', value: 55 },
    ],
    envPractice: 'Sebelum menebang pohon untuk membuat perahu atau berburu hewan, dukun adat (Sikerei) harus melakukan ritual meminta izin kepada roh alam.',
    envPracticeEn: 'Before cutting trees for boats or hunting, customary shamans (Sikerei) perform rituals to ask permission from nature spirits.',
    wayOfLife: 'Tinggal bersama di rumah adat besar Uma, berburu primata secara tradisional dengan busur beracun, dan melakukan upacara pengobatan Sikerei.',
    wayOfLifeEn: 'Living together in a large ancestral Uma house, hunting primates traditionally with poisoned arrows, and performing Sikerei healing rituals.',
    philosophy: 'Seluruh benda di dunia memiliki jiwa; ketidakseimbangan perlakuan manusia terhadap alam akan menyebabkan roh alam marah dan membawa petaka.',
    philosophyEn: 'All things in the world possess a soul; imbalance in human treatment of nature will anger the spirits and bring catastrophe.',
  },
  {
    id: 'waerebo',
    name: 'Masyarakat Wae Rebo',
    nameEn: 'Wae Rebo Community',
    location: 'Manggarai, Nusa Tenggara Timur',
    region: 'nusatenggara',
    regionLabel: 'Nusa Tenggara',
    regionLabelEn: 'Lesser Sunda',
    type: 'tradisi',
    sustainability: 85,
    desc: 'Desa adat Manggarai terpencil di ketinggian 1.200 mdpl Flores yang mempertahankan 7 rumah kerucut raksasa Mbaru Niang penanda adat.',
    descEn: 'Remote Manggarai customary village located 1,200m above sea level in Flores, preserving 7 giant conical Mbaru Niang houses as cultural symbols.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    lat: -8.7758,
    lng: 120.2831,
    radarData: [
      { subject: 'Lingkungan', value: 86 }, { subject: 'Tradisi', value: 93 }, { subject: 'Sosial', value: 95 },
      { subject: 'Spiritual', value: 90 }, { subject: 'Ekonomi', value: 72 },
    ],
    envPractice: 'Konservasi ketat kawasan hutan pegunungan sekeliling desa untuk menjaga resapan air bersih serta larangan bercocok tanam yang merusak tanah.',
    envPracticeEn: 'Strict conservation of mountainous forest zones surrounding the village to preserve water catchment and prohibition of soil-ruining farming.',
    wayOfLife: 'Delapan keluarga bermukim bersama dalam satu Mbaru Niang, menanam kopi organik secara tradisional, dan menyambut tamu dengan upacara adat Waelu.',
    wayOfLifeEn: 'Eight families living together in a single Mbaru Niang, farming organic coffee traditionally, and welcoming guests with the Waelu ritual.',
    philosophy: '"Lonto Leok" (Duduk Melingkar) — semangat musyawarah mufakat, kebersamaan komunal, dan pembagian keadilan sosial secara merata.',
    philosophyEn: '"Lonto Leok" (Circular Seating) — spirit of consensus, communal togetherness, and equal distribution of social justice.',
  },
  {
    id: 'sumba',
    name: 'Kampung Tarung Sumba',
    nameEn: 'Sumba Tarung Village',
    location: 'Sumba Barat, Nusa Tenggara Timur',
    region: 'nusatenggara',
    regionLabel: 'Nusa Tenggara',
    regionLabelEn: 'Lesser Sunda',
    type: 'ritual',
    sustainability: 83,
    desc: 'Pusat spiritual penganut kepercayaan lokal Marapu di Sumba Barat dengan barisan rumah beratap menara jerami menjulang tinggi.',
    descEn: 'The spiritual center for Marapu local believers in West Sumba, featuring rows of high thatched tower customary houses.',
    image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    lat: -9.6417,
    lng: 119.4122,
    radarData: [
      { subject: 'Lingkungan', value: 82 }, { subject: 'Tradisi', value: 94 }, { subject: 'Sosial', value: 90 },
      { subject: 'Spiritual', value: 95 }, { subject: 'Ekonomi', value: 68 },
    ],
    envPractice: 'Pelestarian teknik tenun ikat menggunakan pewarna alami dari tanaman nila dan akar mengkudu guna menghindari pencemaran limbah kimia cair.',
    envPracticeEn: 'Preserving ikat weaving techniques using natural organic dye from indigo and madder root to avoid liquid chemical waste pollution.',
    wayOfLife: 'Pembuatan tenun ikat pusaka oleh kaum wanita, upacara ritual pemujaan leluhur Marapu, dan festival ketangkasan berkuda Pasola.',
    wayOfLifeEn: 'Making sacred ikat textiles by women, performing Marapu ancestor worship rituals, and the equestrian combat festival of Pasola.',
    philosophy: 'Menjaga harmoni kosmis antara leluhur, manusia, dan alam liar; segala pelanggaran adat dipercaya mendatangkan kemarau atau paceklik.',
    philosophyEn: 'Maintaining cosmic harmony between ancestors, humans, and wild nature; customary violations are believed to bring droughts.',
  },
  {
    id: 'dani',
    name: 'Suku Dani',
    nameEn: 'Dani Tribe',
    location: 'Lembah Baliem, Papua Pegunungan',
    region: 'papua',
    regionLabel: 'Papua',
    regionLabelEn: 'Papua',
    type: 'tradisi',
    sustainability: 87,
    desc: 'Suku petani tradisional di dataran tinggi Papua yang bermukim di rumah bulat Honai dan mengolah kebun ubi jalar secara berkelanjutan.',
    descEn: 'Traditional farming tribe in Papua highlands living in round Honai houses and cultivating sweet potato gardens sustainably.',
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    lat: -4.0975,
    lng: 138.9489,
    radarData: [
      { subject: 'Lingkungan', value: 89 }, { subject: 'Tradisi', value: 91 }, { subject: 'Sosial', value: 88 },
      { subject: 'Spiritual', value: 90 }, { subject: 'Ekonomi', value: 62 },
    ],
    envPractice: 'Pembuatan sistem parit irigasi kuno di lereng bukit curam untuk mengatur aliran air, mencegah longsor, dan menyuburkan tanaman ubi jalar.',
    envPracticeEn: 'Constructing ancient irrigation ditch networks on steep slopes to control water flow, prevent landslides, and fertilize crops.',
    wayOfLife: 'Tinggal bersama di Honai berkelompok, bertani padi/ubi jalar komunal, menyelenggarakan upacara Bakar Batu (kebersamaan), dan pesta panen.',
    wayOfLifeEn: 'Living in clustered Honai groups, farming sweet potatoes communally, hosting Bakar Batu (cooking festival), and harvest feasts.',
    philosophy: '"Kaneka" — keyakinan bahwa tanah subur lembah Baliem adalah ibu penyangga kehidupan yang wajib dijaga kebersihannya dan tidak dieksploitasi berlebih.',
    philosophyEn: '"Kaneka" — the belief that the fertile Baliem valley soil is the mother of life which must be kept clean and not over-exploited.',
  },
  {
    id: 'bajo',
    name: 'Suku Sama Bajo',
    nameEn: 'Sama Bajo Tribe',
    location: 'Wakatobi, Sulawesi Tenggara',
    region: 'sulawesi',
    regionLabel: 'Sulawesi',
    regionLabelEn: 'Sulawesi',
    type: 'lingkungan',
    sustainability: 93,
    desc: 'Suku pengembara laut legendaris yang hidup di atas perairan karang, memiliki kearifan lokal konservasi terumbu karang dan daerah tangkapan ikan tradisional.',
    descEn: 'Legendary sea nomads living on coral waters, possessing local wisdom in coral reef conservation and traditional fishery zones.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    lat: -5.3278,
    lng: 123.5889,
    radarData: [
      { subject: 'Lingkungan', value: 95 }, { subject: 'Tradisi', value: 90 }, { subject: 'Sosial', value: 88 },
      { subject: 'Spiritual', value: 85 }, { subject: 'Ekonomi', value: 65 },
    ],
    envPractice: 'Aturan adat Mamia Kadandio melarang pemboman ikan dan penggunaan alat tangkap merusak untuk menjaga keseimbangan ekosistem laut.',
    envPracticeEn: 'Mamia Kadandio customary rules ban fish bombing and destructive fishing gear to preserve the marine ecosystem equilibrium.',
    wayOfLife: 'Tinggal di rumah panggung di atas laut, memiliki paru-paru dan kemampuan menyelam bebas luar biasa tanpa alat bantu modern.',
    wayOfLifeEn: 'Living in stilt houses over the sea, possessing exceptional lung capacity and free-diving skills without modern gear.',
    philosophy: 'Manusia dan laut adalah saudara kembar; merusak laut sama dengan menyakiti diri sendiri dan keluarga.',
    philosophyEn: 'Humans and the sea are twin siblings; destroying the sea is equivalent to hurting oneself and one\'s family.',
  },
  {
    id: 'tengger',
    name: 'Masyarakat Adat Tengger',
    nameEn: 'Tengger Customary Community',
    location: 'Gunung Bromo, Jawa Timur',
    region: 'jawa',
    regionLabel: 'Jawa',
    regionLabelEn: 'Java',
    type: 'ritual',
    sustainability: 91,
    desc: 'Masyarakat adat di dataran tinggi Bromo yang menjaga kelestarian kawah suci melalui upacara Yadnya Kasada dan memelihara hutan adat lereng gunung.',
    descEn: 'Customary community in Bromo highlands preserving the sacred crater through the Yadnya Kasada ritual and maintaining customary mountain forests.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    lat: -7.9425,
    lng: 112.9531,
    radarData: [
      { subject: 'Lingkungan', value: 90 }, { subject: 'Tradisi', value: 96 }, { subject: 'Sosial', value: 92 },
      { subject: 'Spiritual', value: 98 }, { subject: 'Ekonomi', value: 70 },
    ],
    envPractice: 'Zonasi hutan adat lereng Bromo melarang penebangan pohon sembarangan guna menjaga sumber air dan mencegah tanah longsor.',
    envPracticeEn: 'Customary forest zoning on Bromo slopes prohibits illegal logging to secure water sources and prevent landslides.',
    wayOfLife: 'Bercocok tanam sayuran tradisional di lereng curam, mengenakan sarung khas Tengger untuk menghalau dingin, dan hidup rukun berdampingan.',
    wayOfLifeEn: 'Farming traditional vegetables on steep slopes, wearing signature Tengger sarongs for warmth, and living in communal harmony.',
    philosophy: 'Pemujaan kepada Gunung Brahma (Bromo) sebagai pemberi kemakmuran dan penjaga keseimbangan ekologi bumi.',
    philosophyEn: 'Worship of Mount Brahma (Bromo) as the provider of prosperity and guardian of the earth\'s ecological balance.',
  },
  {
    id: 'nias',
    name: 'Masyarakat Adat Nias',
    nameEn: 'Nias Customary Community',
    location: 'Nias Selatan, Sumatera Utara',
    region: 'sumatera',
    regionLabel: 'Sumatera',
    regionLabelEn: 'Sumatra',
    type: 'tradisi',
    sustainability: 86,
    desc: 'Masyarakat adat Kepulauan Nias yang melestarikan arsitektur rumah adat tahan gempa raksasa Omo Hada serta ritual lompat batu Fahombo.',
    descEn: 'Nias customary community preserving the giant earthquake-resistant Omo Hada stilt houses and the Fahombo stone jumping ritual.',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    lat: 0.7812,
    lng: 97.7478,
    radarData: [
      { subject: 'Lingkungan', value: 82 }, { subject: 'Tradisi', value: 95 }, { subject: 'Sosial', value: 90 },
      { subject: 'Spiritual', value: 88 }, { subject: 'Ekonomi', value: 75 },
    ],
    envPractice: 'Pemanfaatan kayu keras pilihan (seperti kayu nalo) yang ditebang secara adat untuk menjamin kekokohan bangunan tanpa merusak regenerasi hutan.',
    envPracticeEn: 'Utilization of select hardwoods (like nalo wood) logged under custom to ensure building strength without disrupting forest regeneration.',
    wayOfLife: 'Tinggal di desa-desa adat berbukit batu, berlatih ketangkasan lompat batu sejak dini, dan memproduksi kerajinan ukir kayu megalitik.',
    wayOfLifeEn: 'Living in stone-paved hilly customary villages, practicing stone jumping since youth, and carving megalithic wooden crafts.',
    philosophy: 'Tano Niha (Tanah Nias) adalah tanah kehormatan leluhur; setiap bangunan dan tradisi harus mencerminkan kekuatan dan harmoni alam.',
    philosophyEn: 'Tano Niha (Nias Land) is the land of ancestral honor; every building and tradition must reflect strength and natural harmony.',
  },
  {
    id: 'dayak_iban',
    name: 'Suku Dayak Iban Sungai Utik',
    nameEn: 'Sungai Utik Dayak Iban Tribe',
    location: 'Kapuas Hulu, Kalimantan Barat',
    region: 'kalimantan',
    regionLabel: 'Kalimantan',
    regionLabelEn: 'Borneo',
    type: 'lingkungan',
    sustainability: 97,
    desc: 'Penjaga hutan adat Sungai Utik penerima penghargaan PBB Equator Prize, memelihara kelestarian hutan hujan seluas 9.400 hektar secara murni.',
    descEn: 'Sungai Utik customary forest guardians and UN Equator Prize recipients, purely preserving 9,400 hectares of pristine rainforest.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    lat: 1.2856,
    lng: 112.5122,
    radarData: [
      { subject: 'Lingkungan', value: 99 }, { subject: 'Tradisi', value: 94 }, { subject: 'Sosial', value: 92 },
      { subject: 'Spiritual', value: 95 }, { subject: 'Ekonomi', value: 68 },
    ],
    envPractice: 'Hukum adat melarang pembabatan hutan lindung adat (Kampong) dan mengatur ketat tata cara penebangan pohon untuk bahan bangunan.',
    envPracticeEn: 'Customary law bans logging in protected customary forests (Kampong) and strictly regulates wood harvesting for building needs.',
    wayOfLife: 'Tinggal di Rumah Panjai (Rumah Panjang) berukuran ratusan meter bersama puluhan keluarga, bertani padi organik, dan berburu ramah lingkungan.',
    wayOfLifeEn: 'Living in a massive Rumah Panjai (Longhouse) sharing space with dozens of families, organic farming, and sustainable hunting.',
    philosophy: 'Tanah melambangkan ibu kita, sedangkan air melambangkan darah kita; merusaknya berarti merusak kehidupan kita sendiri.',
    philosophyEn: 'Land represents our mother, while water represents our blood; destroying them means destroying our own existence.',
  },
];

const preservationData = [
  { year: '2000', baduy: 98, toraja: 90, dayak: 85, minang: 82, bali: 93, asmat: 90, naga: 96, sasak: 84, kajang: 98, mentawai: 90, waerebo: 88, sumba: 85, dani: 89, bajo: 94, tengger: 92, nias: 88, dayak_iban: 98 },
  { year: '2005', baduy: 97, toraja: 87, dayak: 80, minang: 81, bali: 92, asmat: 90, naga: 95, sasak: 83, kajang: 97, mentawai: 89, waerebo: 87, sumba: 84, dani: 88, bajo: 93, tengger: 92, nias: 87, dayak_iban: 97 },
  { year: '2010', baduy: 96, toraja: 85, dayak: 82, minang: 79, bali: 91, asmat: 89, naga: 95, sasak: 82, kajang: 96, mentawai: 88, waerebo: 86, sumba: 84, dani: 88, bajo: 93, tengger: 91, nias: 86, dayak_iban: 97 },
  { year: '2015', baduy: 95, toraja: 83, dayak: 84, minang: 78, bali: 90, asmat: 88, naga: 94, sasak: 82, kajang: 96, mentawai: 88, waerebo: 85, sumba: 83, dani: 87, bajo: 93, tengger: 91, nias: 86, dayak_iban: 97 },
  { year: '2020', baduy: 95, toraja: 81, dayak: 85, minang: 78, bali: 90, asmat: 88, naga: 94, sasak: 82, kajang: 96, mentawai: 89, waerebo: 85, sumba: 83, dani: 87, bajo: 93, tengger: 91, nias: 86, dayak_iban: 97 },
  { year: '2025', baduy: 95, toraja: 80, dayak: 92, minang: 78, bali: 90, asmat: 88, naga: 94, sasak: 82, kajang: 96, mentawai: 89, waerebo: 85, sumba: 83, dani: 87, bajo: 93, tengger: 91, nias: 86, dayak_iban: 97 },
];

const typeColors: Record<string, string> = {
  tradisi: '#F4A261', // Amber
  ritual: '#A855F7',  // Purple
  lingkungan: '#10B981', // Emerald
};

const mapStyles = {
  light: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
};

const t = {
  id: {
    title: 'Jelajah Budaya Nusantara',
    sub: 'Sistem pemetaan interaktif budaya Nusantara berbasis Web GIS. Terinspirasi dari Google Arts & Culture dan National Geographic.',
    search: 'Cari budaya atau daerah...',
    filter: 'Filter Kategori',
    compare: 'Mode Perbandingan',
    story: 'Petualangan Terranesia',
    all: 'Semua',
    tradisi: 'Tradisi',
    ritual: 'Ritual',
    lingkungan: 'Lingkungan',
    detail: 'Pelajari Lebih Dalam',
    vr: 'Lihat Imersif VR 360°',
    close: 'Tutup',
    chart: 'Tren Indeks Pelestarian Budaya (2000-2025)',
    compareTitle: 'Perbandingan Kebudayaan',
    selectLeft: 'Pilih Budaya Kiri',
    selectRight: 'Pilih Budaya Kanan',
    sustainability: 'Tingkat Keberlanjutan',
    region: 'Filter Wilayah',
    allRegions: 'Semua Pulau',
    layers: 'Lapisan Peta',
    qualitative: 'Analisis Aspek Kualitatif',
    envPracticeTitle: 'Praktik Konservasi Lingkungan',
    wayOfLifeTitle: 'Sistem Kehidupan Sosial',
    philosophyTitle: 'Filosofi Adat Utama',
    backToMap: 'Kembali ke Peta',
    suggestionTitle: 'Coba tanya AI:',
    storyTitle: 'Simulasi Kehidupan Terranesia',
    storySub: 'Hadapi tantangan hidup ramah lingkungan berdasarkan kearifan lokal Nusantara.',
    ecoScore: 'Skor Ekologi',
    tradScore: 'Ketaatan Adat',
    sprScore: 'Nilai Spiritual',
    storyStart: 'Mulai Petualangan',
    storyRestart: 'Ulangi Petualangan',
    congratulations: 'Selamat! Kamu telah menyelesaikan simulasi sehari bersama Terranesia.',
    aiConsoleTitle: 'Pusat Komando Satelit AI',
    aiConsolePlaceholder: 'Tulis kueri satelit (misal: Suku Bajo)...',
    aiExecute: 'JALANKAN SCAN',
    aiConsoleStatusIdle: 'Satelit Siaga - Siap memproses kueri spasial.',
    aiConsoleStatusScanning: 'Memindai Citra Satelit & Sensor Telemetri...',
    aiConsoleStatusComplete: 'Pemindaian Spasial Berhasil Selesai.',
    ambientSonification: 'Sonifikasi Audio',
    ecoWeather: 'Sensor Cuaca & Ekologi',
    latitude: 'Lintang',
    longitude: 'Bujur',
    ndviForest: 'Kerapatan Hutan (NDVI)',
    humidity: 'Kelembapan',
    temperature: 'Suhu Lokal',
  },
  en: {
    title: 'Nusantara Cultural Explorer',
    sub: 'Interactive Web GIS cultural mapping of the Indonesian archipelago. Inspired by Google Arts & Culture and National Geographic.',
    search: 'Search culture or region...',
    filter: 'Category Filter',
    compare: 'Comparison Mode',
    story: 'Terranesia Adventure',
    all: 'All',
    tradisi: 'Tradition',
    ritual: 'Ritual',
    lingkungan: 'Environment',
    detail: 'Learn More',
    vr: 'View Immersive VR 360°',
    close: 'Close',
    chart: 'Cultural Preservation Index Trend (2000-2025)',
    compareTitle: 'Cultural Comparison',
    selectLeft: 'Select Left Culture',
    selectRight: 'Select Right Culture',
    sustainability: 'Sustainability Level',
    region: 'Filter Region',
    allRegions: 'All Islands',
    layers: 'Map Layers',
    qualitative: 'Qualitative Aspect Analysis',
    envPracticeTitle: 'Environmental Conservation Practices',
    wayOfLifeTitle: 'Social Living Systems',
    philosophyTitle: 'Core Customary Philosophy',
    backToMap: 'Back to Map',
    suggestionTitle: 'Ask AI:',
    storyTitle: 'Terranesia Life Simulation',
    storySub: 'Face the challenges of eco-friendly living based on Nusantara local wisdom.',
    ecoScore: 'Ecological Score',
    tradScore: 'Custom Compliance',
    sprScore: 'Spiritual Value',
    storyStart: 'Start Adventure',
    storyRestart: 'Restart Adventure',
    congratulations: 'Congratulations! You have completed the one-day simulation with Terranesia.',
    aiConsoleTitle: 'AI Satellite Command Center',
    aiConsolePlaceholder: 'Type query for satellite (e.g. Bajo Tribe)...',
    aiExecute: 'RUN SCAN',
    aiConsoleStatusIdle: 'Satellite Standby - Ready to resolve spatial query.',
    aiConsoleStatusScanning: 'Scanning Satellite Imagery & Telemetry Sensors...',
    aiConsoleStatusComplete: 'Spatial Scan Successfully Completed.',
    ambientSonification: 'Audio Sonification',
    ecoWeather: 'Weather & Ecological Sensors',
    latitude: 'Latitude',
    longitude: 'Longitude',
    ndviForest: 'Forest Density (NDVI)',
    humidity: 'Humidity',
    temperature: 'Local Temp',
  },
};

// Helper to translate radar subjects dynamically
const translateSubject = (subject: string, lang: 'id' | 'en') => {
  if (lang === 'en') {
    switch (subject) {
      case 'Lingkungan': return 'Environment';
      case 'Tradisi': return 'Tradition';
      case 'Sosial': return 'Social';
      case 'Spiritual': return 'Spiritual';
      case 'Ekonomi': return 'Economy';
      default: return subject;
    }
  }
  return subject;
};

// Web Audio Context and Synthesizer sound generator
let audioCtx: AudioContext | null = null;

const playGISBeep = (freq: number, duration: number, type: 'sine' | 'square' | 'triangle' | 'sawtooth' = 'sine') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn('Web Audio error:', e);
  }
};

// Map controller to handle dynamic flying
interface MapTarget {
  center: [number, number];
  zoom: number;
  bounds?: [number, number][];
  timestamp: number;
}

function MapController({ target }: { target: MapTarget | null }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    if (target.bounds && target.bounds.length > 0) {
      map.fitBounds(target.bounds as any, { padding: [50, 50], animate: true, duration: 1.5 });
    } else {
      map.setView(target.center, target.zoom, { animate: true, duration: 1.5 });
    }
  }, [target, map]);
  return null;
}

// Custom Zoom Controls
function ZoomControls() {
  const map = useMap();
  return (
    <div className="absolute bottom-4 right-4 z-[999] flex flex-col gap-1.5">
      <button
        onClick={() => map.zoomIn()}
        className="w-9 h-9 bg-card border border-border text-foreground hover:bg-muted flex items-center justify-center rounded-xl shadow-lg font-bold text-lg transition-transform active:scale-95 cursor-pointer"
        title="Zoom In"
      >
        +
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-9 h-9 bg-card border border-border text-foreground hover:bg-muted flex items-center justify-center rounded-xl shadow-lg font-bold text-lg transition-transform active:scale-95 cursor-pointer"
        title="Zoom Out"
      >
        −
      </button>
    </div>
  );
}

// Custom Marker Creator helper
const createCustomIcon = (type: 'tradisi' | 'ritual' | 'lingkungan', active: boolean) => {
  const color = typeColors[type];
  const activeClass = active ? 'scale-125 ring-4 ring-white/40 shadow-2xl' : 'hover:scale-110';
  const html = `
    <div class="relative flex items-center justify-center transition-all duration-300 ${activeClass}" style="width: 32px; height: 32px;">
      <div class="absolute inset-0 rounded-full animate-ping opacity-30" style="background-color: ${color};"></div>
      <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center relative z-10 transition-transform duration-300" style="background-color: ${color};">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

interface ExpeditionTrail {
  id: string;
  nameId: string;
  nameEn: string;
  descId: string;
  descEn: string;
  color: string;
  cultures: string[]; // List of culture IDs
  guidelinesId: string;
  guidelinesEn: string;
  carbonSave: string;
}

const expeditionTrails: ExpeditionTrail[] = [
  {
    id: 'conservation',
    nameId: 'Jalur Ekspedisi Konservasi Hijau',
    nameEn: 'Green Conservation Trail',
    descId: 'Menghubungkan masyarakat adat yang memiliki hukum perlindungan alam dan tata kelola air tradisional terkuat.',
    descEn: 'Connects indigenous communities with the strongest environmental laws and traditional water management.',
    color: '#10B981', // Emerald
    cultures: ['baduy', 'naga', 'bali', 'kajang', 'dayak'],
    guidelinesId: 'Dilarang menggunakan kendaraan bermotor, membawa plastik sekali pakai, serta wajib menghormati larangan alas kaki di zona sakral.',
    guidelinesEn: 'No motor vehicles or single-use plastics allowed. Respect footwear restrictions in sacred zones.',
    carbonSave: 'Est. Reduksi Emisi: 450kg CO2e / perjalanan'
  },
  {
    id: 'ritual_cosmology',
    nameId: 'Jalur Kosmologi & Ritual Adat',
    nameEn: 'Cosmology & Customary Ritual Trail',
    descId: 'Menelusuri ritual penghormatan leluhur, kesenian pahat sakral, dan festival ketangkasan berkuda.',
    descEn: 'Explores ancestor worship rituals, sacred woodcarvings, and equestrian combat festivals.',
    color: '#8B5CF6', // Purple/Violet
    cultures: ['toraja', 'sumba', 'dani', 'asmat', 'mentawai'],
    guidelinesId: 'Wajib mengenakan kain tenun penghormatan saat menghadiri upacara kematian, menjaga tutur kata, dan meminta izin tetua adat.',
    guidelinesEn: 'Worn ceremonial woven fabrics required when attending funeral ceremonies. Speak politely and seek permission.',
    carbonSave: 'Est. Reduksi Emisi: 320kg CO2e / perjalanan'
  }
];

// Story Mode Scenarios
interface ScenarioStep {
  titleId: string;
  titleEn: string;
  descId: string;
  descEn: string;
  image: string;
  lat: number;
  lng: number;
  zoom: number;
  choices: {
    textId: string;
    textEn: string;
    ecoEffect: number;
    tradEffect: number;
    sprEffect: number;
    feedbackId: string;
    feedbackEn: string;
  }[];
}

const storyScenarios: ScenarioStep[] = [
  {
    titleId: 'Pos Pintu Masuk Ciboleger (Pagi)',
    titleEn: 'Ciboleger Entrance Checkpoint (Morning)',
    descId: 'Kamu baru saja tiba di perbatasan desa budaya Nusantara. Pemandu mengingatkan tentang aturan Pikukuh adat. Kamu sedang memegang botol air plastik sekali pakai yang baru saja kamu beli di kota.',
    descEn: 'You have just arrived at the border of the Nusantara village. The guide reminds you of the Pikukuh customary rule. You are holding a single-use plastic water bottle you recently bought in the city.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
    lat: -6.5684,
    lng: 106.2628,
    zoom: 13,
    choices: [
      {
        textId: 'Buang botol plastik di luar desa, lalu sewa kojong bambu tradisional.',
        textEn: 'Discard the plastic bottle outside, then rent a traditional bamboo container.',
        ecoEffect: 20,
        tradEffect: 15,
        sprEffect: 10,
        feedbackId: 'Bagus! Mengurangi limbah anorganik di kawasan adat sangat dihargai dan menjaga kesucian tanah.',
        feedbackEn: 'Great! Reducing inorganic waste in the customary area is highly appreciated and keeps the soil sacred.',
      },
      {
        textId: 'Simpan botol plastik di ransel dan janji membawanya pulang nanti.',
        textEn: 'Keep the plastic bottle inside your backpack and promise to bring it home later.',
        ecoEffect: 10,
        tradEffect: 5,
        sprEffect: 5,
        feedbackId: 'Cukup bijaksana, tapi pastikan botol tersebut tidak terjatuh atau tertinggal di area dalam.',
        feedbackEn: 'Wise enough, but ensure the bottle does not fall or get left behind in the inner area.',
      }
    ]
  },
  {
    titleId: 'Makan Siang di Kampung Kaduketug (Siang)',
    titleEn: 'Lunch at Kaduketug Village (Noon)',
    descId: 'Kamu diundang makan siang di rumah panggung milik seorang warga desa adat. Mereka menyajikan hidangan nasi huma lokal. Tidak ada kompor gas atau peralatan listrik, memasak menggunakan kayu bakar kering.',
    descEn: 'You are invited to have lunch inside a stilt house of a customary village resident. They serve local huma hill rice. There are no gas stoves or electrical appliances; cooking is done using dry firewood.',
    image: VILLAGE_IMG,
    lat: -6.6080,
    lng: 106.2678,
    zoom: 15,
    choices: [
      {
        textId: 'Menikmati sajian tradisional dan ikut membantu merapikan kayu bakar.',
        textEn: 'Enjoy the traditional meal and help arrange the dry firewood.',
        ecoEffect: 15,
        tradEffect: 20,
        sprEffect: 15,
        feedbackId: 'Luar biasa! Belajar menghargai proses memasak menggunakan energi terbarukan kayu ranting kering tanpa merusak pohon hidup.',
        feedbackEn: 'Wonderful! Learning to appreciate cooking with renewable energy from dry twigs without damaging live trees.',
      },
      {
        textId: 'Mengeluarkan kompor gas portabel kustom milikmu agar memasak lebih cepat.',
        textEn: 'Pull out your custom portable gas stove to speed up the process.',
        ecoEffect: -15,
        tradEffect: -25,
        sprEffect: -15,
        feedbackId: 'Warga adat merasa kurang nyaman karena melanggar larangan membawa alat pembakaran modern ke dalam permukiman.',
        feedbackEn: 'Customary residents feel uncomfortable as bringing modern combustion devices into settlements violates custom.',
      }
    ]
  },
  {
    titleId: 'Membersihkan Diri di Sungai Ciujung (Sore)',
    titleEn: 'Refreshing at Ciujung River (Afternoon)',
    descId: 'Sore hari terasa gerah, kamu ingin membersihkan diri di sungai jernih di dekat kampung. Namun, hukum adat Pikukuh melarang pemakaian sabun, sampo, dan pasta gigi kimia karena limbahnya mencemari air sungai.',
    descEn: 'The afternoon feels hot, and you want to clean up in the crystal clear river near the village. However, the Pikukuh law forbids the use of chemical soap, shampoo, and toothpaste to prevent polluting the water.',
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
    lat: -6.6150,
    lng: 106.2580,
    zoom: 16,
    choices: [
      {
        textId: 'Mandi menyegarkan diri hanya menggunakan aliran air sungai murni.',
        textEn: 'Bathe and refresh yourself using only the pure flowing river water.',
        ecoEffect: 25,
        tradEffect: 25,
        sprEffect: 20,
        feedbackId: 'Hebat! Kamu merangkul gaya hidup lestari Terranesia dan menjaga sungai tetap bersih bagi ribuan makhluk hidup di hilir.',
        feedbackEn: 'Great! You embrace the sustainable Terranesia lifestyle and keep the river clean for thousands of living organisms downstream.',
      },
      {
        textId: 'Menggunakan sedikit sabun cair berlabel "Biodegradable/Organik" secara diam-diam.',
        textEn: 'Secretly use a small amount of soap labeled "Biodegradable/Organic".',
        ecoEffect: -5,
        tradEffect: -15,
        sprEffect: -10,
        feedbackId: 'Meskipun organik, hukum adat melarang segala zat asing komersial. Kejujuran adalah kunci kelestarian alam Nusantara.',
        feedbackEn: 'Even if organic, customary law bans all commercial foreign substances. Honesty is key to preserving Nusantara nature.',
      }
    ]
  },
  {
    titleId: 'Menginap di Rumah Panggung Adat (Malam)',
    titleEn: 'Staying in a Customary Stilt House (Night)',
    descId: 'Malam hari telah tiba, desa menjadi sangat gelap karena tidak menggunakan tiang listrik jalanan. Beberapa warga berkumpul di beranda rumah panggung kayu sambil menyalakan pelita bambu minyak kelapa. Mereka berbincang santai.',
    descEn: 'Night has fallen, and the village is completely pitch dark as there is no electricity. Several residents gather on the wooden veranda under coconut oil torches. They talk and share stories.',
    image: NAGA_IMG,
    lat: -6.6119,
    lng: 106.2625,
    zoom: 16,
    choices: [
      {
        textId: 'Ikut berkumpul dan mengobrol dengan warga di bawah pelita minyak kelapa.',
        textEn: 'Join the gathering and chat with residents under the warm oil torch light.',
        ecoEffect: 15,
        tradEffect: 20,
        sprEffect: 25,
        feedbackId: 'Luar biasa! Interaksi sosial langsung tanpa terganggu gawai membuatmu benar-benar memahami kehangatan komunal dan ketenangan batin budaya Nusantara.',
        feedbackEn: 'Wonderful! Direct social interaction without gadget distractions helps you truly understand the communal warmth and inner peace of Nusantara culture.',
      },
      {
        textId: 'Menyalakan senter LED baterai berdaya tinggi milikmu untuk membaca buku di sudut kamar.',
        textEn: 'Turn on your high-power LED battery flashlight to read a book in your room corner.',
        ecoEffect: -5,
        tradEffect: -10,
        sprEffect: -5,
        feedbackId: 'Cahaya buatan yang terlalu terang dinilai merusak ketenangan malam alami permukiman adat Nusantara. Hargailah suasana hening malam.',
        feedbackEn: 'Artificial light that is too bright is considered disruptive to the natural night peace of the Nusantara village. Respect the silent night.',
      }
    ]
  }
];

export function JelajahSection({ lang, isDark }: Props) {
  // Filters & State
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [sustainabilityMin, setSustainabilityMin] = useState<number>(50);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CulturePoint | null>(null);
  
  // Custom interactive panels state
  const [compareMode, setCompareMode] = useState(false);
  const [compareLeft, setCompareLeft] = useState<string>('baduy');
  const [compareRight, setCompareRight] = useState<string>('toraja');
  const [activeTrail, setActiveTrail] = useState<string | null>(null);
  
  const leftCulture = useMemo(() => cultures.find(c => c.id === compareLeft)!, [compareLeft]);
  const rightCulture = useMemo(() => cultures.find(c => c.id === compareRight)!, [compareRight]);

  const activeTrailData = useMemo(() => {
    return expeditionTrails.find(t => t.id === activeTrail);
  }, [activeTrail]);

  const trailPoints = useMemo(() => {
    return activeTrailData 
      ? activeTrailData.cultures.map(cId => {
          const c = cultures.find(cult => cult.id === cId);
          return c ? [c.lat, c.lng] as [number, number] : null;
        }).filter((p): p is [number, number] => p !== null)
      : [];
  }, [activeTrailData]);

  // Layer toggles
  const [showLayerBudaya, setShowLayerBudaya] = useState(true);
  const [showLayerLingkungan, setShowLayerLingkungan] = useState(true);
  const [showLayerKearifan, setShowLayerKearifan] = useState(true);

  // Story Mode State
  const [storyActive, setStoryActive] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  const [ecoScore, setEcoScore] = useState(50);
  const [tradScore, setTradScore] = useState(50);
  const [sprScore, setSprScore] = useState(50);
  const [storyFeedback, setStoryFeedback] = useState<string | null>(null);
  const [storyFeedbackEn, setStoryFeedbackEn] = useState<string | null>(null);

  // Map view positioning states
  const [mapCenter, setMapCenter] = useState<[number, number]>([-2.5489, 118.0149]);
  const [mapZoom, setMapZoom] = useState(5);

  // Unified map target state for programmatic panning/zooming
  const [mapTarget, setMapTarget] = useState<MapTarget | null>(null);

  // Helper to trigger programmatic map movement
  const triggerMapFly = (center: [number, number], zoom: number, bounds?: [number, number][]) => {
    setMapCenter(center);
    setMapZoom(zoom);
    setMapTarget({ center, zoom, bounds, timestamp: Date.now() });
  };

  // Map Style Key state
  const [mapStyleKey, setMapStyleKey] = useState<'light' | 'dark' | 'satellite' | 'terrain'>(isDark ? 'dark' : 'light');

  // Sync map style with dark mode
  useEffect(() => {
    setMapStyleKey(isDark ? 'dark' : 'light');
  }, [isDark]);

  // AI Console State
  const [aiConsoleInput, setAiConsoleInput] = useState('');
  const [aiConsoleLogs, setAiConsoleLogs] = useState<string[]>([]);
  const [aiConsoleStatus, setAiConsoleStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [aiConsoleResult, setAiConsoleResult] = useState<{ titleId: string; titleEn: string; descId: string; descEn: string; stats: { label: string; value: string }[] } | null>(null);

  // Audio Sonification States
  const [isPlayingSoundscape, setIsPlayingSoundscape] = useState(false);
  const oscsRef = useRef<any[]>([]);
  const soundscapeIntervalRef = useRef<any>(null);

  const stopAmbientSoundscape = () => {
    setIsPlayingSoundscape(false);
    if (oscsRef.current) {
      oscsRef.current.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      oscsRef.current = [];
    }
    if (soundscapeIntervalRef.current) {
      clearInterval(soundscapeIntervalRef.current);
      soundscapeIntervalRef.current = null;
    }
  };

  const startAmbientSoundscape = (type: 'tradisi' | 'ritual' | 'lingkungan') => {
    stopAmbientSoundscape();
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) {
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      setIsPlayingSoundscape(true);

      if (type === 'lingkungan') {
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(110, audioCtx.currentTime);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(165, audioCtx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc1.start();
        osc2.start();

        oscsRef.current = [osc1, osc2];
      } else if (type === 'ritual') {
        const chimeGain = audioCtx.createGain();
        chimeGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        chimeGain.connect(audioCtx.destination);

        const playChime = () => {
          if (!audioCtx) return;
          const osc = audioCtx.createOscillator();
          const amp = audioCtx.createGain();
          const freqs = [523.25, 587.33, 659.25, 783.99, 880.00];
          const randomFreq = freqs[Math.floor(Math.random() * freqs.length)];

          osc.type = 'sine';
          osc.frequency.setValueAtTime(randomFreq, audioCtx.currentTime);
          
          amp.gain.setValueAtTime(0.06, audioCtx.currentTime);
          amp.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.0);

          osc.connect(amp);
          amp.connect(chimeGain);
          
          osc.start();
          osc.stop(audioCtx.currentTime + 3.0);
        };

        playChime();
        soundscapeIntervalRef.current = setInterval(playChime, 1500);
      } else {
        const clickGain = audioCtx.createGain();
        clickGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        clickGain.connect(audioCtx.destination);

        const playClick = () => {
          if (!audioCtx) return;
          const osc = audioCtx.createOscillator();
          const amp = audioCtx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(400 + Math.random() * 80, audioCtx.currentTime);

          amp.gain.setValueAtTime(0.08, audioCtx.currentTime);
          amp.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

          osc.connect(amp);
          amp.connect(clickGain);

          osc.start();
          osc.stop(audioCtx.currentTime + 0.12);
        };

        playClick();
        soundscapeIntervalRef.current = setInterval(playClick, 400);
      }
    } catch (e) {
      console.warn('Soundscape synthesizer error:', e);
    }
  };

  useEffect(() => {
    stopAmbientSoundscape();
  }, [selected]);

  // AI query handler using integrated Satellite Terminal Console
  const submitAIQuery = (queryText: string) => {
    if (!queryText.trim()) return;
    setAiConsoleInput('');
    setAiConsoleStatus('scanning');
    setAiConsoleLogs(lang === 'id' 
      ? [`[SYSTEM] Memulai pemindaian satelit untuk: "${queryText}"`] 
      : [`[SYSTEM] Initializing satellite scanning for: "${queryText}"`]
    );

    playGISBeep(880, 0.1);
    setTimeout(() => playGISBeep(1100, 0.15), 150);

    const logTimeline = lang === 'id' ? [
      '[GIS] Menghubungkan ke satelit Sentinel-2...',
      '[AI] Menganalisis kerapatan vegetasi hutan (NDVI)...',
      '[GIS] Memproses koordinat spasial kebudayaan...',
      '[AI] Sinkronisasi data kearifan lokal selesai.'
    ] : [
      '[GIS] Connecting to Sentinel-2 satellite network...',
      '[AI] Analyzing forest canopy density index (NDVI)...',
      '[GIS] Resolving customary spatial coordinates...',
      '[AI] Local wisdom database synchronization complete.'
    ];

    logTimeline.forEach((logText, idx) => {
      setTimeout(() => {
        setAiConsoleLogs(prev => [...prev, logText]);
        playGISBeep(660 + idx * 100, 0.05);
      }, (idx + 1) * 600);
    });

    setTimeout(() => {
      const matched = cultures.find(c => 
        c.name.toLowerCase().includes(queryText.toLowerCase()) ||
        c.nameEn.toLowerCase().includes(queryText.toLowerCase()) ||
        c.desc.toLowerCase().includes(queryText.toLowerCase()) ||
        c.descEn.toLowerCase().includes(queryText.toLowerCase()) ||
        c.location.toLowerCase().includes(queryText.toLowerCase())
      );

      if (matched) {
        setSelected(matched);
        triggerMapFly([matched.lat, matched.lng], 9);
        setAiConsoleStatus('complete');
        setAiConsoleResult({
          titleId: `Pemindaian AI Berhasil: ${matched.name}`,
          titleEn: `AI Scan Successful: ${matched.nameEn}`,
          descId: `Satelit mendeteksi keberadaan pemukiman ${matched.name} di ${matched.location} dengan indeks kelestarian sebesar ${matched.sustainability}%.`,
          descEn: `Satellite detected ${matched.nameEn} settlements in ${matched.location} with a sustainability index of ${matched.sustainability}%.`,
          stats: [
            { label: lang === 'id' ? 'Koordinat' : 'Coordinates', value: `${matched.lat.toFixed(4)}, ${matched.lng.toFixed(4)}` },
            { label: lang === 'id' ? 'Keberlanjutan' : 'Sustainability', value: `${matched.sustainability}%` },
            { label: lang === 'id' ? 'Kategori' : 'Category', value: matched.type.toUpperCase() }
          ]
        });
      } else {
        let titleId = 'Hasil Pemindaian Umum';
        let titleEn = 'General Scan Result';
        let descId = 'Kueri Anda dianalisis secara makro. Tidak ditemukan suku spesifik, namun peta diarahkan ke pusat kepulauan Nusantara untuk menampilkan data global.';
        let descEn = 'Your query was analyzed macroscopically. No specific tribe was found, but the map flew to the center of the archipelago to show global data.';

        if (queryText.toLowerCase().includes('hutan') || queryText.toLowerCase().includes('lestari') || queryText.toLowerCase().includes('forest') || queryText.toLowerCase().includes('iban')) {
          triggerMapFly([1.6212, 114.9315], 6);
          setActiveFilter('lingkungan');
          setSearch('');
          titleId = 'Konservasi Hutan Nusantara';
          titleEn = 'Nusantara Forest Conservation';
          descId = 'Menampilkan seluruh kelompok masyarakat adat ber-kategori Lingkungan yang melestarikan kawasan hutan dengan indeks kelestarian di atas 85%.';
          descEn = 'Displaying all customary communities under the Environment category preserving forest zones with a sustainability index above 85%.';
        } else if (queryText.toLowerCase().includes('laut') || queryText.toLowerCase().includes('pantai') || queryText.toLowerCase().includes('sea') || queryText.toLowerCase().includes('marine') || queryText.toLowerCase().includes('bajo')) {
          const bajoData = cultures.find(c => c.id === 'bajo');
          if (bajoData) {
            setSelected(bajoData);
            triggerMapFly([bajoData.lat, bajoData.lng], 8);
          }
          titleId = 'Konservasi Terumbu Karang';
          titleEn = 'Coral Reef Conservation';
          descId = 'Mengarah ke Suku Sama Bajo di Wakatobi yang memiliki aturan adat Mamia Kadandio untuk melestarikan biota laut.';
          descEn = 'Flying to Sama Bajo Tribe in Wakatobi possessing Mamia Kadandio customary laws to conserve marine life.';
        } else {
          triggerMapFly([-2.5489, 118.0149], 5);
        }

        setAiConsoleStatus('complete');
        setAiConsoleResult({
          titleId,
          titleEn,
          descId,
          descEn,
          stats: [
            { label: lang === 'id' ? 'Hasil Filter' : 'Filter Output', value: `${cultures.filter(c => c.name.toLowerCase().includes(queryText.toLowerCase())).length} Cultures` },
            { label: lang === 'id' ? 'Resolusi' : 'Resolution', value: 'Global Sat' }
          ]
        });
      }
    }, 3200);
  };

  // Live GIS Ticker Index
  const [tickerIndex, setTickerIndex] = useState(0);

  const tx = t[lang];

  // Rotate GIS log tickers
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickers.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const tickers = [
    lang === 'id' ? "[AI] Suku Baduy mempertahankan 100% zonasi Hutan Larangan (Leuweung Kolot)." : "[AI] Baduy Tribe preserves 100% of the Sacred Forest (Leuweung Kolot) zone.",
    lang === 'id' ? "[GIS] Subak Bali mendeteksi efisiensi konservasi air pertanian sawah: 94%." : "[GIS] Subak Bali detects rice field water conservation efficiency: 94%.",
    lang === 'id' ? "[AI] Rekomendasi kemiripan Kampung Naga & Baduy berhasil disinkronkan: 94%." : "[AI] Similarity recommendations for Kampung Naga & Baduy synced: 94%.",
    lang === 'id' ? "[GIS] Ancaman urbanisasi Tana Toraja terpantau stabil rendah." : "[GIS] Urbanization threat level in Tana Toraja monitored stable low.",
    lang === 'id' ? "[AI] Pola pelestarian Tana Ulen Suku Dayak dianalisis: 92% Sangat Lestari." : "[AI] Dayak Tana Ulen preservation pattern analyzed: 92% Highly Sustainable.",
    lang === 'id' ? "[GIS] Satelit memantau kerapatan Hutan Mangrove Suku Asmat: Terjaga Baik." : "[GIS] Satellite monitors Asmat mangrove forest density: Well Preserved.",
    lang === 'id' ? "[AI] Nilai kearifan Sasak Sade terintegrasi dalam pemetaan." : "[AI] Sasak Sade wisdom values integrated in mapping.",
    lang === 'id' ? "[GIS] Hutan adat Karamaka Suku Kajang termonitor bebas dari deforestasi." : "[GIS] Suku Kajang's Karamaka sacred forest monitored free of deforestation.",
    lang === 'id' ? "[AI] Analisis kearifan lokal Arat Sabulungan Suku Mentawai terdaftar." : "[AI] Mentawai's Arat Sabulungan local wisdom analysis registered.",
    lang === 'id' ? "[GIS] Pemukiman adat Mbaru Niang Wae Rebo terpantau stabil di lereng pegunungan." : "[GIS] Wae Rebo's Mbaru Niang stilt houses monitored stable on mountain slopes.",
    lang === 'id' ? "[GIS] Indeks Kelestarian Budaya Indonesia diperbarui: 84.5% (Optimal)." : "[GIS] Indonesia Cultural Preservation Index updated: 84.5% (Optimal)."
  ];

  // AI query handler
  const handleAISuggestion = (queryText: string) => {
    submitAIQuery(queryText);
  };

  // Filter application
  const filtered = cultures.filter(c => {
    const matchCategory = activeFilter === 'all' || c.type === activeFilter;
    const matchRegion = regionFilter === 'all' || c.region === regionFilter;
    const matchSustain = c.sustainability >= sustainabilityMin;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase()) ||
      c.descEn.toLowerCase().includes(search.toLowerCase()) ||
      c.envPractice.toLowerCase().includes(search.toLowerCase()) ||
      c.envPracticeEn.toLowerCase().includes(search.toLowerCase()) ||
      c.wayOfLife.toLowerCase().includes(search.toLowerCase()) ||
      c.wayOfLifeEn.toLowerCase().includes(search.toLowerCase()) ||
      c.philosophy.toLowerCase().includes(search.toLowerCase()) ||
      c.philosophyEn.toLowerCase().includes(search.toLowerCase());
    
    // Layer filters
    let matchLayer = false;
    if (c.type === 'tradisi' && showLayerBudaya) matchLayer = true;
    if (c.type === 'ritual' && showLayerKearifan) matchLayer = true;
    if (c.type === 'lingkungan' && showLayerLingkungan) matchLayer = true;

    return matchCategory && matchRegion && matchSustain && matchSearch && matchLayer;
  });

  // Close details panel when selected item gets filtered out
  useEffect(() => {
    if (selected && !filtered.some(c => c.id === selected.id) && !storyActive && !activeTrail) {
      setSelected(null);
    }
  }, [activeFilter, regionFilter, sustainabilityMin, search, showLayerBudaya, showLayerKearifan, showLayerLingkungan, storyActive, activeTrail, selected]);

  // Dynamic AI similarity recommendation calculations
  const getAIRecommendation = (currentId: string) => {
    if (currentId === 'baduy') {
      return {
        targetId: 'naga',
        targetName: 'Kampung Naga',
        score: 94,
        reasonId: 'Memiliki kesamaan adat Sunda yang ketat dalam menolak listrik, melarang eksploitasi semen, dan memiliki kawasan Hutan Larangan suci.',
        reasonEn: 'Shares strict Sundanese custom of rejecting electricity, banning cement, and protecting a sacred Forbidden Forest.'
      };
    } else if (currentId === 'naga') {
      return {
        targetId: 'baduy',
        targetName: 'Suku Baduy',
        score: 94,
        reasonId: 'Sama-sama memegang adat Sunda Wiwitan/Kuno, melarang aliran listrik di permukiman adat, dan memelihara ekosistem sungai secara alami.',
        reasonEn: 'Both hold ancient Sundanese beliefs, prohibit electricity in customary zones, and naturally preserve river ecosystems.'
      };
    } else if (currentId === 'bali') {
      return {
        targetId: 'minang',
        targetName: 'Minangkabau',
        score: 80,
        reasonId: 'Menerapkan tata kelola sumber daya komunal yang dikontrol ketat oleh tetua adat (Subak vs Tanah Ulayat) demi melestarikan lahan tani keluarga.',
        reasonEn: 'Implements communal resource management strictly controlled by custom (Subak vs Tanah Ulayat) to preserve family farmland.'
      };
    } else if (currentId === 'dayak') {
      return {
        targetId: 'asmat',
        targetName: 'Suku Asmat',
        score: 88,
        reasonId: 'Sama-sama memiliki sistem perlindungan hutan komunal berskala besar (Tana\' Ulen vs Mangrove Adat) serta ketergantungan spiritual pada roh hutan.',
        reasonEn: 'Both feature large-scale communal forest protection (Tana\' Ulen vs Adat Mangrove) and share spiritual dependency on forest spirits.'
      };
    } else if (currentId === 'asmat') {
      return {
        targetId: 'dayak',
        targetName: 'Suku Dayak Kenyah',
        score: 88,
        reasonId: 'Berbagi ikatan spiritual mendalam pada pohon pelindung dan hutan rimba Kalimantan/Papua sebagai penyangga utama kehidupan komunal mereka.',
        reasonEn: 'Shares deep spiritual bonds with protective forest canopies in Borneo/Papua as primary pillars of their communal life.'
      };
    } else if (currentId === 'toraja') {
      return {
        targetId: 'sasak',
        targetName: 'Suku Sasak Sade',
        score: 82,
        reasonId: 'Memiliki kesamaan dalam pelestarian arsitektur rumah adat berbahan serat organik alami serta ritual perkumpulan komunal leluhur.',
        reasonEn: 'Shares similarities in preserving customary house architectures built from natural organic fibers and ancestral communal ceremonies.'
      };
    } else if (currentId === 'sasak') {
      return {
        targetId: 'toraja',
        targetName: 'Masyarakat Toraja',
        score: 82,
        reasonId: 'Kemiripan tinggi dalam pelestarian anyaman adat serta arsitektur tahan gempa berbahan bambu/jerami tradisional.',
        reasonEn: 'High similarity in custom weaving preservation and earthquake-resistant bamboo/thatch customary architectures.'
      };
    } else if (currentId === 'kajang') {
      return {
        targetId: 'baduy',
        targetName: 'Suku Baduy',
        score: 95,
        reasonId: 'Memiliki kesamaan dalam pelestarian hutan adat suci secara ketat, menolak teknologi modern/listrik, dan berpakaian adat sangat sederhana.',
        reasonEn: 'Shares strict sacred forest preservation, rejects modern technology/electricity, and wears highly simple customary attire.'
      };
    } else if (currentId === 'mentawai') {
      return {
        targetId: 'asmat',
        targetName: 'Suku Asmat',
        score: 89,
        reasonId: 'Kemiripan dalam ikatan spiritual dengan roh hutan (Arat Sabulungan vs roh Jew) serta pelestarian seni tradisional sakral.',
        reasonEn: 'High similarity in spiritual bonds with forest spirits (Arat Sabulungan vs Jew spirits) and sacred traditional art preservation.'
      };
    } else if (currentId === 'waerebo') {
      return {
        targetId: 'sumba',
        targetName: 'Kampung Tarung Sumba',
        score: 88,
        reasonId: 'Sama-sama melestarikan arsitektur rumah adat tinggi berbahan serat alam organik serta tradisi komunal musyawarah adat di NTT.',
        reasonEn: 'Both preserve high customary house architectures made of organic natural fibers and communal decision customs in NTT.'
      };
    } else if (currentId === 'sumba') {
      return {
        targetId: 'waerebo',
        targetName: 'Masyarakat Wae Rebo',
        score: 88,
        reasonId: 'Sama-sama merepresentasikan kearifan arsitektur organik tradisional khas NTT serta pewarnaan tenun pusaka berbahan alami.',
        reasonEn: 'Both represent traditional organic architectural wisdom of NTT and dye sacred weaving with natural materials.'
      };
    } else if (currentId === 'dani') {
      return {
        targetId: 'dayak',
        targetName: 'Suku Dayak Kenyah',
        score: 86,
        reasonId: 'Sama-sama menerapkan pola pemukiman adat berkelompok (Honai vs Rumah Betang) serta sistem pertanian/perkebunan komunal.',
        reasonEn: 'Both apply clustered customary settlements (Honai vs Rumah Betang) and communal farming/gardening systems.'
      };
    } else {
      return {
        targetId: 'bali',
        targetName: 'Subak Ubud Bali',
        score: 80,
        reasonId: 'Konsep pemanfaatan alam yang terorganisir tanpa merusak ekosistem (Subak) mirip dengan prinsip belajar dari alam Minangkabau.',
        reasonEn: 'The concept of organized utilization of nature without ruining ecosystems (Subak) is similar to the Minangkabau principle of learning from nature.'
      };
    }
  };

  // Story step action execution
  const handleStoryChoice = (eco: number, trad: number, spr: number, feedback: string, feedbackEn: string) => {
    setEcoScore(prev => Math.min(100, Math.max(0, prev + eco)));
    setTradScore(prev => Math.min(100, Math.max(0, prev + trad)));
    setSprScore(prev => Math.min(100, Math.max(0, prev + spr)));
    setStoryFeedback(feedback);
    setStoryFeedbackEn(feedbackEn);
  };

  // Transition to next story step
  const handleNextStory = () => {
    setStoryFeedback(null);
    setStoryFeedbackEn(null);
    const nextStep = storyStep + 1;
    setStoryStep(nextStep);
    
    if (nextStep < storyScenarios.length) {
      triggerMapFly([storyScenarios[nextStep].lat, storyScenarios[nextStep].lng], storyScenarios[nextStep].zoom);
    } else {
      // Game over/ending step
      triggerMapFly([-6.6119, 106.2625], 12);
    }
  };

  // Reset Story Game
  const resetStory = () => {
    setStoryStep(0);
    setEcoScore(50);
    setTradScore(50);
    setSprScore(50);
    setStoryFeedback(null);
    setStoryFeedbackEn(null);
    triggerMapFly([storyScenarios[0].lat, storyScenarios[0].lng], storyScenarios[0].zoom);
  };

  // Trigger Story Mode activation
  const toggleStoryMode = () => {
    if (!storyActive) {
      setStoryActive(true);
      setCompareMode(false);
      setSelected(null);
      // Set to first story coordinates
      triggerMapFly([storyScenarios[0].lat, storyScenarios[0].lng], storyScenarios[0].zoom);
    } else {
      setStoryActive(false);
      triggerMapFly([-2.5489, 118.0149], 5);
    }
  };

  // Scroll and highlight VR/AR
  const handleVRClick = () => {
    setSelected(null);
    const labSection = document.getElementById('lab');
    if (labSection) {
      labSection.scrollIntoView({ behavior: 'smooth' });
      // Trigger temporary glowing outline or focus on VR cards
      const vrButton = document.querySelector('[href="#lab"]');
      if (vrButton) {
        (vrButton as HTMLElement).click();
      }
    }
  };

  // Calculate story ending medal & branching report details
  const getStoryMedal = () => {
    const finalScore = Math.round((ecoScore + tradScore + sprScore) / 3);
    
    // Branching badge title based on individual highest scores
    let badgeId = 'Pengembara Harmoni';
    let badgeEn = 'Harmony Nomad';
    let descId = 'Kamu berhasil mengimbangi seluruh aspek kearifan lokal. Pikirkan bagaimana nilai kelestarian Terranesia bisa kamu bawa pulang ke perkotaan modern!';
    let descEn = 'You successfully balanced all aspects of local wisdom. Think about how you can carry Terranesia preservation values back to modern urban environments!';

    if (ecoScore >= 75 && ecoScore >= tradScore && ecoScore >= sprScore) {
      badgeId = 'Duta Hijau Utama (Eco Ambassador)';
      badgeEn = 'Eco Ambassador';
      descId = 'Kesadaran ekologi kamu sangat tinggi! Memilih menolak botol plastik dan menggunakan energi terbarukan kayu bakar kering menunjukkan komitmen pelestarian yang luar biasa.';
      descEn = 'Your ecological awareness is outstanding! Choosing to reject plastic bottles and helping with dry firewood indicates a tremendous conservation commitment.';
    } else if (tradScore >= 75 && tradScore >= ecoScore && tradScore >= sprScore) {
      badgeId = 'Penjaga Adat Sakral (Custom Custodian)';
      badgeEn = 'Custom Custodian';
      descId = 'Hormat setinggi-tingginya pada adat! Kepatuhan penuh kamu terhadap hukum adat Pikukuh di sungai dan desa menunjukkan rasa hormat mendalam pada leluhur.';
      descEn = 'Highest respect to customs! Your absolute compliance with Pikukuh customary laws in the river and village shows deep respect for ancestral rules.';
    } else if (sprScore >= 75 && sprScore >= ecoScore && sprScore >= tradScore) {
      badgeId = 'Ksatria Spiritual (Spiritual Knight)';
      badgeEn = 'Spiritual Knight';
      descId = 'Sensitivitas spiritual kamu sangat istimewa! Menikmati keheningan malam dan menghargai ritus sungai menjalin hubungan batin yang kuat dengan alam Nusantara.';
      descEn = 'Your spiritual sensitivity is exceptional! Enjoying the quiet night and valuing river rites forged a strong inner connection with Nusantara nature.';
    }

    if (finalScore >= 80) {
      return {
        medalId: 'Medali Emas 🥇',
        medalEn: 'Gold Medal 🥇',
        badgeId,
        badgeEn,
        descId,
        descEn,
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/30'
      };
    } else if (finalScore >= 60) {
      return {
        medalId: 'Medali Perak 🥈',
        medalEn: 'Silver Medal 🥈',
        badgeId,
        badgeEn,
        descId,
        descEn,
        color: 'text-slate-400 bg-slate-400/10 border-slate-400/30'
      };
    } else {
      return {
        medalId: 'Medali Perunggu 🥉',
        medalEn: 'Bronze Medal 🥉',
        badgeId: 'Wisatawan Pemula (Eco Tourist)',
        badgeEn: 'Eco Tourist',
        descId: 'Masih banyak kearifan lokal yang bisa dipelajari. Cobalah untuk lebih menghargai alam dan mematuhi tata tertib adat pada perjalanan berikutnya!',
        descEn: 'There is still a lot of local wisdom to learn. Try to value nature more and obey customary rules on your next journey!',
        color: 'text-amber-800 bg-amber-800/10 border-amber-800/30'
      };
    }
  };

  // Radar overlapping data processing
  const combinedRadarData = useMemo(() => {
    return leftCulture.radarData.map((leftVal, index) => {
      const rightVal = rightCulture.radarData[index];
      return {
        subject: translateSubject(leftVal.subject, lang),
        leftValue: leftVal.value,
        rightValue: rightVal.value,
      };
    });
  }, [leftCulture, rightCulture, lang]);

  // Calculate dynamic similarity match score
  const diffs = leftCulture.radarData.map((d, idx) => Math.abs(d.value - rightCulture.radarData[idx].value));
  const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  const matchScore = Math.round(100 - avgDiff);

  return (
    <section id="jelajah" className="py-20 relative bg-background overflow-hidden border-b border-border">
      
      {/* Custom Green Thematic map styles injected dynamically */}
      <style>{`
        .custom-map-filter .leaflet-tile-container {
          filter: ${isDark 
            ? 'grayscale(80%) invert(100%) hue-rotate(110deg) saturate(95%) brightness(90%) contrast(95%)' 
            : 'sepia(18%) saturate(125%) hue-rotate(75deg) contrast(95%) brightness(98%)'};
        }
        .leaflet-container {
          background-color: ${isDark ? '#0D1B14' : '#F7F3EE'} !important;
        }
      `}</style>

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4 font-semibold tracking-wide">
            <Compass className="w-4 h-4 animate-spin-slow" />
            Interactive Web GIS Dashboard
          </div>
          <h2 className="text-foreground text-4xl mb-3">{tx.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">{tx.sub}</p>
        </motion.div>

        {/* Advanced AI Command Center Console */}
        <div className="mt-8 max-w-3xl mx-auto bg-card/60 backdrop-blur-md border border-border rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              <h3 className="text-foreground text-sm font-bold tracking-tight">{tx.aiConsoleTitle}</h3>
            </div>
            <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded px-2 py-0.5 font-mono uppercase tracking-wider">
              {aiConsoleStatus === 'idle' ? 'STANDBY' : aiConsoleStatus === 'scanning' ? 'SCANNING' : 'ONLINE'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={aiConsoleInput}
              onChange={e => setAiConsoleInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitAIQuery(aiConsoleInput)}
              placeholder={tx.aiConsolePlaceholder}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
            />
            <button
              onClick={() => submitAIQuery(aiConsoleInput)}
              disabled={aiConsoleStatus === 'scanning'}
              className="px-6 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            >
              <Compass className="w-4 h-4 animate-spin-slow" />
              {tx.aiExecute}
            </button>
          </div>

          {/* AI suggestion chips inside the console */}
          <div className="flex flex-wrap gap-2 pt-1.5 items-center">
            <span className="text-[10px] font-bold text-muted-foreground mr-1 uppercase tracking-wider">{tx.suggestionTitle}</span>
            {[
              { labelId: '🌿 Kelestarian Hutan', labelEn: '🌿 Forest Conservation', query: 'Tampilkan budaya pelestari hutan' },
              { labelId: '👩‍👧 Matrilineal Minang', labelEn: '👩‍👧 Matrilineal Minang', query: 'Budaya matrilineal seperti Minang' },
              { labelId: '💧 Penjaga Air Baduy', labelEn: '💧 Baduy Water Guardians', query: 'Bagaimana Suku Baduy menjaga air?' },
              { labelId: '🌊 Pengembara Laut Bajo', labelEn: '🌊 Bajo Sea Nomads', query: 'Suku Sama Bajo penjaga laut' }
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => submitAIQuery(chip.query)}
                disabled={aiConsoleStatus === 'scanning'}
                className="px-3 py-1.5 rounded-xl text-[10px] bg-muted hover:bg-primary/10 border border-border hover:border-primary/30 text-foreground transition-all duration-300 font-medium cursor-pointer"
              >
                {lang === 'id' ? chip.labelId : chip.labelEn}
              </button>
            ))}
          </div>

          {/* Terminal Console Logs Display */}
          {(aiConsoleLogs.length > 0 || aiConsoleStatus === 'scanning' || aiConsoleResult) && (
            <div className="bg-black/90 rounded-2xl p-4 border border-emerald-500/20 font-mono text-xs space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-emerald-400 border-b border-emerald-500/20 pb-2">
                <span>SYSTEM LOGS - SENTINEL-2 LINK</span>
                <span className="animate-pulse">● LIVE</span>
              </div>
              <div className="space-y-1.5 text-emerald-500/90 max-h-32 overflow-y-auto">
                {aiConsoleLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[9px] text-emerald-600 flex-shrink-0 mt-0.5">❯</span>
                    <span>{log}</span>
                  </div>
                ))}
                {aiConsoleStatus === 'scanning' && (
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                    <span>Processing data stream...</span>
                  </div>
                )}
              </div>

              {/* Console scan results block */}
              {aiConsoleStatus === 'complete' && aiConsoleResult && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3.5 space-y-3 text-foreground"
                >
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {lang === 'id' ? aiConsoleResult.titleId : aiConsoleResult.titleEn}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {lang === 'id' ? aiConsoleResult.descId : aiConsoleResult.descEn}
                  </p>
                  <div className="grid grid-cols-3 gap-2 border-t border-emerald-500/10 pt-3">
                    {aiConsoleResult.stats.map((stat, sIdx) => (
                      <div key={sIdx} className="bg-background/40 border border-border/40 p-2 rounded-lg text-center">
                        <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">{stat.label}</div>
                        <div className="text-[11px] font-bold text-foreground mt-0.5">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="bg-card/50 backdrop-blur-md border border-border rounded-3xl p-5 mt-8 shadow-xl flex flex-col gap-4">
          <div className="grid md:grid-cols-3 gap-4 items-center">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={tx.search}
                className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Region Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">{lang === 'id' ? 'Pulau:' : 'Island:'}</span>
              <select
                value={regionFilter}
                onChange={e => setRegionFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
              >
                <option value="all">{tx.allRegions}</option>
                <option value="jawa">Jawa / Java</option>
                <option value="sumatera">Sumatera / Sumatra</option>
                <option value="kalimantan">Kalimantan / Borneo</option>
                <option value="sulawesi">Sulawesi</option>
                <option value="bali">Bali</option>
                <option value="papua">Papua</option>
                <option value="nusatenggara">Nusa Tenggara</option>
              </select>
            </div>

            {/* Sustainability Slider */}
            <div className="flex flex-col gap-1.5 px-1">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>{tx.sustainability}</span>
                <span className="text-primary font-bold">{sustainabilityMin}% +</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={sustainabilityMin}
                onChange={e => setSustainabilityMin(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary border border-border"
              />
            </div>
          </div>

          {/* Categories Toggle & Mode Switchers */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-border pt-4 mt-1">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-xs font-semibold text-muted-foreground mr-1">{tx.filter}:</span>
              {['all', 'tradisi', 'ritual', 'lingkungan'].map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    activeFilter === f
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                      : 'bg-background border border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {tx[f as keyof typeof tx] || f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Expedition Trail Selector */}
              <select
                value={activeTrail || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setActiveTrail(val ? val : null);
                  setCompareMode(false);
                  setStoryActive(false);
                  setSelected(null);
                  if (val) {
                    const trail = expeditionTrails.find(t => t.id === val);
                    if (trail) {
                      const points = trail.cultures.map(cId => {
                        const c = cultures.find(cult => cult.id === cId);
                        return c ? [c.lat, c.lng] as [number, number] : null;
                      }).filter((p): p is [number, number] => p !== null);
                      triggerMapFly([-2.5489, 118.0149], 5, points);
                    }
                  }
                }}
                className="px-3 py-2 rounded-full text-xs font-semibold bg-background border border-border text-muted-foreground hover:border-primary/45 focus:outline-none cursor-pointer transition-all shadow-sm"
              >
                <option value="">{lang === 'id' ? '🧭 Rute Ekspedisi (None)' : '🧭 Expedition Route (None)'}</option>
                {expeditionTrails.map(trail => (
                  <option key={trail.id} value={trail.id}>
                    {lang === 'id' ? trail.nameId : trail.nameEn}
                  </option>
                ))}
              </select>

              {/* Compare Mode Toggle */}
              <button
                onClick={() => {
                  setCompareMode(!compareMode);
                  setStoryActive(false);
                  setActiveTrail(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm cursor-pointer ${
                  compareMode
                    ? 'bg-accent text-accent-foreground border border-accent/25'
                    : 'bg-background border border-border text-muted-foreground hover:border-accent/40'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                {tx.compare}
              </button>

              {/* Story Mode Toggle */}
              <button
                onClick={toggleStoryMode}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm cursor-pointer ${
                  storyActive
                    ? 'bg-emerald-600 text-white border border-emerald-500/20'
                    : 'bg-background border border-border text-muted-foreground hover:border-emerald-500/40'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                {tx.story}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12">
        <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl bg-muted" style={{ height: 520 }}>
          
          {/* Leaflet Map with class applying our Custom CSS hue filter */}
          <MapContainer 
            center={[-2.5489, 118.0149]} 
            zoom={5} 
            zoomControl={false}
            style={{ height: '100%', width: '100%' }}
            className="z-0 custom-map-filter"
          >
            {/* Tile Layer loaded dynamically based on app theme */}
            <TileLayer
              key={mapStyleKey}
              url={mapStyles[mapStyleKey]}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            {/* Custom Zoom Controls */}
            <ZoomControls />

            {/* Map Style Selector Overlay */}
            <div className="absolute top-4 right-4 z-[999] bg-card/90 backdrop-blur-md border border-border rounded-2xl p-2.5 shadow-xl flex gap-1.5">
              {[
                { key: 'light', labelId: 'Terang', labelEn: 'Light', icon: '☀️' },
                { key: 'dark', labelId: 'Gelap', labelEn: 'Dark', icon: '🌙' },
                { key: 'satellite', labelId: 'Satelit', labelEn: 'Satellite', icon: '📡' },
                { key: 'terrain', labelId: 'Topografi', labelEn: 'Terrain', icon: '🏔️' }
              ].map(style => (
                <button
                  key={style.key}
                  onClick={() => setMapStyleKey(style.key as any)}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                    mapStyleKey === style.key 
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                      : 'bg-background hover:bg-muted text-muted-foreground border-border'
                  }`}
                  title={lang === 'id' ? style.labelId : style.labelEn}
                >
                  <span>{style.icon}</span>
                  <span className="hidden sm:inline">{lang === 'id' ? style.labelId : style.labelEn}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Map Fly-to Controller */}
            <MapController target={mapTarget} />

            {/* Render Polyline for Active Expedition Trail */}
            {activeTrail && trailPoints.length > 0 && (
              <Polyline 
                positions={trailPoints} 
                pathOptions={{ 
                  color: activeTrailData?.color || '#10B981', 
                  weight: 4, 
                  dashArray: '8, 8',
                  lineJoin: 'round'
                }} 
              />
            )}

            {/* Render Markers for Expedition Trail (Only if Active) */}
            {activeTrail && activeTrailData && activeTrailData.cultures.map((cId) => {
              const c = cultures.find(cult => cult.id === cId);
              if (!c) return null;
              return (
                <Marker
                  key={c.id}
                  position={[c.lat, c.lng]}
                  icon={createCustomIcon(c.type, selected?.id === c.id)}
                  eventHandlers={{
                    click: () => {
                      setSelected(c);
                      triggerMapFly([c.lat, c.lng], 7);
                    }
                  }}
                />
              );
            })}

            {/* Render Markers for filtered cultures (Only if Story Mode & Trail Mode are INACTIVE) */}
            {!storyActive && !activeTrail && filtered.map((c) => (
              <Marker
                key={c.id}
                position={[c.lat, c.lng]}
                icon={createCustomIcon(c.type, selected?.id === c.id)}
                eventHandlers={{
                  click: () => {
                    setSelected(c);
                    triggerMapFly([c.lat, c.lng], 7);
                  }
                }}
              />
            ))}

            {/* Render Marker for Active Story Scenario */}
            {storyActive && storyStep < storyScenarios.length && (
              <Marker
                position={[storyScenarios[storyStep].lat, storyScenarios[storyStep].lng]}
                icon={createCustomIcon('lingkungan', true)}
              />
            )}
          </MapContainer>

          {/* Layer Control Panel Overlay (Only if Story Mode is INACTIVE) */}
          {!storyActive && (
            <div className="absolute top-4 left-4 z-[999] bg-card/90 backdrop-blur-md border border-border rounded-2xl p-4 shadow-xl max-w-xs flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground border-b border-border pb-2 mb-0.5">
                <Sliders className="w-3.5 h-3.5 text-primary" />
                {tx.layers}
              </div>
              <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer font-medium select-none">
                <input
                  type="checkbox"
                  checked={showLayerBudaya}
                  onChange={e => setShowLayerBudaya(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4 bg-muted border-border cursor-pointer"
                />
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: typeColors.tradisi }} />
                {tx.tradisi}
              </label>
              <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer font-medium select-none">
                <input
                  type="checkbox"
                  checked={showLayerKearifan}
                  onChange={e => setShowLayerKearifan(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4 bg-muted border-border cursor-pointer"
                />
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: typeColors.ritual }} />
                {tx.ritual}
              </label>
              <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer font-medium select-none">
                <input
                  type="checkbox"
                  checked={showLayerLingkungan}
                  onChange={e => setShowLayerLingkungan(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4 bg-muted border-border cursor-pointer"
                />
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: typeColors.lingkungan }} />
                {tx.lingkungan}
              </label>
            </div>
          )}

          {/* GIS Real-time Monitor dashboard overlay (Left side overlay) */}
          {!storyActive && (
            <div className="absolute bottom-14 left-4 z-[999] bg-card/90 backdrop-blur-md border border-border rounded-2xl p-4 shadow-xl w-64 flex flex-col gap-2 tracking-tight">
              <div className="flex items-center justify-between text-xs font-bold text-foreground border-b border-border pb-2 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  🌍 GIS Real-Time Monitor
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-mono">v1.2</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">{lang === 'id' ? 'Pelestarian Nasional:' : 'Nat. Preservation:'}</span>
                <span className="text-primary font-bold">84.5%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-1">
                <div className="h-full bg-primary" style={{ width: '84.5%' }} />
              </div>
              
              {/* Rotating GIS Live log ticker */}
              <div className="mt-1 pt-2 border-t border-border/50">
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                  Live Satellite Stream
                </div>
                <div className="h-9 overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tickerIndex}
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -15, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-[10px] text-muted-foreground leading-normal flex items-start gap-1 font-mono font-medium"
                    >
                      <Info className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                      <span>{tickers[tickerIndex]}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Story Panel (Overlaying Map on Left) */}
          <AnimatePresence>
            {storyActive && (
              <motion.div
                initial={{ x: -350, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -350, opacity: 0 }}
                className="absolute left-4 top-4 bottom-4 z-[999] w-[350px] bg-card/95 backdrop-blur-md border border-border rounded-3xl p-5 shadow-2xl flex flex-col justify-between overflow-y-auto"
              >
                {/* Story Header */}
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Compass className="w-5 h-5 text-emerald-500" />
                      <h3 className="text-foreground text-sm font-bold tracking-tight">{tx.storyTitle}</h3>
                    </div>
                    <button
                      onClick={() => setStoryActive(false)}
                      className="w-7 h-7 rounded-full hover:bg-muted text-muted-foreground flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Baduy Custom Gauges */}
                  <div className="space-y-2 mb-4 bg-primary/5 border border-primary/10 rounded-2xl p-3">
                    {/* Eco Score */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                        <span>🌿 {tx.ecoScore}</span>
                        <span className="text-emerald-500 font-bold">{ecoScore}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${ecoScore}%` }} />
                      </div>
                    </div>
                    {/* Custom Score */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                        <span>📜 {tx.tradScore}</span>
                        <span className="text-amber-500 font-bold">{tradScore}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${tradScore}%` }} />
                      </div>
                    </div>
                    {/* Spiritual Score */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                        <span>✨ {tx.sprScore}</span>
                        <span className="text-purple-500 font-bold">{sprScore}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${sprScore}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Active Step Scenario Content */}
                  {storyStep < storyScenarios.length ? (
                    <div className="space-y-4">
                      <div className="relative h-28 rounded-xl overflow-hidden border border-border shadow-inner">
                        <img 
                          src={storyScenarios[storyStep].image} 
                          alt="Scenario Scene" 
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-2 left-2 text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-black/60 rounded px-2 py-0.5 border border-emerald-500/30">
                          {lang === 'id' ? `TANTANGAN ${storyStep + 1} / 4` : `CHALLENGE ${storyStep + 1} / 4`}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-foreground text-sm font-bold mb-1.5">
                          {lang === 'id' ? storyScenarios[storyStep].titleId : storyScenarios[storyStep].titleEn}
                        </h4>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          {lang === 'id' ? storyScenarios[storyStep].descId : storyScenarios[storyStep].descEn}
                        </p>
                      </div>

                      {/* Decision choices */}
                      {!storyFeedback ? (
                        <div className="space-y-2 pt-2">
                          {storyScenarios[storyStep].choices.map((c, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => handleStoryChoice(c.ecoEffect, c.tradEffect, c.sprEffect, c.feedbackId, c.feedbackEn)}
                              className="w-full text-left p-3 text-xs bg-muted/60 hover:bg-primary/10 border border-border hover:border-primary/30 rounded-xl transition-all duration-300 flex items-start gap-2 active:scale-98 cursor-pointer text-foreground leading-relaxed"
                            >
                              <span className="font-semibold text-primary">{String.fromCharCode(65 + cIdx)}.</span>
                              <span>{lang === 'id' ? c.textId : c.textEn}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        /* Choice feedback panel */
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col gap-3"
                        >
                          <div className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-foreground leading-relaxed">
                              {lang === 'id' ? storyFeedback : storyFeedbackEn}
                            </div>
                          </div>
                          <button
                            onClick={handleNextStory}
                            className="w-full py-2 bg-primary hover:opacity-90 text-primary-foreground text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-opacity cursor-pointer shadow-md"
                          >
                            <span>{lang === 'id' ? 'Lanjutkan Perjalanan' : 'Continue Journey'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    /* Final Story Result / Ending with Medals */
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center space-y-4 py-4"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Award className="w-10 h-10 text-amber-500 animate-bounce" />
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold border ${getStoryMedal().color}`}>
                          {lang === 'id' ? getStoryMedal().medalId : getStoryMedal().medalEn}
                        </div>
                        <div className="text-xs font-extrabold text-foreground mt-1.5">
                          {lang === 'id' ? getStoryMedal().badgeId : getStoryMedal().badgeEn}
                        </div>
                      </div>
                      <h4 className="text-foreground text-xs font-bold">{tx.congratulations}</h4>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        {lang === 'id' ? getStoryMedal().descId : getStoryMedal().descEn}
                      </p>
                      
                      <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 text-left space-y-2">
                        <div className="text-xs font-semibold text-center border-b border-border pb-1.5 mb-1.5 text-foreground">
                          {lang === 'id' ? 'RINGKASAN SKOR AKHIR' : 'FINAL SCORE SUMMARY'}
                        </div>
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-emerald-500">🌿 {tx.ecoScore}:</span>
                          <span className="text-foreground">{ecoScore}/100</span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-amber-500">📜 {tx.tradScore}:</span>
                          <span className="text-foreground">{tradScore}/100</span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-purple-500">✨ {tx.sprScore}:</span>
                          <span className="text-foreground">{sprScore}/100</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Reset or Exit Buttons */}
                {storyStep < storyScenarios.length ? (
                  <button
                    onClick={resetStory}
                    className="mt-4 w-full py-2 bg-muted hover:bg-muted-foreground/10 text-foreground text-xs font-bold rounded-xl border border-border flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {tx.storyRestart}
                  </button>
                ) : (
                  <div className="flex gap-2.5 mt-4">
                    <button
                      onClick={resetStory}
                      className="flex-1 py-2 bg-muted hover:bg-muted-foreground/10 text-foreground text-xs font-bold rounded-xl border border-border flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      {tx.storyRestart}
                    </button>
                    <button
                      onClick={() => setStoryActive(false)}
                      className="flex-1 py-2 bg-primary hover:opacity-90 text-primary-foreground text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      {lang === 'id' ? 'Kembali ke Peta' : 'Back to Map'}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expedition Trail Panel (Overlaying Map on Left) */}
          <AnimatePresence>
            {activeTrail && activeTrailData && (
              <motion.div
                initial={{ x: -350, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -350, opacity: 0 }}
                className="absolute left-4 top-4 bottom-4 z-[999] w-[350px] bg-card/95 backdrop-blur-md border border-border rounded-3xl p-5 shadow-2xl flex flex-col justify-between overflow-y-auto"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-primary animate-pulse" />
                      <h3 className="text-foreground text-sm font-bold tracking-tight">
                        {lang === 'id' ? activeTrailData.nameId : activeTrailData.nameEn}
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTrail(null)}
                      className="w-7 h-7 rounded-full hover:bg-muted text-muted-foreground flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                    {lang === 'id' ? activeTrailData.descId : activeTrailData.descEn}
                  </p>

                  <div className="px-3.5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{activeTrailData.carbonSave}</span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {lang === 'id' ? 'RUTE PERJALANAN / ITINERARY' : 'EXPEDITION ITINERARY'}
                    </div>

                    <div className="space-y-3 border-l border-border/80 pl-4 ml-2 relative">
                      {activeTrailData.cultures.map((cId, idx) => {
                        const c = cultures.find(cult => cult.id === cId);
                        if (!c) return null;
                        const isCurrentSelected = selected?.id === cId;
                        return (
                          <div 
                            key={cId} 
                            onClick={() => {
                              setSelected(c);
                              triggerMapFly([c.lat, c.lng], 8);
                            }}
                            className={`group cursor-pointer text-left transition-all ${
                              isCurrentSelected ? 'text-primary font-bold' : 'hover:text-primary text-foreground/80'
                            }`}
                          >
                            <div className="relative">
                              {/* Circle indicator on the left line */}
                              <div className={`absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full border bg-card transition-colors ${
                                isCurrentSelected 
                                  ? 'border-primary bg-primary scale-125' 
                                  : 'border-border group-hover:border-primary/60'
                              }`} />
                              <div className="text-xs font-bold flex items-center gap-1.5">
                                <span>{idx + 1}. {lang === 'id' ? c.name : c.nameEn}</span>
                              </div>
                              <div className="text-[10px] text-muted-foreground mt-0.5 leading-normal">
                                {c.location} • {lang === 'id' ? c.regionLabel : c.regionLabelEn}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expedition Logistics Checklist */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-card border border-border space-y-2.5">
                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      {lang === 'id' ? 'LOGISTIK & PERLENGKAPAN ADAT' : 'LOGISTICS & ECO-EQUIPMENT'}
                    </div>
                    <div className="space-y-1.5 text-[11px] text-muted-foreground font-medium">
                      {activeTrail === 'conservation' ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-500">✓</span>
                            <span>{lang === 'id' ? 'Botol Air Bambu / Tumbler Ramah Lingkungan' : 'Bamboo Water Flask / Eco Tumbler'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-500">✓</span>
                            <span>{lang === 'id' ? 'Kantong Tas Serat Daun Pandan (Kojong)' : 'Pandan Leaf fiber backpack (Kojong)'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-500">✓</span>
                            <span>{lang === 'id' ? 'Pakaian warna hitam/gelap polos' : 'Plain black/dark attire'}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-purple-500">✓</span>
                            <span>{lang === 'id' ? 'Kain Tenun Adat Penghormatan' : 'Customary Woven Respect Scarf'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-purple-500">✓</span>
                            <span>{lang === 'id' ? 'Buku Logbook Tradisional Kayu' : 'Traditional Wood Logbook'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-purple-500">✓</span>
                            <span>{lang === 'id' ? 'Perekam Audio/Video Komunal ber-izin' : 'Permitted Communal Audio/Video Recorder'}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Guidelines */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-muted/60 border border-border space-y-2">
                    <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {lang === 'id' ? 'ATURAN & TATA TERTIB' : 'ATURAN & GUIDELINES'}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {lang === 'id' ? activeTrailData.guidelinesId : activeTrailData.guidelinesEn}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTrail(null)}
                  className="mt-6 w-full py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                >
                  {lang === 'id' ? 'Selesaikan Rute' : 'Complete Expedition'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Slide-in Detail Sidebar (Google Arts & Culture style) */}
          <AnimatePresence>
            {selected && !storyActive && (
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 bottom-0 z-[1000] w-full sm:w-[420px] bg-card/95 backdrop-blur-md border-l border-border shadow-2xl flex flex-col h-full"
              >
                {/* Cover Image */}
                <div className="relative h-48 flex-shrink-0">
                  <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  
                  {/* Close button */}
                  <button 
                    onClick={() => setSelected(null)} 
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>

                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-[11px] font-bold uppercase tracking-wider bg-primary">
                    {tx[selected.type as keyof typeof tx]}
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div>
                    <h3 className="text-foreground text-2xl font-bold mb-1">{selected.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {selected.location} ({lang === 'id' ? selected.regionLabel : selected.regionLabelEn})
                    </p>
                  </div>

                  {/* Sustainability Metric */}
                  <div className="flex items-center gap-2 bg-muted/50 border border-border/50 rounded-2xl p-3">
                    <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">{tx.sustainability}:</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selected.sustainability}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                    <span className="text-xs font-extrabold text-primary">{selected.sustainability}%</span>
                  </div>

                  {/* Audio Sonification Widget */}
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary">
                        <Sparkles className="w-4 h-4" />
                        {tx.ambientSonification}
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">Web Audio Synth</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-normal">
                      {lang === 'id' 
                        ? 'Sintesis suara ambient berbasis kearifan lokal menggunakan osilator peramban Anda.' 
                        : 'Synthesizing local wisdom ambient sounds using your browser\'s oscillator system.'}
                    </p>
                    <button
                      onClick={() => {
                        if (isPlayingSoundscape) {
                          stopAmbientSoundscape();
                        } else {
                          startAmbientSoundscape(selected.type);
                        }
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                        isPlayingSoundscape 
                          ? 'bg-emerald-600 border-emerald-500 text-white animate-pulse' 
                          : 'bg-background border-border text-foreground hover:bg-muted'
                      }`}
                    >
                      {isPlayingSoundscape ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                          {lang === 'id' ? 'HENTIKAN SUARA' : 'STOP SOUNDSCAPE'}
                        </>
                      ) : (
                        <>
                          <span>🎵</span>
                          {lang === 'id' ? 'PUTAR SONIFIKASI' : 'PLAY SOUNDSCAPE'}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Eco-Weather Telemetry Sensors Widget */}
                  <div className="p-4 bg-card border border-border rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border pb-2">
                      <Sliders className="w-4 h-4 text-primary" />
                      {tx.ecoWeather}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {/* Lat Lng */}
                      <div className="bg-muted/30 p-2.5 rounded-xl border border-border/40 space-y-1 relative group">
                        <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">{tx.latitude} / {tx.longitude}</div>
                        <div className="text-[10px] font-mono font-bold text-foreground truncate">
                          {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
                        </div>
                      </div>

                      {/* Forest Density NDVI */}
                      <div className="bg-muted/30 p-2.5 rounded-xl border border-border/40 space-y-1">
                        <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">{tx.ndviForest}</div>
                        <div className="text-[11px] font-bold text-foreground flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          {selected.type === 'lingkungan' ? '0.85 - 0.98' : selected.type === 'tradisi' ? '0.70 - 0.82' : '0.78 - 0.88'}
                        </div>
                      </div>

                      {/* Temperature */}
                      <div className="bg-muted/30 p-2.5 rounded-xl border border-border/40 space-y-1">
                        <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">{tx.temperature}</div>
                        <div className="text-[11px] font-bold text-foreground">
                          {selected.region === 'papua' || selected.region === 'nusatenggara' ? '22°C - 27°C' : '26°C - 31°C'}
                        </div>
                      </div>

                      {/* Humidity */}
                      <div className="bg-muted/30 p-2.5 rounded-xl border border-border/40 space-y-1">
                        <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">{tx.humidity}</div>
                        <div className="text-[11px] font-bold text-foreground">
                          {selected.region === 'nusatenggara' ? '65% - 75%' : '80% - 92%'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cultural Description */}
                  <div>
                    <h4 className="text-xs uppercase font-extrabold text-muted-foreground tracking-wider mb-2">Deskripsi</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {lang === 'id' ? selected.desc : selected.descEn}
                    </p>
                  </div>

                  {/* Quantitative Radar Analysis */}
                  <div className="h-44 bg-muted/30 border border-border/50 rounded-3xl p-2 flex flex-col justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={selected.radarData.map(d => ({ ...d, subject: translateSubject(d.subject, lang) }))}>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: '600' }} />
                        <Radar dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* AI Recommendation Card panel */}
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                      <Sparkles className="w-4 h-4" />
                      {lang === 'id' ? 'Rekomendasi Cerdas AI Asisten' : 'Smart AI Recommendations'}
                    </div>
                    <div className="text-[10px] text-muted-foreground leading-normal">
                      {lang === 'id' ? 'Budaya serupa yang terdeteksi satelit:' : 'Satellite-detected similar culture:'}{' '}
                      <span className="font-extrabold text-foreground">{getAIRecommendation(selected.id).targetName}</span>{' '}
                      (Kemiripan: <span className="font-extrabold text-primary">{getAIRecommendation(selected.id).score}%</span>)
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic bg-background border border-border/40 p-2.5 rounded-xl">
                      {lang === 'id' ? getAIRecommendation(selected.id).reasonId : getAIRecommendation(selected.id).reasonEn}
                    </p>
                  </div>

                  {/* Qualitative Aspects */}
                  <div className="space-y-4 pt-2 border-t border-border">
                    <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {tx.qualitative}
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-muted/40 rounded-xl border border-border/50">
                        <div className="text-[10px] font-bold uppercase text-primary tracking-wider mb-1">
                          🌿 {tx.envPracticeTitle}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                          {lang === 'id' ? selected.envPractice : selected.envPracticeEn}
                        </p>
                      </div>
                      <div className="p-3 bg-muted/40 rounded-xl border border-border/50">
                        <div className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 tracking-wider mb-1">
                          🏡 {tx.wayOfLifeTitle}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                          {lang === 'id' ? selected.wayOfLife : selected.wayOfLifeEn}
                        </p>
                      </div>
                      <div className="p-3 bg-muted/40 rounded-xl border border-border/50">
                        <div className="text-[10px] font-bold uppercase text-amber-500 tracking-wider mb-1">
                          📜 {tx.philosophyTitle}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed italic font-medium">
                          {lang === 'id' ? selected.philosophy : selected.philosophyEn}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar CTA Footer */}
                <div className="p-4 border-t border-border bg-muted/20 flex gap-3 flex-shrink-0">
                  <button 
                    onClick={handleVRClick}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-95 transition-all shadow-md cursor-pointer active:scale-98"
                  >
                    <Eye className="w-4 h-4" /> {tx.vr}
                  </button>
                  <button 
                    onClick={() => setSelected(null)}
                    className="py-3 px-4 rounded-xl border border-border text-foreground text-xs font-bold hover:bg-muted transition-colors cursor-pointer"
                  >
                    {tx.close}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Simple Bottom Bar Status */}
          <div className="absolute bottom-4 left-4 z-[999] bg-black/60 backdrop-blur rounded-xl px-3 py-1.5 text-white/80 text-[10px] font-semibold border border-white/10 tracking-wide select-none">
            {filtered.length} {lang === 'id' ? 'kebudayaan terpetakan' : 'cultures mapped'}
          </div>
        </div>
      </div>

      {/* Comparison Mode Visualizer */}
      <AnimatePresence>
        {compareMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-10"
          >
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-4 gap-3">
                <h3 className="text-foreground text-xl flex items-center gap-2 font-bold">
                  <ArrowLeftRight className="w-5 h-5 text-accent" />
                  {tx.compareTitle}
                </h3>
                {/* Advanced dynamic comparison match score */}
                <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2 text-xs font-extrabold text-primary">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                  <span>Kecocokan Filosofis AI: {matchScore}%</span>
                </div>
              </div>

              {/* Dropdown Selectors */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: compareLeft, setter: setCompareLeft, label: tx.selectLeft },
                  { value: compareRight, setter: setCompareRight, label: tx.selectRight },
                ].map(({ value, setter, label }, idx) => (
                  <div key={idx}>
                    <label className="text-xs font-bold text-muted-foreground mb-2 block">{label}</label>
                    <select
                      value={value}
                      onChange={e => setter(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-muted border border-border text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-semibold cursor-pointer"
                    >
                      {cultures.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {/* Grid: Overlapping Radar Chart & Qualitative Aspect Table */}
              <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Overlapping Radar Chart (Left 5 Columns) */}
                <div className="lg:col-span-5 bg-muted/20 border border-border/40 rounded-3xl p-4 flex flex-col justify-center min-h-[300px]">
                  <div className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-widest text-center mb-3">
                    Diagram Perbandingan Indeks Adat (Overlaid)
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={combinedRadarData}>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: '700' }} />
                        <Radar name={leftCulture.name} dataKey="leftValue" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.25} />
                        <Radar name={rightCulture.name} dataKey="rightValue" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11, fontWeight: '700', color: 'var(--foreground)' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Qualitative side-by-side aspects (Right 7 Columns) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="text-xs font-bold text-foreground flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-primary" />
                    {tx.qualitative}
                  </div>
                  
                  {/* Env Practice row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                      <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5">
                        🌿 {leftCulture.name} - {tx.envPracticeTitle}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        {lang === 'id' ? leftCulture.envPractice : leftCulture.envPracticeEn}
                      </p>
                    </div>
                    <div className="p-4 bg-accent/5 border border-accent/15 rounded-2xl">
                      <div className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1.5">
                        🌿 {rightCulture.name} - {tx.envPracticeTitle}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        {lang === 'id' ? rightCulture.envPractice : rightCulture.envPracticeEn}
                      </p>
                    </div>
                  </div>

                  {/* Way of Life row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                      <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5">
                        🏡 {leftCulture.name} - {tx.wayOfLifeTitle}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        {lang === 'id' ? leftCulture.wayOfLife : leftCulture.wayOfLifeEn}
                      </p>
                    </div>
                    <div className="p-4 bg-accent/5 border border-accent/15 rounded-2xl">
                      <div className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1.5">
                        🏡 {rightCulture.name} - {tx.wayOfLifeTitle}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        {lang === 'id' ? rightCulture.wayOfLife : rightCulture.wayOfLifeEn}
                      </p>
                    </div>
                  </div>

                  {/* Philosophy row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                      <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5">
                        📜 {leftCulture.name} - {tx.philosophyTitle}
                      </div>
                      <p className="text-xs text-muted-foreground italic leading-relaxed font-medium">
                        {lang === 'id' ? leftCulture.philosophy : leftCulture.philosophyEn}
                      </p>
                    </div>
                    <div className="p-4 bg-accent/5 border border-accent/15 rounded-2xl">
                      <div className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1.5">
                        📜 {rightCulture.name} - {tx.philosophyTitle}
                      </div>
                      <p className="text-xs text-muted-foreground italic leading-relaxed font-medium">
                        {lang === 'id' ? rightCulture.philosophy : rightCulture.philosophyEn}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dasbor GIS Statistik Makro */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: Trees,
              titleId: 'Total Hutan Adat Terpetakan',
              titleEn: 'Total Mapped Customary Forest',
              value: '14,250 Ha',
              color: 'text-emerald-500 bg-emerald-500/10'
            },
            {
              icon: Thermometer,
              titleId: 'Estimasi Pengurangan Karbon',
              titleEn: 'Est. Carbon Offset',
              value: '18.4K Ton / Thn',
              color: 'text-sky-500 bg-sky-500/10'
            },
            {
              icon: TrendingDown,
              titleId: 'Rata-rata Indeks Pelestarian',
              titleEn: 'Avg Preservation Index',
              value: '84.5%',
              color: 'text-amber-500 bg-amber-500/10'
            },
            {
              icon: Compass,
              titleId: 'Jumlah Komunitas Adat',
              titleEn: 'Total Customary Tribes',
              value: '13 Suku Mapped',
              color: 'text-purple-500 bg-purple-500/10'
            }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-card border border-border rounded-2xl p-4 shadow-md flex items-center gap-3.5"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {lang === 'id' ? stat.titleId : stat.titleEn}
                  </div>
                  <div className="text-lg font-extrabold text-foreground mt-0.5" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {stat.value}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Historical Data Charts section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-6 border-b border-border pb-3">
            <TrendingDown className="w-5 h-5 text-accent animate-pulse" />
            <h3 className="text-foreground text-lg font-bold tracking-tight">{tx.chart}</h3>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={preservationData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBaduy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorToraja" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDayak" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F4A261" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F4A261" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMinang" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBali" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontWeight: '600' }} axisLine={false} tickLine={false} />
                <YAxis domain={[65, 100]} tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontWeight: '600' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, color: 'var(--foreground)', fontSize: 12, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="baduy" name="Suku Baduy" stroke="#10B981" strokeWidth={2.5} fill="url(#colorBaduy)" />
                <Area type="monotone" dataKey="naga" name="Kampung Naga" stroke="#059669" strokeWidth={2} strokeDasharray="3 3" fill="none" />
                <Area type="monotone" dataKey="toraja" name="Toraja" stroke="#A855F7" strokeWidth={2.5} fill="url(#colorToraja)" />
                <Area type="monotone" dataKey="dayak" name="Suku Dayak" stroke="#F4A261" strokeWidth={2.5} fill="url(#colorDayak)" />
                <Area type="monotone" dataKey="minang" name="Minangkabau" stroke="#3B82F6" strokeWidth={2.5} fill="url(#colorMinang)" />
                <Area type="monotone" dataKey="bali" name="Bali Subak" stroke="#06B6D4" strokeWidth={2.5} fill="url(#colorBali)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

