import { loginSchema, signupSchema, profileSchema, fakeNewsSchema } from '../validations';

describe('Zod Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should accept valid login data', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '12345',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing email', () => {
      const result = loginSchema.safeParse({
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty object', () => {
      const result = loginSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('signupSchema', () => {
    it('should accept valid signup data', () => {
      const result = signupSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const result = signupSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'differentpassword',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short name', () => {
      const result = signupSchema.safeParse({
        name: 'J',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const result = signupSchema.safeParse({
        name: 'John Doe',
        email: 'not-an-email',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing fields', () => {
      const result = signupSchema.safeParse({
        name: 'John Doe',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('profileSchema', () => {
    it('should accept valid profile data', () => {
      const result = profileSchema.safeParse({
        fullName: 'John Doe',
        dob: '1990-01-15',
        address: '123 Main Street, Delhi',
        mobile: '9876543210',
      });
      expect(result.success).toBe(true);
    });

    it('should accept profile without optional fields', () => {
      const result = profileSchema.safeParse({
        fullName: 'John Doe',
        dob: '1990-01-15',
        address: '123 Main Street, Delhi',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid mobile number', () => {
      const result = profileSchema.safeParse({
        fullName: 'John Doe',
        dob: '1990-01-15',
        address: '123 Main Street, Delhi',
        mobile: '1234567890', // doesn't start with 6-9
      });
      expect(result.success).toBe(false);
    });

    it('should accept empty mobile', () => {
      const result = profileSchema.safeParse({
        fullName: 'John Doe',
        dob: '1990-01-15',
        address: '123 Main Street, Delhi',
        mobile: '',
      });
      expect(result.success).toBe(true);
    });

    it('should reject short address', () => {
      const result = profileSchema.safeParse({
        fullName: 'John Doe',
        dob: '1990-01-15',
        address: 'AB',
      });
      expect(result.success).toBe(false);
    });

    it('should accept optional interests array', () => {
      const result = profileSchema.safeParse({
        fullName: 'John Doe',
        dob: '1990-01-15',
        address: '123 Main Street, Delhi',
        interests: ['education', 'healthcare'],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('fakeNewsSchema', () => {
    it('should accept valid content', () => {
      const result = fakeNewsSchema.safeParse({
        content: 'This is a claim to fact-check about elections.',
      });
      expect(result.success).toBe(true);
    });

    it('should reject short content', () => {
      const result = fakeNewsSchema.safeParse({
        content: 'Too short',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty content', () => {
      const result = fakeNewsSchema.safeParse({
        content: '',
      });
      expect(result.success).toBe(false);
    });
  });
});
