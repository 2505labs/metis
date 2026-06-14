<script lang="ts">
  import { currentView, primaryNav, agentNav, type ViewId } from "../nav";

  let active = $state<ViewId>("dashboard");
  currentView.subscribe((v) => (active = v));

  function go(id: ViewId) {
    currentView.set(id);
  }
</script>

<aside
  class="w-64 h-screen border-r border-outline-variant flex flex-col bg-background shrink-0"
>
  <div class="p-4 mb-2">
    <div class="font-headline-sm text-headline-sm font-bold text-primary">Metis</div>
    <div class="text-[10px] uppercase tracking-widest text-outline">
      v0.1.0-dev
    </div>
  </div>

  <nav class="flex-1 px-2 space-y-1 overflow-y-auto">
    {#each primaryNav as item (item.id)}
      <button
        type="button"
        onclick={() => go(item.id)}
        class="w-full flex items-center gap-3 px-3 py-2 transition-colors duration-150
        {active === item.id
          ? 'text-primary border-r-2 border-primary bg-surface-container-high'
          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}"
      >
        <span class="material-symbols-outlined text-[20px]">{item.icon}</span>
        <span class="font-body-md text-body-md">{item.label}</span>
      </button>
    {/each}

    <div class="px-3 pt-4 pb-1 text-[10px] uppercase tracking-widest text-outline">
      Agents
    </div>
    {#each agentNav as item (item.id)}
      <button
        type="button"
        onclick={() => go(item.id)}
        class="w-full flex items-center gap-3 px-3 py-2 transition-colors duration-150
        {active === item.id
          ? 'text-primary border-r-2 border-primary bg-surface-container-high'
          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}"
      >
        <span class="material-symbols-outlined text-[20px]">{item.icon}</span>
        <span class="font-body-md text-body-md">{item.label}</span>
      </button>
    {/each}
  </nav>

  <div class="mt-auto p-2 border-t border-outline-variant space-y-1">
    <button
      type="button"
      onclick={() => go("settings")}
      class="w-full flex items-center gap-3 px-3 py-2 transition-colors duration-150
      {active === 'settings'
        ? 'text-primary bg-surface-container-high'
        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}"
    >
      <span class="material-symbols-outlined text-[20px]">settings</span>
      <span class="font-body-md text-body-md">Settings</span>
    </button>
    <div class="flex items-center gap-3 px-3 py-4 mt-2">
      <div
        class="w-8 h-8 rounded bg-surface-container-highest border border-outline-variant flex items-center justify-center"
      >
        <span class="material-symbols-outlined text-[18px] text-on-surface-variant"
          >person</span
        >
      </div>
      <div class="flex flex-col">
        <span class="font-label-caps text-label-caps text-on-surface">OPERATOR_01</span>
        <span class="text-[10px] text-outline">STATION_ALPHA</span>
      </div>
    </div>
  </div>
</aside>
