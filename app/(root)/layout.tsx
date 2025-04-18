import React, { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import SignOutButton from '@/components/SignOutButton'

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
      <nav className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          {/* <Image src="/logo.svg" alt='Logo' width={38} height={32}/> */}
          <h2 className='text-transparent font-bold bg-clip-text bg-gradient-to-r from-[#ff34a1] to-[#00ffc3]'>Waterloo Interview Trainer</h2>
        </Link>
        
        <div className="flex items-center gap-4">
        <Button asChild className="btn-secondary">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild className="btn-secondary">
            <Link href="/interview">Start Interview</Link>
          </Button>
          <Button asChild className="btn-secondary">
            <Link href="/profile">Profile</Link>
          </Button>
          <SignOutButton />
        </div>
      </nav>
      {children}
    </div>
  )
}

export default RootLayout
