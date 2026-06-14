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

<div class="p-6 max-w-4xl mx-auto space-y-4">
  <!-- Header -->
  <div
    class="flex justify-between items-end pb-3 border-b border-outline-variant px-1"
  >
    <div>
      <h2
        class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-primary">rule</span>
        Queue Authorization
      </h2>
      <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">
        {items.length === 0
          ? "No agent proposals require human-in-the-loop validation."
          : `Reviewing ${items.length} agent ${items.length === 1 ? "proposal" : "proposals"} requiring human-in-the-loop validation.`}
      </p>
    </div>
    <div class="flex items-center gap-3 shrink-0">
      {#if resolvedCount > 0}
        <span class="font-mono-sm text-mono-sm text-outline">
          {approvedCount} approved · {rejectedCount} rejected
        </span>
      {/if}
      <span
        class="px-3 py-1 bg-primary text-on-primary font-label-caps text-label-caps uppercase rounded-sm"
      >
        Pending ({items.length})
      </span>
    </div>
  </div>

  <!-- Queue items -->
  {#each items as item (item.id)}
    <div
      class="border border-outline-variant bg-surface-container-low rounded-lg overflow-hidden flex flex-col"
    >
      <!-- Card header -->
      <div
        class="p-3 flex items-center justify-between border-b border-outline-variant bg-surface-container"
      >
        <div class="flex items-center gap-3 min-w-0">
          <span class="material-symbols-outlined text-primary">{item.icon}</span>
          <span class="font-label-caps text-[10px] text-outline shrink-0"
            >{item.agentLabel}</span
          >
          <span
            class="bg-surface-container-highest text-outline px-1.5 py-0.5 rounded-sm text-[10px] font-bold shrink-0"
            >{item.id}</span
          >
          <TierBadge tier={item.tier} />
        </div>
        <span class="font-mono-md text-mono-md text-on-surface-variant shrink-0"
          >{item.ts}</span
        >
      </div>

      <!-- Card body -->
      <div class="p-4">
        <h3 class="font-body-md font-semibold text-on-surface mb-3">
          {item.summary}
        </h3>

        <!-- Expandable preview of untrusted content -->
        <button
          class="flex items-center gap-1.5 font-mono-sm text-mono-sm text-on-surface-variant hover:text-on-surface transition-colors mb-2"
          onclick={() => toggle(item.id)}
          aria-expanded={expanded[item.id] ? "true" : "false"}
        >
          <span class="material-symbols-outlined text-[16px]">
            {expanded[item.id] ? "expand_less" : "expand_more"}
          </span>
          {expanded[item.id] ? "Hide preview" : "Show preview"}
        </button>

        {#if expanded[item.id]}
          <div
            class="mb-4 bg-surface-container-lowest border border-outline-variant p-3 rounded"
          >
            <p
              class="font-mono-sm text-mono-sm text-on-surface-variant mb-1 uppercase tracking-tighter opacity-50"
            >
              Content Preview
            </p>
            <!-- Untrusted: render as plain text only, never {@html}. -->
            <pre
              class="font-mono-md text-mono-md text-on-surface leading-relaxed whitespace-pre-wrap break-words">{item.detail}</pre>
          </div>
        {/if}

        <!-- Actions: review-and-approve only -->
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-1.5 border border-outline-variant text-on-surface-variant font-label-caps text-label-caps uppercase hover:bg-error/10 hover:text-error hover:border-error/30 transition-colors rounded-sm"
            onclick={() => reject(item)}
          >
            Reject
          </button>
          <button
            class="px-4 py-1.5 bg-primary text-on-primary font-label-caps text-label-caps uppercase font-bold hover:opacity-90 transition-opacity rounded-sm"
            onclick={() => approve(item)}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  {/each}

  <!-- Empty state -->
  {#if items.length === 0}
    <div
      class="border border-dashed border-outline-variant rounded-lg p-12 flex flex-col items-center justify-center text-center gap-3 text-on-surface-variant"
    >
      <span class="material-symbols-outlined text-4xl text-outline"
        >task_alt</span
      >
      <p class="font-body-md text-body-md text-on-surface">
        Nothing waiting for approval.
      </p>
      {#if resolvedCount > 0}
        <p class="font-mono-sm text-mono-sm text-outline uppercase tracking-widest">
          {approvedCount} approved · {rejectedCount} rejected this session
        </p>
      {/if}
      <button
        class="mt-2 px-3 py-1.5 border border-outline-variant text-on-surface-variant font-label-caps text-label-caps uppercase hover:bg-surface-container hover:text-on-surface transition-colors rounded-sm"
        onclick={() => currentView.set("log")}
      >
        View Event Log
      </button>
    </div>
  {/if}
</div>
