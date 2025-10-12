import { IntroSection } from "@/components/IntroSection";
import { AboutSection } from "@/components/about-section";
import SkillsNetwork from "@/components/SkillsNetwork";
import { CertificatesShowcase } from "@/components/certificates/certificates-showcase"
import { certificates } from "@/components/certificates/certificate-data"
import { ContactForm } from "@/components/contact/contact-form"
import { ProjectShowcase } from "@/components/ui/project-showcase"

const profileData = {
  name: 'Matin Rusydan',
  photo: 'foto-matin.png',
  title: 'Aspiring Software Engineer | Technology Enthusiast',
  about: 'A passionate developer exploring software engineering, web development, and data science to build impactful solutions.',
};

const projects = [
  {
    title: "AI Visualizer",
    description: "Interactive tool to visualize embeddings in 3D space.",
    tech: ["React", "Three.js", "GSAP"],
    link: "https://example.com",
  },
  {
    title: "Portfolio Engine",
    description: "Dynamic portfolio system built with Next.js and Tailwind.",
    tech: ["Next.js", "Framer Motion", "TypeScript"],
    link: "https://github.com/example/portfolio-engine",
  },
  {
    title: "Neural Flow",
    description: "Animated data pipeline visualizer for ML models.",
    tech: ["React", "GSAP", "D3.js"],
    link: "https://neuralflow.ai",
  },
];

export default function HomePage() {
  return (
    <main className="relative overflow-visible">
      <IntroSection />
      <AboutSection profile={profileData} />
      <SkillsNetwork />
      <ProjectShowcase projects={projects} />
      <CertificatesShowcase items={certificates} />
      <ContactForm />
    </main>
  );
}
