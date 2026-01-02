import { Elysia, t } from 'elysia'
import { supabase } from '../db/supabase.js'

export const replyRoutes = new Elysia({ prefix: '/replies' })
  .post('/create', async ({ body, request, set }) => {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) return { error: "Unauthorized" }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    const { message_id, reply_text } = body

    // Insert the reply. RLS ensures only the recipient can do this.
    const { data, error } = await supabase
      .from('replies')
      .insert([{
        message_id,
        author_id: user.id,
        reply_text
      }])
      .select()

    if (error) {
      set.status = 400
      return { error: error.message }
    }

    return { success: true, data }
  }, {
    body: t.Object({
      message_id: t.String(),
      reply_text: t.String({ minLength: 1, maxLength: 1000 })
    })
  })