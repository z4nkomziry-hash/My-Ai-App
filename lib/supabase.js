import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let isConfigured = false;
let supabase = null;
let supabaseAdmin = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co' && supabaseAnonKey !== 'your-anon-key-here') {
  isConfigured = true;
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'aivision-auth',
      flowType: 'pkce'
    },
    db: { schema: 'public' }
  });

  if (supabaseServiceKey && supabaseServiceKey !== 'your-service-role-key-here') {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
  }
}

export function isSupabaseConfigured() { return isConfigured; }
export { supabase, supabaseAdmin };
export default supabase;

export async function getUser() {
  if (!supabase) return null;
  try { const { data: { user } } = await supabase.auth.getUser(); return user; } catch { return null; }
}

export async function getProfile(userId) {
  if (!supabase || !userId) return null;
  try { const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).single(); return data || null; } catch { return null; }
}

export async function createProfile(userId, email, fullName = '') {
  if (!supabase || !userId) return null;
  try { const { data } = await supabase.from('profiles').insert({ user_id: userId, email, full_name: fullName, subscription_status: 'free', daily_generations_count: 0, last_reset_date: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() }).select().single(); return data; } catch { return null; }
}

export async function checkAndResetDailyCredits(userId) {
  if (!supabase || !userId) return null;
  try {
    let profile = await getProfile(userId);
    if (!profile) return null;
    const lastReset = new Date(profile.last_reset_date || profile.created_at);
    const now = new Date();
    if (lastReset.toDateString() !== now.toDateString()) {
      const { data } = await supabase.from('profiles').update({ daily_generations_count: 0, last_reset_date: now.toISOString(), updated_at: now.toISOString() }).eq('user_id', userId).select().single();
      return data;
    }
    return profile;
  } catch { return null; }
}

export async function incrementDailyGenerations(userId, currentCount) {
  if (!supabase || !userId) return null;
  try { const { data } = await supabase.from('profiles').update({ daily_generations_count: currentCount + 1, updated_at: new Date().toISOString() }).eq('user_id', userId).select().single(); return data; } catch { return null; }
}

export async function saveGeneration(userId, prompt, response, language, task = 'generate', model = 'gemini-1.5-flash') {
  if (!supabase || !userId) return null;
  try { await supabase.from('generations').insert({ user_id: userId, prompt, response, language, task, model, created_at: new Date().toISOString() }); return true; } catch { return null; }
}

export async function getGenerations(userId, limit = 100, searchTerm = '') {
  if (!supabase || !userId) return [];
  try {
    let query = supabase.from('generations').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit);
    if (searchTerm) query = query.ilike('prompt', `%${searchTerm}%`);
    const { data } = await query;
    return data || [];
  } catch { return []; }
}

export async function deleteGeneration(generationId) {
  if (!supabase || !generationId) return false;
  try { await supabase.from('generations').delete().eq('id', generationId); return true; } catch { return false; }
}

export async function submitPaymentRequest(paymentData) {
  if (!supabase || !paymentData.user_id) return null;
  try { const { data } = await supabase.from('payment_requests').insert({ user_id: paymentData.user_id, method: paymentData.method, transaction_id: paymentData.transaction_id, receipt_url: paymentData.receipt_url || '', full_name: paymentData.full_name, email: paymentData.email, status: 'pending', created_at: new Date().toISOString() }).select().single(); return data; } catch { return null; }
}

export async function updatePaymentStatus(paymentId, status, adminNotes = '') {
  if (!supabaseAdmin || !paymentId) return null;
  try { const { data } = await supabaseAdmin.from('payment_requests').update({ status, admin_notes: adminNotes, updated_at: new Date().toISOString() }).eq('id', paymentId).select().single(); return data; } catch { return null; }
}

export async function approveUserPro(userId) {
  if (!supabaseAdmin || !userId) return null;
  try { const { data } = await supabaseAdmin.from('profiles').update({ subscription_status: 'pro', updated_at: new Date().toISOString() }).eq('user_id', userId).select().single(); return data; } catch { return null; }
}

export async function uploadReceipt(file, userId) {
  if (!supabase || !file || !userId) return null;
  try {
    const fileName = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    await supabase.storage.from('payment-receipts').upload(fileName, file, { cacheControl: '3600', upsert: false });
    const { data: { publicUrl } } = supabase.storage.from('payment-receipts').getPublicUrl(fileName);
    return publicUrl;
  } catch { return null; }
}

export async function signUpWithEmail(email, password, fullName = '') {
  if (!supabase) return { user: null, error: 'Supabase not configured' };
  try {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/auth?verified=true` } });
    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  } catch (error) { return { user: null, error: error.message }; }
}

export async function signInWithEmail(email, password) {
  if (!supabase) return { user: null, error: 'Supabase not configured' };
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  } catch (error) { return { user: null, error: error.message }; }
}

export async function signInWithGoogle() {
  if (!supabase) return { error: 'Supabase not configured' };
  try { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/dashboard`, queryParams: { access_type: 'offline', prompt: 'consent' } } }); return { error: null }; } catch (error) { return { error: error.message }; }
}

export async function signInWithApple() {
  if (!supabase) return { error: 'Supabase not configured' };
  try { await supabase.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo: `${window.location.origin}/dashboard` } }); return { error: null }; } catch (error) { return { error: error.message }; }
}

export async function verifyOTP(email, token) {
  if (!supabase) return { user: null, error: 'Supabase not configured' };
  try { const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' }); if (error) throw error; return { user: data.user, session: data.session, error: null }; } catch (error) { return { user: null, error: error.message }; }
}

export async function resendOTP(email) {
  if (!supabase) return { error: 'Supabase not configured' };
  try { await supabase.auth.resend({ type: 'signup', email }); return { error: null }; } catch (error) { return { error: error.message }; }
}

export async function signOut() {
  if (!supabase) return;
  try { await supabase.auth.signOut(); } catch (error) { console.error('Sign out error:', error.message); }
}
