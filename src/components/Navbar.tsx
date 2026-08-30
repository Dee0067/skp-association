'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Phone, MapPin, Menu, X, ShieldCheck, ArrowRight, Clock, FileText } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Credentials Micro-bar */}
      <div className="bg-skp-navy-dark border-b border-skp-navy-border/60 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-slate-300">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-skp-cyan font-mono">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-skp-cyan" />
              เลขทะเบียนนิติบุคคล: 0105554136205 (จดทะเบียน 2554)
            </span>
            <span className="flex items-center text-slate-400">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
              สำนักงานใหญ่: ถ.นวลจันทร์ แขวงคลองกุ่ม เขตบึงกุ่ม กรุงเทพฯ
            </span>
          </div>
          <div className="flex items-center space-x-6 font-mono">
            <a href="tel:021164125" className="flex items-center hover:text-skp-cyan transition-colors">
              <Phone className="w-3.5 h-3.5 mr-1.5 text-skp-red" />
              <span className="text-slate-200 font-semibold">02-116-4125</span>
            </a>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">โทรสาร: 02-116-4126</span>
          </div>
        </div>
      </div>

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
                บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด
              </span>
              <span className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                SKP Association Co., Ltd. (M&E Engineering)
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8 text-sm font-medium">
            <a href="#services" className="text-slate-200 hover:text-skp-cyan transition-colors flex items-center">
              บริการวิศวกรรม
            </a>
            <a href="#schematic" className="text-slate-200 hover:text-skp-cyan transition-colors flex items-center">
              ผังระบบประกอบอาคาร
            </a>
            <a href="#portfolio" className="text-slate-200 hover:text-skp-cyan transition-colors flex items-center">
              ผลงานโครงการ
            </a>
            <a href="#credentials" className="text-slate-200 hover:text-skp-cyan transition-colors flex items-center">
              ข้อมูลนิติบุคคล
            </a>
            <a href="#contact" className="text-slate-200 hover:text-skp-cyan transition-colors flex items-center">
              ติดต่อเรา
            </a>
          </div>

          {/* Primary Action Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="#contact" 
              className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium tracking-wide text-white bg-skp-red hover:bg-skp-red-hover rounded-md shadow-lg shadow-skp-red/25 border border-skp-red-hover transition-all duration-200 group overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                ขอใบเสนอราคา / ปรึกษา
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-skp-navy-light focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-skp-navy-border bg-skp-navy-card/95 backdrop-blur-lg rounded-xl p-4 shadow-2xl animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-3 text-sm">
              <div className="p-2.5 bg-skp-navy-deep rounded-lg border border-skp-navy-border/60 text-xs font-mono text-skp-cyan flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 shrink-0" />
                ทะเบียนนิติบุคคล 0105554136205
              </div>
              <a 
                href="#services" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-skp-navy-light text-slate-200"
              >
                บริการวิศวกรรม
              </a>
              <a 
                href="#schematic" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-skp-navy-light text-slate-200"
              >
                ผังระบบประกอบอาคาร
              </a>
              <a 
                href="#portfolio" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-skp-navy-light text-slate-200"
              >
                ผลงานโครงการ
              </a>
              <a 
                href="#credentials" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-skp-navy-light text-slate-200"
              >
                ข้อมูลนิติบุคคล
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-skp-navy-light text-slate-200"
              >
                ติดต่อเรา
              </a>
              <div className="pt-2 border-t border-skp-navy-border">
                <a 
                  href="tel:021164125"
                  className="flex items-center justify-center py-2.5 px-4 mb-2 bg-skp-navy-light text-slate-100 rounded-md font-mono"
                >
                  <Phone className="w-4 h-4 mr-2 text-skp-red" />
                  โทร 02-116-4125
                </a>
                <a 
                  href="#contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 px-4 bg-skp-red hover:bg-skp-red-hover text-white rounded-md font-medium text-center shadow-md"
                >
                  ขอใบเสนอราคา / ปรึกษางาน
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
