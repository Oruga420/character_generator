import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/neon';

export async function GET() {
  try {
    const categories = await getCategories();

    // Add "All" option at the beginning
    const allCategories = [
      { Category: 'all', count: categories.reduce((sum, cat) => sum + parseInt(cat.count || 0), 0) },
      ...categories
    ];

    return NextResponse.json({ categories: allCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch categories',
        categories: [{ Category: 'all', count: 0 }]
      },
      { status: 500 }
    );
  }
}
