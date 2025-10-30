import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { ambulanceTrips } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ambulanceId = searchParams.get('ambulanceId');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Build query conditions
    const conditions: any[] = [];

    if (ambulanceId) {
      conditions.push(eq(ambulanceTrips.ambulanceId, ambulanceId));
    }

    if (startDate) {
      conditions.push(gte(ambulanceTrips.startTime, startDate));
    }

    if (endDate) {
      conditions.push(lte(ambulanceTrips.startTime, endDate));
    }

    // Fetch trips with filters
    let query = db.select().from(ambulanceTrips);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const trips = await query;

    // Calculate analytics
    const totalTrips = trips.length;
    const completedTrips = trips.filter(trip => trip.status === 'completed').length;
    const inProgressTrips = trips.filter(trip => trip.status === 'in-progress').length;
    const cancelledTrips = trips.filter(trip => trip.status === 'cancelled').length;

    // Calculate total distance from primaryDistanceKm
    const totalDistanceKm = trips.reduce((sum, trip) => {
      const distance = parseFloat(trip.primaryDistanceKm || '0');
      return sum + (isNaN(distance) ? 0 : distance);
    }, 0);

    const averageDistanceKm = totalTrips > 0 ? totalDistanceKm / totalTrips : 0;

    // Calculate average speed (filter out nulls and empty strings)
    const speedValues = trips
      .filter(trip => trip.averageSpeed !== null && trip.averageSpeed !== undefined && trip.averageSpeed !== '')
      .map(trip => parseFloat(trip.averageSpeed || '0'))
      .filter(speed => !isNaN(speed));

    const averageTripSpeed = speedValues.length > 0 
      ? speedValues.reduce((sum, speed) => sum + speed, 0) / speedValues.length 
      : 0;

    // Group trips by ambulance
    const tripsByAmbulance: Record<string, number> = {};
    trips.forEach(trip => {
      if (trip.ambulanceId) {
        tripsByAmbulance[trip.ambulanceId] = (tripsByAmbulance[trip.ambulanceId] || 0) + 1;
      }
    });

    // Group trips by status
    const tripsByStatus: Record<string, number> = {
      'completed': completedTrips,
      'in-progress': inProgressTrips,
      'cancelled': cancelledTrips
    };

    const analytics = {
      totalTrips,
      completedTrips,
      inProgressTrips,
      cancelledTrips,
      totalDistanceKm: Math.round(totalDistanceKm * 100) / 100,
      averageDistanceKm: Math.round(averageDistanceKm * 100) / 100,
      averageTripSpeed: Math.round(averageTripSpeed * 100) / 100,
      tripsByAmbulance,
      tripsByStatus
    };

    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}