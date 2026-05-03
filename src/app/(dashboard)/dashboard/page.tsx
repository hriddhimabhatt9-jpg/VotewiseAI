"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore, useLangStore } from "@/store";
import { translations } from "@/lib/data";
import { getReadinessScore } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge, ProgressBar, ScoreRing } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ChevronRight, AlertCircle, Calendar, MapPin, Trophy } from "lucide-react";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/maps/MapView"), { ssr: false });

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const { lang } = useLangStore();
  const t = translations[lang];

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const readinessScore = getReadinessScore({
    name: user.fullName,
    dob: user.dob,
    address: user.address,
    constituency: user.constituency,
    voterId: user.voterId,
    isRegistered: user.isRegistered,
    quizScore: user.quizScore,
  });

  const nextSteps = [];
  if (!user.isRegistered) nextSteps.push({ title: lang === "hi" ? "मतदान के लिए पंजीकरण करें" : "Register to Vote", link: "/profile", icon: AlertCircle, color: "text-red-500" });
  if (!user.voterId) nextSteps.push({ title: lang === "hi" ? "वोटर आईडी जोड़ें" : "Add Voter ID", link: "/profile", icon: AlertCircle, color: "text-amber-500" });
  if (!user.constituency) nextSteps.push({ title: lang === "hi" ? "निर्वाचन क्षेत्र सेट करें" : "Set Constituency", link: "/profile", icon: MapPin, color: "text-amber-500" });
  
  if (nextSteps.length === 0) {
    nextSteps.push({ title: lang === "hi" ? "चुनाव प्रश्नोत्तरी लें" : "Take Election Quiz", link: "/simulator", icon: Trophy, color: "text-blue-500" });
    nextSteps.push({ title: lang === "hi" ? "उम्मीदवारों पर शोध करें" : "Research Candidates", link: "/candidates", icon: CheckCircle2, color: "text-emerald-500" });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">{t.welcome}, {user.fullName?.split(' ')[0] || 'Voter'} 👋</h1>
        <p className="text-gray-600 dark:text-gray-400">Here's your election readiness overview.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Readiness Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card glass className="h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trophy className="w-24 h-24" />
            </div>
            <CardHeader>
              <h2 className="text-lg font-semibold">{t.readiness}</h2>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <ScoreRing score={readinessScore} size={160} strokeWidth={12} className="mb-6" />
              <Badge variant={readinessScore >= 80 ? "success" : readinessScore >= 50 ? "warning" : "danger"} size="md" className="mb-2">
                {readinessScore >= 80 ? (lang === "hi" ? "उत्कृष्ट" : "Excellent") : readinessScore >= 50 ? (lang === "hi" ? "सुधार की आवश्यकता है" : "Needs Improvement") : (lang === "hi" ? "कार्रवाई आवश्यक है" : "Action Required")}
              </Badge>
              <p className="text-sm text-center text-gray-500 mt-4">
                Complete your profile and quizzes to increase your score.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Items & Next Steps */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 flex flex-col gap-8"
        >
          <Card glass>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">{t.actionItems}</h2>
              <Badge variant="info">{nextSteps.length} {lang === "hi" ? "लंबित" : "Pending"}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg bg-white dark:bg-gray-900 shadow-sm ${step.color}`}>
                        <step.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{step.title}</h3>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => router.push(step.link)}>
                      {lang === "hi" ? "समाधान करें" : "Resolve"} <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gamification Progress */}
          <Card glass>
            <CardContent className="py-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{t.level}: {user.level}</h2>
                  <p className="text-sm text-gray-500">{user.xp} / {user.level * 500} XP to next level</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  L{user.level}
                </div>
              </div>
              <ProgressBar value={user.xp} max={user.level * 500} color="purple" size="lg" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Polling Booth Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Card glass>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">{lang === "hi" ? "मतदान केंद्र" : "Nearby Polling Booths"}</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push("/planner")}>
              {lang === "hi" ? "पूर्ण मानचित्र" : "Full Map"} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <MapView height="350px" />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
