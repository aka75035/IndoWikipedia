import { requireLoggedInUser } from "@/lib/auth";
import User from "@/models/User";
import { updateProfileSchema } from "@/lib/validations/user";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
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

  const user = await User.findById(auth.user._id).select(
    "-passwordHash"
  );

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

  return Response.json(
    {
      user,
    },
    {
      status: 200,
    }
  );
}

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

  const result = updateProfileSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      {
        message: "Invalid user data",
        errors: result.error.issues,
      },
      {
        status: 400,
      }
    );
  }

  const user = await User.findByIdAndUpdate(
    auth.user._id,
    result.data,
    {
      new: true,
    }
  ).select("-passwordHash");

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

  return Response.json(
    {
      user,
    },
    {
      status: 200,
    }
  );
}