'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Printer, 
  MapPin, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  FileText,
  AlertCircle,
  ExternalLink,
  Navigation,
  Maximize2,
  X,
  Copy,
  Check
} from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    serviceType: 'electrical',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  const officeAddress = '41/333 หมู่ที่ 12 ถนนนวลจันทร์ แขวงคลองกุ่ม เขตบึงกุ่ม กรุงเทพมหานคร 10230';
  const officeCoords = '13.830666,100.635479';
  const officeCoordsDisplay = '13.830666, 100.635479';
  const googleMapsUrl = `https://www.google.com/maps?q=${officeCoords}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${officeCoords}`;
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${officeCoords}&hl=th&z=16&t=&ie=UTF8&iwloc=&output=embed`;

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(officeAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2200);
  };

  const handleCopyCoords = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(officeCoordsDisplay);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-skp-navy-deep relative overflow-hidden">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 bg-blueprint opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-skp-navy-card border border-skp-navy-border text-xs font-mono text-skp-cyan">
            <Mail className="w-3.5 h-3.5 text-skp-cyan" />
            <span>PROJECT CONSULTATION & RFP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ติดต่อสอบถามและขอใบเสนอราคา
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            ทีมวิศวกรผู้เชี่ยวชาญ บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด พร้อมให้คำปรึกษา ออกแบบ และประเมินราคาสำหรับโครงการของท่าน
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Official Contact Card & Office Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-skp-navy-card rounded-2xl border border-skp-navy-border p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">สำนักงานใหญ่</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">Headquarters & Engineering Office</p>
                <p className="text-xs text-skp-cyan font-mono mt-1">บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด</p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-skp-cyan shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">สถานที่ตั้ง:</span>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-200 leading-relaxed block font-medium hover:text-skp-cyan transition-colors group"
                      title="กดเพื่อเปิดดูหมุดใน Google Maps"
                    >
                      <span>41/333 หมู่ที่ 12 ถนนนวลจันทร์ แขวงคลองกุ่ม เขตบึงกุ่ม กรุงเทพมหานคร 10230</span>
                      <span className="inline-flex items-center text-xs text-skp-cyan font-mono ml-2 group-hover:underline">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        เปิดดูหมุด (พิกัด {officeCoordsDisplay})
                      </span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-skp-red shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">เบอร์โทรศัพท์ (สายตรง):</span>
                    <a href="tel:021164125" className="text-lg font-bold text-white hover:text-skp-cyan transition-colors font-mono">
                      02-116-4125
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-slate-400 shrink-0 mt-0.5">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">เบอร์โทรสาร (Fax):</span>
                    <span className="text-slate-200 font-mono font-medium">
                      02-116-4126
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-emerald-400 shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">เวลาทำการ (Business Hours):</span>
                    <span className="text-slate-200">
                      วันจันทร์ – วันเสาร์: 08:30 – 17:30 น.
                    </span>
                    <span className="block text-xs text-slate-400 mt-0.5">(หยุดวันอาทิตย์และวันหยุดนักขัตฤกษ์)</span>
                  </div>
                </div>
              </div>

              {/* Interactive Viewable Office Map */}
              <div className="p-4 rounded-xl bg-skp-navy-deep border border-skp-navy-border space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center text-slate-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-skp-cyan" />
                    ตำแหน่งที่ตั้งบริษัท (ปักหมุด)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-skp-navy-card border border-skp-cyan/40 text-[11px] text-skp-cyan font-mono font-semibold">
                    📍 {officeCoordsDisplay}
                  </span>
                </div>

                {/* Interactive Map Viewport with Fullscreen Toggle */}
                <div className="relative h-44 sm:h-48 rounded-lg overflow-hidden border border-skp-navy-border/80 bg-slate-900 group">
                  <iframe
                    src={googleMapsEmbedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="แผนที่ปักหมุดที่ตั้งสำนักงานใหญ่ บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด"
                  />

                  {/* Top-Right Expand Button Overlay */}
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      type="button"
                      onClick={() => setIsMapModalOpen(true)}
                      className="px-2.5 py-1.5 rounded-md bg-skp-navy-dark/90 hover:bg-skp-navy-card text-white border border-skp-navy-border text-xs flex items-center shadow-lg transition-all backdrop-blur-md hover:border-skp-cyan/50"
                      title="กดเพื่อขยายดูแผนที่เต็มจอ"
                    >
                      <Maximize2 className="w-3.5 h-3.5 mr-1.5 text-skp-cyan" />
                      <span className="font-medium">ขยายเต็มจอ</span>
                    </button>
                  </div>
                </div>

                {/* Quick Map Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <a
                    href={googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-skp-red hover:bg-skp-red-hover text-white rounded-lg text-xs font-semibold flex items-center justify-center shadow-md transition-all group"
                  >
                    <Navigation className="w-3.5 h-3.5 mr-1.5 text-white group-hover:rotate-12 transition-transform" />
                    <span>เปิดนำทาง Google Maps</span>
                    <ExternalLink className="w-3 h-3 ml-1.5 opacity-80" />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="px-3 py-2 bg-skp-navy-card hover:bg-skp-navy-light text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-skp-navy-border flex items-center justify-center transition-colors"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">คัดลอกที่อยู่แล้ว</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        <span>คัดลอกที่อยู่สำนักงาน</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Coordinates & Location info */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono border-t border-skp-navy-border/60">
                  <span className="text-slate-300">พิกัด GPS: {officeCoordsDisplay}</span>
                  <button
                    type="button"
                    onClick={handleCopyCoords}
                    className="text-skp-cyan hover:underline inline-flex items-center transition-colors"
                  >
                    {copiedCoords ? (
                      <>
                        <Check className="w-3 h-3 mr-1 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">คัดลอกพิกัดแล้ว</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        <span>คัดลอกพิกัด GPS</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 leading-tight">
                  • สำนักงานตั้งอยู่บน ถ.นวลจันทร์ เดินทางเชื่อมต่อสะดวกทั้งจาก ถ.รามอินทรา (กม.6) และ ถ.ประเสริฐมนูกิจ (เกษตร-นวมินทร์)
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Interactive Consultation & RFP Form */}
          <div className="lg:col-span-7">
            <div className="bg-skp-navy-card rounded-2xl border border-skp-navy-border p-6 sm:p-8 shadow-2xl relative tech-border">
              
              <div className="pb-6 border-b border-skp-navy-border mb-6">
                <h3 className="text-xl font-bold text-white">แบบฟอร์มขอใบเสนอราคา / ปรึกษางาน</h3>
                <p className="text-xs text-slate-300 mt-1">
                  กรุณากรอกข้อมูลโครงการเบื้องต้น ทีมวิศวกรจะติดต่อกลับเพื่อให้คำปรึกษาภายใน 24 ชั่วโมง
                </p>
              </div>

              {submitted ? (
                <div className="py-12 px-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">ได้รับข้อมูลเรียบร้อยแล้ว</h4>
                  <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                    ขอบพระคุณที่ให้ความไว้วางใจ บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด ทีมงานวิศวกรจะตรวจสอบรายละเอียดและติดต่อกลับตามเบอร์โทรศัพท์หรืออีเมลที่ท่านระบุโดยเร็วที่สุด
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-sm text-slate-200 hover:text-white font-medium transition-colors"
                  >
                    ส่งข้อมูลโครงการเพิ่มเติม
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        ชื่อ-นามสกุล ผู้ติดต่อ <span className="text-skp-red">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="เช่น คุณสมชาย วิศวกิจ"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-sm text-white focus:outline-none focus:border-skp-cyan transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        บริษัท / นิติบุคคล / องค์กร <span className="text-skp-red">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        placeholder="เช่น บริษัท ดีเวลลอปเมนท์ จำกัด"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-sm text-white focus:outline-none focus:border-skp-cyan transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        เบอร์โทรศัพท์ติดต่อ <span className="text-skp-red">*</span>
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="08X-XXX-XXXX หรือ 02-XXX-XXXX"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-sm text-white focus:outline-none focus:border-skp-cyan transition-colors font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        อีเมล (Email Address)
                      </label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="example@company.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-sm text-white focus:outline-none focus:border-skp-cyan transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      ขอบข่ายงานวิศวกรรมที่ต้องการปรึกษา <span className="text-skp-red">*</span>
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-sm text-white focus:outline-none focus:border-skp-cyan transition-colors"
                    >
                      <option value="electrical">ออกแบบและปรึกษาระบบไฟฟ้า / หม้อแปลง / ตู้ MDB</option>
                      <option value="mep">รับเหมาติดตั้งงานระบบประกอบอาคาร (M&E Turnkey)</option>
                      <option value="hvac">ระบบปรับอากาศและระบายอากาศ (HVAC Chiller / AHU)</option>
                      <option value="fire">ระบบดับเพลิงและระบบสุขาภิบาล</option>
                      <option value="construction">งานรับเหมาก่อสร้างอาคารและโรงงานอุตสาหกรรม</option>
                      <option value="other">งานประเมินราคาตามแบบ (BOQ / TOR / Tender)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      รายละเอียดโครงการ / สถานที่ตั้งโครงการ
                    </label>
                    <textarea 
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="ระบุขนาดโครงการ เช่น กำลังไฟฟ้าที่ต้องการ, พื้นที่อาคาร, สถานที่ตั้ง, หรือกำหนดเวลาส่งมอบงาน..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-sm text-white focus:outline-none focus:border-skp-cyan transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-lg bg-skp-red hover:bg-skp-red-hover text-white font-semibold text-sm shadow-xl shadow-skp-red/30 border border-skp-red-hover transition-all flex items-center justify-center group disabled:opacity-50"
                    >
                      {loading ? (
                        <span>กำลังส่งข้อมูล...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                          <span>ส่งข้อมูลเพื่อขอใบเสนอราคา / ปรึกษางาน</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 pt-2 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ข้อมูลของท่านจะถูกเก็บเป็นความลับตามนโยบายคุ้มครองข้อมูลของบริษัท</span>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* Interactive Fullscreen Map Modal */}
      {isMapModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsMapModalOpen(false)}
        >
          <div 
            className="bg-skp-navy-card border border-skp-navy-border rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-skp-navy-border flex items-center justify-between bg-skp-navy-deep">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-skp-red/10 border border-skp-red/30 text-skp-red shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      แผนที่ตั้งสำนักงานใหญ่ บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด
                    </h3>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-skp-navy-card border border-skp-cyan/40 text-[11px] text-skp-cyan font-mono">
                      📍 {officeCoordsDisplay}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono line-clamp-1 sm:line-clamp-none">
                    41/333 หมู่ที่ 12 ถนนนวลจันทร์ แขวงคลองกุ่ม เขตบึงกุ่ม กรุงเทพมหานคร 10230 (พิกัด GPS: {officeCoordsDisplay})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-skp-navy-light transition-colors"
                aria-label="ปิดหน้าต่างแผนที่"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Map Viewport */}
            <div className="relative w-full h-[380px] sm:h-[480px] bg-slate-900">
              <iframe
                src={googleMapsEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps ปักหมุดที่ตั้ง SKP Association"
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-skp-navy-deep border-t border-skp-navy-border flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-300 font-mono">
                <span className="text-skp-cyan font-semibold">พิกัด GPS:</span> {officeCoordsDisplay} | <span className="text-slate-400 font-sans">เข้าได้จากทั้งทาง ถ.รามอินทรา (กม.6) และ ถ.ประเสริฐมนูกิจ</span>
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyCoords}
                  className="px-3 py-2 bg-skp-navy-card hover:bg-skp-navy-light text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-skp-navy-border flex items-center justify-center transition-colors"
                  title="คัดลอกพิกัดละติจูด ลองจิจูด"
                >
                  {copiedCoords ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">คัดลอกพิกัดแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1 text-skp-cyan" />
                      <span>คัดลอกพิกัด GPS</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="px-3 py-2 bg-skp-navy-card hover:bg-skp-navy-light text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-skp-navy-border flex items-center justify-center transition-colors"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">คัดลอกที่อยู่แล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      <span>คัดลอกที่อยู่</span>
                    </>
                  )}
                </button>
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-skp-red hover:bg-skp-red-hover text-white rounded-lg text-xs font-semibold flex items-center justify-center shadow-lg transition-all"
                >
                  <Navigation className="w-3.5 h-3.5 mr-1.5" />
                  <span>นำทาง Google Maps</span>
                  <ExternalLink className="w-3 h-3 ml-1.5 opacity-80" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
