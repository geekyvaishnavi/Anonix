import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { authRoutes } from './routes/auth.js'
import { messageRoutes } from './routes/messages.js'
import { replyRoutes } from './routes/replies.js'
import { profileRoutes } from './routes/profile.js'
import { dashboardRoutes } from './routes/dashboard.js'
import { editRoutes } from './routes/edit.js'
import { authPlugin } from './plugins/auth.js'

const FRONTEND_URL = "https://anonix-eight.vercel.app"

const app = new Elysia()
  // Primary CORS Plugin
  .use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  }))

  // Fail-Safe Headers (Ensures headers exist even during errors)
  .onBeforeHandle(({ set }) => {
    set.headers['Access-Control-Allow-Origin'] = FRONTEND_URL
    set.headers['Access-Control-Allow-Methods'] = "GET, POST, PUT, DELETE, OPTIONS"
    set.headers['Access-Control-Allow-Headers'] = "Content-Type, Authorization"
  })

  .get('/', () => ({
    status: 'online',
    app: 'Anonix app',
    runtime: 'Bun'
  }))

  // Public Routes
  .use(authRoutes)
  .use(messageRoutes)
  .use(profileRoutes)

  // Protected Routes
  .guard({}, (app) =>
    app
      .use(authPlugin)
      .use(dashboardRoutes)
      .use(replyRoutes)
      .use(editRoutes)
  )

  //Error Handler
  .onError(({ code, error, set }) => {
    // Re-inject CORS headers so the browser can read the error message
    set.headers['Access-Control-Allow-Origin'] = FRONTEND_URL

    if (code === 'NOT_FOUND') {
      set.status = 404
      return { error: 'Route not found' }
    }

    if (code === 'VALIDATION') {
      set.status = 422
      return { 
        error: 'Validation failed', 
        details: error.all 
      }
    }

    return {
      error: error.message || 'Internal Server Error',
      code
    }
  })

  
  .listen({
    port: process.env.PORT || 3000,
    hostname: '0.0.0.0' 
  })

console.log(`Backend running on port ${app.server?.port}`);
