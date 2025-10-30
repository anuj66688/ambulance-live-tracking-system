import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { ambulanceTrips } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      trip_id,
      ambulanceId,
      driverName,
      vehicleNumber,
      startLat,
      startLng,
      destLat,
      destLng,
      primaryDistanceKm,
      shortcutDistanceKm,
      etaMin,
      endTime,
      averageSpeed,
      status,
      primaryRoute,
      shortcutRoute
    } = body;

    // Validate required fields
    if (!ambulanceId) {
      return NextResponse.json(
        { error: 'ambulanceId is required', code: 'MISSING_AMBULANCE_ID' },
        { status: 400 }
      );
    }
    if (!driverName) {
      return NextResponse.json(
        { error: 'driverName is required', code: 'MISSING_DRIVER_NAME' },
        { status: 400 }
      );
    }
    if (!vehicleNumber) {
      return NextResponse.json(
        { error: 'vehicleNumber is required', code: 'MISSING_VEHICLE_NUMBER' },
        { status: 400 }
      );
    }
    if (!startLat) {
      return NextResponse.json(
        { error: 'startLat is required', code: 'MISSING_START_LAT' },
        { status: 400 }
      );
    }
    if (!startLng) {
      return NextResponse.json(
        { error: 'startLng is required', code: 'MISSING_START_LNG' },
        { status: 400 }
      );
    }
    if (!destLat) {
      return NextResponse.json(
        { error: 'destLat is required', code: 'MISSING_DEST_LAT' },
        { status: 400 }
      );
    }
    if (!destLng) {
      return NextResponse.json(
        { error: 'destLng is required', code: 'MISSING_DEST_LNG' },
        { status: 400 }
      );
    }

    // Auto-generate tripId if not provided
    const tripId = trip_id || `TRIP${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;

    // Auto-generate timestamps
    const now = new Date().toISOString();

    // Create trip data - no id field
    const tripData: any = {
      tripId,
      ambulanceId: ambulanceId.toString().trim(),
      driverName: driverName.toString().trim(),
      vehicleNumber: vehicleNumber.toString().trim(),
      startLat: startLat.toString(),
      startLng: startLng.toString(),
      destLat: destLat.toString(),
      destLng: destLng.toString(),
      startTime: now,
      status: status || 'in-progress',
      createdAt: now,
      updatedAt: now
    };

    // Add optional fields if provided
    if (primaryDistanceKm) tripData.primaryDistanceKm = primaryDistanceKm.toString();
    if (shortcutDistanceKm) tripData.shortcutDistanceKm = shortcutDistanceKm.toString();
    if (etaMin) tripData.etaMin = etaMin.toString();
    if (endTime) tripData.endTime = endTime;
    if (averageSpeed) tripData.averageSpeed = averageSpeed.toString();
    if (primaryRoute) tripData.primaryRoute = primaryRoute;
    if (shortcutRoute) tripData.shortcutRoute = shortcutRoute;

    // Insert into database
    const newTrip = await db
      .insert(ambulanceTrips)
      .values(tripData)
      .returning();

    return NextResponse.json(newTrip[0], { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const ambulanceId = searchParams.get('ambulanceId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Validate status if provided
    if (status && !['in-progress', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { 
          error: 'Invalid status. Must be one of: in-progress, completed, cancelled',
          code: 'INVALID_STATUS' 
        },
        { status: 400 }
      );
    }

    // Build query conditions
    const conditions: any[] = [];

    if (ambulanceId) {
      conditions.push(eq(ambulanceTrips.ambulanceId, ambulanceId));
    }

    if (status) {
      conditions.push(eq(ambulanceTrips.status, status));
    }

    if (startDate) {
      conditions.push(gte(ambulanceTrips.startTime, startDate));
    }

    if (endDate) {
      conditions.push(lte(ambulanceTrips.startTime, endDate));
    }

    // Execute query
    let query = db.select().from(ambulanceTrips);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('tripId');

    if (!tripId) {
      return NextResponse.json(
        { error: 'tripId is required', code: 'MISSING_TRIP_ID' },
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

    const body = await request.json();
    const updates: any = {};

    // Validate and add updatable fields
    if (body.ambulanceId !== undefined) {
      updates.ambulanceId = body.ambulanceId.toString().trim();
    }
    if (body.driverName !== undefined) {
      updates.driverName = body.driverName.toString().trim();
    }
    if (body.vehicleNumber !== undefined) {
      updates.vehicleNumber = body.vehicleNumber.toString().trim();
    }
    if (body.startLat !== undefined) {
      updates.startLat = body.startLat.toString();
    }
    if (body.startLng !== undefined) {
      updates.startLng = body.startLng.toString();
    }
    if (body.destLat !== undefined) {
      updates.destLat = body.destLat.toString();
    }
    if (body.destLng !== undefined) {
      updates.destLng = body.destLng.toString();
    }
    if (body.primaryDistanceKm !== undefined) {
      updates.primaryDistanceKm = body.primaryDistanceKm.toString();
    }
    if (body.shortcutDistanceKm !== undefined) {
      updates.shortcutDistanceKm = body.shortcutDistanceKm.toString();
    }
    if (body.etaMin !== undefined) {
      updates.etaMin = body.etaMin.toString();
    }
    if (body.startTime !== undefined) {
      updates.startTime = body.startTime;
    }
    if (body.endTime !== undefined) {
      updates.endTime = body.endTime;
    }
    if (body.status !== undefined) {
      // Validate status
      if (!['in-progress', 'completed', 'cancelled'].includes(body.status)) {
        return NextResponse.json(
          { 
            error: 'Invalid status. Must be one of: in-progress, completed, cancelled',
            code: 'INVALID_STATUS' 
          },
          { status: 400 }
        );
      }
      updates.status = body.status;
    }
    if (body.averageSpeed !== undefined) {
      updates.averageSpeed = body.averageSpeed.toString();
    }
    if (body.primaryRoute !== undefined) {
      updates.primaryRoute = body.primaryRoute;
    }
    if (body.shortcutRoute !== undefined) {
      updates.shortcutRoute = body.shortcutRoute;
    }

    // Always update updatedAt
    updates.updatedAt = new Date().toISOString();

    // Update trip
    const updatedTrip = await db
      .update(ambulanceTrips)
      .set(updates)
      .where(eq(ambulanceTrips.tripId, tripId))
      .returning();

    return NextResponse.json(updatedTrip[0], { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('tripId');

    if (!tripId) {
      return NextResponse.json(
        { error: 'tripId is required', code: 'MISSING_TRIP_ID' },
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

    // Delete trip
    const deletedTrip = await db
      .delete(ambulanceTrips)
      .where(eq(ambulanceTrips.tripId, tripId))
      .returning();

    return NextResponse.json(
      {
        message: 'Trip deleted successfully',
        trip: deletedTrip[0]
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}