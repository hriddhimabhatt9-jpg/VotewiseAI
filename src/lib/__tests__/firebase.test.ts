import { app, auth, db, isDemoMode } from '../firebase';

describe('Firebase Configuration', () => {
  it('should export app object', () => {
    expect(app).toBeDefined();
  });

  it('should export auth object', () => {
    expect(auth).toBeDefined();
  });

  it('should export db object', () => {
    expect(db).toBeDefined();
  });

  it('should export isDemoMode flag', () => {
    expect(typeof isDemoMode).toBe('boolean');
  });

  it('should be in demo mode when keys are not configured', () => {
    // In test environment, Firebase keys are not set, so isDemoMode should be true
    expect(isDemoMode).toBe(true);
  });
});
