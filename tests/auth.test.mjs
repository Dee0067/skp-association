import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { 
  findCompanyUserByNameAndEmail, 
  loginStaff, 
  generateAndSendOtp, 
  verifyOtpAndActivate,
  getAllCompanyUsers 
} from '../src/lib/usersStore.ts';
import { translations } from '../src/translations/index.ts';

test('Company Users Whitelist & First-time OTP Authentication', async (t) => {
  await t.test('Whitelisted company personnel exist with 4 seeded members', () => {
    const users = getAllCompanyUsers();
    assert.equal(users.length, 4, 'Should have 4 official company personnel seeded');

    const md = users.find(u => u.role === 'managing_director');
    assert.ok(md, 'Managing Director must exist');
    assert.equal(md.email, 'supot.meskp@gmail.com');
    assert.equal(md.nameTh, 'สุพจน์ เหมสถล');
    assert.equal(md.nameEn, 'Supot Hemsathol');

    const adminMgr = users.find(u => u.role === 'admin_coordinator_manager');
    assert.ok(adminMgr, 'Admin Manager must exist');
    assert.equal(adminMgr.nameTh, 'วิไลวรรณ โกฆะรัตน์');
    assert.equal(adminMgr.nameEn, 'Wilaiwan Kokharat');

    const engineers = users.filter(u => u.role === 'project_engineer');
    assert.equal(engineers.length, 2, 'Should have 2 Project Engineers');
  });

  await t.test('Full Name supports both Thai and English for login lookup', () => {
    // 1. Thai name lookup
    const userTh = findCompanyUserByNameAndEmail('สุพจน์ เหมสถล', 'supot.meskp@gmail.com');
    assert.ok(userTh, 'Must find user with Thai full name');
    assert.equal(userTh.nameTh, 'สุพจน์ เหมสถล');

    // 2. English name lookup
    const userEn = findCompanyUserByNameAndEmail('Supot Hemsathol', 'supot.meskp@gmail.com');
    assert.ok(userEn, 'Must find user with English full name');
    assert.equal(userEn.nameEn, 'Supot Hemsathol');

    // 3. Admin Manager in English
    const adminEn = findCompanyUserByNameAndEmail('Wilaiwan Kokharat', 'admin@skpassociation.co.th');
    assert.ok(adminEn, 'Must find Admin Manager with English full name');

    // 4. Project Engineer in Thai
    const engTh = findCompanyUserByNameAndEmail('รังสฤทธิ์ สุหลง', 'engineer.rangsarit@skpassociation.co.th');
    assert.ok(engTh, 'Must find Project Engineer with Thai full name');
  });

  await t.test('Outsiders (non-whitelisted users) are strictly blocked from login', () => {
    const outsiderLogin = loginStaff('สมชาย คนนอก', 'outsider@gmail.com', '123456');
    assert.equal(outsiderLogin.success, false);
    assert.ok(
      outsiderLogin.error.includes('บุคคลภายนอกไม่สามารถเข้าใช้งานได้'),
      'Must reject outsiders with company whitelist notice'
    );

    const wrongEmail = loginStaff('สุพจน์ เหมสถล', 'wrong.email@gmail.com', 'skp@admin2026');
    assert.equal(wrongEmail.success, false);
  });

  await t.test('Password check: Incorrect password returns explicit error', () => {
    const wrongPass = loginStaff('สุพจน์ เหมสถล', 'supot.meskp@gmail.com', 'wrong_pass_123');
    assert.equal(wrongPass.success, false);
    assert.ok(wrongPass.error.includes('รหัสผ่านไม่ถูกต้อง'));
  });

  await t.test('First-time login workflow enforces OTP verification', async () => {
    // 1. Attempt login with correct credentials -> triggers requiresOtp
    const firstLogin = loginStaff('Supot Hemsathol', 'supot.meskp@gmail.com', 'skp@admin2026');
    assert.equal(firstLogin.success, true);
    assert.equal(firstLogin.requiresOtp, true, 'First-time login must require OTP');
    assert.ok(firstLogin.user, 'Must return sanitized user info');

    const userId = firstLogin.user.id;

    // 2. Request OTP via Email
    const otpEmailResult = await generateAndSendOtp(userId, 'email');
    assert.equal(otpEmailResult.success, true);
    assert.equal(otpEmailResult.channel, 'email');
    assert.ok(otpEmailResult.maskedTarget.includes('@gmail.com'));
    assert.equal(otpEmailResult.otpForDemo.length, 6, 'OTP must be 6 digits');

    // 3. Request OTP via Mobile
    const otpMobileResult = await generateAndSendOtp(userId, 'mobile');
    assert.equal(otpMobileResult.success, true);
    assert.equal(otpMobileResult.channel, 'mobile');
    assert.ok(otpMobileResult.maskedTarget.includes('-***-'));
    assert.equal(otpMobileResult.otpForDemo.length, 6);

    const currentOtp = otpMobileResult.otpForDemo;

    // 4. Verify with wrong OTP fails
    const invalidVerify = verifyOtpAndActivate(userId, '000000');
    assert.equal(invalidVerify.success, false);
    assert.ok(invalidVerify.error.includes('รหัส OTP ไม่ถูกต้อง'));

    // 5. Verify with correct OTP succeeds and activates user
    const validVerify = verifyOtpAndActivate(userId, currentOtp, 'new_secure_pwd_2026');
    assert.equal(validVerify.success, true);
    assert.ok(validVerify.token, 'Must return auth token upon successful activation');
    assert.equal(validVerify.user.isFirstLogin, false, 'User must be marked as not first login');
    assert.equal(validVerify.user.isVerified, true, 'User must be marked as verified');

    // 6. Next login with new password no longer requires OTP
    const subsequentLogin = loginStaff('สุพจน์ เหมสถล', 'supot.meskp@gmail.com', 'new_secure_pwd_2026');
    assert.equal(subsequentLogin.success, true);
    assert.equal(subsequentLogin.requiresOtp, false, 'Subsequent login should directly succeed');
    assert.ok(subsequentLogin.token);
  });

  await t.test('Navbar and Translations include Admin Portal', () => {
    // Check translations
    assert.ok(translations.th.nav.admin, 'Thai translations must have nav.admin');
    assert.ok(translations.en.nav.admin, 'English translations must have nav.admin');

    // Check Navbar.tsx contains Admin link
    const navbarPath = path.resolve('src/components/Navbar.tsx');
    const navbarContent = fs.readFileSync(navbarPath, 'utf8');
    assert.ok(navbarContent.includes('href="/admin"'), 'Navbar must link to /admin');
    assert.ok(navbarContent.includes('ShieldCheck'), 'Navbar must include ShieldCheck icon');
  });

  await t.test('Database schemas contain company users table and authentication columns', () => {
    const pgSql = fs.readFileSync(path.resolve('database/schema.sql'), 'utf8');
    assert.ok(pgSql.includes('CREATE TABLE users'), 'Postgres schema must define users table');
    assert.ok(pgSql.includes('is_first_login'), 'Postgres schema must have is_first_login');
    assert.ok(pgSql.includes('otp_code'), 'Postgres schema must have otp_code');
    assert.ok(pgSql.includes('name_th'), 'Postgres schema must have name_th');
    assert.ok(pgSql.includes('name_en'), 'Postgres schema must have name_en');

    const mySql = fs.readFileSync(path.resolve('database/schema.mysql.sql'), 'utf8');
    assert.ok(mySql.includes('CREATE TABLE users'), 'MySQL schema must define users table');
    assert.ok(mySql.includes('is_first_login'), 'MySQL schema must have is_first_login');

    const prisma = fs.readFileSync(path.resolve('prisma/schema.prisma'), 'utf8');
    assert.ok(prisma.includes('model User'), 'Prisma schema must define User model');
    assert.ok(prisma.includes('isFirstLogin'), 'Prisma schema must have isFirstLogin');
  });
});
