import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with API key from environment
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Language-specific system prompts for precise dialect handling
const LANGUAGE_PROMPTS = {
  EN: `You are an expert English language assistant. Provide clear, accurate, and natural-sounding English text. 
Focus on proper grammar, natural phrasing, and cultural appropriateness.`,

  'KU-BD': `You are an expert in Kurdish Badini (Kurmanji) dialect. CRITICAL RULES:
- Use ONLY Badini/Kurmanji dialect vocabulary and grammar
- Common Badini words: "ez" (I), "tu" (you), "ew" (he/she), "em" (we), "hun" (you plural), "ew" (they)
- Use "-im" suffix for first person present: "ez dikim" (I do), "ez dibînim" (I see)
- Vocabulary: "gund" (village), "mal" (house), "roj" (day/sun)
- Grammar: Ergative construction in past tense: "min tu dîtî" (I saw you)
- Never mix Sorani words or grammar structures
- Use Hawar Latin alphabet for Kurdish Latin script
- Be precise with Badini-specific idioms and expressions`,

  'KU-SO': `You are an expert in Kurdish Sorani dialect. CRITICAL RULES:
- Use ONLY Sorani dialect vocabulary and grammar
- Common Sorani words: "min" (I), "to" (you), "ew" (he/she), "ême" (we), "êwe" (you plural), "ewan" (they)
- Use "-im" suffix: "min dekem" (I do), "min debînim" (I see)
- Vocabulary: "dê" (village), "xanû" (house)
- Grammar: Different ergative construction: "min twanim" (I saw you)
- Never mix Badini words or grammar structures
- Use Arabic script for Sorani Kurdish
- Be precise with Sorani-specific idioms and expressions`,

  AR: `You are an expert Arabic language assistant. Use Modern Standard Arabic with proper grammar, diacritics when needed, and natural phrasing.`,

  TR: `You are an expert Turkish language assistant. Use modern Turkish with proper vowel harmony, agglutination rules, and natural expressions.`,

  FA: `You are an expert Persian (Farsi) language assistant. Use standard Iranian Persian with proper script, grammar, and natural expressions.`,

  DE: `You are an expert German language assistant. Use proper German grammar including cases, gender, verb positions, and natural expressions.`,

  FR: `You are an expert French language assistant. Use proper French grammar including agreement, conjugation, and natural expressions.`,

  ES: `You are an expert Spanish language assistant. Use proper Spanish grammar including subjunctive mood when appropriate and natural expressions.`,

  RU: `You are an expert Russian language assistant. Use proper Russian grammar including cases, verbal aspects, and natural expressions.`,

  ZH: `You are an expert Chinese language assistant. Use Simplified Chinese with proper measure words, sentence structures, and natural expressions.`,

  HI: `You are an expert Hindi language assistant. Use standard Hindi with Devanagari script, proper honorifics, and natural expressions.`,
};

const TASK_PROMPTS = {
  generate: 'Generate creative and accurate text based on the prompt. Be natural and engaging.',
  rewrite: 'Rewrite the text to improve clarity, flow, and style while maintaining the original meaning.',
  grammar: 'Correct all grammar, spelling, and punctuation errors. Return only the corrected text.',
  translate: 'Translate accurately while preserving meaning, tone, and cultural context.',
};

/**
 * Generate AI content using Google Gemini
 * @param {string} prompt - User's input text
 * @param {string} language - Language code (e.g., 'EN', 'KU-BD')
 * @param {string} task - Task type ('generate', 'rewrite', 'grammar', 'translate')
 * @param {boolean} isPro - Whether user has Pro subscription
 * @returns {Object} Response object with success status and generated text
 */
export async function generateContent(prompt, language = 'EN', task = 'generate', isPro = false) {
  try {
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: isPro ? 0.9 : 0.7,
        topK: isPro ? 40 : 20,
        topP: isPro ? 0.95 : 0.85,
        maxOutputTokens: isPro ? 4096 : 2048,
      },
    });

    // Get language-specific system prompt
    const langPrompt = LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS['EN'];
    const taskPrompt = TASK_PROMPTS[task] || TASK_PROMPTS['generate'];

    const systemPrompt = `${langPrompt}\n\nTask: ${taskPrompt}\n\n${isPro ? 'Provide detailed, nuanced responses with cultural context and examples where appropriate.' : 'Provide clear, concise responses.'}`;

    const fullPrompt = `${systemPrompt}\n\nUser Input: ${prompt}\n\nResponse:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      text: text,
      language,
      task,
    };
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    return {
      success: false,
      error: error.message || 'Failed to generate content',
      language,
      task,
    };
  }
}

/**
 * Generate multiple responses in batch
 * @param {Array} prompts - Array of prompt objects
 * @returns {Array} Array of response objects
 */
export async function generateBatch(prompts) {
  const results = await Promise.allSettled(
    prompts.map(({ prompt, language, task }) =>
      generateContent(prompt, language, task)
    )
  );

  return results.map((result, index) => ({
    prompt: prompts[index].prompt,
    ...(result.status === 'fulfilled' ? result.value : { success: false, error: result.reason?.message }),
  }));
}

/**
 * Check if Gemini API is accessible
 * @returns {Promise<boolean>}
 */
export async function checkGeminiConnection() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Test connection");
    await result.response;
    return true;
  } catch (error) {
    console.error('Gemini connection check failed:', error.message);
    return false;
  }
}
