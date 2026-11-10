# ASHA Saathi — submission draft (Code for a Billion 2026)

File the structured submission issue in
https://github.com/karlmehta/code-for-a-billion (button: "Open a new submission")
before **15 Nov 2026**. Copy the fields below into the form. Items marked
[TODO] must be filled after the AgentFoundry + deploy steps in DEPLOY.md.

---

## Team / project name and members

- **Project:** ASHA Saathi — offline-first field agent for frontline ASHA health workers
- **Team:** warvan (solo) — built with Muse (AI coding agent) inside AgentFoundry
- **Track:** 06 — Health

## Problem statement

India has over 1 million ASHA workers — one per ~1,000 people — who are the
first and often only health contact for rural families. They work on foot,
with paper registers, in areas with patchy connectivity. Every day they must
decide, in minutes, whether a pregnant woman or a newborn needs a facility
**today** — a decision where delay kills: India's Maternal Mortality Ratio is
still 97 per 100,000 live births (SRS 2018–20), ≈24,000 maternal deaths a
year, and the Neonatal Mortality Rate is ~20 per 1,000 live births. Most of
these deaths are preventable with earlier referral, yet the worker deciding
has no decision-support tool that works offline, in her language, in under a
minute.

Sources: Sample Registration System (RGI); NFHS-5 (2019–21); MoHFW / National
Health Mission; WHO IMNCI danger signs.

## What you built (and how you used AgentFoundry)

ASHA Saathi is a mobile-first web app that acts as the ASHA worker's daily
field agent:

1. **Today's plan** — every morning it ranks the day: overdue vaccines
   first, then due vaccines, pregnant women due for check-ups, open follow-ups.
2. **Guided danger-sign triage** — one-question-at-a-time interviews for
   pregnancy, newborn (0–28 days), child fever, and child diarrhoea, built on
   WHO IMNCI danger signs and the ASHA curriculum. Any red-flag YES →
   "REFER NOW" with the right facility and a ready referral slip.
3. **Immunisation due-list** — India's Universal Immunisation Programme
   schedule computed from each child's date of birth; due/overdue flags;
   one-tap "mark given".
4. **Household register + visit log** with outcomes (routine / follow-up /
   referred), referral slips copyable as WhatsApp-friendly text.
5. **Hindi + English UI**, fully offline (localStorage, no account, no data
   leaves the phone), one-click JSON export of usage stats.

Design choice: the agent is rule-based and on-device on purpose — no LLM
API, no signal needed, zero cost per use, fully auditable reasoning. It is
decision support for a trained worker, not a diagnosis.

**AgentFoundry usage:** [TODO — fill after the AF step] project created in
the AgentFoundry IDE; code developed with AgentFoundry Smart-Code
(1M free tokens); one-click deploy to Vercel from AF.

## GitHub repository URL

[TODO] `https://github.com/<warvan>/asha-saathi` (public, MIT)

## Demo URL

[TODO] Live app: `https://<app>.vercel.app` — and/or video (Loom/YouTube/Drive)
2–3 min walkthrough, script in `DEMO_SCRIPT.md`.

## Deployment / impact data (criterion 4 — 25%, tie-breaker)

Deployed on [TODO: date] to Vercel (free tier). Real usage since deployment:

- Households registered: [TODO]
- Visits logged (non-demo): [TODO]
- Triage interviews run: [TODO] — red flags found: [TODO]
- Referrals made: [TODO]
- Vaccines marked given: [TODO]
- Test users: [TODO — e.g. warvan + N friends/family who tried the flows]

Method: the app's dashboard counts real (non-demo) activity; demo data is
flagged `demo:true` and excluded from these numbers. Export the counts from
the app (Dashboard → "Export impact stats (JSON)") and attach the file to
this issue.

## Checklist

- [ ] Built using AgentFoundry (AF) — project exists in the AF IDE
- [ ] Public GitHub repo with clear README
- [ ] Working demo link (live app and/or video) judges can open
- [ ] Submission issue filed here before 15 Nov 2026
