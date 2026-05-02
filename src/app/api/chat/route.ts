import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

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
- Use simple terms for complex legal or constitutional concepts.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      // Return a realistic mock response if API key is missing
      const lastUserMessage = messages[messages.length - 1].content.toLowerCase();
      let mockReply = "I'm currently in demo mode. To get real-time AI responses, please configure your OpenAI API key. However, based on my knowledge base: ";

      if (lastUserMessage.includes("register")) {
        mockReply += "You can register to vote in India through the NVSP portal (voters.eci.gov.in) or the Voter Helpline App. You need to be 18 years or older on the qualifying date.";
      } else if (lastUserMessage.includes("id") || lastUserMessage.includes("epic")) {
        mockReply += "The EPIC card is your voter ID. You can download an e-EPIC if your mobile number is linked to your registration on the ECI portal.";
      } else if (lastUserMessage.includes("modi") || lastUserMessage.includes("gandhi")) {
        mockReply += "I can provide verified candidate data. Please check the 'Candidates' tab for detailed insights on their education, assets, and criminal records.";
      } else {
        mockReply += "I can help you with questions about Indian elections, voter registration, and candidate details. What specifically would you like to know?";
      }

      return NextResponse.json({ 
        role: "assistant", 
        content: mockReply 
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
    });

    return NextResponse.json(response.choices[0].message);
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}
