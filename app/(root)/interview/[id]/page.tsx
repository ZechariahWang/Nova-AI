import React from "react";
import { getInterviewById } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import Image from "next/image";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getRandomInterviewCover } from "@/lib/utils";

const Page = async ({ params }: RouteParams) => {
  const user = await getCurrentUser();
  const { id } = await params;
  const interview = await getInterviewById(id);

  if (!interview) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-[#0a0a0a] p-4 sm:p-6 min-h-[85vh]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex flex-row gap-3 items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-[#ff34a1] to-[#00ffc3] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white capitalize">
                {interview.role} Interview
              </h1>
            </div>

            <DisplayTechIcons techStack={interview.techstack} />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <div className={`px-4 py-2 rounded-xl font-medium text-sm border-2 backdrop-blur-sm ${
                interview.type.toLowerCase().includes('technical')
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400'
                  : interview.type.toLowerCase().includes('behavioral')
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400'
                  : interview.type.toLowerCase().includes('mix')
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400'
                  : 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-500/30 text-gray-400'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    interview.type.toLowerCase().includes('technical')
                      ? 'bg-green-400'
                      : interview.type.toLowerCase().includes('behavioral')
                      ? 'bg-blue-400'
                      : interview.type.toLowerCase().includes('mix')
                      ? 'bg-purple-400'
                      : 'bg-gray-400'
                  }`} />
                  {interview.type}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Interface */}
        <Agent userName={user?.name!} userId={user?.id} interviewId={id} type="interview" interviewType={interview.type} questions={interview.questions} />
      </div>
    </div>
  );
};

export default Page;
