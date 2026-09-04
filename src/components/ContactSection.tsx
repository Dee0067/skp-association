'use client';

import React, { useState, useRef } from 'react';
import { 
  Phone, 
  Smartphone,
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
  Paperclip,
  Eye
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations';
import QuotationDocumentPreviewModal, { QuotationPreviewData } from './QuotationDocumentPreviewModal';

export default function ContactSection() {
  const { language } = useLanguage();
  const t = translations[language].contact;

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
    docRefNumber: string;
    createdDate: string;
  } | null>(null);

  // Document Preview Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<QuotationPreviewData | null>(null);

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

  // Step 1: Open PDF preview document before final submission
  const handleOpenPreview = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.name.trim() || !formData.company.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setSubmitError(language === 'en' ? 'Please fill in all required fields marked with *' : 'กรุณากรอกข้อมูลในช่องที่มีเครื่องหมาย * ให้ครบถ้วน');
      return;
    }

    if (!formData.email.includes('@')) {
      setSubmitError(language === 'en' ? 'Please enter a valid email address' : 'กรุณากรอกอีเมล (Email Address) ให้ถูกต้องครบถ้วน');
      return;
    }

    const now = new Date();
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const day = now.getDate();
    const monthIdx = now.getMonth();
    const thaiYear = now.getFullYear() + 543;
    const ceYear = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const mins = now.getMinutes().toString().padStart(2, '0');

    const fullDateStr = language === 'en'
      ? `${now.toLocaleString('en-US', { month: 'long' })} ${day}, ${ceYear}`
      : `${day} ${thaiMonths[monthIdx]} ${thaiYear}`;

    const createdDate = language === 'en'
      ? `${now.toLocaleString('en-US', { month: 'short' })} ${day}, ${ceYear} ${hours}:${mins}`
      : `${day} ${thaiMonths[monthIdx]} ${thaiYear} ${hours}:${mins} น.`;

    const refCode = `RFQ-${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    setPreviewData({
      name: formData.name.trim(),
      company: formData.company.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      serviceType: formData.serviceType,
      message: formData.message.trim(),
      files,
      docRefNumber: refCode,
      createdDate,
      fullDateStr,
    });

    setIsPreviewOpen(true);
  };

  // Step 2: Confirmed submission from the PDF preview modal
  const handleConfirmSubmit = async () => {
    if (!previewData) return;
    setLoading(true);
    setSubmitError(null);

    try {
      const data = new FormData();
      data.append('name', previewData.name);
      data.append('company', previewData.company);
      data.append('phone', previewData.phone);
      data.append('email', previewData.email);
      data.append('serviceType', previewData.serviceType);
      data.append('message', previewData.message);
      data.append('docRefNumber', previewData.docRefNumber);

      for (const file of previewData.files) {
        data.append('files', file);
      }

      // 1. Try serverless API route first (which uses direct Gmail SMTP if configured)
      let res = await fetch('/api/quotation', {
        method: 'POST',
        body: data,
      });

      let result = await res.json().catch(() => null);

      // 2. If serverless API did not succeed, fallback to direct browser submission to FormSubmit
      if (!res.ok || !result || !result.success) {
        console.log('Serverless relay fallback, attempting direct client submission...');
        const clientFormData = new FormData();
        clientFormData.append('_subject', `[${previewData.docRefNumber}] ขอใบเสนอราคา: ${previewData.name} - ${previewData.company}`);
        clientFormData.append('เลขที่คำขอ', previewData.docRefNumber);
        clientFormData.append('ชื่อผู้ติดต่อ', previewData.name);
        clientFormData.append('บริษัท_องค์กร', previewData.company);
        clientFormData.append('เบอร์โทรศัพท์', previewData.phone);
        clientFormData.append('อีเมล', previewData.email);
        clientFormData.append('_replyto', previewData.email);
        clientFormData.append('_cc', previewData.email);
        clientFormData.append('ขอบข่ายงานวิศวกรรม', previewData.serviceType);
        clientFormData.append('รายละเอียดโครงการ', previewData.message);
        clientFormData.append('วันเวลาออกเอกสาร', previewData.createdDate);
        clientFormData.append('_template', 'table');
        clientFormData.append('_captcha', 'false');

        for (const file of previewData.files) {
          clientFormData.append('attachment', file, file.name);
        }

        try {
          const directRes = await fetch('https://formsubmit.co/ajax/supot.meskp@gmail.com', {
            method: 'POST',
            body: clientFormData,
            headers: {
              Accept: 'application/json',
            },
          });

          const directData = await directRes.json().catch(() => null);
          if (directData) {
            if (directData.success === 'true' || directData.success === true) {
              result = { success: true };
              res = { ok: true } as any;
            } else if (typeof directData.message === 'string' && directData.message.toLowerCase().includes('activation')) {
              throw new Error(
                'ระบบต้องการการยืนยันครั้งแรก (One-time Activation): ได้มีอีเมลหัวข้อ "Activate Form" ส่งไปยัง supot.meskp@gmail.com แล้ว กรุณาเปิดกล่องจดหมาย Inbox หรือ Junk/Spam และคลิกปุ่ม Activate Form 1 ครั้ง เพื่อเปิดรับข้อความเข้าอีเมลนี้อย่างถาวร'
              );
            } else {
              throw new Error(directData.message || 'ระบบไม่สามารถส่งข้อความได้');
            }
          }
        } catch (directErr: any) {
          throw new Error(directErr.message || result?.error || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
        }
      }

      if (!res.ok || !result || !result.success) {
        throw new Error(result?.error || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
      }

      setSubmittedData({
        name: previewData.name,
        company: previewData.company,
        phone: previewData.phone,
        email: previewData.email,
        serviceType: previewData.serviceType,
        filesCount: previewData.files.length,
        docRefNumber: previewData.docRefNumber,
        createdDate: previewData.createdDate,
      });

      setIsPreviewOpen(false);
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
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Official Contact Card & Office Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-skp-navy-card rounded-2xl border border-skp-navy-border p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">{t.officeCardTitle}</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">{t.officeCardSub}</p>
                <p className="text-xs text-skp-cyan font-mono mt-1">{t.companyName}</p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-skp-cyan shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">{t.addressTitle}</span>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-200 leading-relaxed block font-medium hover:text-skp-cyan transition-colors group"
                      title="Google Maps"
                    >
                      <span>{t.addressLine}</span>
                      <span className="inline-flex items-center text-xs text-skp-cyan font-mono ml-2 group-hover:underline">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        {t.openPin}
                      </span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-skp-cyan shrink-0 mt-0.5">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">{t.mobilePhoneTitle}</span>
                    <a href="tel:0936956445" className="text-lg font-bold text-skp-cyan hover:underline transition-colors font-mono block">
                      093-695-6445
                    </a>
                    <span className="text-xs text-slate-300 font-medium">
                      {t.managerLabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-skp-red shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">{t.officePhoneTitle}</span>
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
                    <span className="text-xs font-mono text-slate-400 block">{t.faxTitle}</span>
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
                    <span className="text-xs font-mono text-slate-400 block">{t.hoursTitle}</span>
                    <span className="text-slate-200">
                      {t.hoursValue}
                    </span>
                    <span className="block text-xs text-slate-400 mt-0.5">{t.hoursSub}</span>
                  </div>
                </div>
              </div>

              {/* Interactive Viewable Office Map */}
              <div className="p-4 rounded-xl bg-skp-navy-deep border border-skp-navy-border space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center text-slate-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-skp-cyan" />
                    {t.mapPinTitle}
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
                    title="Google Maps SKP Association"
                  />

                  {/* Top-Right Expand Button Overlay */}
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      type="button"
                      onClick={() => setIsMapModalOpen(true)}
                      className="px-2.5 py-1.5 rounded-md bg-skp-navy-dark/90 hover:bg-skp-navy-card text-white border border-skp-navy-border text-xs flex items-center shadow-lg transition-all backdrop-blur-md hover:border-skp-cyan/50"
                      title={t.fullscreenMap}
                    >
                      <Maximize2 className="w-3.5 h-3.5 mr-1.5 text-skp-cyan" />
                      <span className="font-medium">{t.fullscreenMap}</span>
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
                    <span>{t.openGmapsBtn}</span>
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
                        <span className="text-emerald-400 font-semibold">{t.copiedAddressBtn}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        <span>{t.copyAddressBtn}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Coordinates & Location info */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono border-t border-skp-navy-border/60">
                  <span className="text-slate-300">GPS: {officeCoordsDisplay}</span>
                  <button
                    type="button"
                    onClick={handleCopyCoords}
                    className="text-skp-cyan hover:underline inline-flex items-center transition-colors"
                  >
                    {copiedCoords ? (
                      <>
                        <Check className="w-3 h-3 mr-1 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">{t.copiedCoordsBtn}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        <span>{t.copyCoordsBtn}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 leading-tight">
                  {t.locationDirectionsNote}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Interactive Consultation & RFP Form */}
          <div className="lg:col-span-7">
            <div className="bg-skp-navy-card rounded-2xl border border-skp-navy-border p-6 sm:p-8 shadow-2xl relative tech-border">
              
              <div className="pb-6 border-b border-skp-navy-border mb-6">
                <h3 className="text-xl font-bold text-white">{t.formTitle}</h3>
                <p className="text-xs text-slate-300 mt-1">
                  {t.formSubtitle}
                </p>
              </div>

              {submitted ? (
                <div className="py-10 px-4 sm:px-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white">{t.successTitle}</h4>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                      {submittedData?.docRefNumber && (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-skp-navy-deep border border-skp-cyan/40 text-skp-cyan text-xs font-mono font-bold">
                          #{submittedData.docRefNumber}
                        </span>
                      )}
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                        {t.successSentBadge}
                      </span>
                      {submittedData?.email && (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono">
                          {t.successCopyBadge} {submittedData.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                    {t.successDesc}
                  </p>

                  {submittedData && (
                    <div className="max-w-md mx-auto p-4 rounded-xl bg-skp-navy-deep border border-skp-navy-border text-left text-xs space-y-2 font-mono">
                      <div className="flex justify-between border-b border-skp-navy-border/60 pb-1.5 text-slate-300">
                        <span className="text-slate-400 font-sans">{language === 'en' ? 'Document Ref No:' : 'เลขที่อ้างอิงเอกสาร:'}</span>
                        <span className="text-skp-cyan font-bold">{submittedData.docRefNumber}</span>
                      </div>
                      <div className="flex justify-between border-b border-skp-navy-border/60 pb-1.5 text-slate-300">
                        <span className="text-slate-400 font-sans">{language === 'en' ? 'Contact Person:' : 'ผู้ติดต่อ:'}</span>
                        <span className="text-white font-medium">{submittedData.name} ({submittedData.company})</span>
                      </div>
                      <div className="flex justify-between border-b border-skp-navy-border/60 pb-1.5 text-slate-300">
                        <span className="text-slate-400 font-sans">{language === 'en' ? 'Telephone:' : 'เบอร์โทรศัพท์:'}</span>
                        <span className="text-skp-cyan font-bold">{submittedData.phone}</span>
                      </div>
                      <div className="flex justify-between border-b border-skp-navy-border/60 pb-1.5 text-slate-300">
                        <span className="text-slate-400 font-sans">{language === 'en' ? 'Email Copy To:' : 'อีเมลผู้ส่ง (รับสำเนา):'}</span>
                        <span className="text-emerald-300 font-semibold">{submittedData.email}</span>
                      </div>
                      <div className="flex justify-between text-slate-300 pt-0.5">
                        <span className="text-slate-400 font-sans">{t.filesAttached}:</span>
                        <span className="text-emerald-400 font-semibold">{submittedData.filesCount} {language === 'en' ? 'files' : 'ไฟล์'}</span>
                      </div>
                    </div>
                  )}

                  {/* in:sent Direct Action Card */}
                  {submittedData && (
                    <div className="max-w-md mx-auto p-4 rounded-xl bg-skp-navy-card/90 border border-skp-cyan/30 text-left space-y-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-white">
                        <Mail className="w-4 h-4 text-skp-cyan" />
                        <span>{language === 'en' ? 'Record in your Gmail Sent box (in:sent)?' : 'ต้องการบันทึกลงในกล่อง "ส่งแล้ว" (in:sent) ใน Gmail ของท่าน?'}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {language === 'en'
                          ? 'A ready draft addressed to supot.meskp@gmail.com has been prepared. Click below to review and send directly via your Gmail client.'
                          : 'ระบบจัดเตรียมแบบร่างที่กรอกข้อมูลโครงการและส่งถึง supot.meskp@gmail.com ไว้ให้แล้ว ท่านสามารถกดปุ่มด้านล่างเพื่อเปิดส่งผ่าน Gmail ของท่านได้ทันที โดยอีเมลจะถูกบันทึกไว้ใน in:sent ของท่านอย่างสมบูรณ์'}
                      </p>
                      <div className="pt-1">
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=supot.meskp@gmail.com&su=${encodeURIComponent(
                            `[${submittedData.docRefNumber}] ขอใบเสนอราคา: ${submittedData.name} - ${submittedData.company}`
                          )}&body=${encodeURIComponent(
                            `Attn: SKP Association Engineering Team

Reference: ${submittedData.docRefNumber}
Contact Name: ${submittedData.name}
Company: ${submittedData.company}
Telephone: ${submittedData.phone}
Email: ${submittedData.email}
Scope: ${submittedData.serviceType}

(Sent via skp-association.com inquiry system)`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-lg bg-skp-red hover:bg-skp-red-hover text-white text-xs font-semibold inline-flex items-center space-x-2 shadow-lg transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Open in Gmail (Record in in:sent)' : 'เปิดส่งใน Gmail (บันทึกลง in:sent ทันที)'}</span>
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-sm text-slate-200 hover:text-white hover:border-skp-cyan/50 font-medium transition-colors"
                    >
                      {t.sendMoreBtn}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleOpenPreview} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {t.fullNameLabel} <span className="text-skp-red">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder={t.fullNamePlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-sm text-white focus:outline-none focus:border-skp-cyan transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {t.companyLabel} <span className="text-skp-red">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        placeholder={t.companyPlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-sm text-white focus:outline-none focus:border-skp-cyan transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {t.phoneLabel} <span className="text-skp-red">*</span>
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder={t.phonePlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-sm text-white focus:outline-none focus:border-skp-cyan transition-colors font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {t.emailLabel} <span className="text-skp-red">*</span>
                      </label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder={t.emailPlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-sm text-white focus:outline-none focus:border-skp-cyan transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t.serviceTypeLabel} <span className="text-skp-red">*</span>
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-sm text-white focus:outline-none focus:border-skp-cyan transition-colors"
                    >
                      <option value="electrical">{t.serviceOpt1}</option>
                      <option value="mep">{t.serviceOpt2}</option>
                      <option value="hvac">{t.serviceOpt3}</option>
                      <option value="fire">{t.serviceOpt4}</option>
                      <option value="construction">{t.serviceOpt5}</option>
                      <option value="other">{t.serviceOpt6}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t.descLabel}
                    </label>
                    <textarea 
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder={t.descPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-skp-navy-deep border border-skp-navy-border text-sm text-white focus:outline-none focus:border-skp-cyan transition-colors"
                    />
                  </div>

                  {/* File Upload Component */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        {t.uploadLabel}
                      </label>
                      <span className="text-[11px] font-mono text-slate-400">
                        {t.uploadSub}
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
                            {t.uploadDropText}
                          </span>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {t.uploadDropSub}
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
                          <span>{t.filesAttached} ({files.length} {language === 'en' ? 'items' : 'รายการ'}):</span>
                          <span className={totalFileSize > MAX_TOTAL_SIZE ? 'text-rose-400 font-bold' : 'text-skp-cyan'}>
                            {language === 'en' ? `Total ${formatFileSize(totalFileSize)} / Max 15 MB` : `รวม ${formatFileSize(totalFileSize)} / สูงสุด 15 MB`}
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
                                  title={language === 'en' ? 'Remove file' : 'ลบไฟล์นี้'}
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

                  {/* Submission Error or Activation Banner */}
                  {submitError && (
                    <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-xs text-amber-200 space-y-2.5 animate-in fade-in">
                      <div className="flex items-start space-x-2.5">
                        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-semibold text-white text-sm">
                            {language === 'en' ? 'Notice Regarding Submission' : 'แจ้งเตือนการส่งข้อมูล'}
                          </p>
                          <p className="text-slate-200 leading-relaxed">
                            {submitError}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-amber-500/30 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-300">
                          {language === 'en' ? 'Or send directly with attachments to our engineers:' : 'หรือส่งข้อมูลพร้อมไฟล์แนบหาทีมวิศวกรโดยตรงได้ทันที:'}
                        </span>
                        <a 
                          href={`mailto:supot.meskp@gmail.com?subject=${encodeURIComponent(
                            `[RFP] ${formData.name || 'Client'} (${formData.company || '-'})`
                          )}&body=${encodeURIComponent(
                            `Attn: SKP Association Engineering Team

Name: ${formData.name}
Company: ${formData.company}
Phone: ${formData.phone}
Email: ${formData.email}
Scope: ${formData.serviceType}

Project Scope:
${formData.message}

(Attachments can be added directly to this email)`
                          )}`}
                          className="px-3 py-1.5 rounded-lg bg-skp-red hover:bg-skp-red-hover text-white font-semibold text-xs inline-flex items-center space-x-1.5 shadow transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Send email to supot.meskp@gmail.com' : 'เปิดส่งทางอีเมล supot.meskp@gmail.com'}</span>
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
                      <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform text-rose-200" />
                      <span>{t.reviewBeforeSubmitBtn || t.submitBtn}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 pt-2 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.securityNote}</span>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* PDF Quotation Document Preview Modal */}
      {previewData && (
        <QuotationDocumentPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onConfirm={handleConfirmSubmit}
          data={previewData}
          isLoading={loading}
        />
      )}

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
                      {t.modalTitle}
                    </h3>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-skp-navy-card border border-skp-cyan/40 text-[11px] text-skp-cyan font-mono">
                      📍 {officeCoordsDisplay}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono line-clamp-1 sm:line-clamp-none">
                    {t.addressLine} (GPS: {officeCoordsDisplay})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-skp-navy-light transition-colors"
                aria-label={language === 'en' ? 'Close map modal' : 'ปิดหน้าต่างแผนที่'}
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
                title="Google Maps SKP Association"
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-skp-navy-deep border-t border-skp-navy-border flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-300 font-mono">
                <span className="text-skp-cyan font-semibold">GPS:</span> {officeCoordsDisplay} | <span className="text-slate-400 font-sans">{t.locationDirectionsNote}</span>
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyCoords}
                  className="px-3 py-2 bg-skp-navy-card hover:bg-skp-navy-light text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-skp-navy-border flex items-center justify-center transition-colors"
                  title={t.copyCoordsBtn}
                >
                  {copiedCoords ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">{t.copiedCoordsBtn}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1 text-skp-cyan" />
                      <span>{t.copyCoordsBtn}</span>
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
                      <span className="text-emerald-400 font-medium">{t.copiedAddressBtn}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      <span>{t.copyAddressBtn}</span>
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
                  <span>{t.openGmapsBtn}</span>
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
