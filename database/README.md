# คู่มือการติดตั้งและใช้งานระบบฐานข้อมูลลูกค้า (Customer Inquiries Database & RBAC)
### บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด (SKP Association Co., Ltd.)

เอกสารนี้จัดทำขึ้นตาม **Option C: จัดเตรียมชุดสคริปต์ SQL DDL + Prisma + หน้าจอระบบจัดการ (Admin Portal) ให้พร้อมใช้งานได้ทั้งแบบ Local และเชื่อมต่อ Cloud Database**

---

## 1. ข้อมูลในระบบฐานข้อมูล (Data Schema)

ระบบจัดเก็บข้อมูลลูกค้าและคำขอปรึกษางานวิศวกรรมครบถ้วน 7 รายการหลัก + ข้อมูลเชิงปฏิบัติการ:
1. **ชื่อผู้ติดต่อ (First Name)**: `first_name`
2. **นามสกุล (Last Name)**: `last_name`
3. **ชื่อบริษัท / องค์กร (Company Name)**: `company_name`
4. **เบอร์โทรศัพท์ (Phone Number)**: `phone_number`
5. **อีเมล (Email Address)**: `email`
6. **ขอบข่ายงานวิศวกรรมที่ต้องการปรึกษา (Engineering Scope)**: `engineering_scope`
7. **รายละเอียดโครงการ / สถานที่ตั้งโครงการ (Project Details & Location)**: `project_details_and_location`
8. **ฟิลด์ระบบและการมอบหมายงาน (Operational Management)**:
   - รหัสอ้างอิงเอกสาร (`doc_ref_number` เช่น `RFQ-2026-0891`)
   - สถานะงาน (`status`: `NEW`, `REVIEWING`, `ASSIGNED`, `QUOTED`, `COMPLETED`, `CANCELLED`)
   - ผู้รับผิดชอบ (`assigned_to_name`)
   - บันทึกความเห็นทางเทคนิคของวิศวกร (`engineer_notes`)
   - จำนวนไฟล์แนบ (`attachments_count`)
   - วันเวลาสร้างและแก้ไข (`created_at`, `updated_at`)

---

## 2. ตารางกำหนดสิทธิ์การเข้าถึง (Role-Based Access Control: RBAC Matrix)

**ข้อกำหนดสำคัญ**: วิศวกรโครงการมีสิทธิ์เทียบเท่าผู้จัดการฝ่ายธุรการและประสานงานทั้งหมด

| สิทธิ์การใช้งาน (Capabilities) | 👑 กรรมการผู้จัดการ<br>(Managing Director) | 📋 ผู้จัดการฝ่ายธุรการและประสานงาน<br>(Admin & Coordination Manager) | ⚡ วิศวกรโครงการ<br>(Project Engineer)<br>*(สิทธิ์เท่ากับผู้จัดการ)* | บุคคลภายนอก / พนักงานทั่วไป<br>(Public / Others) |
| :--- | :---: | :---: | :---: | :---: |
| **ดูข้อมูลลูกค้าทั้งหมด** | ✅ ดูได้ทั้งหมด | ✅ ดูได้ทั้งหมด | ✅ **ดูได้ทั้งหมด** | ❌ ไม่มีสิทธิ์ |
| **ดูรายละเอียดโครงการ & ที่ตั้ง** | ✅ เต็มรูปแบบ | ✅ เต็มรูปแบบ | ✅ **เต็มรูปแบบ** | ❌ ไม่มีสิทธิ์ |
| **บันทึกข้อมูลลูกค้าใหม่** | ✅ ทำได้ | ✅ ทำได้ | ✅ **ทำได้** | ❌ ผ่านฟอร์มหน้าเว็บเท่านั้น |
| **แก้ไขข้อมูล & มอบหมายงาน** | ✅ ทำได้ | ✅ ทำได้ | ✅ **ทำได้** | ❌ ไม่มีสิทธิ์ |
| **บันทึกความเห็นทางเทคนิค** | ✅ ทำได้ | ✅ ทำได้ | ✅ **ทำได้** | ❌ ไม่มีสิทธิ์ |
| **อัปเดตสถานะงาน** | ✅ ทำได้ทุกสถานะ | ✅ ทำได้ | ✅ **ทำได้** | ❌ ไม่มีสิทธิ์ |
| **ส่งออกข้อมูล (Excel / CSV)** | ✅ ส่งออกได้ | ✅ ส่งออกได้ | ✅ **ส่งออกได้** | ❌ ไม่มีสิทธิ์ |
| **ลบรายการลูกค้าออกจากระบบ** | ✅ **มีสิทธิ์คนเดียว** | ❌ ลบไม่ได้ (จำกัดสิทธิ์) | ❌ ลบไม่ได้ (จำกัดสิทธิ์) | ❌ ไม่มีสิทธิ์ |
| **จัดการบัญชีผู้ใช้งานและสิทธิ์** | ✅ **มีสิทธิ์คนเดียว** | ❌ ไม่มีสิทธิ์ | ❌ ไม่มีสิทธิ์ | ❌ ไม่มีสิทธิ์ |

---

## 3. วิธีการนำไปใช้งาน (Deployment Options)

### วิธีที่ 1: ใช้งานแบบ Local / Zero-Config (โหมดพร้อมใช้งานทันที)
- ระบบปัจจุบันเปิดใช้งานโหมดนี้บน Production และ Local ให้เรียบร้อยแล้ว
- สามารถเข้าสู่หน้าจอจัดการข้อมูลได้ทันทีที่: **[https://skp-association.vercel.app/admin](https://skp-association.vercel.app/admin)**
- มีข้อมูลเริ่มต้น (Seed Data) และสามารถทดลองสร้าง อัปเดตสถานะ ส่งออก Excel หรือจำลองสิทธิ์การเข้าถึงได้ทันทีโดยไม่ต้องติดตั้งซอฟต์แวร์ฐานข้อมูลเพิ่มเติม

---

### วิธีที่ 2: เชื่อมต่อ Cloud Database (เช่น Supabase หรือ Neon PostgreSQL)

1. **สมัครใช้งาน Supabase (ฟรี)**:
   - เข้าไปที่ [https://supabase.com](https://supabase.com) แล้วสร้างโปรเจกต์ใหม่
2. **รันคำสั่งสร้างตารางและสิทธิ์ RLS**:
   - ไปที่แท็บ **SQL Editor** ใน Supabase
   - เปิดไฟล์ `database/schema.sql` ในโปรเจกต์นี้ คัดลอกโค้ดทั้งหมดไปวางใน SQL Editor แล้วกด **Run**
   - ตาราง `roles`, `users`, `customer_inquiries`, `inquiry_activity_logs` พร้อมทั้งนโยบายความปลอดภัย **Row Level Security (RLS)** จะถูกสร้างขึ้นทันที
3. **กำหนด Environment Variable**:
   - คัดลอก Connection String จาก Supabase (URI)
   - นำไปใส่ในไฟล์ `.env.local` หรือตั้งค่าบน Vercel Dashboard:
     ```env
     DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
     ```

---

### วิธีที่ 3: ใช้งานผ่าน Prisma ORM

โครงสร้างไฟล์ `prisma/schema.prisma` ได้รับการจัดเตรียมไว้เรียบร้อยแล้ว:

1. **ตรวจสอบความถูกต้องของ Schema**:
   ```bash
   npx prisma validate
   ```
2. **สร้าง Migration และส่งเข้า Database**:
   ```bash
   npx prisma db push
   ```
3. **เปิดหน้าจอจัดการข้อมูลกราฟิก (Prisma Studio)**:
   ```bash
   npx prisma studio
   ```
   (ระบบจะเปิดเบราว์เซอร์ที่ `http://localhost:5555` เพื่อดูและแก้ไขตารางฐานข้อมูลได้โดยตรง)

---

## 4. โครงสร้างไฟล์ในโปรเจกต์

```
skp-association/
├── database/
│   ├── README.md               # คู่มือการติดตั้งและใช้งานฐานข้อมูลฉบับนี้
│   ├── schema.sql              # สคริปต์ SQL DDL สำหรับ PostgreSQL / Supabase พร้อม RLS
│   └── schema.mysql.sql        # สคริปต์ SQL DDL สำหรับ MySQL / MariaDB
├── prisma/
│   └── schema.prisma           # Prisma ORM Schema Model
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx        # หน้าจอจัดการรายชื่อลูกค้าและสิทธิ์ RBAC (Admin Portal)
│   │   └── api/
│   │       ├── inquiries/      # REST API สำหรับดึงและเพิ่มข้อมูลลูกค้า
│   │       └── quotation/      # API บันทึกคำขอจากหน้าเว็บและส่งอีเมลแจ้งเตือน
│   ├── lib/
│   │   └── inquiriesStore.ts   # Data Store พร้อมระบบบังคับใช้สิทธิ์ RBAC
│   └── types/
│       └── database.ts         # TypeScript Interfaces & RBAC Permissions Matrix
└── tests/
    └── inquiries.test.mjs      # ชุดทดสอบอัตโนมัติความถูกต้องของฐานข้อมูลและสิทธิ์
```
