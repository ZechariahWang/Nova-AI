import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

const LandingPage = () => {
  return (
    <div className="min-h-screen pattern">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#ff34a1] to-[#00ffc3] rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-lg">N</span>
          </div>
          <span className="text-white text-xl font-bold">Nova</span>
        </div>

        <div className="flex items-center gap-4">
          <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button className="btn-primary">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff34a1] to-[#00ffc3]">Interview Skills</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Practice with AI-powered interview simulations. Get real-time feedback, improve your responses, and become a better candidate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="btn-primary text-lg px-8 py-4">
              <Link href="/sign-up">Start Practicing</Link>
            </Button>
            {/* <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-lg px-8 py-4">
              <Link href="#features">Learn More</Link>
            </Button> */}
          </div>
        </div>

        {/* Hero Image/Demo */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-[rgb(22,22,22)] rounded-3xl p-8 shadow-[0_20px_40px_0_rgba(0,255,195,0.2)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400 text-sm ml-4">AI Interview Session</span>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-blue-400 font-semibold mb-2">AI Interviewer:</p>
                <p className="text-gray-300">"Tell me about a time you overcame a technical challenge."</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-green-400 font-semibold mb-2">Your Response:</p>
                <p className="text-gray-300">"In my previous role, I encountered a performance issue with our database queries..."</p>
              </div>
              <div className="bg-gradient-to-r from-[#ff34a1]/20 to-[#00ffc3]/20 rounded-lg p-4 border border-[#00ffc3]/30">
                <p className="text-white font-semibold mb-2">✨ AI Feedback:</p>
                <p className="text-gray-300">Great structure! Consider adding more specific metrics to strengthen your impact.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* <section id="features" className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Why Choose Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff34a1] to-[#00ffc3]">AI Trainer</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get personalized interview practice with cutting-edge AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[rgb(22,22,22)] rounded-3xl p-8 text-center shadow-[0_10px_30px_0_rgba(255,52,161,0.2)]">
            <div className="w-16 h-16 bg-gradient-to-r from-[#ff34a1] to-[#00ffc3] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Questions</h3>
            <p className="text-gray-300">
              Dynamic interview questions tailored to your role and experience level
            </p>
          </div>

          <div className="bg-[rgb(22,22,22)] rounded-3xl p-8 text-center shadow-[0_10px_30px_0_rgba(0,255,195,0.2)]">
            <div className="w-16 h-16 bg-gradient-to-r from-[#ff34a1] to-[#00ffc3] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Detailed Feedback</h3>
            <p className="text-gray-300">
              Get comprehensive analysis of your performance with actionable insights
            </p>
          </div>

          <div className="bg-[rgb(22,22,22)] rounded-3xl p-8 text-center shadow-[0_10px_30px_0_rgba(66,143,237,0.2)]">
            <div className="w-16 h-16 bg-gradient-to-r from-[#ff34a1] to-[#00ffc3] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Real-time Practice</h3>
            <p className="text-gray-300">
              Practice anytime, anywhere with instant voice-based interview simulations
            </p>
          </div>
        </div>
      </section>  */}

      {/* <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-[#ff34a1] to-[#00ffc3] rounded-full flex items-center justify-center">
                <span className="text-black font-bold">N</span>
              </div>
              <span className="text-white font-bold">Nova</span>
            </div>

            <div className="text-gray-400 text-sm">
              © 2024 Nova. All rights reserved.
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  )
}

export default LandingPage