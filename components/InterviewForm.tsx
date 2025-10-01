"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface InterviewFormProps {
  userId: string;
}

const steps = [
  {
    id: 'type',
    question: 'What type of interview would you like?',
    options: [
      // { value: 'mixed', label: 'Mixed (Technical & Behavioral)' },
      { value: 'coding', label: 'Coding Technical' },
      { value: 'behavioral', label: 'Behavioral' }
    ]
  },
  {
    id: 'role',
    question: 'What role are you interviewing for?',
    placeholder: 'Frontend Developer, Backend Engineer, etc.'
  },
  {
    id: 'level',
    question: 'What level of experience?',
    options: [
      { value: 'junior', label: 'Junior' },
      { value: 'mid', label: 'Mid-Level' },
      { value: 'senior', label: 'Senior' }
    ]
  },
  {
    id: 'techstack',
    question: 'What question(s) do you want to be asked?',
    placeholder: 'Two Sum, Behavioural, etc'
  },
  {
    id: 'amount',
    question: 'How many questions would you like?',
    min: 1,
    max: 5
  }
];

const InterviewForm = ({ userId }: InterviewFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    type: '',
    role: '',
    level: '',
    techstack: '',
    amount: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/vapi/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userid: userId
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/dashboard');
      } else {
        console.error('Failed to generate interview:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit(new Event('submit') as any);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start pt-16 p-8">
      <div className="w-full max-w-2xl">
        <div className="w-full flex justify-between mb-6">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`h-1 flex-1 mx-1 rounded-full transition-colors ${
                index <= currentStep ? 'bg-success-100' : 'bg-dark-300'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <h3 className="text-2xl font-semibold mb-6 text-center text-white">
              {currentStepData.question}
            </h3>

            <div className="flex flex-col gap-6">
              {currentStepData.options ? (
                <div className={`grid gap-4 ${
                  currentStepData.id === 'type'
                    ? 'grid-cols-1 md:grid-cols-2 max-w-lg mx-auto'
                    : 'grid-cols-1 md:grid-cols-3'
                }`}>
                  {currentStepData.options.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          [currentStepData.id]: option.value
                        }));
                        handleNext();
                      }}
                      className={`p-6 rounded-lg text-center transition-colors ${
                        formData[currentStepData.id as keyof typeof formData] === option.value
                          ? 'bg-success-100 text-dark-100'
                          : 'bg-dark-300 text-white hover:bg-dark-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type={currentStepData.id === 'amount' ? 'number' : 'text'}
                  name={currentStepData.id}
                  value={formData[currentStepData.id as keyof typeof formData]}
                  onChange={handleChange}
                  placeholder={currentStepData.placeholder}
                  min={currentStepData.min}
                  max={currentStepData.max}
                  className="p-6 rounded-lg bg-dark-300 text-white placeholder:text-gray-400 text-center text-lg"
                />
              )}
            </div>

            <div className="flex justify-between mt-12">
              <Button
                type="button"
                onClick={handleBack}
                className="btn-secondary px-8 py-4 text-lg"
                disabled={currentStep === 0}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                className="btn-primary px-8 py-4 text-lg"
                disabled={!formData[currentStepData.id as keyof typeof formData]}
              >
                {currentStep === steps.length - 1 ? 'Generate Interview' : 'Next'}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterviewForm; 