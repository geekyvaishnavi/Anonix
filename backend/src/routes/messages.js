import { Elysia, t } from 'elysia'
import { supabase } from '../db/supabase.js' 

export const messageRoutes = new Elysia({ prefix: '/messages' })
  .post('/send', async ({ body, set }) => {
    const { recipient_id, content } = body
    
    const { error } = await supabase
      .from('messages')
      .insert([{ recipient_id, content }])

    if (error) {
      set.status = 400
      return { success: false, error: error.message }
    }
    
    return { success: true, message: "Message sent!" }
  }, {
    body: t.Object({
      recipient_id: t.String(),
      content: t.String({ minLength: 1, maxLength: 500 })
    })
  })
