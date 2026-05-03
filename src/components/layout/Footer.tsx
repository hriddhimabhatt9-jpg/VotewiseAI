"use client";

import Link from "next/link";
import { Vote, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                VoteWise AI+
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Empowering citizens with AI-driven voter education, election insights, and civic participation tools.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
            <ul className="space-y-2.5">
              {["AI Chatbot", "Candidate Info", "Fake News Check", "Vote Planner"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {["Voter Registration", "Election Calendar", "FAQs", "API Docs"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact Us"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> for democracy
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} VoteWise AI+. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
