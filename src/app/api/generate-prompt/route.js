import { NextResponse } from 'next/server';
import { generateImagePrompt } from '@/lib/groq';

export async function POST(request) {
  try {
    const body = await request.json();
    const { promptData } = body;

    if (!promptData) {
      return NextResponse.json(
        { error: 'Prompt data is required' },
        { status: 400 }
      );
    }

    const prompt = await generateImagePrompt(promptData);

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Error generating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to generate prompt', details: error.message },
      { status: 500 }
    );
  }
}
