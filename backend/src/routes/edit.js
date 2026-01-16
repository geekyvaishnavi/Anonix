import { Elysia, t } from 'elysia'
import { supabase } from '../db/supabase'

export const editRoutes = new Elysia({ prefix: '/user' })
  .put('/profile/update', async ({ body, set, user }) => {
    try {
      const { display_name, avatar_url } = body

      // 1. Update the 'profiles' table in Supabase
      // Note: mapping 'avatar_url' (frontend) to 'pfp_url' (database)
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          display_name: display_name, 
          pfp_url: avatar_url 
        })
        .eq('id', user.id) // user.id comes from your auth middleware
        .select()
        .single()

      if (error) {
        set.status = 400
        return { success: false, error: error.message }
      }

      return {
        success: true,
        display_name: data.display_name,
        avatar_url: data.pfp_url
      }

    } catch (err) {
      set.status = 500
      return { success: false, error: "Internal Server Error" }
    }
  }, {
    // 2. Automatic Validation (The "Elysia Way")
    body: t.Object({
      display_name: t.String({ minLength: 2 }),
      avatar_url: t.Optional(t.String())
    })
  })