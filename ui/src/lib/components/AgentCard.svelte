<script lang="ts">
  import type { AgentInfo } from "../types";

  let { agent, onOpen }: { agent: AgentInfo; onOpen?: () => void } = $props();

  const statusColor: Record<string, string> = {
    active: "bg-primary text-primary",
    idle: "bg-outline text-outline",
    error: "bg-error text-error",
    "needs-auth": "bg-confirm text-confirm",
  };
</script>

<div
  class="bg-surface-container border border-outline-variant p-4 flex flex-col gap-3 group hover:border-primary/50 transition-colors"
>
  <div class="flex justify-between items-start">
    <div class="flex items-center gap-2">
      <span class="material-symbols-outlined text-primary">{agent.icon}</span>
      <span class="font-label-caps text-label-caps text-on-surface">{agent.name}</span>
    </div>
    <div class="flex items-center gap-1.5">
      <span
        class="w-1.5 h-1.5 rounded-full {statusColor[agent.status]?.split(' ')[0]}"
        class:animate-pulse={agent.status === "active"}
      ></span>
      <span
        class="text-[10px] uppercase font-bold {statusColor[agent.status]?.split(
          ' ',
        )[1]}">{agent.status}</span
      >
    </div>
  </div>
  <div class="flex flex-col gap-1">
    <div class="text-[10px] text-outline font-label-caps">LAST OBSERVATION</div>
    <div class="font-mono-md text-mono-md text-on-surface">
      {agent.lastObservation}
    </div>
  </div>
  <div class="flex justify-between items-end">
    <div class="flex flex-col">
      <span class="text-[20px] font-bold text-on-surface"
        >{String(agent.pendingActions).padStart(2, "0")}</span
      >
      <span class="text-[10px] text-outline uppercase">Pending Actions</span>
    </div>
    <button
      type="button"
      onclick={onOpen}
      aria-label="Open {agent.name}"
      class="material-symbols-outlined text-outline group-hover:text-primary transition-colors cursor-pointer"
      >open_in_new</button
    >
  </div>
</div>
