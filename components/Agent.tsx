"use client";

import React from 'react'
import Image from 'next/image'
import { useState, useEffect } from "react";
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { StringValidation } from 'zod';
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/general.action';

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
      <>
        <div className="flex flex-row gap-8">
          <div className="flex-1">
            <div className="call-view">
              <div className="card-interviewer shadow-[0_10px_10px_0_#00ffc3] bg-gradient-to-r from-[#0f0f0f] to-[#0f0e0e] rounded-lg">
                <div className="avatar">
                  <Image
                    src="/AIICON.jpg"
                    alt="vapi"
                    width={650}
                    height={54}
                    className="object-cover rounded-full"
                  />

                  {isSpeaking && <span className="animate-speak" />}
                </div>
                <h3>AI Interviewer</h3>
              </div>
              <div className="card-border shadow-[0_10px_10px_0_#ff34a1] bg-gradient-to-r from-[#0f0f0f] to-[#0f0e0e] rounded-lg">
                <div className="card-content">
                  <Image
                    src="/userMaybe.jpg"
                    alt="user avatar"
                    width={550}
                    height={340}
                    className="rounded-full object-cover size-[120px]"
                  />
                  <h3>{userName}</h3>
                </div>
              </div>
            </div>

            <div className='w-full flex justify-center mt-8 '>
              {callStatus !== 'ACTIVE' ? (
                <button className='relative btn-call' onClick={handleCall}>
                  <span
                    className={cn(
                      "absolute animate-ping rounded-full opacity-75",
                      callStatus !== "CONNECTING" && "hidden"
                    )}
                  />
                  <span className="relative text-black">
                    {isCallInactiveOrFinished ? 'Call' : '. . .'}
                  </span>
                </button>
              ) : (
                <button className='btn-disconnect text-black' onClick={handleDisconnect}>
                  End
                </button>
              )}
            </div>
          </div>

          <div className="w-[400px] h-[500px] flex flex-col">
            <div className="transcript-border shadow-[0_10px_10px_0_#428fed] h-full overflow-hidden">
              <div className="transcript h-full overflow-y-auto font-bold bg-[#1a1a1a] p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#1a1a1a] [&::-webkit-scrollbar-thumb]:bg-[#282828] [&::-webkit-scrollbar-thumb]:rounded-full">
                {messages.length > 0 ? (
                  <div className="space-y-2">
                    {messages.map((message, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "text-sm",
                          message.role === 'user' ? "text-[#00ffc3]" : "text-[#ff34a1]"
                        )}
                      >
                        <div className="flex flex-col">
                          <div className="flex items-start gap-2">
                            <span className="text-gray-400 shrink-0">
                              {message.role === 'user' ? `[${userName}]` : '[AI]'}:
                            </span>
                            <span
                              className={cn(
                                "transition-opacity duration-500 opacity-0 whitespace-pre-wrap",
                                "animate-fadeIn opacity-100"
                              )}
                            >
                              {message.content}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    <p>Chat log will appear here</p>
                    <p className="text-sm mt-2">Start the interview to see messages</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
}

export default Agent;

