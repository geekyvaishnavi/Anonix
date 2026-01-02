import { Elysia } from 'elysia'
import { supabase } from '../db/supabase.js'

export const profileRoutes = new Elysia()
  // Fetch public profile and answered Q&As
  .get('/u/:username', async ({ params, set }) => {
    const { username } = params

    // 1. Get Profile Info
    const { data: profile, error: pError } = await supabase
      .from('profiles')
      .select('id, username, display_name, pfp_url, bio')
      .eq('username', username)
      .single()

    if (pError || !profile) {
      set.status = 404
      return { error: "User not found" }
    }

    // 2. Get Answered Messages (The Q&A Feed)
    // We use '!inner' to only return messages that HAVE a reply
    const { data: feed, error: fError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        replies!inner (
          reply_text,
          created_at
        )
      `)
      .eq('recipient_id', profile.id)
      .order('created_at', { ascending: false })

    return {
      profile,
      feed: feed || []
    }
  })