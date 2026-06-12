import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

interface StoryProps {
  lang: 'id' | 'en';
  isDark: boolean;
}

const storyData = [
  {
    id: 1,
    imageId: 'https://images.unsplash.com/photo-1511497584788-876760111969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    titleId: 'Napas Pertama Nusantara',
    titleEn: 'The First Breath of Nusantara',
    textId: 'Hutan hujan tropis Indonesia adalah salah satu paru-paru tertua di bumi. Menjadi rumah bagi 10% spesies tanaman dunia dan ratusan budaya adat yang hidup selaras dengannya.',
    textEn: 'Indonesia\'s tropical rainforest is one of the oldest lungs on earth. Home to 10% of the world\'s plant species and hundreds of indigenous cultures living in harmony with it.',
  },
  {
    id: 2,
    imageId: 'https://images.unsplash.com/photo-1594957960682-16e502c388cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    titleId: 'Ancaman Deforestasi',
    titleEn: 'The Threat of Deforestation',
    textId: 'Sejak pergantian abad, jutaan hektar kanopi hijau telah hilang akibat industri ekstraktif. Menyebabkan hilangnya habitat fauna endemik dan meningkatkan emisi karbon secara drastis (SDG 13).',
    textEn: 'Since the turn of the century, millions of hectares of green canopy have been lost due to extractive industries. Causing the loss of endemic fauna habitats and drastically increasing carbon emissions (SDG 13).',
  },
  {
    id: 3,
    imageId: 'https://images.unsplash.com/photo-1606585808259-420ce50f1917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    titleId: 'Pertahanan Kearifan Lokal',
    titleEn: 'The Defense of Local Wisdom',
    textId: 'Di tengah krisis, masyarakat adat berdiri di garis depan. Melalui hukum adat seperti "Tana Ulen" atau "Hutan Larangan", mereka menjaga batas suci alam agar tidak disentuh oleh eksploitasi.',
    textEn: 'Amidst the crisis, indigenous communities stand on the front lines. Through customary laws like "Tana Ulen" or "Forbidden Forests", they guard nature\'s sacred boundaries from exploitation.',
  },
  {
    id: 4,
    imageId: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    titleId: 'Masa Depan Bersama',
    titleEn: 'Our Shared Future',
    textId: 'Pelestarian lingkungan (SDG 15) bukan hanya tugas negara, tapi kewajiban kita semua. Dengan memahami dan menerapkan prinsip keseimbangan leluhur, kita dapat mewariskan bumi yang hijau untuk generasi mendatang.',
    textEn: 'Environmental conservation (SDG 15) is not just the state\'s duty, but our collective obligation. By understanding and applying ancestral balance principles, we can pass on a green earth to future generations.',
  }
];

export function StoryScrollPage({ lang, isDark }: StoryProps) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate which section is in the middle of the screen
      const index = Math.min(
        Math.floor((scrollY + windowHeight / 2) / windowHeight),
        storyData.length - 1
      );
      
      if (index !== activeSection) {
        setActiveSection(index);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const activeData = storyData[activeSection] || storyData[0];

  return (
    <div className={`relative ${isDark ? 'dark bg-black' : 'bg-black'} text-white`}>
      {/* Fixed Background Image */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${activeData.imageId})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4)',
        }}
      />
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/lab')}
        className="fixed top-24 left-4 sm:left-8 z-50 flex items-center gap-2 text-white/80 hover:text-white transition-colors mix-blend-difference"
      >
        <ArrowLeft className="w-5 h-5" />
        {lang === 'id' ? 'Kembali' : 'Back'}
      </button>

      {/* Progress Indicators */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 mix-blend-difference">
        {storyData.map((_, idx) => (
          <div 
            key={idx}
            className={`w-2 rounded-full transition-all duration-500 ${idx === activeSection ? 'h-8 bg-white' : 'h-2 bg-white/30'}`}
          />
        ))}
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {storyData.map((section, idx) => (
          <div 
            key={section.id}
            className="min-h-screen flex items-center justify-center px-6 sm:px-12 lg:px-24"
          >
            <div className={`max-w-3xl transition-all duration-1000 transform ${idx === activeSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl md:text-6xl font-bold font-serif mb-6 leading-tight drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                {lang === 'id' ? section.titleId : section.titleEn}
              </h2>
              <p className="text-xl md:text-2xl leading-relaxed text-white/90 drop-shadow-md font-light">
                {lang === 'id' ? section.textId : section.textEn}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Bottom padding to allow final section to reach top if needed */}
      <div className="h-24"></div>
    </div>
  );
}
