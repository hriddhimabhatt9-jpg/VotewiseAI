import { NextResponse, NextRequest } from 'next/server'
import OpenAI from 'openai'
import { sanitizeInput, validateInput } from '@/lib/validation'
import { getClientIP, checkRateLimit } from '@/lib/security'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
})

const SYSTEM_PROMPT = `You are VoteWise AI+, a highly intelligent voter education and assistance platform for Indian elections. 
Your goal is to provide accurate, unbiased, and helpful information about:
1. Voter registration process in India (NVSP, Voter ID, eligibility).
2. Candidate information (education, assets, criminal records).
3. Polling booth procedures, EVM/VVPAT usage, and voting rights.
4. Election dates and constitutional facts.

Guidelines:
- Be polite, concise, and professional.
- Support both English and Hindi.
- If you don't know something, advise the user to check the official Election Commission of India (ECI) website.
- Do not show any political bias.
- Use simple terms for complex legal or constitutional concepts.`

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(req)
    if (!checkRateLimit(clientIP, 30, 60000)) {
      // 30 requests per minute
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const { messages } = await req.json()

    // Input validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages provided' },
        { status: 400 }
      )
    }

    // Validate and sanitize each message
    const validatedMessages = messages.map((msg: any) => {
      if (!msg.content || typeof msg.content !== 'string') {
        throw new Error('Invalid message format')
      }

      const { valid, sanitized, error } = validateInput(msg.content, 'text')
      if (!valid) {
        throw new Error(error || 'Invalid input')
      }

      return {
        role: msg.role,
        content: sanitized,
      }
    })

    // Check message length
    if (validatedMessages.some((msg: any) => msg.content.length > 2000)) {
      return NextResponse.json(
        { error: 'Message exceeds maximum length' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy_key') {
      // Return a realistic mock response if API key is missing
      const lastUserMessage =
        validatedMessages[validatedMessages.length - 1]?.content?.toLowerCase() || ''
      let mockReply =
        "I'm currently in demo mode. To get real-time AI responses, please configure your OpenAI API key. However, based on my knowledge base: "

      if (lastUserMessage.includes('register')) {
        mockReply +=
          'You can register to vote in India through the NVSP portal (voters.eci.gov.in) or the Voter Helpline App. You need to be 18 years or older on the qualifying date.'
      } else if (lastUserMessage.includes('id') || lastUserMessage.includes('epic')) {
        mockReply +=
          "The EPIC card is your voter ID. You can download an e-EPIC if your mobile number is linked to your registration on the ECI portal."
      } else if (lastUserMessage.includes('modi') || lastUserMessage.includes('gandhi')) {
        mockReply +=
          "I can provide verified candidate data. Please check the 'Candidates' tab for detailed insights on their education, assets, and criminal records."
      } else {
        mockReply +=
          'I can help you with questions about Indian elections, voter registration, and candidate details. What specifically would you like to know?'
      }

      return NextResponse.json({
        role: 'assistant',
        content: mockReply,
      })
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...validatedMessages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    return NextResponse.json(response.choices[0].message)
  } catch (error: any) {
    // Log error details (in production, send to monitoring service)
    console.error('Chat API Error:', {
      message: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
    })

    // Don't expose internal error details to client
    if (error.message.includes('Invalid')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 500 }
    )
  }
}
