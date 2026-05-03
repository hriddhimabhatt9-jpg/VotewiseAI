import { NextResponse } from 'next/server';
import { GOOGLE_MAPS_API_KEY } from '../../../../my_api';

export async function GET() {
  const apiKey = GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'Map API key not configured' }, { status: 500 });
  }

  return NextResponse.json({ apiKey });
}
