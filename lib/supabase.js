import { createClient as createBrowserClient } from '@/lib/supabase-client';

// For client-side usage, export the browser client directly
const supabase = typeof window !== 'undefined' ? createBrowserClient() : null;

export default supabase;
export { supabase };

// Check if Supabase is configured
export function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// ============================================
// AUTH FUNCTIONS (Client-side)
// ============================================

export async function getUser() {
  if (!supabase) return null;
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch {
    return null;
  }
}

export async function getProfile(userId) {
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch {
    return null;
  }
}

export async function createProfile(userId, email, fullName = '') {
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase.from('profiles').insert({
      user_id: userId,
      email: email,
      full_name: fullName,
      subscription_status: 'free',
      daily_generations_count: 0,
      last_reset_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).select().single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function checkAndResetDailyCredits(userId) {
  if (!supabase || !userId) return null;
  try {
    const profile = await getProfile(userId);
    if (!profile) return null;
    const lastReset = new Date(profile.last_reset_date || profile.created_at);
    const now = new Date();
    if (lastReset.toDateString() !== now.toDateString()) {
      const { data, error } = await supabase.from('profiles').update({
        daily_generations_count: 0,
        last_reset_date: now.toISOString(),
        updated_at: now.toISOString(),
      }).eq('user_id', userId).select().single();
      if (error) throw error;
      return data;
    }
    return profile;
  } catch {
    return null;
  }
}

export async function incrementDailyGenerations(userId, currentCount) {
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase.from('profiles').update({
      daily_generations_count: currentCount + 1,
      updated_at: new Date().toISOString(),
    }).eq('user_id', userId).select().single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function getGenerations(userId, limit = 100, searchTerm = '') {
  if (!supabase || !userId) return [];
  try {
    let query = supabase
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (searchTerm) {
      query = query.ilike('prompt', `%${searchTerm}%`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export async function deleteGeneration(generationId) {
  if (!supabase || !generationId) return false;
  try {
    const { error } = await supabase.from('generations').delete().eq('id', generationId);
    if (error) throw error;
    return true;
  } catch {
    return false;
  }
}

export async function submitPaymentRequest(paymentData) {
  if (!supabase || !paymentData.user_id) return null;
  try {
    const { data, error } = await supabase.from('payment_requests').insert({
      user_id: paymentData.user_id,
      method: paymentData.method,
      transaction_id: paymentData.transaction_id,
      receipt_url: paymentData.receipt_url || '',
      full_name: paymentData.full_name,
      email: paymentData.email,
      status: 'pending',
      created_at: new Date().toISOString(),
    }).select().single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function uploadReceipt(file, userId) {
  if (!supabase || !file || !userId) return null;
  try {
    const fileName = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { error } = await supabase.storage
      .from('payment-receipts')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage
      .from('payment-receipts')
      .getPublicUrl(fileName);
    return publicUrl;
  } catch {
    return null;
  }
}

export async function signUpWithEmail(email, password, fullName = '') {
  if (!supabase) return { user: null, session: null, error: 'Supabase not configured' };
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        shouldCreateUser: true,
      },
    });
    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    return { user: null, session: null, error: error.message };
  }
}

export async function signInWithEmail(email, password) {
  if (!supabase) return { user: null, session: null, error: 'Supabase not configured' };
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    return { user: null, session: null, error: error.message };
  }
}

export async function signInWithGoogle() {
  if (!supabase) return { error: 'Supabase not configured' };
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

export async function verifyEmailOTP(email, token) {
  if (!supabase) return { user: null, session: null, error: 'Supabase not configured' };
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });
    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    return { user: null, session: null, error: error.message };
  }
}

export async function resendEmailOTP(email) {
  if (!supabase) return { error: 'Supabase not configured' };
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

export async function resetPassword(email) {
  if (!supabase) return { error: 'Supabase not configured' };
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

export async function updatePassword(newPassword) {
  if (!supabase) return { error: 'Supabase not configured' };
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

export async function signOut() {
  if (!supabase) return;
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Sign out error:', error.message);
  }
}
