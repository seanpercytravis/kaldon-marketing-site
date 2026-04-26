# Resume Prompt — Kaldon Marketing Site

Paste this into a fresh Claude Code session opened in `/Users/seantravis/kaldon-marketing-site`.

---

```
We're picking up the Kaldon marketing site work from session 2026-04-26.

Full session state is in memory at session_state_2026_04_26.md. Read it
first so you know what shipped, what's deployed, what's pending, and the
open decision points.

Production state at handoff: https://kaldon.io is live on Cloudflare
Workers version 9b795116. 9 commits shipped this morning closing the P0
elite skill architecture work and 4 of 5 trust-breakers from the UX audit.
PostHog is wired and live (key phc_xEPPTGE...). Auto-blog cron is
unblocked and should fire next Monday. Wife's alternative marketing angle
was analyzed; recommendation is hybrid not replacement.

Skills protocol: this repo has full structural enforcement now —
CLAUDE.md, .claude/settings.json hook, .claude/skill-router-reminder.md,
and memory feedback files. Every prompt should route through the skill
router. Drift is failure.

Three actions ready to ship next, all small (<30 min each):

1. Add the wife's "Other tools show you what's selling. Kaldon shows
   you what to build next." line to the homepage. Either replace the
   IntelligenceDepth section headline ("Find gaps nobody else sees.")
   with this line, OR add it as a kicker quote above ProblemSection.
   This was approved in
   docs/audit/2026-04-25-positioning-comparison-wife-angle.md as a
   high-leverage take from the wife's angle.

2. Set up the CTA A/B test as a PostHog feature flag. Variants:
   control = "Start Free, 2 Analyses Included" (current),
   treatment = "Find My Winning Product — Free" (wife's angle).
   Apply to Hero + FinalCTA. Run 2 weeks 50/50, ship the winner.
   Expected lift 15-30% on cold traffic.

3. Verify auto-blog fires Monday 2026-04-29 16:00 UTC. Either
   /schedule a routine, or just check gh run list manually after the
   scheduled time.

Open questions Sean has not answered yet:
- AI rendering showcase needs real Kaldon-generated rendering image
  assets, or confirmation we ship with placeholders labeled "concept"
- Should /get-started beginner landing page be built now or wait for
  paid acquisition launch
- Should the CTA A/B test auto-execute or wait for confirmation

Pick a starting move and let's go.
```

---

## Alternative shorter prompt (if you just want to dive in)

```
Resume Kaldon marketing site from session 2026-04-26. Read
session_state_2026_04_26.md from memory first. What's the next move?
```

---

## What auto-loads (you don't need to mention these)

When the new session starts in this repo:
- `CLAUDE.md` is automatically read (full skill routing protocol + V3 brand iron rules)
- `MEMORY.md` is automatically loaded (pointers to all memory files including session state)
- The UserPromptSubmit hook (`.claude/settings.json`) injects `.claude/skill-router-reminder.md` (~500 tokens) before every prompt

So the new Claude knows: V3 brand rules, skill triggers per file/topic, composite kickoffs, do-not list, deploy workflow, all without you saying a word.
