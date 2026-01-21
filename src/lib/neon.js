import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL);

export async function searchCharacters(searchTerm) {
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }

  const results = await sql`
    SELECT * FROM characters
    WHERE LOWER("Character") LIKE ${searchTerm.toLowerCase() + '%'}
    OR LOWER("Show") LIKE ${searchTerm.toLowerCase() + '%'}
    ORDER BY "Character"
    LIMIT 20
  `;

  return results;
}

export async function getCharacterByName(characterName) {
  const results = await sql`
    SELECT * FROM characters
    WHERE LOWER("Character") = ${characterName.toLowerCase()}
    LIMIT 1
  `;

  return results[0] || null;
}

export async function getAllCharacters() {
  const results = await sql`
    SELECT * FROM characters
    ORDER BY "Show", "Character"
  `;

  return results;
}
