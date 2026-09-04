'use client';

import React, { useRef } from 'react';
import { 
  Printer, 
  Send, 
  X, 
  Edit3, 
  FileText, 
  Building2, 
  Phone, 
  Mail, 
  Calendar, 
  FileCode, 
  CheckCircle, 
  Loader2,
  Paperclip,
  ShieldCheck,
  Download,
  FileCheck
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations';

export interface QuotationPreviewData {
  name: string;
  company: string;
  phone: string;
  email: string;
  serviceType: string;
  message: string;
  files: File[];
  docRefNumber: string;
  createdDate: string;
  fullDateStr: string;
}

interface QuotationDocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: QuotationPreviewData;
  isLoading: boolean;
}

export default function QuotationDocumentPreviewModal({
  isOpen,
  onClose,
  onConfirm,
  data,
  isLoading,
}: QuotationDocumentPreviewModalProps) {
  const { language } = useLanguage();
  const t = translations[language].contact;
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const serviceTypeLabels: Record<string, { th: string; en: string }> = {
    electrical: {
      th: 'ออกแบบและปรึกษาระบบไฟฟ้า / หม้อแปลง / ตู้ MDB (Electrical Power Design)',
      en: 'Electrical Power Design / Transformers / MDB Switchboards',
    },
    mep: {
      th: 'รับเหมาติดตั้งงานระบบประกอบอาคาร (M&E Turnkey Contracting)',
      en: 'Turnkey Building Mechanical & Electrical (M&E) Contracting',
    },
    hvac: {
      th: 'ระบบปรับอากาศและระบายอากาศ (HVAC Chiller / AHU / Ducting)',
      en: 'HVAC Chiller Plants & Air Ventilation Systems',
    },
    fire: {
      th: 'ระบบดับเพลิงและระบบสุขาภิบาล (Fire Protection & Sanitary Plumbing)',
      en: 'Fire Protection & Sanitary Plumbing Systems',
    },
    construction: {
      th: 'งานรับเหมาก่อสร้างอาคารและโรงงานอุตสาหกรรม (Civil & Industrial Construction)',
      en: 'Industrial Plant & Commercial Civil Construction',
    },
    other: {
      th: 'งานประเมินราคาตามแบบ (BOQ / TOR / Tender Estimation)',
      en: 'Bill of Quantities / Tender Estimation (BOQ / TOR)',
    },
  };

  const currentServiceLabel = serviceTypeLabels[data.serviceType]
    ? (language === 'en' ? serviceTypeLabels[data.serviceType].en : serviceTypeLabels[data.serviceType].th)
    : data.serviceType;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileBadge = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (['dwg', 'dxf', 'dwf'].includes(ext)) {
      return { label: 'AutoCAD DWG', color: 'bg-amber-50 text-amber-900 border-amber-300' };
    }
    if (['pdf'].includes(ext)) {
      return { label: 'PDF Document', color: 'bg-rose-50 text-rose-900 border-rose-300' };
    }
    if (['xls', 'xlsx', 'csv'].includes(ext)) {
      return { label: 'Excel Spreadsheet', color: 'bg-emerald-50 text-emerald-900 border-emerald-300' };
    }
    if (['doc', 'docx'].includes(ext)) {
      return { label: 'Word Document', color: 'bg-blue-50 text-blue-900 border-blue-300' };
    }
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
      return { label: 'Picture / Image', color: 'bg-purple-50 text-purple-900 border-purple-300' };
    }
    return { label: ext.toUpperCase() || 'FILE', color: 'bg-slate-50 text-slate-900 border-slate-300' };
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print Specific CSS to isolate and render exactly as a clean standard A4 page */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm 10mm 12mm;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #quotation-document-sheet,
          #quotation-document-sheet * {
            visibility: visible !important;
          }
          #quotation-document-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            color: #0f172a !important;
            font-size: 11pt !important;
            line-height: 1.4 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div 
        className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto animate-in fade-in duration-200"
        onClick={() => !isLoading && onClose()}
      >
        <div 
          className="bg-skp-navy-card border border-skp-navy-border rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Top Bar */}
          <div className="p-3.5 sm:p-4 border-b border-skp-navy-border flex items-center justify-between bg-skp-navy-deep shrink-0 no-print">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-skp-red/15 border border-skp-red/30 text-skp-red shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {t.previewModalTitle}
                  </h3>
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    {data.docRefNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {t.previewModalSub}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-skp-navy-light transition-colors disabled:opacity-50"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body: Scrollable Document View on Clean Desk Backdrop */}
          <div className="p-3 sm:p-6 lg:p-8 overflow-y-auto bg-slate-800/60 flex justify-center">
            
            {/* The Pure White A4 Document Sheet */}
            <div 
              ref={printRef}
              id="quotation-document-sheet"
              className="bg-white text-slate-800 rounded-md shadow-2xl w-full max-w-[210mm] p-6 sm:p-9 border border-slate-200 font-sans text-xs sm:text-sm leading-relaxed relative selection:bg-rose-100"
              style={{ minHeight: '280mm' }}
            >
              {/* Top Accent Lines */}
              <div className="h-1.5 w-full bg-gradient-to-r from-skp-navy-deep via-skp-navy to-skp-red rounded-t-sm mb-5" />

              {/* Document Header */}
              <div className="border-b-2 border-slate-800 pb-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Company Info & Real Color Logo */}
                  <div className="flex items-start space-x-3.5 flex-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo.png"
                      alt="SKP Association Logo"
                      className="h-12 sm:h-14 w-auto object-contain shrink-0 mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                        บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด
                      </h1>
                      <p className="text-[11px] font-bold text-slate-700 tracking-wider font-mono">
                        SKP ASSOCIATION CO., LTD.
                      </p>
                      <p className="text-[11px] text-slate-600 leading-snug pt-0.5 max-w-lg">
                        41/333 หมู่ที่ 12 ถนนนวลจันทร์ แขวงคลองกุ่ม เขตบึงกุ่ม กรุงเทพมหานคร 10230<br />
                        โทรศัพท์: 02-116-4125, 093-695-6445 | โทรสาร: 02-116-4126<br />
                        อีเมล: supot.meskp@gmail.com | เว็บไซต์: skpassociation.co.th
                      </p>
                    </div>
                  </div>

                  {/* Document Reference Block */}
                  <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-1 border-slate-200 space-y-1.5 shrink-0 font-mono text-[11px]">
                    <div className="text-slate-800 text-xs sm:text-sm">
                      <span className="font-semibold text-slate-600">{t.docRefNo}</span> <span className="font-bold text-skp-red">{data.docRefNumber}</span>
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      {t.docDate} {data.createdDate}
                    </div>
                  </div>
                </div>

                {/* Formal Title Banner */}
                <div className="mt-3 text-center py-2 px-4 bg-slate-900 text-white rounded font-bold text-xs sm:text-sm tracking-wide uppercase shadow-sm">
                  <span>{t.docHeaderTitle}</span>
                </div>
              </div>

              {/* Section 1: Inquirer / Client Information */}
              <div className="mb-4">
                <div className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 flex items-center space-x-2 text-xs uppercase tracking-wide">
                  <Building2 className="w-3.5 h-3.5 text-skp-red shrink-0" />
                  <span>{t.clientSectionTitle}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/80 p-3 rounded-md border border-slate-200">
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-500 font-medium block">
                      {language === 'en' ? 'Contact Person Name:' : 'ชื่อ-นามสกุล ผู้ติดต่อ:'}
                    </span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{data.name || '-'}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-500 font-medium block">
                      {language === 'en' ? 'Company / Organization:' : 'บริษัท / องค์กร / นิติบุคคล:'}
                    </span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{data.company || '-'}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-500 font-medium block">
                      {language === 'en' ? 'Telephone Number:' : 'เบอร์โทรศัพท์ติดต่อ:'}
                    </span>
                    <span className="font-semibold text-slate-900 font-mono text-xs sm:text-sm">{data.phone || '-'}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-500 font-medium block">
                      {language === 'en' ? 'Email Address:' : 'อีเมล (รับสำเนาเอกสาร):'}
                    </span>
                    <span className="font-semibold text-sky-800 font-mono text-xs sm:text-sm">{data.email || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Requested Engineering Discipline */}
              <div className="mb-4">
                <div className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 flex items-center space-x-2 text-xs uppercase tracking-wide">
                  <FileCode className="w-3.5 h-3.5 text-skp-red shrink-0" />
                  <span>{t.scopeSectionTitle}</span>
                </div>

                <div className="p-2.5 bg-sky-50/80 border border-sky-200 rounded-md text-sky-950 font-semibold text-xs sm:text-sm flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0" />
                  <span>{currentServiceLabel}</span>
                </div>
              </div>

              {/* Section 3: Project Scope & Specifications */}
              <div className="mb-4">
                <div className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 flex items-center space-x-2 text-xs uppercase tracking-wide">
                  <FileText className="w-3.5 h-3.5 text-skp-red shrink-0" />
                  <span>{t.detailsSectionTitle}</span>
                </div>

                <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-md text-slate-800 whitespace-pre-wrap leading-relaxed text-xs sm:text-sm min-h-[60px]">
                  {data.message || (language === 'en' ? 'No additional specifications provided.' : 'ไม่ได้ระบุรายละเอียดเพิ่มเติม')}
                </div>
              </div>

              {/* Section 4: Attached Technical Documents */}
              <div className="mb-4">
                <div className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 flex items-center justify-between text-xs uppercase tracking-wide">
                  <div className="flex items-center space-x-2">
                    <Paperclip className="w-3.5 h-3.5 text-skp-red shrink-0" />
                    <span>{t.attachmentsSectionTitle}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 lowercase">
                    ({data.files.length} {language === 'en' ? 'items' : 'รายการ'})
                  </span>
                </div>

                {data.files.length > 0 ? (
                  <div className="border border-slate-200 rounded-md overflow-hidden bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                        <tr>
                          <th className="py-1.5 px-3 w-8 text-center">#</th>
                          <th className="py-1.5 px-3">{t.fileNameHeader}</th>
                          <th className="py-1.5 px-3 w-32">{t.fileTypeHeader}</th>
                          <th className="py-1.5 px-3 w-24 text-right">{t.fileSizeHeader}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.files.map((file, idx) => {
                          const badge = getFileBadge(file.name);
                          return (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-1.5 px-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                              <td className="py-1.5 px-3 font-medium text-slate-800 truncate max-w-xs" title={file.name}>
                                {file.name}
                              </td>
                              <td className="py-1.5 px-3">
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${badge.color}`}>
                                  {badge.label}
                                </span>
                              </td>
                              <td className="py-1.5 px-3 text-right font-mono text-slate-600 text-[11px]">
                                {formatFileSize(file.size)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-500 text-xs italic">
                    {t.noAttachmentsNote}
                  </div>
                )}
              </div>

              {/* Section 5: Terms & Confidentiality */}
              <div className="mb-5 p-2.5 bg-slate-50 rounded-md border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                <div className="font-bold text-slate-800 mb-0.5 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t.termsSectionTitle}</span>
                </div>
                <p>{t.termsNotice}</p>
              </div>

              {/* Signatures & Endorsement Block */}
              <div className="pt-3 border-t-2 border-slate-300 grid grid-cols-2 gap-6 text-center text-xs">
                
                {/* Left: Inquirer Signature */}
                <div className="space-y-3">
                  <p className="font-semibold text-slate-700">{t.applicantSignature}</p>
                  
                  <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 font-medium text-slate-900 text-sm">
                    ( {data.name || '................................................'} )
                  </div>

                  {/* Full Thai / English Date */}
                  <p className="text-[11px] text-slate-600 font-medium font-sans">
                    {language === 'en' ? 'Date:' : 'วันที่:'} {data.fullDateStr || data.createdDate}
                  </p>
                </div>

                {/* Right: SKP Engineering Division */}
                <div className="space-y-3">
                  <p className="font-semibold text-slate-700">{t.recipientSignature}</p>

                  <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 text-slate-700 text-sm">
                    ( คุณสุพจน์ มั่นสิทธิกุล / ฝ่ายวิศวกรรม )
                  </div>

                  <p className="text-[11px] text-slate-600 font-medium font-sans">
                    {language === 'en' ? 'Date:' : 'วันที่:'} {data.fullDateStr || data.createdDate}
                  </p>
                </div>

              </div>

              {/* Document Footer Watermark */}
              <div className="mt-6 pt-2 border-t border-slate-200 text-[9px] text-slate-400 font-mono flex items-center justify-between">
                <span>SKP-ASSOCIATION-E-FORM // OFFICIAL INQUIRY SHEET (A4)</span>
                <span>DESTINATION: SUPOT.MESKP@GMAIL.COM</span>
              </div>
            </div>

          </div>

          {/* Modal Footer Action Controls */}
          <div className="p-3.5 sm:p-4 bg-skp-navy-deep border-t border-skp-navy-border flex flex-wrap items-center justify-between gap-3 shrink-0 no-print">
            {/* Left Action: Print & Save as PDF */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-lg bg-skp-navy-card hover:bg-skp-navy-light text-slate-200 hover:text-white border border-skp-navy-border hover:border-skp-cyan/50 text-xs font-semibold inline-flex items-center space-x-2 transition-all shadow"
                title="Print or save this document as PDF"
              >
                <Printer className="w-4 h-4 text-skp-cyan" />
                <span>{t.printPdfBtn}</span>
              </button>
            </div>

            {/* Right Actions: Back to Edit & Confirm Submit */}
            <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                disabled={isLoading}
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg bg-skp-navy-card hover:bg-skp-navy-light text-slate-300 hover:text-white border border-skp-navy-border text-xs font-medium inline-flex items-center space-x-1.5 transition-colors disabled:opacity-50"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t.editFormBtn}</span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={onConfirm}
                className="px-5 py-2 rounded-lg bg-skp-red hover:bg-skp-red-hover text-white text-xs font-bold shadow-xl shadow-skp-red/30 border border-skp-red-hover inline-flex items-center space-x-2 transition-all disabled:opacity-50 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{t.confirmingBtn}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    <span>{t.confirmSubmitBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
