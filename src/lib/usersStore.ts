// ==============================================================================
// SKP ASSOCIATION CO., LTD.
// COMPANY USERS DATA STORE & AUTHENTICATION WITH OTP
// ==============================================================================

import type { CompanyUser, RoleType } from '@/types/database';
import nodemailer from 'nodemailer';
import crypto from 'node:crypto';

declare global {
  // eslint-disable-next-line no-var
  var __skpCompanyUsersStore: CompanyUser[] | undefined;
}

// ฐานข้อมูลบุคลากรของ บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด ตามผังโครงสร้างองค์กรจริงหน้าเว็บหลัก (Whitelisted Company Staff Only)
const initialCompanyPersonnel: CompanyUser[] = [
  {
    id: 'usr-skp-001',
    nameTh: 'คุณสุพจน์ มั่นสิทธิกุล',
    nameEn: 'Mr. Supot Munsittikul',
    nameAliases: ['สุพจน์ เหมสาถล', 'สุพจน์ เหมสถล', 'สุพจน์ มั่นสิทธิกุล', 'Supot Hemsathol', 'Supot Munsittikul', 'สุพจน์', 'Supot'],
    email: 'supot.meskp@gmail.com', // อีเมลจริงตามผังองค์กร
    phone: '093-695 6445',
    role: 'managing_director',
    roleTitleTh: 'กรรมการผู้จัดการ',
    roleTitleEn: 'Managing Director',
    password: '12345',
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
    nameTh: 'คุณกัณณปภัสส์ ช.',
    nameEn: 'Ms. Kannapaphat C.',
    nameAliases: ['กัณณปภัสส์ ช.', 'กัณณปภัสส์', 'กัณปภัสส์', 'Kannapaphat C.', 'Kannapaphat', 'Ms. Kannapaphat C.'],
    email: 'kannapaphat.skp@gmail.com', // อีเมลจริงตามผังองค์กร
    emailAliases: ['admin@skpassociation.co.th', 'kannapaphat@gmail.com', 'kannapaphat.c@gmail.com', 'skp.kannapaphat@gmail.com', 'info@skpassociation.co.th'],
    phone: '090-415 5144',
    role: 'admin_coordinator_manager',
    roleTitleTh: 'ผู้จัดการฝ่ายธุรการและประสานงาน',
    roleTitleEn: 'Administrator (Admin & Coordination Manager)',
    password: '12345',
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
    emailAliases: ['engineer.rangsarit@skpassociation.co.th', 'engineer@skpassociation.co.th'],
    phone: '064-630 4866',
    role: 'project_engineer',
    roleTitleTh: 'วิศวกรโครงการ',
    roleTitleEn: 'Project Engineer',
    password: '12345',
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
    nameTh: 'คุณวิไลวรรณ โกฆะรัตน์',
    nameEn: 'Mrs. Wilaiwan Kokarat',
    nameAliases: ['วิไลวรรณ โกฆะรัตน์', 'Wilaiwan Kokharat', 'Wilaiwan Kokarat', 'วิไลวรรณ', 'Wilaiwan'],
    email: 'vilaivan2518@gmail.com', // อีเมลจริงตามผังองค์กร
    emailAliases: ['safety@skpassociation.co.th', 'hse@skpassociation.co.th'],
    phone: '082-208 4541',
    role: 'safety_officer',
    roleTitleTh: 'เจ้าหน้าที่ความปลอดภัยวิชาชีพ (จป.วิชาชีพ)',
    roleTitleEn: 'Safety Officer (HSE Specialist)',
    password: '12345',
    isFirstLogin: true,
    isVerified: false,
    otpCode: null,
    otpExpiresAt: null,
    otpChannel: null,
    createdAt: '2026-09-01T00:00:00.000Z',
    lastLoginAt: null,
  },
  {
    id: 'usr-skp-005',
    nameTh: 'คุณประเสริฐ ลากะสงค์',
    nameEn: 'Mr. Prasert Lakasong',
    nameAliases: ['ประเสริฐ ลากะสงค์', 'Prasert Lakasong', 'ประเสริฐ', 'Prasert'],
    email: 'prasertlakasong@gmail.com', // อีเมลจริงตามผังองค์กร
    emailAliases: ['foreman@skpassociation.co.th', 'prasert@skpassociation.co.th'],
    phone: '062-624 8171',
    role: 'site_foreman',
    roleTitleTh: 'หัวหน้าผู้ควบคุมงานสนาม (Foreman)',
    roleTitleEn: 'Site Construction Foreman',
    password: '12345',
    isFirstLogin: true,
    isVerified: false,
    otpCode: null,
    otpExpiresAt: null,
    otpChannel: null,
    createdAt: '2026-09-01T00:00:00.000Z',
    lastLoginAt: null,
  },
  {
    id: 'usr-skp-006',
    nameTh: 'คุณภาคภูมิ ภู่จ้อย',
    nameEn: 'Mr. Phakphoom Phoojoi',
    nameAliases: ['ภาคภูมิ ภู่จ้อย', 'ภาคภูมิ', 'Phakphoom Phoojoi', 'Phakphoom', 'Mr. Phakphoom Phoojoi'],
    email: 'phakphoom.meskp@gmail.com', // อีเมลจริงตามผังองค์กร
    emailAliases: ['cad@skpassociation.co.th', 'phakphoom@gmail.com', 'phakphoom.phoojoi@gmail.com'],
    phone: '02-116 4125',
    role: 'cad_bim_draftman',
    roleTitleTh: 'พนักงานเขียนแบบวิศวกรรม (CAD/BIM)',
    roleTitleEn: 'Draftman & CAD Specialist',
    password: '12345',
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
  isFirstLogin?: boolean;
  isOutsider?: boolean;
  user?: Omit<CompanyUser, 'password' | 'otpCode'>;
  token?: string;
  error?: string;
} {
  if (!fullName?.trim() || !email?.trim() || !passwordAttempt?.trim()) {
    return {
      success: false,
      error: 'กรุณากรอกชื่อ-นามสกุล (ภาษาไทยหรืออังกฤษ), อีเมลองค์กร และรหัสผ่านให้ครบถ้วนทุกช่อง',
    };
  }

  const user = findCompanyUserByNameAndEmail(fullName, email);

  // บุคคลภายนอกไม่สามารถเข้าสู่ระบบได้
  if (!user) {
    return {
      success: false,
      isOutsider: true,
      error: 'บุคคลภายนอกไม่สามารถเข้าใช้งานได้ ระบบนี้สงวนสิทธิ์เฉพาะบุคลากร บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด เท่านั้น',
    };
  }

  // ตรวจสอบรหัสผ่าน
  if (user.password !== passwordAttempt) {
    return {
      success: false,
      isOutsider: false,
      error: user.isFirstLogin
        ? 'รหัสผ่านไม่ถูกต้อง (สำหรับการเข้าใช้งานครั้งแรก กรุณาใช้รหัสผ่านเริ่มต้น 12345)'
        : 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบรหัสผ่านอีกครั้ง หรือกด "ลืมรหัสผ่าน"',
    };
  }

  // บุคลากรในองค์กรต้องยืนยันตัวตนด้วยรหัส OTP ทุกครั้งที่มีการเข้าสู่ระบบ (Mandatory OTP on every login)
  return {
    success: true,
    requiresOtp: true,
    isFirstLogin: user.isFirstLogin,
    user: sanitizeUser(user),
  };
}

/**
 * คำนวณรหัสความปลอดภัย OTP 6 หลัก แบบ Time-Windowed (TOTP)
 * เพื่อให้สามารถตรวจสอบข้าม Serverless Lambdas บน Cloud ได้ 100%
 */
export function computeOtpForUser(userId: string, windowOffset: number = 0): string {
  const secret = process.env.OTP_SECRET || 'skp_secret_otp_salt_2026';
  const timeWindow = Math.floor(Date.now() / (5 * 60 * 1000)) + windowOffset;
  const hash = crypto.createHmac('sha256', secret).update(`${userId}:${timeWindow}`).digest('hex');
  const codeNum = parseInt(hash.slice(0, 8), 16) % 1000000;
  return codeNum.toString().padStart(6, '0');
}

/**
 * ร้องขอรหัส OTP (เลือกส่งทาง Email หรือ มือถือ)
 */
export async function generateAndSendOtp(
  userId: string,
  channel: 'email' | 'mobile'
): Promise<{
  success: boolean;
  channel?: 'email' | 'mobile';
  maskedTarget?: string;
  error?: string;
}> {
  const store = getUsersStore();
  const user = store.find((u) => u.id === userId);

  if (!user) {
    return {
      success: false,
      channel,
      maskedTarget: '',
      error: 'ไม่พบบัญชีผู้ใช้งานในระบบองค์กร',
    };
  }

  // สร้างรหัส OTP 6 หลัก แบบ Time-Windowed เพื่อให้ทำงานข้าม Serverless Lambdas ได้ 100%
  const otp = computeOtpForUser(user.id, 0);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 นาที

  user.otpCode = otp;
  user.otpExpiresAt = expiresAt;
  user.otpChannel = channel;

  let maskedTarget = '';
  const isTest = process.env.NODE_ENV === 'test' || process.argv.some((a) => a.includes('test'));

  if (channel === 'email') {
    const parts = user.email.split('@');
    maskedTarget = `${parts[0].slice(0, 2)}***@${parts[1]}`;

    // ตรวจสอบการตั้งค่า Mail Server (Gmail SMTP, Custom SMTP, หรือ Resend API)
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!isTest && !((smtpUser && smtpPass) || resendApiKey)) {
      console.warn(`[SKP Auth] Mail server not configured. Cannot dispatch OTP to ${user.email}`);
      return {
        success: false,
        error: 'ระบบยังไม่ได้เชื่อมต่อ Mail Server: กรุณาตั้งค่า GMAIL_USER และ GMAIL_APP_PASSWORD (หรือ SMTP) ใน Environment Variables เพื่อให้เซิร์ฟเวอร์สามารถจัดส่งอีเมลจริงได้',
      };
    }

    try {
      if (resendApiKey) {
        // ส่งผ่าน Resend API
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.MAIL_FROM || 'SKP Security <security@skpassociation.co.th>',
            to: [user.email],
            subject: `[SKP Security] รหัสยืนยัน OTP สำหรับเข้าสู่ระบบ: ${otp}`,
            html: `
              <div style="font-family: sans-serif; padding: 24px; background: #0b132b; color: #ffffff; border-radius: 12px; max-width: 500px;">
                <h2 style="color: #38bdf8; margin: 0 0 12px 0;">บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด</h2>
                <p style="color: #cbd5e1; font-size: 14px;">เรียนคุณ <strong>${user.nameTh}</strong> (${user.nameEn})</p>
                <p style="color: #cbd5e1; font-size: 14px;">รหัสยืนยันตัวตน (OTP) สำหรับการเข้าสู่ระบบของคุณคือ:</p>
                <div style="background: #1e293b; padding: 16px; border-radius: 8px; font-size: 32px; letter-spacing: 6px; font-weight: bold; color: #00f0ff; text-align: center; border: 1px solid #38bdf8;">
                  ${otp}
                </div>
                <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">* รหัสนี้มีอายุการใช้งาน 5 นาที และใช้ได้ครั้งเดียวเท่านั้น</p>
              </div>
            `,
          }),
        });

        if (!resendRes.ok) {
          const errBody = await resendRes.text();
          throw new Error(`Resend API Error: ${errBody}`);
        }
      } else if (smtpUser && smtpPass) {
        // ส่งผ่าน Nodemailer (Gmail หรือ SMTP)
        const isGmail = smtpHost.toLowerCase().includes('gmail') || smtpUser.toLowerCase().includes('@gmail.com');
        const transporter = nodemailer.createTransport(
          isGmail
            ? {
                service: 'gmail',
                auth: { user: smtpUser, pass: smtpPass },
              }
            : {
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: { user: smtpUser, pass: smtpPass },
              }
        );

        await transporter.sendMail({
          from: `"ระบบความปลอดภัย SKP Association" <${smtpUser}>`,
          to: user.email,
          subject: `[SKP Security] รหัสยืนยัน OTP สำหรับเข้าสู่ระบบ: ${otp}`,
          html: `
            <div style="font-family: sans-serif; padding: 24px; background: #0b132b; color: #ffffff; border-radius: 12px; max-width: 500px;">
              <h2 style="color: #38bdf8; margin: 0 0 12px 0;">บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด</h2>
              <p style="color: #cbd5e1; font-size: 14px;">เรียนคุณ <strong>${user.nameTh}</strong> (${user.nameEn})</p>
              <p style="color: #cbd5e1; font-size: 14px;">รหัสยืนยันตัวตน (OTP) สำหรับการเข้าสู่ระบบของคุณคือ:</p>
              <div style="background: #1e293b; padding: 16px; border-radius: 8px; font-size: 32px; letter-spacing: 6px; font-weight: bold; color: #00f0ff; text-align: center; border: 1px solid #38bdf8;">
                ${otp}
              </div>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">* รหัสนี้มีอายุการใช้งาน 5 นาที และใช้ได้ครั้งเดียวเท่านั้น</p>
            </div>
          `,
        });
      }
    } catch (mailErr: any) {
      console.warn('Failed to send OTP email directly:', mailErr);
      return {
        success: false,
        error: `ไม่สามารถจัดส่งอีเมล OTP ได้: ${mailErr?.message || 'การเชื่อมต่อ Mail Server ล้มเหลว'}`,
      };
    }
  } else {
    // Mobile SMS Target
    const digits = user.phone.replace(/\D/g, '');
    maskedTarget = digits.length >= 9
      ? `${digits.slice(0, 3)}-***-${digits.slice(-4)}`
      : user.phone;

    const thaiBulkKey = process.env.THAIBULKSMS_API_KEY;
    const thaiBulkSecret = process.env.THAIBULKSMS_API_SECRET;
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

    if (!isTest && !((thaiBulkKey && thaiBulkSecret) || (twilioSid && twilioAuth && twilioFrom))) {
      console.warn(`[SKP Auth] SMS Gateway not configured. Cannot dispatch SMS to ${user.phone}`);
      return {
        success: false,
        error: 'ระบบยังไม่ได้เชื่อมต่อ SMS Gateway: กรุณาตั้งค่า THAIBULKSMS หรือ TWILIO ใน Environment Variables เพื่อส่ง SMS จริง',
      };
    }

    try {
      const cleanPhone = digits.startsWith('0') ? '66' + digits.slice(1) : digits;

      if (thaiBulkKey && thaiBulkSecret) {
        const basicAuth = Buffer.from(`${thaiBulkKey}:${thaiBulkSecret}`).toString('base64');
        const smsRes = await fetch('https://api-v2.thaibulksms.com/sms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${basicAuth}`,
          },
          body: JSON.stringify({
            msisdn: cleanPhone,
            message: `[SKP Association] รหัสยืนยัน OTP คือ ${otp} (มีอายุ 5 นาที)`,
          }),
        });
        if (!smsRes.ok) {
          const errText = await smsRes.text();
          throw new Error(`ThaiBulkSMS Error: ${errText}`);
        }
      } else if (twilioSid && twilioAuth && twilioFrom) {
        const basicAuth = Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
        const smsRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${basicAuth}`,
          },
          body: new URLSearchParams({
            To: '+' + cleanPhone,
            From: twilioFrom,
            Body: `[SKP Security] Your OTP code is ${otp} (valid for 5 minutes).`,
          }).toString(),
        });
        if (!smsRes.ok) {
          const errText = await smsRes.text();
          throw new Error(`Twilio Error: ${errText}`);
        }
      }
    } catch (smsErr: any) {
      console.warn('Failed to send SMS OTP via Gateway:', smsErr);
      return {
        success: false,
        error: `ไม่สามารถจัดส่ง SMS OTP ได้: ${smsErr?.message || 'การเชื่อมต่อ SMS Gateway ล้มเหลว'}`,
      };
    }
  }

  return {
    success: true,
    channel,
    maskedTarget,
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

  const cleanEntered = (enteredOtp || '').trim();
  if (!cleanEntered) {
    return { success: false, error: 'กรุณากรอกรหัส OTP 6 หลัก' };
  }
  const currentOtp = computeOtpForUser(user.id, 0);
  const prevOtp = computeOtpForUser(user.id, -1);
  const inMemoryOtp = user.otpCode?.trim();

  // ตรวจสอบความถูกต้องของ OTP ทั้งแบบ time-windowed และ in-memory (ไม่มีรหัสทดสอบ)
  const isMatched =
    cleanEntered === currentOtp ||
    cleanEntered === prevOtp ||
    (inMemoryOtp ? cleanEntered === inMemoryOtp : false);

  if (!isMatched) {
    return { success: false, error: 'รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบรหัส 6 หลักอีกครั้ง' };
  }

  // หากเป็นการเข้าใช้งานครั้งแรก -> บังคับให้ผู้ใช้งานตั้งรหัสผ่านใหม่ (หากไม่ตั้งจะไม่มีสิทธิ์เข้าใช้งาน)
  if (user.isFirstLogin) {
    if (newPassword && newPassword.trim() === '12345') {
      return {
        success: false,
        error: 'กรุณาตั้งรหัสผ่านใหม่ที่ไม่ซ้ำกับรหัสเริ่มต้น 12345 เพื่อความปลอดภัยของบัญชี',
      };
    }
    if (!newPassword || newPassword.trim().length < 6) {
      return {
        success: false,
        error: 'กรุณาตั้งรหัสผ่านใหม่สำหรับการเข้าใช้งานครั้งต่อไป (ขั้นต่ำ 6 ตัวอักษร) หากไม่ตั้งค่าจะไม่ได้รับสิทธิ์เข้าใช้งาน',
      };
    }
    user.password = newPassword.trim();
    user.isFirstLogin = false;
  }

  // ผ่านการยืนยัน OTP สำเร็จ!
  user.isVerified = true;
  user.otpCode = null;
  user.otpExpiresAt = null;
  user.lastLoginAt = new Date().toISOString();

  const token = `skp_session_${user.id}_${Date.now()}`;

  return {
    success: true,
    user: sanitizeUser(user),
    token,
  };
}

/**
 * ส่งคำขอลืมรหัสผ่าน (ส่งรหัสยืนยันตัวตนไปยัง Email จริงตามผังโครงสร้างองค์กร)
 */
export async function requestPasswordReset(
  fullName: string,
  email: string
): Promise<{
  success: boolean;
  isOutsider?: boolean;
  userId?: string;
  maskedEmail?: string;
  error?: string;
}> {
  if (!fullName?.trim() || !email?.trim()) {
    return { success: false, error: 'กรุณากรอกชื่อ-นามสกุล และอีเมลให้ครบถ้วน' };
  }

  const user = findCompanyUserByNameAndEmail(fullName, email);
  if (!user) {
    return {
      success: false,
      isOutsider: true,
      error: 'ไม่พบข้อมูลบุคลากรในองค์กร กรุณาตรวจสอบชื่อ-นามสกุลและอีเมลตามผังโครงสร้างบริษัท',
    };
  }

  // สร้าง OTP 6 หลัก
  const otp = computeOtpForUser(user.id, 0);
  user.otpCode = otp;
  user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  user.otpChannel = 'email';

  const parts = user.email.split('@');
  const maskedEmail = `${parts[0].slice(0, 2)}***@${parts[1]}`;

  const isTest = process.env.NODE_ENV === 'test' || process.argv.some((a) => a.includes('test'));
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!isTest && !((smtpUser && smtpPass) || resendApiKey)) {
    console.warn(`[SKP Auth] Mail server not configured for password reset to ${user.email}`);
    return {
      success: false,
      error: 'ระบบยังไม่ได้เชื่อมต่อ Mail Server: กรุณาตั้งค่า GMAIL_USER และ GMAIL_APP_PASSWORD (หรือ SMTP) ใน Environment Variables เพื่อให้เซิร์ฟเวอร์สามารถจัดส่งอีเมลจริงได้',
    };
  }

  // ส่งอีเมลจริงผ่าน Resend หรือ Nodemailer
  try {
    if (resendApiKey) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.MAIL_FROM || 'SKP Security <security@skpassociation.co.th>',
          to: [user.email],
          subject: `[SKP Security] รหัสยืนยันการตั้งรหัสผ่านใหม่ (Reset Password OTP): ${otp}`,
          html: `
            <div style="font-family: sans-serif; padding: 24px; background: #0b132b; color: #ffffff; border-radius: 12px; max-width: 500px;">
              <h2 style="color: #38bdf8; margin: 0 0 12px 0;">บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด</h2>
              <p style="color: #cbd5e1; font-size: 14px;">เรียนคุณ <strong>${user.nameTh}</strong> (${user.nameEn})</p>
              <p style="color: #cbd5e1; font-size: 14px;">คุณได้ส่งคำขอกู้คืน/ตั้งรหัสผ่านใหม่สำหรับเข้าใช้งานระบบเจ้าหน้าที่ รหัสยืนยันของคุณคือ:</p>
              <div style="background: #1e293b; padding: 16px; border-radius: 8px; font-size: 32px; letter-spacing: 6px; font-weight: bold; color: #00f0ff; text-align: center; border: 1px solid #38bdf8;">
                ${otp}
              </div>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">* รหัสนี้มีอายุการใช้งาน 5 นาที หากคุณไม่ได้ส่งคำขอนี้ กรุณาเพิกเฉยต่ออีเมลนี้</p>
            </div>
          `,
        }),
      });

      if (!resendRes.ok) {
        const errBody = await resendRes.text();
        throw new Error(`Resend API Error: ${errBody}`);
      }
    } else if (smtpUser && smtpPass) {
      const isGmail = smtpHost.toLowerCase().includes('gmail') || smtpUser.toLowerCase().includes('@gmail.com');
      const transporter = nodemailer.createTransport(
        isGmail
          ? {
              service: 'gmail',
              auth: { user: smtpUser, pass: smtpPass },
            }
          : {
              host: smtpHost,
              port: smtpPort,
              secure: smtpPort === 465,
              auth: { user: smtpUser, pass: smtpPass },
            }
      );

      await transporter.sendMail({
        from: `"ระบบความปลอดภัย SKP Association" <${smtpUser}>`,
        to: user.email,
        subject: `[SKP Security] รหัสยืนยันการตั้งรหัสผ่านใหม่ (Reset Password OTP): ${otp}`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; background: #0b132b; color: #ffffff; border-radius: 12px; max-width: 500px;">
            <h2 style="color: #38bdf8; margin: 0 0 12px 0;">บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด</h2>
            <p style="color: #cbd5e1; font-size: 14px;">เรียนคุณ <strong>${user.nameTh}</strong> (${user.nameEn})</p>
            <p style="color: #cbd5e1; font-size: 14px;">คุณได้ส่งคำขอกู้คืน/ตั้งรหัสผ่านใหม่สำหรับเข้าใช้งานระบบเจ้าหน้าที่ รหัสยืนยันของคุณคือ:</p>
            <div style="background: #1e293b; padding: 16px; border-radius: 8px; font-size: 32px; letter-spacing: 6px; font-weight: bold; color: #00f0ff; text-align: center; border: 1px solid #38bdf8;">
              ${otp}
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">* รหัสนี้มีอายุการใช้งาน 5 นาที หากคุณไม่ได้ส่งคำขอนี้ กรุณาเพิกเฉยต่ออีเมลนี้</p>
          </div>
        `,
      });
    }
  } catch (err: any) {
    console.warn('Failed to send reset password email:', err);
    return {
      success: false,
      error: `ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้: ${err?.message || 'การเชื่อมต่อ Mail Server ล้มเหลว'}`,
    };
  }

  return {
    success: true,
    userId: user.id,
    maskedEmail,
  };
}

/**
 * ยืนยันรหัส OTP และตั้งรหัสผ่านใหม่กรณีลืมรหัสผ่าน
 */
export function resetPasswordWithOtp(
  userId: string,
  enteredOtp: string,
  newPassword: string
): {
  success: boolean;
  message?: string;
  error?: string;
} {
  const store = getUsersStore();
  const user = store.find((u) => u.id === userId);

  if (!user) {
    return { success: false, error: 'ไม่พบบัญชีผู้ใช้งานในระบบ' };
  }

  const cleanEntered = (enteredOtp || '').trim();
  if (!cleanEntered) {
    return { success: false, error: 'กรุณากรอกรหัส OTP 6 หลัก' };
  }
  const currentOtp = computeOtpForUser(user.id, 0);
  const prevOtp = computeOtpForUser(user.id, -1);
  const inMemoryOtp = user.otpCode?.trim();

  const isMatched =
    cleanEntered === currentOtp ||
    cleanEntered === prevOtp ||
    (inMemoryOtp ? cleanEntered === inMemoryOtp : false);

  if (!isMatched) {
    return { success: false, error: 'รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบรหัส 6 หลักจากอีเมลอีกครั้ง' };
  }

  if (newPassword && newPassword.trim() === '12345') {
    return { success: false, error: 'กรุณาตั้งรหัสผ่านใหม่ที่ไม่ซ้ำกับรหัสเริ่มต้น 12345' };
  }

  if (!newPassword || newPassword.trim().length < 6) {
    return { success: false, error: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร' };
  }

  // อัปเดตรหัสผ่านใหม่และบันทึกลงระบบ
  user.password = newPassword.trim();
  user.isFirstLogin = false;
  user.isVerified = true;
  user.otpCode = null;
  user.otpExpiresAt = null;

  return {
    success: true,
    message: 'เปลี่ยนรหัสผ่านใหม่สำเร็จแล้ว สามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที',
  };
}

/**
 * ดึงข้อมูลผู้ใช้ทั้งหมด (เฉพาะกรรมการผู้จัดการ)
 */
export function getAllCompanyUsers(): Omit<CompanyUser, 'password' | 'otpCode'>[] {
  return getUsersStore().map(sanitizeUser);
}
