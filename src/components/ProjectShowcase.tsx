'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Zap, 
  Factory, 
  CheckCircle, 
  MapPin, 
  Calendar, 
  ArrowUpRight, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function ProjectShowcase() {
  const [filter, setFilter] = useState<'all' | 'industrial' | 'commercial' | 'substation'>('all');

  const projects = [
    {
      id: 1,
      title: 'โครงการติดตั้งสถานีไฟฟ้าย่อยและตู้ MDB โรงงานอุตสาหกรรมปิโตรเคมี',
      titleEn: 'Petrochemical Plant 22kV Substation & MDB Installation',
      category: 'substation',
      categoryLabel: 'สถานีไฟฟ้าย่อย & MDB',
      location: 'นิคมอุตสาหกรรมมาบตาพุด จ.ระยอง',
      year: 'พ.ศ. 2566',
      scope: 'งานออกแบบและติดตั้งระบบไฟฟ้าแรงสูง 22kV, หม้อแปลงไฟฟ้า 2,000 kVA จำนวน 2 ชุด, ตู้ Main Distribution Board พร้อมระบบ ATS และ Capacitor Bank',
      status: 'ส่งมอบงานเรียบร้อย 100%',
      image: '/project-infrastructure.png',
      tags: ['Substation 22kV', 'Transformer', 'MDB 3200A'],
    },
    {
      id: 2,
      title: 'งานระบบประกอบอาคาร (M&E) ครบวงจร อาคารสำนักงานและศูนย์กระจายสินค้า',
      titleEn: 'Turnkey M&E Systems for Logistics & Office Complex',
      category: 'commercial',
      categoryLabel: 'อาคารพาณิชย์ & สำนักงาน',
      location: 'เขตบางนา จ.สมุทรปราการ',
      year: 'พ.ศ. 2565',
      scope: 'ติดตั้งระบบไฟฟ้ากำลัง แสงสว่าง ระบบปรับอากาศ Chiller & VRV ระบบดับเพลิง Sprinkler พร้อมระบบควบคุมอาคารอัตโนมัติ (BAS)',
      status: 'ส่งมอบงานเรียบร้อย 100%',
      image: '/hero-systems.png',
      tags: ['HVAC Chiller', 'Fire Protection', 'Power Lighting'],
    },
    {
      id: 3,
      title: 'งานวิศวกรรมก่อสร้างและติดตั้งระบบห้องสะอาด (Cleanroom M&E)',
      titleEn: 'Electronic Components Cleanroom Construction & Engineering',
      category: 'industrial',
      categoryLabel: 'โรงงานอุตสาหกรรม',
      location: 'นิคมอุตสาหกรรมอมตะซิตี้ จ.ชลบุรี',
      year: 'พ.ศ. 2566',
      scope: 'รับเหมาก่อสร้างและติดตั้งระบบปรับอากาศควบคุมความชื้นและฝุ่น (Cleanroom Class 10,000) ระบบท่อลม AHU และระบบจ่ายไฟกำลังความเสถียรสูง',
      status: 'ส่งมอบงานเรียบร้อย 100%',
      image: '/project-drafting.png',
      tags: ['Cleanroom HVAC', 'AHU Ducting', 'Precision Power'],
    },
    {
      id: 4,
      title: 'งานปรับปรุงและเพิ่มขนาดกำลังไฟฟ้าตู้สวิตช์บอร์ด MDB และระบบหม้อแปลง',
      titleEn: 'Factory Substation Power Upgrade & Transformer Retrofit',
      category: 'substation',
      categoryLabel: 'สถานีไฟฟ้าย่อย & MDB',
      location: 'นิคมอุตสาหกรรมนวนคร จ.ปทุมธานี',
      year: 'พ.ศ. 2567',
      scope: 'ขยายพิกัดหม้อแปลงไฟฟ้าจาก 1000 kVA เป็น 2500 kVA งานเปลี่ยน Main ACB และเดินสายป้อนกำลังพร้อมการทดสอบความปลอดภัยและการทำงานต่อเนื่อง',
      status: 'ส่งมอบงานเรียบร้อย 100%',
      image: '/project-infrastructure.png',
      tags: ['Transformer Retrofit', 'Single-Line Upgrade'],
    },
    {
      id: 5,
      title: 'งานก่อสร้างโรงงานแปรรูปอาหารและติดตั้งระบบวิศวกรรมสาธารณูปโภค',
      titleEn: 'Food Processing Plant Construction & Utility Systems',
      category: 'industrial',
      categoryLabel: 'โรงงานอุตสาหกรรม',
      location: 'อ.เมือง จ.สมุทรสาคร',
      year: 'พ.ศ. 2565',
      scope: 'งานโครงสร้างอาคารโรงงาน พร้อมระบบประปาสุขาภิบาล ท่อดักท์ระบายอากาศ และระบบดับเพลิงอัตโนมัติมาตรฐาน GMP/HACCP',
      status: 'ส่งมอบงานเรียบร้อย 100%',
      image: '/project-drafting.png',
      tags: ['Civil Works', 'Sanitary Piping', 'GMP Standard'],
    },
    {
      id: 6,
      title: 'งานออกแบบและติดตั้งระบบไฟฟ้าและแสงสว่างโครงการคอมมูนิตี้มอลล์',
      titleEn: 'Commercial Mall Electrical & Architectural Lighting Works',
      category: 'commercial',
      categoryLabel: 'อาคารพาณิชย์ & สำนักงาน',
      location: 'ถนนเกษตร-นวมินทร์ กรุงเทพมหานคร',
      year: 'พ.ศ. 2564',
      scope: 'งานวางระบบหม้อแปลงไฟฟ้า ระบบไฟฟ้าแสงสว่างสถาปัตยกรรม รางเคเบิลเทรย์ และระบบไฟสำรองฉุกเฉินสำหรับพื้นที่ส่วนกลางและร้านค้า',
      status: 'ส่งมอบงานเรียบร้อย 100%',
      image: '/hero-systems.png',
      tags: ['Architectural Lighting', 'Cable Tray', 'Backup Gen'],
    },
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="portfolio" className="py-20 lg:py-28 bg-skp-navy-deep relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-skp-navy-card border border-skp-navy-border text-xs font-mono text-skp-cyan mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-skp-cyan" />
              <span>PROJECT TRACK RECORD & REFERENCES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              ผลงานและโครงการอ้างอิง
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
              โครงการที่ทีมงาน บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด ได้รับความไว้วางใจให้ดำเนินการออกแบบ ติดตั้ง และส่งมอบงานสำเร็จ
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-skp-red text-white shadow-md shadow-skp-red/30'
                  : 'bg-skp-navy-card text-slate-300 hover:text-white border border-skp-navy-border'
              }`}
            >
              ทั้งหมด ({projects.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('substation')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                filter === 'substation'
                  ? 'bg-skp-red text-white shadow-md shadow-skp-red/30'
                  : 'bg-skp-navy-card text-slate-300 hover:text-white border border-skp-navy-border'
              }`}
            >
              สถานีย่อย & MDB
            </button>
            <button
              type="button"
              onClick={() => setFilter('industrial')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                filter === 'industrial'
                  ? 'bg-skp-red text-white shadow-md shadow-skp-red/30'
                  : 'bg-skp-navy-card text-slate-300 hover:text-white border border-skp-navy-border'
              }`}
            >
              โรงงานอุตสาหกรรม
            </button>
            <button
              type="button"
              onClick={() => setFilter('commercial')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                filter === 'commercial'
                  ? 'bg-skp-red text-white shadow-md shadow-skp-red/30'
                  : 'bg-skp-navy-card text-slate-300 hover:text-white border border-skp-navy-border'
              }`}
            >
              อาคารพาณิชย์
            </button>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              className="bg-skp-navy-card rounded-2xl border border-skp-navy-border overflow-hidden shadow-xl hover:border-skp-cyan/50 hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 group flex flex-col"
            >
              {/* Card Image Banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-skp-navy-dark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-skp-navy-card via-skp-navy-card/20 to-transparent" />
                
                {/* Badges overlay */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-skp-navy-deep/90 text-skp-cyan border border-skp-navy-border backdrop-blur-sm">
                    {project.categoryLabel}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-skp-red" />
                    {project.location}
                  </span>
                  <span className="text-slate-400">{project.year}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-skp-cyan transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    {project.titleEn}
                  </p>
                  <p className="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed">
                    {project.scope}
                  </p>
                </div>

                <div className="pt-4 border-t border-skp-navy-border/60">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-skp-navy-deep text-slate-400 border border-skp-navy-border">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center text-emerald-400 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      {project.status}
                    </span>
                    <a href="#contact" className="text-skp-cyan hover:text-white flex items-center transition-colors">
                      <span>ปรึกษาโครงการ</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                    </a>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
