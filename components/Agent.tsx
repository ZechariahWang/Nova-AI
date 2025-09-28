"use client";

import React from 'react'
import Image from 'next/image'
import { useState, useEffect } from "react";
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { StringValidation } from 'zod';
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = "CONNECTING",
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface SavedMessages {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {
    
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessages[]>([]);

  useEffect(() => {

    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };

  }, [])

  const handleGenerateFeedback = async (messages: SavedMessages[]) => {
    console.log("generate feedback here");
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
      }),
    });
    
    const { success, feedbackId: id } = await response.json();

    if (success && id) {
      router.push(`/interview/${interviewId}/feedback`);
    } else {
      console.log("Failed to generate feedback");
      router.push('/');
    }
  }

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push('/');
      } else {
        handleGenerateFeedback(messages);
      }
    }

  }, [messages, callStatus, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = '';
      if (questions) {
        formattedQuestions = questions.map((question) => `- ${question}`).join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
          username: userName,
          userid: userId,
        },
      });
    }
  }

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const latestMessage = messages[messages.length -1]?.content;

  const isCallInactiveOrFinished = callStatus == CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;


    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Call Interface */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Video Call Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
            {/* AI Interviewer Card */}
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,255,195,0.2)] border border-[#00ffc3]/20 backdrop-blur-sm">
              <div className="flex flex-col items-center justify-center h-full min-h-[280px] sm:min-h-[320px]">
                <div className="relative mb-6">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#00ffc3]/30">
                    <Image
                      src="/AIICON.jpg"
                      alt="AI Interviewer"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isSpeaking && (
                    <div className="absolute -inset-3 rounded-full border-3 border-[#00ffc3] animate-pulse" />
                  )}
                </div>
                <h3 className="text-white font-semibold text-xl">AI Interviewer</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${callStatus === 'ACTIVE' ? 'bg-green-400' : 'bg-gray-400'}`} />
                  <span className="text-sm text-gray-400">
                    {callStatus === 'ACTIVE' ? 'Connected' : 'Waiting'}
                  </span>
                </div>
              </div>
            </div>

            {/* User Card */}
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(255,52,161,0.2)] border border-[#ff34a1]/20 backdrop-blur-sm">
              <div className="flex flex-col items-center justify-center h-full min-h-[280px] sm:min-h-[320px]">
                <div className="relative mb-6">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#ff34a1]/30">
                    <Image
                      src="/userMaybe.jpg"
                      alt="User"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {callStatus === 'ACTIVE' && (
                    <div className="absolute -inset-3 rounded-full border-3 border-[#ff34a1] animate-pulse" />
                  )}
                </div>
                <h3 className="text-white font-semibold text-xl">{userName}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${callStatus === 'ACTIVE' ? 'bg-green-400' : 'bg-gray-400'}`} />
                  <span className="text-sm text-gray-400">
                    {callStatus === 'ACTIVE' ? 'Speaking' : 'Ready'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Call Controls */}
          <div className="flex justify-center">
            {callStatus !== 'ACTIVE' ? (
              <button
                className="bg-gradient-to-r from-[#00ffc3] to-[#00d4a3] hover:from-[#00ffc3] hover:to-[#00ffc3] text-black font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-[0_8px_24px_0_rgba(0,255,195,0.3)] hover:shadow-[0_12px_32px_0_rgba(0,255,195,0.4)] disabled:opacity-70"
                onClick={handleCall}
                disabled={callStatus === 'CONNECTING'}
              >
                <span className="flex items-center gap-2">
                  {callStatus === 'CONNECTING' && (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {callStatus === 'CONNECTING' ? 'Connecting...' : 'Start Interview'}
                </span>
              </button>
            ) : (
              <button
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-[0_8px_24px_0_rgba(239,68,68,0.3)] hover:shadow-[0_12px_32px_0_rgba(239,68,68,0.4)]"
                onClick={handleDisconnect}
              >
                End Interview
              </button>
            )}
          </div>
        </div>

        {/* Transcript Panel */}
        <div className="lg:col-span-1 flex flex-col min-h-0">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl shadow-[0_8px_32px_0_rgba(66,143,237,0.2)] border border-[#428fed]/20 backdrop-blur-sm flex flex-col h-full min-h-[350px] lg:min-h-[420px] max-h-[75vh] overflow-hidden">
            <div className="p-4 border-b border-gray-700/50 flex-shrink-0">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-[#428fed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Live Transcript
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 min-h-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&::-webkit-scrollbar-thumb]:rounded-full">
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex flex-col gap-1 p-3 rounded-lg transition-all duration-300 w-full min-w-0 ${
                      message.role === 'user'
                        ? 'bg-[#00ffc3]/10 border border-[#00ffc3]/20'
                        : 'bg-[#ff34a1]/10 border border-[#ff34a1]/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-xs font-medium flex-shrink-0 ${
                        message.role === 'user' ? 'text-[#00ffc3]' : 'text-[#ff34a1]'
                      }`}>
                        {message.role === 'user' ? userName : 'AI Interviewer'}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed break-words overflow-wrap-anywhere hyphens-auto w-full">
                      {message.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-8 min-h-0">
                  <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418 4.03-8 9-8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 mb-2">Conversation will appear here</p>
                  <p className="text-sm text-gray-500">Start the interview to see live transcript</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}

export default Agent;

