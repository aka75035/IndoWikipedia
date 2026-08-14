import { loginSchema } from "@/lib/validations/user";
import bcrypt from "bcrypt";
import User from "@/models/User";


export async function POST(request: Request){
  try{
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