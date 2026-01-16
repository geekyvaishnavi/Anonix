import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors' 
import { authRoutes } from './routes/auth.js'
import { messageRoutes } from './routes/messages.js'
import { replyRoutes } from './routes/replies.js'
import { profileRoutes } from './routes/profile.js'
import { dashboardRoutes } from './routes/dashboard.js'
import {editRoutes} from './routes/edit.js'
import { authPlugin } from './plugins/auth.js'

const app = new Elysia()

    .use(authPlugin) // Now ALL routes below have access to 'user' and 'jwt'
    
    // 1. Setup Middlewares
    .use(cors({
        origin: 'http://localhost:5173', // Your React dev URL
        credentials: true,               // Essential for Cookies/JWT
        allowedHeaders: ['Content-Type', 'Authorization']
    }))

    // 2. Health Check (To see if server is alive)
    .get('/', () => ({
        status: 'online',
        app: 'Sayout Clone API',
        runtime: 'Bun'
    }))

    //no need to be logged in 
    .use(messageRoutes) // Prefix: /messages-- send msgs
    .use(profileRoutes) // Prefix: /u -- public profile

    // 3. PROTECTED ROUTES (Requires Login)
    .use(authPlugin)    // Everything below this line is now private
    .use(dashboardRoutes) // http://localhost:3000/dashboard/me
    .use(replyRoutes)
    .use(editRoutes)    // http://localhost:3000/user/profile/update

    // 4. Global Error Handling
    .onError(({ code, error, set }) => {
        if (code === 'NOT_FOUND') {
            set.status = 404
            return { error: 'Route not found' }
        }
        return { 
            error: error.message || 'Internal Server Error',
            code: code 
        }
    })

    // 5. Start Server
    .listen(process.env.PORT || 3000)

console.log(
    `🦊 Sayout Backend is running at ${app.server?.hostname}:${app.server?.port}`
)