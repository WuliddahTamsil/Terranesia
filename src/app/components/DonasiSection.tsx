import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, QrCode, CheckCircle, ChevronDown, ChevronUp, Users, 
  TreePine, Sparkles, User, Award, Printer, Copy, Check 
} from 'lucide-react';

interface Props { lang: 'id' | 'en' }

const QRIS_PLACEHOLDER = 'https://images.unsplash.com/photo-1558520845-e80332dda30b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80';

// String QRIS Statis default
const DEFAULT_STATIC_QRIS = '00020101021126600015ID.CO.QRIS.WWW0215G102432924197300303UMI5108CC2012215204531153033605802ID5916TERRANESIA DONASI6006JAKARTA61051234562070703A01630453D8';

// Helper untuk menghitung CRC-16 CCITT (False) standar QRIS/EMVCo
function calculateCRC16(str: string): string {
  let crc = 0xFFFF;
  for (let c = 0; c < str.length; c++) {
    const charCode = str.charCodeAt(c);
    crc ^= (charCode << 8);
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Fungsi utama mengubah QRIS Statis menjadi Dinamis dengan Nominal
function generateDynamicQRIS(staticQRIS: string, amount: number): string {
  let qrisWithoutCrc = staticQRIS.trim();
  if (qrisWithoutCrc.endsWith("6304")) {
    qrisWithoutCrc = qrisWithoutCrc.slice(0, -4);
  } else {
    const index6304 = qrisWithoutCrc.lastIndexOf("6304");
    if (index6304 !== -1) {
      qrisWithoutCrc = qrisWithoutCrc.slice(0, index6304);
    }
  }

  const tags: { [key: string]: string } = {};
  let i = 0;
  while (i < qrisWithoutCrc.length) {
    const tag = qrisWithoutCrc.substring(i, i + 2);
    const lenStr = qrisWithoutCrc.substring(i + 2, i + 4);
    const len = parseInt(lenStr, 10);
    const val = qrisWithoutCrc.substring(i + 4, i + 4 + len);
    tags[tag] = val;
    i += 4 + len;
  }

  tags['01'] = '12'; // Ubah ke dinamis
  tags['54'] = amount.toString(); // Set nominal

  let reassembled = '';
  for (const tag of Object.keys(tags).sort()) {
    const val = tags[tag];
    const lenStr = val.length.toString().padStart(2, '0');
    reassembled += tag + lenStr + val;
  }

  reassembled += "6304";
  const newCrc = calculateCRC16(reassembled);

  return reassembled + newCrc;
}

interface DonorMessage {
  id: string;
  name: string;
  amount: number;
  message: string;
  date: string;
  dateEn: string;
}

const seedDonors: DonorMessage[] = [
  { id: '1', name: 'Budi Santoso', amount: 100000, message: 'Semoga kelestarian hutan adat Kanekes tetap terjaga dengan baik. Salam lestari!', date: '3 jam lalu', dateEn: '3 hours ago' },
  { id: '2', name: 'Siti Rahma', amount: 250000, message: 'Mari dukung pendidikan anak-anak suku Bajo agar tetap memegang tradisi kelautan mereka.', date: '6 jam lalu', dateEn: '6 hours ago' },
  { id: '3', name: 'Anonim', amount: 50000, message: 'Aksi kecil untuk melestarikan keindahan tenun ikat Sumba.', date: '1 hari lalu', dateEn: '1 day ago' },
  { id: '4', name: 'Rian Hidayat', amount: 500000, message: 'Senang bisa berkontribusi dalam konservasi rumah adat Mbaru Niang di Wae Rebo.', date: '2 hari lalu', dateEn: '2 days ago' }
];

const t = {
  id: {
    title: 'Donasi untuk Terranesia',
    sub: 'Setiap kontribusi Anda membantu melestarikan budaya dan alam Nusantara untuk generasi mendatang',
    target: 'Target Dana',
    collected: 'Terkumpul',
    donors: 'Donatur',
    days: 'Hari Tersisa',
    amts: ['Rp 20.000', 'Rp 50.000', 'Rp 100.000', 'Rp 250.000', 'Rp 500.000'],
    custom: 'Jumlah Lain',
    qris: 'Bayar dengan QRIS',
    scanQr: 'Scan QR Code di bawah',
    or: 'atau',
    impact: 'Dampak Donasi Anda',
    items: [
      { icon: '📚', title: 'Beasiswa Anak Budaya', desc: 'Rp 50.000 dapat mendukung pendidikan 1 anak selama 1 bulan' },
      { icon: '🌳', title: 'Penanaman Pohon', desc: 'Rp 20.000 dapat menanam 1 pohon di wilayah konservasi budaya' },
      { icon: '🏠', title: 'Renovasi Rumah Adat', desc: 'Rp 500.000 berkontribusi pada renovasi 1 rumah tradisional' },
    ],
    transparency: 'Transparansi Penggunaan Dana',
    fund1: 'Program Pendidikan', p1: 40,
    fund2: 'Pelestarian Lingkungan', p2: 30,
    fund3: 'Pengembangan Platform', p3: 20,
    fund4: 'Operasional', p4: 10,
    donated: 'Donasi Dikirim! Terima kasih atas kontribusi Anda 🌿',
    btnDonate: 'Lanjutkan Pembayaran',
    
    // New translations
    donorNamePlaceholder: 'Nama Anda (misal: Budi Santoso)',
    donorMessagePlaceholder: 'Tulis pesan atau doa pelestarian... (opsional)',
    anonymousCheckbox: 'Kirim sebagai Anonim',
    recentDonors: 'Pesan Dukungan Donatur',
    recentDonorsSub: 'Umpan balik langsung dari para penjaga bumi Nusantara',
    donatedCertTitle: 'SERTIFIKAT PENJAGA BUMI',
    donatedCertSub: 'Terranesia Conservation Program',
    donatedCertText: 'Diberikan kepada donatur atas partisipasi aktif dalam melestarikan warisan adat dan lingkungan alam Nusantara.',
    txId: 'ID Transaksi',
    txDate: 'Tanggal',
    txMethod: 'Metode Pembayaran',
    txTarget: 'Target Dampak',
    txTargetVal: 'Reboisasi & Pendidikan Adat',
    btnPrint: 'Cetak Sertifikat',
    btnCopy: 'Salin ID',
    btnCopied: 'Tersalin!',
    anonymous: 'Anonim',

    // Trip translations
    tabDonate: 'Donasi Digital',
    tabTrip: 'Trip Edukasi Budaya',
    tripSelectTitle: '1. Pilih Paket Ekspedisi Budaya (Trip)',
    tripFormTitle: '2. Detail Keberangkatan & Pendaftaran',
    tripLabelName: 'Nama Peserta Utama',
    tripLabelPhone: 'Kontak WhatsApp / HP',
    tripLabelDate: 'Tanggal Keberangkatan',
    tripLabelQty: 'Jumlah Peserta (Maks 10)',
    tripTotal: 'Total Kontribusi Kontingen',
    btnBook: 'Daftar & Lanjutkan Pembayaran',
    tripTicketTitle: 'TIKET EKSPEDISI BUDAYA',
    tripTicketSub: 'Terranesia Cultural Trip Program',
    tripTicketText: 'Tiket pendaftaran resmi untuk mengikuti perjalanan edukasi, tinggal bersama suku adat, dan mempelajari kelestarian ekologi lokal.',
    ticketId: 'ID Booking',
    ticketDate: 'Tanggal Perjalanan',
    ticketQty: 'Jumlah Peserta',
    ticketStatus: 'Status Tiket',
    ticketStatusVal: 'Lunas & Aktif',
    btnPrintTicket: 'Cetak Tiket Perjalanan',
  },
  en: {
    title: 'Donate for Terranesia',
    sub: 'Every contribution helps preserve Nusantara culture and nature for future generations',
    target: 'Target Fund',
    collected: 'Collected',
    donors: 'Donors',
    days: 'Days Left',
    amts: ['IDR 20,000', 'IDR 50,000', 'IDR 100,000', 'IDR 250,000', 'IDR 500,000'],
    custom: 'Other Amount',
    qris: 'Pay with QRIS',
    scanQr: 'Scan QR Code below',
    or: 'or',
    impact: 'Impact of Your Donation',
    items: [
      { icon: '📚', title: 'Cultural Children Scholarship', desc: 'IDR 50,000 can support 1 child\'s education for 1 month' },
      { icon: '🌳', title: 'Tree Planting', desc: 'IDR 20,000 can plant 1 tree in cultural conservation area' },
      { icon: '🏠', title: 'Traditional House Renovation', desc: 'IDR 500,000 contributes to renovating 1 traditional house' },
    ],
    transparency: 'Fund Usage Transparency',
    fund1: 'Education Program', p1: 40,
    fund2: 'Environmental Preservation', p2: 30,
    fund3: 'Platform Development', p3: 20,
    fund4: 'Operational', p4: 10,
    donated: 'Donation Sent! Thank you for your contribution 🌿',
    btnDonate: 'Proceed to Payment',
    
    // New translations
    donorNamePlaceholder: 'Your Name (e.g., John Doe)',
    donorMessagePlaceholder: 'Write a preservation message or prayer... (optional)',
    anonymousCheckbox: 'Donate anonymously',
    recentDonors: 'Donors Messages of Support',
    recentDonorsSub: 'Live feedback from Nusantara eco-guardians',
    donatedCertTitle: 'ECO-GUARDIAN CERTIFICATE',
    donatedCertSub: 'Terranesia Conservation Program',
    donatedCertText: 'Awarded to the donor for active participation in preserving the customary heritage and natural environment of Nusantara.',
    txId: 'Transaction ID',
    txDate: 'Date',
    txMethod: 'Payment Method',
    txTarget: 'Impact Target',
    txTargetVal: 'Reforestation & Customary Education',
    btnPrint: 'Print Certificate',
    btnCopy: 'Copy ID',
    btnCopied: 'Copied!',
    anonymous: 'Anonymous',

    // Trip translations
    tabDonate: 'Digital Donation',
    tabTrip: 'Cultural Education Trip',
    tripSelectTitle: '1. Select Cultural Expedition Package (Trip)',
    tripFormTitle: '2. Departure Details & Booking',
    tripLabelName: 'Lead Participant Name',
    tripLabelPhone: 'WhatsApp / Mobile Contact',
    tripLabelDate: 'Departure Date',
    tripLabelQty: 'Number of Participants (Max 10)',
    tripTotal: 'Total Expedition Contribution',
    btnBook: 'Register & Proceed to Payment',
    tripTicketTitle: 'CULTURAL EXPEDITION TICKET',
    tripTicketSub: 'Terranesia Cultural Trip Program',
    tripTicketText: 'Official booking ticket for cultural education travel, living with indigenous community, and studying local ecological preservation.',
    ticketId: 'Booking ID',
    ticketDate: 'Departure Date',
    ticketQty: 'Participants',
    ticketStatus: 'Ticket Status',
    ticketStatusVal: 'Paid & Active',
    btnPrintTicket: 'Print Expedition Ticket',
  },
};

const TRIP_PACKAGES = [
  {
    id: 'baduy',
    titleId: 'Ekspedisi Kanekes Baduy Dalam',
    titleEn: 'Kanekes Inner Baduy Expedition',
    durationId: '3 Hari 2 Malam',
    durationEn: '3 Days 2 Nights',
    price: 650000,
    descId: 'Tinggal di rumah panggung Kanekes, belajar Pikukuh adat tanpa listrik/gadget, trekking melintasi hutan adat.',
    descEn: 'Live in Kanekes stilt houses, learn customary Pikukuh without electricity, trekking through custom forests.',
    icon: '⛺',
  },
  {
    id: 'subak',
    titleId: 'Heritage Subak & Rindik Bali',
    titleEn: 'Subak Heritage & Rindik Ubud',
    durationId: '1 Hari Penuh',
    durationEn: '1 Full Day',
    price: 250000,
    descId: 'Ritual pengairan Subak, latihan musik rindik bambu, makan siang masakan organik otentik pedesaan Bali.',
    descEn: 'Subak irrigation ritual, bamboo rindik workshop, organic culinary lunch in authentic Balinese village.',
    icon: '🌾',
  },
  {
    id: 'sasak',
    titleId: 'Kelas Tenun & Sade Lombok',
    titleEn: 'Lombok Sade Hand-Weaving Trip',
    durationId: '2 Hari 1 Malam',
    durationEn: '2 Days 1 Night',
    price: 400000,
    descId: 'Belajar membuat tenun ikat tradisional dengan pewarna alami, tur arsitektur ramah lingkungan desa Sade.',
    descEn: 'Learn traditional hand-weaving with natural dyes, tour eco-friendly Sasak houses in Sade village.',
    icon: '🧣',
  },
];

const targetAmtRaw = 50000000; // Rp 50 Juta
const daysLeft = 28;

export function DonasiSection({ lang }: Props) {
  // --- Persistent States from LocalStorage ---
  const [collectedAmount, setCollectedAmount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ecotwin_donasi_collected');
      return saved ? parseInt(saved, 10) : 36400000;
    } catch { return 36400000; }
  });

  const [donorCount, setDonorCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ecotwin_donasi_count');
      return saved ? parseInt(saved, 10) : 1247;
    } catch { return 1247; }
  });

  const [donorsList, setDonorsList] = useState<DonorMessage[]>(() => {
    try {
      const saved = localStorage.getItem('ecotwin_donasi_list');
      return saved ? JSON.parse(saved) : seedDonors;
    } catch { return seedDonors; }
  });

  // --- Form & Flow States ---
  const [selectedAmt, setSelectedAmt] = useState<number | null>(1);
  const [customAmt, setCustomAmt] = useState<string>('');
  const [showQris, setShowQris] = useState(false);
  const [donated, setDonated] = useState(false);
  const [showTransparency, setShowTransparency] = useState(false);
  
  // New input states
  const [donorName, setDonorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorMessageText, setDonorMessageText] = useState('');

  // Generated receipt states
  const [receiptTxId, setReceiptTxId] = useState('');
  const [receiptDate, setReceiptDate] = useState('');
  const [receiptName, setReceiptName] = useState('');
  const [receiptAmount, setReceiptAmount] = useState(0);

  const [copied, setCopied] = useState(false);

  // Tab control
  const [activeTab, setActiveTab] = useState<'donation' | 'trip'>('donation');

  // Trip selection and form states
  const [selectedTripIndex, setSelectedTripIndex] = useState(0);
  const [leadName, setLeadName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [participantsCount, setParticipantsCount] = useState(1);

  // Successful booking states
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTotal, setBookingTotal] = useState(0);
  
  const tx = t[lang];

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('ecotwin_donasi_collected', collectedAmount.toString());
  }, [collectedAmount]);

  useEffect(() => {
    localStorage.setItem('ecotwin_donasi_count', donorCount.toString());
  }, [donorCount]);

  useEffect(() => {
    localStorage.setItem('ecotwin_donasi_list', JSON.stringify(donorsList));
  }, [donorsList]);

  // Compute stats
  const progressPct = useMemo(() => {
    return Math.min(100, Math.round((collectedAmount / targetAmtRaw) * 100));
  }, [collectedAmount]);

  const totalCollectedFormatted = useMemo(() => {
    if (lang === 'id') {
      return `Rp ${(collectedAmount / 1000000).toFixed(2)} Juta`;
    }
    return `IDR ${(collectedAmount / 1000000).toFixed(2)} Million`;
  }, [collectedAmount, lang]);

  const targetAmtFormatted = useMemo(() => {
    return lang === 'id' ? 'Rp 50 Juta' : 'IDR 50 Million';
  }, [lang]);

  const getPaymentAmount = () => {
    if (activeTab === 'trip') {
      return TRIP_PACKAGES[selectedTripIndex].price * participantsCount;
    }
    const presetAmounts = [20000, 50000, 100000, 250000, 500000];
    if (selectedAmt !== null) {
      return presetAmounts[selectedAmt];
    }
    const val = parseInt(customAmt, 10);
    return isNaN(val) ? 0 : val;
  };

  const handleProceedPayment = () => {
    if (activeTab === 'donation') {
      const amount = getPaymentAmount();
      if (amount <= 0) {
        alert(lang === 'id' ? 'Silakan pilih atau masukkan nominal donasi terlebih dahulu.' : 'Please select or enter a donation amount first.');
        return;
      }
    } else {
      if (!leadName.trim()) {
        alert(lang === 'id' ? 'Silakan masukkan nama peserta utama.' : 'Please enter the lead participant name.');
        return;
      }
      if (!contactPhone.trim()) {
        alert(lang === 'id' ? 'Silakan masukkan kontak WhatsApp / HP.' : 'Please enter the WhatsApp / mobile contact.');
        return;
      }
      if (!departureDate) {
        alert(lang === 'id' ? 'Silakan pilih tanggal keberangkatan.' : 'Please select a departure date.');
        return;
      }
      if (participantsCount <= 0 || participantsCount > 10) {
        alert(lang === 'id' ? 'Jumlah peserta harus antara 1 dan 10.' : 'Number of participants must be between 1 and 10.');
        return;
      }
    }
    setShowQris(true);
  };

  const confirmPayment = () => {
    const amount = getPaymentAmount();
    
    if (activeTab === 'trip') {
      setBookingId(`EXP-${TRIP_PACKAGES[selectedTripIndex].id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`);
      const dateObj = new Date();
      const formattedDate = dateObj.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      setBookingDate(formattedDate);
      setBookingTotal(amount);
      
      setShowQris(false);
      setIsBookingSuccess(true);
      
      setCollectedAmount(prev => prev + amount);
      setDonorCount(prev => prev + 1);
      
      setLeadName('');
      setContactPhone('');
      setDepartureDate('');
      setParticipantsCount(1);
      return;
    }

    const finalName = isAnonymous || !donorName.trim() ? tx.anonymous : donorName.trim();
    const finalMessage = donorMessageText.trim() || (lang === 'id' ? 'Mendukung kelestarian Nusantara! 🌿' : 'Supporting Nusantara preservation! 🌿');
    
    // 1. Add to donors list
    const newDonor: DonorMessage = {
      id: Date.now().toString(),
      name: finalName,
      amount: amount,
      message: finalMessage,
      date: lang === 'id' ? 'Baru saja' : 'Just now',
      dateEn: 'Just now'
    };
    
    setDonorsList(prev => [newDonor, ...prev]);
    
    // 2. Update collected amount & donor count
    setCollectedAmount(prev => prev + amount);
    setDonorCount(prev => prev + 1);

    // 3. Generate receipt details
    setReceiptTxId(`TX-2026-${Math.floor(100000 + Math.random() * 900000)}`);
    const dateObj = new Date();
    const formattedDate = dateObj.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    setReceiptDate(formattedDate);
    setReceiptName(finalName);
    setReceiptAmount(amount);

    // 4. Update states to show receipt
    setShowQris(false);
    setDonated(true);
    
    // 5. Reset inputs
    setDonorName('');
    setIsAnonymous(false);
    setDonorMessageText('');
    setSelectedAmt(1);
    setCustomAmt('');
  };

  const handleCopyTx = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const targetId = activeTab === 'trip' ? 'trip-ticket-card' : 'donasi-sertifikat-card';
    const certElement = document.getElementById(targetId);
    if (!certElement) {
      window.print();
      return;
    }

    // Create a container for printing
    const printContainer = document.createElement('div');
    printContainer.id = 'certificate-print-root';
    
    // Clone the certificate node
    const clone = certElement.cloneNode(true) as HTMLElement;
    
    printContainer.appendChild(clone);
    document.body.appendChild(printContainer);

    window.print();

    // Clean up after the print dialog is closed
    document.body.removeChild(printContainer);
  };

  const funds = [
    { label: tx.fund1, pct: tx.p1, color: 'bg-primary' },
    { label: tx.fund2, pct: tx.p2, color: 'bg-emerald-400' },
    { label: tx.fund3, pct: tx.p3, color: 'bg-accent' },
    { label: tx.fund4, pct: tx.p4, color: 'bg-purple-400' },
  ];

  return (
    <section id="donasi" className="py-20 bg-muted/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <Heart className="w-4 h-4" />
            {lang === 'id' ? 'Dukung Pelestarian' : 'Support Preservation'}
          </div>
          <h2 className="text-foreground mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{tx.title}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">{tx.sub}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left Side: Stats, Transparency & Live Donors Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Progress Card */}
            <div className="rounded-3xl p-6 border border-border/80 bg-gradient-to-br from-card/85 to-card/45 backdrop-blur-md transition-all duration-300 hover:border-primary/45 shadow-[0_0_15px_rgba(45,106,79,0.02)]">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <div className="text-2xl font-black text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>{totalCollectedFormatted}</div>
                  <div className="text-xs text-muted-foreground font-semibold">{tx.collected} dari {targetAmtFormatted}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>{progressPct}%</div>
                  <div className="text-xs text-muted-foreground font-semibold">{tx.target}</div>
                </div>
              </div>
              <div className="h-3 rounded-full bg-muted/60 overflow-hidden mb-5 border border-border/40 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full rounded-full shadow-[0_0_10px_rgba(45,106,79,0.35)]"
                  style={{ background: 'linear-gradient(90deg, #2D6A4F, #52B788)' }}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3.5 text-center">
                {[
                  { value: donorCount.toLocaleString(), label: tx.donors, icon: Users, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
                  { value: targetAmtFormatted, label: tx.target, icon: Sparkles, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
                  { value: `${daysLeft}`, label: tx.days, icon: TreePine, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
                ].map(({ value, label, icon: Icon, color }) => (
                  <motion.div 
                    key={label}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="p-3.5 rounded-2xl bg-muted/20 border border-border/50 transition-all duration-300 hover:shadow-md hover:border-primary/30 cursor-default flex flex-col justify-between"
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2 border ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-foreground">{value}</div>
                      <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">{label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Live Donors Support Feed */}
            <div className="rounded-3xl p-6 border border-border/80 bg-gradient-to-br from-card/85 to-card/45 backdrop-blur-md transition-all duration-300 hover:border-primary/45 shadow-[0_0_15px_rgba(45,106,79,0.02)]">
              <div className="border-b border-border pb-3 mb-4">
                <h3 className="text-foreground text-sm font-extrabold flex items-center gap-1.5">
                  <Users className="w-4.5 h-4.5 text-primary" />
                  {tx.recentDonors}
                </h3>
                <p className="text-muted-foreground text-[10px] font-semibold">{tx.recentDonorsSub}</p>
              </div>

              <div className="max-h-[280px] overflow-y-auto pr-1 space-y-3 scrollbar-custom-donasi">
                {donorsList.map((donor) => (
                  <motion.div
                    key={donor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ x: 3 }}
                    className="p-3.5 rounded-2xl bg-muted/15 border border-border/40 hover:border-primary/30 transition-all duration-300 flex items-start gap-3.5 shadow-sm"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 text-primary flex items-center justify-center flex-shrink-0 text-xs font-black shadow-inner">
                      {donor.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-xs text-foreground font-extrabold truncate">{donor.name}</strong>
                        <span className="text-[10px] text-primary font-extrabold bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                          {lang === 'id' ? `Rp ${donor.amount.toLocaleString('id-ID')}` : `IDR ${donor.amount.toLocaleString('en-US')}`}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed italic mt-1.5 font-medium">"{donor.message}"</p>
                      <span className="text-[9px] text-muted-foreground/60 block mt-2 font-mono font-medium">
                        🕒 {lang === 'id' ? donor.date : donor.dateEn}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Transparency Panel */}
            <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card/85 to-card/45 backdrop-blur-md transition-all duration-300 hover:border-primary/45 shadow-[0_0_15px_rgba(45,106,79,0.02)] overflow-hidden">
              <button
                onClick={() => setShowTransparency(!showTransparency)}
                className="w-full flex items-center justify-between p-5 hover:bg-primary/5 transition-colors font-bold text-foreground text-xs uppercase tracking-wider"
              >
                <span>{tx.transparency}</span>
                {showTransparency ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              <AnimatePresence>
                {showTransparency && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-3.5">
                      {funds.map((f, idx) => {
                        const glows = [
                          'bg-primary shadow-[0_0_8px_rgba(45,106,79,0.4)]',
                          'bg-emerald-400 shadow-[0_0_8px_rgba(52,183,136,0.4)]',
                          'bg-accent shadow-[0_0_8px_rgba(244,162,97,0.4)]',
                          'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.4)]'
                        ];
                        const glowClass = glows[idx % glows.length];
                        
                        return (
                          <div key={f.label} className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-bold text-foreground">
                              <span className="text-muted-foreground">{f.label}</span>
                              <span>{f.pct}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted/60 overflow-hidden border border-border/40 relative">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${f.pct}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className={`h-full rounded-full ${glowClass}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Side: Donation Form / QRIS Scan / Receipt Generator */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-6 md:p-8 border border-border/80 bg-gradient-to-br from-card/85 to-card/45 backdrop-blur-md transition-all duration-300 hover:border-primary/45 shadow-[0_0_15px_rgba(45,106,79,0.02)] print:border-none print:shadow-none print:bg-white"
          >
            {/* Case 1: Donation Success Receipt (Sertifikat & Kuitansi) */}
            {donated ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-4 print:p-0"
              >
                {/* Certificate Frame */}
                <div 
                  id="donasi-sertifikat-card" 
                  className="border-6 border-double border-primary/50 rounded-2xl p-8 bg-[#FAF8F5] text-[#1C2B1A] text-center relative overflow-hidden shadow-inner print:border-green-800"
                >
                  {/* Subtle Stamp vector/icon in background */}
                  <Award className="w-28 h-28 text-primary/5 absolute -right-6 -bottom-6 rotate-12 pointer-events-none" />
                  
                  <Award className="w-12 h-12 text-[#2D6A4F] mx-auto mb-4" />
                  <h4 className="text-[#1C2B1A] text-base font-black tracking-widest uppercase mb-1">{tx.donatedCertTitle}</h4>
                  <p className="text-[#2D6A4F] text-[10px] font-bold uppercase tracking-widest mb-4 border-b border-[#2D6A4F]/20 pb-2.5">{tx.donatedCertSub}</p>
                  
                  <p className="text-[#4A5568] text-xs leading-relaxed max-w-sm mx-auto mb-5 font-medium">
                    {tx.donatedCertText}
                  </p>

                  <div className="text-sm font-black text-[#1C2B1A] mb-1 uppercase tracking-widest">
                    {receiptName}
                  </div>
                  <div className="text-xl font-black text-[#2D6A4F]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {lang === 'id' ? `Rp ${receiptAmount.toLocaleString('id-ID')}` : `IDR ${receiptAmount.toLocaleString('en-US')}`}
                  </div>
                </div>

                {/* Struk / Invoice Details */}
                <div className="mt-6 border border-border/60 rounded-2xl p-5 bg-muted/20 space-y-3.5 text-xs text-left shadow-inner">
                  <div className="flex justify-between items-center border-b border-border/60 pb-2.5">
                    <span className="text-muted-foreground">{tx.txId}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-foreground">{receiptTxId}</span>
                      <button 
                        onClick={() => handleCopyTx(receiptTxId)}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title={tx.btnCopy}
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{tx.txDate}</span>
                    <span className="font-semibold text-foreground">{receiptDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{tx.txMethod}</span>
                    <span className="font-semibold text-foreground">QRIS Dinamis</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{tx.txTarget}</span>
                    <span className="font-semibold text-primary">{tx.txTargetVal}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="flex-1 py-3.5 rounded-xl font-bold text-xs border border-border hover:bg-muted text-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    {tx.btnPrint}
                  </button>
                  
                  <button
                    onClick={() => setDonated(false)}
                    className="flex-1 py-3.5 rounded-xl font-bold text-xs bg-primary text-white hover:opacity-95 shadow-md shadow-primary/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    {lang === 'id' ? 'Donasi Lagi' : 'Donate Again'}
                  </button>
                </div>
              </motion.div>
            ) : isBookingSuccess ? (
              // Case 1b: Trip Booking Success Ticket (Tiket Ekspedisi Budaya)
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-4 print:p-0"
              >
                {/* Ticket Frame */}
                <div 
                  id="trip-ticket-card" 
                  className="border-6 border-double border-primary/50 rounded-2xl p-8 bg-[#FAF8F5] text-[#1C2B1A] text-left relative overflow-hidden shadow-inner print:border-green-800 print:bg-[#FAF8F5]"
                >
                  {/* Subtle TreePine vector/icon in background */}
                  <TreePine className="w-32 h-32 text-primary/5 absolute -right-6 -bottom-6 rotate-12 pointer-events-none" />
                  
                  <div className="flex justify-between items-start border-b-2 border-dashed border-primary/30 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-[#2D6A4F] mb-1">
                        <TreePine className="w-6 h-6" />
                        <span className="text-xs font-black uppercase tracking-widest">{tx.tripTicketTitle}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-semibold">{tx.tripTicketSub}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-widest">{tx.ticketStatus}</span>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-100 border border-emerald-300/50 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                        {tx.ticketStatusVal}
                      </span>
                    </div>
                  </div>

                  <p className="text-[#4A5568] text-[11px] leading-relaxed mb-5 font-medium">
                    {tx.tripTicketText}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-5 p-4 rounded-xl bg-primary/5 border border-primary/15">
                    <div>
                      <span className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-widest block">{lang === 'id' ? 'Destinasi Ekspedisi' : 'Expedition Destination'}</span>
                      <span className="text-xs font-black text-foreground">
                        {lang === 'id' ? TRIP_PACKAGES[selectedTripIndex].titleId : TRIP_PACKAGES[selectedTripIndex].titleEn}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-widest block">{tx.ticketId}</span>
                      <span className="text-xs font-mono font-black text-primary">{bookingId}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-widest block">{tx.ticketDate}</span>
                      <span className="text-xs font-black text-foreground">
                        {departureDate ? new Date(departureDate).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-widest block">{tx.ticketQty}</span>
                      <span className="text-xs font-black text-foreground">{participantsCount} Pax</span>
                    </div>
                  </div>

                  {/* Booking Date & Total Paid */}
                  <div className="flex justify-between items-center text-xs border-b border-border/40 pb-3 mb-3.5">
                    <span className="text-muted-foreground">{tx.txDate}: <strong className="text-foreground font-bold">{bookingDate}</strong></span>
                    <span className="font-extrabold text-[#2D6A4F]">
                      Total: {lang === 'id' ? `Rp ${bookingTotal.toLocaleString('id-ID')}` : `IDR ${bookingTotal.toLocaleString('en-US')}`}
                    </span>
                  </div>

                  {/* Travel Instructions */}
                  <div className="text-[10px] text-muted-foreground leading-relaxed font-medium bg-muted/30 p-3 rounded-lg border border-border/30">
                    <strong className="text-foreground block mb-1">
                      {lang === 'id' ? '📌 Persiapan & Informasi Penting:' : '📌 Expedition Instructions & Guidelines:'}
                    </strong>
                    {lang === 'id' ? (
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>Bawa identitas diri (KTP/Passport) dan pakaian sopan serta nyaman.</li>
                        <li>Pastikan kondisi fisik prima untuk trekking di kawasan adat.</li>
                        <li>Patuhi aturan setempat (tidak menggunakan sabun/gadget di Baduy Dalam, dll).</li>
                        <li>Tim Terranesia akan menghubungi Anda via WhatsApp/Telepon untuk koordinasi logistik.</li>
                      </ul>
                    ) : (
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>Bring valid ID/Passport and comfortable, respectful clothing.</li>
                        <li>Ensure good physical health for trekking in traditional custom lands.</li>
                        <li>Respect local rules (no soap/shampoo or gadgets allowed in Inner Baduy, etc.).</li>
                        <li>Terranesia coordinator will contact you via WhatsApp for logistics and pickup.</li>
                      </ul>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="flex-1 py-3.5 rounded-xl font-bold text-xs border border-border hover:bg-muted text-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    {tx.btnPrintTicket}
                  </button>
                  
                  <button
                    onClick={() => setIsBookingSuccess(false)}
                    className="flex-1 py-3.5 rounded-xl font-bold text-xs bg-primary text-white hover:opacity-95 shadow-md shadow-primary/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <TreePine className="w-4 h-4 text-white" />
                    {lang === 'id' ? 'Daftar Trip Lain' : 'Book Another Trip'}
                  </button>
                </div>
              </motion.div>
            ) : showQris ? (
              // Case 2: QRIS Dynamic Payment Screen
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4"
              >
                <QrCode className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-foreground font-semibold mb-1">{tx.scanQr}</p>
                <div className="text-xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Rp {getPaymentAmount().toLocaleString('id-ID')}
                </div>
                <div className="relative inline-block mb-4">
                  <div className="w-52 h-52 mx-auto rounded-2xl bg-white p-3 border-2 border-primary/20 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(45,106,79,0.08)]">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                        generateDynamicQRIS(DEFAULT_STATIC_QRIS, getPaymentAmount())
                      )}`}
                      alt="QRIS Dinamis"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                
                <div className="space-y-3 max-w-[240px] mx-auto mb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmPayment}
                    className="w-full py-3.5 rounded-xl font-bold text-xs bg-primary text-white hover:opacity-95 transition-all shadow-md active:scale-95 cursor-pointer shadow-primary/10"
                  >
                    {lang === 'id' ? 'Saya Sudah Membayar' : 'I Have Paid'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowQris(false)}
                    className="w-full py-2.5 rounded-xl text-[11px] font-bold text-muted-foreground hover:text-foreground transition-all hover:bg-muted active:scale-95 cursor-pointer"
                  >
                    {lang === 'id' ? 'Kembali / Batal' : 'Go Back / Cancel'}
                  </motion.button>
                </div>

                <div className="mt-4">
                  <div className="w-48 h-1 mx-auto rounded-full bg-muted overflow-hidden">
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="w-1/2 h-full bg-primary rounded-full"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2.5 max-w-[280px] mx-auto leading-relaxed">
                    {lang === 'id' 
                      ? 'Scan menggunakan GoPay, OVO, ShopeePay, Dana, LinkAja, atau Mobile Banking' 
                      : 'Scan using GoPay, OVO, ShopeePay, Dana, LinkAja, or Mobile Banking'}
                  </p>
                </div>
              </motion.div>
            ) : (
              // Case 3: Tabs Form (Donation vs Trip Booking)
              <>
                {/* Tab Selector */}
                <div className="flex p-1 rounded-2xl bg-muted/60 border border-border/40 backdrop-blur-md mb-6">
                  <button
                    onClick={() => setActiveTab('donation')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === 'donation'
                        ? 'bg-card text-primary shadow-sm border border-border/20'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${activeTab === 'donation' ? 'fill-primary text-primary' : ''}`} />
                    {tx.tabDonate}
                  </button>
                  <button
                    onClick={() => setActiveTab('trip')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === 'trip'
                        ? 'bg-card text-primary shadow-sm border border-border/20'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <TreePine className="w-4 h-4" />
                    {tx.tabTrip}
                  </button>
                </div>

                {activeTab === 'donation' ? (
                  /* Donation Form View */
                  <>
                    <h3 className="text-foreground text-sm font-bold mb-4">{lang === 'id' ? '1. Pilih Nominal Donasi' : '1. Select Donation Amount'}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
                      {tx.amts.map((amt, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedAmt(i)}
                          className={`py-3.5 rounded-xl border-2 border-dashed text-xs font-extrabold transition-all duration-300 cursor-pointer ${
                            selectedAmt === i
                              ? 'border-primary bg-primary/10 text-primary shadow-[0_0_12px_rgba(45,106,79,0.25)] border-solid scale-[1.02]'
                              : 'border-border/60 bg-card/40 text-muted-foreground hover:border-primary/45 hover:text-primary hover:bg-primary/5 hover:border-solid'
                          }`}
                        >
                          {amt}
                        </motion.button>
                      ))}
                      <motion.button
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedAmt(null)}
                        className={`py-3.5 rounded-xl border-2 border-dashed text-xs font-extrabold transition-all col-span-2 sm:col-span-1 duration-300 cursor-pointer ${
                          selectedAmt === null
                            ? 'border-accent bg-accent/10 text-accent-foreground shadow-[0_0_12px_rgba(244,162,97,0.25)] border-solid scale-[1.02]'
                            : 'border-border/60 bg-card/40 text-muted-foreground hover:border-accent/45 hover:text-accent-foreground hover:bg-accent/5 hover:border-solid'
                        }`}
                      >
                        {tx.custom}
                      </motion.button>
                    </div>

                    {selectedAmt === null && (
                      <div className="mb-5">
                        <input
                          type="number"
                          value={customAmt}
                          onChange={(e) => setCustomAmt(e.target.value)}
                          placeholder={lang === 'id' ? 'Masukkan jumlah (Rp)' : 'Enter amount (IDR)'}
                          className="w-full px-4 py-3.5 rounded-xl bg-muted border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 font-semibold shadow-inner"
                        />
                      </div>
                    )}

                    <div className="border-t border-border pt-5 space-y-4">
                      <h3 className="text-foreground text-sm font-bold">{lang === 'id' ? '2. Detail Donatur' : '2. Donor Details'}</h3>
                      
                      {/* Name Input */}
                      <div>
                        <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5">{lang === 'id' ? 'Nama Donatur' : 'Donor Name'}</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/60"><User className="w-4 h-4" /></span>
                          <input
                            type="text"
                            disabled={isAnonymous}
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                            placeholder={tx.donorNamePlaceholder}
                            className={`w-full pl-10 pr-4 py-3.5 rounded-xl bg-muted border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 font-semibold shadow-inner ${isAnonymous ? 'opacity-40 select-none' : ''}`}
                          />
                        </div>
                      </div>

                      {/* Anonymous Checkbox */}
                      <div className="flex items-center gap-2.5">
                        <label className="relative flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            id="anonymous"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                            isAnonymous 
                              ? 'border-primary bg-primary text-white shadow-[0_0_8px_rgba(45,106,79,0.3)]' 
                              : 'border-border/80 bg-background hover:border-primary'
                          }`}>
                            {isAnonymous && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                          </div>
                        </label>
                        <label htmlFor="anonymous" className="text-xs font-bold text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors">
                          {tx.anonymousCheckbox}
                        </label>
                      </div>

                      {/* Message Input */}
                      <div>
                        <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5">{lang === 'id' ? 'Pesan Dukungan' : 'Support Message'}</label>
                        <textarea
                          value={donorMessageText}
                          onChange={(e) => setDonorMessageText(e.target.value.substring(0, 180))}
                          placeholder={tx.donorMessagePlaceholder}
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl bg-muted border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 resize-none font-semibold shadow-inner"
                        />
                        <span className="text-[9px] text-muted-foreground/70 block text-right mt-1 font-mono font-medium">
                          {donorMessageText.length}/180
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-5 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleProceedPayment}
                        className="w-full py-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_8px_20px_rgba(45,106,79,0.25)] hover:shadow-[0_8px_24px_rgba(45,106,79,0.4)]"
                        style={{ background: 'linear-gradient(135deg, #2D6A4F, #52B788)', color: '#fff' }}
                      >
                        <QrCode className="w-4.5 h-4.5" />
                        {tx.btnDonate}
                      </motion.button>
                      <div className="mt-3.5 flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        {lang === 'id' ? 'Aman & Terenkripsi • Transparansi 100%' : 'Secure & Encrypted • 100% Transparent'}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Trip Booking Form View */
                  <>
                    <h3 className="text-foreground text-sm font-bold mb-4">{tx.tripSelectTitle}</h3>
                    <div className="space-y-3 mb-6">
                      {TRIP_PACKAGES.map((pkg, i) => (
                        <motion.button
                          key={pkg.id}
                          whileHover={{ y: -2, scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setSelectedTripIndex(i)}
                          className={`w-full p-4 rounded-2xl border-2 border-dashed text-left transition-all duration-300 cursor-pointer flex items-start gap-3.5 relative overflow-hidden ${
                            selectedTripIndex === i
                              ? 'border-primary bg-primary/10 text-foreground shadow-[0_0_12px_rgba(45,106,79,0.15)] border-solid scale-[1.01]'
                              : 'border-border/60 bg-card/40 text-muted-foreground hover:border-primary/45 hover:text-foreground hover:bg-primary/5 hover:border-solid'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border transition-all ${
                            selectedTripIndex === i 
                              ? 'bg-primary/20 border-primary/30 text-primary shadow-inner' 
                              : 'bg-muted border-border/80'
                          }`}>
                            {pkg.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <strong className={`text-xs font-extrabold ${selectedTripIndex === i ? 'text-primary' : 'text-foreground'}`}>
                                {lang === 'id' ? pkg.titleId : pkg.titleEn}
                              </strong>
                              <span className="text-[10px] text-muted-foreground font-mono font-semibold">
                                {lang === 'id' ? pkg.durationId : pkg.durationEn}
                              </span>
                            </div>
                            <p className="text-[10.5px] leading-relaxed line-clamp-2 mt-1 font-medium text-muted-foreground">
                              {lang === 'id' ? pkg.descId : pkg.descEn}
                            </p>
                            <div className="text-xs font-black text-foreground mt-2 text-right">
                              {lang === 'id' ? `Rp ${pkg.price.toLocaleString('id-ID')}` : `IDR ${pkg.price.toLocaleString('en-US')}`} <span className="text-[9px] font-bold text-muted-foreground">/ pax</span>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    <div className="border-t border-border pt-5 space-y-4">
                      <h3 className="text-foreground text-sm font-bold">{tx.tripFormTitle}</h3>
                      
                      {/* Lead Participant Name Input */}
                      <div>
                        <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5">{tx.tripLabelName}</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/60"><User className="w-4 h-4" /></span>
                          <input
                            type="text"
                            value={leadName}
                            onChange={(e) => setLeadName(e.target.value)}
                            placeholder={lang === 'id' ? 'Nama lengkap Anda' : 'Your full name'}
                            className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-muted border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 font-semibold shadow-inner"
                          />
                        </div>
                      </div>

                      {/* Contact Phone Input */}
                      <div>
                        <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5">{tx.tripLabelPhone}</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/60"><Users className="w-4 h-4" /></span>
                          <input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="+62 812-3456-7890"
                            className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-muted border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 font-semibold shadow-inner"
                          />
                        </div>
                      </div>

                      {/* Departure Date Input */}
                      <div>
                        <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5">{tx.tripLabelDate}</label>
                        <input
                          type="date"
                          value={departureDate}
                          onChange={(e) => setDepartureDate(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl bg-muted border border-border/80 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 font-semibold shadow-inner"
                        />
                      </div>

                      {/* Participant Qty Input */}
                      <div>
                        <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5">{tx.tripLabelQty}</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={participantsCount}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setParticipantsCount(isNaN(val) ? 1 : Math.max(1, Math.min(10, val)));
                          }}
                          className="w-full px-4 py-3.5 rounded-xl bg-muted border border-border/80 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 font-semibold shadow-inner"
                        />
                      </div>

                      {/* Price Calculation details */}
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 text-xs">
                        <div className="flex justify-between items-center mb-1 text-muted-foreground">
                          <span>{lang === 'id' ? 'Biaya per Orang:' : 'Cost per Person:'}</span>
                          <span className="font-bold text-foreground">
                            {lang === 'id' 
                              ? `Rp ${TRIP_PACKAGES[selectedTripIndex].price.toLocaleString('id-ID')}` 
                              : `IDR ${TRIP_PACKAGES[selectedTripIndex].price.toLocaleString('en-US')}`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2 text-muted-foreground">
                          <span>{lang === 'id' ? 'Jumlah Kontingen:' : 'Total Group Size:'}</span>
                          <span className="font-bold text-foreground">{participantsCount} {lang === 'id' ? 'orang' : 'people'}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-primary/10">
                          <span className="font-extrabold text-primary">{tx.tripTotal}</span>
                          <span className="font-black text-primary text-sm">
                            {lang === 'id' 
                              ? `Rp ${(TRIP_PACKAGES[selectedTripIndex].price * participantsCount).toLocaleString('id-ID')}` 
                              : `IDR ${(TRIP_PACKAGES[selectedTripIndex].price * participantsCount).toLocaleString('en-US')}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-5 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleProceedPayment}
                        className="w-full py-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_8px_20px_rgba(45,106,79,0.25)] hover:shadow-[0_8px_24px_rgba(45,106,79,0.4)]"
                        style={{ background: 'linear-gradient(135deg, #2D6A4F, #52B788)', color: '#fff' }}
                      >
                        <QrCode className="w-4.5 h-4.5" />
                        {tx.btnBook}
                      </motion.button>
                      <div className="mt-3.5 flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        {lang === 'id' ? 'Aman & Terenkripsi • Pembatasan Konservasi Lingkungan' : 'Secure & Encrypted • Environmental Conservation Limit'}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
