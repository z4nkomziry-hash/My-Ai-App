import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';
let genAI = null;
let isConfigured = false;

if (API_KEY && API_KEY !== 'your_gemini_api_key_here' && API_KEY.length > 10) {
  try { genAI = new GoogleGenerativeAI(API_KEY); isConfigured = true; } catch (e) { console.error('Gemini init error:', e.message); }
}

const LANGUAGE_PROMPTS = {
  EN: "You are an expert English assistant. Provide clear, accurate responses.",
  'KU-BD': "You are an expert in Kurdish Badini (Kurmanji) dialect. Use ONLY Badini vocabulary and grammar. Common words: 'ez' (I), 'tu' (you), 'ew' (he/she), 'em' (we), 'hun' (you plural). Use Hawar Latin script. Never mix Sorani.",
  'KU-SO': "You are an expert in Kurdish Sorani dialect. Use ONLY Sorani vocabulary and grammar. Common words: 'min' (I), 'to' (you), 'ew' (he/she), 'ême' (we), 'êwe' (you plural). Use Arabic script. Never mix Badini.",
  AR: "You are an expert Arabic assistant. Use Modern Standard Arabic.",
  TR: "You are an expert Turkish assistant. Use modern Turkish with proper vowel harmony.",
  FA: "You are an expert Persian assistant. Use standard Iranian Persian.",
  DE: "You are an expert German assistant. Use proper German grammar.",
  FR: "You are an expert French assistant. Use proper French grammar.",
  ES: "You are an expert Spanish assistant. Use proper Spanish grammar.",
  RU: "You are an expert Russian assistant. Use proper Russian grammar.",
  ZH: "You are an expert Chinese assistant. Use Simplified Chinese.",
  HI: "You are an expert Hindi assistant. Use Devanagari script."
};

const TASK_PROMPTS = {
  generate: "Generate creative text based on the prompt.",
  rewrite: "Rewrite to improve clarity while maintaining meaning.",
  grammar: "Correct all grammar errors. Return only corrected text.",
  translate: "Translate accurately preserving meaning and tone."
};

export async function generateContent(prompt, language = 'EN', task = 'generate', isPro = false) {
  if (!isConfigured || !genAI) return demoResponse(prompt, language, task);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { temperature: isPro ? 0.9 : 0.7, maxOutputTokens: isPro ? 4096 : 2048 } });
    const langPrompt = LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS['EN'];
    const taskPrompt = TASK_PROMPTS[task] || TASK_PROMPTS['generate'];
    const fullPrompt = `${langPrompt}\n\nTask: ${taskPrompt}\n\nUser Input: ${prompt}\n\nResponse:`;
    const result = await model.generateContent(fullPrompt);
    const text = (await result.response).text();
    return { success: true, text, language, task };
  } catch (e) { return demoResponse(prompt, language, task); }
}

function demoResponse(prompt, language, task) {
  const texts = { EN: `[Demo] Response for: "${prompt}"`, 'KU-BD': `[دیمۆ] وەڵام بۆ: "${prompt}"`, 'KU-SO': `[دیمۆ] وەڵام: "${prompt}"`, AR: `[عرض] رد: "${prompt}"`, TR: `[Demo] Yanıt: "${prompt}"` };
  return { success: true, text: texts[language] || texts['EN'], language, task, isDemo: true };
}

export async function checkGeminiConnection() {
  if (!isConfigured) return false;
  try { const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); await model.generateContent("test"); return true; } catch { return false; }
}

export function isDemoMode() { return !isConfigured; }
