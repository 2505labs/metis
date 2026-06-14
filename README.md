# Metis

Local-first desktop agent console. Tauri (Rust core) + Svelte/Tailwind UI.
Three agents — Files, Calendar, Email — that observe and *propose*; a human
approves anything that writes.

See [CLAUDE.md](CLAUDE.md) for architecture and rules, [SCAFFOLD.md](SCAFFOLD.md)
for structure, and [PROMPTS.md](PROMPTS.md) for the build sequence.

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
