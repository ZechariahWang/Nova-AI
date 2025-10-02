import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import dayjs from 'dayjs'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action'
import InterviewTable from '@/components/InterviewTable'
import DeleteInterviewButton from '@/components/DeleteInterviewButton'
import InterviewSearch from '@/components/InterviewSearch'
import CommunityInterviewSearch from '@/components/CommunityInterviewSearch'
import { redirect } from 'next/navigation'

const page = async () => {
  let user;

  try {
    user = await getCurrentUser();
  } catch (error) {
    console.error('Error getting current user:', error);
    redirect('/sign-in');
  }

  if (!user || !user.id) {
    redirect('/sign-in');
  }

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
  ]);

  // Calculate accurate stats
  const totalSessions = userInterviews?.length || 0;

  // Sessions this week
  const thisWeekSessions = userInterviews?.filter(i =>
    dayjs(i.createdAt).isAfter(dayjs().subtract(7, 'days'))
  ).length || 0;

  // Calculate actual streak
  const calculateStreak = () => {
    if (!userInterviews || userInterviews.length === 0) return 0;

    // Sort interviews by date (most recent first)
    const sortedInterviews = [...userInterviews].sort((a, b) =>
      dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    );

    let streak = 0;
    let currentDate = dayjs().startOf('day');

    // Check if there's an interview today or yesterday to start the streak
    const mostRecent = dayjs(sortedInterviews[0].createdAt).startOf('day');
    const daysSinceMostRecent = currentDate.diff(mostRecent, 'day');

    if (daysSinceMostRecent > 1) return 0; // Streak is broken

    // Count consecutive days
    for (let i = 0; i < sortedInterviews.length; i++) {
      const interviewDate = dayjs(sortedInterviews[i].createdAt).startOf('day');
      const expectedDate = currentDate.subtract(streak, 'day');

      if (interviewDate.isSame(expectedDate, 'day')) {
        streak++;
      } else if (interviewDate.isBefore(expectedDate, 'day')) {
        // Check if there's an interview on the previous day
        const prevDate = expectedDate.subtract(1, 'day');
        if (interviewDate.isSame(prevDate, 'day')) {
          streak++;
        } else {
          break; // Streak is broken
        }
      }
    }

    return streak;
  };

  const currentStreak = calculateStreak();

  return (
    <div className="h-screen p-3 overflow-hidden">
      {/* Masonry-style Asymmetric Grid */}
      <div className="h-full grid grid-cols-6 grid-rows-6 gap-3">

        {/* Welcome Section - Irregular Shape */}
        <section className='col-span-6 md:col-span-4 row-span-2 relative overflow-hidden bg-gradient-to-br from-[rgb(22,22,22)] to-[rgb(18,18,18)] rounded-3xl p-4 sm:p-6 shadow-[0_8px_16px_0_rgba(0,255,195,0.08)] border border-white/8'>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-l from-[#00ffc3]/6 to-transparent rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-r from-[#ff34a1]/4 to-transparent rounded-full blur-xl"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-r from-[#ff34a1]/3 to-[#00ffc3]/3 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex flex-col justify-between h-full gap-3">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-[#ff34a1] to-[#00ffc3] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className='text-lg sm:text-2xl font-bold text-white leading-tight'>
                    Welcome back<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff34a1] to-[#00ffc3] ml-2">{user?.name}</span>,
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
                  Ready to practice your interview skills? Start a personalized AI-powered session tailored to your experience and career goals.
                </p>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-[#00ffc3]/20 to-[#00ffc3]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#00ffc3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-400">Total Sessions</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-white">{totalSessions}</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-[#ff34a1]/20 to-[#ff34a1]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#ff34a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-400">This Week</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-white">{thisWeekSessions}</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-[#428fed]/20 to-[#428fed]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#428fed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-400">Streak</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-white">{currentStreak}<span className="text-xs sm:text-sm text-gray-400 ml-1">{currentStreak === 1 ? 'day' : 'days'}</span></div>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                <Button asChild className="btn-primary px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm shadow-[0_6px_12px_0_rgba(0,255,195,0.2)] hover:shadow-[0_8px_16px_0_rgba(0,255,195,0.3)] transition-all duration-300 w-full sm:w-auto">
                  <Link href="/interview" className="flex items-center justify-center gap-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Start Interview</span>
                  </Link>
                </Button>
                <Button asChild className="bg-white/8 hover:bg-white/12 text-white border border-white/15 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm transition-all duration-300 w-full sm:w-auto">
                  <Link href="/profile" className="flex items-center justify-center gap-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>View Progress</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Stats Box - Top Right */}
        <div className="col-span-3 md:col-span-2 row-span-1 bg-[rgb(22,22,22)] rounded-2xl p-3 sm:p-4 shadow-[0_6px_12px_0_#00ffc3] border border-white/5 flex flex-col justify-center h-full">
          <div className="flex items-center justify-between mb-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#00ffc3]/20 to-[#00ffc3]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#00ffc3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-right">
              <div className="text-lg sm:text-xl font-bold text-white">{userInterviews?.length || 0}</div>
              <div className="text-xs text-gray-400">Completed</div>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-[#00ffc3] to-[#00ffc3]/80 h-1.5 rounded-full transition-all duration-500" style={{width: `${Math.min((userInterviews?.length || 0) * 20, 100)}%`}}></div>
          </div>
        </div>

        {/* Community Stats Box - Middle Right */}
        <div className="col-span-3 md:col-span-2 row-span-1 bg-[rgb(22,22,22)] rounded-2xl p-3 sm:p-4 shadow-[0_6px_12px_0_#ff34a1] border border-white/5 flex flex-col justify-center h-full">
          <div className="flex items-center justify-between mb-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#ff34a1]/20 to-[#ff34a1]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#ff34a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-right">
              <div className="text-lg sm:text-xl font-bold text-white">{allInterview?.length || 0}</div>
              <div className="text-xs text-gray-400">Available</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="text-xs text-gray-500">Community</div>
            <div className="flex-1 flex justify-end">
              <div className="w-2 h-2 bg-[#ff34a1] rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Your Interviews - Large Left Block */}
        <div className="col-span-3 row-span-4 bg-[rgb(22,22,22)] rounded-2xl p-5 shadow-[0_8px_16px_0_#ff34a1] border border-white/5 flex flex-col min-h-0 relative z-10 overflow-hidden mt-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 flex-shrink-0">
            <h2 className="text-white text-xl font-bold whitespace-nowrap">Your Interviews</h2>
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search interviews..."
                className="w-full pl-10 pr-10 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-400 focus:border-[#00ffc3]/50 focus:ring-2 focus:ring-[#00ffc3]/20 focus:outline-none transition-colors"
                id="interview-search"
              />
            </div>
          </div>
          <InterviewSearch interviews={userInterviews || []} userId={user.id} hideSearchBar />
        </div>

        {/* Community Interviews - Large Right Block */}
        <div className="col-span-3 row-span-4 bg-[rgb(22,22,22)] rounded-2xl p-5 shadow-[0_8px_16px_0_#428fed] border border-white/5 flex flex-col min-h-0 relative z-10 overflow-hidden mt-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 flex-shrink-0">
            <h2 className="text-white text-xl font-bold whitespace-nowrap">Community</h2>
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search community interviews..."
                className="w-full pl-10 pr-10 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-400 focus:border-[#00ffc3]/50 focus:ring-2 focus:ring-[#00ffc3]/20 focus:outline-none transition-colors"
                id="community-search"
              />
            </div>
          </div>
          <CommunityInterviewSearch interviews={allInterview || []} />
        </div>

      </div>
    </div>
  )
}

export default page
