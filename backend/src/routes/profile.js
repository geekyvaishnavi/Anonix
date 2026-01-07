import { Elysia } from 'elysia'
import { supabase } from '../db/supabase.js'

export const profileRoutes = new Elysia()
  // Fetch public profile and answered Q&As
  .get('/u/:username', async ({ params, set }) => {
    // 1. Get the profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, username, display_name, pfp_url, bio')
        .eq('username', params.username)
        .single();

    if (!profile) {
        set.status = 404;
        return { error: "User not found" };
    }

    // 2. Get Answered Messages JOINED with their Replies
    const { data: feed } = await supabase
        .from('messages')
        .select(`
            id,
            content,
            created_at,
            replies (
                reply_text,
                created_at
            )
        `)
        .eq('recipient_id', profile.id)
        .eq('status', 'answered') // Only show public/answered ones
        .order('created_at', { ascending: false });

    return { profile, feed };
})