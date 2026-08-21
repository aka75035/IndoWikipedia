import { redirect } from "next/navigation";
import LoginForm from "@/components/Auth/LoginForm";
import { getCurrentUser } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your IndoWikipedia account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Login() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LoginForm />
}