-- ============================================
-- USER IDENTITY & PROFILE SYSTEM MIGRATIONS
-- ============================================

-- Add custom user ID column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS custom_id VARCHAR(15) UNIQUE,
ADD COLUMN IF NOT EXISTS username VARCHAR(30) UNIQUE,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS ai_generated_bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS ai_avatar_url TEXT,
ADD COLUMN IF NOT EXISTS cover_url TEXT,
ADD COLUMN IF NOT EXISTS ai_cover_url TEXT,
ADD COLUMN IF NOT EXISTS status_text VARCHAR(100),
ADD COLUMN IF NOT EXISTS status_emoji VARCHAR(10),
ADD COLUMN IF NOT EXISTS points_balance INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS xp_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT false;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_custom_id ON profiles(custom_id);

-- Sessions table for active device management
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_info JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);

-- Connections (Follow/Unfollow)
CREATE TABLE IF NOT EXISTS connections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_connections_follower ON connections(follower_id);
CREATE INDEX IF NOT EXISTS idx_connections_following ON connections(following_id);

-- Messages for Direct Messaging
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text',
    tip_amount INTEGER DEFAULT 0,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);

-- Wallet transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(30),
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    description TEXT,
    reference_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_user ON wallet_transactions(user_id);

-- Profile visits tracking
CREATE TABLE IF NOT EXISTS profile_visits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    visitor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    country VARCHAR(100),
    city VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generate custom ID function
CREATE OR REPLACE FUNCTION generate_custom_id()
RETURNS VARCHAR(15) AS $$
DECLARE
    digits TEXT;
    letters TEXT;
    new_id VARCHAR(15);
    exists_check BOOLEAN;
BEGIN
    LOOP
        digits := '';
        FOR i IN 1..10 LOOP
            digits := digits || FLOOR(RANDOM() * 10)::TEXT;
        END LOOP;
        
        letters := '';
        FOR i IN 1..5 LOOP
            letters := letters || CHR(65 + FLOOR(RANDOM() * 26)::INTEGER);
        END LOOP;
        
        new_id := digits || '-' || letters;
        
        SELECT EXISTS(SELECT 1 FROM profiles WHERE custom_id = new_id) INTO exists_check;
        EXIT WHEN NOT exists_check;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Auto-assign custom ID on profile creation
CREATE OR REPLACE FUNCTION set_custom_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.custom_id IS NULL THEN
        NEW.custom_id := generate_custom_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_custom_id ON profiles;
CREATE TRIGGER profiles_custom_id
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION set_custom_id();

-- RLS Policies
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own sessions" ON user_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users view connections" ON connections
    FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users manage connections" ON connections
    FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users delete connections" ON connections
    FOR DELETE USING (auth.uid() = follower_id);

CREATE POLICY "Users view messages" ON messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users send messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users view transactions" ON wallet_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users view own visits" ON profile_visits
    FOR SELECT USING (auth.uid() = profile_owner_id);
