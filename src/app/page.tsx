import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TrackRecordBar from '@/components/TrackRecordBar';
import ServicesSection from '@/components/ServicesSection';
import SchematicExplorer from '@/components/SchematicExplorer';
import ProjectShowcase from '@/components/ProjectShowcase';
import CredentialsSection from '@/components/CredentialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-skp-navy-deep text-slate-100 selection:bg-skp-red selection:text-white">
      {/* Primary Header & Navigation */}
      <Navbar />

      {/* Hero Section with Isometric M&E Systems Visualizer */}
      <HeroSection />

      {/* Corporate Track Record & Metric Counters */}
      <TrackRecordBar />

      {/* 3 Core Engineering Disciplines */}
      <ServicesSection />

      {/* Interactive System Schematic Explorer */}
      <SchematicExplorer />

      {/* Project References & Portfolio Gallery */}
      <ProjectShowcase />

      {/* Corporate Credentials & Legal Registration */}
      <CredentialsSection />

      {/* B2B Consultation & RFP Inquiry Form */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
