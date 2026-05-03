/**
 * Tests for env.ts
 */

describe('env module', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('getPublicEnv returns empty strings when no env vars set', () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const { getPublicEnv } = require('../env');
    const env = getPublicEnv();
    expect(env.FIREBASE_API_KEY).toBe('');
    expect(env.GOOGLE_MAPS_API_KEY).toBe('');
    expect(env.APP_URL).toBe('http://localhost:3000');
  });

  it('getPublicEnv returns values when env vars set', () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-key';
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'maps-key';
    const { getPublicEnv } = require('../env');
    const env = getPublicEnv();
    expect(env.FIREBASE_API_KEY).toBe('test-key');
    expect(env.GOOGLE_MAPS_API_KEY).toBe('maps-key');
  });

  it('getServerEnv returns empty strings when no env vars set', () => {
    delete process.env.OPENAI_API_KEY;
    const { getServerEnv } = require('../env');
    const env = getServerEnv();
    expect(env.OPENAI_API_KEY).toBe('');
  });

  it('getServerEnv returns values when env vars set', () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    const { getServerEnv } = require('../env');
    const env = getServerEnv();
    expect(env.OPENAI_API_KEY).toBe('sk-test');
  });

  it('validateEnv returns missing when required vars absent', () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { validateEnv } = require('../env');
    const result = validateEnv();
    expect(result.valid).toBe(false);
    expect(result.missing.length).toBeGreaterThan(0);
    consoleSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it('validateEnv returns valid when required vars present', () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'key';
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'domain';
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'project';
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { validateEnv } = require('../env');
    const result = validateEnv();
    expect(result.valid).toBe(true);
    expect(result.missing).toHaveLength(0);
    warnSpy.mockRestore();
  });
});
