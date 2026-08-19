export type UserRole =
  | "user"
  | "contributor"
  | "editor"
  | "moderator"
  | "admin";

export type AuthUser = {
  _id: string;
  username: string;
  displayName?: string;
  role: UserRole;
};