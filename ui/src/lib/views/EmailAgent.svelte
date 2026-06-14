<script lang="ts">
  import { currentView } from "../nav";

  // Local mock data — UI-first build, no backend wiring yet.
  // NOTE: sender / subject / snippet / body are UNTRUSTED content.
  // They are always rendered as plain text — never {@html}.
  let threads = $state([
    {
      id: "0x8B...2E",
      sender: "Global SecOps",
      subject: "Intrusion Attempt [Node-77-Gamma]",
      snippet:
        "Detected repeated authentication failures against Node-77-Gamma. Requesting confirmation of rotation schedule.",
      body:
        "Operator,\n\nWe detected repeated authentication failures against Node-77-Gamma over the last 6 hours, originating from a block of addresses outside the approved range.\n\nWe recommend a 48-hour credential rotation schedule and a review of the affected node's access logs. Please advise on whether to proceed.\n\n— Global SecOps",
      ts: "08:42",
      unread: true,
      tier: "confirm",
    },
    {
      id: "0xA1...99",
      sender: "CTO Office",
      subject: "Weekly Sync: Compute Allocation",
      snippet:
        "Agenda for the weekly sync. Compute allocation for Q3 and the new training cluster budget.",
      body:
        "Hi,\n\nAgenda for this week's sync:\n- Compute allocation review for Q3\n- New training cluster budget\n- Headcount for the platform team\n\nNo action needed before the meeting. See you there.\n\n— CTO Office",
      ts: "Yesterday",
      unread: false,
      tier: "read-only",
    },
    {
      id: "0xFF...01",
      sender: "AWS-Internal",
      subject: "Resource Depletion Alert",
      snippet:
        "Your account is approaching the provisioned throughput limit on the primary cluster.",
      body:
        "Notice:\n\nYour account is approaching the provisioned throughput limit on the primary cluster (currently at 92% of allocation).\n\nConsider raising the limit or shedding load before the end of the billing cycle to avoid throttling.\n\n— AWS Internal Notifications",
      ts: "Yesterday",
      unread: true,
      tier: "confirm",
    },
    {
      id: "0x42...C0",
      sender: "Compliance Bot",
      subject: "GDPR Log Rotation Confirmation",
      snippet:
        "Log rotation completed successfully for the retention window. No personal data retained beyond policy.",
      body:
        "Automated message:\n\nLog rotation completed successfully for the configured retention window. No personal data was retained beyond the policy threshold.\n\nThis message is informational only.\n\n— Compliance Bot",
      ts: "2d ago",
      unread: false,
      tier: "read-only",
    },
  ]);

  type Thread = (typeof threads)[number];

  // Agent-proposed draft replies. These NEVER send directly — approving one
  // routes it to the Confirm Queue (Tier: Confirm) for human signature.
  let drafts = $state([
    {
      id: "#DRAFT-9921",
      subject: "Security Protocol Update [RE: Audit]",
      snippet:
        "Responding to the system vulnerability report from the external audit team. Suggesting a 48-hour rotation schedule...",
      confidence: 94,
    },
    {
      id: "#DRAFT-9922",
      subject: "Vendor SLA Negotiation",
      snippet:
        "Synthesized recent downtime logs to push for a 15% credit on the current billing cycle with the vendor...",
      confidence: 88,
    },
  ]);

  let selectedId = $state(threads[0].id);
  let selected = $derived(threads.find((t) => t.id === selectedId) ?? null);
  let note = $state("");

  function selectThread(t: Thread) {
    selectedId = t.id;
    t.unread = false;
    note = "";
  }

  // Draft-reply / approve actions are PROPOSALS only. There is no direct
  // compose-and-send path. They route to the Confirm Queue.
  function queueDraft() {
    currentView.set("queue");
  }

  function proposeReply() {
    note = "Draft reply queued for confirmation — it will only send after operator approval.";
  }
</script>

<div class="p-margin-page max-w-7xl mx-auto">
  <header class="mb-10 flex items-start justify-between gap-6">
    <div class="flex items-center gap-4">
      <div
        class="w-14 h-14 rounded-2xl bg-tertiary-container/20 text-tertiary flex items-center justify-center shrink-0"
      >
        <span class="material-symbols-outlined text-3xl">mail</span>
      </div>
      <div>
        <h2 class="font-headline-lg text-headline-lg text-on-surface">Email Agent</h2>
        <p class="text-on-surface-variant">
          Priority inbox synthesis — drafts are proposals, never sent without approval
        </p>
      </div>
    </div>
    <div
      class="flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full border border-white/5 shrink-0"
    >
      <div class="w-2 h-2 rounded-full bg-tertiary status-glow-idle"></div>
      <span class="font-label-mono text-label-mono text-on-surface uppercase">Safe-Gate</span>
    </div>
  </header>

  <!-- Two-pane glass layout: list left, reading pane right -->
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
    <!-- Left pane: draft proposals + inbound thread list -->
    <div
      class="lg:col-span-3 bg-surface-container-low/60 backdrop-blur-xl rounded-[32px] p-gutter glass-panel shadow-xl flex flex-col gap-8"
    >
      <!-- Draft Proposals -->
      <section>
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-tertiary text-[20px]">auto_awesome</span>
            <h3 class="font-title-md text-title-md text-on-surface">Draft Proposals</h3>
          </div>
          <span class="font-label-mono text-label-mono text-on-surface-variant uppercase"
            >{drafts.length} auto-generated</span
          >
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each drafts as draft (draft.id)}
            <div
              class="bg-surface-container-lowest/40 rounded-2xl p-4 border border-white/5 flex flex-col"
            >
              <div class="flex justify-between items-start mb-3">
                <span class="font-label-mono text-label-mono text-on-surface-variant">{draft.id}</span>
                <span
                  class="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-confirm/10 text-confirm"
                  >{draft.confidence}% Confidence</span
                >
              </div>
              <h4 class="font-body-lg text-on-surface font-bold mb-1 truncate">{draft.subject}</h4>
              <p class="font-body-sm text-on-surface-variant line-clamp-2 mb-4">{draft.snippet}</p>
              <div class="flex gap-2 mt-auto">
                <button
                  type="button"
                  onclick={queueDraft}
                  class="flex-1 bg-surface-container-high border border-white/10 rounded-xl py-2 font-body-sm text-on-surface hover:bg-surface-container-highest transition-colors active:scale-95"
                  >Review Draft</button
                >
                <button
                  type="button"
                  onclick={queueDraft}
                  class="bg-primary text-on-primary font-bold rounded-xl px-4 py-2 font-body-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-transform"
                  >To Confirm Queue</button
                >
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- High-priority inbound (observe / read-only) -->
      <section>
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-error text-[20px]">priority_high</span>
            <h3 class="font-title-md text-title-md text-on-surface">High-Priority Inbound</h3>
          </div>
          <div class="flex gap-2">
            <span
              class="font-label-mono text-label-mono text-on-surface-variant uppercase bg-surface-container-high rounded-full px-3 py-1 border border-white/5"
              >Urgent</span
            >
            <span
              class="font-label-mono text-label-mono text-on-surface-variant uppercase bg-surface-container-high rounded-full px-3 py-1 border border-white/5"
              >Relevance</span
            >
          </div>
        </div>
        <div class="space-y-3">
          {#each threads as t (t.id)}
            <button
              type="button"
              onclick={() => selectThread(t)}
              class="w-full text-left rounded-2xl p-4 border border-white/5 transition-colors {t.id ===
              selectedId
                ? 'bg-surface-container-high/60'
                : 'bg-surface-container-lowest/40 hover:bg-surface-container-high/60'}"
            >
              <div class="flex items-center justify-between gap-3 mb-2">
                <div class="flex items-center gap-2 min-w-0">
                  {#if t.unread}
                    <span class="inline-block w-2 h-2 rounded-full bg-tertiary shrink-0"></span>
                  {/if}
                  <span class="font-body-lg font-bold text-on-surface truncate">{t.sender}</span>
                </div>
                {#if t.tier === "confirm"}
                  <span
                    class="shrink-0 px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-confirm/10 text-confirm"
                    >Confirm</span
                  >
                {:else}
                  <span
                    class="shrink-0 px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-surface-container-high text-on-surface-variant border border-white/5"
                    >Read-only</span
                  >
                {/if}
              </div>
              <p class="font-body-sm text-on-surface mb-1 truncate">{t.subject}</p>
              <p class="font-body-sm text-on-surface-variant line-clamp-1 mb-2">{t.snippet}</p>
              <div class="flex items-center justify-between">
                <span class="font-label-mono text-label-mono text-on-surface-variant">{t.id}</span>
                <span class="font-label-mono text-label-mono text-outline">{t.ts}</span>
              </div>
            </button>
          {/each}
        </div>
      </section>
    </div>

    <!-- Right pane: reading pane (observe, read-only) -->
    <aside
      class="lg:col-span-2 bg-surface-container-low/60 backdrop-blur-xl rounded-[32px] p-gutter glass-panel shadow-xl flex flex-col"
    >
      {#if selected}
        <div class="flex items-center justify-between mb-4">
          <span class="font-label-mono text-label-mono text-on-surface-variant uppercase">Reading</span>
          {#if selected.tier === "confirm"}
            <span
              class="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-confirm/10 text-confirm"
              >Confirm</span
            >
          {:else}
            <span
              class="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-surface-container-high text-on-surface-variant border border-white/5"
              >Read-only</span
            >
          {/if}
        </div>

        <div class="bg-surface-container-lowest/40 rounded-2xl p-4 border border-white/5 mb-4">
          <h3 class="font-title-md text-title-md text-on-surface mb-3">{selected.subject}</h3>
          <div class="flex items-center justify-between gap-3">
            <span class="font-body-sm font-bold text-on-surface truncate">{selected.sender}</span>
            <span class="font-label-mono text-label-mono text-outline shrink-0">{selected.ts}</span>
          </div>
          <p class="font-label-mono text-label-mono text-on-surface-variant mt-1">{selected.id}</p>
        </div>

        <!-- Untrusted body — rendered as plain text only -->
        <div class="bg-surface-container-lowest/40 rounded-2xl p-4 border border-white/5 mb-4 flex-1">
          <p class="font-body-lg text-on-surface whitespace-pre-wrap break-words">{selected.body}</p>
        </div>

        {#if note}
          <div
            class="rounded-2xl border border-confirm/30 bg-confirm/10 p-4 mb-4 flex items-start gap-2"
          >
            <span class="material-symbols-outlined text-confirm text-[16px]">schedule</span>
            <p class="font-body-sm text-confirm">{note}</p>
          </div>
        {/if}

        <!-- Safe-gate footer: no direct send path -->
        <div class="flex gap-2 mb-4">
          <button
            type="button"
            onclick={proposeReply}
            class="flex-1 bg-surface-container-high border border-white/10 rounded-xl py-2.5 font-body-sm text-on-surface hover:bg-surface-container-highest transition-colors active:scale-95 flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-[16px]">edit_note</span>
            Propose Draft Reply
          </button>
          <button
            type="button"
            onclick={queueDraft}
            class="bg-primary text-on-primary font-bold rounded-xl px-5 py-2.5 font-body-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-transform"
          >
            Confirm Queue
          </button>
        </div>

        <div class="rounded-2xl border border-white/5 bg-surface-container-lowest/40 p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-tertiary text-[16px]">shield</span>
            <span class="font-label-mono text-label-mono text-tertiary uppercase">Safe-Gate Mode</span>
          </div>
          <p class="font-body-sm text-on-surface-variant leading-relaxed">
            This agent observes only. Replies are drafted as proposals and routed to the Confirm
            Queue — nothing is sent without manual operator approval.
          </p>
        </div>
      {:else}
        <div
          class="flex-1 flex items-center justify-center text-on-surface-variant font-body-sm p-6"
        >
          Select a thread to read it.
        </div>
      {/if}
    </aside>
  </div>
</div>
