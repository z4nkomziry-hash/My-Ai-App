import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for Client Components.
 * Singleton pattern to avoid multiple instances.
 */
let clientInstance = null;

export function createClient() {
  if (clientInstance) {
    return clientInstance;
  }

  clientInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return clientInstance;
}
