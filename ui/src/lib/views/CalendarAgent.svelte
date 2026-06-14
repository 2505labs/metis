<script lang="ts">
  import { currentView } from "../nav";

  // Local mock data. All event text / attendee names are UNTRUSTED:
  // rendered as plain text only, never {@html}.
  interface CalEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    attendees: string[];
    location: string;
    status: "current" | "conflict" | "free" | "optimized" | "resolved" | "moved";
    note?: string;
  }

  // Current ("observed") state of the upcoming calendar — read-only.
  let currentEvents = $state<CalEvent[]>([
    {
      id: "evt_a",
      title: "Stakeholder Weekly Sync",
      start: "09:00",
      end: "10:30",
      attendees: ["Priya Nair", "Tom Becker"],
      location: "Conf Room A",
      status: "current",
    },
    {
      id: "evt_b",
      title: "Project X Deep Dive",
      start: "10:30",
      end: "11:30",
      attendees: ["Priya Nair", "Lena Ortiz", "Sam Cole"],
      location: "Conf Room B",
      status: "conflict",
      note: "Overlaps with: Q3 Planning",
    },
    {
      id: "evt_free",
      title: "Available Window",
      start: "13:00",
      end: "14:00",
      attendees: [],
      location: "—",
      status: "free",
    },
  ]);

  // Proposed (optimized) layout the agent has DRAFTED. Applying it is a write,
  // so it must be routed to the Confirm Queue — never applied directly here.
  let proposedEvents = $state<CalEvent[]>([
    {
      id: "evt_a",
      title: "Stakeholder Weekly Sync",
      start: "09:00",
      end: "10:00",
      attendees: ["Priya Nair", "Tom Becker"],
      location: "Conf Room A",
      status: "optimized",
    },
    {
      id: "evt_b",
      title: "Project X Deep Dive",
      start: "10:00",
      end: "11:30",
      attendees: ["Priya Nair", "Lena Ortiz", "Sam Cole"],
      location: "Conf Room B",
      status: "resolved",
      note: "+15m Gap",
    },
    {
      id: "evt_c",
      title: "Q3 Planning",
      start: "11:45",
      end: "12:45",
      attendees: ["Tom Becker", "Sam Cole"],
      location: "Conf Room A",
      status: "moved",
    },
  ]);

  interface Resolution {
    id: string;
    tag: string;
    tagClass: string;
    title: string;
    detail: string;
  }

  // Proposed actions awaiting human validation. These are WRITES (Tier: Confirm)
  // so "Confirm" does NOT execute here — it hands off to the Confirm Queue.
  let resolutions = $state<Resolution[]>([
    {
      id: "ID_882",
      tag: "Priority_High",
      tagClass: "bg-tertiary-container/20 text-tertiary",
      title: "Resolve meeting overlap with Project X",
      detail: "Metis proposes shifting 'Q3 Planning' to 14:00 to clear the 11:30 slot.",
    },
    {
      id: "ID_883",
      tag: "Batch_Move",
      tagClass: "bg-surface-container-high text-on-surface-variant",
      title: "Consolidate Morning Deep-Work",
      detail: "Relocate 3 small admin tasks to Tuesday to create a 4-hour focus block.",
    },
    {
      id: "ID_885",
      tag: "Conflict_Found",
      tagClass: "bg-error-container/20 text-error",
      title: "Flight CX882 Arrival vs. Sync",
      detail: "Travel time to office exceeds availability. Metis suggests switching to Remote.",
    },
  ]);

  const observationLog = $state<{ ts: string; tag: string; tagClass: string; msg: string }[]>([
    { ts: "[2023-10-24 08:42:12]", tag: "SCAN", tagClass: "text-primary", msg: "Initiating event crawl for user_prime..." },
    { ts: "[2023-10-24 08:42:15]", tag: "IDENT", tagClass: "text-primary", msg: "Found 42 calendar entries in Gmail Cluster." },
    { ts: "[2023-10-24 08:42:18]", tag: "WARN", tagClass: "text-error", msg: "Direct conflict detected at 10:30 UTC." },
    { ts: "[2023-10-24 08:42:19]", tag: "EXEC", tagClass: "text-primary", msg: "Heuristic engine calculating optimal gap distribution..." },
    { ts: "[2023-10-24 08:42:21]", tag: "META", tagClass: "text-on-surface", msg: "Event_UID: 99x-z2 | Status: To_Be_Rescheduled" },
    { ts: "[2023-10-24 08:42:23]", tag: "SCAN", tagClass: "text-primary", msg: "Analyzing participant availability for 'Project X Deep Dive'" },
    { ts: "[2023-10-24 08:42:25]", tag: "FOUND", tagClass: "text-primary", msg: "3/4 participants have 11:30 free." },
    { ts: "[2023-10-24 08:42:28]", tag: "META", tagClass: "text-on-surface", msg: "Delta_Applied: +30m Shift" },
    { ts: "[2023-10-24 08:42:30]", tag: "SCAN", tagClass: "text-primary", msg: "Waiting for operator validation on high-risk shifts..." },
  ]);

  let selectedResolution = $state<string | null>(null);
  let queuedNote = $state<string | null>(null);

  // Selecting an event in the read-only list ("read event details").
  let selectedEvent = $state<string | null>(null);

  // PROPOSE → never writes directly. Hands the draft to the Confirm Queue.
  function proposeToQueue(label: string) {
    queuedNote = `${label} queued for confirmation`;
    currentView.set("queue");
  }

  function showQueuedNote(label: string) {
    queuedNote = `${label} queued for confirmation`;
  }
</script>

<div class="p-margin-page max-w-7xl mx-auto">
  <header class="mb-10 flex items-start gap-4">
    <div
      class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"
    >
      <span class="material-symbols-outlined text-3xl">calendar_month</span>
    </div>
    <div class="flex-1">
      <div class="flex items-center gap-3">
        <h2 class="font-headline-lg text-headline-lg text-on-surface">Calendar Agent</h2>
        <div
          class="flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full border border-white/5"
        >
          <div class="w-2 h-2 rounded-full bg-primary status-glow-active animate-pulse"></div>
          <span class="font-label-mono text-label-mono text-on-surface uppercase">Observing</span>
        </div>
      </div>
      <p class="text-on-surface-variant">
        Schedule optimization · analysis of 14 conflict points in the upcoming 72 hours
      </p>
    </div>
  </header>

  <div class="grid grid-cols-12 gap-8">
    <!-- Left Column: Proposed Schedule Optimization -->
    <div class="col-span-12 lg:col-span-8 flex flex-col gap-8">
      <section
        class="bg-surface-container-low/60 backdrop-blur-xl rounded-[32px] p-gutter glass-panel shadow-xl flex flex-col"
      >
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="font-title-md text-title-md text-on-surface">Schedule Optimization</h3>
            <p class="text-on-surface-variant font-body-sm">
              Metis Engine: Analysis of 14 conflict points in the upcoming 72 hours.
            </p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button
              type="button"
              class="bg-surface-container-high border border-white/10 rounded-xl text-on-surface font-label-mono text-label-mono uppercase px-4 py-2.5 hover:scale-[1.02] active:scale-95 transition-transform"
              onclick={() => showQueuedNote("Export draft")}
            >Export_JSON</button>
            <!-- Applying the optimization is a WRITE → route to Confirm Queue -->
            <button
              type="button"
              class="bg-primary text-on-primary font-bold rounded-xl px-5 py-2.5 active:scale-95 hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20 flex items-center gap-1"
              onclick={() => proposeToQueue("Schedule optimization")}
            >
              Propose All
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {#if queuedNote}
          <div
            class="mb-6 flex items-center gap-2 px-4 py-3 bg-confirm/10 border border-confirm/40 text-confirm font-body-sm rounded-2xl"
            role="status"
          >
            <span class="material-symbols-outlined text-[18px]">schedule_send</span>
            <span>{queuedNote} — proposed actions are sent to the Confirm Queue for human approval.</span>
          </div>
        {/if}

        <!-- Side-by-Side Comparison -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Current Calendar (observed, read-only) -->
          <div class="bg-surface-container-lowest/40 rounded-2xl p-4 border border-white/5">
            <div class="flex items-center gap-2 mb-4">
              <span class="font-label-mono text-label-mono text-on-surface-variant bg-surface-container-high rounded-full border border-white/5 px-3 py-1 uppercase">Current State</span>
              <span class="font-label-mono text-label-mono text-error uppercase">3 Conflicts</span>
            </div>
            <div class="space-y-2">
              {#each currentEvents as ev (ev.id)}
                {#if ev.status === "conflict"}
                  <button
                    type="button"
                    class="w-full text-left bg-error/5 border-l-2 border-error rounded-xl p-3 hover:bg-error/10 transition-colors"
                    onclick={() => (selectedEvent = ev.id)}
                  >
                    <div class="flex justify-between font-label-mono text-label-mono text-error mb-1 uppercase">
                      <span>{ev.start} - {ev.end}</span>
                      <span>Conflict</span>
                    </div>
                    <p class="font-body-sm font-semibold text-on-surface">{ev.title}</p>
                    {#if ev.note}
                      <p class="text-[11px] text-error/80 mt-1">{ev.note}</p>
                    {/if}
                  </button>
                {:else if ev.status === "free"}
                  <div class="bg-surface-container-high/40 border-l-2 border-outline rounded-xl p-3 opacity-50">
                    <div class="flex justify-between font-label-mono text-label-mono text-on-surface-variant mb-1 uppercase">
                      <span>{ev.start} - {ev.end}</span>
                      <span>Free</span>
                    </div>
                    <p class="font-body-sm italic text-on-surface-variant">{ev.title}</p>
                  </div>
                {:else}
                  <button
                    type="button"
                    class="w-full text-left bg-surface-container-high/40 border-l-2 border-outline rounded-xl p-3 hover:bg-surface-container-high transition-colors"
                    onclick={() => (selectedEvent = ev.id)}
                  >
                    <div class="flex justify-between font-label-mono text-label-mono text-on-surface-variant mb-1 uppercase">
                      <span>{ev.start} - {ev.end}</span>
                      <span>Conf_A</span>
                    </div>
                    <p class="font-body-sm font-semibold text-on-surface">{ev.title}</p>
                  </button>
                {/if}
              {/each}
            </div>
          </div>

          <!-- Proposed Calendar (draft only) -->
          <div class="bg-surface-container-lowest/40 rounded-2xl p-4 border border-white/5">
            <div class="flex items-center gap-2 mb-4">
              <span class="font-label-mono text-label-mono text-primary bg-primary/10 rounded-full border border-white/5 px-3 py-1 uppercase">Proposed (v2.1)</span>
              <span class="font-label-mono text-label-mono text-primary uppercase">0 Conflicts</span>
            </div>
            <div class="space-y-2">
              {#each proposedEvents as ev (ev.id)}
                {#if ev.status === "optimized"}
                  <div class="bg-surface-container-high/40 border-l-2 border-primary/50 rounded-xl p-3">
                    <div class="flex justify-between font-label-mono text-label-mono text-primary mb-1 uppercase">
                      <span>{ev.start} - {ev.end}</span>
                      <span>Optimized</span>
                    </div>
                    <p class="font-body-sm font-semibold text-on-surface">{ev.title}</p>
                  </div>
                {:else if ev.status === "resolved"}
                  <div class="bg-primary/5 border-l-2 border-primary rounded-xl p-3">
                    <div class="flex justify-between font-label-mono text-label-mono text-primary mb-1 uppercase">
                      <span>{ev.start} - {ev.end}</span>
                      <span>Resolved</span>
                    </div>
                    <p class="font-body-sm font-semibold text-on-surface">{ev.title}</p>
                    {#if ev.note}
                      <div class="flex gap-1 mt-2">
                        <span class="font-label-mono text-label-mono bg-primary/20 text-primary rounded-full border border-white/5 px-2 py-0.5 uppercase">{ev.note}</span>
                      </div>
                    {/if}
                  </div>
                {:else}
                  <div class="bg-primary/5 border-l-2 border-primary rounded-xl p-3">
                    <div class="flex justify-between font-label-mono text-label-mono text-primary mb-1 uppercase">
                      <span>{ev.start} - {ev.end}</span>
                      <span>Moved</span>
                    </div>
                    <p class="font-body-sm font-semibold text-on-surface">{ev.title}</p>
                  </div>
                {/if}
              {/each}
            </div>
          </div>
        </div>

        <!-- Selected event detail (read event details) -->
        {#if selectedEvent}
          {@const ev = currentEvents.find((e) => e.id === selectedEvent)}
          {#if ev}
            <div class="mt-4 bg-surface-container-lowest/40 rounded-2xl p-4 border border-white/5">
              <div class="flex justify-between items-start mb-3">
                <h4 class="font-body-lg font-bold text-on-surface">{ev.title}</h4>
                <button
                  type="button"
                  class="text-on-surface-variant hover:text-on-surface transition-colors"
                  aria-label="Close event details"
                  onclick={() => (selectedEvent = null)}
                >
                  <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-body-sm text-on-surface-variant">
                <dt class="font-label-mono text-label-mono text-on-surface-variant uppercase">Time</dt>
                <dd class="font-label-mono text-label-mono text-on-surface">{ev.start} - {ev.end}</dd>
                <dt class="font-label-mono text-label-mono text-on-surface-variant uppercase">Location</dt>
                <dd class="text-on-surface">{ev.location}</dd>
                <dt class="font-label-mono text-label-mono text-on-surface-variant uppercase">Attendees</dt>
                <dd class="text-on-surface">{ev.attendees.length ? ev.attendees.join(", ") : "—"}</dd>
              </dl>
            </div>
          {/if}
        {/if}
      </section>

      <!-- Observation Log (Bottom) -->
      <section
        class="bg-surface-container-low/60 backdrop-blur-xl rounded-[32px] glass-panel shadow-xl flex-1 overflow-hidden flex flex-col"
      >
        <div class="px-gutter pt-gutter pb-4 flex justify-between items-center">
          <span class="font-label-mono text-label-mono text-on-surface-variant uppercase">Observation Log</span>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-primary status-glow-active animate-pulse"></div>
            <span class="font-label-mono text-label-mono text-primary uppercase">Streaming_Live</span>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto custom-scrollbar px-gutter pb-gutter">
          <div class="bg-surface-container-lowest/40 rounded-2xl p-4 border border-white/5 font-label-mono text-label-mono text-on-surface-variant space-y-1.5">
            {#each observationLog as line}
              <p><span class="text-outline">{line.ts}</span> <span class={line.tagClass}>{line.tag}</span> {line.msg}</p>
            {/each}
          </div>
        </div>
      </section>
    </div>

    <!-- Right Column: Conflict Resolution List -->
    <div class="col-span-12 lg:col-span-4 flex flex-col gap-8">
      <section
        class="bg-surface-container-low/60 backdrop-blur-xl rounded-[32px] glass-panel shadow-xl h-full flex flex-col overflow-hidden"
      >
        <div class="p-gutter pb-4">
          <h3 class="font-title-md text-title-md text-on-surface">Action Required</h3>
          <p class="text-on-surface-variant font-body-sm">Human validation required for significant shifts.</p>
        </div>
        <div class="flex-1 overflow-y-auto custom-scrollbar px-gutter space-y-3">
          {#each resolutions as item (item.id)}
            <div
              class="bg-surface-container-lowest/40 rounded-2xl p-4 border transition-colors {selectedResolution === item.id ? 'border-primary/30 bg-surface-container-lowest/60' : 'border-white/5'}"
            >
              <button
                type="button"
                class="w-full text-left"
                onclick={() => (selectedResolution = item.id)}
              >
                <div class="flex justify-between items-start mb-2">
                  <span class="font-label-mono text-label-mono {item.tagClass} rounded-full border border-white/5 px-3 py-1 uppercase">{item.tag}</span>
                  <span class="font-label-mono text-label-mono text-on-surface-variant">{item.id}</span>
                </div>
                <h4 class="font-body-lg font-bold text-on-surface mb-1">{item.title}</h4>
                <p class="font-body-sm text-on-surface-variant mb-4">{item.detail}</p>
              </button>
              <div class="flex gap-2">
                <!-- This is a WRITE proposal → send to Confirm Queue, never execute here -->
                <button
                  type="button"
                  class="flex-1 bg-primary text-on-primary font-bold rounded-xl py-2.5 font-body-sm active:scale-95 hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
                  onclick={() => proposeToQueue(item.title)}
                >Send to Confirm Queue</button>
                <button
                  type="button"
                  aria-label="Dismiss proposal"
                  class="bg-surface-container-high border border-white/10 rounded-xl text-on-surface-variant hover:text-on-surface px-3 py-2.5 active:scale-95 transition-transform"
                  onclick={() => (resolutions = resolutions.filter((r) => r.id !== item.id))}
                >
                  <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          {/each}
        </div>

        <!-- Statistics / Health -->
        <div class="p-gutter">
          <div class="bg-surface-container-lowest/40 rounded-2xl p-4 border border-white/5">
            <div class="flex justify-between items-center mb-2">
              <span class="font-label-mono text-label-mono text-on-surface-variant uppercase">Agent Health</span>
              <span class="font-label-mono text-label-mono text-primary">99.8%</span>
            </div>
            <div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div class="bg-primary h-full w-[99.8%] status-glow-active"></div>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-2">
              <div class="bg-surface-container-high rounded-xl border border-white/5 p-3 text-center">
                <p class="font-label-mono text-label-mono text-on-surface-variant uppercase">Scanned</p>
                <p class="font-body-lg font-bold text-on-surface">1,242</p>
              </div>
              <div class="bg-surface-container-high rounded-xl border border-white/5 p-3 text-center">
                <p class="font-label-mono text-label-mono text-on-surface-variant uppercase">Optimized</p>
                <p class="font-body-lg font-bold text-on-surface">84</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</div>
