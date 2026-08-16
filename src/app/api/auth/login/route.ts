import bcrypt from "bcrypt";

import User from "@/models/User";

import { cookies } from "next/headers";

import { createTokenForUser } from "@/lib/auth-token";

import { connectDB } from "@/lib/mongodb";

import { loginSchema } from "@/lib/validations/user";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid user data",
          errors: result.error.issues,
        },
        {
          status: 400,
        }
      );
    }

    const user = await User.findOne({
      email: result.data.email.toLowerCase(),
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    if (user.status !== "active") {
      return Response.json(
        {
          success: false,
          message: "Your account is not active.",
        },
        {
          status: 403,
        }
      );
    }

    const passwordMatches = await bcrypt.compare(result.data.password, user.password);

    if (!passwordMatches) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    user.lastLoginAt = new Date();

    await user.save();

  
    const token = await createTokenForUser({userId: user._id.toString(),});

    const cookieStore = await cookies();

    cookieStore.set("token",token,{
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        maxAge: 60 * 60,

        path: "/",
      }
    );

    return Response.json(
      {
        success: true,
        message: "Login successful",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Login error:",
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