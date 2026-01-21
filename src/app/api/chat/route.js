import { NextResponse } from 'next/server';
import { chatWithGroq } from '@/lib/groq';

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, history = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const response = await chatWithGroq(message, history);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json(
      { error: 'Failed to get chat response', details: error.message },
      { status: 500 }
    );
  }
}
