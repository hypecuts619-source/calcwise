import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X, Calculator, Globe, ChevronDown } from "lucide-react";
import * as Icons from "lucide-react";
import { CATEGORIES, CALCULATORS } from "../constants.ts";
import { CalculatorMetadata } from "../types.ts";
import { cn } from "../lib/utils.ts";
import {
  useCurrency,
  SUPPORTED_CURRENCIES,
} from "../context/CurrencyContext.tsx";
import { LanguageSwitcher } from "./LanguageSwitcher.tsx";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { symbol, code, setCurrency } = useCurrency();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CalculatorMetadata[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const results = CALCULATORS.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q),
      ).slice(0, 5);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectCalculator = (slug: string) => {
    setSearchQuery("");
    setShowResults(false);
    navigate(`/calculator/${slug}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-border shadow-sm shadow-slate-100/50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8 xl:space-x-12">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-display font-extrabold text-heading">
                Calc<span className="text-primary">Wise</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group/nav py-6">
              <button className="flex items-center space-x-1.5 text-base font-semibold text-heading hover:text-primary transition-colors whitespace-nowrap">
                <span>Calculators</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover/nav:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-[80px] left-0 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-50">
                <div className="w-[600px] bg-white border border-border rounded-2xl shadow-xl p-4 grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = Icons[
                      cat.icon as keyof typeof Icons
                    ] as React.ElementType;
                    return (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.id}`}
                        className="flex items-start space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/link"
                      >
                        <div className="bg-primary/10 p-2.5 rounded-lg text-primary group-hover/link:bg-primary group-hover/link:text-white transition-colors">
                          {Icon && <Icon className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="text-[15px] font-bold text-heading mb-0.5 group-hover/link:text-primary transition-colors">
                            {cat.title}
                          </div>
                          <div className="text-sm text-hint">
                            {
                              CALCULATORS.filter((c) => c.category === cat.id)
                                .length
                            }{" "}
                            tools
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative group/cat py-6">
              <NavLink
                to="/category/finance"
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-1 text-base font-semibold hover:text-primary transition-colors whitespace-nowrap",
                    isActive ? "text-primary" : "text-heading",
                  )
                }
              >
                <span>Finance</span>
                <ChevronDown className="h-3 w-3 opacity-50 transition-transform group-hover/cat:rotate-180" />
              </NavLink>
              <div className="absolute top-[80px] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 z-50">
                <div className="w-[280px] bg-white border border-border rounded-2xl shadow-xl p-2 flex flex-col">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-hint">Top Finance Tools</div>
                  {CALCULATORS.filter(c => c.category === 'finance').slice(0, 6).map(calc => (
                    <Link key={calc.id} to={`/calculator/${calc.slug}`} className="px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group/link">
                      <div className="text-sm font-bold text-heading group-hover/link:text-primary transition-colors truncate">{calc.title}</div>
                    </Link>
                  ))}
                  <div className="h-px bg-border my-1"></div>
                  <Link to="/category/finance" className="px-3 py-2.5 text-xs font-bold text-primary group-hover:text-primary/80 transition-colors flex items-center justify-center hover:bg-primary/5 rounded-xl">
                    Explore All Finance <Icons.ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group/cat py-6">
              <NavLink
                to="/category/health"
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-1 text-base font-semibold hover:text-primary transition-colors whitespace-nowrap",
                    isActive ? "text-primary" : "text-heading",
                  )
                }
              >
                <span>Health</span>
                <ChevronDown className="h-3 w-3 opacity-50 transition-transform group-hover/cat:rotate-180" />
              </NavLink>
              <div className="absolute top-[80px] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 z-50">
                <div className="w-[280px] bg-white border border-border rounded-2xl shadow-xl p-2 flex flex-col">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-hint">Top Health Tools</div>
                  {CALCULATORS.filter(c => c.category === 'health').slice(0, 6).map(calc => (
                    <Link key={calc.id} to={`/calculator/${calc.slug}`} className="px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group/link">
                      <div className="text-sm font-bold text-heading group-hover/link:text-primary transition-colors truncate">{calc.title}</div>
                    </Link>
                  ))}
                  <div className="h-px bg-border my-1"></div>
                  <Link to="/category/health" className="px-3 py-2.5 text-xs font-bold text-primary group-hover:text-primary/80 transition-colors flex items-center justify-center hover:bg-primary/5 rounded-xl">
                    Explore All Health <Icons.ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group/cat py-6">
              <NavLink
                to="/category/math"
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-1 text-base font-semibold hover:text-primary transition-colors whitespace-nowrap",
                    isActive ? "text-primary" : "text-heading",
                  )
                }
              >
                <span>Math</span>
                <ChevronDown className="h-3 w-3 opacity-50 transition-transform group-hover/cat:rotate-180" />
              </NavLink>
              <div className="absolute top-[80px] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 z-50">
                <div className="w-[280px] bg-white border border-border rounded-2xl shadow-xl p-2 flex flex-col">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-hint">Top Math Tools</div>
                  {CALCULATORS.filter(c => c.category === 'math').slice(0, 6).map(calc => (
                    <Link key={calc.id} to={`/calculator/${calc.slug}`} className="px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group/link">
                      <div className="text-sm font-bold text-heading group-hover/link:text-primary transition-colors truncate">{calc.title}</div>
                    </Link>
                  ))}
                  <div className="h-px bg-border my-1"></div>
                  <Link to="/category/math" className="px-3 py-2.5 text-xs font-bold text-primary group-hover:text-primary/80 transition-colors flex items-center justify-center hover:bg-primary/5 rounded-xl">
                    Explore All Math <Icons.ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group/cat py-6">
              <NavLink
                to="/category/lifestyle"
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-1 text-base font-semibold hover:text-primary transition-colors whitespace-nowrap",
                    isActive ? "text-primary" : "text-heading",
                  )
                }
              >
                <span>Lifestyle</span>
                <ChevronDown className="h-3 w-3 opacity-50 transition-transform group-hover/cat:rotate-180" />
              </NavLink>
              <div className="absolute top-[80px] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 z-50">
                <div className="w-[280px] bg-white border border-border rounded-2xl shadow-xl p-2 flex flex-col">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-hint">Top Lifestyle Tools</div>
                  {CALCULATORS.filter(c => c.category === 'lifestyle').slice(0, 6).map(calc => (
                    <Link key={calc.id} to={`/calculator/${calc.slug}`} className="px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group/link">
                      <div className="text-sm font-bold text-heading group-hover/link:text-primary transition-colors truncate">{calc.title}</div>
                    </Link>
                  ))}
                  <div className="h-px bg-border my-1"></div>
                  <Link to="/category/lifestyle" className="px-3 py-2.5 text-xs font-bold text-primary group-hover:text-primary/80 transition-colors flex items-center justify-center hover:bg-primary/5 rounded-xl">
                    Explore All Lifestyle <Icons.ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center space-x-2 xl:space-x-4">
            <LanguageSwitcher />

              <div className="relative hidden xl:block" ref={searchRef}>
                <div className="relative flex items-center">
                  <input
                    id="global-search-input"
                    type="text"
                    placeholder="Search calculators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (searchQuery.trim().length > 0) setShowResults(true);
                    }}
                    className="pl-10 pr-14 py-2 bg-slate-100 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all w-64 placeholder:text-slate-400"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <div className="absolute right-3 flex items-center pointer-events-none">
                    <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200">⌘K</span>
                  </div>
                </div>

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-border shadow-xl rounded-xl overflow-hidden z-50">
                  {searchResults.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto py-2">
                      {searchResults.map((calc) => (
                        <button
                          key={calc.id}
                          onClick={() => handleSelectCalculator(calc.slug)}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex flex-col"
                        >
                          <span className="text-sm font-bold text-heading">
                            {calc.title}
                          </span>
                          <span className="text-xs text-hint truncate">
                            {calc.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-hint text-center">
                      No calculators found.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <select
                value={code}
                onChange={(e) => {
                  const selected = SUPPORTED_CURRENCIES.find((c) => c.code === e.target.value);
                  if (selected) setCurrency(selected.symbol, selected.code);
                }}
                className="appearance-none bg-slate-100 border border-transparent text-heading text-xs font-bold py-1.5 pl-8 pr-8 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/20 transition-all cursor-pointer"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-hint">
                <ChevronDown className="h-3 w-3" />
              </div>
            </div>

            <button
              className="lg:hidden p-2 text-body hover:text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-border animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="block px-3 py-4 text-base font-medium text-heading hover:bg-slate-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <Calculator className="h-6 w-6 text-primary" />
              <span className="text-xl font-display font-extrabold text-heading">
                CalcWise
              </span>
            </Link>
            <p className="text-sm text-body leading-relaxed">
              CalcWise is your definitive source for free, accurate, and
              globally adapted calculators. From finance to health, we make
              complex math simple for everyone.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 col-span-1 md:col-span-2 gap-8">
            <div>
              <h4 className="font-display font-bold text-heading mb-6">
                Calculators
              </h4>
              <ul className="space-y-4 text-sm">
                {CATEGORIES.slice(0, 4).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.id}`}
                      className="hover:text-primary"
                    >
                      {cat.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-heading mb-6">
                Company
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/cookie-policy">Cookie Policy</Link>
                </li>
                <li>
                  <Link to="/faq">FAQ</Link>
                </li>
                <li>
                  <Link to="/sitemap">Sitemap</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-hint">
          <p>© {new Date().getFullYear()} CalcWise. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 italic">
            <span>Free financial tools for a global audience.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
