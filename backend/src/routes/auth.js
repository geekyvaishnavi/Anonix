import { Elysia, t } from 'elysia'
import { supabase } from '../db/supabase.js'

export const authRoutes = new Elysia({ prefix: '/auth' })
    // Register a new user
    .post('/signup', async ({ body, set }) => {
        const { email, password, username } = body
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username } 
            }
        })

        if (error) {
            set.status = 400
            return { error: error.message }
        }

        return { 
    message: "Account created!", 
    token: data.session?.access_token, 
    user: data.user 
}
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String(),
            username: t.String()
        })
    })

    // Login and get a JWT token
    .post('/login', async ({ body, set }) => {
        const { data, error } = await supabase.auth.signInWithPassword(body)

        if (error) {
            set.status = 401
            return { error: "Login failed" }
        }

        return {
            token: data.session.access_token,
            user: data.user
        }
    })


    //logout
    .post('/logout', async ({ request, set }) => {
        const authHeader = request.headers.get('authorization')
        
        if (!authHeader) {
            set.status = 401
            return { error: "No session found" }
        }

        const token = authHeader.replace('Bearer ', '')

        
        const { error } = await supabase.auth.signOut()

        if (error) {
            set.status = 400
            return { error: error.message }
        }

        return { message: "Logged out successfully" }
    })