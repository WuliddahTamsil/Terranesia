import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { TheLabSection } from './TheLabSection';

interface LabProps {
  lang: 'id' | 'en';
  isDark: boolean;
}

interface LabExperiment {
  id: string;
  titleId: string;
  titleEn: string;
  descriptionId: string;
  descriptionEn: string;
  category: 'all' | 'culture' | 'technology' | 'nature' | 'heritage' | 'tradition';
  image: string;
  color: string;
}

const labExperiments: LabExperiment[] = [
  {
    id: 'experiment_1',
    titleId: 'Penjelajah Adat Nusantara',
    titleEn: 'Nusantara Custom Explorer',
    descriptionId: 'Jelajahi keragaman komunitas adat Indonesia dengan teknologi VR interaktif',
    descriptionEn: 'Explore the diversity of Indonesian indigenous communities with interactive VR technology',
    category: 'culture',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    color: 'from-green-600 to-emerald-600',
  },
  {
    id: 'experiment_2',
    titleId: 'Arsitektur Tradisional 3D',
    titleEn: 'Traditional Architecture 3D',
    descriptionId: 'Desain dan interaksi dengan rumah adat dari berbagai region Indonesia',
    descriptionEn: 'Design and interact with traditional houses from various Indonesian regions',
    category: 'heritage',
    image: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    color: 'from-amber-600 to-orange-600',
  },
  {
    id: 'experiment_3',
    titleId: 'Peta Konservasi Hutan',
    titleEn: 'Forest Conservation Map',
    descriptionId: 'Visualisasi upaya pelestarian hutan dan kawasan adat di Nusantara',
    descriptionEn: 'Visualize forest and customary land conservation efforts across Nusantara',
    category: 'nature',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    color: 'from-teal-600 to-cyan-600',
  },
];

const categoryLabels = {
  id: {
    all: 'Semua',
    culture: 'Budaya',
    technology: 'Teknologi',
    nature: 'Alam',
    heritage: 'Warisan',
    tradition: 'Tradisi',
  },
  en: {
    all: 'All',
    culture: 'Culture',
    technology: 'Technology',
    nature: 'Nature',
    heritage: 'Heritage',
    tradition: 'Tradition',
  },
};

const categories: ('all' | 'culture' | 'technology' | 'nature' | 'heritage' | 'tradition')[] = [
  'all',
  'culture',
  'technology',
  'nature',
  'heritage',
  'tradition',
];

export function LabPage({ lang, isDark }: LabProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'culture' | 'technology' | 'nature' | 'heritage' | 'tradition'>('all');

  const filteredExperiments = useMemo(() => {
    if (selectedCategory === 'all') return labExperiments;
    return labExperiments.filter((exp) => exp.category === selectedCategory);
  }, [selectedCategory]);

  const categoryTx = categoryLabels[lang];
  const getTitle = (exp: LabExperiment) => (lang === 'id' ? exp.titleId : exp.titleEn);
  const getDescription = (exp: LabExperiment) => (lang === 'id' ? exp.descriptionId : exp.descriptionEn);

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 text-foreground">
        {/* Hero Header */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">
              <span className="bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                {lang === 'id' ? 'EKSPERIMEN' : 'EXPERIMENTS'}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              {lang === 'id'
                ? 'Teknologi inovatif yang menghadirkan pengalaman baru dalam mengenal warisan budaya Nusantara'
                : 'Innovative technology that brings new experiences in understanding Nusantara cultural heritage'}
            </p>
          </motion.div>

          {/* Filter Categories */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6 border-b border-border/30 pb-4"
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative px-2 py-2.5 font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {categoryTx[category as keyof typeof categoryTx]}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        </section>

        {/* Experiments Grid */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {filteredExperiments.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredExperiments.map((experiment, index) => {
                  const displayIndex = (index + 1).toString().padStart(2, '0');
                  return (
                    <motion.div
                      key={experiment.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative overflow-hidden rounded-2xl bg-card border-[0.5px] border-border/40 hover:border-primary/50 hover:bg-card/90 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full">
                        {/* Image Container with Editorial Frame */}
                        <div className="relative h-56 overflow-hidden m-3 rounded-xl border-[0.5px] border-border/30">
                          <img
                            src={experiment.image}
                            alt={getTitle(experiment)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                        </div>

                        {/* Content */}
                        <div className="px-6 pb-6 pt-3 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] tracking-[0.2em] font-mono text-primary/80 uppercase font-bold mb-2.5 block">
                              EXHIBIT {displayIndex} // {categoryTx[experiment.category as keyof typeof categoryTx]}
                            </span>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300" style={{ fontFamily: 'Playfair Display, serif' }}>
                              {getTitle(experiment)}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                              {getDescription(experiment)}
                            </p>
                          </div>

                          {/* Category Badge & Link */}
                          <div className="flex items-center justify-between pt-4 border-t border-border/30">
                            <span className={`text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase bg-primary/10 text-primary border border-primary/20`}>
                              {categoryTx[experiment.category as keyof typeof categoryTx]}
                            </span>
                            <div className="flex items-center gap-1 text-primary text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span>{lang === 'id' ? 'Masuk' : 'Enter'}</span>
                              <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground">
                  {lang === 'id'
                    ? 'Tidak ada eksperimen dalam kategori ini'
                    : 'No experiments in this category'}
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Interactive Lab Section containing chatbot, VR, AR, and Synth Playroom */}
        <TheLabSection lang={lang} />

        {/* Coming Soon Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {lang === 'id' ? 'Segera Hadir' : 'Coming Soon'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {lang === 'id'
                ? 'Kami sedang mengembangkan lebih banyak eksperimen interaktif untuk memberikan pengalaman yang lebih mendalam tentang kebudayaan Nusantara.'
                : 'We are developing more interactive experiments to provide a deeper experience of Nusantara culture.'}
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/30 rounded-full text-primary font-semibold">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              {lang === 'id' ? 'Tetap pantau kami' : 'Stay tuned'}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
