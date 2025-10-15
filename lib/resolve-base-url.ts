// lib/resolve-base-url.ts
export function resolveBaseUrl(): string {
  if (typeof window === "undefined") {
    // SSR: gunakan relative path (internal routing)
    return process.env.BASE_URL || "";
  }
  // CSR: gunakan NEXT_PUBLIC_BASE_URL atau origin aktif
  return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
}