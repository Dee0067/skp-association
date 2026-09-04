'use client';

import React from 'react';
import { 
  ShieldCheck, 
  FileCheck, 
  Award, 
  Building, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Printer, 
  Calendar, 
  Lock, 
  Download 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations';

export default function CredentialsSection() {
  const { language } = useLanguage();
  const t = translations[language].credentials;

  return (
    <section id="credentials" className="py-20 lg:py-28 bg-skp-navy-dark relative overflow-hidden border-t border-skp-navy-border">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-skp-cyan/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-skp-navy-card border border-skp-navy-border text-xs font-mono text-skp-cyan">
            <ShieldCheck className="w-3.5 h-3.5 text-skp-cyan" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Corporate Profile Card & Standards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Official Registration Certificate Card */}
          <div className="lg:col-span-6 bg-skp-navy-card rounded-2xl border border-skp-navy-border p-6 sm:p-8 shadow-2xl relative flex flex-col justify-between tech-border">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-skp-navy-border">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-skp-navy-deep border border-skp-navy-border">
                    <FileCheck className="w-6 h-6 text-skp-cyan" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{t.regTitle}</h3>
                    <p className="text-xs font-mono text-slate-400">{t.regSub}</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-800 text-[11px] font-mono text-emerald-400 font-semibold">
                  <Lock className="w-3 h-3 mr-1" />
                  {t.verifiedActive}
                </span>
              </div>

              {/* Data Table */}
              <div className="mt-6 space-y-4 text-xs sm:text-sm font-mono">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-skp-navy-border/60">
                  <span className="text-slate-400">{t.nameThLabel}</span>
                  <span className="font-bold text-white mt-0.5 sm:mt-0 font-sans">{t.nameThValue}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-skp-navy-border/60">
                  <span className="text-slate-400">{t.nameEnLabel}</span>
                  <span className="font-bold text-white mt-0.5 sm:mt-0">{t.nameEnValue}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-skp-navy-border/60">
                  <span className="text-slate-400">{t.taxIdLabel}</span>
                  <span className="font-bold text-skp-cyan mt-0.5 sm:mt-0 text-base">0105554136205</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-skp-navy-border/60">
                  <span className="text-slate-400">{t.regDateLabel}</span>
                  <span className="font-bold text-white mt-0.5 sm:mt-0">{t.regDateValue}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-skp-navy-border/60">
                  <span className="text-slate-400">{t.businessTypeLabel}</span>
                  <span className="font-bold text-slate-200 mt-0.5 sm:mt-0 text-right font-sans">
                    {t.businessTypeValue}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between py-2 border-b border-skp-navy-border/60">
                  <span className="text-slate-400 shrink-0">{t.hqAddressLabel}</span>
                  <a
                    href="https://www.google.com/maps?q=13.830666,100.635479"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-slate-200 mt-0.5 sm:mt-0 text-left sm:text-right font-sans max-w-xs hover:text-skp-cyan transition-colors"
                    title={t.hqMapTooltip}
                  >
                    {t.hqAddressValue}
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2">
                  <span className="text-slate-400">{t.phoneFaxLabel}</span>
                  <span className="font-semibold text-slate-200 mt-0.5 sm:mt-0">
                    {t.phoneFaxValue}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-skp-navy-border/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{t.dbdSource}</span>
              <span className="text-skp-cyan">{t.dbdStatus}</span>
            </div>
          </div>

          {/* Right Column: Engineering Standards & Quality Assurance */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="bg-skp-navy-card rounded-2xl border border-skp-navy-border p-6 sm:p-8 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2.5 rounded-xl bg-skp-navy-deep border border-skp-navy-border">
                  <Award className="w-6 h-6 text-skp-red" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{t.standardsTitle}</h3>
                  <p className="text-xs font-mono text-slate-400">{t.standardsSub}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-skp-navy-deep border border-skp-navy-border flex items-start space-x-3.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.std1Title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {t.std1Desc}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-skp-navy-deep border border-skp-navy-border flex items-start space-x-3.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.std2Title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {t.std2Desc}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-skp-navy-deep border border-skp-navy-border flex items-start space-x-3.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.std3Title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {t.std3Desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact & Action Callout */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-skp-navy-light/60 to-skp-navy-card border border-skp-cyan/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-skp-cyan">{t.procureChannel}</div>
                <div className="text-base font-bold text-white mt-0.5">{t.procureTitle}</div>
                <div className="text-xs text-slate-300 mt-1">{t.procureSub}</div>
              </div>
              <a
                href="#contact"
                className="px-5 py-2.5 bg-skp-red hover:bg-skp-red-hover text-white rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap shadow-lg shadow-skp-red/30 transition-colors"
              >
                {t.procureBtn}
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
