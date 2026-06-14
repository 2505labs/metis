# Metis — repo scaffold

The structure Step 0 should produce, the workspace, the dependency list, and the
two load-bearing type sketches. Treat the sketches as the contract; fill in the
bodies as the steps direct.

## Directory tree

```
metis/
├── CLAUDE.md                 # architecture + rules (read every task)
├── SCAFFOLD.md               # this file
├── PROMPTS.md                # the 8-step build sequence
├── Cargo.toml                # workspace root
├── crates/
│   ├── metis-core/           # the contract: Tier, Skill, Task, Observation,
│   │   └── src/lib.rs         #   ProposedAction, Plan, agent trait
│   ├── metis-llm/            # LlmBackend trait + adapters
│   │   └── src/
│   │       ├── lib.rs        #   trait + Mock backend
│   │       ├── anthropic.rs  #   hosted (dev) — added in a later step
│   │       └── ollama.rs     #   local (ship)  — added in a later step
│   ├── metis-log/            # append-only hash-chained event log
│   │   └── src/lib.rs
│   ├── metis-gate/           # safety gate + confirm queue (the canary tests)
│   │   └── src/lib.rs
│   └── metis-agents/         # Files, Calendar, Email adapters
│       └── src/
│           ├── lib.rs
│           ├── files.rs
│           ├── calendar.rs
│           └── email.rs
├── src-tauri/                # the desktop app: commands wire UI ↔ core
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── build.rs
│   └── src/
│       ├── main.rs
│       ├── commands.rs       # #[tauri::command] surface the UI calls
│       └── state.rs          # app state: backend, gate, log, queue
└── ui/                       # Svelte + Tailwind + Vite (Stitch lands here)
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.ts
        ├── App.svelte
        ├── lib/
        │   ├── api.ts        # thin wrappers over Tauri invoke()
        │   └── components/   # refactored Stitch screens
        │       ├── AgentCard.svelte
        │       ├── ConfirmQueue.svelte
        │       └── EventLog.svelte
        └── app.css           # tailwind entry
```

## Workspace root — `Cargo.toml`

```toml
[workspace]
resolver = "2"
members = [
  "crates/metis-core",
  "crates/metis-llm",
  "crates/metis-log",
  "crates/metis-gate",
  "crates/metis-agents",
  "src-tauri",
]

[workspace.dependencies]
serde      = { version = "1", features = ["derive"] }
serde_json = "1"
tokio      = { version = "1", features = ["rt-multi-thread", "macros", "sync"] }
async-trait = "0.1"
thiserror  = "1"
anyhow     = "1"
sha2       = "0.10"            # hash-chained log
time       = { version = "0.3", features = ["serde", "formatting"] }
uuid       = { version = "1", features = ["v4", "serde"] }
keyring    = "2"              # OS keychain for OAuth tokens / API keys
reqwest    = { version = "0.12", features = ["json"] }   # hosted backend + Google
```

Per-crate deps draw from the workspace set. `metis-core` is dependency-light
(serde, thiserror, time, uuid) so everything can depend on it without cycles.

## Crate dependency direction (no cycles)

```
metis-core  ◀── metis-llm
     ▲    ◀── metis-log
     │    ◀── metis-gate   (depends on core + log)
     └─────── metis-agents (depends on core + llm + gate + log)
src-tauri    ── depends on all of the above; nothing depends on src-tauri
```

`metis-core` knows nothing about the others. The gate depends on the log; agents
depend on everything below them; the Tauri app is the only place concrete
backends are chosen and wired.

---

## Load-bearing sketch 1 — `Tier` (in `metis-core`)

The gate classifies every proposed action into a Tier. Tier decides whether a
human is in the loop. This enum is the spine of rule 2.

```rust
/// How much human oversight an action requires before it may execute.
#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum Tier {
    /// Read-only. No side effects outside Metis. May auto-execute.
    /// e.g. list files, read calendar, fetch unread email metadata.
    ReadOnly,

    /// Reversible-ish write or external send. MUST be approved by a human
    /// via the Confirm Queue before executing.
    /// e.g. send a drafted reply, create a calendar event, move a file.
    ConfirmRequired,

    /// Destructive or irreversible. Approved via the queue AND flagged
    /// high-risk in the UI. Reserved for later phases; no agent emits this
    /// in the MVP. e.g. delete, overwrite, mass operations.
    HighRisk,
}

impl Tier {
    /// The single chokepoint rule. If this ever returns true for anything
    /// other than ReadOnly, the gate is broken.
    pub fn may_auto_execute(self) -> bool {
        matches!(self, Tier::ReadOnly)
    }
}
```

A `ProposedAction` carries the agent's *intended* tier, but the **gate
re-derives** the tier from the action kind and takes the stricter of the two.
An agent can never downgrade its own action into auto-execution.

## Load-bearing sketch 2 — `LlmBackend` (in `metis-llm`)

The pluggable-Metis seam. Agents hold a `dyn LlmBackend` and never know whether
they're talking to a hosted API or local Ollama.

```rust
use async_trait::async_trait;

/// A prompt with untrusted content kept in a separate, clearly delimited slot.
/// `instructions` is trusted (ours). `data` is attacker-controlled and is
/// rendered into the prompt inside an explicit fence — never as instructions.
pub struct Draft {
    pub instructions: String,
    pub data: Vec<DataBlock>,     // email bodies, file text, invite text...
    pub schema: Option<serde_json::Value>, // optional JSON shape to force
}

pub struct DataBlock {
    pub label: String,            // e.g. "email-body", "file:notes.md"
    pub content: String,          // untrusted; never trusted as instruction
}

#[async_trait]
pub trait LlmBackend: Send + Sync {
    /// Produce a draft response. This NEVER executes anything — it returns
    /// text (or structured JSON if `schema` was set). Execution is the
    /// caller's job, after the gate. (Non-negotiable rule 1.)
    async fn draft(&self, req: Draft) -> Result<String, LlmError>;

    /// Stable id for the log ("anthropic:claude-opus-4-8", "ollama:llama3.1").
    fn model_id(&self) -> String;
}

#[derive(thiserror::Error, Debug)]
pub enum LlmError {
    #[error("backend unavailable: {0}")]
    Unavailable(String),
    #[error("invalid response: {0}")]
    BadResponse(String),
}
```

Step 1 ships a `MockBackend` (deterministic, returns canned drafts) so the
contract, gate, and log are testable before any network/OAuth exists.
`anthropic.rs` and `ollama.rs` are added later and change nothing above them.
