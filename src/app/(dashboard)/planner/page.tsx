"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Map as MapIcon, 
  Navigation, 
  Search, 
  Calendar, 
  Clock, 
  MapPin,
  Car,
  Footprints,
  TrainFront,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useLangStore } from "@/store";
import { translations } from "@/lib/data";
import MapView from "@/components/maps/MapView";

// Const types for efficiency
type TransportMode = 'DRIVING' | 'WALKING' | 'TRANSIT';

const BOOTH_LOCATION = { lat: 28.5634, lng: 77.1724 }; // KV No. 1, RK Puram

export default function PlannerPage() {
  const { lang } = useLangStore();
  const t = translations[lang];
  const [activeTransport, setActiveTransport] = useState<TransportMode>("DRIVING");
  const [isNavigating, setIsNavigating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize travel times for UI consistency
  const travelTimes = useMemo(() => ({
    DRIVING: "12m",
    WALKING: "45m",
    TRANSIT: "25m"
  }), []);

  const handleStartNavigation = () => {
    setIsNavigating(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <MapIcon className="w-8 h-8 text-blue-500" /> {t.votePlanner}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find your polling booth, check queue wait times, and plan your route for election day.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Controls */}
        <div className="space-y-6">
          <Card glass>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-500" /> Find Polling Booth
              </h3>
              <Input 
                placeholder="Enter EPIC Number or Address" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="primary" className="w-full" onClick={() => setSearchQuery("KV No. 1, RK Puram")}>
                Search Booth
              </Button>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card glass className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">Your Booth: KV No. 1</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sector 12, RK Puram, New Delhi - 110022</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" /> Voting Day
                    </span>
                    <span className="font-bold">25 May 2026</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" /> Queue Wait
                    </span>
                    <Badge variant="success">Short (~15 mins)</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-500 px-2 uppercase tracking-wider">Navigation Mode</p>
            <div className="grid grid-cols-3 gap-2">
              {(['DRIVING', 'WALKING', 'TRANSIT'] as TransportMode[]).map((mode) => (
                <button 
                  key={mode}
                  onClick={() => setActiveTransport(mode)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                    activeTransport === mode 
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30" 
                      : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500 hover:border-blue-300"
                  }`}
                >
                  {mode === 'DRIVING' && <Car className="w-6 h-6" />}
                  {mode === 'WALKING' && <Footprints className="w-6 h-6" />}
                  {mode === 'TRANSIT' && <TrainFront className="w-6 h-6" />}
                  <span className="text-[10px] font-bold">{travelTimes[mode]}</span>
                </button>
              ))}
            </div>
            <Button 
              variant={isNavigating ? "secondary" : "outline"} 
              className="w-full h-12 rounded-2xl group"
              onClick={handleStartNavigation}
            >
              {isNavigating ? "Navigation Active" : "Start Navigation"} 
              <Navigation className={cn(
                "w-4 h-4 ml-2 transition-transform",
                !isNavigating && "group-hover:translate-x-1 group-hover:-translate-y-1"
              )} />
            </Button>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="lg:col-span-2 relative">
          <Card glass className="h-full min-h-[600px] overflow-hidden border-2 border-white dark:border-gray-800 shadow-2xl">
            <MapView height="600px" />
            
            {isNavigating && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm pointer-events-auto"
              >
                <Card glass className="bg-white/90 dark:bg-gray-900/90 border-blue-500/20 shadow-2xl backdrop-blur-md">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Estimated Arrival</p>
                      <p className="text-xl font-black text-gray-900 dark:text-white">12:45 PM <span className="text-sm font-medium text-emerald-500">(On Time)</span></p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${BOOTH_LOCATION.lat},${BOOTH_LOCATION.lng}&travelmode=${activeTransport.toLowerCase()}`, '_blank')}>
                        Open App
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setIsNavigating(false)}>
                        Exit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper for class names
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
