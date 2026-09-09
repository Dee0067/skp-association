import { NextRequest, NextResponse } from 'next/server';
import { loginStaff } from '@/lib/usersStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password } = body;

    const result = loginStaff(fullName, email, password);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          isOutsider: !!result.isOutsider,
        },
        { status: result.isOutsider ? 403 : 401 }
      );
    }

    return NextResponse.json({
      success: true,
      requiresOtp: result.requiresOtp,
      isFirstLogin: result.isFirstLogin,
      user: result.user,
      token: result.token,
      message: result.requiresOtp
        ? 'กรุณายืนยันตัวตนด้วยรหัส OTP ทางอีเมลหรือเบอร์มือถือ'
        : 'เข้าสู่ระบบสำเร็จ',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์' },
      { status: 500 }
    );
  }
}
