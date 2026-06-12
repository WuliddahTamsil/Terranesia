import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { Mail, Instagram, Twitter, Youtube, Github, CheckCircle, MapPin, Phone } from 'lucide-react';

interface Props { lang: 'id' | 'en'; isDark?: boolean }

const t = {
  id: {
    tagline: 'Melestarikan kearifan lokal Nusantara melalui teknologi modern untuk generasi yang mencintai alam.',
    explore: 'Jelajahi',
    links1: ['Beranda', 'Peta Budaya', 'The Lab', 'Edukasi', 'Donasi'],
    hrefs1: ['#beranda', '#jelajah', '/lab', '#edukasi', '#donasi'],
    about: 'Tentang',
    links2: ['Tentang Kami', 'Tim Pengembang', 'Mitra', 'Blog', 'Kontak'],
    legal: 'Legal',
    links3: ['Kebijakan Privasi', 'Syarat & Ketentuan', 'Hak Cipta'],
    subscribe: 'Dapatkan Update Terbaru',
    subDesc: 'Terima artikel, konten budaya, dan update terbaru langsung ke email Anda.',
    subPlaceholder: 'Masukkan email Anda',
    subBtn: 'Berlangganan',
    subSuccess: 'Berhasil! Terima kasih telah berlangganan 🌿',
    contact: 'Kontak',
    address: 'Kota Bogor, Jawa Barat',
    email: 'hello@terranesia.id',
    phone: '+62 87805987309',
    rights: ' 2026 Terranesia. Hak Cipta Dilindungi.',
    madeWith: 'Dibuat dengan ❤️ untuk Pelestarian Budaya Nusantara',
  },
  en: {
    tagline: 'Preserving Nusantara local wisdom through modern technology for a nature-loving generation.',
    explore: 'Explore',
    links1: ['Home', 'Culture Map', 'The Lab', 'Education', 'Donate'],
    hrefs1: ['#beranda', '#jelajah', '/lab', '#edukasi', '#donasi'],
    about: 'About',
    links2: ['About Us', 'Dev Team', 'Partners', 'Blog', 'Contact'],
    legal: 'Legal',
    links3: ['Privacy Policy', 'Terms & Conditions', 'Copyright'],
    subscribe: 'Get Latest Updates',
    subDesc: 'Receive articles, cultural content, and latest updates directly to your email.',
    subPlaceholder: 'Enter your email',
    subBtn: 'Subscribe',
    subSuccess: 'Success! Thank you for subscribing 🌿',
    contact: 'Contact',
    address: 'Bogor City, West Java',
    email: 'hello@terranesia.id',
    phone: '+62 87805987309',
    rights: ' 2026 Terranesia. All Rights Reserved.',
    madeWith: 'Made with ❤️ for Nusantara Cultural Preservation',
  },
};

export function Footer({ lang, isDark }: Props) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const tx = t[lang];
  const location = useLocation();
  const navigate = useNavigate();

  const smoothScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.substring(1);
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => smoothScroll(id), 100);
      } else {
        smoothScroll(id);
      }
    } else if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-foreground text-background">
      {/* Subscribe Banner */}
      <div className="border-b border-background/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-background mb-1">{tx.subscribe}</h3>
              <p className="text-background/60 text-sm">{tx.subDesc}</p>
            </div>
            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-primary text-sm font-semibold"
              >
                <CheckCircle className="w-5 h-5" />
                {tx.subSuccess}
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={tx.subPlaceholder}
                  required
                  className="flex-1 px-4 py-3 rounded-xl bg-background/10 border border-background/20 text-background placeholder:text-background/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex-shrink-0"
                >
                  {tx.subBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Logo 
                variant={isDark ? 'alternative-green' : 'alternative-white'} 
                size="lg" 
                showTypeface={true}
                className="mb-4"
              />
            <p className="text-background/60 text-sm leading-relaxed mb-5 max-w-xs">{tx.tagline}</p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Youtube, label: 'YouTube' },
                { icon: Github, label: 'GitHub' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center text-background/60 hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <div className="text-background text-sm font-semibold mb-4">{tx.explore}</div>
            <ul className="space-y-2.5">
              {tx.links1.map((label, i) => (
                <li key={i}>
                  <a
                    href={tx.hrefs1[i]}
                    onClick={(e) => handleLinkClick(e, tx.hrefs1[i])}
                    className="text-background/55 text-sm hover:text-primary transition-colors cursor-pointer"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <div className="text-background text-sm font-semibold mb-4">{tx.about}</div>
            <ul className="space-y-2.5">
              {tx.links2.map((label) => (
                <li key={label}>
                  <span className="text-background/55 text-sm cursor-default select-none">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-background text-sm font-semibold mb-4">{tx.contact}</div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-background/55 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                <span>{tx.address}</span>
              </li>
              <li className="flex items-center gap-2 text-background/55 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0 text-primary" />
                <span>{tx.email}</span>
              </li>
              <li className="flex items-center gap-2 text-background/55 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0 text-primary" />
                <span>{tx.phone}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-background/40 text-xs">{tx.rights}</p>
          <p className="text-background/40 text-xs">{tx.madeWith}</p>
          <div className="flex gap-4">
            {tx.links3.map(label => (
              <a key={label} href="#" className="text-background/40 text-xs hover:text-background/70 transition-colors">{label}</a>
            ))}
            <a 
              href="/admin" 
              onClick={(e) => handleLinkClick(e, '/admin')} 
              className="text-background/40 text-[10px] sm:text-xs hover:text-primary transition-colors font-semibold border-l border-background/20 pl-4"
            >
              Admin Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
