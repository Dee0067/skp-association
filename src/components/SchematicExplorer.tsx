'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  Zap, 
  Wind, 
  Flame, 
  Info, 
  CheckCircle2, 
  Activity,
  Sliders,
  Maximize2
} from 'lucide-react';

export default function SchematicExplorer() {
  const [activeSystem, setActiveSystem] = useState<'electrical' | 'hvac' | 'fire'>('electrical');

  return (
    <section id="schematic" className="py-20 lg:py-28 bg-skp-navy-dark relative overflow-hidden border-t border-b border-skp-navy-border">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 bg-blueprint-dense opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-skp-navy-card border border-skp-navy-border text-xs font-mono text-skp-cyan">
            <Cpu className="w-3.5 h-3.5 text-skp-cyan" />
            <span>INTERACTIVE SYSTEM SCHEMATICS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ผังโครงข่ายวิศวกรรมระบบประกอบอาคาร
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            สัมผัสความแม่นยำในการออกแบบและเชื่อมโยงระบบวิศวกรรมภายในอาคาร โดยทีมงาน บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด
          </p>
        </div>

        {/* System Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-xl bg-skp-navy-card border border-skp-navy-border space-x-2">
            <button
              type="button"
              onClick={() => setActiveSystem('electrical')}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeSystem === 'electrical'
                  ? 'bg-skp-navy-light text-skp-cyan shadow-md border border-skp-cyan/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-skp-cyan" />
              <span>ระบบไฟฟ้ากำลัง (Electrical Power)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSystem('hvac')}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeSystem === 'hvac'
                  ? 'bg-skp-navy-light text-sky-400 shadow-md border border-sky-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wind className="w-4 h-4 text-sky-400" />
              <span>ระบบปรับอากาศ (HVAC Chiller)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSystem('fire')}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeSystem === 'fire'
                  ? 'bg-skp-navy-light text-skp-red shadow-md border border-skp-red/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-skp-red" />
              <span>ระบบดับเพลิง (Fire Protection)</span>
            </button>
          </div>
        </div>

        {/* Interactive Schematic Board */}
        <div className="bg-skp-navy-card rounded-2xl border border-skp-navy-border overflow-hidden shadow-2xl">
          {/* Top Board Toolbar */}
          <div className="px-6 py-3.5 bg-skp-navy-deep border-b border-skp-navy-border flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center space-x-3 text-slate-300">
              <span className="flex items-center text-emerald-400">
                <Activity className="w-4 h-4 mr-1.5 animate-pulse" />
                SIMULATION LIVE
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">DRAWING NO: SKP-MEP-2026-001</span>
            </div>
            <div className="flex items-center space-x-4 text-slate-400">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-skp-cyan mr-1.5"></span>
                ACTIVE CIRCUITS
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-skp-red mr-1.5"></span>
                EMERGENCY LINE
              </span>
            </div>
          </div>

          {/* Canvas SVG Display */}
          <div className="p-6 sm:p-10 relative bg-skp-navy-card/90 min-h-[380px] flex items-center justify-center">
            {activeSystem === 'electrical' && (
              <div className="w-full max-w-4xl space-y-8">
                {/* Electrical SLD Schematic Graphic */}
                <svg className="w-full h-48 sm:h-64" viewBox="0 0 800 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid Lines */}
                  <line x1="0" y1="60" x2="800" y2="60" stroke="#1F2A56" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="180" x2="800" y2="180" stroke="#1F2A56" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Flow Path 1: Utility to Transformer */}
                  <path d="M 60 120 L 160 120" stroke="#38BDF8" strokeWidth="3" className="animate-circuit" />
                  {/* Transformer to MDB */}
                  <path d="M 240 120 L 360 120" stroke="#38BDF8" strokeWidth="4" className="animate-circuit" />
                  {/* MDB to Distribution Branches */}
                  <path d="M 440 120 L 520 60 L 680 60" stroke="#38BDF8" strokeWidth="2.5" className="animate-circuit" />
                  <path d="M 440 120 L 680 120" stroke="#38BDF8" strokeWidth="2.5" className="animate-circuit" />
                  <path d="M 440 120 L 520 180 L 680 180" stroke="#B01A38" strokeWidth="2.5" className="animate-circuit" />

                  {/* Node 1: High Voltage Incomer */}
                  <rect x="20" y="90" width="80" height="60" rx="8" fill="#0B0F28" stroke="#38BDF8" strokeWidth="2" />
                  <text x="60" y="120" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">MEA / PEA</text>
                  <text x="60" y="135" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">22-24 kV</text>

                  {/* Node 2: Transformer */}
                  <rect x="160" y="80" width="80" height="80" rx="8" fill="#111738" stroke="#38BDF8" strokeWidth="2" />
                  <circle cx="190" cy="120" r="16" stroke="#38BDF8" strokeWidth="2" fill="none" />
                  <circle cx="210" cy="120" r="16" stroke="#38BDF8" strokeWidth="2" fill="none" />
                  <text x="200" y="152" fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">TR 1500 kVA</text>

                  {/* Node 3: MDB Switchboard */}
                  <rect x="360" y="70" width="90" height="100" rx="8" fill="#1B1F4A" stroke="#38BDF8" strokeWidth="3" />
                  <text x="405" y="110" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">MAIN MDB</text>
                  <text x="405" y="128" fill="#38BDF8" fontSize="9" textAnchor="middle" fontFamily="monospace">ACB 2500A</text>
                  <text x="405" y="145" fill="#E2E8F0" fontSize="8" textAnchor="middle" fontFamily="monospace">400/230V 50Hz</text>

                  {/* Branches */}
                  <rect x="680" y="40" width="100" height="40" rx="6" fill="#0B0F28" stroke="#38BDF8" strokeWidth="1.5" />
                  <text x="730" y="60" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PANEL DB-HVAC</text>
                  <text x="730" y="72" fill="#38BDF8" fontSize="8" textAnchor="middle" fontFamily="monospace">Chiller & Pumps</text>

                  <rect x="680" y="100" width="100" height="40" rx="6" fill="#0B0F28" stroke="#38BDF8" strokeWidth="1.5" />
                  <text x="730" y="120" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PANEL DB-LIGHT</text>
                  <text x="730" y="132" fill="#38BDF8" fontSize="8" textAnchor="middle" fontFamily="monospace">Power & Lighting</text>

                  <rect x="680" y="160" width="100" height="40" rx="6" fill="#0B0F28" stroke="#B01A38" strokeWidth="2" />
                  <text x="730" y="180" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PANEL EMDB</text>
                  <text x="730" y="192" fill="#F87171" fontSize="8" textAnchor="middle" fontFamily="monospace">Life Safety & Gen</text>
                </svg>

                {/* Technical Parameter Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-mono">
                  <div className="p-3 bg-skp-navy-deep rounded-lg border border-skp-navy-border">
                    <span className="text-slate-400 block">แรงดันไฟฟ้าขาเข้า:</span>
                    <span className="text-white font-bold text-sm">22 - 24 kV (Three-Phase)</span>
                  </div>
                  <div className="p-3 bg-skp-navy-deep rounded-lg border border-skp-navy-border">
                    <span className="text-slate-400 block">พิกัดกระแสลัดวงจร (Icu):</span>
                    <span className="text-skp-cyan font-bold text-sm">50 - 65 kA @ 1 sec</span>
                  </div>
                  <div className="p-3 bg-skp-navy-deep rounded-lg border border-skp-navy-border">
                    <span className="text-slate-400 block">มาตรฐานการออกแบบ:</span>
                    <span className="text-emerald-400 font-bold text-sm">วสท. 022001-22 / IEC 61439</span>
                  </div>
                </div>
              </div>
            )}

            {activeSystem === 'hvac' && (
              <div className="w-full max-w-4xl space-y-8">
                {/* HVAC Schematic Graphic */}
                <svg className="w-full h-48 sm:h-64" viewBox="0 0 800 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 120 120 L 260 120" stroke="#38BDF8" strokeWidth="3" className="animate-circuit" />
                  <path d="M 360 120 L 500 80 L 660 80" stroke="#38BDF8" strokeWidth="3" className="animate-circuit" />
                  <path d="M 360 120 L 500 160 L 660 160" stroke="#0284C7" strokeWidth="3" className="animate-circuit" />

                  {/* Cooling Tower */}
                  <rect x="40" y="85" width="80" height="70" rx="8" fill="#0B0F28" stroke="#38BDF8" strokeWidth="2" />
                  <text x="80" y="120" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">COOLING</text>
                  <text x="80" y="135" fill="#38BDF8" fontSize="9" textAnchor="middle" fontFamily="monospace">TOWER</text>

                  {/* Water Chiller Unit */}
                  <rect x="260" y="70" width="100" height="100" rx="8" fill="#111738" stroke="#38BDF8" strokeWidth="3" />
                  <text x="310" y="115" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">CHILLER</text>
                  <text x="310" y="132" fill="#38BDF8" fontSize="9" textAnchor="middle" fontFamily="monospace">500 TR Water-Cooled</text>

                  {/* AHU Distribution */}
                  <rect x="660" y="60" width="100" height="40" rx="6" fill="#0B0F28" stroke="#38BDF8" strokeWidth="1.5" />
                  <text x="710" y="80" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">AHU-ZONE A</text>
                  <text x="710" y="92" fill="#38BDF8" fontSize="8" textAnchor="middle" fontFamily="monospace">Air Flow 12,000 CFM</text>

                  <rect x="660" y="140" width="100" height="40" rx="6" fill="#0B0F28" stroke="#0284C7" strokeWidth="1.5" />
                  <text x="710" y="160" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">AHU-ZONE B</text>
                  <text x="710" y="172" fill="#38BDF8" fontSize="8" textAnchor="middle" fontFamily="monospace">Cleanroom Class 10K</text>
                </svg>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-mono">
                  <div className="p-3 bg-skp-navy-deep rounded-lg border border-skp-navy-border">
                    <span className="text-slate-400 block">อุณหภูมิน้ำเย็น (CHW Temp):</span>
                    <span className="text-sky-400 font-bold text-sm">7°C Supply / 12°C Return</span>
                  </div>
                  <div className="p-3 bg-skp-navy-deep rounded-lg border border-skp-navy-border">
                    <span className="text-slate-400 block">ประสิทธิภาพประหยัดพลังงาน:</span>
                    <span className="text-emerald-400 font-bold text-sm">VFD Inverter Variable Speed</span>
                  </div>
                  <div className="p-3 bg-skp-navy-deep rounded-lg border border-skp-navy-border">
                    <span className="text-slate-400 block">มาตรฐานการออกแบบ:</span>
                    <span className="text-white font-bold text-sm">ASHRAE 90.1 / SMACNA</span>
                  </div>
                </div>
              </div>
            )}

            {activeSystem === 'fire' && (
              <div className="w-full max-w-4xl space-y-8">
                {/* Fire Protection Graphic */}
                <svg className="w-full h-48 sm:h-64" viewBox="0 0 800 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 120 120 L 260 120" stroke="#B01A38" strokeWidth="4" className="animate-circuit" />
                  <path d="M 360 120 L 500 80 L 660 80" stroke="#B01A38" strokeWidth="3" className="animate-circuit" />
                  <path d="M 360 120 L 500 160 L 660 160" stroke="#F59E0B" strokeWidth="3" className="animate-circuit" />

                  <rect x="40" y="85" width="80" height="70" rx="8" fill="#0B0F28" stroke="#B01A38" strokeWidth="2" />
                  <text x="80" y="120" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">WATER TANK</text>
                  <text x="80" y="135" fill="#F87171" fontSize="9" textAnchor="middle" fontFamily="monospace">150 cu.m</text>

                  <rect x="260" y="70" width="100" height="100" rx="8" fill="#111738" stroke="#B01A38" strokeWidth="3" />
                  <text x="310" y="115" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">FIRE PUMP</text>
                  <text x="310" y="132" fill="#F87171" fontSize="9" textAnchor="middle" fontFamily="monospace">NFPA 20 Certified</text>

                  <rect x="660" y="60" width="100" height="40" rx="6" fill="#0B0F28" stroke="#B01A38" strokeWidth="2" />
                  <text x="710" y="80" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">SPRINKLER</text>
                  <text x="710" y="92" fill="#F87171" fontSize="8" textAnchor="middle" fontFamily="monospace">Wet Pipe Grid</text>

                  <rect x="660" y="140" width="100" height="40" rx="6" fill="#0B0F28" stroke="#F59E0B" strokeWidth="2" />
                  <text x="710" y="160" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">FIRE HOSE</text>
                  <text x="710" y="172" fill="#FCD34D" fontSize="8" textAnchor="middle" fontFamily="monospace">Cabinet Class I & III</text>
                </svg>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-mono">
                  <div className="p-3 bg-skp-navy-deep rounded-lg border border-skp-navy-border">
                    <span className="text-slate-400 block">แรงดันใช้งาน (Operating Pressure):</span>
                    <span className="text-skp-red font-bold text-sm">175 PSI (UL/FM Listed)</span>
                  </div>
                  <div className="p-3 bg-skp-navy-deep rounded-lg border border-skp-navy-border">
                    <span className="text-slate-400 block">ระบบส่งสัญญาณอัตโนมัติ:</span>
                    <span className="text-amber-400 font-bold text-sm">Addressable Fire Alarm</span>
                  </div>
                  <div className="p-3 bg-skp-navy-deep rounded-lg border border-skp-navy-border">
                    <span className="text-slate-400 block">มาตรฐานการออกแบบ:</span>
                    <span className="text-white font-bold text-sm">NFPA 13, 14, 20 & 72</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
