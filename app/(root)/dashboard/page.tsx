import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import dayjs from 'dayjs'
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
    <div className="h-screen p-3 overflow-hidden">
      {/* Masonry-style Asymmetric Grid */}
      <div className="h-full grid grid-cols-6 grid-rows-6 gap-3">

        {/* Welcome Section - Irregular Shape */}
        <section className='col-span-4 row-span-2 relative overflow-hidden bg-gradient-to-br from-[rgb(22,22,22)] to-[rgb(18,18,18)] rounded-3xl p-6 shadow-[0_8px_16px_0_rgba(0,255,195,0.08)] border border-white/8'>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-l from-[#00ffc3]/6 to-transparent rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-r from-[#ff34a1]/4 to-transparent rounded-full blur-xl"></div>

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#ff34a1] to-[#00ffc3] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className='text-2xl font-bold text-white'>
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff34a1] to-[#00ffc3]">{user?.name}</span>
                  </h2>
                </div>
                <p className="text-base text-gray-300 max-w-2xl leading-relaxed">
                  Ready to practice your interview skills? Start a personalized AI-powered session tailored to your experience and career goals.
                </p>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex gap-4">
                <Button asChild className="btn-primary px-6 py-3 text-sm shadow-[0_6px_12px_0_rgba(0,255,195,0.2)] hover:shadow-[0_8px_16px_0_rgba(0,255,195,0.3)] transition-all duration-300">
                  <Link href="/interview" className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start Interview
                  </Link>
                </Button>
                <Button asChild className="bg-white/8 hover:bg-white/12 text-white border border-white/15 px-6 py-3 text-sm transition-all duration-300">
                  <Link href="/profile">View Progress</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Stats Box - Top Right */}
        <div className="col-span-2 row-span-1 bg-[rgb(22,22,22)] rounded-2xl p-4 shadow-[0_6px_12px_0_#00ffc3] border border-white/5 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00ffc3]/20 to-[#00ffc3]/10 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-[#00ffc3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white">{userInterviews?.length || 0}</div>
              <div className="text-xs text-gray-400">Completed</div>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-[#00ffc3] to-[#00ffc3]/80 h-1.5 rounded-full transition-all duration-500" style={{width: `${Math.min((userInterviews?.length || 0) * 20, 100)}%`}}></div>
          </div>
        </div>

        {/* Community Stats Box - Middle Right */}
        <div className="col-span-2 row-span-1 bg-[rgb(22,22,22)] rounded-2xl p-4 shadow-[0_6px_12px_0_#ff34a1] border border-white/5 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#ff34a1]/20 to-[#ff34a1]/10 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-[#ff34a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white">{allInterview?.length || 0}</div>
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
        <div className="col-span-3 row-span-4 bg-[rgb(22,22,22)] rounded-2xl p-5 shadow-[0_8px_16px_0_#ff34a1] border border-white/5 flex flex-col min-h-0">
          <h2 className="text-white text-xl font-bold mb-4 flex-shrink-0">Your Interviews</h2>

          {!userInterviews || userInterviews.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-center">You haven't taken any interviews yet</p>
                <p className="text-gray-500 text-sm mt-2">Click "Start Interview" to begin</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="space-y-3">
                  {userInterviews.map((interview) => {
                    const normalizedType = /mix/gi.test(interview.type) ? "Mixed" : interview.type;
                    const formattedDate = dayjs(interview.createdAt).format("MMM D");
                    const getBadgeColor = (type: string) => ({
                      Behavioral: "bg-blue-500",
                      Mixed: "bg-purple-500",
                      Technical: "bg-green-500",
                    }[normalizedType] || "bg-gray-500");

                    return (
                      <div key={interview.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/8 transition-colors group">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-white font-semibold text-base capitalize">{interview.role}</h3>
                          <span className="text-xs text-gray-400">{formattedDate}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${getBadgeColor(interview.type)}`}>
                              {normalizedType}
                            </span>
                            <div className="flex gap-2">
                              {interview.techstack.slice(0, 2).map((tech, i) => (
                                <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded-md text-gray-300">
                                  {tech}
                                </span>
                              ))}
                              {interview.techstack.length > 2 && (
                                <span className="text-xs text-gray-400">+{interview.techstack.length - 2}</span>
                              )}
                            </div>
                          </div>

                          <Button className="btn-primary text-xs px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/interview/${interview.id}`}>
                              Start
                            </Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Community Interviews - Large Right Block */}
        <div className="col-span-3 row-span-4 bg-[rgb(22,22,22)] rounded-2xl p-5 shadow-[0_8px_16px_0_#428fed] border border-white/5 flex flex-col min-h-0">
          <h2 className="text-white text-xl font-bold mb-4 flex-shrink-0">Community Interviews</h2>

          {!allInterview || allInterview.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-center">No community interviews available</p>
                <p className="text-gray-500 text-sm mt-2">Check back soon for new content</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="space-y-3">
                  {allInterview.map((interview) => {
                    const normalizedType = /mix/gi.test(interview.type) ? "Mixed" : interview.type;
                    const formattedDate = dayjs(interview.createdAt).format("MMM D");
                    const getBadgeColor = (type: string) => ({
                      Behavioral: "bg-blue-500",
                      Mixed: "bg-purple-500",
                      Technical: "bg-green-500",
                    }[normalizedType] || "bg-gray-500");

                    return (
                      <div key={interview.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/8 transition-colors group">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-white font-semibold text-base capitalize">{interview.role}</h3>
                          <span className="text-xs text-gray-400">{formattedDate}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${getBadgeColor(interview.type)}`}>
                              {normalizedType}
                            </span>
                            <div className="flex gap-2">
                              {interview.techstack.slice(0, 2).map((tech, i) => (
                                <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded-md text-gray-300">
                                  {tech}
                                </span>
                              ))}
                              {interview.techstack.length > 2 && (
                                <span className="text-xs text-gray-400">+{interview.techstack.length - 2}</span>
                              )}
                            </div>
                          </div>

                          <Button className="btn-primary text-xs px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/interview/${interview.id}`}>
                              Try
                            </Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default page
