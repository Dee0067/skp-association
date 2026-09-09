import { NextRequest, NextResponse } from 'next/server';
import { generateAndSendOtp, verifyOtpAndActivate } from '@/lib/usersStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, channel, code, newPassword } = body;

    // 1. Action: ขอรหัส OTP (เลือกทาง email หรือ mobile)
    if (action === 'request') {
      if (!userId || !channel || (channel !== 'email' && channel !== 'mobile')) {
        return NextResponse.json(
          { success: false, error: 'กรุณาระบุ userId และ channel (email หรือ mobile)' },
          { status: 400 }
        );
      }

      const otpResult = await generateAndSendOtp(userId, channel);
      if (!otpResult.success) {
        return NextResponse.json(
          { success: false, error: otpResult.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `สร้างและส่งรหัส OTP ไปยัง ${channel === 'email' ? 'อีเมล' : 'เบอร์มือถือ'} (${otpResult.maskedTarget}) เรียบร้อยแล้ว`,
        channel: otpResult.channel,
        maskedTarget: otpResult.maskedTarget,
      });
    }

    // 2. Action: ยืนยันรหัส OTP
    if (action === 'verify') {
      if (!userId || !code) {
        return NextResponse.json(
          { success: false, error: 'กรุณากรอกรหัส OTP ให้ครบถ้วน' },
          { status: 400 }
        );
      }

      const verifyResult = verifyOtpAndActivate(userId, code, newPassword);
      if (!verifyResult.success) {
        return NextResponse.json(
          { success: false, error: verifyResult.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'ยืนยันรหัส OTP สำเร็จ เปิดใช้งานบัญชีเรียบร้อยแล้ว',
        user: verifyResult.user,
        token: verifyResult.token,
      });
    }

    return NextResponse.json(
      { success: false, error: 'ระบุ action ไม่ถูกต้อง (รองรับ request หรือ verify)' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'เกิดข้อผิดพลาดในการประมวลผล OTP' },
      { status: 500 }
    );
  }
}
