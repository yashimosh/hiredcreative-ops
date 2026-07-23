# Mode: blast — On-Demand Pipeline Burst

## Purpose

Evaluate all pending pipeline URLs **right now** instead of waiting for the nightly cron. Use when you've just added a batch of URLs (LinkedIn scrape, Instagram saves, manual paste) and want them scored immediately.

This is the "I'm present and want a burst" complement to the unattended cron. Cron is the daily heartbeat; blast is the manual trigger.

## When to use

- You just ran a LinkedIn/Instagram scrape and there are fresh URLs in `data/pipeline.md`
- You don't want to wait for tonight's scheduled eval run
- You added URLs manually and want reports + apply-list now

## How it works

The blast triggers the **same evaluate phase the scheduled automation runs**, but on-demand. Two execution paths:

### Path A — Trigger your own headless runner (preferred, if you have one set up)

If you run the `auto-loop` mode unattended on a server/VPS you control (cron, systemd
timer, etc.), trigger that runner remotely (e.g. via SSH into your own host) instead of
duplicating the eval logic here. Keep the actual host, key path, and remote command in
your own notes/secrets — never hardcode them into a system-layer mode file. Then pull
the results into your local clone (`git pull`).

### Path B — Workflow fan-out (in-session, no server required)

If the user is in an interactive session and wants to watch the burst, run a Claude Workflow that fans out one agent per pending URL. This requires the `Workflow` tool (multi-agent orchestration) and only runs while the session is alive.

Each agent: fetch JD → A-G eval → write report → write TSV. Then `merge-tracker.mjs`.

Use Path A if you have unattended automation set up (it survives session end). Otherwise use Path B.

## Workflow

1. Count pending URLs: `grep -c "^- \[ \]" data/pipeline.md`
2. If 0 → "Pipeline is empty. Nothing to blast. Run a scan first (`/hiredcreative-ops scan` or LinkedIn harvest)."
3. If >0 → confirm count with user, then trigger Path A
4. Stream progress, report how many succeeded/failed
5. After eval → run `node merge-tracker.mjs`, then surface the new apply-list (score ≥3.5, status Evaluated)
6. End with: "Apply-list updated. Want to start applying to {top role}?"

## Notes

- Blast does NOT bypass the verification gate — batch-mode reports are marked `Verification: unconfirmed`. Confirm liveness before generating final apply materials.
- Blast respects the ethical rule: it evaluates and prepares, never submits.
- For very large bursts (50+ URLs), prefer letting the cron handle it overnight — blast is for "I want these 5-15 scored now."
