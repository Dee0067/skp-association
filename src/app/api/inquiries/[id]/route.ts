import { NextRequest, NextResponse } from 'next/server';
import { getInquiryById, updateInquiry, deleteInquiry } from '@/lib/inquiriesStore';
import { RoleType } from '@/types/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parseRole(req: NextRequest): RoleType {
  const roleHeader = req.headers.get('x-user-role') as RoleType;
  const roleQuery = req.nextUrl.searchParams.get('role') as RoleType;
  const candidate = roleHeader || roleQuery;

  if (
    candidate === 'managing_director' ||
    candidate === 'admin_coordinator_manager' ||
    candidate === 'project_engineer'
  ) {
    return candidate;
  }
  return 'managing_director';
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const role = parseRole(request);
    const inquiry = getInquiryById(params.id, role);
    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบข้อมูลลูกค้ารายการนี้' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: inquiry });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 403 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const role = parseRole(request);
    const body = await request.json();
    const updated = updateInquiry(params.id, body, role);
    return NextResponse.json({
      success: true,
      message: 'อัปเดตข้อมูลลูกค้าสำเร็จ',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const role = parseRole(request);
    
    // ตรวจสอบสิทธิ์: เฉพาะกรรมการผู้จัดการ (managing_director) เท่านั้นที่มีสิทธิ์ลบ
    if (role !== 'managing_director') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'สิทธิ์ไม่เพียงพอ: เฉพาะกรรมการผู้จัดการเท่านั้นที่มีสิทธิ์ลบรายการลูกค้าออกจากฐานข้อมูล' 
        },
        { status: 403 }
      );
    }

    const success = deleteInquiry(params.id, role);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบรายการที่ต้องการลบ' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ลบรายการลูกค้าออกจากฐานข้อมูลเรียบร้อยแล้ว',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 403 }
    );
  }
}
