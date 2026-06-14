<script lang="ts">
  import { currentView, type ViewId } from "./lib/nav";
  import Sidebar from "./lib/components/Sidebar.svelte";
  import TopBar from "./lib/components/TopBar.svelte";
  import Dashboard from "./lib/views/Dashboard.svelte";
  import ConfirmQueue from "./lib/views/ConfirmQueue.svelte";
  import EventLog from "./lib/views/EventLog.svelte";
  import CalendarAgent from "./lib/views/CalendarAgent.svelte";
  import EmailAgent from "./lib/views/EmailAgent.svelte";
  import FilesAgent from "./lib/views/FilesAgent.svelte";
  import Settings from "./lib/views/Settings.svelte";

  let view = $state<ViewId>("dashboard");
  currentView.subscribe((v) => (view = v));

  const views = {
    dashboard: Dashboard,
    queue: ConfirmQueue,
    log: EventLog,
    calendar: CalendarAgent,
    email: EmailAgent,
    files: FilesAgent,
    settings: Settings,
  };
</script>

<div class="flex h-screen w-full overflow-hidden bg-background text-on-background">
  <Sidebar />
  <div class="flex flex-col flex-1 min-w-0">
    <TopBar />
    <main class="flex-1 overflow-y-auto">
      {#key view}
        {@const Current = views[view]}
        <Current />
      {/key}
    </main>
  </div>
</div>
