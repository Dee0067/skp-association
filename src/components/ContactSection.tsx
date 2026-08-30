'use client';

import React, { useState, useRef } from 'react';
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
  Check,
  Upload,
  Trash2,
  Loader2,
  FileSpreadsheet,
  Image as ImageIcon,
  Layers,
  Paperclip
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

  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    company: string;
    phone: string;
    email: string;
    serviceType: string;
    filesCount: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const MAX_TOTAL_SIZE = 15 * 1024 * 1024; // 15 MB
  const totalFileSize = files.reduce((acc, f) => acc + f.size, 0);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileBadge = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (['dwg', 'dxf', 'dwf'].includes(ext)) {
      return { label: 'AutoCAD', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    }
    if (['pdf'].includes(ext)) {
      return { label: 'PDF', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
    }
    if (['xls', 'xlsx', 'csv'].includes(ext)) {
      return { label: 'Excel', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    }
    if (['doc', 'docx'].includes(ext)) {
      return { label: 'Word', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
    }
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
      return { label: 'Picture', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
    }
    return { label: ext.toUpperCase() || 'FILE', color: 'bg-slate-500/20 text-slate-300 border-slate-500/40' };
  };

  const validateAndAddFiles = (newFiles: FileList | File[]) => {
    setFileError(null);
    const validExtensions = ['.pdf', '.xls', '.xlsx', '.csv', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webp', '.dwg', '.dxf', '.dwf'];
    const addedList: File[] = [];

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const ext = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
      if (!validExtensions.includes(ext)) {
        setFileError(`ไฟล์ "${file.name}" ไม่ใช่ประเภทที่รองรับ (รองรับ PDF, Excel, Word, AutoCAD และรูปภาพ)`);
        continue;
      }
      // Check duplicate
      const isDuplicate = files.some((existing) => existing.name === file.name && existing.size === file.size);
      if (isDuplicate) continue;

      addedList.push(file);
    }

    const nextFiles = [...files, ...addedList];
    const newTotal = nextFiles.reduce((sum, f) => sum + f.size, 0);

    if (newTotal > MAX_TOTAL_SIZE) {
      setFileError('ขนาดไฟล์รวมเกิน 15 MB กรุณาเลือกไฟล์ที่มีขนาดเล็กลง หรือส่งไฟล์เพิ่มเติมผ่านอีเมล supot.meskp@gmail.com ได้โดยตรง');
      return;
    }

    if (nextFiles.length > 10) {
      setFileError('สามารถแนบไฟล์ได้สูงสุด 10 ไฟล์ต่อครั้ง');
      return;
    }

    setFiles(nextFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
    if (e.target) e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError(null);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('company', formData.company);
      data.append('phone', formData.phone);
      data.append('email', formData.email);
      data.append('serviceType', formData.serviceType);
      data.append('message', formData.message);

      for (const file of files) {
        data.append('files', file);
      }

      const res = await fetch('/api/quotation', {
        method: 'POST',
        body: data,
      });

      const result = await res.json().catch(() => null);

      if (!res.ok && (!result || !result.success)) {
        throw new Error(result?.error || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
      }

      setSubmittedData({
        name: formData.name,
        company: formData.company,
        phone: formData.phone,
        email: formData.email,
        serviceType: formData.serviceType,
        filesCount: files.length,
      });

      setSubmitted(true);
      setFiles([]);
      setFormData({
        name: '',
        company: '',
        phone: '',
        email: '',
        serviceType: 'electrical',
        message: '',
      });
    } catch (err: any) {
      console.error('Submit error:', err);
      setSubmitError(
        err.message || 'ไม่สามารถส่งข้อมูลได้ชั่วคราว สามารถส่งข้อมูลโดยตรงที่อีเมล supot.meskp@gmail.com หรือโทร 02-116-4125'
      );
    } finally {
      setLoading(false);
    }
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
                <div className="py-10 px-4 sm:px-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white">ได้รับข้อมูลเรียบร้อยแล้ว</h4>
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 mt-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                      <span>✓ ส่งข้อมูลไปยัง email: supot.meskp@gmail.com แล้ว</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                    ขอบพระคุณที่ให้ความไว้วางใจ บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด ทีมงานวิศวกรจะตรวจสอบรายละเอียดโครงการ{submittedData?.filesCount ? ` พร้อมไฟล์แนบ ${submittedData.filesCount} ไฟล์` : ''} และติดต่อกลับหาท่านโดยเร็วที่สุด
                  </p>

                  {submittedData && (
                    <div className="max-w-md mx-auto p-4 rounded-xl bg-skp-navy-deep border border-skp-navy-border text-left text-xs space-y-2 font-mono">
                      <div className="flex justify-between border-b border-skp-navy-border/60 pb-1.5 text-slate-300">
                        <span className="text-slate-400 font-sans">ผู้ติดต่อ:</span>
                        <span className="text-white font-medium">{submittedData.name} ({submittedData.company})</span>
                      </div>
                      <div className="flex justify-between border-b border-skp-navy-border/60 pb-1.5 text-slate-300">
                        <span className="text-slate-400 font-sans">เบอร์โทรศัพท์:</span>
                        <span className="text-skp-cyan font-bold">{submittedData.phone}</span>
                      </div>
                      {submittedData.email && (
                        <div className="flex justify-between border-b border-skp-navy-border/60 pb-1.5 text-slate-300">
                          <span className="text-slate-400 font-sans">อีเมล:</span>
                          <span className="text-slate-200">{submittedData.email}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-300 pt-0.5">
                        <span className="text-slate-400 font-sans">ไฟล์ที่แนบ:</span>
                        <span className="text-emerald-400 font-semibold">{submittedData.filesCount} ไฟล์</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-sm text-slate-200 hover:text-white hover:border-skp-cyan/50 font-medium transition-colors"
                    >
                      ส่งข้อมูลโครงการเพิ่มเติม
                    </button>
                  </div>
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
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="ระบุขนาดโครงการ เช่น กำลังไฟฟ้าที่ต้องการ, พื้นที่อาคาร, สถานที่ตั้ง, หรือกำหนดเวลาส่งมอบงาน..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-sm text-white focus:outline-none focus:border-skp-cyan transition-colors"
                    />
                  </div>

                  {/* File Upload Component */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        แนบไฟล์ประกอบ (PDF, Excel, Word, รูปภาพ, AutoCAD)
                      </label>
                      <span className="text-[11px] font-mono text-slate-400">
                        (ไม่บังคับ • สูงสุด 10 ไฟล์ รวมไม่เกิน 15MB)
                      </span>
                    </div>

                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer group ${
                        isDragging 
                          ? 'border-skp-cyan bg-skp-cyan/10' 
                          : 'border-skp-navy-border hover:border-skp-cyan/70 bg-skp-navy-deep/60'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.xls,.xlsx,.csv,.doc,.docx,.jpg,.jpeg,.png,.webp,.dwg,.dxf,.dwf"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-skp-navy-card border border-skp-navy-border flex items-center justify-center text-skp-cyan group-hover:scale-105 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-skp-cyan transition-colors">
                            คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
                          </span>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            รองรับไฟล์ PDF, Excel, Word, AutoCAD (.dwg / .dxf) และรูปภาพ
                          </p>
                        </div>

                        {/* Supported badges */}
                        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">PDF</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Excel (.xlsx/.xls)</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">Word (.docx/.doc)</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">Picture</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">AutoCAD (.dwg/.dxf)</span>
                        </div>
                      </div>
                    </div>

                    {/* File validation error */}
                    {fileError && (
                      <div className="mt-2 text-xs text-rose-400 flex items-center space-x-1.5 bg-rose-950/40 p-2.5 rounded-lg border border-rose-800/60">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{fileError}</span>
                      </div>
                    )}

                    {/* Attached files list */}
                    {files.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-300 px-1 font-mono">
                          <span>ไฟล์แนบ ({files.length} รายการ):</span>
                          <span className={totalFileSize > MAX_TOTAL_SIZE ? 'text-rose-400 font-bold' : 'text-skp-cyan'}>
                            รวม {formatFileSize(totalFileSize)} / สูงสุด 15 MB
                          </span>
                        </div>

                        <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                          {files.map((file, idx) => {
                            const badge = getFileBadge(file.name);
                            return (
                              <div
                                key={`${file.name}-${idx}`}
                                className="flex items-center justify-between p-2 rounded-lg bg-skp-navy-deep border border-skp-navy-border hover:border-skp-cyan/30 text-xs transition-colors"
                              >
                                <div className="flex items-center space-x-2 min-w-0 flex-1 mr-2">
                                  <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded border ${badge.color} shrink-0`}>
                                    {badge.label}
                                  </span>
                                  <span className="text-slate-200 truncate font-medium" title={file.name}>
                                    {file.name}
                                  </span>
                                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                                    ({formatFileSize(file.size)})
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(idx);
                                  }}
                                  className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors shrink-0"
                                  title="ลบไฟล์นี้"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submission Error Banner */}
                  {submitError && (
                    <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-xs text-rose-300 space-y-1.5">
                      <div className="flex items-center space-x-2 font-semibold">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{submitError}</span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        หากระบบมีปัญหา สามารถส่งไฟล์และรายละเอียดโดยตรงได้ที่อีเมล:{' '}
                        <a 
                          href="mailto:supot.meskp@gmail.com?subject=ขอใบเสนอราคา%20/%20ปรึกษางาน" 
                          className="text-skp-cyan underline font-mono"
                        >
                          supot.meskp@gmail.com
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading || totalFileSize > MAX_TOTAL_SIZE}
                      className="w-full py-3.5 px-6 rounded-lg bg-skp-red hover:bg-skp-red-hover text-white font-semibold text-sm shadow-xl shadow-skp-red/30 border border-skp-red-hover transition-all flex items-center justify-center group disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>กำลังส่งข้อมูลและแนบไฟล์ไปยัง supot.meskp@gmail.com...</span>
                        </div>
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
                    <span>ข้อมูลและไฟล์แนบจะถูกส่งตรงไปยัง email: supot.meskp@gmail.com อย่างปลอดภัย</span>
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
