# Full System Blueprint — PharmRoo Online Exam Platform

> Adapted from morroo.com blueprint for pharmacy exam preparation.
> See original: https://github.com/jiacpr-arch/morroo/blob/main/docs/full-system-blueprint.md

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Database:** PostgreSQL (Drizzle ORM) + Supabase
- **Auth:** NextAuth v5 (Google OAuth + Credentials) + LINE Login (custom)
- **Payment:** Stripe Checkout + FlowAccount (ใบกำกับภาษี)
- **AI:** Claude API (Haiku/Sonnet/Opus)
- **Email:** Resend
- **Notifications:** LINE Messaging API
- **Hosting:** Vercel
- **CSS:** Tailwind CSS 4 + shadcn/ui

## Systems Overview

1. **Auth** — Google + Credentials + LINE Login + LINE OA Linking + Onboarding
2. **Payment** — 3-path defense-in-depth (Webhook + Success Verify + Daily Cron)
3. **Exam** — MCQ (daily auto-gen) + MEQ (2x/week) + Long Case (weekly + real-time AI)
4. **Referral** — Invite code → friend pays → +30 days membership
5. **Notifications** — LINE + Email for all key events
6. **Blog** — AI auto-generation 2x/week + Facebook auto-post
7. **Admin** — Users, Payments, Revenue dashboard, Question management
