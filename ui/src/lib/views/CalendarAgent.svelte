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
      tagClass: "bg-surface-container-highest text-outline",
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

<div class="p-gutter bg-background h-full overflow-y-auto">
  <div class="grid grid-cols-12 gap-gutter h-full">
    <!-- Left Column: Proposed Schedule Optimization -->
    <div class="col-span-12 lg:col-span-8 flex flex-col gap-gutter">
      <div class="bg-surface-container border border-outline-variant p-4 flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="font-headline-sm text-headline-sm text-on-surface">Schedule Optimization</h2>
            <p class="text-body-sm text-on-surface-variant">
              Metis Engine: Analysis of 14 conflict points in the upcoming 72 hours.
            </p>
          </div>
          <div class="flex gap-2">
            <button
              class="px-3 py-1 text-mono-sm border border-outline-variant hover:bg-surface-container-high transition-colors"
              onclick={() => showQueuedNote("Export draft")}
            >EXPORT_JSON</button>
            <!-- Applying the optimization is a WRITE → route to Confirm Queue -->
            <button
              class="px-3 py-1 text-mono-sm bg-primary text-on-primary font-bold transition-colors"
              onclick={() => proposeToQueue("Schedule optimization")}
            >PROPOSE_ALL →</button>
          </div>
        </div>

        {#if queuedNote}
          <div
            class="mb-4 flex items-center gap-2 px-3 py-2 bg-confirm/10 border border-confirm text-confirm text-body-sm rounded-sm"
            role="status"
          >
            <span class="material-symbols-outlined text-[18px]">schedule_send</span>
            <span>{queuedNote} — proposed actions are sent to the Confirm Queue for human approval.</span>
          </div>
        {/if}

        <!-- Side-by-Side Comparison -->
        <div class="grid grid-cols-2 gap-px bg-outline-variant border border-outline-variant rounded-sm overflow-hidden">
          <!-- Current Calendar (observed, read-only) -->
          <div class="bg-surface-container-low p-4">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-label-caps text-outline bg-surface-container-highest px-2 py-0.5 rounded-full uppercase">Current State</span>
              <span class="font-mono-sm text-mono-sm text-error">3 CONFLICTS</span>
            </div>
            <div class="space-y-2">
              {#each currentEvents as ev (ev.id)}
                {#if ev.status === "conflict"}
                  <button
                    type="button"
                    class="w-full text-left bg-error-container/20 border-l-2 border-error p-3"
                    onclick={() => (selectedEvent = ev.id)}
                  >
                    <div class="flex justify-between text-mono-sm text-error mb-1">
                      <span>{ev.start} - {ev.end}</span>
                      <span>CONFLICT</span>
                    </div>
                    <p class="text-body-sm font-semibold">{ev.title}</p>
                    {#if ev.note}
                      <p class="text-[11px] text-on-error-container mt-1">{ev.note}</p>
                    {/if}
                  </button>
                {:else if ev.status === "free"}
                  <div class="bg-surface-container-highest border-l-2 border-outline-variant p-3 opacity-50">
                    <div class="flex justify-between text-mono-sm text-outline mb-1">
                      <span>{ev.start} - {ev.end}</span>
                      <span>FREE</span>
                    </div>
                    <p class="text-body-sm italic">{ev.title}</p>
                  </div>
                {:else}
                  <button
                    type="button"
                    class="w-full text-left bg-surface-container-highest border-l-2 border-outline-variant p-3"
                    onclick={() => (selectedEvent = ev.id)}
                  >
                    <div class="flex justify-between text-mono-sm text-outline mb-1">
                      <span>{ev.start} - {ev.end}</span>
                      <span>CONF_A</span>
                    </div>
                    <p class="text-body-sm font-semibold">{ev.title}</p>
                  </button>
                {/if}
              {/each}
            </div>
          </div>

          <!-- Proposed Calendar (draft only) -->
          <div class="bg-surface-container-low p-4">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-label-caps text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">Proposed (v2.1)</span>
              <span class="font-mono-sm text-mono-sm text-primary">0 CONFLICTS</span>
            </div>
            <div class="space-y-2">
              {#each proposedEvents as ev (ev.id)}
                {#if ev.status === "optimized"}
                  <div class="bg-surface-container-highest border-l-2 border-primary-container p-3">
                    <div class="flex justify-between text-mono-sm text-primary mb-1">
                      <span>{ev.start} - {ev.end}</span>
                      <span>OPTIMIZED</span>
                    </div>
                    <p class="text-body-sm font-semibold">{ev.title}</p>
                  </div>
                {:else if ev.status === "resolved"}
                  <div class="bg-primary/5 border-l-2 border-primary p-3">
                    <div class="flex justify-between text-mono-sm text-primary mb-1">
                      <span>{ev.start} - {ev.end}</span>
                      <span>RESOLVED</span>
                    </div>
                    <p class="text-body-sm font-semibold">{ev.title}</p>
                    {#if ev.note}
                      <div class="flex gap-1 mt-1">
                        <span class="text-[10px] bg-primary/20 text-primary px-1 font-mono-sm">{ev.note}</span>
                      </div>
                    {/if}
                  </div>
                {:else}
                  <div class="bg-primary/5 border-l-2 border-primary p-3">
                    <div class="flex justify-between text-mono-sm text-primary mb-1">
                      <span>{ev.start} - {ev.end}</span>
                      <span>MOVED</span>
                    </div>
                    <p class="text-body-sm font-semibold">{ev.title}</p>
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
            <div class="mt-4 bg-surface-container-low border border-outline-variant p-4 rounded-sm">
              <div class="flex justify-between items-start mb-2">
                <h4 class="text-body-md font-bold">{ev.title}</h4>
                <button
                  class="text-on-surface-variant hover:text-on-surface"
                  aria-label="Close event details"
                  onclick={() => (selectedEvent = null)}
                >
                  <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-body-sm text-on-surface-variant">
                <dt class="text-label-caps text-outline uppercase">Time</dt>
                <dd class="font-mono-sm text-mono-sm">{ev.start} - {ev.end}</dd>
                <dt class="text-label-caps text-outline uppercase">Location</dt>
                <dd>{ev.location}</dd>
                <dt class="text-label-caps text-outline uppercase">Attendees</dt>
                <dd>{ev.attendees.length ? ev.attendees.join(", ") : "—"}</dd>
              </dl>
            </div>
          {/if}
        {/if}
      </div>

      <!-- Observation Log (Bottom) -->
      <div class="bg-surface-container border border-outline-variant flex-1 overflow-hidden flex flex-col">
        <div class="px-4 py-2 border-b border-outline-variant bg-surface-container-high flex justify-between items-center">
          <span class="font-label-caps text-label-caps text-outline uppercase">Observation Log</span>
          <span class="font-mono-sm text-mono-sm text-primary">STREAMING_LIVE</span>
        </div>
        <div class="flex-1 overflow-y-auto p-4 font-mono-sm text-mono-sm text-on-surface-variant space-y-1">
          {#each observationLog as line}
            <p><span class="text-outline">{line.ts}</span> <span class={line.tagClass}>{line.tag}</span> {line.msg}</p>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right Column: Conflict Resolution List -->
    <div class="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
      <div class="bg-surface-container border border-outline-variant h-full flex flex-col">
        <div class="p-4 border-b border-outline-variant">
          <h3 class="font-headline-sm text-headline-sm text-on-surface">Action Required</h3>
          <p class="text-body-sm text-on-surface-variant">Human validation required for significant shifts.</p>
        </div>
        <div class="flex-1 overflow-y-auto">
          {#each resolutions as item (item.id)}
            <div
              class="p-4 border-b border-outline-variant hover:bg-surface-container-high transition-colors {selectedResolution === item.id ? 'bg-surface-container-highest' : ''}"
            >
              <button
                type="button"
                class="w-full text-left"
                onclick={() => (selectedResolution = item.id)}
              >
                <div class="flex justify-between items-start mb-2">
                  <span class="text-label-caps {item.tagClass} px-2 py-0.5 rounded-full uppercase">{item.tag}</span>
                  <span class="font-mono-sm text-mono-sm text-outline">{item.id}</span>
                </div>
                <h4 class="text-body-md font-bold mb-1">{item.title}</h4>
                <p class="text-body-sm text-on-surface-variant mb-4">{item.detail}</p>
              </button>
              <div class="flex gap-2">
                <!-- This is a WRITE proposal → send to Confirm Queue, never execute here -->
                <button
                  type="button"
                  class="flex-1 bg-confirm text-on-primary font-bold py-2 text-body-sm rounded-sm hover:opacity-90 transition-opacity"
                  onclick={() => proposeToQueue(item.title)}
                >Send to Confirm Queue</button>
                <button
                  type="button"
                  aria-label="Dismiss proposal"
                  class="px-3 py-2 border border-outline-variant text-on-surface-variant hover:text-on-surface transition-colors"
                  onclick={() => (resolutions = resolutions.filter((r) => r.id !== item.id))}
                >
                  <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          {/each}
        </div>

        <!-- Statistics / Health -->
        <div class="p-4 bg-surface-container-high border-t border-outline-variant">
          <div class="flex justify-between items-center mb-2">
            <span class="text-label-caps text-outline uppercase">Agent Health</span>
            <span class="text-mono-sm text-primary">99.8%</span>
          </div>
          <div class="w-full bg-outline-variant h-1 rounded-full overflow-hidden">
            <div class="bg-primary h-full w-[99.8%]"></div>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-2">
            <div class="bg-surface p-2 border border-outline-variant text-center">
              <p class="text-label-caps text-outline uppercase">Scanned</p>
              <p class="text-body-md font-bold">1,242</p>
            </div>
            <div class="bg-surface p-2 border border-outline-variant text-center">
              <p class="text-label-caps text-outline uppercase">Optimized</p>
              <p class="text-body-md font-bold">84</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
