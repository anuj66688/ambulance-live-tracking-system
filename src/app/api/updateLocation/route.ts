import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ambulanceId, location, speed, heading } = body;

    if (!ambulanceId || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updateData = {
      ambulanceId,
      location,
      speed: speed || 0,
      heading: heading || 0,
      timestamp: Date.now(),
    };

    // In a real implementation, this would update Firebase Realtime Database
    // For now, we'll return success
    return NextResponse.json({
      success: true,
      data: updateData,
      message: 'Location updated successfully'
    });
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    );
  }
}
