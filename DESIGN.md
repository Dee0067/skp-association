---
name: SKP Association Co., Ltd. Design System
description: The Blueprint & Power Grid Matrix visual design system for high-precision electrical and building M&E systems engineering
colors:
  primary: "#B01A38"
  primary-hover: "#C72445"
  primary-subtle: "#3A0B16"
  navy: "#1B1F4A"
  navy-deep: "#0B0F28"
  navy-dark: "#060919"
  navy-card: "#111738"
  navy-border: "#232B5E"
  cyan: "#38BDF8"
  cyan-glow: "#0284C7"
  emerald: "#10B981"
  surface: "#F8FAFC"
  slate: "#334155"
  muted: "#64748B"
typography:
  display:
    fontFamily: "Prompt, Inter, sans-serif"
    fontWeight: 800
    lineHeight: 1.25
  heading:
    fontFamily: "Prompt, Inter, sans-serif"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Prompt, Inter, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "JetBrains Mono, Fira Code, monospace"
    fontWeight: 500
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.navy-card}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
---

## Overview
The visual system for **บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด (SKP Association Co., Ltd.)** is founded on **The Blueprint & Power Grid Matrix**. It fuses the technical rigor of electrical CAD schematics and architectural M&E single-line diagrams with high-trust corporate contractor credibility. It avoids generic contractor templates in favor of structured technical drafting lines, verified corporate credentials (Tax ID: 0105554136205), and an interactive M&E systems matrix.

## Colors
- **Engineering Navy (`#1B1F4A`, `#0B0F28`, `#060919`):** Ground and framework tone evoking high-voltage switchgear cabinets, deep architectural drafting paper, and institutional authority.
- **Industrial Crimson Red (`#B01A38`, `#C72445`):** Official corporate identity color derived directly from the SKP Association brand mark. Used for primary CTAs, emergency safety circuit lines, and high-priority focal points.
- **Blueprint Schematic Cyan (`#38BDF8`, `#0284C7`):** Represents live electrical current, energized circuits, active system layers, and technical readouts.
- **Success Emerald (`#10B981`):** Indicates verified status, commissioned equipment, and compliant engineering standards.

## Typography
- **Primary Interface Font:** **Prompt** & **Inter** for high-legibility Thai and English engineering copy. Headings use bold to extra-bold weights with tight negative tracking.
- **Technical & Monospace Font:** **JetBrains Mono / monospace** for corporate tax IDs, revision numbers, engineering specifications, single-line diagram labels, and equipment ratings.

## Layout
- **Container Scale:** Max width 1280px (`max-w-7xl`) with generous horizontal padding (16px mobile, 32px desktop).
- **Drafting Grid Overlay:** 40px and 20px orthogonal cyan grid lines (`rgba(56, 189, 248, 0.05)`) provide mathematical discipline across the surface.
- **Rhythm:** Generous 80px to 112px (`py-20` to `py-28`) vertical spacing between thematic sections.

## Elevation & Depth
- Flat panels layered over dark blueprint ground with subtle border delineation (`#232B5E`).
- Atmospheric radial glows behind hero systems and schematics (`blur-120px` cyan and red accents).
- High-contrast card surfaces (`#111738`) with soft drop shadows (`shadow-2xl shadow-black/50`).

## Shapes
- Crisp 8px to 16px corner radii on cards and buttons.
- **Tech Border Accent:** Inset L-shaped 2px cyan corner brackets (`.tech-border`) evoking engineering drafting corners and precision measuring tools.

## Components
- **Top Credentials Micro-bar:** Persistent verification strip showing corporate Tax ID, headquarters city, and direct hotline.
- **System Schematic Explorer:** Interactive SVG switchboard with real-time animated circuit flow lines and technical parameter cards.
- **Project Cards:** 16:10 aspect ratio image banners with category badge, delivery status, and sector tags.
- **B2B Consultation Form:** Dual-column consultation request module with service sector selector and verified corporate privacy badge.

## Do's and Don'ts
- **Do:** Use solid high-contrast corporate typography for all headlines and labels.
- **Do:** Highlight official credentials (เลขทะเบียน 0105554136205, ก่อตั้ง 2554, สำนักงานใหญ่ ถ.นวลจันทร์) to build maximum trust with project owners.
- **Don't:** Use decorative gradient text or bouncy cartoon easing on industrial engineering elements.
- **Don't:** Fabricate artificial client testimonials or unverified international claims.
