import React, { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Video, Home } from 'lucide-react'
import ProfileDropdown from '@/components/ProfileDropdown'

const RootLayout = async ({children}: {children: ReactNode}) => {
  try {
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) redirect("/sign-in");
  } catch (error) {
    console.error('Root layout error:', error);
    redirect("/sign-in");
  }

  return (
    <div className='root-layout'>
      {/* Floating Island Navbar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <nav className="bg-[rgb(22,22,22)]/95 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-w-fit">
          <div className="flex items-center gap-6">
            {/* Brand */}
            <Link href="/dashboard" className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#ff34a1] to-[#00ffc3] rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">N</span>
                </div>
                <h2 className='text-transparent font-bold bg-clip-text bg-gradient-to-r from-[#ff34a1] to-[#00ffc3] text-lg'>Nova</h2>
              </div>
            </Link>

            {/* Navigation Items */}
            <div className="flex items-center gap-1">
              <Link href="/dashboard" className='flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff34a1]/10 to-[#00ffc3]/10 hover:from-[#ff34a1]/20 hover:to-[#00ffc3]/20 transition-all duration-300 text-white border border-[#00ffc3]/20 hover:border-[#00ffc3]/30'>
                <Home className="size-4" />
                <span className="hidden sm:inline text-sm font-medium">Dashboard</span>
              </Link>

              <Link href="/interview" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff34a1]/10 to-[#00ffc3]/10 hover:from-[#ff34a1]/20 hover:to-[#00ffc3]/20 transition-all duration-300 text-white border border-[#00ffc3]/20 hover:border-[#00ffc3]/30">
                <Video className="size-4" />
                <span className="hidden sm:inline text-sm font-medium">Interview</span>
              </Link>

              {/* Profile Dropdown Container */}
              <div className="pl-3 ml-2 border-l border-white/10">
                <ProfileDropdown />
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
