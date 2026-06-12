import { type CSSProperties, type Dispatch, type SetStateAction, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronRight,
  MapPin,
  Search,
  Sparkles,
  X,
} from 'lucide-react';

interface Props { lang: 'id' | 'en' }

type Region = 'Sumatera' | 'Pulau Jawa' | 'Kalimantan' | 'Sulawesi' | 'Bali & Nusa Tenggara' | 'Maluku' | 'Papua';
type Category = 'Tradisional' | 'Maritim' | 'Pegunungan' | 'Ritual' | 'Urban / Akulturasi';

export interface CultureCard {
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

const realCultureImages: Record<string, string> = {
  aceh: 'https://commons.wikimedia.org/wiki/Special:FilePath/Saman%20dance%20%28Aceh%29.jpg',
  gayo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gayo%20Wedding.JPG',
  alas: 'https://commons.wikimedia.org/wiki/Special:FilePath/Adat%20Alas.jpg',
};

function getCultureImage(card: CultureCard) {
  if (realCultureImages[card.id]) return realCultureImages[card.id];
  if (/^https?:\/\//.test(card.image)) return card.image;
  return imageByRegion[card.region];
}

export const cultureCards: CultureCard[] = [
  {
    id: 'aceh',
    name: 'Aceh',
    region: 'Sumatera',
    location: 'Aceh',
    category: 'Ritual',
    culture: 'Islam kuat dan Tari Saman',
    funFact: 'Tari Saman bisa terlihat seperti gelombang karena penarinya bergerak sangat kompak.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Saman%20dance%20%28Aceh%29.jpg',
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
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gayo%20Wedding.JPG',
    history: 'Orang Gayo hidup di dataran tinggi Aceh Tengah, Bener Meriah, dan Gayo Lues. Lanskap pegunungan, danau, kebun kopi, serta tradisi tutur membentuk masyarakat yang kuat dalam kerja kolektif dan ingatan lisan.',
    tradition: 'Didong, Saman, kerawang Gayo, kenduri kampung, dan budaya bertani kopi menjadi ruang tempat syair, nasihat, humor, dan kritik sosial diwariskan.',
    wisdom: 'Tanah subur dipandang sebagai titipan yang harus dirawat lewat kerja tekun, pengaturan musim, dan hubungan saling bantu antarpetani.',
    education: 'Gayo memperlihatkan bahwa komoditas global seperti kopi tetap punya akar lokal: bahasa, tanah, ritme kerja, dan martabat petani.',
  },
  {
    id: 'alas',
    name: 'Alas',
    region: 'Sumatera',
    location: 'Aceh Tenggara',
    category: 'Tradisional',
    culture: 'Adat kuat dan agraris',
    funFact: 'Kehidupan agraris membuat kalender adat Alas dekat dengan musim tanam dan panen.',
    image: 'https://lily846.files.wordpress.com/2013/03/p4af516b4aa426.jpg',
    history: 'Suku Alas berakar di Lembah Alas, Aceh Tenggara, kawasan yang dilalui sungai, sawah, kebun, dan jalur pertemuan masyarakat pedalaman Sumatera. Identitasnya dibangun lewat bahasa Alas, marga, adat kampung, dan hubungan erat dengan tanah garapan.',
    tradition: 'Mesikhat, bangsi Alas, kenduri, adat perkawinan, dan kerja sawah menjadi bagian dari cara masyarakat menandai peristiwa hidup: kelahiran, pernikahan, panen, musyawarah, dan penyelesaian sengketa.',
    wisdom: 'Pangan, keluarga, dan kerja bersama tidak diperlakukan sebagai tema romantis, tetapi sebagai sistem sosial: siapa menanam, siapa membantu, siapa menjaga air, dan siapa bertanggung jawab ketika kampung menghadapi krisis.',
    education: 'Budaya Alas membantu pelajar membaca agraris bukan sekadar pekerjaan tani, melainkan pengetahuan tentang musim, air, solidaritas, dan tata hidup komunitas.',
  },
  {
    id: 'batak-toba',
    name: 'Batak Toba',
    region: 'Sumatera',
    location: 'Sekitar Danau Toba, Sumatera Utara',
    category: 'Tradisional',
    culture: 'Danau Toba dan ulos',
    funFact: 'Ulos bukan sekadar kain, tetapi simbol doa, kasih, dan ikatan keluarga.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lake_Toba%2C_North_Sumatra%2C_Indonesia.jpg',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuUmPHHjpcKysz-opWpHt1_foaLeGhM4f82g&s',
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
    image: 'https://minangel.wordpress.com/wp-content/uploads/2018/02/suku-batak-mandailing.jpg',
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
    image: 'https://radarmukomuko.disway.id/upload/2e42cb28f6dff3e254dbb8e69a155a8b.jpg',
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
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rumah_Gadang.jpg',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIyMCCNKq4fX1nF2PivDezR2xN0yg0bHNMFg&s',
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
    image: 'https://inca.ac.id/wp-content/uploads/2025/03/suku-melayu-6143ea1306310e657c711402.jpg',
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
    image: 'https://cdn-jpr.jawapos.com/images/22/2024/10/21/mengenal-rejang-tarian-menyambut-turunnya-dewa-dari-kahyangan_m_61621-3031225013.jpeg',
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
    image: 'https://mitrapol.com/wp-content/uploads/2024/07/Siger-lampung.jpg',
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
    image: 'https://storage.googleapis.com/arsitagx-master-article/article-photo/105/Rumah-Adat-Tradisional-Joglo.jpg',
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
    image: 'https://img.merahputih.com/media/2016/04/29/sW0xi2B4LS1461903881.jpg',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTeffyHF1A7BLrCCG9y3wLPhJqLHbHA4NueA&s',
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
    image: 'https://bidikutama.com/wp-content/uploads/2024/03/1000060849.png',
    history: 'Baduy mempertahankan cara hidup sederhana untuk menjaga hutasn dan adat. Pilihan itu membuat mereka menjadi contoh kuat tentang konsistensi budaya.',
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
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mount_Bromo.jpg',
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
    image: 'https://jadiberangkat.id/wp-content/uploads/2025/04/Gandrung-Banyuwangi-1.webp',
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
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Karapan_Sapi_Madura_%28cropped%29.jpg',
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
    image: 'https://i.misteraladin.com/blog/2024/07/10154419/08b2cccdf82f1378285488de7eedfb73.jpg',
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
    image: 'https://infopublik.id/assets/upload/headline//Temu-Akbar-Pasukan-Merah-Tbbr-291122-jhw-3.jpg',
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
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR48ZAdV55pTEQzxoxioRvSETKeWUnbHPgayQ&s",
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
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzkfe4Vs6lnmyw-eK0_yRmU09woIVy6MMOaQ&s",
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
    image: "https://tatkala.co/wp-content/uploads/2024/07/dayak.jpg",
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
    image: "https://img.okezone.com/content/2022/08/29/406/2656917/kisah-suku-dayak-punan-yang-dikenal-sakti-mandraguna-dan-suka-makan-daging-manusia-K6NFXLv3uW.jpg",
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
    image: "https://media.suara.com/pictures/970x544/2022/01/26/82803-fita-anggriani-dan-jamie-iqbal.jpg",
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
    image: "https://www.indonesia.travel/link/e49062dfe11243dab652832b0db9c0c4.aspx",
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
    image: "https://toraja.info/wp-content/uploads/2021/08/Toraja-Society-1536x1021.jpg.webp",
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
    image: "https://superlive.id/storage/superadventure/2019/11/19/06ba4babe201.jpg",
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
    image: "https://rricoid-assets.obs.ap-southeast-4.myhuaweicloud.com/berita/Gorontalo/o/1759996006147-2023-07-03_72121835764a244f8d1d75/17ppy4xilbid559.jpeg",
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
    image: "https://antro.fisip.unair.ac.id/wp-content/uploads/2022/06/Foto-Ilustrasi-Mandar.jpg",
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
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZdL_8kukHlyuk25qeCH9LtRFD14s7nyZdKQ&s",
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
    image: "https://stimsukmamedan.ac.id/wp-content/uploads/2025/02/bali-1-1582544096.profileImage.2x-1536x884-1.webp",
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
    image: "https://www.indonesia.travel/contentassets/366c9bc8654b4497affe582ef16be938/rumah-bale.jpeg",
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
    image: "https://akcdn.detik.net.id/visual/2020/09/23/pulau-kenawa_169.jpeg?w=1200",
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
    image: "https://awsimages.detik.net.id/community/media/visual/2018/10/25/374018f7-61d3-48b0-9341-acafa730ab5b_169.jpeg?w=620",
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
    image: "https://awsimages.detik.net.id/community/media/visual/2023/11/14/desa-adat-ratenggaro-terletak-di-kecamatan-kodi-bangedo-kabupaten-sumba-barat-daya-ntt-dok-kemenparekrafarief-hidayat-masday-1_169.jpeg?w=1200",
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
    image: "https://mawatu.co.id/wp-content/uploads/2024/06/suku-manggarai-1024x682.webp",
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
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYHBfS0pS3cCC8zg34VUGszXSkaWY4vbEVlg&s",
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
    image: "https://matamaluku.com/wp-content/uploads/2021/05/Bahasa-Ambon.jpeg",
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
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRim2q0LmM3zylfAudLqJii9IXDTKdzWuKQdw&s",
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
    image: "https://kataomed.com/wp-content/uploads/2020/08/Daftar-Suku-Di-Maluku-dan-Maluku-Utara.jpg",
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
    image: "https://hypeabis.id/assets/photo/20211205224827000000AgungPambudhy081219277197TarianPerangSukuKei.jpg",
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
    image: "https://www.eigeradventure.com/blog/wp-content/uploads/2025/01/pulau-seram.jpg",
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
    image: "https://pesonapapua.com/wp-content/uploads/2024/04/Mengenal-Lebih-Dalam-Tentang-Suku-Dani-Di-Papua.jpg",
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
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDDmesoBuTAuTFCzfDZmg5FCi-Nz8C_OLPSg&s",
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
    image: "https://www.pesonaindo.com/wp-content/uploads/2016/06/Aktivitas-Suku-korowai-Papua.jpg",
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
    image: "https://pesonapapua.com/wp-content/uploads/2024/04/Ayo-Mengenal-Lebih-Dalam-Tentang-Suku-Lani-Papua-3.jpg",
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
    image: "https://awsimages.detik.net.id/community/media/visual/2020/12/03/papua-2_169.jpeg?w=1200",
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
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Tari_Awaijale_Rilejale.png/330px-Tari_Awaijale_Rilejale.png",
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
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLoFKvoALF7msWBxJ-ASDFLh4GY_zsGyyMIw&s",
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
  gayo: {
    ecoWisdom: 'Dataran Tinggi Gayo mengajarkan hubungan yang sangat konkret antara iklim mikro, hutan, air, dan kopi. Kualitas panen tidak hanya lahir dari varietas, tetapi dari cara kebun dijaga, naungan pohon dipertahankan, dan tanah tidak dipaksa bekerja di luar batasnya.',
    artIdentity: 'Didong adalah arena tutur yang cerdas: kelompok seniman menyampaikan syair, nasihat, sejarah, humor, dan kritik sosial dalam ritme tepuk dan vokal. Kerawang Gayo pada busana adat menghadirkan identitas visual lewat pola yang rapi, padat, dan berwibawa.',
    trivia: 'Kopi Gayo dikenal sebagai kopi arabika dataran tinggi; reputasinya tumbuh bersama kerja petani, koperasi, dan lanskap pegunungan Aceh.',
    timeline: [
      { era: 'Dataran tinggi', text: 'Permukiman Gayo berkembang di ruang pegunungan yang dekat dengan danau, hutan, dan lahan pertanian.' },
      { era: 'Tradisi tutur', text: 'Didong dan Saman menjaga ingatan kolektif melalui syair, tubuh, tempo, dan dialog sosial.' },
      { era: 'Kopi', text: 'Kebun kopi menghubungkan rumah tangga petani dengan pasar dunia tanpa memutus akar lokalnya.' },
      { era: 'Kini', text: 'Gayo menjadi contoh bagaimana budaya, lanskap, dan ekonomi lokal bisa dibaca sebagai satu ekosistem.' },
    ],
    glossary: [
      { term: 'Didong', meaning: 'Seni tutur dan vokal Gayo yang berisi syair, nasihat, humor, dan kritik sosial.' },
      { term: 'Kerawang Gayo', meaning: 'Ragam hias khas Gayo yang sering hadir pada busana adat dan identitas visual masyarakat.' },
      { term: 'Kopi Gayo', meaning: 'Kopi arabika dataran tinggi yang melekat dengan ekonomi dan lanskap budaya Gayo.' },
    ],
    challenge: 'Lacak asal satu produk yang kamu konsumsi hari ini. Kalau itu kopi, beras, atau rempah, cari tahu siapa komunitas yang bekerja di baliknya dan bagaimana lahannya dijaga.',
  },
  alas: {
    ecoWisdom: 'Bagi masyarakat Alas, lembah, sungai, sawah, dan kebun adalah infrastruktur hidup. Kearifan ekologisnya tidak selalu muncul sebagai slogan konservasi, tetapi tampak dalam pembagian kerja, gotong royong, pengaturan air, pilihan tanaman, dan adat yang menjaga hubungan antar-keluarga.',
    artIdentity: 'Mesikhat memberi identitas visual yang kuat lewat warna dan motif pada pakaian adat Alas. Bangsi Alas, bahasa daerah, serta prosesi adat perkawinan memperlihatkan budaya yang tumbuh dari ruang agraris namun tetap punya ekspresi artistik yang khas.',
    trivia: 'Nama Alas berkaitan erat dengan Lembah Alas di Aceh Tenggara; ruang hidup ini membentuk bahasa, pertanian, musik, dan adat masyarakatnya.',
    timeline: [
      { era: 'Lembah Alas', text: 'Komunitas Alas tumbuh di Aceh Tenggara, dekat sungai, sawah, kebun, dan jalur pertemuan masyarakat pedalaman.' },
      { era: 'Adat kampung', text: 'Marga, bahasa, kenduri, dan musyawarah menjadi cara menjaga relasi sosial agar konflik tidak merusak ikatan keluarga.' },
      { era: 'Budaya agraris', text: 'Musim tanam, panen, gotong royong, dan pengaturan air membentuk ritme hidup sehari-hari.' },
      { era: 'Kini', text: 'Mesikhat, bangsi Alas, dan adat perkawinan menjadi penanda identitas yang terus diperkenalkan ulang ke generasi muda.' },
    ],
    glossary: [
      { term: 'Mesikhat', meaning: 'Busana dan ragam hias khas Alas yang dikenal melalui warna kuat serta motif adat.' },
      { term: 'Bangsi Alas', meaning: 'Alat musik tiup bambu dari tradisi Alas yang hidup di Aceh Tenggara.' },
      { term: 'Lembah Alas', meaning: 'Ruang geografis dan budaya utama masyarakat Alas, terkait erat dengan sungai, sawah, dan kampung.' },
    ],
    challenge: 'Ambil satu pelajaran dari budaya agraris Alas: rawat sumber yang membuat hidup berjalan. Hari ini bisa sesederhana menghemat air, membeli pangan lokal, atau tidak menyia-nyiakan makanan.',
  },
  'batak-toba': {
    ecoWisdom: 'Danau Toba dalam mitologi Batak Toba bukan hanya fenomena geografis, tetapi pusat identitas spiritual dan sosial. Air danau, ikan, dan jalur transportasi membuat masyarakat mengerti saling ketergantungan antar-komunitas.',
    artIdentity: 'Ulos adalah teks hidup: setiap ragam hias, warna, dan pola menceritakan doa, harapan, dan hubungan. Tari tortor menampilkan kerendahan hati dan hormat pada leluhur lewat gerak tubuh yang ritualik namun hangat.',
    trivia: 'Ulos tidak diperjual-belikan sembarangan karena diandaikan sebagai pembawa doa dan kasih sayang. Ulos adalah hadiah yang mengandung tanggung jawab relasional.',
    timeline: [
      { era: 'Masyarakat danau', text: 'Kehidupan Batak Toba tumbuh di sekitar Danau Toba dengan sistem marga yang kuat dan hubungan keluarga yang hierarkis.' },
      { era: 'Ulos & kenduri', text: 'Upacara adat keluarga menjadi ruang utama di mana ulos diberikan, musik dibunyikan, dan ikatan diperkuat.' },
      { era: 'Gondang', text: 'Musik gondang sambilan menjadi bahasa emosi, syukur, dan doa kolektif dalam banyak acara.' },
      { era: 'Kini', text: 'Ulos dan gondang tetap menjadi simbol identitas meski masyarakat Batak Toba tersebar di berbagai wilayah.' },
    ],
    glossary: [
      { term: 'Ulos', meaning: 'Kain tenun adat Batak Toba yang membawa doa, kasih, dan ikatan keluarga.', pronunciation: 'oo-los' },
      { term: 'Gondang', meaning: 'Musik tradisional Batak yang dimainkan dengan alat pukul dan mengisi acara upacara adat.' },
      { term: 'Tortor', meaning: 'Tarian adat Batak Toba yang menampilkan hormat pada leluhur dan kerendahan hati.' },
    ],
    challenge: 'Pikirkan satu anggota keluarga yang kamu hormati. Ekspresikan rasa hormat itu bukan melalui barang, tetapi melalui waktu, percakapan, atau bantuan nyata.',
  },
  'batak-karo': {
    ecoWisdom: 'Tanah Karo yang subur membuat masyarakat memahami hubungan timbal balik dengan alam: tanah yang diberi kerja berkualitas akan memberikan hasil. Sistem marga yang rapi juga membuat pengambilan keputusan tentang lahan sangat terstruktur.',
    artIdentity: 'Rumah adat Karo (Siwaluh Juhar) memiliki tiang, kayu, dan ukiran yang menampilkan sistem marga dan stratifikasi sosial. Pakaian adat, terutama untuk perempuan, menggunakan kain songket dengan warna-warna berani yang menunjukkan status dan identitas marga.',
    trivia: 'Marga dalam adat Karo bukan sekadar nama keluarga, tetapi sistem yang mengatur siapa boleh menikah siapa, peran dalam upacara, dan tanggung jawab sosial.',
    timeline: [
      { era: 'Dataran Karo', text: 'Permukiman Karo tumbuh di ketinggian sedang dengan lahan berbukit, perkebunan, dan sistem air yang baik.' },
      { era: 'Sistem marga', text: 'Empat marga utama (Karo, Ginting, Sembiring, Tarigan) membentuk struktur sosial yang sangat teratur.' },
      { era: 'Kerja tahun', text: 'Kerja Tahun adalah upacara panen yang melibatkan seluruh komunitas dan menjadi ajang merawat hubungan sosial.' },
      { era: 'Kini', text: 'Sistem marga masih dipegang teguh meski kota modern makin dekat.' },
    ],
    glossary: [
      { term: 'Marga', meaning: 'Garis keturunan dan sistem organisasi sosial dalam masyarakat Batak Karo.' },
      { term: 'Siwaluh Juhar', meaning: 'Rumah adat Karo yang terdiri dari delapan ruang, mencerminkan sistem marga.' },
      { term: 'Kerja Tahun', meaning: 'Upacara panen dan merawat hubungan sosial komunitas di Tanah Karo.' },
    ],
    challenge: 'Pelajari satu sistem sosial dalam komunitas tempat kamu tinggal. Bagaimana aturan tersebut menjaga ketertiban dan relasi?',
  },
  'batak-mandailing': {
    ecoWisdom: 'Mandailing hidup di wilayah berbukit dengan sungai yang beberapa darinya cukup deras. Kehidupan agraris di lereng membuat masyarakat memahami risiko longsor dan pentingnya menjaga tutupan hutan.',
    artIdentity: 'Gordang Sambilan dimainkan oleh sembilan musisi dengan tempo yang sangat presisi. Suara yang dihasilkan bukan hanya ritual, tetapi juga bentuk seni yang memukau. Pakaian adat Mandailing, terutama warna merah dan motif emas, menampilkan keberanian dan kecerahan.',
    trivia: 'Seni musik Mandailing tidak hanya hidup dalam acara adat, tetapi juga menjadi kebanggaan komunitas yang ditampilkan di berbagai kesempatan besar.',
    timeline: [
      { era: 'Lereng bukit', text: 'Masyarakat Mandailing tersebar di wilayah berbukit dengan tradisi pertanian dan peternakan yang kuat.' },
      { era: 'Sastra lisan', text: 'Tradisi tutur dan musik membawa sejarah, nasihat, dan nilai-nilai sosial dari generasi ke generasi.' },
      { era: 'Gordang Sambilan', text: 'Alat musik pukul nine-piece menjadi simbol seni musik Mandailing yang presisi dan megah.' },
      { era: 'Kini', text: 'Musik Mandailing dikenal lebih luas di tingkat nasional sebagai warisan budaya yang unik.' },
    ],
    glossary: [
      { term: 'Gordang Sambilan', meaning: 'Alat musik tradisional Mandailing yang terdiri dari sembilan drum dengan suara yang kaya dan megah.', pronunciation: 'gor-dang sam-bi-lan' },
      { term: 'Sirimba', meaning: 'Tarian tradisional Mandailing yang energik dan penuh emosi.' },
    ],
    challenge: 'Dengarkan musik tradisional dari daerah kamu atau daerah lain. Apa yang bisa kamu pahami tentang nilai budayanya dari musik tersebut?',
  },
  nias: {
    ecoWisdom: 'Kehidupan di pulau Nias yang terisolasi mengajarkan kemandirian dan pemanfaatan sumber daya lokal dengan bijak. Desa adat batu dengan sistem pertanian tertentu menunjukkan adaptasi pada topografi dan tanah yang spesifik.',
    artIdentity: 'Fahombo (lompat batu) adalah dramatisasi keberanian dan kedewasaan. Omo Hada (rumah adat besar) dengan arsitektur yang kokoh menampilkan nilai solidaritas dan perlindungan komunitas. Tarian perang mencerminkan sejarah panjang masyarakat yang tangguh.',
    trivia: 'Lompat batu Fahombo dahulu adalah inisiasi pemuda menjelang pernikahan; sekarang lebih banyak dipraktikkan sebagai olahraga dan ikon budaya.',
    timeline: [
      { era: 'Pulau terisolasi', text: 'Pulau Nias yang jauh dari Sumatera besar membuat budaya berkembang dengan ciri khasnya sendiri.' },
      { era: 'Fahombo', text: 'Tradisi lompat batu menjadi cara masyarakat menandai pertumbuhan, keberanian, dan tanggung jawab.' },
      { era: 'Omo Hada', text: 'Rumah adat besar menjadi pusat komunitas, tempat musyawarah, dan simbol solidaritas.' },
      { era: 'Kini', text: 'Fahombo dan budaya Nias menarik perhatian turis dan peneliti sebagai warisan budaya yang unik.' },
    ],
    glossary: [
      { term: 'Fahombo', meaning: 'Lompat batu tradisional Nias yang menjadi simbol keberanian dan kedewasaan pemuda.', pronunciation: 'fa-hom-bo' },
      { term: 'Omo Hada', meaning: 'Rumah adat besar Nias yang berfungsi sebagai pusat komunitas dan tempat berkumpul.' },
    ],
    challenge: 'Temukan satu tradisi yang menandai tahap pertumbuhan dalam budaya atau komunitas kamu. Apa maknanya bagi masyarakat?',
  },
  mentawai: {
    ecoWisdom: 'Mentawai hidup dalam ekosistem hutan tropis yang sangat kompleks. Pengetahuan tentang tanaman obat, daging buruan, dan pemanfaatan sumber daya hutan hanya bisa bertahan jika hutan tetap utuh. Konsep Sikerei (dukun) memadukan spiritual dan pengetahuan ekologis.',
    artIdentity: 'Tato titi (tato tradisional Mentawai) bukan sekadar dekorasi kulit, tetapi peta kehidupan, perjalanan, dan hubungan dengan roh. Rumah Uma adalah unit sosial tempat keluarga besar tinggal bersama dan berbagi sumber daya.',
    trivia: 'Setiap tato di tubuh Mentawai menceritakan kisah: perjalanan, pertemuan dengan roh, atau pencapaian dalam hidup. Tato tidak bisa dibuat seketika, tetapi melalui proses panjang yang melibatkan Sikerei.',
    timeline: [
      { era: 'Pulau-pulau kecil', text: 'Kepulauan Mentawai yang kecil dan terisolasi menciptakan ekosistem unik dengan spesies flora dan fauna yang endemik.' },
      { era: 'Cara hidup hutan', text: 'Masyarakat Mentawai menghuni hutan dengan sistem berburu dan meramu yang teratur sesuai musim.' },
      { era: 'Tato & Sikerei', text: 'Seni tato dan peran Sikerei menjadi pusat kehidupan spiritual dan kesehatan masyarakat.' },
      { era: 'Kini', text: 'Mentawai menghadapi tantangan: konversi hutan dan perubahan gaya hidup generasi muda.' },
    ],
    glossary: [
      { term: 'Titi', meaning: 'Tato tradisional Mentawai yang menceritakan sejarah hidup dan hubungan spiritual.', pronunciation: 'ti-ti' },
      { term: 'Sikerei', meaning: 'Pemimpin spiritual dan penyembuh dalam masyarakat Mentawai yang menggabungkan ritual dan pengetahuan obat.' },
      { term: 'Uma', meaning: 'Rumah komunal Mentawai yang menampung keluarga besar dalam satu struktur besar.' },
    ],
    challenge: 'Pelajari satu tanda atau simbol dari budaya lokal kamu. Apa cerita di baliknya dan bagaimana hal itu dibuat?',
  },
  melayu: {
    ecoWisdom: 'Budaya Melayu pesisir mengenal sistem musim angin yang mengatur kapan boleh berlayar dan kapan harus berlindung. Pengetahuan ini sangat penting untuk keselamatan dan pemanfaatan laut yang berkelanjutan.',
    artIdentity: 'Pantun adalah bentuk puisi yang halus: dalam empat baris, baris pertama dan kedua adalah sampiran (perumpamaan dari alam), sementara baris ketiga dan keempat adalah makna sebenarnya. Zapin adalah tarian yang energik namun penuh keanggunan, sering ditampilkan dalam acara adat dan perayaan.',
    trivia: 'Pantun Melayu sering dipakai untuk menyampaikan nasihat, kritik, atau rayuan dengan cara halus sehingga lawan bicara tidak merasa malu atau tersinggung.',
    timeline: [
      { era: 'Kerajaan pesisir', text: 'Melayu tumbuh sebagai masyarakat pelabuhan yang aktif dalam perdagangan rempah dan jalur laut timur.' },
      { era: 'Bahasa & sastra', text: 'Bahasa Melayu menjadi lingua franca di seluruh Nusantara, sementara sastra Melayu mengembangkan bentuk-bentuk puisi dan cerita yang kaya.' },
      { era: 'Adat bersendi syarak', text: 'Nilai-nilai Islam berpadu dengan adat lokal, membentuk etika sosial yang kuat pada kesopanan dan saling menghormati.' },
      { era: 'Kini', text: 'Bahasa Indonesia yang lahir dari Melayu tetap menjadi identitas nasional yang penting.' },
    ],
    glossary: [
      { term: 'Pantun', meaning: 'Bentuk puisi Melayu yang terdiri dari empat baris dengan rima AABB, dengan sampiran dan isi yang tersembunyi.' },
      { term: 'Zapin', meaning: 'Tarian tradisional Melayu yang energik dan sering ditampilkan dalam acara adat.' },
      { term: 'Budi bahasa', meaning: 'Nilai kesopanan dan etika dalam cara berbicara dan berinteraksi dalam budaya Melayu.' },
    ],
    challenge: 'Coba buat satu pantun tentang sesuatu yang ingin kamu sampaikan. Bisakah kamu menyampaikan pesan dengan cara halus dan penuh perumpamaan?',
  },
  rejang: {
    ecoWisdom: 'Masyarakat Rejang menempati wilayah Bengkulu yang berbukit dengan hutan yang subur. Pengetahuan tentang tumbuhan obat, makanan hutan, dan pertanian teraser menunjukkan adaptasi lokal yang mendalam.',
    artIdentity: 'Aksara Rejang (Kaganga) adalah bukti intelektual lokal yang berkembang sebelum pengaruh tulisan modern. Rumah adat Rejang, seni pertukangan kayu, dan tradisi bercerita menjadi penanda budaya yang khas.',
    trivia: 'Aksara Rejang atau Kaganga adalah salah satu dari beberapa aksara lokal di Nusantara yang menunjukkan tingkat literasi tinggi dalam masyarakat tradisional.',
    timeline: [
      { era: 'Aksara lokal', text: 'Masyarakat Rejang mengembangkan sistem tulis sendiri (Kaganga) untuk mencatat pengetahuan dan tradisi.' },
      { era: 'Pertanian & hutan', text: 'Kehidupan berputar di sekitar pertanian sawah, perkebunan, dan pemanfaatan hasil hutan.' },
      { era: 'Adat desa', text: 'Struktur adat desa Rejang membimbing keputusan bersama dan penyelesaian sengketa.' },
      { era: 'Kini', text: 'Aksara Rejang menjadi fokus pelestarian budaya karena risiko terlupakan oleh generasi muda.' },
    ],
    glossary: [
      { term: 'Kaganga', meaning: 'Aksara tradisional Rejang yang digunakan untuk menulis bahasa lokal.', pronunciation: 'ka-ga-nga' },
      { term: 'Tunggu', meaning: 'Sistem adat desa Rejang yang mengatur kehidupan komunitas dan penyelesaian sengketa.' },
    ],
    challenge: 'Pelajari satu sistem tulis atau simbol dari budaya lokal atau budaya tradisional lain. Apa keunikan dan maknanya?',
  },
  lampung: {
    ecoWisdom: 'Lampung dengan dua kelompok adat (Pepadun dan Saibatin) menunjukkan bahwa satu wilayah bisa memiliki beberapa sistem pengetahuan. Kedua sistem ini sama-sama mengerti hubungan manusia dengan tanah, air, dan sumber daya alam.',
    artIdentity: 'Tapis adalah kain songket yang dibuat dengan menyisipkan benang emas ke dalam tenunan. Setiap pola menceritakan cerita, status, atau daerah asal pemakainya. Siger adalah mahkota adat perempuan Lampung yang megah dan berat, menampilkan kekuatan dan keindahan.',
    trivia: 'Tapis Lampung dengan benang emas asli memerlukan waktu berbulan-bulan atau bertahun-tahun untuk diselesaikan. Tidak heran bahwa tapis dihargai tinggi dan sering diwariskan antar-generasi.',
    timeline: [
      { era: 'Pepadun & Saibatin', text: 'Lampung terbagi menjadi dua kelompok adat utama dengan sistem kehidupan dan hierarki yang berbeda namun saling menghormati.' },
      { era: 'Tapis & tenun', text: 'Kerajinan tapis menjadi kebanggaan dan sumber ekonomi keluarga Lampung.' },
      { era: 'Siger', text: 'Mahkota adat perempuan Lampung yang dikenakan pada acara adat besar.' },
      { era: 'Kini', text: 'Piil Pesenggiri (harga diri) tetap menjadi nilai utama dalam kehidupan sosial Lampung.' },
    ],
    glossary: [
      { term: 'Tapis', meaning: 'Kain songket Lampung yang dibuat dengan benang emas dan menceritakan cerita lokal.', pronunciation: 'ta-pis' },
      { term: 'Siger', meaning: 'Mahkota adat perempuan Lampung yang berat dan penuh emas, melambangkan kecantikan dan status.' },
      { term: 'Piil Pesenggiri', meaning: 'Nilai harga diri, keramahan, dan tanggung jawab sosial dalam budaya Lampung.' },
    ],
    challenge: 'Cari tahu satu hasil kerajinan tradisional dari komunitas kamu atau komunitas lain. Berapa lama waktu pembuatannya dan apa cerita di baliknya?',
  },
  jawa: {
    ecoWisdom: 'Budaya Jawa yang berkembang di daerah yang sangat padat penduduk mengajarkan keseimbangan, sopan santun, dan hormat pada hierarki alam. Filosofi Rukun mengajarkan bagaimana hidup tenang di tengah kepadatan.',
    artIdentity: 'Wayang adalah seni pertunjukan yang menggunakan boneka kulit tipis yang disinari lampu. Setiap gerak wayang dan suara dalang menceritakan epos yang dalam dengan nilai-nilai moral. Batik adalah seni tulis dan pewarna kain yang menggunakan malam cair untuk membuat pola yang kompleks dan indah.',
    trivia: 'Satu pertunjukan wayang kulit bisa berlangsung hingga 8-10 jam, menceritakan episode demi episode dari epos Mahabharata atau Ramayana dengan dialek Jawa yang kaya dan pengajaran moral yang mendalam.',
    timeline: [
      { era: 'Kerajaan Hindu-Buddha', text: 'Budaya Jawa tumbuh dari pengaruh Hindu-Buddha, mengembangkan bentuk seni dan filosofi yang unik.' },
      { era: 'Era Islam', text: 'Penyebaran Islam membawa perubahan namun tidak menghapus seni dan tradisi lokal; malah menciptakan bentuk baru yang sintetis.' },
      { era: 'Batik & wayang', text: 'Seni batik dan wayang berkembang pesat sebagai bentuk ekspresi budaya yang kaya makna dan estetika.' },
      { era: 'Kini', text: 'Wayang dan batik diakui UNESCO sebagai Masterpiece of the Oral and Intangible Heritage of Humanity.' },
    ],
    glossary: [
      { term: 'Wayang', meaning: 'Seni pertunjukan boneka kulit dengan lampu latar yang menceritakan epos dan ajaran moral.' },
      { term: 'Batik', meaning: 'Seni pewarnaan kain menggunakan malam cair untuk membuat pola yang kompleks dan indah.' },
      { term: 'Keraton', meaning: 'Istana kerajaan Jawa yang menjadi pusat budaya dan adat istiadat.' },
      { term: 'Rukun', meaning: 'Nilai hidup harmonis, tenang, dan saling menghormati dalam budaya Jawa.' },
    ],
    challenge: 'Tonton satu pertunjukan wayang atau pelajari satu pola batik tradisional. Apa cerita atau makna yang terdapat di dalamnya?',
  },
  sunda: {
    ecoWisdom: 'Masyarakat Sunda yang tinggal di wilayah pegunungan dan sawah mengembangkan sistem pertanian sawah yang presisi. Filosofi Silih Asah, Silih Asih, Silih Asuh mengajarkan saling mengembangkan, menyayangi, dan menjaga.',
    artIdentity: 'Angklung adalah alat musik tradisional yang terbuat dari bambu berongga. Setiap pemain memegang angklung yang menghasilkan nada berbeda, dan harmoni terbentuk ketika semuanya bermain bersama. Ini menjadi metafora kuat tentang gotong royong dan saling melengkapi.',
    trivia: 'Angklung memerlukan presisi: setiap pemain harus mengerti kapan harus bermain dan kapan mendengarkan. Tidak ada pemain yang lebih penting dari yang lain.',
    timeline: [
      { era: 'Pegunungan & sawah', text: 'Masyarakat Sunda berkembang di wilayah subur dengan budaya pertanian yang kaya.' },
      { era: 'Silih asah', text: 'Nilai Silih Asah, Silih Asih, Silih Asuh menjadi fondasi etika sosial Sunda.' },
      { era: 'Angklung & Jaipongan', text: 'Musik tradisional Sunda mengembangkan bentuk-bentuk yang energik dan melibatkan partisipasi komunitas.' },
      { era: 'Kini', text: 'Angklung diakui dunia dan sering ditampilkan dalam pertunjukan internasional.' },
    ],
    glossary: [
      { term: 'Angklung', meaning: 'Alat musik tradisional Sunda yang terbuat dari bambu berongga dan dimainkan dengan cara digoyangkan.' },
      { term: 'Jaipongan', meaning: 'Tarian modern Sunda yang energik dan sering ditampilkan dalam acara sosial.' },
      { term: 'Silih Asah Silih Asih Silih Asuh', meaning: 'Nilai gotong royong: saling mengembangkan, menyayangi, dan menjaga.' },
    ],
    challenge: 'Pelajari satu lagu tradisional Sunda atau coba bermain angklung bersama orang lain. Bagaimana rasanya bermain bersama dan saling melengkapi?',
  },
  betawi: {
    ecoWisdom: 'Betawi lahir dari pertemuan banyak budaya di Batavia. Keterbukaan terhadap yang baru sambil mempertahankan nilai lokal mengajarkan fleksibilitas dan adaptasi dalam menghadapi perubahan lingkungan sosial.',
    artIdentity: 'Ondel-ondel adalah boneka raksasa yang dimainkan oleh dua orang. Awalnya diyakini sebagai penjaga kampung, kini menjadi ikon budaya Jakarta yang meriah. Lenong adalah pertunjukan humor yang melibatkan dialog, syair, dan pesan sosial dalam dialek Betawi yang kental.',
    trivia: 'Ondel-ondel sering hadir dalam festival dengan iringan musik rebana dan tarian yang meriah. Saat Ondel-ondel berjalan, orang-orang sering memeluk atau menyentuhnya sambil memberikan uang, percaya bahwa hal itu membawa berkah.',
    timeline: [
      { era: 'Batavia kolonial', text: 'Pertemuan budaya Jawa, Sunda, Bugis, Arab, Tionghoa, dan Eropa menciptakan identitas budaya baru.' },
      { era: 'Ondel-ondel', text: 'Boneka raksasa yang awalnya ritual untuk keselamatan kampung menjadi simbol budaya Betawi.' },
      { era: 'Lenong & Tanjidor', text: 'Seni pertunjukan dan musik Betawi mengembangkan humor yang tajam dan melayani fungsi sosial.' },
      { era: 'Kini', text: 'Betawi tetap relevan sebagai budaya kota yang dinamis dan terbuka pada perubahan.' },
    ],
    glossary: [
      { term: 'Ondel-ondel', meaning: 'Boneka raksasa Betawi yang dipercaya sebagai penjaga kampung dan kini menjadi ikon budaya.' },
      { term: 'Lenong', meaning: 'Pertunjukan seni Betawi yang berisi humor, dialog, dan pesan sosial.' },
      { term: 'Tanjidor', meaning: 'Musik tradisional Betawi yang dimainkan dengan alat tiup dan pukul.' },
    ],
    challenge: 'Bayangkan kamu adalah seorang pendatang di komunitas baru. Bagaimana cara menghormati budaya lokal sambil membawa identitas pribadiku sendiri?',
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
  let list = cultureCards;
  try {
    const saved = localStorage.getItem('ecotwin_cultures');
    if (saved) {
      list = JSON.parse(saved);
    }
  } catch (e) {
    console.error(e);
  }
  const dayIndex = Math.floor(Date.now() / 86_400_000) % (list.length || 1);
  return list[dayIndex];
}

export function HistoryCultureSection({ lang }: Props) {
  const tx = translations[lang];
  const [cultures, setCultures] = useState<CultureCard[]>(() => {
    try {
      const saved = localStorage.getItem('ecotwin_cultures');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    try {
      localStorage.setItem('ecotwin_cultures', JSON.stringify(cultureCards));
    } catch (e) {
      console.error(e);
    }
    return cultureCards;
  });

  const [activeRegion, setActiveRegion] = useState<(typeof regions)[number]>('Semua Pulau');
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('Semua Kategori');
  const [search, setSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState<CultureCard | null>(null);
  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('ecotwin_cultures');
        if (saved) {
          setCultures(JSON.parse(saved));
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('ecotwin_cultures_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('ecotwin_cultures_updated', handleSync);
    };
  }, []);

  const filteredCards = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return cultures.filter((card) => {
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
  };

  const closeStoryMode = () => {
    setSelectedCard(null);
  };



  const selectedStory = selectedCard ? getCultureStory(selectedCard) : null;


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
                  <p className="max-w-[13rem] text-xs leading-relaxed text-muted-foreground line-clamp-2">
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
                {/* Clean header with image */}
                <div className="relative overflow-hidden">
                  <motion.img
                    layoutId={`culture-image-${selectedCard.id}`}
                    src={selectedCard.image}
                    alt={selectedCard.name}
                    onError={(event) => {
                      const fallback = imageByRegion[selectedCard.region];
                      if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
                    }}
                    className="h-96 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 px-8 pb-8">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="rounded-lg bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground">{selectedCard.category}</span>
                      <span className="rounded-lg bg-background/20 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">{selectedCard.region}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-foreground sm:text-4xl">{selectedCard.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{selectedCard.location} • {selectedCard.culture}</p>
                  </div>
                </div>


                {/* Main content - Clean editorial layout */}
                <div className="max-w-3xl mx-auto px-8 py-12 space-y-10">
                  {/* Eco Scores - Minimal centered */}
                  <div className="flex gap-8 justify-center py-4 border-b border-border">
                    {getEcoScores(selectedCard).map((score) => (
                      <div key={score.label} className="text-center">
                        <div className="text-2xl font-bold text-foreground">{score.value}%</div>
                        <div className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">{score.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Article-style content */}
                  <article className="space-y-10 text-foreground">
                    {/* Asal-Usul & Sejarah */}
                    <section>
                      <h3 className="text-lg font-bold mb-4">Asal-Usul & Sejarah</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{selectedCard.history}</p>
                    </section>

                    {/* Kearifan Ekologis */}
                    <section>
                      <h3 className="text-lg font-bold mb-4">Kearifan Ekologis</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{selectedStory.ecoWisdom}</p>
                    </section>

                    {/* Seni & Simbolisme */}
                    <section>
                      <h3 className="text-lg font-bold mb-4">Seni & Simbolisme</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{selectedStory.artIdentity}</p>
                    </section>

                    {/* Pengetahuan Tradisional */}
                    <section>
                      <h3 className="text-lg font-bold mb-4">Pengetahuan Tradisional</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{selectedStory.trivia}</p>
                    </section>

                    {/* Timeline */}
                    <section className="border-t border-border pt-8">
                      <h3 className="text-lg font-bold mb-6">Perjalanan Sejarah</h3>
                      <div className="space-y-5">
                        {selectedStory.timeline.map((item) => (
                          <div key={`${selectedCard.id}-${item.era}`}>
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">{item.era}</p>
                            <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Istilah Penting */}
                    <section>
                      <h3 className="text-lg font-bold mb-4">Istilah Penting</h3>
                      <div className="space-y-4">
                        {selectedStory.glossary.map((item) => (
                          <div key={`${selectedCard.id}-${item.term}`}>
                            <p className="font-semibold text-sm text-foreground">{item.term}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.meaning}</p>
                            {item.pronunciation && (
                              <p className="text-[10px] text-primary mt-1">Diucapkan: <span className="italic">{item.pronunciation}</span></p>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Fakta & Challenge */}
                    <section className="border-t border-border pt-8 space-y-8">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Fakta Menarik</h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">{selectedCard.funFact}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Tantangan Ekologi</h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">{selectedStory.challenge}</p>
                      </div>
                    </section>
                  </article>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
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
