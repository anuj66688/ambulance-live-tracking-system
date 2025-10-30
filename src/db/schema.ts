import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Ambulance information table
export const ambulanceInfo = sqliteTable('ambulance_info', {
  ambulanceId: text('ambulance_id').primaryKey(),
  driverName: text('driver_name').notNull(),
  vehicleNumber: text('vehicle_number').notNull(),
  contactNumber: text('contact_number').notNull(),
  status: text('status').notNull().default('idle'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Ambulance trips table for history and reports
export const ambulanceTrips = sqliteTable('ambulance_trips', {
  tripId: text('trip_id').primaryKey(),
  ambulanceId: text('ambulance_id').notNull(),
  driverName: text('driver_name').notNull(),
  vehicleNumber: text('vehicle_number').notNull(),
  startLat: text('start_lat').notNull(),
  startLng: text('start_lng').notNull(),
  destLat: text('dest_lat').notNull(),
  destLng: text('dest_lng').notNull(),
  primaryDistanceKm: text('primary_distance_km'),
  shortcutDistanceKm: text('shortcut_distance_km'),
  etaMin: text('eta_min'),
  averageSpeed: text('average_speed'),
  startTime: text('start_time').notNull(),
  endTime: text('end_time'),
  status: text('status').notNull().default('in-progress'),
  primaryRoute: text('primary_route'),
  shortcutRoute: text('shortcut_route'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});