/**
 * @jest-environment node
 */
import { POST } from '../chat/route'
import { NextResponse } from 'next/server'

jest.mock('openai', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  role: 'assistant',
                  content: 'This is a mock response',
                },
              },
            ],
          }),
        },
      },
    })),
  }
})

describe('/api/chat POST', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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

  it('should return mock response when API key is missing', async () => {
    delete process.env.OPENAI_API_KEY

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'How do I register to vote?',
          },
        ],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.content).toContain('demo mode')
  })

  it('should handle valid message request', async () => {
    process.env.OPENAI_API_KEY = 'test-key'

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
    process.env.OPENAI_API_KEY = 'test-key'

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
    process.env.OPENAI_API_KEY = 'test-key'

    // Mock the OpenAI module to throw an error
    jest.doMock('openai', () => {
      return {
        default: jest.fn().mockImplementation(() => ({
          chat: {
            completions: {
              create: jest.fn().mockRejectedValueOnce(new Error('API Error')),
            },
          },
        })),
      }
    })

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
