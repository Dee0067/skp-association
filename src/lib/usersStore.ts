// ==============================================================================
// SKP ASSOCIATION CO., LTD.
// COMPANY USERS DATA STORE & AUTHENTICATION WITH OTP
// ==============================================================================

import type { CompanyUser, RoleType } from '@/types/database';
import nodemailer from 'nodemailer';

declare global {
  // eslint-disable-next-line no-var
  var __skpCompanyUsersStore: CompanyUser[] | undefined;
}

// ฐานข้อมูลบุคลากรของ บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด ตามผังโครงสร้างองค์กรจริง (Whitelisted Company Staff Only)
const initialCompanyPersonnel: CompanyUser[] = [
  {
    id: 'usr-skp-001',
    nameTh: 'คุณสุพจน์ มั่นสิทธิกุล',
    nameEn: 'Mr. Supot Munsittikul',
    nameAliases: ['สุพจน์ เหมสถล', 'สุพจน์ มั่นสิทธิกุล', 'Supot Hemsathol', 'Supot Munsittikul', 'สุพจน์', 'Supot'],
    email: 'supot.meskp@gmail.com', // อีเมลจริงตามผังองค์กร
    phone: '093-695 6445',
    role: 'managing_director',
    roleTitleTh: 'กรรมการผู้จัดการ',
    roleTitleEn: 'Managing Director',
    password: 'skp@admin2026',
    isFirstLogin: true,
    isVerified: false,
    otpCode: null,
    otpExpiresAt: null,
    otpChannel: null,
    createdAt: '2026-09-01T00:00:00.000Z',
    lastLoginAt: null,
  },
  {
    id: 'usr-skp-002',
    nameTh: 'คุณวิไลวรรณ โกฆะรัตน์',
    nameEn: 'Mrs. Wilaiwan Kokarat',
    nameAliases: ['วิไลวรรณ โกฆะรัตน์', 'Wilaiwan Kokharat', 'Wilaiwan Kokarat', 'วิไลวรรณ', 'Wilaiwan'],
    email: 'vilaivan2518@gmail.com', // อีเมลจริงตามผังองค์กร
    emailAliases: ['admin@skpassociation.co.th'],
    phone: '082-208 4541',
    role: 'admin_coordinator_manager',
    roleTitleTh: 'ผู้จัดการฝ่ายธุรการและประสานงาน',
    roleTitleEn: 'Admin & Coordination Manager',
    password: 'skp@admin2026',
    isFirstLogin: true,
    isVerified: false,
    otpCode: null,
    otpExpiresAt: null,
    otpChannel: null,
    createdAt: '2026-09-01T00:00:00.000Z',
    lastLoginAt: null,
  },
  {
    id: 'usr-skp-003',
    nameTh: 'คุณรังสฤทธิ์ สุหลง',
    nameEn: 'Mr. Rangsarit Sulong',
    nameAliases: ['รังสฤทธิ์ สุหลง', 'Rangsarit Sulong', 'รังสฤทธิ์', 'Rangsarit'],
    email: 'rangsarit.meskp@gmail.com', // อีเมลจริงตามผังองค์กร
    emailAliases: ['engineer.rangsarit@skpassociation.co.th'],
    phone: '064-630 4866',
    role: 'project_engineer',
    roleTitleTh: 'วิศวกรโครงการ (ระบบไฟฟ้าและกำลัง)',
    roleTitleEn: 'Project Engineer (Electrical)',
    password: 'skp@admin2026',
    isFirstLogin: true,
    isVerified: false,
    otpCode: null,
    otpExpiresAt: null,
    otpChannel: null,
    createdAt: '2026-09-01T00:00:00.000Z',
    lastLoginAt: null,
  },
  {
    id: 'usr-skp-004',
    nameTh: 'คุณประเสริฐ ลากะสงค์',
    nameEn: 'Mr. Prasert Lakasong',
    nameAliases: ['ประเสริฐ ลากะสงค์', 'Prasert Lakasong', 'ประเสริฐ', 'Prasert'],
    email: 'prasertlakasong@gmail.com', // อีเมลจริงตามผังองค์กร
    emailAliases: ['engineer.prasert@skpassociation.co.th'],
    phone: '062-624 8171',
    role: 'project_engineer',
    roleTitleTh: 'วิศวกรโครงการ (ระบบเครื่องกลและสุขาภิบาล)',
    roleTitleEn: 'Project Engineer (Mechanical & Plumbing)',
    password: 'skp@admin2026',
    isFirstLogin: true,
    isVerified: false,
    otpCode: null,
    otpExpiresAt: null,
    otpChannel: null,
    createdAt: '2026-09-01T00:00:00.000Z',
    lastLoginAt: null,
  },
];

function getUsersStore(): CompanyUser[] {
  if (!global.__skpCompanyUsersStore) {
    global.__skpCompanyUsersStore = [...initialCompanyPersonnel];
  }
  return global.__skpCompanyUsersStore;
}

function normalize(text: string): string {
  return text
    ? text
        .toLowerCase()
        .replace(/^(คุณ|นาย|นาง|นางสาว|mr\.|mrs\.|ms\.)\s*/i, '')
        .replace(/\s+/g, ' ')
        .trim()
    : '';
}

/**
 * ค้นหาผู้ใช้งานเฉพาะบุคลากรบริษัท (Company-Only Whitelist)
 * รองรับการค้นหาชื่อ-นามสกุล ทั้งภาษาไทยและภาษาอังกฤษ
 * ใช้อีเมลจริงของผู้ใช้งานตามผังโครงสร้างองค์กรที่มีอยู่
 */
export function findCompanyUserByNameAndEmail(fullName: string, email: string): CompanyUser | undefined {
  const normName = normalize(fullName);
  const normEmail = normalize(email);
  const store = getUsersStore();

  return store.find((user) => {
    // 1. ตรวจสอบอีเมล (ตรงกับอีเมลตามผังองค์กร หรืออีเมลที่รองรับ)
    const userEmails = [user.email, ...(user.emailAliases || [])].map(normalize);
    const matchEmail = userEmails.includes(normEmail);
    if (!matchEmail) return false;

    // 2. ตรวจสอบชื่อ-นามสกุล ทั้งไทยและอังกฤษ
    const candidateNames = [
      user.nameTh,
      user.nameEn,
      ...(user.nameAliases || [])
    ].map(normalize);

    const matchName = candidateNames.some((n) => {
      if (!n) return false;
      return n === normName || n.replace(/\s/g, '') === normName.replace(/\s/g, '');
    });

    return matchName;
  });
}

/**
 * ตัดรหัสผ่านและ OTP ออกก่อนส่งกลับ Client
 */
export function sanitizeUser(user: CompanyUser): Omit<CompanyUser, 'password' | 'otpCode'> {
  const { password: _p, otpCode: _o, ...safe } = user;
  return safe;
}

/**
 * เข้าสู่ระบบบุคลากรบริษัท
 */
export function loginStaff(fullName: string, email: string, passwordAttempt: string): {
  success: boolean;
  requiresOtp?: boolean;
  user?: Omit<CompanyUser, 'password' | 'otpCode'>;
  token?: string;
  error?: string;
} {
  if (!fullName?.trim() || !email?.trim() || !passwordAttempt?.trim()) {
    return {
      success: false,
      error: 'กรุณากรอกชื่อ-นามสกุล (ภาษาไทยหรืออังกฤษ), อีเมลองค์กร และรหัสผ่านให้ครบถ้วน',
    };
  }

  const user = findCompanyUserByNameAndEmail(fullName, email);

  // บุคคลภายนอกไม่สามารถเข้าสู่ระบบได้
  if (!user) {
    return {
      success: false,
      error: 'บุคคลภายนอกไม่สามารถเข้าใช้งานได้ ระบบนี้สงวนสิทธิ์เฉพาะบุคลากร บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด เท่านั้น กรุณาตรวจสอบชื่อ-นามสกุลและอีเมล',
    };
  }

  // ตรวจสอบรหัสผ่าน
  if (user.password !== passwordAttempt) {
    return {
      success: false,
      error: 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบรหัสผ่านอีกครั้ง',
    };
  }

  // หากเป็นการ Login ครั้งแรก -> ต้องยืนยัน OTP ก่อน
  if (user.isFirstLogin || !user.isVerified) {
    return {
      success: true,
      requiresOtp: true,
      user: sanitizeUser(user),
    };
  }

  // เข้าสู่ระบบสำเร็จ
  user.lastLoginAt = new Date().toISOString();
  const token = `skp_session_${user.id}_${Date.now()}`;

  return {
    success: true,
    requiresOtp: false,
    user: sanitizeUser(user),
    token,
  };
}

/**
 * ร้องขอรหัส OTP (เลือกส่งทาง Email หรือ มือถือ)
 */
export async function generateAndSendOtp(
  userId: string,
  channel: 'email' | 'mobile'
): Promise<{
  success: boolean;
  channel: 'email' | 'mobile';
  maskedTarget: string;
  otpForDemo: string;
  error?: string;
}> {
  const store = getUsersStore();
  const user = store.find((u) => u.id === userId);

  if (!user) {
    return {
      success: false,
      channel,
      maskedTarget: '',
      otpForDemo: '',
      error: 'ไม่พบบัญชีผู้ใช้งานในระบบองค์กร',
    };
  }

  // สร้างรหัส OTP 6 หลัก
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 นาที

  user.otpCode = otp;
  user.otpExpiresAt = expiresAt;
  user.otpChannel = channel;

  let maskedTarget = '';
  if (channel === 'email') {
    const parts = user.email.split('@');
    maskedTarget = `${parts[0].slice(0, 2)}***@${parts[1]}`;

    // ส่งอีเมลจริงผ่าน SMTP หากมีการตั้งค่าไว้
    try {
      const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
      const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
      if (smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from: `"ระบบความปลอดภัย SKP Association" <${smtpUser}>`,
          to: user.email,
          subject: `[SKP Security] รหัสยืนยัน OTP สำหรับเข้าสู่ระบบครั้งแรก: ${otp}`,
          html: `
            <div style="font-family: sans-serif; padding: 24px; background: #0b132b; color: #ffffff; border-radius: 12px; max-width: 500px;">
              <h2 style="color: #38bdf8; margin: 0 0 12px 0;">บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด</h2>
              <p style="color: #cbd5e1; font-size: 14px;">เรียนคุณ <strong>${user.nameTh}</strong> (${user.nameEn})</p>
              <p style="color: #cbd5e1; font-size: 14px;">รหัสยืนยันตัวตน (OTP) สำหรับการเข้าสู่ระบบครั้งแรกของคุณคือ:</p>
              <div style="background: #1e293b; padding: 16px; border-radius: 8px; font-size: 32px; letter-spacing: 6px; font-weight: bold; color: #00f0ff; text-align: center; border: 1px solid #38bdf8;">
                ${otp}
              </div>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">* รหัสนี้มีอายุการใช้งาน 5 นาที และใช้ได้ครั้งเดียวเท่านั้น</p>
            </div>
          `,
        });
      }
    } catch (mailErr) {
      console.warn('Failed to send OTP email directly:', mailErr);
    }
  } else {
    // Mobile SMS Target
    const digits = user.phone.replace(/\D/g, '');
    maskedTarget = digits.length >= 9
      ? `${digits.slice(0, 3)}-***-${digits.slice(-4)}`
      : user.phone;
  }

  return {
    success: true,
    channel,
    maskedTarget,
    otpForDemo: otp, // ส่งโค้ดกลับไปแสดงบนหน้าจอด้วยเพื่อให้ทดสอบได้ทันที
  };
}

/**
 * ตรวจสอบและยืนยันรหัส OTP สำหรับการเข้าใช้งานครั้งแรก
 */
export function verifyOtpAndActivate(
  userId: string,
  enteredOtp: string,
  newPassword?: string
): {
  success: boolean;
  user?: Omit<CompanyUser, 'password' | 'otpCode'>;
  token?: string;
  error?: string;
} {
  const store = getUsersStore();
  const user = store.find((u) => u.id === userId);

  if (!user) {
    return { success: false, error: 'ไม่พบบัญชีผู้ใช้งาน' };
  }

  if (!user.otpCode || !user.otpExpiresAt) {
    return { success: false, error: 'ยังไม่มีการขอรหัส OTP กรุณากดขอรหัสใหม่' };
  }

  if (new Date() > new Date(user.otpExpiresAt)) {
    return { success: false, error: 'รหัส OTP หมดอายุแล้ว (เกิน 5 นาที) กรุณากดขอรหัสใหม่' };
  }

  if (user.otpCode.trim() !== enteredOtp.trim()) {
    return { success: false, error: 'รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบรหัส 6 หลักอีกครั้ง' };
  }

  // ผ่านการยืนยัน OTP สำเร็จ!
  user.isFirstLogin = false;
  user.isVerified = true;
  user.otpCode = null;
  user.otpExpiresAt = null;
  user.lastLoginAt = new Date().toISOString();

  if (newPassword && newPassword.trim().length >= 6) {
    user.password = newPassword.trim();
  }

  const token = `skp_session_${user.id}_${Date.now()}`;

  return {
    success: true,
    user: sanitizeUser(user),
    token,
  };
}

/**
 * ดึงข้อมูลผู้ใช้ทั้งหมด (เฉพาะกรรมการผู้จัดการ)
 */
export function getAllCompanyUsers(): Omit<CompanyUser, 'password' | 'otpCode'>[] {
  return getUsersStore().map(sanitizeUser);
}
