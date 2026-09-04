'use client';

import React from 'react';
import { Calendar, Award, CheckCircle, Shield, Briefcase, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations';

export default function TrackRecordBar() {
  const { language } = useLanguage();
  const t = translations[language].trackRecord;

  const stats = [
    {
      value: t.stat1Value,
      unit: t.stat1Unit,
      label: t.stat1Label,
      sublabel: t.stat1Sub,
      icon: Calendar,
      color: 'text-skp-cyan',
    },
    {
      value: t.stat2Value,
      unit: t.stat2Unit,
      label: t.stat2Label,
      sublabel: t.stat2Sub,
      icon: Briefcase,
      color: 'text-skp-red',
    },
    {
      value: t.stat3Value,
      unit: t.stat3Unit,
      label: t.stat3Label,
      sublabel: t.stat3Sub,
      icon: Shield,
      color: 'text-emerald-400',
    },
    {
      value: t.stat4Value,
      unit: t.stat4Unit,
      label: t.stat4Label,
      sublabel: t.stat4Sub,
      icon: Zap,
      color: 'text-amber-400',
    },
  ];

  return (
    <section className="relative -mt-6 z-20 max-w-7xl mx-auto px-4 lg:px-8">
      <div className="bg-skp-navy-card border border-skp-navy-border rounded-2xl p-6 lg:p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-skp-navy-border/60">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className={`flex flex-col items-center text-center ${index > 0 ? 'pt-6 lg:pt-0 lg:pl-8' : ''}`}
              >
                <div className="p-2.5 rounded-xl bg-skp-navy-deep border border-skp-navy-border/80 mb-3 shadow-inner">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex items-baseline space-x-1 font-extrabold tracking-tight">
                  <span className="text-3xl lg:text-4xl text-white font-mono">{stat.value}</span>
                  <span className="text-sm font-semibold text-slate-400">{stat.unit}</span>
                </div>
                <div className="text-sm font-semibold text-slate-200 mt-1">{stat.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{stat.sublabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
