import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - load all conversations (supports ?q=searchterm&user_id=xxx)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()
    const userId = searchParams.get('user_id')

    // No user_id = guest, return nothing
    if (!userId) {
      return NextResponse.json({ conversations: [] })
    }

    let query = supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (q) {
      query = query.ilike('title', `%${q}%`)
    }

    const { data, error } = await query
    if (error) throw error

    // Also search message content if q is provided
    if (q && data) {
      const titleMatches = data
      const { data: allData } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      const contentMatches = (allData || []).filter(conv => {
        const messages = conv.messages as any[]
        return messages?.some(m =>
          m.content?.toLowerCase().includes(q.toLowerCase())
        )
      })

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
    const { title, model, messages, user_id } = await request.json()
    const { data, error } = await supabase
      .from('conversations')
      .insert([{ title, model, messages, user_id: user_id || null }])
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

// DELETE - delete a conversation
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    )
  }
}