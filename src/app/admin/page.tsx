'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowLeft, 
  Sparkles, 
  FileSpreadsheet, 
  Lock, 
  Unlock, 
  RefreshCw,
  X,
  FileText,
  UserCheck,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { 
  CustomerInquiry, 
  RoleType, 
  ROLES, 
  INQUIRY_STATUS_CONFIG, 
  InquiryStatus, 
  getRolePermissions 
} from '@/types/database';

export default function AdminInquiriesPage() {
  const [currentRole, setCurrentRole] = useState<RoleType>('managing_director');
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScope, setSelectedScope] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  
  // Selected inquiry for detail/edit modal
  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New inquiry form state
  const [newInquiry, setNewInquiry] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    phoneNumber: '',
    email: '',
    engineeringScope: 'ออกแบบและปรึกษาระบบไฟฟ้า / หม้อแปลง / ตู้ MDB',
    projectDetailsAndLocation: '',
  });

  // Edit form state
  const [editForm, setEditForm] = useState<{
    status: InquiryStatus;
    assignedToName: string;
    engineerNotes: string;
  }>({
    status: 'NEW',
    assignedToName: '',
    engineerNotes: '',
  });

  const permissions = useMemo(() => getRolePermissions(currentRole), [currentRole]);

  // Fetch inquiries from API
  const fetchInquiries = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/inquiries?role=${currentRole}`, {
        headers: { 'x-user-role': currentRole },
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setInquiries(json.data);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  }, [currentRole]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const matchSearch =
        item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phoneNumber.includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.docRefNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectDetailsAndLocation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchScope = selectedScope === 'ALL' || item.engineeringScope.includes(selectedScope);
      const matchStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

      return matchSearch && matchScope && matchStatus;
    });
  }, [inquiries, searchTerm, selectedScope, selectedStatus]);

  // Summary statistics
  const stats = useMemo(() => {
    return {
      total: inquiries.length,
      new: inquiries.filter((i) => i.status === 'NEW').length,
      inProgress: inquiries.filter((i) => ['REVIEWING', 'ASSIGNED'].includes(i.status)).length,
      quotedCompleted: inquiries.filter((i) => ['QUOTED', 'COMPLETED'].includes(i.status)).length,
    };
  }, [inquiries]);

  // Handle Quick Status Change
  const handleQuickStatusChange = async (id: string, newStatus: InquiryStatus) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-role': currentRole 
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      } else {
        alert(data.error || 'ไม่สามารถเปลี่ยนสถานะได้');
      }
    } catch (err) {
      console.error('Error changing status:', err);
    }
  };

  // Handle Save Edit Form
  const handleSaveEdit = async () => {
    if (!selectedInquiry) return;
    try {
      const res = await fetch(`/api/inquiries/${selectedInquiry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentRole,
        },
        body: JSON.stringify({
          status: editForm.status,
          assignedToName: editForm.assignedToName || null,
          engineerNotes: editForm.engineerNotes || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((item) =>
            item.id === selectedInquiry.id
              ? {
                  ...item,
                  status: editForm.status,
                  assignedToName: editForm.assignedToName,
                  engineerNotes: editForm.engineerNotes,
                }
              : item
          )
        );
        setIsEditModalOpen(false);
      } else {
        alert(data.error || 'เกิดข้อผิดพลาดในการบันทึก');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Delete Inquiry (MD only)
  const handleDelete = async (id: string, refNo: string, customerName: string) => {
    if (!permissions.canDelete) {
      alert('เฉพาะ กรรมการผู้จัดการ เท่านั้นที่มีสิทธิ์ลบรายการลูกค้า');
      return;
    }

    const confirmMsg = `ยืนยันการลบรายการคำขอ #${refNo} ของคุณ ${customerName} ออกจากระบบฐานข้อมูลหรือไม่?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-role': currentRole },
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
      } else {
        alert(data.error || 'ไม่สามารถลบรายการได้');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Handle Add New Inquiry
  const handleCreateInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInquiry),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => [data.data, ...prev]);
        setIsAddModalOpen(false);
        setNewInquiry({
          firstName: '',
          lastName: '',
          companyName: '',
          phoneNumber: '',
          email: '',
          engineeringScope: 'ออกแบบและปรึกษาระบบไฟฟ้า / หม้อแปลง / ตู้ MDB',
          projectDetailsAndLocation: '',
        });
      } else {
        alert(data.error || 'ไม่สามารถบันทึกได้');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Export to Excel / CSV
  const handleExportCSV = () => {
    if (!filteredInquiries.length) {
      alert('ไม่มีข้อมูลสำหรับส่งออก');
      return;
    }

    const headers = [
      'เลขที่อ้างอิง',
      'วันที่ส่งคำขอ',
      'ชื่อ',
      'นามสกุล',
      'บริษัท_องค์กร',
      'เบอร์โทรศัพท์',
      'อีเมล',
      'ขอบข่ายงานวิศวกรรม',
      'รายละเอียดโครงการ_สถานที่ตั้ง',
      'สถานะ',
      'วิศวกรผู้รับผิดชอบ',
      'บันทึกข้อคิดเห็นวิศวกร',
    ];

    const rows = filteredInquiries.map((i) => [
      `"${i.docRefNumber}"`,
      `"${new Date(i.createdAt).toLocaleString('th-TH')}"`,
      `"${i.firstName}"`,
      `"${i.lastName}"`,
      `"${i.companyName}"`,
      `"${i.phoneNumber}"`,
      `"${i.email}"`,
      `"${i.engineeringScope}"`,
      `"${i.projectDetailsAndLocation.replace(/"/g, '""')}"`,
      `"${INQUIRY_STATUS_CONFIG[i.status]?.labelTh || i.status}"`,
      `"${i.assignedToName || '-'}"`,
      `"${(i.engineerNotes || '-').replace(/"/g, '""')}"`,
    ]);

    // Add UTF-8 BOM so Excel opens Thai fonts correctly
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SKP_Customer_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-skp-red selection:text-white pb-20 font-sans">
      {/* Top Header & Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับหน้าหลักเว็บไซต์</span>
            </Link>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-sm font-bold text-white tracking-wide flex items-center">
                <ShieldCheck className="w-4 h-4 text-cyan-400 mr-1.5" />
                ระบบบริหารรายชื่อลูกค้าและสิทธิ์การเข้าถึง (RBAC Customer Portal)
              </h1>
            </div>
          </div>

          {/* Role Switcher Indicator */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 hidden sm:inline-block">จำลองตำแหน่งผู้เข้าใช้งาน:</span>
            <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800">
              {(['managing_director', 'admin_coordinator_manager', 'project_engineer'] as RoleType[]).map((r) => {
                const roleDef = ROLES[r];
                const active = currentRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setCurrentRole(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                      active
                        ? 'bg-skp-navy-border/80 text-white shadow-md border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{roleDef.nameTh}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Role & Permissions Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${ROLES[currentRole].badgeColor}`}>
                {ROLES[currentRole].nameTh} ({ROLES[currentRole].nameEn})
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentRole === 'managing_director' && '👑 สิทธิ์ระดับผู้บริหารสูงสุด (Superadmin)'}
                {currentRole === 'admin_coordinator_manager' && '📋 สิทธิ์การจัดการและประสานงาน (Manager)'}
                {currentRole === 'project_engineer' && '⚡ สิทธิ์งานวิศวกรรมโครงการ (สิทธิ์เท่ากับผู้จัดการทั้งหมด)'}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {ROLES[currentRole].description}
            </p>
          </div>

          {/* Permission Matrix Badges */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center">
              <Unlock className="w-3 h-3 mr-1" /> ดูข้อมูลลูกค้าทั้งหมด
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center">
              <Unlock className="w-3 h-3 mr-1" /> แก้ไข & อัปเดตสถานะ
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center">
              <Unlock className="w-3 h-3 mr-1" /> บันทึกงานวิศวกร
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center">
              <Unlock className="w-3 h-3 mr-1" /> ส่งออก Excel/CSV
            </span>
            {permissions.canDelete ? (
              <span className="px-2.5 py-1 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/40 flex items-center font-bold">
                <Trash2 className="w-3 h-3 mr-1" /> สิทธิ์ลบรายการ (Active)
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700 flex items-center" title="เฉพาะกรรมการผู้จัดการที่มีสิทธิ์ลบ">
                <Lock className="w-3 h-3 mr-1" /> ลบรายการ (จำกัดสิทธิ์เฉพาะ MD)
              </span>
            )}
          </div>
        </div>

        {/* Quick KPI Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>รายการทั้งหมด</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{stats.total}</div>
            <div className="text-[11px] text-slate-400 mt-1">รายชื่อลูกค้าในฐานข้อมูล</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>คำขอใหม่ รอดำเนินการ</span>
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400 font-mono">{stats.new}</div>
            <div className="text-[11px] text-slate-400 mt-1">ต้องการการติดต่อกลับ</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>กำลังตรวจสอบ / มอบหมายแล้ว</span>
              <Briefcase className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 font-mono">{stats.inProgress}</div>
            <div className="text-[11px] text-slate-400 mt-1">ทีมวิศวกรดูแลหน้างาน</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>เสนอราคาแล้ว / เสร็จสิ้น</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{stats.quotedCompleted}</div>
            <div className="text-[11px] text-slate-400 mt-1">ส่งใบเสนอราคาเรียบร้อย</div>
          </div>
        </div>

        {/* Filter and Action Bar */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อ, บริษัท, เบอร์โทร, เลขที่ RFQ, สถานที่ตั้ง..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Scope Filter */}
            <div className="min-w-[180px]">
              <select
                value={selectedScope}
                onChange={(e) => setSelectedScope(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">ขอบข่ายงานวิศวกรรมทั้งหมด</option>
                <option value="ไฟฟ้า">ระบบไฟฟ้า / หม้อแปลง / MDB</option>
                <option value="M&E">งานระบบประกอบอาคาร (M&E Turnkey)</option>
                <option value="HVAC">ระบบปรับอากาศ (HVAC / Chiller)</option>
                <option value="ดับเพลิง">ระบบดับเพลิง & สุขาภิบาล</option>
                <option value="ก่อสร้าง">ก่อสร้างอาคาร & โรงงาน</option>
                <option value="BOQ">ประเมินราคาตามแบบ (BOQ)</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="min-w-[150px]">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">ทุกสถานะคำขอ</option>
                <option value="NEW">คำขอใหม่ (New)</option>
                <option value="REVIEWING">กำลังตรวจสอบ (Reviewing)</option>
                <option value="ASSIGNED">มอบหมายแล้ว (Assigned)</option>
                <option value="QUOTED">เสนอราคาแล้ว (Quoted)</option>
                <option value="COMPLETED">เสร็จสมบูรณ์ (Completed)</option>
                <option value="CANCELLED">ยกเลิก (Cancelled)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium flex items-center space-x-1.5 transition-colors border border-slate-700"
              title="ดาวน์โหลดข้อมูลลูกค้าเป็นไฟล์ Excel / CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>ส่งออก Excel/CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-lg shadow-cyan-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มข้อมูลลูกค้าใหม่</span>
            </button>
          </div>
        </div>

        {/* Main Customer Inquiries Table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-4">เลขที่อ้างอิง / วันที่</th>
                  <th className="py-3.5 px-4">ชื่อ - นามสกุล</th>
                  <th className="py-3.5 px-4">บริษัท / องค์กร</th>
                  <th className="py-3.5 px-4">เบอร์โทร & อีเมล</th>
                  <th className="py-3.5 px-4">ขอบข่ายงานวิศวกรรม</th>
                  <th className="py-3.5 px-4">รายละเอียดโครงการ & ที่ตั้ง</th>
                  <th className="py-3.5 px-4">สถานะคำขอ</th>
                  <th className="py-3.5 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200 font-sans">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                      กำลังโหลดข้อมูลรายการลูกค้า...
                    </td>
                  </tr>
                ) : filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                      ไม่พบข้อมูลลูกค้าที่ตรงกับเงื่อนไขการค้นหา
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((item) => {
                    const statusCfg = INQUIRY_STATUS_CONFIG[item.status] || INQUIRY_STATUS_CONFIG.NEW;
                    return (
                      <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                        {/* Ref Number & Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-cyan-400 block">{item.docRefNumber}</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(item.createdAt).toLocaleDateString('th-TH', {
                              year: '2-digit',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>

                        {/* Customer Name */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-semibold text-white">
                            {item.firstName} {item.lastName}
                          </div>
                        </td>

                        {/* Company Name */}
                        <td className="py-3.5 px-4">
                          <div className="max-w-[160px] truncate text-slate-300 font-medium" title={item.companyName}>
                            {item.companyName}
                          </div>
                        </td>

                        {/* Phone & Email */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-mono text-cyan-300 flex items-center">
                            <Phone className="w-3 h-3 mr-1 text-slate-400" />
                            <a href={`tel:${item.phoneNumber}`} className="hover:underline">{item.phoneNumber}</a>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[150px] flex items-center mt-0.5" title={item.email}>
                            <Mail className="w-3 h-3 mr-1 text-slate-500" />
                            {item.email}
                          </div>
                        </td>

                        {/* Engineering Scope */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[11px] font-medium inline-block max-w-[200px] truncate" title={item.engineeringScope}>
                            {item.engineeringScope}
                          </span>
                        </td>

                        {/* Project Details & Location */}
                        <td className="py-3.5 px-4">
                          <div className="max-w-[220px] text-slate-300 line-clamp-2 text-xs leading-relaxed" title={item.projectDetailsAndLocation}>
                            {item.projectDetailsAndLocation}
                          </div>
                          {item.assignedToName && (
                            <span className="inline-flex items-center text-[10px] text-cyan-400 font-mono mt-1">
                              <UserCheck className="w-3 h-3 mr-1" />
                              ผู้ดูแล: {item.assignedToName}
                            </span>
                          )}
                        </td>

                        {/* Status dropdown */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={item.status}
                            onChange={(e) => handleQuickStatusChange(item.id, e.target.value as InquiryStatus)}
                            className={`text-xs px-2.5 py-1 rounded-full border font-medium cursor-pointer bg-slate-950 focus:outline-none ${statusCfg.colorClass}`}
                          >
                            <option value="NEW">คำขอใหม่</option>
                            <option value="REVIEWING">กำลังตรวจสอบ</option>
                            <option value="ASSIGNED">มอบหมายแล้ว</option>
                            <option value="QUOTED">เสนอราคาแล้ว</option>
                            <option value="COMPLETED">เสร็จสมบูรณ์</option>
                            <option value="CANCELLED">ยกเลิก</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                          {/* View Detail Modal */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInquiry(item);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white transition-colors"
                            title="ดูรายละเอียดโครงการและที่ตั้งฉบับเต็ม"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit / Assign Notes Modal */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInquiry(item);
                              setEditForm({
                                status: item.status,
                                assignedToName: item.assignedToName || '',
                                engineerNotes: item.engineerNotes || '',
                              });
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-white transition-colors"
                            title="มอบหมายงานและบันทึกข้อคิดเห็นวิศวกร"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete button (MD Only) */}
                          {permissions.canDelete ? (
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.docRefNumber, `${item.firstName} ${item.lastName}`)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                              title="ลบรายการลูกค้า (เฉพาะกรรมการผู้จัดการ)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="p-1.5 rounded-lg bg-slate-800/40 text-slate-600 cursor-not-allowed"
                              title="ไม่มีสิทธิ์ลบ: จำกัดสิทธิ์เฉพาะกรรมการผู้จัดการเท่านั้น"
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* DETAIL MODAL */}
      {isDetailModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">#{selectedInquiry.docRefNumber}</span>
                <h3 className="text-lg font-bold text-white">รายละเอียดข้อมูลลูกค้าและโครงการ</h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">ชื่อ - นามสกุล:</span>
                <div className="font-semibold text-white text-sm">{selectedInquiry.firstName} {selectedInquiry.lastName}</div>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">บริษัท / องค์กร:</span>
                <div className="font-semibold text-white text-sm">{selectedInquiry.companyName}</div>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">เบอร์โทรศัพท์:</span>
                <div className="font-mono text-cyan-300 text-sm">{selectedInquiry.phoneNumber}</div>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">อีเมล:</span>
                <div className="text-slate-200 text-sm">{selectedInquiry.email}</div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-slate-400 block font-medium">ขอบข่ายงานวิศวกรรมที่ต้องการปรึกษา:</span>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-medium">
                {selectedInquiry.engineeringScope}
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-slate-400 block font-medium">รายละเอียดโครงการ / สถานที่ตั้งโครงการ:</span>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                {selectedInquiry.projectDetailsAndLocation}
              </div>
            </div>

            {selectedInquiry.engineerNotes && (
              <div className="space-y-1 text-xs">
                <span className="text-amber-400 block font-medium">บันทึกข้อคิดเห็นทางเทคนิคของวิศวกร:</span>
                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-200 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.engineerNotes}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / ASSIGN MODAL */}
      {isEditModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold">#{selectedInquiry.docRefNumber}</span>
                <h3 className="text-lg font-bold text-white">มอบหมายงานและบันทึกข้อคิดเห็นวิศวกร</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">สถานะโครงการ:</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as InquiryStatus })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="NEW">คำขอใหม่ (New)</option>
                  <option value="REVIEWING">กำลังตรวจสอบ (Reviewing)</option>
                  <option value="ASSIGNED">มอบหมายวิศวกรแล้ว (Assigned)</option>
                  <option value="QUOTED">เสนอราคาแล้ว (Quoted)</option>
                  <option value="COMPLETED">เสร็จสมบูรณ์ (Completed)</option>
                  <option value="CANCELLED">ยกเลิกคำขอ (Cancelled)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">วิศวกรผู้รับผิดชอบโครงการ:</label>
                <input
                  type="text"
                  value={editForm.assignedToName}
                  onChange={(e) => setEditForm({ ...editForm, assignedToName: e.target.value })}
                  placeholder="เช่น คุณสมชาย (วิศวกรระบบไฟฟ้า) หรือ วิศวกรโครงการ"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">บันทึกความเห็นทางเทคนิค / ผลการสำรวจหน้างาน:</label>
                <textarea
                  rows={4}
                  value={editForm.engineerNotes}
                  onChange={(e) => setEditForm({ ...editForm, engineerNotes: e.target.value })}
                  placeholder="ระบุข้อกำหนดทางเทคนิค พิกัดโหลด หรือผลการติดต่อประสานงาน..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW INQUIRY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Plus className="w-5 h-5 text-cyan-400 mr-2" />
                บันทึกข้อมูลลูกค้าที่ติดต่อเข้ามาใหม่
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInquiry} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ชื่อผู้ติดต่อ *</label>
                  <input
                    type="text"
                    required
                    value={newInquiry.firstName}
                    onChange={(e) => setNewInquiry({ ...newInquiry, firstName: e.target.value })}
                    placeholder="เช่น สมชาย"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">นามสกุล *</label>
                  <input
                    type="text"
                    required
                    value={newInquiry.lastName}
                    onChange={(e) => setNewInquiry({ ...newInquiry, lastName: e.target.value })}
                    placeholder="เช่น วิศวกิจ"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ชื่อบริษัท / องค์กร *</label>
                <input
                  type="text"
                  required
                  value={newInquiry.companyName}
                  onChange={(e) => setNewInquiry({ ...newInquiry, companyName: e.target.value })}
                  placeholder="เช่น บริษัท เอสซีจี จำกัด"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    required
                    value={newInquiry.phoneNumber}
                    onChange={(e) => setNewInquiry({ ...newInquiry, phoneNumber: e.target.value })}
                    placeholder="08X-XXX-XXXX"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">อีเมล *</label>
                  <input
                    type="email"
                    required
                    value={newInquiry.email}
                    onChange={(e) => setNewInquiry({ ...newInquiry, email: e.target.value })}
                    placeholder="example@company.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ขอบข่ายงานวิศวกรรมที่ต้องการปรึกษา *</label>
                <select
                  value={newInquiry.engineeringScope}
                  onChange={(e) => setNewInquiry({ ...newInquiry, engineeringScope: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="ออกแบบและปรึกษาระบบไฟฟ้า / หม้อแปลง / ตู้ MDB">ออกแบบและปรึกษาระบบไฟฟ้า / หม้อแปลง / ตู้ MDB</option>
                  <option value="รับเหมาติดตั้งงานระบบประกอบอาคาร (M&E Turnkey)">รับเหมาติดตั้งงานระบบประกอบอาคาร (M&E Turnkey)</option>
                  <option value="ระบบปรับอากาศและระบายอากาศ (HVAC Chiller / AHU)">ระบบปรับอากาศและระบายอากาศ (HVAC Chiller / AHU)</option>
                  <option value="ระบบดับเพลิงและระบบสุขาภิบาล">ระบบดับเพลิงและระบบสุขาภิบาล</option>
                  <option value="งานรับเหมาก่อสร้างอาคารและโรงงานอุตสาหกรรม">งานรับเหมาก่อสร้างอาคารและโรงงานอุตสาหกรรม</option>
                  <option value="งานประเมินราคาตามแบบ (BOQ / TOR / Tender)">งานประเมินราคาตามแบบ (BOQ / TOR / Tender)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">รายละเอียดโครงการ / สถานที่ตั้งโครงการ *</label>
                <textarea
                  rows={3}
                  required
                  value={newInquiry.projectDetailsAndLocation}
                  onChange={(e) => setNewInquiry({ ...newInquiry, projectDetailsAndLocation: e.target.value })}
                  placeholder="ระบุสถานที่ตั้ง ขนาดพื้นที่ กำลังไฟฟ้า หรือขอบข่ายงานโดยละเอียด..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/30"
                >
                  บันทึกลงฐานข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
