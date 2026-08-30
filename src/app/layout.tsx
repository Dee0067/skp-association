import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด | SKP Association Co., Ltd.',
  description: 'ผู้เชี่ยวชาญด้านการออกแบบและให้คำปรึกษาวิศวกรรมระบบไฟฟ้า รับเหมาก่อสร้างและติดตั้งงานระบบประกอบอาคาร (M&E) ครบวงจร จดทะเบียนนิติบุคคล 0105554136205',
  keywords: 'SKP Association, วิศวกรรมระบบไฟฟ้า, M&E Contractor, รับเหมาติดตั้งงานระบบอาคาร, ออกแบบระบบไฟฟ้า, ติดตั้งตู้สวิตช์บอร์ด MDB, หม้อแปลงไฟฟ้า, ก่อสร้างโรงงาน',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="scroll-smooth">
      <body className="bg-skp-navy-deep text-slate-100 antialiased selection:bg-skp-red selection:text-white">
        {/*
          <!--
          THESIS: Authoritative engineering matrix and M&E systems visualizer replacing generic contractor templates with interactive CAD schematics and verified credentials.
          OWN-WORLD: Deep Engineering Navy (#1B1F4A), Industrial Crimson (#B01A38), Schematic Cyan (#38BDF8), and technical blueprint drafting rules.
          STORY: Project owners and engineers discover 15+ years of verified M&E expertise, inspect technical service pillars and past projects, and request direct consultations.
          FIRST VIEWPORT: Prominent SKP badge with registration 0105554136205, high-impact bilingual engineering headline, interactive 3D M&E infrastructure model with illuminated circuit conduits, and RFP CTAs.
          FORM: The Blueprint & Power Grid Matrix (Candidate 1, seed key: 616a1af5).
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
          -->
        */}
        <div dangerouslySetInnerHTML={{
          __html: `<!--
          THESIS: Authoritative engineering matrix and M&E systems visualizer replacing generic contractor templates with interactive CAD schematics and verified credentials.
          OWN-WORLD: Deep Engineering Navy (#1B1F4A), Industrial Crimson (#B01A38), Schematic Cyan (#38BDF8), and technical blueprint drafting rules.
          STORY: Project owners and engineers discover 15+ years of verified M&E expertise, inspect technical service pillars and past projects, and request direct consultations.
          FIRST VIEWPORT: Prominent SKP badge with registration 0105554136205, high-impact bilingual engineering headline, interactive 3D M&E infrastructure model with illuminated circuit conduits, and RFP CTAs.
          FORM: The Blueprint & Power Grid Matrix (Candidate 1, seed key: 616a1af5).
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
          -->`
        }} />
        {children}
      </body>
    </html>
  );
}
