import { NextResponse } from "next/server";

export function handleCORS(req: Request) {
  const headers = {
    "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_BASE_URL || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers });
  }

  return headers;
}