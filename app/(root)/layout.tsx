"use client"

import React, { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Video, Home } from 'lucide-react'
import ProfileDropdown from '@/components/ProfileDropdown'
import { usePathname } from 'next/navigation'

const RootLayout = ({children}: {children: ReactNode}) => {
  const [loadingPath, setLoadingPath] = useState<string | null>(null)
  const pathname = usePathname()

  // Clear loading state when pathname changes
  useEffect(() => {
    setLoadingPath(null)
  }, [pathname])

  return (
    <div className='root-layout'>
      {/* Floating Island Navbar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <nav className="bg-[rgb(22,22,22)]/95 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-w-fit">
          <div className="flex items-center gap-6">
            {/* Brand */}
            <Link href="/dashboard" className="flex items-center" onClick={() => setLoadingPath('/dashboard')}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#ff34a1] to-[#00ffc3] rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">N</span>
                </div>
                <h2 className='text-transparent font-bold bg-clip-text bg-gradient-to-r from-[#ff34a1] to-[#00ffc3] text-lg'>Nova</h2>
              </div>
            </Link>

            {/* Navigation Items */}
            <div className="flex items-center gap-5">
              <Link
                href="/dashboard"
                className='flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff34a1]/10 to-[#00ffc3]/10 hover:from-[#ff34a1]/20 hover:to-[#00ffc3]/20 transition-all duration-300 text-white border border-[#00ffc3]/20 hover:border-[#00ffc3]/30'
                onClick={() => setLoadingPath('/dashboard')}
              >
                {loadingPath === '/dashboard' ? (
                  <>
                    <svg className="size-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="hidden sm:inline text-sm font-medium">Loading...</span>
                  </>
                ) : (
                  <>
                    <Home className="size-4" />
                    <span className="hidden sm:inline text-sm font-medium">Dashboard</span>
                  </>
                )}
              </Link>

              <Link
                href="/interview"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff34a1]/10 to-[#00ffc3]/10 hover:from-[#ff34a1]/20 hover:to-[#00ffc3]/20 transition-all duration-300 text-white border border-[#00ffc3]/20 hover:border-[#00ffc3]/30"
                onClick={() => setLoadingPath('/interview')}
              >
                {loadingPath === '/interview' ? (
                  <>
                    <svg className="size-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="hidden sm:inline text-sm font-medium">Loading...</span>
                  </>
                ) : (
                  <>
                    <Video className="size-4" />
                    <span className="hidden sm:inline text-sm font-medium">Interview</span>
                  </>
                )}
              </Link>

              {/* Profile Dropdown Container */}
              <div className="pl-3 ml-2 border-l border-white/10">
                <ProfileDropdown loadingPath={loadingPath} setLoadingPath={setLoadingPath} />
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content with top padding */}
      <div className="pt-20">
        {children}
      </div>
    </div>
  );
};

export default RootLayout;
