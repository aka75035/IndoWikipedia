import { requireLoggedInUser } from "@/lib/auth";
import User from "@/models/User";
import { updateProfileSchema } from "@/lib/validations/user";

/**
 * GET /api/profile
 *
 * Get current authenticated user.
 */
export async function GET() {
  try {
    const auth = await requireLoggedInUser();

    if (!auth.user) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const user = await User.findById(
      auth.user._id
    ).select("-password");

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        user,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Get profile error:",
      error
    );

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}


/**
 * PUT /api/profile
 *
 * Update current authenticated user's profile.
 */
export async function PUT(
  request: Request
) {
  try {
    const auth =
      await requireLoggedInUser();

    if (!auth.user) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /**
     * Parse request body
     */
    const body =
      await request.json();

    /**
     * Validate
     */
    const result =
      updateProfileSchema.safeParse(
        body
      );

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid user data",
          errors:
            result.error.issues,
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Update only allowed profile fields
     */
    const user =
      await User.findByIdAndUpdate(
        auth.user._id,
        result.data,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message:
          "Profile updated successfully",
        user,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}