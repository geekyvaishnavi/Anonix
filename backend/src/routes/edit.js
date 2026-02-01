import { Elysia, t } from "elysia";
import { supabase } from "../db/supabase";

export const editRoutes = new Elysia({ prefix: "/user" })

  .options("*", ({ set }) => {
    set.status = 204;
    return null;
  })

  .put(
    "/profile/update",
    async ({ body, set, request }) => {
      try {
        const authHeader = request.headers.get("Authorization");
        const token = authHeader?.split(" ")[1];

        // Get user from token
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser(token);
        if (authError || !user) {
          set.status = 401;
          return { error: "Unauthorized" };
        }

        const { display_name, avatar_url, bio } = body;

        const { data, error } = await supabase
          .from("profiles")
          .update({
            display_name,
            pfp_url: avatar_url,
            bio: bio,
          })
          .eq("id", user.id)
          .select()
          .single();

        if (error) {
          set.status = 400;
          return { success: false, error: error.message };
        }

        return {
          success: true,
          display_name: data.display_name,
          avatar_url: data.pfp_url,
          bio: data.bio,
        };
      } catch (err) {
        set.status = 500;
        return { success: false, error: "Internal Server Error" };
      }
    },
    {
      body: t.Object({
        display_name: t.String({ minLength: 2 }),
        bio: t.Optional(t.String({ maxLength: 160 })),
        avatar_url: t.Optional(t.String()),
      }),
    },
  );
