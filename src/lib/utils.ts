import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export function isEligibleToVote(dob: Date): boolean {
  return calculateAge(dob) >= 18;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getReadinessScore(profile: {
  name?: string;
  dob?: string;
  address?: string;
  constituency?: string;
  voterId?: string;
  isRegistered?: boolean;
  quizScore?: number;
}): number {
  let score = 0;
  const weights = {
    name: 10,
    dob: 10,
    address: 15,
    constituency: 15,
    voterId: 15,
    isRegistered: 20,
    quizScore: 15,
  };

  if (profile.name) score += weights.name;
  if (profile.dob) score += weights.dob;
  if (profile.address) score += weights.address;
  if (profile.constituency) score += weights.constituency;
  if (profile.voterId) score += weights.voterId;
  if (profile.isRegistered) score += weights.isRegistered;
  if (profile.quizScore) score += Math.min(weights.quizScore, (profile.quizScore / 100) * weights.quizScore);

  return Math.round(score);
}
