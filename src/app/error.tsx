"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/10">
          <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          We encountered an unexpected error. This might be due to a missing configuration or a temporary connection issue.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => reset()} variant="primary" className="flex-1">
            <RotateCcw className="w-5 h-5 mr-2" /> Try Again
          </Button>
          <Button onClick={() => window.location.href = "/"} variant="outline" className="flex-1">
            <Home className="w-5 h-5 mr-2" /> Back Home
          </Button>
        </div>
        
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-900 rounded-xl text-left overflow-auto max-h-40">
            <p className="text-xs font-mono text-red-500">{error.message}</p>
            {error.stack && <pre className="text-[10px] mt-2 opacity-50">{error.stack}</pre>}
          </div>
        )}
      </div>
    </div>
  );
}
