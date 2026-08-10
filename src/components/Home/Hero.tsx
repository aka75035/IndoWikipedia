"use client";
import { useState } from "react";
import SearchBar from "@/components/Navbar/SearchBar"
export default function Hero(){
  const [search, setSearch] = useState("")
  return(
    <div className="flex flex-col md:flex-row">
      <div className="flex-1">
        <SearchBar search={search} onSearchChange={setSearch}/>
      </div>
      <div className="w-1/3"></div>
    </div>
  )
}