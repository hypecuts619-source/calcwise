import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { CATEGORIES, CALCULATORS } from '../constants.ts';

export function Sitemap() {
  useEffect(() => {
    document.title = "Sitemap & Complete Calculator Directory | CalcWise";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', `Browse our complete directory of ${CALCULATORS.length} specialized calculators on CalcWise. Discover and search through finance, health, math, and conversion tools easily.`);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-16">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-primary/5 rounded-2xl mb-2">
          <Icons.Map className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-heading tracking-tight">
          Directory & Sitemap
        </h1>
        <p className="text-lg text-body leading-relaxed">
          Explore our complete directory of {CALCULATORS.length} specialized calculators organized across {CATEGORIES.length} categories. Find exactly the tool you need for your next decision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CATEGORIES.map(cat => {
          const Icon = (Icons as any)[cat.icon] || Icons.Calculator;
          const calculators = CALCULATORS.filter(c => c.category === cat.id);
          
          return (
            <div key={cat.id} className="card-surface p-8 rounded-3xl border border-slate-200 hover:border-primary/30 transition-all group flex flex-col h-full bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500 pointer-events-none">
                <Icon className="w-32 h-32" />
              </div>
              <div className="flex items-center space-x-4 mb-6 relative z-10">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors duration-300">
                  <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-heading group-hover:text-primary transition-colors">{cat.title}</h2>
                  <p className="text-xs text-body font-medium">{calculators.length} Tools</p>
                </div>
              </div>

              <div className="w-full h-px bg-border my-6 relative z-10"></div>

              <ul className="space-y-4 mb-8 flex-grow relative z-10">
                {calculators.map(calc => (
                  <li key={calc.id} className="flex items-start">
                    <Icons.ChevronRight className="h-4 w-4 text-primary mt-0.5 mr-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    <Link 
                      to={`/calculator/${calc.slug}`}
                      className="text-sm text-heading hover:text-primary font-medium hover:underline leading-tight"
                    >
                      {calc.title}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto pt-4 relative z-10">
                <Link 
                  to={`/category/${cat.id}`}
                  className="inline-flex items-center justify-center w-full py-3 px-4 bg-slate-50 text-sm font-bold text-heading rounded-xl hover:bg-primary hover:text-white transition-all group/btn"
                >
                  View All in {cat.title}
                  <Icons.ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
