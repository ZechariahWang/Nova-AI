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
        <h2 className="text-xl font-semibold">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-dark-300">
            <h3 className="text-sm text-white">Name</h3>
            <p className="text-lg text-white">{user.name}</p>
          </div>
          <div className="p-4 rounded-lg bg-dark-300">
            <h3 className="text-sm text-white">Email</h3>
            <p className="text-lg text-white">{user.email}</p>
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