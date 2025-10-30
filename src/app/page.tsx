"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Radio, 
  Activity, 
  MapPin, 
  Navigation, 
  Clock, 
  TrendingUp,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Header */}
        <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
          <motion.div
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="bg-red-600 p-3 rounded-xl shadow-lg">
              <Radio className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Emergency Response
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Live Tracking System
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            className="flex items-center gap-2"
          >
            <Badge variant="outline" className="px-3 py-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              System Online
            </Badge>
          </motion.div>
        </nav>

        {/* Hero Content */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="mb-6 px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                🚨 Advanced Emergency Response System
              </Badge>
            </motion.div>

            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Ambulance Live Tracking &<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                Route Management
              </span>
            </motion.h2>

            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
            >
              Real-time GPS tracking with dual route calculation, live officer monitoring, 
              and emergency-optimized navigation powered by Google Maps API.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/driver">
                <Button 
                  size="lg" 
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg group"
                >
                  <Radio className="mr-2 group-hover:animate-pulse" />
                  Driver Interface
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/officer">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-8 py-6 text-lg group"
                >
                  <Activity className="mr-2 group-hover:animate-pulse" />
                  Officer Dashboard
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Key Features
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Built with modern technology for critical emergency response
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-blue-200 dark:border-blue-800 h-full">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Dual Route Calculation
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Primary and shortcut routes displayed simultaneously with 
                color-coded polylines for optimal decision making.
              </p>
            </Card>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="p-6 bg-gradient-to-br from-red-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-red-200 dark:border-red-800 h-full">
              <div className="bg-red-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Real-Time GPS Tracking
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Live ambulance location updates with animated markers and 
                pulse effects for enhanced visibility.
              </p>
            </Card>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-green-200 dark:border-green-800 h-full">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Dynamic ETA Updates
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Automatic ETA recalculation based on current speed, traffic 
                conditions, and distance remaining.
              </p>
            </Card>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-purple-200 dark:border-purple-800 h-full">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Officer Monitoring
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Glassmorphism dashboard with Firebase real-time database 
                integration for instant updates.
              </p>
            </Card>
          </motion.div>

          {/* Feature 5 */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-orange-200 dark:border-orange-800 h-full">
              <div className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                High Performance
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Built with Next.js 15, React, and Framer Motion for smooth 
                animations and instant page transitions.
              </p>
            </Card>
          </motion.div>

          {/* Feature 6 */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="p-6 bg-gradient-to-br from-cyan-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-cyan-200 dark:border-cyan-800 h-full">
              <div className="bg-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Reliable & Secure
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Firebase backend with secure data transmission and automatic 
                reconnection handling.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Technology Stack</h3>
            <p className="text-gray-300">
              Powered by industry-leading technologies
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Next.js 15', icon: '⚡' },
              { name: 'React', icon: '⚛️' },
              { name: 'TypeScript', icon: '📘' },
              { name: 'Tailwind CSS', icon: '🎨' },
              { name: 'Framer Motion', icon: '✨' },
              { name: 'Firebase', icon: '🔥' },
              { name: 'Google Maps', icon: '🗺️' },
              { name: 'Shadcn/UI', icon: '🎭' },
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-3">{tech.icon}</div>
                <p className="font-semibold">{tech.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-3xl p-12 text-center"
        >
          <h3 className="text-4xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 text-red-100">
            Choose your interface and experience real-time emergency tracking
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/driver">
              <Button 
                size="lg" 
                className="bg-white text-red-600 hover:bg-gray-100 px-8 py-6 text-lg"
              >
                Launch Driver Interface
              </Button>
            </Link>
            <Link href="/officer">
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/20 px-8 py-6 text-lg"
              >
                Open Officer Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p className="flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Built with Next.js, React, Firebase, and Google Maps API
          </p>
        </div>
      </footer>
    </div>
  );
}