import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Genera un prompt optimizado para generación de imágenes basado en:
 * - Personaje existente o especificaciones de uno nuevo
 * - Atributos físicos seleccionados (pechos, caderas, piernas, etc.)
 * - Nano banana guide para mejores prácticas
 */
export async function generateImagePrompt(characterData, attributes) {
  const {
    isNewCharacter,
    characterName,
    characterShow,
    characterGender,
    newCharacterDescription,
  } = characterData;

  const systemPrompt = `You are an expert prompt engineer specializing in image generation using Gemini 2.5 Flash (Nano Banana).

Your task is to write a highly detailed, descriptive image generation prompt following these rules:

## Nano Banana Best Practices:
1. **Describe the scene, don't just list keywords** - Use narrative, descriptive paragraphs
2. **Be specific about physical attributes** - Detail body proportions, features, clothing
3. **Include camera/artistic direction** - Mention angles, lighting, art style
4. **For photorealistic**: Use photography terms (85mm lens, golden hour light, bokeh, etc.)
5. **For anime/animated style**: Specify the exact animation style clearly

## Critical Instructions:
- KEEP the character's original outfit EXACTLY as shown in their source material
- KEEP the character's pose and actions from their source
- The prompt should be in ENGLISH
- Length: 50-80 words, highly descriptive
- Focus on VISUAL elements that can be rendered

## Character Body Modifications:
When modifying body attributes, use these exact terms in the prompt:
- For breasts: Specify cup size naturally (e.g., "voluptuous figure with 50DD bust")
- For hips: Range from "narrow hips" to "extremely wide hips with BBL proportions"
- For thighs: "slim thighs" to "thick, muscular thighs"
- For glutes: "flat" to "large rounded glutes" to "exaggerated BBL glutes"
- For male arms: "lean arms" to "heavily muscular arms"

SUPER IMPORTANT:
- If modifying an EXISTING character: Start with "IMPORTANT: Keep pose, actions, and EXACT outfit from [Character Name]'s appearance in [Show Name], but with these body modifications: [list modifications]"
- If creating a NEW character: Describe them fully including outfit, pose, and scene
- Always end with the art style: "animated style matching [Show Name]" or specific style requested

Output ONLY the prompt, no explanations.`;

  const userMessage = isNewCharacter
    ? `Generate an image prompt for a NEW ${characterGender} character with this description:
${newCharacterDescription}

Physical attributes to include:
${formatAttributes(attributes)}

Art style: animated/anime style`
    : `Generate an image prompt for the existing character:
Character: ${characterName}
Show: ${characterShow}
Gender: ${characterGender}

IMPORTANT: Keep their original outfit and pose exactly as they appear in ${characterShow}.

Physical modifications to apply:
${formatAttributes(attributes)}

Art style: Match the animated style of ${characterShow}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
    });

    const prompt = completion.choices[0]?.message?.content;
    return prompt || "A stylized animated character in dynamic pose";
  } catch (error) {
    console.error("Error generating prompt with Groq:", error);
    throw error;
  }
}

/**
 * Chatbot para consultas sobre personajes
 */
export async function chatWithGroq(userMessage, conversationHistory = []) {
  const systemPrompt = `You are a helpful assistant with extensive knowledge about TV shows, anime, movies, and animated series from 1980 to 2025.

You can help users:
- Find character names from shows
- Provide details about characters (appearance, personality, show)
- Suggest characters based on descriptions
- Answer questions about shows and characters

Be concise but informative. If suggesting characters, provide their name and show clearly.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
    { role: "user", content: userMessage },
  ];

  try {
    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content;
  } catch (error) {
    console.error("Error in Groq chat:", error);
    throw error;
  }
}

// Helper function to format attributes into readable text
function formatAttributes(attributes) {
  const {
    breastSize,
    hipSize,
    thighThickness,
    gluteSize,
    armSize,
    hasTattoos,
    tattooDescription,
  } = attributes;

  const parts = [];

  if (breastSize) {
    parts.push(`Breast size: ${breastSize}`);
  }

  if (hipSize) {
    parts.push(`Hip width: ${hipSize}`);
  }

  if (thighThickness) {
    parts.push(`Thigh thickness: ${thighThickness}`);
  }

  if (gluteSize) {
    parts.push(`Glute size: ${gluteSize}`);
  }

  if (armSize) {
    parts.push(`Arm muscularity: ${armSize}`);
  }

  if (hasTattoos && tattooDescription) {
    parts.push(`Tattoos: ${tattooDescription}`);
  }

  return parts.join('\n');
}
