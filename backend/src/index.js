import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors' 
import { authRoutes } from './routes/auth.js'
import { messageRoutes } from './routes/messages.js'
import { replyRoutes } from './routes/replies.js'
import { profileRoutes } from './routes/profile.js'
import { dashboardRoutes } from './routes/dashboard.js'
import { editRoutes } from './routes/edit.js'
import { authPlugin } from './plugins/auth.js'

const app = new Elysia()
    .use(cors({
        origin: 'https://anonix-eight.vercel.app/',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    }))

    .get('/', () => ({
        status: 'online',
        app: 'Sayout Clone API',
        runtime: 'Bun'
    }))

    .use(authRoutes)
    .use(messageRoutes)
    .use(profileRoutes)

    //authPlugin 
    .guard({}, (app) => 
        app
            .use(authPlugin) 
            .use(dashboardRoutes)
            .use(replyRoutes)
            .use(editRoutes)
    )

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

    .listen(process.env.PORT || 3000)

console.log(
    `Backend is running at ${app.server?.hostname}:${app.server?.port}`
)