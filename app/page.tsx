import { IntroSection } from "@/components/IntroSection";
import { AboutSection } from "@/components/about-section";
import SkillsNetwork from "@/components/SkillsNetwork";
import { CertificatesShowcase } from "@/components/certificates/certificates-showcase"
import { ContactForm } from "@/components/contact/contact-form"
import { ProjectShowcaseScroll } from "@/components/ui/project-showcase-scroll";
import { Suspense } from "react";

const profileData = {
  name: 'Matin Rusydan',
  photo: 'foto-matin.png',
  title: 'Aspiring Software Engineer | Technology Enthusiast',
  about: 'A passionate developer exploring software engineering, web development, and data science to build impactful solutions.',
};

async function getProjects() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/projects?featured=true`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch projects');
    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

async function getCertificates() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/certificates?featured=true`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch certificates');
    const data = await response.json();
    return data.certificates || [];
  } catch (error) {
    console.error('Error fetching certificates:', error);
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
        <ProjectShowcaseScroll projects={projects} />
      </Suspense>
      <Suspense fallback={<div>Loading certificates...</div>}>
        <CertificatesShowcase items={certificates} />
      </Suspense>
      <ContactForm />
    </main>
  );
}
