"use client"

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import dayjs from 'dayjs'

interface CommunityInterviewSearchProps {
  interviews: Interview[]
}

export default function CommunityInterviewSearch({ interviews }: CommunityInterviewSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // Listen for external search input
  useEffect(() => {
    const handleSearchInput = () => {
      const searchInput = document.getElementById('community-search') as HTMLInputElement
      if (searchInput) {
        setSearchTerm(searchInput.value)
      }
    }

    const searchInput = document.getElementById('community-search')
    if (searchInput) {
      searchInput.addEventListener('input', handleSearchInput)
      return () => {
        searchInput.removeEventListener('input', handleSearchInput)
      }
    }
  }, [])

  const filteredInterviews = useMemo(() => {
    if (!searchTerm.trim()) {
      return interviews
    }

    return interviews.filter(interview =>
      interview.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.techstack.some(tech =>
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [interviews, searchTerm])

  const getBadgeColor = (type: string) => {
    const normalizedType = /mix/gi.test(type) ? "Mixed" :
      type === "coding" ? "Coding" :
      type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    return ({
      Behavioral: "bg-blue-500",
      Mixed: "bg-purple-500",
      Technical: "bg-green-500",
      Coding: "bg-orange-500",
    }[normalizedType] || "bg-gray-500");
  }

  return (
    <div className="flex flex-col h-full">
      {/* Results */}
      <div className="flex-1 overflow-hidden relative">
        {filteredInterviews.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-400 text-center">
                {searchTerm ? `No community interviews found for "${searchTerm}"` : "No community interviews available"}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {searchTerm ? "Try a different search term" : "Check back soon for new content"}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-0">
            <div className="space-y-3 relative z-0">
              {filteredInterviews.map((interview) => {
                const normalizedType = /mix/gi.test(interview.type) ? "Mixed" :
                  interview.type === "coding" ? "Coding" :
                  interview.type.charAt(0).toUpperCase() + interview.type.slice(1).toLowerCase();
                const formattedDate = dayjs(interview.createdAt).format("MMM D");

                return (
                  <div key={interview.id} className="bg-white/5 rounded-xl p-3 sm:p-4 hover:bg-white/8 transition-colors group overflow-hidden relative z-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1 sm:gap-0 min-w-0 w-full">
                      <h3 className="text-white font-semibold text-sm sm:text-base capitalize truncate pr-2" style={{maxWidth: 'calc(100% - 80px)'}}>{interview.role}</h3>
                      <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 absolute top-3 right-3 sm:relative sm:top-auto sm:right-auto">{formattedDate}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0 overflow-hidden w-full">
                        <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white ${getBadgeColor(interview.type)} w-fit flex-shrink-0`}>
                          {normalizedType}
                        </span>
                        <div className="flex gap-1 sm:gap-2 flex-wrap min-w-0 overflow-hidden" style={{maxWidth: 'calc(100% - 120px)'}}>
                          {interview.techstack.slice(0, 2).map((tech, i) => (
                            <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded-md text-gray-300 whitespace-nowrap truncate" style={{maxWidth: '80px'}}>
                              {tech}
                            </span>
                          ))}
                          {interview.techstack.length > 2 && (
                            <span className="text-xs text-gray-400 self-center flex-shrink-0">+{interview.techstack.length - 2}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity justify-end sm:justify-start flex-shrink-0">
                        <Button className="bg-gradient-to-r from-[#428fed]/90 to-[#3b82f6]/90 hover:from-[#428fed] hover:to-[#3b82f6] text-white text-xs px-3 py-1.5 transition-all duration-300 ease-out shadow-sm hover:shadow-md border border-[#428fed]/20 hover:border-[#428fed]/40 backdrop-blur-sm self-center font-medium">
                          <Link href={`/interview/${interview.id}`} className="flex items-center gap-1.5">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-[10px] font-medium">Try</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Search Results Info */}
      {searchTerm && filteredInterviews.length > 0 && (
        <div className="flex-shrink-0 mt-3 pt-3 border-t border-white/10">
          <p className="text-xs text-gray-400 text-center">
            Showing {filteredInterviews.length} of {interviews.length} community interviews
          </p>
        </div>
      )}
    </div>
  )
}