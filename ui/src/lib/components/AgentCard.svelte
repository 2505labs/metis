<script lang="ts">
  import type { AgentInfo } from "../types";

  let { agent, onOpen }: { agent: AgentInfo; onOpen?: () => void } = $props();

  const accent: Record<
    AgentInfo["accent"],
    { iconBg: string; iconText: string; dot: string; glow: string }
  > = {
    primary: {
      iconBg: "bg-primary/10",
      iconText: "text-primary",
      dot: "bg-primary",
      glow: "status-glow-active",
    },
    tertiary: {
      iconBg: "bg-tertiary-container/20",
      iconText: "text-tertiary",
      dot: "bg-tertiary",
      glow: "status-glow-idle",
    },
    secondary: {
      iconBg: "bg-secondary-container/20",
      iconText: "text-secondary",
      dot: "bg-primary",
      glow: "status-glow-active",
    },
  };

  const a = $derived(accent[agent.accent]);
</script>

<div
  class="group relative bg-surface-container-low/60 backdrop-blur-xl rounded-[32px] p-gutter glass-panel flex flex-col hover:bg-surface-container/80 transition-all duration-500 shadow-xl"
>
  <div class="flex justify-between items-start mb-8">
    <div
      class="w-14 h-14 rounded-2xl {a.iconBg} flex items-center justify-center {a.iconText}"
    >
      <span class="material-symbols-outlined text-3xl">{agent.icon}</span>
    </div>
    <div
      class="flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full border border-white/5"
    >
      <div
        class="w-2 h-2 rounded-full {a.dot} {a.glow}"
        class:animate-pulse={agent.status === "active"}
      ></div>
      <span class="font-label-mono text-label-mono text-on-surface uppercase"
        >{agent.statusLabel}</span
      >
    </div>
  </div>

  <h3 class="font-title-md text-title-md text-on-surface mb-1">{agent.codename}</h3>
  <p class="text-on-surface-variant font-body-sm mb-6">{agent.tagline}</p>

  <div class="mt-auto space-y-4">
    <div class="bg-surface-container-lowest/40 rounded-2xl p-4 border border-white/5">
      <p class="font-label-mono text-label-mono text-on-surface-variant mb-1 uppercase">
        Next Action
      </p>
      <p class="font-body-sm text-on-surface">{agent.nextAction}</p>
    </div>
    <div class="flex items-center justify-between px-2">
      <span class="text-on-surface-variant font-body-sm"
        >{agent.pendingActions} pending · {agent.connection}</span
      >
      <button
        type="button"
        onclick={onOpen}
        class="text-primary font-label-mono text-label-mono hover:underline flex items-center gap-1"
      >
        Open
        <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
      </button>
    </div>
  </div>

  <div
    class="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/10 rounded-[32px] transition-all duration-500 pointer-events-none"
  ></div>
</div>
