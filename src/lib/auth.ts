import User from "@/models/User";
import { cookies } from "next/headers";
import { verifyToken } from "./auth-token";
import { connectDB } from "./mongodb";

export type UserRole =
  | "user"
  | "contributor"
  | "editor"
  | "moderator"
  | "admin";

/**
 * Get currently authenticated user
 */
export async function getCurrentUser() {
  await connectDB();

  const cookieStore = await cookies();

  const token =
    cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload =
      await verifyToken(token);

    if (!payload.userId) {
      return null;
    }

    const user =
      await User.findById(
        payload.userId
      ).select("-passwordHash");

    if (!user) {
      return null;
    }

    /**
     * Block inactive accounts
     */
    if (
      user.status === "suspended" ||
      user.status === "banned"
    ) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Generic role authorization
 */
export async function requireRole(
  allowedRoles: UserRole[]
) {
  const user =
    await getCurrentUser();

  if (!user) {
    return {
      user: null,
      status: 401,
    };
  }

  if (
    !allowedRoles.includes(
      user.role as UserRole
    )
  ) {
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

/**
 * Any logged-in user
 */
export async function requireLoggedInUser() {
  return requireRole([
    "user",
    "contributor",
    "editor",
    "moderator",
    "admin",
  ]);
}

/**
 * Contributor or higher
 */
export async function requireContributor() {
  return requireRole([
    "contributor",
    "editor",
    "admin",
  ]);
}

/**
 * Editor or higher
 */
export async function requireEditor() {
  return requireRole([
    "editor",
    "admin",
  ]);
}

/**
 * Moderator or admin
 */
export async function requireModerator() {
  return requireRole([
    "moderator",
    "admin",
  ]);
}

/**
 * Admin only
 */
export async function requireAdmin() {
  return requireRole([
    "admin",
  ]);
}