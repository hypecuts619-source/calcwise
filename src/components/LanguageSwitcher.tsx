import React, { useEffect, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "zh-CN", label: "中文" },
  { code: "hi", label: "हिन्दी" },
  { code: "ar", label: "العربية" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" },
  { code: "ja", label: "日本語" },
];

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    // Check initial cookie to set the dropdown state
    const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]+)/);
    if (match) {
      const parts = match[1].split("/");
      if (parts.length > 2) {
        setCurrentLang(parts[2]);
      }
    }

    if (
      typeof window !== "undefined" &&
      !document.getElementById("google-translate-script")
    ) {
      window.googleTranslateElementInit = () => {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: LANGUAGES.map((l) => l.code).join(","),
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            "google_translate_element"
          );
        }
      };

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setCurrentLang(lang);
    
    // Manage cookies with SameSite=None and Secure so it works in the preview iframe
    const domain = window.location.hostname;
    
    if (lang === "en") {
      const domains = [window.location.hostname, `.${window.location.hostname}`, ""];
      domains.forEach(d => {
        const domainProp = d ? `domain=${d}; ` : "";
        document.cookie = `googtrans=; ${domainProp}expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0; path=/;`;
        document.cookie = `googtrans=; ${domainProp}expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0; path=/; SameSite=None; Secure`;
      });
      // Try to remove from other paths if any
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0; path=${window.location.pathname};`;
    } else {
      document.cookie = `googtrans=/en/${lang}; path=/; SameSite=None; Secure`;
      if (domain !== "localhost") {
        document.cookie = `googtrans=/en/${lang}; domain=${domain}; path=/; SameSite=None; Secure`;
      }
    }
    
    // Reload page to apply translation from the cookie
    window.location.reload();
  };

  return (
    <div className="flex items-center space-x-1.5 md:space-x-2 relative group lang-switcher-container">
      <Globe className="w-5 h-5 text-heading hidden sm:block" />
      
      <div className="relative notranslate" translate="no">
        <select 
          value={currentLang} 
          onChange={handleChange}
          className="appearance-none bg-white border border-border text-heading text-sm py-1.5 pl-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium notranslate"
          translate="no"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code} className="notranslate" translate="no">
              {lang.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-hint">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {/* Hidden original Google widget */}
      <div id="google_translate_element" className="absolute opacity-0 pointer-events-none -z-50 w-0 h-0 overflow-hidden" />
    </div>
  );
}
