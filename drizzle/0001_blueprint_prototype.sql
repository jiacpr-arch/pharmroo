-- Migration: Blueprint Prototype
-- Adds new tables and columns for the full system blueprint
-- Run this AFTER the existing schema is in place

-- ========================================
-- 1. Extend users table with new fields
-- ========================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_done boolean NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_goal integer NOT NULL DEFAULT 20;
ALTER TABLE users ADD COLUMN IF NOT EXISTS target_exam text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS weak_subjects jsonb DEFAULT '[]'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS line_user_id text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS line_linked_at text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by text;

-- ========================================
-- 2. Extend payment_orders table
-- ========================================
ALTER TABLE payment_orders ADD COLUMN IF NOT EXISTS stripe_session_id text;
ALTER TABLE payment_orders ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'stripe';

-- ========================================
-- 3. Referrals table
-- ========================================
CREATE TABLE IF NOT EXISTS referrals (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  referrer_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id text REFERENCES users(id) ON DELETE SET NULL,
  code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'rewarded')),
  reward_days integer NOT NULL DEFAULT 30,
  rewarded_at text,
  created_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

-- ========================================
-- 4. LINE Link Codes table
-- ========================================
CREATE TABLE IF NOT EXISTS line_link_codes (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  expires_at text NOT NULL,
  created_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

-- ========================================
-- 5. Blog Posts table
-- ========================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  category text,
  reading_time integer NOT NULL DEFAULT 3,
  content text NOT NULL,
  cover_image text,
  published_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

-- ========================================
-- 6. App Settings table (key-value store)
-- ========================================
CREATE TABLE IF NOT EXISTS app_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

-- ========================================
-- Indexes
-- ========================================
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(code);
CREATE INDEX IF NOT EXISTS idx_line_link_codes_code ON line_link_codes(code);
CREATE INDEX IF NOT EXISTS idx_line_link_codes_user ON line_link_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_line_user_id ON users(line_user_id);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_payment_orders_stripe_session ON payment_orders(stripe_session_id);
