"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import { useThemeStore } from "@/store";
import { cn } from "@/lib/utils";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-transparent" />;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen transition-colors duration-300">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            className: "toast-custom dark:bg-gray-800 dark:text-white border dark:border-gray-700",
          }}
        />
      </div>
    </ThemeProvider>
  );
}
