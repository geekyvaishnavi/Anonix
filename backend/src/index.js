import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { authRoutes } from "./routes/auth.js";
import { messageRoutes } from "./routes/messages.js";
import { replyRoutes } from "./routes/replies.js";
import { profileRoutes } from "./routes/profile.js";
import { dashboardRoutes } from "./routes/dashboard.js";
import { editRoutes } from "./routes/edit.js";
import { authPlugin } from "./plugins/auth.js";

const app = new Elysia()

 
  .use(
    cors({
      origin: [
        "http://localhost:5173",
        "https://anonix-eight.vercel.app"
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  )

 


  .onRequest(({ request }) => {
    console.log(
      `[REQ] ${request.method} ${new URL(request.url).pathname}`,
      "Origin:",
      request.headers.get("origin")
    );
  })

  
  .onError(({ error, request }) => {
    console.error(`[ERR] ${request.method} ${request.url}`, error);
  })

  // Health route
  .get("/", () => ({
    status: "online",
    app: "Anonix app",
    runtime: "Bun",
  }))

  // Routes
  .use(authRoutes)
  .use(messageRoutes)
  .use(profileRoutes)

  .guard({}, (app) =>
    app.use(authPlugin).use(dashboardRoutes).use(replyRoutes).use(editRoutes)
  )

  // Final error handler
  .onError(({ code, error, set }) => {
    if (code === "NOT_FOUND") {
      set.status = 404;
      return { error: "Route not found" };
    }
    return {
      error: error.message || "Internal Server Error",
      code,
    };
  })

  .listen({
    port: process.env.PORT || 8080,
    hostname: "0.0.0.0",
  });

console.log(`Backend running on port ${process.env.PORT || 8080}`);
