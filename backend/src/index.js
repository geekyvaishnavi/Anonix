import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors' 
import { authRoutes } from './routes/auth.js'
import { messageRoutes } from './routes/messages.js'
import { replyRoutes } from './routes/replies.js'
import { profileRoutes } from './routes/profile.js'

const app = new Elysia()
    // 1. Setup Middlewares
    .use(cors({
    origin: 'http://localhost:5173' 
    }))

    // 2. Health Check (To see if server is alive)
    .get('/', () => ({
        status: 'online',
        app: 'Sayout Clone API',
        runtime: 'Bun'
    }))

    // 3. Mount Modular Routes
    .use(authRoutes)    // Prefix: /auth (Login/Signup)
    .use(messageRoutes) // Prefix: /messages (Send/Inbox)
    .use(replyRoutes)   // Prefix: /replies (Answering)
    .use(profileRoutes) // Prefix: /u (Public Feed)

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