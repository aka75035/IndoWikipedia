import { requireLoggedInUser } from "@/lib/auth";
import User from "@/models/User";
import { changePasswordSchema } from "@/lib/validations/user";
import bcrypt from "bcrypt";

export async function PUT(request: Request) {
  try {
    /**
     * Authentication
     */
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

    /**
     * Parse request body
     */
    const body = await request.json();

    /**
     * Validate request
     */
    const result =
      changePasswordSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid password data",
          errors: result.error.issues,
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Get user with password
     */
    const user = await User.findById(
      auth.user._id
    );

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

    /**
     * Verify current password
     */
    const isCurrentPasswordCorrect =
      await bcrypt.compare(
        result.data.currentPassword,
        user.password
      );

    if (!isCurrentPasswordCorrect) {
      return Response.json(
        {
          success: false,
          message:
            "Current password is incorrect",
        },
        {
          status: 401,
        }
      );
    }

    /**
     * Prevent same password
     */
    if (
      result.data.currentPassword ===
      result.data.newPassword
    ) {
      return Response.json(
        {
          success: false,
          message:
            "New password must be different from the current password",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Hash new password
     */
    const hashedPassword =
      await bcrypt.hash(
        result.data.newPassword,
        10
      );

    /**
     * Update password
     */
    user.password = hashedPassword;

    await user.save();

    return Response.json(
      {
        success: true,
        message:
          "Password changed successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Change password error:",
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