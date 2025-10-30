CREATE TABLE `ambulance_info` (
	`ambulance_id` text PRIMARY KEY NOT NULL,
	`driver_name` text NOT NULL,
	`vehicle_number` text NOT NULL,
	`contact_number` text NOT NULL,
	`status` text DEFAULT 'idle' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ambulance_trips` (
	`trip_id` text PRIMARY KEY NOT NULL,
	`ambulance_id` text NOT NULL,
	`driver_name` text NOT NULL,
	`vehicle_number` text NOT NULL,
	`start_lat` text NOT NULL,
	`start_lng` text NOT NULL,
	`dest_lat` text NOT NULL,
	`dest_lng` text NOT NULL,
	`distance_km` text NOT NULL,
	`eta_min` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text,
	`status` text DEFAULT 'in-progress' NOT NULL,
	`average_speed` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
