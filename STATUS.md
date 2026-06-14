# Metis — STATUS (living dashboard)

> **Read this first, every session.** It is the single source of truth for
> *what's done*, *what's next*, and *who owns what*. Update it **before you push**.
>
> - Deep architecture + onboarding context → [`HANDOFF.md`](HANDOFF.md)
> - The non-negotiable rules → [`CLAUDE.md`](CLAUDE.md)
> - The 8-step build plan → [`PROMPTS.md`](PROMPTS.md)
> - History of changes → [`CHANGELOG.md`](CHANGELOG.md)
> - How we work together → [`CONTRIBUTING.md`](CONTRIBUTING.md)

**Last updated:** 2026-06-14 · **By:** MK_Sindhu

---

## TL;DR (30-second catch-up)

Files → Calendar → Email, three agents that *propose*, a human approves writes.
**UI is fully built with mock data. Backend is still empty stubs.** Next real
work is **Step 1** (contract types + mock LLM) — everything else depends on it.

This is an **MVP** — expect features and shapes to change. When something
changes, write *why* in [`CHANGELOG.md`](CHANGELOG.md) so the other person isn't
guessing.

---

## Build progress

Steps map to [`PROMPTS.md`](PROMPTS.md). Legend: ✅ done · 🚧 in progress · ⏭️ next · ⬜ not started

| Step | What | Crate / area | State | Owner |
|------|------|--------------|-------|-------|
| 0 | Tauri + Svelte scaffold, window opens | `src-tauri`, `ui` | ✅ | — |
| 7 | Full UI (mock data, Obsidian Silk theme) — built early | `ui` | ✅ | — |
| 1 | Contract types (`Tier`, `Agent` trait) + `MockBackend` | `metis-core`, `metis-llm` | ⏭️ | _unassigned_ |
| 2 | Append-only hash-chained event log | `metis-log` | ⬜ | _unassigned_ |
| 3 | Files agent (read-only — proves the contract) | `metis-agents` | ⬜ | _unassigned_ |
| 4 | Safety gate + confirm queue + **canary tests** | `metis-gate` | ⬜ | _unassigned_ |
| 5 | Calendar agent + Google OAuth (keychain) | `metis-agents` | ⬜ | _unassigned_ |
| 6 | Email agent (read + draft-reply, Tier-2) | `metis-agents` | ⬜ | _unassigned_ |
| 7b | Wire UI → backend (`invoke()`, drop `mock.ts`) | `ui`, `src-tauri` | ⬜ | _unassigned_ |

> **Why the UI is ahead of the backend:** owner wanted to see/drive the UI first,
> so Step 7 was pulled forward. `ui/src/lib/types.ts` already mirrors the intended
> Rust contract, so wiring later is mechanical.

---

## What's DONE ✅

- **Step 0 scaffold** — Cargo workspace, 5 crates compile (empty), `src-tauri`
  app opens a window, `ui/` Vite + Svelte 5 + Tailwind v3 wired.
- **Full UI with mock data** — all 7 surfaces (shell + Dashboard, Confirm Queue,
  Event Log, Calendar/Email/Files consoles, Settings), themed **Obsidian Silk**.
  `svelte-check` clean, `vite build` clean. Data comes from `ui/src/lib/mock.ts`
  — **no `invoke()` wiring yet.**

## In progress 🚧

- _Nothing claimed yet. Put your name + step here when you start so we don't
  both grab the same one._

## Next up ⏭️ (in dependency order)

1. **Step 1 — contract + mock brain.** Implement `Tier` + `may_auto_execute`,
   `Skill`/`Task`/`Observation`/`ProposedAction`/`Plan`, the async `Agent` trait
   (`metis-core`); `LlmBackend` + `Draft`/`DataBlock` + `MockBackend`
   (`metis-llm`). **Green when `cargo test` passes.** Unblocks everything.
2. **Step 2 — event log** (`metis-log`). Needs nothing but `metis-core`.
3. **Step 3 — Files agent** (`metis-agents`). Needs Steps 1 + 2.
4. **Step 4 — gate + confirm queue + canary suite** (`metis-gate`). The
   load-bearing tests. Needs Steps 1–3.
5. Steps 5, 6 (Calendar/Email + OAuth), then **7b** (wire UI to real commands).

> Steps 1 and 2 are independent of each other — two people can take them in
> parallel. Step 3 onward serializes on them.

## Blockers / open questions ❓

- _None right now. Add anything that's stopping you here, tag it with your name._
- Decide: who owns Step 1 vs Step 2 (parallelizable)?

---

## Snapshot of the repo right now

- **Branch:** `main` · **Remote:** `https://github.com/2505labs/metis.git`
- **Crates:** all 5 (`metis-core`, `metis-llm`, `metis-log`, `metis-gate`,
  `metis-agents`) are **empty stubs** (only doc comments, ~3–5 lines each).
- **UI:** complete, mock-driven. Swap point is `ui/src/lib/mock.ts`.

## Run / verify (quick reference)

```bash
cd "/Users/mk_sindhu/my_files/2505/files/metis"
source "$HOME/.cargo/env"      # if cargo isn't on PATH
pnpm install                   # first time only
pnpm dev                       # tauri dev: Vite :1420 + window

pnpm -C ui check               # svelte-check (fast)
pnpm -C ui exec vite build     # production UI build
cargo test                     # backend tests (the canary lives here from Step 4)
```

**Port 1420 stuck?** `pkill -f "target/debug/metis-app"; pkill -f "ui/.*vite"` then relaunch.

---

## How to keep this file honest

When you finish or change something:
1. Flip the step's state in the table and update its **Owner**.
2. Move items between **Done / In progress / Next up**.
3. Add a dated line to [`CHANGELOG.md`](CHANGELOG.md) — say *what* and *why*.
4. Bump **Last updated** + **By** at the top.
5. Commit these doc edits together with (or right after) your code.
