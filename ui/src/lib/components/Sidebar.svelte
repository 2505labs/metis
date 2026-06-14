<script lang="ts">
  import { currentView, primaryNav, agentNav, type ViewId } from "../nav";

  let active = $state<ViewId>("dashboard");
  currentView.subscribe((v) => (active = v));

  function go(id: ViewId) {
    currentView.set(id);
  }

  const itemBase =
    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-95";
  const itemActive = "bg-secondary-container text-on-secondary-container shadow-inner";
  const itemIdle =
    "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40";
</script>

<aside
  class="w-[280px] h-full fixed left-0 top-0 bg-surface/70 backdrop-blur-3xl shadow-2xl shadow-surface-container-lowest/20 flex flex-col p-gutter glass-panel z-[60]"
>
  <div class="mb-10">
    <h1 class="font-headline-lg text-headline-lg font-bold text-primary">Metis</h1>
    <p class="font-body-sm text-body-sm text-on-surface-variant">System Active</p>
  </div>

  <nav class="flex-1 space-y-2 overflow-y-auto custom-scrollbar -mr-2 pr-2">
    {#each primaryNav as item (item.id)}
      <button
        type="button"
        onclick={() => go(item.id)}
        class="{itemBase} {active === item.id ? itemActive : itemIdle}"
      >
        <span
          class="material-symbols-outlined"
          class:fill={active === item.id}
          style="font-variation-settings: 'FILL' {active === item.id ? 1 : 0};"
          >{item.icon}</span
        >
        <span class="font-title-md text-title-md">{item.label}</span>
      </button>
    {/each}

    <div
      class="px-4 pt-6 pb-1 font-label-mono text-[11px] uppercase tracking-widest text-outline"
    >
      Agent Consoles
    </div>
    {#each agentNav as item (item.id)}
      <button
        type="button"
        onclick={() => go(item.id)}
        class="{itemBase} {active === item.id ? itemActive : itemIdle}"
      >
        <span class="material-symbols-outlined">{item.icon}</span>
        <span class="font-title-md text-title-md">{item.label}</span>
      </button>
    {/each}
  </nav>

  <div class="mt-auto pt-6 border-t border-white/5 space-y-2">
    <button
      type="button"
      onclick={() => go("dashboard")}
      class="w-full mb-2 py-3 bg-primary text-on-primary font-bold rounded-xl active:scale-95 transition-transform shadow-lg shadow-primary/20 hover:scale-[1.02]"
    >
      New Agent
    </button>
    <button
      type="button"
      onclick={() => go("settings")}
      class="w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-colors {active ===
      'settings'
        ? 'text-on-surface'
        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40'}"
    >
      <span class="material-symbols-outlined">settings</span>
      <span class="font-body-lg text-body-lg">Settings</span>
    </button>
  </div>
</aside>
