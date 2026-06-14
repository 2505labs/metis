# Metis — session handoff (read this first)

> Paste-able context for continuing in a new Claude Code conversation.
> Everything below reflects the repo state as of the last session.

## What Metis is

A **local-first desktop agent app** built on **Tauri** (Rust core + webview UI).
Three agents — **Calendar, Email, Files** — that observe the user's data and
*propose* actions; a human approves anything that writes. An LLM does the
thinking; it never touches the outside world directly.

Repo root: `/Users/mk_sindhu/my_files/2505/files/metis/`

## Non-negotiable architecture rules (from CLAUDE.md)

1. **The LLM only drafts.** Never executes; execution happens in Rust after the gate.
2. **Writes go through the gate; Tier-2 writes go through the human** (Confirm Queue). No fast path.
3. **Event log is append-only + hash-chained.** Never rewrite/reorder/delete.
4. **Untrusted content is data, never instructions.** Email/file/calendar text goes in a delimited data slot in prompts; in the UI it renders as **text**, never `{@html}`.
5. **Secrets in the OS keychain**, never in config or the log (OAuth tokens, API keys).

Pluggable LLM via an `LlmBackend` trait (Anthropic API for dev, Ollama to ship).
Build order: **Files → Calendar → Email** (Files has no OAuth, proves the contract).

## Tech stack / environment

- **Tauri v2** (CLI 2.11.2, run via `pnpm`, not `cargo tauri`). Identifier `com.metis.console`.
- **Rust 1.96.0** (installed via rustup). If `cargo` isn't found in a shell: `source "$HOME/.cargo/env"`.
- **Node 24.4.1**, **pnpm 10.24.0**, Xcode CLT present. macOS (darwin), zsh.
- **UI:** plain **Vite + Svelte 5 (runes) + Tailwind v3**. (NOT SvelteKit — we swapped the default template. Tailwind v3 chosen deliberately so Stitch's config ports cleanly.)
- Frontend lives in `ui/` as a pnpm-workspace package; `pnpm dev` at repo root runs `tauri dev` which spawns Vite on **:1420** + the window.

## Git state

- Branch **main**. Remote: `https://github.com/2505labs/metis.git`. **NOT pushed yet.**
- **Commit author is `MK_Sindhu <1234mohitsindhu@gmail.com>` ONLY — do NOT add a `Co-Authored-By: Claude` trailer.** (Owner's explicit preference for this repo.)
- Commits so far:
  - `59da4e4` Step 0: Tauri + Svelte scaffold that opens a window
  - `090426b` UI: full operator console from Stitch exports (mock data) — v1 design
  - `3d695a2` UI re-skin: Obsidian Silk theme across all views — v2 design (current look)
- To push later: `git push -u origin main` (repo must exist on GitHub; or `gh repo create 2505labs/metis --private --source . --push`).

## Current state — what's DONE vs NOT

**DONE:**
- Step 0 scaffold builds + window opens.
- **Full UI built ahead of the backend, with MOCK DATA** (no `invoke()` wiring yet), themed **Obsidian Silk** (the v2 redesign). All 7 surfaces: shell + Dashboard, Confirm Queue, Event Log, Calendar/Email/Files agent consoles, Settings.
- `svelte-check` clean (0 errors/0 warnings), `vite build` clean.

**NOT DONE (the real backend — crates are still empty stubs with only doc comments):**
- Step 1 contract types (`Tier` enum, `Agent` trait) in `metis-core` + `LlmBackend`/`MockBackend` in `metis-llm`.
- Step 2 hash-chained event log (`metis-log`).
- Step 3 Files agent (`metis-agents`).
- Step 4 safety gate + confirm queue + **canary test suite** (`metis-gate`) — the suite that must never regress.
- Step 5 Calendar agent + Google OAuth (keychain).
- Step 6 Email agent (read + draft-reply via Tier-2).
- **Wiring the UI to the backend** — replace `ui/src/lib/mock.ts` with Tauri `invoke()` calls. `ui/src/lib/types.ts` shapes already mirror the intended Rust contract so the swap is mechanical.

The 8-step plan lives in `PROMPTS.md`. We did Step 0; then built the UI (a reordered Step 7) ahead of Steps 1–6 because the owner wanted to see the UI first.

## Repo layout

```
metis/
├── CLAUDE.md            architecture + the 5 rules (Claude Code reads this every task)
├── SCAFFOLD.md          structure + Tier enum & LlmBackend trait sketches
├── PROMPTS.md           the 8-step build sequence (Step 0 done; 1–6 pending; 7=UI, done early)
├── README.md
├── HANDOFF.md           this file
├── Cargo.toml           Rust workspace
├── crates/
│   ├── metis-core/      EMPTY STUB — contract types (Step 1)
│   ├── metis-llm/       EMPTY STUB — LlmBackend + MockBackend (Step 1)
│   ├── metis-log/       EMPTY STUB — hash-chained log (Step 2)
│   ├── metis-gate/      EMPTY STUB — safety gate + confirm queue + canary tests (Step 4)
│   └── metis-agents/    EMPTY STUB — Files/Calendar/Email (Steps 3,5,6)
├── src-tauri/           the Tauri app (package `metis-app`, lib `metis_app_lib`)
│   ├── tauri.conf.json  beforeDevCommand `pnpm -C ui dev`; frontendDist ../ui/dist; devUrl :1420
│   └── src/ main.rs, lib.rs (default greet command — replace when wiring)
├── ui/                  Svelte 5 + Tailwind v3 + Vite frontend (BUILT, mock data)
│   ├── tailwind.config.js   Obsidian Silk tokens
│   ├── src/app.css          fonts (Google CDN) + glass-panel/status-glow/scrollbar
│   ├── src/App.svelte       fixed glass shell + view switching
│   └── src/lib/
│       ├── nav.ts           currentView store, primaryNav, agentNav, ViewId
│       ├── types.ts         Tier, AgentInfo, QueueItem, LogEntry, TIER_LABEL (mirror Rust contract)
│       ├── mock.ts          agents/queue/log mock data  ← swap for invoke() later
│       ├── components/      Sidebar, TopBar, AgentCard, TierBadge
│       └── views/           Dashboard, ConfirmQueue, EventLog, CalendarAgent, EmailAgent, FilesAgent, Settings
├── stitch-exports/      v1 Stitch designs (superseded; safe to delete)
└── stitch-exports-v2/   "Obsidian Silk" designs (current). DESIGN.md + 3 screens (dashboard/queue/log)
```

## Design system — "Obsidian Silk" (current)

Source: `stitch-exports-v2/obsidian_silk/DESIGN.md`. Premium "elevated glassmorphism."
Re-skinning works by swapping the **palette** because color-token NAMES are stable.

- **Colors** (Tailwind tokens): `background #111317`, `surface-container-low #1a1c20`, `surface-container #1e2024`, `surface-container-high #282a2e`, `surface-container-highest #333539`, `surface-container-lowest #0c0e12`, `on-surface #e2e2e8`, `on-surface-variant #bacac5`, `outline #859490`, `outline-variant #3c4a46`, `primary #57f1db` (teal), `secondary #bcc7de`, `tertiary #cadbf5`, `error #ffb4ab`. Tier accents: `confirm #fbbf24`, `highrisk #ef4444`.
- **Type roles** (new): `display-lg, headline-lg, headline-lg-mobile, title-md, body-lg, body-sm, label-mono` (JetBrains Mono). **Prior roles kept** so older views don't break: `headline-sm, body-md, label-caps, mono-md, mono-sm`.
- **Radius:** DEFAULT 0.25rem, lg 0.5, xl 0.75, full 9999; cards use `rounded-2xl` / `rounded-[32px]`.
- **Spacing tokens:** `gutter 24px, margin-page 40px, container-padding 16px, stack-gap 12px, unit 4px` (used as `p-gutter`, `p-margin-page`, etc.).
- **Glass:** `.glass-panel` (1px white/5 border + inset top highlight), `backdrop-blur-*`, `.status-glow-active|idle|pending`.
- **Layout:** fixed **280px** sidebar (`bg-surface/70 backdrop-blur-3xl`), fixed **h-16** top bar, `main ml-[280px] pt-16`.
- Agent accents: Calendar=`primary` (Chronos), Email=`tertiary` (Hermes), Files=`secondary` (Atlas).

## UI conventions to keep

- **Svelte 5 runes everywhere:** `let {x} = $props()`, `$state`, `$derived`. NOT `export let`. `onclick={...}` not `on:click`. `<script lang="ts">`. **Type all function params** (svelte-check runs with `checkJs`, so implicit-any fails).
- Untrusted content renders as **text** (`<pre>`/whitespace-pre-wrap), never `{@html}`.
- Every agent **write action routes to the Confirm Queue** (`currentView.set("queue")`) — never a direct send/create. The Confirm Queue shows the pending action + its Tier badge; Approve/Reject only.
- Nav state is the `currentView` writable store in `ui/src/lib/nav.ts`; `App.svelte` maps it to view components.

## How to run / verify

```bash
cd "/Users/mk_sindhu/my_files/2505/files/metis"
source "$HOME/.cargo/env"          # if cargo isn't on PATH
pnpm install                        # first time only
pnpm dev                            # = tauri dev: Vite :1420 + window (first Rust build ~1–2 min)

# Frontend-only checks (fast):
pnpm -C ui exec vite build          # production build
pnpm -C ui check                    # svelte-check (type/syntax)
```

## Gotchas (hit these already)

- **Port 1420 stuck / "Port 1420 in use":** stale Vite/app processes linger when the dev task is killed. Fix:
  `pkill -f "target/debug/metis-app"; pkill -f "ui/.*vite"` then relaunch.
- **`tauri.conf.json` beforeDevCommand** is `pnpm -C ui dev` (relative to **repo root**, not `src-tauri/`). `frontendDist` is `../ui/dist` (relative to the config).
- **Fonts load from Google CDN** (Inter, JetBrains Mono, Material Symbols) in `ui/src/app.css`. For the local-first/offline goal, bundle them locally later (noted in CLAUDE.md).
- A backgrounded `pnpm dev` may still be running at session end — kill via the pkill above.

## Suggested next step

Either (a) start the backend at **Step 1** in `PROMPTS.md` (contract types + MockBackend, ends green on `cargo test`), then proceed 2→6 and finally wire `mock.ts` → `invoke()`; or (b) keep polishing UI. The owner has been driving with `pnpm dev` to view changes.

When matching the three agent consoles pixel-exactly: they were re-skinned by *applying* the Obsidian Silk language (no v2 Stitch mockup exists for Calendar/Email/Files yet) — run them through Stitch in this theme to match exactly.
