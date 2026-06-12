import { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  TrendingUp, 
  Heart, 
  Mail, 
  Users, 
  Globe, 
  BookOpen,
  CheckCircle,
  ArrowLeft,
  Calendar,
  Phone,
  DollarSign,
  Compass,
  Award,
  AlertCircle,
  Settings,
  Sparkles,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { cultureCards, type CultureCard } from './HistoryCultureSection';
import { initialCultures, type CulturePoint } from './JelajahSection';

interface Props {
  lang: 'id' | 'en';
  isDark: boolean;
}

export function AdminDashboardPage({ lang, isDark }: Props) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('ecotwin_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    setTimeout(() => {
      if (usernameInput.trim() === 'admin' && passwordInput === 'terranesia2026') {
        try {
          sessionStorage.setItem('ecotwin_admin_authenticated', 'true');
        } catch {}
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError(lang === 'id' ? 'Username atau Password salah!' : 'Invalid Username or Password!');
      }
      setIsLoggingIn(false);
    }, 800);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('ecotwin_admin_authenticated');
    } catch {}
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'cultures' | 'webgis' | 'donations' | 'subscribers'>('overview');

  // --- CRUD States ---
  const [cultures, setCultures] = useState<CultureCard[]>([]);
  const [webgisPoints, setWebgisPoints] = useState<CulturePoint[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);

  // Search & Filter States
  const [cultureSearch, setCultureSearch] = useState('');
  const [webgisSearch, setWebgisSearch] = useState('');

  // --- Modal & Form States: Culture ---
  const [isCultureModalOpen, setIsCultureModalOpen] = useState(false);
  const [editingCulture, setEditingCulture] = useState<CultureCard | null>(null);
  const [cultureForm, setCultureForm] = useState({
    name: '',
    region: 'Sumatera' as CultureCard['region'],
    location: '',
    category: 'Tradisional' as CultureCard['category'],
    culture: '',
    funFact: '',
    image: '',
    history: '',
    tradition: '',
    wisdom: '',
    education: '',
    trending: false
  });

  // --- Modal & Form States: WebGIS Point ---
  const [isWebgisModalOpen, setIsWebgisModalOpen] = useState(false);
  const [editingWebgis, setEditingWebgis] = useState<CulturePoint | null>(null);
  const [webgisForm, setWebgisForm] = useState({
    id: '',
    name: '',
    nameEn: '',
    location: '',
    region: 'jawa' as CulturePoint['region'],
    regionLabel: 'Jawa',
    regionLabelEn: 'Java',
    type: 'tradisi' as CulturePoint['type'],
    sustainability: 85,
    desc: '',
    descEn: '',
    image: '',
    lat: -6.2,
    lng: 106.8,
    envPractice: '',
    envPracticeEn: '',
    wayOfLife: '',
    wayOfLifeEn: '',
    philosophy: '',
    philosophyEn: '',
    radarLingkungan: 80,
    radarTradisi: 80,
    radarSosial: 80,
    radarSpiritual: 80,
    radarEkonomi: 80
  });

  // Load Data on Mount
  useEffect(() => {
    loadAllData();
    
    // Listen for storage events (multi-tab support)
    const handleStorageChange = () => {
      loadAllData();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('ecotwin_cultures_updated', handleStorageChange);
    window.addEventListener('ecotwin_webgis_cultures_updated', handleStorageChange);
    window.addEventListener('ecotwin_bookings_updated', handleStorageChange);
    window.addEventListener('ecotwin_subscribers_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ecotwin_cultures_updated', handleStorageChange);
      window.removeEventListener('ecotwin_webgis_cultures_updated', handleStorageChange);
      window.removeEventListener('ecotwin_bookings_updated', handleStorageChange);
      window.removeEventListener('ecotwin_subscribers_updated', handleStorageChange);
    };
  }, []);

  const loadAllData = () => {
    // 1. History & Culture
    try {
      const savedCultures = localStorage.getItem('ecotwin_cultures');
      if (savedCultures) {
        setCultures(JSON.parse(savedCultures));
      } else {
        localStorage.setItem('ecotwin_cultures', JSON.stringify(cultureCards));
        setCultures(cultureCards);
      }
    } catch (e) {
      console.error(e);
      setCultures(cultureCards);
    }

    // 2. WebGIS Map Points
    try {
      const savedWebgis = localStorage.getItem('ecotwin_webgis_cultures');
      if (savedWebgis) {
        setWebgisPoints(JSON.parse(savedWebgis));
      } else {
        localStorage.setItem('ecotwin_webgis_cultures', JSON.stringify(initialCultures));
        setWebgisPoints(initialCultures);
      }
    } catch (e) {
      console.error(e);
      setWebgisPoints(initialCultures);
    }

    // 3. Digital Donations
    try {
      const savedDonations = localStorage.getItem('ecotwin_donasi_list');
      if (savedDonations) {
        setDonations(JSON.parse(savedDonations));
      } else {
        // Seed some donations if empty
        const defaultDonations = [
          { id: '1', name: 'Budi Santoso', amount: 100000, message: 'Semoga kelestarian hutan adat Kanekes tetap terjaga dengan baik. Salam lestari!', date: '3 jam lalu', dateEn: '3 hours ago' },
          { id: '2', name: 'Siti Rahma', amount: 250000, message: 'Mari dukung pendidikan anak-anak suku Bajo agar tetap memegang tradisi kelautan mereka.', date: '6 jam lalu', dateEn: '6 hours ago' },
          { id: '3', name: 'Anonim', amount: 50000, message: 'Aksi kecil untuk melestarikan keindahan tenun ikat Sumba.', date: '1 hari lalu', dateEn: '1 day ago' },
          { id: '4', name: 'Rian Hidayat', amount: 500000, message: 'Senang bisa berkontribusi dalam konservasi rumah adat Mbaru Niang di Wae Rebo.', date: '2 hari lalu', dateEn: '2 days ago' }
        ];
        localStorage.setItem('ecotwin_donasi_list', JSON.stringify(defaultDonations));
        setDonations(defaultDonations);
      }
    } catch (e) {
      console.error(e);
    }

    // 4. Trip Bookings
    try {
      const savedBookings = localStorage.getItem('ecotwin_trip_bookings');
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      } else {
        const defaultBookings = [
          { id: 'EXP-BADUY-876123', leadName: 'Deni Setiawan', contactPhone: '+628123456789', departureDate: '2026-07-15', participantsCount: 3, packageName: 'Ekspedisi Kanekes Baduy Dalam', totalAmount: 1950000, bookedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString() },
          { id: 'EXP-SUBAK-345210', leadName: 'Made Wijaya', contactPhone: '+628987654321', departureDate: '2026-06-25', participantsCount: 2, packageName: 'Heritage Subak & Rindik Bali', totalAmount: 500000, bookedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString() }
        ];
        localStorage.setItem('ecotwin_trip_bookings', JSON.stringify(defaultBookings));
        setWebgisPoints(initialCultures); // make sure
        setBookings(defaultBookings);
      }
    } catch (e) {
      console.error(e);
    }

    // 5. Subscribers
    try {
      const savedSubs = localStorage.getItem('ecotwin_subscribers');
      if (savedSubs) {
        setSubscribers(JSON.parse(savedSubs));
      } else {
        const defaultSubs = [
          { name: 'Adit Pratama', email: 'adit.pratama@gmail.com', tribes: ['baduy', 'toraja'], frequency: 'weekly', subscribedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString() },
          { name: 'Clara Shinta', email: 'clara.s@yahoo.com', tribes: ['bali', 'waerebo', 'dayak'], frequency: 'always', subscribedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString() }
        ];
        localStorage.setItem('ecotwin_subscribers', JSON.stringify(defaultSubs));
        setSubscribers(defaultSubs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- CRUD Handlers: Culture ---
  const handleOpenCultureAdd = () => {
    setEditingCulture(null);
    setCultureForm({
      name: '',
      region: 'Sumatera',
      location: '',
      category: 'Tradisional',
      culture: '',
      funFact: '',
      image: '',
      history: '',
      tradition: '',
      wisdom: '',
      education: '',
      trending: false
    });
    setIsCultureModalOpen(true);
  };

  const handleOpenCultureEdit = (item: CultureCard) => {
    setEditingCulture(item);
    setCultureForm({
      name: item.name,
      region: item.region,
      location: item.location,
      category: item.category,
      culture: item.culture,
      funFact: item.funFact,
      image: item.image,
      history: item.history,
      tradition: item.tradition,
      wisdom: item.wisdom,
      education: item.education,
      trending: item.trending || false
    });
    setIsCultureModalOpen(true);
  };

  const handleSaveCulture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cultureForm.name || !cultureForm.location) {
      alert(lang === 'id' ? 'Nama dan Lokasi wajib diisi!' : 'Name and Location are required!');
      return;
    }

    let updatedList = [...cultures];
    if (editingCulture) {
      // Edit mode
      updatedList = updatedList.map(item => 
        item.id === editingCulture.id 
          ? { ...item, ...cultureForm } 
          : item
      );
    } else {
      // Add mode
      const newId = cultureForm.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      // Ensure unique ID
      const exists = cultures.some(c => c.id === newId);
      const finalId = exists ? `${newId}-${Date.now().toString().slice(-4)}` : newId;

      const newCulture: CultureCard = {
        id: finalId,
        ...cultureForm
      };
      updatedList.unshift(newCulture);
    }

    localStorage.setItem('ecotwin_cultures', JSON.stringify(updatedList));
    setCultures(updatedList);
    setIsCultureModalOpen(false);

    // Sync trigger event
    window.dispatchEvent(new Event('ecotwin_cultures_updated'));
  };

  const handleDeleteCulture = (id: string) => {
    const confirmText = lang === 'id' 
      ? 'Apakah Anda yakin ingin menghapus data budaya ini?' 
      : 'Are you sure you want to delete this culture item?';
    if (!window.confirm(confirmText)) return;

    const updatedList = cultures.filter(item => item.id !== id);
    localStorage.setItem('ecotwin_cultures', JSON.stringify(updatedList));
    setCultures(updatedList);

    // Sync trigger event
    window.dispatchEvent(new Event('ecotwin_cultures_updated'));
  };

  // --- CRUD Handlers: WebGIS Map Points ---
  const handleOpenWebgisAdd = () => {
    setEditingWebgis(null);
    setWebgisForm({
      id: '',
      name: '',
      nameEn: '',
      location: '',
      region: 'jawa',
      regionLabel: 'Jawa',
      regionLabelEn: 'Java',
      type: 'tradisi',
      sustainability: 85,
      desc: '',
      descEn: '',
      image: '',
      lat: -6.2,
      lng: 106.8,
      envPractice: '',
      envPracticeEn: '',
      wayOfLife: '',
      wayOfLifeEn: '',
      philosophy: '',
      philosophyEn: '',
      radarLingkungan: 80,
      radarTradisi: 80,
      radarSosial: 80,
      radarSpiritual: 80,
      radarEkonomi: 80
    });
    setIsWebgisModalOpen(true);
  };

  const handleOpenWebgisEdit = (item: CulturePoint) => {
    setEditingWebgis(item);
    setWebgisForm({
      id: item.id,
      name: item.name,
      nameEn: item.nameEn,
      location: item.location,
      region: item.region,
      regionLabel: item.regionLabel,
      regionLabelEn: item.regionLabelEn,
      type: item.type,
      sustainability: item.sustainability,
      desc: item.desc,
      descEn: item.descEn,
      image: item.image,
      lat: item.lat,
      lng: item.lng,
      envPractice: item.envPractice,
      envPracticeEn: item.envPracticeEn,
      wayOfLife: item.wayOfLife,
      wayOfLifeEn: item.wayOfLifeEn,
      philosophy: item.philosophy,
      philosophyEn: item.philosophyEn,
      radarLingkungan: item.radarData.find(r => r.subject === 'Lingkungan' || r.subject === 'Environment')?.value || 80,
      radarTradisi: item.radarData.find(r => r.subject === 'Tradisi' || r.subject === 'Tradition')?.value || 80,
      radarSosial: item.radarData.find(r => r.subject === 'Sosial' || r.subject === 'Social')?.value || 80,
      radarSpiritual: item.radarData.find(r => r.subject === 'Spiritual')?.value || 80,
      radarEkonomi: item.radarData.find(r => r.subject === 'Ekonomi' || r.subject === 'Economy')?.value || 80
    });
    setIsWebgisModalOpen(true);
  };

  const handleSaveWebgis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webgisForm.name || !webgisForm.location || !webgisForm.lat || !webgisForm.lng) {
      alert(lang === 'id' ? 'Nama, Lokasi, Lat, dan Lng wajib diisi!' : 'Name, Location, Lat, and Lng are required!');
      return;
    }

    // Define helper to get correct region strings
    const regionMapping: Record<CulturePoint['region'], { label: string; labelEn: string }> = {
      jawa: { label: 'Jawa', labelEn: 'Java' },
      sulawesi: { label: 'Sulawesi', labelEn: 'Sulawesi' },
      kalimantan: { label: 'Kalimantan', labelEn: 'Borneo' },
      sumatera: { label: 'Sumatera', labelEn: 'Sumatra' },
      bali: { label: 'Bali', labelEn: 'Bali' },
      papua: { label: 'Papua', labelEn: 'Papua' },
      nusatenggara: { label: 'Nusa Tenggara', labelEn: 'Lesser Sunda Islands' }
    };

    const finalRegionLabels = regionMapping[webgisForm.region] || { label: 'Jawa', labelEn: 'Java' };

    const radarData = [
      { subject: 'Lingkungan', value: Number(webgisForm.radarLingkungan) },
      { subject: 'Tradisi', value: Number(webgisForm.radarTradisi) },
      { subject: 'Sosial', value: Number(webgisForm.radarSosial) },
      { subject: 'Spiritual', value: Number(webgisForm.radarSpiritual) },
      { subject: 'Ekonomi', value: Number(webgisForm.radarEkonomi) }
    ];

    let updatedList = [...webgisPoints];
    if (editingWebgis) {
      // Edit Mode
      updatedList = updatedList.map(item => 
        item.id === editingWebgis.id 
          ? { 
              ...item, 
              ...webgisForm,
              regionLabel: finalRegionLabels.label,
              regionLabelEn: finalRegionLabels.labelEn,
              radarData,
              lat: Number(webgisForm.lat),
              lng: Number(webgisForm.lng),
              sustainability: Number(webgisForm.sustainability)
            } 
          : item
      );
    } else {
      // Add Mode
      const finalId = webgisForm.id.trim() || webgisForm.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const exists = webgisPoints.some(w => w.id === finalId);
      const uniqueId = exists ? `${finalId}-${Date.now().toString().slice(-4)}` : finalId;

      const newPoint: CulturePoint = {
        ...webgisForm,
        id: uniqueId,
        regionLabel: finalRegionLabels.label,
        regionLabelEn: finalRegionLabels.labelEn,
        radarData,
        lat: Number(webgisForm.lat),
        lng: Number(webgisForm.lng),
        sustainability: Number(webgisForm.sustainability)
      };
      updatedList.unshift(newPoint);
    }

    localStorage.setItem('ecotwin_webgis_cultures', JSON.stringify(updatedList));
    setWebgisPoints(updatedList);
    setIsWebgisModalOpen(false);

    // Sync trigger event
    window.dispatchEvent(new Event('ecotwin_webgis_cultures_updated'));
  };

  const handleDeleteWebgis = (id: string) => {
    const confirmText = lang === 'id' 
      ? 'Apakah Anda yakin ingin menghapus titik koordinat ini?' 
      : 'Are you sure you want to delete this map coordinate point?';
    if (!window.confirm(confirmText)) return;

    const updatedList = webgisPoints.filter(item => item.id !== id);
    localStorage.setItem('ecotwin_webgis_cultures', JSON.stringify(updatedList));
    setWebgisPoints(updatedList);

    // Sync trigger event
    window.dispatchEvent(new Event('ecotwin_webgis_cultures_updated'));
  };

  // --- Filtered lists for rendering ---
  const filteredCultures = useMemo(() => {
    const searchNorm = cultureSearch.toLowerCase().trim();
    if (!searchNorm) return cultures;
    return cultures.filter(c => 
      c.name.toLowerCase().includes(searchNorm) || 
      c.region.toLowerCase().includes(searchNorm) || 
      c.location.toLowerCase().includes(searchNorm)
    );
  }, [cultures, cultureSearch]);

  const filteredWebgis = useMemo(() => {
    const searchNorm = webgisSearch.toLowerCase().trim();
    if (!searchNorm) return webgisPoints;
    return webgisPoints.filter(w => 
      w.name.toLowerCase().includes(searchNorm) || 
      w.location.toLowerCase().includes(searchNorm) || 
      w.regionLabel.toLowerCase().includes(searchNorm)
    );
  }, [webgisPoints, webgisSearch]);

  // --- Statistics computed for overview tab ---
  const stats = useMemo(() => {
    const totalDonationValue = donations.reduce((acc, curr) => acc + (curr.amount || 0), 0) +
                               bookings.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    return {
      totalCultures: cultures.length,
      totalWebgis: webgisPoints.length,
      totalDonations: totalDonationValue,
      totalSubs: subscribers.length,
      donationCount: donations.length,
      bookingCount: bookings.length
    };
  }, [cultures, webgisPoints, donations, bookings, subscribers]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden pt-24 animate-fade-in">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="w-full max-w-md bg-card/65 backdrop-blur-xl border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 flex flex-col text-left space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7 text-primary animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {lang === 'id' ? 'Autentikasi Admin' : 'Admin Authentication'}
            </h2>
            <p className="text-muted-foreground text-xs leading-normal">
              {lang === 'id' 
                ? 'Masukkan kredensial admin Terranesia untuk mengakses dasbor.' 
                : 'Enter Terranesia admin credentials to access the dashboard.'}
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase block">
                Username
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                placeholder="e.g. admin"
                className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase block">
                Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-95 disabled:opacity-75 shadow-lg shadow-primary/25 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  {lang === 'id' ? 'Memverifikasi...' : 'Verifying...'}
                </>
              ) : (
                <>
                  {lang === 'id' ? 'Masuk Dasbor' : 'Enter Dashboard'}
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button 
              type="button" 
              onClick={() => navigate('/')} 
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              {lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
              <Settings className="w-3.5 h-3.5" />
              {lang === 'id' ? 'Sistem Manajemen Konten' : 'Content Management System'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-2.5">
              {lang === 'id' ? 'Dasbor Admin Terranesia' : 'Terranesia Admin Dashboard'}
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5">
              {lang === 'id' 
                ? 'Kelola data budaya, titik WebGIS, riwayat donasi digital, trip edukasi, dan langganan newsletter.'
                : 'Manage cultural data, WebGIS points, digital donations history, educational trip bookings, and newsletter subscribers.'}
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/')} 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border text-foreground hover:bg-muted/80 text-sm font-semibold transition-all shadow-sm flex-shrink-0 cursor-pointer self-start md:self-center"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
          </button>
        </div>

        {/* Layout Grid */}
        <div className="grid lg:grid-cols-[250px_1fr] gap-8 items-start">
          
          {/* Navigation Sidebar */}
          <aside className="bg-card/75 border border-border/80 rounded-2xl p-4 shadow-lg backdrop-blur-md space-y-1">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-3">
              Menu Admin
            </div>
            {[
              { id: 'overview', label: lang === 'id' ? 'Ringkasan' : 'Overview', icon: LayoutDashboard },
              { id: 'cultures', label: lang === 'id' ? 'Sejarah & Budaya' : 'History & Culture', icon: BookOpen },
              { id: 'webgis', label: lang === 'id' ? 'Peta WebGIS' : 'WebGIS Map', icon: Globe },
              { id: 'donations', label: lang === 'id' ? 'Donasi & Booking' : 'Donations & Bookings', icon: Heart },
              { id: 'subscribers', label: lang === 'id' ? 'Subscribers' : 'Subscribers', icon: Mail }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                      : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
            
            <div className="border-t border-border/40 my-3 pt-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
              >
                <Lock className="w-4 h-4 text-rose-500" />
                {lang === 'id' ? 'Keluar (Logout)' : 'Logout'}
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="space-y-6">
            
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                {/* Metrics Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: lang === 'id' ? 'Total Budaya' : 'Total Cultures', val: stats.totalCultures, desc: lang === 'id' ? 'Halaman Sejarah' : 'History Cards', icon: BookOpen, color: 'text-primary' },
                    { label: lang === 'id' ? 'Titik Peta WebGIS' : 'WebGIS Pins', val: stats.totalWebgis, desc: lang === 'id' ? 'Koordinat Aktif' : 'Active Pins', icon: Globe, color: 'text-emerald-400' },
                    { label: lang === 'id' ? 'Dana Terkumpul' : 'Funds Collected', val: formatCurrency(stats.totalDonations), desc: `${stats.donationCount} donatur + ${stats.bookingCount} trip`, icon: DollarSign, color: 'text-amber-500' },
                    { label: lang === 'id' ? 'Subscribers' : 'Subscribers', val: stats.totalSubs, desc: lang === 'id' ? 'Newsletter aktif' : 'Active subscribers', icon: Users, color: 'text-sky-400' }
                  ].map((metric, idx) => {
                    const Icon = metric.icon;
                    return (
                      <div key={idx} className="bg-card/75 border border-border/80 rounded-2xl p-5 shadow-lg backdrop-blur-md flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{metric.label}</p>
                          <p className="text-2xl font-bold text-foreground">{metric.val}</p>
                          <p className="text-[10px] text-muted-foreground">{metric.desc}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-muted/60 border border-border flex items-center justify-center ${metric.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Info and Navigation Box */}
                <div className="bg-gradient-to-r from-primary/10 via-emerald-500/5 to-transparent border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
                  <div className="relative z-10 max-w-xl space-y-3">
                    <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                      {lang === 'id' ? 'Selamat Datang di Portal Admin' : 'Welcome to the Admin Portal'}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {lang === 'id' 
                        ? 'Semua data yang dikelola di portal ini tersimpan di memori browser (localStorage) secara real-time. Jika Anda merubah, menambah, atau menghapus item, perubahan akan langsung terefleksi di tampilan utama Terranesia secara instan tanpa perlu reload.'
                        : 'All data managed in this portal is stored in the browser memory (localStorage) in real-time. If you edit, add, or delete items, the changes will reflect immediately on the main Terranesia view without reloading.'}
                    </p>
                    <div className="flex gap-4 pt-2">
                      <button onClick={() => setActiveTab('cultures')} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow hover:opacity-90 transition cursor-pointer">
                        {lang === 'id' ? 'Kelola Budaya' : 'Manage Cultures'}
                      </button>
                      <button onClick={() => setActiveTab('webgis')} className="px-4 py-2 border border-primary/30 text-primary text-xs font-bold rounded-xl hover:bg-primary/10 transition cursor-pointer">
                        {lang === 'id' ? 'Kelola WebGIS' : 'Manage WebGIS'}
                      </button>
                    </div>
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                </div>
              </div>
            )}

            {/* TAB: CULTURES */}
            {activeTab === 'cultures' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Search and Action Bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={lang === 'id' ? 'Cari suku, pulau, atau kategori...' : 'Search tribe, island, or category...'}
                      value={cultureSearch}
                      onChange={e => setCultureSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    />
                  </div>
                  <button
                    onClick={handleOpenCultureAdd}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-95 shadow transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    {lang === 'id' ? 'Tambah Budaya' : 'Add Culture'}
                  </button>
                </div>

                {/* Culture Table list */}
                <div className="bg-card/75 border border-border/80 rounded-2xl shadow-lg backdrop-blur-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border/50 text-muted-foreground font-bold">
                          <th className="p-4">{lang === 'id' ? 'Suku / Budaya' : 'Tribe / Culture'}</th>
                          <th className="p-4">{lang === 'id' ? 'Pulau / Region' : 'Island / Region'}</th>
                          <th className="p-4">{lang === 'id' ? 'Kategori' : 'Category'}</th>
                          <th className="p-4">{lang === 'id' ? 'Fokus Budaya' : 'Focus'}</th>
                          <th className="p-4 text-center">Trending</th>
                          <th className="p-4 text-right">{lang === 'id' ? 'Aksi' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCultures.map(item => (
                          <tr key={item.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-8 h-8 rounded-lg object-cover bg-muted/50 border border-border"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=100&q=50';
                                }}
                              />
                              <div>
                                <p className="font-bold text-foreground">{item.name}</p>
                                <p className="text-[10px] text-muted-foreground">{item.location}</p>
                              </div>
                            </td>
                            <td className="p-4 font-semibold text-muted-foreground">{item.region}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-[10px] font-semibold">
                                {item.category}
                              </span>
                            </td>
                            <td className="p-4 max-w-xs truncate text-muted-foreground">{item.culture}</td>
                            <td className="p-4 text-center">
                              {item.trending ? (
                                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold">
                                  YES
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-[10px]">-</span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <div className="inline-flex gap-2">
                                <button
                                  onClick={() => handleOpenCultureEdit(item)}
                                  className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-primary cursor-pointer transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCulture(item.id)}
                                  className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white cursor-pointer transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredCultures.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground italic">
                              {lang === 'id' ? 'Tidak ada data ditemukan' : 'No cultural items found'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: WEBGIS */}
            {activeTab === 'webgis' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Search and Action Bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={lang === 'id' ? 'Cari titik peta, koordinat, wilayah...' : 'Search map pin, coordinate, region...'}
                      value={webgisSearch}
                      onChange={e => setWebgisSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    />
                  </div>
                  <button
                    onClick={handleOpenWebgisAdd}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-95 shadow transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    {lang === 'id' ? 'Tambah Titik WebGIS' : 'Add WebGIS Point'}
                  </button>
                </div>

                {/* WebGIS Table list */}
                <div className="bg-card/75 border border-border/80 rounded-2xl shadow-lg backdrop-blur-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border/50 text-muted-foreground font-bold">
                          <th className="p-4">{lang === 'id' ? 'Nama Titik' : 'Pin Name'}</th>
                          <th className="p-4">{lang === 'id' ? 'Koordinat' : 'Coordinates'}</th>
                          <th className="p-4">{lang === 'id' ? 'Pulau / Region' : 'Island'}</th>
                          <th className="p-4">Type</th>
                          <th className="p-4 text-center">Eco Rating</th>
                          <th className="p-4 text-right">{lang === 'id' ? 'Aksi' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWebgis.map(item => (
                          <tr key={item.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-8 h-8 rounded-lg object-cover bg-muted/50 border border-border"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1771766995256-1618791109d5?w=100&q=50';
                                }}
                              />
                              <div>
                                <p className="font-bold text-foreground">{item.name}</p>
                                <p className="text-[10px] text-muted-foreground">{item.location}</p>
                              </div>
                            </td>
                            <td className="p-4 font-mono text-[10px] text-muted-foreground">
                              Lat: {item.lat.toFixed(4)}, Lng: {item.lng.toFixed(4)}
                            </td>
                            <td className="p-4 font-semibold text-muted-foreground">{item.regionLabel}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                                item.type === 'lingkungan' 
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                                  : item.type === 'ritual' 
                                    ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' 
                                    : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                              }`}>
                                {item.type.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span className="font-bold text-emerald-400">{item.sustainability}%</span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="inline-flex gap-2">
                                <button
                                  onClick={() => handleOpenWebgisEdit(item)}
                                  className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-primary cursor-pointer transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteWebgis(item.id)}
                                  className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white cursor-pointer transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredWebgis.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground italic">
                              {lang === 'id' ? 'Tidak ada data ditemukan' : 'No map points found'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: DONATIONS & BOOKINGS */}
            {activeTab === 'donations' && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Sub-tab 1: Digital Donations Table */}
                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" />
                    {lang === 'id' ? 'Daftar Donatur Digital' : 'Digital Donors List'}
                  </h2>
                  <div className="bg-card/75 border border-border/80 rounded-2xl shadow-lg backdrop-blur-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm border-collapse">
                        <thead>
                          <tr className="bg-muted/40 border-b border-border/50 text-muted-foreground font-bold">
                            <th className="p-4">Donor Name</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Message / Note</th>
                            <th className="p-4 text-right">Date / Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.map(don => (
                            <tr key={don.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                              <td className="p-4 font-bold text-foreground">{don.name}</td>
                              <td className="p-4 text-emerald-400 font-bold">{formatCurrency(don.amount)}</td>
                              <td className="p-4 text-muted-foreground italic max-w-sm leading-normal">"{don.message}"</td>
                              <td className="p-4 text-right text-muted-foreground font-semibold">
                                {lang === 'id' ? don.date : don.dateEn}
                              </td>
                            </tr>
                          ))}
                          {donations.length === 0 && (
                            <tr>
                              <td colSpan={4} className="p-8 text-center text-muted-foreground italic">
                                No digital donations recorded
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Sub-tab 2: Expedition Trip Bookings Table */}
                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                    <Compass className="w-5 h-5 text-emerald-400" />
                    {lang === 'id' ? 'Daftar Booking Ekspedisi Offline' : 'Offline Expedition Bookings'}
                  </h2>
                  <div className="bg-card/75 border border-border/80 rounded-2xl shadow-lg backdrop-blur-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm border-collapse">
                        <thead>
                          <tr className="bg-muted/40 border-b border-border/50 text-muted-foreground font-bold">
                            <th className="p-4">Booking ID</th>
                            <th className="p-4">Lead Participant</th>
                            <th className="p-4">WhatsApp Contact</th>
                            <th className="p-4">Package</th>
                            <th className="p-4 text-center">Depart Date</th>
                            <th className="p-4 text-center">Qty</th>
                            <th className="p-4 text-emerald-400 font-bold">Total Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map(bk => (
                            <tr key={bk.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors text-xs">
                              <td className="p-4 font-mono font-bold text-primary">{bk.id}</td>
                              <td className="p-4 font-bold text-foreground">{bk.leadName}</td>
                              <td className="p-4 text-muted-foreground flex items-center gap-1.5 mt-2.5">
                                <Phone className="w-3.5 h-3.5 text-primary" />
                                {bk.contactPhone}
                              </td>
                              <td className="p-4 font-semibold text-muted-foreground">{bk.packageName}</td>
                              <td className="p-4 text-center text-muted-foreground flex items-center justify-center gap-1 mt-2.5">
                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                {bk.departureDate}
                              </td>
                              <td className="p-4 text-center font-bold">{bk.participantsCount}</td>
                              <td className="p-4 text-emerald-400 font-bold">{formatCurrency(bk.totalAmount)}</td>
                            </tr>
                          ))}
                          {bookings.length === 0 && (
                            <tr>
                              <td colSpan={7} className="p-8 text-center text-muted-foreground italic">
                                No trip bookings registered yet
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: SUBSCRIBERS */}
            {activeTab === 'subscribers' && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Mail className="w-5 h-5 text-sky-400" />
                  {lang === 'id' ? 'Daftar Langganan Newsletter' : 'Newsletter Subscribers List'}
                </h2>

                <div className="bg-card/75 border border-border/80 rounded-2xl shadow-lg backdrop-blur-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border/50 text-muted-foreground font-bold">
                          <th className="p-4">Subscriber Name</th>
                          <th className="p-4">Email Address</th>
                          <th className="p-4">Frequency</th>
                          <th className="p-4">Interested Tribes</th>
                          <th className="p-4 text-right">Subscribed At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((sub, idx) => (
                          <tr key={idx} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                            <td className="p-4 font-bold text-foreground">{sub.name}</td>
                            <td className="p-4 font-semibold text-primary">{sub.email}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded bg-muted border border-border text-muted-foreground text-[10px] font-bold">
                                {sub.frequency.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {sub.tribes && sub.tribes.map((tId: string) => (
                                  <span key={tId} className="px-1.5 py-0.5 rounded bg-primary/5 text-primary text-[9px] border border-primary/20 font-semibold">
                                    {tId}
                                  </span>
                                ))}
                                {(!sub.tribes || sub.tribes.length === 0) && <span className="text-muted-foreground italic text-[10px]">None</span>}
                              </div>
                            </td>
                            <td className="p-4 text-right text-muted-foreground text-xs">
                              {new Date(sub.subscribedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                        {subscribers.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                              No subscribers found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </main>
        </div>

      </div>

      {/* --- MODAL: CRUD CULTURE CARD --- */}
      {isCultureModalOpen && (
        <div className="fixed inset-0 z-[2200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="w-full max-w-2xl bg-card border border-border rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Modal header */}
            <div className="relative px-6 py-5 bg-gradient-to-br from-emerald-950/40 via-primary/10 to-card border-b border-border/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="text-foreground text-lg font-bold">
                  {editingCulture ? (lang === 'id' ? 'Edit Data Budaya' : 'Edit Culture Item') : (lang === 'id' ? 'Tambah Budaya Baru' : 'Add New Culture')}
                </h3>
              </div>
              <button 
                onClick={() => setIsCultureModalOpen(false)}
                className="w-8 h-8 rounded-full bg-muted/40 hover:bg-muted text-muted-foreground flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form body */}
            <form onSubmit={handleSaveCulture} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Nama Budaya / Suku <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={cultureForm.name}
                    onChange={e => setCultureForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="misal: Suku Baduy"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {/* Location */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Lokasi Geografis <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={cultureForm.location}
                    onChange={e => setCultureForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="misal: Lebak, Banten"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Region */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Pulau / Region</label>
                  <select
                    value={cultureForm.region}
                    onChange={e => setCultureForm(prev => ({ ...prev, region: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {['Sumatera', 'Pulau Jawa', 'Kalimantan', 'Sulawesi', 'Bali & Nusa Tenggara', 'Maluku', 'Papua'].map(reg => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>
                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Kategori Budaya</label>
                  <select
                    value={cultureForm.category}
                    onChange={e => setCultureForm(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {['Tradisional', 'Maritim', 'Pegunungan', 'Ritual', 'Urban / Akulturasi'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase block">URL Gambar Budaya</label>
                <input
                  type="url"
                  value={cultureForm.image}
                  onChange={e => setCultureForm(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Focus Culture & Fun Fact */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Fokus Budaya (Singkat)</label>
                  <input
                    type="text"
                    value={cultureForm.culture}
                    onChange={e => setCultureForm(prev => ({ ...prev, culture: e.target.value }))}
                    placeholder="misal: Kerajinan Kain Tenun Ikat"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Fakta Unik (Fun Fact)</label>
                  <input
                    type="text"
                    value={cultureForm.funFact}
                    onChange={e => setCultureForm(prev => ({ ...prev, funFact: e.target.value }))}
                    placeholder="Fakta menarik tentang kebudayaan ini..."
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Detailed texts */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase block">Sejarah & Asal Usul</label>
                <textarea
                  value={cultureForm.history}
                  onChange={e => setCultureForm(prev => ({ ...prev, history: e.target.value }))}
                  placeholder="Cerita asal-usul sejarah kebudayaan..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Tradisi Hidup</label>
                  <textarea
                    value={cultureForm.tradition}
                    onChange={e => setCultureForm(prev => ({ ...prev, tradition: e.target.value }))}
                    placeholder="Tradisi sehari-hari..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Kearifan Ekologi</label>
                  <textarea
                    value={cultureForm.wisdom}
                    onChange={e => setCultureForm(prev => ({ ...prev, wisdom: e.target.value }))}
                    placeholder="Nilai menjaga alam..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Catatan Edukatif</label>
                  <textarea
                    value={cultureForm.education}
                    onChange={e => setCultureForm(prev => ({ ...prev, education: e.target.value }))}
                    placeholder="Pesan untuk pelajar..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Trending Switch */}
              <div className="flex items-center gap-3 p-3 bg-muted/40 border border-border rounded-xl">
                <input
                  type="checkbox"
                  id="trending-checkbox"
                  checked={cultureForm.trending}
                  onChange={e => setCultureForm(prev => ({ ...prev, trending: e.target.checked }))}
                  className="w-4 h-4 text-primary bg-muted border-border rounded focus:ring-primary/20 cursor-pointer"
                />
                <label htmlFor="trending-checkbox" className="text-xs font-bold text-foreground cursor-pointer select-none">
                  Highlight as Trending Culture (Show on top page sliders)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCultureModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border hover:bg-muted text-muted-foreground font-semibold text-xs transition-colors cursor-pointer text-center"
                >
                  {lang === 'id' ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-95 transition-opacity shadow-lg shadow-primary/20 cursor-pointer text-center"
                >
                  {lang === 'id' ? 'Simpan Data Budaya' : 'Save Culture Data'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CRUD WEBGIS POINT --- */}
      {isWebgisModalOpen && (
        <div className="fixed inset-0 z-[2200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="w-full max-w-2xl bg-card border border-border rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Modal header */}
            <div className="relative px-6 py-5 bg-gradient-to-br from-emerald-950/40 via-primary/10 to-card border-b border-border/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="text-foreground text-lg font-bold">
                  {editingWebgis ? (lang === 'id' ? 'Edit Titik Peta WebGIS' : 'Edit WebGIS Map Point') : (lang === 'id' ? 'Tambah Titik WebGIS Baru' : 'Add New WebGIS Map Point')}
                </h3>
              </div>
              <button 
                onClick={() => setIsWebgisModalOpen(false)}
                className="w-8 h-8 rounded-full bg-muted/40 hover:bg-muted text-muted-foreground flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form body */}
            <form onSubmit={handleSaveWebgis} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              <div className="grid sm:grid-cols-2 gap-4">
                {/* ID (Suku Key) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Tribe Key ID <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    disabled={!!editingWebgis}
                    value={webgisForm.id}
                    onChange={e => setWebgisForm(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]+/g, '') }))}
                    placeholder="misal: baduy, waerebo"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-55"
                  />
                  {!editingWebgis && <p className="text-[9px] text-muted-foreground">Kunci unik huruf kecil, misal: 'baduy'</p>}
                </div>
                {/* Location */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Lokasi (Kabupaten, Provinsi) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={webgisForm.location}
                    onChange={e => setWebgisForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="misal: Lebak, Banten"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Name ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Nama Titik (ID) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={webgisForm.name}
                    onChange={e => setWebgisForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="misal: Suku Baduy"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {/* Name EN */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Nama Titik (EN) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={webgisForm.nameEn}
                    onChange={e => setWebgisForm(prev => ({ ...prev, nameEn: e.target.value }))}
                    placeholder="e.g. Baduy Tribe"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Region */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Region Peta</label>
                  <select
                    value={webgisForm.region}
                    onChange={e => setWebgisForm(prev => ({ ...prev, region: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {[
                      { val: 'jawa', lbl: 'Jawa' },
                      { val: 'sulawesi', lbl: 'Sulawesi' },
                      { val: 'kalimantan', lbl: 'Kalimantan' },
                      { val: 'sumatera', lbl: 'Sumatera' },
                      { val: 'bali', lbl: 'Bali' },
                      { val: 'papua', lbl: 'Papua' },
                      { val: 'nusatenggara', lbl: 'Nusa Tenggara' }
                    ].map(item => (
                      <option key={item.val} value={item.val}>{item.lbl}</option>
                    ))}
                  </select>
                </div>
                {/* Type */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Tipe Budaya</label>
                  <select
                    value={webgisForm.type}
                    onChange={e => setWebgisForm(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="tradisi">Tradisi (Tradition)</option>
                    <option value="ritual">Ritual (Ritual)</option>
                    <option value="lingkungan">Lingkungan (Environmental Practice)</option>
                  </select>
                </div>
              </div>

              {/* Coordinates: Lat / Lng */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Latitude <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={webgisForm.lat}
                    onChange={e => setWebgisForm(prev => ({ ...prev, lat: parseFloat(e.target.value) || 0 }))}
                    placeholder="e.g. -6.6119"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Longitude <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={webgisForm.lng}
                    onChange={e => setWebgisForm(prev => ({ ...prev, lng: parseFloat(e.target.value) || 0 }))}
                    placeholder="e.g. 106.2625"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Eco-Index (Sustainability)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={webgisForm.sustainability}
                    onChange={e => setWebgisForm(prev => ({ ...prev, sustainability: parseInt(e.target.value, 10) || 0 }))}
                    placeholder="0-100"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold text-emerald-400"
                  />
                </div>
              </div>

              {/* Image & Descriptions */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase block">URL Gambar</label>
                <input
                  type="url"
                  value={webgisForm.image}
                  onChange={e => setWebgisForm(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/map-image.jpg"
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Deskripsi Pendek (ID)</label>
                  <textarea
                    value={webgisForm.desc}
                    onChange={e => setWebgisForm(prev => ({ ...prev, desc: e.target.value }))}
                    placeholder="Deskripsi singkat kebudayaan..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Deskripsi Pendek (EN)</label>
                  <textarea
                    value={webgisForm.descEn}
                    onChange={e => setWebgisForm(prev => ({ ...prev, descEn: e.target.value }))}
                    placeholder="Short description..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 border-t border-border/20 pt-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Praktik Lingkungan (ID)</label>
                  <input
                    type="text"
                    value={webgisForm.envPractice}
                    onChange={e => setWebgisForm(prev => ({ ...prev, envPractice: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Praktik Lingkungan (EN)</label>
                  <input
                    type="text"
                    value={webgisForm.envPracticeEn}
                    onChange={e => setWebgisForm(prev => ({ ...prev, envPracticeEn: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Cara Hidup / Way of Life (ID)</label>
                  <input
                    type="text"
                    value={webgisForm.wayOfLife}
                    onChange={e => setWebgisForm(prev => ({ ...prev, wayOfLife: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Cara Hidup / Way of Life (EN)</label>
                  <input
                    type="text"
                    value={webgisForm.wayOfLifeEn}
                    onChange={e => setWebgisForm(prev => ({ ...prev, wayOfLifeEn: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Filosofi Hidup (ID)</label>
                  <input
                    type="text"
                    value={webgisForm.philosophy}
                    onChange={e => setWebgisForm(prev => ({ ...prev, philosophy: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Filosofi Hidup (EN)</label>
                  <input
                    type="text"
                    value={webgisForm.philosophyEn}
                    onChange={e => setWebgisForm(prev => ({ ...prev, philosophyEn: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Radar Data Values (0-100 sliders) */}
              <div className="border-t border-border/20 pt-3 space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase block">Indeks Radar Metrik (0 - 100)</label>
                <div className="grid sm:grid-cols-5 gap-3 bg-muted/40 p-3 rounded-2xl border border-border">
                  {[
                    { key: 'radarLingkungan', label: 'Lingkungan' },
                    { key: 'radarTradisi', label: 'Tradisi' },
                    { key: 'radarSosial', label: 'Sosial' },
                    { key: 'radarSpiritual', label: 'Spiritual' },
                    { key: 'radarEkonomi', label: 'Ekonomi' }
                  ].map(spec => (
                    <div key={spec.key} className="space-y-1">
                      <label className="text-[10px] font-bold text-foreground block">{spec.label}</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(webgisForm as any)[spec.key]}
                        onChange={e => setWebgisForm(prev => ({ ...prev, [spec.key]: parseInt(e.target.value, 10) }))}
                        className="w-full accent-primary h-1 rounded bg-muted-foreground/30 cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-primary font-bold">{(webgisForm as any)[spec.key]}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsWebgisModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border hover:bg-muted text-muted-foreground font-semibold text-xs transition-colors cursor-pointer text-center"
                >
                  {lang === 'id' ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-95 transition-opacity shadow-lg shadow-primary/20 cursor-pointer text-center"
                >
                  {lang === 'id' ? 'Simpan Titik Peta' : 'Save Map Point'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
