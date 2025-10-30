import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ambulanceId, origin, destination } = body;

    if (!ambulanceId || !origin || !destination) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate routes using Google Maps Directions API
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    // Primary route (avoid highways preference)
    const primaryRouteUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${apiKey}&alternatives=false`;
    
    // Shortcut route (shortest distance)
    const shortcutRouteUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${apiKey}&alternatives=true`;

    const [primaryResponse, shortcutResponse] = await Promise.all([
      fetch(primaryRouteUrl),
      fetch(shortcutRouteUrl)
    ]);

    const primaryData = await primaryResponse.json();
    const shortcutData = await shortcutResponse.json();

    const tripData = {
      ambulanceId,
      origin,
      destination,
      status: 'active',
      startTime: Date.now(),
      currentLocation: origin,
      primaryRoute: primaryData.routes[0] || null,
      shortcutRoute: shortcutData.routes[1] || shortcutData.routes[0] || null,
    };

    return NextResponse.json({
      success: true,
      tripData,
      message: 'Trip started successfully'
    });
  } catch (error) {
    console.error('Error starting trip:', error);
    return NextResponse.json(
      { error: 'Failed to start trip' },
      { status: 500 }
    );
  }
}
