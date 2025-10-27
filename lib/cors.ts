import { NextResponse } from "next/server";

const allowedOrigins = [
  process.env.NEXT_PUBLIC_BASE_URL,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  'http://localhost:3000',
].filter(Boolean);

export function getCorsHeaders(origin?: string) {
  const isAllowed = origin && allowedOrigins.some(o => o && origin.startsWith(o));
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0] || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export function withCors(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(req.headers.get('origin') || undefined),
      });
    }

    const response = await handler(req, ...args);
    const headers = getCorsHeaders(req.headers.get('origin') || undefined);

    // Gabungkan header CORS tanpa konflik
    Object.entries(headers).forEach(([key, value]) => {
      if (!response.headers.has(key)) response.headers.set(key, value);
    });

    return response;
  };
}

// Backward compatibility
export function handleCORS(req: Request) {
  const origin = req.headers.get("origin");
  const headers = getCorsHeaders(origin || undefined);

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers });
  }

  return headers;
}