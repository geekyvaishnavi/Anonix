import { Elysia } from 'elysia'
import { supabase } from '../db/supabase.js'

export const profileRoutes = new Elysia()
  .get('/u/:username', async ({ params, set }) => {
    // 1. Get Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, username, display_name, pfp_url, bio')
        .eq('username', params.username)
        .single();

    if (!profile) {
        set.status = 404;
        return { error: "User not found" };
    }

    // 2. The Corrected Join Query
    // We fetch everything from messages, but use the explicit relationship to replies
    const { data: feed, error } = await supabase
        .from('messages')
        .select(`
            id,
            content,
            created_at,
            status,
            replies!message_id ( 
                reply_text,
                created_at
            )
        `)
        .eq('recipient_id', profile.id)
        .eq('status', 'answered') 
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Supabase Error:", error); // Check your server console for this!
    }

    return { profile, feed: feed || [] };
})