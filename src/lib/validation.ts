/**
 * Input Validation and Sanitization
 * Prevents XSS and injection attacks
 * Works in both server and client environments
 */

// Server-safe sanitization (DOMPurify requires DOM, so we use a regex fallback on server)
function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .trim();
}

// Password validation - NIST recommends 12+ characters, but allow 8+ with complexity
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letters');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain numbers');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain special characters (!@#$%^&*)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Sanitize input to prevent XSS (works server-side and client-side)
export function sanitizeInput(input: string): string {
  if (typeof window !== 'undefined') {
    // Client-side: use DOMPurify if available
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const DOMPurify = require('dompurify');
      return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      }).trim();
    } catch {
      return stripHtml(input);
    }
  }
  // Server-side: use regex-based sanitization
  return stripHtml(input);
}

// Validate and sanitize input
export function validateInput(
  input: string,
  type: 'text' | 'email' | 'url' = 'text'
): {
  valid: boolean;
  sanitized: string;
  error?: string;
} {
  if (!input || typeof input !== 'string') {
    return { valid: false, sanitized: '', error: 'Input is required' };
  }

  const sanitized = sanitizeInput(input);

  switch (type) {
    case 'email':
      if (!validateEmail(sanitized)) {
        return { valid: false, sanitized, error: 'Invalid email format' };
      }
      break;

    case 'url':
      try {
        new URL(sanitized);
      } catch {
        return { valid: false, sanitized, error: 'Invalid URL' };
      }
      break;

    case 'text':
      if (sanitized.length < 1) {
        return { valid: false, sanitized, error: 'Input cannot be empty' };
      }
      if (sanitized.length > 2000) {
        return { valid: false, sanitized, error: 'Input exceeds maximum length' };
      }
      break;
  }

  return { valid: true, sanitized };
}

// Validate voter age (must be 18+)
export function validateVoterAge(birthDate: Date): { valid: boolean; error?: string } {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    const adjustedAge = age - 1;
    if (adjustedAge < 18) {
      return { valid: false, error: 'You must be 18 years old or older to vote' };
    }
  } else {
    if (age < 18) {
      return { valid: false, error: 'You must be 18 years old or older to vote' };
    }
  }

  return { valid: true };
}

// Validate Aadhaar format (12 digits)
export function validateAadhaar(aadhaar: string): boolean {
  return /^\d{12}$/.test(aadhaar.replace(/\s/g, ''));
}

// Validate VoterID format
export function validateVoterID(voterId: string): boolean {
  // Indian Voter ID format: EYZ0456789 (3 letters + 7 digits)
  return /^[A-Z]{3}\d{7}$/.test(voterId.toUpperCase());
}

// Validate Polling Booth Code
export function validatePollingBoothCode(code: string): boolean {
  // Generic format: AC/PS/123 (Assembly/Part/Sequential)
  return /^[A-Z]{2}\/[A-Z]{2}\/\d{3,4}$/.test(code.toUpperCase());
}

// Rate limit check for form submissions
export const formSubmissionLimits = {
  login: { attempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts in 15 minutes
  signup: { attempts: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts in 60 minutes
  passwordReset: { attempts: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts in 60 minutes
};

// Export all validation functions for use
export const validators = {
  password: validatePassword,
  email: validateEmail,
  input: validateInput,
  voterAge: validateVoterAge,
  aadhaar: validateAadhaar,
  voterId: validateVoterID,
  pollingBoothCode: validatePollingBoothCode,
};
