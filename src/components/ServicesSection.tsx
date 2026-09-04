'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Building, 
  Check, 
  ArrowRight, 
  Sliders, 
  Layers, 
  Cpu, 
  Flame, 
  Droplets, 
  Wind,
  Settings2
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations';

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<number>(0);
  const { language } = useLanguage();
  const t = translations[language].services;

  const services = [
    {
      id: 0,
      badge: t.pillar1.badge,
      title: t.pillar1.title,
      titleEn: t.pillar1.titleEn,
      icon: Zap,
      accentColor: 'text-skp-cyan',
      borderColor: 'border-skp-cyan/40',
      bgGlow: 'from-skp-cyan/10',
      description: t.pillar1.desc,
      features: t.pillar1.features,
      deliverables: t.pillar1.deliverables,
    },
    {
      id: 1,
      badge: t.pillar2.badge,
      title: t.pillar2.title,
      titleEn: t.pillar2.titleEn,
      icon: Building,
      accentColor: 'text-skp-red',
      borderColor: 'border-skp-red/40',
      bgGlow: 'from-skp-red/10',
      description: t.pillar2.desc,
      features: t.pillar2.features,
      deliverables: t.pillar2.deliverables,
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-28 bg-skp-navy-deep relative overflow-hidden">
      {/* Background CAD grid */}
      <div className="absolute inset-0 bg-blueprint opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-skp-navy-card border border-skp-navy-border text-xs font-mono text-skp-cyan">
            <Settings2 className="w-3.5 h-3.5 text-skp-cyan" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Services Tabs / Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Service Selectors */}
          <div className="lg:col-span-5 space-y-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isSelected = selectedService === index;
              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(index)}
                  className={`cursor-pointer p-5 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                    isSelected
                      ? `bg-skp-navy-card ${service.borderColor} shadow-xl shadow-black/40`
                      : 'bg-skp-navy-card/40 border-skp-navy-border/70 hover:border-slate-500 hover:bg-skp-navy-card/70'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-skp-navy-deep border border-skp-navy-border shrink-0 ${
                      isSelected ? 'shadow-md shadow-black/50' : ''
                    }`}>
                      <Icon className={`w-6 h-6 ${service.accentColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-mono text-slate-400 tracking-wider">
                          {service.badge}
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center text-xs font-mono text-skp-cyan">
                            {t.activeInspect}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white truncate">
                        {service.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                        {service.titleEn}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Breakdown Card */}
          <div className="lg:col-span-7">
            {(() => {
              const active = services[selectedService];
              const ActiveIcon = active.icon;
              return (
                <div className={`p-6 sm:p-8 rounded-2xl bg-skp-navy-card border ${active.borderColor} shadow-2xl relative overflow-hidden`}>
                  {/* Subtle top glow */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${active.bgGlow} to-transparent`} />

                  <div className="flex items-center justify-between pb-6 border-b border-skp-navy-border/80">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-xl bg-skp-navy-deep border border-skp-navy-border">
                        <ActiveIcon className={`w-7 h-7 ${active.accentColor}`} />
                      </div>
                      <div>
                        <span className="text-xs font-mono text-slate-400">{active.badge}</span>
                        <h4 className="text-xl font-bold text-white">{active.title}</h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-300 mt-6 leading-relaxed">
                    {active.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="mt-6 space-y-3">
                    <h5 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      {t.scopeHeader}
                    </h5>
                    <ul className="space-y-2.5">
                      {active.features.map((item, idx) => (
                        <li key={idx} className="flex items-start text-sm text-slate-200">
                          <span className="mr-3 p-1 rounded bg-skp-navy-deep border border-skp-navy-border text-emerald-400 shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Deliverables tags */}
                  <div className="mt-8 pt-6 border-t border-skp-navy-border/80">
                    <div className="text-xs font-mono text-slate-400 mb-2">{t.deliverablesHeader}</div>
                    <div className="flex flex-wrap gap-2">
                      {active.deliverables.map((deliv, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-md bg-skp-navy-deep border border-skp-navy-border text-xs text-slate-300 font-mono">
                          ✓ {deliv}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action CTA inside card */}
                  <div className="mt-8 pt-4 flex items-center justify-between">
                    <a
                      href="#contact"
                      className="inline-flex items-center text-sm font-semibold text-skp-cyan hover:text-white transition-colors group"
                    >
                      <span>{language === 'en' ? `Consultation on ${active.badge}` : `ปรึกษางานด้าน ${active.title.split(' ')[0]}`}</span>
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <span className="text-xs font-mono text-slate-500">
                      SKP ASSOC CO., LTD.
                    </span>
                  </div>

                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}
