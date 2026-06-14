# Collective Intelligence — Features

A feature-level view of what Metis does, organized by the customer's mental model rather than the system's layers. Each feature notes the domain and the safety tier it operates under.

---

## Always-on intelligence

- **Persistent state.** Metis maintains long-term memory of your context, projects, and constraints — it doesn't start from zero each session.
- **Proactive, not reactive.** Set an intent once; it works in the background instead of waiting for prompts.
- **Availability-aware.** Models your quiet hours, focus blocks, and calendar so it acts when you want and stays out of the way when you don't.
- **Runs on your hardware.** Edge-anchored and self-hosted — nothing leaves your home unless you ask it to.

---

## The daily feed

- **One evening summary.** Everything handled plus anything that needs you, delivered at your chosen time.
- **Three-way grouping.** Needs approval · a real decision for you · handled (no action).
- **One-tap approvals.** Drafted actions shown inline; approve, edit, or decline in a glance.
- **See everything & why.** Full, human-readable audit of every action and its reasoning.

---

## Software / digital work (Priority 1)

| Feature | Tier |
|---|---|
| Inbox triage — sort, archive, flag what matters | 0–1 |
| Draft replies held for your approval | 2 |
| Calendar guarding — protect focus blocks, decline clashes | 1–2 |
| Scheduling — propose and book around your availability | 2 |
| File housekeeping — backup, organize, free space | 1 |
| Family/important watch — school, appointments, deadlines | 0 (watch), 2 (act) |

---

## IoT / smart home (Priority 2)

| Feature | Tier |
|---|---|
| Ambient routines — "don't come home to a dark cold house" | 1–2 |
| Sensor fusion into the world model (presence, climate) | 0 |
| Reversible control — lights, scenes, notifications | 1 |
| Context-aware prompts — "nobody home, hold heating?" | 2 |

---

## Robotics (Priority 3)

| Feature | Tier |
|---|---|
| Bounded physical tasks — tidy, fetch, cleaning rounds | 3 |
| Simulate-then-confirm — "here's what I'm about to do" | 3 |
| Hardware e-stop independent of any software path | n/a (safety floor) |

---

## Trust & safety (cross-cutting)

- **Reversibility tiers.** The more irreversible an action, the more confirmation/simulation it requires (0 auto → 4 never-automated).
- **Hard guarantees.** Passwords, fund transfers, and access-control changes are never automated — always yours.
- **Memory governance.** Verifiable control over what's written, who reads it, and what can be forgotten ("mnemonic sovereignty").
- **Full audit trail.** Every action traceable to the goal and plan that produced it.
- **Untrusted content is data, not commands.** Inbound emails, web pages, and device payloads are never executed as instructions.

---

## Coordination (the "collective")

- **Multi-agent mesh.** Specialized agents per domain, coordinated rather than one monolithic model — empirically more reliable than single-agent designs.
- **Cross-domain plans.** A software trigger can drive an IoT action can drive a robot task.
- **Standard protocols.** MCP for tools, A2A for agent-to-agent delegation — open standards, no proprietary lock-in.
- **Reflection loop.** Learns which plans work from past outcomes.
