import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

const AuthLayout = async ({children}: {children: ReactNode}) => {
  try {
    const isUserAuthenticated = await isAuthenticated();
    if (isUserAuthenticated) redirect("/");
  } catch (error) {
    console.error('Auth layout error:', error);
    // Continue to show auth pages if authentication check fails
  }
  
  return (
    <div className="auth-layout">
      {children}
    </div>
  )
}

export default AuthLayout
