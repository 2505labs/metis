<script lang="ts">
  import { queue } from "../mock";
  import { currentView } from "../nav";
  import type { QueueItem } from "../types";
  import TierBadge from "../components/TierBadge.svelte";

  // Local working list, seeded from the shared mock. Approving/rejecting
  // removes the item here only (no backend wiring yet).
  let items = $state<QueueItem[]>([...queue]);
  let expanded = $state<Record<string, boolean>>({});

  let approvedCount = $state(0);
  let rejectedCount = $state(0);
  let resolvedCount = $derived(approvedCount + rejectedCount);

  function toggle(id: string) {
    expanded[id] = !expanded[id];
  }

  function resolve(id: string) {
    items = items.filter((it) => it.id !== id);
    delete expanded[id];
  }

  function approve(item: QueueItem) {
    approvedCount += 1;
    resolve(item.id);
  }

  function reject(item: QueueItem) {
    rejectedCount += 1;
    resolve(item.id);
  }
</script>

<div class="p-margin-page max-w-7xl mx-auto">
  <!-- Header -->
  <div class="flex items-end justify-between mb-10">
    <div>
      <h2 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">
        Confirm Queue
      </h2>
      <p class="font-body-lg text-body-lg text-on-surface-variant mt-2">
        {items.length === 0
          ? "No agent proposals require human-in-the-loop validation."
          : `Reviewing ${items.length} agent ${items.length === 1 ? "proposal" : "proposals"} requiring human verification.`}
      </p>
    </div>
    <div class="flex items-center gap-4 shrink-0">
      {#if resolvedCount > 0}
        <span class="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest">
          {approvedCount} approved · {rejectedCount} rejected
        </span>
      {/if}
      <span
        class="px-4 py-2 rounded-full bg-primary text-on-primary font-label-mono uppercase tracking-widest text-[11px] font-bold"
      >
        Pending ({items.length})
      </span>
    </div>
  </div>

  <!-- Queue items -->
  <div class="grid grid-cols-1 gap-8">
    {#each items as item (item.id)}
      <div
        class="bg-surface-container-low/60 backdrop-blur-xl rounded-[32px] p-gutter glass-panel shadow-xl flex flex-col md:flex-row gap-8"
      >
        <!-- Left rail: icon + timestamp -->
        <div class="flex-none flex flex-col items-center">
          <div
            class="w-16 h-16 rounded-3xl bg-secondary-container flex items-center justify-center text-primary mb-4 shadow-xl"
          >
            <span class="material-symbols-outlined scale-125" style="font-variation-settings: 'FILL' 1;">
              {item.icon}
            </span>
          </div>
          <span class="font-label-mono text-[10px] text-primary/60 uppercase tracking-[0.2em]">
            {item.ts}
          </span>
        </div>

        <!-- Body -->
        <div class="flex-1 space-y-6 min-w-0">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h3 class="font-title-md text-title-md text-on-surface mb-2">
                {item.summary}
              </h3>
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-mono text-[10px] uppercase tracking-wide"
                >
                  Agent: {item.agentLabel}
                </span>
                <span
                  class="px-2 py-0.5 rounded-full bg-surface-container-high font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wide"
                >
                  {item.id}
                </span>
                <TierBadge tier={item.tier} />
              </div>
            </div>
          </div>

          <!-- Expandable preview of untrusted content -->
          <div>
            <button
              class="flex items-center gap-1.5 font-label-mono text-label-mono text-on-surface-variant hover:text-on-surface transition-colors"
              onclick={() => toggle(item.id)}
              aria-expanded={expanded[item.id] ? "true" : "false"}
            >
              <span class="material-symbols-outlined text-[18px]">
                {expanded[item.id] ? "expand_less" : "expand_more"}
              </span>
              {expanded[item.id] ? "Hide preview" : "Show preview"}
            </button>

            {#if expanded[item.id]}
              <div
                class="mt-3 rounded-2xl border border-white/5 bg-background/40 p-6"
              >
                <p
                  class="font-label-mono text-[10px] text-on-surface-variant mb-3 uppercase tracking-[0.2em] opacity-60"
                >
                  Content Preview
                </p>
                <!-- Untrusted: render as plain text only, never {@html}. -->
                <pre
                  class="font-label-mono text-label-mono text-on-surface leading-relaxed whitespace-pre-wrap break-words">{item.detail}</pre>
              </div>
            {/if}
          </div>

          <!-- Actions: review-and-approve only -->
          <div class="flex items-center gap-4 pt-2">
            <button
              class="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold active:scale-95 hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
              onclick={() => approve(item)}
            >
              Approve
            </button>
            <button
              class="px-8 py-3 rounded-xl bg-surface-container-high border border-white/10 text-on-surface-variant font-bold hover:bg-error/10 hover:text-error hover:border-error/30 transition-colors"
              onclick={() => reject(item)}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Empty state -->
  {#if items.length === 0}
    <div
      class="bg-surface-container-low/60 backdrop-blur-xl rounded-[32px] p-gutter glass-panel shadow-xl flex flex-col items-center justify-center text-center gap-4 py-16 text-on-surface-variant"
    >
      <div class="p-4 bg-primary/10 rounded-2xl text-primary">
        <span class="material-symbols-outlined scale-150">task_alt</span>
      </div>
      <p class="font-title-md text-title-md text-on-surface">
        Nothing waiting for approval.
      </p>
      {#if resolvedCount > 0}
        <p class="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest">
          {approvedCount} approved · {rejectedCount} rejected this session
        </p>
      {/if}
      <button
        class="mt-2 px-6 py-3 rounded-xl bg-surface-container-high border border-white/10 text-on-surface-variant font-bold hover:text-on-surface transition-colors"
        onclick={() => currentView.set("log")}
      >
        View Event Log
      </button>
    </div>
  {/if}
</div>
