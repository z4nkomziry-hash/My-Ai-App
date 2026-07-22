import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let isConfigured = false;
let supabase = null;
let supabaseAdmin = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co') {
  isConfigured = true;
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'aivision-auth' },
    db: { schema: 'public' }
  });
  if (supabaseServiceKey && supabaseServiceKey !== 'your-service-role-key-here') {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  }
}

export function isSupabaseConfigured() { return isConfigured; }
export { supabase };
export default supabase;

export async function getUser() {
  if (!supabase) return null;
  try { const { data: { user } } = await supabase.auth.getUser(); return user; } catch { return null; }
}

export async function getProfile(userId) {
  if (!supabase || !userId) return null;
  try { const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).single(); return data; } catch { return null; }
}

export async function checkAndResetDailyCredits(userId) {
  if (!supabase || !userId) return null;
  try {
    const profile = await getProfile(userId);
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

export async function saveToHistory(userId, prompt, response, language, task = 'generate') {
  if (!supabase || !userId) return null;
  try { await supabase.from('history').insert({ user_id: userId, prompt, response, language, task, created_at: new Date().toISOString() }); return true; } catch { return null; }
}

export async function getHistory(userId, limit = 50) {
  if (!supabase || !userId) return [];
  try { const { data } = await supabase.from('history').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit); return data || []; } catch { return []; }
}

export async function submitPaymentRequest(paymentData) {
  if (!supabase || !paymentData.user_id) return null;
  try {
    const { data } = await supabase.from('payment_requests').insert({
      user_id: paymentData.user_id, method: paymentData.method, transaction_id: paymentData.transaction_id,
      receipt_url: paymentData.receipt_url || '', full_name: paymentData.full_name, email: paymentData.email,
      status: 'pending', created_at: new Date().toISOString()
    }).select().single();
    return data;
  } catch { return null; }
}

export async function uploadReceipt(file, userId) {
  if (!supabase || !file || !userId) return null;
  try {
    const fileName = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { error } = await supabase.storage.from('payment-receipts').upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('payment-receipts').getPublicUrl(fileName);
    return publicUrl;
  } catch { return null; }
}
