import { NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';
import supabase from '@/lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, language = 'EN', task = 'generate' } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (prompt.length > 2000) {
      return NextResponse.json({ error: 'Prompt too long. Maximum 2000 characters.' }, { status: 400 });
    }

    const validLanguages = ['EN', 'KU-BD', 'KU-SO', 'AR', 'TR', 'FA', 'DE', 'FR', 'ES', 'RU', 'ZH', 'HI'];
    if (!validLanguages.includes(language)) {
      return NextResponse.json({ error: 'Invalid language code' }, { status: 400 });
    }

    let isPro = false;
    let userId = null;
    let userProfile = null;

    if (supabase) {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (!authError && user) {
          userId = user.id;

          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

          if (!profileError && profile) {
            userProfile = profile;

            const lastReset = new Date(profile.last_reset_date || profile.created_at);
            const now = new Date();
            if (lastReset.toDateString() !== now.toDateString()) {
              const { data: resetProfile } = await supabase
                .from('profiles')
                .update({
                  daily_generations_count: 0,
                  last_reset_date: now.toISOString(),
                  updated_at: now.toISOString()
                })
                .eq('user_id', userId)
                .select()
                .single();
              if (resetProfile) {
                userProfile = resetProfile;
              }
            }

            isPro = userProfile.subscription_status === 'pro';

            if (!isPro && userProfile.daily_generations_count >= 5) {
              return NextResponse.json(
                { error: 'Daily limit reached. Upgrade to Pro for unlimited generations.', dailyLimit: true },
                { status: 403 }
              );
            }
          }
        }
      } catch (authError) {
        console.error('Auth check error:', authError.message);
      }
    }

    const result = await generateContent(prompt, language, task, isPro);

    if (result.success && userId && supabase) {
      try {
        await supabase.from('generations').insert({
          user_id: userId,
          prompt: prompt,
          response: result.text,
          language: language,
          task: task,
          model: result.model || 'gemini-1.5-flash',
          created_at: new Date().toISOString()
        });

        if (!isPro && userProfile) {
          await supabase
            .from('profiles')
            .update({
              daily_generations_count: userProfile.daily_generations_count + 1,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);
        }
      } catch (dbError) {
        console.error('Database update error:', dbError.message);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
