import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Genera un prompt optimizado para Nano Banana (Gemini 2.5 Flash) basado en:
 * - TODOS los datos de los 8 tabs del Character Builder
 * - Personaje existente o nuevo
 * - Atributos físicos completos
 * - Tattoos, outfit, pose, expresiones faciales
 */
export async function generateImagePrompt(promptData) {
  const {
    // Character info
    isNewCharacter,
    characterName,
    characterShow,
    gender,
    // Body Type
    cupSize,
    hipSize,
    thighSize,
    gluteSize,
    maleArmSize,
    maleChestSize,
    // Body Features
    bodyType,
    attitude,
    bodyLanguage,
    // Hair
    hairStyle,
    hairColor,
    // Tattoos
    tattooStyle,
    tattooPlacements,
    tattooSubjects,
    tattooCoverage,
    tattooDescription,
    // Outfit
    outfitCategory,
    outfitDescription,
    // Pose
    poseCategory,
    poseDescription,
    // Facial
    eyeExpression,
    mouthExpression,
    faceAttitude,
  } = promptData;

  const systemPrompt = `You are an expert prompt engineer for Nano Banana image generation (Gemini 2.5 Flash model via Replicate).

## CRITICAL FORMAT REQUIREMENTS:
Your output must be a SINGLE paragraph prompt of 80-150 words. NO explanations, NO markdown, NO bullet points - just the prompt.

## Nano Banana Best Practices:
1. **Narrative style** - Write flowing descriptions, not keyword lists
2. **Weighted attributes** - Use (attribute:1.X) format for emphasis, e.g. (big glutes:1.2), (thick thighs:1.25)
3. **Physical specifics** - Be EXACT with body proportions using the provided values
4. **Art direction** - Always end with "animated style" or specific anime style
5. **Consistency** - Start with "IMPORTANT: Keeping pose, keep model actions and SUPER IMPORTANT KEEP outfit"

## PROMPT STRUCTURE:
For EXISTING character:
"IMPORTANT: Keeping pose, keep the model actions and SUPER IMPORTANT KEEP THE MODEL outfit, [character name] from [show], give them [body modifications with weights], [hair], [facial expression], [tattoos if any], [pose], animated style matching [show name]"

For NEW character:
"[Gender] anime character, [body type] build, [physical attributes with weights], [hair style and color], wearing [outfit], [pose], [expression], [tattoos if any], [art style], high quality animated style"

OUTPUT ONLY THE PROMPT - NO OTHER TEXT.`;

  // Build the attributes section with weights
  const buildAttributesText = () => {
    const parts = [];

    // Body proportions with weights
    if (gender === 'female') {
      if (cupSize && cupSize !== 'FLAT') {
        // Higher cup sizes get higher weights
        const cupWeight = cupSize.includes('DD') || cupSize.includes('GG') ? '1.3' : '1.2';
        parts.push(`(${cupSize.toLowerCase()} cups:${cupWeight})`);
      }
    } else {
      if (maleArmSize) {
        const armWeight = maleArmSize.includes('MUSCULAR') || maleArmSize.includes('BODYBUILDER') ? '1.3' : '1.2';
        parts.push(`(${maleArmSize.toLowerCase()} arms:${armWeight})`);
      }
      if (maleChestSize) {
        parts.push(`${maleChestSize.toLowerCase()} chest`);
      }
    }

    if (hipSize && hipSize !== 'FLAT') {
      const hipWeight = hipSize.includes('BBL') || hipSize.includes('WIDE') ? '1.25' : '1.15';
      parts.push(`(${hipSize.toLowerCase()} hips:${hipWeight})`);
    }

    if (thighSize) {
      const thighWeight = thighSize.includes('THICK') || thighSize.includes('MASSIVE') ? '1.25' : '1.15';
      parts.push(`(${thighSize.toLowerCase()} thighs:${thighWeight})`);
    }

    if (gluteSize && gluteSize !== 'FLAT') {
      const gluteWeight = gluteSize.includes('HUGE') || gluteSize.includes('EXTREME') ? '1.3' : '1.2';
      parts.push(`(${gluteSize.toLowerCase()} glutes:${gluteWeight})`);
    }

    return parts.join(', ');
  };

  // Build tattoo description
  const buildTattooText = () => {
    if (!tattooCoverage || tattooCoverage === 'NONE') return '';

    const parts = [];
    if (tattooStyle) parts.push(`${tattooStyle.toLowerCase()} style tattoos`);
    if (tattooPlacements && tattooPlacements.length > 0) {
      parts.push(`on ${tattooPlacements.slice(0, 3).join(', ').toLowerCase()}`);
    }
    if (tattooSubjects && tattooSubjects.length > 0) {
      parts.push(`featuring ${tattooSubjects.slice(0, 3).join(', ').toLowerCase()}`);
    }
    if (tattooDescription) {
      parts.push(tattooDescription);
    }
    return parts.length > 0 ? `with ${parts.join(', ')}` : '';
  };

  // Build the user message
  const userMessage = isNewCharacter
    ? `Generate an image prompt for a NEW ${gender} character.

Character details:
- Name: ${characterName || 'Original character'}
- Origin: ${characterShow || 'Original creation'}
- Body type: ${bodyType || 'average'}
- Physical: ${buildAttributesText()}
- Hair: ${hairStyle || 'long'} ${hairColor || 'black'} hair
- Outfit category: ${outfitCategory || 'casual'}
- Outfit details: ${outfitDescription || ''}
- Pose: ${poseCategory || 'standing'} ${poseDescription || ''}
- Expression: ${eyeExpression || 'normal'} eyes, ${mouthExpression || 'neutral'} mouth, ${faceAttitude || 'confident'} attitude
- Attitude/vibe: ${attitude || 'confident'} with ${bodyLanguage || 'relaxed'} body language
- Tattoos: ${buildTattooText() || 'none'}

Create a flowing, weighted prompt for Nano Banana.`
    : `Generate an image prompt for EXISTING character.

SUPER IMPORTANT: Keep their EXACT outfit and pose from the original show!

Character: ${characterName}
Show: ${characterShow}
Gender: ${gender}

Physical modifications to apply:
${buildAttributesText()}

Additional details:
- Hair: ${hairStyle || 'original'} ${hairColor || 'original color'}
- Expression: ${eyeExpression || 'normal'} eyes, ${mouthExpression || 'neutral'} mouth, ${faceAttitude || 'confident'}
- Attitude: ${attitude || 'confident'} with ${bodyLanguage || 'confident'} body language
- Pose override: ${poseDescription || 'keep original pose'}
- Outfit override: ${outfitDescription || 'KEEP ORIGINAL OUTFIT'}
- Tattoos: ${buildTattooText() || 'none'}

Create a weighted prompt that PRESERVES the character identity while applying body modifications.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 500,
    });

    const prompt = completion.choices[0]?.message?.content;
    return prompt || "A stylized animated character in dynamic pose, high quality anime art";
  } catch (error) {
    console.error("Error generating prompt with Groq:", error);
    throw error;
  }
}

/**
 * Chatbot para consultas sobre personajes de anime/shows/games
 */
export async function chatWithGroq(userMessage, conversationHistory = []) {
  const systemPrompt = `You are a helpful assistant specialized in anime, manga, video games, TV shows, and movies from 1980 to 2025.

You help users find character names and provide information about characters. When suggesting characters:
- Always include the character's full name
- Include the show/game/movie they're from
- Mention their gender
- Keep responses concise but informative

Popular character suggestions include:
- Anime: Naruto, One Piece, Dragon Ball, Bleach, Fairy Tail, Attack on Titan, Demon Slayer, etc.
- Games: Final Fantasy, Street Fighter, Tekken, Genshin Impact, etc.
- Western: DC, Marvel, Disney, etc.

Be helpful and suggest multiple options when appropriate.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: "user", content: userMessage },
  ];

  try {
    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || "Sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Error in Groq chat:", error);
    throw error;
  }
}
