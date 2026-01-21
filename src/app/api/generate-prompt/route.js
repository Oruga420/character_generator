import { NextResponse } from 'next/server';
import { generateImagePrompt } from '@/lib/groq';

export async function POST(request) {
  try {
    const body = await request.json();
    const { characterData, attributes } = body;

    if (!characterData) {
      return NextResponse.json(
        { error: 'Character data is required' },
        { status: 400 }
      );
    }

    const prompt = await generateImagePrompt(characterData, attributes || {});

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Error generating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to generate prompt', details: error.message },
      { status: 500 }
    );
  }
}
