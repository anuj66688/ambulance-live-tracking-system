import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { ambulanceInfo } from '@/db/schema';
import { eq } from 'drizzle-orm';

const VALID_STATUSES = ['active', 'idle', 'maintenance'] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ambulanceId, driverName, vehicleNumber, contactNumber, status } = body;

    // Validate required fields
    if (!ambulanceId?.trim()) {
      return NextResponse.json({ 
        error: "ambulanceId is required",
        code: "MISSING_AMBULANCE_ID" 
      }, { status: 400 });
    }

    if (!driverName?.trim()) {
      return NextResponse.json({ 
        error: "driverName is required",
        code: "MISSING_DRIVER_NAME" 
      }, { status: 400 });
    }

    if (!vehicleNumber?.trim()) {
      return NextResponse.json({ 
        error: "vehicleNumber is required",
        code: "MISSING_VEHICLE_NUMBER" 
      }, { status: 400 });
    }

    if (!contactNumber?.trim()) {
      return NextResponse.json({ 
        error: "contactNumber is required",
        code: "MISSING_CONTACT_NUMBER" 
      }, { status: 400 });
    }

    // Validate status if provided
    const ambulanceStatus = status?.trim() || 'idle';
    if (!VALID_STATUSES.includes(ambulanceStatus as typeof VALID_STATUSES[number])) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Validate ambulanceId format (basic check for AMB pattern)
    const trimmedAmbulanceId = ambulanceId.trim();
    if (trimmedAmbulanceId.length > 10) {
      return NextResponse.json({ 
        error: "ambulanceId must not exceed 10 characters",
        code: "INVALID_AMBULANCE_ID_LENGTH" 
      }, { status: 400 });
    }

    // Check for duplicate ambulanceId
    const existing = await db.select()
      .from(ambulanceInfo)
      .where(eq(ambulanceInfo.ambulanceId, trimmedAmbulanceId))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ 
        error: "An ambulance with this ID already exists",
        code: "DUPLICATE_AMBULANCE_ID" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedData = {
      ambulanceId: trimmedAmbulanceId,
      driverName: driverName.trim(),
      vehicleNumber: vehicleNumber.trim(),
      contactNumber: contactNumber.trim(),
      status: ambulanceStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Insert new ambulance
    const newAmbulance = await db.insert(ambulanceInfo)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newAmbulance[0], { status: 201 });

  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Validate status filter if provided
    if (statusFilter && !VALID_STATUSES.includes(statusFilter as typeof VALID_STATUSES[number])) {
      return NextResponse.json({ 
        error: `Invalid status filter. Must be one of: ${VALID_STATUSES.join(', ')}`,
        code: "INVALID_STATUS_FILTER" 
      }, { status: 400 });
    }

    // Build query
    let query = db.select().from(ambulanceInfo);

    // Apply status filter if provided
    if (statusFilter) {
      query = query.where(eq(ambulanceInfo.status, statusFilter));
    }

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}