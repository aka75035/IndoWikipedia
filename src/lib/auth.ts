import User from "@/models/User";
import { cookies } from "next/headers";
import { verifyToken } from "./auth-token";
import { connectDB } from "./mongodb";



export async function getCurrentUser() {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token);

    if (!payload.userId) {
      return null;
    }

    const user = await User.findById(payload.userId).select(
      "-passwordHash"
    );

    return user;
  } catch {
    return null;
  }
}
export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      status: 401,
    };
  }

  if (user.role !== "admin") {
    return {
      user: null,
      status: 403,
    };
  }

  return {
    user,
    status: 200,
  };
}

export async function requireLoggedInUser() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      status: 401,
    };
  }

  return {
    user,
    status: 200,
  };
}