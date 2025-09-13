import { getCurrentUser } from '@/lib/actions/auth.action';
import { getFeedbackByInterviewId, getInterviewById } from '@/lib/actions/general.action';
import React from 'react'
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';

const page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect('/dashboard');

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  console.log(feedback);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500/20 border-green-500/30";
    if (score >= 60) return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  return (
    <div className="min-h-screen pattern">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff34a1] to-[#00ffc3]">Review</span>
          </h1>
          <p className="text-xl text-gray-300 capitalize">{interview.role} Position</p>
        </div>

        {/* Score Overview Card */}
        <div className="bg-[rgb(22,22,22)] rounded-3xl p-8 mb-8 shadow-[0_10px_30px_0_rgba(0,255,195,0.3)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 ${getScoreBgColor(feedback?.totalScore || 0)}`}>
                <span className={`text-3xl font-bold ${getScoreColor(feedback?.totalScore || 0)}`}>
                  {feedback?.totalScore || 0}
                </span>
              </div>
              <p className="text-white text-lg font-semibold mt-3">Overall Score</p>
              <p className="text-gray-400">out of 100</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">
                {feedback?.createdAt ? dayjs(feedback.createdAt).format("MMM D, YYYY") : "N/A"}
              </div>
              <p className="text-gray-400">Interview Date</p>
              <p className="text-sm text-gray-500">
                {feedback?.createdAt ? dayjs(feedback.createdAt).format("h:mm A") : ""}
              </p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff34a1] to-[#00ffc3] mb-2">
                {interview.type}
              </div>
              <p className="text-gray-400">Interview Type</p>
            </div>
          </div>
        </div>

        {/* Final Assessment */}
        <div className="bg-[rgb(22,22,22)] rounded-3xl p-8 mb-8 shadow-[0_10px_30px_0_rgba(255,52,161,0.2)]">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Overall Assessment
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">{feedback?.finalAssessment}</p>
        </div>

        {/* Category Breakdown */}
        <div className="bg-[rgb(22,22,22)] rounded-3xl p-8 mb-8 shadow-[0_10px_30px_0_rgba(66,143,237,0.2)]">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Performance Breakdown
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {feedback?.categoryScores?.map((category, index) => (
              <div key={index} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBgColor(category.score)} ${getScoreColor(category.score)}`}>
                    {category.score}/100
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#ff34a1] to-[#00ffc3]"
                    style={{ width: `${category.score}%` }}
                  ></div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{category.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths and Areas for Improvement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Strengths */}
          <div className="bg-[rgb(22,22,22)] rounded-3xl p-8 shadow-[0_10px_30px_0_rgba(0,255,195,0.2)]">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Strengths
            </h3>
            <ul className="space-y-3">
              {feedback?.strengths?.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">{strength}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-[rgb(22,22,22)] rounded-3xl p-8 shadow-[0_10px_30px_0_rgba(255,52,161,0.2)]">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {feedback?.areasForImprovement?.map((area, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">{area}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </Button>

          <Button className="btn-primary px-8 py-3">
            <Link href={`/interview/${id}`} className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retake Interview
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;