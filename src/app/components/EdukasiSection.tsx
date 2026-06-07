import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Trophy, Star, CheckCircle, XCircle, ChevronRight, Award, 
  Target, Flame, Leaf, Droplets, Wind, Sun, Heart, RefreshCw, X, Sparkles, Info, ClipboardCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props { lang: 'id' | 'en' }

const WEAVING = 'https://images.unsplash.com/photo-1661144050353-1d2566cbdf03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80';

const philosophies = [
  {
    icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    title: 'Hidup Sederhana', titleEn: 'Simple Living',
    desc: 'Banyak komunitas adat Nusantara menjaga kesederhanaan, batas konsumsi, dan kedekatan dengan alam sebagai sumber kebahagiaan.',
    descEn: 'Many Nusantara indigenous communities preserve simplicity, mindful consumption, and closeness to nature as a source of happiness.',
    quote: '"Lain ti kahayang, tapi ti kaperluan"',
    quoteEn: '"Not from desire, but from necessity"',
  },
  {
    icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30',
    title: 'Harmoni dengan Alam', titleEn: 'Harmony with Nature',
    desc: 'Setiap pohon, sungai, dan hewan dianggap memiliki roh yang harus dihormati. Sistem pertanian mereka mengandalkan rotasi alami tanpa pupuk kimia.',
    descEn: 'Every tree, river, and animal is considered to have a spirit that must be respected. Their farming system relies on natural rotation without chemical fertilizers.',
    quote: '"Gunung ulah dilebur, lebak ulah dirusak"',
    quoteEn: '"Mountains must not be destroyed, valleys must not be damaged"',
  },
  {
    icon: Wind, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30',
    title: 'Pikukuh (Hukum Adat)', titleEn: 'Pikukuh (Customary Law)',
    desc: 'Seperangkat aturan tak tertulis yang mengatur seluruh aspek kehidupan. Pikukuh melarang pembukaan lahan hutan, penggunaan alat modern, dan bepergian dengan kendaraan.',
    descEn: 'A set of unwritten rules governing all aspects of life. Pikukuh prohibits clearing forestland, using modern tools, and traveling by vehicle.',
    quote: '"Buyut teu meunang dirobah"',
    quoteEn: '"Ancestral heritage must not be changed"',
  },
  {
    icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30',
    title: 'Rawatan Hidup', titleEn: 'Life Stewardship',
    desc: 'Konsep merawat kehidupan yang mencakup menjaga hubungan antara manusia, alam, dan roh leluhur. Setiap tindakan harus mempertimbangkan dampaknya pada generasi mendatang.',
    descEn: 'The concept of caring for life, encompassing maintaining the relationship between humans, nature, and ancestral spirits. Every action must consider its impact on future generations.',
    quote: '"Hirup kudu sing bener, lain sing pinter"',
    quoteEn: '"Life must be righteous, not just clever"',
  },
];

const philosophiesDetail = [
  {
    historyId: 'Di Baduy, kesederhanaan bukan sekadar pilihan gaya hidup, melainkan hukum adat yang disebut Pikukuh. Mereka menghindari barang modern berlebihan untuk menjaga kedamaian batin dan kelestarian alam sekitar.',
    historyEn: 'In Baduy, simplicity is not just a lifestyle choice, but a customary law called Pikukuh. They avoid excessive modern goods to maintain inner peace and the preservation of the surrounding environment.',
    modernId: 'Di era konsumerisme modern, filosofi ini memandu kita untuk mengurangi sampah (zero waste), mempraktikkan gaya hidup minimalis, dan membatasi emisi karbon yang dihasilkan dari rantai produksi barang yang tidak perlu.',
    modernEn: 'In the era of modern consumerism, this philosophy guides us to reduce waste (zero waste), practice a minimalist lifestyle, and limit carbon emissions generated from unnecessary supply chains.',
    actionId: 'Terapkan prinsip "beli karena butuh, bukan karena ingin". Cobalah kurangi membeli pakaian atau gadget baru jika yang lama masih berfungsi dengan baik.',
    actionEn: 'Apply the principle of "buy by need, not by want". Try to reduce buying new clothes or gadgets if the old ones still function well.'
  },
  {
    historyId: 'Prinsip konservasi adat Sunda Wiwitan dan Sasi di Maluku mengajarkan bahwa alam adalah ibu pelindung. Pemanfaatan sumber daya alam dibatasi oleh zona larangan (seperti leuweung titipan/kolot dan kawasan sasi tutup) agar ekosistem memiliki waktu untuk memulihkan diri secara alami.',
    historyEn: 'The customary conservation principles of Sunda Wiwitan and Sasi in Maluku teach that nature is a protecting mother. The utilization of natural resources is limited by prohibition zones (such as sacred forests and closed sasi areas) so that ecosystems have time to regenerate naturally.',
    modernId: 'Krisis iklim global dipicu oleh eksploitasi alam tanpa batas. Menghormati daya dukung lingkungan berarti menghentikan deforestasi dan beralih ke energi ramah lingkungan yang tidak merusak alam.',
    modernEn: 'The global climate crisis is triggered by unlimited exploitation of nature. Respecting environmental carrying capacity means stopping deforestation and transitioning to eco-friendly energy that does not harm nature.',
    actionId: 'Kurangi penggunaan plastik sekali pakai, mulailah memilah sampah organik dan anorganik di rumah, dan tanam setidaknya satu pohon atau tanaman hijau di lingkungan tempat tinggal Anda.',
    actionEn: 'Reduce single-use plastic, start separating organic and inorganic waste at home, and plant at least one tree or green plant in your neighborhood.'
  },
  {
    historyId: 'Pikukuh Baduy adalah aturan mutlak titipan leluhur yang menjaga agar masyarakat adat Baduy tidak terpengaruh oleh industrialisasi yang merusak. Melarang penggunaan semen, sabun kimia di sungai, dan mesin untuk menjaga tanah air tetap murni.',
    historyEn: 'Pikukuh Baduy is an absolute ancestral rule that prevents Baduy indigenous people from being influenced by destructive industrialization. It prohibits the use of cement, chemical soaps in rivers, and machinery to keep the land pure.',
    modernId: 'Mengingatkan kita akan pentingnya menetapkan batasan atau regulasi ketat terhadap penggunaan teknologi yang merusak. Tidak semua kemajuan teknologi bernilai positif jika harus mengorbankan keseimbangan bumi.',
    modernEn: 'Reminds us of the importance of establishing strict boundaries or regulations on the use of destructive technologies. Not all technological advancements are positive if they compromise the earth\'s balance.',
    actionId: 'Pilihlah berjalan kaki atau naik sepeda untuk jarak dekat. Gunakan detergen atau produk pembersih rumah tangga yang ramah lingkungan (eco-friendly) yang mudah terurai oleh tanah dan air.',
    actionEn: 'Choose walking or cycling for short distances. Use eco-friendly household detergents or cleaning products that biodegrade easily in soil and water.'
  },
  {
    historyId: 'Konsep kearifan lokal Dayak dan Jawa yang mengajarkan tanggung jawab moral manusia sebagai penjaga bumi. Setiap pohon yang ditebang untuk keperluan rumah tangga harus diganti, dan ritual syukur diadakan untuk menghargai hasil bumi.',
    historyEn: 'The concept of Dayak and Javanese local wisdom that teaches the moral responsibility of humans as earth guardians. Every tree cut down for household needs must be replaced, and gratitude rituals are held to appreciate earth\'s harvest.',
    modernId: 'Keberlanjutan (sustainability) adalah kunci kelangsungan hidup anak cucu kita. Eksploitasi hari ini tidak boleh mengorbankan hak hidup generasi masa depan.',
    modernEn: 'Sustainability is the key to the survival of our descendants. Exploitation today must not sacrifice the living rights of future generations.',
    actionId: 'Hemat konsumsi energi listrik dan air bersih di rumah. Dukung produk-produk lokal berkelanjutan yang diproduksi secara etis dan bertanggung jawab terhadap kelestarian lingkungan.',
    actionEn: 'Conserve electricity and clean water at home. Support sustainable local products produced ethically and responsibly toward environmental preservation.'
  }
];

interface QuizQuestion {
  id: number;
  q: string; qEn: string;
  opts: string[]; optsEn: string[];
  correct: number;
  explanation: string; explanationEn: string;
}

const questionsTradition: QuizQuestion[] = [
  {
    id: 1,
    q: 'Apa nama hukum adat di Baduy yang mengatur batas penggunaan teknologi dan kelestarian alam?',
    qEn: 'What is the name of the customary law in Baduy that regulates technology limits and environmental preservation?',
    opts: ['Pikukuh', 'Sasi', 'Awig-awig', 'Subak'],
    optsEn: ['Pikukuh', 'Sasi', 'Awig-awig', 'Subak'],
    correct: 0,
    explanation: 'Pikukuh adalah hukum adat mutlak di Baduy untuk menjaga cara hidup selaras alam dan menolak modernisasi yang merusak lingkungan.',
    explanationEn: 'Pikukuh is the absolute customary law in Baduy to maintain a lifestyle aligned with nature and reject modernizations that harm the environment.',
  },
  {
    id: 2,
    q: 'Praktik konservasi laut tradisional di Maluku yang melarang pengambilan hasil laut pada waktu tertentu disebut...',
    qEn: 'The traditional marine conservation practice in Maluku that prohibits harvesting marine resources during certain periods is called...',
    opts: ['Subak', 'Pikukuh', 'Sasi', 'Megoak-goakan'],
    optsEn: ['Subak', 'Pikukuh', 'Sasi', 'Megoak-goakan'],
    correct: 2,
    explanation: 'Sasi adalah sistem larangan adat di Maluku/Papua untuk membiarkan flora dan fauna laut pulih sebelum dipanen kembali.',
    explanationEn: 'Sasi is a customary prohibition system in Maluku/Papua to allow marine flora and fauna to recover before being harvested.',
  },
  {
    id: 3,
    q: 'Apa fungsi utama "leuweung kolot" (hutan tua/titipan) dalam tata ruang adat Sunda?',
    qEn: 'What is the main function of "leuweung kolot" (old/sacred forest) in Sunda customary land use?',
    opts: ['Kawasan wisata', 'Kawasan pertanian', 'Hutan lindung/sakral yang dilarang dimasuki', 'Hutan produksi kayu'],
    optsEn: ['Tourist area', 'Agricultural area', 'Protected/sacred forest forbidden to enter', 'Timber production forest'],
    correct: 2,
    explanation: 'Leuweung kolot adalah hutan primer sakral yang dilarang keras untuk ditebang atau dimasuki demi menjaga sumber air dan keseimbangan ekologi.',
    explanationEn: 'Leuweung kolot is a sacred primary forest strictly forbidden from being cut down or entered to preserve water sources and ecological balance.',
  },
  {
    id: 4,
    q: 'Apa nilai utama dari filosofi "Lain ti kahayang, tapi ti kaperluan" dalam konsumsi barang?',
    qEn: 'What is the main value of the philosophy "Not from desire, but from necessity" in consumption?',
    opts: ['Membeli barang sebanyak-banyaknya', 'Hanya mengonsumsi barang sesuai kebutuhan dasar', 'Menimbun barang untuk masa depan', 'Mengikuti tren teknologi terbaru'],
    optsEn: ['Buying as many goods as possible', 'Only consuming goods based on basic needs', 'Hoarding goods for the future', 'Following the latest technology trends'],
    correct: 1,
    explanation: 'Filosofi ini memandu manusia untuk memprioritaskan kebutuhan riil daripada keinginan konsumtif yang berujung pada penumpukan sampah.',
    explanationEn: 'This philosophy guides humans to prioritize real needs over consumerist desires that lead to waste accumulation.',
  },
];

const questionsEcology: QuizQuestion[] = [
  {
    id: 1,
    q: 'Manakah tindakan berikut yang paling berkontribusi pada pengurangan jejak karbon secara signifikan di perkotaan?',
    qEn: 'Which of the following actions contributes most to significantly reducing the carbon footprint in urban areas?',
    opts: ['Menggunakan kantong plastik sekali pakai', 'Berjalan kaki atau bersepeda untuk perjalanan jarak dekat', 'Membiarkan peralatan elektronik menyala terus', 'Membakar sampah daun kering'],
    optsEn: ['Using single-use plastic bags', 'Walking or cycling for short distances', 'Leaving electronic devices turned on constantly', 'Burning dry leaves waste'],
    correct: 1,
    explanation: 'Menghindari kendaraan bermotor untuk jarak pendek secara langsung mengurangi pembakaran bahan bakar fosil dan emisi karbon dioksida.',
    explanationEn: 'Avoiding motor vehicles for short distances directly reduces fossil fuel combustion and carbon dioxide emissions.',
  },
  {
    id: 2,
    q: 'Mengapa memisahkan sampah dapur organik dan anorganik di rumah itu sangat penting?',
    qEn: 'Why is separating organic kitchen waste and inorganic waste at home very important?',
    opts: ['Agar tempat pembuangan terlihat lebih rapi saja', 'Untuk mencegah sampah organik membusuk di TPA tanpa oksigen dan menghasilkan gas metana berbahaya', 'Agar bisa dijual kembali dengan harga mahal', 'Agar rumah tidak bau'],
    optsEn: ['Just to make the waste disposal look neater', 'To prevent organic waste from rotting in landfills without oxygen, which produces hazardous methane gas', 'To sell it back at a high price', 'To keep the house odorless'],
    correct: 1,
    explanation: 'Sampah organik yang menumpuk di TPA menghasilkan gas metana (gas rumah kaca yang 25x lebih kuat dari CO2). Memisahkannya memudahkan pembuatan kompos.',
    explanationEn: 'Organic waste piling up in landfills produces methane gas (a greenhouse gas 25x stronger than CO2). Separating it makes composting easier.',
  },
  {
    id: 3,
    q: 'Apa keuntungan membeli produk makanan lokal (misal: sayuran dan buah dari petani setempat) bagi lingkungan?',
    qEn: 'What is the environmental benefit of buying local food products (e.g., vegetables and fruits from local farmers)?',
    opts: ['Mendapatkan diskon harga yang besar', 'Mengurangi energi transportasi dan emisi distribusi pangan (food miles)', 'Makanan lebih tahan lama jika disimpan', 'Memiliki kemasan plastik yang lebih menarik'],
    optsEn: ['Getting a massive price discount', 'Reducing transport energy and food distribution emissions (food miles)', 'Food lasts longer when stored', 'Having a more attractive plastic packaging'],
    correct: 1,
    explanation: 'Makanan lokal membutuhkan rantai transportasi yang pendek, sehingga menghemat bahan bakar fosil yang digunakan untuk pengiriman antar kota/negara.',
    explanationEn: 'Local food requires short transport chains, thereby saving fossil fuels used for shipping between cities/nations.',
  },
  {
    id: 4,
    q: 'Kegiatan mengolah kembali sisa makanan organik menjadi penyubur tanah disebut...',
    qEn: 'The activity of reprocessing organic food scraps into soil fertilizer is called...',
    opts: ['Daur ulang anorganik', 'Pembakaran insinerasi', 'Pengomposan (Composting)', 'Reboisasi hutan'],
    optsEn: ['Inorganic recycling', 'Incineration burning', 'Composting', 'Forest reforestation'],
    correct: 2,
    explanation: 'Pengomposan adalah proses biologis menguraikan bahan organik menjadi kompos kaya nutrisi untuk tanaman, mengurangi beban sampah di TPA.',
    explanationEn: 'Composting is a biological process decomposing organic matter into nutrient-rich compost for plants, reducing landfill waste loads.',
  },
];

const dayDetails = [
  {
    icon: '🚫',
    tipsId: 'Gunakan tote bag belanja ramah lingkungan dan bawa botol minum sendiri untuk menghindari penggunaan plastik sekali pakai.',
    tipsEn: 'Use eco-friendly shopping bags and bring your own reusable tumbler to avoid single-use plastics.'
  },
  {
    icon: '🚶',
    tipsId: 'Pilihlah berjalan kaki atau bersepeda untuk perjalanan jarak dekat (< 2 km) guna mengurangi jejak karbon transportasi.',
    tipsEn: 'Choose walking or cycling for short distances (< 2 km) to reduce transportation carbon footprint.'
  },
  {
    icon: '💧',
    tipsId: 'Matikan keran saat menyikat gigi, tampung air bekas cucian buah/sayur untuk menyiram tanaman, dan mandi tidak lebih dari 5 menit.',
    tipsEn: 'Turn off the faucet while brushing teeth, collect vegetable washing water to water plants, and limit showers to under 5 minutes.'
  },
  {
    icon: '🌳',
    tipsId: 'Tanam tanaman hias, sayur, atau herba di halaman rumah Anda untuk memelihara sirkulasi oksigen bersih di sekitar tempat tinggal.',
    tipsEn: 'Plant ornamental plants, vegetables, or herbs in your garden to nurture clean oxygen circulation around your home.'
  },
  {
    icon: '🍚',
    tipsId: 'Beli bahan makanan segar dari petani lokal di pasar tradisional terdekat untuk meminimalkan energi rantai pasok pangan.',
    tipsEn: 'Buy fresh produce from local farmers at nearest traditional markets to minimize food supply chain packaging energy.'
  },
  {
    icon: '♻️',
    tipsId: 'Pisahkan sampah dapur organik (sisa makanan) dan sampah anorganik (plastik/kertas) untuk diolah kembali atau dijadikan kompos.',
    tipsEn: 'Separate organic kitchen waste (food leftovers) and inorganic waste (plastic/paper) to be recycled or composted.'
  },
  {
    icon: '🤝',
    tipsId: 'Bagikan kelebihan makanan atau donasikan pakaian layak pakai kepada orang lain yang membutuhkan di lingkungan sekitar Anda.',
    tipsEn: 'Share excess food or donate pre-loved clothes to others in need around your neighborhood.'
  }
];

const questionsDailyPool: QuizQuestion[] = [
  {
    id: 1,
    q: 'Berapa rata-rata waktu yang dibutuhkan kantong plastik untuk terurai secara alami di tanah?',
    qEn: 'What is the average time required for a plastic bag to decompose naturally in soil?',
    opts: ['10-20 tahun', '50-100 tahun', '100-500 tahun', 'Lebih dari 1000 tahun'],
    optsEn: ['10-20 years', '50-100 years', '100-500 years', 'More than 1000 years'],
    correct: 2,
    explanation: 'Kantong plastik membutuhkan waktu sekitar 100 hingga 500 tahun untuk hancur sepenuhnya di alam liar.',
    explanationEn: 'Plastic bags take about 100 to 500 years to decompose completely in the wild.'
  },
  {
    id: 2,
    q: 'Metode pengolahan sampah daun kering yang paling ramah lingkungan tanpa polusi udara adalah...',
    qEn: 'The most eco-friendly method of processing dry leaves without air pollution is...',
    opts: ['Membakarnya langsung', 'Membuatnya menjadi kompos organik', 'Membuangnya ke sungai', 'Menimbunnya di bawah semen'],
    optsEn: ['Burning it directly', 'Composting it into organic fertilizer', 'Throwing it into the river', 'Burying it under cement'],
    correct: 1,
    explanation: 'Membuat kompos menyuburkan tanah dan menghindari pelepasan gas CO2 dan asap pembakaran ke udara.',
    explanationEn: 'Composting fertilizes the soil and avoids releasing CO2 and smoke into the air.'
  },
  {
    id: 3,
    q: 'Komunitas adat mana di Indonesia Timur yang terkenal dengan hukum sasi untuk menjaga ekosistem laut?',
    qEn: 'Which indigenous community in Eastern Indonesia is famous for the sasi law to protect the marine ecosystem?',
    opts: ['Maluku dan Papua', 'Baduy', 'Dayak Kenyah', 'Tana Toraja'],
    optsEn: ['Maluku and Papua', 'Baduy', 'Dayak Kenyah', 'Tana Toraja'],
    correct: 0,
    explanation: 'Hukum sasi di Maluku dan Papua mengatur larangan pengambilan hasil laut dalam waktu tertentu demi pemulihan ekosistem.',
    explanationEn: 'The sasi law in Maluku and Papua regulates the prohibition of harvesting marine resources for a certain period for ecosystem recovery.'
  },
  {
    id: 4,
    q: 'Mengapa penggunaan AC berlebihan dapat memperburuk pemanasan global?',
    qEn: 'Why does excessive use of air conditioning worsen global warming?',
    opts: ['Karena mengalirkan air berlebih', 'Karena melepaskan gas refrigeran (HFC) yang bertindak sebagai gas rumah kaca yang kuat', 'Karena memancarkan cahaya silau', 'Karena mendinginkan udara sekitar'],
    optsEn: ['Because it drains excess water', 'Because it releases refrigerant gases (HFCs) which act as potent greenhouse gases', 'Because it emits glaring light', 'Because it cools the surrounding air'],
    correct: 1,
    explanation: 'Bocoran atau pembuangan refrigeran seperti HFC dari AC memiliki potensi pemanasan global ribuan kali lebih kuat dibanding CO2.',
    explanationEn: 'Refrigerant leaks or disposal such as HFCs from ACs have a global warming potential thousands of times stronger than CO2.'
  },
  {
    id: 5,
    q: 'Prinsip "Kamase-masea" dari Kajang, Sulawesi Selatan mengajarkan kita untuk...',
    qEn: 'The principle of "Kamase-masea" from Kajang, South Sulawesi teaches us to...',
    opts: ['Hidup bermegah-megahan', 'Hidup sederhana dan bersahaja demi menjaga keharmonisan alam', 'Menggunakan teknologi modern tanpa batas', 'Menebang pohon untuk membangun jalan'],
    optsEn: ['Live extravagantly', 'Live simply and modestly to maintain harmony with nature', 'Use modern technology without boundaries', 'Cut down trees to build roads'],
    correct: 1,
    explanation: 'Filosofi Kamase-masea menekankan hidup sederhana dan pembatasan keinginan konsumtif agar alam tidak tereksploitasi berlebihan.',
    explanationEn: 'The Kamase-masea philosophy emphasizes simple living and limiting consumerist desires so that nature is not over-exploited.'
  },
  {
    id: 6,
    q: 'Jenis pohon apa yang biasanya ditanam di pesisir pantai untuk menahan abrasi air laut?',
    qEn: 'What type of tree is usually planted on coasts to prevent seawater abrasion?',
    opts: ['Pohon Kelapa', 'Pohon Mangrove (Bakau)', 'Pohon Beringin', 'Pohon Pinus'],
    optsEn: ['Coconut Tree', 'Mangrove Tree (Bakau)', 'Banyan Tree', 'Pine Tree'],
    correct: 1,
    explanation: 'Mangrove memiliki akar yang kokoh untuk memecah ombak, menahan abrasi, dan menyediakan habitat untuk kehidupan laut.',
    explanationEn: 'Mangroves have sturdy roots to break waves, prevent erosion, and provide habitats for marine life.'
  }
];

const getDailyQuestions = (): QuizQuestion[] => {
  const dateStr = new Date().toDateString();
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const shuffled = [...questionsDailyPool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.abs(hash + i) % (i + 1);
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled.slice(0, 4);
};

const t = {
  id: {
    title: 'Edukasi Pelestarian',
    sub: 'Pelajari kearifan Nusantara melalui konten interaktif yang menyenangkan',
    philTitle: 'Filosofi Hidup Nusantara',
    quizTitle: 'Uji Pengetahuanmu',
    quizSub: 'Uji wawasan adat dan aksi hijau dengan kuis interaktif',
    start: 'Mulai Kuis',
    next: 'Lanjut',
    result: 'Hasil Kuis',
    score: 'Skor kamu',
    restart: 'Coba Lagi',
    badgeTitle: 'Koleksi Badge',
    badgeSub: 'Kemajuan belajar nyata terakumulasi di bawah ini',
    challenge: 'Tantangan: 7 Hari Hidup Ramah Lingkungan',
    challengeDesc: 'Menerapkan aksi nyata pelestarian lingkungan setiap hari',
    join: 'Mulai Program',
    days: ['Hari 1: No Plastik', 'Hari 2: Jalan Kaki', 'Hari 3: Hemat Air', 'Hari 4: Tanam Pohon', 'Hari 5: Makan Lokal', 'Hari 6: Zero Waste', 'Hari 7: Berbagi'],
    earned: 'Diperoleh',
    locked: 'Terkunci',
    
    chooseCategory: 'Pilih Kategori Kuis',
    catTradition: 'Kearifan Lokal & Tradisi',
    catTraditionDesc: 'Menguji pengetahuan tentang hukum adat, tata ruang sakral, dan filosofi hidup Nusantara.',
    catEcology: 'Ekologi & Gaya Hidup Hijau',
    catEcologyDesc: 'Menguji pengetahuan tentang dampak jejak karbon, pengomposan, dan aksi ramah lingkungan sehari-hari.',
    catDaily: 'Tantangan Harian (Daily)',
    catDailyDesc: 'Pertanyaan acak yang di-refresh setiap hari untuk menguji konsistensi wawasan hijau.',
    lives: 'Nyawa Kuis',
    failedTitle: 'Kuis Gagal!',
    failedDesc: 'Kamu kehabisan nyawa (❤️). Jangan berkecil hati, pelajari kembali filosofi Nusantara di atas dan coba lagi kuis ini!',
    reviewTitle: 'Tinjau Jawaban Anda',
    yourAnswer: 'Jawaban Anda',
    correctAnswer: 'Jawaban Benar',
    explain: 'Penjelasan',
    readMore: 'Eksplorasi Mendalam',
    close: 'Tutup',
    challengeProgress: 'Kemajuan Tantangan',
    challengeProgressDesc: 'Selesaikan semua tantangan 7 hari untuk menjadi Duta Pelestari!',
    philoDetailTitle: 'Eksplorasi Filosofi Nusantara',
    philoTabHistory: 'Sejarah & Makna',
    philoTabModern: 'Konteks Modern',
    philoTabAction: 'Aksi Nyata',
    philoTipClick: 'Klik kartu filosofi untuk melakukan eksplorasi mendalam!',
    dailyHighScore: 'Skor Harian Tertinggi',
    leaderboardTitle: 'Papan Peringkat Terranesia',
    leaderboardSub: 'Peringkat pelestari terbaik berdasarkan kuis dan lencana',
    submitNamePlaceholder: 'Masukkan namamu...',
    submitScoreBtn: 'Submit ke Leaderboard',
    submittedSuccess: 'Skor berhasil disubmit!',
    totalScore: 'Total Skor',
    aiCoachTitle: 'AI Eco-Coach Terranesia',
    aiCoachSub: 'Analisis dampak lingkungan dari aksi nyata harian Anda',
    aiCoachEmpty: 'Selesaikan minimal 1 tantangan harian untuk melihat analisis dampak lingkungan oleh AI Coach.',
    aiCoachFeedback: 'Ulasan Pelestarian',
  },
  en: {
    title: 'Conservation Education',
    sub: 'Learn Nusantara wisdom through fun interactive content',
    philTitle: 'Nusantara Life Philosophy',
    quizTitle: 'Test Your Knowledge',
    quizSub: 'Test your customary insights and green actions with interactive quizzes',
    start: 'Start Quiz',
    next: 'Next',
    result: 'Quiz Result',
    score: 'Your score',
    restart: 'Try Again',
    badgeTitle: 'Badge Collection',
    badgeSub: 'Real learning progress accumulated below',
    challenge: 'Challenge: 7 Days Eco-Friendly Living',
    challengeDesc: 'Apply environmental actions in your daily life',
    join: 'Start Program',
    days: ['Day 1: No Plastic', 'Day 2: Walk More', 'Day 3: Save Water', 'Day 4: Plant Trees', 'Day 5: Eat Local', 'Day 6: Zero Waste', 'Day 7: Share'],
    earned: 'Earned',
    locked: 'Locked',
    
    chooseCategory: 'Choose Quiz Category',
    catTradition: 'Local Wisdom & Traditions',
    catTraditionDesc: 'Test your knowledge of customary laws, sacred spaces, and Nusantara philosophies.',
    catEcology: 'Ecology & Green Lifestyle',
    catEcologyDesc: 'Test your knowledge on carbon footprints, composting, and daily eco-friendly actions.',
    catDaily: 'Daily Challenge',
    catDailyDesc: 'Randomized questions refreshed daily to test your green consistency.',
    lives: 'Quiz Lives',
    failedTitle: 'Quiz Failed!',
    failedDesc: 'You ran out of lives (❤️). Don\'t worry, re-read the Nusantara philosophies above and try again!',
    reviewTitle: 'Review Your Answers',
    yourAnswer: 'Your Answer',
    correctAnswer: 'Correct Answer',
    explain: 'Explanation',
    readMore: 'Deep Dive Exploration',
    close: 'Close',
    challengeProgress: 'Challenge Progress',
    challengeProgressDesc: 'Complete all 7-day challenges to become an Eco Ambassador!',
    philoDetailTitle: 'Explore Nusantara Philosophy',
    philoTabHistory: 'History & Meaning',
    philoTabModern: 'Modern Context',
    philoTabAction: 'Real Action',
    philoTipClick: 'Click a philosophy card to explore deeply!',
    dailyHighScore: 'Daily High Score',
    leaderboardTitle: 'Terranesia Leaderboard',
    leaderboardSub: 'Top preservationists ranked by quizzes and badges',
    submitNamePlaceholder: 'Enter your name...',
    submitScoreBtn: 'Submit to Leaderboard',
    submittedSuccess: 'Score submitted successfully!',
    totalScore: 'Total Score',
    aiCoachTitle: 'Terranesia AI Eco-Coach',
    aiCoachSub: 'Environmental impact analysis of your real daily actions',
    aiCoachEmpty: 'Complete at least 1 daily challenge to see environmental impact analysis by AI Coach.',
    aiCoachFeedback: 'Preservation Review',
  },
};

export function EdukasiSection({ lang }: Props) {
  // --- Persistent States from LocalStorage ---
  const [quizHighScoreTradition, setQuizHighScoreTradition] = useState<number>(() => {
    try {
      return JSON.parse(localStorage.getItem('ecotwin_quiz_score_tradition') || '0');
    } catch { return 0; }
  });
  
  const [quizHighScoreEcology, setQuizHighScoreEcology] = useState<number>(() => {
    try {
      return JSON.parse(localStorage.getItem('ecotwin_quiz_score_ecology') || '0');
    } catch { return 0; }
  });

  const [quizHighScoreDaily, setQuizHighScoreDaily] = useState<number>(() => {
    try {
      return JSON.parse(localStorage.getItem('ecotwin_quiz_score_daily') || '0');
    } catch { return 0; }
  });

  const [completedQuizTradition, setCompletedQuizTradition] = useState<boolean>(() => {
    try {
      return JSON.parse(localStorage.getItem('ecotwin_quiz_completed_tradition') || 'false');
    } catch { return false; }
  });

  const [completedQuizEcology, setCompletedQuizEcology] = useState<boolean>(() => {
    try {
      return JSON.parse(localStorage.getItem('ecotwin_quiz_completed_ecology') || 'false');
    } catch { return false; }
  });

  const [completedQuizDaily, setCompletedQuizDaily] = useState<boolean>(() => {
    try {
      return JSON.parse(localStorage.getItem('ecotwin_quiz_completed_daily') || 'false');
    } catch { return false; }
  });

  const [hasInteractedPhilosophy, setHasInteractedPhilosophy] = useState<boolean>(() => {
    try {
      return JSON.parse(localStorage.getItem('ecotwin_philosophy_interacted') || 'false');
    } catch { return false; }
  });

  const [challengeJoined, setChallengeJoined] = useState<boolean>(() => {
    try {
      return JSON.parse(localStorage.getItem('ecotwin_challenge_joined') || 'false');
    } catch { return false; }
  });

  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('ecotwin_completed_days') || '[]');
    } catch { return []; }
  });

  // --- Leaderboard States ---
  const initialLeaderboard = [
    { name: 'Rian Nusantara', score: 8, badgeCount: 5 },
    { name: 'Siti Lestari', score: 7, badgeCount: 4 },
    { name: 'Budi Ekologi', score: 6, badgeCount: 3 },
    { name: 'Dewi Wiwitan', score: 5, badgeCount: 3 },
    { name: 'Joko Hijau', score: 4, badgeCount: 2 },
  ];

  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number; badgeCount: number; isUser?: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem('ecotwin_leaderboard_data');
      return saved ? JSON.parse(saved) : initialLeaderboard;
    } catch { return initialLeaderboard; }
  });

  const [userName, setUserName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- Quiz Engine States ---
  const [quizState, setQuizState] = useState<'idle' | 'active' | 'done' | 'failed'>('idle');
  const [quizCategory, setQuizCategory] = useState<'tradition' | 'ecology' | 'daily'>('tradition');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  // Track answers for review panel
  const [userAnswersHistory, setUserAnswersHistory] = useState<{ qIndex: number; selected: number; isCorrect: boolean }[]>([]);

  // --- Interactive Philosophy Drawer States ---
  const [activePhilosophy, setActivePhilosophy] = useState<number | null>(null);
  const [philosophyTab, setPhilosophyTab] = useState<'history' | 'modern' | 'action'>('history');

  // --- Expanded Day tips panel (challenge) ---
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const tx = t[lang];

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('ecotwin_quiz_score_tradition', JSON.stringify(quizHighScoreTradition));
  }, [quizHighScoreTradition]);

  useEffect(() => {
    localStorage.setItem('ecotwin_quiz_score_ecology', JSON.stringify(quizHighScoreEcology));
  }, [quizHighScoreEcology]);

  useEffect(() => {
    localStorage.setItem('ecotwin_quiz_score_daily', JSON.stringify(quizHighScoreDaily));
  }, [quizHighScoreDaily]);

  useEffect(() => {
    localStorage.setItem('ecotwin_quiz_completed_tradition', JSON.stringify(completedQuizTradition));
  }, [completedQuizTradition]);

  useEffect(() => {
    localStorage.setItem('ecotwin_quiz_completed_ecology', JSON.stringify(completedQuizEcology));
  }, [completedQuizEcology]);

  useEffect(() => {
    localStorage.setItem('ecotwin_quiz_completed_daily', JSON.stringify(completedQuizDaily));
  }, [completedQuizDaily]);

  useEffect(() => {
    localStorage.setItem('ecotwin_philosophy_interacted', JSON.stringify(hasInteractedPhilosophy));
  }, [hasInteractedPhilosophy]);

  useEffect(() => {
    localStorage.setItem('ecotwin_challenge_joined', JSON.stringify(challengeJoined));
  }, [challengeJoined]);

  useEffect(() => {
    localStorage.setItem('ecotwin_completed_days', JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    localStorage.setItem('ecotwin_leaderboard_data', JSON.stringify(leaderboard));
  }, [leaderboard]);

  // Daily questions memoized based on today's seed
  const dailyQuestions = useMemo(() => {
    return getDailyQuestions();
  }, []);

  // Map current active questions based on selected category
  const activeQuestions = useMemo(() => {
    if (quizCategory === 'tradition') return questionsTradition;
    if (quizCategory === 'ecology') return questionsEcology;
    return dailyQuestions;
  }, [quizCategory, dailyQuestions]);

  const q = activeQuestions[currentQ];

  // AI Eco-Coach Impact calculation based on 7 day challenge
  const ecoCoachImpact = useMemo(() => {
    let co2Saved = 0;
    let waterSaved = 0;
    let plasticSaved = 0;
    let communityCount = 0;

    completedDays.forEach(dayIndex => {
      if (dayIndex === 0) plasticSaved += 0.5; // kg
      if (dayIndex === 1) co2Saved += 1.2;     // kg
      if (dayIndex === 2) waterSaved += 50;     // liters
      if (dayIndex === 3) co2Saved += 0.1;     // kg
      if (dayIndex === 4) co2Saved += 0.8;     // kg
      if (dayIndex === 5) plasticSaved += 1.0; // kg
      if (dayIndex === 6) communityCount += 1;
    });

    return {
      co2Saved: Number(co2Saved.toFixed(1)),
      waterSaved,
      plasticSaved: Number(plasticSaved.toFixed(1)),
      communityCount
    };
  }, [completedDays]);

  // Dynamic Badges Collection
  const dynamicBadges = useMemo(() => {
    const scoredTraditionPerfect = quizHighScoreTradition === questionsTradition.length && completedQuizTradition;
    const scoredEcologyPerfect = quizHighScoreEcology === questionsEcology.length && completedQuizEcology;
    const scoredDailyPerfect = quizHighScoreDaily === 4 && completedQuizDaily;
    const scoredThreeOrMore = quizHighScoreTradition >= 3 || quizHighScoreEcology >= 3 || quizHighScoreDaily >= 3;
    const completedAllDays = completedDays.length === 7;
    const isUserInTopThree = leaderboard.slice(0, 3).some(entry => entry.isUser);

    return [
      { 
        id: 'pemula', 
        icon: '🌱', 
        name: 'Penjelajah Pemula', 
        nameEn: 'Beginner Explorer', 
        desc: 'Mulai dengan membaca salah satu filosofi', 
        descEn: 'Begin by reading at least one philosophy', 
        earned: hasInteractedPhilosophy, 
        color: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 shadow-emerald-500/10 dark:shadow-emerald-500/5' 
      },
      { 
        id: 'penjaga', 
        icon: '🌿', 
        name: 'Penjaga Hutan', 
        nameEn: 'Forest Guardian', 
        desc: 'Skor >= 3 pada salah satu kuis', 
        descEn: 'Score >= 3 on any quiz', 
        earned: scoredThreeOrMore, 
        color: 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300 shadow-green-500/10 dark:shadow-green-500/5' 
      },
      { 
        id: 'budayawan', 
        icon: '🏺', 
        name: 'Budayawan Muda', 
        nameEn: 'Young Culturalist', 
        desc: 'Terdaftar dalam tantangan 7 hari', 
        descEn: 'Registered in the 7-day challenge', 
        earned: challengeJoined, 
        color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 shadow-amber-500/10 dark:shadow-amber-500/5' 
      },
      { 
        id: 'pikukuh', 
        icon: '📜', 
        name: 'Pikukuh Lestari', 
        nameEn: 'Pikukuh Guardian', 
        desc: 'Skor sempurna kuis Kearifan Lokal', 
        descEn: 'Perfect score on Local Wisdom quiz', 
        earned: scoredTraditionPerfect, 
        color: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30 text-cyan-800 dark:text-cyan-300 shadow-cyan-500/10 dark:shadow-cyan-500/5' 
      },
      { 
        id: 'pesaing', 
        icon: '⚔️', 
        name: 'Pesaing Unggul', 
        nameEn: 'Top Challenger', 
        desc: 'Masuk dalam peringkat 3 besar Leaderboard', 
        descEn: 'Rank in top 3 of the Leaderboard', 
        earned: isUserInTopThree, 
        color: 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 shadow-rose-500/10 dark:shadow-rose-500/5' 
      },
      { 
        id: 'master', 
        icon: '🌟', 
        name: 'Master Terranesia', 
        nameEn: 'Terranesia Master', 
        desc: 'Skor sempurna di semua kuis', 
        descEn: 'Perfect score on all quizzes', 
        earned: scoredTraditionPerfect && scoredEcologyPerfect && scoredDailyPerfect, 
        color: 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300 shadow-purple-500/10 dark:shadow-purple-500/5' 
      },
    ];
  }, [quizHighScoreTradition, quizHighScoreEcology, quizHighScoreDaily, completedQuizTradition, completedQuizEcology, completedQuizDaily, challengeJoined, completedDays, hasInteractedPhilosophy, leaderboard]);

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const isCorrect = idx === q.correct;
    
    // Add to history
    setUserAnswersHistory(prev => [...prev, { qIndex: currentQ, selected: idx, isCorrect }]);

    if (isCorrect) {
      setScore(s => s + 1);
    } else {
      setLives(l => {
        const nextLives = l - 1;
        if (nextLives === 0) {
          setQuizState('failed');
        }
        return nextLives;
      });
    }
  };

  const handleNext = () => {
    if (currentQ < activeQuestions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      // Completed successfully
      setQuizState('done');
      setIsSubmitted(false);
      
      const finalScore = userAnswersHistory.filter(h => h.isCorrect).length;

      if (quizCategory === 'tradition') {
        setCompletedQuizTradition(true);
        setQuizHighScoreTradition(prev => Math.max(prev, finalScore));
      } else if (quizCategory === 'ecology') {
        setCompletedQuizEcology(true);
        setQuizHighScoreEcology(prev => Math.max(prev, finalScore));
      } else {
        setCompletedQuizDaily(true);
        setQuizHighScoreDaily(prev => Math.max(prev, finalScore));
      }

      if (finalScore === activeQuestions.length) {
        // Trigger explosion of confetti for perfect score!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const startQuiz = (category: 'tradition' | 'ecology' | 'daily') => {
    setQuizCategory(category);
    setQuizState('active');
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setLives(3);
    setUserAnswersHistory([]);
  };

  const restartQuiz = () => {
    setQuizState('idle');
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setLives(3);
    setUserAnswersHistory([]);
  };

  // Submit to mock leaderboard
  const handleSubmitLeaderboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    const scoredTraditionPerfect = quizHighScoreTradition === questionsTradition.length && completedQuizTradition;
    const scoredEcologyPerfect = quizHighScoreEcology === questionsEcology.length && completedQuizEcology;
    const scoredDailyPerfect = quizHighScoreDaily === 4 && completedQuizDaily;
    
    const finalScore = userAnswersHistory.filter(h => h.isCorrect).length;
    const baseHighScore = 
      (quizCategory === 'tradition' ? Math.max(quizHighScoreTradition, finalScore) : quizHighScoreTradition) +
      (quizCategory === 'ecology' ? Math.max(quizHighScoreEcology, finalScore) : quizHighScoreEcology) +
      (quizCategory === 'daily' ? Math.max(quizHighScoreDaily, finalScore) : quizHighScoreDaily);

    const completedAllDays = completedDays.length === 7;
    const scoredThreeOrMore = quizHighScoreTradition >= 3 || quizHighScoreEcology >= 3 || quizHighScoreDaily >= 3;
    
    let badgeCount = 0;
    if (hasInteractedPhilosophy) badgeCount++;
    if (scoredThreeOrMore) badgeCount++;
    if (challengeJoined) badgeCount++;
    if (scoredTraditionPerfect) badgeCount++;
    if (completedAllDays) badgeCount++;
    if (scoredTraditionPerfect && scoredEcologyPerfect && scoredDailyPerfect) badgeCount++;

    const newEntry = {
      name: userName,
      score: baseHighScore,
      badgeCount,
      isUser: true,
    };

    setLeaderboard(prev => {
      const filtered = prev.filter(entry => !entry.isUser);
      const updated = [...filtered, newEntry];
      return updated.sort((a, b) => b.score - a.score || b.badgeCount - a.badgeCount);
    });

    setIsSubmitted(true);
    confetti({
      particleCount: 50,
      spread: 40,
      origin: { y: 0.8 }
    });
  };

  const toggleDayCompleted = (index: number) => {
    if (!challengeJoined) {
      setChallengeJoined(true);
    }
    setCompletedDays(prev => {
      const isAlreadyCompleted = prev.includes(index);
      const next = isAlreadyCompleted ? prev.filter(i => i !== index) : [...prev, index];
      
      // If completed all 7 days, celebrate!
      if (next.length === 7) {
        confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.5 }
        });
      }
      return next;
    });
  };

  return (
    <section id="edukasi" className="py-20 bg-background relative overflow-hidden">
      {/* Decorative backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/2 opacity-35 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <BookOpen className="w-4 h-4" />
            Edukasi Interaktif
          </div>
          <h2 className="text-foreground mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{tx.title}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">{tx.sub}</p>
        </motion.div>

        {/* Philosophy Cards Section */}
        <div className="mb-20">
          <h3 className="text-foreground text-center mb-2 text-xl font-bold">{tx.philTitle}</h3>
          <p className="text-muted-foreground text-center text-xs mb-8">{tx.philoTipClick}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {philosophies.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => {
                    setActivePhilosophy(i);
                    setPhilosophyTab('history');
                    if (!hasInteractedPhilosophy) {
                      setHasInteractedPhilosophy(true);
                    }
                  }}
                  className={`rounded-2xl p-6 border border-border bg-card/60 backdrop-blur-md transition-all cursor-pointer hover:shadow-xl hover:border-primary/30 flex flex-col justify-between`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl bg-background flex items-center justify-center mb-5 shadow-sm border border-border`}>
                      <Icon className={`w-6 h-6 ${p.color}`} />
                    </div>
                    <h4 className="text-foreground font-bold text-sm mb-2">{lang === 'id' ? p.title : p.titleEn}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-3">{lang === 'id' ? p.desc : p.descEn}</p>
                  </div>
                  <div className="mt-auto">
                    <blockquote className={`text-xs italic ${p.color} border-l-2 pl-2 leading-relaxed mb-4`} style={{ borderColor: 'currentColor' }}>
                      {lang === 'id' ? p.quote : p.quoteEn}
                    </blockquote>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
                      {tx.readMore} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Main Dashboard Layout: Quiz + Badges */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Advanced Quiz Module */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between relative"
          >
            <div>
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <Target className="w-5.5 h-5.5 text-primary" />
                  <div>
                    <h3 className="text-foreground text-base font-bold leading-tight">{tx.quizTitle}</h3>
                    <p className="text-muted-foreground text-xs">{tx.quizSub}</p>
                  </div>
                </div>

                {/* Show lives if active */}
                {quizState === 'active' && (
                  <div className="flex items-center gap-1.5 bg-muted/65 px-3 py-1.5 rounded-full border border-border">
                    <span className="text-xs text-muted-foreground font-semibold mr-1">{tx.lives}:</span>
                    {[...Array(3)].map((_, i) => (
                      <Heart 
                        key={i} 
                        className={`w-4 h-4 transition-transform duration-300 ${
                          i < lives ? 'text-red-500 fill-red-500 scale-100' : 'text-muted-foreground/30 scale-90'
                        }`} 
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* State: Idle / Choose Category */}
              {quizState === 'idle' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6">
                  <h4 className="text-sm font-bold text-foreground mb-4 text-center">{tx.chooseCategory}</h4>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Category 1 */}
                    <div 
                      onClick={() => startQuiz('tradition')}
                      className="p-5 rounded-2xl border border-border bg-muted/20 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 flex items-center justify-center mb-3">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <h5 className="text-sm font-bold text-foreground mb-1">{tx.catTradition}</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{tx.catTraditionDesc}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                        <span className="text-[11px] text-muted-foreground">High Score: <strong className="text-foreground">{quizHighScoreTradition}/4</strong></span>
                        <span className="text-[11px] font-bold text-primary inline-flex items-center gap-0.5">{tx.start} <ChevronRight className="w-3.5 h-3.5" /></span>
                      </div>
                    </div>

                    {/* Category 2 */}
                    <div 
                      onClick={() => startQuiz('ecology')}
                      className="p-5 rounded-2xl border border-border bg-muted/20 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 flex items-center justify-center mb-3">
                          <Leaf className="w-5 h-5" />
                        </div>
                        <h5 className="text-sm font-bold text-foreground mb-1">{tx.catEcology}</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{tx.catEcologyDesc}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                        <span className="text-[11px] text-muted-foreground">High Score: <strong className="text-foreground">{quizHighScoreEcology}/4</strong></span>
                        <span className="text-[11px] font-bold text-primary inline-flex items-center gap-0.5">{tx.start} <ChevronRight className="w-3.5 h-3.5" /></span>
                      </div>
                    </div>

                    {/* Category 3 */}
                    <div 
                      onClick={() => startQuiz('daily')}
                      className="p-5 rounded-2xl border border-border bg-muted/20 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center mb-3">
                          <Flame className="w-5 h-5" />
                        </div>
                        <h5 className="text-sm font-bold text-foreground mb-1">{tx.catDaily}</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{tx.catDailyDesc}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                        <span className="text-[11px] text-muted-foreground">{tx.dailyHighScore}: <strong className="text-foreground">{quizHighScoreDaily}/4</strong></span>
                        <span className="text-[11px] font-bold text-primary inline-flex items-center gap-0.5">{tx.start} <ChevronRight className="w-3.5 h-3.5" /></span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* State: Active Question */}
              {quizState === 'active' && (
                <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  {/* Progress bar */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        animate={{ width: `${((currentQ + 1) / activeQuestions.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">{currentQ + 1}/{activeQuestions.length}</span>
                  </div>

                  <div className="mb-6 p-5 rounded-2xl bg-primary/5 border border-primary/15">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase text-primary mb-2">
                      {quizCategory === 'tradition' ? tx.catTradition : quizCategory === 'ecology' ? tx.catEcology : tx.catDaily}
                    </span>
                    <p className="text-foreground text-sm font-semibold leading-relaxed">{lang === 'id' ? q.q : q.qEn}</p>
                  </div>

                  <div className="grid gap-3 mb-6">
                    {(lang === 'id' ? q.opts : q.optsEn).map((opt, idx) => {
                      let style = 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5';
                      if (answered) {
                        if (idx === q.correct) {
                          style = 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300';
                        } else if (idx === selected) {
                          style = 'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400';
                        } else {
                          style = 'border-border bg-card text-muted-foreground opacity-50';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={answered}
                          onClick={() => handleAnswer(idx)}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left text-xs font-medium transition-all ${style} ${!answered ? 'cursor-pointer hover:translate-x-1' : 'cursor-default'}`}
                        >
                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                            answered && idx === q.correct ? 'border-green-500 bg-green-500 text-white' :
                            answered && idx === selected ? 'border-red-400 bg-red-400 text-white' :
                            'border-border'
                          }`}>
                            {answered && idx === q.correct ? <CheckCircle className="w-3.5 h-3.5" /> :
                             answered && idx === selected ? <XCircle className="w-3.5 h-3.5" /> :
                             String.fromCharCode(65 + idx)}
                          </div>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {answered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 rounded-xl bg-muted border border-border text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5"
                      >
                        <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>{tx.explain}:</strong> {lang === 'id' ? q.explanation : q.explanationEn}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {answered && (
                    <button
                      onClick={handleNext}
                      className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-95 transition-all shadow-md shadow-primary/25 active:scale-[0.99] flex items-center justify-center gap-1.5"
                    >
                      {currentQ < activeQuestions.length - 1 ? tx.next : (lang === 'id' ? 'Lihat Hasil' : 'See Results')} 
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              )}

              {/* State: Quiz Failed */}
              {quizState === 'failed' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <div className="text-5xl mb-4">💔</div>
                  <h3 className="text-red-500 font-extrabold text-xl mb-2">{tx.failedTitle}</h3>
                  <p className="text-muted-foreground text-xs max-w-sm mx-auto mb-6 leading-relaxed">
                    {tx.failedDesc}
                  </p>

                  <div className="flex justify-center gap-3 mb-8">
                    <button 
                      onClick={() => startQuiz(quizCategory)} 
                      className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 shadow-md shadow-primary/25 transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> {lang === 'id' ? 'Ulangi Kuis' : 'Retry Quiz'}
                    </button>
                    <button 
                      onClick={restartQuiz} 
                      className="px-6 py-2.5 rounded-xl border border-border text-muted-foreground font-semibold text-xs hover:bg-muted transition-all"
                    >
                      {lang === 'id' ? 'Kategori Lain' : 'Other Category'}
                    </button>
                  </div>

                  {/* Review Answers for failed state */}
                  {userAnswersHistory.length > 0 && (
                    <div className="border-t border-border pt-6 text-left max-w-xl mx-auto">
                      <h4 className="text-sm font-bold text-foreground mb-4 inline-flex items-center gap-1.5">
                        <ClipboardCheck className="w-4.5 h-4.5 text-primary" /> {tx.reviewTitle}
                      </h4>
                      <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                        {userAnswersHistory.map((history, i) => {
                          const question = activeQuestions[history.qIndex];
                          const selectedOpt = lang === 'id' ? question.opts[history.selected] : question.optsEn[history.selected];
                          const correctOpt = lang === 'id' ? question.opts[question.correct] : question.optsEn[question.correct];
                          
                          return (
                            <div key={i} className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs">
                              <p className="font-bold text-foreground mb-2">{i+1}. {lang === 'id' ? question.q : question.qEn}</p>
                              <div className="space-y-1 mb-2">
                                <p className="text-red-500">❌ {tx.yourAnswer}: <span className="font-semibold">{selectedOpt}</span></p>
                                <p className="text-green-600 dark:text-green-400">✅ {tx.correctAnswer}: <span className="font-semibold">{correctOpt}</span></p>
                              </div>
                              <p className="text-muted-foreground leading-normal mt-2 border-t border-border/40 pt-2 italic">
                                💡 {lang === 'id' ? question.explanation : question.explanationEn}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* State: Quiz Finished Success */}
              {quizState === 'done' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="text-5xl mb-4">🏆</div>
                  <h3 className="text-foreground mb-2 text-xl font-bold">{tx.result}</h3>
                  <div className="text-5xl font-extrabold text-primary mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {score}/{activeQuestions.length}
                  </div>
                  <p className="text-muted-foreground text-xs mb-4">
                    {tx.score}: <strong className="text-foreground">{Math.round((score / activeQuestions.length) * 100)}%</strong>
                  </p>

                  <div className="w-full h-3 rounded-full bg-muted overflow-hidden mx-auto max-w-xs mb-6 border border-border/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(score / activeQuestions.length) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>

                  <div className="flex justify-center gap-3 mb-8">
                    <button 
                      onClick={() => startQuiz(quizCategory)} 
                      className="px-5 py-2.5 rounded-xl border border-border text-muted-foreground text-xs hover:border-primary hover:text-primary transition-all font-semibold flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> {tx.restart}
                    </button>
                    <button 
                      onClick={restartQuiz} 
                      className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs hover:opacity-90 transition-all font-semibold shadow-md shadow-primary/20"
                    >
                      {lang === 'id' ? 'Pilih Kuis Lain' : 'Other Quizzes'}
                    </button>
                  </div>

                  {/* Leaderboard Submission Form */}
                  <div className="max-w-xs mx-auto mb-8 p-4 rounded-2xl bg-muted/40 border border-border">
                    <h4 className="text-xs font-bold text-foreground mb-2 flex items-center justify-center gap-1.5">
                      🏆 Submit Skor ke Leaderboard
                    </h4>
                    {isSubmitted ? (
                      <p className="text-[11px] text-green-600 dark:text-green-400 font-semibold">
                        ✅ {tx.submittedSuccess}
                      </p>
                    ) : (
                      <form onSubmit={handleSubmitLeaderboard} className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder={tx.submitNamePlaceholder}
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold text-[11px] hover:opacity-90 transition-all shadow-sm"
                        >
                          Submit
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Review Answers for completed state */}
                  <div className="border-t border-border pt-6 text-left max-w-xl mx-auto">
                    <h4 className="text-xs font-bold text-foreground mb-4 inline-flex items-center gap-1.5 uppercase tracking-wider">
                      <ClipboardCheck className="w-4 h-4 text-primary" /> {tx.reviewTitle}
                    </h4>
                    <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                      {activeQuestions.map((question, i) => {
                        const history = userAnswersHistory.find(h => h.qIndex === i);
                        const isCorrect = history ? history.isCorrect : false;
                        const selectedOpt = history 
                          ? (lang === 'id' ? question.opts[history.selected] : question.optsEn[history.selected]) 
                          : '-';
                        const correctOpt = lang === 'id' ? question.opts[question.correct] : question.optsEn[question.correct];
                        
                        return (
                          <div key={i} className={`p-4 rounded-2xl border text-xs bg-muted/15 ${isCorrect ? 'border-green-500/30' : 'border-red-400/30'}`}>
                            <p className="font-bold text-foreground mb-2">{i+1}. {lang === 'id' ? question.q : question.qEn}</p>
                            <div className="space-y-1 mb-2">
                              <p className={isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-500'}>
                                {isCorrect ? '✅' : '❌'} {tx.yourAnswer}: <span className="font-semibold">{selectedOpt}</span>
                              </p>
                              {!isCorrect && (
                                <p className="text-green-600 dark:text-green-400">
                                  ✅ {tx.correctAnswer}: <span className="font-semibold">{correctOpt}</span>
                                </p>
                              )}
                            </div>
                            <p className="text-muted-foreground leading-normal mt-2 border-t border-border/40 pt-2 italic">
                              💡 {lang === 'id' ? question.explanation : question.explanationEn}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Badges Collection & Leaderboard Sidebar */}
          <div className="space-y-6">
            {/* Badges Collection Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1 border-b border-border pb-4">
                  <Trophy className="w-5.5 h-5.5 text-amber-500" />
                  <div>
                    <h3 className="text-foreground text-base font-bold">{tx.badgeTitle}</h3>
                    <p className="text-muted-foreground text-xs leading-none mt-0.5">{tx.badgeSub}</p>
                  </div>
                </div>

                <div className="space-y-3 mt-5">
                  {dynamicBadges.map(badge => (
                    <motion.div
                      key={badge.id}
                      whileHover={{ x: 4 }}
                      className={`flex items-center gap-3.5 p-3.5 rounded-2xl border-2 transition-all shadow-sm ${
                        badge.earned 
                          ? `${badge.color} border-current/20` 
                          : 'border-border bg-muted/20 opacity-45'
                      }`}
                    >
                      <div className={`text-3xl filter transition-transform ${badge.earned ? 'drop-shadow-md scale-110' : 'grayscale'}`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-bold truncate ${badge.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {lang === 'id' ? badge.name : badge.nameEn}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">{lang === 'id' ? badge.desc : badge.descEn}</div>
                      </div>
                      <div>
                        {badge.earned ? (
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <div className="w-4.5 h-4.5 rounded-full border border-border/80 flex items-center justify-center text-[10px] text-muted-foreground/50">🔒</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Leaderboard Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1 border-b border-border pb-4">
                  <Award className="w-5.5 h-5.5 text-primary" />
                  <div>
                    <h3 className="text-foreground text-base font-bold">{tx.leaderboardTitle}</h3>
                    <p className="text-muted-foreground text-xs leading-none mt-0.5">{tx.leaderboardSub}</p>
                  </div>
                </div>

                <div className="space-y-2.5 mt-5">
                  {leaderboard.map((entry, idx) => {
                    const placeColor = 
                      idx === 0 ? 'bg-amber-500 text-white font-extrabold shadow-sm' :
                      idx === 1 ? 'bg-slate-400 text-white font-extrabold shadow-sm' :
                      idx === 2 ? 'bg-amber-700 text-white font-extrabold shadow-sm' :
                      'bg-muted text-muted-foreground font-semibold';

                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.01 }}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                          entry.isUser 
                            ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20' 
                            : 'border-border bg-card'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${placeColor}`}>
                            {idx + 1}
                          </div>
                          <div>
                            <div className={`text-xs ${entry.isUser ? 'font-bold text-primary' : 'font-semibold text-foreground'}`}>
                              {entry.name} {entry.isUser && <span className="text-[10px] font-normal text-muted-foreground">(Kamu)</span>}
                            </div>
                            <div className="text-[10px] text-muted-foreground">{entry.badgeCount} Lencana</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-foreground">{entry.score} pts</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Interactive 7 Day Challenge & Progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden relative"
        >
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-[0.03] bg-primary blur-2xl pointer-events-none" style={{ transform: 'translate(20%, -20%)' }} />
          
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-border pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Flame className="w-5.5 h-5.5 text-accent" />
                  <h3 className="text-foreground text-base font-bold">{tx.challenge}</h3>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-xl">{tx.challengeDesc}</p>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                {/* Challenge Progress Bar */}
                {challengeJoined && (
                  <div className="text-right">
                    <div className="text-[11px] font-bold text-foreground">
                      {tx.challengeProgress}: <span className="text-primary">{completedDays.length}/7</span> ({Math.round((completedDays.length / 7) * 100)}%)
                    </div>
                    <div className="w-28 h-2 bg-muted rounded-full overflow-hidden mt-1 border border-border/50">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500" 
                        style={{ width: `${(completedDays.length / 7) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setChallengeJoined(true)}
                  className={`flex-shrink-0 px-5 py-3 rounded-xl font-bold text-xs transition-all active:scale-[0.98] ${
                    challengeJoined
                      ? 'bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400'
                      : 'bg-accent text-accent-foreground hover:opacity-90 shadow-md shadow-accent/25'
                  }`}
                >
                  {challengeJoined ? '✅ Active' : tx.join}
                </button>
              </div>
            </div>

            {/* Grid Days */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {tx.days.map((day, i) => {
                const isCompleted = completedDays.includes(i);
                
                return (
                  <div 
                    key={i}
                    className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden p-3.5 bg-muted/10 ${
                      isCompleted 
                        ? 'border-green-500 bg-green-500/5 shadow-sm' 
                        : 'border-border bg-card/45 hover:border-primary/50'
                    }`}
                  >
                    <div>
                      {/* Checkbox button */}
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-2xl filter drop-shadow-sm">
                          {dayDetails[i].icon}
                        </span>
                        
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => toggleDayCompleted(i)}
                          className="w-4.5 h-4.5 rounded border-border text-primary focus:ring-primary focus:ring-1 accent-primary cursor-pointer"
                        />
                      </div>

                      <div className="text-[11px] font-bold text-foreground leading-tight mb-3">
                        {day}
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                      className={`w-full py-1.5 rounded-lg border text-[10px] font-semibold transition-all ${
                        expandedDay === i
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border bg-card text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {expandedDay === i ? (lang === 'id' ? 'Tutup Info' : 'Close Info') : (lang === 'id' ? 'Detail Tips' : 'Tips Info')}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Expanded Day Details Panel */}
            <AnimatePresence>
              {expandedDay !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="p-5 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3.5 overflow-hidden"
                >
                  <div className="text-3xl flex-shrink-0 mt-0.5 filter drop-shadow-sm">
                    {dayDetails[expandedDay].icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                      {lang === 'id' ? `TIPS TANTANGAN HARI ${expandedDay + 1}` : `CHALLENGE TIPS DAY ${expandedDay + 1}`}
                    </div>
                    <p className="text-xs text-foreground leading-relaxed font-semibold">
                      {lang === 'id' ? dayDetails[expandedDay].tipsId : dayDetails[expandedDay].tipsEn}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Eco-Coach Panel */}
            <div className="mt-8 border-t border-border pt-6">
              <div className="flex items-center gap-2.5 mb-4">
                <Sparkles className="w-5.5 h-5.5 text-primary animate-pulse" />
                <div>
                  <h4 className="text-foreground text-sm font-bold leading-tight">{tx.aiCoachTitle}</h4>
                  <p className="text-muted-foreground text-xs">{tx.aiCoachSub}</p>
                </div>
              </div>

              {completedDays.length === 0 ? (
                <div className="p-4 rounded-2xl bg-muted/30 border border-border text-center text-xs text-muted-foreground">
                  {tx.aiCoachEmpty}
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6 items-stretch">
                  {/* Left Impact Statistics */}
                  <div className="md:col-span-1 p-4 rounded-2xl bg-muted/40 border border-border flex flex-col justify-around gap-2 text-xs">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Estimasi Dampak Lingkungan
                    </div>
                    {ecoCoachImpact.co2Saved > 0 && (
                      <div className="flex justify-between items-center py-1 border-b border-border/40">
                        <span className="text-muted-foreground">Emisi CO2 Dikurangi:</span>
                        <span className="font-bold text-foreground">{ecoCoachImpact.co2Saved} kg</span>
                      </div>
                    )}
                    {ecoCoachImpact.waterSaved > 0 && (
                      <div className="flex justify-between items-center py-1 border-b border-border/40">
                        <span className="text-muted-foreground">Air Bersih Dihemat:</span>
                        <span className="font-bold text-foreground">{ecoCoachImpact.waterSaved} L</span>
                      </div>
                    )}
                    {ecoCoachImpact.plasticSaved > 0 && (
                      <div className="flex justify-between items-center py-1 border-b border-border/40">
                        <span className="text-muted-foreground">Sampah Plastik Dikurangi:</span>
                        <span className="font-bold text-foreground">{ecoCoachImpact.plasticSaved} kg</span>
                      </div>
                    )}
                    {ecoCoachImpact.communityCount > 0 && (
                      <div className="flex justify-between items-center py-1">
                        <span className="text-muted-foreground">Aksi Komunitas:</span>
                        <span className="font-bold text-foreground">Saling Berbagi</span>
                      </div>
                    )}
                  </div>

                  {/* Right Coach Analysis Feedback */}
                  <div className="md:col-span-2 p-5 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary mb-2 uppercase">
                        {tx.aiCoachFeedback}
                      </div>
                      <p className="text-xs text-foreground leading-relaxed">
                        {completedDays.length === 7 ? (
                          lang === 'id' 
                            ? 'Luar biasa! Kamu telah menyelesaikan seluruh rangkaian tantangan 7 hari. Kamu tidak hanya mempelajari teori kearifan lokal, melainkan mempraktikkannya langsung. Aksi nyata ini menunjukkan pemahaman mendalam tentang Pikukuh (hukum adat pelestarian) di era modern. Kamu layak menyandang gelar Duta Pelestari!'
                            : 'Incredible! You have completed the entire 7-day challenge. You did not just study local wisdom, you practiced it in the real world. This direct action demonstrates a deep understanding of Pikukuh (preservation customary law) in the modern era. You truly deserve the Eco Ambassador title!'
                        ) : (
                          lang === 'id'
                            ? `Eco-Coach menilai kamu sudah memulai langkah pelestarian yang baik dengan menyelesaikan ${completedDays.length} tantangan. Kombinasi perkiraan reduksi plastik, air, dan emisi karbon berdampak langsung pada kelangsungan ekosistem. Teruskan untuk membuka status Duta Pelestari!`
                            : `Eco-Coach evaluates that you have made a great start towards preservation by completing ${completedDays.length} challenges. Combining estimated reductions in plastic, water, and carbon footprint directly impacts local ecosystems. Keep going to unlock the Eco Ambassador title!`
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- Deep Dive Philosophy Modal Dialog --- */}
      <AnimatePresence>
        {activePhilosophy !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            {/* Modal Backdrop click to close */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 cursor-default" 
              onClick={() => setActivePhilosophy(null)} 
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-full max-w-xl bg-card border border-border rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col"
            >
              {/* Top Banner decoration */}
              <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600" />
              
              {/* Close Button */}
              <button 
                onClick={() => setActivePhilosophy(null)} 
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    {(() => {
                      const Icon = philosophies[activePhilosophy].icon;
                      return <Icon className="w-6 h-6" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-foreground text-lg font-bold leading-tight">
                      {lang === 'id' ? philosophies[activePhilosophy].title : philosophies[activePhilosophy].titleEn}
                    </h3>
                    <p className="text-muted-foreground text-xs italic mt-0.5">
                      {lang === 'id' ? philosophies[activePhilosophy].quote : philosophies[activePhilosophy].quoteEn}
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed mb-6 border-b border-border pb-4">
                  {lang === 'id' ? philosophies[activePhilosophy].desc : philosophies[activePhilosophy].descEn}
                </p>

                {/* Exploration Tabs Navigation */}
                <div className="flex border-b border-border/80 gap-1.5 mb-5 bg-muted/40 p-1 rounded-xl">
                  {(['history', 'modern', 'action'] as const).map((tab) => {
                    let label = '';
                    if (tab === 'history') label = tx.philoTabHistory;
                    if (tab === 'modern') label = tx.philoTabModern;
                    if (tab === 'action') label = tx.philoTabAction;
                    
                    return (
                      <button
                        key={tab}
                        onClick={() => setPhilosophyTab(tab)}
                        className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all ${
                          philosophyTab === tab
                            ? 'bg-card text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Contents */}
                <div className="min-h-36 flex flex-col justify-between">
                  <div>
                    {philosophyTab === 'history' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-foreground leading-relaxed">
                        <h4 className="font-bold text-primary mb-2 flex items-center gap-1.5">
                          📜 {lang === 'id' ? 'Latar Belakang & Akar Budaya' : 'Cultural Roots & History'}
                        </h4>
                        <p>{lang === 'id' ? philosophiesDetail[activePhilosophy].historyId : philosophiesDetail[activePhilosophy].historyEn}</p>
                      </motion.div>
                    )}

                    {philosophyTab === 'modern' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-foreground leading-relaxed">
                        <h4 className="font-bold text-primary mb-2 flex items-center gap-1.5">
                          🌍 {lang === 'id' ? 'Relevansi Isu Iklim Modern' : 'Relevance to Modern Climate Issues'}
                        </h4>
                        <p>{lang === 'id' ? philosophiesDetail[activePhilosophy].modernId : philosophiesDetail[activePhilosophy].modernEn}</p>
                      </motion.div>
                    )}

                    {philosophyTab === 'action' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-foreground leading-relaxed">
                        <h4 className="font-bold text-primary mb-2 flex items-center gap-1.5">
                          ⚡ {lang === 'id' ? 'Langkah Tindakan Riil' : 'Real Step of Action'}
                        </h4>
                        <p className="bg-primary/5 border border-primary/20 p-4 rounded-xl font-medium">
                          {lang === 'id' ? philosophiesDetail[activePhilosophy].actionId : philosophiesDetail[activePhilosophy].actionEn}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <div className="mt-8 border-t border-border pt-4 flex justify-end">
                    <button 
                      onClick={() => setActivePhilosophy(null)}
                      className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 shadow-md shadow-primary/10 transition-all active:scale-[0.98]"
                    >
                      {tx.close}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
