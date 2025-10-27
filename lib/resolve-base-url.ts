// lib/resolve-base-url.ts
export const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000');

export function resolveBaseUrl(): string {
  if (typeof window === "undefined") {
    // SSR: gunakan baseURL yang sudah di-resolve
    return baseURL;
  }
  // CSR: gunakan NEXT_PUBLIC_BASE_URL atau origin aktif
  return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
}