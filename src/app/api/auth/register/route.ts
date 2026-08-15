import { userSchema } from "@/lib/validations/user";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";


export async function POST(request: Request){
  try{
    await connectDB();
    const body = await request.json();
    const result = userSchema.safeParse(body);
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
    const password = result.data.password;
    const passwordHash = await bcrypt.hash(password, 10);


    const user = await User.create({
      name: result.data.name,
      email: result.data.email,
      passwordHash,
    })
    return Response.json(
      {
        message: "success",
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    const err = error as { code?: number };

    if (err.code === 11000) {
      return Response.json(
        {
          message: "An user with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    return Response.json(
      {
        message: "Internal Server Error",
        error: error,
      },
      {
        status: 500,
      }
    );
  }
}