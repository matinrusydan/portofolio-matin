declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  image?: string;
  imagePath?: string;
  credentialUrl?: string;
  url?: string;
  issuedAt?: string;
  category?: string;
  isFeatured: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  image?: string;
  imagePath?: string;
  projectLink?: string;
  githubLink?: string;
  isFeatured: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}
