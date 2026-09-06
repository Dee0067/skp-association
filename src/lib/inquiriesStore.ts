import { CustomerInquiry, RoleType, getRolePermissions } from '@/types/database';

// Global in-memory repository to preserve data across HMR in development & serverless lifespan
declare global {
  // eslint-disable-next-line no-var
  var __skpInquiriesStore: CustomerInquiry[] | undefined;
}

const initialSeedInquiries: CustomerInquiry[] = [
  {
    id: 'inq-001',
    docRefNumber: 'RFQ-2026-0891',
    firstName: 'สมบูรณ์',
    lastName: 'ชัยพานิช',
    companyName: 'บริษัท สยาม โลจิสติกส์ ฮับ จำกัด (มหาชน)',
    phoneNumber: '081-456-7890',
    email: 'somboon.c@siamlogistics.co.th',
    engineeringScope: 'ออกแบบและปรึกษาระบบไฟฟ้า / หม้อแปลง / ตู้ MDB',
    projectDetailsAndLocation: 'โครงการก่อสร้างคลังสินค้าควบคุมอุณหภูมิแห่งใหม่ พื้นที่ 12,000 ตร.ม. นิคมอุตสาหกรรมบางพลี จ.สมุทรปราการ ต้องการปรึกษาการขอขยายเขตและติดตั้งหม้อแปลง 2500 kVA พร้อมตู้ Main Distribution Board (MDB)',
    status: 'ASSIGNED',
    assignedToUserId: 'eng-001',
    assignedToName: 'วิศวกรโครงการ (ระบบไฟฟ้า)',
    engineerNotes: 'ตรวจสอบขนาดโหลดรวมเบื้องต้นประมาณ 1,800 kVA อยู่ระหว่างจัดทำ Single Line Diagram และข้อกำหนดทางวิศวกรรมสำหรับนัดหมายสำรวจหน้างานสัปดาห์หน้า',
    attachmentsCount: 3,
    createdAt: '2026-09-02T09:30:00.000Z',
    updatedAt: '2026-09-03T14:15:00.000Z',
  },
  {
    id: 'inq-002',
    docRefNumber: 'RFQ-2026-0892',
    firstName: 'นันทนา',
    lastName: 'เจริญโภคินทร์',
    companyName: 'บริษัท ไทยฟู้ดส์ โพรเซสซิ่ง จำกัด',
    phoneNumber: '089-771-2233',
    email: 'nantana.c@thaifoodsproc.com',
    engineeringScope: 'ระบบปรับอากาศและระบายอากาศ (HVAC Chiller / AHU)',
    projectDetailsAndLocation: 'โรงงานแปรรูปอาหารและคลีนรูม (Cleanroom Class 10,000) พื้นที่ 4,500 ตร.ม. นิคมอุตสาหกรรมนวนคร จ.ปทุมธานี ต้องการปรับปรุงระบบ Water-Cooled Chiller และติดตั้ง AHU ควบคุมความชื้น',
    status: 'QUOTED',
    assignedToUserId: 'eng-002',
    assignedToName: 'วิศวกรโครงการ (ระบบปรับอากาศ HVAC)',
    engineerNotes: 'จัดส่งเอกสารใบเสนอราคาและตาราง BOQ รหัส QU-2026-0412 ให้ลูกค้าเรียบร้อยแล้ว รอประชุมคณะกรรมการจัดซื้อ',
    attachmentsCount: 2,
    createdAt: '2026-09-03T11:20:00.000Z',
    updatedAt: '2026-09-04T16:45:00.000Z',
  },
  {
    id: 'inq-003',
    docRefNumber: 'RFQ-2026-0893',
    firstName: 'วรพจน์',
    lastName: 'สุวรรณรัตน์',
    companyName: 'บริษัท พัฒนาอสังหาริมทรัพย์กรุงเทพ จำกัด',
    phoneNumber: '092-334-8899',
    email: 'worapoj.s@bangkokprop.co.th',
    engineeringScope: 'รับเหมาติดตั้งงานระบบประกอบอาคาร (M&E Turnkey)',
    projectDetailsAndLocation: 'อาคารสำนักงานและโชว์รูม 6 ชั้น ถนนสุขุมวิท 101 กรุงเทพฯ พื้นที่ใช้สอย 8,000 ตร.ม. ต้องการผู้รับเหมา Turnkey ระบบไฟฟ้า ประปา แอร์ และดับเพลิง',
    status: 'REVIEWING',
    assignedToUserId: null,
    assignedToName: null,
    engineerNotes: 'ได้รับแบบสถาปัตย์และแบบโครงสร้างครบถ้วน อยู่ระหว่างการประเมินปริมาณงานเพื่อมอบหมายทีมวิศวกรเข้าตรวจสอบ',
    attachmentsCount: 5,
    createdAt: '2026-09-04T13:40:00.000Z',
    updatedAt: '2026-09-04T15:10:00.000Z',
  },
  {
    id: 'inq-004',
    docRefNumber: 'RFQ-2026-0894',
    firstName: 'เกรียงไกร',
    lastName: 'ศิริโรจน์สกุล',
    companyName: 'โรงงานผลิตชิ้นส่วนยานยนต์ ออโต้พาร์ท เทคโนโลยี',
    phoneNumber: '061-889-4455',
    email: 'kriangkrai.s@autopart-tech.co.th',
    engineeringScope: 'ระบบดับเพลิงและระบบสุขาภิบาล',
    projectDetailsAndLocation: 'ติดตั้งระบบดับเพลิงอัตโนมัติ (Fire Pump, Sprinkler, Clean Agent Suppression) ในอาคารจัดเก็บวัตถุดิบไวไฟ นิคมอุตสาหกรรมอมตะซิตี้ จ.ชลบุรี',
    status: 'NEW',
    assignedToUserId: null,
    assignedToName: null,
    engineerNotes: null,
    attachmentsCount: 1,
    createdAt: '2026-09-05T08:15:00.000Z',
    updatedAt: '2026-09-05T08:15:00.000Z',
  },
];

function getStore(): CustomerInquiry[] {
  if (!global.__skpInquiriesStore) {
    global.__skpInquiriesStore = [...initialSeedInquiries];
  }
  return global.__skpInquiriesStore;
}

/**
 * ดึงรายการลูกค้าทั้งหมด
 * ตรวจสอบสิทธิ์ RBAC: กรรมการผู้จัดการ, ผู้จัดการฝ่ายธุรการ, และวิศวกรโครงการ มีสิทธิ์ดูทั้งหมดได้
 */
export function getAllInquiries(userRole: RoleType): CustomerInquiry[] {
  const permissions = getRolePermissions(userRole);
  if (!permissions.canViewAll) {
    throw new Error('Unauthorized: ไม่มีสิทธิ์เข้าถึงรายการลูกค้า');
  }
  return [...getStore()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * ค้นหาข้อมูลลูกค้าตาม ID
 */
export function getInquiryById(id: string, userRole: RoleType): CustomerInquiry | undefined {
  const permissions = getRolePermissions(userRole);
  if (!permissions.canViewAll) {
    throw new Error('Unauthorized: ไม่มีสิทธิ์เข้าถึงข้อมูลลูกค้ารายนี้');
  }
  return getStore().find((item) => item.id === id);
}

/**
 * บันทึกคำขอใหม่ (จากหน้าเว็บหรือจากระบบภายใน)
 */
export function createInquiry(
  data: Omit<CustomerInquiry, 'id' | 'createdAt' | 'updatedAt'>
): CustomerInquiry {
  const store = getStore();
  const now = new Date().toISOString();
  const newInquiry: CustomerInquiry = {
    ...data,
    id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: now,
    updatedAt: now,
  };
  store.unshift(newInquiry);
  return newInquiry;
}

/**
 * แก้ไข/อัปเดตข้อมูลลูกค้า
 * ตรวจสอบสิทธิ์ RBAC: MD, ผู้จัดการ, และวิศวกรโครงการ มีสิทธิ์แก้ไขข้อมูล
 */
export function updateInquiry(
  id: string,
  updates: Partial<CustomerInquiry>,
  userRole: RoleType
): CustomerInquiry {
  const permissions = getRolePermissions(userRole);
  if (!permissions.canEdit) {
    throw new Error('Unauthorized: ไม่มีสิทธิ์แก้ไขข้อมูลลูกค้ารายการนี้');
  }

  const store = getStore();
  const index = store.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error('Inquiry not found');
  }

  // ป้องกันการแก้ไข ID หรือ CreatedAt
  const { id: _id, createdAt: _created, ...validUpdates } = updates;

  store[index] = {
    ...store[index],
    ...validUpdates,
    updatedAt: new Date().toISOString(),
  };

  return store[index];
}

/**
 * ลบรายการลูกค้า
 * ตรวจสอบสิทธิ์ RBAC: เฉพาะ กรรมการผู้จัดการ (managing_director) เท่านั้นที่มีสิทธิ์ลบ!
 */
export function deleteInquiry(id: string, userRole: RoleType): boolean {
  const permissions = getRolePermissions(userRole);
  if (!permissions.canDelete) {
    throw new Error('Permission Denied: เฉพาะกรรมการผู้จัดการเท่านั้นที่มีสิทธิ์ลบรายการลูกค้า');
  }

  const store = getStore();
  const initialLength = store.length;
  global.__skpInquiriesStore = store.filter((item) => item.id !== id);
  return global.__skpInquiriesStore.length < initialLength;
}
