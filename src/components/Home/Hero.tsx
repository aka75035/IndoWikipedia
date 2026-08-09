"use client";
import { useState } from "react";
import SearchBar from "@/components/Navbar/SearchBar"
export default function Hero(){
  const [search, setSearch] = useState("")
  return(
    <>
      <SearchBar search={search} onSearchChange={setSearch}/>
    </>
  )
}