
  import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import SignUpForm from "@/components/Auth/SignupForm";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return <SignUpForm />;
}