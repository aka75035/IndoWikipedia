import { requireLoggedInUser } from "@/lib/auth";
import User from "@/models/User";
import { changePasswordSchema } from "@/lib/validations/user";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongodb";

export async function PUT(request: Request) {
  await connectDB();
  const auth = await requireLoggedInUser();

  if (!auth.user) {
    return Response.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const body = await request.json();

  const result = changePasswordSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      {
        message: "Invalid password data",
        errors: result.error.issues,
      },
      {
        status: 400,
      }
    );
  }

  const user = await User.findById(auth.user._id);

  if (!user) {
    return Response.json(
      {
        message: "User not found",
      },
      {
        status: 404,
      }
    );
  }

  const isCurrentPasswordCorrect = await bcrypt.compare(
    result.data.currentPassword,
    user.passwordHash
  );

  if (!isCurrentPasswordCorrect) {
    return Response.json(
      {
        message: "Current password is incorrect",
      },
      {
        status: 401,
      }
    );
  }

  if (result.data.currentPassword === result.data.newPassword) {
    return Response.json(
      {
        message: "New password must be different from the current password",
      },
      {
        status: 400,
      }
    );
  }

  const passwordHash = await bcrypt.hash(
    result.data.newPassword,
    10
  );

  user.passwordHash = passwordHash;

  await user.save();

  return Response.json(
    {
      message: "Password changed successfully",
    },
    {
      status: 200,
    }
  );
}