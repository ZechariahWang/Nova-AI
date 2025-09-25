import AuthForm from '@/components/AuthForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | Nova - AI Interview Trainer',
  description: 'Sign in to your Nova account and continue your interview preparation journey.',
}

const SignInPage = () => {
  return (
    <AuthForm type="sign-in" />
  )
}

export default SignInPage
