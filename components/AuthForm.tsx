"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import FormField from "./FormField";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3)
    })
}

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;

        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully");
        router.push("/sign-in");
      } else {

        const { email, password } = values;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();

        if (!idToken) {
          toast.error("sign in failed");
          return;
        }

        await signIn({
          email, idToken
        });

        toast.success("Sign in successful");
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  }

  const isSignIn = type === 'sign-in';

  return (
    <div className="lg:min-w-[600px] w-full max-w-2xl mx-auto shadow-[0_0_30px_0_rgba(0,255,195,0.3)] border border-gray-700/30 rounded-2xl">
      <div className="flex flex-col gap-8 card py-12 px-10">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-[#ff34a1] to-[#00ffc3] rounded-xl flex items-center justify-center">
              <span className="text-black font-bold text-lg">N</span>
            </div>
            <h2 className="text-white font-bold text-2xl">Nova</h2>
          </div>
          <h3 className="text-gray-300 text-sm font-medium">AI Interview Trainer</h3>
          <div className="mt-6">
            <h4 className="text-xl font-semibold text-white mb-2">
              {isSignIn ? "Welcome back" : "Get started"}
            </h4>
            <p className="text-gray-400 text-sm">
              {isSignIn ? "Sign in to continue" : "Create your account"}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-5 form text-white"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email Address"
              placeholder="Enter your email"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <div className="pt-3">
              <Button className="btn text-white w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg" type="submit">
                {isSignIn ? "Sign In" : "Create Account"}
              </Button>
            </div>
          </form>
        </Form>

        <div className="text-center pt-4 border-t border-gray-700/30">
          <p className="text-gray-400 text-sm">
            {isSignIn ? "New to Nova?" : "Already have an account?"}
            <Link
              href={!isSignIn ? "/sign-in" : "/sign-up"}
              className="font-semibold ml-2 text-transparent bg-clip-text bg-[linear-gradient(90deg,_#ff34a1_5%,_#00ffc3)] hover:opacity-80 transition-opacity"
            >
              {!isSignIn ? "Sign In" : "Sign Up"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthForm
