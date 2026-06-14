<script lang="ts">
  import { agents } from "../mock";
</script>

<div class="p-6 space-y-6 max-w-3xl">
  <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
    <span class="material-symbols-outlined text-primary">settings</span>
    Settings
  </h2>

  <section class="bg-surface-container border border-outline-variant">
    <div
      class="px-4 py-2 border-b border-outline-variant font-label-caps text-label-caps text-on-surface-variant"
    >
      CONNECTED AGENTS
    </div>
    <div>
      {#each agents as a (a.kind)}
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-outline-variant last:border-0"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">{a.icon}</span>
            <div class="flex flex-col">
              <span class="text-body-md text-on-surface">{a.name}</span>
              <span class="font-mono-sm text-mono-sm text-outline">{a.connection}</span>
            </div>
          </div>
          <span
            class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border border-primary/30 text-primary bg-primary/10"
            >Connected</span
          >
        </div>
      {/each}
    </div>
  </section>

  <section class="bg-surface-container border border-outline-variant">
    <div
      class="px-4 py-2 border-b border-outline-variant font-label-caps text-label-caps text-on-surface-variant"
    >
      LLM BACKEND
    </div>
    <div class="px-4 py-3 flex items-center justify-between">
      <div class="flex flex-col">
        <span class="text-body-md text-on-surface">Active backend</span>
        <span class="font-mono-sm text-mono-sm text-outline"
          >mock:deterministic</span
        >
      </div>
      <span class="font-mono-sm text-mono-sm text-outline"
        >anthropic · ollama (later)</span
      >
    </div>
  </section>

  <p class="font-mono-sm text-mono-sm text-outline">
    UI-first build — settings are display-only until the backend is wired.
  </p>
</div>
