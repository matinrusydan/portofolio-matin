// lib/api.ts
export function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Client side
    return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
  } else {
    // Server side
    return process.env.BASE_URL || "http://localhost:3000";
  }
}

export const BASE_URL = getBaseUrl();

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "production") {
  console.log("🌐 Active BASE_URL:", BASE_URL);
}

export const apiEndpoints = {
  projects: `${BASE_URL}/api/projects`,
  certificates: `${BASE_URL}/api/certificates`,
  contact: `${BASE_URL}/api/contact`,
};

export const getUploadUrl = (filename: string): string => {
  return `${BASE_URL}/uploads/${filename}`;
};
