import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { ambulanceTrips } from '@/db/schema';

export async function GET(request: NextRequest) {
  try {
    const trips = await db.select().from(ambulanceTrips);

    const totalTrips = trips.length;
    const completedTrips = trips.filter(trip => trip.status === 'completed').length;
    const inProgressTrips = trips.filter(trip => trip.status === 'in-progress').length;
    const cancelledTrips = trips.filter(trip => trip.status === 'cancelled').length;

    const totalDistanceKm = trips.reduce((sum, trip) => {
      const distance = parseFloat(trip.distanceKm || '0');
      return sum + distance;
    }, 0);

    const averageDistanceKm = totalTrips > 0 ? totalDistanceKm / totalTrips : 0;

    const speedValues = trips
      .filter(trip => trip.averageSpeed !== null && trip.averageSpeed !== undefined && trip.averageSpeed !== '')
      .map(trip => parseFloat(trip.averageSpeed || '0'))
      .filter(speed => !isNaN(speed));

    const averageTripSpeed = speedValues.length > 0 
      ? speedValues.reduce((sum, speed) => sum + speed, 0) / speedValues.length 
      : 0;

    const tripsByAmbulance: Record<string, number> = {};
    trips.forEach(trip => {
      if (trip.ambulanceId) {
        tripsByAmbulance[trip.ambulanceId] = (tripsByAmbulance[trip.ambulanceId] || 0) + 1;
      }
    });

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