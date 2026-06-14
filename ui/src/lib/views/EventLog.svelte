<script lang="ts">
  import { log } from "../mock";
  import type { LogKind } from "../types";

  // Distinct muted color per kind. Read-only — no actions anywhere.
  const KIND_COLOR: Record<LogKind, string> = {
    Observed: "text-primary",
    Proposed: "text-confirm",
    Approved: "text-secondary",
    Executed: "text-on-surface",
    Rejected: "text-error",
  };

  const KINDS: LogKind[] = ["Observed", "Proposed", "Approved", "Rejected", "Executed"];

  // Unique agents present in the log, for the agent filter.
  const agents: string[] = [...new Set(log.map((e) => e.agent))].sort();

  let kindFilter = $state<LogKind | "All">("All");
  let agentFilter = $state<string>("All");

  const entries = $derived(
    log.filter(
      (e) =>
        (kindFilter === "All" || e.kind === kindFilter) &&
        (agentFilter === "All" || e.agent === agentFilter),
    ),
  );
</script>

<div class="p-6 flex flex-col gap-4 h-full overflow-hidden bg-background">
  <!-- Header: title + chain verified pill -->
  <div class="flex items-center gap-3 shrink-0">
    <h2 class="font-headline-sm text-headline-sm text-on-surface">Event Log</h2>
    <div
      class="flex items-center gap-1.5 px-2 py-0.5 bg-surface-container rounded-full border border-outline-variant"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-confirm"></span>
      <span class="font-mono-sm text-mono-sm text-confirm uppercase tracking-wide">
        Chain verified &#x2713;
      </span>
    </div>
    <span class="font-mono-sm text-mono-sm text-on-surface-variant ml-auto">
      {entries.length} / {log.length} entries
    </span>
  </div>

  <!-- Filter row: by agent and by kind -->
  <div class="flex items-center gap-2 shrink-0 flex-wrap">
    <div
      class="flex items-center gap-2 px-2 py-1 bg-surface-container border border-outline-variant rounded"
    >
      <span class="text-on-surface-variant font-label-caps text-label-caps">Agent</span>
      <select
        bind:value={agentFilter}
        class="bg-transparent border-none p-0 pr-4 font-body-sm text-mono-sm text-primary focus:ring-0 cursor-pointer outline-none"
      >
        <option value="All">All</option>
        {#each agents as agent}
          <option value={agent}>{agent}</option>
        {/each}
      </select>
    </div>

    <div
      class="flex items-center gap-2 px-2 py-1 bg-surface-container border border-outline-variant rounded"
    >
      <span class="text-on-surface-variant font-label-caps text-label-caps">Kind</span>
      <select
        bind:value={kindFilter}
        class="bg-transparent border-none p-0 pr-4 font-body-sm text-mono-sm text-primary focus:ring-0 cursor-pointer outline-none"
      >
        <option value="All">All</option>
        {#each KINDS as kind}
          <option value={kind}>{kind}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Timeline: newest first, faint connector line implies the hash chain -->
  <div class="flex-1 overflow-y-auto relative">
    <!-- Continuous chain connector -->
    <div class="absolute top-0 bottom-0 left-[19px] w-px bg-outline-variant"></div>

    <div class="relative flex flex-col">
      {#each entries as entry (entry.id)}
        <div
          class="flex items-center h-10 bg-surface-container-low hover:bg-surface-container-high border-b border-outline-variant/30 px-2 rounded-sm transition-colors cursor-default"
        >
          <!-- Chain node -->
          <div class="w-8 flex justify-center shrink-0">
            <div
              class="w-2.5 h-2.5 rounded-full border-2 border-background {KIND_COLOR[entry.kind]}"
              style="background-color: currentColor"
            ></div>
          </div>

          <!-- Kind badge -->
          <div class="w-24 shrink-0">
            <span
              class="px-2 py-0.5 rounded-full bg-surface-container-highest text-label-caps font-label-caps uppercase tracking-wider {KIND_COLOR[entry.kind]}"
            >
              {entry.kind}
            </span>
          </div>

          <!-- Agent -->
          <div class="w-36 shrink-0">
            <span class="font-mono-sm text-mono-sm text-on-surface-variant truncate"
              >{entry.agent}</span
            >
          </div>

          <!-- Timestamp -->
          <div class="w-20 shrink-0">
            <span class="font-mono-sm text-mono-sm text-on-surface-variant">{entry.ts}</span>
          </div>

          <!-- Message -->
          <div class="flex-1 min-w-0 overflow-hidden">
            <span class="font-body-sm text-on-surface truncate block">{entry.message}</span>
          </div>

          <!-- Hash fragment -->
          <div class="w-32 shrink-0 text-right">
            <span class="font-mono-sm text-mono-sm text-outline">sha256:{entry.hash}</span>
          </div>
        </div>
      {/each}

      {#if entries.length === 0}
        <div class="flex items-center justify-center h-24 text-on-surface-variant font-body-sm">
          No entries match the current filters.
        </div>
      {/if}
    </div>
  </div>
</div>
