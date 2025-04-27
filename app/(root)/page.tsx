import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { dummyInterviews } from '@/constants'
import InterviewCard from '@/components/InterviewCard'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action'
const page = async () => {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

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

        <Image src="/waterloo_logo.png" alt="robo-dude" width={250} height={250} className='max-sm:hidden' />
      </section>

      <section className='flex flex-col gap-6 mt-8 bg-[rgb(22,22,22)] rounded-3xl p-8 shadow-[0_10px_10px_0_#ff34a1]'>
        <h2>Your interviews</h2>

        <div className='interviews-section'>
          {hasPastInterviews ? (
              userInterviews?.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))
            ) : (
              <p className='text-white'>You haven&apos;t taken any interviews yet</p>
            )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8 bg-[rgb(22,22,22)] rounded-3xl p-8 w-full shadow-[0_10px_10px_0_#428fed]">
        <h2>Community Interviews</h2>

        <div className="interviews-section flex flex-wrap gap-4 justify-center">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>

    </>
  )
}

export default page
