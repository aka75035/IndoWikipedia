
  import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import SignUpForm from "@/components/Auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create an account on IndoWikipedia.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return <SignUpForm />;
}