"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { signOut } from "@/lib/actions/auth.action";

interface ProfileDropdownProps {
  loadingPath?: string | null;
  setLoadingPath?: (path: string | null) => void;
}

const ProfileDropdown = ({ loadingPath, setLoadingPath }: ProfileDropdownProps) => {
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-300 text-white/70 hover:text-white"
      >
        {loadingPath === '/profile' ? (
          <>
            <svg className="size-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline text-sm font-medium">Loading...</span>
          </>
        ) : (
          <>
            <User className="size-4 transition-colors duration-300" />
            <span className="hidden sm:inline text-sm font-medium">Profile</span>
          </>
        )}
      </button>

      <div
        className={`absolute right-0 mt-2 w-48 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-[rgb(22,22,22)]/95 backdrop-blur-xl border border-white/10 transition-all duration-200 ease-in-out transform ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-2">
          <Link
            href="/profile"
            className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all duration-150 flex items-center gap-2"
            onClick={() => {
              setIsOpen(false);
              setLoadingPath?.('/profile');
            }}
          >
            <User className="size-4" />
            View Profile
          </Link>
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all duration-150 flex items-center gap-2"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown; 