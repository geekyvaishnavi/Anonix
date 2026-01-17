import { supabase } from '../db/supabase.js'

export const isAuthenticated = async ({ request, set }) => {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader?.startsWith('Bearer ')) {
        set.status = 401
        return { error: 'Unauthorized' }
    }

    const token = authHeader.split(' ')[1]
    
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
        set.status = 401
        return { error: 'Invalid Session' }
    }

    return { user }
}