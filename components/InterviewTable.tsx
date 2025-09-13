import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

interface InterviewTableProps {
  interviews: Array<{
    id: string;
    userId?: string;
    role: string;
    type: string;
    techstack: string[];
    createdAt: string | Date;
  }>;
  userId?: string;
  title: string;
  shadowColor?: string;
}

const InterviewTable = async ({ interviews, userId, title, shadowColor = "#ff34a1" }: InterviewTableProps) => {
  // Get feedback for all interviews
  const interviewsWithFeedback = await Promise.all(
    interviews.map(async (interview) => {
      const feedback = userId && interview.id
        ? await getFeedbackByInterviewId({
            interviewId: interview.id,
            userId,
          })
        : null;
      return { ...interview, feedback };
    })
  );

  const getBadgeColor = (type: string) => {
    const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
    return {
      Behavioral: "bg-blue-500",
      Mixed: "bg-purple-500",
      Technical: "bg-green-500",
    }[normalizedType] || "bg-gray-500";
  };

  return (
    <section className="flex flex-col gap-6 mt-8 bg-[rgb(22,22,22)] rounded-3xl p-8 w-full max-w-none" style={{boxShadow: `0 10px 10px 0 ${shadowColor}`}}>
      <h2 className="text-white text-xl font-bold">{title}</h2>

      {interviews.length === 0 ? (
        <p className="text-white text-center py-8">
          {title.includes("Your") ? "You haven't taken any interviews yet" : "There are no interviews available"}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] table-auto border-collapse">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left p-4 text-white font-semibold">Role</th>
                <th className="text-left p-4 text-white font-semibold">Type</th>
                <th className="text-left p-4 text-white font-semibold">Tech Stack</th>
                <th className="text-left p-4 text-white font-semibold">Date</th>
                <th className="text-left p-4 text-white font-semibold">Score</th>
                <th className="text-left p-4 text-white font-semibold">Status</th>
                <th className="text-left p-4 text-white font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {interviewsWithFeedback.map((interview) => {
                const normalizedType = /mix/gi.test(interview.type) ? "Mixed" : interview.type;
                const formattedDate = dayjs(
                  interview.feedback?.createdAt || interview.createdAt || Date.now()
                ).format("MMM D, YYYY");

                return (
                  <tr key={interview.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div className="text-white font-medium capitalize">
                        {interview.role} Interview
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${getBadgeColor(interview.type)}`}>
                        {normalizedType}
                      </span>
                    </td>
                    <td className="p-4">
                      <DisplayTechIcons techStack={interview.techstack} />
                    </td>
                    <td className="p-4">
                      <span className="text-gray-300">{formattedDate}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-white font-medium">
                        {interview.feedback?.totalScore || "---"}/100
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm ${interview.feedback ? 'text-green-400' : 'text-yellow-400'}`}>
                        {interview.feedback ? 'Completed' : 'Not taken'}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button className="btn-primary text-sm px-4 py-2">
                        <Link
                          href={
                            interview.feedback
                              ? `/interview/${interview.id}/feedback`
                              : `/interview/${interview.id}`
                          }
                        >
                          {interview.feedback ? "View Feedback" : "Start Interview"}
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default InterviewTable;