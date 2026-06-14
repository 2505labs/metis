# Metis

Local-first desktop agent console. Tauri (Rust core) + Svelte/Tailwind UI.
Three agents — Files, Calendar, Email — that observe and *propose*; a human
approves anything that writes.

## New here? Start with these

| Read | For |
|------|-----|
| **[STATUS.md](STATUS.md)** | The living dashboard — what's done, what's next, who owns what. **Check this first, every session.** |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | How we work together — claiming work, branching, commit rules, definition of done. |
| **[HANDOFF.md](HANDOFF.md)** | Deep onboarding / full project context. |
| **[CHANGELOG.md](CHANGELOG.md)** | Dated history of what changed and why (MVP — things move). |
| [CLAUDE.md](CLAUDE.md) | Architecture + the 5 non-negotiable rules. |
| [SCAFFOLD.md](SCAFFOLD.md) | Repo structure + `Tier` / `LlmBackend` sketches. |
| [PROMPTS.md](PROMPTS.md) | The 8-step build sequence. |
| [docs/blueprint/](docs/blueprint/) | The broader "Collective Intelligence" vision Metis builds toward. |

## Prerequisites

- Rust (stable) — `https://rustup.rs`
- Node 20+ and pnpm 9+
- macOS: Xcode Command Line Tools

## Run

```bash
pnpm install        # installs the Tauri CLI + ui workspace deps
pnpm dev            # = tauri dev: builds the Rust core, opens the window
```

`pnpm dev` runs the Vite frontend (port 1420) and the Tauri shell together.
First Rust build pulls the Tauri crate graph and takes a few minutes.

## Layout

```
crates/        Rust workspace: core contract, llm, log, gate, agents
src-tauri/     the desktop app (commands wire UI ↔ core)
ui/            Svelte + Tailwind + Vite frontend
stitch-exports/ Stitch UI exports (wired in Step 7)
```

## Build order

Files → Calendar → Email. Files proves the whole contract with zero OAuth
friction; Calendar/Email then slot into the proven contract. Work down
[PROMPTS.md](PROMPTS.md), committing after each green step. The Safety Gate
tests (Step 4) must never regress.
