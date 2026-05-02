"use client";

import { motion } from "framer-motion";
import { 
  Trophy, 
  Medal, 
  TrendingUp, 
  Star, 
  Users,
  Award,
  ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Badge";
import { Badge } from "@/components/ui/Badge";
import { useLangStore, useAuthStore } from "@/store";
import { translations } from "@/lib/data";

const leaderboardData = [
  { id: "1", name: "Ananya Iyer", xp: 12450, level: 42, badge: "Master Voter", avatar: "https://i.pravatar.cc/150?u=11" },
  { id: "2", name: "Vikram Singh", xp: 10200, level: 38, badge: "Civic Hero", avatar: "https://i.pravatar.cc/150?u=12" },
  { id: "3", name: "Rahul Sharma", xp: 9800, level: 35, badge: "Informed Citizen", avatar: "https://i.pravatar.cc/150?u=13" },
  { id: "4", name: "Priya Patel", xp: 8600, level: 31, badge: "Informed Citizen", avatar: "https://i.pravatar.cc/150?u=14" },
  { id: "5", name: "Siddharth Malhotra", xp: 7200, level: 28, badge: "Rising Star", avatar: "https://i.pravatar.cc/150?u=15" },
  { id: "6", name: "Kavita Devi", xp: 6800, level: 26, badge: "Rising Star", avatar: "https://i.pravatar.cc/150?u=16" },
  { id: "7", name: "Arjun Kapoor", xp: 5400, level: 22, badge: "Voter Explorer", avatar: "https://i.pravatar.cc/150?u=17" },
];

export default function LeaderboardPage() {
  const { lang } = useLangStore();
  const { user } = useAuthStore();
  const t = translations[lang];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" /> {t.leaderboard}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          See how your civic engagement stacks up against other informed voters in India.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Top 3 Podium */}
        {leaderboardData.slice(0, 3).map((player, idx) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card glass className={`relative overflow-hidden ${idx === 0 ? "border-yellow-500/50 shadow-yellow-500/10" : ""}`}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="absolute top-2 right-2">
                  <Medal className={`w-8 h-8 ${
                    idx === 0 ? "text-yellow-500" : idx === 1 ? "text-gray-400" : "text-amber-600"
                  }`} />
                </div>
                <div className="relative mb-4">
                  <Avatar src={player.avatar} name={player.name} size="lg" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                    #{idx + 1}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1">{player.name}</h3>
                <Badge variant="outline" className="mb-3">{player.badge}</Badge>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl p-3 flex justify-between items-center">
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
                    <Star className="w-4 h-4" /> {player.xp} XP
                  </div>
                  <div className="text-gray-500 text-sm font-medium">Lvl {player.level}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Full List */}
      <Card glass>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {leaderboardData.slice(3).map((player, idx) => (
              <div key={player.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <div className="w-8 text-center font-bold text-gray-400">#{idx + 4}</div>
                <Avatar src={player.avatar} name={player.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{player.name}</p>
                  <p className="text-xs text-gray-500">{player.badge}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600 dark:text-blue-400">{player.xp} XP</p>
                  <p className="text-xs text-gray-500">Level {player.level}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            ))}
            
            {/* Current User Row */}
            <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 flex items-center gap-4 border-t-2 border-blue-500/20">
              <div className="w-8 text-center font-bold text-blue-600">#42</div>
              <Avatar src={user?.photoURL} name={user?.fullName || "You"} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">You ({user?.fullName || "Voter"})</p>
                <p className="text-xs text-gray-500">Rising Star</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600 dark:text-blue-400">1,240 XP</p>
                <p className="text-xs text-gray-500">Level 5</p>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
