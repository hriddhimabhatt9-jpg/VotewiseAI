import { NextResponse } from 'next/server';

export async function GET() {
  // Return the key from server-side environment variables
  // This allows runtime injection in Cloud Run
  const apiKey = 
    process.env.GOOGLE_MAPS_API_KEY || 
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'Map API key not configured' }, { status: 500 });
  }

  return NextResponse.json({ apiKey });
}
