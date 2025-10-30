"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import GoogleMapComponent from '@/components/GoogleMapComponent';
import { Activity, MapPin, Clock, Gauge, Radio, AlertCircle, TrendingUp } from 'lucide-react';
import { Location, AmbulanceData } from '@/lib/types';
import { database } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';
import { toast } from 'sonner';

export default function OfficerDashboard() {
  const [ambulanceData, setAmbulanceData] = useState<AmbulanceData | null>(null);
  const [tripData, setTripData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    // Listen to ambulance location updates
    const ambulanceRef = ref(database, 'ambulances/AMB-001');
    const tripRef = ref(database, 'trips/AMB-001');

    const ambulanceListener = onValue(
      ambulanceRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setAmbulanceData({
            id: 'AMB-001',
            location: data.location,
            speed: data.speed || 0,
            heading: data.heading || 0,
            status: data.status || 'idle',
            timestamp: data.timestamp,
          });
          setLastUpdate(new Date());
          setIsConnected(true);
        }
      },
      (error) => {
        console.error('Firebase error:', error);
        setIsConnected(false);
        toast.error('Connection error');
      }
    );

    const tripListener = onValue(tripRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTripData(data);
      }
    });

    return () => {
      off(ambulanceRef, 'value', ambulanceListener);
      off(tripRef, 'value', tripListener);
    };
  }, []);

  // Calculate ETA based on distance and speed
  const calculateETA = () => {
    if (!tripData?.primaryRoute?.legs[0] || !ambulanceData) return 0;
    const distanceKm = tripData.primaryRoute.legs[0].distance.value / 1000;
    const speedKmh = ambulanceData.speed;
    if (speedKmh > 0) {
      return Math.round((distanceKm / speedKmh) * 60); // minutes
    }
    return Math.round(tripData.primaryRoute.legs[0].duration.value / 60);
  };

  const getDistance = () => {
    if (!tripData?.primaryRoute?.legs[0]) return 0;
    return (tripData.primaryRoute.legs[0].distance.value / 1000).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-gray-800 text-white">
      {/* Header with Glassmorphism */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="backdrop-blur-md bg-white/10 border-b border-white/20 p-4 shadow-2xl"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Traffic Officer Dashboard</h1>
              <p className="text-sm text-gray-300">Real-Time Ambulance Monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
              </motion.div>
            </AnimatePresence>
            {lastUpdate && (
              <p className="text-xs text-gray-400">
                Last update: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Sidebar - Status Panel */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-1 space-y-4"
        >
          {/* Ambulance Status Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Radio className="text-red-500" />
                  AMB-001
                </h2>
                <Badge 
                  variant={ambulanceData?.status === 'active' ? 'destructive' : 'secondary'}
                  className="animate-pulse"
                >
                  {ambulanceData?.status?.toUpperCase() || 'IDLE'}
                </Badge>
              </div>
              
              {ambulanceData ? (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Driver:</span>
                    <span className="font-semibold">John Smith</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Status:</span>
                    <span className="font-semibold text-green-400">On Route</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Last Contact:</span>
                    <span className="font-semibold">{lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'N/A'}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Waiting for ambulance data...</p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Live Metrics */}
          <AnimatePresence>
            {ambulanceData && tripData && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="space-y-3"
              >
                {/* Speed Card */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Card className="p-4 bg-gradient-to-br from-blue-600/90 to-blue-700/90 backdrop-blur-lg border border-blue-400/30 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-100 mb-1">Current Speed</p>
                        <p className="text-4xl font-bold">{ambulanceData.speed}</p>
                        <p className="text-xs text-blue-200 mt-1">km/h</p>
                      </div>
                      <Gauge className="w-14 h-14 opacity-40" />
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-400/30">
                      <div className="flex items-center gap-2 text-xs text-blue-100">
                        <TrendingUp className="w-3 h-3" />
                        <span>Avg: 45 km/h</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Distance Card */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Card className="p-4 bg-gradient-to-br from-orange-600/90 to-orange-700/90 backdrop-blur-lg border border-orange-400/30 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-100 mb-1">Distance</p>
                        <p className="text-4xl font-bold">{getDistance()}</p>
                        <p className="text-xs text-orange-200 mt-1">km remaining</p>
                      </div>
                      <MapPin className="w-14 h-14 opacity-40" />
                    </div>
                    <div className="mt-3 pt-3 border-t border-orange-400/30">
                      <p className="text-xs text-orange-100">To destination</p>
                    </div>
                  </Card>
                </motion.div>

                {/* ETA Card */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Card className="p-4 bg-gradient-to-br from-green-600/90 to-green-700/90 backdrop-blur-lg border border-green-400/30 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-100 mb-1">ETA</p>
                        <p className="text-4xl font-bold">{calculateETA()}</p>
                        <p className="text-xs text-green-200 mt-1">minutes</p>
                      </div>
                      <Clock className="w-14 h-14 opacity-40" />
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-400/30">
                      <p className="text-xs text-green-100">Estimated arrival</p>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Route Information */}
          {tripData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  Route Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-blue-500/20 rounded">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Primary Route</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-orange-500/20 rounded">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span>Shortcut Route</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-red-500/20 rounded">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Ambulance Position</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Map Area */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="lg:col-span-3"
        >
          <Card className="h-[calc(100vh-140px)] overflow-hidden shadow-2xl border-2 border-white/20 bg-white/5 backdrop-blur-sm">
            {ambulanceData ? (
              <GoogleMapComponent
                center={ambulanceData.location}
                zoom={14}
                ambulanceLocation={ambulanceData.location}
                primaryRoute={tripData?.primaryRoute}
                shortcutRoute={tripData?.shortcutRoute}
                destination={tripData?.destination}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center">
                  <Activity className="w-16 h-16 mx-auto mb-4 text-gray-600 animate-pulse" />
                  <p className="text-gray-400 text-lg">Waiting for ambulance to start...</p>
                  <p className="text-gray-500 text-sm mt-2">Map will load when trip is active</p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Bottom Alert Bar */}
      <AnimatePresence>
        {ambulanceData?.status === 'active' && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-red-600 text-white p-3 shadow-2xl"
          >
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 animate-pulse" />
                <span className="font-semibold">EMERGENCY IN PROGRESS</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span>Speed: {ambulanceData.speed} km/h</span>
                <span>•</span>
                <span>ETA: {calculateETA()} min</span>
                <span>•</span>
                <span>Distance: {getDistance()} km</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
