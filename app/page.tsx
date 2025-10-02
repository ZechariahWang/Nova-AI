"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

const LandingPage = () => {
  const [loadingPath, setLoadingPath] = useState<string | null>(null)
  const pathname = usePathname()

  // Clear loading state when pathname changes
  useEffect(() => {
    setLoadingPath(null)
  }, [pathname])
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 }
  }

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  }

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <motion.div
      className="min-h-screen pattern"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      {/* Navigation */}
      <motion.nav
        className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div className="flex items-center gap-3" variants={staggerItem}>
          <motion.div
            className="w-10 h-10 bg-gradient-to-r from-[#ff34a1] to-[#00ffc3] rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-black font-bold text-lg">N</span>
          </motion.div>
          <span className="text-white text-xl font-bold">Nova</span>
        </motion.div>

        <motion.div className="flex items-center gap-4" variants={staggerItem}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/sign-in" onClick={() => setLoadingPath('/sign-in')}>
              <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                {loadingPath === '/sign-in' ? (
                  <>
                    <svg className="size-4 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Loading...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/sign-up" onClick={() => setLoadingPath('/sign-up')}>
              <Button className="btn-primary">
                {loadingPath === '/sign-up' ? (
                  <>
                    <svg className="size-4 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Loading...
                  </>
                ) : (
                  'Get Started'
                )}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section className="max-w-7xl mx-auto px-8 py-20">
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.h1
            className="text-6xl font-bold text-white mb-6 leading-tight"
            variants={fadeInUp}
          >
            Master Your{" "}
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff34a1] to-[#00ffc3]"
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              style={{ backgroundSize: "200% 100%" }}
            >
              Interview Skills
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Practice with AI-powered interview simulations. Get real-time feedback, improve your responses, and become a better candidate.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={fadeInUp}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/sign-up" onClick={() => setLoadingPath('/sign-up')}>
                <Button className="btn-primary text-lg px-8 py-4">
                  {loadingPath === '/sign-up' ? (
                    <>
                      <svg className="size-5 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Loading...
                    </>
                  ) : (
                    'Start Practicing'
                  )}
                </Button>
              </Link>
            </motion.div>
            {/* <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-lg px-8 py-4">
              <Link href="#features">Learn More</Link>
            </Button> */}
          </motion.div>
        </motion.div>

        {/* Hero Image/Demo */}
        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="bg-[rgb(22,22,22)] rounded-3xl p-8 shadow-[0_20px_40px_0_rgba(0,255,195,0.2)]"
            whileHover={{ y: -5, boxShadow: "0 25px 50px 0 rgba(0,255,195,0.3)" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400 text-sm ml-4">AI Interview Session</span>
            </div>
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div
                className="bg-gray-800/50 rounded-lg p-4"
                variants={staggerItem}
                whileHover={{ x: 5, backgroundColor: "rgba(55, 65, 81, 0.6)" }}
              >
                <p className="text-blue-400 font-semibold mb-2">AI Interviewer:</p>
                <p className="text-gray-300">"Tell me about a time you overcame a technical challenge."</p>
              </motion.div>
              <motion.div
                className="bg-gray-800/50 rounded-lg p-4"
                variants={staggerItem}
                whileHover={{ x: 5, backgroundColor: "rgba(55, 65, 81, 0.6)" }}
              >
                <p className="text-green-400 font-semibold mb-2">Your Response:</p>
                <p className="text-gray-300">"In my previous role, I encountered a performance issue with our database queries..."</p>
              </motion.div>
              <motion.div
                className="bg-gradient-to-r from-[#ff34a1]/20 to-[#00ffc3]/20 rounded-lg p-4 border border-[#00ffc3]/30"
                variants={staggerItem}
                whileHover={{
                  x: 5,
                  borderColor: "rgba(0, 255, 195, 0.6)",
                  boxShadow: "0 0 20px rgba(0, 255, 195, 0.3)"
                }}
              >
                <p className="text-white font-semibold mb-2">✨ AI Feedback:</p>
                <p className="text-gray-300">Great structure! Consider adding more specific metrics to strengthen your impact.</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>


      {/* <section id="features" className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff34a1] to-[#00ffc3]">Nova</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Nova AI is a 
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

      <footer className="border-t border-white/10 mt-60">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-[#ff34a1] to-[#00ffc3] rounded-full flex items-center justify-center">
                <span className="text-black font-bold">N</span>
              </div>
              <span className="text-white font-bold">Nova</span>
            </div>

            <div className="text-gray-400 text-sm">
              Made by Zechariah Wang
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  )
}

export default LandingPage