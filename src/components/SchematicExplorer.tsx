'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Phone,
  Mail,
  Building2,
  HardHat,
  ShieldCheck,
  Briefcase,
  FileText,
  X,
  Check,
  Copy,
  Zap,
  Wind,
  Layers,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Users,
  Compass,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations';

interface Personnel {
  id: string;
  roleTh: string;
  roleEn: string;
  nameTh: string;
  nameEn: string;
  phone?: string;
  email?: string;
  photo?: string;
  division: 'head_office' | 'site_office';
  divisionBadgeTh: string;
  divisionBadgeEn: string;
  level: number;
  highlight?: boolean;
  dutiesTh: string[];
  dutiesEn: string[];
}

const personnelList: Personnel[] = [
  {
    id: 'supot',
    roleTh: 'กรรมการผู้จัดการ',
    roleEn: 'Managing Director',
    nameTh: 'คุณสุพจน์ มั่นสิทธิกุล',
    nameEn: 'Mr. Supot Munsittikul',
    phone: '093-695 6445',
    photo: '/organization/person-supot.jpg',
    division: 'head_office',
    divisionBadgeTh: 'สำนักงานใหญ่ (HQ)',
    divisionBadgeEn: 'Head Office (HQ)',
    level: 1,
    highlight: true,
    dutiesTh: [
      'บริหารจัดการองค์กรและกำหนดทิศทางนโยบายวิศวกรรม',
      'ควบคุมมาตรฐานคุณภาพ ความปลอดภัย และการจัดซื้อจัดจ้าง',
      'อนุมัติงบประมาณและแผนการดำเนินงานโครงการทั้งหมด'
    ],
    dutiesEn: [
      'Executive leadership & strategic engineering policy',
      'Quality assurance, safety protocols & procurement control',
      'Overall budget & major project milestone approvals'
    ]
  },
  {
    id: 'kannapaphat',
    roleTh: 'ผู้จัดการฝ่ายธุรการและประสานงาน',
    roleEn: 'Administrator',
    nameTh: 'คุณกัณณปภัสส์ ช.',
    nameEn: 'Ms. Kannapaphat C.',
    phone: '090-415 5144',
    photo: '/organization/person-kannapaphat.jpg',
    division: 'head_office',
    divisionBadgeTh: 'สำนักงานใหญ่ (HQ)',
    divisionBadgeEn: 'Head Office (HQ)',
    level: 2,
    dutiesTh: [
      'ประสานงานราชการ คู่ค้า และเอกสารสัญญาโครงการ',
      'การจัดการด้านการเงิน บัญชี และงานธุรการกลาง',
      'ประสานงานส่งมอบงานและการบริหารบุคคล'
    ],
    dutiesEn: [
      'Government, partner & contract documentation',
      'Financial disbursement & centralized administration',
      'Project handover logistics & human resources support'
    ]
  },
  {
    id: 'draftman',
    roleTh: 'พนักงานเขียนแบบวิศวกรรม (CAD/BIM)',
    roleEn: 'Draftman & CAD Specialist',
    nameTh: 'คุณภาคภูมิ ภู่จ้อย',
    nameEn: 'Mr. Phakphoom Phoojoi',
    phone: '02-116 4125',
    division: 'head_office',
    divisionBadgeTh: 'สำนักงานใหญ่ / งานออกแบบ',
    divisionBadgeEn: 'Head Office / CAD Support',
    level: 2,
    dutiesTh: [
      'จัดทำแบบ Shop Drawing และ As-Built Drawing',
      'ประสานแบบรวมระบบ Combined Services Drawing (CSD)',
      'ตรวจสอบระยะติดตั้งและการชนกันของแนวท่อ (Clash Detection)'
    ],
    dutiesEn: [
      'Shop Drawing & As-Built Drawing development',
      'Combined Services Drawing (CSD) coordination',
      'Spatial integration & piping clash detection'
    ]
  },
  {
    id: 'rangsarit',
    roleTh: 'วิศวกรโครงการ',
    roleEn: 'Project Engineer',
    nameTh: 'คุณรังสฤทธิ์ สุหลง',
    nameEn: 'Mr. Rangsarit Sulong',
    phone: '064-630 4866',
    email: 'rangsarit.meskp@gmail.com',
    photo: '/organization/person-rangsarit.jpg',
    division: 'site_office',
    divisionBadgeTh: 'สำนักงานสนาม / หน้างาน',
    divisionBadgeEn: 'Site Office / Engineering',
    level: 3,
    highlight: true,
    dutiesTh: [
      'บริหารจัดการและควบคุมงานก่อสร้างติดตั้งวิศวกรรมหน้างาน',
      'ควบคุมแผนงาน Timeline และการประสานงานกับผู้ว่าจ้าง',
      'ตรวจสอบการทดสอบระบบ (Commissioning) ก่อนส่งมอบงาน'
    ],
    dutiesEn: [
      'On-site engineering construction & installation management',
      'Project schedule tracking & client engineering liaison',
      'Testing & Commissioning verification before handover'
    ]
  },
  {
    id: 'wilaiwan',
    roleTh: 'เจ้าหน้าที่ความปลอดภัยวิชาชีพ (จป.วิชาชีพ)',
    roleEn: 'Safety Officer (HSE Specialist)',
    nameTh: 'คุณวิไลวรรณ โกฆะรัตน์',
    nameEn: 'Mrs. Wilaiwan Kokarat',
    phone: '082-208 4541',
    email: 'vilaivan2518@gmail.com',
    photo: '/organization/person-wilaiwan.jpg',
    division: 'site_office',
    divisionBadgeTh: 'ความปลอดภัย & สิ่งแวดล้อม',
    divisionBadgeEn: 'HSE & Safety Compliance',
    level: 3,
    dutiesTh: [
      'ตรวจประเมินความเสี่ยงและกำกับดูแลความปลอดภัย 100%',
      'อบรมความปลอดภัยประจำวัน (Toolbox Meeting) และตรวจ PPE',
      'อนุมัติใบอนุญาตเข้าทำงานเสี่ยง (Hot Work / High Work Permit)'
    ],
    dutiesEn: [
      'HSE risk assessment & 100% safety compliance enforcement',
      'Daily safety briefing (Toolbox Talk) & PPE inspection',
      'High-risk work permits verification (Hot Work, Heights)'
    ]
  },
  {
    id: 'prasert',
    roleTh: 'หัวหน้าผู้ควบคุมงานสนาม (Foreman)',
    roleEn: 'Site Construction Foreman',
    nameTh: 'คุณประเสริฐ ลากะสงค์',
    nameEn: 'Mr. Prasert Lakasong',
    phone: '062-624 8171',
    email: 'prasertlakasong@gmail.com',
    photo: '/organization/person-prasert.jpg',
    division: 'site_office',
    divisionBadgeTh: 'หัวหน้างานสนาม',
    divisionBadgeEn: 'Site Supervision',
    level: 4,
    dutiesTh: [
      'สั่งการและกำกับดูแลผู้รับเหมาช่วงทุกระบบหน้างาน',
      'ตรวจสอบความเรียบร้อยและคุณภาพการติดตั้งทางเทคนิครายวัน',
      'รายงานความก้าวหน้า ปัญหา และประสานงานกับวิศวกรโครงการ'
    ],
    dutiesEn: [
      'Direct supervision of specialized sub-contractors on-site',
      'Daily technical installation inspection & quality verification',
      'Daily progress reporting & immediate issue coordination'
    ]
  }
];

export default function SchematicExplorer() {
  const { language } = useLanguage();
  const t = translations[language].schematic;

  // Division Filter Tab: 'all' | 'head_office' | 'site_office'
  const [activeTab, setActiveTab] = useState<'all' | 'head_office' | 'site_office'>('all');

  // Fullscreen Modal States
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [modalViewMode, setModalViewMode] = useState<'drawing' | 'interactive'>('drawing');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [previewPersonnel, setPreviewPersonnel] = useState<Personnel | null>(null);

  // Filtered personnel
  const filteredPersonnel = activeTab === 'all'
    ? personnelList
    : personnelList.filter(p => p.division === activeTab);

  // Group personnel by levels
  const director = personnelList.find(p => p.id === 'supot');
  const headOfficeTeam = personnelList.filter(p => p.id === 'kannapaphat' || p.id === 'draftman');
  const siteLeaders = personnelList.filter(p => p.id === 'rangsarit' || p.id === 'wilaiwan');
  const foreman = personnelList.find(p => p.id === 'prasert');

  // Copy to clipboard helper
  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  // Drag pan handlers for 300 DPI image
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreenOpen) {
        setIsFullscreenOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isFullscreenOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreenOpen]);

  // Render a Single Personnel Card
  const renderCard = (p: Personnel, isCompact: boolean = false) => {
    const isHeadOffice = p.division === 'head_office';
    const isMatchFilter = activeTab === 'all' || activeTab === p.division;

    return (
      <div
        key={p.id}
        className={`group relative rounded-2xl transition-all duration-300 ${
          isMatchFilter ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
        } ${
          p.highlight
            ? 'bg-gradient-to-b from-skp-navy-card/95 to-skp-navy-dark/95 border border-skp-cyan/50 shadow-lg shadow-skp-cyan/10 hover:border-skp-cyan hover:shadow-skp-cyan/20'
            : 'bg-skp-navy-card/85 hover:bg-skp-navy-card border border-skp-navy-border hover:border-slate-400/40 shadow-md'
        } p-4 sm:p-5 flex flex-col justify-between backdrop-blur-md`}
      >
        {/* Glow Accent Top Bar */}
        <div
          className={`absolute -top-px left-6 right-6 h-[2px] rounded-full transition-opacity ${
            p.highlight
              ? 'bg-gradient-to-r from-transparent via-skp-cyan to-transparent opacity-100'
              : isHeadOffice
              ? 'bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent opacity-0 group-hover:opacity-100'
              : 'bg-gradient-to-r from-transparent via-amber-400/60 to-transparent opacity-0 group-hover:opacity-100'
          }`}
        />

        {/* Card Header: Avatar & Badges */}
        <div>
          <div className="flex items-start gap-3.5 mb-3.5">
            {/* Avatar / Photo Container with prominent Hover Zoom Animation */}
            <div
              className="relative flex-shrink-0 group/avatar z-20 cursor-pointer"
              onClick={() => p.photo && setPreviewPersonnel(p)}
              title={language === 'en' ? `Click to enlarge photo of ${p.nameEn}` : `คลิกเพื่อดูรูปขยายของ ${p.nameTh}`}
            >
              {p.photo ? (
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-skp-cyan/50 group-hover/avatar:border-skp-cyan group-hover/avatar:scale-[2.0] sm:group-hover/avatar:scale-[2.3] group-hover/avatar:z-50 group-hover/avatar:shadow-2xl group-hover/avatar:shadow-cyan-500/50 group-hover/avatar:ring-4 group-hover/avatar:ring-skp-cyan/40 transition-all duration-300 ease-out origin-top-left bg-slate-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.photo}
                    alt={language === 'en' ? p.nameEn : p.nameTh}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/avatar:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover/avatar:opacity-0 transition-opacity" />
                </div>
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-indigo-900/60 to-skp-navy-card border-2 border-indigo-400/30 flex items-center justify-center text-indigo-300 group-hover/avatar:border-indigo-400 group-hover/avatar:scale-125 transition-all duration-300 shadow-inner">
                  <Compass className="w-7 h-7" />
                </div>
              )}
              {/* Online / Active Indicator */}
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 pointer-events-none group-hover/avatar:opacity-0 transition-opacity">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-skp-navy-dark" />
              </span>
            </div>

            {/* Role & Name */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold border ${
                    isHeadOffice
                      ? 'bg-indigo-950/70 border-indigo-500/40 text-indigo-300'
                      : 'bg-amber-950/70 border-amber-500/40 text-amber-300'
                  }`}
                >
                  {language === 'en' ? p.divisionBadgeEn : p.divisionBadgeTh}
                </span>
                {p.highlight && (
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-full font-bold bg-skp-cyan/15 border border-skp-cyan/40 text-skp-cyan flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    Key Leader
                  </span>
                )}
              </div>

              <h4 className="text-xs font-semibold text-skp-cyan tracking-wide">
                {language === 'en' ? p.roleEn : p.roleTh}
              </h4>
              <p className="text-sm sm:text-base font-bold text-white tracking-tight truncate group-hover:text-skp-cyan transition-colors">
                {language === 'en' ? p.nameEn : p.nameTh}
              </p>
              {language === 'th' && (
                <p className="text-[11px] text-slate-400 font-mono truncate">{p.nameEn}</p>
              )}
            </div>
          </div>

          {/* Duties Summary */}
          {!isCompact && (
            <ul className="mb-4 space-y-1.5 text-xs text-slate-300/90 pl-1">
              {(language === 'en' ? p.dutiesEn : p.dutiesTh).map((duty, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-skp-cyan text-xs mt-0.5 leading-none">•</span>
                  <span className="leading-snug">{duty}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Contact Strip */}
        <div className="pt-3 border-t border-skp-navy-border/70 flex flex-wrap items-center justify-between gap-2">
          {p.phone && (
            <div className="flex items-center gap-1.5">
              <a
                href={`tel:${p.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-200 hover:text-skp-cyan bg-skp-navy-deep/80 hover:bg-skp-navy-light px-2.5 py-1.5 rounded-lg border border-skp-navy-border transition-all"
                title={language === 'en' ? `Call ${p.phone}` : `โทร ${p.phone}`}
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{p.phone}</span>
              </a>
              <button
                type="button"
                onClick={(e) => handleCopy(p.phone!, e)}
                className="p-1.5 text-slate-400 hover:text-white bg-skp-navy-deep/60 hover:bg-skp-navy-light rounded-md border border-skp-navy-border transition-colors"
                title={language === 'en' ? 'Copy phone number' : 'คัดลอกเบอร์โทร'}
              >
                {copiedText === p.phone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}

          {p.email && (
            <div className="flex items-center gap-1.5">
              <a
                href={`mailto:${p.email}`}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-200 hover:text-skp-cyan bg-skp-navy-deep/80 hover:bg-skp-navy-light px-2.5 py-1.5 rounded-lg border border-skp-navy-border transition-all max-w-[170px] truncate"
                title={language === 'en' ? `Email ${p.email}` : `อีเมล ${p.email}`}
              >
                <Mail className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span className="truncate">{p.email}</span>
              </a>
              <button
                type="button"
                onClick={(e) => handleCopy(p.email!, e)}
                className="p-1.5 text-slate-400 hover:text-white bg-skp-navy-deep/60 hover:bg-skp-navy-light rounded-md border border-skp-navy-border transition-colors flex-shrink-0"
                title={language === 'en' ? 'Copy email address' : 'คัดลอกอีเมล'}
              >
                {copiedText === p.email ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section
      id="schematic"
      className="py-20 lg:py-28 bg-skp-navy-dark relative overflow-hidden border-t border-b border-skp-navy-border"
    >
      {/* Background blueprint tech pattern */}
      <div className="absolute inset-0 bg-blueprint-dense opacity-20 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-skp-cyan/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3.5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-skp-navy-card border border-skp-navy-border text-xs font-mono text-skp-cyan shadow-sm">
            <Users className="w-3.5 h-3.5 text-skp-cyan" />
            <span className="font-semibold">{t.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
            {t.title}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* UNIFIED ENCLOSING ORGANIZATION FRAME (กรอบครอบผังองค์กรทั้งหมดให้เป็นส่วนเดียวกัน) */}
        <div className="relative rounded-3xl bg-gradient-to-b from-skp-navy-card/85 via-skp-navy-deep/95 to-skp-navy-card/85 border-2 border-skp-navy-border/90 hover:border-skp-cyan/40 p-5 sm:p-8 lg:p-10 shadow-2xl shadow-black/50 backdrop-blur-xl transition-all duration-300">
          {/* Decorative high-tech corner brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-skp-cyan/70 rounded-tl-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-skp-cyan/70 rounded-tr-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-skp-cyan/70 rounded-bl-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-skp-cyan/70 rounded-br-3xl pointer-events-none" />

          {/* Blueprint subtle background inside frame */}
          <div className="absolute inset-0 bg-blueprint-dense opacity-10 rounded-3xl pointer-events-none" />

          {/* Organization Frame Inner Top Bar */}
          <div className="relative z-10 flex items-center gap-3 border-b border-skp-navy-border/80 pb-5 mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-skp-cyan/15 border border-skp-cyan/40 text-skp-cyan shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-skp-cyan font-bold block">
                  {language === 'en' ? 'SKP Engineering Hierarchy Matrix' : 'ผังโครงสร้างการบริหารและกำกับดูแลโครงการ'}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {language === 'en'
                    ? 'Designated Key Personnel & Functional Chain of Command'
                    : 'สายการบังคับบัญชาและคณะผู้รับผิดชอบงานประจำโครงการ'}
                </h3>
              </div>
            </div>


          </div>

          {/* ORGANIZATIONAL HIERARCHY TREE */}
          <div className="relative space-y-10 z-10">
          {/* LEVEL 1: MANAGING DIRECTOR */}
          {(activeTab === 'all' || activeTab === 'head_office') && director && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md">
                {renderCard(director)}
              </div>

              {/* Vertical Hierarchy Connector to Level 2 */}
              <div className="flex flex-col items-center my-2">
                <div className="w-0.5 h-8 bg-gradient-to-b from-skp-cyan/80 to-indigo-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-skp-cyan ring-4 ring-skp-cyan/20" />
              </div>
            </div>
          )}

          {/* LEVEL 2: HEAD OFFICE & CAD ENGINEERING SUPPORT */}
          {(activeTab === 'all' || activeTab === 'head_office') && headOfficeTeam.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5">
                {headOfficeTeam.map(person => renderCard(person))}
              </div>

              {/* Hierarchy Connector to Site Office */}
              {activeTab === 'all' && (
                <div className="flex flex-col items-center my-3">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-indigo-500/80 to-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-400/20" />
                </div>
              )}
            </div>
          )}

          {/* LEVEL 3: SITE PROJECT MANAGEMENT & SAFETY */}
          {(activeTab === 'all' || activeTab === 'site_office') && siteLeaders.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5">
                {siteLeaders.map(person => renderCard(person))}
              </div>

              {/* Hierarchy Connector to Foreman */}
              <div className="flex flex-col items-center my-2">
                <div className="w-0.5 h-8 bg-gradient-to-b from-amber-500/80 to-skp-cyan/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-400/20" />
              </div>
            </div>
          )}

          {/* LEVEL 4: FOREMAN */}
          {(activeTab === 'all' || activeTab === 'site_office') && foreman && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md">
                {renderCard(foreman)}
              </div>

              {/* Hierarchy Connector to Subcontractors */}
              <div className="flex flex-col items-center my-2">
                <div className="w-0.5 h-8 bg-gradient-to-b from-skp-cyan/80 to-skp-cyan/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-skp-cyan ring-4 ring-skp-cyan/20" />
              </div>
            </div>
          )}

          {/* LEVEL 5: DESIGNATED SUB-CONTRACTORS */}
          {(activeTab === 'all' || activeTab === 'site_office') && (
            <div className="max-w-5xl mx-auto pt-2">
              <div className="text-center mb-5">
                <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider px-3.5 py-1 rounded-full bg-skp-navy-card border border-skp-navy-border text-slate-300">
                  <Layers className="w-3.5 h-3.5 text-skp-cyan" />
                  {t.subcontractorTitle}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Electrical System Card */}
                <div className="rounded-2xl bg-skp-navy-card/90 border border-skp-navy-border p-6 relative overflow-hidden group hover:border-skp-cyan/60 transition-all shadow-md">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-bl-full pointer-events-none" />
                  <div className="flex items-start gap-3.5 mb-4">
                    <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-400 group-hover:scale-105 transition-transform">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                        {t.elecSystem}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {language === 'en' ? 'Power Distribution & Substation' : 'ตู้สวิตช์บอร์ด สถานีย่อย & ไฟฟ้ากำลัง'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {t.elecDesc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['MDB / EMDB', '22-24kV Substation', 'Cable Tray & Ladder', 'Power Quality'].map(
                      (tag, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-skp-navy-deep/80 border border-skp-navy-border text-slate-300"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Mechanical System Card */}
                <div className="rounded-2xl bg-skp-navy-card/90 border border-skp-navy-border p-6 relative overflow-hidden group hover:border-skp-cyan/60 transition-all shadow-md">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-skp-cyan/10 rounded-bl-full pointer-events-none" />
                  <div className="flex items-start gap-3.5 mb-4">
                    <div className="p-3 rounded-xl bg-sky-950/70 border border-sky-500/40 text-sky-400 group-hover:scale-105 transition-transform">
                      <Wind className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                        {t.mechSystem}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {language === 'en' ? 'HVAC, Fire Safety & Piping' : 'ระบบปรับอากาศ ดับเพลิง & ท่อสุขาภิบาล'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {t.mechDesc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Chiller & AHU', 'Air Ducting', 'Fire Sprinkler & Pump', 'Sanitary & Drainage'].map(
                      (tag, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-skp-navy-deep/80 border border-skp-navy-border text-slate-300"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isFullscreenOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
          {/* Modal Top Control Bar */}
          <div className="flex-shrink-0 px-4 sm:px-6 py-3.5 bg-skp-navy-deep/90 border-b border-skp-navy-border/80 flex items-center justify-between gap-4">
            {/* Title & Mode Switcher */}
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
              <div className="p-2 rounded-lg bg-skp-cyan/15 border border-skp-cyan/40 text-skp-cyan hidden sm:block">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {language === 'en'
                    ? 'SKP Association — Organization and Designated Key Personnel'
                    : 'บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด — แผนผังโครงสร้างองค์กรและบุคลากรหลัก'}
                </h3>
                <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
                  Document ID: SKP-ORG-2025-01 • Rev. 0 (15 Sep 2025)
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="hidden lg:inline-flex p-1 rounded-xl bg-skp-navy-card border border-skp-navy-border gap-1">
              <button
                type="button"
                onClick={() => setModalViewMode('drawing')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  modalViewMode === 'drawing'
                    ? 'bg-skp-navy-light text-skp-cyan border border-skp-cyan/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.viewDocDrawing}
              </button>
              <button
                type="button"
                onClick={() => setModalViewMode('interactive')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  modalViewMode === 'interactive'
                    ? 'bg-skp-navy-light text-skp-cyan border border-skp-cyan/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.viewModernChart}
              </button>
            </div>

            {/* Modal Actions: Zoom controls (in drawing mode) & Close */}
            <div className="flex items-center gap-2">
              {modalViewMode === 'drawing' && (
                <div className="flex items-center gap-1 bg-skp-navy-card border border-skp-navy-border rounded-xl p-1">
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-skp-navy-light rounded-lg disabled:opacity-30 transition-colors"
                    title={language === 'en' ? 'Zoom in (+)' : 'ซูมขยาย (+)'}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 0.5}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-skp-navy-light rounded-lg disabled:opacity-30 transition-colors"
                    title={language === 'en' ? 'Zoom out (-)' : 'ซูมย่อ (-)'}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-skp-navy-light rounded-lg transition-colors font-mono text-xs px-2"
                    title={language === 'en' ? 'Reset zoom' : 'รีเซ็ตการซูม (100%)'}
                  >
                    {Math.round(zoomLevel * 100)}%
                  </button>
                </div>
              )}

              <a
                href="/organization/skp-organization-chart.pdf"
                download="SKP-Organization-and-Key-Personnel.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-skp-navy-card hover:bg-skp-navy-light border border-skp-navy-border text-slate-200 hover:text-white text-xs font-semibold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </a>

              <button
                type="button"
                onClick={() => setIsFullscreenOpen(false)}
                className="p-2 rounded-xl bg-skp-navy-card hover:bg-rose-950/60 border border-skp-navy-border hover:border-rose-500/50 text-slate-300 hover:text-rose-400 transition-colors"
                title={language === 'en' ? 'Close (Esc)' : 'ปิด (Esc)'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Mobile View Toggle */}
          <div className="lg:hidden flex items-center justify-center p-2 bg-skp-navy-card/90 border-b border-skp-navy-border gap-2">
            <button
              type="button"
              onClick={() => setModalViewMode('drawing')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                modalViewMode === 'drawing'
                  ? 'bg-skp-cyan text-skp-navy-deep font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.viewDocDrawing}
            </button>
            <button
              type="button"
              onClick={() => setModalViewMode('interactive')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                modalViewMode === 'interactive'
                  ? 'bg-skp-cyan text-skp-navy-deep font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.viewModernChart}
            </button>
          </div>

          {/* Modal Content Area */}
          <div className="flex-1 overflow-auto relative p-4 sm:p-6 flex items-center justify-center">
            {modalViewMode === 'drawing' ? (
              /* High-Res 300 DPI Drawing Viewer with Pan & Zoom */
              <div
                className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none ${
                  zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : ''
                }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
                    transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                  }}
                  className="max-w-full max-h-full flex items-center justify-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/organization/skp-organization-chart-full.png"
                    alt="SKP Association Organization and Designated Key Personnel Drawing"
                    className="max-w-none w-auto max-h-[85vh] rounded-lg shadow-2xl border border-slate-700 pointer-events-none object-contain bg-white"
                  />
                </div>

                {/* Floating Bottom Hint */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 text-[11px] text-slate-300 font-mono pointer-events-none">
                  {language === 'en'
                    ? 'Use zoom controls to inspect details • Click & drag to pan'
                    : 'ใช้ปุ่มซูมขยายเพื่อดูรายละเอียดคมชัด 300 DPI • คลิกแล้วลากเพื่อเลื่อนมุมมอง'}
                </div>
              </div>
            ) : (
              /* Modern Interactive Tree View Inside Modal */
              <div className="w-full max-w-6xl mx-auto py-6 space-y-8">
                {/* Director */}
                {director && (
                  <div className="flex justify-center">
                    <div className="w-full max-w-md">
                      {renderCard(director, true)}
                    </div>
                  </div>
                )}

                {/* Level 2: Head Office Team */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {headOfficeTeam.map(person => renderCard(person, true))}
                </div>

                {/* Level 3: Site Office Team */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {siteLeaders.map(person => renderCard(person, true))}
                </div>

                {/* Level 4: Foreman */}
                {foreman && (
                  <div className="flex justify-center">
                    <div className="w-full max-w-md">
                      {renderCard(foreman, true)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
          {/* PHOTO PREVIEW LIGHTBOX MODAL */}
      {previewPersonnel && previewPersonnel.photo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewPersonnel(null)}
        >
          <div
            className="relative max-w-sm w-full bg-skp-navy-card border-2 border-skp-cyan/60 rounded-3xl p-6 shadow-2xl shadow-cyan-500/20 text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setPreviewPersonnel(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-skp-navy-deep/80 hover:bg-rose-950 text-slate-300 hover:text-rose-400 border border-skp-navy-border transition-colors"
              title={language === 'en' ? 'Close' : 'ปิด'}
            >
              <X className="w-5 h-5" />
            </button>

            {/* High-Res Photo */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-2xl overflow-hidden border-4 border-skp-cyan shadow-xl shadow-cyan-500/30 mb-5 bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewPersonnel.photo}
                alt={language === 'en' ? previewPersonnel.nameEn : previewPersonnel.nameTh}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Role & Name */}
            <span className="inline-block text-[11px] font-mono uppercase px-3 py-0.5 rounded-full font-semibold bg-skp-cyan/15 border border-skp-cyan/40 text-skp-cyan mb-2">
              {language === 'en' ? previewPersonnel.roleEn : previewPersonnel.roleTh}
            </span>

            <h3 className="text-xl font-bold text-white mb-1">
              {language === 'en' ? previewPersonnel.nameEn : previewPersonnel.nameTh}
            </h3>

            {language === 'th' && (
              <p className="text-xs text-slate-400 font-mono mb-4">
                {previewPersonnel.nameEn}
              </p>
            )}

            {/* Quick Contact Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              {previewPersonnel.phone && (
                <a
                  href={`tel:${previewPersonnel.phone.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold hover:bg-emerald-900 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{previewPersonnel.phone}</span>
                </a>
              )}

              {previewPersonnel.email && (
                <a
                  href={`mailto:${previewPersonnel.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-950/80 border border-sky-500/40 text-sky-300 text-xs font-mono hover:bg-sky-900 transition-colors"
                >
                  <Mail className="w-4 h-4 text-sky-400" />
                  <span>{language === 'en' ? 'Email' : 'ส่งอีเมล'}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
