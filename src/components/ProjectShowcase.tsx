'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Zap, 
  Factory, 
  CheckCircle, 
  MapPin, 
  Calendar, 
  ArrowUpRight, 
  ShieldCheck,
  Camera,
  ZoomIn,
  X,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations';

interface GalleryPhoto {
  url: string;
  subsystemTh: string;
  subsystemEn: string;
  descTh: string;
  descEn: string;
}

interface ProjectItem {
  id: number;
  title: string;
  titleEn: string;
  category: 'substation' | 'industrial' | 'commercial';
  categoryLabel: string;
  location: string;
  year: string;
  scope: string;
  status: string;
  image: string;
  isFlagship?: boolean;
  gallery?: GalleryPhoto[];
  tags: string[];
}

export default function ProjectShowcase() {
  const [filter, setFilter] = useState<'all' | 'industrial' | 'commercial' | 'substation'>('all');
  
  // State for card active photo index (for projects with multiple photos)
  const [cardPhotoIndex, setCardPhotoIndex] = useState<Record<number, number>>({ 1: 0 });

  // State for Lightbox Modal
  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);
  const [modalPhotoIndex, setModalPhotoIndex] = useState<number>(0);

  const { language } = useLanguage();
  const t = translations[language].portfolio;

  // Handle keyboard navigation in modal (ESC to close, Left/Right arrows to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modalProject) return;

      if (e.key === 'Escape') {
        setModalProject(null);
      } else if (e.key === 'ArrowLeft') {
        const total = modalProject.gallery?.length || 1;
        setModalPhotoIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
      } else if (e.key === 'ArrowRight') {
        const total = modalProject.gallery?.length || 1;
        setModalPhotoIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalProject]);

  const allMepPhotos: GalleryPhoto[] = [
    {
      url: '/projects/skp-transformer-platform.jpg',
      subsystemTh: 'สถานีหม้อแปลงไฟฟ้าแรงสูง 22kV (High-Voltage Substation & Transformer Platform)',
      subsystemEn: '22kV High-Voltage Pole Substation & Transformer Platform',
      descTh: 'งานออกแบบและติดตั้งสถานีไฟฟ้าย่อยเสาคู่ หม้อแปลงไฟฟ้าแรงสูง 22kV อุปกรณ์ดรอปเอาท์ฟิวส์คัทเอาท์ ล่อฟ้าแรงสูง และสะพานรางเคเบิลเทรย์ส่งกำลังเข้าสู่อาคารโรงงาน',
      descEn: 'Engineering design and installation of 22kV dual-pole substation, high-voltage transformer, drop-out fuse cutouts, surge arresters, and overhead cable bridge entering the facility.'
    },
    {
      url: '/projects/skp-diesel-generator.jpg',
      subsystemTh: 'เครื่องกำเนิดไฟฟ้าสำรองฉุกเฉิน (Cummins Standby Diesel Generator & ATS)',
      subsystemEn: 'Cummins Standby Diesel Generator Set & Emergency ATS Power System',
      descTh: 'ติดตั้งเครื่องกำเนิดไฟฟ้าสำรองดีเซล Cummins Power Generation บนฐานรากคอนกรีตเสริมเหล็ก ตู้ควบคุมอัตโนมัติ และระบบสลับแหล่งจ่ายไฟอัตโนมัติ (ATS)',
      descEn: 'Installation of Cummins standby diesel generator set on reinforced concrete plinth, automatic digital controller, and integration with Automatic Transfer Switch (ATS).'
    },
    {
      url: '/projects/skp-substation-yard.jpg',
      subsystemTh: 'ลานสถานีย่อยและระบบพลังงานไฟฟ้าภายนอกอาคาร (Substation & Generator Yard)',
      subsystemEn: 'Outdoor Electrical Substation Yard & Dual-Source Power Grid',
      descTh: 'ภาพรวมระบบไฟฟ้ากำลังภายนอกอาคารแบบบูรณาการ เชื่อมโยงระบบสายส่งแรงสูงจากการไฟฟ้าฯ สถานีหม้อแปลง และเครื่องกำเนิดไฟฟ้าสำรองจ่ายโหลดต่อเนื่อง 100%',
      descEn: 'Comprehensive outdoor power yard linking incoming utility grid, 22kV transformer station, and backup generator ensuring 100% uninterrupted operations.'
    },
    {
      url: '/projects/skp-mdb-switchboard-panel.jpg',
      subsystemTh: 'ตู้สวิตช์บอร์ดประธาน MDB และ Capacitor Bank (Main Distribution Board & Capacitor Bank)',
      subsystemEn: 'Main Distribution Board (MDB) & Automatic Capacitor Bank Enclosure',
      descTh: 'ติดตั้งตู้สวิตช์บอร์ดประธาน MDB แบบแยกเฟส ตู้คาปาซิเตอร์แบงก์ปรับปรุงค่าเพาเวอร์แฟกเตอร์ (PF) มิเตอร์ดิจิทัลวัดค่าพลังงาน และระบบป้องกันลัดวงจรมาตรฐานสากล',
      descEn: 'Installation of Main Distribution Board (MDB) switchboard, automatic capacitor bank for power factor correction, digital multifunction power meters, and protection relays.'
    },
    {
      url: '/projects/skp-electrical-room-mdb-rear.jpg',
      subsystemTh: 'ห้องไฟฟ้าหลักและแนวสะพานรางเคเบิลแลดเดอร์ (Electrical Room & Cable Ladder Bridge)',
      subsystemEn: 'Main Electrical Room: Rear Switchboard Enclosures & Overhead Cable Ladder Trays',
      descTh: 'งานเดินสะพานรางเคเบิลแลดเดอร์รับสายเมนกำลังไฟฟ้าแรงต่ำเข้าด้านบนตู้ MDB การติดตั้งระบบระบายอากาศห้องไฟฟ้า และระบบความปลอดภัยทางวิศวกรรมไฟฟ้า',
      descEn: 'Overhead heavy-duty cable ladder bridge routing main feeder cables into MDB switchboard top entries, ventilation louvers, and electrical room safety systems.'
    },
    {
      url: '/projects/skp-hvac-cdu-outdoor.jpg',
      subsystemTh: 'ระบบปรับอากาศภายนอกอาคาร (Outdoor Condensing Units - CDU / VRV Array)',
      subsystemEn: 'Outdoor HVAC Condensing Units (CDU / VRV Multi-Split Array)',
      descTh: 'ติดตั้งชุดคอยล์ร้อนปรับอากาศภายนอกอาคาร (Condensing Units) วางเรียงบนฐานคอนกรีต ท่อสารทำความเย็นหุ้มฉนวนป้องกันรังสี UV และท่อระบายลมร้อน',
      descEn: 'Installation of outdoor HVAC condensing unit array on raised concrete pads, UV-resistant insulated refrigerant piping, and weather-proof exterior penetrations.'
    },
    {
      url: '/projects/skp-factory-hall.jpg',
      subsystemTh: 'โถงโรงงานอุตสาหกรรม & แนวรางเคเบิลแลดเดอร์ (Main Factory Hall & Cable Ladders)',
      subsystemEn: 'Main Factory Hall, Power Busways & Heavy-Duty Cable Ladder Network',
      descTh: 'ติดตั้งโครงข่ายจ่ายกำลังไฟฟ้า รางเดินสายไฟเคเบิลเทรย์ (Cable Ladder) ตู้สื่อสารเซิร์ฟเวอร์ และเครื่องปรับอากาศตั้งพื้นสำหรับพื้นที่การผลิตขนาดใหญ่',
      descEn: 'Comprehensive power distribution network, cable ladders, server cabinet, and industrial floor AC units for high-volume manufacturing floor.'
    },
    {
      url: '/projects/skp-highbay-central-duct.jpg',
      subsystemTh: 'ระบบท่อดักท์ส่งลมปรับอากาศแนวแกนกลางโครงสร้างหลังคา (High-Bay Central Air Ducting)',
      subsystemEn: 'Central High-Bay Air Duct Distribution Along Roof Skylight Trusses',
      descTh: 'งานผลิตและแขวนติดตั้งท่อส่งลมสังกะสีหลักความยาวตลอดแนวโถงอาคาร รางเคเบิลเทรย์ และโคมไฟส่องสว่าง High-Bay LED ใต้โครงหลังคาเหล็ก',
      descEn: 'Fabrication and structural suspension of heavy-gauge central galvanized air ductwork along the warehouse axis, cable trays, and high-bay lighting.'
    },
    {
      url: '/projects/skp-blower-control-panel.jpg',
      subsystemTh: 'พัดลมโบลเวอร์ดูดระบายอากาศและตู้สวิตช์บอร์ดควบคุม (Exhaust Blower & Control Panel)',
      subsystemEn: 'Centrifugal Exhaust Blower System & Dedicated Electrical Control Enclosure',
      descTh: 'ติดตั้งพัดลมดูดระบายอากาศ Centrifugal Blower โครงข่ายท่อดักท์กระจายลม แอร์ตั้งพื้น Daikin และตู้สวิตช์บอร์ดควบคุมระบบปรับอากาศเฉพาะจุด',
      descEn: 'Installation of centrifugal exhaust blower unit, connected air duct network, floor AC unit, and dedicated electrical automation control cabinet.'
    },
    {
      url: '/projects/skp-ventilation-duct.jpg',
      subsystemTh: 'ระบบท่อดักท์ระบายอากาศและโบลเวอร์ใต้โครงสร้างหลังคา (Roof Ventilation Infrastructure)',
      subsystemEn: 'High-Bay Galvanized Ventilation Ducting & Industrial Exhaust Blower',
      descTh: 'งานติดตั้งท่อส่งลมปรับอากาศ ท่อดูดอากาศเสีย พัดลม Centrifugal Blower อุตสาหกรรมใต้โครงสร้างหลังคา พร้อมจุดแขวนรับน้ำหนักมาตรฐานวิศวกรรม',
      descEn: 'Fabrication and structural suspension of galvanized air ductwork, industrial exhaust blower units, and engineered rod hangers.'
    },
    {
      url: '/projects/skp-kobelco-compressor-room.jpg',
      subsystemTh: 'ห้องระบบลมอัดอุตสาหกรรม KOBELCO (KOBELCO Screw Compressor Plant Room)',
      subsystemEn: 'KOBELCO Industrial Screw Air Compressor Plant Room & Piping Network',
      descTh: 'ติดตั้งเครื่องอัดลมอุตสาหกรรม KOBELCO Screw Air Compressors ท่อส่งจ่ายลมอัดความดันสูง สายถักสแตนเลสกันสะเทือน ฟิลเตอร์กรองอากาศ CA และระบบระบายอากาศห้องเครื่อง',
      descEn: 'Installation of KOBELCO industrial screw air compressors, flexible stainless steel connectors, high-pressure header piping, in-line CA filters, and room ventilation.'
    },
    {
      url: '/projects/skp-piping-cable-riser.jpg',
      subsystemTh: 'ระบบท่อสารทำความเย็นหุ้มฉนวนและรางเคเบิลเทรย์แนวดิ่ง (Piping & Cable Tray Risers)',
      subsystemEn: 'Insulated Refrigerant Piping Risers, Rigid Conduits & Cable Ladder Routing',
      descTh: 'งานเดินท่อสารทำความเย็นหุ้มฉนวนยางสังเคราะห์สีดำ รางเดินสายไฟเคเบิลเทรย์ ท่อร้อยสายไฟฟ้า EMT เข้าสู่อาคารอย่างเป็นระเบียบตามมาตรฐานวิศวกรรม',
      descEn: 'Installation of black elastomeric insulated refrigerant pipe risers, heavy-duty cable ladders, and rigid EMT conduit penetrations conforming to strict engineering codes.'
    },
    {
      url: '/projects/skp-cleanroom-fcu.jpg',
      subsystemTh: 'ระบบปรับอากาศห้องสะอาด Daikin FCU (Cleanroom Package FCU & Jet Nozzle)',
      subsystemEn: 'Cleanroom Air Handling: Daikin Floor-Standing FCU with High-Velocity Jet Nozzles',
      descTh: 'ติดตั้งเครื่องปรับอากาศตั้งพื้นอุตสาหกรรม Daikin Package FCU พร้อมหัวจ่ายลม Jet Nozzle 3 ทิศทาง ท่อน้ำทิ้ง PVC และระบบควบคุมความเย็นแม่นยำ',
      descEn: 'Precision Daikin industrial floor-mounted FCU with 3-way directional jet nozzles, PVC condensate drainage, and microclimate temperature regulation.'
    },
    {
      url: '/projects/skp-process-piping.jpg',
      subsystemTh: 'โครงข่ายท่อหล่อเย็นกระบวนการผลิต (Process Cooling Piping & Steel Pipe Rack)',
      subsystemEn: 'Process Cooling Piping: Structural Steel Pipe Rack & Valve Distribution Header',
      descTh: 'ติดตั้งระบบท่อส่งน้ำหล่อเย็นเครื่องจักร โครงสร้างเหล็กไปป์แร็ค (Pipe Rack) วาล์วตัดตอนระบบ เกจวัดแรงดัน และรางเคเบิลแลดเดอร์ควบคุมวาล์วไฟฟ้า',
      descEn: 'Installation of closed-loop process cooling piping, structural steel support racks, isolation valves, pressure instrumentation, and cable raceways.'
    },
    {
      url: '/projects/skp-wall-exhaust-fan.jpg',
      subsystemTh: 'พัดลมระบายอากาศติดผนังโรงงาน (Industrial Wall Exhaust Fan & Safety Shutter)',
      subsystemEn: 'Heavy-Duty Industrial Wall-Mounted Exhaust Fan with Motor Drive & Guard',
      descTh: 'ติดตั้งพัดลมดูดระบายอากาศโรงงานขนาดใหญ่แบบติดผนัง ตะแกรงการ์ดนิรภัย ท่อร้อยสายไฟฟ้ากันน้ำ และบานเกล็ดระบายอากาศควบคุมการหมุนเวียนอากาศ',
      descEn: 'Installation of large-diameter industrial wall exhaust fan with direct motor drive, safety wire guard, liquid-tight electrical conduit, and ventilation louvers.'
    },
    {
      url: '/projects/skp-wwtp-control-panel.jpg',
      subsystemTh: 'ระบบบำบัดน้ำเสีย & ตู้ควบคุมปั๊มน้ำเสียอัตโนมัติ (WWTP Aeration & SP-01 Pump Control)',
      subsystemEn: 'Wastewater Treatment Plant (WWTP): Aeration Blowers & Automated SP-01 Pump Control',
      descTh: 'ติดตั้งชุดปั๊มเป่าอากาศเติมออกซิเจน (Aeration Blowers) ตู้ควบคุมไฟฟ้ากันน้ำกลางแจ้ง SP-01 พร้อมไฟสัญญาณเตือนไซเรนฉุกเฉิน และท่อส่งน้ำเสีย',
      descEn: 'Installation of diaphragm aeration blowers, weatherproof outdoor SP-01 pump control panel with audio-visual alarm beacon, and sewage discharge piping.'
    },
    {
      url: '/projects/skp-wwtp-underground-system.jpg',
      subsystemTh: 'งานโครงสร้างบ่อบำบัดน้ำเสียใต้ดิน (Underground WWTP Concrete Slab & Cast Iron Manholes)',
      subsystemEn: 'Underground Wastewater Treatment Plant Concrete Slab & Heavy-Duty Manholes',
      descTh: 'งานเทลานคอนกรีตเสริมเหล็กคลุมถังบำบัดน้ำเสียใต้ดิน ติดตั้งฝาปิดแมนโฮลเหล็กหล่อรับน้ำหนักรถยนต์ ท่อระบายอากาศ และการเชื่อมต่อสู่บ่อดักไขมัน',
      descEn: 'Reinforced concrete slab over underground wastewater treatment tanks, vehicle-load cast iron inspection manholes, vent piping, and grease trap connections.'
    }
  ];

  const deliveredSystems = [
    {
      th: 'สถานีหม้อแปลงไฟฟ้า 22kV เสาคู่',
      en: '22kV Dual-Pole Substation & Transformer',
    },
    {
      th: 'เครื่องกำเนิดไฟฟ้า Cummins & ATS',
      en: 'Cummins Diesel Generator & ATS',
    },
    {
      th: 'ลานหม้อแปลงจ่ายไฟภายนอกอาคาร',
      en: 'Outdoor Electrical Substation Yard',
    },
    {
      th: 'ตู้สวิตช์บอร์ดประธาน MDB & Cap Bank',
      en: 'Main Distribution Board (MDB) & Cap Bank',
    },
    {
      th: 'สะพานเคเบิลแลดเดอร์ในห้องไฟฟ้า',
      en: 'Electrical Room Cable Ladder Bridge',
    },
    {
      th: 'คอยล์ร้อนปรับอากาศ CDU/VRV',
      en: 'Outdoor HVAC Condensing Units (CDU/VRV)',
    },
    {
      th: 'ระบบจ่ายไฟกำลัง ราง Cable Ladder',
      en: 'Power Distribution & Cable Ladder Network',
    },
    {
      th: 'ท่อดักท์ส่งลมแกนกลางโถงอาคาร',
      en: 'Central High-Bay Air Ducting Network',
    },
    {
      th: 'โบลเวอร์ดูดอากาศ & ตู้ควบคุม',
      en: 'Centrifugal Blower & Control Panel',
    },
    {
      th: 'ท่อดักท์ระบายอากาศใต้โครงหลังคา',
      en: 'Galvanized Roof Ventilation Ductwork',
    },
    {
      th: 'ห้องเครื่องลมอัด KOBELCO Screw',
      en: 'KOBELCO Screw Air Compressor Plant',
    },
    {
      th: 'ท่อสารทำความเย็น & รางแนวดิ่ง',
      en: 'Insulated Refrigerant Piping & Risers',
    },
    {
      th: 'แอร์ห้องสะอาด Daikin & Jet Nozzle',
      en: 'Cleanroom Daikin FCU & Jet Nozzles',
    },
    {
      th: 'โครงข่ายท่อหล่อเย็น & ไปป์แร็ค',
      en: 'Process Cooling Piping & Pipe Racks',
    },
    {
      th: 'พัดลมระบายอากาศติดผนังโรงงาน',
      en: 'Wall-Mounted Industrial Exhaust Fan',
    },
    {
      th: 'ระบบบำบัดน้ำเสีย & ตู้ควบคุม SP-01',
      en: 'WWTP System & SP-01 Control Panel',
    },
    {
      th: 'งานโครงสร้างบ่อบำบัดน้ำเสียใต้ดิน & ฝาแมนโฮล',
      en: 'Underground WWTP Concrete Tank & Manholes',
    },
  ];

  const projects: ProjectItem[] = [
    {
      id: 1,
      isFlagship: true,
      title: 'งานระบบประกอบอาคาร อาคารโรงงานและคลังสินค้าอุตสาหกรรม',
      titleEn: 'Building M&E Systems for Industrial Plant & Logistics Warehouse',
      category: 'commercial',
      categoryLabel: language === 'en' ? 'Flagship M&E Turnkey' : 'งานระบบประกอบอาคารครบวงจร (M&E Turnkey)',
      location: language === 'en' ? 'Amata City Rayong Industrial Estate, Rayong' : 'นิคมอุตสาหกรรมอมตะ ระยอง',
      year: language === 'en' ? '2023 - 2024' : 'พ.ศ. 2566 - 2567',
      scope: language === 'en'
        ? 'Full turnkey M&E execution uniting 17 critical engineering systems: (1) 22kV dual-pole substation & high-voltage transformer, (2) Cummins standby diesel generator & ATS, (3) Outdoor dual-source power substation yard, (4) Main Distribution Board (MDB) & Capacitor Bank, (5) Main electrical room overhead cable ladder bridge, (6) Outdoor HVAC condensing unit (CDU/VRV) array, (7) Main factory hall power & cable ladders, (8) Central high-bay roof air ducting, (9) Centrifugal exhaust blower & electrical control panel, (10) Galvanized roof ventilation infrastructure, (11) KOBELCO industrial screw air compressor plant room, (12) Insulated refrigerant piping & cable risers, (13) Cleanroom Daikin FCU with jet nozzles, (14) Process cooling piping & steel pipe rack, (15) Wall-mounted industrial ventilation fan, (16) Wastewater treatment plant (WWTP) & SP-01 pump control panel, and (17) Underground wastewater treatment system concrete slab.'
        : 'รับเหมาติดตั้งงานระบบวิศวกรรมประกอบอาคารครบวงจร (Turnkey M&E) บูรณาการ 17 ระบบวิศวกรรมสำคัญ: (1) สถานีหม้อแปลงไฟฟ้าแรงสูง 22kV เสาคู่, (2) เครื่องกำเนิดไฟฟ้าสำรอง Cummins Generator & ATS, (3) ลานสถานีย่อยจ่ายไฟต่อเนื่องภายนอกอาคาร, (4) ตู้สวิตช์บอร์ดประธาน MDB และ Capacitor Bank, (5) สะพานรางเคเบิลแลดเดอร์ในห้องไฟฟ้าหลัก, (6) ชุดคอยล์ร้อนปรับอากาศภายนอกอาคาร (CDU / VRV), (7) ระบบจ่ายไฟกำลังและรางเคเบิลแลดเดอร์ในโถงโรงงาน, (8) ระบบท่อดักท์ส่งลมปรับอากาศแกนกลางโถงอาคาร, (9) พัดลมโบลเวอร์ดูดอากาศและตู้ควบคุม, (10) ระบบท่อดักท์ระบายอากาศใต้โครงหลังคา, (11) ห้องระบบลมอัดอุตสาหกรรม KOBELCO Screw Compressor, (12) ระบบท่อสารทำความเย็นหุ้มฉนวนและรางเคเบิลเทรย์แนวดิ่ง, (13) เครื่องปรับอากาศห้องสะอาด Daikin FCU & หัวจ่าย Jet Nozzle, (14) โครงข่ายท่อหล่อเย็นเครื่องจักรพร้อมโครงเหล็กไปป์แร็ค, (15) พัดลมระบายอากาศติดผนังโรงงาน, (16) ระบบบำบัดน้ำเสีย (WWTP) และตู้ควบคุมปั๊ม SP-01, และ (17) งานโครงสร้างบ่อบำบัดน้ำเสียใต้ดินพร้อมฝาแมนโฮลเหล็กหล่อ',
      status: t.statusComplete,
      image: '/projects/skp-mdb-switchboard-panel.jpg',
      gallery: allMepPhotos,
      tags: ['Turnkey M&E', 'MDB Switchboard', '22kV Substation', 'Cummins Generator', 'KOBELCO Compressors', 'Outdoor VRV', 'Cable Ladder', 'Cleanroom FCU', 'High-Bay Ducts', 'WWTP Sanitary'],
    },
    {
      id: 2,
      title: 'โครงการติดตั้งสถานีไฟฟ้าย่อยและตู้ MDB โรงงานอุตสาหกรรมปิโตรเคมี',
      titleEn: 'Petrochemical Plant 22kV Substation & MDB Installation',
      category: 'substation',
      categoryLabel: language === 'en' ? 'Substation & MDB' : 'สถานีไฟฟ้าย่อย & MDB',
      location: language === 'en' ? 'Map Ta Phut Industrial Estate, Rayong' : 'นิคมอุตสาหกรรมมาบตาพุด จ.ระยอง',
      year: language === 'en' ? '2023' : 'พ.ศ. 2566',
      scope: language === 'en'
        ? 'Engineering design and installation of 22kV high-voltage power system, dual 2,000 kVA transformers, Main Distribution Board with ATS and Capacitor Bank.'
        : 'งานออกแบบและติดตั้งระบบไฟฟ้าแรงสูง 22kV, หม้อแปลงไฟฟ้า 2,000 kVA จำนวน 2 ชุด, ตู้ Main Distribution Board พร้อมระบบ ATS และ Capacitor Bank',
      status: t.statusComplete,
      image: '/project-infrastructure.png',
      tags: ['Substation 22kV', 'Transformer', 'MDB 3200A', 'Capacitor Bank'],
    },
    {
      id: 3,
      title: 'งานปรับปรุงและเพิ่มขนาดกำลังไฟฟ้าตู้สวิตช์บอร์ด MDB และระบบหม้อแปลง',
      titleEn: 'Factory Substation Power Upgrade & Transformer Retrofit',
      category: 'substation',
      categoryLabel: language === 'en' ? 'Substation & MDB' : 'สถานีไฟฟ้าย่อย & MDB',
      location: language === 'en' ? 'Rojana Industrial Park, Phra Nakhon Si Ayutthaya' : 'นิคมอุตสาหกรรมโรจนะ จ.พระนครศรีอยุธยา',
      year: language === 'en' ? '2024' : 'พ.ศ. 2567',
      scope: language === 'en'
        ? 'Transformer capacity expansion from 1000 kVA to 2500 kVA, Main ACB replacement, feeder cabling, and uninterrupted commissioning testing.'
        : 'ขยายพิกัดหม้อแปลงไฟฟ้าจาก 1000 kVA เป็น 2500 kVA งานเปลี่ยน Main ACB และเดินสายป้อนกำลังพร้อมการทดสอบความปลอดภัยและการทำงานต่อเนื่อง',
      status: t.statusComplete,
      image: '/hero-systems.png',
      tags: ['Transformer Retrofit', 'Single-Line Upgrade', 'Main ACB', 'Power Grid'],
    },
    {
      id: 4,
      title: 'งานวิศวกรรมก่อสร้างและติดตั้งระบบห้องสะอาด (Cleanroom M&E Turnkey)',
      titleEn: 'Electronic Components Cleanroom Construction & Engineering',
      category: 'industrial',
      categoryLabel: language === 'en' ? 'Cleanroom Facility' : 'โรงงานอุตสาหกรรม',
      location: language === 'en' ? 'Amata City Industrial Estate, Chonburi' : 'นิคมอุตสาหกรรมอมตะซิตี้ จ.ชลบุรี',
      year: language === 'en' ? '2023' : 'พ.ศ. 2566',
      scope: language === 'en'
        ? 'Turnkey construction and precision HVAC installation for Class 10,000 Cleanroom, AHU ducting networks, and high-stability power supplies.'
        : 'รับเหมาก่อสร้างและติดตั้งระบบปรับอากาศควบคุมความชื้นและฝุ่น (Cleanroom Class 10,000) ระบบท่อลม AHU และระบบจ่ายไฟกำลังความเสถียรสูง',
      status: t.statusComplete,
      image: '/project-drafting.png',
      tags: ['Cleanroom HVAC', 'AHU Ducting', 'Precision Power', 'Class 10000'],
    },
    {
      id: 5,
      title: 'งานก่อสร้างโรงงานแปรรูปอาหารและติดตั้งระบบวิศวกรรมสาธารณูปโภค',
      titleEn: 'Food Processing Plant Construction & Utility Systems',
      category: 'industrial',
      categoryLabel: language === 'en' ? 'Industrial Plant' : 'โรงงานอุตสาหกรรม',
      location: language === 'en' ? 'Lat Krabang Industrial Estate, Bangkok' : 'นิคมอุตสาหกรรมลาดกระบัง กรุงเทพฯ',
      year: language === 'en' ? '2022' : 'พ.ศ. 2565',
      scope: language === 'en'
        ? 'Civil works, cold storage refrigeration systems, sanitary piping, stainless drainage, and electrical infrastructure complying with GMP/HACCP.'
        : 'งานโครงสร้างอาคารและระบบสาธารณูปโภค ระบบทำความเย็น Cold Storage ระบบสุขาภิบาลและระบายน้ำสแตนเลส พร้อมระบบไฟฟ้าตามเกณฑ์ GMP/HACCP',
      status: t.statusComplete,
      image: '/hero-systems.png',
      tags: ['Cold Storage', 'HACCP M&E', 'Utility Piping', 'GMP Compliance'],
    },
    {
      id: 6,
      title: 'ระบบดับเพลิงและระบบเตือนภัยอัตโนมัติ ศูนย์กระจายสินค้าขนาดใหญ่',
      titleEn: 'Mega Logistics Center Fire Protection & Life Safety System',
      category: 'commercial',
      categoryLabel: language === 'en' ? 'Commercial & Logistics' : 'อาคารพาณิชย์ & คลังสินค้า',
      location: language === 'en' ? 'Wang Noi, Phra Nakhon Si Ayutthaya' : 'อ.วังน้อย จ.พระนครศรีอยุธยา',
      year: language === 'en' ? '2024' : 'พ.ศ. 2567',
      scope: language === 'en'
        ? 'NFPA 20 Diesel & Electric Fire Pump installation, ESFR ceiling sprinkler network, and intelligent addressable smoke detection throughout 40,000 sq.m.'
        : 'ติดตั้งเครื่องสูบน้ำดับเพลิง Fire Pump เครื่องยนต์ดีเซลและมอเตอร์ไฟฟ้า ระบบหัวกระจายน้ำดับเพลิง ESFR และระบบตรวจจับควันไฟครอบคลุม 40,000 ตร.ม.',
      status: t.statusComplete,
      image: '/project-infrastructure.png',
      tags: ['NFPA Fire Pump', 'ESFR Sprinkler', 'Life Safety', 'Smoke Detection'],
    },
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => {
        // Flagship project belongs to all disciplines
        if (p.isFlagship) {
          return true;
        }
        return p.category === filter;
      });

  const openModalAtPhoto = (project: ProjectItem, photoIdx: number = 0) => {
    setModalProject(project);
    setModalPhotoIndex(photoIdx);
  };

  return (
    <section id="portfolio" className="py-20 lg:py-28 bg-skp-navy-deep relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-skp-navy-card border border-skp-navy-border text-xs font-mono text-skp-cyan mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-skp-cyan" />
              <span>{t.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.title}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
              {t.subtitle}
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
              {t.filterAll} ({projects.length})
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
              {t.filterSubstation}
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
              {t.filterIndustrial}
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
              {t.filterCommercial}
            </button>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProjects.map((project) => {
            const hasGallery = Boolean(project.gallery && project.gallery.length > 1);
            const currentPhotoIdx = cardPhotoIndex[project.id] || 0;
            const currentImgUrl = hasGallery && project.gallery
              ? project.gallery[currentPhotoIdx].url 
              : project.image;
            const currentSubsystemTitle = hasGallery && project.gallery
              ? (language === 'en' ? project.gallery[currentPhotoIdx].subsystemEn : project.gallery[currentPhotoIdx].subsystemTh)
              : null;

            return (
              <div 
                key={project.id}
                className={`bg-skp-navy-card rounded-2xl border overflow-hidden shadow-xl transition-all duration-300 group flex flex-col ${
                  project.isFlagship
                    ? 'border-skp-cyan/60 shadow-skp-cyan/10 ring-1 ring-skp-cyan/30 md:col-span-2 lg:col-span-3'
                    : 'border-skp-navy-border hover:border-skp-cyan/50 hover:shadow-2xl hover:shadow-black/60'
                }`}
              >
                {/* Flagship Banner Header */}
                {project.isFlagship && (
                  <div className="bg-gradient-to-r from-skp-cyan/20 via-skp-navy-deep to-skp-red/20 px-6 py-2.5 border-b border-skp-cyan/30 flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center text-skp-cyan font-bold tracking-wide">
                      <Sparkles className="w-4 h-4 mr-1.5 text-skp-cyan animate-pulse" />
                      {language === 'en'
                        ? 'FLAGSHIP TURNKEY SHOWCASE // 17 Real Engineering Systems Installed (Electrical, HVAC & WWTP)'
                        : 'FLAGSHIP TURNKEY SHOWCASE // รวม 17 ภาพถ่ายระบบจริงในโครงการนี้ (Electrical, HVAC & WWTP)'}
                    </span>
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-semibold text-[11px]">
                      17 ON-SITE PHOTOS INTEGRATED
                    </span>
                  </div>
                )}

                <div className={`${project.isFlagship ? 'grid grid-cols-1 lg:grid-cols-12 gap-0' : 'flex flex-col flex-1'}`}>
                  
                  {/* Image / Gallery Preview Area */}
                  <div className={`relative overflow-hidden bg-skp-navy-dark ${
                    project.isFlagship 
                      ? 'lg:col-span-7 flex flex-col justify-between' 
                      : 'aspect-[16/10]'
                  }`}>
                    <div 
                      className={`relative w-full cursor-pointer group/img overflow-hidden ${
                        project.isFlagship ? 'aspect-[16/10] sm:aspect-[16/10] lg:h-full lg:min-h-[460px]' : 'h-full'
                      }`}
                      onClick={() => openModalAtPhoto(project, currentPhotoIdx)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={currentImgUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-skp-navy-card via-skp-navy-card/20 to-transparent" />
                      
                      {/* Real Photo Badge */}
                      <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-skp-navy-deep/90 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm shadow-md">
                        <Camera className="w-3 h-3 text-emerald-400" />
                        <span>
                          {hasGallery
                            ? `${t.allPhotosBadge || 'รวม 17 ภาพถ่ายหน้างานจริง'} (${currentPhotoIdx + 1}/${project.gallery?.length})`
                            : (t.actualSiteBadge || 'ภาพถ่ายจากหน้างานจริง')}
                        </span>
                      </div>

                      {/* Zoom hint badge */}
                      <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-skp-navy-deep/90 text-skp-cyan border border-skp-cyan/30 backdrop-blur-sm opacity-90 group-hover/img:opacity-100 transition-opacity">
                        <ZoomIn className="w-3.5 h-3.5 mr-1" />
                        <span>{t.viewPhotoBtn || 'คลิกดูภาพขยาย'}</span>
                      </div>

                      {/* Subsystem caption overlay on image */}
                      {currentSubsystemTitle && (
                        <div className="absolute bottom-3 left-3 right-3 bg-skp-navy-deep/95 border border-skp-navy-border/80 backdrop-blur-md rounded-lg p-2.5 text-xs text-white shadow-lg">
                          <div className="flex items-center justify-between font-mono text-[10px] text-skp-cyan mb-1">
                            <span>
                              {language === 'en'
                                ? `${t.photoCountLabel || 'Photo'} ${currentPhotoIdx + 1} of ${project.gallery?.length}`
                                : `${t.photoCountLabel || 'ภาพที่'} ${currentPhotoIdx + 1} จาก ${project.gallery?.length}`}
                            </span>
                            <span className="text-slate-400">
                              {language === 'en' ? 'Click for fullscreen gallery' : 'คลิกเพื่อดูแกลเลอรีเต็มจอ'}
                            </span>
                          </div>
                          <div className="font-semibold truncate text-slate-100">{currentSubsystemTitle}</div>
                        </div>
                      )}
                    </div>

                    {/* Interactive Thumbnail Selector for Project 1 (Flagship Gallery) */}
                    {hasGallery && project.gallery && (
                      <div className="p-3 bg-skp-navy-dark/95 border-t border-skp-navy-border/80 flex items-center space-x-2 overflow-x-auto scrollbar-thin">
                        {project.gallery.map((photo, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCardPhotoIndex(prev => ({ ...prev, [project.id]: pIdx }));
                            }}
                            className={`relative shrink-0 w-14 sm:w-16 h-11 rounded-md overflow-hidden border-2 transition-all ${
                              currentPhotoIdx === pIdx 
                                ? 'border-skp-cyan scale-105 shadow-md shadow-skp-cyan/30 ring-1 ring-skp-cyan' 
                                : 'border-skp-navy-border opacity-60 hover:opacity-100'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={photo.url} 
                              alt={`Thumbnail ${pIdx + 1}`} 
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-0 right-0 px-1 py-0.2 bg-black/80 text-[9px] font-mono text-white">
                              {pIdx + 1}
                            </span>
                          </button>
                        ))}
                        <div className="pl-2 text-[11px] font-mono text-slate-400 shrink-0 hidden sm:block">
                          {language === 'en' ? '◄ Scroll to explore 17 systems' : '◄ เลื่อนดูครบ 17 ระบบ'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Body Area */}
                  <div className={`p-6 flex-1 flex flex-col justify-between space-y-4 ${
                    project.isFlagship ? 'lg:col-span-5 bg-skp-navy-card' : ''
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-skp-cyan/10 text-skp-cyan border border-skp-cyan/20">
                          {project.categoryLabel}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{project.year}</span>
                      </div>

                      <h3 className={`${project.isFlagship ? 'text-lg sm:text-xl' : 'text-base'} font-bold text-white group-hover:text-skp-cyan transition-colors leading-snug`}>
                        {language === 'en' ? project.titleEn : project.title}
                      </h3>
                      
                      <div className="flex items-center text-xs font-mono text-slate-300 mt-2">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-skp-red shrink-0" />
                        <span>{project.location}</span>
                      </div>

                      <p className={`text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed ${
                        project.isFlagship ? '' : 'line-clamp-4'
                      }`}>
                        {project.scope}
                      </p>

                      {/* Flagship Included Subsystem List */}
                      {project.isFlagship && (
                        <div className="mt-4 p-3.5 rounded-xl bg-skp-navy-deep border border-skp-navy-border/80 space-y-2">
                          <div className="text-xs font-mono font-bold text-skp-cyan uppercase flex items-center">
                            <Layers className="w-3.5 h-3.5 mr-1.5" />
                            <span>
                              {language === 'en'
                                ? '17 Delivered Engineering Systems in this Project:'
                                : '17 ระบบวิศวกรรมที่ส่งมอบในโครงการนี้ (Delivered Systems):'}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 text-xs text-slate-300 font-mono">
                            {deliveredSystems.map((item, idx) => (
                              <div
                                key={idx}
                                className={`flex items-start ${idx === deliveredSystems.length - 1 ? 'sm:col-span-2' : ''}`}
                              >
                                <span className="text-emerald-400 mr-1.5 shrink-0">✓</span>
                                <span>{language === 'en' ? item.en : item.th}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-skp-navy-border/60">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-skp-navy-deep text-slate-400 border border-skp-navy-border">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono pt-1">
                        <span className="flex items-center text-emerald-400 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          {project.status}
                        </span>
                        
                        <div className="flex items-center space-x-3">
                          {hasGallery && (
                            <button 
                              type="button"
                              onClick={() => openModalAtPhoto(project, currentPhotoIdx)}
                              className="text-skp-cyan hover:text-white flex items-center transition-colors font-medium"
                            >
                              <span>{t.viewPhotoBtn || 'ดูแกลเลอรีภาพ'}</span>
                              <ZoomIn className="w-3.5 h-3.5 ml-1" />
                            </button>
                          )}
                          <a href="#contact" className="text-slate-300 hover:text-white flex items-center transition-colors">
                            <span>{language === 'en' ? 'Inquire' : 'ปรึกษาโครงการ'}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                          </a>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox / High-Res Photo Gallery Modal */}
      {modalProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setModalProject(null)}
        >
          <div 
            className="relative max-w-5xl w-full bg-skp-navy-card border border-skp-navy-border rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-skp-navy-border bg-skp-navy-deep/90">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                <Camera className="w-4 h-4" />
                <span className="font-semibold">
                  {modalProject.gallery 
                    ? `SKP ON-SITE GALLERY // ${modalPhotoIndex + 1} OF ${modalProject.gallery.length} PHOTOS`
                    : 'SKP ON-SITE REFERENCE'}
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setModalProject(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-skp-navy-border/60 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Area with Navigation Arrows */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[58vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={modalProject.gallery ? modalProject.gallery[modalPhotoIndex].url : modalProject.image} 
                alt={modalProject.title} 
                className="w-full h-full object-contain max-h-[58vh] select-none"
              />

              {/* Prev / Next buttons for multi-photo gallery */}
              {modalProject.gallery && modalProject.gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalPhotoIndex((prev) => (prev > 0 ? prev - 1 : modalProject.gallery!.length - 1));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-skp-navy-deep/80 hover:bg-skp-red text-white border border-skp-navy-border transition-all shadow-lg"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalPhotoIndex((prev) => (prev < modalProject.gallery!.length - 1 ? prev + 1 : 0));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-skp-navy-deep/80 hover:bg-skp-red text-white border border-skp-navy-border transition-all shadow-lg"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Thumbnail Strip */}
            {modalProject.gallery && modalProject.gallery.length > 1 && (
              <div className="px-6 py-2.5 bg-skp-navy-dark border-t border-skp-navy-border/80 flex items-center space-x-2 overflow-x-auto justify-start scrollbar-thin">
                {modalProject.gallery.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setModalPhotoIndex(idx)}
                    className={`relative shrink-0 w-14 h-10 rounded-md overflow-hidden border-2 transition-all ${
                      modalPhotoIndex === idx 
                        ? 'border-skp-cyan ring-2 ring-skp-cyan/40 scale-105' 
                        : 'border-skp-navy-border opacity-50 hover:opacity-90'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={photo.url} 
                      alt={`Thumb ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 px-1 bg-black/80 text-[8px] font-mono text-white">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Modal Footer Description */}
            <div className="p-6 bg-skp-navy-card border-t border-skp-navy-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-skp-cyan/10 text-skp-cyan border border-skp-cyan/20">
                    {modalProject.categoryLabel}
                  </span>
                  <span>•</span>
                  <span className="flex items-center text-slate-300">
                    <MapPin className="w-3 h-3 mr-1 text-skp-red" />
                    {modalProject.location}
                  </span>
                  <span>•</span>
                  <span>{modalProject.year}</span>
                </div>

                {/* Subsystem title in modal */}
                {modalProject.gallery && (
                  <div className="text-skp-cyan font-mono text-xs font-semibold">
                    {language === 'en' ? 'Subsystem' : 'ระบบย่อย'} {modalPhotoIndex + 1}/{modalProject.gallery.length}: {
                      language === 'en' 
                        ? modalProject.gallery[modalPhotoIndex].subsystemEn 
                        : modalProject.gallery[modalPhotoIndex].subsystemTh
                    }
                  </div>
                )}

                <h4 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {language === 'en' ? modalProject.titleEn : modalProject.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {modalProject.gallery
                    ? (language === 'en' ? modalProject.gallery[modalPhotoIndex].descEn : modalProject.gallery[modalPhotoIndex].descTh)
                    : modalProject.scope}
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <a 
                  href="#contact" 
                  onClick={() => setModalProject(null)}
                  className="px-5 py-2.5 rounded-xl bg-skp-red hover:bg-skp-red-hover text-white text-xs sm:text-sm font-semibold transition-colors shadow-lg shadow-skp-red/30 flex items-center"
                >
                  <span>{language === 'en' ? 'Inquire Similar Project' : 'ปรึกษาโครงการลักษณะนี้'}</span>
                  <ArrowUpRight className="w-4 h-4 ml-1.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
