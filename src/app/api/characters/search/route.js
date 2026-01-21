import { NextResponse } from 'next/server';
import { searchCharacters } from '@/lib/neon';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ characters: [] });
    }

    const characters = await searchCharacters(query);
    return NextResponse.json({ characters });
  } catch (error) {
    console.error('Error searching characters:', error);
    return NextResponse.json(
      { error: 'Failed to search characters' },
      { status: 500 }
    );
  }
}
