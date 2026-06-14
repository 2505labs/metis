# Metis — CHANGELOG

> Append-only running history so the other person can see **what changed and
> why** without reading every diff. Newest on top. One entry per meaningful
> change (a step finishing, a shape changing, a decision reversed).
>
> Because this is an **MVP, features will change** — when you change or remove
> something, say *why* here. Future-us will thank present-us.
>
> **Format:** `## YYYY-MM-DD — <who>` then bullets. Tag each bullet:
> `Added` · `Changed` · `Removed` · `Fixed` · `Decision` · `Docs`

---

## 2026-06-14 — MK_Sindhu

- **Added:** `docs/blueprint/` — the broader "Collective Intelligence" vision docs
  (`00_features`, `01_architecture`, `02_roadmap`, `03_tech_spec`,
  `04_architecture_diagram.svg`, `05_product_experience`, and the blueprint
  `README.md`). Copied in from the parent folder so the whole picture lives in
  the repo and the collaborator can see it. These are vision/context — Metis (this
  repo) is the concrete app being built toward it.
- **Docs:** Added the collaboration docs — `STATUS.md` (living dashboard),
  `CHANGELOG.md` (this file), and `CONTRIBUTING.md` (how we work together) — so
  two people can track done / next / changed without stepping on each other.
- **Docs:** `HANDOFF.md` remains the deep onboarding/context dump; `STATUS.md` is
  now the day-to-day source of truth and links out to it.

## (earlier — reconstructed from git history)

- **2026-06-14 · Added** `HANDOFF.md` — session context for continuing in a new
  conversation. _(commit `acd672f`)_
- **2026-06-14 · Changed** UI re-skin to the **Obsidian Silk** theme across all
  views — v2 design, the current look. _(commit `3d695a2`)_
- **2026-06-14 · Added** Full operator console UI from Stitch exports with mock
  data — v1 design. _(commit `090426b`)_
- **2026-06-14 · Added** Step 0: Tauri + Svelte scaffold that opens a window.
  _(commit `59da4e4`)_

<!--
Template for a new entry — copy this block to the top under a dated heading:

## YYYY-MM-DD — <your name>

- **Added** <new thing>.
- **Changed** <what + why it changed>.
- **Decision** <choice made + the reasoning, so it isn't re-litigated>.
-->
