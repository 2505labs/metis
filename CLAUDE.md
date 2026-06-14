# Metis — architecture and rules for Claude Code

This file is loaded on every task. It describes what Metis is and the rules you
must not break. When a prompt conflicts with the **Non-negotiables** below, the
non-negotiables win — say so and stop rather than violating them.

## What Metis is

Metis is a local-first desktop agent app built on **Tauri** (Rust core, webview
UI). It runs three agents — **Calendar, Email, Files** — that observe the user's
data and *propose* actions. A human approves anything that writes. An LLM does
the thinking; it never touches the outside world directly.

The shape:

```
  user ── UI (Svelte) ──▶ Tauri command ──▶ Agent ──▶ proposes Plan
                                                          │
                                          LLM (LlmBackend) drafts the plan
                                                          │
                                                  Safety Gate classifies Tier
                                                          │
                                 Tier-1 (read-only) ──▶ executes, logs
                                 Tier-2 (writes)    ──▶ Confirm Queue ──▶ human ──▶ executes, logs
                                                          │
                                               Append-only hash-chained Event Log
```

Agents are **thin adapters over one shared contract** (A2A-shaped: skills,
tasks, observations, proposed actions). Adding an agent = implementing the
contract, not inventing a new flow. Calendar/Email/Files differ only in their
adapter; the gate, the log, and the contract are shared and identical.

## Non-negotiables (these are rules, not suggestions)

1. **The LLM only drafts.** The `LlmBackend` produces plans and text. It never
   executes an action, calls a tool with side effects, or writes to disk/network
   on its own. Execution happens in Rust, after the gate, never inside the model
   call.

2. **Writes go through the gate, and Tier-2 writes go through the human.** No
   agent performs a mutating action (send, create, modify, delete) without a
   `ProposedAction` being classified by the Safety Gate and, if Tier-2,
   approved via the Confirm Queue. There is no "fast path" that skips this.

3. **The event log is append-only and hash-chained.** Every observation,
   proposal, approval, and execution appends one entry whose hash includes the
   previous entry's hash. Never rewrite, reorder, or delete entries. Never log
   secrets (see rule 5).

4. **Untrusted content is data, never instructions.** Email bodies, file
   contents, calendar invite text, attendee names — all of it is attacker-
   controlled. Never concatenate it into a system/instruction position in an
   LLM prompt. It goes in a clearly delimited *data* section. In the UI it
   renders as **text** — never `{@html ...}` in Svelte, never raw HTML.

5. **Secrets live in the OS keychain, never in config or the log.** OAuth tokens,
   refresh tokens, API keys go through the keychain (`keyring` crate). If you
   ever find a token in `tauri.conf.json`, a `.env` that gets committed, or an
   event-log entry — that's a bug, stop and fix it.

## Pluggable LLM (the "Metis" seam)

Develop against a hosted API, ship against local Ollama, swap with no rewrites.
All model access goes through the `LlmBackend` trait (see `SCAFFOLD.md`). Code
elsewhere depends on the trait, never on a concrete backend. Adding a backend =
one new impl, zero changes to agents or the gate.

Default Claude model for the hosted backend: `claude-opus-4-8` (1M context
available). Verify current model IDs/pricing against the claude-api skill before
hardcoding — do not answer model questions from memory.

## Build order (why Files is first)

Files → Calendar → Email. Files is local, so it proves the entire contract
(agent → gate → log → done) with **zero OAuth friction**. Calendar and Email
then slot into the already-proven contract; their Google OAuth is the only
genuinely fiddly part and is isolated to its own steps.

## The suite that must never regress

The Safety Gate tests (Tier classification, "Tier-2 cannot auto-execute",
"untrusted content never reaches instruction position"). If a refactor turns
these red, **stop and fix before continuing** — that layer is what stands
between a hallucinated plan and a real action.

## UI

Svelte + Tailwind + Vite, rendered in the Tauri webview. Screens are designed in
**Stitch** (exports Tailwind HTML) and refactored here into components. Stitch
owns the look; you own the wiring to Tauri `invoke()` and live state. The UI
never calls an LLM or executes an action — it calls Tauri commands only.

## Conventions

- Rust 2021, workspace crates under `crates/`, Tauri app in `src-tauri/`.
- Errors: `thiserror` in libraries, `anyhow` at the app boundary. No `unwrap()`
  in non-test code paths that can see untrusted input.
- Every step in `PROMPTS.md` ends in something runnable. Keep it that way.
- Tests live next to code; gate tests are the canary — keep them fast and green.
