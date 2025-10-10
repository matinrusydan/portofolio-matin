// File: CoreLogo.tsx

import React from 'react';

interface CoreLogoProps {
  position: { x: number; y: number };
}

const CoreLogo: React.FC<CoreLogoProps> = ({ position }) => {
  // Ukuran grup pembungkus (wrapper) kita anggap 100x100, jadi offsetnya -50
  const wrapperSize = 100;

  // UBAH DI SINI: Ukuran logo diperbesar dari 50 menjadi 80
  const logoSize = 200;

  // Hitung posisi x dan y agar logo tetap di tengah wrapper
  const logoOffset = (wrapperSize - logoSize) / 2;

  return (
    <g transform={`translate(${position.x - (wrapperSize / 2)}, ${position.y - (wrapperSize / 2)})`}>
      {/* Lingkaran luar sebagai bingkai */}
      {/* <circle
        cx={wrapperSize / 2}
        cy={wrapperSize / 2}
        r="60" // Radius lingkaran bisa disesuaikan jika perlu
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.5"
        opacity="0.2"
      /> */}
      {/* Gambar logo utama */}
      <image
        href="/logo-matbrew.svg"
        x={logoOffset}
        y={logoOffset}
        width={logoSize}
        height={logoSize}
        className="core-logo"
      />
    </g>
  );
};

export default CoreLogo;