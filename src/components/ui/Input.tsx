"use client";

import React, { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id: propId, ...props }, ref) => {
    const generatedId = useId();
    const inputId = propId || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "w-full rounded-xl border bg-white dark:bg-gray-900 px-4 py-3 text-sm transition-all duration-200",
              "border-gray-200 dark:border-gray-700",
              "focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              "dark:text-white",
              icon && "pl-11",
              error && "border-red-400 focus:border-red-400 focus:ring-red-400/20",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-xs text-red-500 flex items-center gap-1" role="alert">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id: propId, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = propId || generatedId;
    const errorId = `${textareaId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full rounded-xl border bg-white dark:bg-gray-900 px-4 py-3 text-sm transition-all duration-200",
            "border-gray-200 dark:border-gray-700",
            "focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "dark:text-white resize-none",
            error && "border-red-400 focus:border-red-400 focus:ring-red-400/20",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
