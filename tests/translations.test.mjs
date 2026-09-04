import test from 'node:test';
import assert from 'node:assert/strict';
import { translations } from '../src/translations/index.ts';

test('Translations Dictionary Integrity', async (t) => {
  await t.test('Both Thai and English translation sets exist', () => {
    assert.ok(translations.th, 'Thai (th) translation must exist');
    assert.ok(translations.en, 'English (en) translation must exist');
  });

  await t.test('Thai and English share matching top-level keys', () => {
    const thKeys = Object.keys(translations.th).sort();
    const enKeys = Object.keys(translations.en).sort();
    assert.deepEqual(thKeys, enKeys, 'Top-level translation sections must match');
  });

  await t.test('All defined sections contain non-empty values', () => {
    const sections = [
      'nav',
      'hero',
      'trackRecord',
      'services',
      'schematic',
      'portfolio',
      'credentials',
      'contact',
      'footer'
    ];
    
    for (const section of sections) {
      assert.ok(translations.th[section], `Thai missing section: ${section}`);
      assert.ok(translations.en[section], `English missing section: ${section}`);

      // Verify no empty string values in section
      const checkEmpty = (obj, lang, path = '') => {
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;
          if (typeof value === 'string') {
            assert.ok(value.trim().length > 0, `[${lang}] String at ${section}.${currentPath} is empty`);
          } else if (typeof value === 'object' && value !== null) {
            checkEmpty(value, lang, currentPath);
          }
        }
      };

      checkEmpty(translations.th[section], 'th');
      checkEmpty(translations.en[section], 'en');
    }
  });

  await t.test('Key business facts are present in translations', () => {
    // Check credentials company name and registration
    const creds = JSON.stringify(translations.th.credentials);
    assert.ok(creds.includes('เอสเคพี แอสโซซิเอชั่น'), 'Company Thai name must be present in credentials');
    assert.ok(creds.includes('2554') || creds.includes('2011'), 'Registration year 2554/2011 must be present');

    // Check contact numbers in hero
    const hero = JSON.stringify(translations.th.hero);
    assert.ok(hero.includes('093-695-6445') || hero.includes('0936956445'), 'Mobile 093-695-6445 must be present');
    assert.ok(hero.includes('02-116-4125') || hero.includes('021164125'), 'Office phone 02-116-4125 must be present');

    // Check contact target email
    const contact = JSON.stringify(translations.th.contact);
    assert.ok(contact.includes('supot.meskp@gmail.com'), 'Target email supot.meskp@gmail.com must be present');
  });
});
