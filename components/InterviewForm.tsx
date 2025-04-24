"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

interface InterviewFormProps {
  userId: string;
}

const InterviewForm = ({ userId }: InterviewFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'mixed',
    role: 'frontend',
    level: 'senior',
    techstack: 'next.js,react,typescript',
    amount: 7
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
        router.push('/');
      } else {
        console.error('Failed to generate interview:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <div className="flex flex-col gap-2">
        <label htmlFor="type" className="text-white">Interview Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="p-2 rounded bg-dark-300 text-white"
        >
          <option value="mixed">Mixed</option>
          <option value="technical">Technical</option>
          <option value="behavioral">Behavioral</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="role" className="text-white">Role</label>
        <input
          type="text"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="p-2 rounded bg-dark-300 text-white"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="level" className="text-white">Level</label>
        <select
          id="level"
          name="level"
          value={formData.level}
          onChange={handleChange}
          className="p-2 rounded bg-dark-300 text-white"
        >
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="techstack" className="text-white">Tech Stack (comma-separated)</label>
        <input
          type="text"
          id="techstack"
          name="techstack"
          value={formData.techstack}
          onChange={handleChange}
          className="p-2 rounded bg-dark-300 text-white"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-white">Number of Questions</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          min="1"
          max="10"
          className="p-2 rounded bg-dark-300 text-white"
        />
      </div>

      <Button 
        type="submit" 
        className="btn-primary mt-4"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Interview'}
      </Button>
    </form>
  );
};

export default InterviewForm; 