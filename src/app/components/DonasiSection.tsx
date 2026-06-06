import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
<<<<<<< Updated upstream
import { 
  Heart, QrCode, CheckCircle, ChevronDown, ChevronUp, Users, 
  TreePine, Sparkles, User, Award, Printer, Copy, Check 
} from 'lucide-react';
=======
import { Heart, QrCode, CheckCircle, ChevronDown, ChevronUp, Users, TreePine, Sparkles } from 'lucide-react';
import { formatRupiahShort, useTerranesiaCMSContent } from '../contentBridge';
>>>>>>> Stashed changes

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
  },
};

const targetAmtRaw = 50000000; // Rp 50 Juta
const daysLeft = 28;

export function DonasiSection({ lang }: Props) {
<<<<<<< Updated upstream
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
=======
  const cmsContent = useTerranesiaCMSContent();
>>>>>>> Stashed changes
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
  
  const tx = t[lang];
  const donation = cmsContent.donation;
  const progressPct = Math.min(100, Math.round((donation.collected / donation.target) * 100));
  const totalCollected = formatRupiahShort(donation.collected);
  const targetAmt = formatRupiahShort(donation.target);
  const donorCount = donation.donors;
  const daysLeft = donation.daysLeft;
  const title = lang === 'id' ? donation.title : tx.title;
  const subtitle = lang === 'id' ? donation.description : tx.sub;

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

  const getDonationAmount = () => {
    const presetAmounts = [20000, 50000, 100000, 250000, 500000];
    if (selectedAmt !== null) {
      return presetAmounts[selectedAmt];
    }
    const val = parseInt(customAmt, 10);
    return isNaN(val) ? 0 : val;
  };

  const handleDonate = () => {
    const amount = getDonationAmount();
    if (amount <= 0) {
      alert(lang === 'id' ? 'Silakan pilih atau masukkan nominal donasi terlebih dahulu.' : 'Please select or enter a donation amount first.');
      return;
    }
    setShowQris(true);
  };

  const confirmPayment = () => {
    const amount = getDonationAmount();
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
    window.print();
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
<<<<<<< Updated upstream
          <h2 className="text-foreground mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{tx.title}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">{tx.sub}</p>
=======
          <h2 className="text-foreground mb-3">{title}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{subtitle}</p>
>>>>>>> Stashed changes
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
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <div className="text-2xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>{totalCollectedFormatted}</div>
                  <div className="text-xs text-muted-foreground">{tx.collected} dari {targetAmtFormatted}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>{progressPct}%</div>
                  <div className="text-xs text-muted-foreground">{tx.target}</div>
                </div>
              </div>
              <div className="h-4 rounded-full bg-muted overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #2D6A4F, #52B788)' }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { value: donorCount.toLocaleString(), label: tx.donors, icon: Users },
                  { value: targetAmtFormatted, label: tx.target, icon: Sparkles },
                  { value: `${daysLeft}`, label: tx.days, icon: TreePine },
                ].map(({ value, label, icon: Icon }) => (
                  <div key={label} className="p-3 rounded-xl bg-muted/50 border border-border/40">
                    <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                    <div className="text-xs font-bold text-foreground">{value}</div>
                    <div className="text-[10px] text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Donors Support Feed */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <div className="border-b border-border pb-3 mb-4">
                <h3 className="text-foreground text-sm font-bold flex items-center gap-1.5">
                  <Users className="w-4.5 h-4.5 text-primary" />
                  {tx.recentDonors}
                </h3>
                <p className="text-muted-foreground text-[10px]">{tx.recentDonorsSub}</p>
              </div>

              <div className="max-h-[280px] overflow-y-auto pr-2 space-y-3 scrollbar-thin">
                {donorsList.map((donor) => (
                  <motion.div
                    key={donor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {donor.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-xs text-foreground truncate">{donor.name}</strong>
                        <span className="text-[10px] text-primary font-bold">
                          {lang === 'id' ? `Rp ${donor.amount.toLocaleString('id-ID')}` : `IDR ${donor.amount.toLocaleString('en-US')}`}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed italic">"{donor.message}"</p>
                      <span className="text-[9px] text-muted-foreground/75 block mt-2 font-mono">
                        {lang === 'id' ? donor.date : donor.dateEn}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Transparency Panel */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              <button
                onClick={() => setShowTransparency(!showTransparency)}
                className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
              >
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">{tx.transparency}</span>
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
                    <div className="px-5 pb-5 space-y-3">
                      {funds.map(f => (
                        <div key={f.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{f.label}</span>
                            <span className="font-semibold text-foreground">{f.pct}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${f.pct}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className={`h-full rounded-full ${f.color}`}
                            />
                          </div>
                        </div>
                      ))}
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
            className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm print:border-none print:shadow-none"
          >
            {/* Case 1: Donation Success Receipt (Sertifikat & Kuitansi) */}
            {donated ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-4 print:p-0"
              >
                {/* Certificate Frame */}
                <div className="border-4 border-double border-primary/40 rounded-2xl p-6 bg-primary/2 text-center relative overflow-hidden print:border-green-800">
                  {/* Subtle Stamp vector/icon in background */}
                  <Award className="w-28 h-28 text-primary/5 absolute -right-6 -bottom-6 rotate-12" />
                  
                  <Award className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h4 className="text-foreground text-sm font-extrabold tracking-widest uppercase mb-1">{tx.donatedCertTitle}</h4>
                  <p className="text-primary text-[10px] font-bold uppercase tracking-wider mb-4 border-b border-primary/20 pb-2">{tx.donatedCertSub}</p>
                  
                  <p className="text-muted-foreground text-xs leading-relaxed max-w-sm mx-auto mb-4">
                    {tx.donatedCertText}
                  </p>

                  <div className="text-sm font-bold text-foreground mb-1 uppercase tracking-wide">
                    {receiptName}
                  </div>
                  <div className="text-lg font-extrabold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {lang === 'id' ? `Rp ${receiptAmount.toLocaleString('id-ID')}` : `IDR ${receiptAmount.toLocaleString('en-US')}`}
                  </div>
                </div>

                {/* Struk / Invoice Details */}
                <div className="mt-6 border border-border/80 rounded-2xl p-5 bg-muted/15 space-y-3.5 text-xs text-left">
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
                  Rp {getDonationAmount().toLocaleString('id-ID')}
                </div>
                <div className="relative inline-block mb-4">
                  <div className="w-52 h-52 mx-auto rounded-2xl bg-white p-3 border-2 border-primary/30 flex items-center justify-center overflow-hidden shadow-inner">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                        generateDynamicQRIS(DEFAULT_STATIC_QRIS, getDonationAmount())
                      )}`}
                      alt="QRIS Dinamis"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                
                <div className="space-y-2.5 max-w-[240px] mx-auto mb-4">
                  <button
                    onClick={confirmPayment}
                    className="w-full py-3.5 rounded-xl font-semibold text-xs bg-primary text-white hover:bg-primary/95 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    {lang === 'id' ? 'Saya Sudah Membayar' : 'I Have Paid'}
                  </button>
                  <button
                    onClick={() => setShowQris(false)}
                    className="w-full py-2.5 rounded-xl text-[11px] text-muted-foreground hover:text-foreground transition-all hover:bg-muted active:scale-95 cursor-pointer"
                  >
                    {lang === 'id' ? 'Kembali / Batal' : 'Go Back / Cancel'}
                  </button>
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
              // Case 3: Initial Donation Form (Amount select, Name, Message)
              <>
                <h3 className="text-foreground text-sm font-bold mb-4">{lang === 'id' ? '1. Pilih Nominal Donasi' : '1. Select Donation Amount'}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
                  {tx.amts.map((amt, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedAmt(i)}
                      className={`py-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                        selectedAmt === i
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedAmt(null)}
                    className={`py-3 rounded-xl border-2 text-xs font-semibold transition-all col-span-2 sm:col-span-1 ${
                      selectedAmt === null
                        ? 'border-accent bg-accent/10 text-accent-foreground shadow-sm'
                        : 'border-border text-muted-foreground hover:border-accent/40'
                    }`}
                  >
                    {tx.custom}
                  </button>
                </div>

                {selectedAmt === null && (
                  <div className="mb-5">
                    <input
                      type="number"
                      value={customAmt}
                      onChange={(e) => setCustomAmt(e.target.value)}
                      placeholder={lang === 'id' ? 'Masukkan jumlah (Rp)' : 'Enter amount (IDR)'}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                )}

                <div className="border-t border-border pt-5 space-y-4">
                  <h3 className="text-foreground text-sm font-bold">{lang === 'id' ? '2. Detail Donatur' : '2. Donor Details'}</h3>
                  
                  {/* Name Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{lang === 'id' ? 'Nama Donatur' : 'Donor Name'}</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/60"><User className="w-4 h-4" /></span>
                      <input
                        type="text"
                        disabled={isAnonymous}
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder={tx.donorNamePlaceholder}
                        className={`w-full pl-9 pr-4 py-3 rounded-xl bg-muted border border-border text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40 ${isAnonymous ? 'opacity-40 select-none' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Anonymous Checkbox */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-1 accent-primary cursor-pointer"
                    />
                    <label htmlFor="anonymous" className="text-xs text-muted-foreground cursor-pointer select-none">
                      {tx.anonymousCheckbox}
                    </label>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{lang === 'id' ? 'Pesan Dukungan' : 'Support Message'}</label>
                    <textarea
                      value={donorMessageText}
                      onChange={(e) => setDonorMessageText(e.target.value.substring(0, 180))}
                      placeholder={tx.donorMessagePlaceholder}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                    />
                    <span className="text-[10px] text-muted-foreground/75 block text-right mt-1 font-mono">
                      {donorMessageText.length}/180
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-5 mt-4">
                  <button
                    onClick={handleDonate}
                    className="w-full py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #2D6A4F, #52B788)', color: '#fff', boxShadow: '0 8px 24px rgba(45,106,79,0.25)' }}
                  >
                    <QrCode className="w-4.5 h-4.5" />
                    {tx.btnDonate}
                  </button>
                  <div className="mt-3.5 flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    {lang === 'id' ? 'Aman & Terenkripsi • Transparansi 100%' : 'Secure & Encrypted • 100% Transparent'}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
