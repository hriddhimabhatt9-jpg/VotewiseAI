"use client";

import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <h1 className="text-9xl font-black text-gray-200 dark:text-gray-900 select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shadow-xl">
              <Search className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Page not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="flex-1">
            <Button variant="primary" className="w-full">
              <Home className="w-5 h-5 mr-2" /> Back Home
            </Button>
          </Link>
          <Button variant="ghost" className="flex-1" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
