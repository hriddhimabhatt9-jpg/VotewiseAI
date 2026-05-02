"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store";

import { candidatesData as mockCandidates } from "@/lib/data";

type MachineState = "idle" | "verifying" | "voting" | "confirming" | "success";

export default function SimulatorPage() {
  const { user } = useAuthStore();
  const [state, setState] = useState<MachineState>("idle");
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  const handleStart = () => {
    setState("verifying");
    setTimeout(() => {
      setState("voting");
    }, 2000);
  };

  const handleVote = (id: string) => {
    setSelectedCandidate(id);
    setState("confirming");
  };

  const handleConfirm = () => {
    setState("success");
    // In a real app, we would award XP here
  };

  const handleReset = () => {
    setState("idle");
    setSelectedCandidate(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Gamepad2 className="w-8 h-8 text-amber-500" /> Voting Simulator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Practice the voting process in a secure, simulated environment.</p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center max-w-lg"
            >
              <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Gamepad2 className="w-12 h-12 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Ready to practice?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Experience the exact interface you'll see on election day. Learn how to verify your identity, select a candidate, and confirm your choice on the EVM/VVPAT simulator.
              </p>
              <Button size="lg" onClick={handleStart} className="w-full sm:w-auto px-10">
                Start Simulation <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {state === "verifying" && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold mb-2">Verifying Identity...</h2>
              <p className="text-gray-500">Checking voter rolls for {user?.fullName || "voter"}</p>
            </motion.div>
          )}

          {state === "voting" && (
            <motion.div
              key="voting"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-2xl"
            >
              <Card glass className="border-2 border-gray-300 dark:border-gray-700 shadow-2xl overflow-hidden bg-gray-50 dark:bg-gray-900">
                <div className="bg-gray-200 dark:bg-gray-800 p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
                  <span className="font-mono text-sm font-bold text-gray-500">BALLOT UNIT SIMULATOR</span>
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                </div>
                <div className="p-6 space-y-3">
                  {mockCandidates.map((c, i) => (
                    <div key={c.id} className="flex items-stretch bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden h-20">
                      <div className="w-16 flex items-center justify-center border-r border-gray-300 dark:border-gray-700 font-bold text-xl text-gray-400">
                        {i + 1}
                      </div>
                      <div className="flex-1 px-4 py-2 flex flex-col justify-center">
                        <span className="font-bold text-lg">{c.name}</span>
                        <span className="text-sm text-gray-500">{c.party}</span>
                      </div>
                      <div className="w-20 flex items-center justify-center border-l border-gray-300 dark:border-gray-700 text-3xl">
                        {c.partySymbol}
                      </div>
                      <div className="w-24 bg-gray-100 dark:bg-gray-900 border-l border-gray-300 dark:border-gray-700 flex items-center justify-center">
                        <button
                          onClick={() => handleVote(c.id)}
                          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-[inset_0_-4px_0_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.4)] active:shadow-[inset_0_2px_0_rgba(0,0,0,0.3)] active:translate-y-1 transition-all duration-75 flex items-center justify-center"
                        >
                           <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {state === "confirming" && (
            <motion.div
              key="confirming"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-md w-full"
            >
              <Card glass className="overflow-hidden">
                <div className="bg-gray-900 text-white p-4 font-mono">
                  VVPAT SLIP PRINTER
                </div>
                <CardContent className="p-8 flex flex-col items-center">
                  <div className="w-full bg-white text-black p-6 font-mono text-center border-2 border-dashed border-gray-300 mb-8 shadow-inner">
                    <div className="text-4xl mb-4">{mockCandidates.find(c => c.id === selectedCandidate)?.partySymbol}</div>
                    <div className="font-bold text-xl mb-1">{mockCandidates.find(c => c.id === selectedCandidate)?.name}</div>
                    <div className="text-sm">{mockCandidates.find(c => c.id === selectedCandidate)?.party}</div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Please verify that the printed slip matches your selection. The slip will be visible for 7 seconds before falling into the secure drop box.
                  </p>

                  <div className="flex gap-4 w-full">
                    <Button variant="outline" className="flex-1" onClick={() => setState("voting")}>
                      Go Back
                    </Button>
                    <Button variant="primary" className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleConfirm}>
                      Confirm Vote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {state === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-md"
            >
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Simulation Complete!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                You have successfully learned how to cast your vote.
              </p>
              <p className="text-purple-600 dark:text-purple-400 font-bold mb-8">
                +100 XP Earned!
              </p>
              <Button variant="outline" onClick={handleReset} className="w-full">
                Practice Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
