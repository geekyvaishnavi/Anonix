import { Elysia, t } from 'elysia'
import { supabase } from '../db/supabase.js'

export const dashboardRoutes = new Elysia({ prefix: '/dashboard' })
   // user data
  .get('/me', async ({ request, set }) => {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.split(' ')[1]

    // 1. Get user from Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      set.status = 401
      return { error: "Unauthorized" }
    }

    // 2. Fetch the actual profile data (display_name, username) from your profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles') // or whatever your table name is
      .select('username, display_name')
      .eq('id', user.id)
      .single()

    if (profileError) {
      set.status = 404
      return { error: "Profile not found" }
    }

    return profile
  })

  // 1. Get Private Inbox 
 // 1. Get Private Inbox (Corrected with Joins)
  .get('/inbox', async ({ request, set }) => {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.split(' ')[1]

    // Verify User
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      set.status = 401
      return { error: "Unauthorized" }
    }

    // Fetch Messages joined with their replies
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        replies (
          reply_text,
          created_at
        )
      `) // The magic happens here: fetching the linked reply data
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      set.status = 400
      return { error: error.message }
    }

    return data
  })

  // Get a single message for the Answer page
  // Get a single message for the Answer page
.get('/message/:id', async ({ params, set }) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      replies (
        reply_text,
        created_at
      )
    `) // ADD THIS to see the reply on the answer page too
    .eq('id', params.id)
    .single()

  if (error || !data) {
    set.status = 404
    return { error: "Message not found" }
  }

  return data
})

  // 2. Update Status (Archive/Unarchive)
  .patch('/message/:id/status', async ({ params, body }) => {
    const { error } = await supabase
      .from('messages')
      .update({ status: body.status })
      .eq('id', params.id)
    
    return { success: !error }
  }, {
    body: t.Object({ status: t.String() })
  })

  // 3. Delete Message
  .delete('/message/:id', async ({ params }) => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', params.id)
    
    return { success: !error }
  })