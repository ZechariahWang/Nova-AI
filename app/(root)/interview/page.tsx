import InterviewForm from '@/components/InterviewForm'
import { getCurrentUser } from '@/lib/actions/auth.action'
import React from 'react'

const page = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col gap-8">
      <h3 className='text-white text-left'>Interview Generation</h3>
      <InterviewForm userId={user?.id!} />
    </div>
  )
}

export default page
