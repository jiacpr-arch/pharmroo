-- Leads, chatbot, redeem code system
-- Run after 001_create_tables.sql

-- ========================================
-- Blog posts: autopost state columns
-- ========================================
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS fb_post_id TEXT,
  ADD COLUMN IF NOT EXISTS fb_posted_at TEXT,
  ADD COLUMN IF NOT EXISTS fb_last_error TEXT,
  ADD COLUMN IF NOT EXISTS autopost_format TEXT CHECK (autopost_format IN ('cover_caption', 'quote_card', 'link_only')),
  ADD COLUMN IF NOT EXISTS cover_image_line TEXT,
  ADD COLUMN IF NOT EXISTS line_broadcast_at TEXT,
  ADD COLUMN IF NOT EXISTS line_last_error TEXT,
  ADD COLUMN IF NOT EXISTS ig_media_id TEXT,
  ADD COLUMN IF NOT EXISTS ig_posted_at TEXT,
  ADD COLUMN IF NOT EXISTS ig_last_error TEXT;

CREATE INDEX IF NOT EXISTS idx_blog_posts_fb_pending ON blog_posts (published_at DESC) WHERE fb_post_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_blog_posts_line_pending ON blog_posts (published_at DESC) WHERE line_broadcast_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_blog_posts_ig_pending ON blog_posts (published_at DESC) WHERE ig_media_id IS NULL;

-- ========================================
-- Leads
-- ========================================
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY DEFAULT generate_hex_id(),
  source TEXT NOT NULL,
  campaign TEXT,
  ad_set TEXT,
  fb_lead_id TEXT UNIQUE,
  fb_psid TEXT,
  line_user_id TEXT,
  email TEXT,
  phone TEXT,
  name TEXT,
  status_year TEXT,
  exam_target TEXT,
  reward_choice TEXT,
  stage TEXT NOT NULL DEFAULT 'new',
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  consent_pdpa BOOLEAN NOT NULL DEFAULT FALSE,
  consent_at TEXT,
  raw_payload JSONB,
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS')),
  updated_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS'))
);

CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads (stage);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads (source);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_fb_psid ON leads (fb_psid) WHERE fb_psid IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_line_user_id ON leads (line_user_id) WHERE line_user_id IS NOT NULL;

-- ========================================
-- Redeem Codes
-- ========================================
CREATE TABLE IF NOT EXISTS redeem_codes (
  code TEXT PRIMARY KEY,
  reward_type TEXT NOT NULL,
  source TEXT NOT NULL,
  campaign TEXT,
  lead_id TEXT REFERENCES leads(id) ON DELETE SET NULL,
  issued_to_email TEXT,
  redeemed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  redeemed_at TEXT,
  expires_at TEXT NOT NULL,
  stripe_coupon_id TEXT,
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS'))
);

CREATE INDEX IF NOT EXISTS idx_redeem_codes_lead_id ON redeem_codes (lead_id);
CREATE INDEX IF NOT EXISTS idx_redeem_codes_expires_at ON redeem_codes (expires_at);

-- ========================================
-- Chat Messages
-- ========================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY DEFAULT generate_hex_id(),
  channel TEXT NOT NULL,
  channel_user_id TEXT NOT NULL,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  lead_id TEXT REFERENCES leads(id) ON DELETE SET NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS'))
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_channel_user ON chat_messages (channel, channel_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_lead_id ON chat_messages (lead_id, created_at DESC);

-- ========================================
-- Lead Messages Sent (follow-up dedupe)
-- ========================================
CREATE TABLE IF NOT EXISTS lead_messages_sent (
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  channel TEXT NOT NULL,
  sent_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS')),
  PRIMARY KEY (lead_id, day, channel)
);

-- ========================================
-- Lead Chat State (Messenger PSID state)
-- ========================================
CREATE TABLE IF NOT EXISTS lead_chat_state (
  psid TEXT PRIMARY KEY,
  step TEXT NOT NULL,
  partial_data JSONB NOT NULL DEFAULT '{}',
  campaign TEXT,
  ad_set TEXT,
  updated_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS'))
);

-- ========================================
-- Bundle Credits
-- ========================================
CREATE TABLE IF NOT EXISTS bundle_credits (
  id TEXT PRIMARY KEY DEFAULT generate_hex_id(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL,
  source TEXT NOT NULL,
  reference TEXT,
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS'))
);

CREATE INDEX IF NOT EXISTS idx_bundle_credits_user_id ON bundle_credits (user_id);

-- ========================================
-- Trial Messages Sent (expiry reminder dedupe)
-- ========================================
CREATE TABLE IF NOT EXISTS trial_messages_sent (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  days_before_expiry INTEGER NOT NULL,
  channel TEXT NOT NULL,
  sent_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS')),
  PRIMARY KEY (user_id, days_before_expiry, channel)
);
