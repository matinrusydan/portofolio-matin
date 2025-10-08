// components/about-section.tsx

import Image from 'next/image';
import { Button } from '@/components/ui/button'; // Menggunakan komponen Button yang sudah ada

// Definisikan tipe data untuk props agar lebih aman dan jelas
interface Profile {
  name?: string;
  photo?: string;
  title?: string;
  about?: string;
}

// Sub-komponen untuk gambar, agar kode lebih rapi
const HeroImage = ({ profile }: { profile: Profile }) => {
  const imageUrl = profile?.photo ? `/${profile.photo}` : '/foto-matin.png';
  const altText = profile?.name || 'Matin Rusydan';

  return (
    <div 
      className="
        flex-none 
        animate-in fade-in slide-in-from-left-12 duration-700
      "
    >
      <Image
        src={imageUrl}
        alt={altText}
        width={320}
        height={400}
        priority
        className="
          object-cover rounded-[20px] 
          shadow-[0_20px_60px_rgba(188,7,212,0.3)]
          w-[240px] h-[300px] md:w-[320px] md:h-[400px]
        "
      />
    </div>
  );
};

// Komponen utama untuk seksi "About"
export function AboutSection({ profile = {} }: { profile?: Profile }) {
  // Nilai default jika data profile tidak tersedia
  const defaultProfile = {
    name: 'Matin Rusydan',
    title: 'Data Engineer',
    about: 'Passionate about transforming raw data into meaningful insights. With years of experience in data engineering, I specialize in building robust data pipelines, optimizing database performance, and creating scalable solutions that drive business growth.'
  };

  return (
    <section 
      className="
        flex items-center justify-center min-h-screen px-6 py-20 md:px-8
      "
    >
      <div 
        className="
          container mx-auto flex flex-col md:flex-row 
          items-center justify-center gap-10 lg:gap-20
        "
      >
        {/* Kolom Gambar (kiri di desktop) */}
        <HeroImage profile={profile} />

        {/* Kolom Teks (kanan di desktop) */}
        <div className="flex-1 text-center md:text-left max-w-2xl">
          <h1 className="font-manrope text-4xl md:text-5xl font-bold tracking-tight text-primary">
            About {profile?.name || defaultProfile.name}
          </h1>
          <h2 className="mt-2 font-poppins text-xl md:text-2xl font-semibold text-foreground">
            {profile?.title || defaultProfile.title}
          </h2>
          <p className="mt-4 text-base md:text-lg text-pretty text-muted-foreground">
            {profile?.about || defaultProfile.about}
          </p>
          <Button
            size="lg"
            className="mt-8 rounded-full px-10" // Menggunakan rounded-full untuk efek pil
          >
            About Me
          </Button>
        </div>
      </div>
    </section>
  );
}