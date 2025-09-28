import { NextRequest, NextResponse } from 'next/server'
import { deleteInterview } from '@/lib/actions/general.action'
import { getCurrentUser } from '@/lib/actions/auth.action'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await deleteInterview({
      interviewId: params.id,
      userId: user.id
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting interview:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}