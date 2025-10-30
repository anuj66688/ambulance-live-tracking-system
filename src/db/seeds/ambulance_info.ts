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
            createdAt: new Date('2024-12-15T08:30:00').toISOString(),
            updatedAt: new Date('2024-12-15T08:30:00').toISOString(),
        },
        {
            ambulanceId: 'AMB002',
            driverName: 'Suresh Reddy',
            vehicleNumber: 'TS10CD5678',
            contactNumber: '+919765432109',
            status: 'active',
            createdAt: new Date('2024-12-18T10:15:00').toISOString(),
            updatedAt: new Date('2024-12-18T10:15:00').toISOString(),
        },
        {
            ambulanceId: 'AMB003',
            driverName: 'Venkat Rao',
            vehicleNumber: 'TS07EF9012',
            contactNumber: '+919654321098',
            status: 'idle',
            createdAt: new Date('2024-12-20T14:45:00').toISOString(),
            updatedAt: new Date('2024-12-20T14:45:00').toISOString(),
        },
        {
            ambulanceId: 'AMB004',
            driverName: 'Krishna Prasad',
            vehicleNumber: 'TS12GH3456',
            contactNumber: '+919543210987',
            status: 'active',
            createdAt: new Date('2024-12-22T09:00:00').toISOString(),
            updatedAt: new Date('2024-12-22T09:00:00').toISOString(),
        },
        {
            ambulanceId: 'AMB005',
            driverName: 'Mahesh Singh',
            vehicleNumber: 'TS08IJ7890',
            contactNumber: '+919432109876',
            status: 'idle',
            createdAt: new Date('2024-12-25T11:30:00').toISOString(),
            updatedAt: new Date('2024-12-25T11:30:00').toISOString(),
        },
    ];

    await db.insert(ambulanceInfo).values(sampleAmbulances);
    
    console.log('✅ Ambulance info seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});