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
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      requiresOtp: result.requiresOtp,
      user: result.user,
      token: result.token,
      message: result.requiresOtp
        ? 'เข้าสู่ระบบครั้งแรก กรุณายืนยันตัวตนด้วยรหัส OTP'
        : 'เข้าสู่ระบบสำเร็จ',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์' },
      { status: 500 }
    );
  }
}
