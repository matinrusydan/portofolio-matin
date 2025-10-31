import { IntroSection } from "@/components/IntroSection";
import { AboutSection } from "@/components/about-section";
import SkillsNetwork from "@/components/SkillsNetwork";
import { CertificatesShowcase } from "@/components/certificates/certificates-showcase"
import { ProjectShowcaseScroll } from "@/components/ui/project-showcase-scroll"
import { ContactForm } from "@/components/contact/contact-form"
import { Suspense } from "react";
import { getBaseUrl } from "@/lib/api";

const profileData = {
  name: 'Matin Rusydan',
  photo: 'foto-matin.png',
  title: 'Aspiring Software Engineer | Technology Enthusiast',
  about: 'A passionate developer exploring software engineering, web development, and data science to build impactful solutions.',
};

async function getProjects() {
  try {
    console.log('🔍 getProjects called, NODE_ENV:', process.env.NODE_ENV, 'NEXT_PHASE:', process.env.NEXT_PHASE);

    // During build time, skip fetch to avoid connection errors
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('⏭️ Skipping projects fetch during build');
      return [];
    }

    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/projects?featured=true&limit=3`;
    console.log('🌐 Fetching projects from:', url);

    const response = await fetch(url);
    console.log('📡 Response status:', response.status, 'ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Projects fetch failed:', response.status, errorText);
      return [];
    }

    const data = await response.json();
    console.log('✅ Projects fetched:', data.projects?.length || 0, 'projects');
    console.log('📦 Response data keys:', Object.keys(data));

    return data.projects?.slice(0, 3) || [];
  } catch (error) {
    console.error('❌ Projects JSON parse or network error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');
    return [];
  }
}

async function getCertificates() {
  try {
    // During build time, skip fetch to avoid connection errors
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('⏭️ Skipping certificates fetch during build');
      return [];
    }
    const response = await fetch(`${getBaseUrl()}/api/certificates?featured=true`);
    if (!response.ok) {
      console.error('❌ Certificates fetch failed:', response.status, await response.text());
      return [];
    }
    const data = await response.json();
    console.log('✅ Certificates fetched:', data.certificates?.length || 0);
    return data.certificates || [];
  } catch (error) {
    console.error('❌ Certificates JSON parse or network error:', error);
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
