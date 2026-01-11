import { User } from "../models/User"; // Your Mongoose or DB model

export const updateProfile = async (req) => {
  try {
    const body = await req.json(); // Bun's native way to parse JSON
    const { display_name } = body;

    // 1. Validation
    if (!display_name || display_name.trim().length < 2) {
      return Response.json(
        { success: false, error: "Name too short" }, 
        { status: 400 }
      );
    }

    // 2. Database Update
    // req.user is attached by the middleware (see below)
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { display_name: display_name.trim() },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // 3. Match your frontend "res.success" check
    return Response.json({
      success: true,
      display_name: updatedUser.display_name
    });

  } catch (error) {
    return Response.json({ success: false, error: "Server error" }, { status: 500 });
  }
};