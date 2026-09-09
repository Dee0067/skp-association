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
  await t.test('Whitelisted company personnel exist with 4 seeded members and real org chart emails', () => {
    const users = getAllCompanyUsers();
    assert.equal(users.length, 4, 'Should have 4 official company personnel seeded');

    const md = users.find(u => u.role === 'managing_director');
    assert.ok(md, 'Managing Director must exist');
    assert.equal(md.email, 'supot.meskp@gmail.com', 'MD email must match org chart: supot.meskp@gmail.com');
    assert.equal(md.phone, '093-695 6445');

    const adminMgr = users.find(u => u.role === 'admin_coordinator_manager');
    assert.ok(adminMgr, 'Admin Manager must exist');
    assert.equal(adminMgr.email, 'vilaivan2518@gmail.com', 'Admin Manager email must match org chart: vilaivan2518@gmail.com');
    assert.equal(adminMgr.phone, '082-208 4541');

    const rangsarit = users.find(u => u.email === 'rangsarit.meskp@gmail.com');
    assert.ok(rangsarit, 'Rangsarit must exist with org chart email: rangsarit.meskp@gmail.com');
    assert.equal(rangsarit.phone, '064-630 4866');

    const prasert = users.find(u => u.email === 'prasertlakasong@gmail.com');
    assert.ok(prasert, 'Prasert must exist with org chart email: prasertlakasong@gmail.com');
    assert.equal(prasert.phone, '062-624 8171');
  });

  await t.test('Full Name supports both Thai and English for login lookup with org chart emails', () => {
    // 1. Thai name lookup with/without prefix
    const userTh1 = findCompanyUserByNameAndEmail('คุณสุพจน์ มั่นสิทธิกุล', 'supot.meskp@gmail.com');
    assert.ok(userTh1, 'Must find user with prefix and org chart name');
    const userTh2 = findCompanyUserByNameAndEmail('สุพจน์ เหมสถล', 'supot.meskp@gmail.com');
    assert.ok(userTh2, 'Must find user with alias name');

    // 2. English name lookup
    const userEn = findCompanyUserByNameAndEmail('Mr. Supot Munsittikul', 'supot.meskp@gmail.com');
    assert.ok(userEn, 'Must find user with English full name');

    // 3. Admin Manager with org chart email vilaivan2518@gmail.com
    const adminEn = findCompanyUserByNameAndEmail('Wilaiwan Kokarat', 'vilaivan2518@gmail.com');
    assert.ok(adminEn, 'Must find Admin Manager with real email vilaivan2518@gmail.com');
    const adminTh = findCompanyUserByNameAndEmail('วิไลวรรณ โกฆะรัตน์', 'vilaivan2518@gmail.com');
    assert.ok(adminTh, 'Must find Admin Manager with Thai name');

    // 4. Project Engineer (Rangsarit) with org chart email rangsarit.meskp@gmail.com
    const engTh = findCompanyUserByNameAndEmail('คุณรังสฤทธิ์ สุหลง', 'rangsarit.meskp@gmail.com');
    assert.ok(engTh, 'Must find Project Engineer with real email rangsarit.meskp@gmail.com');

    // 5. Project Engineer / Foreman (Prasert) with org chart email prasertlakasong@gmail.com
    const foremanTh = findCompanyUserByNameAndEmail('ประเสริฐ ลากะสงค์', 'prasertlakasong@gmail.com');
    assert.ok(foremanTh, 'Must find Prasert with real email prasertlakasong@gmail.com');
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
