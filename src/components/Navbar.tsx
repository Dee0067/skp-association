'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Phone, Menu, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language].nav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Main Navigation Bar */}
      <nav className={`transition-all duration-300 px-4 lg:px-8 ${
        isScrolled 
          ? 'bg-skp-navy-deep/95 backdrop-blur-md shadow-xl shadow-black/40 py-2.5 border-b border-skp-navy-border' 
          : 'bg-gradient-to-b from-skp-navy-deep/90 to-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Corporate Title */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="relative bg-white p-1 rounded-md shadow-md border border-slate-200/20 group-hover:shadow-skp-cyan/20 transition-all">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด" 
                className="h-10 md:h-12 w-auto object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <span className="block text-sm md:text-base font-bold text-white tracking-wide group-hover:text-skp-cyan transition-colors">
                {language === 'en' ? 'SKP Association Co., Ltd.' : 'บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด'}
              </span>
              <span className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                {language === 'en' ? 'Turnkey M&E Engineering Contractor' : 'SKP Association Co., Ltd. (M&E Engineering)'}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-7 text-sm font-medium">
            <a href="#services" className="text-slate-200 hover:text-skp-cyan transition-colors flex items-center">
              {t.services}
            </a>
            <a href="#schematic" className="text-slate-200 hover:text-skp-cyan transition-colors flex items-center">
              {t.schematic}
            </a>
            <a href="#portfolio" className="text-slate-200 hover:text-skp-cyan transition-colors flex items-center">
              {t.portfolio}
            </a>
            <a href="#credentials" className="text-slate-200 hover:text-skp-cyan transition-colors flex items-center">
              {t.credentials}
            </a>
            <a href="#contact" className="text-slate-200 hover:text-skp-cyan transition-colors flex items-center">
              {t.contact}
            </a>
          </div>

          {/* Desktop Actions: Quote Button & Language Switcher */}
          <div className="hidden md:flex items-center space-x-3">
            <a 
              href="#contact" 
              className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium tracking-wide text-white bg-skp-red hover:bg-skp-red-hover rounded-md shadow-lg shadow-skp-red/25 border border-skp-red-hover transition-all duration-200 group overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                {t.requestQuote}
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>

            <LanguageSwitcher />
          </div>

          {/* Mobile Right Controls: Language Switcher & Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <LanguageSwitcher />
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-skp-navy-light focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-skp-navy-border bg-skp-navy-card/95 backdrop-blur-lg rounded-xl p-4 shadow-2xl animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-3 text-sm">
              <a 
                href="#services" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-skp-navy-light text-slate-200"
              >
                {t.services}
              </a>
              <a 
                href="#schematic" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-skp-navy-light text-slate-200"
              >
                {t.schematic}
              </a>
              <a 
                href="#portfolio" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-skp-navy-light text-slate-200"
              >
                {t.portfolio}
              </a>
              <a 
                href="#credentials" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-skp-navy-light text-slate-200"
              >
                {t.credentials}
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-skp-navy-light text-slate-200"
              >
                {t.contact}
              </a>
              <div className="pt-2 border-t border-skp-navy-border">
                <a 
                  href="tel:0936956445"
                  className="flex items-center justify-center py-2.5 px-4 mb-2 bg-skp-navy-light text-skp-cyan rounded-md font-mono text-xs hover:bg-skp-navy-card transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2 text-skp-cyan" />
                  093-695-6445 ({t.managerContact})
                </a>
                <a 
                  href="tel:021164125"
                  className="flex items-center justify-center py-2 px-4 mb-2 bg-skp-navy-deep text-slate-300 rounded-md font-mono text-xs hover:bg-skp-navy-card transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
                  {t.officeContact}: 02-116-4125
                </a>
                <a 
                  href="#contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 px-4 bg-skp-red hover:bg-skp-red-hover text-white rounded-md font-medium text-center shadow-md"
                >
                  {t.requestQuoteMobile}
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
