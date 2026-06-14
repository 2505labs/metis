# Metis — build prompts

Paste one step at a time into Claude Code. Each step ends in something runnable.
Commit after each green step. If a step's tests don't pass, fix before moving on
— especially Step 4.

`CLAUDE.md` is read automatically every step, so you don't need to restate the
architecture or the non-negotiables. Reference them by name when it matters.

---

## Step 0 — Scaffold that opens a window

> Create the repo from `SCAFFOLD.md`: the Cargo workspace, all five crates with
> empty `lib.rs` files that compile, the `src-tauri` app, and the `ui/` Svelte +
> Tailwind + Vite project. Wire Tauri to serve the Svelte dev build. The app
> should open a window showing "Metis" and nothing else. Add a root `README.md`
> with run instructions. Don't implement any contract types yet.

**Green when:** `cargo tauri dev` opens a window. Commit.

---

## Step 1 — The contract + a mock brain

> Implement `metis-core`: the `Tier` enum and `may_auto_execute` exactly as in
> `SCAFFOLD.md`, plus `Skill`, `Task`, `Observation`, `ProposedAction`, `Plan`,
> and an `Agent` trait (async): `skills()`, `observe(Task) -> Vec<Observation>`,
> `propose(Task) -> Vec<ProposedAction>`. Then implement `metis-llm`: the
> `LlmBackend` trait and `Draft`/`DataBlock` as sketched, plus a `MockBackend`
> that returns deterministic canned drafts. Unit-test that `Draft` keeps `data`
> in its own slot and that `Tier::ConfirmRequired.may_auto_execute()` is false.

**Green when:** `cargo test` passes. No agents yet — just the shapes. Commit.

---

## Step 2 — The append-only hash-chained log

> Implement `metis-log`: an `EventLog` that appends `Entry { id, ts, kind,
> payload, prev_hash, hash }` where `hash = sha256(prev_hash || canonical(entry
> sans hash))`. Kinds: `Observed`, `Proposed`, `Approved`, `Rejected`,
> `Executed`. Provide `append`, `iter`, and `verify_chain` (recomputes every
> hash and confirms linkage). Persist to a JSONL file under the app data dir.
> Forbid mutation/deletion in the API. Test: append three entries, tamper the
> middle one on disk, confirm `verify_chain` fails at that index. Never log
> secrets.

**Green when:** chain verifies clean, and the tamper test detects the break. Commit.

---

## Step 3 — Files agent (read-only, proves the contract)

> Implement the Files agent in `metis-agents` against the `Agent` trait. MVP
> skills: list a directory, read a text file, search file contents — all
> `Tier::ReadOnly`. File contents returned from `observe` are untrusted: when
> they feed an `LlmBackend`, they go in a `DataBlock`, never in `instructions`.
> Add a Tauri command `files_observe(path)` and render the results in `App.svelte`
> as a plain list (text, not HTML). Wire one real `MockBackend` summarize call so
> the full path agent → llm draft → log `Observed` is exercised end to end.

**Green when:** the window lists a real directory and writes `Observed` entries
to the log; `verify_chain` still passes. Commit. **The contract is now proven.**

---

## Step 4 — Safety gate + confirm queue (the canary)

> Implement `metis-gate`: a `Gate` that takes a `ProposedAction`, **re-derives**
> the `Tier` from the action kind (ignoring any softer tier the agent claimed,
> taking the stricter), and routes it. `ReadOnly` executes immediately and logs
> `Executed`. `ConfirmRequired` enqueues into a `ConfirmQueue` and logs
> `Proposed`; it executes only after `approve(id)` (logs `Approved` then
> `Executed`) and is dropped on `reject(id)` (logs `Rejected`). Add Tauri
> commands `queue_list`, `queue_approve`, `queue_reject`. Write the canary test
> suite: (a) no `ConfirmRequired`/`HighRisk` action can execute without approval,
> (b) an agent claiming `ReadOnly` for a mutating kind is upgraded by the gate,
> (c) untrusted content never lands in `instructions`. Mark these tests as the
> suite that must never regress (a comment + a `#[test]` module doc).

**Green when:** the canary suite passes and a queued action only executes after
explicit approval. Commit. **From here, never let this suite go red.**

---

## Step 5 — Calendar agent + Google OAuth (keychain)

> Add Google OAuth (installed-app / loopback flow) and the Calendar agent.
> `observe`: list upcoming events, read event details — `Tier::ReadOnly`.
> `propose`: create event — `Tier::ConfirmRequired`, routed through the gate and
> queue from Step 4. **Tokens (access + refresh) go in the OS keychain via
> `keyring`, never in config and never in the event log** (CLAUDE.md rule 5).
> The hosted `LlmBackend` (`anthropic.rs`) can also come in here; default model
> `claude-opus-4-8`. Add Tauri commands to start auth and to list/observe
> calendar.

**Green when:** OAuth completes, upcoming events list, and "create event" lands
in the confirm queue (not executed) until approved. Verify no token appears in
the log file or config. Commit.

---

## Step 6 — Email agent (read + draft-reply via Tier-2)

> Add the Email agent over the same OAuth. `observe`: list/read recent threads —
> `Tier::ReadOnly`. `propose`: **draft a reply** — the LLM drafts (rule 1), the
> action is `Tier::ConfirmRequired`, the draft goes to the confirm queue, and it
> sends only on approval. Email bodies are untrusted: always `DataBlock`, never
> instructions; render as text in the UI. There is **no compose-and-send path**
> that bypasses the queue.

**Green when:** a thread can be read, a reply draft appears in the confirm queue,
and approving it is the only way it sends. Canary suite still green. Commit.

---

## Step 7 — Wire the Stitch screens

The Stitch exports live in `stitch-exports/`. Seven screens = **one shell + six
views**, sharing one design system:

| `stitch-exports/…/code.html` | becomes |
|---|---|
| `main_console`   | the app shell: sidebar nav + content slot (`App.svelte`) |
| `agent_dashboard`| Dashboard view, hosts `AgentCard` components |
| `confirm_queue`  | ConfirmQueue view — the gate, wired |
| `event_log`      | EventLog view — wired, read-only |
| `files_agent` / `calendar_agent` / `email_agent` | per-agent detail views |

Each folder also has a `screen.png` — use it as the visual target. The canonical
theme is `stitch-exports/metis/DESIGN.md` (full palette + type scale). Exports
load Tailwind from a CDN and define theme in an inline `<script>` config; our
Vite build compiles Tailwind locally, so that CDN line and inline config get
**replaced** by `tailwind.config.js`, not copied.

### Step 7a — Theme + shell (static, but running)

> Port the design system from `stitch-exports/metis/DESIGN.md` into
> `ui/tailwind.config.js` (colors + typography) and `ui/src/app.css` (font
> imports: Inter, JetBrains Mono, Material Symbols; the custom scrollbar). Then
> refactor `stitch-exports/main_console/code.html` into the app shell in
> `App.svelte`: sidebar nav (Dashboard, Confirm Queue, Event Log, + the three
> agents) and a content slot with simple client-side view switching. Refactor
> `agent_dashboard` into a Dashboard view plus an `AgentCard.svelte` component.
> Drop the Tailwind CDN script and inline config — styling now comes from our
> local build. Wire nav to switch views; content can be static placeholders for
> now. Match `screen.png` visually.

**Green when:** `cargo tauri dev` shows the themed shell, sidebar nav switches
views, and the dashboard renders three agent cards. Commit.

### Step 7b — Wire the live views

> Refactor the remaining exports into views and components under
> `ui/src/lib/components/`, wired to live state via `ui/src/lib/api.ts` (thin
> `invoke()` wrappers) — don't ship raw export blobs:
> - `confirm_queue` → `ConfirmQueue.svelte`, calling `queue_list` /
>   `queue_approve` / `queue_reject`. It must render the actual pending
>   `ProposedAction` with its **gate-assigned Tier** and the content to be acted
>   on — it is the gate made visible, never a direct Send/Create button.
> - `event_log` → `EventLog.svelte`, reading the log (read command from Step 2),
>   read-only, with the chain-verified status.
> - `files_agent` / `calendar_agent` / `email_agent` → per-agent views calling
>   the observe/propose commands from Steps 3/5/6.
>
> All external/untrusted content (email bodies, file text, invite details)
> renders as **text** — never `{@html}` (CLAUDE.md rule 4 at the render layer).

**Green when:** the real screens drive real commands; approving in the UI moves
an action through the gate and appends to the log; the log view shows it and
still verifies. Canary suite green. Commit.

---

### Watch-list while you build

- **Step 4 canary** is load-bearing. Red = stop and fix, every time.
- **Step 5 keychain**: if tokens drift into config or the log, re-paste rule 5.
- Keep each step runnable. If a prompt balloons past one green checkpoint, split
  it — you should never be debugging a thousand uncommitted lines.
