import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action'
import InterviewTable from '@/components/InterviewTable'
const page = async () => {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  return (
    <>
      <section className='card-cta shadow-[0_10px_10px_0_#00ffc3]'>
        <div className="flex flex-col gap-6 max-w-lg">
            <h2 className='text-white'>Welcome, {user?.name}</h2>
            <p className="text-lg text-white">
              Let's do an interview. Click the button below to start.
            </p>

            <Button asChild className="btn-primary max-sm:w-full">
              <Link href="/interview">Start an Interview</Link>
            </Button>
          </div>

      </section>

      <InterviewTable
        interviews={userInterviews || []}
        userId={user?.id}
        title="Your interviews"
        shadowColor="#ff34a1"
      />

      <InterviewTable
        interviews={allInterview || []}
        userId={user?.id}
        title="Community Interviews"
        shadowColor="#428fed"
      />

    </>
  )
}

export default page
