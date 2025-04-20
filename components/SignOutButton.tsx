"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { signOut } from "@/lib/actions/auth.action";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <Button 
      onClick={handleSignOut}
      className="btn-sign-out text-white rounded-lg"
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton; 