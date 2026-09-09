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
  getAllCompanyUsers,
  computeOtpForUser
} from '../src/lib/usersStore.ts';
import { translations } from '../src/translations/index.ts';

test('Company Users Whitelist & First-time OTP Authentication', async (t) => {
  await t.test('Whitelisted company personnel exist with 6 seeded members and real org chart emails', () => {
    const users = getAllCompanyUsers();
    assert.equal(users.length, 6, 'Should have 6 official company personnel seeded');

    // 1. MD: คุณสุพจน์ มั่นสิทธิกุล
    const md = users.find(u => u.role === 'managing_director');
    assert.ok(md, 'Managing Director must exist');
    assert.equal(md.email, 'supot.meskp@gmail.com', 'MD email must match org chart: supot.meskp@gmail.com');
    assert.equal(md.phone, '093-695 6445');

    // 2. Admin Manager: คุณกัณณปภัสส์ ช.
    const adminMgr = users.find(u => u.role === 'admin_coordinator_manager');
    assert.ok(adminMgr, 'Admin Coordinator Manager must exist');
    assert.equal(adminMgr.email, 'kannapaphat.skp@gmail.com', 'Admin Manager email must match org chart: kannapaphat.skp@gmail.com');
    assert.equal(adminMgr.phone, '090-415 5144');

    // 3. Project Engineer: คุณรังสฤทธิ์ สุหลง
    const rangsarit = users.find(u => u.email === 'rangsarit.meskp@gmail.com');
    assert.ok(rangsarit, 'Rangsarit must exist with org chart email: rangsarit.meskp@gmail.com');
    assert.equal(rangsarit.role, 'project_engineer');
    assert.equal(rangsarit.phone, '064-630 4866');

    // 4. Safety Officer: คุณวิไลวรรณ โกฆะรัตน์
    const wilaiwan = users.find(u => u.email === 'vilaivan2518@gmail.com');
    assert.ok(wilaiwan, 'Wilaiwan must exist with org chart email: vilaivan2518@gmail.com');
    assert.equal(wilaiwan.role, 'safety_officer');
    assert.equal(wilaiwan.phone, '082-208 4541');

    // 5. Site Foreman: คุณประเสริฐ ลากะสงค์
    const prasert = users.find(u => u.email === 'prasertlakasong@gmail.com');
    assert.ok(prasert, 'Prasert must exist with org chart email: prasertlakasong@gmail.com');
    assert.equal(prasert.role, 'site_foreman');
    assert.equal(prasert.phone, '062-624 8171');

    // 6. CAD/BIM Draftman: คุณภาคภูมิ ภู่จ้อย
    const phakphoom = users.find(u => u.email === 'phakphoom.meskp@gmail.com');
    assert.ok(phakphoom, 'Phakphoom must exist with org chart email: phakphoom.meskp@gmail.com');
    assert.equal(phakphoom.role, 'cad_bim_draftman');
    assert.equal(phakphoom.phone, '02-116 4125');
  });

  await t.test('Full Name supports both Thai and English for login lookup with org chart emails', () => {
    // 1. MD Thai and English
    const userTh1 = findCompanyUserByNameAndEmail('คุณสุพจน์ มั่นสิทธิกุล', 'supot.meskp@gmail.com');
    assert.ok(userTh1, 'Must find MD with prefix and org chart name');
    const userTh2 = findCompanyUserByNameAndEmail('สุพจน์ เหมสถล', 'supot.meskp@gmail.com');
    assert.ok(userTh2, 'Must find MD with alias name เหมสถล');
    const userEn = findCompanyUserByNameAndEmail('Mr. Supot Munsittikul', 'supot.meskp@gmail.com');
    assert.ok(userEn, 'Must find MD with English full name');

    // 2. Admin Manager (Kannapaphat) with org chart email kannapaphat.skp@gmail.com
    const adminEn = findCompanyUserByNameAndEmail('Kannapaphat C.', 'kannapaphat.skp@gmail.com');
    assert.ok(adminEn, 'Must find Admin Manager with English name');
    const adminTh = findCompanyUserByNameAndEmail('กัณณปภัสส์ ช.', 'kannapaphat.skp@gmail.com');
    assert.ok(adminTh, 'Must find Admin Manager with Thai name');

    // 3. Project Engineer (Rangsarit) with org chart email rangsarit.meskp@gmail.com
    const engTh = findCompanyUserByNameAndEmail('คุณรังสฤทธิ์ สุหลง', 'rangsarit.meskp@gmail.com');
    assert.ok(engTh, 'Must find Project Engineer with real email rangsarit.meskp@gmail.com');
    const engEn = findCompanyUserByNameAndEmail('Mr. Rangsarit Sulong', 'rangsarit.meskp@gmail.com');
    assert.ok(engEn, 'Must find Project Engineer with English name');

    // 4. Safety Officer (Wilaiwan) with org chart email vilaivan2518@gmail.com
    const safetyTh = findCompanyUserByNameAndEmail('วิไลวรรณ โกฆะรัตน์', 'vilaivan2518@gmail.com');
    assert.ok(safetyTh, 'Must find Safety Officer with real email vilaivan2518@gmail.com');
    const safetyEn = findCompanyUserByNameAndEmail('Mrs. Wilaiwan Kokarat', 'vilaivan2518@gmail.com');
    assert.ok(safetyEn, 'Must find Safety Officer with English name');

    // 5. Site Foreman (Prasert) with org chart email prasertlakasong@gmail.com
    const foremanTh = findCompanyUserByNameAndEmail('ประเสริฐ ลากะสงค์', 'prasertlakasong@gmail.com');
    assert.ok(foremanTh, 'Must find Site Foreman with real email prasertlakasong@gmail.com');

    // 6. CAD/BIM Draftman (Phakphoom) with org chart email phakphoom.meskp@gmail.com
    const cadTh = findCompanyUserByNameAndEmail('ภาคภูมิ ภู่จ้อย', 'phakphoom.meskp@gmail.com');
    assert.ok(cadTh, 'Must find CAD Draftman with real email phakphoom.meskp@gmail.com');
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

    // 2. Request OTP via Email - NO demo OTP exposed
    const otpEmailResult = await generateAndSendOtp(userId, 'email');
    assert.equal(otpEmailResult.success, true);
    assert.equal(otpEmailResult.otpForDemo, undefined, 'Must NEVER return demo OTP in result');

    // 3. Compute the legitimate cryptographic OTP for the user
    const currentOtp = computeOtpForUser(userId, 0);

    // 4. Test code bypass '123456' MUST strictly FAIL
    const testCodeAttempt = verifyOtpAndActivate(userId, '123456', 'Supot@Secret2026');
    assert.equal(testCodeAttempt.success, false, 'Universal test bypass 123456 must be rejected');

    // 5. Verify OTP without new password FAILS (strictly mandatory!)
    const failNoNewPassword = verifyOtpAndActivate(userId, currentOtp);
    assert.equal(failNoNewPassword.success, false);
    assert.ok(failNoNewPassword.error.includes('กรุณาตั้งรหัสผ่านใหม่'));

    // 6. Verify OTP with new password as '12345' FAILS (cannot keep default password)
    const failKeepDefault = verifyOtpAndActivate(userId, currentOtp, '12345');
    assert.equal(failKeepDefault.success, false);
    assert.ok(failKeepDefault.error.includes('ที่ไม่ซ้ำกับรหัสเริ่มต้น 12345'));

    // 7. Verify OTP with valid new password SUCCEEDS
    const successVerify = verifyOtpAndActivate(userId, currentOtp, 'Supot@Secret2026');
    assert.equal(successVerify.success, true);
    assert.ok(successVerify.token, 'Must return auth token upon activation');

    // 8. Next login with old default 12345 now FAILS
    const tryOldPassword = loginStaff('สุพจน์ เหมสถล', 'supot.meskp@gmail.com', '12345');
    assert.equal(tryOldPassword.success, false);

    // 9. Next login with new password SUCCEEDS and still enforces OTP
    const subsequentLogin = loginStaff('สุพจน์ เหมสถล', 'supot.meskp@gmail.com', 'Supot@Secret2026');
    assert.equal(subsequentLogin.success, true);
    assert.equal(subsequentLogin.requiresOtp, true);
    assert.equal(subsequentLogin.isFirstLogin, false, 'Should no longer be marked as first login');
  });

  await t.test('Forgot Password flow via email OTP works seamlessly with no test code leaks', async () => {
    // 1. Outsider request password reset fails
    const outsiderForgot = await requestPasswordReset('สมชาย คนนอก', 'outsider@gmail.com');
    assert.equal(outsiderForgot.success, false);
    assert.equal(outsiderForgot.isOutsider, true);

    // 2. Official staff request password reset succeeds and sends OTP (no demo code leaked)
    const staffForgot = await requestPasswordReset('คุณกัณณปภัสส์ ช.', 'kannapaphat.skp@gmail.com');
    assert.equal(staffForgot.success, true);
    assert.ok(staffForgot.userId);
    assert.ok(staffForgot.maskedEmail.includes('@gmail.com'));
    assert.equal(staffForgot.otpForDemo, undefined, 'Must NEVER return demo OTP in forgot password result');

    const resetOtp = computeOtpForUser(staffForgot.userId, 0);

    // 3. Test code bypass '123456' MUST strictly FAIL
    const failBypass = resetPasswordWithOtp(staffForgot.userId, '123456', 'Kannapaphat#New2026');
    assert.equal(failBypass.success, false, 'Universal test bypass 123456 must be rejected in reset flow');

    // 4. Reset with wrong OTP fails
    const failResetOtp = resetPasswordWithOtp(staffForgot.userId, '000000', 'newPasswordKannapaphat2026');
    assert.equal(failResetOtp.success, false);
    assert.ok(failResetOtp.error.includes('รหัส OTP ไม่ถูกต้อง'));

    // 5. Reset with valid OTP succeeds
    const successReset = resetPasswordWithOtp(staffForgot.userId, resetOtp, 'Kannapaphat#New2026');
    assert.equal(successReset.success, true);

    // 6. Login with newly reset password succeeds
    const loginAfterReset = loginStaff('กัณณปภัสส์ ช.', 'kannapaphat.skp@gmail.com', 'Kannapaphat#New2026');
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
