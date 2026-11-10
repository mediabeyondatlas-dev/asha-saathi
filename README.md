# ASHA Saathi 🇮🇳

**Offline-first field agent for India's frontline ASHA health workers.**
Track 06 — Health · Code for a Billion 2026 (Code for India) · Built in AgentFoundry

> Every day, over 1 million ASHA workers walk village to village with a paper
> register and a pen. They are the first — often the only — health contact for
> hundreds of millions of Indians. ASHA Saathi turns their phone into a field
> agent: it plans the day, interviews patients for danger signs, tracks
> immunisations, and writes the referral slip. Fully offline. No account.
> No data leaves the phone.

## The problem (sourced)

- **~1 million ASHA workers** (one per ~1,000 people) deliver maternal and
  child health in rural India — the backbone of community health (MoHFW / NHM).
- **Maternal Mortality Ratio: 97 per 100,000 live births** (SRS 2018–20), down
  from 556 in 1990 — still ≈24,000 maternal deaths a year at ~25 million
  annual births. Most are preventable with earlier referral.
- **Neonatal Mortality Rate: ~20 per 1,000 live births** (SRS); Infant
  Mortality Rate ~27–28 per 1,000 (NFHS-5 / SRS).
- Institutional births rose from 78.9% (NFHS-4) to 88.6% (NFHS-5) — but the
  last mile is still a worker on foot, deciding in minutes whether a mother
  or newborn needs a facility **today**.
- ASHA workers are predominantly rural women (25–45, up to Class 10
  schooling) working with patchy connectivity and paper registers. A tool
  for them must work offline, in their language, and in under a minute.

## What it does

1. **Today's plan (the agent)** — each morning it ranks the day: overdue
   vaccines first, then due vaccines, pregnant women due for check-ups, and
   open follow-ups.
2. **Guided danger-sign triage** — a one-question-at-a-time interview for
   pregnancy, newborn (0–28 days), child fever, and child diarrhoea.
   Checklists follow WHO IMNCI danger signs and the ASHA training
   curriculum. Any YES to a red flag → **REFER NOW**, with the right
   facility and a ready referral slip.
3. **Immunisation due-list** — India's Universal Immunisation Programme
   schedule computed from each child's date of birth; due / overdue flags;
   one-tap "mark given".
4. **Referral slips** — copyable as text (WhatsApp-friendly) or printable.
5. **Household register + visit log** — every visit recorded with outcome
   (routine / follow-up / referred); all data stays on the device.
6. **Hindi + English UI** — one-tap language toggle.
7. **Impact stats export** — one-click JSON export of real usage counts
   (visits, red flags, referrals, vaccines due) for the submission.

## Why on-device, no LLM

ASHA areas have poor connectivity and the worker's phone is often low-end.
A rule-based agent that runs entirely on the phone is the right design
here: it never fails for lack of signal, costs nothing per use, and its
reasoning is fully auditable (every question and red flag is visible).
This is decision **support** for a trained worker — not a diagnosis and
not a medical device. When in doubt, it says: refer.

## Tech

- Vite + React 19 + TypeScript, plain CSS — zero backend, zero API keys.
- Persistence: `localStorage`. Works fully offline; installable as a
  home-screen app.
- Deploy: any static host. Free: Vercel (see `DEPLOY.md`).

## Run it

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # production build in dist/
npm run preview # serve the production build
```

Demo data: the app ships with a clearly-labelled sample village
("Rampur") so judges can try every flow instantly. Use **Clear demo data**
to start fresh — real field data is never mixed with demo data.

## Project status

- Built 10 Nov 2026 (4 days before the 15 Nov deadline) by Muse, an AI
  agent, working from the spec in this repo.
- **AgentFoundry step (owner: warvan):** the project must exist inside the
  AgentFoundry IDE for eligibility ("Built using AgentFoundry (AF)").
  Create the project in AF on your PC, copy this code into it, and push to
  a public GitHub repo. See `DEPLOY.md`.
- **Submission:** file the structured issue in
  [karlmehta/code-for-a-billion](https://github.com/karlmehta/code-for-a-billion)
  before 15 Nov 2026 — draft text in `SUBMISSION.md`.
- **Demo video:** 2–3 min script in `DEMO_SCRIPT.md` (recorded by warvan).

## Sources (problem statement)

- Sample Registration System (RGI): MMR 97 per 100,000 live births
  (2018–20); NMR ~20 per 1,000; IMR ~27–28.
- NFHS-5 (2019–21): institutional births 88.6%; IMR 27 per 1,000.
- MoHFW / National Health Mission: 10 lakh+ ASHA workers, 1 per ~1,000
  population.
- WHO IMNCI danger signs; ASHA training curriculum (MoHFW).
- Universal Immunisation Programme schedule (MoHFW).

> **Note on sources:** the submission repo's README still lists older
> tracks and dollar prizes ($10,000 / $5,000 / $2,500, dates TBD). The
> current authority is the official page
> [codeforindia.org/hackathon](https://codeforindia.org/hackathon): 10
> impact areas, ₹18 lakh total (₹1,50,000 / ₹1,00,000 / ₹50,000 per
> track), submissions close 15 Nov 2026, winners 5 Dec 2026.

## License

MIT — see `LICENSE`. Released open-source for Code for India; any NGO or
government body may adopt it.
