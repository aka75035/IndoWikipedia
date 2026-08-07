"use client";
import { Search } from "lucide-react";
type SearchBarProps = {
    search: string;
    onSearchChange: (value: string) => void;
};
export default function SearchBar({search, onSearchChange}:SearchBarProps){
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target?.value);
  };
  return (
    <div className="flex">
        <Search />
        <input 
            className="flex-1" 
            type="text" 
            aria-label="Search articles" 
            placeholder="Search Indian History..." 
            value={search} 
            onChange={handleChange} />
    </div>

  );
}