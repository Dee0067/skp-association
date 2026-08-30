'use client';

import React from 'react';
import { Calendar, Award, CheckCircle, Shield, Briefcase, Zap } from 'lucide-react';

export default function TrackRecordBar() {
  const stats = [
    {
      value: '15+',
      unit: 'ปี',
      label: 'ประสบการณ์ดำเนินธุรกิจ',
      sublabel: 'จดทะเบียนตั้งแต่ปี พ.ศ. 2554',
      icon: Calendar,
      color: 'text-skp-cyan',
    },
    {
      value: '100+',
      unit: 'โครงการ',
      label: 'ส่งมอบงานระบบสำเร็จ',
      sublabel: 'อาคารพาณิชย์ โรงงาน และสถานีย่อย',
      icon: Briefcase,
      color: 'text-skp-red',
    },
    {
      value: '100%',
      unit: 'มาตรฐาน',
      label: 'วิศวกรรมควบคุมความปลอดภัย',
      sublabel: 'ตามหลัก วสท. และข้อกำหนดสากล',
      icon: Shield,
      color: 'text-emerald-400',
    },
    {
      value: '3',
      unit: 'สาขาหลัก',
      label: 'บริการวิศวกรรมครบวงจร',
      sublabel: 'ออกแบบไฟฟ้า • ติดตั้ง M&E • ก่อสร้าง',
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
