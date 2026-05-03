/**
 * Tests for Google Services integration layer
 */

// Mock the apiConfig module before imports
jest.mock('@/lib/apiConfig', () => ({
  genAI: {
    getGenerativeModel: jest.fn(() => ({
      startChat: jest.fn(() => ({
        sendMessage: jest.fn().mockResolvedValue({
          response: { text: () => 'AI response' },
        }),
      })),
    })),
  },
  GEMINI_API_KEY: 'test-gemini-key',
  GOOGLE_MAPS_API_KEY: 'test-maps-key',
  SPEECH_TO_TEXT_API: 'test-stt-key',
  VISION_AI_API: 'test-vision-key',
  GOOGLE_CALENDAR_API: 'test-calendar-key',
}));

import {
  sendGeminiMessage,
  getGoogleMapsApiKey,
  isGoogleMapsConfigured,
  getSpeechToTextApiKey,
  isSpeechToTextConfigured,
  getVisionAiApiKey,
  isVisionAiConfigured,
  getServicesStatus,
} from '../googleServices';

describe('Google Services', () => {
  describe('Gemini AI Service', () => {
    it('sends a message and returns response', async () => {
      const response = await sendGeminiMessage('Hello');
      expect(response).toBe('AI response');
    });

    it('sends a message with custom options', async () => {
      const response = await sendGeminiMessage('Test', {
        systemPrompt: 'You are a test bot',
        model: 'gemini-1.5-pro',
        history: [],
      });
      expect(response).toBe('AI response');
    });

    it('sends a message with history', async () => {
      const history = [
        { role: 'user', parts: [{ text: 'Hi' }] },
        { role: 'model', parts: [{ text: 'Hello!' }] },
      ];
      const response = await sendGeminiMessage('How are you?', { history });
      expect(response).toBe('AI response');
    });
  });

  describe('Google Maps Service', () => {
    it('returns the API key', () => {
      expect(getGoogleMapsApiKey()).toBe('test-maps-key');
    });

    it('reports as configured', () => {
      expect(isGoogleMapsConfigured()).toBe(true);
    });
  });

  describe('Speech-to-Text Service', () => {
    it('returns the API key', () => {
      expect(getSpeechToTextApiKey()).toBe('test-stt-key');
    });

    it('reports as configured', () => {
      expect(isSpeechToTextConfigured()).toBe(true);
    });
  });

  describe('Vision AI Service', () => {
    it('returns the API key', () => {
      expect(getVisionAiApiKey()).toBe('test-vision-key');
    });

    it('reports as configured', () => {
      expect(isVisionAiConfigured()).toBe(true);
    });
  });

  describe('Services Status', () => {
    it('returns status of all services', () => {
      const statuses = getServicesStatus();
      expect(statuses).toHaveLength(4);
      expect(statuses[0].name).toBe('Google Maps');
      expect(statuses[0].status).toBe('active');
      expect(statuses[1].name).toBe('Gemini AI');
      expect(statuses[1].status).toBe('active');
      expect(statuses[2].name).toBe('Speech-to-Text');
      expect(statuses[2].status).toBe('active');
      expect(statuses[3].name).toBe('Vision AI');
      expect(statuses[3].status).toBe('active');
    });

    it('all services report configured', () => {
      const statuses = getServicesStatus();
      statuses.forEach((s) => {
        expect(s.configured).toBe(true);
      });
    });
  });
});
