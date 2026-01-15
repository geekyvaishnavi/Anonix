import { User } from "../models/User";

export const updateProfile = async (req) => {
  try {
    const body = await req.json();
    const { display_name, avatar_url } = body; // ✅ Added avatar_url

    // 1. Validation
    if (display_name && display_name.trim().length < 2) {
      return Response.json(
        { success: false, error: "Name too short" }, 
        { status: 400 }
      );
    }

    // 2. Prepare Update Object
    const updateData = {};
    if (display_name) updateData.display_name = display_name.trim();
    if (avatar_url) updateData.avatar_url = avatar_url; // ✅ Include URL if present

    // 3. Database Update
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData }, // ✅ Use $set to update only provided fields
      { new: true }
    );

    if (!updatedUser) {
      return Response.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // 4. Return updated data
    return Response.json({
      success: true,
      display_name: updatedUser.display_name,
      avatar_url: updatedUser.avatar_url
    });

  } catch (error) {
    console.error("Backend Error:", error);
    return Response.json({ success: false, error: "Server error" }, { status: 500 });
  }
};