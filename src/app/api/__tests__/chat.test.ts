/**
 * @jest-environment node
 */
// Global flag to trigger error in mock
(global as any).__mockOpenAIError = false;

jest.mock('@/lib/apiConfig', () => {
  const mockSendMessage = jest.fn().mockImplementation(() => {
    if ((global as any).__mockOpenAIError) {
      return Promise.reject(new Error('API Error'));
    }
    return Promise.resolve({
      response: {
        text: () => 'This is a mock response'
      }
    });
  });

  const mockStartChat = jest.fn().mockImplementation(() => {
    return {
      sendMessage: mockSendMessage
    };
  });

  const mockGetGenerativeModel = jest.fn().mockImplementation(() => {
    return {
      startChat: mockStartChat
    };
  });

  return {
    GEMINI_API_KEY: 'mock-key',
    genAI: {
      getGenerativeModel: mockGetGenerativeModel
    }
  };
});

import { POST } from '../chat/route';

describe('/api/chat POST', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global as any).__mockOpenAIError = false;
  })

  it('should return error for empty messages', async () => {
    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [] }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid messages provided')
  })

  it('should return error for missing messages', async () => {
    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid messages provided')
  })

  it('should return error for invalid messages format', async () => {
    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: 'invalid' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid messages provided')
  })

  it('should handle valid message request', async () => {
    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'Tell me about voting in India',
          },
        ],
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
  })

  it('should handle conversation with multiple messages', async () => {
    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'What is NVSP?',
          },
          {
            role: 'assistant',
            content: 'NVSP is the National Voter Service Portal.',
          },
          {
            role: 'user',
            content: 'How do I use it?',
          },
        ],
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
  })

  it('should return server error on API failure', async () => {
    ;(global as any).__mockOpenAIError = true;

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'Test',
          },
        ],
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(500)
  })
})
