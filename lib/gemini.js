import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';
let genAI = null;
let isConfigured = false;

if (API_KEY && API_KEY !== 'your_gemini_api_key_here' && API_KEY.length > 10) {
  try { genAI = new GoogleGenerativeAI(API_KEY); isConfigured = true; } catch (e) { console.error('Gemini init error:', e.message); }
}

const LANGUAGE_PROMPTS = {
  EN: "You are an expert English assistant. Provide clear, accurate, and natural-sounding English text.",
  'KU-BD': "You are an expert in Kurdish Badini (Kurmanji) dialect. CRITICAL: Use ONLY Badini vocabulary and grammar. Use Hawar Latin script. Common words: 'ez' (I), 'tu' (you), 'ew' (he/she), 'em' (we), 'hun' (you plural). Never mix Sorani. Ergative past: 'min tu dîtî'.",
  'KU-SO': "You are an expert in Kurdish Sorani dialect. CRITICAL: Use ONLY Sorani vocabulary and grammar. Use Arabic script. Common words: 'min' (I), 'to' (you), 'ew' (he/she), 'ême' (we), 'êwe' (you plural). Never mix Badini. Different ergative: 'min twanim'.",
  AR: "You are an expert Arabic assistant. Use Modern Standard Arabic.",
  TR: "You are an expert Turkish assistant. Use modern Turkish.",
  FA: "You are an expert Persian assistant. Use standard Iranian Persian.",
  DE: "You are an expert German assistant.",
  FR: "You are an expert French assistant.",
  ES: "You are an expert Spanish assistant.",
  RU: "You are an expert Russian assistant.",
  ZH: "You are an expert Chinese assistant. Use Simplified Chinese.",
  HI: "You are an expert Hindi assistant. Use Devanagari script."
};

const TASK_PROMPTS = {
  generate: "Generate creative and accurate text based on the prompt.",
  rewrite: "Rewrite the text to improve clarity while maintaining meaning.",
  grammar: "Correct all grammar errors. Return only corrected text.",
  translate: "Translate accurately preserving meaning and tone."
};

export async function generateContent(prompt, language = 'EN', task = 'generate', isPro = false) {
  if (!isConfigured || !genAI) return generateDemoResponse(prompt, language, task, isPro);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { temperature: isPro ? 0.9 : 0.7, topK: isPro ? 40 : 20, topP: isPro ? 0.95 : 0.85, maxOutputTokens: isPro ? 4096 : 2048 } });
    const langPrompt = LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS['EN'];
    const taskPrompt = TASK_PROMPTS[task] || TASK_PROMPTS['generate'];
    const fullPrompt = `${langPrompt}\n\nTask: ${taskPrompt}\n\n${isPro ? 'Provide detailed, nuanced responses.' : 'Provide clear, concise responses.'}\n\nUser Input: ${prompt}\n\nResponse:`;
    const result = await model.generateContent(fullPrompt);
    const text = (await result.response).text();
    return { success: true, text, language, task, model: 'gemini-1.5-flash' };
  } catch (error) { return generateDemoResponse(prompt, language, task, isPro); }
}

function generateDemoResponse(prompt, language, task, isPro) {
  const texts = { EN: `[Demo] Response for: "${prompt}". Connect Gemini API for full functionality.`, 'KU-BD': `[دیمۆ] وەڵام بۆ: "${prompt}".`, 'KU-SO': `[دیمۆ] وەڵام: "${prompt}".`, AR: `[عرض] رد: "${prompt}".`, TR: `[Demo] Yanıt: "${prompt}".` };
  return { success: true, text: texts[language] || texts['EN'], language, task, model: 'demo', isDemo: true };
}

export async function generateBatch(prompts) {
  const results = await Promise.allSettled(prompts.map(p => generateContent(p.prompt, p.language, p.task)));
  return results.map((r, i) => ({ prompt: prompts[i].prompt, ...(r.status === 'fulfilled' ? r.value : { success: false, error: r.reason?.message }) }));
}

export async function checkGeminiConnection() {
  if (!isConfigured) return false;
  try { const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); await model.generateContent("test"); return true; } catch { return false; }
}

export function isDemoMode() { return !isConfigured; }
export { LANGUAGE_PROMPTS, TASK_PROMPTS };
