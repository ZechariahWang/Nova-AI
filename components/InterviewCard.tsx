import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" :
    type === "coding" ? "Coding" :
    type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

  const getBadgeColor = (type: string) => {
    const normalizedType = /mix/gi.test(type) ? "Mixed" :
      type === "coding" ? "Coding" :
      type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    return {
      Behavioral: "bg-blue-500",
      Mixed: "bg-purple-500",
      Technical: "bg-green-500",
      Coding: "bg-orange-500",
    }[normalizedType] || "bg-gray-500";
  };

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D");

  return (
    <div className="bg-white/5 rounded-xl p-4 hover:bg-white/8 transition-colors group w-full overflow-hidden relative z-0">
      <div className="flex items-center justify-between mb-3 min-w-0 w-full">
        <h3 className="text-white font-semibold text-base capitalize truncate pr-2" style={{maxWidth: 'calc(100% - 80px)'}}>{role}</h3>
        <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto">{formattedDate}</span>
      </div>

      <div className="flex items-center gap-3 mb-3 min-w-0 overflow-hidden w-full">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${getBadgeColor(type)} flex-shrink-0`}>
          {normalizedType}
        </span>
        <div className="flex gap-2 min-w-0 overflow-hidden flex-wrap" style={{maxWidth: 'calc(100% - 120px)'}}>
          {techstack.slice(0, 2).map((tech, i) => (
            <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded-md text-gray-300 whitespace-nowrap truncate" style={{maxWidth: '80px'}}>
              {tech}
            </span>
          ))}
          {techstack.length > 2 && (
            <span className="text-xs text-gray-400 flex-shrink-0">+{techstack.length - 2}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00ffc3] rounded-full"></div>
          <span className="text-xs text-gray-400">Score</span>
          <span className="text-sm font-medium text-white">{feedback?.totalScore || "---"}/100</span>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4 line-clamp-2">
        {feedback?.finalAssessment ||
          "You haven't taken this interview yet. Take it now to improve your skills."}
      </p>

      <Button className="btn-primary text-xs px-4 py-2 w-full opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          href={
            feedback
              ? `/interview/${interviewId}/feedback`
              : `/interview/${interviewId}`
          }
        >
          {feedback ? "View Feedback" : "Start Interview"}
        </Link>
      </Button>
    </div>
  );
};

export default InterviewCard;