import { NextResponse } from 'next/server';
import { generateImagePro, generateImageRegular, generateFourVariations } from '@/lib/replicate';

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, modelType = 'pro', generateFour = false, aspectRatio = '4:3' } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let result;

    if (generateFour) {
      // Generate 4 variations
      result = await generateFourVariations(prompt, modelType === 'pro');
    } else {
      // Generate single image
      if (modelType === 'pro') {
        result = await generateImagePro(prompt, aspectRatio);
      } else {
        result = await generateImageRegular(prompt, aspectRatio);
      }
    }

    return NextResponse.json({ images: Array.isArray(result) ? result : [result] });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image', details: error.message },
      { status: 500 }
    );
  }
}
