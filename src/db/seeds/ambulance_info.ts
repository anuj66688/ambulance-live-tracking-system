import { db } from '@/db';
import { ambulanceInfo } from '@/db/schema';

async function main() {
    const sampleAmbulances = [
        {
            ambulanceId: 'AMB001',
            driverName: 'Rajesh Kumar',
            vehicleNumber: 'TS09AB1234',
            contactNumber: '+919876543210',
            status: 'active',
            createdAt: new Date('2024-12-01T08:00:00.000Z').toISOString(),
            updatedAt: new Date('2024-12-20T10:30:00.000Z').toISOString(),
        },
        {
            ambulanceId: 'AMB002',
            driverName: 'Priya Sharma',
            vehicleNumber: 'AP07XY9876',
            contactNumber: '+919123456789',
            status: 'active',
            createdAt: new Date('2024-12-03T09:15:00.000Z').toISOString(),
            updatedAt: new Date('2024-12-21T14:45:00.000Z').toISOString(),
        },
        {
            ambulanceId: 'AMB003',
            driverName: 'Amit Patel',
            vehicleNumber: 'KA01MN5678',
            contactNumber: '+918765432109',
            status: 'idle',
            createdAt: new Date('2024-12-05T11:30:00.000Z').toISOString(),
            updatedAt: new Date('2024-12-19T16:20:00.000Z').toISOString(),
        },
        {
            ambulanceId: 'AMB004',
            driverName: 'Sneha Reddy',
            vehicleNumber: 'TN22PQ4321',
            contactNumber: '+917890123456',
            status: 'idle',
            createdAt: new Date('2024-12-07T07:45:00.000Z').toISOString(),
            updatedAt: new Date('2024-12-18T09:00:00.000Z').toISOString(),
        },
        {
            ambulanceId: 'AMB005',
            driverName: 'Vikram Singh',
            vehicleNumber: 'MH12CD7890',
            contactNumber: '+916543210987',
            status: 'maintenance',
            createdAt: new Date('2024-12-10T13:20:00.000Z').toISOString(),
            updatedAt: new Date('2024-12-22T11:15:00.000Z').toISOString(),
        },
    ];

    await db.insert(ambulanceInfo).values(sampleAmbulances);
    
    console.log('✅ Ambulance info seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});