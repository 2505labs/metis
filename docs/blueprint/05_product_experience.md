# Collective Intelligence — Product Experience

The architecture, roadmap, and tech spec are all builder-facing. This document is the opposite: it defines the surface a customer actually lives in, and how that surface maps down onto the system underneath. Everything technical lives *under* these screens.

---

## 1. The core insight

A general customer does not want a Sense→Model→Plan→Gate→Act loop. They want their stuff handled. So the product is not the mesh — the product is two screens sitting on top of it:

1. **Onboarding** — turns "configure agents, connect MCP servers, set constraints" into a few questions about the customer's life.
2. **The daily feed** — the heartbeat. What was handled, and the few things that need the customer.

If we build the mesh but not these screens, we have a system only an enthusiast can run. Nail these screens and the system becomes buyable.

**The rule that governs the whole surface:** the customer never sees the words "agent," "orchestrator," "edge," or "tier." They see outcomes handled and a few things to approve.

---

## 2. The daily feed (the heartbeat)

The customer opens the app and sees three groups, ordered by how much they need the person:

| Group | What it contains | Maps to |
|---|---|---|
| Needs your approval | Drafted actions awaiting a yes (send reply, hold heating) | Safety Tier 2 (confirm) |
| A real decision for you | Genuine judgment calls the system won't make alone | System restraint — builds trust |
| Handled — no action needed | Reversible things already done | Safety Tiers 0–1 (auto / notify) |

Plus one **"see everything & why"** link that exposes the audit log — for trust, not debugging.

**Design decisions that carry architecture:**
- The grouping *is* the safety-tier model, translated. The customer never learns the word "tier"; they just feel the system bothers them proportionally.
- Every confirmable action resolves in one glance and one tap (Approve & send / Edit). The moment approval feels like work, people rubber-stamp everything (defeating safety) or quit. Drafts are shown inline so the decision is real, not blind.
- "A real decision for you" being honest that some things aren't its call is what earns the trust to act autonomously elsewhere.

---

## 3. Onboarding — ask about life, not the system

Four steps, ~2 minutes, no jargon. The customer picks outcomes; the system translates them into capabilities.

### Step 1 — Connect accounts
Email, calendar, files. (Provisions the MCP-backed software agents.)

### Step 2 — Choose outcomes
Phrased as life outcomes, each silently maps to provisioning:

| Customer sees | System provisions |
|---|---|
| "Keep my inbox under control" | Email agent: sort, draft, flag |
| "Protect my time" | Calendar agent: guard focus blocks, scheduling |
| "Look after the house" | IoT agents: lights, heating |
| "Watch for important family things" | Cross-domain watch rules on calendar + email |

### Step 3 — Set rhythms
Becomes the identity/constraints memory:

| Customer sees | Writes to memory |
|---|---|
| "Don't disturb me between 22:00 and 07:00" | `availability.quiet_hours` |
| "Sum up my day at 18:00" | `availability.summary_time` |
| "Always ask me first before…" (checkboxes) | Tier-2 confirm rules |
| "Some things I'll never do — passwords, moving money" | Tier-4 block tier (shown as prose, no toggle) |

**Critical distinction:** Tier-2 things are *choices* the customer makes (checkboxes). Tier-4 things are *guarantees* the system makes to them (prose, no control). Never mix them into one list of toggles — that would imply the customer could switch off the protection against moving money.

### Step 4 — First-feed preview
Show a sample of tomorrow's feed so the first thing the customer experiences is the payoff, not an empty state.

---

## 4. Experience by domain (priority order)

**Software / digital work (Priority 1).** Looks like a chat app that keeps running when closed. Customer sets an intent once ("keep my inbox under control") and becomes an *approver, not an operator*. The Tier-2 confirm feed is the entire UX.

**IoT / smart home (Priority 2).** Interaction goes ambient. Customer says "I don't like coming home to a dark cold house" once; the system fuses calendar + location + sensors and handles it. Noticed only when it asks or in the feed. The feed doubles as the trust mechanism for an otherwise-invisible system.

**Robotics (Priority 3).** A physical helper doing bounded tasks. The experience is mostly *watching it ask permission* — the Tier-3 simulate-then-confirm rule surfaces as "here's what I'm about to do" before anything moves. For a general customer that confirmation isn't friction; it's the basis for letting a machine move around their home.

---

## 5. Go-to-market: prosumer first

"General customer" and "self-hosted on your own hardware" are in tension. The general public wants the *outcome* (private, always-on, owns-my-data) without the *ownership* (a box to maintain).

- **First viable customer is a prosumer:** technical enough to want data sovereignty, willing to run hardware. Fits the architecture as-is.
- **The general-customer version needs a layer not yet designed:** an appliance (plug-in device, invisible to maintain) or a hosted-but-private offering, plus onboarding that turns "configure agents" into "answer a few questions about your life."
- The two screens above are what soften the prosumer-vs-general divide — even the appliance version just needs these same screens on top.

---

## 6. Implication for the build

The feed is the product's heartbeat, so the audit/event log from the architecture **is the data source for the customer's main screen** — not a back-end debugging tool. Design that log to be *human-narratable* from day one ("turned off the porch light left on since this morning," with the why one tap away). Retrofitting readable explanations later is much harder.
