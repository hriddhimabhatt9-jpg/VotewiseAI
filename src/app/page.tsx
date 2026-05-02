"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Vote, ShieldCheck, BrainCircuit, Globe2, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";

const features = [
  {
    title: "AI Election Assistant",
    description: "Get answers to all your voting questions in your native language, 24/7.",
    icon: BrainCircuit,
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "Candidate Intelligence",
    description: "Deep insights into candidate backgrounds, education, and criminal records.",
    icon: ShieldCheck,
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "Fake News Detection",
    description: "Instantly verify political claims and news articles using our AI fact-checker.",
    icon: Globe2,
    color: "from-purple-400 to-pink-500",
  },
  {
    title: "Voting Simulator",
    description: "Practice voting in a simulated environment before the actual election day.",
    icon: Vote,
    color: "from-amber-400 to-orange-500",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-8 border border-blue-100 dark:border-blue-800 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            Your AI-Powered Civic Companion
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Vote Smart with <br className="hidden md:block" />
            <span className="gradient-text">VoteWise AI+</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Empowering citizens with AI-driven insights. Verify facts, understand candidates, and make informed decisions for a better democracy.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg rounded-full">
                Get Started Now <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-6 text-lg rounded-full">
                <Play className="w-5 h-5 mr-2" /> Watch Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to be an <span className="text-blue-600 dark:text-blue-400">informed voter</span></h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our comprehensive suite of tools ensures you have all the information necessary to make the best choice at the ballot box.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 card-shadow-hover"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to make your vote count?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
            Join thousands of smart voters using VoteWise AI+ today.
          </p>
          <Link href="/signup">
            <Button size="lg" className="px-10 py-6 text-lg rounded-full shadow-2xl">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
