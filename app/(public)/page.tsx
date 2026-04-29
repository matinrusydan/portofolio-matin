export const dynamic = 'force-dynamic';

import { IntroSection } from "@/components/IntroSection";
import { AboutSection } from "@/components/about-section";
import SkillsNetwork from "@/components/SkillsNetwork";
import { CertificatesShowcase } from "@/components/certificates/certificates-showcase"
import { ProjectShowcaseScroll } from "@/components/ui/project-showcase-scroll"
import { ContactForm } from "@/components/contact/contact-form"
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";

const profileData = {
  name: 'Matin Rusydan',
  photo: 'foto-matin.png',
  title: 'Aspiring Software Engineer | Technology Enthusiast',
  about: 'A passionate developer exploring software engineering, web development, and data science to build impactful solutions.',
};

async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: { isFeatured: true },
      take: 3,
      orderBy: { orderIndex: 'asc' }
    });
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    console.error('❌ Projects fetch error:', error);
    return [];
  }
}

async function getCertificates() {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { isFeatured: true },
      orderBy: { orderIndex: 'asc' }
    });
    return JSON.parse(JSON.stringify(certificates));
  } catch (error) {
    console.error('❌ Certificates fetch error:', error);
    return [];
  }
}

export default async function HomePage() {
  const [projects, certificates] = await Promise.all([
    getProjects(),
    getCertificates()
  ]);

  return (
    <main className="relative overflow-visible">
      <IntroSection />
      <AboutSection profile={profileData} />
      <SkillsNetwork />
      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectShowcaseScroll projects={projects.slice(0, 3)} />
      </Suspense>
      <Suspense fallback={<div>Loading certificates...</div>}>
        <CertificatesShowcase items={certificates} />
      </Suspense>
      <ContactForm />
    </main>
  );
}
