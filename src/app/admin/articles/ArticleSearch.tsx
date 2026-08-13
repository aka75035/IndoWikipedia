"use client";

import SearchBar from "@/components/Navbar/SearchBar";
import { useState } from "react";

export default function ArticleSearch() {
  const [search, setSearch] = useState("");

  return (
    <SearchBar
      search={search}
      onSearchChange={setSearch}
      basePath="/admin/articles"
    />
  );
}