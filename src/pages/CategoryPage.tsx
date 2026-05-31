import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { CATEGORIES, CALCULATORS } from '../constants.ts';

export function CategoryPage() {
  const { catId } = useParams();
  const [searchFilter, setSearchFilter] = React.useState('');
  
  const category = CATEGORIES.find(c => c.id === catId);
  const calculators = CALCULATORS.filter(c => c.category === catId);
  const filteredCalculators = calculators.filter(c => c.title.toLowerCase().includes(searchFilter.toLowerCase()) || c.description.toLowerCase().includes(searchFilter.toLowerCase()));

  useEffect(() => {
    if (category) {
      const docTitle = `${category.title} Calculators | CalcWise`;
      document.title = docTitle;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', `Explore our extensive collection of ${calculators.length} precise, free ${category.title.toLowerCase()} calculators. Perfect for fast and accurate calculations.`);
    }
  }, [category, calculators.length]);

  if (!category) {
    return <Navigate to="/" />;
  }

  const Icon = (Icons as any)[category.icon] || Icons.Calculator;

  // CollectionPage Schema
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.title} Calculators`,
    "description": `Explore our collection of precise and free calculators specialized for ${category.title.toLowerCase()}.`,
    "url": `https://calcwise.com/category/${category.id}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": calculators.map((calc, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://calcwise.com/calculator/${calc.slug}`,
        "name": calc.title
      }))
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      {/* Header */}
      <section className="text-center space-y-6">
        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-heading">
          {category.title} <span className="text-primary italic">Tools</span>
        </h1>
        <p className="text-lg text-body max-w-2xl mx-auto mb-8">
          Explore our collection of precise and free calculators specialized for {category.title.toLowerCase()}. Optimized for accuracy and ease of use.
        </p>
        <div className="max-w-md mx-auto relative group">
          <input
            type="text"
            placeholder={`Search ${category.title} calculators...`}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
          <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
        </div>
      </section>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredCalculators.map(calc => (
          <Link 
            key={calc.id} 
            to={`/calculator/${calc.slug}`}
            className="card-surface p-6 md:p-8 hover:border-primary hover:shadow-xl transition-all group h-full flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
               <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded">Featured</span>
               <Icons.ArrowUpRight className="h-4 w-4 text-hint group-hover:text-primary transition-colors" />
            </div>
            <h2 className="text-xl font-display font-bold text-heading mb-4 group-hover:text-primary transition-colors">
              {calc.title}
            </h2>
            <p className="text-sm text-body leading-relaxed flex-grow">
              {calc.description}
            </p>
            <div className="mt-8 pt-6 border-t border-border flex items-center text-xs font-bold text-hint group-hover:text-primary uppercase tracking-widest transition-colors">
              Use Calculator
            </div>
          </Link>
        ))}
        {calculators.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4 bg-slate-50 rounded-3xl border border-dashed border-border">
            <h3 className="text-xl font-bold text-heading">Coming Soon!</h3>
            <p className="text-sm text-body">We are currently building more {category.title.toLowerCase()} calculators. Check back soon.</p>
          </div>
        )}
      </div>

      {/* General FAQ */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-display font-bold text-heading">General FAQ</h2>
          <p className="text-body max-w-2xl mx-auto">Common questions about our {category.title.toLowerCase()} calculators.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-surface p-6 border border-border/50">
            <h3 className="font-bold text-heading mb-3 flex items-start gap-2">
              <Icons.HelpCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
              Are these calculators free to use?
            </h3>
            <p className="text-sm text-body leading-relaxed pl-6">Yes, all calculators on CalcWise are 100% free with no registration or hidden fees required. Our core objective is to ensure that critical mathematical utilities remain freely accessible to anyone globally.</p>
          </div>
          <div className="card-surface p-6 border border-border/50">
            <h3 className="font-bold text-heading mb-3 flex items-start gap-2">
              <Icons.HelpCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
              How accurate are the results?
            </h3>
            <p className="text-sm text-body leading-relaxed pl-6">We use industry-standard formulas for all our calculations, heavily tested against global algorithmic standards. However, results should primarily be used as robust estimates; please consult a licensed professional for highly critical financial, legal, or authoritative decisions.</p>
          </div>
          <div className="card-surface p-6 border border-border/50">
            <h3 className="font-bold text-heading mb-3 flex items-start gap-2">
              <Icons.HelpCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
              Can I use these on my mobile device?
            </h3>
            <p className="text-sm text-body leading-relaxed pl-6">Absolutely! Our platform is fully responsive and specifically structurally optimized to work perfectly on modern smartphones, portable tablets, and traditional desktop web browsers without any degradation in numerical or visual performance.</p>
          </div>
          <div className="card-surface p-6 border border-border/50">
            <h3 className="font-bold text-heading mb-3 flex items-start gap-2">
              <Icons.HelpCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
              Is my personal calculation data structurally saved?
            </h3>
            <p className="text-sm text-body leading-relaxed pl-6">We categorically do not store any identifying calculation data on our private backend infrastructure. Almost all computation inherently occurs purely locally within your personal browser runtime engine to strictly ensure maximum data privacy.</p>
          </div>
        </div>
      </section>

      {/* Comprehensive Category Overview SEO Block */}
      <section className="bg-slate-50 p-8 md:p-12 rounded-3xl border border-border/50 shadow-sm mt-16 space-y-6">
        <h2 className="text-3xl font-display font-bold text-heading mb-8">Understanding {category.title} Calculations</h2>
        <div className="prose prose-slate max-w-none text-body">
          <p className="mb-4">
            Navigating the complex world of {category.title.toLowerCase()} requires precise and accurate calculations. Our dedicated suite of advanced {category.title.toLowerCase()} calculators are expertly designed to simplify intimidating mathematical equations.
          </p>
          <p className="mb-4">
            Whether you are an industry professional checking critical estimates, a dedicated university student studying for finals, or just someone looking to simplify daily tasks, accurate math forms the foundation of reliable success. A tiny miscalculation can cascade into larger issues, which is why our platform integrates robust, verified algorithmic logic capable of parsing multiple independent variables safely.
          </p>
          <p className="mb-4">
            Beyond just providing the final result, we highlight the core formulas enabling you to cultivate a deeper understanding of the dynamics behind these calculations. Stay assured that our tools are maintained explicitly to adapt and remain relevant.
          </p>
        </div>
      </section>
    </div>
  );
}
