import { redirect } from "next/navigation";
import LoginForm from "@/components/Auth/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export default async function Login() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LoginForm />
}