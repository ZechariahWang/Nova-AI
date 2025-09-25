import AuthForm from '@/components/AuthForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | Nova - AI Interview Trainer',
  description: 'Create your Nova account and start your journey to interview mastery.',
}

const SignUpPage = () => {
  return (
    <AuthForm type="sign-up" />
  )
}

export default SignUpPage
