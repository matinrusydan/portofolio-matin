import { IntroSection } from "@/components/IntroSection";
import { AboutSection } from "@/components/about-section";

const profileData = {
  name: 'Matin Rusydan',
  photo: 'foto-matin.png',
  title: 'Aspiring Software Engineer | Technology Enthusiast',
  about: 'A passionate developer exploring software engineering, web development, and data science to build impactful solutions.',
};

export default function HomePage() {
  return (
    <main className="relative overflow-visible">
      <IntroSection />
      <AboutSection profile={profileData} />
    </main>
  );
}
