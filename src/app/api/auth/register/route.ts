import bcrypt from "bcrypt";

import User from "@/models/User";

import { connectDB } from "@/lib/mongodb";

import { userSchema, } from "@/lib/validations/user";


export async function POST(
  request: Request
) {
  try {
    await connectDB();

    const body = await request.json();

    const result = userSchema.safeParse(body);

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

    const {username, email, password, displayName, } = result.data;

    const hashedPassword = await bcrypt.hash(password, 10);

  
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        displayName,
      });

    return Response.json(
      {
        success: true,
        message:
          "User registered successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    const err =
      error as {
        code?: number;
      };

    if (err.code === 11000) {
      return Response.json(
        {
          success: false,
          message:
            "Username or email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    return Response.json(
      {
        success: false,
        message:
          "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}