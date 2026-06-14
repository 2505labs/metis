<script lang="ts">
  import { agents, queue, log } from "../mock";
  import { currentView, type ViewId } from "../nav";
  import AgentCard from "../components/AgentCard.svelte";
  import TierBadge from "../components/TierBadge.svelte";

  const recent = log.slice(0, 9);

  function openAgent(kind: string) {
    currentView.set(kind as ViewId);
  }
</script>

<div class="p-6 space-y-6">
  <!-- System Overview -->
  <section>
    <div class="flex items-center justify-between mb-3 px-1">
      <h2
        class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-primary">analytics</span>
        System Overview
      </h2>
      <span class="font-mono-sm text-mono-sm text-outline">AUTO_REFRESH: 500MS</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {#each agents as agent (agent.kind)}
        <AgentCard {agent} onOpen={() => openAgent(agent.kind)} />
      {/each}
    </div>
  </section>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
    <!-- Pending Approvals -->
    <section class="flex flex-col h-full min-h-[400px]">
      <div class="flex items-center justify-between mb-3 px-1">
        <h2
          class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-primary">rule</span>
          Pending Approvals
        </h2>
        <button
          class="text-body-sm text-primary hover:underline"
          onclick={() => currentView.set("queue")}>View all</button
        >
      </div>
      <div
        class="bg-surface-container-low border border-outline-variant flex-1 overflow-hidden flex flex-col"
      >
        <div class="overflow-y-auto">
          {#each queue as item (item.id)}
            <div
              class="flex items-center gap-4 p-3 border-b border-outline-variant hover:bg-surface-container transition-colors"
            >
              <div
                class="flex items-center justify-center w-10 h-10 bg-surface-container-highest border border-outline-variant shrink-0"
              >
                <span class="material-symbols-outlined text-primary">{item.icon}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-label-caps text-[10px] text-outline"
                    >{item.agentLabel}</span
                  >
                  <span
                    class="bg-surface-container-highest text-outline px-1.5 py-0.5 rounded-sm text-[10px] font-bold"
                    >{item.id}</span
                  >
                </div>
                <p class="text-body-sm text-on-surface truncate">{item.summary}</p>
              </div>
              <div class="flex flex-col items-end gap-2 shrink-0">
                <TierBadge tier={item.tier} />
                <button
                  class="bg-transparent border border-outline-variant text-on-surface-variant font-bold text-[11px] px-3 py-1 rounded-sm hover:border-outline hover:text-on-surface transition-all"
                  onclick={() => currentView.set("queue")}>Review</button
                >
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- Recent Activity -->
    <section class="flex flex-col h-full min-h-[400px]">
      <div class="flex items-center justify-between mb-3 px-1">
        <h2
          class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-primary">receipt_long</span>
          Recent Activity
        </h2>
        <button
          class="text-body-sm text-primary hover:underline"
          onclick={() => currentView.set("log")}>Full log</button
        >
      </div>
      <div
        class="bg-surface-container-low border border-outline-variant flex-1 overflow-hidden font-mono-sm text-mono-sm p-4 leading-relaxed"
      >
        <div class="space-y-1.5 overflow-y-auto h-full pr-2">
          {#each recent as e, i (e.id)}
            <div class="flex gap-3" style="opacity: {Math.max(0.3, 1 - i * 0.07)}">
              <span class="text-outline shrink-0">[{e.ts}]</span>
              <span class="text-primary shrink-0">[{e.id}]</span>
              <span class="text-on-surface">{e.agent}: {e.message}</span>
            </div>
          {/each}
        </div>
      </div>
    </section>
  </div>
</div>
