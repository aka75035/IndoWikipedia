"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

type SearchBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  basePath?: string;
};

export default function SearchBar({
  search,
  onSearchChange,
  basePath = "/search",
}: SearchBarProps) {
  const router = useRouter();

  function onKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      router.push(
        `${basePath}?q=${encodeURIComponent(search)}`
      );
    }
  }

  return (
    <div
      className="
        flex items-center gap-3
        rounded-full
        border border-black/20
        bg-white
        px-4 py-2
        shadow-sm
        transition
        focus-within:ring-2
        focus-within:ring-black

        dark:border-white/30
        dark:bg-black
        dark:focus-within:ring-white
      "
    >
      <Search
        size={18}
        className="shrink-0 text-black dark:text-white"
      />

      <input
        className="
          min-w-0
          flex-1
          bg-transparent
          text-black
          outline-none
          placeholder:text-black/50

          dark:text-white
          dark:placeholder:text-white/50
        "
        type="text"
        aria-label="Search articles"
        placeholder="Search Indian History..."
        value={search}
        onChange={(e) =>
          onSearchChange(e.target.value)
        }
        onKeyDown={onKeyDown}
      />

      <kbd
        className="
          hidden
          rounded
          border
          border-black/20
          bg-gray-50
          px-2
          py-1
          text-xs
          text-black/60
          md:block

          dark:border-white/20  
          dark:bg-white/10
          dark:text-white/60
        "
      >
        Ctrl K
      </kbd>
    </div>
  );
}