"use client";

import { useState } from "react";

import NavLogo from "./NavLogo";
import NavLinks from "./NavLinks";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import { MenuIcon } from "lucide-react";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur text-black">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">

        <NavLogo />

        <div className="hidden lg:flex">
          <NavLinks />
        </div>

        <div className="hidden md:flex md:flex-1 md:justify-center md:px-4">
          <div className="w-full max-w-lg">
            <SearchBar
              search={search}
              onSearchChange={setSearch}
            />
          </div>
        </div>
          <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                aria-label="Open Menu"
                className="block md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <MenuIcon />
              </button>
              <MobileMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
              />
          </div>
      </div>
    </nav>
  );
}