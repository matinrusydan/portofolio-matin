'use client';

import { Button } from '@/components/ui/button';
import ProfileCard from './ProfileCard';

// Definisikan tipe data untuk props
interface Profile {
  name?: string;
  photo?: string;
  title?: string;
  about?: string;
}

// Komponen utama untuk seksi "About"
export function AboutSection({ profile = {} }: { profile?: Profile }) {
  // Nilai default jika data profile tidak tersedia
  const defaultProfile = {
    name: 'Matin Rusydan',
    photo: '/foto-matin.png',
    title: 'Aspiring Software Engineer | Technology Enthusiast',
    about: 'A passionate developer exploring software engineering, web development, and data science to build impactful solutions.',
  };

  return (
    <section
      id="about"
      className="min-h-screen py-20 bg-background overflow-visible"
    >
      <div className="container mx-auto px-20">
        <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-16">
          {/* Kolom Teks */}
          <div className="flex-1 text-center md:text-left max-w-2xl">
            <h1 className="font-manrope text-4xl md:text-5xl font-bold tracking-tight text-white">
              About Me
            </h1>
            <p className="mt-4 text-base md:text-lg text-pretty text-gray-400">
              {profile?.about || defaultProfile.about}
            </p>
            <Button
              size="lg"
              className="mt-8 rounded-full px-10 bg-white text-black hover:bg-gray-200"
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact Me
            </Button>
          </div>

          {/* Kolom Gambar */}
          <div className="flex-1 flex justify-center md:justify-end max-w-md">
            <ProfileCard
              name={profile?.name || defaultProfile.name}
              title={profile?.title || defaultProfile.title}
              handle="matinrusydan"
              status="Online"
              contactText="Contact Me"
              avatarUrl={profile?.photo || defaultProfile.photo}
              onContactClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
