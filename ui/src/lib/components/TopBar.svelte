<script lang="ts">
  import { currentView } from "../nav";
  import { queue } from "../mock";

  const pending = queue.length;
</script>

<header
  class="h-12 w-full border-b border-outline-variant flex justify-between items-center px-4 bg-surface sticky top-0 z-50 shrink-0"
>
  <div class="flex items-center gap-4 flex-1">
    <div class="relative w-64">
      <span
        class="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline text-[18px]"
        >search</span
      >
      <input
        class="bg-surface-container-low border border-outline-variant text-body-sm px-8 py-1 w-full focus:outline-none focus:border-primary transition-colors"
        placeholder="Search logs or commands..."
        type="text"
      />
    </div>
  </div>
  <div class="flex items-center gap-4">
    <button
      type="button"
      onclick={() => currentView.set("queue")}
      class="flex items-center gap-2 px-3 py-1 bg-primary-container/10 border border-primary/20 text-primary cursor-pointer hover:bg-primary-container/20 transition-all"
    >
      <span class="font-label-caps text-label-caps">Pending Approvals</span>
      <span class="bg-primary text-on-primary text-[10px] px-1.5 font-bold rounded-sm"
        >{pending}</span
      >
    </button>
    <div class="flex items-center gap-3">
      <button
        class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-[20px]"
        >monitor_heart</button
      >
      <button
        class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-[20px] relative"
      >
        notifications
        <span class="absolute top-0 right-0 w-1.5 h-1.5 bg-error rounded-full"></span>
      </button>
    </div>
  </div>
</header>
