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
  if (!interview) redirect('/');

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  console.log(feedback);
  
  return (
    <section className="section-feedback min-h-screen bg-[rgb(22,22,22)]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-row justify-center mb-12">
          <h1 className="text-4xl font-semibold text-center">
            <span className="capitalize">{interview.role}</span> Interview Review
          </h1>
        </div>

        <div className="flex flex-row justify-center mb-12">
          <div className="flex flex-row gap-8">
            {/* Overall Impression */}
            <div className="flex flex-row gap-3 items-center">
              {/* <Image src="/star.svg" width={22} height={22} alt="star" /> */}
              <p className="text-lg text-white">
                Overall Score:{" "}
                <span className="text-white font-bold">
                  {feedback?.totalScore}
                </span>
                /100
              </p>
            </div>

            {/* Date */}
            <div className="flex flex-row gap-3">
              {/* <Image src="/calendar.svg" width={22} height={22} alt="calendar" /> */}
              <p className="text-lg text-white">
                {feedback?.createdAt
                  ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <hr className="my-12" />

        <p className="text-lg mb-12 text-white">{feedback?.finalAssessment}</p>

        <div className="flex flex-col gap-8 mb-12">
          <h2 className="text-2xl font-semibold text-white">Breakdown of the Interview:</h2>
          {feedback?.categoryScores?.map((category, index) => (
            <div key={index} className="flex flex-col gap-4">
              <p className="text-xl font-bold text-white">
                {index + 1}. {category.name} ({category.score}/100)
              </p>
              <p className="text-lg text-white">{category.comment}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 mb-12">
          <h3 className="text-2xl font-semibold text-white">Strengths</h3>
          <ul className="flex flex-col gap-3">
            {feedback?.strengths?.map((strength, index) => (
              <li key={index} className="text-lg text-white">{strength}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6 mb-12">
          <h3 className="text-2xl font-semibold text-white">Areas for Improvement</h3>
          <ul className="flex flex-col gap-3">
            {feedback?.areasForImprovement?.map((area, index) => (
              <li key={index} className="text-lg text-white">{area}</li>
            ))}
          </ul>
        </div>

        <div className="buttons gap-8">
          <Button className="btn-primary flex-1">
            <Link href="/" className="flex w-full justify-center">
              <p className="text-sm font-semibold text-black text-center">
                Back to dashboard
              </p>
            </Link>
          </Button>

          <Button className="btn-primary flex-1 bg-gradient-to-r from-[#ff34a1] to-[#00ffc3]">
            <Link
              href={`/interview/${id}`}
              className="flex w-full justify-center"
            >
              <p className="text-sm font-semibold text-black text-center">
                Retake Interview
              </p>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default page;