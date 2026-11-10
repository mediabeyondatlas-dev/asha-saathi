# Deploy — ASHA Saathi (free tier only)

## 0. The AgentFoundry step (warvan, from your PC — required for eligibility)

Eligibility requires the project to be **built using AgentFoundry (AF)**,
the official IDE. AgentFoundry is a **desktop** app (macOS / Windows /
Linux) — download it at https://agentfoundry.me and sign in (Google/GitHub
or email). Then:

1. In AF, create a new project named `asha-saathi`.
2. Copy this whole folder into the AF project directory (AF auto-detects
   your existing git setup and remotes on first launch).
3. That AF project is the hackathon entry — the code lives there from now on.

AF also offers **one-click deploy to Vercel** (listed on agentfoundry.me).
If that works from the IDE, use it and skip step 1 below.

## 1. Push to GitHub (public repo)

```bash
cd asha-saathi
git init
git add .
git commit -m "ASHA Saathi — Code for a Billion 2026 (Health)"
git branch -M main
git remote add origin https://github.com/mediabeyondatlas-dev/asha-saathi.git
git push -u origin main
```

Repo must be **public**, MIT licence (already included), with this README.

## 2. Deploy free on Vercel

Option A — from the Vercel dashboard (no CLI): vercel.com → Add New →
Project → Import the `asha-saathi` GitHub repo → Framework: Vite →
Deploy. Free tier, no card.

Option B — from terminal (needs a Vercel login, warvan's account):

```bash
npx vercel --prod
```

The build command is `npm run build`, output directory `dist/`
(already configured by the Vite defaults; `vercel.json` is not needed).

## 3. Alternatives (if Vercel is blocked)

- **Netlify Drop:** drag the `dist/` folder onto https://app.netlify.com/drop — instant static URL, no account needed for a quick link (claim it later).
- **GitHub Pages:** push `dist/` to a `gh-pages` branch, or use a Pages
  action. Free for public repos.

## 4. After deploy

1. Open the live URL on your phone; check Dashboard, Triage, Vaccines.
2. **Clear demo data** (Dashboard banner) so real usage counts are clean.
3. Use it for real: log a few visits, run a triage, mark a vaccine given.
4. Export stats (Dashboard → "Export impact stats (JSON)") — attach to the
   submission issue as deployment evidence.
5. Record the demo video (script in `DEMO_SCRIPT.md`), 2–3 min.
6. File the submission issue in
   https://github.com/karlmehta/code-for-a-billion (draft in `SUBMISSION.md`)
   before **15 Nov 2026**.
