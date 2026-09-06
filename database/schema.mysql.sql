-- ==============================================================================
-- SKP ASSOCIATION CO., LTD. (บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด)
-- DATABASE SCHEMA: Customer Inquiries & Role-Based Access Control (RBAC)
-- Engine: MySQL 8.0+ / MariaDB 10.5+
-- ==============================================================================

-- 1. DROP TABLES IF EXISTS
DROP TABLE IF EXISTS inquiry_activity_logs;
DROP TABLE IF EXISTS customer_inquiries;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- 2. ROLES TABLE (ตารางกำหนดบทบาทและสิทธิ์การเข้าถึง)
CREATE TABLE roles (
    id VARCHAR(50) PRIMARY KEY,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO roles (id, name_th, name_en, description) VALUES
('managing_director', 'กรรมการผู้จัดการ', 'Managing Director', 'สิทธิ์สูงสุด (Superadmin): ดูข้อมูลทั้งหมด, แก้ไข, ลบ, จัดการผู้ใช้ และส่งออกรายงาน'),
('admin_coordinator_manager', 'ผู้จัดการฝ่ายธุรการและประสานงาน', 'Admin & Coordination Manager', 'สิทธิ์การจัดการ (Manager): ดูข้อมูลทั้งหมด, บันทึกการติดต่อ, มอบหมายงาน, อัปเดตสถานะ, ส่งออกข้อมูล'),
('project_engineer', 'วิศวกรโครงการ', 'Project Engineer', 'สิทธิ์เทียบเท่าผู้จัดการ: ดูข้อมูลทั้งหมด, จัดการงานวิศวกรรม, บันทึกข้อคิดเห็นทางเทคนิค, อัปเดตสถานะ, ส่งออกข้อมูล');

-- 3. USERS TABLE (ตารางบุคลากรที่มีสิทธิ์เข้าถึง)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    role_id VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_email ON users(email);

INSERT INTO users (id, email, full_name, phone, role_id) VALUES
(UUID(), 'supot.meskp@gmail.com', 'สุพจน์ เหมสถล (กรรมการผู้จัดการ)', '02-116-4125', 'managing_director'),
(UUID(), 'admin@skpassociation.co.th', 'ผู้จัดการฝ่ายธุรการและประสานงาน', '02-116-4125', 'admin_coordinator_manager'),
(UUID(), 'engineer@skpassociation.co.th', 'วิศวกรโครงการ', '02-116-4125', 'project_engineer');

-- 4. CUSTOMER INQUIRIES TABLE (ตารางจัดเก็บรายชื่อและข้อมูลลูกค้าที่ติดต่อมา)
CREATE TABLE customer_inquiries (
    id VARCHAR(36) PRIMARY KEY,
    doc_ref_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- ข้อมูลส่วนบุคคลของลูกค้า
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    
    -- รายละเอียดงานวิศวกรรมที่ต้องการปรึกษา
    engineering_scope VARCHAR(100) NOT NULL,
    project_details_and_location TEXT NOT NULL,
    
    -- การบริหารจัดการสถานะและมอบหมายงาน
    status ENUM('NEW', 'REVIEWING', 'ASSIGNED', 'QUOTED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'NEW',
    assigned_to_user_id VARCHAR(36),
    engineer_notes TEXT,
    attachments_count INT DEFAULT 0,
    
    -- ข้อมูลระบบและวันเวลา
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_inquiries_created_at ON customer_inquiries(created_at DESC);
CREATE INDEX idx_inquiries_status ON customer_inquiries(status);
CREATE INDEX idx_inquiries_phone ON customer_inquiries(phone_number);
CREATE INDEX idx_inquiries_email ON customer_inquiries(email);
CREATE INDEX idx_inquiries_scope ON customer_inquiries(engineering_scope);

-- 5. INQUIRY ACTIVITY LOGS TABLE (ประวัติการบันทึก / อัปเดตงาน)
CREATE TABLE inquiry_activity_logs (
    id VARCHAR(36) PRIMARY KEY,
    inquiry_id VARCHAR(36) NOT NULL,
    performed_by_user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inquiry_id) REFERENCES customer_inquiries(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
