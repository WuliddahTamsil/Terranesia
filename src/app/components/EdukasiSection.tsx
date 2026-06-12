import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, CheckCircle, XCircle, ChevronRight, Award, 
  Target, Leaf, Droplets, Wind, Sun, RefreshCw, X, Info, ClipboardCheck,
  GraduationCap, ScrollText, Users, BarChart3, TreePine, Shield, Compass, FileText
} from 'lucide-react';

interface Props { lang: 'id' | 'en' }

const WEAVING = 'https://images.unsplash.com/photo-1661144050353-1d2566cbdf03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80';

const philosophies = [
  {
    icon: Leaf, color: 'text-primary', origin: 'Komunitas Baduy & Suku Kajang',
    originEn: 'Baduy Community & Kajang Tribe',
    title: 'Hidup Sederhana', titleEn: 'Simple Living',
    desc: 'Diwariskan secara turun-temurun oleh komunitas adat Baduy di Banten dan Kajang Ammatoa di Sulawesi Selatan, prinsip ini mengutamakan konsumsi material yang terukur untuk mencegah eksploitasi alam berlebih. Kesederhanaan dihayati bukan sebagai kekurangan, melainkan sebagai sebuah kesadaran etis yang menetapkan batasan tegas antara kebutuhan subsisten dan keinginan konsumtif yang merusak.',
    descEn: 'Passed down through generations by the Baduy community in Banten and the Kajang Ammatoa in South Sulawesi, this principle prioritizes measured material consumption to prevent over-exploitation of nature. Simplicity is embraced not as scarcity, but as an ethical consciousness that establishes clear boundaries between subsistence needs and destructive consumerist desires.',
    quote: '"Lain ti kahayang, tapi ti kaperluan"',
    quoteEn: '"Not from desire, but from necessity"',
  },
  {
    icon: Droplets, color: 'text-primary', origin: 'Sunda Wiwitan & Maluku',
    originEn: 'Sunda Wiwitan & Maluku',
    title: 'Harmoni dengan Alam', titleEn: 'Harmony with Nature',
    desc: 'Melalui pembagian tata ruang adat seperti klasifikasi hutan tutupan (leuweung kolot) pada masyarakat Sunda dan hukum adat sasi di Maluku, leluhur Nusantara menetapkan aturan konservasi ekologis yang ketat. Sistem sasi membatasi eksploitasi hasil laut pada periode tertentu untuk memberi ruang pemulihan bagi keanekaragaman hayati pantai dan laut.',
    descEn: 'Through customary spatial zoning such as protected forest classification (leuweung kolot) in Sundanese society and the customary law of sasi in Maluku, Nusantara ancestors established strict ecological conservation rules. The sasi system restricts marine harvest during specific periods to allow coastal biodiversity to recover.',
    quote: '"Gunung ulah dilebur, lebak ulah dirusak"',
    quoteEn: '"Mountains must not be destroyed, valleys must not be damaged"',
  },
  {
    icon: Wind, color: 'text-primary', origin: 'Masyarakat Adat Baduy',
    originEn: 'Baduy Indigenous Community',
    title: 'Pikukuh (Hukum Adat)', titleEn: 'Pikukuh (Customary Law)',
    desc: 'Pikukuh merupakan kode etik dan hukum adat mutlak yang mengatur seluruh lini kehidupan masyarakat Baduy, termasuk larangan penggunaan semen, kendaraan bermotor, listrik, dan bahan kimia sintetis. Aturan moral ini menjadi tameng ekologis yang berhasil mempertahankan kemurnian ribuan hektar hutan lindung di tengah tekanan urbanisasi modern.',
    descEn: 'Pikukuh is the absolute customary law and code of ethics governing all aspects of Baduy life, including prohibitions on cement, motor vehicles, electricity, and synthetic chemicals. This moral code acts as an ecological shield, successfully preserving thousands of hectares of protected forest amidst modern urbanization pressures.',
    quote: '"Buyut teu meunang dirobah"',
    quoteEn: '"Ancestral heritage must not be changed"',
  },
  {
    icon: Sun, color: 'text-primary', origin: 'Dayak & Jawa',
    originEn: 'Dayak & Javanese Traditions',
    title: 'Rawatan Hidup', titleEn: 'Life Stewardship',
    desc: 'Falsafah pengurusan hidup (life stewardship) tercermin dalam metode perladangan gilir balik masyarakat Dayak di Kalimantan serta tradisi sedekah bumi di Jawa. Alam diposisikan sebagai subjek yang setara, di mana setiap pemanfaatan sumber daya harus diiringi dengan tindakan pemulihan yang berorientasi pada keberlangsungan lintas generasi.',
    descEn: 'The philosophy of life stewardship is reflected in the rotational farming methods of the Dayak communities in Kalimantan and the earth-offering rituals in Java. Nature is positioned as an equal partner, where any resource extraction must be accompanied by restorative actions oriented towards intergenerational sustainability.',
    quote: '"Hirup kudu sing bener, lain sing pinter"',
    quoteEn: '"Life must be righteous, not just clever"',
  },
];

const philosophiesDetail = [
  {
    historyId: 'Komunitas Baduy di Banten dan Kajang Ammatoa di Sulawesi Selatan telah mempraktikkan kesederhanaan materi sebagai pilar spiritual dan sosial selama berabad-abad. Di Baduy, prinsip "Lain ti kahayang, tapi ti kaperluan" tercermin dalam pelarangan akumulasi barang modern. Sementara di Kajang, filosofi "Pasang Ri Kajang" mengajarkan gaya hidup bersahaja (Tallasa Kamase-masea) melalui penggunaan pakaian hitam tenunan sendiri tanpa alas kaki. Studi antropologi menunjukkan bahwa pembatasan sukarela ini berhasil menjaga hutan adat dari eksploitasi komersial.',
    historyEn: 'The Baduy community in Banten and Kajang Ammatoa in South Sulawesi have practiced material simplicity as a spiritual and social pillar for centuries. In Baduy, the principle "Not from desire, but from necessity" is reflected in the prohibition of modern accumulation. Meanwhile, in Kajang, the "Pasang Ri Kajang" philosophy teaches a modest lifestyle (Tallasa Kamase-masea) through hand-woven black attire and barefoot living. Anthropological studies show that this voluntary restriction successfully shields customary forests from commercial exploitation.',
    modernId: 'Dalam konteks krisis lingkungan kontemporer yang dipicu oleh pola konsumsi eksesif, gaya hidup sederhana menawarkan alternatif kritis terhadap budaya konsumerisme global. Pembatasan konsumsi selaras dengan Sustainable Development Goals (SDG 12) mengenai konsumsi dan produksi yang bertanggung jawab. Konsep ini mendorong transisi ke arah ekonomi sirkular dan meminimalisasi jejak karbon individu.',
    modernEn: 'In the context of the contemporary environmental crisis driven by excessive consumption, simple living offers a critical alternative to global consumerism. Restricting consumption aligns with Sustainable Development Goals (SDG 12) on responsible consumption and production. This concept encourages the transition towards a circular economy and minimizes individual carbon footprints.',
    actionId: 'Mulailah dengan mengevaluasi prioritas konsumsi harian melalui prinsip kebutuhan versus keinginan. Kurangi pembelian barang sekali pakai, perpanjang masa pakai produk sandang dan papan yang dimiliki, serta dukung produk lokal berkelanjutan yang diproduksi tanpa merusak tatanan ekologi setempat.',
    actionEn: 'Begin by evaluating daily consumption priorities through the lens of needs versus wants. Reduce purchases of single-use items, extend the lifespan of existing clothing and housing materials, and support sustainable local products produced without damaging the local ecological system.'
  },
  {
    historyId: 'Masyarakat adat Kasepuhan Ciptagelar di Jawa Barat dan Maluku secara konsisten menerapkan hukum adat untuk membatasi pemanfaatan ekosistem. Konsep leuweung titipan (hutan larangan) melarang aktivitas eksploitasi demi menjaga daerah tangkapan air alami. Di Maluku dan Papua, hukum sasi menutup wilayah perairan atau daratan tertentu dari aktivitas pemanenan selama waktu yang ditentukan adat. Mekanisme ini memberikan jeda biologis bagi spesies laut untuk memijah dan memulihkan populasi mereka secara alami.',
    historyEn: 'The indigenous communities of Kasepuhan Ciptagelar in West Java and Maluku consistently apply customary laws to limit ecosystem exploitation. The concept of leuweung titipan (sacred forest) strictly prohibits logging to preserve natural water catchments. In Maluku and Papua, the law of sasi closes off specific marine or terrestrial areas from harvesting for a custom-designated period, allowing a biological window for marine species to spawn and restore their populations naturally.',
    modernId: 'Kearifan lokal ini setara dengan konsep modern tentang "carrying capacity" (daya dukung lingkungan) dan "marine protected areas" (kawasan konservasi perairan). Integrasi hukum adat sasi dengan kebijakan tata kelola laut modern di Maluku terbukti efektif meningkatkan keanekaragaman hayati perikanan dan menahan laju kerusakan terumbu karang akibat penangkapan ikan ilegal.',
    modernEn: 'This local wisdom corresponds to modern concepts of environmental carrying capacity and marine protected areas. The integration of sasi customary law with modern marine governance in Maluku has proven highly effective in boosting fishery biodiversity and halting coral reef degradation caused by illegal fishing.',
    actionId: 'Ikut serta dalam aksi pengurangan limbah plastik yang berpotensi mencemari lautan. Patuhi regulasi mengenai waktu dan zonasi penangkapan biota laut jika Anda berada di kawasan pesisir. Dukung perlindungan kawasan hijau di sekitar tempat tinggal Anda.',
    actionEn: 'Participate in reducing plastic waste that potentially pollutes the ocean. Respect regulations regarding the timing and zoning of marine resource harvesting if you live in coastal areas. Support the preservation of green spaces around your residence.'
  },
  {
    historyId: 'Pikukuh Baduy adalah komitmen adat mutlak untuk mempertahankan keselarasan kosmik tanpa merubah bentang alam asli. Hukum adat ini melarang penggunaan semen, teknologi bermotor, alat komunikasi modern, serta detergen kimia di sungai. Larangan-larangan ini bukan cerminan anti-modernitas, melainkan pertahanan sistematis terhadap integritas ekosistem sungai Ciujung yang mengaliri wilayah Banten Selatan.',
    historyEn: 'Pikukuh Baduy is an absolute customary commitment to maintain cosmic harmony without altering the native landscape. This customary law prohibits cement, motor vehicles, modern communication devices, and chemical detergents in rivers. These restrictions are not a sign of anti-modernism, but a systematic defense of the Ciujung river ecosystem\'s integrity in South Banten.',
    modernId: 'Di tengah laju pembangunan infrastruktur yang seringkali mengabaikan aspek daya dukung lingkungan, Pikukuh membuktikan bahwa kelestarian ekologi hanya dapat dijamin oleh batasan hukum yang tegas. Ketegasan Pikukuh menginspirasi perumusan etika teknologi baru yang mempertanyakan apakah setiap inovasi aman bagi lingkungan hidup.',
    modernEn: 'Amidst infrastructure development that often disregards environmental carrying capacity, Pikukuh proves that ecological sustainability can only be guaranteed by strict boundary regulations. The rigor of Pikukuh inspires the formulation of new technological ethics, questioning whether every innovation is safe for the biosphere.',
    actionId: 'Gunakan produk pembersih rumah tangga yang ramah lingkungan dan bebas dari fosfat berbahaya. Minimalisasi penggunaan kendaraan pribadi dengan beralih ke transportasi publik atau berjalan kaki. Biasakan diri untuk hidup bersandingan dengan alam tanpa ambisi mendominasi.',
    actionEn: 'Use eco-friendly and phosphate-free household cleaning products. Minimize personal vehicle use by switching to public transport or walking. Accustom yourself to living in harmony with nature without the ambition to dominate it.'
  },
  {
    historyId: 'Falsafah rawatan hidup bersandar pada pemahaman bahwa manusia adalah bagian integral dari jaring kehidupan, bukan pemilik mutlak alam raya. Masyarakat Dayak Kenyah di Kalimantan mengoperasikan perladangan gilir balik dengan membiarkan lahan bekas tanam beristirahat (bekan) selama bertahun-tahun hingga kembali menjadi hutan sekunder sebelum ditanami ulang. Di Jawa, tradisi sedekah bumi menjadi ritual simbolis untuk membayar kembali berkah kesuburan tanah kepada alam.',
    historyEn: 'The philosophy of life stewardship rests on the understanding that humans are an integral part of the web of life, not the absolute owners of nature. The Dayak Kenyah of Kalimantan operate rotational agriculture by allowing harvested land to rest (bekan) for years to revert to secondary forest before replanting. In Java, the sedekah bumi ceremony serves as a symbolic ritual to return the soil\'s fertility blessings to nature.',
    modernId: 'Konsep rawatan hidup ini sangat relevan dengan prinsip keadilan antargenerasi (intergenerational equity) dan ekonomi sirkular. Dengan menolak eksploitasi habis-habisan demi keuntungan jangka pendek, kita menjaga agar sumber daya vital seperti air bersih dan tanah subur tetap diwarisi oleh generasi mendatang dalam kondisi baik.',
    modernEn: 'This life stewardship concept is highly relevant to the principles of intergenerational equity and circular economy. By rejecting rapid resource depletion for short-term gain, we ensure that vital resources like clean water and fertile soil are inherited by future generations in a healthy state.',
    actionId: 'Hemat konsumsi energi fosil dan air bersih dalam kegiatan rumah tangga sehari-hari. Lakukan aktivitas pemilahan sampah dari sumbernya dan olah sampah organik menjadi pupuk kompos untuk mengembalikan nutrisi berharga kembali ke dalam tanah.',
    actionEn: 'Conserve fossil energy and clean water in daily household activities. Sort household waste at its source and process organic waste into compost to return valuable nutrients back to the earth.'
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
    descId: 'Hindari penggunaan kantong plastik sekali pakai dengan membawa tas belanja dan botol minum sendiri.',
    descEn: 'Avoid single-use plastic bags by bringing your own shopping bag and water bottle.',
    benefitId: 'Mengurangi sampah plastik yang mencemari tanah dan laut, serta menurunkan permintaan produksi plastik.',
    benefitEn: 'Reduces plastic waste polluting land and sea, and lowers demand for plastic production.',
    impactId: 'Estimasi ~0,5 kg plastik dihindari per hari',
    impactEn: 'Estimated ~0.5 kg plastic avoided per day',
  },
  {
    descId: 'Gunakan transportasi aktif—berjalan kaki atau bersepeda—untuk perjalanan jarak dekat di bawah 2 km.',
    descEn: 'Use active transport—walking or cycling—for short trips under 2 km.',
    benefitId: 'Menurunkan emisi karbon dari kendaraan bermotor dan meningkatkan kesehatan fisik.',
    benefitEn: 'Reduces carbon emissions from motor vehicles and improves physical health.',
    impactId: 'Estimasi ~1,2 kg CO₂ dikurangi per hari',
    impactEn: 'Estimated ~1.2 kg CO₂ reduced per day',
  },
  {
    descId: 'Kelola penggunaan air secara efisien: matikan keran saat tidak digunakan, tampung air bekas cucian untuk menyiram tanaman.',
    descEn: 'Manage water use efficiently: turn off taps when not in use, collect rinse water for watering plants.',
    benefitId: 'Menghemat sumber air bersih yang semakin terbatas akibat perubahan iklim.',
    benefitEn: 'Conserves clean water sources increasingly limited due to climate change.',
    impactId: 'Estimasi ~50 liter air dihemat per hari',
    impactEn: 'Estimated ~50 liters of water saved per day',
  },
  {
    descId: 'Tanam tanaman hijau—pohon, sayur, atau herba—di halaman atau pot di lingkungan tempat tinggal.',
    descEn: 'Plant green vegetation—trees, vegetables, or herbs—in your yard or pots at home.',
    benefitId: 'Meningkatkan kualitas udara, menyerap karbon, dan mendukung keanekaragaman hayati lokal.',
    benefitEn: 'Improves air quality, absorbs carbon, and supports local biodiversity.',
    impactId: 'Estimasi ~0,1 kg CO₂ diserap per tanaman',
    impactEn: 'Estimated ~0.1 kg CO₂ absorbed per plant',
  },
  {
    descId: 'Beli bahan makanan segar dari petani lokal di pasar tradisional terdekat, bukan produk impor atau rantai pasok panjang.',
    descEn: 'Buy fresh produce from local farmers at nearby traditional markets, not imported goods or long supply chains.',
    benefitId: 'Mendukung ekonomi petani lokal dan mengurangi emisi transportasi pangan (food miles).',
    benefitEn: 'Supports local farmers\' economy and reduces food transport emissions (food miles).',
    impactId: 'Estimasi ~0,8 kg CO₂ dari transportasi dihindari',
    impactEn: 'Estimated ~0.8 kg CO₂ from transport avoided',
  },
  {
    descId: 'Pisahkan sampah organik dan anorganik di rumah. Olah sampah organik menjadi kompos.',
    descEn: 'Separate organic and inorganic waste at home. Process organic waste into compost.',
    benefitId: 'Mengurangi beban TPA dan mencegah produksi gas metana dari pembusukan tanpa oksigen.',
    benefitEn: 'Reduces landfill burden and prevents methane production from anaerobic decomposition.',
    impactId: 'Estimasi ~1 kg sampah organik terolah',
    impactEn: 'Estimated ~1 kg organic waste processed',
  },
  {
    descId: 'Bagikan kelebihan makanan atau donasikan barang layak pakai kepada yang membutuhkan di lingkungan sekitar.',
    descEn: 'Share excess food or donate usable items to those in need in your community.',
    benefitId: 'Mengurangi pemborosan sumber daya dan memperkuat solidaritas sosial komunitas.',
    benefitEn: 'Reduces resource waste and strengthens community social solidarity.',
    impactId: '1 aksi berbagi komunitas tercatat',
    impactEn: '1 community sharing action recorded',
  },
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
    sectionLabel: 'Pusat Pembelajaran Budaya',
    title: 'Edukasi Pelestarian',
    sub: 'Jelajahi kearifan Nusantara melalui kajian budaya, evaluasi pemahaman, dan program aksi pelestarian',
    philTitle: 'Nilai-Nilai Kearifan Nusantara',
    philSub: 'Klik setiap nilai untuk membaca kajian budaya lengkap beserta konteks sejarah dan relevansi modernnya',
    quizTitle: 'Evaluasi Pemahaman',
    quizSub: 'Refleksikan pemahaman Anda mengenai budaya Nusantara dan praktik pelestarian lingkungan melalui serangkaian pertanyaan interaktif.',
    start: 'Mulai Evaluasi',
    next: 'Lanjut',
    result: 'Hasil Evaluasi',
    score: 'Tingkat pemahaman',
    restart: 'Ulangi Evaluasi',
    progressTitle: 'Progress Pembelajaran',
    progressSub: 'Rekam jejak perjalanan edukasi Anda',
    badgeTitle: 'Sertifikat Pembelajaran',
    badgeSub: 'Pencapaian edukasi dan rekam jejak pembelajaran',
    challenge: 'Program Aksi Pelestarian',
    challengeDesc: 'Serangkaian langkah sederhana yang dapat diterapkan dalam kehidupan sehari-hari untuk mendukung keberlanjutan lingkungan.',
    join: 'Ikuti Program',
    joinActive: 'Program Aktif',
    days: ['Hari 1: Tanpa Plastik', 'Hari 2: Transportasi Aktif', 'Hari 3: Hemat Air', 'Hari 4: Penghijauan', 'Hari 5: Pangan Lokal', 'Hari 6: Pengelolaan Sampah', 'Hari 7: Berbagi Komunitas'],
    earned: 'Tercapai',
    locked: 'Belum tercapai',
    chooseCategory: 'Pilih Modul Evaluasi',
    catTradition: 'Kearifan Lokal & Tradisi',
    catTraditionDesc: 'Mengukur pemahaman tentang hukum adat, tata ruang sakral, dan nilai-nilai kearifan Nusantara.',
    catEcology: 'Ekologi & Keberlanjutan',
    catEcologyDesc: 'Mengukur pemahaman tentang jejak karbon, pengomposan, dan praktik pelestarian lingkungan.',
    catDaily: 'Evaluasi Harian',
    catDailyDesc: 'Pertanyaan yang diperbarui setiap hari untuk menguji konsistensi pemahaman Anda.',
    attempts: 'Kesempatan',
    failedTitle: 'Evaluasi Belum Lulus',
    failedDesc: 'Anda telah menggunakan seluruh kesempatan menjawab. Pelajari kembali nilai-nilai kearifan di atas, lalu coba evaluasi ini sekali lagi.',
    reviewTitle: 'Tinjau Jawaban',
    yourAnswer: 'Jawaban Anda',
    correctAnswer: 'Jawaban Benar',
    explain: 'Penjelasan',
    readMore: 'Baca Kajian Budaya',
    close: 'Tutup',
    challengeProgress: 'Kemajuan Program',
    challengeProgressDesc: 'Lengkapi seluruh rangkaian aksi untuk mendapatkan sertifikat Kontributor Pelestarian',
    philoDetailTitle: 'Kajian Nilai Kearifan',
    philoTabHistory: 'Konteks Sejarah',
    philoTabModern: 'Relevansi Modern',
    philoTabAction: 'Aplikasi Praktis',
    dailyHighScore: 'Skor Tertinggi',
    bestScore: 'Skor terbaik',
    communityTitle: 'Statistik Partisipasi Komunitas',
    communitySub: 'Agregat partisipasi edukasi dan aksi pelestarian',
    communityActive: 'Peserta aktif',
    communityPhilosophy: 'Nilai paling dipelajari',
    communityChallenge: 'Program paling diikuti',
    communityActions: 'Total aksi pelestarian',
    aiCoachTitle: 'Asisten Analisis Dampak',
    aiCoachSub: 'Analisis berbasis data untuk membantu memahami kontribusi tindakan sehari-hari terhadap pelestarian lingkungan.',
    aiCoachEmpty: 'Selesaikan minimal satu aksi dalam Program Aksi Pelestarian untuk melihat estimasi dampak lingkungan.',
    aiCoachFeedback: 'Ringkasan Dampak',
    impactLabel: 'Estimasi Dampak Lingkungan',
    co2Label: 'Emisi CO₂ dikurangi',
    waterLabel: 'Air bersih dihemat',
    plasticLabel: 'Sampah plastik dihindari',
    communityActionLabel: 'Aksi berbagi komunitas',
    dayBenefit: 'Manfaat Lingkungan',
    dayImpact: 'Estimasi Dampak',
    dayDetail: 'Detail Aksi',
    seeResults: 'Lihat Hasil',
    otherCategory: 'Modul Lain',
    otherQuizzes: 'Pilih Modul Lain',
    origin: 'Asal Budaya',
  },
  en: {
    sectionLabel: 'Cultural Learning Center',
    title: 'Conservation Education',
    sub: 'Explore Nusantara wisdom through cultural studies, comprehension assessments, and preservation action programs',
    philTitle: 'Nusantara Wisdom Values',
    philSub: 'Click each value to read a full cultural study with historical context and modern relevance',
    quizTitle: 'Comprehension Assessment',
    quizSub: 'Reflect on your understanding of Nusantara culture and environmental preservation practices through interactive questions.',
    start: 'Start Assessment',
    next: 'Next',
    result: 'Assessment Result',
    score: 'Comprehension level',
    restart: 'Retry Assessment',
    progressTitle: 'Learning Progress',
    progressSub: 'Your educational journey record',
    badgeTitle: 'Learning Certificates',
    badgeSub: 'Educational achievements and learning milestones',
    challenge: 'Preservation Action Program',
    challengeDesc: 'A series of simple steps applicable in daily life to support environmental sustainability.',
    join: 'Join Program',
    joinActive: 'Program Active',
    days: ['Day 1: Plastic-Free', 'Day 2: Active Transport', 'Day 3: Water Conservation', 'Day 4: Greening', 'Day 5: Local Food', 'Day 6: Waste Management', 'Day 7: Community Sharing'],
    earned: 'Achieved',
    locked: 'Not yet achieved',
    chooseCategory: 'Select Assessment Module',
    catTradition: 'Local Wisdom & Traditions',
    catTraditionDesc: 'Measures understanding of customary law, sacred spaces, and Nusantara wisdom values.',
    catEcology: 'Ecology & Sustainability',
    catEcologyDesc: 'Measures understanding of carbon footprints, composting, and environmental preservation practices.',
    catDaily: 'Daily Assessment',
    catDailyDesc: 'Questions refreshed daily to test the consistency of your understanding.',
    attempts: 'Attempts',
    failedTitle: 'Assessment Not Passed',
    failedDesc: 'You have used all answering attempts. Review the wisdom values above, then try this assessment again.',
    reviewTitle: 'Review Answers',
    yourAnswer: 'Your Answer',
    correctAnswer: 'Correct Answer',
    explain: 'Explanation',
    readMore: 'Read Cultural Study',
    close: 'Close',
    challengeProgress: 'Program Progress',
    challengeProgressDesc: 'Complete all actions to earn the Preservation Contributor certificate',
    philoDetailTitle: 'Wisdom Value Study',
    philoTabHistory: 'Historical Context',
    philoTabModern: 'Modern Relevance',
    philoTabAction: 'Practical Application',
    dailyHighScore: 'Highest Score',
    bestScore: 'Best score',
    communityTitle: 'Community Participation Statistics',
    communitySub: 'Aggregate education participation and preservation actions',
    communityActive: 'Active participants',
    communityPhilosophy: 'Most studied value',
    communityChallenge: 'Most followed program',
    communityActions: 'Total preservation actions',
    aiCoachTitle: 'Impact Analysis Assistant',
    aiCoachSub: 'Data-based analysis to help understand how daily actions contribute to environmental preservation.',
    aiCoachEmpty: 'Complete at least one action in the Preservation Action Program to see environmental impact estimates.',
    aiCoachFeedback: 'Impact Summary',
    impactLabel: 'Environmental Impact Estimate',
    co2Label: 'CO₂ emissions reduced',
    waterLabel: 'Clean water saved',
    plasticLabel: 'Plastic waste avoided',
    communityActionLabel: 'Community sharing actions',
    dayBenefit: 'Environmental Benefit',
    dayImpact: 'Estimated Impact',
    dayDetail: 'Action Details',
    seeResults: 'See Results',
    otherCategory: 'Other Module',
    otherQuizzes: 'Select Other Module',
    origin: 'Cultural Origin',
  },
};

const TraditionalDivider = () => (
  <div className="w-full flex items-center justify-center my-3 opacity-15 text-primary">
    <svg width="80" height="12" viewBox="0 0 80 12" fill="none" className="w-20">
      <path d="M0 6 L8 0 L16 6 L24 0 L32 6 L40 0 L48 6 L56 0 L64 6 L72 0 L80 6 L72 12 L64 6 L56 12 L48 6 L40 12 L32 6 L24 12 L16 6 L8 12 Z" fill="currentColor" />
    </svg>
  </div>
);

const HeritageBorder = () => (
  <div className="h-1.5 w-full bg-gradient-to-r from-primary/10 via-primary/60 to-primary/10" />
);

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

  const learningCertificates = useMemo(() => {
    const scoredTraditionPerfect = quizHighScoreTradition === questionsTradition.length && completedQuizTradition;
    const scoredEcologyPerfect = quizHighScoreEcology === questionsEcology.length && completedQuizEcology;
    const scoredDailyPerfect = quizHighScoreDaily === 4 && completedQuizDaily;
    const scoredThreeOrMore = quizHighScoreTradition >= 3 || quizHighScoreEcology >= 3 || quizHighScoreDaily >= 3;
    const completedAllDays = completedDays.length === 7;

    return [
      {
        id: 'pengkaji',
        Icon: BookOpen,
        name: 'Pengkaji Budaya Dasar',
        nameEn: 'Basic Cultural Scholar',
        desc: 'Menyelesaikan kajian minimal satu nilai kearifan',
        descEn: 'Completed study of at least one wisdom value',
        earned: hasInteractedPhilosophy,
      },
      {
        id: 'pengamat',
        Icon: ScrollText,
        name: 'Pengamat Kearifan Lokal',
        nameEn: 'Local Wisdom Observer',
        desc: 'Mencapai pemahaman memadai pada salah satu modul evaluasi',
        descEn: 'Achieved adequate comprehension on at least one assessment module',
        earned: scoredThreeOrMore,
      },
      {
        id: 'kontributor',
        Icon: Shield,
        name: 'Kontributor Pelestarian',
        nameEn: 'Preservation Contributor',
        desc: 'Menyelesaikan seluruh rangkaian Program Aksi Pelestarian',
        descEn: 'Completed the full Preservation Action Program',
        earned: completedAllDays,
      },
      {
        id: 'penjelajah',
        Icon: Compass,
        name: 'Penjelajah Warisan Nusantara',
        nameEn: 'Nusantara Heritage Explorer',
        desc: 'Mencapai pemahaman sempurna di semua modul evaluasi',
        descEn: 'Achieved perfect comprehension on all assessment modules',
        earned: scoredTraditionPerfect && scoredEcologyPerfect && scoredDailyPerfect,
      },
    ];
  }, [quizHighScoreTradition, quizHighScoreEcology, quizHighScoreDaily, completedQuizTradition, completedQuizEcology, completedQuizDaily, completedDays, hasInteractedPhilosophy]);

  const learningProgress = useMemo(() => {
    const quizzesCompleted = [completedQuizTradition, completedQuizEcology, completedQuizDaily].filter(Boolean).length;
    const certificatesEarned = learningCertificates.filter(c => c.earned).length;
    return {
      philosophyStudied: hasInteractedPhilosophy ? 1 : 0,
      quizzesCompleted,
      challengeDays: completedDays.length,
      certificatesEarned,
    };
  }, [hasInteractedPhilosophy, completedQuizTradition, completedQuizEcology, completedQuizDaily, completedDays, learningCertificates]);

  const communityStats = useMemo(() => {
    const userParticipated = hasInteractedPhilosophy || challengeJoined || completedQuizTradition || completedQuizEcology || completedQuizDaily;
    const baseParticipants = 1247;
    const baseActions = 3892;
    return {
      activeParticipants: baseParticipants + (userParticipated ? 1 : 0),
      mostStudiedPhilosophy: lang === 'id' ? 'Harmoni dengan Alam' : 'Harmony with Nature',
      mostFollowedProgram: lang === 'id' ? 'Program Aksi Pelestarian' : 'Preservation Action Program',
      totalActions: baseActions + completedDays.length,
    };
  }, [hasInteractedPhilosophy, challengeJoined, completedQuizTradition, completedQuizEcology, completedQuizDaily, completedDays, lang]);

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
      setQuizState('done');

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

  const toggleDayCompleted = (index: number) => {
    if (!challengeJoined) {
      setChallengeJoined(true);
    }
    setCompletedDays(prev => {
      const isAlreadyCompleted = prev.includes(index);
      return isAlreadyCompleted ? prev.filter(i => i !== index) : [...prev, index];
    });
  };

  return (
    <section id="edukasi" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative backdrop - subtle earth tone blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.01] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-bold border-b border-primary/30 pb-1 mb-5">
            <GraduationCap className="w-3.5 h-3.5" />
            {tx.sectionLabel}
          </div>
          <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: 'Playfair Display, serif' }}>{tx.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">{tx.sub}</p>
          <TraditionalDivider />
        </motion.div>

        {/* Philosophy Cards Section */}
        <div className="mb-24">
          <h3 className="text-foreground text-center mb-2 text-xl font-bold tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>{tx.philTitle}</h3>
          <p className="text-muted-foreground text-center text-xs mb-12 max-w-xl mx-auto leading-relaxed">{tx.philSub}</p>
          
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
                  whileHover={{ y: -4 }}
                  onClick={() => {
                    setActivePhilosophy(i);
                    setPhilosophyTab('history');
                    if (!hasInteractedPhilosophy) {
                      setHasInteractedPhilosophy(true);
                    }
                  }}
                  className="rounded-none border border-border bg-card p-6 transition-all cursor-pointer hover:shadow-lg hover:border-primary/40 flex flex-col justify-between relative overflow-hidden group min-h-[320px]"
                >
                  {/* Subtle top hover line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/60 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="text-primary/80 transition-transform group-hover:scale-105">
                        <Icon className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <span className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase">
                        {lang === 'id' ? p.origin : p.originEn}
                      </span>
                    </div>
                    
                    <h4 className="text-foreground font-bold text-sm mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {lang === 'id' ? p.title : p.titleEn}
                    </h4>
                    <p className="text-muted-foreground text-[11px] leading-relaxed mb-5 line-clamp-4">
                      {lang === 'id' ? p.desc : p.descEn}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border/40">
                    <blockquote className="text-xs font-serif italic text-primary/85 border-l border-primary/30 pl-3 leading-relaxed mb-4">
                      {lang === 'id' ? p.quote : p.quoteEn}
                    </blockquote>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest group-hover:underline">
                      {tx.readMore} <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Main Dashboard Layout: Quiz + Badges */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {/* Advanced Quiz Module */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-card border border-border rounded-none p-6 md:p-8 shadow-sm flex flex-col justify-between relative"
          >
            <div>
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-primary/80" />
                  <div>
                    <h3 className="text-foreground text-sm font-bold tracking-wide uppercase" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{tx.quizTitle}</h3>
                    <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{tx.quizSub}</p>
                  </div>
                </div>

                {/* Show lives if active */}
                {quizState === 'active' && (
                  <div className="flex items-center gap-2 bg-muted/20 px-3 py-1.5 rounded-none border border-border">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{tx.attempts}:</span>
                    <div className="flex gap-1.5">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i < lives ? 'bg-primary' : 'bg-muted-foreground/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* State: Idle / Choose Category */}
              {quizState === 'idle' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
                  <h4 className="text-xs font-bold text-foreground mb-4 uppercase tracking-wider text-center">{tx.chooseCategory}</h4>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Category 1 */}
                    <div 
                      onClick={() => startQuiz('tradition')}
                      className="p-5 rounded-none border border-border bg-muted/10 hover:border-primary/50 hover:bg-primary/[0.02] cursor-pointer transition-all flex flex-col justify-between min-h-[220px] group"
                    >
                      <div>
                        <div className="text-primary/85 mb-3 group-hover:scale-105 transition-transform">
                          <BookOpen className="w-5 h-5 stroke-[1.5]" />
                        </div>
                        <h5 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">{tx.catTradition}</h5>
                        <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">{tx.catTraditionDesc}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
                        <span className="text-[10px] text-muted-foreground">{tx.bestScore}: <strong className="text-foreground">{quizHighScoreTradition}/4</strong></span>
                        <span className="text-[10px] font-bold text-primary inline-flex items-center gap-0.5 uppercase tracking-widest">{tx.start} <ChevronRight className="w-3 h-3" /></span>
                      </div>
                    </div>

                    {/* Category 2 */}
                    <div 
                      onClick={() => startQuiz('ecology')}
                      className="p-5 rounded-none border border-border bg-muted/10 hover:border-primary/50 hover:bg-primary/[0.02] cursor-pointer transition-all flex flex-col justify-between min-h-[220px] group"
                    >
                      <div>
                        <div className="text-primary/85 mb-3 group-hover:scale-105 transition-transform">
                          <Leaf className="w-5 h-5 stroke-[1.5]" />
                        </div>
                        <h5 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">{tx.catEcology}</h5>
                        <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">{tx.catEcologyDesc}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
                        <span className="text-[10px] text-muted-foreground">{tx.bestScore}: <strong className="text-foreground">{quizHighScoreEcology}/4</strong></span>
                        <span className="text-[10px] font-bold text-primary inline-flex items-center gap-0.5 uppercase tracking-widest">{tx.start} <ChevronRight className="w-3 h-3" /></span>
                      </div>
                    </div>

                    {/* Category 3 */}
                    <div 
                      onClick={() => startQuiz('daily')}
                      className="p-5 rounded-none border border-border bg-muted/10 hover:border-primary/50 hover:bg-primary/[0.02] cursor-pointer transition-all flex flex-col justify-between min-h-[220px] group"
                    >
                      <div>
                        <div className="text-primary/85 mb-3 group-hover:scale-105 transition-transform">
                          <FileText className="w-5 h-5 stroke-[1.5]" />
                        </div>
                        <h5 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">{tx.catDaily}</h5>
                        <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">{tx.catDailyDesc}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
                        <span className="text-[10px] text-muted-foreground">{tx.dailyHighScore}: <strong className="text-foreground">{quizHighScoreDaily}/4</strong></span>
                        <span className="text-[10px] font-bold text-primary inline-flex items-center gap-0.5 uppercase tracking-widest">{tx.start} <ChevronRight className="w-3 h-3" /></span>
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
                    <div className="flex-1 h-1.5 bg-muted overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        animate={{ width: `${((currentQ + 1) / activeQuestions.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground">{currentQ + 1}/{activeQuestions.length}</span>
                  </div>

                  <div className="mb-6 p-5 rounded-none bg-primary/[0.01] border border-border/60">
                    <span className="inline-block px-2.5 py-0.5 rounded-none bg-primary/5 border border-primary/15 text-[9px] font-bold uppercase tracking-widest text-primary mb-3">
                      {quizCategory === 'tradition' ? tx.catTradition : quizCategory === 'ecology' ? tx.catEcology : tx.catDaily}
                    </span>
                    <p className="text-foreground text-sm font-semibold leading-relaxed">{lang === 'id' ? q.q : q.qEn}</p>
                  </div>

                  <div className="grid gap-3 mb-6">
                    {(lang === 'id' ? q.opts : q.optsEn).map((opt, idx) => {
                      let style = 'border-border bg-card text-foreground hover:bg-muted/10 hover:border-primary/40';
                      if (answered) {
                        if (idx === q.correct) {
                          style = 'border-green-600/40 bg-green-500/5 text-green-700 dark:text-green-300';
                        } else if (idx === selected) {
                          style = 'border-red-500/40 bg-red-500/5 text-red-600 dark:text-red-400';
                        } else {
                          style = 'border-border bg-card text-muted-foreground opacity-50';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={answered}
                          onClick={() => handleAnswer(idx)}
                          className={`flex items-center gap-4 p-4 rounded-none border text-left text-xs font-medium transition-all ${style} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                            answered && idx === q.correct ? 'border-green-600 bg-green-600 text-white' :
                            answered && idx === selected ? 'border-red-500 bg-red-500 text-white' :
                            'border-border text-muted-foreground/80'
                          }`}>
                            {answered && idx === q.correct ? <CheckCircle className="w-3 h-3" /> :
                             answered && idx === selected ? <XCircle className="w-3 h-3" /> :
                             String.fromCharCode(65 + idx)}
                          </div>
                          <span className="flex-1 leading-relaxed text-xs">{opt}</span>
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
                        className="mb-6 p-4 rounded-none bg-muted/30 border border-border text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2.5"
                      >
                        <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground uppercase tracking-wider text-[9px] mr-1">{tx.explain}:</strong> {lang === 'id' ? q.explanation : q.explanationEn}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {answered && (
                    <button
                      onClick={handleNext}
                      className="w-full py-3.5 rounded-none bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-md shadow-primary/10 active:scale-[0.99] flex items-center justify-center gap-1.5"
                    >
                      {currentQ < activeQuestions.length - 1 ? tx.next : tx.seeResults} 
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              )}

              {/* State: Quiz Failed */}
              {quizState === 'failed' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-muted/40 border border-border flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-7 h-7 text-muted-foreground/60" />
                  </div>
                  <h3 className="text-foreground font-bold text-base uppercase tracking-wider mb-2">{tx.failedTitle}</h3>
                  <p className="text-muted-foreground text-xs max-w-sm mx-auto mb-6 leading-relaxed">
                    {tx.failedDesc}
                  </p>

                  <div className="flex justify-center gap-3 mb-8">
                    <button 
                      onClick={() => startQuiz(quizCategory)} 
                      className="px-6 py-2.5 rounded-none bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wider hover:opacity-90 shadow-md shadow-primary/10 transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> {tx.restart}
                    </button>
                    <button 
                      onClick={restartQuiz} 
                      className="px-6 py-2.5 rounded-none border border-border text-muted-foreground font-semibold text-xs uppercase tracking-wider hover:bg-muted/30 transition-all"
                    >
                      {tx.otherCategory}
                    </button>
                  </div>

                  {/* Review Answers for failed state */}
                  {userAnswersHistory.length > 0 && (
                    <div className="border-t border-border pt-6 text-left max-w-xl mx-auto">
                      <h4 className="text-xs font-bold text-foreground mb-4 uppercase tracking-wider inline-flex items-center gap-1.5">
                        <ClipboardCheck className="w-4.5 h-4.5 text-primary" /> {tx.reviewTitle}
                      </h4>
                      <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                        {userAnswersHistory.map((history, i) => {
                          const question = activeQuestions[history.qIndex];
                          const selectedOpt = lang === 'id' ? question.opts[history.selected] : question.optsEn[history.selected];
                          const correctOpt = lang === 'id' ? question.opts[question.correct] : question.optsEn[question.correct];
                          
                          return (
                            <div key={i} className="p-4 rounded-none bg-muted/20 border border-border text-xs">
                              <p className="font-bold text-foreground mb-2">{i+1}. {lang === 'id' ? question.q : question.qEn}</p>
                              <div className="space-y-1 mb-2">
                                <p className="text-red-600 dark:text-red-400 flex items-center gap-1"><XCircle className="w-3 h-3" /> {tx.yourAnswer}: <span className="font-semibold">{selectedOpt}</span></p>
                                <p className="text-green-700 dark:text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {tx.correctAnswer}: <span className="font-semibold">{correctOpt}</span></p>
                              </div>
                              <p className="text-muted-foreground leading-relaxed mt-2 border-t border-border/40 pt-2 text-[11px]">
                                {lang === 'id' ? question.explanation : question.explanationEn}
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
                  <div className="w-14 h-14 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <ClipboardCheck className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-foreground mb-2 text-base uppercase tracking-wider font-bold">{tx.result}</h3>
                  <div className="text-5xl font-extrabold text-primary mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {score}/{activeQuestions.length}
                  </div>
                  <p className="text-muted-foreground text-xs mb-4">
                    {tx.score}: <strong className="text-foreground">{Math.round((score / activeQuestions.length) * 100)}%</strong>
                  </p>

                  <div className="w-full h-2 rounded-none bg-muted overflow-hidden mx-auto max-w-xs mb-6 border border-border/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(score / activeQuestions.length) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-primary"
                    />
                  </div>

                  <div className="flex justify-center gap-3 mb-8">
                    <button 
                      onClick={() => startQuiz(quizCategory)} 
                      className="px-5 py-2.5 rounded-none border border-border text-muted-foreground text-xs hover:border-primary hover:text-primary transition-all font-semibold flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> {tx.restart}
                    </button>
                    <button 
                      onClick={restartQuiz} 
                      className="px-5 py-2.5 rounded-none bg-primary text-primary-foreground text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition-all shadow-md shadow-primary/10"
                    >
                      {tx.otherQuizzes}
                    </button>
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
                          <div key={i} className={`p-4 rounded-none border text-xs bg-muted/10 ${isCorrect ? 'border-green-500/25' : 'border-red-400/20'}`}>
                            <p className="font-bold text-foreground mb-2">{i+1}. {lang === 'id' ? question.q : question.qEn}</p>
                            <div className="space-y-1 mb-2">
                              <p className={`flex items-center gap-1 ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {isCorrect ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {tx.yourAnswer}: <span className="font-semibold">{selectedOpt}</span>
                              </p>
                              {!isCorrect && (
                                <p className="text-green-700 dark:text-green-400 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  {tx.correctAnswer}: <span className="font-semibold">{correctOpt}</span>
                                </p>
                              )}
                            </div>
                            <p className="text-muted-foreground leading-relaxed mt-2 border-t border-border/40 pt-2 text-[11px]">
                              {lang === 'id' ? question.explanation : question.explanationEn}
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

          {/* Learning Progress, Certificates & Community Stats Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-none p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-1 border-b border-border pb-4">
                <BarChart3 className="w-5 h-5 text-primary/80" />
                <div>
                  <h3 className="text-foreground text-xs font-bold uppercase tracking-wider">{tx.progressTitle}</h3>
                  <p className="text-muted-foreground text-[10px] mt-0.5 leading-relaxed">{tx.progressSub}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-5">
                {[
                  { label: lang === 'id' ? 'Nilai dipelajari' : 'Values studied', value: `${learningProgress.philosophyStudied}/4` },
                  { label: lang === 'id' ? 'Evaluasi selesai' : 'Assessments done', value: `${learningProgress.quizzesCompleted}/3` },
                  { label: lang === 'id' ? 'Aksi program' : 'Program actions', value: `${learningProgress.challengeDays}/7` },
                  { label: lang === 'id' ? 'Sertifikat' : 'Certificates', value: `${learningProgress.certificatesEarned}/4` },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-none bg-muted/10 border border-border/60">
                    <div className="text-base font-bold text-foreground">{item.value}</div>
                    <div className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-border rounded-none p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-1 border-b border-border pb-4">
                <GraduationCap className="w-5 h-5 text-primary/80" />
                <div>
                  <h3 className="text-foreground text-xs font-bold uppercase tracking-wider">{tx.badgeTitle}</h3>
                  <p className="text-muted-foreground text-[10px] mt-0.5 leading-relaxed">{tx.badgeSub}</p>
                </div>
              </div>
              
              <div className="space-y-4 mt-5">
                {learningCertificates.map(cert => {
                  const CertIcon = cert.Icon;
                  return (
                    <div
                      key={cert.id}
                      className={`flex items-start gap-4 p-4 rounded-none border transition-all ${
                        cert.earned
                          ? 'border-primary/30 bg-primary/[0.01]'
                          : 'border-border/80 bg-muted/5 opacity-60'
                      }`}
                    >
                      {/* Stamp-like round seal representation */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border border-dashed transition-all ${
                        cert.earned ? 'bg-primary/5 border-primary text-primary' : 'bg-muted border-border text-muted-foreground/40'
                      }`}>
                        <CertIcon className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[11px] font-bold text-foreground truncate">{lang === 'id' ? cert.name : cert.nameEn}</span>
                          <span className={`text-[8px] font-mono font-semibold px-1 py-0.5 border leading-none tracking-widest ${
                            cert.earned ? 'text-primary border-primary/20 bg-primary/5' : 'text-muted-foreground/50 border-border bg-muted/20'
                          }`}>
                            {cert.earned ? (lang === 'id' ? 'TERBIT' : 'ISSUED') : (lang === 'id' ? 'TERKUNCI' : 'LOCKED')}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">{lang === 'id' ? cert.desc : cert.descEn}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-none p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-1 border-b border-border pb-4">
                <Users className="w-5 h-5 text-primary/80" />
                <div>
                  <h3 className="text-foreground text-xs font-bold uppercase tracking-wider">{tx.communityTitle}</h3>
                  <p className="text-muted-foreground text-[10px] mt-0.5 leading-relaxed">{tx.communitySub}</p>
                </div>
              </div>
              <div className="space-y-1.5 mt-5">
                {[
                  { label: tx.communityActive, value: communityStats.activeParticipants.toLocaleString() },
                  { label: tx.communityPhilosophy, value: communityStats.mostStudiedPhilosophy },
                  { label: tx.communityChallenge, value: communityStats.mostFollowedProgram },
                  { label: tx.communityActions, value: communityStats.totalActions.toLocaleString() },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-dotted border-border/60 text-xs">
                    <span className="text-[11px] text-muted-foreground">{stat.label}</span>
                    <span className="text-[11px] font-semibold text-foreground text-right max-w-[55%] truncate">{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Interactive Program Aksi Pelestarian & Progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-none p-6 md:p-8 shadow-sm overflow-hidden relative"
        >
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-border pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <TreePine className="w-5 h-5 text-primary/80" />
                  <h3 className="text-foreground text-xs font-bold uppercase tracking-wider">{tx.challenge}</h3>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-xl">{tx.challengeDesc}</p>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                {/* Program Progress Bar */}
                {challengeJoined && (
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-foreground uppercase tracking-wide">
                      {tx.challengeProgress}: <span className="text-primary">{completedDays.length}/7</span> ({Math.round((completedDays.length / 7) * 100)}%)
                    </div>
                    <div className="w-28 h-1.5 bg-muted rounded-none overflow-hidden mt-1.5 border border-border/50">
                      <div 
                        className="h-full bg-primary rounded-none transition-all duration-500" 
                        style={{ width: `${(completedDays.length / 7) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setChallengeJoined(true)}
                  className={`flex-shrink-0 px-5 py-3 rounded-none font-semibold text-xs tracking-wider uppercase transition-all active:scale-[0.98] ${
                    challengeJoined
                      ? 'bg-primary/5 border border-primary/30 text-primary'
                      : 'bg-primary text-primary-foreground hover:opacity-95'
                  }`}
                >
                  {challengeJoined ? tx.joinActive : tx.join}
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
                    className={`rounded-none border transition-all flex flex-col justify-between overflow-hidden p-3.5 ${
                      isCompleted 
                        ? 'border-primary/30 bg-primary/[0.01]' 
                        : 'border-border bg-card hover:border-primary/30'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[9px] font-bold text-primary/70 uppercase tracking-widest">
                          {lang === 'id' ? `Hari ${i + 1}` : `Day ${i + 1}`}
                        </span>
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => toggleDayCompleted(i)}
                          className="w-3.5 h-3.5 rounded-none border-border text-primary focus:ring-primary/40 focus:ring-1 accent-primary cursor-pointer"
                        />
                      </div>
                      <div className="text-[11px] font-semibold text-foreground leading-normal mb-3">
                        {day}
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                      className={`w-full py-1.5 rounded-none border text-[9px] font-bold uppercase tracking-wider transition-all ${
                        expandedDay === i
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border bg-muted/20 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {expandedDay === i ? tx.close : tx.dayDetail}
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
                  className="p-5 rounded-none bg-muted/10 border border-border/60 overflow-hidden"
                >
                  <div className="text-[9px] font-bold text-primary uppercase tracking-widest mb-3 border-b border-border/40 pb-1.5 inline-block">
                    {tx.days[expandedDay]}
                  </div>
                  <p className="text-xs text-foreground leading-relaxed mb-4">
                    {lang === 'id' ? dayDetails[expandedDay].descId : dayDetails[expandedDay].descEn}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-none bg-card border border-border/60">
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{tx.dayBenefit}</div>
                      <p className="text-[11px] text-foreground leading-relaxed">
                        {lang === 'id' ? dayDetails[expandedDay].benefitId : dayDetails[expandedDay].benefitEn}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-none bg-card border border-border/60">
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{tx.dayImpact}</div>
                      <p className="text-[11px] text-foreground leading-relaxed font-semibold">
                        {lang === 'id' ? dayDetails[expandedDay].impactId : dayDetails[expandedDay].impactEn}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Asisten Analisis Dampak Panel */}
            <div className="mt-8 border-t border-border pt-6">
              <div className="flex items-center gap-2.5 mb-4">
                <BarChart3 className="w-5 h-5 text-primary/80" />
                <div>
                  <h4 className="text-foreground text-xs font-bold uppercase tracking-wider leading-tight">{tx.aiCoachTitle}</h4>
                  <p className="text-muted-foreground text-[10px] leading-relaxed mt-0.5">{tx.aiCoachSub}</p>
                </div>
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
                      {tx.impactLabel}
                    </div>
                    
                    {/* CO2 Metric */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-bold text-foreground">
                        <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-purple-400" /> {tx.co2Label}</span>
                        <span>{ecoCoachImpact.co2Saved} / 2.1 kg</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/60 overflow-hidden border border-border/40 relative">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((ecoCoachImpact.co2Saved / 2.1) * 100, 100)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Water Metric */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-bold text-foreground">
                        <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-400" /> {tx.waterLabel}</span>
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
                        <span className="flex items-center gap-1"><Leaf className="w-3.5 h-3.5 text-emerald-400" /> {tx.plasticLabel}</span>
                        <span>{ecoCoachImpact.plasticSaved} / 1.5 kg</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/60 overflow-hidden border border-border/40 relative">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((ecoCoachImpact.plasticSaved / 1.5) * 100, 100)}%` }}
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
                            : 'Incredible! You have completed the entire 7-day challenge sequence. You did not just study the theory of indigenous wisdom, but practiced it directly. This real action shows a deep understanding of Pikukuh (customary law of preservation) in the modern era. You deserve to bear the title of Preservation Ambassador!'
                        ) : (
                          lang === 'id'
                            ? `Hebat! Kamu sudah menyelesaikan ${completedDays.length} misi aksi hijau. Aksi nyata ini langsung berkontribusi mengurangi beban ekologis bumi. Lanjutkan tantangan ini untuk memaksimalkan dampak penyelamatan lingkunganmu!`
                            : `Great! You have completed ${completedDays.length} green action missions. This real action directly contributes to reducing the earth's ecological burden. Continue the challenge to maximize your environmental rescue impact!`
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
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
              className="w-full max-w-xl bg-card border border-border rounded-none overflow-hidden shadow-2xl relative z-10 flex flex-col"
            >
              {/* Top Banner decoration */}
              <HeritageBorder />
              
              {/* Close Button */}
              <button 
                onClick={() => setActivePhilosophy(null)} 
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-5 border-b border-border/40 pb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center text-primary">
                    {(() => {
                      const Icon = philosophies[activePhilosophy].icon;
                      return <Icon className="w-6 h-6 stroke-[1.5]" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-foreground text-base font-bold tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {lang === 'id' ? philosophies[activePhilosophy].title : philosophies[activePhilosophy].titleEn}
                    </h3>
                    <p className="text-muted-foreground text-xs font-serif italic mt-1 leading-relaxed">
                      {lang === 'id' ? philosophies[activePhilosophy].quote : philosophies[activePhilosophy].quoteEn}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-1.5 uppercase tracking-widest font-semibold">
                      {tx.origin}: {lang === 'id' ? philosophies[activePhilosophy].origin : philosophies[activePhilosophy].originEn}
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground text-[11px] leading-relaxed mb-6">
                  {lang === 'id' ? philosophies[activePhilosophy].desc : philosophies[activePhilosophy].descEn}
                </p>

                {/* Exploration Tabs Navigation */}
                <div className="flex border border-border bg-muted/10 p-0.5 rounded-none mb-5">
                  {(['history', 'modern', 'action'] as const).map((tab) => {
                    let label = '';
                    if (tab === 'history') label = tx.philoTabHistory;
                    if (tab === 'modern') label = tx.philoTabModern;
                    if (tab === 'action') label = tx.philoTabAction;
                    
                    return (
                      <button
                        key={tab}
                        onClick={() => setPhilosophyTab(tab)}
                        className={`flex-1 py-2 text-center rounded-none text-[10px] font-bold uppercase tracking-wider transition-all ${
                          philosophyTab === tab
                            ? 'bg-primary text-primary-foreground shadow-sm'
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
                        <h4 className="font-bold text-foreground text-[10px] uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                          <ScrollText className="w-3.5 h-3.5" />
                          {lang === 'id' ? 'Latar Belakang & Akar Budaya' : 'Cultural Roots & History'}
                        </h4>
                        <p className="leading-relaxed text-[11px] text-muted-foreground">{lang === 'id' ? philosophiesDetail[activePhilosophy].historyId : philosophiesDetail[activePhilosophy].historyEn}</p>
                      </motion.div>
                    )}

                    {philosophyTab === 'modern' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-foreground leading-relaxed">
                        <h4 className="font-bold text-foreground text-[10px] uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                          <Leaf className="w-3.5 h-3.5" />
                          {lang === 'id' ? 'Relevansi dalam Konteks Modern' : 'Relevance in Modern Context'}
                        </h4>
                        <p className="leading-relaxed text-[11px] text-muted-foreground">{lang === 'id' ? philosophiesDetail[activePhilosophy].modernId : philosophiesDetail[activePhilosophy].modernEn}</p>
                      </motion.div>
                    )}

                    {philosophyTab === 'action' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-foreground leading-relaxed">
                        <h4 className="font-bold text-foreground text-[10px] uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                          <Target className="w-3.5 h-3.5" />
                          {lang === 'id' ? 'Aplikasi dalam Kehidupan Sehari-hari' : 'Application in Daily Life'}
                        </h4>
                        <p className="bg-muted/10 border border-border/60 p-4 rounded-none leading-relaxed text-[11px] text-muted-foreground">
                          {lang === 'id' ? philosophiesDetail[activePhilosophy].actionId : philosophiesDetail[activePhilosophy].actionEn}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <div className="mt-8 border-t border-border pt-4 flex justify-end">
                    <button 
                      onClick={() => setActivePhilosophy(null)}
                      className="px-5 py-2.5 rounded-none bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase hover:opacity-90 shadow-md shadow-primary/10 transition-all active:scale-[0.98]"
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
