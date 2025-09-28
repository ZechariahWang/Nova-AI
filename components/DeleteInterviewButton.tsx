"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface DeleteInterviewButtonProps {
  interviewId: string
  userId: string
  onDelete?: () => void
}

export default function DeleteInterviewButton({
  interviewId,
  userId,
  onDelete
}: DeleteInterviewButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/interviews/${interviewId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Interview deleted successfully')
        onDelete?.()
        router.refresh() // Refresh the page data
      } else {
        toast.error(result.message || 'Failed to delete interview')
      }
    } catch (error) {
      console.error('Error deleting interview:', error)
      toast.error('An error occurred while deleting the interview')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-gray-700/90 hover:bg-gray-600 text-white text-xs px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out shadow-sm hover:shadow-md border border-gray-600/30 hover:border-gray-500/50 backdrop-blur-sm self-center"
      size="sm"
    >
      {isDeleting ? (
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-[10px] font-medium">Deleting...</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="text-[10px] font-medium">Delete</span>
        </div>
      )}
    </Button>
  )
}