import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Header, Footer } from './components/common.tsx';
import { Home } from './pages/Home.tsx';
import { CategoryPage } from './pages/CategoryPage.tsx';
import { CalculatorDetail } from './pages/CalculatorDetail.tsx';
import { Sitemap } from './pages/Sitemap.tsx';
import { FAQPage } from './pages/FAQPage.tsx';
import { About } from './pages/About.tsx';
import { PrivacyPolicy } from './pages/PrivacyPolicy.tsx';
import { CookiePolicy } from './pages/CookiePolicy.tsx';
import { CurrencyProvider } from './context/CurrencyContext.tsx';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -10 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Home /></motion.div>} />
        <Route path="/category/:catId" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><CategoryPage /></motion.div>} />
        <Route path="/calculator/:slug" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><CalculatorDetail /></motion.div>} />
        <Route path="/sitemap" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Sitemap /></motion.div>} />
        <Route path="/faq" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><FAQPage /></motion.div>} />
        <Route path="/about" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><About /></motion.div>} />
        <Route path="/privacy-policy" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><PrivacyPolicy /></motion.div>} />
        <Route path="/cookie-policy" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><CookiePolicy /></motion.div>} />
        <Route path="*" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Home /></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [showConsent, setShowConsent] = React.useState(false);

  React.useEffect(() => {
    const consent = localStorage.getItem('calcwise-consent');
    if (!consent) {
      const timer = setTimeout(() => setShowConsent(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('calcwise-consent', 'true');
    setShowConsent(false);
  };

  return (
    <Router>
      <CurrencyProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
          <Footer />
          
          {/* Cookie Consent Banner */}
          {showConsent && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-in fade-in slide-in-from-bottom-10 duration-700"
            >
              <div className="max-w-4xl mx-auto bg-heading text-white p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 font-sans border border-white/10 backdrop-blur-xl">
                 <div className="space-y-1">
                    <p className="text-sm font-bold">We value your privacy</p>
                    <p className="text-[10px] text-slate-300 leading-relaxed uppercase tracking-widest font-bold">
                      CalcWise uses cookies to personalize ads and analyze traffic. By using our site, you consent to our use of cookies.
                    </p>
                 </div>
                 <div className="flex items-center space-x-6">
                    <button className="text-[10px] font-black uppercase tracking-widest hover:underline cursor-pointer">Settings</button>
                    <button 
                      onClick={handleAccept}
                      className="bg-primary hover:bg-primary-dark px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-primary/20"
                    >
                      Accept All
                    </button>
                 </div>
              </div>
            </motion.div>
          )}
        </div>
      </CurrencyProvider>
    </Router>
  );
}
