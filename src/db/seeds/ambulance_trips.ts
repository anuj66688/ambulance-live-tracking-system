import { db } from '@/db';
import { ambulanceTrips } from '@/db/schema';

async function main() {
    const sampleTrips = [
        {
            tripId: 'TRIP17001234565678',
            ambulanceId: 'AMB001',
            driverName: 'Rajesh Kumar',
            vehicleNumber: 'TS09AB1234',
            startLat: '17.4326',
            startLng: '78.4071',
            destLat: '17.4123',
            destLng: '78.4421',
            primaryDistanceKm: '5.2',
            shortcutDistanceKm: '4.8',
            etaMin: '15',
            averageSpeed: '35.5',
            startTime: new Date('2024-12-20T08:30:00').toISOString(),
            endTime: new Date('2024-12-20T09:00:00').toISOString(),
            status: 'completed',
            primaryRoute: JSON.stringify([
                { lat: 17.4326, lng: 78.4071 },
                { lat: 17.4250, lng: 78.4200 },
                { lat: 17.4123, lng: 78.4421 }
            ]),
            shortcutRoute: JSON.stringify([
                { lat: 17.4326, lng: 78.4071 },
                { lat: 17.4200, lng: 78.4300 },
                { lat: 17.4123, lng: 78.4421 }
            ]),
            createdAt: new Date('2024-12-20T08:30:00').toISOString(),
            updatedAt: new Date('2024-12-20T09:00:00').toISOString(),
        },
        {
            tripId: 'TRIP17001234567890',
            ambulanceId: 'AMB002',
            driverName: 'Suresh Reddy',
            vehicleNumber: 'TS10CD5678',
            startLat: '17.4325',
            startLng: '78.3490',
            destLat: '17.3950',
            destLng: '78.5120',
            primaryDistanceKm: '12.8',
            shortcutDistanceKm: '11.5',
            etaMin: '32',
            averageSpeed: '42.3',
            startTime: new Date('2024-12-21T14:15:00').toISOString(),
            endTime: new Date('2024-12-21T15:30:00').toISOString(),
            status: 'completed',
            primaryRoute: JSON.stringify([
                { lat: 17.4325, lng: 78.3490 },
                { lat: 17.4100, lng: 78.4200 },
                { lat: 17.3950, lng: 78.5120 }
            ]),
            shortcutRoute: JSON.stringify([
                { lat: 17.4325, lng: 78.3490 },
                { lat: 17.4050, lng: 78.4500 },
                { lat: 17.3950, lng: 78.5120 }
            ]),
            createdAt: new Date('2024-12-21T14:15:00').toISOString(),
            updatedAt: new Date('2024-12-21T15:30:00').toISOString(),
        },
        {
            tripId: 'TRIP17001234569012',
            ambulanceId: 'AMB003',
            driverName: 'Venkat Rao',
            vehicleNumber: 'TS07EF9012',
            startLat: '17.4143',
            startLng: '78.4467',
            destLat: '17.4550',
            destLng: '78.3820',
            primaryDistanceKm: '8.5',
            shortcutDistanceKm: '7.9',
            etaMin: '22',
            averageSpeed: '38.7',
            startTime: new Date('2024-12-22T10:45:00').toISOString(),
            endTime: new Date('2024-12-22T11:30:00').toISOString(),
            status: 'completed',
            primaryRoute: JSON.stringify([
                { lat: 17.4143, lng: 78.4467 },
                { lat: 17.4300, lng: 78.4200 },
                { lat: 17.4550, lng: 78.3820 }
            ]),
            shortcutRoute: JSON.stringify([
                { lat: 17.4143, lng: 78.4467 },
                { lat: 17.4400, lng: 78.4100 },
                { lat: 17.4550, lng: 78.3820 }
            ]),
            createdAt: new Date('2024-12-22T10:45:00').toISOString(),
            updatedAt: new Date('2024-12-22T11:30:00').toISOString(),
        },
        {
            tripId: 'TRIP17001234570134',
            ambulanceId: 'AMB004',
            driverName: 'Krishna Prasad',
            vehicleNumber: 'TS12GH3456',
            startLat: '17.4477',
            startLng: '78.4863',
            destLat: '17.3420',
            destLng: '78.5550',
            primaryDistanceKm: '15.3',
            shortcutDistanceKm: '14.1',
            etaMin: '45',
            averageSpeed: '45.2',
            startTime: new Date('2024-12-23T16:20:00').toISOString(),
            endTime: new Date('2024-12-23T17:45:00').toISOString(),
            status: 'completed',
            primaryRoute: JSON.stringify([
                { lat: 17.4477, lng: 78.4863 },
                { lat: 17.3900, lng: 78.5200 },
                { lat: 17.3420, lng: 78.5550 }
            ]),
            shortcutRoute: JSON.stringify([
                { lat: 17.4477, lng: 78.4863 },
                { lat: 17.3800, lng: 78.5400 },
                { lat: 17.3420, lng: 78.5550 }
            ]),
            createdAt: new Date('2024-12-23T16:20:00').toISOString(),
            updatedAt: new Date('2024-12-23T17:45:00').toISOString(),
        },
        {
            tripId: 'TRIP17001234571256',
            ambulanceId: 'AMB005',
            driverName: 'Mahesh Singh',
            vehicleNumber: 'TS08IJ7890',
            startLat: '17.3850',
            startLng: '78.4867',
            destLat: '17.4250',
            destLng: '78.4200',
            primaryDistanceKm: '7.9',
            shortcutDistanceKm: '7.2',
            etaMin: '18',
            averageSpeed: '40.1',
            startTime: new Date('2024-12-24T09:10:00').toISOString(),
            endTime: new Date('2024-12-24T09:50:00').toISOString(),
            status: 'completed',
            primaryRoute: JSON.stringify([
                { lat: 17.3850, lng: 78.4867 },
                { lat: 17.4050, lng: 78.4500 },
                { lat: 17.4250, lng: 78.4200 }
            ]),
            shortcutRoute: JSON.stringify([
                { lat: 17.3850, lng: 78.4867 },
                { lat: 17.4100, lng: 78.4450 },
                { lat: 17.4250, lng: 78.4200 }
            ]),
            createdAt: new Date('2024-12-24T09:10:00').toISOString(),
            updatedAt: new Date('2024-12-24T09:50:00').toISOString(),
        },
        {
            tripId: 'TRIP17001234572378',
            ambulanceId: 'AMB001',
            driverName: 'Rajesh Kumar',
            vehicleNumber: 'TS09AB1234',
            startLat: '17.4326',
            startLng: '78.4071',
            destLat: '17.3120',
            destLng: '78.5890',
            primaryDistanceKm: '18.2',
            shortcutDistanceKm: '16.8',
            etaMin: '50',
            averageSpeed: '48.5',
            startTime: new Date('2024-12-25T11:30:00').toISOString(),
            endTime: new Date('2024-12-25T13:00:00').toISOString(),
            status: 'completed',
            primaryRoute: JSON.stringify([
                { lat: 17.4326, lng: 78.4071 },
                { lat: 17.3700, lng: 78.5000 },
                { lat: 17.3120, lng: 78.5890 }
            ]),
            shortcutRoute: JSON.stringify([
                { lat: 17.4326, lng: 78.4071 },
                { lat: 17.3600, lng: 78.5200 },
                { lat: 17.3120, lng: 78.5890 }
            ]),
            createdAt: new Date('2024-12-25T11:30:00').toISOString(),
            updatedAt: new Date('2024-12-25T13:00:00').toISOString(),
        },
        {
            tripId: 'TRIP17001234573490',
            ambulanceId: 'AMB002',
            driverName: 'Suresh Reddy',
            vehicleNumber: 'TS10CD5678',
            startLat: '17.4325',
            startLng: '78.3490',
            destLat: '17.4680',
            destLng: '78.3920',
            primaryDistanceKm: '6.4',
            shortcutDistanceKm: '5.9',
            etaMin: '16',
            averageSpeed: '36.8',
            startTime: new Date('2024-12-26T15:45:00').toISOString(),
            endTime: new Date('2024-12-26T16:20:00').toISOString(),
            status: 'cancelled',
            primaryRoute: JSON.stringify([
                { lat: 17.4325, lng: 78.3490 },
                { lat: 17.4500, lng: 78.3700 },
                { lat: 17.4680, lng: 78.3920 }
            ]),
            shortcutRoute: JSON.stringify([
                { lat: 17.4325, lng: 78.3490 },
                { lat: 17.4550, lng: 78.3750 },
                { lat: 17.4680, lng: 78.3920 }
            ]),
            createdAt: new Date('2024-12-26T15:45:00').toISOString(),
            updatedAt: new Date('2024-12-26T16:20:00').toISOString(),
        },
        {
            tripId: 'TRIP17001234574612',
            ambulanceId: 'AMB003',
            driverName: 'Venkat Rao',
            vehicleNumber: 'TS07EF9012',
            startLat: '17.4143',
            startLng: '78.4467',
            destLat: '17.2980',
            destLng: '78.5720',
            primaryDistanceKm: '22.5',
            shortcutDistanceKm: '20.3',
            etaMin: '65',
            averageSpeed: null,
            startTime: new Date('2024-12-27T13:00:00').toISOString(),
            endTime: null,
            status: 'in-progress',
            primaryRoute: JSON.stringify([
                { lat: 17.4143, lng: 78.4467 },
                { lat: 17.3500, lng: 78.5100 },
                { lat: 17.2980, lng: 78.5720 }
            ]),
            shortcutRoute: JSON.stringify([
                { lat: 17.4143, lng: 78.4467 },
                { lat: 17.3400, lng: 78.5300 },
                { lat: 17.2980, lng: 78.5720 }
            ]),
            createdAt: new Date('2024-12-27T13:00:00').toISOString(),
            updatedAt: new Date('2024-12-27T13:00:00').toISOString(),
        },
        {
            tripId: 'TRIP17001234575734',
            ambulanceId: 'AMB004',
            driverName: 'Krishna Prasad',
            vehicleNumber: 'TS12GH3456',
            startLat: '17.4477',
            startLng: '78.4863',
            destLat: '17.4050',
            destLng: '78.3650',
            primaryDistanceKm: '9.7',
            shortcutDistanceKm: '8.9',
            etaMin: '25',
            averageSpeed: '43.2',
            startTime: new Date('2024-12-28T07:20:00').toISOString(),
            endTime: new Date('2024-12-28T08:10:00').toISOString(),
            status: 'completed',
            primaryRoute: JSON.stringify([
                { lat: 17.4477, lng: 78.4863 },
                { lat: 17.4250, lng: 78.4250 },
                { lat: 17.4050, lng: 78.3650 }
            ]),
            shortcutRoute: JSON.stringify([
                { lat: 17.4477, lng: 78.4863 },
                { lat: 17.4300, lng: 78.4100 },
                { lat: 17.4050, lng: 78.3650 }
            ]),
            createdAt: new Date('2024-12-28T07:20:00').toISOString(),
            updatedAt: new Date('2024-12-28T08:10:00').toISOString(),
        },
        {
            tripId: 'TRIP17001234576856',
            ambulanceId: 'AMB005',
            driverName: 'Mahesh Singh',
            vehicleNumber: 'TS08IJ7890',
            startLat: '17.3850',
            startLng: '78.4867',
            destLat: '17.4820',
            destLng: '78.3420',
            primaryDistanceKm: '11.3',
            shortcutDistanceKm: '10.5',
            etaMin: '30',
            averageSpeed: null,
            startTime: new Date('2024-12-29T10:30:00').toISOString(),
            endTime: null,
            status: 'in-progress',
            primaryRoute: JSON.stringify([
                { lat: 17.3850, lng: 78.4867 },
                { lat: 17.4350, lng: 78.4100 },
                { lat: 17.4820, lng: 78.3420 }
            ]),
            shortcutRoute: JSON.stringify([
                { lat: 17.3850, lng: 78.4867 },
                { lat: 17.4450, lng: 78.3900 },
                { lat: 17.4820, lng: 78.3420 }
            ]),
            createdAt: new Date('2024-12-29T10:30:00').toISOString(),
            updatedAt: new Date('2024-12-29T10:30:00').toISOString(),
        },
    ];

    await db.insert(ambulanceTrips).values(sampleTrips);
    
    console.log('✅ Ambulance trips seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});