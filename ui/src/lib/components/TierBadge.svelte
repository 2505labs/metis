<script lang="ts">
  import type { Tier } from "../types";
  import { TIER_LABEL } from "../types";

  let { tier }: { tier: Tier } = $props();

  const cls: Record<Tier, string> = {
    ReadOnly: "bg-on-surface-variant/10 text-outline border-outline-variant",
    ConfirmRequired: "bg-confirm/10 text-confirm border-confirm/30",
    HighRisk: "bg-error/10 text-error border-error/30",
  };
</script>

<span
  class="border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm {cls[
    tier
  ]}"
>
  {TIER_LABEL[tier]}
</span>
