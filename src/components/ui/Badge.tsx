"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "premium";
  size?: "sm" | "md";
  className?: string;
}

export const Badge = React.memo(({ children, variant = "default", size = "sm", className }: BadgeProps) => {
  const variants = {
    default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    danger: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800",
    info: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    premium: "bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-full border transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "blue" | "green" | "amber" | "red" | "purple";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar = React.memo(({
  value,
  max = 100,
  color = "blue",
  size = "md",
  showLabel = false,
  className,
}: ProgressBarProps) => {
  const percentage = useMemo(() => Math.min((value / max) * 100, 100), [value, max]);

  const colors = {
    blue: "from-blue-400 to-indigo-500",
    green: "from-emerald-400 to-teal-500",
    amber: "from-amber-400 to-orange-500",
    red: "from-red-400 to-rose-500",
    purple: "from-violet-400 to-purple-500",
  };

  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div
      className={cn("w-full", className)}
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress: ${Math.round(percentage)}%`}
    >
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Progress</span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden",
          sizes[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out",
            colors[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Avatar = React.memo(({ src, name, size = "md", className }: AvatarProps) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
  };

  const initials = useMemo(() => 
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  , [name]);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover ring-2 ring-white dark:ring-gray-800", sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center font-bold text-white ring-2 ring-white dark:ring-gray-800",
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
});

Avatar.displayName = "Avatar";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const ScoreRing = React.memo(({ score, size = 120, strokeWidth = 8, className }: ScoreRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = useMemo(() => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#3b82f6";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  }, [score]);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Score: ${score} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100 dark:text-gray-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center" aria-hidden="true">
        <span className="text-2xl font-bold text-gray-800 dark:text-white">{score}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">/ 100</span>
      </div>
    </div>
  );
});

ScoreRing.displayName = "ScoreRing";
