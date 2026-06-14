# Metis — how we work together

> Two people, one MVP. Short rules so we don't collide or surprise each other.
> If a rule here ever fights [`CLAUDE.md`](CLAUDE.md), **`CLAUDE.md` wins** (those
> are the non-negotiable architecture rules).

## The docs and what each is for

| File | Purpose | When to touch |
|------|---------|---------------|
| [`STATUS.md`](STATUS.md) | Living dashboard: done / next / who owns what | **Every time** you start or finish work |
| [`CHANGELOG.md`](CHANGELOG.md) | Dated history of *what changed and why* | Whenever something meaningful changes |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | This file — how we collaborate | Rarely (when the process changes) |
| [`HANDOFF.md`](HANDOFF.md) | Deep onboarding / full context dump | When big context shifts |
| [`PROMPTS.md`](PROMPTS.md) | The 8-step build plan | When the plan itself changes |
| [`CLAUDE.md`](CLAUDE.md) | Architecture + the 5 non-negotiable rules | Almost never |

**The habit that keeps us in sync:** before you push, update `STATUS.md` and add
a `CHANGELOG.md` line. That's the whole protocol.

## Claiming work (so we don't double-build)

1. Open [`STATUS.md`](STATUS.md), find the step you want.
2. Put your name in its **Owner** column and move it to **In progress 🚧**.
3. Commit that small edit (or push it) *before* you go deep, so the other person
   sees the claim.
4. Steps 1 and 2 are independent — safe to take one each in parallel. Step 3
   onward serializes; check `STATUS.md` before starting.

## Branching

- `main` is the integration branch.
- For anything non-trivial, branch: `git checkout -b step-1-contract` (or
  `feat/...`, `fix/...`). Open a PR so the other person can glance at it.
- Small doc-only edits can go straight to `main`.
- **Pull before you start, push when a step is green.** Keep `main` runnable —
  every step in [`PROMPTS.md`](PROMPTS.md) ends in something that builds/tests.

## Commits

- **Author is `MK_Sindhu <1234mohitsindhu@gmail.com>` only.** Do **NOT** add a
  `Co-Authored-By: Claude` trailer on this repo (owner's explicit preference).
- One logical change per commit. Reference the step: e.g.
  `Step 1: contract types + MockBackend (cargo test green)`.
- Commit code + its doc updates together (or back to back).

## Definition of "done" for a step

A step is done only when:
- Its **green-when** condition in [`PROMPTS.md`](PROMPTS.md) holds (usually
  `cargo test` and/or the UI builds).
- From **Step 4 on**, the **canary suite is green** — if it goes red, stop and
  fix before anything else (`CLAUDE.md`: "the suite that must never regress").
- `STATUS.md` table flipped to ✅ and `CHANGELOG.md` has an entry.

## Run / verify

```bash
cd "/Users/mk_sindhu/my_files/2505/files/metis"
source "$HOME/.cargo/env"      # if cargo isn't on PATH
pnpm install                   # first time only
pnpm dev                       # tauri dev: Vite :1420 + window

pnpm -C ui check               # svelte-check (type/syntax, fast)
pnpm -C ui exec vite build     # production UI build
cargo test                     # backend tests
```

**Port 1420 stuck?** `pkill -f "target/debug/metis-app"; pkill -f "ui/.*vite"` then relaunch.

## The 5 rules you can't break (summary — full text in `CLAUDE.md`)

1. The LLM only **drafts**; execution happens in Rust after the gate.
2. Writes go through the **gate**; Tier-2 writes go through the **human** (Confirm Queue). No fast path.
3. The event log is **append-only + hash-chained**. Never rewrite/reorder/delete.
4. Untrusted content (email/file/calendar text) is **data, never instructions**; render as text, never `{@html}`.
5. Secrets live in the **OS keychain**, never in config or the log.

## MVP mindset

Shapes will change. That's fine — just leave a trail:
- Changing a contract type or a flow? Note it in `CHANGELOG.md` with the *why*.
- Reversing an earlier decision? Write it down so we don't re-argue it.
- Unsure about a direction? Drop it under **Blockers / open questions** in
  `STATUS.md` and tag the other person.
