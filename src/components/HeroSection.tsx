'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Building2, 
  Wrench, 
  ShieldCheck, 
  ChevronRight, 
  PhoneCall, 
  Sparkles,
  Layers,
  Cpu,
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function HeroSection() {
  const [activeLayer, setActiveLayer] = useState<'all' | 'electrical' | 'mechanical' | 'construction'>('all');

  return (
    <section className="relative min-h-[92vh] pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-blueprint">
      {/* Background radial lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-skp-cyan/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[400px] bg-skp-red/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Decorative Grid SVG overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="0.5" />
            <circle cx="60" cy="60" r="1.5" fill="rgba(56, 189, 248, 0.4)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Authoritative Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Corporate Registration Stamp Badge */}
            <div className="inline-flex items-center space-x-2 bg-skp-navy-card/90 border border-skp-navy-border px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-skp-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-skp-cyan"></span>
              </span>
              <span className="text-xs font-mono font-medium text-skp-cyan">
                เลขทะเบียนนิติบุคคล 0105554136205 • จดทะเบียน พ.ศ. 2554
              </span>
            </div>

            {/* High-Impact Bilingual Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.25]">
              ผู้นำด้าน<span className="text-skp-cyan">วิศวกรรมระบบไฟฟ้า</span> และรับเหมาติดตั้งงานระบบประกอบอาคาร{' '}
              <span className="text-skp-red inline-block font-black">(M&E)</span> ครบวงจร
            </h1>

            {/* Precision Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-light">
              <strong className="font-semibold text-white">บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด (SKP Association Co., Ltd.)</strong> เชี่ยวชาญงานออกแบบและให้คำปรึกษาด้านวิศวกรรมระบบไฟฟ้า รับเหมาก่อสร้างและติดตั้งงานระบบภายในอาคาร และงานวิศวกรรมโครงสร้าง ด้วยมาตรฐานวิศวกรรมควบคุมสูงสุดกว่า 15 ปี
            </p>

            {/* Dual CTAs & Quick Hotline */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a 
                href="#contact" 
                className="px-6 py-3.5 bg-skp-red hover:bg-skp-red-hover text-white rounded-lg font-semibold text-sm shadow-xl shadow-skp-red/30 border border-skp-red-hover transition-all duration-200 flex items-center group"
              >
                <span>ขอใบเสนอราคา / ปรึกษางาน</span>
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>

              <a 
                href="#portfolio" 
                className="px-6 py-3.5 bg-skp-navy-card/80 hover:bg-skp-navy-light text-slate-200 hover:text-white rounded-lg font-medium text-sm border border-skp-navy-border transition-all duration-200 flex items-center"
              >
                <Layers className="w-4 h-4 mr-2 text-skp-cyan" />
                <span>สำรวจผลงานโครงการ</span>
              </a>

              <a 
                href="tel:021164125"
                className="inline-flex items-center text-xs font-mono text-slate-400 hover:text-skp-cyan transition-colors px-2 py-1"
              >
                <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-skp-red" />
                <span>สายด่วน 02-116-4125</span>
              </a>
            </div>

            {/* Quick 3-Pillar Badges */}
            <div className="pt-6 border-t border-skp-navy-border/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-skp-navy-card/50 p-3 rounded-lg border border-skp-navy-border/40 flex items-center space-x-2.5">
                <Zap className="w-5 h-5 text-skp-cyan shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-semibold text-white">วิศวกรรมไฟฟ้า</div>
                  <div className="text-[11px] text-slate-400">High/Low Voltage & MDB</div>
                </div>
              </div>

              <div className="bg-skp-navy-card/50 p-3 rounded-lg border border-skp-navy-border/40 flex items-center space-x-2.5">
                <Building2 className="w-5 h-5 text-skp-red shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-semibold text-white">ระบบประกอบอาคาร</div>
                  <div className="text-[11px] text-slate-400">HVAC, Fire, Sanitary</div>
                </div>
              </div>

              <div className="bg-skp-navy-card/50 p-3 rounded-lg border border-skp-navy-border/40 flex items-center space-x-2.5">
                <Wrench className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-semibold text-white">งานรับเหมาก่อสร้าง</div>
                  <div className="text-[11px] text-slate-400">Building & Civil Works</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Isometric M&E Systems Visualizer */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-skp-navy-card/80 border border-skp-navy-border p-4 shadow-2xl shadow-black/60 backdrop-blur-md tech-border group">
              
              {/* Header inside mockup */}
              <div className="flex items-center justify-between pb-3 border-b border-skp-navy-border text-xs font-mono">
                <div className="flex items-center space-x-2 text-skp-cyan">
                  <Cpu className="w-4 h-4 animate-pulse text-skp-cyan" />
                  <span>SKP M&E INFRASTRUCTURE SCHEMATIC</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                  SYSTEM READY
                </span>
              </div>

              {/* Main Visual: Isometric Cutaway */}
              <div className="relative mt-3 rounded-xl overflow-hidden bg-skp-navy-deep border border-skp-navy-border/60 aspect-[16/10]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/hero-systems.png" 
                  alt="SKP Association M&E Infrastructure" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Animated circuit overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-skp-navy-deep via-transparent to-transparent opacity-80" />

                {/* Interactive Hotspot Badges */}
                <div className="absolute top-4 left-4 bg-skp-navy-card/90 border border-skp-cyan/40 px-2.5 py-1 rounded text-[11px] font-mono text-skp-cyan flex items-center shadow-lg backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-skp-cyan animate-ping mr-1.5"></span>
                  Electrical Substation & MDB
                </div>

                <div className="absolute bottom-4 right-4 bg-skp-navy-card/90 border border-skp-red/50 px-2.5 py-1 rounded text-[11px] font-mono text-white flex items-center shadow-lg backdrop-blur-md">
                  <Activity className="w-3.5 h-3.5 text-skp-red mr-1.5" />
                  HVAC & Mechanical Chiller
                </div>
              </div>

              {/* Interactive System Layer Switcher */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveLayer('all')}
                  className={`py-2 px-2 rounded text-center transition-all ${
                    activeLayer === 'all'
                      ? 'bg-skp-navy-light text-skp-cyan border border-skp-cyan/50'
                      : 'bg-skp-navy-deep text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  รวมทุกระบบ
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLayer('electrical')}
                  className={`py-2 px-2 rounded text-center transition-all ${
                    activeLayer === 'electrical'
                      ? 'bg-skp-navy-light text-skp-cyan border border-skp-cyan/50'
                      : 'bg-skp-navy-deep text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  ระบบไฟฟ้ากำลัง
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLayer('mechanical')}
                  className={`py-2 px-2 rounded text-center transition-all ${
                    activeLayer === 'mechanical'
                      ? 'bg-skp-navy-light text-skp-red border border-skp-red/50'
                      : 'bg-skp-navy-deep text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  ระบบปรับอากาศ
                </button>
              </div>

              {/* Dynamic status feedback */}
              <div className="mt-2.5 p-2 rounded bg-skp-navy-deep/80 border border-skp-navy-border/60 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span className="flex items-center">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 mr-1.5" />
                  {activeLayer === 'all' && 'แสดงแผนผังระบบวิศวกรรมประกอบอาคารแบบบูรณาการ'}
                  {activeLayer === 'electrical' && 'ระบบสายป้อนหม้อแปลง ตู้สวิตช์บอร์ด MDB และระบบแสงสว่าง'}
                  {activeLayer === 'mechanical' && 'ระบบท่อส่งลม ท่อดักท์ชิลเลอร์ และระบบดับเพลิงอัตโนมัติ'}
                </span>
                <span className="text-slate-500">REV 2026</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
