# Collective Intelligence — Phased Build Roadmap

Hardware is still being decided, so Phase 0 stays hardware-agnostic and the early phases run on a single machine. The mesh scales out later without rearchitecting, because agents talk over a message bus, not direct calls.

---

## Phase 0 — Foundation (the spine)
**Goal:** A loop that senses, remembers, and acts on one trivial thing — end to end.

- Stand up the state store: append-only event log + one working-memory store.
- Stand up the message bus (NATS or MQTT) — every agent and the orchestrator speak through it.
- Define the agent contract (`capabilities / plan / execute / report`) as a shared schema.
- Serve Metis locally (Ollama/llama.cpp is fine to start; swap to vLLM when GPU is settled).
- Build a minimal orchestrator: receive observation → ask Metis → log → dispatch.
- **Milestone:** one mock agent reports a value, Metis comments, orchestrator logs it. The skeleton breathes.

---

## Phase 1 — Software domain (Priority 1)
**Goal:** Real digital work, end to end, with the safety gate live.

- Build 2–3 MCP-backed software agents (start read-only: calendar, email, files).
- Implement the safety gate with tiers 0–2; Tier-2 actions require your approval.
- Implement scheduling against your availability/constraints (identity memory).
- Add semantic + recall memory (graph + vector) so Metis has context across sessions.
- Add memory compaction/summarization now — before the log gets large.
- **Milestone:** "Watch my inbox; draft replies to anything from my team; hold sends for my approval; summarize my day at 6pm." Runs unattended.

---

## Phase 2 — Hardening
**Goal:** Survive the real world.

- Offline autonomy + reconciler: kill the network mid-task, confirm graceful recovery.
- Arbiter: two goals contend for the same resource, orchestrator resolves cleanly.
- Security: mTLS / capability tokens between orchestrator and agents; least-privilege creds.
- Full audit trail and a review UI (even a simple feed) so you can see what it did and why.
- **Pull observability earlier than feels necessary.** 2026 production post-mortems are consistent: the hard cost of multi-agent systems isn't the build, it's observability, state management, and orchestration migration. ~40% of agentic projects are projected to be cancelled by end of 2027, mostly at the seam between orchestration assumptions and domain logic. The audit log here isn't just hardening — it's the data source for the customer-facing feed (see product experience doc), so make it human-narratable now.
- **Milestone:** system runs for a week unattended; you can audit every action.

---

## Phase 3 — IoT / smart home (Priority 2)
**Goal:** Physical-world *observation* and *reversible* control.

- Bridge to Home Assistant / Matter / Zigbee over MQTT.
- Sensor fusion into the world model (Metis's multimodal instinct starts earning its keep).
- Reversible actuation only at first (lights, scenes, notifications) — Tier 1–2.
- **Milestone:** "If no one's home and it's after sunset, set away mode" — proposed, confirmed once, then trusted.

---

## Phase 4 — Robotics (Priority 3)
**Goal:** Irreversible physical action, gated hard.

- ROS 2 bridge; robotics agent exposes capabilities + a simulation endpoint.
- **Substrate: Vision-Language-Action (VLA) models, not a traditional robotics stack.** A VLA takes camera input + a text instruction and outputs low-level actions directly. 2026 frontier models (e.g. generalist cross-embodiment VLAs trained on tens of thousands of hours of teleoperation) generalize across robot morphologies. Reasoning is moving into the action loop (embodied chain-of-thought), which makes plans more auditable. World-model methods (e.g. WMPO) let the model reason about failed preconditions and maintain explicit state — a research-backed mechanism for the Tier-3 dry-run-before-confirm gate.
- Tier-3 enforced: every motion plan dry-runs in sim before any Tier-2 confirm.
- Vision/sensor loop tight to the robot; local safety interlocks independent of Metis.
- **Milestone:** a simple physical task planned by Metis, simulated, confirmed, executed safely — with a hardware e-stop that no software path can override.

---

## Phase 5 — Emergent coordination
**Goal:** The "collective" in Collective Intelligence.

- Cross-domain plans (a software trigger drives an IoT action drives a robot task).
- Reflection loop tuning: the system learns which plans work from recall memory.
- Multi-agent arbitration at scale.
- Distribute across hardware once your edge topology is decided — agents just move to new nodes on the bus.

---

## Sequencing logic
Software first because it's reversible, observable, and high-value — you debug the brain where mistakes are cheap. IoT second adds the physical world with reversible stakes. Robotics last because irreversibility demands everything earlier (safety gate, simulation, audit, security) to already be solid.
