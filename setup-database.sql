-- Character Generator Database Setup
-- Run this script in your Neon database console

-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
  id SERIAL PRIMARY KEY,
  "Character" VARCHAR(255) NOT NULL,
  "Show" VARCHAR(255) NOT NULL,
  "Gender" VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_character_name ON characters(LOWER("Character"));
CREATE INDEX IF NOT EXISTS idx_show_name ON characters(LOWER("Show"));
CREATE INDEX IF NOT EXISTS idx_character_show ON characters("Character", "Show");

-- Sample insert (you'll import the full CSV later)
-- INSERT INTO characters ("Character", "Show", "Gender")
-- VALUES
--   ('Monkey D. Luffy', 'One Piece', 'Masc'),
--   ('Nami', 'One Piece', 'Fem');

-- You can now import the CSV using the Neon console or pgAdmin
