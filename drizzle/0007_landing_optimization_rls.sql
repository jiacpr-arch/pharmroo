-- Enable RLS on landing-optimization tables to match the project pattern.
-- These tables are accessed only via service-role Drizzle connection,
-- so we enable RLS with no policies — closes off PostgREST while leaving
-- the server's direct DB access untouched.

ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_metrics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_runs ENABLE ROW LEVEL SECURITY;
