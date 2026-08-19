export type ProfileUser = {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string | null;
  bio: string;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
};