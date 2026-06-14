# Collective Intelligence — Architecture

**Core LLM:** Metis (multimodal)
**Nature:** Persistent, self-hosted, edge-anchored intelligence that coordinates many AI agents across software, IoT, and robotics.
**Operating mode:** Proactive and continuous, not prompt-reactive. Maintains long-term state, models your availability and constraints, plans and executes autonomously through device-specific agents.

---

## 1. Design principles

1. **Think and act are separate.** Metis proposes; the orchestrator disposes. A reasoning error must never directly fire an actuator.
2. **Capabilities, not APIs.** Agents expose a uniform contract. Metis reasons about *what can be done*, not vendor SDKs.
3. **Edge-first.** Memory and control live on your hardware. Cloud is optional augmentation, never a dependency for core operation.
4. **Local autonomy, eventual consistency.** Agents keep working when the network drops, then reconcile.
5. **Irreversibility gates everything.** The more irreversible/physical an action, the more confirmation and simulation it requires.
6. **You own it.** Self-hosted, auditable, no data leaves the edge unless you say so.

---

## 2. Layers

### 2.1 Metis — reasoning core
- Multimodal LLM (text, vision, audio, sensor streams).
- Responsibilities: interpret world state, decompose goals, draft plans, reflect on outcomes.
- Explicitly **not** responsible for: executing actions, holding ground-truth state, enforcing safety. Those belong to other layers so a hallucination is contained.
- Serving: vLLM / Ollama / llama.cpp depending on hardware.

### 2.2 Orchestrator — the autonomy engine
This is what turns a chatbot into a system. Sub-components:

| Component | Role |
|---|---|
| Planner | Validates and refines Metis's draft plans (HTN / goal decomposition). |
| Scheduler | Time- and resource-aware; respects your availability and constraints. |
| Arbiter | Resolves contention when agents want the same resource. |
| Safety gate | Policy check on every action; classifies by reversibility tier. |
| Reconciler | Merges agent state after offline periods. |

### 2.3 Agent mesh — execution
Each agent wraps one domain behind a uniform contract:

```
capabilities() -> [Capability]      # what this agent can do, with constraints
plan(goal)     -> [Task] | reject   # local decomposition (optional)
execute(task)  -> Result            # do the thing
report()       -> StateSnapshot     # current observed state + health
```

**Protocol alignment (2026).** The field has converged on a three-layer standard: MCP for agent-to-tool calls, A2A for agent-to-agent delegation, WebMCP for web. Our contract maps almost one-to-one onto A2A: its **Agent Cards** (machine-readable capability + modality + auth descriptors) are our `capabilities()`, and its **Task lifecycle** (submitted → working → input-required → completed → canceled → failed) is our task/result schema. Adopt A2A for the orchestrator↔agent layer rather than rolling our own: MCP is for passive tool providers, A2A for peers that have their own reasoning, state, and task lifecycle — which is exactly what our agents are. Keep the message bus as transport; the message *semantics* become a standard. (MCP is now governed by the Linux Foundation's Agentic AI Foundation.)

Domains, in your priority order:
1. **Software / digital work** — MCP servers (email, calendar, files, dev tools, web).
2. **IoT / smart home** — MQTT over Home Assistant / Matter / Zigbee.
3. **Robotics** — ROS 2 bridge, hard safety tier.

### 2.4 State store — memory at the edge
| Memory type | Store | Purpose |
|---|---|---|
| Episodic | Append-only log (Postgres / SQLite) | Auditable record of all events. |
| Semantic | Graph DB (Memgraph / Neo4j) | World model: facts, relations, device capabilities. |
| Recall | Vector DB (Qdrant / LanceDB) | Similarity search over past experience. |
| Working | In-memory / Redis | Active goals, current plans, short horizon. |
| Identity | Structured config | Your availability, preferences, hard limits. |

**Memory hygiene from day one:** compaction, summarization, and explicit forgetting policies. Append-everything memory rots.

**Memory governance (2026 — "mnemonic sovereignty").** For a persistent, self-hosted, you-own-it system, memory is its own security surface. Treat write-authorization and forget-authorization as first-class operations, not afterthoughts. Specific threats to design against: adversarial write flooding (exhausting storage/index), retrieval-latency poisoning (crafted entries that degrade nearest-neighbor search), and reflection-loop denial (inputs that trigger unbounded summarization cycles — so reflection budgets are a *safety limit*, not just a cost control). Distinguish intrinsic drift (knowledge conflict) from extrinsic threats (memory poisoning). The semantic layer is increasingly graph-native rather than a flat store — consider a graph-native memory layer rather than treating the graph as just one of several stores.

---

## 3. The control loop

```
SENSE   agents.report() -> normalized observations
MODEL   update semantic graph + working memory
PLAN    Metis drafts -> orchestrator validates/schedules
GATE    safety classify -> auto | confirm | simulate-first | block
ACT     dispatch tasks to agents
REFLECT record outcome, update recall, adjust
```

Default cadence: **event-triggered with a periodic heartbeat.** Pure continuous polling wastes compute; pure event-driven misses slow drifts. Heartbeat (e.g. every N minutes) catches "nothing fired but the world changed" cases.

---

## 4. Safety tiers (reversibility model)

| Tier | Examples | Rule |
|---|---|---|
| 0 — Auto | Read state, query, draft (unsent) | Execute freely, logged. |
| 1 — Notify | Reversible digital writes (file edit, draft saved) | Execute, surface in feed. |
| 2 — Confirm | Send message, publish, purchase, change settings | Human-in-loop approval required. |
| 3 — Simulate-first | Physical actuation, robotics motion | Dry-run / sim, then Tier-2 confirm. |
| 4 — Block | Credentials, fund transfers, access-control changes | Never automated; user does it. |

The orchestrator's safety gate maps every proposed action to a tier before dispatch.

---

## 5. Security posture

- Mutual TLS or signed capability tokens between orchestrator and every agent.
- Agents run least-privilege; an agent only holds credentials for its own domain.
- All inbound content (emails, web pages, device payloads) is **data, not instructions** — never executed as commands.
- Full audit log; every action traceable to the goal and plan that produced it.
- Network egress allowlist at the edge boundary.

---

## 6. What makes this not a chatbot

| Chatbot / automation bot | Collective Intelligence |
|---|---|
| Reacts to each prompt | Maintains goals across time |
| Stateless or shallow memory | Long-term episodic + semantic memory |
| One model, one channel | Many coordinated agents, many surfaces |
| Cloud-dependent | Edge-anchored, self-hosted |
| Fixed scripts | Plans and adapts |
