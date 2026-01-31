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
   origin: "https://anonix-eight.vercel.app",
   credentials: false,
   allowedHeaders: ["Content-Type", "Authorization"],
   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  }))

  .get('/', () => ({
    status: 'online',
    app: 'Anonix app',
    runtime: 'Bun'
  }))

  .use(authRoutes)
  .use(messageRoutes)
  .use(profileRoutes)

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
      code
    }
  })

  .listen(process.env.PORT || 3000)

console.log(`Backend running on port ${process.env.PORT || 3000}`);
