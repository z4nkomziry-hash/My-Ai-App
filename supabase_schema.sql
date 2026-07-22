-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro', 'pending')),
    daily_generations_count INTEGER DEFAULT 0,
    last_reset_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment_requests table
CREATE TABLE payment_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('FIB', 'FastPay', 'USDT')),
    transaction_id TEXT NOT NULL,
    receipt_url TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create history table
CREATE TABLE history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    language TEXT NOT NULL,
    task TEXT DEFAULT 'generate',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX idx_payment_requests_user_id ON payment_requests(user_id);
CREATE INDEX idx_payment_requests_status ON payment_requests(status);
CREATE INDEX idx_history_user_id ON history(user_id);
CREATE INDEX idx_history_created_at ON history(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Payment requests policies
CREATE POLICY "Users can view own payment requests"
    ON payment_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payment requests"
    ON payment_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- History policies
CREATE POLICY "Users can view own history"
    ON history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own history"
    ON history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own history"
    ON history FOR DELETE
    USING (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to reset daily credits automatically
CREATE OR REPLACE FUNCTION reset_daily_credits()
RETURNS void AS $$
BEGIN
    UPDATE profiles
    SET daily_generations_count = 0,
        last_reset_date = NOW(),
        updated_at = NOW()
    WHERE last_reset_date < DATE_TRUNC('day', NOW());
END;
$$ LANGUAGE plpgsql;

-- Create a cron job to reset credits daily (requires pg_cron extension)
-- If pg_cron is not available, use this alternative approach with a scheduled function
CREATE OR REPLACE FUNCTION check_and_reset_credits()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if it's a new day since last reset
    IF NEW.last_reset_date < DATE_TRUNC('day', NOW()) THEN
        NEW.daily_generations_count := 0;
        NEW.last_reset_date := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-reset credits when profile is updated
CREATE TRIGGER auto_reset_daily_credits
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION check_and_reset_credits();

-- Function to handle payment approval (admin only)
CREATE OR REPLACE FUNCTION approve_payment(payment_id UUID)
RETURNS void AS $$
BEGIN
    -- Update payment status
    UPDATE payment_requests
    SET status = 'approved',
        updated_at = NOW()
    WHERE id = payment_id;
    
    -- Update user subscription status
    UPDATE profiles
    SET subscription_status = 'pro',
        updated_at = NOW()
    WHERE user_id = (
        SELECT user_id FROM payment_requests WHERE id = payment_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create storage bucket for payment receipts
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-receipts', 'payment-receipts', true);

-- Storage policies for payment receipts
CREATE POLICY "Users can upload own receipts"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'payment-receipts' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Receipts are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'payment-receipts');

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_requests_updated_at
    BEFORE UPDATE ON payment_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;
