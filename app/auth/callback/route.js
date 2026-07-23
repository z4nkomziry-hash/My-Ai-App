import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * OAuth Callback Handler
 * 
 * This route handles the redirect from Google OAuth after the user
 * authenticates with their Google account.
 * 
 * Flow:
 * 1. Google redirects to /auth/callback?code=...
 * 2. This route exchanges the code for a Supabase session
 * 3. User is redirected to the dashboard
 */
export async function GET(request) {
  try {
    // Get the full request URL
    const requestUrl = new URL(request.url);
    
    // Extract the authorization code
    const code = requestUrl.searchParams.get('code');
    
    // Check for error parameters from OAuth provider
    const error = requestUrl.searchParams.get('error');
    const errorDescription = requestUrl.searchParams.get('error_description');
    
    if (error) {
      console.error('OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(`/auth?error=${encodeURIComponent(errorDescription || error)}`, request.url)
      );
    }

    // Determine where to redirect after successful login
    const next = requestUrl.searchParams.get('next') || '/dashboard';

    // Validate that we received a code
    if (!code) {
      console.error('No authorization code received in callback');
      return NextResponse.redirect(
        new URL('/auth?error=No authorization code received', request.url)
      );
    }

    // Create server-side Supabase client
    const supabase = createClient();

    // Exchange the authorization code for a session
    // This sets the necessary auth cookies automatically
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError.message);
      
      // If the code is invalid or expired
      return NextResponse.redirect(
        new URL(`/auth?error=${encodeURIComponent('Login failed. Please try again.')}`, request.url)
      );
    }

    // Success! Redirect to the dashboard
    // Use a 303 redirect for proper POST-to-GET redirect
    const redirectUrl = new URL(next, request.url);
    
    // Add a success parameter so the dashboard can show a welcome message
    redirectUrl.searchParams.set('login', 'success');
    
    return NextResponse.redirect(redirectUrl, { status: 303 });

  } catch (err) {
    console.error('Unexpected callback error:', err.message);
    
    // Redirect to auth page with generic error
    return NextResponse.redirect(
      new URL('/auth?error=An unexpected error occurred', request.url)
    );
  }
}
