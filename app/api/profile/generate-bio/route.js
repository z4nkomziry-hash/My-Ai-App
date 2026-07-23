import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

/**
 * POST /api/profile/generate-bio
 * Generate an AI bio based on keywords
 */
export async function POST(request) {
  try {
    const { keywords, tone } = await request.json();

    if (!keywords || keywords.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Please enter at least 3 keywords' },
        { status: 400 }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Generate bio using Pollinations.ai text API
    const bioPrompt = encodeURIComponent(
      `Write a creative and engaging ${tone || 'professional'} bio for a profile based on these keywords: ${keywords}. Keep it 2-3 sentences, first person, with emojis.`
    );

    const response = await fetch(
      `https://text.pollinations.ai/${bioPrompt}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'AI service unavailable' },
        { status: 503 }
      );
    }

    const bio = await response.text();

    // Save to profile
    await supabase
      .from('profiles')
      .update({
        ai_generated_bio: bio.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    return NextResponse.json({
      success: true,
      bio: bio.trim(),
    });
  } catch (error) {
    console.error('Bio generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Generation failed' },
      { status: 500 }
    );
  }
}
