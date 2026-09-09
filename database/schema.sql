-- ==============================================================================
-- SKP ASSOCIATION CO., LTD. (บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด)
-- DATABASE SCHEMA: Customer Inquiries & Role-Based Access Control (RBAC)
-- Engine: PostgreSQL 14+ / Supabase / Neon / MySQL
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. DROP TABLES IF EXISTS (CLEAN SETUP)
DROP TABLE IF EXISTS inquiry_activity_logs CASCADE;
DROP TABLE IF EXISTS customer_inquiries CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 3. ROLES TABLE (ตารางกำหนดบทบาทและสิทธิ์การเข้าถึง)
CREATE TABLE roles (
    id VARCHAR(50) PRIMARY KEY,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (id, name_th, name_en, description) VALUES
('managing_director', 'กรรมการผู้จัดการ', 'Managing Director', 'สิทธิ์สูงสุด (Superadmin): ดูข้อมูลทั้งหมด, แก้ไข, ลบ, จัดการผู้ใช้ และส่งออกรายงาน'),
('admin_coordinator_manager', 'ผู้จัดการฝ่ายธุรการและประสานงาน', 'Admin & Coordination Manager', 'สิทธิ์การจัดการ (Manager): ดูข้อมูลทั้งหมด, บันทึกการติดต่อ, มอบหมายงาน, อัปเดตสถานะ, ส่งออกข้อมูล'),
('project_engineer', 'วิศวกรโครงการ', 'Project Engineer', 'สิทธิ์เทียบเท่าผู้จัดการ: ดูข้อมูลทั้งหมด, จัดการงานวิศวกรรม, บันทึกข้อคิดเห็นทางเทคนิค, อัปเดตสถานะ, ส่งออกข้อมูล');

-- 4. USERS TABLE (ตารางบุคลากรเฉพาะของบริษัท SKP Association เท่านั้น)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_th VARCHAR(150) NOT NULL,
    name_en VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    password_hash VARCHAR(255) NOT NULL DEFAULT 'skp@admin2026',
    is_first_login BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    otp_code VARCHAR(10),
    otp_expires_at TIMESTAMPTZ,
    otp_channel VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_name_th ON users(name_th);
CREATE INDEX idx_users_name_en ON users(name_en);

-- SEED INITIAL COMPANY PERSONNEL (บุคลากรภายในบริษัทตามผังองค์กรจริง คนนอกไม่มีสิทธิ์)
INSERT INTO users (name_th, name_en, email, phone, role_id, is_first_login, is_verified) VALUES
('คุณสุพจน์ มั่นสิทธิกุล', 'Mr. Supot Munsittikul', 'supot.meskp@gmail.com', '093-695-6445', 'managing_director', TRUE, FALSE),
('คุณวิไลวรรณ โกฆะรัตน์', 'Mrs. Wilaiwan Kokarat', 'vilaivan2518@gmail.com', '082-208-4541', 'admin_coordinator_manager', TRUE, FALSE),
('คุณรังสฤทธิ์ สุหลง', 'Mr. Rangsarit Sulong', 'rangsarit.meskp@gmail.com', '064-630-4866', 'project_engineer', TRUE, FALSE),
('คุณประเสริฐ ลากะสงค์', 'Mr. Prasert Lakasong', 'prasertlakasong@gmail.com', '062-624-8171', 'project_engineer', TRUE, FALSE);

-- 5. CUSTOMER INQUIRIES TABLE (ตารางจัดเก็บรายชื่อและข้อมูลลูกค้าที่ติดต่อมา)
CREATE TABLE customer_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doc_ref_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- ข้อมูลส่วนบุคคลของลูกค้า (Customer Personal Information)
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    
    -- รายละเอียดงานวิศวกรรมที่ต้องการปรึกษา (Engineering Consultation Details)
    engineering_scope VARCHAR(100) NOT NULL,
    project_details_and_location TEXT NOT NULL,
    
    -- การบริหารจัดการสถานะและมอบหมายงาน (Operational Management)
    status VARCHAR(50) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'REVIEWING', 'ASSIGNED', 'QUOTED', 'COMPLETED', 'CANCELLED')),
    assigned_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    engineer_notes TEXT,
    attachments_count INTEGER DEFAULT 0,
    
    -- ข้อมูลระบบและวันเวลา (Audit Timestamps)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR FAST QUERY & SEARCH
CREATE INDEX idx_inquiries_created_at ON customer_inquiries(created_at DESC);
CREATE INDEX idx_inquiries_status ON customer_inquiries(status);
CREATE INDEX idx_inquiries_phone ON customer_inquiries(phone_number);
CREATE INDEX idx_inquiries_email ON customer_inquiries(email);
CREATE INDEX idx_inquiries_assigned ON customer_inquiries(assigned_to_user_id);
CREATE INDEX idx_inquiries_scope ON customer_inquiries(engineering_scope);

-- 6. INQUIRY ACTIVITY LOGS TABLE (ประวัติการบันทึก / อัปเดตงาน)
CREATE TABLE inquiry_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID NOT NULL REFERENCES customer_inquiries(id) ON DELETE CASCADE,
    performed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_inquiry ON inquiry_activity_logs(inquiry_id);

-- 7. TRIGGER AUTO UPDATE FOR updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_inquiries_updated_at
BEFORE UPDATE ON customer_inquiries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES (การกำหนดสิทธิ์ระดับฐานข้อมูล)
-- ==============================================================================

ALTER TABLE customer_inquiries ENABLE ROW LEVEL SECURITY;

-- นโยบายที่ 1: บุคคลทั่วไป / ฟอร์มหน้าเว็บ สามารถบันทึกคำขอใหม่ (INSERT) เข้าฐานข้อมูลได้
CREATE POLICY "Public Web Form Can Insert Inquiries"
ON customer_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ฟังก์ชันดึงบทบาท (Role) ของผู้ใช้งานปัจจุบัน
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS VARCHAR AS $$
    SELECT role_id FROM users WHERE email = auth.jwt() ->> 'email' LIMIT 1;
$$ LANGUAGE sql STABLE;

-- นโยบายที่ 2: กรรมการผู้จัดการ (Managing Director) มีสิทธิ์ทุกประการ (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Managing Director Full Access"
ON customer_inquiries
FOR ALL
TO authenticated
USING (
    get_current_user_role() = 'managing_director'
)
WITH CHECK (
    get_current_user_role() = 'managing_director'
);

-- นโยบายที่ 3: ผู้จัดการฝ่ายธุรการและประสานงาน (Admin & Coordination Manager)
-- ดูได้ทั้งหมด (SELECT), แก้ไข/อัปเดต (UPDATE), เพิ่มข้อมูล (INSERT) **ไม่มีสิทธิ์ DELETE**
CREATE POLICY "Admin Manager Operational Access"
ON customer_inquiries
FOR SELECT
TO authenticated
USING (
    get_current_user_role() = 'admin_coordinator_manager'
);

CREATE POLICY "Admin Manager Insert and Update"
ON customer_inquiries
FOR UPDATE
TO authenticated
USING (
    get_current_user_role() = 'admin_coordinator_manager'
)
WITH CHECK (
    get_current_user_role() = 'admin_coordinator_manager'
);

-- นโยบายที่ 4: วิศวกรโครงการ (Project Engineer)
-- "วิศวกรโครงการมีสิทธิ์เหมือนกับ ผู้จัดการทั้งหมด"
-- ดูได้ทั้งหมด (SELECT), แก้ไข/อัปเดตงาน (UPDATE), เพิ่มข้อมูล (INSERT) **ไม่มีสิทธิ์ DELETE**
CREATE POLICY "Project Engineer Operational Access"
ON customer_inquiries
FOR SELECT
TO authenticated
USING (
    get_current_user_role() = 'project_engineer'
);

CREATE POLICY "Project Engineer Insert and Update"
ON customer_inquiries
FOR UPDATE
TO authenticated
USING (
    get_current_user_role() = 'project_engineer'
)
WITH CHECK (
    get_current_user_role() = 'project_engineer'
);

-- ==============================================================================
-- 9. SAMPLE QUERY VIEWS & UTILITIES
-- ==============================================================================

CREATE OR REPLACE VIEW v_customer_inquiries_summary AS
SELECT 
    ci.id,
    ci.doc_ref_number,
    ci.first_name || ' ' || ci.last_name AS customer_full_name,
    ci.company_name,
    ci.phone_number,
    ci.email,
    ci.engineering_scope,
    ci.project_details_and_location,
    ci.status,
    u.full_name AS assigned_engineer_name,
    r.name_th AS assigned_engineer_role,
    ci.created_at,
    ci.updated_at
FROM customer_inquiries ci
LEFT JOIN users u ON ci.assigned_to_user_id = u.id
LEFT JOIN roles r ON u.role_id = r.id;
