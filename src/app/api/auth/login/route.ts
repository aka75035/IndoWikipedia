import { loginSchema } from "@/lib/validations/user";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { cookies } from "next/headers";
import { createTokenForUser } from "@/lib/auth-token";
import { connectDB } from "@/lib/mongodb";


export async function POST(request: Request){
  try{
    await connectDB();
    const body = await request.json();
    const result = loginSchema.safeParse(body);
    if(!result.success){
      return Response.json(
        {
          message: "Invalid User Data",
          errors: result.error.issues,
        },
        {
          status: 400,
        }
      );
    }


    const user = await User.findOne({
      email: result.data.email,
    })
    if(!user){
      return Response.json(
        {
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      )
    }
    const password = result.data.password;
    const comparison = await bcrypt.compare(password, user.passwordHash);
    if(!comparison){
      return(
        Response.json(
          {
            message: "Invalid email or password."
          },
          {
          status: 401,
          }
        )
      )
    }

    const token = await createTokenForUser({
      userId: user._id.toString(),
    });
    console.log(token);

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });
    
    return Response.json(
      {
        message: "success",
      },
      {
        status: 200,
      }
    )
  } catch (error) {

    return Response.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}