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
      <nav className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
        <Link href="/dashboard" className="flex items-center">
          <h2 className='text-transparent font-bold bg-clip-text bg-gradient-to-r from-[#ff34a1] to-[#00ffc3]'>Nova</h2>
        </Link>
        
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <Button asChild className="btn-nav">
            <Link href="/dashboard" className='flex items-center gap-2 text-white'>
              <Home className="size-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
          <Button asChild className="btn-nav">
            <Link href="/interview" className="flex items-center gap-2 text-white">
              <Video className="size-4" />
              <span className="hidden sm:inline">Start Interview</span>
            </Link>
          </Button>
          <ProfileDropdown />
        </div>
      </nav>
      {children}
    </div>
  );
};

export default RootLayout;
