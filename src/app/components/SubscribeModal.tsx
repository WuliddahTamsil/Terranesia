import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Mail, Bell, Sparkles, AlertCircle, CheckCircle, Check, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'id' | 'en';
}

interface SubscriptionData {
  name: string;
  email: string;
  tribes: string[];
  frequency: 'always' | 'weekly' | 'monthly';
  subscribedAt: string;
}

const tribesList = [
  { id: 'baduy', name: 'Suku Baduy', nameEn: 'Baduy Tribe' },
  { id: 'toraja', name: 'Masyarakat Toraja', nameEn: 'Toraja People' },
  { id: 'dayak', name: 'Suku Dayak Kenyah', nameEn: 'Dayak Kenyah Tribe' },
  { id: 'kajang', name: 'Suku Kajang Ammatoa', nameEn: 'Kajang Ammatoa Tribe' },
  { id: 'waerebo', name: 'Masyarakat Wae Rebo', nameEn: 'Wae Rebo Community' },
  { id: 'sasak', name: 'Suku Sasak Sade', nameEn: 'Sasak Sade Tribe' },
  { id: 'dani', name: 'Suku Dani', nameEn: 'Dani Tribe' },
  { id: 'bali', name: 'Subak Ubud Bali', nameEn: 'Subak Ubud Bali' },
];

export function SubscribeModal({ isOpen, onClose, lang }: SubscribeModalProps) {
  const [existingSub, setExistingSub] = useState<SubscriptionData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedTribes, setSelectedTribes] = useState<string[]>(tribesList.map(t => t.id));
  const [frequency, setFrequency] = useState<'always' | 'weekly' | 'monthly'>('weekly');
  
  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  // Load existing subscription from localStorage on mount/open
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('terranesia_subscription');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as SubscriptionData;
          setExistingSub(parsed);
          setName(parsed.name);
          setEmail(parsed.email);
          setSelectedTribes(parsed.tribes || []);
          setFrequency(parsed.frequency || 'weekly');
          setIsEditing(false);
        } catch (e) {
          console.error("Failed to parse local subscription", e);
        }
      } else {
        setExistingSub(null);
        setIsEditing(true);
        // Reset form
        setName('');
        setEmail('');
        setSelectedTribes(tribesList.map(t => t.id));
        setFrequency('weekly');
      }
      setShowSuccess(false);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) {
      newErrors.name = lang === 'id' ? 'Nama wajib diisi' : 'Name is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = lang === 'id' ? 'Email wajib diisi' : 'Email is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = lang === 'id' ? 'Format email tidak valid' : 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const subData: SubscriptionData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        tribes: selectedTribes,
        frequency,
        subscribedAt: new Date().toISOString()
      };

      localStorage.setItem('terranesia_subscription', JSON.stringify(subData));
      
      try {
        const existing = localStorage.getItem('ecotwin_subscribers');
        let list = existing ? JSON.parse(existing) : [];
        const existingIdx = list.findIndex((s: any) => s.email === subData.email);
        if (existingIdx !== -1) {
          list[existingIdx] = subData;
        } else {
          list.unshift(subData);
        }
        localStorage.setItem('ecotwin_subscribers', JSON.stringify(list));
        window.dispatchEvent(new Event('ecotwin_subscribers_updated'));
      } catch (e) {
        console.error("Failed to update subscribers list", e);
      }

      setExistingSub(subData);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Trigger premium confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  const handleUnsubscribe = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      localStorage.removeItem('terranesia_subscription');
      setExistingSub(null);
      setIsEditing(true);
      setName('');
      setEmail('');
      setSelectedTribes(tribesList.map(t => t.id));
      setFrequency('weekly');
      setIsSubmitting(false);
      setShowSuccess(false);
      
      // Fun minor cleanup burst
      confetti({
        particleCount: 50,
        spread: 40,
        colors: ['#ef4444', '#f87171', '#fee2e2']
      });
    }, 1000);
  };

  const toggleTribe = (id: string) => {
    setSelectedTribes(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  const selectAllTribes = () => {
    setSelectedTribes(tribesList.map(t => t.id));
  };

  const clearAllTribes = () => {
    setSelectedTribes([]);
  };

  // UI labels translation
  const t = {
    id: {
      title: 'Langganan Terranesia',
      sub: 'Dapatkan wawasan mingguan dan kabar pembaruan suku adat langsung di email Anda.',
      subbedTitle: 'Status Berlangganan Aktif',
      subbedSub: 'Terima kasih atas kepedulian Anda dalam menjaga kearifan lokal Nusantara.',
      nameLabel: 'Nama Lengkap',
      namePl: 'Masukkan nama Anda',
      emailLabel: 'Alamat Email',
      emailPl: 'nama@domain.com',
      tribesLabel: 'Pilih Suku / Budaya yang Diikuti:',
      selectAll: 'Pilih Semua',
      clearAll: 'Hapus Semua',
      freqLabel: 'Frekuensi Pengiriman:',
      freqAlways: 'Tiap Pembaruan',
      freqAlwaysDesc: 'Langsung terima email saat ada data suku/VR baru.',
      freqWeekly: 'Ringkasan Mingguan',
      freqWeeklyDesc: 'Satu email rangkuman di akhir pekan.',
      freqMonthly: 'Rangkuman Bulanan',
      freqMonthlyDesc: 'Kabar pilihan sebulan sekali.',
      btnSub: 'Langganan Sekarang',
      btnUnsub: 'Berhenti Langganan',
      btnUpdate: 'Simpan Perubahan',
      btnEdit: 'Ubah Preferensi',
      successTitle: 'Pendaftaran Berhasil!',
      successSub: 'Anda sekarang terdaftar sebagai penjaga kelestarian Terranesia.',
      done: 'Selesai',
      cancel: 'Batal',
      subDetails: 'Rincian Langganan Anda:',
      subbedAt: 'Terdaftar pada'
    },
    en: {
      title: 'Subscribe to Terranesia',
      sub: 'Get weekly insights and updates on indigenous tribes directly in your email.',
      subbedTitle: 'Active Subscription',
      subbedSub: 'Thank you for your support in preserving Nusantara\'s local wisdom.',
      nameLabel: 'Full Name',
      namePl: 'Enter your name',
      emailLabel: 'Email Address',
      emailPl: 'name@domain.com',
      tribesLabel: 'Select Tribes / Cultures to Follow:',
      selectAll: 'Select All',
      clearAll: 'Clear All',
      freqLabel: 'Delivery Frequency:',
      freqAlways: 'Each Update',
      freqAlwaysDesc: 'Instant email alert when new tribe data/VR is added.',
      freqWeekly: 'Weekly Digest',
      freqWeeklyDesc: 'One summary email at the end of the week.',
      freqMonthly: 'Monthly Summary',
      freqMonthlyDesc: 'Curated newsletters once a month.',
      btnSub: 'Subscribe Now',
      btnUnsub: 'Unsubscribe',
      btnUpdate: 'Save Changes',
      btnEdit: 'Update Preferences',
      successTitle: 'Subscription Successful!',
      successSub: 'You are now registered as a Terranesia preservation partner.',
      done: 'Done',
      cancel: 'Cancel',
      subDetails: 'Your Subscription Details:',
      subbedAt: 'Subscribed on'
    }
  }[lang];

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-card border border-border rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] text-left"
      >
        
        {/* Banner header */}
        <div className="relative px-6 py-8 bg-gradient-to-br from-emerald-950 via-primary/20 to-card border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Bell className="w-5 h-5 text-primary-foreground animate-pulse" />
            </div>
            <div>
              <h3 className="text-foreground text-lg font-bold flex items-center gap-1.5">
                {existingSub && !isEditing ? t.subbedTitle : t.title}
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-muted-foreground text-xs mt-0.5 max-w-xs leading-normal">
                {existingSub && !isEditing ? t.subbedSub : t.sub}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted/40 hover:bg-muted text-muted-foreground flex items-center justify-center transition-colors cursor-pointer border border-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[60vh]">
          {isSubmitting ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-semibold text-foreground animate-pulse">
                {lang === 'id' ? 'Memproses permintaan Anda...' : 'Processing your request...'}
              </p>
            </div>
          ) : showSuccess ? (
            /* Success Screen */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-foreground text-base font-bold">{t.successTitle}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-sm mx-auto">{t.successSub}</p>
              </div>

              {/* Sub data summary */}
              <div className="p-4 rounded-2xl bg-muted/50 border border-border text-left space-y-2 max-w-sm mx-auto text-xs">
                <div className="flex justify-between border-b border-border/50 pb-1.5">
                  <span className="text-muted-foreground">{lang === 'id' ? 'Penerima' : 'Recipient'}:</span>
                  <span className="font-bold text-foreground">{name}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-1.5">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-bold text-foreground">{email}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-1.5">
                  <span className="text-muted-foreground">{lang === 'id' ? 'Frekuensi' : 'Frequency'}:</span>
                  <span className="font-bold text-foreground">
                    {frequency === 'always' ? t.freqAlways : frequency === 'weekly' ? t.freqWeekly : t.freqMonthly}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{lang === 'id' ? 'Mengikuti' : 'Following'}:</span>
                  <span className="font-bold text-foreground">{selectedTribes.length} {lang === 'id' ? 'Suku' : 'Tribes'}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow hover:opacity-95 transition-all cursor-pointer"
                >
                  {t.done}
                </button>
              </div>
            </motion.div>
          ) : existingSub && !isEditing ? (
            /* Already Subscribed View */
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3.5">
                <div className="text-xs font-bold text-primary uppercase tracking-widest">{t.subDetails}</div>
                <div className="grid grid-cols-3 gap-2 text-xs border-b border-border/50 pb-3">
                  <div className="col-span-1 text-muted-foreground">{t.nameLabel}</div>
                  <div className="col-span-2 font-semibold text-foreground">{existingSub.name}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs border-b border-border/50 pb-3">
                  <div className="col-span-1 text-muted-foreground">{t.emailLabel}</div>
                  <div className="col-span-2 font-semibold text-foreground">{existingSub.email}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs border-b border-border/50 pb-3">
                  <div className="col-span-1 text-muted-foreground">{lang === 'id' ? 'Frekuensi' : 'Frequency'}</div>
                  <div className="col-span-2 font-semibold text-foreground">
                    {existingSub.frequency === 'always' ? t.freqAlways : existingSub.frequency === 'weekly' ? t.freqWeekly : t.freqMonthly}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs pb-1">
                  <div className="col-span-1 text-muted-foreground">{lang === 'id' ? 'Langganan Suku' : 'Tribe Updates'}</div>
                  <div className="col-span-2 flex flex-wrap gap-1">
                    {existingSub.tribes.map(tId => {
                      const tribe = tribesList.find(tb => tb.id === tId);
                      return tribe ? (
                        <span key={tId} className="px-2 py-0.5 rounded-md bg-muted text-[10px] text-muted-foreground font-semibold border border-border">
                          {lang === 'id' ? tribe.name : tribe.nameEn}
                        </span>
                      ) : null;
                    })}
                    {existingSub.tribes.length === 0 && <span className="text-rose-400 italic">None</span>}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-muted-foreground text-center">
                {t.subbedAt}: {new Date(existingSub.subscribedAt).toLocaleDateString()}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-2.5 rounded-xl border border-border hover:border-primary text-muted-foreground hover:text-primary font-semibold text-xs transition-colors cursor-pointer text-center"
                >
                  {t.btnEdit}
                </button>
                <button
                  onClick={handleUnsubscribe}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 font-semibold text-xs transition-colors cursor-pointer text-center"
                >
                  {t.btnUnsub}
                </button>
              </div>
            </div>
          ) : (
            /* Subscription Form */
            <form onSubmit={handleSubscribe} className="space-y-4 text-xs sm:text-sm">
              
              {/* Name field */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground text-xs uppercase tracking-wider block">
                  {t.nameLabel} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t.namePl}
                  className={`w-full px-4 py-2.5 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 border transition-all ${
                    errors.name ? 'border-rose-400 focus:ring-rose-400/20' : 'border-border focus:ring-primary/20'
                  }`}
                />
                {errors.name && (
                  <p className="text-rose-500 text-[10px] font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground text-xs uppercase tracking-wider block">
                  {t.emailLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t.emailPl}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 border transition-all ${
                      errors.email ? 'border-rose-400 focus:ring-rose-400/20' : 'border-border focus:ring-primary/20'
                    }`}
                  />
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                </div>
                {errors.email && (
                  <p className="text-rose-500 text-[10px] font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Tribe selectors checklist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-foreground text-xs uppercase tracking-wider block">
                    {t.tribesLabel}
                  </label>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={selectAllTribes}
                      className="text-[10px] font-semibold text-primary hover:underline"
                    >
                      {t.selectAll}
                    </button>
                    <span className="text-muted-foreground text-[10px]">•</span>
                    <button 
                      type="button" 
                      onClick={clearAllTribes}
                      className="text-[10px] font-semibold text-rose-500 hover:underline"
                    >
                      {t.clearAll}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 bg-muted/30 border border-border p-3 rounded-2xl max-h-[140px] overflow-y-auto">
                  {tribesList.map(tb => {
                    const isChecked = selectedTribes.includes(tb.id);
                    return (
                      <button
                        key={tb.id}
                        type="button"
                        onClick={() => toggleTribe(tb.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                          isChecked 
                            ? 'bg-primary/5 border-primary/40 text-primary font-semibold' 
                            : 'bg-card border-border/60 text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                          isChecked ? 'bg-primary border-primary text-primary-foreground' : 'border-border/80 bg-background'
                        }`}>
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="text-[10px] truncate">{lang === 'id' ? tb.name : tb.nameEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Frequency radios */}
              <div className="space-y-2">
                <label className="font-bold text-foreground text-xs uppercase tracking-wider block">
                  {t.freqLabel}
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'always', label: t.freqAlways, desc: t.freqAlwaysDesc },
                    { id: 'weekly', label: t.freqWeekly, desc: t.freqWeeklyDesc },
                    { id: 'monthly', label: t.freqMonthly, desc: t.freqMonthlyDesc },
                  ].map(item => {
                    const isSelected = frequency === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFrequency(item.id as any)}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl border text-left transition-all ${
                          isSelected 
                            ? 'bg-primary/5 border-primary/45' 
                            : 'border-border/60 bg-card hover:bg-muted/30'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                          isSelected ? 'border-primary' : 'border-border/80'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        </div>
                        <div className="space-y-0.5">
                          <div className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {item.label}
                          </div>
                          <div className="text-[10px] text-muted-foreground leading-normal">
                            {item.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex gap-3 pt-3">
                {existingSub && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2.5 rounded-xl border border-border hover:bg-muted text-muted-foreground font-semibold text-xs transition-colors cursor-pointer text-center"
                  >
                    {t.cancel}
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-95 transition-opacity shadow-lg shadow-primary/20 cursor-pointer text-center"
                >
                  {existingSub ? t.btnUpdate : t.btnSub}
                </button>
              </div>

            </form>
          )}
        </div>

      </motion.div>
    </div>
  );
}
