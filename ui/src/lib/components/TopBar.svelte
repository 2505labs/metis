<script lang="ts">
  import { currentView } from "../nav";
  import { queue } from "../mock";

  const pending = queue.length;
</script>

<header
  class="h-16 fixed top-0 right-0 left-[280px] z-50 bg-surface/70 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-margin-page shadow-sm"
>
  <div class="flex items-center flex-1 max-w-xl">
    <div class="relative w-full">
      <span
        class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
        >search</span
      >
      <input
        class="w-full bg-surface-container-low border-none rounded-xl pl-10 pr-4 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder-on-surface-variant/50"
        placeholder="Search system resources..."
        type="text"
      />
    </div>
  </div>
  <div class="flex items-center gap-6 ml-gutter">
    <button
      type="button"
      onclick={() => currentView.set("queue")}
      class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all"
    >
      <span class="material-symbols-outlined text-[18px]">rule_folder</span>
      <span class="font-label-mono text-label-mono">{pending} Pending</span>
    </button>
    <button class="text-on-surface-variant hover:text-primary transition-all relative">
      <span class="material-symbols-outlined">notifications</span>
      <span class="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
    </button>
    <button class="text-on-surface-variant hover:text-primary transition-all">
      <span class="material-symbols-outlined">monitor_heart</span>
    </button>
    <div class="h-8 w-px bg-white/10 mx-1"></div>
    <div class="flex items-center gap-3">
      <div class="text-right hidden sm:block">
        <p class="font-body-sm text-on-surface leading-none">Operator 01</p>
        <p class="text-[10px] text-primary uppercase tracking-widest font-bold">Admin</p>
      </div>
      <div
        class="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-surface-container-high flex items-center justify-center"
      >
        <span class="material-symbols-outlined text-on-surface-variant">person</span>
      </div>
    </div>
  </div>
</header>
