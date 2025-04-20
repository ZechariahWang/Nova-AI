"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { signOut } from "@/lib/actions/auth.action";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-nav flex items-center gap-2 text-white"
      >
        <User className="size-4" />
        <span className="hidden sm:inline">Profile</span>
      </Button>

      <div
        className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-dark-200 border border-input transition-all duration-200 ease-in-out transform ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-1">
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-white hover:bg-input/50 transition-colors duration-150"
            onClick={() => setIsOpen(false)}
          >
            View Profile
          </Link>
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-input/50 transition-colors duration-150"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown; 