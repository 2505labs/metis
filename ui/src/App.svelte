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

<div class="min-h-screen bg-background text-on-background relative">
  <Sidebar />
  <TopBar />
  <!-- Atmospheric obsidian glow, bottom-right -->
  <div
    class="fixed bottom-0 right-0 w-1/3 h-2/3 -z-10 opacity-20 pointer-events-none blur-3xl bg-[radial-gradient(circle_at_70%_70%,#3cddc7,transparent_70%)]"
  ></div>

  <main class="ml-[280px] pt-16 min-h-screen relative overflow-hidden">
    {#key view}
      {@const Current = views[view]}
      <Current />
    {/key}
  </main>
</div>
