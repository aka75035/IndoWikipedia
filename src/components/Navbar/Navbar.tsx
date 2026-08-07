"use client";
import { useState } from "react";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [search, setSearch] = useState("");
  return (
    <nav>
      <h1>IndoWikipedia</h1>
      <SearchBar
        search={search}
        onSearchChange={setSearch}
      />
    </nav>
  );
}