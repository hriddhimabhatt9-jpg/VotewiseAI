/**
 * API Route: Get Maps API Key
 * Provides Google Maps API key securely to frontend
 * This prevents the key from being exposed directly in client-side code
 */

import { NextResponse, NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // In production, add auth checks here to verify the user
    const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!mapsApiKey) {
      return NextResponse.json(
        { error: 'Maps API key not configured' },
        { status: 500 }
      )
    }

    // Return a restricted key if possible, or limit its use to specific origins
    return NextResponse.json(
      { apiKey: mapsApiKey },
      {
        headers: {
          'Cache-Control': 'private, max-age=3600', // Cache for 1 hour
          'X-Content-Type-Options': 'nosniff',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching maps API key:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve API key' },
      { status: 500 }
    )
  }
}
