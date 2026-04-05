import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Shield, Zap, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';

const services = [
  'X-ray near me',
  'Blood test price',
  'MRI price',
  'CT scan cost',
  'Full body checkup',
  'Doctor consultation fee',
];

const features = [
  { icon: MapPin, title: 'Nearby hospitals & labs', desc: 'Find by location' },
  { icon: Star, title: 'Lowest price & ratings', desc: 'Compare and save' },
  { icon: Shield, title: 'Verified & certified', desc: 'NABL, insurance' },
  { icon: Zap, title: 'Book & pay online', desc: 'Slots & invoices' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [city, setCity] = useState('Dehradun');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (city.trim()) params.set('city', city.trim());
    navigate('/search?' + params.toString());
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0B1120] font-sans selection:bg-sky-500/30">
      {/* Subtle organic background focus */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-500/5 dark:bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <main className="w-full max-w-6xl mx-auto px-4 pt-20 pb-24 z-10 flex flex-col items-center">
        {/* HERO SECTION */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Smart recommendations powered by AI
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
            Find best hospitals & lab tests at lowest price near you
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Compare prices, ratings, and book appointments in one place. 
          </p>
        </motion.div>

        {/* SEARCH BAR (Premium Directory Style) */}
        <motion.div
          className="w-full max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row items-center p-2 rounded-3xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-sky-500/50 transition-all transition-duration-300"
          >
            <div className="flex-1 flex items-center w-full px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="X-ray, Blood test, MRI, Full body checkup..."
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white px-3 placeholder:text-slate-400 md:text-lg outline-none"
              />
            </div>
            <div className="w-full md:w-[32%] flex items-center px-4 py-3 md:py-2">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City (optional)"
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white px-3 placeholder:text-slate-400 md:text-lg outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto mt-2 md:mt-0 bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 md:py-3.5 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              Search
            </button>
          </form>
        </motion.div>

        {/* POPULAR SERVICES */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {services.map((s, i) => (
            <Link key={i} to={`/search?q=${encodeURIComponent(s)}`}>
              <span className="inline-block px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-sky-500 hover:text-sky-600 dark:hover:border-sky-400 dark:hover:text-sky-400 transition-all shadow-sm">
                {s}
              </span>
            </Link>
          ))}
        </motion.div>

        {/* FEATURES GRID */}
        <section className="w-full mb-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Why MediCompare?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all group flex flex-col items-center text-center sm:items-start sm:text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform border border-sky-100 dark:border-sky-500/20">
                  <f.icon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-lg leading-snug">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* COMPARE CTA */}
        <section className="w-full">
          <motion.div
            className="w-full rounded-3xl overflow-hidden relative bg-slate-900 dark:bg-slate-800 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 shadow-2xl"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sky-500/20 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 text-center md:text-left mb-8 md:mb-0 max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Compare hospitals side-by-side</h2>
              <p className="text-slate-300 md:text-lg leading-relaxed">
                Select 2–3 hospitals and compare price, distance, rating, and slot availability to make the right choice for your needs.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <Link to="/compare" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-50 px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg">
                  Go to Compare
                </button>
              </Link>
              <Link to="/search?city=Dehradun" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto border-2 border-slate-700 text-white hover:bg-slate-800 px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95">
                  Explore Dehradun
                </button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
