import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { origin, destination, waypoints } = body;

    if (!origin || !destination) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${apiKey}&alternatives=true`;
    
    if (waypoints && waypoints.length > 0) {
      const waypointsStr = waypoints.map((wp: any) => `${wp.lat},${wp.lng}`).join('|');
      url += `&waypoints=${waypointsStr}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return NextResponse.json(
        { error: 'Failed to calculate routes', details: data },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      routes: data.routes,
      primaryRoute: data.routes[0] || null,
      alternativeRoutes: data.routes.slice(1) || [],
    });
  } catch (error) {
    console.error('Error getting routes:', error);
    return NextResponse.json(
      { error: 'Failed to get routes' },
      { status: 500 }
    );
  }
}
