/**
 * Environment Variable Validation
 * Validates required env vars at startup and provides typed access.
 * ⚠️ Never import this file on the client for server-only vars.
 */

/** Public (client-safe) env vars */
export function getPublicEnv() {
  return {
    FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
    FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
    FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
    FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
    FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
    FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
    FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '',
    GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  } as const;
}

/** Server-only env vars — NEVER expose to client */
export function getServerEnv() {
  return {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
    GOOGLE_TRANSLATE_API_KEY: process.env.GOOGLE_TRANSLATE_API_KEY ?? '',
    GOOGLE_VISION_API_KEY: process.env.GOOGLE_VISION_API_KEY ?? '',
    GOOGLE_MAPS_API_KEY:
      process.env.GOOGLE_MAPS_API_KEY ??
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    AUTH_SECRET: process.env.AUTH_SECRET ?? '',
    NODE_ENV: process.env.NODE_ENV ?? 'development',
  } as const;
}

/**
 * Validates that critical env vars are set.
 * Call during build / server startup (e.g. in instrumentation.ts).
 */
export function validateEnv(): { valid: boolean; missing: string[] } {
  const required = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  ];

  const warnings = [
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variables:\n${missing.map((k) => `  • ${k}`).join('\n')}`
    );
  }

  const missingWarnings = warnings.filter((key) => !process.env[key]);
  if (missingWarnings.length > 0) {
    console.warn(
      `⚠️  Optional env vars not set (some features disabled):\n${missingWarnings.map((k) => `  • ${k}`).join('\n')}`
    );
  }

  return { valid: missing.length === 0, missing };
}
