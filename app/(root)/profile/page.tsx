import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getInterviewsByUserId } from "@/lib/actions/general.action";
import InterviewCard from "@/components/InterviewCard";

const ProfilePage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const interviews = await getInterviewsByUserId(user.id);

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="relative size-32 rounded-full overflow-hidden">
          <Image
            src="/userMaybe.jpg"
            alt="Profile picture"
            fill
            className="object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-400">{user.email}</p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-white">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4 hover:bg-white/8 transition-colors group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00ffc3]/20 to-[#00ffc3]/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-[#00ffc3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-sm text-gray-400 font-medium">Full Name</h3>
            </div>
            <p className="text-lg text-white font-semibold">{user.name}</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 hover:bg-white/8 transition-colors group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#ff34a1]/20 to-[#ff34a1]/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-[#ff34a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-sm text-gray-400 font-medium">Email Address</h3>
            </div>
            <p className="text-lg text-white font-semibold">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Recent Interviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              interviewId={interview.id}
              userId={user.id}
              role={interview.role}
              type={interview.type}
              techstack={interview.techstack}
              createdAt={interview.createdAt}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 