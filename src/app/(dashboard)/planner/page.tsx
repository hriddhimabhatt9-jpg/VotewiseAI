"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Map as MapIcon, 
  Navigation, 
  Search, 
  Calendar, 
  Clock, 
  Info,
  MapPin,
  Car,
  Footprints,
  TrainFront,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useLangStore } from "@/store";
import { translations } from "@/lib/data";
import LiveBoothMap from "@/components/maps/LiveBoothMap";

export default function PlannerPage() {
  const { lang } = useLangStore();
  const t = translations[lang];
  const [activeTransport, setActiveTransport] = useState("car");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <MapIcon className="w-8 h-8 text-blue-500" /> {t.votePlanner}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find your polling booth, check queue wait times, and plan your route for election day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Controls */}
        <div className="space-y-6">
          <Card glass>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-500" /> Find Polling Booth
              </h3>
              <Input placeholder="Enter EPIC Number or Address" />
              <Button variant="primary" className="w-full">Search Booth</Button>
            </CardContent>
          </Card>

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

          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-500 px-2 uppercase tracking-wider">Navigation Mode</p>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setActiveTransport("car")}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                  activeTransport === "car" 
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30" 
                    : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500"
                }`}
              >
                <Car className="w-6 h-6" />
                <span className="text-[10px] font-bold">12m</span>
              </button>
              <button 
                onClick={() => setActiveTransport("walk")}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                  activeTransport === "walk" 
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30" 
                    : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500"
                }`}
              >
                <Footprints className="w-6 h-6" />
                <span className="text-[10px] font-bold">45m</span>
              </button>
              <button 
                onClick={() => setActiveTransport("train")}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                  activeTransport === "train" 
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30" 
                    : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500"
                }`}
              >
                <TrainFront className="w-6 h-6" />
                <span className="text-[10px] font-bold">25m</span>
              </button>
            </div>
            <Button variant="outline" className="w-full h-12 rounded-2xl group">
              Start Navigation <Navigation className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="lg:col-span-2 relative">
          <Card glass className="h-full min-h-[600px] overflow-hidden border-2 border-white dark:border-gray-800 shadow-2xl">
            <LiveBoothMap />
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm pointer-events-auto">
              <Card glass className="bg-white/90 dark:bg-gray-900/90 border-blue-500/20">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Estimated Arrival</p>
                    <p className="text-xl font-black">12:45 PM <span className="text-sm font-medium text-emerald-500">(On Time)</span></p>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=28.5634,77.1724`, '_blank')}>
                    Go Live
                  </Button>
                </CardContent>
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
