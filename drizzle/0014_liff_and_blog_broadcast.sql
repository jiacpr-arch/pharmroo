-- Migration: LIFF (no schema change — reuses users.line_user_id) + blog LINE broadcast tracking (Phase 4)

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS line_broadcast_at text;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS line_last_error text;
