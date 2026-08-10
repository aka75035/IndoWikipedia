"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

type SearchBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export default function SearchBar({
  search,
  onSearchChange,
}: SearchBarProps) {
  const router = useRouter();
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>){
    if(e.key === "Enter"){
      router.push(`/search?q=${search}`);
    }
  }
  return (
    <div className="flex items-center gap-3 rounded-full border bg-white px-4 py-2 shadow-sm transition focus-within:ring-2 focus-within:ring-blue-500">
      <Search
        size={18}
        className="text-gray-500"
      />

      <input
        className="flex-1 bg-transparent outline-none"
        type="text"
        aria-label="Search articles"
        placeholder="Search Indian History..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={onKeyDown}
      />

      <kbd className="hidden rounded border bg-gray-50 px-2 py-1 text-xs text-gray-500 md:block">
        Ctrl K
      </kbd>
    </div>
  );
}