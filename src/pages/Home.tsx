import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, CALCULATORS } from '../constants.ts';
import { calculateEMI } from '../lib/calculatorLogic.ts';
import { CalculatorWidget } from '../components/calculator.tsx';
import { CalculatorMetadata } from '../types.ts';

const HERO_WORDS = ['Every', 'Financial', 'Healthy', 'Math', 'Lifestyle'];

export function Home() {
  const navigate = useNavigate();
  const [wordIndex, setWordIndex] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CalculatorMetadata[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "CalcWise | Free Online Calculators for Finance, Health, Math & More";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'CalcWise is the ultimate free online directory of 360+ accurate, specialized calculators. Calculate mortgage, loan EMI, BMI, simple interest, date differences, and more with instant formulas and charts.');

    try {
      const hStr = localStorage.getItem('calcwise_history');
      if (hStr) setHistory(JSON.parse(hStr));
    } catch(e) {}
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const results = CALCULATORS.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      ).slice(0, 8);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % HERO_WORDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-32 pb-24 md:pb-32 overflow-hidden bg-white border-b border-border">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-70"></div>
        <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYtbmgydi0yaC0ydi0yaDJ2LTJoLTh2MmgydjJoLTJ2MmgtdjJoMnYyaC0ydjJoMnYyaDJ2LTJoMnYtMmgtdi0yaDJ6bS0yIDBoLTJ2LTJoMnYyem0tNCAwSDMwdjJoNHYtMnoiIGZpbGw9IiM2NDc0OGIiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvZz48L3N2Zz4=')] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto space-y-10"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/5 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-primary/10 shadow-sm">
              <Icons.Sparkles className="h-4 w-4" />
              <span>{CALCULATORS.length}+ Free Specialized Tools</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-heading leading-[1.1] tracking-tight">
              Global Calculators for <br/>
              <span className="inline-grid items-center justify-items-center">
                <span className="invisible col-start-1 row-start-1 italic px-2">Financial</span>
                <AnimatePresence>
                  <motion.span
                    key={wordIndex}
                    initial={{ y: 35, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -35, opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                    className="col-start-1 row-start-1 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 italic px-2 block"
                  >
                    {HERO_WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              Decisions.
            </h1>
            
            <p className="text-xl md:text-2xl text-body max-w-2xl mx-auto leading-relaxed">
              Instant, accurate, and free. Specialized tools for personal finance, math, health, and construction used by millions worldwide.
            </p>

            {/* Clear Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <div className="relative w-full max-w-md" ref={searchRef}>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search for a calculator..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => { if (searchQuery.trim().length > 0) setShowResults(true); }}
                    className="w-full pl-14 pr-4 py-5 bg-white border-2 border-slate-200 rounded-2xl text-lg focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-md group-focus-within:border-primary"
                  />
                  <Icons.Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>

                {/* Search Results Dropdown */}
                {showResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border shadow-2xl rounded-2xl overflow-hidden z-50 text-left">
                    {searchResults.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto py-2">
                        {searchResults.map((calc) => (
                          <Link
                            key={calc.id}
                            to={`/calculator/${calc.slug}`}
                            className="block px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                            onClick={() => { setSearchQuery(''); setShowResults(false); }}
                          >
                            <div className="font-bold text-heading text-sm">{calc.title}</div>
                            <div className="text-xs text-hint line-clamp-1">{calc.description}</div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-sm text-hint text-center font-medium">
                        No tools found matching your search.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <a href="#categories" className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-5 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap">
                <Icons.Layers className="h-6 w-6" />
                <span>Browse Directory</span>
              </a>
            </div>

            {/* Top 10 Global Calculators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="pt-12"
            >
              <p className="text-sm text-hint font-medium mb-4 uppercase tracking-widest">Top 10 Globally Used</p>
              <div className="flex flex-wrap justify-center gap-3">
                {CALCULATORS.slice(0, 10).map((calc, idx) => {
                  return (
                    <Link 
                      key={calc.id} 
                      to={`/calculator/${calc.slug}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-md transition-all group"
                    >
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">#{idx + 1}</span>
                      <span className="text-sm font-bold text-heading group-hover:text-primary transition-colors">{calc.title}</span>
                      <Icons.ArrowUpRight className="h-3 w-3 text-slate-300 group-hover:text-primary transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </motion.div>

            {/* History Section */}
            {history.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-8"
              >
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Icons.History className="h-4 w-4 text-primary" />
                  <p className="text-sm text-hint font-medium uppercase tracking-widest">Recently Used by You</p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {history.map((item, idx) => (
                    <Link 
                      key={item.id + idx} 
                      to={`/calculator/${item.slug}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl hover:border-primary hover:shadow-md transition-all group"
                    >
                      <span className="text-sm font-bold text-heading group-hover:text-primary transition-colors">{item.title}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Popular Section - High Priority */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Icons.TrendingUp className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-display font-bold text-heading">Popular calculators</h2>
          </div>
          <Link to="/sitemap" className="text-primary text-sm font-bold hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {CALCULATORS.slice(0, 8).map(calc => (
            <Link 
              key={calc.id} 
              to={`/calculator/${calc.slug}`}
              className="card-surface p-6 border border-border hover:border-primary transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] bg-slate-100 text-hint px-2 py-0.5 rounded font-bold uppercase">{calc.category}</span>
                <Icons.ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-display font-bold text-heading group-hover:text-primary transition-colors mb-2">{calc.title}</h3>
              <p className="text-xs text-body line-clamp-2 leading-relaxed">{calc.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {history.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 border-t border-slate-100 pt-16">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-display font-bold text-heading flex items-center gap-2">
               <Icons.History className="h-5 w-5 text-primary" />
               Jump Back In
             </h2>
             <button 
               onClick={() => { localStorage.removeItem('calcwise_history'); setHistory([]); }}
               className="text-xs font-bold text-hint hover:text-red-500 uppercase tracking-widest transition-colors"
             >
               Clear History
             </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {history.slice(0, 4).map(h => (
              <Link 
                key={h.id} 
                to={`/calculator/${h.slug}`}
                className="card-surface p-4 border border-border hover:border-primary transition-all group flex items-center gap-3"
              >
                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                  <Icons.Calculator className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-bold text-heading group-hover:text-primary transition-colors line-clamp-1">{h.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Categories with SEO Descriptions */}
      <section id="categories" className="max-w-7xl mx-auto px-4 border-t border-slate-100 pt-16">
        <div className="mb-12">
          <h2 className="text-3xl font-display font-bold text-heading mb-4">Explore by Category</h2>
          <p className="text-body text-base max-w-2xl">From complex financial planning to simple everyday conversions, we've organized our tools to help you find answers faster.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[220px]">
          {CATEGORIES.slice(0, 8).map((cat, idx) => {
             const Icon = (Icons as any)[cat.icon] || Icons.Calculator;
             const isWide = idx === 0 || idx === 3 || idx === 4 || idx === 7;
             
             return (
               <Link 
                 key={cat.id} 
                 to={`/category/${cat.id}`}
                 className={`group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 h-full flex flex-col justify-between ${isWide ? 'lg:col-span-2' : 'lg:col-span-1'}`}
               >
                 {/* Decorative background blur gradient */}
                 <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500"></div>

                 <div className="relative z-10 w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                   <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                 </div>
                 
                 <div className="relative z-10 space-y-2 mt-auto">
                   <h3 className="text-xl font-display font-bold text-heading group-hover:text-primary transition-colors">{cat.title}</h3>
                   {isWide && (
                     <p className="text-sm text-body leading-relaxed group-hover:text-heading/80 transition-colors line-clamp-2 max-w-sm">
                       {(cat as any).description || `Comprehensive tools for ${cat.title.toLowerCase()} used by global professionals.`}
                     </p>
                   )}
                   <div className="pt-2 flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Explore Tools <Icons.ArrowRight className="h-4 w-4 ml-1" />
                   </div>
                 </div>
               </Link>
             );
          })}
        </div>
        {CATEGORIES.length > 8 && (
          <div className="text-center mt-12">
            <Link to="/sitemap" className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white border-2 border-slate-200 text-heading rounded-xl font-bold hover:border-primary hover:text-primary transition-all">
              <span>View All {CATEGORIES.length} Categories</span>
              <Icons.ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* Recently Added Section */}
      <section className="bg-slate-900 py-24 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">New Arrival</div>
              <h2 className="text-4xl font-display font-bold">Recently Added Tools</h2>
              <p className="text-slate-400 max-w-xl">We add new specialized calculators every week based on user requests and global financial trends.</p>
            </div>
            <Link to="/sitemap" className="text-primary font-bold flex items-center hover:translate-x-1 transition-transform">
              Browse Full Catalog <Icons.ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {CALCULATORS.filter(c => c.priority === 'P1').slice(4, 7).map(calc => (
              <Link 
                key={calc.id} 
                to={`/calculator/${calc.slug}`}
                className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl hover:bg-white/10 transition-all hover:border-primary/50 group"
              >
                <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                  <Icons.Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">{calc.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">{calc.description}</p>
                <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-primary">
                  Try Now <Icons.ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured EMI Quick Calculator Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-primary/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-16 flex flex-col lg:flex-row items-center gap-8 md:gap-16 border border-primary/10">
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest leading-none">
              Top Tool This Week
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-heading leading-tight">
              Plan your home or car loan in seconds.
            </h2>
            <p className="text-body text-lg leading-relaxed">
              Our advanced EMI calculator helps you visualize your repayment schedule and interest costs instantly. No hidden fees, no data collection.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <Icons.ShieldCheck className="h-5 w-5 text-green-500" />
                </div>
                <span className="block text-lg font-bold text-heading">100% Secure</span>
                <p className="text-xs text-hint italic leading-relaxed">We never store your financial data on our servers.</p>
              </div>
              <div className="space-y-2">
                <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <Icons.Globe2 className="h-5 w-5 text-blue-500" />
                </div>
                <span className="block text-lg font-bold text-heading">Global Ready</span>
                <p className="text-xs text-hint italic leading-relaxed">Adjust currencies and tax systems with one click.</p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="bg-white p-2 rounded-3xl shadow-2xl shadow-primary/10 border border-slate-100">
              <CalculatorWidget
                id="quick-emi"
                title="Quick EMI Calculator"
                inputs={[
                  { label: 'Loan Amount', name: 'principal', type: 'number', defaultValue: 100000, unit: '$' },
                  { label: 'Interest Rate', name: 'rate', type: 'number', defaultValue: 7.5, unit: '%' },
                  { label: 'Tenure', name: 'tenure', type: 'number', defaultValue: 5, unit: 'Years' },
                  { label: 'Unit', name: 'tenureUnit', type: 'select', defaultValue: 'years', options: [{ label: 'Years', value: 'years' }, { label: 'Months', value: 'months' }] }
                ]}
                onCalculate={calculateEMI}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 pt-16">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-display font-bold text-heading">Frequently Asked Questions</h2>
          <p className="text-body max-w-2xl mx-auto">Everything you need to know about using CalcWise tools for your daily decisions.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="card-surface p-6 md:p-8 border border-slate-100">
            <h3 className="font-bold text-heading mb-4 flex items-center gap-2">
              <Icons.HelpCircle className="h-5 w-5 text-primary" />
              Do I need an account?
            </h3>
            <p className="text-sm text-body leading-relaxed">No. CalcWise is committed to privacy and speed. Every tool is accessible instantly without any login or registration.</p>
          </div>
          <div className="card-surface p-6 md:p-8 border border-slate-100">
            <h3 className="font-bold text-heading mb-4 flex items-center gap-2">
              <Icons.HelpCircle className="h-5 w-5 text-primary" />
              Is it accurate for my country?
            </h3>
            <p className="text-sm text-body leading-relaxed">Most of our tools use universal mathematical logic. For region-specific tools (like taxes), we provide local adaptation tips on the detail pages.</p>
          </div>
          <div className="card-surface p-6 md:p-8 border border-slate-100">
            <h3 className="font-bold text-heading mb-4 flex items-center gap-2">
              <Icons.HelpCircle className="h-5 w-5 text-primary" />
              Can I suggest a new tool?
            </h3>
            <p className="text-sm text-body leading-relaxed">Yes! We are constantly expanding our collection to reach 100+ calculators. Use our footer links to suggest a new feature.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
