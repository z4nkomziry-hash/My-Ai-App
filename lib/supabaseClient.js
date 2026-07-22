import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
})

// Server-side client with service role for admin operations
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables for server client')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Helper functions for user management
export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) throw error
  return data
}

export const updateDailyGenerations = async (userId, count) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      daily_generations_count: count,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const checkAndResetDailyCredits = async (userId) => {
  const profile = await getProfile(userId)
  
  if (!profile) return null
  
  const lastReset = new Date(profile.last_reset_date)
  const now = new Date()
  
  // Reset if it's a new day
  if (lastReset.toDateString() !== now.toDateString()) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        daily_generations_count: 0,
        last_reset_date: now.toISOString(),
        updated_at: now.toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
  
  return profile
}

export const saveToHistory = async (userId, prompt, response, language) => {
  const { data, error } = await supabase
    .from('history')
    .insert({
      user_id: userId,
      prompt,
      response,
      language,
      created_at: new Date().toISOString()
    })
    .select()
  
  if (error) throw error
  return data
}

export const getHistory = async (userId, limit = 50) => {
  const { data, error } = await supabase
    .from('history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data
}

export const submitPaymentRequest = async (paymentData) => {
  const { data, error } = await supabase
    .from('payment_requests')
    .insert({
      ...paymentData,
      status: 'pending',
      created_at: new Date().toISOString()
    })
    .select()
  
  if (error) throw error
  return data
}

export const uploadReceipt = async (file, userId) => {
  const fileName = `${userId}/${Date.now()}-${file.name}`
  
  const { data, error } = await supabase.storage
    .from('payment-receipts')
    .upload(fileName, file)
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from('payment-receipts')
    .getPublicUrl(fileName)
  
  return publicUrl
}
