import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { 
  findCompanyUserByNameAndEmail, 
  loginStaff, 
  generateAndSendOtp, 
  verifyOtpAndActivate,
  requestPasswordReset,
  resetPasswordWithOtp,
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
    assert.ok(userTh2, 'Must find user with alias name เหมสถล');
    const userTh3 = findCompanyUserByNameAndEmail('สุพจน์ เหมสาถล', 'supot.meskp@gmail.com');
    assert.ok(userTh3, 'Must find user with alias name เหมสาถล');

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

  await t.test('Outsiders (non-whitelisted users) are strictly blocked from login and flagged', () => {
    const outsiderLogin = loginStaff('สมชาย คนนอก', 'outsider@gmail.com', '12345');
    assert.equal(outsiderLogin.success, false);
    assert.equal(outsiderLogin.isOutsider, true, 'Must flag outsider login attempt');
    assert.ok(
      outsiderLogin.error.includes('บุคคลภายนอกไม่สามารถเข้าใช้งานได้'),
      'Must reject outsiders with company whitelist notice'
    );

    const wrongEmail = loginStaff('สุพจน์ เหมสถล', 'wrong.email@gmail.com', '12345');
    assert.equal(wrongEmail.success, false);
    assert.equal(wrongEmail.isOutsider, true);
  });

  await t.test('Initial password check: First login uses 12345, incorrect password returns guidance', () => {
    const wrongPass = loginStaff('สุพจน์ เหมสถล', 'supot.meskp@gmail.com', 'wrong_pass_123');
    assert.equal(wrongPass.success, false);
    assert.equal(wrongPass.isOutsider, false);
    assert.ok(wrongPass.error.includes('12345'), 'Must guide user to initial password 12345');

    const correctFirstLogin = loginStaff('สุพจน์ เหมสถล', 'supot.meskp@gmail.com', '12345');
    assert.equal(correctFirstLogin.success, true);
    assert.equal(correctFirstLogin.isFirstLogin, true);
  });

  await t.test('First login mandates setting a new password (no access without new password)', async () => {
    // 1. Initial attempt login with 12345 -> triggers requiresOtp & isFirstLogin
    const firstLogin = loginStaff('Supot Hemsathol', 'supot.meskp@gmail.com', '12345');
    assert.equal(firstLogin.success, true);
    assert.equal(firstLogin.requiresOtp, true);
    assert.equal(firstLogin.isFirstLogin, true);

    const userId = firstLogin.user.id;

    // 2. Request OTP via Email
    const otpEmailResult = await generateAndSendOtp(userId, 'email');
    assert.equal(otpEmailResult.success, true);
    const currentOtp = otpEmailResult.otpForDemo;

    // 3. Verify OTP without new password FAILS (strictly mandatory!)
    const failNoNewPassword = verifyOtpAndActivate(userId, currentOtp);
    assert.equal(failNoNewPassword.success, false);
    assert.ok(failNoNewPassword.error.includes('กรุณาตั้งรหัสผ่านใหม่'));

    // 4. Verify OTP with new password as '12345' FAILS (cannot keep default password)
    const failKeepDefault = verifyOtpAndActivate(userId, currentOtp, '12345');
    assert.equal(failKeepDefault.success, false);
    assert.ok(failKeepDefault.error.includes('ที่ไม่ซ้ำกับรหัสเริ่มต้น 12345'));

    // 5. Verify OTP with valid new password SUCCEEDS
    const successVerify = verifyOtpAndActivate(userId, currentOtp, 'Supot@Secret2026');
    assert.equal(successVerify.success, true);
    assert.ok(successVerify.token, 'Must return auth token upon activation');

    // 6. Next login with old default 12345 now FAILS
    const tryOldPassword = loginStaff('สุพจน์ เหมสถล', 'supot.meskp@gmail.com', '12345');
    assert.equal(tryOldPassword.success, false);

    // 7. Next login with new password SUCCEEDS and still enforces OTP
    const subsequentLogin = loginStaff('สุพจน์ เหมสถล', 'supot.meskp@gmail.com', 'Supot@Secret2026');
    assert.equal(subsequentLogin.success, true);
    assert.equal(subsequentLogin.requiresOtp, true);
    assert.equal(subsequentLogin.isFirstLogin, false, 'Should no longer be marked as first login');
  });

  await t.test('Forgot Password flow via email OTP works seamlessly', async () => {
    // 1. Outsider request password reset fails
    const outsiderForgot = await requestPasswordReset('สมชาย คนนอก', 'outsider@gmail.com');
    assert.equal(outsiderForgot.success, false);
    assert.equal(outsiderForgot.isOutsider, true);

    // 2. Official staff request password reset succeeds and sends OTP
    const staffForgot = await requestPasswordReset('คุณวิไลวรรณ โกฆะรัตน์', 'vilaivan2518@gmail.com');
    assert.equal(staffForgot.success, true);
    assert.ok(staffForgot.userId);
    assert.ok(staffForgot.maskedEmail.includes('@gmail.com'));
    assert.equal(staffForgot.otpForDemo.length, 6);

    const resetOtp = staffForgot.otpForDemo;

    // 3. Reset with wrong OTP fails
    const failResetOtp = resetPasswordWithOtp(staffForgot.userId, '000000', 'newPasswordWilaiwan2026');
    assert.equal(failResetOtp.success, false);
    assert.ok(failResetOtp.error.includes('รหัส OTP ไม่ถูกต้อง'));

    // 4. Reset with valid OTP succeeds
    const successReset = resetPasswordWithOtp(staffForgot.userId, resetOtp, 'Wilaiwan#New2026');
    assert.equal(successReset.success, true);

    // 5. Login with newly reset password succeeds
    const loginAfterReset = loginStaff('วิไลวรรณ โกฆะรัตน์', 'vilaivan2518@gmail.com', 'Wilaiwan#New2026');
    assert.equal(loginAfterReset.success, true);
    assert.equal(loginAfterReset.requiresOtp, true);
  });

  await t.test('Admin UI Portal includes Forgot Password button and modal', () => {
    const adminPath = path.resolve('src/app/admin/page.tsx');
    const adminContent = fs.readFileSync(adminPath, 'utf8');
    assert.equal(adminContent.includes('handleQuickFill'), false, 'Quick fill must be removed');
    assert.ok(adminContent.includes('isForgotPasswordOpen'), 'Admin page must have isForgotPasswordOpen state');
    assert.ok(adminContent.includes('ลืมรหัสผ่าน'), 'Admin page must have forgot password UI');
    assert.ok(adminContent.includes('12345'), 'Admin page must state default password 12345');
  });

  await t.test('Navbar and Translations include Admin Portal', () => {
    assert.ok(translations.th.nav.admin, 'Thai translations must have nav.admin');
    assert.ok(translations.en.nav.admin, 'English translations must have nav.admin');

    const navbarPath = path.resolve('src/components/Navbar.tsx');
    const navbarContent = fs.readFileSync(navbarPath, 'utf8');
    assert.ok(navbarContent.includes('href="/admin"'), 'Navbar must link to /admin');
    assert.ok(navbarContent.includes('ShieldCheck'), 'Navbar must include ShieldCheck icon');
  });

  await t.test('Database schemas contain company users table and default password 12345', () => {
    const pgSql = fs.readFileSync(path.resolve('database/schema.sql'), 'utf8');
    assert.ok(pgSql.includes("DEFAULT '12345'"), 'Postgres schema must default password to 12345');

    const mySql = fs.readFileSync(path.resolve('database/schema.mysql.sql'), 'utf8');
    assert.ok(mySql.includes("DEFAULT '12345'"), 'MySQL schema must default password to 12345');

    const prisma = fs.readFileSync(path.resolve('prisma/schema.prisma'), 'utf8');
    assert.ok(prisma.includes('@default("12345")'), 'Prisma schema must default password to 12345');
  });
});
