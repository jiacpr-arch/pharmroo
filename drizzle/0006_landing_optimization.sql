-- Migration: Landing-page auto-optimization tables
-- Tracks ads -> landing pages -> metrics -> Claude proposals -> A/B variants

CREATE TABLE IF NOT EXISTS landing_pages (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  path text NOT NULL UNIQUE,
  name text NOT NULL,
  conversion_event text NOT NULL DEFAULT 'signup',
  ctr_threshold real NOT NULL DEFAULT 0.01,
  cpa_threshold_thb real NOT NULL DEFAULT 150,
  roas_threshold real NOT NULL DEFAULT 1.0,
  auto_optimize boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  created_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

CREATE TABLE IF NOT EXISTS ad_campaigns (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  platform text NOT NULL CHECK (platform IN ('meta', 'google', 'tiktok', 'ga4')),
  external_id text NOT NULL,
  name text NOT NULL,
  landing_page_id text REFERENCES landing_pages(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  last_synced_at text,
  created_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

CREATE UNIQUE INDEX IF NOT EXISTS ad_campaigns_platform_external_idx
  ON ad_campaigns (platform, external_id);

CREATE TABLE IF NOT EXISTS ad_metrics_daily (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  campaign_id text NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  date text NOT NULL,
  impressions integer NOT NULL DEFAULT 0,
  clicks integer NOT NULL DEFAULT 0,
  ctr real NOT NULL DEFAULT 0,
  spend_thb real NOT NULL DEFAULT 0,
  conversions integer NOT NULL DEFAULT 0,
  cpa_thb real,
  roas real,
  raw jsonb,
  ingested_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

CREATE UNIQUE INDEX IF NOT EXISTS ad_metrics_campaign_date_idx
  ON ad_metrics_daily (campaign_id, date);

CREATE TABLE IF NOT EXISTS page_variants (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  landing_page_id text NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
  name text NOT NULL,
  patch jsonb NOT NULL DEFAULT '{}'::jsonb,
  traffic_pct integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT false,
  is_baseline boolean NOT NULL DEFAULT false,
  created_by text NOT NULL DEFAULT 'claude' CHECK (created_by IN ('claude', 'human')),
  metrics_summary jsonb,
  created_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

CREATE TABLE IF NOT EXISTS optimization_runs (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  landing_page_id text NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
  trigger text NOT NULL DEFAULT 'scheduled' CHECK (trigger IN ('scheduled', 'manual', 'alert')),
  reason jsonb NOT NULL DEFAULT '{}'::jsonb,
  proposal jsonb,
  applied_variant_id text REFERENCES page_variants(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'proposed', 'applied', 'rejected', 'rolled_back', 'failed'
  )),
  error text,
  created_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS'),
  completed_at text
);

CREATE INDEX IF NOT EXISTS optimization_runs_landing_idx
  ON optimization_runs (landing_page_id, created_at DESC);
