// Types and sample data for Certificates

export type Certificate = {
  id: string
  title: string
  issuer: string
  image: string
  issuedAt?: string
  url?: string
}

export const certificates: Certificate[] = [
  {
    id: "cert-1",
    title: "Advanced React Patterns",
    issuer: "Frontend Masters",
    image: "/certificate-preview-1.jpg",
    issuedAt: "2024-08",
  },
  {
    id: "cert-2",
    title: "TypeScript Mastery",
    issuer: "Udemy",
    image: "/certificate-preview-2.jpg",
    issuedAt: "2024-06",
  },
  {
    id: "cert-3",
    title: "Cloud Architecture",
    issuer: "Google Cloud",
    image: "/certificate-preview-3.jpg",
    issuedAt: "2023-12",
  },
]
