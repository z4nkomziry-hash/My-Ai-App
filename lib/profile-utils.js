/**
 * Profile Utility Functions for AIVision
 */

import supabase from '@/lib/supabase';

/**
 * Generate a unique username suggestion
 */
export function generateUsernameSuggestion(email, fullName) {
  const base = fullName
    ? fullName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12)
    : email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);
  
  const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `${base}${randomNum}`;
}

/**
 * Check if username is available
 * @param {string} username - Username to check
 * @returns {Promise<{available: boolean, message: string}>}
 */
export async function checkUsernameAvailability(username) {
  if (!username || username.length < 3) {
    return { available: false, message: 'Username must be at least 3 characters' };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { available: false, message: 'Only letters, numbers, and underscores allowed' };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username.toLowerCase())
    .single();

  if (error && error.code !== 'PGRST116') {
    return { available: false, message: 'Error checking username' };
  }

  if (data) {
    return { available: false, message: 'Username is already taken' };
  }

  return { available: true, message: 'Username is available! 🎉' };
}

/**
 * Set username for current user
 */
export async function setUsername(userId, username) {
  const check = await checkUsernameAvailability(username);
  if (!check.available) {
    return { success: false, error: check.message };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ username: username.toLowerCase(), updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get user's public profile
 */
export async function getPublicProfile(username) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      custom_id,
      username,
      full_name,
      bio,
      ai_generated_bio,
      avatar_url,
      ai_avatar_url,
      cover_url,
      ai_cover_url,
      status_text,
      status_emoji,
      badges,
      social_links,
      is_verified,
      is_vip,
      level,
      points_balance,
      created_at
    `)
    .eq('username', username.toLowerCase())
    .single();

  if (error) return null;
  return data;
}

/**
 * Get follower/following counts
 */
export async function getConnectionCounts(userId) {
  const [followers, following] = await Promise.all([
    supabase.from('connections').select('*', { count: 'exact', head: true }).eq('following_id', userId),
    supabase.from('connections').select('*', { count: 'exact', head: true }).eq('follower_id', userId),
  ]);

  return {
    followers: followers.count || 0,
    following: following.count || 0,
  };
}

/**
 * Follow a user
 */
export async function followUser(followerId, followingId) {
  if (followerId === followingId) {
    return { success: false, error: 'Cannot follow yourself' };
  }

  const { error } = await supabase
    .from('connections')
    .insert({ follower_id: followerId, following_id: followingId });

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Already following this user' };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Unfollow a user
 */
export async function unfollowUser(followerId, followingId) {
  const { error } = await supabase
    .from('connections')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * Check if following
 */
export async function isFollowing(followerId, followingId) {
  const { data } = await supabase
    .from('connections')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single();

  return !!data;
}

/**
 * Get user's sessions
 */
export async function getUserSessions(userId) {
  const { data, error } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('last_active_at', { ascending: false });

  if (error) return [];
  return data;
}

/**
 * Log out from all devices except current
 */
export async function logoutAllDevices(userId, currentSessionId) {
  const { error } = await supabase
    .from('user_sessions')
    .update({ is_active: false })
    .eq('user_id', userId)
    .neq('id', currentSessionId);

  if (error) return { success: false, error: error.message };

  // Also revoke all refresh tokens
  await supabase.auth.admin.signOut(userId);

  return { success: true };
}

/**
 * Get wallet balance and transactions
 */
export async function getWalletInfo(userId) {
  const profile = await supabase
    .from('profiles')
    .select('points_balance')
    .eq('user_id', userId)
    .single();

  const { data: transactions } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  return {
    balance: profile?.data?.points_balance || 0,
    transactions: transactions || [],
  };
}

/**
 * Send tip to another user
 */
export async function sendTip(senderId, receiverId, amount) {
  // Get sender balance
  const { data: sender } = await supabase
    .from('profiles')
    .select('points_balance')
    .eq('user_id', senderId)
    .single();

  if (!sender || sender.points_balance < amount) {
    return { success: false, error: 'Insufficient balance' };
  }

  // Deduct from sender
  await supabase
    .from('profiles')
    .update({ points_balance: sender.points_balance - amount })
    .eq('user_id', senderId);

  // Add to receiver
  const { data: receiver } = await supabase
    .from('profiles')
    .select('points_balance')
    .eq('user_id', receiverId)
    .single();

  await supabase
    .from('profiles')
    .update({ points_balance: (receiver?.points_balance || 0) + amount })
    .eq('user_id', receiverId);

  // Record transactions
  await supabase.from('wallet_transactions').insert([
    {
      user_id: senderId,
      transaction_type: 'tip_sent',
      amount: -amount,
      balance_after: sender.points_balance - amount,
      description: `Tip sent to user`,
    },
    {
      user_id: receiverId,
      transaction_type: 'tip_received',
      amount: amount,
      balance_after: (receiver?.points_balance || 0) + amount,
      description: `Tip received from user`,
    },
  ]);

  return { success: true };
}
