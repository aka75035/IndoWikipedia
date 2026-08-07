"use client";

import { Moon } from "lucide-react";

export default function ThemeToggle() {
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="rounded-full p-2 transition hover:bg-gray-100"
    >
      <Moon size={20} />
    </button>
  );
}