/**
 * @jest-environment node
 */

import { generateCSRFToken, validateCSRFToken, checkRateLimit, getClientIP } from '../security';

describe('Security Library', () => {
  describe('generateCSRFToken', () => {
    it('should generate a 64-character hex string', () => {
      const token = generateCSRFToken();
      expect(token).toHaveLength(64);
      expect(/^[a-f0-9]{64}$/.test(token)).toBe(true);
    });

    it('should generate unique tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('validateCSRFToken', () => {
    it('should accept valid CSRF token', () => {
      const token = generateCSRFToken();
      expect(validateCSRFToken(token)).toBe(true);
    });

    it('should reject short token', () => {
      expect(validateCSRFToken('abc123')).toBe(false);
    });

    it('should reject non-hex token', () => {
      expect(validateCSRFToken('g'.repeat(64))).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateCSRFToken('')).toBe(false);
    });
  });

  describe('checkRateLimit', () => {
    beforeEach(() => {
      // Reset the rate limit store by making expired calls
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should allow requests within limit', () => {
      const id = 'test-' + Date.now();
      expect(checkRateLimit(id, 5, 60000)).toBe(true);
      expect(checkRateLimit(id, 5, 60000)).toBe(true);
      expect(checkRateLimit(id, 5, 60000)).toBe(true);
    });

    it('should block requests exceeding limit', () => {
      const id = 'test-block-' + Date.now();
      for (let i = 0; i < 3; i++) {
        checkRateLimit(id, 3, 60000);
      }
      expect(checkRateLimit(id, 3, 60000)).toBe(false);
    });

    it('should reset after window expires', () => {
      const id = 'test-reset-' + Date.now();
      for (let i = 0; i < 3; i++) {
        checkRateLimit(id, 3, 1000);
      }
      expect(checkRateLimit(id, 3, 1000)).toBe(false);
      
      jest.advanceTimersByTime(1100);
      expect(checkRateLimit(id, 3, 1000)).toBe(true);
    });
  });

  describe('getClientIP', () => {
    it('should extract IP from x-forwarded-for', () => {
      const mockRequest = {
        headers: {
          get: (name: string) => {
            if (name === 'x-forwarded-for') return '192.168.1.1, 10.0.0.1';
            return null;
          },
        },
        ip: undefined,
      } as any;
      expect(getClientIP(mockRequest)).toBe('192.168.1.1');
    });

    it('should extract IP from x-real-ip', () => {
      const mockRequest = {
        headers: {
          get: (name: string) => {
            if (name === 'x-real-ip') return '10.0.0.1';
            return null;
          },
        },
        ip: undefined,
      } as any;
      expect(getClientIP(mockRequest)).toBe('10.0.0.1');
    });

    it('should return unknown when no IP available', () => {
      const mockRequest = {
        headers: {
          get: () => null,
        },
        ip: undefined,
      } as any;
      expect(getClientIP(mockRequest)).toBe('unknown');
    });
  });

  describe('withAuth', () => {
    let withAuth: any;

    beforeAll(async () => {
      const mod = await import('../security');
      withAuth = mod.withAuth;
    });

    it('should reject request without auth token', async () => {
      const mockReq = {
        cookies: { get: () => undefined },
        headers: { get: () => null },
      } as any;
      const handler = jest.fn();
      const wrapped = withAuth(handler);
      const result = await wrapped(mockReq);
      expect(result.status).toBe(401);
      expect(handler).not.toHaveBeenCalled();
    });

    it('should allow request with cookie auth token', async () => {
      const mockReq = {
        cookies: { get: (name: string) => name === 'auth-token' ? { value: 'Bearer xyz' } : undefined },
        headers: { get: () => null },
      } as any;
      const handler = jest.fn().mockResolvedValue({ status: 200 });
      const wrapped = withAuth(handler);
      const result = await wrapped(mockReq);
      expect(handler).toHaveBeenCalledWith(mockReq);
      expect(result.status).toBe(200);
    });

    it('should allow request with authorization header', async () => {
      const mockReq = {
        cookies: { get: () => undefined },
        headers: { get: (name: string) => name === 'authorization' ? 'Bearer abc' : null },
      } as any;
      const handler = jest.fn().mockResolvedValue({ status: 200 });
      const wrapped = withAuth(handler);
      const result = await wrapped(mockReq);
      expect(handler).toHaveBeenCalledWith(mockReq);
    });
  });

  describe('withCSRF', () => {
    let withCSRF: any;

    beforeAll(async () => {
      const mod = await import('../security');
      withCSRF = mod.withCSRF;
    });

    it('should reject POST without CSRF token', async () => {
      const mockReq = {
        method: 'POST',
        headers: { get: () => null },
      } as any;
      const handler = jest.fn();
      const wrapped = withCSRF(handler);
      const result = await wrapped(mockReq);
      expect(result.status).toBe(403);
    });

    it('should reject POST with invalid CSRF token', async () => {
      const mockReq = {
        method: 'POST',
        headers: { get: (name: string) => name === 'x-csrf-token' ? 'invalid' : null },
      } as any;
      const handler = jest.fn();
      const wrapped = withCSRF(handler);
      const result = await wrapped(mockReq);
      expect(result.status).toBe(403);
    });

    it('should allow POST with valid CSRF token', async () => {
      const validToken = 'a'.repeat(64);
      const mockReq = {
        method: 'POST',
        headers: { get: (name: string) => name === 'x-csrf-token' ? validToken : null },
      } as any;
      const handler = jest.fn().mockResolvedValue({ status: 200 });
      const wrapped = withCSRF(handler);
      const result = await wrapped(mockReq);
      expect(handler).toHaveBeenCalledWith(mockReq);
    });

    it('should allow GET request without CSRF token', async () => {
      const mockReq = {
        method: 'GET',
        headers: { get: () => null },
      } as any;
      const handler = jest.fn().mockResolvedValue({ status: 200 });
      const wrapped = withCSRF(handler);
      await wrapped(mockReq);
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('withRateLimit', () => {
    let withRateLimit: any;

    beforeAll(async () => {
      const mod = await import('../security');
      withRateLimit = mod.withRateLimit;
    });

    it('should allow requests within limit', async () => {
      const mockReq = {
        headers: { get: (name: string) => name === 'x-forwarded-for' ? '1.2.3.4' : null },
      } as any;
      const handler = jest.fn().mockResolvedValue({ status: 200 });
      const wrapped = withRateLimit(handler, 100, 60000);
      const result = await wrapped(mockReq);
      expect(handler).toHaveBeenCalled();
    });
  });
});
