import { Elysia, t } from "elysia";
import { supabase } from "../db/supabase.js";

export const replyRoutes = new Elysia({ prefix: "/replies" })

  .options("*", ({ set }) => {
    set.status = 204;
    return null;
  })

  .post(
    "/send",
    async ({ body, request, set }) => {
      const authHeader = request.headers.get("authorization");
      if (!authHeader) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const token = authHeader.replace("Bearer ", "");
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser(token);

      if (authError || !user) {
        set.status = 401;
        return { error: "Invalid token" };
      }

      const { message_id, reply_text } = body;

      const { data: replyData, error: replyError } = await supabase
        .from("replies")
        .insert([
          {
            message_id,
            author_id: user.id,
            reply_text,
          },
        ])
        .select();

      if (replyError) {
        set.status = 400;
        return { error: replyError.message };
      }

      const { error: updateError } = await supabase
        .from("messages")
        .update({ status: "answered" })
        .eq("id", message_id)
        .eq("recipient_id", user.id);

      if (updateError) {
        console.error("Status update failed:", updateError.message);
      }

      return { success: true, data: replyData };
    },
    {
      body: t.Object({
        message_id: t.String(),
        reply_text: t.String({ minLength: 1, maxLength: 1000 }),
      }),
    },
  );
