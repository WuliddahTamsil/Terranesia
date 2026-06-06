import { type CSSProperties, type Dispatch, type SetStateAction, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Award,
  BookOpen,
  Brain,
  ChevronRight,
  Clock,
  Flame,
  Gamepad2,
  Leaf,
  MapPin,
  Play,
  RefreshCw,
  Search,
  Ship,
  Sparkles,
  Target,
  Trophy,
  Volume2,
  X,
} from 'lucide-react';

interface Props { lang: 'id' | 'en' }

type Region = 'Sumatera' | 'Pulau Jawa' | 'Kalimantan' | 'Sulawesi' | 'Bali & Nusa Tenggara' | 'Maluku' | 'Papua';
type Category = 'Tradisional' | 'Maritim' | 'Pegunungan' | 'Ritual' | 'Urban / Akulturasi';

interface CultureCard {
  id: string;
  name: string;
  region: Region;
  location: string;
  category: Category;
  culture: string;
  funFact: string;
  image: string;
  history: string;
  tradition: string;
  wisdom: string;
  education: string;
  trending?: boolean;
}

interface CultureStoryContent {
  ecoWisdom: string;
  artIdentity: string;
  trivia: string;
  timeline: Array<{ era: string; text: string }>;
  glossary: Array<{ term: string; meaning: string; pronunciation?: string }>;
  challenge: string;
}

const translations = {
  id: {
    title: 'Sejarah & Budaya',
    subtitle: 'Jelajahi keragaman suku dan budaya Indonesia lewat cerita singkat, fakta unik, dan tantangan ringan.',
    explorer: 'Culture Explorer',
    regionAll: 'Semua Pulau',
    categoryAll: 'Semua Kategori',
    searchPlaceholder: 'Cari suku, lokasi, atau kata kunci...',
    detail: 'Detail Budaya',
    close: 'Tutup',
    random: 'Random Culture',
    trending: 'Trending Culture',
    cultureOfDay: 'Culture of The Day',
    didYouKnow: 'Did You Know?',
    progress: 'Progress Explore',
    badge: 'Badge',
    quiz: 'Quiz Ringan',
    correct: 'Benar. Keren, kamu makin peka budaya.',
    wrong: 'Belum tepat. Coba lihat lagi petunjuk di card.',
    noResults: 'Tidak ada hasil ditemukan. Coba ubah filter atau pencarian Anda.',
  },
  en: {
    title: 'History & Culture',
    subtitle: 'Explore Indonesia culture through short stories, unique facts, and light challenges.',
    explorer: 'Culture Explorer',
    regionAll: 'All Islands',
    categoryAll: 'All Categories',
    searchPlaceholder: 'Search tribe, place, or keyword...',
    detail: 'Culture Details',
    close: 'Close',
    random: 'Random Culture',
    trending: 'Trending Culture',
    cultureOfDay: 'Culture of The Day',
    didYouKnow: 'Did You Know?',
    progress: 'Explore Progress',
    badge: 'Badge',
    quiz: 'Quick Quiz',
    correct: 'Correct. Nice cultural instinct.',
    wrong: 'Not quite. Check the card clue again.',
    noResults: 'No results found. Try changing your search or filters.',
  },
};

const imageByRegion: Record<Region, string> = {
  Sumatera: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80',
  'Pulau Jawa': 'https://images.unsplash.com/photo-1583336661016-970247c23603?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80',
  Kalimantan: 'https://images.unsplash.com/photo-1517457373958-bf4f22fa63d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80',
  Sulawesi: 'https://images.unsplash.com/photo-1545156521-7f4f8e57c4f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80',
  'Bali & Nusa Tenggara': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80',
  Maluku: 'https://images.unsplash.com/photo-1516501765870-6a952f9f6b89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80',
  Papua: 'https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80',
};

const cultureCards: CultureCard[] = [
  {
    id: 'aceh',
    name: 'Aceh',
    region: 'Sumatera',
    location: 'Aceh',
    category: 'Ritual',
    culture: 'Islam kuat dan Tari Saman',
    funFact: 'Tari Saman bisa terlihat seperti gelombang karena penarinya bergerak sangat kompak.',
    image: "Professional documentary photograph of a dynamic Saman dance performance in Aceh, Indonesia. A tight row of young Acehnese men sitting closely together, wearing traditional black and gold intricate outfits with Gayo patterns. They are performing rapid synchronized hand and body movements, creating a wave-like effect. Strong rhythmic expression, focus on togetherness. Background of an old traditional wooden building. Cinematic lighting, high resolution, National Geographic style.",
    history: 'Aceh lama dikenal sebagai gerbang perdagangan dan penyebaran Islam di Nusantara. Dari pelabuhan, ulama, pedagang, dan masyarakat bertemu lalu membentuk budaya yang tegas sekaligus hangat.',
    tradition: 'Tari Saman, adat meugang, dan tradisi musyawarah membuat kebersamaan terasa kuat dalam kehidupan sehari-hari.',
    wisdom: 'Masyarakat Aceh mengajarkan disiplin, hormat pada ilmu, dan keberanian menjaga identitas.',
    education: 'Siswa bisa belajar bahwa agama, seni, dan sejarah dapat berjalan bersama tanpa menghapus keramahan budaya.',
    trending: true,
  },
  {
    id: 'gayo',
    name: 'Gayo',
    region: 'Sumatera',
    location: 'Dataran Tinggi Gayo, Aceh',
    category: 'Pegunungan',
    culture: 'Kopi dunia dan seni tari',
    funFact: 'Kopi Gayo terkenal sampai luar negeri karena aroma dan cita rasanya khas dataran tinggi.',
    image: "A detailed documentary photograph taken in the Takengon highlands, Gayo, Aceh. A local farmer with a cheerful expression wearing traditional textile headwear and clothing is harvesting ripe red coffee cherries in a lush plantation. Blurred background of other farmers. Rolling mist covering mountains in the distance, cool palette, natural daylight, 8k.",
    history: 'Orang Gayo tumbuh di wilayah pegunungan yang sejuk. Alam, kebun kopi, dan seni lisan menjadi bagian penting dari cerita hidup mereka.',
    tradition: 'Didong, tari tradisional, dan budaya bertani kopi menjadi wajah budaya Gayo yang mudah dikenali.',
    wisdom: 'Kerja tekun dan menjaga tanah subur adalah pelajaran besar dari masyarakat Gayo.',
    education: 'Budaya Gayo menunjukkan bahwa komoditas lokal bisa menjadi kebanggaan dunia.',
  },
  {
    id: 'alas',
    name: 'Alas',
    region: 'Sumatera',
    location: 'Aceh Tenggara',
    category: 'Tradisional',
    culture: 'Adat kuat dan agraris',
    funFact: 'Kehidupan agraris membuat kalender adat Alas dekat dengan musim tanam dan panen.',
    image: "A vibrant landscape photo of the Alas Valley in Southeast Aceh, Indonesia, during the rice harvesting season. Local Alas people, dressed in modest traditional agrarian clothes, are working together ('gotong royong') in the paddies. In the background is a traditional Alas wooden house with its unique architecture, surrounded by lush green hills. Golden hour lighting, peaceful atmosphere, cinematic composition.",
    history: 'Suku Alas hidup di lembah subur dan membangun tradisi yang dekat dengan pertanian. Adat menjadi cara menjaga hubungan antarwarga.',
    tradition: 'Upacara adat, bahasa Alas, dan gotong royong sawah sering menjadi pusat kegiatan sosial.',
    wisdom: 'Mereka mengajarkan bahwa pangan, keluarga, dan kerja bersama adalah fondasi komunitas.',
    education: 'Pelajar dapat melihat bagaimana budaya agraris melatih tanggung jawab terhadap alam.',
  },
  {
    id: 'batak-toba',
    name: 'Batak Toba',
    region: 'Sumatera',
    location: 'Sekitar Danau Toba, Sumatera Utara',
    category: 'Tradisional',
    culture: 'Danau Toba dan ulos',
    funFact: 'Ulos bukan sekadar kain, tetapi simbol doa, kasih, dan ikatan keluarga.',
    image: "Portrait quality photo of a Batak Toba family dressed in fine, handwoven traditional Ulos textiles, standing proudly with the serene Lake Toba and the iconic Samosir Island in the background. The father wears an Ulos Ragidup, the mother an Ulos Sadum. Behind them is a traditional Bolon house with intricate carvings. Soft sunlight, deep focus on textile textures, realistic, candid moment, highly detailed.",
    history: 'Budaya Batak Toba berkembang di sekitar Danau Toba. Marga, lagu, dan adat membuat hubungan keluarga terasa sangat penting.',
    tradition: 'Ulos, gondang, tortor, dan upacara adat keluarga menjadi bagian besar dari identitas Batak Toba.',
    wisdom: 'Nilai hormat kepada leluhur dan saling mendukung dalam keluarga besar sangat kuat.',
    education: 'Kita belajar bahwa identitas keluarga dapat menjadi sumber tanggung jawab sosial.',
    trending: true,
  },
  {
    id: 'batak-karo',
    name: 'Batak Karo',
    region: 'Sumatera',
    location: 'Tanah Karo, Sumatera Utara',
    category: 'Pegunungan',
    culture: 'Sistem marga unik',
    funFact: 'Marga dalam masyarakat Karo membantu orang memahami hubungan keluarga dan aturan adat.',
    image: "An interior photograph of a traditional Karo house, Siwaluh Juhar, in the highlands of North Sumatra. A group of Batak Karo women in traditional clothing sit together, weaving or preparing for 'Kerja Tahun' (annual harvest festival). Warm light streaming through small windows, highlighting the aged timber structure and colorful textiles. Authentic, documentary style, rich textures, high detail.",
    history: 'Batak Karo hidup di dataran tinggi dengan tradisi kekerabatan yang rapi. Setiap upacara adat menunjukkan posisi keluarga dan peran sosial.',
    tradition: 'Kerja tahun, rumah adat Karo, dan musik tradisional hadir dalam banyak acara komunitas.',
    wisdom: 'Karo mengajarkan pentingnya tahu asal-usul dan menjaga sopan santun dalam keluarga besar.',
    education: 'Pelajar bisa memahami bahwa sistem sosial membantu masyarakat hidup tertib.',
  },
  {
    id: 'batak-mandailing',
    name: 'Batak Mandailing',
    region: 'Sumatera',
    location: 'Mandailing Natal, Sumatera Utara',
    category: 'Tradisional',
    culture: 'Musik gordang',
    funFact: 'Gordang sambilan dimainkan beramai-ramai dan menghasilkan suara yang megah.',
    image: "A dynamic photo of nine large drums (Gordang Sambilan) being played by a group of Mandailing men in vibrant red and black traditional attire in the Mandailing Natal regency. They are performing outdoors with a backdrop of rugged mountains and palm trees at dusk. Majestic and powerful atmosphere, cinematic lighting, realistic, high resolution.",
    history: 'Mandailing memiliki tradisi adat, sastra lisan, dan musik yang kuat. Budayanya tumbuh di antara pegunungan, kampung, dan jalur perantauan.',
    tradition: 'Gordang sambilan, upacara adat, dan bahasa Mandailing menjadi ciri khas yang hidup sampai sekarang.',
    wisdom: 'Masyarakat Mandailing menekankan kehormatan, pendidikan, dan solidaritas keluarga.',
    education: 'Budaya ini mengajarkan bahwa musik dapat menyimpan memori sejarah masyarakat.',
  },
  {
    id: 'nias',
    name: 'Nias',
    region: 'Sumatera',
    location: 'Pulau Nias',
    category: 'Ritual',
    culture: 'Lompat batu',
    funFact: 'Tradisi lompat batu dahulu menjadi simbol kedewasaan dan keberanian pemuda.',
    image: "An action photograph capturing a young Nias warrior performing Fahombo (stone jumping). He is flying over a large pile of stacked traditional stones. He wears traditional warrior clothing and a helmet. Below him, other villagers watch from the steps of massive traditional wooden Omo Hada houses in a stone-paved village square, Nias Island, Indonesia. Clear daylight, dynamic composition, realistic, highly detailed textures.",
    history: 'Nias memiliki desa adat batu, rumah panggung besar, dan tradisi yang kuat. Pulau ini menyimpan kisah keberanian dan ketahanan masyarakat pesisir.',
    tradition: 'Fahombo atau lompat batu, tarian perang, dan arsitektur omo hada menjadi ikon Nias.',
    wisdom: 'Keberanian di Nias bukan hanya soal fisik, tetapi juga kesiapan bertanggung jawab.',
    education: 'Siswa belajar bahwa ritual bisa menjadi cara masyarakat menandai tahap hidup.',
  },
  {
    id: 'minangkabau',
    name: 'Minangkabau',
    region: 'Sumatera',
    location: 'Sumatera Barat',
    category: 'Tradisional',
    culture: 'Matrilineal dan Rumah Gadang',
    funFact: 'Minangkabau dikenal sebagai salah satu komunitas matrilineal terbesar di dunia.',
    image: "Majestic photograph of a magnificent Minangkabau Rumah Gadang traditional house with multiple spired roofs resembling buffalo horns, located in West Sumatra, Indonesia, at sunset. A group of women in vibrant traditional silk clothing ('baju kurung') and ornate gold headpieces ('suntiang') stand gracefully on the stairs. Golden hour lighting, architectural wonder, rich colors, National Geographic style, ultra-realistic, 8k.",
    history: 'Minangkabau tumbuh dengan adat yang memberi peran penting pada garis ibu. Rumah Gadang menjadi simbol keluarga besar dan tempat nilai adat diwariskan.',
    tradition: 'Randai, silek, kuliner, rumah gadang, dan tradisi merantau membuat budaya Minang mudah dikenal.',
    wisdom: 'Adat mengajarkan musyawarah, kecakapan berdagang, dan keberanian mencari pengalaman.',
    education: 'Pelajar dapat belajar bahwa peran perempuan dalam budaya Indonesia sangat beragam dan penting.',
    trending: true,
  },
  {
    id: 'mentawai',
    name: 'Mentawai',
    region: 'Sumatera',
    location: 'Kepulauan Mentawai',
    category: 'Tradisional',
    culture: 'Tato tradisional',
    funFact: 'Tato Mentawai bisa menunjukkan perjalanan hidup, status, dan hubungan dengan alam.',
    image: "Intimate portrait photograph of an elderly Mentawai Sikerei (shaman) covered in intricate traditional tattoos (Titi), sitting inside his Uma (clan longhouse) in the Mentawai rainforest. He is smoking a traditional tobacco and wearing bead necklaces and headwear made of feathers and leaves. Warm, natural daylight filters through the thatched roof, highlighting his wrinkled skin and dark tattoos. Authentic, high detail, cinematic lighting, photorealistic.",
    history: 'Mentawai menjaga tradisi tua yang dekat dengan hutan, sungai, dan roh leluhur. Rumah uma menjadi pusat kehidupan bersama.',
    tradition: 'Tato titi, sikerei, tarian, dan obat alam menjadi bagian penting budaya Mentawai.',
    wisdom: 'Alam diperlakukan sebagai sahabat hidup, bukan sekadar sumber bahan.',
    education: 'Budaya Mentawai mengajarkan rasa hormat pada pengetahuan tradisional dan lingkungan.',
  },
  {
    id: 'melayu',
    name: 'Melayu',
    region: 'Sumatera',
    location: 'Riau, Jambi, Sumatera Timur',
    category: 'Maritim',
    culture: 'Budaya pesisir',
    funFact: 'Pantun Melayu sering dipakai untuk menyampaikan nasihat dengan cara halus dan indah.',
    image: "An elegant photograph of a Zapin dance performance on a traditional wooden stage at the edge of a historical Malay coastal town at twilight. Male and female dancers wear detailed silk Malay attire and headgear. The background features traditional stilt houses over the water and a bustling small port. Soft evening lighting, artistic composition, realistic, high detail.",
    history: 'Melayu berkembang di wilayah sungai dan pesisir yang ramai perdagangan. Bahasa, sastra, dan adatnya memengaruhi banyak daerah Nusantara.',
    tradition: 'Pantun, zapin, adat bersendi syarak, dan budaya pelabuhan menjadi ciri Melayu.',
    wisdom: 'Budi bahasa dan sopan santun menjadi nilai utama dalam pergaulan.',
    education: 'Siswa belajar bahwa bahasa Indonesia punya akar kuat dari dunia Melayu.',
  },
  {
    id: 'rejang',
    name: 'Rejang',
    region: 'Sumatera',
    location: 'Bengkulu',
    category: 'Tradisional',
    culture: 'Suku tua',
    funFact: 'Aksara Rejang atau Kaganga adalah salah satu warisan tulis penting di Sumatera.',
    image: "Close-up, highly detailed photograph of an aged, traditional Rejang bamboo manuscript inscribed with the ancient Kaganga script. The manuscript rests on a piece of woven textile inside a traditional wooden house. Warm, natural light spotlights the carvings and the delicate texture of the bamboo and text. Authentic, rich texture, high resolution, realistic.",
    history: 'Rejang dikenal sebagai salah satu suku tua di Bengkulu. Mereka memiliki bahasa dan aksara yang menunjukkan tradisi intelektual lokal.',
    tradition: 'Aksara Kaganga, adat desa, dan seni lisan menjadi penanda budaya Rejang.',
    wisdom: 'Menjaga bahasa berarti menjaga cara berpikir sebuah masyarakat.',
    education: 'Pelajar dapat melihat bahwa literasi Nusantara sudah ada dalam banyak bentuk lokal.',
  },
  {
    id: 'lampung',
    name: 'Lampung',
    region: 'Sumatera',
    location: 'Lampung',
    category: 'Tradisional',
    culture: 'Pepadun dan Saibatin',
    funFact: 'Lampung memiliki kain tapis yang dibuat dengan sulaman benang emas.',
    image: "A close-up portrait of a Lampung woman wearing a traditional Tapis cloth wrapped as a sarong and a magnificent golden Siger headpiece, adorned with jewelry. The focus is on the intricate, shimmering gold thread embroidery (Tapis) and the reflective Siger against a softly blurred traditional wooden interior. Professional fashion photography style, high detail, soft cinematic lighting, ultra-realistic, 8k.",
    history: 'Budaya Lampung tumbuh dari dua kelompok adat besar: Pepadun dan Saibatin. Keduanya memiliki tata adat dan simbol kehormatan masing-masing.',
    tradition: 'Kain tapis, siger, upacara adat, dan bahasa Lampung memperkaya identitas daerah.',
    wisdom: 'Piil pesenggiri mengajarkan harga diri, keramahan, dan tanggung jawab sosial.',
    education: 'Siswa belajar bahwa satu provinsi bisa memiliki beberapa sistem adat yang berdampingan.',
  },
  {
    id: 'jawa',
    name: 'Jawa',
    region: 'Pulau Jawa',
    location: 'Jawa Tengah, Yogyakarta, Jawa Timur',
    category: 'Tradisional',
    culture: 'Budaya keraton',
    funFact: 'Rumah joglo punya filosofi tentang keseimbangan manusia, alam, dan Sang Pencipta.',
    image: "A peaceful photograph capturing the interior of a traditional Javanese Joglo wooden house during a Gamelan music session in Yogyakarta, Indonesia. Musicians in traditional beskap clothing and blangkon hats sit on woven mats playing aged bronze instruments. A Wayang Kulit shadow puppet is visible in the background. Soft, diffused natural light, warm ambiance, highly detailed textures of wood and cloth, National Geographic style.",
    history: 'Budaya Jawa berkembang lewat kerajaan, pesantren, desa, dan kota. Wayang, batik, dan keraton menyimpan cerita tentang etika hidup.',
    tradition: 'Wayang, gamelan, batik, sekaten, dan tata krama menjadi bagian penting budaya Jawa.',
    wisdom: 'Rukun, tepa selira, dan eling mengajarkan hidup tenang serta menghargai orang lain.',
    education: 'Pelajar belajar bahwa kelembutan sikap dapat menjadi kekuatan sosial.',
    trending: true,
  },
  {
    id: 'sunda',
    name: 'Sunda',
    region: 'Pulau Jawa',
    location: 'Jawa Barat dan Banten',
    category: 'Pegunungan',
    culture: 'Ramah dan angklung',
    funFact: 'Angklung mengajarkan harmoni karena satu pemain biasanya memegang nada berbeda.',
    image: "A joyful portrait of several Sundanese children in traditional cotton clothing playing Angklung instruments together, with smiling faces, while sitting on a bamboo structure next to lush terraced rice fields in West Java, Indonesia. Behind them, rolling blue mountains and palm trees are visible under a clear sky. Bright natural daylight, vibrant colors, authentic, photorealistic, 8k.",
    history: 'Sunda tumbuh di wilayah pegunungan, sawah, dan kota. Budayanya dikenal ramah, musikal, dan dekat dengan alam.',
    tradition: 'Angklung, jaipongan, seren taun, dan bahasa Sunda menjadi identitas yang hangat.',
    wisdom: 'Silih asah, silih asih, silih asuh mengajarkan saling mengembangkan, menyayangi, dan menjaga.',
    education: 'Siswa belajar bahwa kerja sama kecil bisa menciptakan harmoni besar.',
  },
  {
    id: 'betawi',
    name: 'Betawi',
    region: 'Pulau Jawa',
    location: 'Jakarta',
    category: 'Urban / Akulturasi',
    culture: 'Akulturasi',
    funFact: 'Ondel-ondel dulu dipercaya sebagai penjaga kampung, kini menjadi ikon budaya Jakarta.',
    image: "A vibrant photograph capturing a pair of towering Ondel-ondel (traditional Betawi effigies) dancing and moving through a bustling, modern street market in Jakarta, Indonesia. They are surrounded by crowds, street food stalls, and the juxtaposition of colorful traditional elements against modern city buildings in the background. Lively atmosphere, realistic street photography style, high dynamic range, 8k.",
    history: 'Betawi lahir dari pertemuan banyak bangsa dan suku di Batavia. Karena itu budayanya terasa lincah, terbuka, dan penuh campuran.',
    tradition: 'Ondel-ondel, lenong, tanjidor, kerak telor, dan palang pintu menjadi ciri Betawi.',
    wisdom: 'Perbedaan bisa menjadi identitas baru yang menyenangkan jika dirawat dengan saling hormat.',
    education: 'Betawi mengajarkan akulturasi: budaya baru dapat tumbuh dari pertemuan banyak orang.',
    trending: true,
  },
  {
    id: 'baduy',
    name: 'Baduy',
    region: 'Pulau Jawa',
    location: 'Lebak, Banten',
    category: 'Tradisional',
    culture: 'Hidup tanpa teknologi modern',
    funFact: 'Baduy Dalam menjaga aturan adat ketat, termasuk pembatasan listrik dan kendaraan.',
    image: "A documentary photograph taken in a Baduy village, Lebak, Banten, Indonesia. An elderly Baduy woman in simple, handwoven dark blue clothing and a white headband sits on a wooden porch, focused on hand-weaving textile using a traditional loom. Behind her are simple wooden and bamboo stilt houses with thatched roofs amidst lush forest. No electricity or modern items visible. Soft natural daylight, tranquil atmosphere, authentic, photorealistic, high resolution.",
    history: 'Baduy mempertahankan cara hidup sederhana untuk menjaga hutan dan adat. Pilihan itu membuat mereka menjadi contoh kuat tentang konsistensi budaya.',
    tradition: 'Tenun, berjalan kaki, pikukuh adat, dan gotong royong menjadi bagian keseharian Baduy.',
    wisdom: 'Kesederhanaan dapat menjadi cara menjaga alam dan menjaga diri dari hidup berlebihan.',
    education: 'Pelajar belajar menghargai pilihan hidup yang berbeda tanpa merasa lebih modern.',
  },
  {
    id: 'tengger',
    name: 'Tengger',
    region: 'Pulau Jawa',
    location: 'Sekitar Gunung Bromo',
    category: 'Ritual',
    culture: 'Ritual Kasada',
    funFact: 'Saat Kasada, masyarakat Tengger membawa sesaji ke kawasan kawah Bromo.',
    image: "A dynamic photograph capturing a large group of Tengger people clad in warm traditional clothing and blankets carrying offerings (sesaji) along the misty edge of the Mount Bromo volcanic crater in East Java, Indonesia, during the Yadnya Kasada festival. In the background, active smoke rises from the crater and other mountains in the caldera under a dramatic, cloudy sky at dawn. Epic scale, cinematic lighting, highly detailed textures, photorealistic.",
    history: 'Tengger hidup di kawasan pegunungan Bromo. Cerita leluhur dan alam vulkanik membentuk ritual yang khas.',
    tradition: 'Yadnya Kasada, pakaian hangat khas pegunungan, dan pertanian lereng gunung menjadi ciri Tengger.',
    wisdom: 'Mereka mengajarkan rasa syukur kepada alam yang keras tetapi memberi kehidupan.',
    education: 'Siswa belajar bahwa ritual sering lahir dari hubungan manusia dengan tempat tinggalnya.',
  },
  {
    id: 'osing',
    name: 'Osing',
    region: 'Pulau Jawa',
    location: 'Banyuwangi, Jawa Timur',
    category: 'Tradisional',
    culture: 'Budaya Banyuwangi',
    funFact: 'Gandrung Banyuwangi menjadi tarian ikonik yang penuh energi dan warna.',
    image: "Dynamic photograph of a Gandrung Banyuwangi dancer performing with intense expression on a traditional stage. She wears a vibrant red costume with detailed gold embroidery and a specific Omprok headdress. She holds a fan and moves energetically. The background features other musicians with Gamelan instruments inside a traditional wooden structure. High detail, realistic texture, vibrant colors, cinematic lighting, 8k.",
    history: 'Osing adalah masyarakat asli Banyuwangi yang memiliki bahasa, musik, dan ritual khas. Budayanya terasa kuat di ujung timur Jawa.',
    tradition: 'Tari Gandrung, Seblang, bahasa Osing, dan festival budaya menjadi identitas Osing.',
    wisdom: 'Bangga pada bahasa daerah membuat budaya tetap hidup di tengah perubahan.',
    education: 'Pelajar dapat belajar bahwa daerah kecil pun bisa punya identitas budaya besar.',
  },
  {
    id: 'madura',
    name: 'Madura',
    region: 'Pulau Jawa',
    location: 'Pulau Madura dan pesisir Jawa Timur',
    category: 'Tradisional',
    culture: 'Karapan sapi',
    funFact: 'Karapan sapi bukan hanya lomba cepat, tetapi juga gengsi, seni hias, dan pesta rakyat.',
    image: "Action-packed photograph of a Karapan Sapi (bull racing) event in Madura, Indonesia. Two powerful bulls are racing at high speed across a muddy field, guided by a young jockey in colorful traditional clothing standing on a wooden sled. Dust and mud fly everywhere. Spectators watch from the sidelines. Bright sunny day, dynamic composition, realistic, high dynamic range, 8k.",
    history: 'Madura dikenal dengan masyarakat yang tangguh, pekerja keras, dan dekat dengan budaya pesisir. Tradisi rakyatnya meriah dan penuh semangat.',
    tradition: 'Karapan sapi, saronen, batik Madura, dan tradisi merantau menjadi ciri khas.',
    wisdom: 'Kerja keras dan keberanian mengambil tantangan menjadi nilai penting.',
    education: 'Siswa belajar bahwa olahraga tradisional bisa menyimpan nilai sosial dan ekonomi.',
  },
  {
    id: 'cirebon',
    name: 'Cirebon',
    region: 'Pulau Jawa',
    location: 'Cirebon, Jawa Barat',
    category: 'Urban / Akulturasi',
    culture: 'Budaya campuran',
    funFact: 'Batik mega mendung Cirebon terinspirasi bentuk awan dan memiliki makna keteduhan.',
    image: "Portrait of a Cirebon artisan woman in a traditional batik workshop, meticulously applying wax with a canting to a cloth featuring the iconic blue and white Megamendung cloud patterns. She is surrounded by other batik cloths. Background shows a traditional wooden house interior. Soft daylight, focus on texture and artistry, authentic, realistic, National Geographic style.",
    history: 'Cirebon berada di jalur pesisir yang ramai. Pengaruh Jawa, Sunda, Islam, Tionghoa, dan perdagangan membuat budayanya kaya campuran.',
    tradition: 'Batik mega mendung, keraton, tari topeng, dan tradisi pesisir menjadi identitas Cirebon.',
    wisdom: 'Pertemuan budaya bisa melahirkan seni baru yang indah.',
    education: 'Cirebon mengajarkan toleransi lewat contoh akulturasi yang nyata.',
  },
  {
    id: 'dayak',
    name: 'Dayak',
    region: 'Kalimantan',
    location: 'Pedalaman Kalimantan',
    category: 'Tradisional',
    culture: 'Hutan dan rumah panjang',
    funFact: 'Rumah panjang Dayak dapat menjadi tempat tinggal banyak keluarga sekaligus.',
    image: "A wide-angle documentary photograph of a massive Dayak Betang (longhouse) situated deep within the lush rainforest of Kalimantan, Indonesia. Several Dayak elders in traditional clothing adorned with beads and feathers stand on the long wooden veranda. A slow-moving river flows nearby. Cinematic lighting with dappled sunlight through the canopy, majestic atmosphere, ultra-realistic, 8k.",
    history: 'Dayak hidup erat dengan sungai dan hutan Kalimantan. Rumah panjang menjadi simbol kebersamaan dan perlindungan komunitas.',
    tradition: 'Tari Dayak, ukiran, mandau, tato, dan upacara adat hutan menjadi bagian identitasnya.',
    wisdom: 'Hutan dipandang sebagai ruang hidup yang harus dijaga untuk generasi berikutnya.',
    education: 'Pelajar belajar bahwa menjaga budaya sering berarti menjaga lingkungan.',
    trending: true,
  },
  {
    id: 'kenyah',
    name: 'Kenyah',
    region: 'Kalimantan',
    location: 'Kalimantan Timur dan Utara',
    category: 'Tradisional',
    culture: 'Tato simbolik',
    funFact: 'Motif tato Kenyah dapat menunjukkan perjalanan, kecantikan, atau status sosial.',
    image: "Intimate portrait of a Kenyah Dayak elder man covered in detailed traditional tattoos, playing the Sape, a traditional plucked string instrument. He wears a simple traditional headband and bead necklace, sitting inside a longhouse with intricate wood carvings in the background. Warm, natural light spotlights his face and the instrument. Authentic, photorealistic, highly detailed textures, National Geographic style.",
    history: 'Kenyah adalah bagian dari rumpun Dayak dengan seni ukir, musik, dan tato yang kuat. Mereka menjaga memori lewat motif dan cerita.',
    tradition: 'Sape, tato, ukiran rumah, dan tari tradisional menjadi wajah budaya Kenyah.',
    wisdom: 'Setiap motif memiliki makna, jadi seni menjadi bahasa kehidupan.',
    education: 'Siswa belajar membaca simbol budaya dengan lebih hati-hati dan hormat.',
  },
  {
    id: 'iban',
    name: 'Iban',
    region: 'Kalimantan',
    location: 'Kalimantan Barat',
    category: 'Tradisional',
    culture: 'Sejarah headhunter',
    funFact: 'Sejarah perang Iban kini lebih banyak dikenang sebagai cerita keberanian masa lalu.',
    image: "Close-up photograph of an Iban Dayak weaver hand-weaving a detailed Pua Kumbu sacred textile using a traditional backstrap loom in Sarawak, Kalimantan. The textile features complex patterns. She wears traditional Iban silver jewelry and woven clothing. Warm natural light inside a traditional longhouse. Documentary style, high dynamic range, ultra-realistic, high detail.",
    history: 'Iban memiliki sejarah panjang di wilayah sungai dan hutan. Masa lalu perang dan perantauan membentuk cerita kepahlawanan mereka.',
    tradition: 'Rumah panjang, tenun pua kumbu, dan pesta panen menjadi bagian penting budaya Iban.',
    wisdom: 'Keberanian harus berubah menjadi tanggung jawab menjaga komunitas.',
    education: 'Pelajar belajar bahwa budaya dapat berubah: dari tradisi perang menuju pelestarian identitas.',
  },
  {
    id: 'ngaju',
    name: 'Ngaju',
    region: 'Kalimantan',
    location: 'Kalimantan Tengah',
    category: 'Ritual',
    culture: 'Kaharingan',
    funFact: 'Upacara Tiwah menjadi ritual penting untuk menghormati perjalanan arwah leluhur.',
    image: "A dynamic photograph capturing a scene from a Tiwah ritual (secondary funeral) in a Ngaju Dayak village, Central Kalimantan. A large Sandung (decorated ossuary) stands in the center, surrounded by villagers in traditional attire performing rituals and ceremonial dances. Offerings are placed around. Cinematic lighting, respectful atmosphere, high detail, photorealistic.",
    history: 'Ngaju hidup di sepanjang sungai Kalimantan Tengah. Kepercayaan Kaharingan dan ritual leluhur membentuk budaya yang kaya simbol.',
    tradition: 'Tiwah, rumah betang, ukiran, dan upacara sungai menjadi penanda budaya Ngaju.',
    wisdom: 'Menghormati leluhur berarti menjaga hubungan antar generasi.',
    education: 'Siswa belajar menghargai keragaman sistem kepercayaan di Indonesia.',
  },
  {
    id: 'punan',
    name: 'Punan',
    region: 'Kalimantan',
    location: 'Pedalaman Kalimantan',
    category: 'Tradisional',
    culture: 'Nomaden',
    funFact: 'Sebagian komunitas Punan dikenal memiliki pengetahuan hutan yang sangat detail.',
    image: "A documentary photograph taken within a dense, untouched jungle of Central Kalimantan, Indonesia. A group of Punan people, dressed in minimal, forest-adapted traditional clothing, are walking along a forest path, carrying blowpipes and woven baskets. Dappled sunlight filters through the canopy. Peaceful atmosphere, authentic, high detail, cinematic lighting, National Geographic style.",
    history: 'Punan hidup dekat dengan hutan dan sebagian dahulu berpindah mengikuti sumber pangan. Pengetahuan alam menjadi bekal utama.',
    tradition: 'Berburu, meramu, anyaman, dan pengetahuan obat hutan menjadi bagian tradisi Punan.',
    wisdom: 'Mengambil secukupnya dari alam adalah cara menjaga keseimbangan hidup.',
    education: 'Pelajar belajar bahwa ilmu tidak selalu berasal dari buku, tetapi juga pengalaman lintas generasi.',
  },
  {
    id: 'bugis',
    name: 'Bugis',
    region: 'Sulawesi',
    location: 'Sulawesi Selatan',
    category: 'Maritim',
    culture: 'Pelaut ulung',
    funFact: 'Kapal pinisi dikenal dunia sebagai bukti keahlian maritim Bugis-Makassar.',
    image: "Majestic photograph capturing a large, traditional Bugis Pinisi schooner sailing through the open turquoise ocean under a bright, sunny sky with scattered clouds in Indonesia. Its multiple sails are fully deployed. The crew in traditional sailor outfits is visible on deck. Cinematic landscape shot, realistic textures of wood and sea, National Geographic style, ultra-realistic, 8k.",
    history: 'Bugis dikenal sebagai pelaut, perantau, dan pedagang. Dari Sulawesi, mereka berlayar jauh membawa cerita dan jaringan dagang.',
    tradition: 'Pinisi, aksara lontara, adat siri, dan tradisi merantau menjadi ciri Bugis.',
    wisdom: 'Siri mengajarkan harga diri, tanggung jawab, dan keberanian menjaga janji.',
    education: 'Siswa belajar bahwa Indonesia memiliki sejarah maritim yang sangat kuat.',
    trending: true,
  },
  {
    id: 'makassar',
    name: 'Makassar',
    region: 'Sulawesi',
    location: 'Sulawesi Selatan',
    category: 'Maritim',
    culture: 'Perdagangan',
    funFact: 'Makassar pernah menjadi kota pelabuhan penting di jalur perdagangan timur Nusantara.',
    image: "A vibrant photograph of the historical Paotere port in Makassar, Indonesia, during twilight. Dozens of traditional Phinisi schooners are docked closely together. Bustling atmosphere on the wooden docks with local people, fishermen, and market stalls. Warm evening lighting from the setting sun, realistic street photography style, high detail, 8k.",
    history: 'Makassar tumbuh sebagai pusat perdagangan, pelayaran, dan pertemuan budaya. Pelabuhan membuat masyarakatnya terbuka pada dunia luar.',
    tradition: 'Perahu, kuliner pesisir, aksara lontara, dan adat siri na pacce menjadi ciri Makassar.',
    wisdom: 'Keterbukaan pada pendatang dapat berjalan bersama kebanggaan identitas sendiri.',
    education: 'Pelajar belajar hubungan antara kota pelabuhan, ekonomi, dan budaya.',
  },
  {
    id: 'toraja',
    name: 'Toraja',
    region: 'Sulawesi',
    location: 'Tana Toraja, Sulawesi Selatan',
    category: 'Ritual',
    culture: 'Ritual kematian',
    funFact: 'Rambu Solo bisa berlangsung berhari-hari dan melibatkan keluarga besar.',
    image: "Majestic photograph of several Tana Toraja traditional Tongkonan houses with distinctive curved saddleback roofs, adorned with buffalo horns and intricate wood carvings, located in a misty valley in Sulawesi at sunrise. Local Toraja people in traditional red clothing stand gracefully. Soft golden hour lighting, architectural wonder, National Geographic style, ultra-realistic, high detail.",
    history: 'Toraja dikenal lewat rumah tongkonan dan ritual yang menghormati leluhur. Bagi Toraja, keluarga tidak berhenti hanya karena kematian.',
    tradition: 'Tongkonan, Rambu Solo, ukiran, dan kubur tebing menjadi ikon budaya Toraja.',
    wisdom: 'Hidup, kematian, dan keluarga dipandang sebagai perjalanan panjang yang saling terhubung.',
    education: 'Siswa belajar memahami tradisi berbeda tanpa cepat menghakimi.',
    trending: true,
  },
  {
    id: 'minahasa',
    name: 'Minahasa',
    region: 'Sulawesi',
    location: 'Sulawesi Utara',
    category: 'Urban / Akulturasi',
    culture: 'Budaya terbuka',
    funFact: 'Budaya Minahasa dikenal mudah menyerap pengaruh luar tanpa kehilangan identitas lokal.',
    image: "A joyful documentary photograph capturing a traditional Minahasa Mapalus (mutual cooperation) event in Central Minahasa, Sulawesi Utara. A group of local farmers in casual traditional clothing works together in a field, smiling. Nearby, a bamboo music group plays traditional instruments. Dappled sunlight, vibrant colors, authentic, photorealistic, 8k.",
    history: 'Minahasa tumbuh di wilayah utara Sulawesi dengan sejarah pertemuan budaya lokal, Eropa, dan perdagangan.',
    tradition: 'Mapalus, musik bambu, kuliner, dan tradisi gereja menjadi bagian wajah Minahasa.',
    wisdom: 'Mapalus mengajarkan kerja bersama untuk kepentingan banyak orang.',
    education: 'Pelajar belajar bahwa keterbukaan budaya dapat memperkaya komunitas.',
  },
  {
    id: 'gorontalo',
    name: 'Gorontalo',
    region: 'Sulawesi',
    location: 'Gorontalo',
    category: 'Ritual',
    culture: 'Adat Islam',
    funFact: 'Gorontalo dikenal dengan semboyan adat bersendikan syara dan syara bersendikan kitabullah.',
    image: "A photograph capturing a traditional wedding ceremony in Gorontalo, Indonesia. The bride and groom wear magnificent, detailed traditional Gorontalo Islamic attire, adorned with complex jewelry and headpieces. They stand in front of a traditional decorated background in a reception hall. Warm interior lighting, respectful and festive atmosphere, high detail, photorealistic.",
    history: 'Gorontalo memiliki tradisi kerajaan lokal dan Islam yang kuat. Adat dan agama berpadu dalam banyak upacara.',
    tradition: 'Upacara adat, tujaqi, pakaian adat, dan seni lisan menjadi bagian budaya Gorontalo.',
    wisdom: 'Nilai agama dipakai untuk memperkuat etika sosial dan saling menghormati.',
    education: 'Siswa belajar bahwa agama dapat menjadi sumber nilai budaya dan tata sosial.',
  },
  {
    id: 'mandar',
    name: 'Mandar',
    region: 'Sulawesi',
    location: 'Sulawesi Barat',
    category: 'Maritim',
    culture: 'Pelaut',
    funFact: 'Sandeq, perahu layar Mandar, terkenal ramping dan cepat di laut.',
    image: "Action-packed photograph capturing a Sandeq (traditional Mandar outrigger sailboat) sailing very fast across the open ocean under a clear sunny sky in West Sulawesi. The unique triangular sail is full of wind, tilting the boat dramatically. Local crew members balance on the outriggers. Cinematic shot, realistic textures of water and wood, dynamic composition, National Geographic style.",
    history: 'Mandar tumbuh sebagai masyarakat pesisir yang dekat dengan laut. Pelayaran menjadi bagian dari identitas dan ekonomi.',
    tradition: 'Perahu sandeq, tradisi nelayan, dan upacara laut menjadi budaya khas Mandar.',
    wisdom: 'Laut mengajarkan ketelitian membaca alam dan keberanian bekerja sama.',
    education: 'Pelajar belajar bahwa teknologi tradisional seperti perahu lahir dari kebutuhan nyata.',
  },
  {
    id: 'bajo',
    name: 'Bajo',
    region: 'Sulawesi',
    location: 'Pesisir Sulawesi dan Indonesia Timur',
    category: 'Maritim',
    culture: 'Manusia laut',
    funFact: 'Sebagian orang Bajo sangat mahir menyelam karena hidupnya dekat sekali dengan laut.',
    image: "A documentary photograph taken in a Bajo (Sea Gypsy) stilt village built entirely over the turquoise water in Wakatobi, Sulawesi, Indonesia. Simple wooden houses are connected by planks. Underneath, Bajo children are swimming or paddling a small dugout canoe. Background of the open sea. Natural daylight, realistic, high dynamic range, photorealistic.",
    history: 'Bajo dikenal sebagai pengembara laut. Rumah, perahu, dan kehidupan mereka berputar di sekitar air.',
    tradition: 'Rumah panggung laut, menangkap ikan, dan pengetahuan arus menjadi bagian budaya Bajo.',
    wisdom: 'Laut bukan batas, tetapi rumah yang harus dihormati.',
    education: 'Siswa belajar bahwa cara hidup manusia bisa sangat beragam mengikuti lingkungan.',
  },
  {
    id: 'bali',
    name: 'Bali',
    region: 'Bali & Nusa Tenggara',
    location: 'Bali',
    category: 'Ritual',
    culture: 'Hindu dan upacara',
    funFact: 'Di Bali, seni dan upacara sering hadir dalam keseharian, bukan hanya saat festival.',
    image: "Majestic photograph capturing a serene scene of Balinese Hindu women in traditional white and yellow attire and ornate headpieces carrying Canang Sari offerings in a processional walk along the stone steps of a traditional water temple, Pura Ulun Danu Beratan, at dawn. Soft mist over the lake, mountain background, cinematic golden hour lighting, authentic, ultra-realistic, high detail.",
    history: 'Bali mempertahankan tradisi Hindu yang kuat dan berpadu dengan seni lokal. Desa adat memegang peran besar dalam kehidupan masyarakat.',
    tradition: 'Tari kecak, upacara melasti, canang sari, gamelan, dan pura menjadi wajah budaya Bali.',
    wisdom: 'Tri Hita Karana mengajarkan harmoni manusia dengan Tuhan, sesama, dan alam.',
    education: 'Pelajar belajar bahwa keseimbangan hidup dapat menjadi prinsip budaya.',
    trending: true,
  },
  {
    id: 'sasak',
    name: 'Sasak',
    region: 'Bali & Nusa Tenggara',
    location: 'Lombok, Nusa Tenggara Barat',
    category: 'Tradisional',
    culture: 'Lombok',
    funFact: 'Rumah adat Sasak memakai lantai tanah yang dirawat dengan cara tradisional.',
    image: "An interior photograph taken inside a traditional Sasak wooden house with a unique Bale Tani thatched roof and cow dung polished floor in Sade village, Lombok. A Sasak woman in traditional textile clothing sits on the floor, hand-weaving a Songket textile using a backstrap loom. Background shows daily life items. Warm natural light, authentic, realistic, high detail.",
    history: 'Sasak adalah masyarakat asli Lombok dengan tradisi desa adat, tenun, dan musik yang kuat.',
    tradition: 'Tenun songket, gendang beleq, desa Sade, dan upacara adat menjadi ciri Sasak.',
    wisdom: 'Kesederhanaan rumah adat menunjukkan hubungan erat manusia dengan tanah.',
    education: 'Siswa belajar bahwa arsitektur tradisional sering menyesuaikan iklim dan alam sekitar.',
  },
  {
    id: 'sumbawa',
    name: 'Sumbawa',
    region: 'Bali & Nusa Tenggara',
    location: 'Pulau Sumbawa',
    category: 'Tradisional',
    culture: 'Agraris',
    funFact: 'Budaya Sumbawa dekat dengan peternakan, pertanian, dan tradisi lisan.',
    image: "Action-packed photograph capturing a Main Jaran (traditional Sumbawa horse race) during a festival in Sumbawa, Indonesia. Local child jockeys in casual traditional clothing race fast across a dusty field. The background features other villagers watching. Bright sunny day, dynamic composition, realistic textures of horses and dust, 8k.",
    history: 'Sumbawa memiliki kerajaan lokal dan budaya agraris yang membentuk kehidupan masyarakatnya.',
    tradition: 'Main jaran, musik tradisional, dan adat panen menjadi bagian budaya Sumbawa.',
    wisdom: 'Ketahanan hidup lahir dari kerja keras mengelola tanah dan ternak.',
    education: 'Pelajar belajar bahwa budaya lokal banyak dipengaruhi mata pencaharian.',
  },
  {
    id: 'bima',
    name: 'Bima',
    region: 'Bali & Nusa Tenggara',
    location: 'Bima, Nusa Tenggara Barat',
    category: 'Tradisional',
    culture: 'Budaya kuda',
    funFact: 'Kuda punya tempat penting dalam sejarah, ekonomi, dan tradisi Bima.',
    image: "Close-up portrait of a Bima woman wearing Rimpu, a unique traditional veil made of woven cloth that covers her entire face except the eyes, standing next to a traditional house with intricate wood carvings, holding a horse. Strong cultural expression, warm natural daylight, high dynamic range, photorealistic.",
    history: 'Bima memiliki sejarah kerajaan dan tradisi yang kuat di wilayah timur Sumbawa. Budaya kuda menjadi salah satu identitasnya.',
    tradition: 'Pacuan kuda, pakaian adat rimpu, dan upacara lokal menjadi ciri Bima.',
    wisdom: 'Ketangkasan dan keberanian perlu diimbangi tanggung jawab.',
    education: 'Siswa belajar bahwa hewan dapat menjadi bagian penting dari identitas budaya.',
  },
  {
    id: 'sumba',
    name: 'Sumba',
    region: 'Bali & Nusa Tenggara',
    location: 'Pulau Sumba',
    category: 'Ritual',
    culture: 'Pasola',
    funFact: 'Pasola adalah tradisi berkuda yang menjadi bagian dari ritual adat Sumba.',
    image: "Action photograph capturing a scene from the Pasola ritual in Sumba, Indonesia. Horsemen in traditional warrior clothing, adorned with beadwork and feathers, brandish wooden spears while riding fast across a large field. They wear detailed traditional tenun ikat cloth. In the background, other warriors and villagers watch from a distance under a cloudy sky. Epic scale, cinematic lighting, ultra-realistic, 8k.",
    history: 'Sumba memiliki tradisi megalitik, rumah adat tinggi, dan kain tenun yang penuh simbol. Alam kering membentuk budaya yang tangguh.',
    tradition: 'Pasola, tenun ikat, kampung adat, dan kepercayaan Marapu menjadi identitas Sumba.',
    wisdom: 'Ritual mengajarkan keseimbangan antara manusia, leluhur, dan alam.',
    education: 'Pelajar belajar bahwa kain tradisional dapat menyimpan cerita sosial dan spiritual.',
    trending: true,
  },
  {
    id: 'manggarai',
    name: 'Manggarai',
    region: 'Bali & Nusa Tenggara',
    location: 'Flores Barat',
    category: 'Pegunungan',
    culture: 'Sawah unik',
    funFact: 'Sawah lingko berbentuk seperti jaring laba-laba karena pembagian tanah adat.',
    image: "Wide-angle landscape photograph of the unique Sawah Lingko (spider web-shaped rice paddies) in a green valley in Manggarai, Flores, Indonesia, at sunrise. In the distance, several traditional Mbaru Niang conical houses are nestled in the hills. Majestic view, cinematic golden hour lighting, authentic, realistic, high resolution.",
    history: 'Manggarai tumbuh di pegunungan Flores. Sistem tanah adat dan kampung tradisional membentuk pola hidup masyarakatnya.',
    tradition: 'Caci, rumah adat mbaru niang, dan sawah lingko menjadi ikon Manggarai.',
    wisdom: 'Pembagian tanah adat mengajarkan keadilan dan keteraturan komunitas.',
    education: 'Siswa belajar bahwa bentuk lanskap bisa mencerminkan sistem sosial.',
  },
  {
    id: 'ende',
    name: 'Ende',
    region: 'Bali & Nusa Tenggara',
    location: 'Flores, Nusa Tenggara Timur',
    category: 'Urban / Akulturasi',
    culture: 'Sejarah Soekarno',
    funFact: 'Ende dikenal sebagai salah satu tempat perenungan Soekarno sebelum lahirnya gagasan Pancasila.',
    image: "Portrait quality photo of an Ende woman wearing a traditional tenun ikat cloth, standing with a thoughtful expression near the historical site of Soekarno's exile in Ende, Flores. In the background are old colonial buildings and local houses. Soft natural lighting, deep focus on textile textures, realistic, authentic, high detail.",
    history: 'Ende memiliki budaya Flores yang kaya dan jejak sejarah nasional. Tempat ini menghubungkan budaya lokal dengan cerita Indonesia modern.',
    tradition: 'Tenun ikat, musik lokal, dan tradisi kampung Flores menjadi bagian budaya Ende.',
    wisdom: 'Keberagaman dapat menjadi bahan renungan untuk membangun persatuan.',
    education: 'Pelajar belajar bahwa sejarah nasional juga tumbuh dari daerah-daerah.',
  },
  {
    id: 'ambon',
    name: 'Ambon',
    region: 'Maluku',
    location: 'Ambon, Maluku',
    category: 'Maritim',
    culture: 'Musik',
    funFact: 'Ambon sering disebut kota musik karena banyak penyanyi besar lahir dari sana.',
    image: "Dynamic photograph capturing a street music performance in Ambon, Indonesia, known as the City of Music. A group of Ambon youth in modern but culturally-inflected clothing play traditional vokal and instruments like Tifa drums and brass. A large Pela Gandong (fraternity) mural is visible in the background. Lively atmosphere, street photography style, high dynamic range, photorealistic.",
    history: 'Ambon berkembang sebagai kota pelabuhan rempah dan pertemuan budaya. Musik menjadi bahasa sosial yang kuat.',
    tradition: 'Musik vokal, pela gandong, dan budaya pesisir menjadi identitas Ambon.',
    wisdom: 'Pela gandong mengajarkan persaudaraan lintas kampung dan latar belakang.',
    education: 'Siswa belajar bahwa seni dapat menjadi jembatan perdamaian.',
    trending: true,
  },
  {
    id: 'ternate',
    name: 'Ternate',
    region: 'Maluku',
    location: 'Ternate, Maluku Utara',
    category: 'Maritim',
    culture: 'Sejarah rempah',
    funFact: 'Cengkih membuat Ternate pernah menjadi pusat perhatian perdagangan dunia.',
    image: "A historical photograph capturing the Ternate Sultanate palace with its traditional architecture, located near the coast in Ternate, Maluku Utara, at twilight. In the background, the powerful volcano Mount Gamalama stands majestic. Fishing boats are on the water. Cinematic evening lighting, dramatic atmosphere, realistic, National Geographic style.",
    history: 'Ternate adalah kerajaan rempah penting di Maluku Utara. Letaknya membuatnya terhubung dengan jalur dunia sejak lama.',
    tradition: 'Kesultanan, tradisi laut, dan cerita rempah menjadi ciri Ternate.',
    wisdom: 'Sumber daya alam perlu dikelola bijak agar tidak hanya memicu perebutan.',
    education: 'Pelajar belajar bahwa sejarah Indonesia terhubung dengan perdagangan global.',
  },
  {
    id: 'tidore',
    name: 'Tidore',
    region: 'Maluku',
    location: 'Tidore, Maluku Utara',
    category: 'Maritim',
    culture: 'Kerajaan Islam',
    funFact: 'Tidore memiliki sejarah kesultanan yang kuat dalam jaringan Islam dan rempah.',
    image: "A historical photograph of the Tidore Sultanate palace interior, adorned with traditional Maluku artifacts and Islamic elements, during a formal ceremony. Several elders in traditional Kesultanan attire with elaborate headpieces sit and converse. Respectful atmosphere, warm interior lighting, authentic, realistic, high detail.",
    history: 'Tidore berdiri sebagai kerajaan Islam penting di kawasan Maluku. Hubungannya dengan laut dan rempah membentuk politik serta budaya.',
    tradition: 'Kesultanan, adat istana, dan tradisi pesisir menjadi wajah budaya Tidore.',
    wisdom: 'Identitas lokal dapat berdiri kuat sambil berhubungan dengan dunia luar.',
    education: 'Siswa belajar bahwa kerajaan Nusantara punya jaringan diplomasi luas.',
  },
  {
    id: 'kei',
    name: 'Kei',
    region: 'Maluku',
    location: 'Kepulauan Kei',
    category: 'Maritim',
    culture: 'Hukum adat',
    funFact: 'Hukum adat Larvul Ngabal dikenal sebagai pedoman hidup masyarakat Kei.',
    image: "A detailed documentary photograph of a farmer family in Maluku Tengah regency, happily harvesting cloves from tall trees using traditional ladders and baskets. Background shows lush spice plantations with nutmeg trees. Misty mountains in the distance. Cool palette, natural daylight, authentic, realistic, National Geographic style.",
    history: 'Kei hidup di kepulauan dengan ikatan adat yang kuat. Hukum adat membantu menjaga keteraturan masyarakat pesisir.',
    tradition: 'Larvul Ngabal, tradisi laut, dan ikatan keluarga menjadi ciri budaya Kei.',
    wisdom: 'Aturan adat membantu masyarakat menyelesaikan masalah dengan rasa adil.',
    education: 'Pelajar belajar bahwa hukum tidak hanya berasal dari negara, tetapi juga adat.',
  },
  {
    id: 'seram',
    name: 'Seram',
    region: 'Maluku',
    location: 'Pulau Seram',
    category: 'Tradisional',
    culture: 'Animisme',
    funFact: 'Pulau Seram sering dianggap sebagai pulau ibu dalam banyak cerita Maluku.',
    image: "A detailed documentary photograph of a farmer family in Maluku Tengah regency, happily harvesting cloves from tall trees using traditional ladders and baskets. Background shows lush spice plantations with nutmeg trees. Misty mountains in the distance. Cool palette, natural daylight, authentic, realistic, National Geographic style.",
    history: 'Seram menyimpan banyak tradisi tua Maluku yang dekat dengan hutan, gunung, dan laut.',
    tradition: 'Cerita leluhur, ritual alam, dan adat kampung menjadi bagian budaya Seram.',
    wisdom: 'Menghormati alam dan leluhur membantu masyarakat menjaga batas perilaku.',
    education: 'Siswa belajar memahami kepercayaan lokal sebagai bagian dari sejarah budaya.',
  },
  {
    id: 'dani',
    name: 'Dani',
    region: 'Papua',
    location: 'Lembah Baliem, Papua Pegunungan',
    category: 'Pegunungan',
    culture: 'Koteka dan pegunungan',
    funFact: 'Lembah Baliem menjadi salah satu pusat budaya pegunungan Papua yang paling dikenal.',
    image: "Intimate documentary photograph taken in a Dani village, Lembah Baliem, Papua. Several elderly Dani men adorned with Koteka (traditional penis gourds), bead necklaces, and feather headpieces sit around a small fire inside a circular Honai wooden house with a thatched roof. Deep wrinkles, authentic expressions. Warm natural light, rich textures, photorealistic, National Geographic style.",
    history: 'Dani hidup di pegunungan Papua dengan sistem kebun, kampung, dan tradisi yang kuat. Lingkungan tinggi membentuk cara hidup yang khas.',
    tradition: 'Honai, koteka, perang-perangan adat, dan kebun ubi menjadi ciri Dani.',
    wisdom: 'Hidup di pegunungan mengajarkan ketahanan, kerja bersama, dan adaptasi.',
    education: 'Pelajar belajar bahwa geografis Indonesia membuat budaya tiap daerah sangat berbeda.',
    trending: true,
  },
  {
    id: 'asmat',
    name: 'Asmat',
    region: 'Papua',
    location: 'Papua Selatan',
    category: 'Tradisional',
    culture: 'Ukiran kayu',
    funFact: 'Ukiran Asmat dihormati dunia karena detail dan makna spiritualnya.',
    image: "Intimate portrait of an Asmat woodcarver artisan in a communal workshop near the river in Asmat regency, Papua. He is meticulously carving a complex ancestor figure into a large wooden pole using a traditional tool. He wears simple traditional attire and headwear. Warm natural light streams through the open side of the workshop, highlighting the wood texture and his hands. Documentary style, ultra-realistic, high detail.",
    history: 'Asmat hidup di wilayah sungai dan rawa. Kayu menjadi media untuk menceritakan leluhur, alam, dan identitas.',
    tradition: 'Ukiran, patung bisj, tarian, dan ritual sungai menjadi bagian budaya Asmat.',
    wisdom: 'Seni adalah cara mengingat asal-usul dan menghormati alam sekitar.',
    education: 'Siswa belajar bahwa karya seni tradisional sering menyimpan filsafat hidup.',
    trending: true,
  },
  {
    id: 'korowai',
    name: 'Korowai',
    region: 'Papua',
    location: 'Pedalaman Papua Selatan',
    category: 'Tradisional',
    culture: 'Rumah pohon',
    funFact: 'Rumah pohon Korowai dibangun tinggi sebagai cara beradaptasi dengan hutan.',
    image: "Dynamic action photograph of a Marind-anim traditional ritual dance performance on a sandy beach in Papua at dusk. Dancers in elaborate ceremonial costumes made of natural fibers, feathers, and body paint, holding Tifa drums, move rhythmically. Warm, colorful evening lighting from the sunset, dramatic atmosphere, realistic, National Geographic style.",
    history: 'Korowai dikenal dengan rumah pohon dan kehidupan yang sangat dekat dengan hutan. Arsitekturnya lahir dari kebutuhan lingkungan.',
    tradition: 'Rumah pohon, berburu, meramu, dan pengetahuan hutan menjadi ciri Korowai.',
    wisdom: 'Tempat tinggal yang baik adalah yang memahami alam sekitarnya.',
    education: 'Pelajar belajar bahwa desain tradisional sering sangat cerdas dan fungsional.',
  },
  {
    id: 'lani',
    name: 'Lani',
    region: 'Papua',
    location: 'Papua Pegunungan',
    category: 'Pegunungan',
    culture: 'Pegunungan',
    funFact: 'Masyarakat Lani hidup di wilayah tinggi dan mengandalkan kebun sebagai pusat kehidupan.',
    image: "A historical photograph capturing a large traditional Biak dugout canoe sailing along the coral coast of Biak Island, Papua, at twilight. Several Biak people in traditional attire adorned with shells and feathers are on board. Cinematic landscape shot, realistic textures of water and wood, dramatic evening lighting, high detail, National Geographic style.",
    history: 'Lani adalah masyarakat pegunungan Papua yang membangun kampung dan kebun di wilayah dingin.',
    tradition: 'Honai, kebun ubi, dan tradisi komunitas pegunungan menjadi ciri Lani.',
    wisdom: 'Ketahanan pangan lokal sangat penting untuk hidup di wilayah sulit.',
    education: 'Siswa belajar bahwa kemandirian pangan dapat menjadi bagian budaya.',
  },
  {
    id: 'yali',
    name: 'Yali',
    region: 'Papua',
    location: 'Papua Pegunungan',
    category: 'Tradisional',
    culture: 'Tradisional',
    funFact: 'Yali memiliki tradisi kampung pegunungan yang kuat dan dekat dengan alam.',
    image: "Portrait quality photo of a Sentani artist woman from Jayapura regency, Papua, standing near the serene Lake Sentani with rolling hills in the background. She is proudly holding a piece of barkcloth painting with traditional Sentani geometric motifs. She wears traditional bead necklaces and clothing. Soft daylight, authentic expressions, high detail, photorealistic.",
    history: 'Yali hidup di daerah pegunungan dengan medan sulit. Tradisi mereka tumbuh dari kebutuhan saling menjaga dalam komunitas kecil.',
    tradition: 'Rumah tradisional, kebun, dan ritual lokal menjadi bagian budaya Yali.',
    wisdom: 'Kebersamaan menjadi bekal utama saat lingkungan menantang.',
    education: 'Pelajar belajar menghargai masyarakat yang mampu beradaptasi dengan alam ekstrem.',
  },
  {
    id: 'sentani',
    name: 'Sentani',
    region: 'Papua',
    location: 'Danau Sentani, Papua',
    category: 'Maritim',
    culture: 'Seni lukis',
    funFact: 'Motif Sentani sering terlihat pada lukisan kulit kayu dan karya seni lokal.',
    image: "Portrait quality photo of a Sentani artist woman from Jayapura regency, Papua, standing near the serene Lake Sentani with rolling hills in the background. She is proudly holding a piece of barkcloth painting with traditional Sentani geometric motifs. She wears traditional bead necklaces and clothing. Soft daylight, authentic expressions, high detail, photorealistic.",
    history: 'Sentani tumbuh di sekitar danau yang indah. Air, perahu, dan seni visual menjadi bagian dari identitas masyarakat.',
    tradition: 'Lukisan kulit kayu, festival danau, perahu, dan tarian menjadi ciri Sentani.',
    wisdom: 'Danau mengajarkan hubungan antara keindahan alam dan ekspresi seni.',
    education: 'Siswa belajar bahwa lingkungan dapat menginspirasi bahasa seni masyarakat.',
  },
  {
    id: 'biak',
    name: 'Biak',
    region: 'Papua',
    location: 'Pulau Biak, Papua',
    category: 'Maritim',
    culture: 'Budaya laut',
    funFact: 'Budaya Biak memiliki banyak cerita pelayaran dan hubungan dengan pulau-pulau sekitar.',
    image: "A historical photograph capturing a large traditional Biak dugout canoe sailing along the coral coast of Biak Island, Papua, at twilight. Several Biak people in traditional attire adorned with shells and feathers are on board. Cinematic landscape shot, realistic textures of water and wood, dramatic evening lighting, high detail, National Geographic style.",
    history: 'Biak adalah masyarakat kepulauan Papua yang dekat dengan laut. Pelayaran, perdagangan, dan cerita lisan membentuk identitasnya.',
    tradition: 'Wor, tradisi laut, tarian, dan cerita pelayaran menjadi bagian budaya Biak.',
    wisdom: 'Laut mengajarkan keberanian sekaligus kehati-hatian.',
    education: 'Pelajar belajar bahwa Papua juga memiliki budaya maritim yang kaya.',
  },
];

const regions: Array<'Semua Pulau' | Region> = ['Semua Pulau', 'Sumatera', 'Pulau Jawa', 'Kalimantan', 'Sulawesi', 'Bali & Nusa Tenggara', 'Maluku', 'Papua'];
const categories: Array<'Semua Kategori' | Category> = ['Semua Kategori', 'Tradisional', 'Maritim', 'Pegunungan', 'Ritual', 'Urban / Akulturasi'];

const cultureStoryOverrides: Record<string, Partial<CultureStoryContent>> = {
  aceh: {
    ecoWisdom: 'Aceh memiliki tradisi Panglima Laot, lembaga adat laut yang mengatur hari pantang melaut, penyelesaian sengketa nelayan, dan cara menangkap ikan agar ekosistem pesisir tetap pulih. Di darat, identitas kampung, meunasah, dan hutan lindung membentuk etika menjaga ruang hidup bersama.',
    artIdentity: 'Tari Saman adalah bahasa tubuh kolektif: tepuk tangan, dada, dan paha bergerak cepat seperti gelombang. Busana hitam-emas dan pola Gayo menegaskan disiplin, doa, dan kebersamaan yang ritmis.',
    trivia: 'Gerak Saman bisa terlihat seperti animasi gelombang karena puluhan penari menjaga tempo, napas, dan formasi secara presisi.',
    timeline: [
      { era: 'Samudera Pasai', text: 'Aceh menjadi salah satu gerbang perdagangan dan penyebaran Islam melalui pelabuhan, ulama, dan jalur rempah.' },
      { era: 'Kesultanan Aceh', text: 'Jaringan diplomasi, pendidikan Islam, dan perdagangan memperkuat posisi Aceh di kawasan Samudra Hindia.' },
      { era: 'Panglima Laot', text: 'Aturan adat laut menjaga relasi nelayan, musim, wilayah tangkap, dan keberlanjutan ekosistem pesisir.' },
      { era: 'Kini', text: 'Tari Saman, meugang, dan adat musyawarah menjadi identitas yang tetap relevan untuk edukasi budaya dan sustainability.' },
    ],
    glossary: [
      { term: 'Saman', meaning: 'Tari kolektif Gayo yang menekankan tempo, kekompakan, syair, dan gerak tangan.', pronunciation: 'sa-man' },
      { term: 'Panglima Laot', meaning: 'Pemimpin adat laut Aceh yang mengatur etika melaut dan penyelesaian sengketa nelayan.' },
      { term: 'Meugang', meaning: 'Tradisi makan bersama menjelang Ramadan atau hari besar sebagai simbol berbagi dan solidaritas.' },
    ],
    challenge: 'Coba prinsip Panglima Laot versi harian: ambil secukupnya dari alam. Hari ini, pilih makanan laut atau produk alam yang asalnya lebih bertanggung jawab.',
  },
  baduy: {
    ecoWisdom: 'Baduy menjaga hulu air melalui aturan Leuweung Tutupan dan Leuweung Titipan. Tanah tidak boleh diubah sembarangan, bahan kimia dan sabun dibatasi di sungai, dan perjalanan dilakukan dengan berjalan kaki agar jejak ekologis tetap rendah.',
    artIdentity: 'Kain tenun Baduy memakai warna sederhana seperti putih, hitam, dan biru tua. Kesederhanaan warna bukan kemiskinan visual, tetapi simbol keteguhan adat, batas diri, dan kedekatan dengan alam.',
    trivia: 'Bagi Baduy, sungai bukan sekadar sumber air. Sungai adalah ruang hidup bersama yang harus tetap bersih karena mengalir ke banyak wilayah di hilir.',
    timeline: [
      { era: 'Masa adat', text: 'Pikukuh menjadi pedoman hidup yang mengatur hubungan manusia, tanah, hutan, dan air.' },
      { era: 'Kini', text: 'Baduy menjadi contoh kuat bahwa konservasi bisa berjalan lewat aturan budaya, bukan hanya teknologi modern.' },
    ],
    glossary: [
      { term: 'Pikukuh', meaning: 'Aturan adat yang menjaga keseimbangan hidup dan lingkungan.', pronunciation: 'pi-ku-kuh' },
      { term: 'Leuweung', meaning: 'Hutan dalam bahasa Sunda; dalam konteks adat berarti ruang alam yang dijaga.' },
    ],
    challenge: 'Hari ini, kurangi sabun atau bahan kimia yang langsung masuk saluran air. Mulai dari satu kebiasaan kecil: pilih pembersih ramah lingkungan atau hemat pemakaian air.',
  },
  dayak: {
    ecoWisdom: 'Dalam banyak komunitas Dayak, hutan adat dipahami sebagai ruang hidup, obat, pangan, dan identitas. Konsep seperti Tana Ulen mengenal wilayah hutan yang dilindungi dan hanya boleh diambil hasilnya dengan aturan adat.',
    artIdentity: 'Rumah panjang bukan hanya arsitektur besar, tetapi simbol berbagi ruang, berbagi kerja, dan keamanan kolektif. Ukiran, mandau, tato, dan motif burung enggang sering membawa pesan keberanian serta hubungan manusia dengan alam.',
    trivia: 'Rumah panjang dapat menampung banyak keluarga, sehingga kehidupan sosialnya melatih musyawarah setiap hari.',
    timeline: [
      { era: 'Sungai & hutan', text: 'Permukiman berkembang mengikuti jalur sungai sebagai jalan utama, sumber pangan, dan penghubung komunitas.' },
      { era: 'Rumah panjang', text: 'Arsitektur komunal menjadi pusat adat, ritual, dan solidaritas.' },
      { era: 'Konservasi kini', text: 'Narasi hutan adat makin penting dalam diskusi iklim dan hak masyarakat adat.' },
    ],
    glossary: [
      { term: 'Tana Ulen', meaning: 'Wilayah hutan adat yang dijaga dan dimanfaatkan dengan izin adat.' },
      { term: 'Rumah Betang', meaning: 'Rumah panjang komunal pada sejumlah masyarakat Dayak.' },
    ],
    challenge: 'Pilih satu produk harian dan cari tahu asal bahan alamnya. Tantangannya: dukung produk yang tidak merusak hutan.',
  },
  minangkabau: {
    ecoWisdom: 'Rumah Gadang menunjukkan adaptasi lokal pada alam Sumatra yang rawan gempa. Struktur kayu, pasak, dan tumpuan batu membantu bangunan lebih lentur menghadapi getaran.',
    artIdentity: 'Atap gonjong Rumah Gadang menyerupai tanduk kerbau dan menjadi simbol identitas Minang. Sistem matrilineal membuat rumah bukan hanya tempat tinggal, tetapi pusat garis keluarga ibu.',
    trivia: 'Teknologi tahan gempa lokal sudah dipraktikkan lama sebelum istilah desain resilien populer.',
    timeline: [
      { era: 'Adat nagari', text: 'Kehidupan sosial dibangun lewat nagari, musyawarah, dan peran keluarga besar.' },
      { era: 'Merantau', text: 'Tradisi merantau memperluas jaringan ekonomi dan pengetahuan tanpa melepas akar adat.' },
      { era: 'Kini', text: 'Rumah Gadang menjadi ikon budaya sekaligus pelajaran arsitektur adaptif.' },
    ],
    glossary: [
      { term: 'Rumah Gadang', meaning: 'Rumah adat Minangkabau yang menjadi pusat keluarga besar.' },
      { term: 'Gonjong', meaning: 'Bentuk atap runcing melengkung khas Rumah Gadang.' },
    ],
    challenge: 'Amati bangunan di sekitarmu. Apa satu fitur yang membuatnya lebih ramah iklim atau lebih aman dari bencana?',
  },
  bali: {
    ecoWisdom: 'Subak adalah sistem irigasi, organisasi sosial, dan praktik spiritual sekaligus. Ia menjalankan Tri Hita Karana: harmoni manusia dengan Tuhan, sesama, dan alam.',
    artIdentity: 'Upacara, pura, tari, dan tata ruang Bali menata hubungan manusia dengan lanskap. Sawah bertingkat bukan hanya produktif, tetapi juga menjadi arsip visual kerja kolektif.',
    trivia: 'Subak diakui dunia karena menunjukkan bahwa pengelolaan air bisa berbasis komunitas dan nilai spiritual.',
    timeline: [
      { era: 'Pertanian air', text: 'Komunitas mengelola air sawah lewat kesepakatan dan ritual bersama.' },
      { era: 'Tri Hita Karana', text: 'Filosofi harmoni menjadi dasar relasi sosial dan ekologis.' },
      { era: 'Warisan dunia', text: 'Subak menjadi contoh budaya air yang relevan untuk sustainability modern.' },
    ],
    glossary: [
      { term: 'Subak', meaning: 'Sistem irigasi dan organisasi petani berbasis adat di Bali.' },
      { term: 'Tri Hita Karana', meaning: 'Filosofi harmoni antara manusia, Tuhan, sesama, dan alam.' },
    ],
    challenge: 'Cek penggunaan air hari ini. Kurangi satu kebiasaan boros air, lalu catat dampaknya.',
  },
  kei: {
    ecoWisdom: 'Masyarakat Kei mengenal hukum adat Larvul Ngabal, sementara tradisi Maluku juga kuat dengan Sasi: larangan mengambil hasil laut atau darat pada waktu tertentu agar ekosistem pulih.',
    artIdentity: 'Identitas Kei tumbuh dari laut, perahu, relasi keluarga, dan hukum adat. Budaya maritimnya menekankan rasa adil karena kehidupan pulau sangat bergantung pada sumber daya bersama.',
    trivia: 'Sasi adalah contoh sustainable harvesting lokal: mengambil secukupnya, lalu memberi waktu alam memulihkan diri.',
    timeline: [
      { era: 'Kepulauan', text: 'Laut menjadi penghubung keluarga, pasar, dan aturan hidup.' },
      { era: 'Larvul Ngabal', text: 'Hukum adat menguatkan batas, keadilan, dan tanggung jawab sosial.' },
      { era: 'Sasi', text: 'Praktik jeda panen menjaga stok alam tetap berkelanjutan.' },
    ],
    glossary: [
      { term: 'Larvul Ngabal', meaning: 'Hukum adat masyarakat Kei yang mengatur martabat dan keadilan sosial.' },
      { term: 'Sasi', meaning: 'Larangan adat mengambil hasil alam dalam periode tertentu.' },
    ],
    challenge: 'Coba prinsip jeda panen versi rumah: habiskan stok makanan yang ada sebelum membeli baru agar limbah berkurang.',
  },
  ambon: {
    ecoWisdom: 'Budaya pesisir Ambon dekat dengan praktik jaga laut dan solidaritas antar-kampung. Nilai pela gandong dapat dibaca sebagai modal sosial untuk menjaga ruang hidup bersama.',
    artIdentity: 'Musik Ambon menjadi identitas sosial yang menyatukan memori keluarga, gereja, kampung, dan laut. Harmoni vokal mencerminkan budaya yang kuat dalam rasa kebersamaan.',
    trivia: 'Ambon dikenal sebagai kota musik karena tradisi bernyanyi hidup kuat di ruang keluarga dan komunitas.',
    glossary: [
      { term: 'Pela Gandong', meaning: 'Ikatan persaudaraan antar-kampung yang menekankan saling bantu dan damai.' },
    ],
    challenge: 'Bangun satu aksi gotong royong kecil: ajak teman memilah sampah atau membersihkan ruang bersama.',
  },
};

function getCultureStory(card: CultureCard): CultureStoryContent {
  const fallback: CultureStoryContent = {
    ecoWisdom: `${card.wisdom} Dalam perspektif Terranesia, nilai ini dibaca sebagai cara komunitas menjaga batas pemakaian alam agar budaya dan lingkungan tetap hidup bersama.`,
    artIdentity: `${card.tradition} Unsur seni, rumah, pakaian, tarian, atau simbol adat menjadi penanda identitas yang membuat cerita budaya mudah dikenali lintas generasi.`,
    trivia: card.funFact,
    timeline: [
      { era: 'Akar budaya', text: card.history },
      { era: 'Tradisi hidup', text: card.tradition },
      { era: 'Relevansi kini', text: card.education },
    ],
    glossary: [
      { term: card.culture, meaning: `Kata kunci untuk mengenali budaya ${card.name}.` },
      { term: card.region, meaning: `Wilayah budaya utama ${card.name} dalam peta Terranesia.` },
    ],
    challenge: `Ambil satu nilai dari ${card.name}: ${card.wisdom} Terapkan dalam aksi kecil hari ini, misalnya hemat air, mengurangi sampah, atau memilih produk lokal.`,
  };

  return { ...fallback, ...cultureStoryOverrides[card.id] };
}

function getMotifStyle(card: CultureCard): CSSProperties {
  const palette: Record<Region, string[]> = {
    Sumatera: ['rgba(244, 162, 97, 0.24)', 'rgba(45, 106, 79, 0.22)'],
    'Pulau Jawa': ['rgba(82, 183, 136, 0.24)', 'rgba(244, 162, 97, 0.2)'],
    Kalimantan: ['rgba(16, 185, 129, 0.24)', 'rgba(6, 95, 70, 0.26)'],
    Sulawesi: ['rgba(14, 165, 233, 0.22)', 'rgba(244, 162, 97, 0.2)'],
    'Bali & Nusa Tenggara': ['rgba(251, 191, 36, 0.22)', 'rgba(239, 68, 68, 0.18)'],
    Maluku: ['rgba(56, 189, 248, 0.24)', 'rgba(15, 118, 110, 0.2)'],
    Papua: ['rgba(168, 85, 247, 0.2)', 'rgba(34, 197, 94, 0.2)'],
  };
  const [primary, secondary] = palette[card.region];

  return {
    backgroundImage: `
      radial-gradient(circle at 18px 18px, ${primary} 0 2px, transparent 2px),
      linear-gradient(135deg, transparent 0 42%, ${secondary} 42% 46%, transparent 46% 100%),
      linear-gradient(45deg, transparent 0 44%, ${primary} 44% 48%, transparent 48% 100%)
    `,
    backgroundSize: '34px 34px, 42px 42px, 42px 42px',
  };
}

function getRegionRadarPosition(region: Region) {
  const positions: Record<Region, { left: string; top: string }> = {
    Sumatera: { left: '18%', top: '43%' },
    'Pulau Jawa': { left: '35%', top: '65%' },
    Kalimantan: { left: '44%', top: '38%' },
    Sulawesi: { left: '59%', top: '47%' },
    'Bali & Nusa Tenggara': { left: '55%', top: '68%' },
    Maluku: { left: '72%', top: '52%' },
    Papua: { left: '86%', top: '55%' },
  };

  return positions[region];
}

function getEcoScores(card: CultureCard) {
  if (card.id === 'aceh') {
    return [
      { label: 'Ecology', value: 87, color: '#52B788' },
      { label: 'Custom', value: 91, color: '#F4A261' },
      { label: 'Spirit', value: 92, color: '#38BDF8' },
    ];
  }

  const regionBoost = card.region === 'Kalimantan' || card.region === 'Papua' ? 5 : card.category === 'Maritim' ? 3 : 0;
  const ecological = Math.min(98, 84 + regionBoost + (card.trending ? 3 : 0));
  const custom = Math.min(98, 82 + (card.category === 'Tradisional' || card.category === 'Ritual' ? 9 : 4));
  const spiritual = Math.min(98, 80 + (card.category === 'Ritual' ? 12 : card.category === 'Maritim' ? 7 : 5));

  return [
    { label: 'Ecology', value: ecological, color: '#52B788' },
    { label: 'Custom', value: custom, color: '#F4A261' },
    { label: 'Spirit', value: spiritual, color: '#38BDF8' },
  ];
}

function handleCardTilt(event: React.MouseEvent<HTMLButtonElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * -12;
  event.currentTarget.style.setProperty('--tilt-x', `${y.toFixed(2)}deg`);
  event.currentTarget.style.setProperty('--tilt-y', `${x.toFixed(2)}deg`);
}

function resetCardTilt(event: React.MouseEvent<HTMLButtonElement>) {
  event.currentTarget.style.setProperty('--tilt-x', '0deg');
  event.currentTarget.style.setProperty('--tilt-y', '0deg');
}

const ITEMS_PER_PAGE = 6;

function getCultureOfTheDay() {
  const dayIndex = Math.floor(Date.now() / 86_400_000) % cultureCards.length;
  return cultureCards[dayIndex];
}

export function HistoryCultureSection({ lang }: Props) {
  const tx = translations[lang];
  const [activeRegion, setActiveRegion] = useState<(typeof regions)[number]>('Semua Pulau');
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('Semua Kategori');
  const [search, setSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState<CultureCard | null>(null);
  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [randomFactIndex, setRandomFactIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [ecoSlider, setEcoSlider] = useState(58);
  const [rhythmScore, setRhythmScore] = useState(62);
  const [vrOpen, setVrOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const cultureOfDay = useMemo(getCultureOfTheDay, []);
  const trendingCards = useMemo(() => cultureCards.filter((card) => card.trending).slice(0, 6), []);
  const didYouKnow = cultureCards[randomFactIndex % cultureCards.length];
  const explorePercent = Math.round((viewedIds.length / cultureCards.length) * 100);
  const badgeLabel = explorePercent >= 75 ? 'Culture Ranger' : explorePercent >= 35 ? 'Penjelajah Nusantara' : viewedIds.length > 0 ? 'Rookie Explorer' : 'Mulai Jelajah';

  const filteredCards = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return cultureCards.filter((card) => {
      const regionMatch = activeRegion === 'Semua Pulau' || card.region === activeRegion;
      const categoryMatch = activeCategory === 'Semua Kategori' || card.category === activeCategory;
      const searchMatch = !normalizedSearch || [
        card.name,
        card.region,
        card.location,
        card.category,
        card.culture,
        card.funFact,
        card.history,
      ].some((value) => value.toLowerCase().includes(normalizedSearch));

      return regionMatch && categoryMatch && searchMatch;
    });
  }, [activeCategory, activeRegion, search]);

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / ITEMS_PER_PAGE));
  const pagedCards = useMemo(
    () => filteredCards.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredCards, currentPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeRegion, search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const openCard = (card: CultureCard) => {
    setSelectedCard(card);
    setViewedIds((current) => (current.includes(card.id) ? current : [...current, card.id]));
    setQuizAnswer('');
    setEcoSlider(58);
    setRhythmScore(card.id === 'aceh' ? 62 : rhythmScore);
    setVrOpen(false);
  };

  const closeStoryMode = () => {
    setSelectedCard(null);
    setVrOpen(false);
  };

  const showRandomCulture = () => {
    const pool = filteredCards.length > 0 ? filteredCards : cultureCards;
    const randomCard = pool[Math.floor(Math.random() * pool.length)];
    openCard(randomCard);
  };

  const nextRandomFact = () => {
    setRandomFactIndex((current) => (current + 7) % cultureCards.length);
  };

  const selectedStory = selectedCard ? getCultureStory(selectedCard) : null;

  useEffect(() => {
    if (selectedCard?.id !== 'aceh') return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (['a', 's', 'd', 'f'].includes(event.key.toLowerCase())) {
        setRhythmScore((current) => Math.min(100, current + 3));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCard?.id]);

  return (
    <section id="historyculture" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <Sparkles className="h-4 w-4" />
            {tx.explorer}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{tx.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{tx.subtitle}</p>
        </motion.div>

        <div className="mb-8 grid gap-4 lg:grid-cols-[1.4fr_0.9fr_0.9fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tx.searchPlaceholder}
              className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <select
            value={activeRegion}
            onChange={(e) => setActiveRegion(e.target.value as (typeof regions)[number])}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
          >
            {regions.map((region) => (
              <option key={region} value={region}>{region === 'Semua Pulau' ? tx.regionAll : region}</option>
            ))}
          </select>
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value as (typeof categories)[number])}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category === 'Semua Kategori' ? tx.categoryAll : category}</option>
            ))}
          </select>
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{tx.progress}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{explorePercent}%</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Award className="h-3.5 w-3.5" />
                {badgeLabel}
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${explorePercent}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{viewedIds.length} dari {cultureCards.length} budaya sudah dibuka.</p>
          </div>

          <button
            onClick={showRandomCulture}
            className="group rounded-2xl border border-primary/30 bg-primary/10 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/60 hover:bg-primary/15"
          >
            <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <RefreshCw className="h-5 w-5 transition group-hover:rotate-180" />
            </div>
            <p className="text-sm font-semibold text-foreground">{tx.random}</p>
            <p className="mt-1 text-xs text-muted-foreground">Buka satu budaya acak dan tambah progress eksplorasi.</p>
          </button>

          <button
            onClick={() => openCard(cultureOfDay)}
            className="group rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/40"
          >
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Trophy className="h-4 w-4" />
              {tx.cultureOfDay}
            </div>
            <p className="text-xl font-bold text-foreground">{cultureOfDay.name}</p>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{cultureOfDay.funFact}</p>
          </button>
        </div>

        <div className="mb-10 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Brain className="h-4 w-4 text-primary" />
                {tx.didYouKnow}
              </div>
              <button onClick={nextRandomFact} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-primary">
                Ganti
              </button>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{didYouKnow.funFact}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Flame className="h-4 w-4 text-primary" />
              {tx.trending}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {trendingCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => openCard(card)}
                  className="shrink-0 rounded-full border border-border bg-muted/40 px-4 py-2 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  {card.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan <span className="font-semibold text-foreground">{filteredCards.length}</span> budaya
            {totalPages > 1 && (
              <span className="ml-2 text-xs text-muted-foreground">(Halaman {currentPage} dari {totalPages})</span>
            )}
          </p>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Hover untuk highlight, klik untuk story mode.
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {pagedCards.map((card) => (
            <motion.button
              key={card.id}
              layoutId={`culture-card-${card.id}`}
              onClick={() => openCard(card)}
              onMouseMove={handleCardTilt}
              onMouseLeave={resetCardTilt}
              style={{ transform: 'perspective(900px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))' }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card text-left shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <div className="relative h-56 overflow-hidden">
                <motion.img
                  layoutId={`culture-image-${card.id}`}
                  src={card.image}
                  alt={card.name}
                  onError={(event) => {
                    const fallback = imageByRegion[card.region];
                    if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
                  }}
                  className="h-full w-full object-cover grayscale-[20%] sepia-[18%] transition duration-700 group-hover:scale-110 group-hover:grayscale-0 group-hover:sepia-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/35 to-black/10 transition duration-500 group-hover:from-card/90 group-hover:via-card/15" />
                <div
                  className="absolute inset-x-0 bottom-0 h-32 translate-y-16 opacity-0 mix-blend-screen transition duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                  style={getMotifStyle(card)}
                />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
                    {card.category}
                  </span>
                  {viewedIds.includes(card.id) && (
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur">
                      Dilihat
                    </span>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-foreground">
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary">
                    <MapPin className="h-3 w-3" />
                    {card.location}
                  </div>
                  <h3 className="mt-2 text-xl font-semibold">{card.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{card.funFact}</p>
                </div>
              </div>
              <div className="space-y-3 px-5 py-4 bg-muted/30">
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>{card.culture}</span>
                  <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-primary">{card.region}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="max-w-[13rem] translate-y-2 text-xs leading-relaxed text-muted-foreground opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {getCultureStory(card).artIdentity}
                  </p>
                  <div className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <ChevronRight className="mr-1 inline h-3 w-3" /> Masuk Cerita
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {filteredCards.length > 0 && (
          <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-muted-foreground">{Math.min(ITEMS_PER_PAGE, filteredCards.length)} budaya ditampilkan per halaman.</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}

        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{tx.noResults}</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCard && selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-8 backdrop-blur-sm"
            onClick={closeStoryMode}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.98 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeStoryMode}
                aria-label={tx.close}
                className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/85 text-foreground transition hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="max-h-[90vh] overflow-y-auto">
                <div className="relative overflow-hidden border-b border-border bg-foreground text-background">
                  <div className="absolute inset-0 opacity-25" style={getMotifStyle(selectedCard)} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(82,183,136,0.3),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(244,162,97,0.22),transparent_28%)]" />
                  {[0, 1, 2, 3, 4, 5].map((dot) => (
                    <motion.span
                      key={dot}
                      className="absolute h-1.5 w-1.5 rounded-full bg-primary/70"
                      style={{ left: `${12 + dot * 14}%`, top: `${18 + (dot % 3) * 18}%` }}
                      animate={{ y: [0, -10, 0], opacity: [0.25, 0.8, 0.25] }}
                      transition={{ duration: 3 + dot * 0.35, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  ))}

                  <div className="relative grid gap-0 lg:grid-cols-[1.25fr_0.85fr]">
                    <div className="flex min-h-[24rem] flex-col justify-end px-6 pb-8 pt-24 sm:px-8">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">{selectedCard.category}</span>
                        <span className="rounded-full bg-background/15 px-3 py-1 text-xs font-semibold text-background backdrop-blur">{selectedCard.region}</span>
                      </div>
                      <motion.h3
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-background sm:text-5xl"
                      >
                        {selectedCard.name}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        className="mt-3 max-w-2xl text-sm leading-relaxed text-background/70"
                      >
                        {selectedCard.location} | {selectedCard.culture}
                      </motion.p>

                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        {getEcoScores(selectedCard).map((score) => (
                          <EcoScoreWheel key={score.label} {...score} />
                        ))}
                      </div>
                    </div>

                    <div className="relative min-h-[24rem] overflow-hidden border-t border-background/10 lg:border-l lg:border-t-0">
                      <motion.img
                        layoutId={`culture-image-${selectedCard.id}`}
                        src={selectedCard.image}
                        alt={selectedCard.name}
                        onError={(event) => {
                          const fallback = imageByRegion[selectedCard.region];
                          if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
                        }}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                      <MiniRadar region={selectedCard.region} location={selectedCard.location} />
                      <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-white/10 p-4 text-white backdrop-blur">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-white/60">Audio & Trivia</p>
                            <p className="text-sm font-semibold">{selectedStory.glossary[0]?.term ?? selectedCard.culture}</p>
                          </div>
                          <AudioWaveform />
                        </div>
                        <p className="text-xs leading-relaxed text-white/70">{selectedStory.trivia}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedCard.id === 'aceh' && (
                  <AcehLivingCanvas
                    card={selectedCard}
                    story={selectedStory}
                    ecoSlider={ecoSlider}
                    setEcoSlider={setEcoSlider}
                    rhythmScore={rhythmScore}
                    setRhythmScore={setRhythmScore}
                    onLaunchVr={() => setVrOpen(true)}
                  />
                )}

                <div className="grid gap-6 p-6 lg:grid-cols-[1.35fr_0.8fr]">
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">4-Pillars of Culture</p>
                      <h4 className="mt-1 text-xl font-bold text-foreground">Story Mode {selectedCard.name}</h4>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <StoryBlock icon={<BookOpen className="h-4 w-4" />} title="Asal-Usul & Sejarah" text={selectedCard.history} />
                      <StoryBlock icon={<Leaf className="h-4 w-4" />} title="Kearifan Ekologis" text={selectedStory.ecoWisdom} />
                      <StoryBlock icon={<Sparkles className="h-4 w-4" />} title="Seni & Simbolisme" text={selectedStory.artIdentity} />
                      <StoryBlock icon={<Brain className="h-4 w-4" />} title="Did You Know?" text={selectedStory.trivia} />
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-border bg-muted/30">
                      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="relative h-72 overflow-hidden">
                          <img
                            src={selectedCard.image}
                            alt={`${selectedCard.name} eco comparison`}
                            onError={(event) => {
                              const fallback = imageByRegion[selectedCard.region];
                              if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
                            }}
                            className="absolute inset-0 h-full w-full object-cover grayscale saturate-50"
                          />
                          <div className="absolute inset-0 bg-destructive/30" />
                          <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${ecoSlider}%` }}>
                            <img
                              src={selectedCard.image}
                              alt=""
                              onError={(event) => {
                                const fallback = imageByRegion[selectedCard.region];
                                if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
                              }}
                              className="h-full w-[42rem] max-w-none object-cover saturate-125"
                            />
                            <div className="absolute inset-0 bg-primary/15" />
                          </div>
                          <div className="absolute inset-y-0" style={{ left: `${ecoSlider}%` }}>
                            <div className="-ml-px h-full w-0.5 bg-background shadow-lg" />
                            <div className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-black/45 text-xs font-bold text-white backdrop-blur">
                              {ecoSlider}
                            </div>
                          </div>
                          <input
                            type="range"
                            min="25"
                            max="82"
                            value={ecoSlider}
                            onChange={(event) => setEcoSlider(Number(event.target.value))}
                            className="absolute inset-x-6 bottom-5 accent-primary"
                            aria-label="Eco wisdom comparison slider"
                          />
                        </div>
                        <div className="p-5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Interactive Eco-Wisdom</p>
                          <h5 className="mt-2 text-lg font-bold text-foreground">Dari eksploitasi menuju ruang hidup yang dijaga</h5>
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{selectedStory.ecoWisdom}</p>
                          <div className="mt-4 grid grid-cols-3 gap-2">
                            {getEcoScores(selectedCard).map((score) => (
                              <div key={score.label} className="rounded-xl border border-border bg-card p-3 text-center">
                                <div className="text-lg font-bold text-foreground">{score.value}%</div>
                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{score.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-muted/30 p-5">
                      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        Timeline Sejarah
                      </div>
                      <div className="space-y-3">
                        {selectedStory.timeline.map((item) => (
                          <div key={`${selectedCard.id}-${item.era}`} className="grid gap-2 sm:grid-cols-[7rem_1fr]">
                            <div className="text-xs font-semibold uppercase tracking-wider text-primary">{item.era}</div>
                            <p className="border-l border-border pl-4 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-border bg-muted/30 p-5">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Brain className="h-4 w-4 text-primary" />
                        Fun Fact
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{selectedCard.funFact}</p>
                    </div>

                    <div className="rounded-2xl border border-primary/25 bg-primary/10 p-5">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Target className="h-4 w-4 text-primary" />
                        Eco-Challenge
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{selectedStory.challenge}</p>
                    </div>

                    <div className="rounded-2xl border border-border bg-muted/30 p-5">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Volume2 className="h-4 w-4 text-primary" />
                        Kamus Mini
                      </div>
                      <div className="space-y-3">
                        {selectedStory.glossary.map((item) => (
                          <div key={`${selectedCard.id}-${item.term}`} className="rounded-xl border border-border bg-card p-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-foreground">{item.term}</p>
                              {item.pronunciation && (
                                <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">{item.pronunciation}</span>
                              )}
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.meaning}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-muted/30 p-5">
                      <div className="mb-3 text-sm font-semibold text-foreground">{tx.quiz}</div>
                      <p className="mb-3 text-sm text-muted-foreground">Suku {selectedCard.name} berasal dari wilayah mana?</p>
                      <div className="grid gap-2">
                        {[selectedCard.region, 'Sumatera', 'Papua']
                          .filter((value, index, array) => array.indexOf(value) === index)
                          .slice(0, 3)
                          .map((answer) => (
                            <button
                              key={answer}
                              onClick={() => setQuizAnswer(answer)}
                              className={`rounded-xl border px-4 py-2 text-left text-xs font-semibold transition ${
                                quizAnswer === answer
                                  ? answer === selectedCard.region
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-destructive/40 bg-destructive/10 text-destructive'
                                  : 'border-border bg-card text-foreground hover:border-primary/40'
                              }`}
                            >
                              {answer}
                            </button>
                          ))}
                      </div>
                      {quizAnswer && (
                        <p className="mt-3 text-xs text-muted-foreground">
                          {quizAnswer === selectedCard.region ? tx.correct : tx.wrong}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {vrOpen && selectedCard.id === 'aceh' && (
                  <AcehVrSimulator onClose={() => setVrOpen(false)} />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function AcehLivingCanvas({
  card,
  story,
  ecoSlider,
  setEcoSlider,
  rhythmScore,
  setRhythmScore,
  onLaunchVr,
}: {
  card: CultureCard;
  story: CultureStoryContent;
  ecoSlider: number;
  setEcoSlider: Dispatch<SetStateAction<number>>;
  rhythmScore: number;
  setRhythmScore: Dispatch<SetStateAction<number>>;
  onLaunchVr: () => void;
}) {
  return (
    <div className="rounded-3xl border border-border bg-slate-950/95 p-6 text-white shadow-2xl mb-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Aceh Story Mode</p>
        <h3 className="mt-3 text-2xl font-bold">Ritme Saman & Kearifan Pesisir</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          {story.ecoWisdom}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-semibold text-white">Tari Saman</p>
          <p className="mt-2 text-xs leading-relaxed text-white/70">
            Tari Saman adalah bahasa tubuh kolektif: tepuk tangan, dada, dan paha bergerak cepat seperti gelombang. Busana hitam-emas dan pola Gayo menegaskan disiplin, doa, dan kebersamaan yang ritmis.
          </p>
          <div className="mt-4 rounded-2xl bg-background/5 p-3">
            <div className="text-[11px] uppercase tracking-[0.18em] text-primary">Rhythm meter</div>
            <div className="mt-2 flex items-center justify-between text-sm text-white">
              <span>Score</span>
              <span className="font-semibold">{rhythmScore}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-primary" style={{ width: `${rhythmScore}%` }} />
            </div>
            <p className="mt-2 text-xs text-white/60">Tekan A, S, D, F untuk tambah ritme ketika Aceh aktif.</p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-semibold text-white">Eco Slider</p>
          <p className="mt-2 text-xs leading-relaxed text-white/70">
            Geser untuk membandingkan ruang hidup terjaga dengan tekanan modern.
          </p>
          <input
            type="range"
            min="25"
            max="82"
            value={ecoSlider}
            onChange={(event) => setEcoSlider(Number(event.target.value))}
            className="mt-4 w-full accent-primary"
            aria-label="Aceh eco slider"
          />
          <div className="mt-3 flex items-center justify-between text-xs text-white/70">
            <span>Tradisi</span>
            <span>{ecoSlider}%</span>
          </div>
          <button
            type="button"
            onClick={onLaunchVr}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Masuk Aceh VR
          </button>
        </div>
      </div>
    </div>
  );
}

function AcehVrSimulator({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 py-10">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-white/15 bg-slate-800/90 p-2 text-white transition hover:bg-slate-700"
          aria-label="Close VR simulator"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="space-y-4 text-white">
          <div className="rounded-3xl bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Aceh VR Simulator</p>
            <h4 className="mt-2 text-2xl font-bold">Jelajah Aceh Virtual</h4>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Kamu berada di dalam dunia Aceh digital: pantai, meunasah, dan ritme Saman yang bergerak seirama dengan komunitas.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Ritme</p>
              <p className="mt-2 text-xs text-white/70">Rasakan kekompakan gerak dan nuansa musik tradisional.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Hutan Pesisir</p>
              <p className="mt-2 text-xs text-white/70">Pelajari etika laut dan tanggung jawab terhadap ekosistem setempat.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoryBlock({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {

  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-5">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        {icon}
        {title}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

function EcoScoreWheel({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
      <svg viewBox="0 0 44 44" className="h-11 w-11 -rotate-90">
        <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="5" />
        <motion.circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeWidth="5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: value / 100 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
      </svg>
      <div>
        <div className="text-lg font-bold text-background">{value}%</div>
        <div className="text-[10px] uppercase tracking-wider text-background/55">{label}</div>
      </div>
    </div>
  );
}

function MiniRadar({ region, location }: { region: Region; location: string }) {
  const position = getRegionRadarPosition(region);

  return (
    <div className="absolute right-5 top-5 w-40 rounded-2xl border border-white/20 bg-black/35 p-4 text-white backdrop-blur">
      <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/60">
        <MapPin className="h-3 w-3" />
        Mini Radar
      </div>
      <div className="relative h-20 rounded-xl border border-white/15 bg-white/10">
        <div className="absolute left-[12%] top-[36%] h-8 w-20 rounded-full border border-white/20" />
        <div className="absolute left-[36%] top-[28%] h-9 w-14 rounded-full border border-white/20" />
        <div className="absolute left-[54%] top-[45%] h-5 w-24 rounded-full border border-white/20" />
        <div className="absolute" style={position}>
          <motion.span
            className="absolute -left-3 -top-3 h-6 w-6 rounded-full border border-primary"
            animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.9, 0.1, 0.9] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-primary shadow-[0_0_18px_rgba(82,183,136,0.9)]" />
        </div>
      </div>
      <p className="mt-2 line-clamp-1 text-[11px] text-white/70">{location}</p>
    </div>
  );
}

function AudioWaveform() {
  return (
    <button type="button" className="flex h-10 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3" aria-label="Preview cultural soundbite">
      {[8, 16, 11, 22, 14].map((height, index) => (
        <motion.span
          key={index}
          className="w-1 rounded-full bg-primary"
          style={{ height }}
          animate={{ scaleY: [0.55, 1, 0.55] }}
          transition={{ duration: 0.9, delay: index * 0.08, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </button>
  );
}