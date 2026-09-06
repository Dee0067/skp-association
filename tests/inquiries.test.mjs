import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getRolePermissions, ROLES, INQUIRY_STATUS_CONFIG } from '../src/types/database.ts';

test('Customer Inquiries Database & RBAC Verification', async (t) => {
  await t.test('Role definitions exist for all 3 required organizational positions', () => {
    assert.ok(ROLES.managing_director, 'Role managing_director must exist');
    assert.ok(ROLES.admin_coordinator_manager, 'Role admin_coordinator_manager must exist');
    assert.ok(ROLES.project_engineer, 'Role project_engineer must exist');

    assert.equal(ROLES.managing_director.nameTh, 'กรรมการผู้จัดการ');
    assert.equal(ROLES.admin_coordinator_manager.nameTh, 'ผู้จัดการฝ่ายธุรการและประสานงาน');
    assert.equal(ROLES.project_engineer.nameTh, 'วิศวกรโครงการ');
  });

  await t.test('RBAC Matrix: Project Engineer has exact same operational rights as Admin Manager', () => {
    const mdPerms = getRolePermissions('managing_director');
    const adminPerms = getRolePermissions('admin_coordinator_manager');
    const engPerms = getRolePermissions('project_engineer');

    // MD has full superadmin access including delete
    assert.equal(mdPerms.canViewAll, true);
    assert.equal(mdPerms.canEdit, true);
    assert.equal(mdPerms.canDelete, true);
    assert.equal(mdPerms.canExport, true);
    assert.equal(mdPerms.canManageUsers, true);

    // Admin Manager can view, edit, export, but NOT delete
    assert.equal(adminPerms.canViewAll, true);
    assert.equal(adminPerms.canEdit, true);
    assert.equal(adminPerms.canExport, true);
    assert.equal(adminPerms.canDelete, false);

    // Project Engineer must have EXACT same permissions as Admin Manager (User's explicit requirement)
    assert.deepEqual(
      engPerms,
      adminPerms,
      'Project Engineer must have the exact same access rights as Admin Manager'
    );
  });

  await t.test('Status configuration covers all workflow stages with Thai and English labels', () => {
    const statuses = ['NEW', 'REVIEWING', 'ASSIGNED', 'QUOTED', 'COMPLETED', 'CANCELLED'];
    for (const status of statuses) {
      assert.ok(INQUIRY_STATUS_CONFIG[status], `Status ${status} must be configured`);
      assert.ok(INQUIRY_STATUS_CONFIG[status].labelTh, `Status ${status} must have labelTh`);
      assert.ok(INQUIRY_STATUS_CONFIG[status].labelEn, `Status ${status} must have labelEn`);
    }
  });

  await t.test('database/schema.sql contains all required fields and RLS security policies', () => {
    const schemaPath = path.resolve('database/schema.sql');
    assert.ok(fs.existsSync(schemaPath), 'database/schema.sql must exist');

    const sql = fs.readFileSync(schemaPath, 'utf8');

    // Required tables
    assert.ok(sql.includes('CREATE TABLE roles'), 'Must define roles table');
    assert.ok(sql.includes('CREATE TABLE users'), 'Must define users table');
    assert.ok(sql.includes('CREATE TABLE customer_inquiries'), 'Must define customer_inquiries table');

    // Required fields specified by user
    assert.ok(sql.includes('first_name'), 'Must include first_name');
    assert.ok(sql.includes('last_name'), 'Must include last_name');
    assert.ok(sql.includes('company_name'), 'Must include company_name');
    assert.ok(sql.includes('phone_number'), 'Must include phone_number');
    assert.ok(sql.includes('email'), 'Must include email');
    assert.ok(sql.includes('engineering_scope'), 'Must include engineering_scope');
    assert.ok(sql.includes('project_details_and_location'), 'Must include project_details_and_location');

    // RLS Policies
    assert.ok(sql.includes('ENABLE ROW LEVEL SECURITY'), 'Must enable RLS');
    assert.ok(sql.includes('Managing Director Full Access'), 'Must have policy for MD');
    assert.ok(sql.includes('Admin Manager Operational Access'), 'Must have policy for Admin Manager');
    assert.ok(sql.includes('Project Engineer Operational Access'), 'Must have policy for Project Engineer');
  });

  await t.test('prisma/schema.prisma defines CustomerInquiry model matching the specification', () => {
    const prismaPath = path.resolve('prisma/schema.prisma');
    assert.ok(fs.existsSync(prismaPath), 'prisma/schema.prisma must exist');

    const schema = fs.readFileSync(prismaPath, 'utf8');
    assert.ok(schema.includes('model CustomerInquiry'), 'Must have CustomerInquiry model');
    assert.ok(schema.includes('firstName'), 'Must have firstName');
    assert.ok(schema.includes('lastName'), 'Must have lastName');
    assert.ok(schema.includes('companyName'), 'Must have companyName');
    assert.ok(schema.includes('phoneNumber'), 'Must have phoneNumber');
    assert.ok(schema.includes('email'), 'Must have email');
    assert.ok(schema.includes('engineeringScope'), 'Must have engineeringScope');
    assert.ok(schema.includes('projectDetailsAndLocation'), 'Must have projectDetailsAndLocation');
  });

  await t.test('Inquiries store contract in src/lib/inquiriesStore.ts defines RBAC enforcement', () => {
    const storePath = path.resolve('src/lib/inquiriesStore.ts');
    assert.ok(fs.existsSync(storePath), 'inquiriesStore.ts must exist');

    const storeContent = fs.readFileSync(storePath, 'utf8');
    assert.ok(storeContent.includes('export function getAllInquiries'), 'Must export getAllInquiries');
    assert.ok(storeContent.includes('export function createInquiry'), 'Must export createInquiry');
    assert.ok(storeContent.includes('export function updateInquiry'), 'Must export updateInquiry');
    assert.ok(storeContent.includes('export function deleteInquiry'), 'Must export deleteInquiry');
    assert.ok(storeContent.includes('managing_director'), 'Must check managing_director for delete');
  });

  await t.test('Admin UI Portal in src/app/admin/page.tsx satisfies structure', () => {
    const adminPagePath = path.resolve('src/app/admin/page.tsx');
    assert.ok(fs.existsSync(adminPagePath), 'src/app/admin/page.tsx must exist');

    const adminContent = fs.readFileSync(adminPagePath, 'utf8');
    assert.ok(adminContent.includes("'use client'"), 'Admin page must be client component');
    assert.ok(adminContent.includes('managing_director'), 'Admin page supports MD role');
    assert.ok(adminContent.includes('admin_coordinator_manager'), 'Admin page supports Admin Manager role');
    assert.ok(adminContent.includes('project_engineer'), 'Admin page supports Project Engineer role');
    assert.ok(adminContent.includes('handleExportCSV'), 'Admin page supports CSV export');
  });
});
