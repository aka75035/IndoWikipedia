"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        console.error("Logout failed");
        return;
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full flex items-center gap-3 rounded-lg px-4 py-3 bg-red-500 hover:bg-red-600 transition"
    >
      <LogOut size={20} />
      Logout
    </button>
  );
}