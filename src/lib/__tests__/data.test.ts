import { translations, candidatesData } from '../data';

describe('Data Integrity', () => {
  describe('translations', () => {
    it('should have English translations', () => {
      expect(translations).toHaveProperty('en');
    });

    it('should have Hindi translations', () => {
      expect(translations).toHaveProperty('hi');
    });

    it('should have matching keys in both languages', () => {
      const enKeys = Object.keys(translations.en);
      const hiKeys = Object.keys(translations.hi);
      expect(enKeys.length).toBe(hiKeys.length);
      enKeys.forEach(key => {
        expect(translations.hi).toHaveProperty(key);
      });
    });

    it('should have non-empty values', () => {
      Object.values(translations.en).forEach(value => {
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });

    it('should have dashboard translation', () => {
      expect(translations.en.dashboard).toBeDefined();
      expect(translations.hi.dashboard).toBeDefined();
    });
  });

  describe('candidatesData', () => {
    it('should have candidates', () => {
      expect(candidatesData.length).toBeGreaterThan(0);
    });

    it('should include major candidates', () => {
      const candidateNames = candidatesData.map(c => c.name);
      expect(candidateNames).toContain('Narendra Modi');
      expect(candidateNames).toContain('Rahul Gandhi');
    });

    it('should have required properties', () => {
      candidatesData.forEach(candidate => {
        expect(candidate).toHaveProperty('id');
        expect(candidate).toHaveProperty('name');
        expect(candidate).toHaveProperty('party');
        expect(candidate.name.length).toBeGreaterThan(0);
        expect(candidate.party.length).toBeGreaterThan(0);
      });
    });
  });
});
