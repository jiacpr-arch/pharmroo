-- Seed landing pages for ad auto-optimize. Idempotent.
--
-- auto_optimize=true allows Claude to deploy variant copy automatically
-- after thresholds are breached. /pricing is left manual-only since
-- pricing copy changes warrant human review.

INSERT INTO landing_pages (path, name, conversion_event, ctr_threshold, cpa_threshold_thb, auto_optimize)
VALUES
  ('/',                 'Home — pharmacy + nursing', 'signup',   0.010, 150, true),
  ('/nursing',          'Nursing NLE entry',         'signup',   0.012, 150, true),
  ('/ple',              'PLE pharmacy entry',        'signup',   0.012, 150, true),
  ('/ple/practice',     'PLE practice — pharmacy',   'signup',   0.015, 120, true),
  ('/nursing/practice', 'NLE practice — nursing',    'signup',   0.015, 120, true),
  ('/pricing',          'Pricing',                   'purchase', 0.020, 300, false)
ON CONFLICT (path) DO NOTHING;
