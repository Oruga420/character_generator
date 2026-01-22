import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL);

// Categories mapping
const CATEGORY_MAPPING = {
  'anime': ['Anime', 'anime', 'ANIME'],
  'tv': ['TV', 'tv', 'Television', 'Live Action', 'Series'],
  'animated': ['Animated', 'Animation', 'Cartoon', 'animated'],
  'movies': ['Movie', 'Film', 'movie', 'Movies', 'Película'],
  'games': ['Game', 'Video Game', 'game', 'Games'],
};

/**
 * Get all characters with pagination and optional category/search filter
 */
export async function getCharactersPaginated(options = {}) {
  const {
    page = 1,
    limit = 20,
    category = null,
    searchTerm = null,
  } = options;

  const offset = (page - 1) * limit;

  try {
    let results;
    let countResult;

    if (searchTerm && searchTerm.length >= 2) {
      // Search mode
      const searchPattern = `%${searchTerm.toLowerCase()}%`;

      if (category && category !== 'all') {
        // Search with category filter
        results = await sql`
          SELECT * FROM characters
          WHERE (LOWER("Character") LIKE ${searchPattern} OR LOWER("Show") LIKE ${searchPattern})
          AND LOWER("Category") = ${category.toLowerCase()}
          ORDER BY "Category", "Show", "Character"
          LIMIT ${limit} OFFSET ${offset}
        `;

        countResult = await sql`
          SELECT COUNT(*) as total FROM characters
          WHERE (LOWER("Character") LIKE ${searchPattern} OR LOWER("Show") LIKE ${searchPattern})
          AND LOWER("Category") = ${category.toLowerCase()}
        `;
      } else {
        // Search without category filter
        results = await sql`
          SELECT * FROM characters
          WHERE LOWER("Character") LIKE ${searchPattern} OR LOWER("Show") LIKE ${searchPattern}
          ORDER BY "Category", "Show", "Character"
          LIMIT ${limit} OFFSET ${offset}
        `;

        countResult = await sql`
          SELECT COUNT(*) as total FROM characters
          WHERE LOWER("Character") LIKE ${searchPattern} OR LOWER("Show") LIKE ${searchPattern}
        `;
      }
    } else if (category && category !== 'all') {
      // Category filter only
      results = await sql`
        SELECT * FROM characters
        WHERE LOWER("Category") = ${category.toLowerCase()}
        ORDER BY "Show", "Character"
        LIMIT ${limit} OFFSET ${offset}
      `;

      countResult = await sql`
        SELECT COUNT(*) as total FROM characters
        WHERE LOWER("Category") = ${category.toLowerCase()}
      `;
    } else {
      // No filters - get all
      results = await sql`
        SELECT * FROM characters
        ORDER BY "Category", "Show", "Character"
        LIMIT ${limit} OFFSET ${offset}
      `;

      countResult = await sql`
        SELECT COUNT(*) as total FROM characters
      `;
    }

    const total = parseInt(countResult[0]?.total || 0);
    const totalPages = Math.ceil(total / limit);

    return {
      characters: results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    };
  } catch (error) {
    console.error('Error fetching characters:', error);
    throw error;
  }
}

/**
 * Get all available categories from the database
 */
export async function getCategories() {
  try {
    const results = await sql`
      SELECT DISTINCT "Category", COUNT(*) as count
      FROM characters
      WHERE "Category" IS NOT NULL AND "Category" != ''
      GROUP BY "Category"
      ORDER BY "Category"
    `;
    return results;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Search characters (legacy function for backward compatibility)
 */
export async function searchCharacters(searchTerm) {
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }

  try {
    const searchPattern = `%${searchTerm.toLowerCase()}%`;
    const results = await sql`
      SELECT * FROM characters
      WHERE LOWER("Character") LIKE ${searchPattern}
      OR LOWER("Show") LIKE ${searchPattern}
      ORDER BY "Category", "Show", "Character"
      LIMIT 20
    `;
    return results;
  } catch (error) {
    console.error('Error searching characters:', error);
    return [];
  }
}

/**
 * Get character by name
 */
export async function getCharacterByName(characterName) {
  try {
    const results = await sql`
      SELECT * FROM characters
      WHERE LOWER("Character") = ${characterName.toLowerCase()}
      LIMIT 1
    `;
    return results[0] || null;
  } catch (error) {
    console.error('Error getting character:', error);
    return null;
  }
}

/**
 * Get all characters (no pagination - use with caution)
 */
export async function getAllCharacters() {
  try {
    const results = await sql`
      SELECT * FROM characters
      ORDER BY "Category", "Show", "Character"
    `;
    return results;
  } catch (error) {
    console.error('Error getting all characters:', error);
    return [];
  }
}

/**
 * Get characters grouped by category
 */
export async function getCharactersByCategory() {
  try {
    const results = await sql`
      SELECT "Category",
             json_agg(json_build_object(
               'Character', "Character",
               'Show', "Show",
               'Gender', "Gender"
             ) ORDER BY "Show", "Character") as characters,
             COUNT(*) as count
      FROM characters
      WHERE "Category" IS NOT NULL
      GROUP BY "Category"
      ORDER BY "Category"
    `;
    return results;
  } catch (error) {
    console.error('Error getting characters by category:', error);
    return [];
  }
}
