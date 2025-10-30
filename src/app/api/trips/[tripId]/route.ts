import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { ambulanceTrips } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  try {
    const { tripId } = params;

    if (!tripId) {
      return NextResponse.json(
        { error: 'Trip ID is required', code: 'MISSING_TRIP_ID' },
        { status: 400 }
      );
    }

    const trip = await db
      .select()
      .from(ambulanceTrips)
      .where(eq(ambulanceTrips.tripId, tripId))
      .limit(1);

    if (trip.length === 0) {
      return NextResponse.json(
        { error: 'Trip not found', code: 'TRIP_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(trip[0], { status: 200 });
  } catch (error: any) {
    console.error('GET trip error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  try {
    const { tripId } = params;

    if (!tripId) {
      return NextResponse.json(
        { error: 'Trip ID is required', code: 'MISSING_TRIP_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { endTime, status, averageSpeed, primaryDistanceKm, shortcutDistanceKm, etaMin } = body;

    // Validate status if provided
    if (status && !['in-progress', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        {
          error: 'Invalid status. Must be "in-progress", "completed", or "cancelled"',
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Check if trip exists
    const existingTrip = await db
      .select()
      .from(ambulanceTrips)
      .where(eq(ambulanceTrips.tripId, tripId))
      .limit(1);

    if (existingTrip.length === 0) {
      return NextResponse.json(
        { error: 'Trip not found', code: 'TRIP_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Build update object
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (endTime !== undefined) updates.endTime = endTime;
    if (status !== undefined) updates.status = status;
    if (averageSpeed !== undefined) updates.averageSpeed = averageSpeed;
    if (primaryDistanceKm !== undefined) updates.primaryDistanceKm = primaryDistanceKm;
    if (shortcutDistanceKm !== undefined) updates.shortcutDistanceKm = shortcutDistanceKm;
    if (etaMin !== undefined) updates.etaMin = etaMin;

    // Auto-set endTime if status changed to "completed" and endTime not provided
    if (status === 'completed' && !endTime && !existingTrip[0].endTime) {
      updates.endTime = new Date().toISOString();
    }

    const updatedTrip = await db
      .update(ambulanceTrips)
      .set(updates)
      .where(eq(ambulanceTrips.tripId, tripId))
      .returning();

    if (updatedTrip.length === 0) {
      return NextResponse.json(
        { error: 'Trip not found', code: 'TRIP_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTrip[0], { status: 200 });
  } catch (error: any) {
    console.error('PUT trip error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}