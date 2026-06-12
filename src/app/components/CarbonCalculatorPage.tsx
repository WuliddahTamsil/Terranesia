import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Leaf, Car, Zap, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router';

interface CalcProps {
  lang: 'id' | 'en';
  isDark: boolean;
}

export function CarbonCalculatorPage({ lang, isDark }: CalcProps) {
  const navigate = useNavigate();
  const [transport, setTransport] = useState(10);
  const [electricity, setElectricity] = useState(5);
  const [diet, setDiet] = useState<'meat' | 'mixed' | 'veg'>('mixed');

  // Simple arbitrary calculation for educational purposes
  // 1 km car = ~0.2 kg CO2
  // 1 kWh = ~0.8 kg CO2
  // Diet multiplier
  const calculateScore = () => {
    let score = (transport * 0.2 * 30) + (electricity * 0.8 * 30);
    if (diet === 'meat') score *= 1.3;
    if (diet === 'veg') score *= 0.7;
    return Math.round(score);
  };

  const score = calculateScore();
  const indigenousScore = 5; // Near zero benchmark

  const getAdvice = () => {
    if (lang === 'id') {
      if (score < 50) return 'Jejak karbon Anda sangat rendah! Sangat selaras dengan prinsip hidup masyarakat adat Nusantara (SDG 13).';
      if (score < 150) return 'Jejak karbon Anda tergolong sedang. Coba kurangi penggunaan kendaraan pribadi untuk lebih baik lagi (SDG 11).';
      return 'Jejak karbon Anda tinggi. Mari belajar dari kearifan lokal "Rawatan Hidup" untuk mengurangi konsumsi energi dan daging (SDG 12 & 13).';
    } else {
      if (score < 50) return 'Your carbon footprint is very low! Very aligned with the lifestyle principles of Nusantara indigenous people (SDG 13).';
      if (score < 150) return 'Your carbon footprint is moderate. Try reducing private vehicle use to improve further (SDG 11).';
      return 'Your carbon footprint is high. Let\'s learn from the local wisdom of "Rawatan Hidup" to reduce energy and meat consumption (SDG 12 & 13).';
    }
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${isDark ? 'dark bg-background' : 'bg-background'}`}>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/lab')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          {lang === 'id' ? 'Kembali ke The Lab' : 'Back to The Lab'}
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
            {lang === 'id' ? 'Kalkulator Jejak Karbon' : 'Carbon Footprint Calculator'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {lang === 'id' ? 'Bandingkan gaya hidup modern Anda dengan kearifan lokal' : 'Compare your modern lifestyle with local wisdom'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Inputs */}
          <div className="space-y-8 bg-card border border-border p-6 md:p-8 rounded-3xl shadow-sm">
            
            <div>
              <label className="flex items-center gap-2 font-bold mb-4">
                <Car className="text-primary" />
                {lang === 'id' ? 'Transportasi Kendaraan Pribadi (km/hari)' : 'Private Vehicle Transport (km/day)'}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={transport}
                onChange={(e) => setTransport(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="text-right text-sm text-muted-foreground mt-1">{transport} km</div>
            </div>

            <div>
              <label className="flex items-center gap-2 font-bold mb-4">
                <Zap className="text-amber-500" />
                {lang === 'id' ? 'Penggunaan Listrik/AC (jam/hari)' : 'Electricity/AC Usage (hours/day)'}
              </label>
              <input
                type="range"
                min="0"
                max="24"
                value={electricity}
                onChange={(e) => setElectricity(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="text-right text-sm text-muted-foreground mt-1">{electricity} {lang === 'id' ? 'jam' : 'hours'}</div>
            </div>

            <div>
              <label className="flex items-center gap-2 font-bold mb-4">
                <Utensils className="text-rose-500" />
                {lang === 'id' ? 'Pola Makan Utama' : 'Main Diet'}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setDiet('meat')}
                  className={`flex-1 py-2 px-3 text-xs md:text-sm font-semibold rounded-xl border transition-colors ${diet === 'meat' ? 'bg-rose-500 text-white border-rose-500' : 'bg-transparent border-border text-foreground hover:border-rose-500/50'}`}
                >
                  {lang === 'id' ? 'Banyak Daging' : 'Heavy Meat'}
                </button>
                <button
                  onClick={() => setDiet('mixed')}
                  className={`flex-1 py-2 px-3 text-xs md:text-sm font-semibold rounded-xl border transition-colors ${diet === 'mixed' ? 'bg-primary text-white border-primary' : 'bg-transparent border-border text-foreground hover:border-primary/50'}`}
                >
                  {lang === 'id' ? 'Campur' : 'Mixed'}
                </button>
                <button
                  onClick={() => setDiet('veg')}
                  className={`flex-1 py-2 px-3 text-xs md:text-sm font-semibold rounded-xl border transition-colors ${diet === 'veg' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-transparent border-border text-foreground hover:border-emerald-500/50'}`}
                >
                  {lang === 'id' ? 'Vegetarian' : 'Vegetarian'}
                </button>
              </div>
            </div>

          </div>

          {/* Results */}
          <div className="bg-card border border-border p-6 md:p-8 rounded-3xl shadow-sm flex flex-col justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Leaf className="w-48 h-48" />
            </div>

            <h2 className="text-lg font-bold text-muted-foreground uppercase tracking-widest mb-2 relative z-10">
              {lang === 'id' ? 'Estimasi Emisi (Bulan)' : 'Estimated Emission (Month)'}
            </h2>
            
            <motion.div
              key={score}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-emerald-700 my-6 relative z-10"
            >
              {score} <span className="text-2xl text-muted-foreground">kg CO₂</span>
            </motion.div>

            <div className="bg-muted/50 p-4 rounded-2xl mb-6 relative z-10 border border-border/50 text-left">
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>{lang === 'id' ? 'Masyarakat Adat (Suku Baduy)' : 'Indigenous Community (Baduy)'}</span>
                <span className="text-emerald-500 font-bold">~{indigenousScore} kg CO₂</span>
              </div>
              <div className="w-full bg-border rounded-full h-2 mb-4">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
              
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>{lang === 'id' ? 'Jejak Karbon Anda' : 'Your Carbon Footprint'}</span>
                <span className="text-rose-500 font-bold">{score} kg CO₂</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div className="bg-rose-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min((score / 300) * 100, 100)}%` }}></div>
              </div>
            </div>

            <p className="text-sm md:text-base font-medium leading-relaxed relative z-10">
              {getAdvice()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
