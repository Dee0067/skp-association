import { NextRequest, NextResponse } from 'next/server';
import { requestPasswordReset, resetPasswordWithOtp } from '@/lib/usersStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, fullName, email, userId, code, newPassword } = body;

    // 1. ร้องขอรหัส OTP สำหรับตั้งรหัสผ่านใหม่ทางอีเมล
    if (action === 'request') {
      const result = await requestPasswordReset(fullName, email);
      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: result.error,
            isOutsider: !!result.isOutsider,
          },
          { status: result.isOutsider ? 403 : 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `ส่งรหัสยืนยันตัวตน OTP ไปยังอีเมล (${result.maskedEmail}) เรียบร้อยแล้ว`,
        userId: result.userId,
        maskedEmail: result.maskedEmail,
      });
    }

    // 2. ยืนยันรหัส OTP และบันทึกรหัสผ่านใหม่
    if (action === 'reset') {
      if (!userId || !code || !newPassword) {
        return NextResponse.json(
          { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน (รหัส OTP และรหัสผ่านใหม่)' },
          { status: 400 }
        );
      }

      const result = resetPasswordWithOtp(userId, code, newPassword);
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: result.message || 'ตั้งรหัสผ่านใหม่สำเร็จแล้ว สามารถเข้าสู่ระบบได้ทันที',
      });
    }

    return NextResponse.json(
      { success: false, error: 'ระบุ action ไม่ถูกต้อง (รองรับ request หรือ reset)' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'เกิดข้อผิดพลาดในการกู้คืนรหัสผ่าน' },
      { status: 500 }
    );
  }
}
