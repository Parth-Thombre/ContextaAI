import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const MODEL_MAP: Record<string, string> = {
  'llama': 'llama-3.3-70b-versatile',
  'mixtral': 'mixtral-8x7b-32768',
  'gemma': 'gemma2-9b-it',
}

export async function POST(request: NextRequest) {
  try {
    const { messages, model } = await request.json()
    const groqModel = MODEL_MAP[model] || 'llama-3.3-70b-versatile'

    const completion = await groq.chat.completions.create({
      model: groqModel,
      messages,
      max_tokens: 1024,
    })

    return NextResponse.json({ message: completion.choices[0].message.content })
  } catch (error) {
    console.error('Groq error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}