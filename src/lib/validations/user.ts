import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required")
    .max(
      100,
      "Display name cannot exceed 100 characters"
    ),
    terms: z
    .boolean()
    .refine(
      (value) => value === true,
      "You must agree to the Terms & Conditions"
    ),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});


/**
 * Update profile
 */
export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required")
    .max(
      100,
      "Display name cannot exceed 100 characters"
    ),

  bio: z
    .string()
    .trim()
    .max(
      1000,
      "Bio cannot exceed 1000 characters"
    )
    .optional(),

  avatar: z
    .string()
    .trim()
    .url("Avatar must be a valid URL")
    .nullable()
    .optional(),
});


/**
 * Change password
 */
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required"),

  newPassword: z
    .string()
    .min(
      8,
      "New password must be at least 8 characters"
    ),
});


/**
 * Types
 */
export type CreateUserInput =
  z.infer<typeof userSchema>;

export type LoginInput =
  z.infer<typeof loginSchema>;

export type UpdateProfileInput =
  z.infer<typeof updateProfileSchema>;

export type ChangePasswordInput =
  z.infer<typeof changePasswordSchema>;