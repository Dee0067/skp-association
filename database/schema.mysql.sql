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

-- 3. USERS TABLE (ตารางบุคลากรเฉพาะของบริษัท SKP Association เท่านั้น)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name_th VARCHAR(150) NOT NULL,
    name_en VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    role_id VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL DEFAULT '12345',
    is_first_login BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    otp_code VARCHAR(10),
    otp_expires_at TIMESTAMP NULL,
    otp_channel VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_name_th ON users(name_th);
CREATE INDEX idx_users_name_en ON users(name_en);

INSERT INTO users (id, name_th, name_en, email, phone, role_id, is_first_login, is_verified) VALUES
(UUID(), 'คุณสุพจน์ มั่นสิทธิกุล', 'Mr. Supot Munsittikul', 'supot.meskp@gmail.com', '093-695-6445', 'managing_director', TRUE, FALSE),
(UUID(), 'คุณวิไลวรรณ โกฆะรัตน์', 'Mrs. Wilaiwan Kokarat', 'vilaivan2518@gmail.com', '082-208-4541', 'admin_coordinator_manager', TRUE, FALSE),
(UUID(), 'คุณรังสฤทธิ์ สุหลง', 'Mr. Rangsarit Sulong', 'rangsarit.meskp@gmail.com', '064-630-4866', 'project_engineer', TRUE, FALSE),
(UUID(), 'คุณประเสริฐ ลากะสงค์', 'Mr. Prasert Lakasong', 'prasertlakasong@gmail.com', '062-624-8171', 'project_engineer', TRUE, FALSE);

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
