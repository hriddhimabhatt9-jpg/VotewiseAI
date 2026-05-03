/**
 * Performance Optimization Utilities
 * Includes caching, code splitting, and data fetching strategies
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import useSWR from 'swr';
import dynamic from 'next/dynamic';

// API Fetcher with error handling
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('API request failed');
  }
  return res.json();
};

// Hook for API calls with caching
export function useFetcher<T = unknown>(url: string | null) {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
    focusThrottleInterval: 300000, // 5 minutes
    errorRetryCount: 3,
    errorRetryInterval: 5000,
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

// Local Storage caching utility
export const cache = {
  set: (key: string, value: unknown, ttl: number = 3600000) => {
    if (typeof window === 'undefined') return;
    const now = new Date().getTime();
    const item = {
      value,
      expiry: now + ttl,
    };
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch {
      // localStorage may be full or unavailable
    }
  },

  get: <T = unknown>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const now = new Date().getTime();

      if (now > parsed.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.value as T;
    } catch {
      return null;
    }
  },

  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};

// Lazy loading utility for components
export function lazyLoad<T extends React.ComponentType<unknown>>(
  importStatement: () => Promise<{ default: T }>,
  { ssr = true } = {}
) {
  return dynamic(() => importStatement(), {
    ssr,
    loading: () => (
      <div className="flex items-center justify-center p-8" role="status" aria-label="Loading">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    ),
  });
}

// Memory usage optimization
export function useDebounceCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: unknown[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

// Intersection Observer for lazy loading images
export function useIntersectionObserver(ref: React.RefObject<HTMLElement | null>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref]);

  return isVisible;
}

// Performance monitoring
export function reportWebVitals(metric: { name: string; value: number }) {
  // Send to analytics service
  if (typeof window !== 'undefined') {
    // Only log in browser environment
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(`[Web Vital] ${metric.name}:`, metric.value);
    }
  }
}
