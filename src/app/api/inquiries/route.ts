import { NextRequest, NextResponse } from 'next/server';
import { getAllInquiries, createInquiry } from '@/lib/inquiriesStore';
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
  // Default to managing_director for internal dashboard requests
  return 'managing_director';
}

export async function GET(request: NextRequest) {
  try {
    const role = parseRole(request);
    const inquiries = getAllInquiries(role);
    return NextResponse.json({
      success: true,
      role,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 403 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      companyName,
      phoneNumber,
      email,
      engineeringScope,
      projectDetailsAndLocation,
      docRefNumber,
      attachmentsCount,
    } = body;

    if (!firstName || !lastName || !phoneNumber || !email) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลสำคัญ (ชื่อ, นามสกุล, เบอร์โทรศัพท์, อีเมล) ให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const newInquiry = createInquiry({
      docRefNumber: docRefNumber || `RFQ-${Date.now().toString().slice(-6)}`,
      firstName,
      lastName,
      companyName: companyName || '-',
      phoneNumber,
      email,
      engineeringScope: engineeringScope || 'ออกแบบและปรึกษาระบบไฟฟ้า / หม้อแปลง / ตู้ MDB',
      projectDetailsAndLocation: projectDetailsAndLocation || 'ไม่ได้ระบุรายละเอียดเพิ่มเติม',
      status: 'NEW',
      assignedToUserId: null,
      assignedToName: null,
      engineerNotes: null,
      attachmentsCount: Number(attachmentsCount) || 0,
    });

    return NextResponse.json({
      success: true,
      message: 'บันทึกข้อมูลลูกค้าเข้าสู่ระบบฐานข้อมูลสำเร็จ',
      data: newInquiry,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
      { status: 500 }
    );
  }
}
