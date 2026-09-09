// ==============================================================================
// SKP ASSOCIATION CO., LTD.
// TYPES: Customer Inquiries & Role-Based Access Control (RBAC)
// ==============================================================================

export type RoleType = 
  | 'managing_director'          // กรรมการผู้จัดการ (MD)
  | 'admin_coordinator_manager'  // ผู้จัดการฝ่ายธุรการและประสานงาน
  | 'project_engineer';          // วิศวกรโครงการ

export interface RoleDefinition {
  id: RoleType;
  nameTh: string;
  nameEn: string;
  badgeColor: string;
  description: string;
}

export const ROLES: Record<RoleType, RoleDefinition> = {
  managing_director: {
    id: 'managing_director',
    nameTh: 'กรรมการผู้จัดการ',
    nameEn: 'Managing Director',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    description: 'สิทธิ์สูงสุด (Superadmin): ดูและจัดการข้อมูลทั้งหมด, ลบรายการ, ส่งออกรายงาน, บริหารจัดการสิทธิ์',
  },
  admin_coordinator_manager: {
    id: 'admin_coordinator_manager',
    nameTh: 'ผู้จัดการฝ่ายธุรการและประสานงาน',
    nameEn: 'Admin & Coordination Manager',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    description: 'สิทธิ์การจัดการ (Manager): ดูข้อมูลทั้งหมด, บันทึกการติดต่อ, มอบหมายงาน, อัปเดตสถานะ, ส่งออกข้อมูล',
  },
  project_engineer: {
    id: 'project_engineer',
    nameTh: 'วิศวกรโครงการ',
    nameEn: 'Project Engineer',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'สิทธิ์เทียบเท่าผู้จัดการ: ดูข้อมูลทั้งหมด, จัดการงานวิศวกรรม, บันทึกข้อคิดเห็นทางเทคนิค, อัปเดตสถานะ, ส่งออกข้อมูล',
  },
};

export type InquiryStatus = 
  | 'NEW'         // คำขอใหม่ รอดำเนินการ
  | 'REVIEWING'   // กำลังตรวจสอบเอกสาร/แบบ
  | 'ASSIGNED'    // มอบหมายวิศวกรโครงการแล้ว
  | 'QUOTED'      // จัดทำและเสนอราคาแล้ว
  | 'COMPLETED'   // ดำเนินการเสร็จสิ้น
  | 'CANCELLED';  // ยกเลิกคำขอ

export interface InquiryStatusConfig {
  labelTh: string;
  labelEn: string;
  colorClass: string;
}

export const INQUIRY_STATUS_CONFIG: Record<InquiryStatus, InquiryStatusConfig> = {
  NEW: {
    labelTh: 'คำขอใหม่',
    labelEn: 'New Inquiry',
    colorClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
  REVIEWING: {
    labelTh: 'กำลังตรวจสอบ',
    labelEn: 'Under Review',
    colorClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  },
  ASSIGNED: {
    labelTh: 'มอบหมายแล้ว',
    labelEn: 'Engineer Assigned',
    colorClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  QUOTED: {
    labelTh: 'เสนอราคาแล้ว',
    labelEn: 'Quoted',
    colorClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  COMPLETED: {
    labelTh: 'เสร็จสมบูรณ์',
    labelEn: 'Completed',
    colorClass: 'bg-green-500/15 text-green-300 border-green-500/30',
  },
  CANCELLED: {
    labelTh: 'ยกเลิก',
    labelEn: 'Cancelled',
    colorClass: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  },
};

export interface CustomerInquiry {
  id: string;
  docRefNumber: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  engineeringScope: string;
  projectDetailsAndLocation: string;
  status: InquiryStatus;
  assignedToUserId?: string | null;
  assignedToName?: string | null;
  engineerNotes?: string | null;
  attachmentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RBACPermissions {
  canViewAll: boolean;
  canEdit: boolean;
  canUpdateStatus: boolean;
  canAssignEngineer: boolean;
  canAddEngineerNotes: boolean;
  canExport: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
}

/**
 * คำนวณสิทธิ์การเข้าถึง (RBAC Matrix)
 * ข้อกำหนด: วิศวกรโครงการมีสิทธิ์เหมือนกับผู้จัดการฝ่ายธุรการและประสานงานทั้งหมด
 */
export function getRolePermissions(role: RoleType): RBACPermissions {
  switch (role) {
    case 'managing_director':
      return {
        canViewAll: true,
        canEdit: true,
        canUpdateStatus: true,
        canAssignEngineer: true,
        canAddEngineerNotes: true,
        canExport: true,
        canDelete: true,        // กรรมการผู้จัดการมีสิทธิ์ลบรายการ
        canManageUsers: true,   // กรรมการผู้จัดการมีสิทธิ์จัดการผู้ใช้งาน
      };
    case 'admin_coordinator_manager':
    case 'project_engineer':
      // วิศวกรโครงการมีสิทธิ์เหมือนกับผู้จัดการทั้งหมด
      return {
        canViewAll: true,
        canEdit: true,
        canUpdateStatus: true,
        canAssignEngineer: true,
        canAddEngineerNotes: true,
        canExport: true,
        canDelete: false,       // ลบไม่ได้ (เฉพาะ MD)
        canManageUsers: false,  // จัดการ User ไม่ได้ (เฉพาะ MD)
      };
    default:
      return {
        canViewAll: false,
        canEdit: false,
        canUpdateStatus: false,
        canAssignEngineer: false,
        canAddEngineerNotes: false,
        canExport: false,
        canDelete: false,
        canManageUsers: false,
      };
  }
}

export interface CompanyUser {
  id: string;
  nameTh: string;
  nameEn: string;
  nameAliases?: string[];
  email: string;
  emailAliases?: string[];
  phone: string;
  role: RoleType;
  roleTitleTh: string;
  roleTitleEn: string;
  password?: string;
  isFirstLogin: boolean;
  isVerified: boolean;
  otpCode?: string | null;
  otpExpiresAt?: string | null;
  otpChannel?: 'email' | 'mobile' | null;
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface AuthSession {
  user: Omit<CompanyUser, 'password' | 'otpCode'>;
  token: string;
  expiresAt: string;
}
