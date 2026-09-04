import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Project Structure & Configuration Integrity', async (t) => {
  await t.test('package.json exists and is valid JSON', () => {
    const pkgPath = path.resolve('package.json');
    assert.ok(fs.existsSync(pkgPath), 'package.json must exist');
    const content = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    assert.equal(content.name, 'skp-association-web');
    assert.ok(content.dependencies.next, 'next dependency is defined');
    assert.ok(content.dependencies.react, 'react dependency is defined');
  });

  await t.test('Critical source directories and files exist', () => {
    const criticalPaths = [
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'src/app/globals.css',
      'src/app/api/quotation/route.ts',
      'src/components/Navbar.tsx',
      'src/components/HeroSection.tsx',
      'src/components/ServicesSection.tsx',
      'src/components/TrackRecordBar.tsx',
      'src/components/SchematicExplorer.tsx',
      'src/components/ProjectShowcase.tsx',
      'src/components/CredentialsSection.tsx',
      'src/components/ContactSection.tsx',
      'src/components/Footer.tsx',
      'src/components/LanguageSwitcher.tsx',
      'src/components/QuotationDocumentPreviewModal.tsx',
      'src/context/LanguageContext.tsx',
      'src/translations/index.ts',
      'public/robots.txt',
      'public/sitemap.xml'
    ];

    for (const relPath of criticalPaths) {
      const fullPath = path.resolve(relPath);
      assert.ok(fs.existsSync(fullPath), `Critical file missing: ${relPath}`);
    }
  });

  await t.test('SEO files have valid SKP Association metadata', () => {
    const robots = fs.readFileSync(path.resolve('public/robots.txt'), 'utf8');
    assert.ok(robots.includes('User-agent: *'), 'robots.txt specifies User-agent');
    assert.ok(robots.includes('sitemap.xml'), 'robots.txt references sitemap.xml');

    const sitemap = fs.readFileSync(path.resolve('public/sitemap.xml'), 'utf8');
    assert.ok(sitemap.includes('skpassociation.co.th'), 'sitemap references canonical domain');
  });
});
