import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

// GET - load all conversations (supports ?q=searchterm)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()

    let query = supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false })

    if (q) {
      query = query.ilike('title', `%${q}%`)
    }

    const { data, error } = await query
    if (error) throw error

    // Also search message content if q is provided
    if (q && data) {
      const titleMatches = data
      
      // Get ALL conversations to search message content too
      const { data: allData } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false })

      const contentMatches = (allData || []).filter(conv => {
        const messages = conv.messages as any[]
        return messages?.some(m =>
          m.content?.toLowerCase().includes(q.toLowerCase())
        )
      })

      // Merge and deduplicate
      const merged = [...titleMatches]
      contentMatches.forEach(c => {
        if (!merged.find(m => m.id === c.id)) merged.push(c)
      })

      return NextResponse.json({ conversations: merged })
    }

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