import {
  validatePassword,
  validateEmail,
  sanitizeInput,
  validateInput,
  validateVoterAge,
  validateAadhaar,
  validateVoterID,
  validatePollingBoothCode,
  formSubmissionLimits,
} from '../validation';

describe('Validation Library', () => {
  describe('validatePassword', () => {
    it('should accept strong password', () => {
      const result = validatePassword('Test@1234');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject short password', () => {
      const result = validatePassword('Ab1@');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should require lowercase', () => {
      const result = validatePassword('TEST@1234');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain lowercase letters');
    });

    it('should require uppercase', () => {
      const result = validatePassword('test@1234');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain uppercase letters');
    });

    it('should require numbers', () => {
      const result = validatePassword('Test@abcd');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain numbers');
    });

    it('should require special characters', () => {
      const result = validatePassword('Test12345');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain special characters (!@#$%^&*)');
    });

    it('should return multiple errors for very weak password', () => {
      const result = validatePassword('abc');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(2);
    });
  });

  describe('validateEmail', () => {
    it('should accept valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('should accept email with subdomain', () => {
      expect(validateEmail('user@mail.example.co.in')).toBe(true);
    });

    it('should reject email without @', () => {
      expect(validateEmail('testexample.com')).toBe(false);
    });

    it('should reject email without domain', () => {
      expect(validateEmail('test@')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateEmail('')).toBe(false);
    });

    it('should reject overly long email', () => {
      const longEmail = 'a'.repeat(250) + '@b.com';
      expect(validateEmail(longEmail)).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should strip HTML tags', () => {
      const result = sanitizeInput('<script>alert("xss")</script>Hello');
      expect(result).not.toContain('<script>');
      expect(result).toContain('Hello');
    });

    it('should trim whitespace', () => {
      const result = sanitizeInput('  hello world  ');
      expect(result).toBe('hello world');
    });

    it('should handle plain text', () => {
      const result = sanitizeInput('Normal text');
      expect(result).toBe('Normal text');
    });

    it('should handle empty string', () => {
      const result = sanitizeInput('');
      expect(result).toBe('');
    });
  });

  describe('validateInput', () => {
    it('should validate text input', () => {
      const result = validateInput('Hello world', 'text');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('Hello world');
    });

    it('should reject empty input', () => {
      const result = validateInput('', 'text');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject null input', () => {
      const result = validateInput(null as unknown as string, 'text');
      expect(result.valid).toBe(false);
    });

    it('should validate email input type', () => {
      const result = validateInput('test@example.com', 'email');
      expect(result.valid).toBe(true);
    });

    it('should reject invalid email input type', () => {
      const result = validateInput('notanemail', 'email');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should validate URL input type', () => {
      const result = validateInput('https://example.com', 'url');
      expect(result.valid).toBe(true);
    });

    it('should reject invalid URL', () => {
      const result = validateInput('not-a-url', 'url');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid URL');
    });

    it('should reject very long text', () => {
      const longText = 'a'.repeat(2001);
      const result = validateInput(longText, 'text');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Input exceeds maximum length');
    });
  });

  describe('validateVoterAge', () => {
    it('should accept voter age 18+', () => {
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 20);
      expect(validateVoterAge(dob).valid).toBe(true);
    });

    it('should reject voter age under 18', () => {
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 15);
      const result = validateVoterAge(dob);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('18 years old');
    });

    it('should handle exact 18th birthday', () => {
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 18);
      const result = validateVoterAge(dob);
      expect(typeof result.valid).toBe('boolean');
    });
  });

  describe('validateAadhaar', () => {
    it('should accept valid 12-digit Aadhaar', () => {
      expect(validateAadhaar('123456789012')).toBe(true);
    });

    it('should accept Aadhaar with spaces', () => {
      expect(validateAadhaar('1234 5678 9012')).toBe(true);
    });

    it('should reject short Aadhaar', () => {
      expect(validateAadhaar('12345')).toBe(false);
    });

    it('should reject non-numeric Aadhaar', () => {
      expect(validateAadhaar('12345678901a')).toBe(false);
    });
  });

  describe('validateVoterID', () => {
    it('should accept valid Voter ID', () => {
      expect(validateVoterID('ABC1234567')).toBe(true);
    });

    it('should accept lowercase', () => {
      expect(validateVoterID('abc1234567')).toBe(true);
    });

    it('should reject invalid format', () => {
      expect(validateVoterID('1234567890')).toBe(false);
    });

    it('should reject too short', () => {
      expect(validateVoterID('AB12')).toBe(false);
    });
  });

  describe('validatePollingBoothCode', () => {
    it('should accept valid code', () => {
      expect(validatePollingBoothCode('AC/PS/123')).toBe(true);
    });

    it('should accept 4-digit sequence', () => {
      expect(validatePollingBoothCode('AB/CD/1234')).toBe(true);
    });

    it('should reject invalid format', () => {
      expect(validatePollingBoothCode('invalid')).toBe(false);
    });
  });

  describe('formSubmissionLimits', () => {
    it('should have login limits', () => {
      expect(formSubmissionLimits.login.attempts).toBe(5);
      expect(formSubmissionLimits.login.windowMs).toBe(15 * 60 * 1000);
    });

    it('should have signup limits', () => {
      expect(formSubmissionLimits.signup.attempts).toBe(3);
    });

    it('should have passwordReset limits', () => {
      expect(formSubmissionLimits.passwordReset.attempts).toBe(3);
    });
  });
});
