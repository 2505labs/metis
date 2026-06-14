# Collective Intelligence — Technical Spec (Phase 0–1)

This spec is enough to start coding the spine and the first software agents. Language-agnostic, but examples are Python-flavored.

---

## 1. Component contracts

### 1.1 Agent contract
Every agent — software, IoT, robotics — implements the same interface.

> **Align with A2A (2026).** This contract is deliberately A2A-shaped. `capabilities()` should serialize to an A2A **Agent Card**; `Task`/`Result` should follow the A2A **task lifecycle** (submitted, working, input-required, completed, canceled, failed). Use A2A for orchestrator↔agent messages and MCP for agent↔tool calls. Transport recommendations: Streamable HTTP for MCP, OAuth 2.1 with Resource Indicators for auth, Agent Card-compatible discovery endpoints.

```python
class Capability(TypedDict):
    name: str                 # "send_email", "set_light", "move_to"
    params_schema: dict       # JSON schema for execute() args
    reversibility: int        # 0..4 safety tier (see §4)
    constraints: dict         # rate limits, preconditions

class Task(TypedDict):
    task_id: str
    capability: str
    params: dict
    goal_id: str              # provenance: which goal produced this

class Result(TypedDict):
    task_id: str
    status: Literal["ok", "error", "rejected", "needs_confirm"]
    output: dict
    observed_state: dict

class Agent(Protocol):
    domain: str                              # "software" | "iot" | "robotics"
    def capabilities(self) -> list[Capability]: ...
    def plan(self, goal: str) -> list[Task]: ...      # optional; may return []
    def execute(self, task: Task) -> Result: ...
    def report(self) -> dict: ...                     # StateSnapshot + health
```

### 1.2 Transport
All messages flow over the bus (NATS subjects shown):

```
agent.{domain}.{id}.report      agent -> orchestrator   (state snapshots)
orchestrator.dispatch.{domain}  orchestrator -> agent   (tasks)
agent.{domain}.{id}.result      agent -> orchestrator   (results)
orchestrator.event              broadcast               (heartbeat, alerts)
```

Messages are signed (capability token in header). Orchestrator rejects unsigned or out-of-domain calls.

---

## 2. Memory schema

### 2.1 Episodic (append-only)
```sql
CREATE TABLE events (
  id          BIGSERIAL PRIMARY KEY,
  ts          TIMESTAMPTZ NOT NULL DEFAULT now(),
  kind        TEXT NOT NULL,        -- observation|plan|action|result|reflection
  domain      TEXT,
  goal_id     TEXT,
  payload     JSONB NOT NULL,
  hash        TEXT NOT NULL         -- chain prev hash for tamper-evidence
);
```

### 2.2 Semantic (graph)
Nodes: `Device`, `Capability`, `Person`, `Goal`, `Constraint`, `Place`.
Edges: `HAS_CAPABILITY`, `LOCATED_IN`, `CONSTRAINED_BY`, `OWNS`, `DEPENDS_ON`.

### 2.3 Working memory (Redis / in-proc)
```python
class WorkingState(TypedDict):
    active_goals: list[Goal]
    pending_tasks: list[Task]
    awaiting_confirm: list[Task]
    world_snapshot: dict          # latest fused agent reports
    horizon_until: datetime
```

### 2.4 Identity / constraints
```yaml
availability:
  timezone: "Asia/Kolkata"
  quiet_hours: ["22:00", "07:00"]
  busy_calendar: mcp://calendar
hard_limits:
  - "never send email without confirmation"
  - "no physical actuation between quiet_hours"
preferences:
  summary_time: "18:00"
```

---

## 3. Orchestrator control loop

```python
def loop():
    while True:
        obs = bus.collect_reports(timeout=HEARTBEAT)   # event-driven + heartbeat
        world = fuse(obs)
        memory.update_working(world)

        goals = memory.active_goals()
        for goal in goals:
            draft = metis.plan(goal, context=memory.context_for(goal))
            plan  = planner.validate(draft, world, memory.constraints())
            for task in scheduler.order(plan, availability=memory.identity()):
                tier = safety.classify(task)            # §4
                if tier <= AUTO:
                    dispatch(task)
                elif tier in (NOTIFY, CONFIRM):
                    if tier == CONFIRM:
                        memory.queue_confirm(task)      # surface to user
                    else:
                        dispatch(task); feed.notify(task)
                elif tier == SIMULATE_FIRST:
                    if simulate(task).ok:
                        memory.queue_confirm(task)
                else:                                   # BLOCK
                    feed.block(task, reason="user must perform")
        reflect(memory.recent_results())
```

Key point: **Metis only produces `draft`.** The planner, scheduler, and safety gate stand between Metis and any `dispatch()`.

---

## 4. Safety gate

```python
AUTO, NOTIFY, CONFIRM, SIMULATE_FIRST, BLOCK = range(5)

def classify(task: Task) -> int:
    cap = registry.capability(task.capability)
    tier = cap["reversibility"]                  # baseline from the agent
    # escalate on context
    if violates_hard_limit(task):   return BLOCK
    if in_quiet_hours() and cap["domain"] != "software":
        tier = max(tier, CONFIRM)
    return tier
```

Tiers (baseline per capability, escalated by context):
- **0 Auto** — reads, drafts, queries.
- **1 Notify** — reversible digital writes.
- **2 Confirm** — sends, publishes, purchases, settings.
- **3 Simulate-first** — physical/robotics motion.
- **4 Block** — credentials, funds, access control. Never automated.

---

## 5. Metis interface

```python
def plan(goal: str, context: Context) -> DraftPlan:
    """Metis drafts; never executes. Returns structured tasks + rationale."""
    sys = build_system_prompt(context.constraints, context.capabilities)
    out = metis.generate(
        system=sys,
        messages=context.as_messages(),
        response_format="json",     # force structured DraftPlan
        modalities=context.modalities,   # text + any image/audio/sensor frames
    )
    return DraftPlan.parse(out)      # reject if not parseable -> no action
```

Metis sees: current world snapshot, relevant recall, the goal, and the *capabilities available* (not raw APIs). It returns tasks referencing capabilities by name. If output doesn't parse to a valid DraftPlan, the orchestrator drops it — no guessing into action.

---

## 6. First software agents (Phase 1)

| Agent | Capabilities (start read-only) | First write capability (Tier 2) |
|---|---|---|
| Calendar | `list_events`, `find_free` | `create_event` |
| Email | `list_unread`, `read_thread` | `draft_reply` (held for confirm) |
| Files | `search`, `read` | `write_file` (Tier 1, notify) |

All three are MCP servers; the agent wrapper translates MCP tools into the `Capability` schema.

---

## 7. Minimal tech choices (revisit when hardware lands)

| Concern | Phase 0–1 pick | Why |
|---|---|---|
| LLM serving | Ollama / llama.cpp | Runs anywhere, no GPU assumption yet |
| Bus | NATS | Light, fast, scales to mesh later |
| Episodic | Postgres | JSONB + hash chain, one dependency |
| Semantic | Memgraph | In-memory graph, Cypher |
| Recall | Qdrant | Self-hosted vector search |
| Working | Redis | Fast ephemeral state |
| Orchestration | Custom loop first | Temporal later if workflows get complex |

---

## 8. First sprint (concrete)
1. `docker compose` up: NATS, Postgres, Redis, Ollama.
2. Implement `events` table + hash-chain writer.
3. Implement the agent contract + one mock agent that reports a counter.
4. Orchestrator loop: collect report → Metis comment → log event.
5. Add the calendar MCP agent, read-only.
6. Add the safety gate with tiers 0–2 and the confirm queue.
7. First real goal: "summarize my calendar each evening at my summary_time."
