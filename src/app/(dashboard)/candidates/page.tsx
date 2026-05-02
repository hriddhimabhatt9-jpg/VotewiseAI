"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, GraduationCap, ShieldAlert, Briefcase, ChevronRight, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import { candidatesData, translations } from "@/lib/data";
import { useLangStore } from "@/store";

export default function CandidatesPage() {
  const { lang } = useLangStore();
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCandidates = candidatesData.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.party.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-500" /> {t.candidates}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">AI-powered insights into candidates running in your constituency.</p>
        </div>
        <div className="w-full md:w-72">
          <Input 
            placeholder="Search by name or party..." 
            icon={<Search className="w-5 h-5" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCandidates.map((candidate, idx) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card glass className="h-full hover:border-blue-500/30 transition-colors overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Candidate Header */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <img 
                      src={candidate.image} 
                      alt={candidate.name} 
                      className="w-24 h-24 rounded-2xl object-cover shadow-md border-2 border-white dark:border-gray-800"
                    />
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-2xl shadow-inner">
                      {candidate.partySymbol}
                    </div>
                  </div>

                  {/* Candidate Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h2 className="text-xl font-bold">{candidate.name}</h2>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{candidate.party}</p>
                      </div>
                      <Badge variant={candidate.trustScore > 80 ? "success" : candidate.trustScore > 60 ? "warning" : "danger"}>
                        AI Trust: {candidate.trustScore}/100
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 mb-4 italic">
                      "{candidate.summary}"
                    </p>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                        <span className="font-medium truncate">{candidate.education}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Age: {candidate.age}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldAlert className={`w-4 h-4 ${candidate.criminalCases === 0 ? "text-emerald-500" : "text-red-500"}`} />
                        <span className="font-medium">{candidate.criminalCases} Criminal Cases</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span className="font-bold text-gray-500">₹</span>
                        <span className="font-medium">Assets: {candidate.assets}</span>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <Button variant="outline" size="sm" className="flex-1">Full Profile</Button>
                      <Button variant="primary" size="sm" className="flex-1">Compare</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
