'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Building, 
  Wrench, 
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

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<number>(0);

  const services = [
    {
      id: 0,
      badge: 'PILLAR 01',
      title: 'ออกแบบและให้คำปรึกษาด้านวิศวกรรมระบบไฟฟ้า',
      titleEn: 'Electrical Engineering Design & Consulting',
      icon: Zap,
      accentColor: 'text-skp-cyan',
      borderColor: 'border-skp-cyan/40',
      bgGlow: 'from-skp-cyan/10',
      description: 'บริการออกแบบ วิเคราะห์โหลด คำนวณความปลอดภัยทางวิศวกรรม และให้คำปรึกษาอย่างรอบด้านสำหรับระบบไฟฟ้ากำลังอาคารสูง โรงงานอุตสาหกรรม และโครงการพาณิชย์ขนาดใหญ่ตามมาตรฐาน วสท. และการไฟฟ้านครหลวง/ส่วนภูมิภาค',
      features: [
        'ออกแบบระบบไฟฟ้าแรงสูงและสถานีไฟฟ้าย่อย (Substation & High Voltage Distribution)',
        'คำนวณโหลดไฟฟ้าและจัดทำแบบไดอะแกรมเส้นเดี่ยว (Single-Line Diagrams - SLD)',
        'วิศวกรรมออกแบบตู้สวิตช์บอร์ดประธาน (MDB, EMDB, Distribution Boards)',
        'ระบบป้องกันฟ้าผ่า ต่อลงดิน และระบบไฟสำรองฉุกเฉิน (Generator & UPS Integration)',
        'ตรวจรับรองความปลอดภัยทางไฟฟ้าและให้คำปรึกษาการอนุรักษ์พลังงานในโรงงาน',
      ],
      deliverables: ['แบบก่อสร้าง As-Built Drawing', 'รายการคำนวณ Load Schedule', 'เอกสารรับรองโดยวิศวกรวิชาชีพ (กว.)'],
    },
    {
      id: 1,
      badge: 'PILLAR 02',
      title: 'รับเหมาก่อสร้างและติดตั้งงานระบบภายในอาคาร (M&E)',
      titleEn: 'Building Mechanical & Electrical (M&E) Contracting',
      icon: Building,
      accentColor: 'text-skp-red',
      borderColor: 'border-skp-red/40',
      bgGlow: 'from-skp-red/10',
      description: 'บริการรับเหมาติดตั้งงานระบบวิศวกรรมประกอบอาคารครบวงจร ด้วยทีมงานวิศวกรและช่างผู้เชี่ยวชาญ ครอบคลุมงานระบบปรับอากาศ สุขาภิบาล ดับเพลิง และระบบควบคุมอัจฉริยะสำหรับอาคารสมัยใหม่',
      features: [
        'ระบบปรับอากาศและระบายอากาศ (HVAC - Chiller Plant, VRV/VRF, AHU, Air Ducting)',
        'ระบบป้องกันและระงับอัคคีภัย (Fire Protection, Sprinkler System, Fire Alarm)',
        'ระบบสุขาภิบาล ระบบประปา และระบบบำบัดน้ำเสีย (Sanitary & Plumbing Engineering)',
        'งานเดินท่อร้อยสายไฟฟ้า รางเคเบิลเทรย์ และรางวายเวย์ (Cable Tray & Wireway Installation)',
        'ระบบควบคุมอาคารอัตโนมัติ (Building Automation & Electrical Management System)',
      ],
      deliverables: ['งานติดตั้งที่ผ่านการทดสอบ Commissioning', 'รายงานผลทดสอบระบบ (Test Report)', 'การรับประกันผลงานและการบริการบำรุงรักษา'],
    },
    {
      id: 2,
      badge: 'PILLAR 03',
      title: 'งานก่อสร้างและงานวิศวกรรมประกอบอาคาร',
      titleEn: 'Engineering Construction & Civil Works',
      icon: Wrench,
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      bgGlow: 'from-emerald-500/10',
      description: 'รับเหมาก่อสร้างอาคาร งานโครงสร้างเหล็ก งานต่อเติมและปรับปรุงโรงงานอุตสาหกรรม (Retrofit & Renovation) ที่ต้องการการผสานรวมระหว่างงานสถาปัตยกรรมและงานระบบวิศวกรรมขั้นสูงอย่างแม่นยำ',
      features: [
        'งานก่อสร้างโรงงานอุตสาหกรรม คลังสินค้า และอาคารสำนักงาน',
        'งานปรับปรุงและต่อเติมโครงสร้างทางวิศวกรรม (Industrial Renovation & Cleanrooms)',
        'งานโครงสร้างคอนกรีตเสริมเหล็กและงานโครงสร้างเหล็กรูปพรรณ (Structural Steel)',
        'งานระบบพื้นอุตสาหกรรม (Epoxy Floor / Heavy-Duty Concrete Slabs)',
        'การควบคุมงานตามหลักความปลอดภัยและมาตรฐานสิ่งแวดล้อม (Safety & Quality Standards)',
      ],
      deliverables: ['การส่งมอบงานตามแผนเวลา (Time-Schedule Delivery)', 'มาตรฐานการควบคุมคุณภาพ QC/QA', 'คู่มือการใช้งานและเอกสารการส่งมอบโครงการ'],
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
            <span>CORE ENGINEERING DISCIPLINES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ขอบข่ายบริการวิศวกรรมครบวงจร
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด มุ่งมั่นส่งมอบงานวิศวกรรมที่มีความแม่นยำ ปลอดภัย และตรงต่อเวลา เพื่อสนับสนุนการเติบโตอย่างยั่งยืนของโครงการท่าน
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
                            ACTIVE INSPECT
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
                      ขอบเขตงานและความเชี่ยวชาญเฉพาะทาง (Scope of Expertise):
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
                    <div className="text-xs font-mono text-slate-400 mb-2">สิ่งที่ส่งมอบตามสัญญา (Deliverables):</div>
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
                      <span>ปรึกษางานด้าน {active.title.split(' ')[0]}</span>
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
