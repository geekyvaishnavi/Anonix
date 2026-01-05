import { Elysia, t } from 'elysia'
import { supabase } from '../db/supabase.js'

export const dashboardRoutes = new Elysia({ prefix: '/dashboard' })
  // 1. Get Private Inbox 
  .get('/inbox', async ({ request, set }) => {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.split(' ')[1]

    // Verify User
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      set.status = 401
      return { error: "Unauthorized" }
    }

    // Fetch Messages
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false })

    return error ? { error: error.message } : data
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