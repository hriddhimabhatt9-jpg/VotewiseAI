/**
 * Accessibility Utilities
 * WCAG 2.1 Level AA compliance helpers
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

// Skip to content link
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] bg-blue-600 px-4 py-2 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-transform"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
}

// ARIA live region for announcements
export function Announcement({
  message,
  politeness = 'polite',
}: {
  message: string;
  politeness?: 'polite' | 'assertive';
}) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// Accessible button with loading state
export function AccessibleButton({
  children,
  isLoading,
  disabled,
  ariaLabel,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
      {isLoading && <span aria-hidden="true" className="ml-2">⏳</span>}
    </button>
  );
}

// Accessible form label
export function AccessibleLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium">
      {children}
      {required && (
        <span className="text-red-500" aria-label="required">
          {' '}
          *
        </span>
      )}
    </label>
  );
}

// Accessible focus trap for modals
export function useFocusTrap(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref]);
}

// Accessible heading hierarchy
export function Heading({
  level = 1,
  children,
  className = '',
  id,
}: {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const HeadingTag = (`h${level}` as keyof React.JSX.IntrinsicElements) as React.ElementType;

  const sizes = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base',
  };

  return (
    <HeadingTag id={id} className={`${sizes[level]} font-bold ${className}`}>
      {children}
    </HeadingTag>
  );
}

// Accessible form error display
export function FormError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;

  return (
    <div
      id={`${id}-error`}
      role="alert"
      className="mt-2 text-sm text-red-500 font-medium"
    >
      {error}
    </div>
  );
}

// Accessible input with ARIA
export function AccessibleInput({
  id,
  label,
  error,
  description,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  description?: string;
}) {
  const descIds = [description && `${id}-description`, error && `${id}-error`]
    .filter(Boolean)
    .join(' ');

  return (
    <div>
      {label && (
        <AccessibleLabel htmlFor={id!} required={required}>
          {label}
        </AccessibleLabel>
      )}
      {description && (
        <p id={`${id}-description`} className="text-sm text-gray-500">
          {description}
        </p>
      )}
      <input
        id={id}
        aria-describedby={descIds || undefined}
        aria-invalid={!!error}
        required={required}
        {...props}
      />
      <FormError id={id!} error={error} />
    </div>
  );
}

// Accessible tabs component
export function AccessibleTabs({
  tabs,
  defaultTab = 0,
}: {
  tabs: { label: string; content: React.ReactNode }[];
  defaultTab?: number;
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      setActiveTab((prev) => (prev - 1 + tabs.length) % tabs.length);
    } else if (event.key === 'ArrowRight') {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    } else if (event.key === 'Home') {
      setActiveTab(0);
    } else if (event.key === 'End') {
      setActiveTab(tabs.length - 1);
    }
  };

  return (
    <div>
      <div role="tablist" aria-label="Content tabs" className="flex border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`tabpanel-${index}`}
            id={`tab-${index}`}
            tabIndex={activeTab === index ? 0 : -1}
            onClick={() => setActiveTab(index)}
            onKeyDown={handleKeyDown}
            className={`px-4 py-2 ${
              activeTab === index
                ? 'border-b-2 border-blue-500 font-bold'
                : 'text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={index}
          role="tabpanel"
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
          hidden={activeTab !== index}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

// Accessible icon button
export function IconButton({
  icon,
  label,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      type="button"
      {...props}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}

// Font size scaler hook
export function useFontScaler() {
  const [scale, setScale] = useState(1);

  const increase = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.1, 1.5));
  }, []);

  const decrease = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.1, 0.8));
  }, []);

  const reset = useCallback(() => {
    setScale(1);
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${scale * 100}%`;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [scale]);

  return { scale, increase, decrease, reset };
}

// High contrast mode hook
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  const toggle = useCallback(() => {
    setIsHighContrast((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  return { isHighContrast, toggle };
}

// Export all for easy use
export const a11y = {
  SkipToContent,
  Announcement,
  AccessibleButton,
  AccessibleLabel,
  useFocusTrap,
  Heading,
  FormError,
  AccessibleInput,
  AccessibleTabs,
  IconButton,
  useFontScaler,
  useHighContrast,
};
