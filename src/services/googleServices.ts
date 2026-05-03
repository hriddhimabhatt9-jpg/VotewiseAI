/**
 * Google Services Integration Layer
 * Centralizes all Google API interactions via /my_api
 * Supports: Maps, Gemini AI, Firebase, Speech-to-Text, Vision AI, Translate
 */

import { genAI, GEMINI_API_KEY, GOOGLE_MAPS_API_KEY, SPEECH_TO_TEXT_API, VISION_AI_API } from '../../my_api';

/* ─── Gemini AI Service ─── */

export interface GeminiChatOptions {
  systemPrompt?: string;
  model?: string;
  history?: Array<{ role: string; parts: Array<{ text: string }> }>;
}

export async function sendGeminiMessage(
  message: string,
  options: GeminiChatOptions = {}
): Promise<string> {
  if (!GEMINI_API_KEY || !genAI) {
    throw new Error('Gemini API key not configured');
  }

  const {
    systemPrompt,
    model: modelName = 'gemini-1.5-flash',
    history = [],
  } = options;

  const model = genAI.getGenerativeModel({
    model: modelName,
    ...(systemPrompt ? { systemInstruction: systemPrompt } : {}),
  });

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(message);
  return result.response.text();
}

/* ─── Google Maps Service ─── */

export function getGoogleMapsApiKey(): string {
  return GOOGLE_MAPS_API_KEY;
}

export function isGoogleMapsConfigured(): boolean {
  return Boolean(GOOGLE_MAPS_API_KEY) && GOOGLE_MAPS_API_KEY !== 'demo-maps-key';
}

/* ─── Speech-to-Text Service ─── */

export function getSpeechToTextApiKey(): string {
  return SPEECH_TO_TEXT_API;
}

export function isSpeechToTextConfigured(): boolean {
  return Boolean(SPEECH_TO_TEXT_API);
}

/* ─── Vision AI Service ─── */

export function getVisionAiApiKey(): string {
  return VISION_AI_API;
}

export function isVisionAiConfigured(): boolean {
  return Boolean(VISION_AI_API);
}

/* ─── API Health Check ─── */

export interface ServiceStatus {
  name: string;
  configured: boolean;
  status: 'active' | 'unconfigured' | 'error';
}

export function getServicesStatus(): ServiceStatus[] {
  return [
    {
      name: 'Google Maps',
      configured: isGoogleMapsConfigured(),
      status: isGoogleMapsConfigured() ? 'active' : 'unconfigured',
    },
    {
      name: 'Gemini AI',
      configured: Boolean(GEMINI_API_KEY),
      status: GEMINI_API_KEY ? 'active' : 'unconfigured',
    },
    {
      name: 'Speech-to-Text',
      configured: isSpeechToTextConfigured(),
      status: isSpeechToTextConfigured() ? 'active' : 'unconfigured',
    },
    {
      name: 'Vision AI',
      configured: isVisionAiConfigured(),
      status: isVisionAiConfigured() ? 'active' : 'unconfigured',
    },
  ];
}
