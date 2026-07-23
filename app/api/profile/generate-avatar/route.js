import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

/**
 * POST /api/profile/generate-avatar
 * Generate an AI avatar using Pollinations.ai (free API)
 */
export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || prompt.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please provide a descriptive prompt (min 5 characters)' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Use Pollinations.ai free API for image generation
    const encodedPrompt = encodeURIComponent(
      `profile picture avatar, ${prompt}, portrait, high quality, professional`
    );
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;

    // Verify the image is accessible
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'AI generation service unavailable. Please try again.' },
        { status: 503 }
      );
    }

    // Download and upload to Supabase storage
    const imageBuffer = await imageResponse.arrayBuffer();
    const fileName = `avatars/${user.id}/ai-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to save generated image' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Update user profile
    await supabase
      .from('profiles')
      .update({
        ai_avatar_url: publicUrl,
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      message: 'AI avatar generated and set successfully!',
    });
  } catch (error) {
    console.error('Avatar generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Generation failed. Please try again.' },
      { status: 500 }
    );
  }
}
