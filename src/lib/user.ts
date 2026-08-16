import User from "@/models/User";
import { connectDB } from "./mongodb";

export async function getUserCount() {
  await connectDB();

  return User.countDocuments();
}

export async function getRecentUsers() {
  await connectDB();

  return User.find()
    .select("-passwordHash")
    .sort({ createdAt: -1 })
    .limit(5);
}
