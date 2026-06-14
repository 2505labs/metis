# Collective Intelligence — Blueprint

A persistent, self-hosted AI brain that connects, understands, and autonomously operates across software, devices, IoT, and robotics. Core LLM: **Metis** (multimodal). Edge-anchored, you-own-it. Not a chatbot or an automation bot — it maintains long-term state, models your availability and constraints, and plans and executes work through device-specific agents.

## Documents

| File | What it covers |
|---|---|
| `00_features.md` | Feature-level view, by customer mental model, with domains + safety tiers |
| `01_architecture.md` | Design principles, the four layers, control loop, safety tiers, security, memory governance |
| `02_roadmap.md` | Phases 0–5, sequenced software → IoT → robotics |
| `03_tech_spec.md` | Agent contract, memory schemas, orchestrator loop, safety gate, first sprint |
| `04_architecture_diagram.svg` | The system on one page |
| `05_product_experience.md` | The customer-facing layer: onboarding + daily feed, and how they map to the system |

## Suggested reading order

- **Building it:** 01 → 02 → 03
- **Selling it / designing UX:** 00 → 05
- **Orienting fast:** this README → 04 (diagram) → 00 (features)

## The two ideas that hold the whole thing together

1. **Metis only ever drafts.** The planner, scheduler, and safety gate sit between reasoning and any actuator. A hallucinated plan can't fire a robot arm. Unparseable model output is dropped, never guessed into action.
2. **The customer never sees the machinery.** "Agent," "orchestrator," "edge," and "tier" stay out of the UX. The customer sees outcomes handled and a few things to approve. The audit log is the data source for that feed — so it must be human-narratable from day one.

## State of the field (mid-2026) folded into these docs

- **Protocols converged** on MCP (tools) + A2A (agents) + WebMCP (web). The agent contract is now A2A-shaped (Agent Cards + task lifecycle).
- **Multi-agent beats single-agent** empirically — validates the mesh. But most failures are in observability/state/orchestration, so that work moved earlier in the roadmap.
- **Edge inference matured** — speculative decoding, offloading, INT4/INT8 quantization; one edge box can host several small models. Relevant once hardware is chosen.
- **Robotics substrate is VLAs** — vision-language-action models with embodied chain-of-thought and world-model planning, which fits the Tier-3 simulate-first gate.
- **Memory governance ("mnemonic sovereignty")** is now its own concern — write/forget authorization, poisoning defenses, reflection-budget limits.

## Still open

- Edge hardware (kept deliberately undecided; Phase 0–1 runs on a single machine).
- Prosumer-first vs. general-customer (appliance / hosted-private) — see `05_product_experience.md`.
