import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { translations } from '../src/translations/index.ts';

// Helper matching logic in /api/quotation/route.ts
function formatBytes(bytes, decimals = 1) {
  if (!+bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function generateDocRefNumber(timestamp = Date.now()) {
  return `RFQ-${timestamp.toString().slice(-6)}`;
}

test('Quotation System Logic & Route Verification', async (t) => {
  await t.test('formatBytes utility formats data sizes accurately', () => {
    assert.equal(formatBytes(0), '0 B');
    assert.equal(formatBytes(500), '500 B');
    assert.equal(formatBytes(1024), '1 KB');
    assert.equal(formatBytes(1536), '1.5 KB');
    assert.equal(formatBytes(1048576), '1 MB');
    assert.equal(formatBytes(10485760), '10 MB');
    assert.equal(formatBytes(1073741824), '1 GB');
  });

  await t.test('Email validation catches valid and invalid addresses', () => {
    assert.equal(validateEmail('test@example.com'), true);
    assert.equal(validateEmail('supot.meskp@gmail.com'), true);
    assert.equal(validateEmail('client.engineering@skpassociation.co.th'), true);
    
    assert.equal(validateEmail(''), false);
    assert.equal(validateEmail('plainaddress'), false);
    assert.equal(validateEmail('@missingusername.com'), false);
    assert.equal(validateEmail('username@.com'), false);
    assert.equal(validateEmail(null), false);
  });

  await t.test('RFQ Reference number generator produces valid pattern', () => {
    const ref = generateDocRefNumber();
    assert.match(ref, /^RFQ-\d{6}$/, 'Reference number must follow RFQ-XXXXXX pattern');
  });

  await t.test('API route file contains proper destination and error handling', () => {
    const routeContent = fs.readFileSync(path.resolve('src/app/api/quotation/route.ts'), 'utf8');
    
    // Check target email
    assert.ok(routeContent.includes('supot.meskp@gmail.com'), 'Destination email supot.meskp@gmail.com must be defined in API route');
    
    // Check fallback relay
    assert.ok(routeContent.includes('https://formsubmit.co/ajax/'), 'Formsubmit relay fallback must be defined in API route');

    // Check service type mapping keys
    const expectedKeys = ['electrical', 'mep', 'hvac', 'fire', 'construction', 'other'];
    for (const key of expectedKeys) {
      assert.ok(routeContent.includes(key), `Service type key ${key} must be handled in API route`);
    }

    // Check runtime is nodejs
    assert.ok(routeContent.includes("export const runtime = 'nodejs'"), 'API runtime must explicitly be nodejs for Nodemailer and Buffers');
  });

  await t.test('Translation service options align with API route capabilities', () => {
    assert.ok(translations.th.contact.serviceOpt1, 'Service opt 1 defined');
    assert.ok(translations.th.contact.serviceOpt2, 'Service opt 2 defined');
    assert.ok(translations.th.contact.serviceOpt3, 'Service opt 3 defined');
    assert.ok(translations.th.contact.serviceOpt4, 'Service opt 4 defined');
    assert.ok(translations.th.contact.serviceOpt5, 'Service opt 5 defined');
    assert.ok(translations.th.contact.serviceOpt6, 'Service opt 6 defined');
  });
});
