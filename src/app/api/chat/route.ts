import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(request: NextRequest) {
    console.log('API Key exists:', !!process.env.GROQ_API_KEY)
  try {
    const { messages } = await request.json()

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages,
      max_tokens: 1024,
    })

    const response = completion.choices[0].message.content

    return NextResponse.json({ message: response })

  } catch (error) {
    console.error('Groq error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}