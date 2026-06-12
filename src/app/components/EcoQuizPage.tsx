import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

interface QuizProps {
  lang: 'id' | 'en';
  isDark: boolean;
}

const questions = [
  {
    id: 1,
    questionId: 'Menurut filosofi masyarakat Bali, menjaga keharmonisan antara manusia, alam, dan Tuhan disebut?',
    questionEn: 'According to Balinese philosophy, maintaining harmony between humans, nature, and God is called?',
    optionsId: ['Gotong Royong', 'Tri Hita Karana', 'Tat Twam Asi', 'Bhinneka Tunggal Ika'],
    optionsEn: ['Gotong Royong', 'Tri Hita Karana', 'Tat Twam Asi', 'Bhinneka Tunggal Ika'],
    answer: 1,
    explanationId: 'Tri Hita Karana adalah fondasi sistem irigasi Subak yang menjaga keseimbangan ekosistem (SDG 15).',
    explanationEn: 'Tri Hita Karana is the foundation of the Subak irrigation system that maintains ecosystem balance (SDG 15).',
  },
  {
    id: 2,
    questionId: 'Kawasan hutan lindung adat Suku Dayak Kenyah yang dilarang ditebang sembarangan dikenal sebagai?',
    questionEn: 'The Dayak Kenyah customary protected forest zone where logging is strictly prohibited is known as?',
    optionsId: ['Hutan Larangan', 'Tana Ulen', 'Alas Purwo', 'Hutan Sabana'],
    optionsEn: ['Forbidden Forest', 'Tana Ulen', 'Alas Purwo', 'Savanna Forest'],
    answer: 1,
    explanationId: 'Tana Ulen adalah sistem konservasi tradisional Dayak yang efektif mencegah deforestasi (SDG 13).',
    explanationEn: 'Tana Ulen is a traditional Dayak conservation system effective in preventing deforestation (SDG 13).',
  },
  {
    id: 3,
    questionId: 'Tas rajut tradisional Papua yang 100% dapat terurai (biodegradable) dan diakui UNESCO adalah?',
    questionEn: 'The traditional Papuan knitted bag that is 100% biodegradable and recognized by UNESCO is?',
    optionsId: ['Tote Bag', 'Anyaman Rotan', 'Noken', 'Songket'],
    optionsEn: ['Tote Bag', 'Rattan Weave', 'Noken', 'Songket'],
    answer: 2,
    explanationId: 'Noken dibuat dari serat kayu alami, mewujudkan pola konsumsi dan produksi yang bertanggung jawab (SDG 12).',
    explanationEn: 'Noken is made from natural wood fiber, embodying responsible consumption and production (SDG 12).',
  },
  {
    id: 4,
    questionId: 'Apa fungsi utama hutan bakau (mangrove) bagi kawasan pesisir Nusantara?',
    questionEn: 'What is the main function of mangrove forests for Nusantara coastal areas?',
    optionsId: ['Bahan baku kertas', 'Menyerap karbon & menahan abrasi', 'Tempat wisata buatan', 'Bahan bangunan utama'],
    optionsEn: ['Paper raw material', 'Absorbing carbon & preventing abrasion', 'Artificial tourist spot', 'Main building material'],
    answer: 1,
    explanationId: 'Mangrove menyerap karbon hingga 4x lebih banyak dari hutan tropis biasa (SDG 14 & 13).',
    explanationEn: 'Mangroves absorb up to 4x more carbon than regular tropical forests (SDG 14 & 13).',
  },
  {
    id: 5,
    questionId: 'SDGs (Tujuan Pembangunan Berkelanjutan) nomor berapa yang berfokus pada "Aksi Iklim"?',
    questionEn: 'Which SDGs (Sustainable Development Goals) number focuses on "Climate Action"?',
    optionsId: ['SDG 1', 'SDG 5', 'SDG 13', 'SDG 16'],
    optionsEn: ['SDG 1', 'SDG 5', 'SDG 13', 'SDG 16'],
    answer: 2,
    explanationId: 'SDG 13 mendesak tindakan segera untuk memerangi perubahan iklim dan dampaknya.',
    explanationEn: 'SDG 13 urges immediate action to combat climate change and its impacts.',
  },
];

export function EcoQuizPage({ lang, isDark }: QuizProps) {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const q = questions[currentQ];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);
    if (idx === q.answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
    setSelectedOpt(null);
    setIsAnswered(false);
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 flex justify-center items-center ${isDark ? 'dark bg-background' : 'bg-background'}`}>
      <div className="max-w-2xl w-full">
        <button
          onClick={() => navigate('/lab')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          {lang === 'id' ? 'Kembali ke The Lab' : 'Back to The Lab'}
        </button>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card border border-border p-8 rounded-3xl shadow-xl"
            >
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-primary tracking-widest uppercase">
                    {lang === 'id' ? 'Pertanyaan' : 'Question'} {currentQ + 1} / {questions.length}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">
                    {lang === 'id' ? 'Skor' : 'Score'}: {score}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-serif leading-tight">
                  {lang === 'id' ? q.questionId : q.questionEn}
                </h2>
              </div>

              <div className="space-y-4">
                {(lang === 'id' ? q.optionsId : q.optionsEn).map((opt, idx) => {
                  let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-300 font-medium ";
                  if (!isAnswered) {
                    btnClass += "border-border hover:border-primary/50 hover:bg-primary/5";
                  } else {
                    if (idx === q.answer) {
                      btnClass += "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
                    } else if (idx === selectedOpt) {
                      btnClass += "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400";
                    } else {
                      btnClass += "border-border opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={isAnswered}
                      className={btnClass}
                    >
                      <div className="flex justify-between items-center">
                        <span>{opt}</span>
                        {isAnswered && idx === q.answer && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        {isAnswered && idx === selectedOpt && idx !== q.answer && <XCircle className="w-5 h-5 text-rose-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 bg-primary/10 rounded-xl border border-primary/20"
                >
                  <p className="text-sm md:text-base font-medium">
                    <span className="font-bold text-primary mr-2">
                      {lang === 'id' ? 'Fakta:' : 'Fact:'}
                    </span>
                    {lang === 'id' ? q.explanationId : q.explanationEn}
                  </p>
                  <button
                    onClick={nextQuestion}
                    className="mt-6 w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                  >
                    {currentQ < questions.length - 1 
                      ? (lang === 'id' ? 'Selanjutnya' : 'Next')
                      : (lang === 'id' ? 'Lihat Hasil' : 'See Results')}
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border p-10 rounded-3xl shadow-xl text-center"
            >
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-bold font-serif mb-4">
                {lang === 'id' ? 'Kuis Selesai!' : 'Quiz Completed!'}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {lang === 'id' ? 'Skor Anda' : 'Your Score'}: <span className="font-bold text-primary text-2xl ml-2">{score} / {questions.length}</span>
              </p>
              
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl mb-8">
                <h3 className="text-xl font-bold mb-2">
                  {score >= 4 
                    ? (lang === 'id' ? '🌿 Penjaga Bumi (Eco-Warrior)' : '🌿 Earth Guardian (Eco-Warrior)')
                    : (lang === 'id' ? '🌱 Tunas Harapan (Hope Sprout)' : '🌱 Hope Sprout')}
                </h3>
                <p className="text-sm">
                  {score >= 4 
                    ? (lang === 'id' ? 'Luar biasa! Anda memiliki wawasan yang dalam tentang kearifan lokal Nusantara dan pelestarian lingkungan.' : 'Excellent! You have deep insights into Nusantara local wisdom and environmental conservation.')
                    : (lang === 'id' ? 'Awal yang baik! Mari terus belajar dari kearifan leluhur untuk menjaga bumi kita bersama.' : 'Good start! Let\'s keep learning from ancestral wisdom to protect our shared earth.')}
                </p>
              </div>

              <button
                onClick={resetQuiz}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold tracking-wider hover:bg-primary/90 transition-colors"
              >
                {lang === 'id' ? 'Coba Lagi' : 'Try Again'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
