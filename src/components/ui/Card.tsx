"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
  as?: "article" | "section" | "div";
  "aria-label"?: string;
}

export function Card({
  children,
  className,
  hover = false,
  glass = false,
  onClick,
  as: Component = "div",
  "aria-label": ariaLabel,
}: CardProps) {
  return (
    <Component
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      aria-label={ariaLabel}
      className={cn(
        "rounded-2xl border transition-all duration-300",
        glass
          ? "bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-white/20 dark:border-gray-700/30"
          : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800",
        hover && "hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 cursor-pointer",
        onClick && "cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
        className
      )}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 pt-6 pb-2", className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 pb-6 pt-2", className)}>{children}</div>;
}
