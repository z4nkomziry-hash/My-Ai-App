import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

/**
 * GET /api/profile/check-username?username=xxx * Check if a username is available
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { available: false, message: 'Username is required' },
        { status: 400 }
      );
    }

    // Validate username format
    if (username.length < 3) {
      return NextResponse.json(
        { available: false, message: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { available: false, message: 'Only letters, numbers, and underscores allowed' },
        { status: 400 }
      );
    }

    // Check if username exists
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (data) {
      return NextResponse.json({
        available: false,
        message: 'Username is already taken',
      });
    }

    return NextResponse.json({
      available: true,
      message: 'Username is available! 🎉',
    });
  } catch (error) {
    console.error('Username check error:', error);
    return NextResponse.json(
      { available: false, message: 'Error checking username' },
      { status: 500 }
    );
  }
}
