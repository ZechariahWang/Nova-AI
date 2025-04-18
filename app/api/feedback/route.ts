import { NextResponse } from 'next/server';
import { createFeedback } from '@/lib/actions/general.action';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createFeedback(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create feedback' }, { status: 500 });
  }
} 