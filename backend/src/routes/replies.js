import { Elysia, t } from 'elysia'
import { supabase } from '../db/supabase.js'

export const replyRoutes = new Elysia({ prefix: '/replies' })
  .post('/send', async ({ body, request, set }) => {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      set.status = 401
      return { error: "Unauthorized" }
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      set.status = 401
      return { error: "Invalid token" }
    }

    const { message_id, reply_text } = body

    // 1. Insert the reply into the 'replies' table
    const { data: replyData, error: replyError } = await supabase
      .from('replies')
      .insert([{
        message_id,
        author_id: user.id,
        reply_text
      }])
      .select()

    if (replyError) {
      set.status = 400
      return { error: replyError.message }
    }

    // 2. ACTION FOR STEP 6: Update original message status to 'answered'
    // This ensures that next time the dashboard fetches messages, 
    // this one moves to the 'Answered' tab.
    const { error: updateError } = await supabase
      .from('messages')
      .update({ status: 'answered' })
      .eq('id', message_id)
      .eq('recipient_id', user.id) // Extra safety: ensure user owns the message

    if (updateError) {
      // We don't necessarily want to fail the whole request if the reply saved 
      // but the status didn't update, but logging it is vital.
      console.error("Status update failed:", updateError.message)
    }

    return { success: true, data: replyData }
  }, {
    body: t.Object({
      message_id: t.String(),
      reply_text: t.String({ minLength: 1, maxLength: 1000 })
    })
  })