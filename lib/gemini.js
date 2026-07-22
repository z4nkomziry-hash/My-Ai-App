import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Language-specific system prompts for precise dialect handling
const LANGUAGE_PROMPTS = {
  'EN': 'You are an expert English language assistant. Provide clear, accurate, and natural-sounding English text.',
  
  'KU-BD': `You are an expert in Kurdish Badini (Kurmanji) dialect. CRITICAL RULES:
  - Use ONLY Badini/Kurmanji dialect vocabulary and grammar
  - Common Badini words: "ez" (I), "tu" (you), "ew" (he/she), "em" (we), "hun" (you plural), "ew" (they)
  - Use "-im" suffix for first person: "ez dikim" (I do), "ez dibînim" (I see)
  - Vocabulary differences from Sorani: "gund" (village) not "dê", "mal" (house) not "xanû", "roj" (day/sun) same but context different
  - Grammar: Ergative construction in past tense: "min tu dîtî" (I saw you)
  - Never mix Sorani words or grammar structures
  - Use Hawar Latin alphabet for Kurdish Latin script
  - Examples: "Ez ji te hez dikim" (I love you), "Tu çawa yî?" (How are you?)`,
  
  'KU-SO': `You are an expert in Kurdish Sorani dialect. CRITICAL RULES:
  - Use ONLY Sorani dialect vocabulary and grammar
  - Common Sorani words: "min" (I), "to" (you), "ew" (he/she), "ême" (we), "êwe" (you plural), "ewan" (they)
  - Use "-im" suffix: "min dekem" (I do), "min debînim" (I see)
  - Vocabulary differences from Badini: "dê" (village) not "gund", "xanû" (house) not "mal"
  - Grammar: Different ergative construction: "min twanim" (I saw you)
  - Never mix Badini words or grammar structures
  - Use Arabic script for Sorani Kurdish
  - Examples: "من تۆم خۆش دەوێت" (I love you), "تۆ چۆنی؟" (How are you?)`,
  
  'AR': 'You are an expert Arabic language assistant. Use Modern Standard Arabic with proper grammar and diacritics when needed.',
  'TR': 'You are an expert Turkish language assistant. Use modern Turkish with proper vowel harmony and agglutination rules.',
  'FA': 'You are an expert Persian (Farsi) language assistant. Use standard Iranian Persian with proper script and grammar.',
  'DE': 'You are an expert German language assistant. Use proper German grammar including cases, gender, and verb positions.',
  'FR': 'You are an expert French language assistant. Use proper French grammar including agreement and conjugation.',
  'ES': 'You are an expert Spanish language assistant. Use proper Spanish grammar including subjunctive mood when appropriate.',
  'RU': 'You are an expert Russian language assistant. Use proper Russian grammar including cases and verbal aspects.',
  'ZH': 'You are an expert Chinese language assistant. Use Simplified Chinese with proper measure words and sentence structures.',
  'HI': 'You are an expert Hindi language assistant. Use standard Hindi with Devanagari script and proper honorifics.'
};

const TASK_PROMPTS = {
  'generate': 'Generate text based on the following prompt. Be creative and accurate.',
  'rewrite': 'Rewrite the following text to improve clarity, flow, and style while maintaining the original meaning.',
  'grammar': 'Correct the grammar, spelling, and punctuation of the following text. Explain the corrections made.',
  'translate': 'Translate the following text accurately while preserving the original meaning, tone, and cultural context.'
};

export async function generateContent(prompt, language, task = 'generate', isPro = false) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: isPro ? 0.9 : 0.7,
        topK: isPro ? 40 : 20,
        topP: isPro ? 0.95 : 0.85,
        maxOutputTokens: isPro ? 4096 : 2048,
      }
    });

    const systemPrompt = `${LANGUAGE_PROMPTS[language]}\n\n${TASK_PROMPTS[task]}\n\n${isPro ? 'Provide detailed, nuanced responses with cultural context.' : 'Provide clear, concise responses.'}`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: `Understood. I will follow all rules for ${language} and provide ${task} assistance.` }],
        },
      ],
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      text,
      language,
      task
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      success: false,
      error: error.message,
      language,
      task
    };
  }
}

// Specialized function for Kurdish dialect translation with enhanced accuracy
export async function translateKurdishDialects(text, sourceDialect, targetDialect) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.3, // Lower temperature for more accurate translation
        maxOutputTokens: 4096,
      }
    });

    const prompt = `Translate the following text from Kurdish ${sourceDialect} to Kurdish ${targetDialect}. 
    Maintain all cultural nuances and idiomatic expressions.
    
    Source (${sourceDialect}): ${text}
    
    Target (${targetDialect}):`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return {
      success: true,
      translatedText: response.text(),
      sourceDialect,
      targetDialect
    };
  } catch (error) {
    console.error('Kurdish Translation Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Batch processing for multiple generations
export async function generateBatch(prompts, language, task = 'generate') {
  const results = await Promise.allSettled(
    prompts.map(prompt => generateContent(prompt, language, task))
  );
  
  return results.map((result, index) => ({
    prompt: prompts[index],
    ...(result.status === 'fulfilled' ? result.value : { success: false, error: result.reason })
  }));
}
