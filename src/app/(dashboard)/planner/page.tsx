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
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
              <div className="w-full h-full relative overflow-hidden">
                {/* Simplified Map UI */}
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute top-1/4 left-1/4 w-[1px] h-full bg-gray-300 dark:bg-gray-700 rotate-12" />
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-300 dark:bg-gray-700 -rotate-6" />
                  <div className="absolute top-0 right-1/3 w-[1px] h-full bg-gray-300 dark:bg-gray-700" />
                </div>

                {/* Path Animation */}
                <svg className="absolute inset-0 w-full h-full">
                  <motion.path
                    d="M 100 500 Q 300 400 400 200"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeDasharray="10 10"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </svg>

                {/* Markers */}
                <motion.div 
                  className="absolute bottom-[100px] left-[100px] flex flex-col items-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <div className="bg-white dark:bg-gray-900 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg mb-1 border dark:border-gray-800">Your Location</div>
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-xl ring-4 ring-blue-500/20" />
                </motion.div>

                <motion.div 
                  className="absolute top-[200px] right-[40%] flex flex-col items-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg mb-1">Polling Booth KV No.1</div>
                  <MapPin className="w-10 h-10 text-emerald-600 drop-shadow-xl" />
                </motion.div>
              </div>
            </div>

            {/* Map Overlay Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 shadow-xl border dark:border-gray-800 flex items-center justify-center text-gray-500 hover:text-blue-500">
                <Info className="w-5 h-5" />
              </button>
            </div>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm">
              <Card glass className="bg-white/90 dark:bg-gray-900/90 border-blue-500/20">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Estimated Arrival</p>
                    <p className="text-xl font-black">12:45 PM <span className="text-sm font-medium text-emerald-500">(On Time)</span></p>
                  </div>
                  <Button variant="primary" size="sm">Go Live</Button>
                </CardContent>
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
