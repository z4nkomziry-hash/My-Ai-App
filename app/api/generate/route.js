import { NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';
import { getUser, getProfile, checkAndResetDailyCredits, saveToHistory } from '@/lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, language = 'EN', task = 'generate' } = body;

    if (!prompt || prompt.length > 2000) {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    const user = await getUser();
    let isPro = false;

    if (user) {
      const profile = await checkAndResetDailyCredits(user.id);
      if (profile) {
        isPro = profile.subscription_status === 'pro';
        if (!isPro && profile.daily_generations_count >= 5) {
          return NextResponse.json({ error: 'Daily limit reached', dailyLimit: true }, { status: 403 });
        }
      }
    }

    const result = await generateContent(prompt, language, task, isPro);

    if (user && result.success) {
      await saveToHistory(user.id, prompt, result.text, language, task);
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
