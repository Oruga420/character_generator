# Character Generator Pro 🎨

An advanced AI-powered character image generator that combines Groq AI for intelligent prompt generation with Replicate's Nano Banana models for high-quality image generation.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Oruga420/character_generator&env=DATABASE_URL,GROQ_API_KEY,REPLICATE_API_TOKEN&envDescription=API%20keys%20required%20for%20Neon,%20Groq,%20and%20Replicate&envLink=https://github.com/Oruga420/character_generator/blob/main/.env.example&project-name=character-generator&repository-name=character-generator)

**One-click deploy to Vercel** - Just add your API keys and you're live!

## Features

- **Character Database**: Browse and select from 1000+ TV, anime, and movie characters (1980-2025)
- **Custom Character Creation**: Create your own characters with detailed descriptions
- **Advanced Attribute Sliders**: Fine-tune physical attributes with intuitive carousel interface:
  - Breast sizes (20D to 60GG) with all cup sizes
  - Hip width (Narrow to Full BBL)
  - Thigh thickness (Slim to Very Thick)
  - Glute size (Flat to Exaggerated BBL)
  - Arm muscularity (Lean to Extremely Muscular)
  - Custom tattoos
- **AI Prompt Generation**: Groq AI generates 4 optimized prompts following Nano Banana best practices
- **Dual Image Models**: Choose between Nano Banana Pro (2K) or Regular (1K)
- **Character Assistant Chatbot**: Ask questions about characters and copy responses to your prompts
- **Real-time Search**: Autocomplete character search powered by Neon Database

## Tech Stack

- **Frontend**: Next.js 16.1.4 + React 19
- **AI Prompt Generation**: Groq API (llama-3.3-70b-versatile)
- **Image Generation**: Replicate API (Nano Banana Pro & Regular)
- **Database**: Neon Serverless PostgreSQL
- **Styling**: Tailwind CSS with custom gradient sliders

## Prerequisites

Before you begin, make sure you have:

1. **Node.js 18+** installed
2. **API Keys** from:
   - [Groq Console](https://console.groq.com) - Free tier available
   - [Replicate](https://replicate.com/account/api-tokens) - Pay per use
3. **Neon Database** account: [Sign up here](https://neon.tech)

## Installation

### 1. Clone or Extract the Project

```bash
cd app-build
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Next.js, React
- Groq SDK
- Replicate SDK
- Neon Database Client
- All other required packages

### 3. Set Up Environment Variables

1. Open the `.env.local` file
2. Fill in your API keys:

```env
# Neon Database (already configured if using provided URL)
DATABASE_URL=postgresql://your_neon_connection_string

# Groq API Key - Get from https://console.groq.com/keys
GROQ_API_KEY=gsk_your_key_here

# Replicate API Token - Get from https://replicate.com/account/api-tokens
REPLICATE_API_TOKEN=r8_your_token_here
```

### 4. Set Up Neon Database

#### Option A: Using Neon Console (Recommended)

1. Go to your [Neon Console](https://console.neon.tech)
2. Create a new database or use the default `neondb`
3. Open the SQL Editor
4. Copy and paste the content from `setup-database.sql`
5. Run the SQL script

#### Option B: Import CSV Data

1. In Neon Console, go to Tables
2. Create the `characters` table using the SQL from `setup-database.sql`
3. Click "Import Data" → Choose the `../characters.csv` file
4. Map columns: Character → Character, Show → Show, Gender → Gender
5. Import

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### Generating Character Images

1. **Select a Character**:
   - Click "Existing Character" and search for a character from the database
   - OR click "New Character" and describe your own

2. **Customize Attributes**:
   - Use the carousel to navigate through attribute sliders
   - Adjust physical attributes to your preference
   - Add tattoos if desired

3. **Generate Prompts**:
   - Click "Generate 4 Prompts with Groq"
   - Wait for AI to create 4 optimized prompts

4. **Generate Images**:
   - Each prompt has 2 buttons:
     - **Nano Banana Pro**: Higher quality 2K images
     - **Nano Banana Regular**: Faster 1K images
   - Images will appear below the buttons
   - Download or view full size

### Using the Character Assistant

1. Click the "Character Assistant" tab
2. Ask questions like:
   - "Who is Goku from Dragon Ball?"
   - "Characters from Naruto with blonde hair"
   - "Tell me about Rias Gremory"
3. Copy responses to clipboard or use in prompt generator

## API Routes

### `/api/characters/search`
- **Method**: GET
- **Query**: `?q=character_name`
- **Returns**: Array of matching characters

### `/api/generate-prompt`
- **Method**: POST
- **Body**: `{ characterData, attributes }`
- **Returns**: `{ prompt: string }`

### `/api/generate-image`
- **Method**: POST
- **Body**: `{ prompt, modelType, aspectRatio }`
- **Returns**: `{ images: [url] }`

### `/api/chat`
- **Method**: POST
- **Body**: `{ message, history }`
- **Returns**: `{ response: string }`

## Project Structure

```
app-build/
├── src/
│   ├── app/
│   │   ├── api/            # API routes
│   │   │   ├── characters/
│   │   │   ├── generate-prompt/
│   │   │   ├── generate-image/
│   │   │   └── chat/
│   │   ├── globals.css     # Global styles + slider CSS
│   │   ├── layout.js       # Root layout
│   │   └── page.js         # Main app page
│   ├── components/
│   │   ├── AttributeCarousel.jsx    # Attribute slider carousel
│   │   ├── CharacterSelector.jsx    # Character selection UI
│   │   ├── ChatBot.jsx              # Groq chatbot
│   │   └── PromptGenerator.jsx      # Prompt & image generation
│   └── lib/
│       ├── neon.js         # Neon DB functions
│       ├── groq.js         # Groq AI integration
│       └── replicate.js    # Replicate image generation
├── .env.local              # Environment variables
├── setup-database.sql      # Database setup script
└── package.json
```

## Troubleshooting

### Database Connection Issues

Make sure:
- URL is from the **Pooled** connection (for serverless)
- `?sslmode=require` is at the end

### Groq API Errors

- Check your API key is valid at [console.groq.com/keys](https://console.groq.com/keys)
- Free tier: 30 requests per minute
- Make sure key starts with `gsk_`

### Replicate Image Generation Slow

- **Nano Banana Pro**: Takes 30-60 seconds (2K quality)
- **Nano Banana Regular**: Takes 15-30 seconds (1K quality)
- Cold start can take longer (first request)

### Character Search Not Working

1. Check database has data:
```sql
SELECT COUNT(*) FROM characters;
```

2. Import CSV if empty (see Setup step 4)

## Resources

- [Groq Documentation](https://console.groq.com/docs)
- [Replicate Docs](https://replicate.com/docs)
- [Neon Database Docs](https://neon.tech/docs)
- [Next.js Documentation](https://nextjs.org/docs)
