/**
 * API Route: Get Maps API Key
 * Provides Google Maps API key securely to frontend via /my_api
 */

import { NextResponse } from 'next/server'
import { GOOGLE_MAPS_API_KEY } from '../../../../my_api'

export async function GET() {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      return NextResponse.json(
        { error: 'Maps API key not configured' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { apiKey: GOOGLE_MAPS_API_KEY },
      {
        headers: {
          'Cache-Control': 'private, max-age=3600',
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
