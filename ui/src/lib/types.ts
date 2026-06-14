// Shared UI types. These mirror the Rust contract (metis-core) closely enough
// that swapping mock data for real `invoke()` results later is a drop-in.

export type Tier = "ReadOnly" | "ConfirmRequired" | "HighRisk";

export type AgentKind = "calendar" | "email" | "files";
export type AgentStatus = "active" | "idle" | "error" | "needs-auth";

export interface AgentInfo {
  kind: AgentKind;
  name: string; // "Calendar Agent"
  codename: string; // "Chronos" — display flourish
  tagline: string; // "Calendar & Scheduling Intelligence"
  label: string; // "CALENDAR_AGENT"
  icon: string; // material symbol name
  status: AgentStatus;
  statusLabel: string; // "Active" | "Idle" | "Mapping"
  accent: "primary" | "tertiary" | "secondary"; // card accent color
  connection: string; // "Google" | "Local"
  lastObservation: string; // timestamp
  nextAction: string; // one-line "next action" summary
  pendingActions: number;
  skills: string[];
}

export interface QueueItem {
  id: string; // "REQ-882"
  agent: AgentKind;
  agentLabel: string; // "EMAIL_AGENT"
  icon: string;
  tier: Tier;
  summary: string; // plain-language description of the action
  // Untrusted content the action would act on (email body, event details…).
  // ALWAYS rendered as text, never as HTML.
  detail: string;
  ts: string;
}

export type LogKind =
  | "Observed"
  | "Proposed"
  | "Approved"
  | "Rejected"
  | "Executed";

export interface LogEntry {
  id: string; // "OBS-5102"
  ts: string; // "14:22:04"
  kind: LogKind;
  agent: string; // "EMAIL_AGENT" | "SYSTEM"
  message: string;
  hash: string; // short sha256 fragment, e.g. "9f3a1c"
}

export const TIER_LABEL: Record<Tier, string> = {
  ReadOnly: "Read-only",
  ConfirmRequired: "Confirm",
  HighRisk: "High-risk",
};
