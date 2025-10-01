"use client";

import React from 'react'
import Image from 'next/image'
import { useState, useEffect } from "react";
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { StringValidation } from 'zod';
import { vapi } from '@/lib/vapi.sdk';
import { interviewer, codingInterviewer } from '@/constants';
import { getInitialCodingCode, getTestCases } from '@/constants/codingTemplates';
import Editor from '@monaco-editor/react';

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

const Agent = ({ userName, userId, type, interviewId, interviewType, questions }: AgentProps) => {

  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessages[]>([]);
  const [code, setCode] = useState('# Write your code here\nprint("Hello, World!")');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [lastCodeChange, setLastCodeChange] = useState(Date.now());
  const [codeChangeTimer, setCodeChangeTimer] = useState<NodeJS.Timeout | null>(null);
  const [codeLog, setCodeLog] = useState<string[]>([]);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [pendingCodeUpdate, setPendingCodeUpdate] = useState<string | null>(null);

  const languages = [
    { id: 'javascript', name: 'JavaScript', defaultCode: '// Write your code here\nconsole.log("Hello, World!");' },
    { id: 'python', name: 'Python', defaultCode: '# Write your code here\nprint("Hello, World!")' },
    { id: 'java', name: 'Java', defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
    { id: 'cpp', name: 'C++', defaultCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}' },
    { id: 'typescript', name: 'TypeScript', defaultCode: '// Write your code here\nconsole.log("Hello, World!");' },
  ];

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
      console.log("AI speech start");
      setIsSpeaking(true);
      setIsAISpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("AI speech end");
      setIsSpeaking(false);
      setIsAISpeaking(false);

      // Send any pending code updates after AI finishes speaking
      if (pendingCodeUpdate && interviewType === 'coding') {
        console.log('Sending queued code update...');
        setTimeout(() => {
          sendCodeToAI(pendingCodeUpdate, language, true);
        }, 500); // Small delay to ensure speech fully ended
      }
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

  // Initialize code editor with appropriate template for coding interviews
  useEffect(() => {
    if (interviewType === 'coding' && questions && questions.length > 0) {
      const initialCode = getInitialCodingCode(questions, language);
      setCode(initialCode);
    }
  }, [interviewType, questions, language]);

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

  // Handle periodic code logging
  useEffect(() => {
    const printCodePeriodically = () => {
      const now = Date.now();
      if (now - lastCodeChange >= 5000) { // 20 seconds
        console.log('=== CODE EDITOR CONTENT ===');
        console.log(`Language: ${language}`);
        console.log(`Timestamp: ${new Date().toLocaleString()}`);
        console.log('Code:');
        console.log(code);
        console.log('=== END CODE CONTENT ===');
        setLastCodeChange(now);
      }
    };

    // Check every 5 seconds if 20 seconds have passed since last change
    const interval = setInterval(printCodePeriodically, 5000);

    return () => clearInterval(interval);
  }, [code, language, lastCodeChange]);

  // Send code updates to VAPI AI with rate limiting and speech awareness
  const sendCodeToAI = (codeContent: string, codeLanguage: string, force = false) => {
    if (callStatus !== CallStatus.ACTIVE) return;

    // Don't send if AI is currently speaking (unless forced)
    if (isAISpeaking && !force) {
      setPendingCodeUpdate(codeContent);
      console.log('AI is speaking, queuing code update...');
      return;
    }

    try {
      // Send shorter, more focused message to reduce speech interruption
      vapi.send({
        type: "add-message",
        message: {
          role: "user",
          content: `[CODE UPDATE - ${codeLanguage.toUpperCase()}]:\n\`\`\`${codeLanguage}\n${codeContent}\n\`\`\`\n\nPlease review my ${codeLanguage} code and provide language-specific feedback.`
        }
      });
      setPendingCodeUpdate(null);
    } catch (error) {
      // yep
    }
  };

  // Handle code changes and reset timer
  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    setLastCodeChange(Date.now());

    // Immediate debug log
    console.log('CODE CHANGED:', { length: newCode.length, timestamp: new Date().toLocaleTimeString() });

    // Clear existing timer
    if (codeChangeTimer) {
      clearTimeout(codeChangeTimer);
      console.log('CLEARED PREVIOUS TIMER');
    }

    // Set new timer for 15 seconds - sends code to AI for evaluation (increased for smoother experience)
    const timer = setTimeout(() => {
      console.log('TIMER FIRED - SENDING CODE TO AI');

      // Send code to AI for real-time evaluation (only for coding interviews)
      if (interviewType === 'coding' && newCode.trim().length > 10) {
        sendCodeToAI(newCode, language);
      }

      // Create log entry
      const timestamp = new Date().toLocaleString();
      const logEntry = `[${timestamp}] Language: ${language} | Code Length: ${newCode.length} characters`;

      // Use multiple logging methods to ensure visibility
      const fullLogMessage = `=== CODE EDITOR CONTENT (10s after edit) ===\nLanguage: ${language}\nTimestamp: ${timestamp}\nCode:\n${newCode}\n=== END CODE CONTENT ===`;

      console.log(fullLogMessage);
      console.info('CODE LOG:', fullLogMessage);
      console.warn('CODE EDITOR LOG:', fullLogMessage);

      // Add to UI log
      setCodeLog(prev => [logEntry, ...prev.slice(0, 9)]); // Keep last 10 entries

      console.log('CODE PROCESSING COMPLETED');
    }, 15000); // Increased to 15 seconds for smoother AI interaction

    setCodeChangeTimer(timer);
    console.log('NEW TIMER SET FOR 10 SECONDS');
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (codeChangeTimer) {
        clearTimeout(codeChangeTimer);
      }
    };
  }, [codeChangeTimer]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);

    // For coding interviews, use the appropriate template
    if (interviewType === 'coding' && questions && questions.length > 0) {
      const codingCode = getInitialCodingCode(questions, newLanguage);
      setCode(codingCode);
    } else {
      // For non-coding interviews, use default language templates
      const selectedLanguage = languages.find(lang => lang.id === newLanguage);
      if (selectedLanguage) {
        setCode(selectedLanguage.defaultCode);
      }
    }
    setOutput('');
  };

  const executeCode = async () => {
    setIsRunning(true);
    setOutput('Running...');

    try {
      // Get test cases if available
      const testCases = interviewType === 'coding' ? getTestCases(questions || []) : null;

      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          testCases,
          questions,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOutput(result.output || 'Code executed successfully (no output)');
      } else {
        setOutput(`Error: ${result.error}`);
      }
    } catch (error) {
      setOutput(`Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

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

      // Choose the appropriate interviewer based on interview type
      const selectedInterviewer = interviewType === 'coding' ? codingInterviewer : interviewer;

      // Prepare variable values with code context for coding interviews
      const variableValues: any = {
        questions: formattedQuestions,
        username: userName,
        userid: userId,
      };

      // Add code context for coding interviews
      if (interviewType === 'coding') {
        variableValues.currentCode = code;
        variableValues.codeLanguage = language;
      }

      await vapi.start(selectedInterviewer, {
        variableValues,
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
          {/* Monaco Code Editor */}
          <div className="mb-6">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl shadow-[0_8px_32px_0_rgba(66,143,237,0.2)] border border-[#428fed]/20 backdrop-blur-sm overflow-hidden z-10">
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#428fed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Code Editor
                    {interviewType === 'coding' && (
                      <span className={`text-white text-xs px-2 py-1 rounded-full ml-2 flex items-center gap-1 ${
                        isAISpeaking ? 'bg-red-500 animate-pulse' : 'bg-orange-500'
                      }`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {isAISpeaking ? 'AI Speaking' : 'AI Watching'}
                        {pendingCodeUpdate && (
                          <div className="w-2 h-2 bg-yellow-400 rounded-full ml-1" title="Code update queued"></div>
                        )}
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-3">
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600 focus:border-[#428fed] focus:outline-none text-sm"
                    >
                      {languages.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={executeCode}
                      disabled={isRunning}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-1 rounded text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isRunning ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Running
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                          </svg>
                          Run
                        </>
                      )}
                    </button>
                    {/* {interviewType === 'coding' && (
                      <button
                        onClick={() => sendCodeToAI(code, language, true)}
                        disabled={callStatus !== CallStatus.ACTIVE || !code.trim()}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-1 rounded text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Share Code
                      </button>
                    )} */}
                  </div>
                </div>
              </div>
              <div className="h-64">
                <Editor
                  height="100%"
                  language={language}
                  theme="vs-dark"
                  value={code}
                  onChange={handleCodeChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                  }}
                />
              </div>

              {/* Output Section */}
              {output && (
                <div className="border-t border-gray-700/50">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-300">Output:</span>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap max-h-32 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {output}
                    </pre>
                  </div>
                </div>
              )}

              {/* {codeLog.length > 0 && (
                <div className="border-t border-gray-700/50">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-300">Code Log History:</span>
                    </div>
                    <div className="bg-gray-900 rounded p-3 max-h-32 overflow-y-auto space-y-1">
                      {codeLog.map((log, index) => (
                        <div key={index} className="text-xs text-gray-400 font-mono">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )} */}
            </div>
          </div>

          {/* Video Call Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
            {/* AI Interviewer Card */}
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,255,195,0.2)] border border-[#00ffc3]/20 backdrop-blur-sm z-20">
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
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(255,52,161,0.2)] border border-[#ff34a1]/20 backdrop-blur-sm z-20">
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
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl shadow-[0_8px_32px_0_rgba(66,143,237,0.2)] border border-[#428fed]/20 backdrop-blur-sm flex flex-col h-full min-h-[350px] lg:min-h-[420px] max-h-[75vh] overflow-hidden z-10">
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

