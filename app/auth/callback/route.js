import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * OAuth Callback Handler
 * Handles the redirect from Google OAuth
 */
export async function GET(request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');
    const errorDescription = requestUrl.searchParams.get('error_description');
    const next = requestUrl.searchParams.get('next') || '/dashboard';

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(`/auth?error=${encodeURIComponent(errorDescription || error)}`, request.url)
      );
    }

    // Validate code
    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect(
        new URL('/auth?error=No authorization code received', request.url)
      );
    }

    // Create server client and exchange code
    const supabase = createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError.message);
      return NextResponse.redirect(
        new URL('/auth?error=Login failed. Please try again.', request.url)
      );
    }

    // Success - redirect to dashboard
    const redirectUrl = new URL(next, request.url);
    redirectUrl.searchParams.set('login', 'success');

    return NextResponse.redirect(redirectUrl, { status: 303 });

  } catch (err) {
    console.error('Callback error:', err.message);
    return NextResponse.redirect(
      new URL('/auth?error=An unexpected error occurred', request.url)
    );
  }
}
