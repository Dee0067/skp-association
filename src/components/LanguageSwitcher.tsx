'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center bg-skp-navy-card/90 border border-skp-navy-border/80 rounded-lg p-0.5 shadow-md font-mono text-xs ${className}`}>
      <div className="flex items-center px-2 py-1 text-slate-400 border-r border-skp-navy-border/60">
        <Globe className="w-3.5 h-3.5 mr-1 text-skp-cyan" />
        <span className="text-[10px] uppercase tracking-wider hidden sm:inline">Lang</span>
      </div>

      <div className="flex items-center space-x-0.5 pl-1">
        <button
          type="button"
          onClick={() => setLanguage('th')}
          aria-label="Switch to Thai language"
          className={`px-2.5 py-1 rounded transition-all duration-200 font-semibold text-xs ${
            language === 'th'
              ? 'bg-skp-cyan text-skp-navy-dark shadow-sm font-bold'
              : 'text-slate-400 hover:text-white hover:bg-skp-navy-light/50'
          }`}
        >
          TH
        </button>

        <button
          type="button"
          onClick={() => setLanguage('en')}
          aria-label="Switch to English language"
          className={`px-2.5 py-1 rounded transition-all duration-200 font-semibold text-xs ${
            language === 'en'
              ? 'bg-skp-cyan text-skp-navy-dark shadow-sm font-bold'
              : 'text-slate-400 hover:text-white hover:bg-skp-navy-light/50'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}
