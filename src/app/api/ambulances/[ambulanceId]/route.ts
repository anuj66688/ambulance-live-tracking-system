import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { ambulanceInfo } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { ambulanceId: string } }
) {
  try {
    const { ambulanceId } = params;

    if (!ambulanceId) {
      return NextResponse.json(
        { error: 'Ambulance ID is required', code: 'MISSING_AMBULANCE_ID' },
        { status: 400 }
      );
    }

    const ambulance = await db
      .select()
      .from(ambulanceInfo)
      .where(eq(ambulanceInfo.ambulanceId, ambulanceId))
      .limit(1);

    if (ambulance.length === 0) {
      return NextResponse.json(
        { error: 'Ambulance not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(ambulance[0], { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { ambulanceId: string } }
) {
  try {
    const { ambulanceId } = params;

    if (!ambulanceId) {
      return NextResponse.json(
        { error: 'Ambulance ID is required', code: 'MISSING_AMBULANCE_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { driverName, vehicleNumber, contactNumber, status } = body;

    // Validate status if provided
    if (status && !['active', 'idle', 'maintenance'].includes(status)) {
      return NextResponse.json(
        {
          error: 'Invalid status. Must be "active", "idle", or "maintenance"',
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Check if ambulance exists
    const existingAmbulance = await db
      .select()
      .from(ambulanceInfo)
      .where(eq(ambulanceInfo.ambulanceId, ambulanceId))
      .limit(1);

    if (existingAmbulance.length === 0) {
      return NextResponse.json(
        { error: 'Ambulance not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (driverName !== undefined) updateData.driverName = driverName.trim();
    if (vehicleNumber !== undefined) updateData.vehicleNumber = vehicleNumber.trim();
    if (contactNumber !== undefined) updateData.contactNumber = contactNumber.trim();
    if (status !== undefined) updateData.status = status;

    const updatedAmbulance = await db
      .update(ambulanceInfo)
      .set(updateData)
      .where(eq(ambulanceInfo.ambulanceId, ambulanceId))
      .returning();

    if (updatedAmbulance.length === 0) {
      return NextResponse.json(
        { error: 'Ambulance not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAmbulance[0], { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { ambulanceId: string } }
) {
  try {
    const { ambulanceId } = params;

    if (!ambulanceId) {
      return NextResponse.json(
        { error: 'Ambulance ID is required', code: 'MISSING_AMBULANCE_ID' },
        { status: 400 }
      );
    }

    // Check if ambulance exists
    const existingAmbulance = await db
      .select()
      .from(ambulanceInfo)
      .where(eq(ambulanceInfo.ambulanceId, ambulanceId))
      .limit(1);

    if (existingAmbulance.length === 0) {
      return NextResponse.json(
        { error: 'Ambulance not found' },
        { status: 404 }
      );
    }

    // Delete ambulance
    await db
      .delete(ambulanceInfo)
      .where(eq(ambulanceInfo.ambulanceId, ambulanceId))
      .returning();

    return NextResponse.json(
      {
        message: 'Ambulance deleted successfully',
        ambulanceId,
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