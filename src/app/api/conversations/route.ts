import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

// GET - load all conversations
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ conversations: data })

  } catch (error) {
    console.error('Error loading conversations:', error)
    return NextResponse.json(
      { error: 'Failed to load conversations' },
      { status: 500 }
    )
  }
}

// POST - save a new conversation
export async function POST(request: NextRequest) {
  try {
    const { title, model, messages } = await request.json()

    const { data, error } = await supabase
      .from('conversations')
      .insert([{ title, model, messages }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ conversation: data })

  } catch (error) {
    console.error('Error saving conversation:', error)
    return NextResponse.json(
      { error: 'Failed to save conversation' },
      { status: 500 }
    )
  }
}

// PATCH - update existing conversation
export async function PATCH(request: NextRequest) {
  try {
    const { id, messages, title } = await request.json()

    const { data, error } = await supabase
      .from('conversations')
      .update({ messages, title, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ conversation: data })

  } catch (error) {
    console.error('Error updating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    )
  }
}