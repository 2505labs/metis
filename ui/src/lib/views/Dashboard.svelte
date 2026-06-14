<script lang="ts">
  import { agents, log } from "../mock";
  import { currentView, type ViewId } from "../nav";
  import AgentCard from "../components/AgentCard.svelte";
  import type { LogKind } from "../types";

  const rows = log.slice(0, 6);

  function openAgent(kind: string) {
    currentView.set(kind as ViewId);
  }

  const statusBadge: Record<LogKind, string> = {
    Observed: "bg-secondary-container/40 text-on-secondary-container",
    Proposed: "bg-confirm/10 text-confirm",
    Approved: "bg-primary/10 text-primary",
    Executed: "bg-primary/10 text-primary",
    Rejected: "bg-error-container/30 text-error",
  };

  const entityColor: Record<string, string> = {
    CALENDAR_AGENT: "text-primary",
    EMAIL_AGENT: "text-tertiary",
    FILES_AGENT: "text-secondary",
  };
</script>

<div class="p-margin-page max-w-7xl mx-auto">
  <header class="mb-10">
    <h2 class="font-headline-lg text-headline-lg text-on-surface">Agent Dashboard</h2>
    <p class="text-on-surface-variant">Monitoring 3 active autonomous entities</p>
  </header>

  <!-- Agent bento grid -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {#each agents as agent (agent.kind)}
      <AgentCard {agent} onOpen={() => openAgent(agent.kind)} />
    {/each}
  </div>

  <!-- Operational Log -->
  <section
    class="mt-12 bg-surface-container-lowest/50 rounded-[32px] p-gutter glass-panel"
  >
    <div class="flex items-center justify-between mb-8">
      <h4 class="font-title-md text-title-md text-on-surface">Operational Log</h4>
      <button
        type="button"
        onclick={() => currentView.set("log")}
        class="text-primary font-label-mono text-label-mono hover:underline flex items-center gap-1"
      >
        Full log
        <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
      </button>
    </div>
    <div class="overflow-x-auto custom-scrollbar">
      <table class="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr
            class="text-on-surface-variant font-label-mono text-label-mono uppercase tracking-wider"
          >
            <th class="pb-2 px-4">Timestamp</th>
            <th class="pb-2 px-4">Entity</th>
            <th class="pb-2 px-4">Action Type</th>
            <th class="pb-2 px-4">Subject</th>
            <th class="pb-2 px-4">Hash</th>
            <th class="pb-2 px-4">Status</th>
          </tr>
        </thead>
        <tbody class="font-body-sm">
          {#each rows as e (e.id)}
            <tr
              class="bg-surface-container-high/40 hover:bg-surface-container-high transition-colors"
            >
              <td class="py-4 px-4 rounded-l-2xl font-label-mono text-on-surface-variant"
                >{e.ts}</td
              >
              <td class="py-4 px-4 font-bold {entityColor[e.agent] ?? 'text-on-surface'}"
                >{e.agent}</td
              >
              <td class="py-4 px-4 text-on-surface-variant">{e.kind}</td>
              <td class="py-4 px-4 text-on-surface">{e.message}</td>
              <td class="py-4 px-4 font-label-mono text-on-surface-variant">{e.hash}</td>
              <td class="py-4 px-4 rounded-r-2xl">
                <span
                  class="px-3 py-1 rounded-full text-[11px] font-bold uppercase {statusBadge[
                    e.kind
                  ]}">{e.kind}</span
                >
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</div>
