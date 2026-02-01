import { Elysia, t } from "elysia";
import { supabase } from "../db/supabase.js";

export const dashboardRoutes = new Elysia({ prefix: "/dashboard" })

  

  // Fetch current user profile
  .get("/me", async ({ request, set }) => {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username, display_name, pfp_url, bio")
      .eq("id", user.id)
      .single();

    if (profileError) {
      set.status = 404;
      return { error: "Profile not found" };
    }

    return profile;
  })

  // Get Private Inbox with associated replies
  .get("/inbox", async ({ request, set }) => {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        replies (
          reply_text,
          created_at
        )
      `,
      )
      .eq("recipient_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      set.status = 400;
      return { error: error.message };
    }

    return data;
  })

  // Get a single message and its reply for the Answer page
  .get("/message/:id", async ({ params, set }) => {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        replies (
          reply_text,
          created_at
        )
      `,
      )
      .eq("id", params.id)
      .single();

    if (error || !data) {
      set.status = 404;
      return { error: "Message not found" };
    }

    return data;
  })

  // Update Message Status
  .patch(
    "/message/:id/status",
    async ({ params, body }) => {
      const { error } = await supabase
        .from("messages")
        .update({ status: body.status })
        .eq("id", params.id);

      return { success: !error };
    },
    {
      body: t.Object({ status: t.String() }),
    },
  )

  // Delete Message
  .delete("/message/:id", async ({ params }) => {
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", params.id);

    return { success: !error };
  });
