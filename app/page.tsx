import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { AboutSection } from "@/components/about-section"


const profileData = {
  name: 'Matin Rusydan',
  photo: 'foto-matin.png', // Pastikan path ini sesuai dengan lokasi gambar Anda
  title: 'Aspiring Software Engineer | Technology Enthusiast',
  about: 'A passionate developer exploring software engineering, web development, and data science to build impactful solutions.'
};


export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <AboutSection profile={profileData} />
    </main>
  );
}
