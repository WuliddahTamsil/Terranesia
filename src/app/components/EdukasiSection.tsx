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
    title: 'Kamase-masea (Kajang)', titleEn: 'Kamase-masea (Kajang)',
    desc: 'Filosofi hidup bersahaja Suku Kajang di Sulawesi Selatan yang menolak kemewahan material demi menjaga kemurnian batin dan kelestarian hutan adat Ammatoa.',
    descEn: 'The simple living philosophy of the Kajang tribe in South Sulawesi, rejecting material luxury to maintain spiritual purity and preserve the Ammatoa customary forest.',
    quote: '"Amenteng ko kamase-masea, accule ko kamase-masea"',
    quoteEn: '"Stand in simplicity, play in simplicity"',
  },
  {
    icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30',
    title: 'Tri Hita Karana (Bali)', titleEn: 'Tri Hita Karana (Bali)',
    desc: 'Konsep hidup harmonis masyarakat Bali yang membagi hubungan kebahagiaan menjadi tiga aspek: harmoni dengan sesama manusia, alam lingkungan (Palemahan), dan Sang Pencipta.',
    descEn: 'The harmonious living concept of Balinese society dividing the relationships of happiness into three aspects: harmony with fellow humans, nature (Palemahan), and the Creator.',
    quote: '"Palemahan: Merawat tanah, menjaga kehidupan"',
    quoteEn: '"Palemahan: Caring for the land, preserving life"',
  },
  {
    icon: Wind, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30',
    title: 'Pikukuh Adat (Baduy)', titleEn: 'Pikukuh Adat (Baduy)',
    desc: 'Ketentuan adat mutlak Suku Baduy di Banten yang menolak modernisasi luar demi menjaga keseimbangan ekologi pegunungan Kendeng dan keaslian titipan leluhur.',
    descEn: 'The absolute customary code of the Baduy tribe in Banten, rejecting external modernization to preserve the ecological balance of the Kendeng mountains and ancestral heritage.',
    quote: '"Lojor teu meunang dipotong, pondok teu meunang disambung"',
    quoteEn: '"Long must not be cut, short must not be spliced"',
  },
  {
    icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30',
    title: 'Hukum Sasi (Maluku-Papua)', titleEn: 'Sasi Law (Maluku-Papua)',
    desc: 'Sistem konservasi tradisional masyarakat Maluku dan Papua yang melarang pengambilan hasil laut atau darat pada periode tertentu agar ekosistem pulih secara alami.',
    descEn: 'The traditional conservation system of Maluku and Papua societies prohibiting the harvest of land or marine resources for a specific period to let ecosystems recover.',
    quote: '"Menjaga laut hari ini untuk kehidupan esok hari"',
    quoteEn: '"Guarding the sea today for tomorrow\'s life"',
  },
];

const philosophiesDetail = [
  {
    historyId: 'Bagi Suku Kajang Ammatoa di Sulawesi Selatan, gaya hidup bersahaja ("kamase-masea") adalah aturan adat utama. Mereka berpakaian serba hitam tanpa alas kaki untuk menunjukkan kesetaraan mutlak di hadapan alam, serta melarang teknologi modern di dalam kawasan hutan adat mereka.',
    historyEn: 'For the Kajang Ammatoa tribe in South Sulawesi, a modest lifestyle ("kamase-masea") is the primary customary rule. They dress entirely in black without footwear to demonstrate absolute equality before nature, and reject modern technology within their customary forest.',
    modernId: 'Di tengah krisis iklim global yang dipicu oleh konsumerisme berlebihan, filosofi ini memotivasi kita untuk beralih ke konsumsi secukupnya (slow consumption), mengurangi limbah fesyen (fast fashion), serta mengurangi ketergantungan pada barang-barang instan yang merusak lingkungan.',
    modernEn: 'Amidst the global climate crisis driven by overconsumption, this philosophy motivates us to shift to mindful consumption (slow consumption), reduce fast fashion waste, and minimize reliance on single-use convenience goods that harm the environment.',
    actionId: 'Terapkan konsep "pembelian sadar": sebelum membeli sesuatu, tanyakan apakah barang tersebut esensial atau sekadar gengsi. Kurangi membeli pakaian baru secara impulsif dan rawatlah barang yang Anda miliki agar berumur panjang.',
    actionEn: 'Apply the concept of "mindful purchasing": before buying, ask if the item is essential or just for prestige. Reduce impulsive purchases of new clothing and care for what you already own to maximize its lifespan.'
  },
  {
    historyId: 'Di Bali, sistem irigasi tradisional subak menerapkan prinsip Tri Hita Karana, khususnya aspek Palemahan (hubungan harmonis dengan alam). Distribusi air dibagi secara adil tanpa monopoli, disertai ritual syukur di pura subak sebelum pembukaan pintu air sawah.',
    historyEn: 'In Bali, the traditional subak irrigation system applies Tri Hita Karana, particularly the Palemahan aspect (harmonious relation with nature). Water is shared equitably without monopoly, accompanied by gratitude rituals at the subak temple before opening canals.',
    modernId: 'Pembangunan masif sering kali mengabaikan keadilan ekologis dan kelestarian sumber daya bersama. Menghormati daya dukung alam berlandaskan Palemahan berarti melindungi daerah resapan air, mencegah alih fungsi sawah, dan melestarikan hutan lindung.',
    modernEn: 'Massive developments often ignore ecological justice and the preservation of shared resources. Respecting nature\'s carrying capacity based on Palemahan means protecting water catchment areas, preventing paddy field conversion, and conserving protected forests.',
    actionId: 'Hemat penggunaan air di rumah dengan menutup keran saat menyikat gigi atau mencuci sabun. Kumpulkan air bekas mencuci sayuran atau buah untuk menyiram tanaman halaman Anda.',
    actionEn: 'Conserve water at home by turning off faucets while brushing teeth or soaping dishes. Collect wastewater from washing fruits or vegetables to water your garden plants.'
  },
  {
    historyId: 'Pikukuh Baduy adalah komitmen mutlak menjaga keaslian titipan leluhur di Banten. Mereka melarang pengaspalan jalan, penggunaan semen, sabun kimia di sungai, dan mesin bermotor untuk menjaga tanah air pegunungan Kendeng tetap murni dan bebas pencemaran.',
    historyEn: 'Pikukuh Baduy is an absolute commitment to protect ancestral heritage in Banten. They prohibit road paving, cement use, chemical soaps in rivers, and motorized machinery to keep the Kendeng mountain soil and water pure and unpolluted.',
    modernId: 'Pikukuh mengingatkan kita bahwa tidak semua inovasi teknologi menguntungkan bumi. Kita perlu menetapkan regulasi ketat terhadap industri yang membuang limbah berbahaya dan membatasi penggunaan teknologi ekstraktif yang merusak tanah.',
    modernEn: 'Pikukuh reminds us that not all technological innovations benefit the earth. We need strict regulations on industries dumping hazardous waste and limits on extractive technologies that damage the soil.',
    actionId: 'Pilihlah detergen dan pembersih rumah tangga ramah lingkungan (biodegradable) yang aman bagi mikroorganisme tanah. Kurangi berkendara motor untuk jarak dekat dengan berjalan kaki atau bersepeda.',
    actionEn: 'Choose biodegradable, eco-friendly detergents and household cleaners that are safe for soil microorganisms. Reduce driving for short distances by walking or cycling instead.'
  },
  {
    historyId: 'Sasi di Maluku dan Papua adalah pelarangan adat sementara untuk mengambil komoditas tertentu (seperti teripang, lobster, atau buah kenari) selama kurun waktu beberapa bulan hingga tahun. Ketika sasi dibuka ("buka sasi"), masyarakat memanen bersama dengan bijak.',
    historyEn: 'Sasi in Maluku and Papua is a temporary customary ban on harvesting specific resources (such as sea cucumber, lobster, or nutmeg) for months or years. When sasi is lifted ("buka sasi"), the community harvests collectively and wisely.',
    modernId: 'Eksploitasi laut yang berlebihan (overfishing) telah merusak terumbu karang dan mengancam pasokan pangan global. Sasi memberikan inspirasi bagi penetapan zona perlindungan laut dinamis di mana aktivitas penangkapan ikan dihentikan agar stok ikan dapat pemulihan.',
    modernEn: 'Overexploitation of the seas (overfishing) has damaged coral reefs and threatened global food security. Sasi inspires dynamic marine protected areas (MPAs) where fishing is temporarily paused to allow fish stocks to recover.',
    actionId: 'Beli hasil laut dari nelayan lokal berskala kecil yang menangkap ikan secara tradisional tanpa pukat harimau atau racun. Hindari mengonsumsi anak ikan atau spesies laut yang dilindungi.',
    actionEn: 'Purchase seafood from small-scale local fishers using traditional methods instead of trawls or chemicals. Avoid consuming juvenile fish or protected marine species.'
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
      if (dayIndex === 0) plasticSaved += 0.08; // kg (average daily plastic bag use per person)
      if (dayIndex === 1) co2Saved += 0.4;     // kg (walking 2 km instead of driving)
      if (dayIndex === 2) waterSaved += 50;     // liters (reducing shower time & faucet leaks)
      if (dayIndex === 3) co2Saved += 0.05;     // kg (daily carbon absorption of a young tree)
      if (dayIndex === 4) co2Saved += 0.3;     // kg (saving emissions by eating local/organic)
      if (dayIndex === 5) plasticSaved += 0.6; // kg (composting food waste and diverting recyclables)
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
              // Dynamic color themes for glassmorphism
              const themes = [
                { border: 'hover:border-emerald-500/35 hover:shadow-emerald-500/5', iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.02)]' },
                { border: 'hover:border-blue-500/35 hover:shadow-blue-500/5', iconBg: 'bg-blue-500/10 border-blue-500/20 text-blue-500', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.02)]' },
                { border: 'hover:border-purple-500/35 hover:shadow-purple-500/5', iconBg: 'bg-purple-500/10 border-purple-500/20 text-purple-500', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.02)]' },
                { border: 'hover:border-amber-500/35 hover:shadow-amber-500/5', iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-500', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.02)]' }
              ];
              const theme = themes[i % themes.length];

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
                  className={`rounded-2xl p-6 border border-border/80 bg-gradient-to-br from-card/85 to-card/45 backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-xl ${theme.border} ${theme.glow}`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border shadow-inner ${theme.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-foreground font-extrabold text-sm mb-2">{lang === 'id' ? p.title : p.titleEn}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-5 line-clamp-3">{lang === 'id' ? p.desc : p.descEn}</p>
                  </div>
                  <div className="mt-auto">
                    <blockquote className={`text-xs italic border-l-2 pl-2.5 leading-relaxed mb-4 ${p.color}`} style={{ borderColor: 'currentColor' }}>
                      {lang === 'id' ? p.quote : p.quoteEn}
                    </blockquote>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors">
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
                  <h4 className="text-sm font-extrabold text-foreground mb-5 text-center tracking-tight">{tx.chooseCategory}</h4>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Category 1 */}
                    <div 
                      onClick={() => startQuiz('tradition')}
                      className="p-5.5 rounded-2xl border border-cyan-500/25 bg-cyan-500/5 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] cursor-pointer transition-all duration-300 flex flex-col justify-between hover:translate-y-[-4px]"
                    >
                      <div>
                        <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4 shadow-sm">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <h5 className="text-sm font-extrabold text-foreground mb-1.5">{tx.catTradition}</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{tx.catTraditionDesc}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
                        <span className="text-[11px] text-muted-foreground">High Score: <strong className="text-foreground">{quizHighScoreTradition}/4</strong></span>
                        <span className="text-[11px] font-bold text-cyan-500 inline-flex items-center gap-0.5">{tx.start} <ChevronRight className="w-3.5 h-3.5" /></span>
                      </div>
                    </div>

                    {/* Category 2 */}
                    <div 
                      onClick={() => startQuiz('ecology')}
                      className="p-5.5 rounded-2xl border border-green-500/25 bg-green-500/5 hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.08)] cursor-pointer transition-all duration-300 flex flex-col justify-between hover:translate-y-[-4px]"
                    >
                      <div>
                        <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center mb-4 shadow-sm">
                          <Leaf className="w-5 h-5" />
                        </div>
                        <h5 className="text-sm font-extrabold text-foreground mb-1.5">{tx.catEcology}</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{tx.catEcologyDesc}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
                        <span className="text-[11px] text-muted-foreground">High Score: <strong className="text-foreground">{quizHighScoreEcology}/4</strong></span>
                        <span className="text-[11px] font-bold text-green-500 inline-flex items-center gap-0.5">{tx.start} <ChevronRight className="w-3.5 h-3.5" /></span>
                      </div>
                    </div>

                    {/* Category 3 */}
                    <div 
                      onClick={() => startQuiz('daily')}
                      className="p-5.5 rounded-2xl border border-rose-500/25 bg-rose-500/5 hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.08)] cursor-pointer transition-all duration-300 flex flex-col justify-between hover:translate-y-[-4px]"
                    >
                      <div>
                        <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 shadow-sm">
                          <Flame className="w-5 h-5" />
                        </div>
                        <h5 className="text-sm font-extrabold text-foreground mb-1.5">{tx.catDaily}</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{tx.catDailyDesc}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
                        <span className="text-[11px] text-muted-foreground">{tx.dailyHighScore}: <strong className="text-foreground">{quizHighScoreDaily}/4</strong></span>
                        <span className="text-[11px] font-bold text-rose-500 inline-flex items-center gap-0.5">{tx.start} <ChevronRight className="w-3.5 h-3.5" /></span>
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
                    <div className="flex-1 h-2.5 rounded-full bg-muted/60 overflow-hidden border border-border/40">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                        animate={{ width: `${((currentQ + 1) / activeQuestions.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">{currentQ + 1}/{activeQuestions.length}</span>
                  </div>

                  <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-card/65 border border-primary/20 shadow-inner">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-extrabold uppercase tracking-widest text-primary mb-2.5">
                      {quizCategory === 'tradition' ? tx.catTradition : quizCategory === 'ecology' ? tx.catEcology : tx.catDaily}
                    </span>
                    <p className="text-foreground text-sm font-bold leading-relaxed">{lang === 'id' ? q.q : q.qEn}</p>
                  </div>

                  <div className="grid gap-3 mb-6">
                    {(lang === 'id' ? q.opts : q.optsEn).map((opt, idx) => {
                      let style = 'border-border/60 bg-card/65 text-foreground hover:border-primary/45 hover:bg-primary/5 hover:translate-x-1';
                      if (answered) {
                        if (idx === q.correct) {
                          style = 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-300 shadow-[0_0_12px_rgba(34,197,94,0.1)]';
                        } else if (idx === selected) {
                          style = 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.1)]';
                        } else {
                          style = 'border-border bg-muted/20 text-muted-foreground/60 opacity-50';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={answered}
                          onClick={() => handleAnswer(idx)}
                          className={`flex items-center gap-3.5 p-4 rounded-xl border-2 text-left text-xs font-semibold transition-all duration-300 ${style} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                          <div className={`w-6.5 h-6.5 rounded-full border flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all duration-300 ${
                            answered && idx === q.correct ? 'border-green-500 bg-green-500 text-white shadow-sm' :
                            answered && idx === selected ? 'border-red-500 bg-red-500 text-white shadow-sm' :
                            'border-border/80 bg-background/50'
                          }`}>
                            {answered && idx === q.correct ? <CheckCircle className="w-3.5 h-3.5" /> :
                             answered && idx === selected ? <XCircle className="w-3.5 h-3.5" /> :
                             String.fromCharCode(65 + idx)}
                          </div>
                          <span className="flex-1 leading-normal">{opt}</span>
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
                        className="mb-6 p-4 rounded-xl bg-muted/60 border border-border/70 text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5 shadow-sm"
                      >
                        <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground">{tx.explain}:</strong> {lang === 'id' ? q.explanation : q.explanationEn}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {answered && (
                    <button
                      onClick={handleNext}
                      className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-95 transition-all shadow-md shadow-primary/25 active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
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
                  <div className="text-5xl mb-4 animate-bounce">💔</div>
                  <h3 className="text-red-500 font-extrabold text-xl mb-2">{tx.failedTitle}</h3>
                  <p className="text-muted-foreground text-xs max-w-sm mx-auto mb-6 leading-relaxed">
                    {tx.failedDesc}
                  </p>

                  <div className="flex justify-center gap-3 mb-8">
                    <button 
                      onClick={() => startQuiz(quizCategory)} 
                      className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 shadow-md shadow-primary/25 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> {lang === 'id' ? 'Ulangi Kuis' : 'Retry Quiz'}
                    </button>
                    <button 
                      onClick={restartQuiz} 
                      className="px-6 py-2.5 rounded-xl border border-border text-muted-foreground font-bold text-xs hover:bg-muted transition-all cursor-pointer"
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
                            <div key={i} className="p-4 rounded-2xl bg-card border border-border/80 text-xs shadow-md">
                              <p className="font-extrabold text-foreground mb-2.5">{i+1}. {lang === 'id' ? question.q : question.qEn}</p>
                              <div className="space-y-1.5 mb-3">
                                <p className="text-red-500 font-semibold flex items-center gap-1.5"><span>❌ {tx.yourAnswer}:</span> <span className="font-bold">{selectedOpt}</span></p>
                                <p className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1.5"><span>✅ {tx.correctAnswer}:</span> <span className="font-bold">{correctOpt}</span></p>
                              </div>
                              <p className="text-muted-foreground leading-normal mt-2 border-t border-border/40 pt-2 italic">
                                💡 <strong>{tx.explain}:</strong> {lang === 'id' ? question.explanation : question.explanationEn}
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
                  <div className="text-5xl mb-4 animate-bounce">🏆</div>
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
                      className="px-5 py-2.5 rounded-xl border border-border text-muted-foreground text-xs hover:border-primary hover:text-primary transition-all font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> {tx.restart}
                    </button>
                    <button 
                      onClick={restartQuiz} 
                      className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs hover:opacity-90 transition-all font-bold shadow-md shadow-primary/20 cursor-pointer"
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
                          className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-[11px] hover:opacity-90 transition-all shadow-sm cursor-pointer"
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
                          <div key={i} className={`p-4 rounded-2xl border text-xs bg-card shadow-md ${isCorrect ? 'border-green-500/30' : 'border-red-400/30'}`}>
                            <p className="font-extrabold text-foreground mb-2.5">{i+1}. {lang === 'id' ? question.q : question.qEn}</p>
                            <div className="space-y-1.5 mb-3">
                              <p className={`${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-500'} font-semibold flex items-center gap-1.5`}>
                                <span>{isCorrect ? '✅' : '❌'} {tx.yourAnswer}:</span> <span className="font-bold">{selectedOpt}</span>
                              </p>
                              {!isCorrect && (
                                <p className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1.5">
                                  <span>✅ {tx.correctAnswer}:</span> <span className="font-bold">{correctOpt}</span>
                                </p>
                              )}
                            </div>
                            <p className="text-muted-foreground leading-normal mt-2 border-t border-border/40 pt-2 italic">
                              💡 <strong>{tx.explain}:</strong> {lang === 'id' ? question.explanation : question.explanationEn}
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
                      className={`flex items-center gap-3.5 p-3 rounded-2xl border-2 transition-all shadow-sm ${
                        badge.earned 
                          ? `${badge.color} border-current/15` 
                          : 'border-border bg-muted/20 opacity-45'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl filter transition-transform duration-300 flex-shrink-0 ${
                        badge.earned 
                          ? 'bg-background/80 shadow-inner scale-110 drop-shadow-md' 
                          : 'bg-muted/50 grayscale'
                      }`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-extrabold truncate ${badge.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {lang === 'id' ? badge.name : badge.nameEn}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">{lang === 'id' ? badge.desc : badge.descEn}</div>
                      </div>
                      <div className="flex-shrink-0">
                        {badge.earned ? (
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <div className="w-4.5 h-4.5 rounded-full border border-border/85 flex items-center justify-center text-[10px] text-muted-foreground/50 bg-background/30">🔒</div>
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
                      idx === 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-amber-950 font-black shadow-[0_0_8px_rgba(245,158,11,0.25)] border border-yellow-200/30' :
                      idx === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 font-black shadow-[0_0_8px_rgba(148,163,184,0.25)] border border-slate-100/30' :
                      idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-amber-50 font-black shadow-[0_0_8px_rgba(180,83,9,0.25)] border border-amber-500/30' :
                      'bg-muted text-muted-foreground font-semibold border border-border/30';

                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 ${
                          entry.isUser 
                            ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(16,185,129,0.08)]' 
                            : 'border-border/60 bg-card/65'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-inner flex-shrink-0 ${placeColor}`}>
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                          </div>
                          <div>
                            <div className={`text-xs ${entry.isUser ? 'font-extrabold text-primary' : 'font-bold text-foreground'}`}>
                              {entry.name} {entry.isUser && <span className="text-[9px] font-normal text-muted-foreground bg-primary/10 px-1.5 py-0.5 rounded-md ml-1">(Kamu)</span>}
                            </div>
                            <div className="text-[10px] text-muted-foreground">{entry.badgeCount} Lencana</div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs font-bold text-foreground bg-background/50 border border-border/60 px-2.5 py-1 rounded-lg">{entry.score} pts</div>
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
          className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl overflow-hidden relative"
        >
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-[0.03] bg-primary blur-2xl pointer-events-none" style={{ transform: 'translate(20%, -20%)' }} />
          
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-border pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Flame className="w-5.5 h-5.5 text-accent animate-pulse" />
                  <h3 className="text-foreground text-base font-extrabold tracking-tight">{tx.challenge}</h3>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-xl">{tx.challengeDesc}</p>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                {/* Challenge Progress Bar */}
                {challengeJoined && (
                  <div className="text-right">
                    <div className="text-[11px] font-extrabold text-foreground">
                      {tx.challengeProgress}: <span className="text-primary font-black">{completedDays.length}/7</span> ({Math.round((completedDays.length / 7) * 100)}%)
                    </div>
                    <div className="w-28 h-2 bg-muted/65 rounded-full overflow-hidden mt-1.5 border border-border/50">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                        style={{ width: `${(completedDays.length / 7) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setChallengeJoined(true)}
                  className={`flex-shrink-0 px-5 py-3 rounded-xl font-extrabold text-xs transition-all active:scale-[0.98] cursor-pointer ${
                    challengeJoined
                      ? 'bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.08)]'
                      : 'bg-accent text-accent-foreground hover:opacity-90 shadow-md shadow-accent/25'
                  }`}
                >
                  {challengeJoined ? '✅ Active' : tx.join}
                </button>
              </div>
            </div>

            {/* Grid Days with Connecting Timeline Track */}
            <div className="relative">
              {/* Timeline line behind items on larger screens */}
              <div className="hidden lg:block absolute top-[30px] left-[5%] right-[5%] h-0.5 bg-gradient-to-r from-emerald-500/10 via-primary/30 to-emerald-500/10 -z-0" />
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4.5 relative z-10">
                {tx.days.map((day, i) => {
                  const isCompleted = completedDays.includes(i);
                  const [dayNum, dayTitle] = day.split(': ');
                  const dayBadge = `D${i + 1}`;
                  
                  return (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -4, scale: 1.01 }}
                      className={`rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden p-4 relative bg-card/65 backdrop-blur-sm ${
                        isCompleted 
                          ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-950/10 to-card shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                          : 'border-border bg-card/45 hover:border-primary/45'
                      }`}
                    >
                      <div>
                        {/* Top Area: Glowing Badge and Checkbox */}
                        <div className="flex justify-between items-center mb-4">
                          {/* Circular Day Badge */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black tracking-wider transition-all duration-300 ${
                            isCompleted
                              ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)] border border-emerald-300/20'
                              : 'bg-muted/70 text-muted-foreground border border-border/80'
                          }`}>
                            {dayBadge}
                          </div>
                          
                          {/* Custom Styled Checkbox wrapper */}
                          <label className="relative flex items-center cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => toggleDayCompleted(i)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                              isCompleted 
                                ? 'border-emerald-500 bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                                : 'border-border/80 bg-background hover:border-primary'
                            }`}>
                              {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                            </div>
                          </label>
                        </div>

                        {/* Title and Icon */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-xl transition-transform duration-300 ${isCompleted ? 'scale-110 filter drop-shadow-md' : 'grayscale opacity-50'}`}>
                              {dayDetails[i].icon}
                            </span>
                            <div className="text-[10px] font-extrabold text-primary/80 uppercase tracking-widest">
                              {dayNum}
                            </div>
                          </div>
                          <div className="text-[11px] font-extrabold text-foreground leading-snug min-h-8">
                            {dayTitle}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                        className={`w-full py-2 rounded-xl border text-[10px] font-bold transition-all duration-300 cursor-pointer ${
                          expandedDay === i
                            ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/15'
                            : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80'
                        }`}
                      >
                        {expandedDay === i ? (lang === 'id' ? 'Tutup Info' : 'Close Info') : (lang === 'id' ? 'Detail Tips' : 'Tips Info')}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Expanded Day Details Panel */}
            <AnimatePresence>
              {expandedDay !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex items-start gap-3.5 overflow-hidden"
                >
                  <div className="text-3xl flex-shrink-0 mt-0.5 filter drop-shadow-md">
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
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5.5 h-5.5 text-primary animate-pulse" />
                  <div>
                    <h4 className="text-foreground text-sm font-extrabold leading-tight">{tx.aiCoachTitle}</h4>
                    <p className="text-muted-foreground text-xs">{tx.aiCoachSub}</p>
                  </div>
                </div>
                
                {completedDays.length > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold shadow-[0_0_8px_rgba(16,185,129,0.05)] animate-pulse">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    AI Coach Active
                  </div>
                )}
              </div>

              {completedDays.length === 0 ? (
                <div className="p-5 rounded-2xl bg-muted/20 border border-border text-center text-xs text-muted-foreground font-semibold">
                  {tx.aiCoachEmpty}
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6 items-stretch">
                  {/* Left Impact Statistics (Neon Progress Meters) */}
                  <div className="md:col-span-1 p-5 rounded-2xl bg-card border border-border/80 flex flex-col justify-between gap-4 text-xs shadow-md">
                    <div className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                      {lang === 'id' ? 'Estimasi Dampak Lingkungan' : 'Estimated Environmental Impact'}
                    </div>
                    
                    {/* CO2 Metric */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-bold text-foreground">
                        <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-purple-400" /> {lang === 'id' ? 'Emisi CO₂ Dikurangi' : 'CO₂ Reduced'}</span>
                        <span>{ecoCoachImpact.co2Saved} / 0.8 kg</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/60 overflow-hidden border border-border/40 relative">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((ecoCoachImpact.co2Saved / 0.8) * 100, 100)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Water Metric */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-bold text-foreground">
                        <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-400" /> {lang === 'id' ? 'Air Bersih Dihemat' : 'Water Conserved'}</span>
                        <span>{ecoCoachImpact.waterSaved} / 50 L</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/60 overflow-hidden border border-border/40 relative">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((ecoCoachImpact.waterSaved / 50) * 100, 100)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Plastic Metric */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-bold text-foreground">
                        <span className="flex items-center gap-1"><Leaf className="w-3.5 h-3.5 text-emerald-400" /> {lang === 'id' ? 'Plastik Dikurangi' : 'Plastic Reduced'}</span>
                        <span>{ecoCoachImpact.plasticSaved} / 0.7 kg</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/60 overflow-hidden border border-border/40 relative">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((ecoCoachImpact.plasticSaved / 0.7) * 100, 100)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Community sharing indicator */}
                    {completedDays.includes(6) && (
                      <div className="mt-1 pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        <span className="flex items-center gap-1">🤝 {lang === 'id' ? 'Aksi Sosial' : 'Social Action'}</span>
                        <span>{lang === 'id' ? 'Saling Berbagi' : 'Sharing Action'}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Coach Analysis Feedback */}
                  <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-card border border-primary/20 shadow-md flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-extrabold text-primary mb-3.5 uppercase tracking-wider">
                        {tx.aiCoachFeedback}
                      </div>
                      <p className="text-xs text-foreground/90 leading-relaxed font-semibold">
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
