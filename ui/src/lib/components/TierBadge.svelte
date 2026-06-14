<script lang="ts">
  import type { Tier } from "../types";
  import { TIER_LABEL } from "../types";

  let { tier }: { tier: Tier } = $props();

  const cls: Record<Tier, string> = {
    ReadOnly: "bg-surface-container-high text-on-surface-variant border-white/5",
    ConfirmRequired: "bg-confirm/10 text-confirm border-confirm/20",
    HighRisk: "bg-error-container/30 text-error border-error/20",
  };
</script>

<span
  class="border rounded-full px-3 py-1 font-label-mono text-[11px] font-bold uppercase tracking-wide {cls[
    tier
  ]}"
>
  {TIER_LABEL[tier]}
</span>
