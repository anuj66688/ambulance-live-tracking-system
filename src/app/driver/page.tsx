"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import GoogleMapComponent from '@/components/GoogleMapComponent';
import { Navigation, MapPin, Clock, Gauge, Radio, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Location, TripData } from '@/lib/types';
import { database } from '@/lib/firebase';
import { ref, set, onValue } from 'firebase/database';

export default function DriverInterface() {
  const [tripActive, setTripActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location>({ lat: 40.7128, lng: -74.0060 });
  const [destination] = useState<Location>({ lat: 40.7589, lng: -73.9851 });
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [eta, setEta] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location');
        }
      );
    }
  }, []);

  // Start GPS tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsTracking(true);
    
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        setCurrentLocation(newLocation);
        setSpeed(position.coords.speed ? Math.round(position.coords.speed * 3.6) : 0); // Convert m/s to km/h

        // Update location in Firebase and backend
        if (tripActive) {
          updateLocation(newLocation, position.coords.speed || 0, position.coords.heading || 0);
        }
      },
      (error) => {
        console.error('Error tracking location:', error);
        toast.error('Error tracking location');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  // Stop GPS tracking
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setIsTracking(false);
    }
  };

  // Update location to backend and Firebase
  const updateLocation = async (location: Location, speed: number, heading: number) => {
    try {
      // Update backend
      await fetch('/api/updateLocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ambulanceId: 'AMB-001',
          location,
          speed,
          heading,
        }),
      });

      // Update Firebase
      const ambulanceRef = ref(database, `ambulances/AMB-001`);
      await set(ambulanceRef, {
        location,
        speed,
        heading,
        status: 'active',
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  // Start trip
  const handleStartTrip = async () => {
    try {
      toast.loading('Starting trip...');
      
      const response = await fetch('/api/startTrip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ambulanceId: 'AMB-001',
          origin: currentLocation,
          destination: destination,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTripData(data.tripData);
        setTripActive(true);
        startTracking();
        
        // Store trip in Firebase
        const tripRef = ref(database, `trips/AMB-001`);
        await set(tripRef, data.tripData);
        
        toast.success('Trip started successfully!');
        
        // Calculate initial ETA and distance
        if (data.tripData.primaryRoute?.legs[0]) {
          setDistance(data.tripData.primaryRoute.legs[0].distance.value / 1000); // km
          setEta(Math.round(data.tripData.primaryRoute.legs[0].duration.value / 60)); // minutes
        }
      }
    } catch (error) {
      console.error('Error starting trip:', error);
      toast.error('Failed to start trip');
    }
  };

  // End trip
  const handleEndTrip = () => {
    setTripActive(false);
    setTripData(null);
    stopTracking();
    toast.success('Trip ended');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-red-600 text-white p-4 shadow-lg"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg">
              <Radio className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Ambulance Driver</h1>
              <p className="text-sm text-red-100">AMB-001 • Emergency Response</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={tripActive ? "default" : "secondary"} className="px-3 py-1">
              {tripActive ? '🚨 ACTIVE' : '⏸️ STANDBY'}
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Sidebar - Controls */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-1 space-y-4"
        >
          {/* Trip Control Card */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-red-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="text-red-600" />
              Trip Control
            </h2>
            
            {!tripActive ? (
              <Button
                onClick={handleStartTrip}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6"
                size="lg"
              >
                <Navigation className="mr-2" />
                Start Emergency Trip
              </Button>
            ) : (
              <Button
                onClick={handleEndTrip}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white text-lg py-6"
                size="lg"
                variant="destructive"
              >
                End Trip
              </Button>
            )}

            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span className="font-semibold">Destination:</span>
              </p>
              <p className="text-sm text-gray-800 mt-1">
                Times Square, New York
              </p>
            </div>
          </Card>

          {/* Status Cards */}
          <AnimatePresence>
            {tripActive && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="space-y-3"
              >
                <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Speed</p>
                      <p className="text-3xl font-bold">{speed}</p>
                      <p className="text-xs opacity-75">km/h</p>
                    </div>
                    <Gauge className="w-12 h-12 opacity-50" />
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Distance</p>
                      <p className="text-3xl font-bold">{distance.toFixed(1)}</p>
                      <p className="text-xs opacity-75">km remaining</p>
                    </div>
                    <MapPin className="w-12 h-12 opacity-50" />
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">ETA</p>
                      <p className="text-3xl font-bold">{eta}</p>
                      <p className="text-xs opacity-75">minutes</p>
                    </div>
                    <Clock className="w-12 h-12 opacity-50" />
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Route Legend */}
          {tripActive && tripData && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Route Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">Primary Route</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-sm">Shortcut Route</span>
                </div>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Map Area */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="lg:col-span-2"
        >
          <Card className="h-[calc(100vh-180px)] overflow-hidden shadow-2xl">
            <GoogleMapComponent
              center={currentLocation}
              zoom={13}
              ambulanceLocation={tripActive ? currentLocation : undefined}
              primaryRoute={tripData?.primaryRoute}
              shortcutRoute={tripData?.shortcutRoute}
              destination={tripActive ? destination : undefined}
              className="w-full h-full"
            />
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
