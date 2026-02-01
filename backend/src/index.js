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

  .onRequest(({ request , set }) => {
    if(request.method === "OPTIONS"){
        set.status = 204;
        return;
    }
    console.log(
      `[REQ] ${request.method} ${new URL(request.url).pathname}`,
      "Origin:",
      request.headers.get("origin"),
    );
  })

  // Optional but VERY useful
  .onError(({ error, request }) => {
    console.error(`[ERR] ${request.method} ${request.url}`, error);
  })

  .use(
    cors({
      origin: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }),
  )



  .get("/", () => ({
    status: "online",
    app: "Anonix app",
    runtime: "Bun",
  }))

  .use(authRoutes)
  .use(messageRoutes)
  .use(profileRoutes)

  .guard({}, (app) =>
    app.use(authPlugin).use(dashboardRoutes).use(replyRoutes).use(editRoutes),
  )

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
