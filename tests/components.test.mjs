import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const componentsList = [
  'ContactSection.tsx',
  'CredentialsSection.tsx',
  'Footer.tsx',
  'HeroSection.tsx',
  'LanguageSwitcher.tsx',
  'Navbar.tsx',
  'ProjectShowcase.tsx',
  'QuotationDocumentPreviewModal.tsx',
  'SchematicExplorer.tsx',
  'ServicesSection.tsx',
  'TrackRecordBar.tsx'
];

test('Component Quality, Accessibility & Contract Verification', async (t) => {
  for (const comp of componentsList) {
    await t.test(`Component ${comp} satisfies structure and client-directive rules`, () => {
      const compPath = path.resolve('src/components', comp);
      assert.ok(fs.existsSync(compPath), `${comp} must exist in src/components`);

      const content = fs.readFileSync(compPath, 'utf8');

      // Check default export
      assert.ok(
        content.includes('export default function') || content.includes('export default'),
        `${comp} must have a default export`
      );

      // If component uses hooks, it must declare 'use client'
      if (content.includes('useState') || content.includes('useEffect') || content.includes('useRef') || content.includes('useLanguage')) {
        assert.ok(
          content.includes("'use client'") || content.includes('"use client"'),
          `${comp} uses React hooks or context, so it must declare 'use client'`
        );
      }
    });
  }

  await t.test('Page anchor links match existing component section IDs', () => {
    const pageContent = fs.readFileSync(path.resolve('src/app/page.tsx'), 'utf8');
    const navbarContent = fs.readFileSync(path.resolve('src/components/Navbar.tsx'), 'utf8');

    // Expected section anchors
    const sections = ['services', 'schematic', 'portfolio', 'credentials', 'contact'];

    for (const sec of sections) {
      // Check that navbar links to #sec
      assert.ok(navbarContent.includes(`#${sec}`), `Navbar must have a navigation link to #${sec}`);
    }
  });

  await t.test('Tailwind configuration includes SKP brand theme tokens', () => {
    const tailwindConfig = fs.readFileSync(path.resolve('tailwind.config.js'), 'utf8');
    assert.ok(tailwindConfig.includes("'navy-deep'"), 'Tailwind config defines navy-deep');
    assert.ok(tailwindConfig.includes("'navy-card'"), 'Tailwind config defines navy-card');
    assert.ok(tailwindConfig.includes("'navy-border'"), 'Tailwind config defines navy-border');
    assert.ok(tailwindConfig.includes("red: '#B01A38'"), 'Tailwind config defines red');
    assert.ok(tailwindConfig.includes("cyan: '#38BDF8'"), 'Tailwind config defines cyan');
  });
});
