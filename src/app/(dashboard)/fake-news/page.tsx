"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ShieldAlert, Link as LinkIcon, Search, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { fakeNewsSchema, type FakeNewsInput } from "@/lib/validations";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { ScoreRing } from "@/components/ui/Badge";

export default function FakeNewsPage() {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    trustScore: number;
    verdict: "reliable" | "questionable" | "fake";
    explanation: string;
    flags: string[];
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FakeNewsInput>({
    resolver: zodResolver(fakeNewsSchema),
  });

  const onSubmit = async (data: FakeNewsInput) => {
    setIsChecking(true);
    setResult(null);

    // Simulate AI fact-checking
    setTimeout(() => {
      const isFake = Math.random() > 0.5;
      setResult({
        trustScore: isFake ? Math.floor(Math.random() * 40) : Math.floor(Math.random() * 40) + 60,
        verdict: isFake ? "fake" : "reliable",
        explanation: isFake 
          ? "This claim contains manipulated statistics and comes from an unverified source. Cross-referencing with official election commission data shows discrepancies."
          : "This statement is corroborated by multiple major news outlets and matches the official press release.",
        flags: isFake ? ["Sensationalist language", "Unverified source", "Statistical manipulation"] : [],
      });
      setIsChecking(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-purple-500" /> AI Fact Checker
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Paste political claims, news snippets, or URLs to verify their authenticity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card glass className="h-fit">
          <CardHeader>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-500" /> Input Content
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Textarea
                placeholder="Paste the text or URL here..."
                rows={6}
                {...register("content")}
                error={errors.content?.message}
                disabled={isChecking}
              />
              <Button type="submit" className="w-full" isLoading={isChecking}>
                {isChecking ? "Analyzing..." : "Verify Facts"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Area */}
        {result ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card glass className={`border-2 ${
              result.verdict === 'reliable' ? 'border-emerald-500/30 dark:border-emerald-500/30' :
              result.verdict === 'fake' ? 'border-red-500/30 dark:border-red-500/30' : 'border-amber-500/30 dark:border-amber-500/30'
            }`}>
              <CardHeader className="text-center pb-2">
                <h2 className="text-xl font-bold">Analysis Result</h2>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <ScoreRing score={result.trustScore} size={140} strokeWidth={10} className="mb-6" />
                
                <div className={`flex items-center gap-2 text-lg font-bold mb-4 ${
                  result.verdict === 'reliable' ? 'text-emerald-500' :
                  result.verdict === 'fake' ? 'text-red-500' : 'text-amber-500'
                }`}>
                  {result.verdict === 'reliable' && <CheckCircle className="w-6 h-6" />}
                  {result.verdict === 'fake' && <XCircle className="w-6 h-6" />}
                  {result.verdict === 'questionable' && <AlertTriangle className="w-6 h-6" />}
                  {result.verdict.toUpperCase()}
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl w-full text-sm text-gray-700 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-gray-700">
                  {result.explanation}
                </div>

                {result.flags.length > 0 && (
                  <div className="w-full mt-4 space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Red Flags Detected:</h3>
                    <ul className="space-y-1">
                      {result.flags.map((flag, idx) => (
                        <li key={idx} className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-800/30">
                          <AlertTriangle className="w-4 h-4" /> {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="hidden lg:flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl h-full text-gray-400">
            <ShieldAlert className="w-16 h-16 mb-4 opacity-20" />
            <p>Paste content and click "Verify Facts" to see the AI analysis here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
