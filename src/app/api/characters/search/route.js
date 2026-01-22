import { NextResponse } from 'next/server';
import { getCharactersPaginated, getCategories } from '@/lib/neon';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get paginated results
    const result = await getCharactersPaginated({
      page,
      limit,
      category: category !== 'all' ? category : null,
      searchTerm: query.length >= 2 ? query : null,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error searching characters:', error);
    return NextResponse.json(
      {
        error: 'Failed to search characters',
        details: error.message,
        characters: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false }
      },
      { status: 500 }
    );
  }
}
