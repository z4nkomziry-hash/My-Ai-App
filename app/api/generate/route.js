import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseClient';
import { generateContent } from '@/lib/gemini';
import { cookies } from 'next/headers';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

// Simple in-memory rate limiting (use Redis in production)
const rateLimitStore = new Map();

function checkRateLimit(userId) {
  const now = Date.now();
  const userRequests = rateLimitStore.get(userId) || [];
  
  // Clean old requests
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitStore.set(userId, recentRequests);
  return true;
}

export async function POST(request) {
  try {
    // Get user session
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check rate limit
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { prompt, language, task = 'generate' } = body;

    // Validate inputs
    if (!prompt || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt and language' },
        { status: 400 }
      );
    }

    const validLanguages = ['EN', 'KU-BD', 'KU-SO', 'AR', 'TR', 'FA', 'DE', 'FR', 'ES', 'RU', 'ZH', 'HI'];
    if (!validLanguages.includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language code' },
        { status: 400 }
      );
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: 'Prompt too long. Maximum 2000 characters.' },
        { status: 400 }
      );
    }

    // Get user profile and check credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Check and reset daily credits if needed
    const lastReset = new Date(profile.last_reset_date);
    const now = new Date();
    let currentCredits = profile.daily_generations_count;

    if (lastReset.toDateString() !== now.toDateString()) {
      currentCredits = 0;
      await supabase
        .from('profiles')
        .update({
          daily_generations_count: 0,
          last_reset_date: now.toISOString()
        })
        .eq('user_id', user.id);
    }

    // Check credit limits for free users
    if (profile.subscription_status === 'free' && currentCredits >= 5) {
      return NextResponse.json(
        { 
          error: 'Daily generation limit reached. Upgrade to Pro for unlimited generations.',
          dailyLimit: true
        },
        { status: 403 }
      );
    }

    // Generate AI content
    const isPro = profile.subscription_status === 'pro';
    const result = await generateContent(prompt, language, task, isPro);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Update daily credits for free users
    if (!isPro) {
      await supabase
        .from('profiles')
        .update({
          daily_generations_count: currentCredits + 1,
          updated_at: now.toISOString()
        })
        .eq('user_id', user.id);
    }

    // Save to history
    await supabase
      .from('history')
      .insert({
        user_id: user.id,
        prompt,
        response: result.text,
        language,
        task,
        created_at: now.toISOString()
      });

    return NextResponse.json({
      success: true,
      text: result.text,
      creditsRemaining: isPro ? 'unlimited' : 4 - currentCredits,
      isPro
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check remaining credits
export async function GET(request) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Check and reset daily credits
    const lastReset = new Date(profile.last_reset_date);
    const now = new Date();
    
    if (lastReset.toDateString() !== now.toDateString()) {
      await supabase
        .from('profiles')
        .update({
          daily_generations_count: 0,
          last_reset_date: now.toISOString()
        })
        .eq('user_id', user.id);
      
      profile.daily_generations_count = 0;
    }

    const isPro = profile.subscription_status === 'pro';
    const dailyLimit = 5;
    const used = profile.daily_generations_count;

    return NextResponse.json({
      success: true,
      creditsUsed: used,
      creditsRemaining: isPro ? 'unlimited' : dailyLimit - used,
      dailyLimit: isPro ? null : dailyLimit,
      isPro,
      subscriptionStatus: profile.subscription_status
    });

  } catch (error) {
    console.error('Credits check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
