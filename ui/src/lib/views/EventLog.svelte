<script lang="ts">
  import { log } from "../mock";
  import type { LogKind } from "../types";

  // Distinct badge styling per kind (Obsidian Silk pills). Read-only — no actions.
  const KIND_BADGE: Record<LogKind, string> = {
    Observed: "bg-secondary-container/40 text-on-secondary-container",
    Proposed: "bg-confirm/10 text-confirm",
    Approved: "bg-primary/10 text-primary",
    Executed: "bg-primary/10 text-primary",
    Rejected: "bg-error-container/30 text-error",
  };

  // Chain-node dot color per kind, echoing the badge family.
  const KIND_DOT: Record<LogKind, string> = {
    Observed: "bg-secondary",
    Proposed: "bg-confirm",
    Approved: "bg-primary",
    Executed: "bg-primary",
    Rejected: "bg-error",
  };

  const KINDS: LogKind[] = ["Observed", "Proposed", "Approved", "Rejected", "Executed"];

  // Unique agents present in the log, for the agent filter.
  const agents: string[] = [...new Set(log.map((e) => e.agent))].sort();

  let kindFilter = $state<LogKind | "All">("All");
  let agentFilter = $state<string>("All");

  // Newest-first, read-only timeline narrowed by the active filters.
  const entries = $derived(
    log.filter(
      (e) =>
        (kindFilter === "All" || e.kind === kindFilter) &&
        (agentFilter === "All" || e.agent === agentFilter),
    ),
  );

  function setKind(k: LogKind | "All"): void {
    kindFilter = k;
  }
  function setAgent(a: string): void {
    agentFilter = a;
  }

  const pillBase =
    "px-4 py-1.5 rounded-full text-body-sm font-medium transition-colors cursor-pointer";
  const pillActive = "bg-primary/10 text-primary border border-primary/20";
  const pillIdle =
    "bg-surface-container-high text-on-surface-variant border border-white/5 hover:text-on-surface";
</script>

<div class="p-margin-page max-w-7xl mx-auto">
  <!-- Page header -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
    <div>
      <h2 class="font-headline-lg text-headline-lg text-on-surface mb-2">Event Log</h2>
      <p class="text-on-surface-variant font-body-sm max-w-xl">
        A complete historical trace of system operations, agent communications, and protocol
        executions across the Metis network.
      </p>
    </div>
    <div class="flex items-center gap-3 shrink-0">
      <!-- Chain verified pill -->
      <div
        class="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high rounded-full border border-white/5"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-confirm"></span>
        <span class="font-label-mono text-label-mono text-confirm uppercase tracking-wide">
          Chain verified &#x2713;
        </span>
      </div>
      <span class="font-label-mono text-label-mono text-on-surface-variant">
        {entries.length} / {log.length}
      </span>
    </div>
  </div>

  <!-- Filter rows: by kind, then by agent -->
  <div class="flex flex-col gap-3 mb-6">
    <div class="flex items-center gap-2 flex-wrap">
      <span class="font-label-mono text-label-mono text-outline uppercase tracking-wide w-16"
        >Kind</span
      >
      <button class="{pillBase} {kindFilter === 'All' ? pillActive : pillIdle}" onclick={() => setKind("All")}>
        All
      </button>
      {#each KINDS as kind}
        <button
          class="{pillBase} {kindFilter === kind ? pillActive : pillIdle}"
          onclick={() => setKind(kind)}
        >
          {kind}
        </button>
      {/each}
    </div>

    <div class="flex items-center gap-2 flex-wrap">
      <span class="font-label-mono text-label-mono text-outline uppercase tracking-wide w-16"
        >Agent</span
      >
      <button
        class="{pillBase} {agentFilter === 'All' ? pillActive : pillIdle}"
        onclick={() => setAgent("All")}
      >
        All
      </button>
      {#each agents as agent}
        <button
          class="{pillBase} {agentFilter === agent ? pillActive : pillIdle}"
          onclick={() => setAgent(agent)}
        >
          {agent}
        </button>
      {/each}
    </div>
  </div>

  <!-- Glass timeline table: newest first, read-only -->
  <div class="bg-surface-container-lowest/50 rounded-[32px] p-gutter glass-panel">
    <table class="w-full border-separate border-spacing-y-3">
      <thead>
        <tr class="text-left font-label-mono text-label-mono text-outline uppercase tracking-wide">
          <th class="font-normal px-5 pb-1">Kind</th>
          <th class="font-normal px-5 pb-1">Agent</th>
          <th class="font-normal px-5 pb-1 w-full">Event</th>
          <th class="font-normal px-5 pb-1 text-right whitespace-nowrap">Time</th>
          <th class="font-normal px-5 pb-1 text-right whitespace-nowrap">Hash</th>
        </tr>
      </thead>
      <tbody>
        {#each entries as entry (entry.id)}
          <tr class="bg-surface-container-high/40 hover:bg-surface-container-high transition-colors group">
            <!-- Kind badge + chain node -->
            <td class="px-5 py-4 rounded-l-2xl border-y border-l border-white/5 align-top">
              <div class="flex items-center gap-3">
                <span class="w-2 h-2 rounded-full shrink-0 {KIND_DOT[entry.kind]}"></span>
                <span
                  class="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap {KIND_BADGE[entry.kind]}"
                >
                  {entry.kind}
                </span>
              </div>
            </td>

            <!-- Agent -->
            <td class="px-5 py-4 border-y border-white/5 align-top whitespace-nowrap">
              <span class="font-label-mono text-label-mono text-on-surface-variant">{entry.agent}</span>
            </td>

            <!-- Message + id -->
            <td class="px-5 py-4 border-y border-white/5 align-top">
              <p class="font-body-sm text-on-surface">{entry.message}</p>
              <p class="font-label-mono text-label-mono text-outline mt-1">{entry.id}</p>
            </td>

            <!-- Timestamp -->
            <td class="px-5 py-4 border-y border-white/5 align-top text-right whitespace-nowrap">
              <span class="font-label-mono text-label-mono text-on-surface-variant">{entry.ts}</span>
            </td>

            <!-- Hash fragment -->
            <td
              class="px-5 py-4 rounded-r-2xl border-y border-r border-white/5 align-top text-right whitespace-nowrap"
            >
              <span class="font-label-mono text-label-mono text-outline">sha256:{entry.hash}</span>
            </td>
          </tr>
        {/each}

        {#if entries.length === 0}
          <tr>
            <td colspan="5" class="text-center py-12">
              <span class="font-body-sm text-on-surface-variant"
                >No entries match the current filters.</span
              >
            </td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
</div>
