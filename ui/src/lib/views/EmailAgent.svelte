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

  function selectThread(t: (typeof threads)[number]) {
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

<div class="flex-1 flex min-h-0 h-full">
  <!-- Left column: draft proposals + inbound thread list -->
  <div class="flex-1 flex flex-col min-w-0 border-r border-outline-variant overflow-y-auto">
    <!-- Draft Proposals -->
    <section class="p-4 border-b border-outline-variant bg-surface-container-low/50">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">auto_awesome</span>
          <h2 class="font-label-caps text-label-caps text-outline uppercase">Draft Proposals</h2>
        </div>
        <span class="text-mono-sm text-primary">{drafts.length} AUTO-GENERATED</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        {#each drafts as draft (draft.id)}
          <div class="bg-surface border border-outline-variant p-3 rounded hover:border-primary transition-colors">
            <div class="flex justify-between items-start mb-2">
              <span class="font-mono-sm text-outline">{draft.id}</span>
              <span class="text-label-caps px-2 py-0.5 bg-secondary-container text-secondary rounded"
                >{draft.confidence}% Confidence</span
              >
            </div>
            <h3 class="text-body-md font-bold mb-1 truncate">{draft.subject}</h3>
            <p class="text-body-sm text-on-surface-variant line-clamp-2 mb-3">{draft.snippet}</p>
            <div class="flex gap-2">
              <button
                type="button"
                onclick={queueDraft}
                class="flex-1 py-1.5 border border-outline-variant text-body-sm hover:bg-surface-container transition-all"
                >Review Draft</button
              >
              <button
                type="button"
                onclick={queueDraft}
                class="px-3 py-1.5 bg-primary text-on-primary font-bold text-body-sm rounded hover:opacity-90 transition-opacity"
                >Send to Confirm Queue</button
              >
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- High-priority inbound (observe / read-only) -->
    <section class="flex-1 flex flex-col p-4 min-h-0">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-error">priority_high</span>
          <h2 class="font-label-caps text-label-caps text-outline uppercase">High-Priority Inbound</h2>
        </div>
        <div class="flex gap-2">
          <button type="button" class="text-mono-sm border border-outline-variant px-2 py-0.5 text-on-surface-variant">FILTER: URGENT</button>
          <button type="button" class="text-mono-sm border border-outline-variant px-2 py-0.5 text-on-surface-variant">SORT: RELEVANCE</button>
        </div>
      </div>
      <div class="border border-outline-variant bg-surface flex-1 overflow-y-auto flex flex-col min-h-0">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container text-outline border-b border-outline-variant">
              <th class="px-3 py-2 font-label-caps text-label-caps uppercase w-32">Status</th>
              <th class="px-3 py-2 font-label-caps text-label-caps uppercase">Sender</th>
              <th class="px-3 py-2 font-label-caps text-label-caps uppercase">Subject</th>
              <th class="px-3 py-2 font-label-caps text-label-caps uppercase w-24">Hash</th>
            </tr>
          </thead>
          <tbody class="text-body-sm divide-y divide-outline-variant">
            {#each threads as t (t.id)}
              <tr
                onclick={() => selectThread(t)}
                class="hover:bg-surface-container-low transition-colors cursor-pointer {t.id === selectedId ? 'bg-surface-container-high border-l-2 border-primary' : ''}"
              >
                <td class="px-3 py-2">
                  {#if t.tier === "confirm"}
                    <span class="bg-confirm/10 text-confirm px-2 py-0.5 rounded text-label-caps uppercase">Confirm</span>
                  {:else}
                    <span class="bg-surface-variant text-outline px-2 py-0.5 rounded text-label-caps uppercase">Read-only</span>
                  {/if}
                </td>
                <td class="px-3 py-2 text-on-surface font-medium">
                  {#if t.unread}<span class="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-1.5 align-middle"></span>{/if}{t.sender}
                </td>
                <td class="px-3 py-2 text-on-surface-variant">{t.subject}</td>
                <td class="px-3 py-2 font-mono-sm text-outline">{t.id}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <!-- Right column: reading pane (observe, read-only) -->
  <aside class="w-96 bg-surface-container-lowest flex flex-col overflow-y-auto shrink-0">
    {#if selected}
      <div class="p-4 border-b border-outline-variant bg-surface-container-low">
        <div class="flex items-center justify-between mb-2">
          <h2 class="font-label-caps text-label-caps text-on-surface uppercase">Reading</h2>
          {#if selected.tier === "confirm"}
            <span class="bg-confirm/10 text-confirm px-2 py-0.5 rounded text-label-caps uppercase">Confirm</span>
          {:else}
            <span class="bg-surface-variant text-outline px-2 py-0.5 rounded text-label-caps uppercase">Read-only</span>
          {/if}
        </div>
        <h3 class="text-headline-sm font-headline-sm font-bold text-on-surface mb-1">{selected.subject}</h3>
        <div class="flex items-center justify-between text-body-sm text-on-surface-variant">
          <span class="font-medium text-on-surface">{selected.sender}</span>
          <span class="font-mono-sm text-outline">{selected.ts}</span>
        </div>
        <p class="font-mono-sm text-outline mt-1">{selected.id}</p>
      </div>

      <!-- Untrusted body — rendered as plain text only -->
      <div class="p-4 flex-1">
        <p class="text-body-md text-on-surface whitespace-pre-wrap break-words">{selected.body}</p>
      </div>

      {#if note}
        <div class="mx-4 mb-3 rounded border border-confirm/30 bg-confirm/5 p-3 flex items-start gap-2">
          <span class="material-symbols-outlined text-confirm" style="font-size:16px">schedule</span>
          <p class="text-body-sm text-confirm">{note}</p>
        </div>
      {/if}

      <!-- Safe-gate footer: no direct send path -->
      <div class="p-4 border-t border-outline-variant">
        <div class="flex gap-2 mb-3">
          <button
            type="button"
            onclick={proposeReply}
            class="flex-1 py-2 border border-outline-variant text-body-sm hover:bg-surface-container transition-colors flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined" style="font-size:16px">edit_note</span>
            Propose Draft Reply
          </button>
          <button
            type="button"
            onclick={queueDraft}
            class="px-3 py-2 bg-primary text-on-primary font-bold text-body-sm rounded hover:opacity-90 transition-opacity"
          >
            Open Confirm Queue
          </button>
        </div>
        <div class="rounded border border-primary/20 bg-primary/5 p-3">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-primary" style="font-size:16px">info</span>
            <span class="text-label-caps text-primary uppercase">Safe-Gate Mode</span>
          </div>
          <p class="text-body-sm text-on-surface-variant leading-relaxed">
            This agent observes only. Replies are drafted as proposals and routed to the Confirm Queue —
            nothing is sent without manual operator approval.
          </p>
        </div>
      </div>
    {:else}
      <div class="flex-1 flex items-center justify-center text-on-surface-variant text-body-sm p-6">
        Select a thread to read it.
      </div>
    {/if}
  </aside>
</div>
