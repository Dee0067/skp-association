'use client';

import React from 'react';
import { ShieldCheck, Phone, Smartphone, Printer, MapPin, ArrowUp, Zap, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations';

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language].footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-skp-navy-dark border-t border-skp-navy-border text-slate-400 text-xs">
      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Corporate Profile */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-1 rounded border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/logo.png" 
                  alt="SKP Association" 
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div>
                <span className="block text-sm font-bold text-white tracking-wide">
                  {t.companyName}
                </span>
                <span className="block text-[11px] text-slate-400 font-mono">
                  {t.companyNameEn}
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-300">
              {t.desc}
            </p>

            <div className="p-3 rounded-lg bg-skp-navy-card border border-skp-navy-border font-mono text-[11px] space-y-1">
              <div className="text-skp-cyan font-semibold flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                {t.taxId}
              </div>
              <div className="text-slate-400">{t.incorporation}</div>
            </div>
          </div>

          {/* Col 2: Engineering Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              {t.servicesTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#services" className="hover:text-skp-cyan transition-colors block">
                  {t.service1}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-skp-cyan transition-colors block">
                  {t.service2}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-skp-cyan transition-colors block">
                  {t.service3}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-skp-cyan transition-colors block">
                  {t.service4}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-skp-cyan transition-colors block">
                  {t.service5}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-skp-cyan transition-colors block">
                  {t.service6}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Headquarters */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              {t.hqTitle}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-skp-red shrink-0 mt-0.5" />
                <a 
                  href="https://www.google.com/maps?q=13.830666,100.635479"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-skp-cyan transition-colors leading-relaxed group"
                  title="เปิดดูตำแหน่งปักหมุดบน Google Maps (13.830666, 100.635479)"
                >
                  <span>{t.hqAddress}</span>
                  <span className="block text-[11px] text-skp-cyan font-mono mt-0.5 group-hover:underline">
                    {t.gpsCoords}
                    <ExternalLink className="w-3 h-3 inline-block ml-1 opacity-70 group-hover:opacity-100" />
                  </span>
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <Smartphone className="w-4 h-4 text-skp-cyan shrink-0 mt-0.5" />
                <div>
                  <span>{t.mobileLabel} <a href="tel:0936956445" className="font-mono text-white hover:text-skp-cyan font-bold">093-695-6445</a></span>
                  <span className="block text-[11px] text-slate-300">{t.managerName}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{t.officeLabel} <a href="tel:021164125" className="font-mono text-slate-200 hover:text-skp-cyan font-semibold">02-116-4125</a></span>
              </div>
              <div className="flex items-center space-x-2">
                <Printer className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{t.faxLabel} <span className="font-mono text-slate-300">02-116-4126</span></span>
              </div>
              <div className="pt-2 text-[11px] text-slate-400">
                {t.businessHours}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-skp-navy-border/60 bg-skp-navy-deep py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left text-[11px] text-slate-400">
            © {new Date().getFullYear()} {language === 'en' ? 'SKP Association Co., Ltd. ' : 'บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด (SKP Association Co., Ltd.) '}{t.rightsReserved}
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <a href="#credentials" className="hover:text-skp-cyan transition-colors">
              {t.standardsLink}
            </a>
            <a href="#contact" className="hover:text-skp-cyan transition-colors">
              {t.contactLink}
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center text-skp-cyan hover:text-white transition-colors"
            >
              <span>{t.backToTop}</span>
              <ArrowUp className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
